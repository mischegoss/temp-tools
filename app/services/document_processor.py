import json
import numpy as np
import hashlib
import os
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sentence_transformers import SentenceTransformer
import logging
from io import BytesIO

from app.config import (
    EMBEDDING_MODEL, EMBEDDING_DIMENSION, USE_GCS_STORAGE, 
    GCS_BUCKET_NAME, GCS_EMBEDDINGS_PATH, GCS_CHUNKS_PATH,
    EXPRESS_DEFAULT_VERSION, EXPRESS_SUPPORTED_VERSIONS
)

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.model = None
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.page_mappings = {}
        self.documentation_stats = {}
        self.model_loaded = False
        
        # GCS storage initialization
        self.gcs_storage = None
        self.gcs_enabled = USE_GCS_STORAGE
        if self.gcs_enabled:
            try:
                from google.cloud import storage
                self.gcs_client = storage.Client()
                self.gcs_bucket = self.gcs_client.bucket(GCS_BUCKET_NAME)
                logger.info(f"✅ GCS storage initialized: gs://{GCS_BUCKET_NAME}/")
            except Exception as e:
                logger.warning(f"⚠️ GCS initialization failed: {e}. Running in memory-only mode.")
                self.gcs_enabled = False
        
    def initialize(self, shared_model: Optional[SentenceTransformer] = None):
        """
        Initialize the sentence transformer model and load existing data
        
        Args:
            shared_model: Pre-loaded SentenceTransformer model to share (optional)
        """
        try:
            if shared_model is not None:
                logger.info("Using shared sentence transformer model from main application")
                self.model = shared_model
                self.model_loaded = True
            else:
                logger.info(f"Loading embedding model independently: {EMBEDDING_MODEL}")
                self.model = SentenceTransformer(EMBEDDING_MODEL)
                self.model_loaded = True
            
            # Load ALL versions from GCS on startup
            if self.gcs_enabled:
                self.load_all_versions_from_gcs()
            
            logger.info("✅ Document processor initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize document processor: {e}")
            raise
    
    def get_status(self) -> Dict[str, Any]:
        """Get document processor status"""
        return {
            "ready": self.model_loaded,
            "model_loaded": self.model_loaded,
            "chunks_count": len(self.chunk_data),
            "embeddings_count": len(self.embeddings) if self.embeddings is not None else 0,
            "metadata_count": len(self.metadata),
            "gcs_enabled": self.gcs_enabled
        }
    
    def compute_content_hash(self, content: str) -> str:
        """Compute SHA-256 hash of content for change detection"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        try:
            embeddings = self.model.encode(texts, convert_to_tensor=False)
            return np.array(embeddings)
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise

    def update_with_processed_chunks(self, processed_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Update DocumentProcessor with processed chunks and generate embeddings
        """
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        try:
            # Detect version from uploaded chunks
            upload_version = self._detect_version_from_chunks(processed_chunks)
            logger.info(f"📦 Processing upload for Express version: {upload_version}")
            
            # Include page title, header, and content in embeddings
            chunk_texts = []
            for chunk in processed_chunks:
                page_title = chunk.get('page_title', '')
                header = chunk.get('header', '')
                content = chunk.get('content', '')
                
                enhanced_text_parts = []
                if page_title:
                    enhanced_text_parts.append(page_title)
                if header and header != page_title:
                    enhanced_text_parts.append(header)
                if content:
                    enhanced_text_parts.append(content)
                
                enhanced_text = ' | '.join(enhanced_text_parts)
                chunk_texts.append(enhanced_text)
            
            logger.info(f"🔄 Generating embeddings for {len(chunk_texts)} chunks (with titles & headers)...")
            new_embeddings = self.generate_embeddings(chunk_texts)
            
            logger.info(f"  - New embeddings shape: {new_embeddings.shape}")
            logger.info(f"  - Embedding dimension: {new_embeddings.shape[1]}")
            logger.info(f"  - Enhanced text sample (first chunk): {chunk_texts[0][:200]}...")
            
            # REPLACE version data instead of appending
            if self.embeddings is None:
                self.embeddings = new_embeddings
                self.chunk_data = processed_chunks.copy()
                logger.info(f"✅ Initial data loaded: {len(self.chunk_data)} chunks")
                logger.info(f"   - Embeddings shape: {self.embeddings.shape}")
                logger.info(f"   - Context-enhanced embeddings (titles + headers + content)")
            else:
                logger.info(f"🔄 Replacing existing {upload_version} data in memory...")
                
                other_version_chunks = []
                other_version_indices = []
                
                for idx, chunk in enumerate(self.chunk_data):
                    chunk_version = self._get_chunk_version(chunk)
                    if chunk_version != upload_version:
                        other_version_chunks.append(chunk)
                        other_version_indices.append(idx)
                
                if other_version_indices:
                    other_version_embeddings = self.embeddings[other_version_indices]
                    self.embeddings = np.vstack([other_version_embeddings, new_embeddings])
                    self.chunk_data = other_version_chunks + processed_chunks
                    logger.info(f"✅ Replaced {upload_version} data, kept {len(other_version_chunks)} chunks from other versions")
                else:
                    self.embeddings = new_embeddings
                    self.chunk_data = processed_chunks.copy()
                    logger.info(f"✅ Replaced all data with {upload_version} (no other versions present)")
                
                logger.info(f"   - Total chunks now: {len(self.chunk_data)}")
                logger.info(f"   - Embeddings shape: {self.embeddings.shape}")
            
            # Save to GCS
            if self.gcs_enabled:
                gcs_save_success = self.save_version_to_gcs(new_embeddings, processed_chunks, upload_version)
                if not gcs_save_success:
                    logger.warning(f"⚠️ Version {upload_version} data updated in memory but GCS save failed")
            
            return {
                "success": True,
                "total_chunks": len(self.chunk_data),
                "new_chunks_added": len(processed_chunks),
                "embeddings_shape": self.embeddings.shape if self.embeddings is not None else None,
                "enhanced_embeddings": True,
                "embedding_strategy": "title + header + content",
                "gcs_persisted": self.gcs_enabled,
                "version": upload_version,
                "version_replacement": "old data replaced, not appended"
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to update DocumentProcessor: {e}")
            import traceback
            logger.error(traceback.format_exc())
            raise RuntimeError(f"Failed to update document processor: {e}")
    
    # ========================================
    # VERSION-AWARE GCS PERSISTENCE METHODS
    # ========================================
    
    def _clean_version_string(self, version: str) -> str:
        """
        Clean version string to normalized format for Express
        
        Handles formats like:
        - "production-on-premise-2-5-only" -> "on-premise-2-5"
        - "On-Premise 2.5" -> "on-premise-2-5"
        - "on-premise-2-5" -> "on-premise-2-5"
        - "2.5" -> "on-premise-2-5"
        - "2-5" -> "on-premise-2-5"
        """
        if not version:
            return None
        
        # Remove common prefixes and suffixes
        cleaned = version.replace('production-', '').replace('-only', '').strip()
        
        # Handle display format "On-Premise 2.5" -> "on-premise-2-5"
        cleaned = cleaned.lower().replace(' ', '-').replace('.', '-')
        
        # Handle shorthand versions like "2-5" -> "on-premise-2-5"
        if cleaned in ['2-5', '2-4', '2-1']:
            cleaned = f"on-premise-{cleaned}"
        
        # Validate format against supported Express versions
        if cleaned in ['on-premise-2-5', 'on-premise-2-4', 'on-premise-2-1']:
            return cleaned
        
        return None
    
    def _get_chunk_version(self, chunk: Dict[str, Any]) -> str:
        """
        Extract and clean version from a single chunk
        
        Args:
            chunk: Chunk dictionary
            
        Returns:
            Cleaned version string (e.g., "on-premise-2-5")
        """
        metadata = chunk.get('metadata', {})
        
        # Try multiple version fields in order of preference
        version_candidates = [
            metadata.get('version'),
            metadata.get('express_version'),
            metadata.get('version_full'),
            metadata.get('version_dotted'),
        ]
        
        # Try to clean each candidate
        for candidate in version_candidates:
            if candidate:
                cleaned = self._clean_version_string(str(candidate))
                if cleaned:
                    return cleaned
        
        # Default to Express default version if nothing found
        return EXPRESS_DEFAULT_VERSION
    
    def _detect_version_from_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Detect Express version from uploaded chunks
        
        Args:
            chunks: List of processed chunks
            
        Returns:
            Version string (e.g., "on-premise-2-5")
        """
        if not chunks:
            logger.warning(f"⚠️ No chunks provided for version detection, defaulting to {EXPRESS_DEFAULT_VERSION}")
            return EXPRESS_DEFAULT_VERSION
        
        # Check first 10 chunks to find version
        check_count = min(10, len(chunks))
        version_counts = {}
        
        for chunk in chunks[:check_count]:
            version = self._get_chunk_version(chunk)
            version_counts[version] = version_counts.get(version, 0) + 1
        
        # Return the most common version
        if version_counts:
            detected_version = max(version_counts, key=version_counts.get)
            logger.info(f"🔍 Detected version '{detected_version}' from {check_count} chunks: {version_counts}")
            return detected_version
        
        # Default to current version if not detected
        logger.warning(f"⚠️ Could not detect version from chunks, defaulting to {EXPRESS_DEFAULT_VERSION}")
        return EXPRESS_DEFAULT_VERSION
    
    def load_all_versions_from_gcs(self) -> bool:
        """
        Load ALL Express versions from GCS on startup and combine them
        
        Returns:
            True if any data loaded successfully, False otherwise
        """
        if not self.gcs_enabled:
            logger.info("📁 GCS storage disabled, starting with empty data")
            return False
        
        try:
            logger.info("📥 Loading all Express versions from GCS...")
            
            # Express versions to load
            versions_to_load = ["on-premise-2-5", "on-premise-2-4", "on-premise-2-1"]
            all_embeddings = []
            all_chunks = []
            loaded_versions = []
            
            for version in versions_to_load:
                embeddings_blob_name = f"{GCS_EMBEDDINGS_PATH}/embeddings-{version}.npy"
                chunks_blob_name = f"{GCS_CHUNKS_PATH}/chunks-{version}.json"
                
                embeddings_blob = self.gcs_bucket.blob(embeddings_blob_name)
                chunks_blob = self.gcs_bucket.blob(chunks_blob_name)
                
                if embeddings_blob.exists() and chunks_blob.exists():
                    try:
                        embeddings_bytes = embeddings_blob.download_as_bytes()
                        embeddings_buffer = BytesIO(embeddings_bytes)
                        version_embeddings = np.load(embeddings_buffer, allow_pickle=False)
                        
                        chunks_json = chunks_blob.download_as_text()
                        version_chunks = json.loads(chunks_json)
                        
                        all_embeddings.append(version_embeddings)
                        all_chunks.extend(version_chunks)
                        loaded_versions.append(version)
                        
                        logger.info(f"  ✅ Loaded version {version}: {len(version_chunks)} chunks")
                        
                    except Exception as e:
                        logger.warning(f"  ⚠️ Failed to load version {version}: {e}")
                else:
                    logger.info(f"  📂 No data found for version {version}")
            
            if all_embeddings:
                self.embeddings = np.vstack(all_embeddings)
                self.chunk_data = all_chunks
                logger.info(f"✅ Loaded from GCS: {len(loaded_versions)} versions, {len(self.chunk_data)} total chunks")
                logger.info(f"   Versions loaded: {', '.join(loaded_versions)}")
                logger.info(f"   Combined embeddings shape: {self.embeddings.shape}")
                return True
            else:
                logger.info("📂 No existing data found in GCS for any version")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error loading versions from GCS: {e}")
            self.embeddings = None
            self.chunk_data = []
            return False
    
    def save_version_to_gcs(self, version_embeddings: np.ndarray, version_chunks: List[Dict], version: str) -> bool:
        """
        Save a SPECIFIC Express version to its own GCS files
        
        Args:
            version_embeddings: Embeddings for this version only
            version_chunks: Chunks for this version only
            version: Express version (e.g., "on-premise-2-5")
            
        Returns:
            True if saved successfully, False otherwise
        """
        if not self.gcs_enabled:
            logger.warning("⚠️ GCS storage disabled, data not persisted")
            return False
        
        if version_embeddings is None or len(version_chunks) == 0:
            logger.warning(f"⚠️ No data to save for version {version}")
            return False
        
        try:
            logger.info(f"💾 Saving Express version {version} to GCS...")
            
            embeddings_blob_name = f"{GCS_EMBEDDINGS_PATH}/embeddings-{version}.npy"
            embeddings_blob = self.gcs_bucket.blob(embeddings_blob_name)
            
            embeddings_buffer = BytesIO()
            np.save(embeddings_buffer, version_embeddings, allow_pickle=False)
            embeddings_buffer.seek(0)
            embeddings_blob.upload_from_file(embeddings_buffer, content_type='application/octet-stream')
            
            chunks_blob_name = f"{GCS_CHUNKS_PATH}/chunks-{version}.json"
            chunks_blob = self.gcs_bucket.blob(chunks_blob_name)
            chunks_json = json.dumps(version_chunks, indent=2)
            chunks_blob.upload_from_string(chunks_json, content_type='application/json')
            
            logger.info(f"✅ Saved version {version} to GCS: {len(version_chunks)} chunks, embeddings shape {version_embeddings.shape}")
            logger.info(f"   gs://{GCS_BUCKET_NAME}/{embeddings_blob_name}")
            logger.info(f"   gs://{GCS_BUCKET_NAME}/{chunks_blob_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error saving version {version} to GCS: {e}")
            return False