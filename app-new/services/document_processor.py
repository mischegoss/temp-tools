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
    # KB-specific imports
    GCS_KB_BUCKET_NAME, GCS_KB_ARTICLES_PATH, USE_GCS_KB_STORAGE,
    KB_ARTICLES_FILE, KB_EMBEDDINGS_FILE
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
        
        # ========================================
        # KNOWLEDGE BASE INSTANCE VARIABLES
        # ========================================
        self.kb_embeddings = None
        self.kb_articles = []
        self.kb_loaded = False
        
        # GCS storage initialization for docs
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
        
        # ========================================
        # KB GCS STORAGE INITIALIZATION
        # ========================================
        self.kb_gcs_enabled = USE_GCS_KB_STORAGE
        self.kb_gcs_bucket = None
        if self.kb_gcs_enabled:
            try:
                from google.cloud import storage
                # Reuse client if already created
                if not hasattr(self, 'gcs_client') or self.gcs_client is None:
                    self.gcs_client = storage.Client()
                self.kb_gcs_bucket = self.gcs_client.bucket(GCS_KB_BUCKET_NAME)
                logger.info(f"✅ KB GCS storage initialized: gs://{GCS_KB_BUCKET_NAME}/")
            except Exception as e:
                logger.warning(f"⚠️ KB GCS initialization failed: {e}. KB running in memory-only mode.")
                self.kb_gcs_enabled = False
        
    def initialize(self, shared_model: Optional[SentenceTransformer] = None):
        """
        Initialize the sentence transformer model and load existing data
        
        Args:
            shared_model: Pre-loaded SentenceTransformer model to share (optional)
        """
        try:
            # Use shared model if provided, otherwise load independently
            if shared_model is not None:
                logger.info("Using shared sentence transformer model from main application")
                self.model = shared_model
                self.model_loaded = True
            else:
                logger.info(f"Loading embedding model independently: {EMBEDDING_MODEL}")
                self.model = SentenceTransformer(EMBEDDING_MODEL)
                self.model_loaded = True
            
            # Load ALL docs versions from GCS on startup
            if self.gcs_enabled:
                self.load_all_versions_from_gcs()
            
            # ========================================
            # NEW: Load KB articles from GCS on startup
            # ========================================
            if self.kb_gcs_enabled:
                self.load_kb_from_gcs()
            
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
            "gcs_enabled": self.gcs_enabled,
            # ========================================
            # NEW: KB status fields
            # ========================================
            "kb_loaded": self.kb_loaded,
            "kb_articles_count": len(self.kb_articles),
            "kb_embeddings_count": len(self.kb_embeddings) if self.kb_embeddings is not None else 0,
            "kb_gcs_enabled": self.kb_gcs_enabled
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

    # ========================================
    # KNOWLEDGE BASE METHODS
    # ========================================
    
    def load_kb_from_gcs(self) -> bool:
        """
        Load KB articles and embeddings from GCS bucket.
        
        KB data is stored as:
        - gs://pro-chatbot-kb/articles/kb-articles.json
        - gs://pro-chatbot-kb/articles/kb-embeddings.npy
        
        Returns:
            True if loaded successfully, False otherwise
        """
        if not self.kb_gcs_enabled or self.kb_gcs_bucket is None:
            logger.info("📁 KB GCS storage disabled, starting with empty KB data")
            return False
        
        try:
            logger.info("📥 Loading Knowledge Base articles from GCS...")
            
            articles_blob_name = f"{GCS_KB_ARTICLES_PATH}/{KB_ARTICLES_FILE}"
            embeddings_blob_name = f"{GCS_KB_ARTICLES_PATH}/{KB_EMBEDDINGS_FILE}"
            
            articles_blob = self.kb_gcs_bucket.blob(articles_blob_name)
            embeddings_blob = self.kb_gcs_bucket.blob(embeddings_blob_name)
            
            # Check if KB data exists
            if not articles_blob.exists():
                logger.info("📂 No KB articles found in GCS - starting fresh")
                return False
            
            if not embeddings_blob.exists():
                logger.info("📂 No KB embeddings found in GCS - starting fresh")
                return False
            
            # Load articles JSON
            articles_json = articles_blob.download_as_text()
            kb_data = json.loads(articles_json)
            
            # Handle both formats: raw array or wrapped with metadata
            if isinstance(kb_data, list):
                self.kb_articles = kb_data
            elif isinstance(kb_data, dict) and 'articles' in kb_data:
                self.kb_articles = kb_data['articles']
            else:
                logger.error("❌ Invalid KB articles format in GCS")
                return False
            
            # Load embeddings
            embeddings_bytes = embeddings_blob.download_as_bytes()
            embeddings_buffer = BytesIO(embeddings_bytes)
            self.kb_embeddings = np.load(embeddings_buffer, allow_pickle=False)
            
            # Validate consistency
            if len(self.kb_articles) != len(self.kb_embeddings):
                logger.error(f"❌ KB data mismatch: {len(self.kb_articles)} articles vs {len(self.kb_embeddings)} embeddings")
                self.kb_articles = []
                self.kb_embeddings = None
                return False
            
            self.kb_loaded = True
            logger.info(f"✅ Loaded KB from GCS: {len(self.kb_articles)} articles")
            logger.info(f"   Embeddings shape: {self.kb_embeddings.shape}")
            logger.info(f"   gs://{GCS_KB_BUCKET_NAME}/{articles_blob_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading KB from GCS: {e}")
            self.kb_articles = []
            self.kb_embeddings = None
            self.kb_loaded = False
            return False
    
    def save_kb_to_gcs(self) -> bool:
        """
        Save KB articles and embeddings to GCS bucket.
        
        Saves to:
        - gs://pro-chatbot-kb/articles/kb-articles.json
        - gs://pro-chatbot-kb/articles/kb-embeddings.npy
        
        Returns:
            True if saved successfully, False otherwise
        """
        if not self.kb_gcs_enabled or self.kb_gcs_bucket is None:
            logger.warning("⚠️ KB GCS storage disabled, data not persisted")
            return False
        
        if self.kb_embeddings is None or len(self.kb_articles) == 0:
            logger.warning("⚠️ No KB data to save")
            return False
        
        try:
            logger.info(f"💾 Saving Knowledge Base to GCS...")
            
            # Save articles JSON
            articles_blob_name = f"{GCS_KB_ARTICLES_PATH}/{KB_ARTICLES_FILE}"
            articles_blob = self.kb_gcs_bucket.blob(articles_blob_name)
            articles_json = json.dumps(self.kb_articles, indent=2)
            articles_blob.upload_from_string(articles_json, content_type='application/json')
            
            # Save embeddings
            embeddings_blob_name = f"{GCS_KB_ARTICLES_PATH}/{KB_EMBEDDINGS_FILE}"
            embeddings_blob = self.kb_gcs_bucket.blob(embeddings_blob_name)
            embeddings_buffer = BytesIO()
            np.save(embeddings_buffer, self.kb_embeddings, allow_pickle=False)
            embeddings_buffer.seek(0)
            embeddings_blob.upload_from_file(embeddings_buffer, content_type='application/octet-stream')
            
            logger.info(f"✅ Saved KB to GCS: {len(self.kb_articles)} articles")
            logger.info(f"   Embeddings shape: {self.kb_embeddings.shape}")
            logger.info(f"   gs://{GCS_KB_BUCKET_NAME}/{articles_blob_name}")
            logger.info(f"   gs://{GCS_KB_BUCKET_NAME}/{embeddings_blob_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error saving KB to GCS: {e}")
            return False
    
    def update_with_kb_articles(self, articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process and store KB articles with embeddings.
        
        IMPORTANT: Embeddings are generated from the 'search_text' field,
        NOT the 'content' field. The search_text is optimized for search
        (contains title + first paragraph + keywords).
        
        Args:
            articles: List of KB article dictionaries from Zendesk export
            
        Returns:
            Dict with processing results and statistics
        """
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        if not articles:
            logger.warning("⚠️ No KB articles provided")
            return {
                "success": False,
                "error": "No articles provided",
                "articles_processed": 0
            }
        
        try:
            logger.info(f"📦 Processing {len(articles)} KB articles...")
            
            # Validate required fields
            required_fields = ['id', 'search_text', 'content', 'source_url', 'page_title']
            valid_articles = []
            skipped = 0
            
            for article in articles:
                missing = [f for f in required_fields if not article.get(f)]
                if missing:
                    logger.warning(f"⏭️  Skipping article {article.get('id', 'unknown')}: missing {missing}")
                    skipped += 1
                    continue
                valid_articles.append(article)
            
            if not valid_articles:
                logger.error("❌ No valid KB articles after validation")
                return {
                    "success": False,
                    "error": "No valid articles (all missing required fields)",
                    "articles_processed": 0,
                    "skipped": skipped
                }
            
            logger.info(f"✅ Validated {len(valid_articles)} articles ({skipped} skipped)")
            
            # ========================================
            # CRITICAL: Generate embeddings from search_text, NOT content
            # ========================================
            search_texts = [article['search_text'] for article in valid_articles]
            
            logger.info(f"🔄 Generating embeddings for {len(search_texts)} articles...")
            logger.info(f"   Using 'search_text' field (title + first paragraph + keywords)")
            
            new_embeddings = self.generate_embeddings(search_texts)
            
            logger.info(f"   Embeddings shape: {new_embeddings.shape}")
            logger.info(f"   Sample search_text: {search_texts[0][:150]}...")
            
            # Replace all KB data (full replacement, not append)
            self.kb_embeddings = new_embeddings
            self.kb_articles = valid_articles
            self.kb_loaded = True
            
            logger.info(f"✅ KB data updated: {len(self.kb_articles)} articles in memory")
            
            # Persist to GCS if enabled
            gcs_saved = False
            if self.kb_gcs_enabled:
                gcs_saved = self.save_kb_to_gcs()
                if not gcs_saved:
                    logger.warning("⚠️ KB data updated in memory but GCS save failed")
            
            # Gather statistics
            article_types = {}
            components = set()
            concepts = set()
            
            for article in valid_articles:
                extracted = article.get('metadata', {}).get('extracted', {})
                
                # Count article types
                atype = extracted.get('article_type', 'unknown')
                article_types[atype] = article_types.get(atype, 0) + 1
                
                # Collect components
                for comp in extracted.get('components', []):
                    components.add(comp)
                
                # Collect concepts
                for concept in extracted.get('concepts', []):
                    concepts.add(concept)
            
            return {
                "success": True,
                "articles_processed": len(valid_articles),
                "articles_skipped": skipped,
                "embeddings_shape": list(self.kb_embeddings.shape),
                "gcs_persisted": gcs_saved,
                "statistics": {
                    "article_types": article_types,
                    "unique_components": len(components),
                    "unique_concepts": len(concepts),
                    "components_list": sorted(list(components)),
                    "top_concepts": sorted(list(concepts))[:20]
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to process KB articles: {e}")
            import traceback
            logger.error(traceback.format_exc())
            raise RuntimeError(f"Failed to process KB articles: {e}")

    # ========================================
    # EXISTING DOCS METHODS (UNCHANGED)
    # ========================================

    def update_with_processed_chunks(self, processed_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Update DocumentProcessor with processed chunks and generate embeddings
        CRITICAL: This is what makes uploaded chunks available for search
        FIXED: Now includes page titles and headers in embeddings for better search results
        FIXED: Properly handles version-specific persistence to prevent data loss
        ✅ NEW FIX: Improved version detection from chunks
        """
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        try:
            # ✅ NEW: Detect version from uploaded chunks with improved detection
            upload_version = self._detect_version_from_chunks(processed_chunks)
            logger.info(f"📦 Processing upload for Pro version: {upload_version}")
            
            # ✅ FIXED: Include page title, header, and content in embeddings
            chunk_texts = []
            for chunk in processed_chunks:
                # Build enhanced text for embedding that includes context
                page_title = chunk.get('page_title', '')
                header = chunk.get('header', '')
                content = chunk.get('content', '')
                
                # Combine title, header, and content for better semantic matching
                enhanced_text_parts = []
                if page_title:
                    enhanced_text_parts.append(page_title)
                if header and header != page_title:  # Avoid duplication
                    enhanced_text_parts.append(header)
                if content:
                    enhanced_text_parts.append(content)
                
                # Join with separator for clear context boundaries
                enhanced_text = ' | '.join(enhanced_text_parts)
                chunk_texts.append(enhanced_text)
            
            # Generate embeddings for new chunks with enhanced context
            logger.info(f"🔄 Generating embeddings for {len(chunk_texts)} chunks (with titles & headers)...")
            new_embeddings = self.generate_embeddings(chunk_texts)
            
            # Log embedding quality metrics
            logger.info(f"  - New embeddings shape: {new_embeddings.shape}")
            logger.info(f"  - Embedding dimension: {new_embeddings.shape[1]}")
            logger.info(f"  - Enhanced text sample (first chunk): {chunk_texts[0][:200]}...")
            
            # ✅ CRITICAL FIX: REPLACE version data instead of appending
            # This prevents duplicate data accumulation
            if self.embeddings is None:
                # First upload ever
                self.embeddings = new_embeddings
                self.chunk_data = processed_chunks.copy()
                logger.info(f"✅ Initial data loaded: {len(self.chunk_data)} chunks")
                logger.info(f"   - Embeddings shape: {self.embeddings.shape}")
                logger.info(f"   - Context-enhanced embeddings (titles + headers + content)")
            else:
                # Remove old data for this version, keep other versions
                logger.info(f"🔄 Replacing existing {upload_version} data in memory...")
                
                # Separate chunks by version
                other_version_chunks = []
                other_version_indices = []
                
                for idx, chunk in enumerate(self.chunk_data):
                    # ✅ IMPROVED: Use the same detection logic for existing chunks
                    chunk_version = self._get_chunk_version(chunk)
                    if chunk_version != upload_version:
                        other_version_chunks.append(chunk)
                        other_version_indices.append(idx)
                
                # Build new combined data (other versions + new upload)
                if other_version_indices:
                    other_version_embeddings = self.embeddings[other_version_indices]
                    self.embeddings = np.vstack([other_version_embeddings, new_embeddings])
                    self.chunk_data = other_version_chunks + processed_chunks
                    logger.info(f"✅ Replaced {upload_version} data, kept {len(other_version_chunks)} chunks from other versions")
                else:
                    # No other versions, just use new data
                    self.embeddings = new_embeddings
                    self.chunk_data = processed_chunks.copy()
                    logger.info(f"✅ Replaced all data with {upload_version} (no other versions present)")
                
                logger.info(f"   - Total chunks now: {len(self.chunk_data)}")
                logger.info(f"   - Embeddings shape: {self.embeddings.shape}")
            
            # ✅ CRITICAL FIX: Save the NEW embeddings for THIS VERSION to version-specific GCS file
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
        Clean version string to normalized format (8-0, 7-9, 7-8)
        
        Handles formats like:
        - "production-8-0-only" -> "8-0"
        - "production-7-9-only" -> "7-9"
        - "8-0" -> "8-0"
        - "8.0" -> "8-0"
        """
        if not version:
            return None
        
        # Remove common prefixes and suffixes
        cleaned = version.replace('production-', '').replace('-only', '').strip()
        
        # Convert dots to dashes
        cleaned = cleaned.replace('.', '-')
        
        # Validate format
        if cleaned in ['8-0', '7-9', '7-8']:
            return cleaned
        
        return None
    
    def _get_chunk_version(self, chunk: Dict[str, Any]) -> str:
        """
        Extract and clean version from a single chunk
        
        Args:
            chunk: Chunk dictionary
            
        Returns:
            Cleaned version string (e.g., "8-0", "7-9", "7-8")
        """
        metadata = chunk.get('metadata', {})
        
        # Try multiple version fields in order of preference
        version_candidates = [
            metadata.get('version'),
            metadata.get('pro_version'),
            metadata.get('version_full'),
            metadata.get('version_dotted'),
        ]
        
        # Try to clean each candidate
        for candidate in version_candidates:
            if candidate:
                cleaned = self._clean_version_string(str(candidate))
                if cleaned:
                    return cleaned
        
        # Default to 8-0 if nothing found
        return "8-0"
    
    def _detect_version_from_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Detect Pro version from uploaded chunks with improved cleaning
        
        Args:
            chunks: List of processed chunks
            
        Returns:
            Version string (e.g., "8-0", "7-9", "7-8")
        """
        if not chunks:
            logger.warning("⚠️ No chunks provided for version detection, defaulting to 8-0")
            return "8-0"
        
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
        logger.warning("⚠️ Could not detect version from chunks, defaulting to 8-0")
        return "8-0"
    
    def load_all_versions_from_gcs(self) -> bool:
        """
        Load ALL Pro versions from GCS on startup and combine them
        
        Returns:
            True if any data loaded successfully, False otherwise
        """
        if not self.gcs_enabled:
            logger.info("📁 GCS storage disabled, starting with empty data")
            return False
        
        try:
            logger.info("📥 Loading all Pro versions from GCS...")
            
            # Try to load each version
            versions_to_load = ["8-0", "7-9", "7-8"]
            all_embeddings = []
            all_chunks = []
            loaded_versions = []
            
            for version in versions_to_load:
                embeddings_blob_name = f"{GCS_EMBEDDINGS_PATH}/embeddings-{version}.npy"
                chunks_blob_name = f"{GCS_CHUNKS_PATH}/chunks-{version}.json"
                
                embeddings_blob = self.gcs_bucket.blob(embeddings_blob_name)
                chunks_blob = self.gcs_bucket.blob(chunks_blob_name)
                
                # Check if this version exists
                if embeddings_blob.exists() and chunks_blob.exists():
                    try:
                        # Load embeddings
                        embeddings_bytes = embeddings_blob.download_as_bytes()
                        embeddings_buffer = BytesIO(embeddings_bytes)
                        version_embeddings = np.load(embeddings_buffer, allow_pickle=False)
                        
                        # Load chunks
                        chunks_json = chunks_blob.download_as_text()
                        version_chunks = json.loads(chunks_json)
                        
                        # Accumulate
                        all_embeddings.append(version_embeddings)
                        all_chunks.extend(version_chunks)
                        loaded_versions.append(version)
                        
                        logger.info(f"  ✅ Loaded version {version}: {len(version_chunks)} chunks")
                        
                    except Exception as e:
                        logger.warning(f"  ⚠️ Failed to load version {version}: {e}")
                else:
                    logger.info(f"  📂 No data found for version {version}")
            
            # Combine all loaded versions
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
            # Don't crash - start with empty data
            self.embeddings = None
            self.chunk_data = []
            return False
    
    def save_version_to_gcs(self, version_embeddings: np.ndarray, version_chunks: List[Dict], version: str) -> bool:
        """
        Save a SPECIFIC Pro version to its own GCS files
        
        Args:
            version_embeddings: Embeddings for this version only
            version_chunks: Chunks for this version only
            version: Pro version (e.g., "8-0", "7-9", "7-8")
            
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
            logger.info(f"💾 Saving Pro version {version} to GCS...")
            
            # Save embeddings for this version
            embeddings_blob_name = f"{GCS_EMBEDDINGS_PATH}/embeddings-{version}.npy"
            embeddings_blob = self.gcs_bucket.blob(embeddings_blob_name)
            
            # Convert numpy array to bytes
            embeddings_buffer = BytesIO()
            np.save(embeddings_buffer, version_embeddings, allow_pickle=False)
            embeddings_buffer.seek(0)
            embeddings_blob.upload_from_file(embeddings_buffer, content_type='application/octet-stream')
            
            # Save chunks for this version
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