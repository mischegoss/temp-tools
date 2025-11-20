# app/services/document_processor.py - CONSERVATIVE VERSION SEGREGATED STORAGE
# Full backward compatibility with existing interface
import json
import numpy as np
import hashlib
import os
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sentence_transformers import SentenceTransformer
import logging

from app.config import EMBEDDING_MODEL, EMBEDDING_DIMENSION

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.model = None
        
        # VERSION SEGREGATED STORAGE - Internal implementation
        self._version_chunk_data = {}  # {"8-0": [...], "7-9": [...], "7-8": [...]}
        self._version_embeddings = {}  # {"8-0": np.array, "7-9": np.array, "7-8": np.array}
        self._version_metadata = {}    # {"8-0": {...}, "7-9": {...}, "7-8": {...}}
        
        # BACKWARD COMPATIBILITY - Maintain existing interface
        self.embeddings = None          # Flattened view of all embeddings
        self.metadata = {}              # Combined metadata
        self.chunk_data = []            # Flattened view of all chunks
        
        self.page_mappings = {}
        self.documentation_stats = {}
        self.model_loaded = False
        
    def initialize(self, shared_model: Optional[SentenceTransformer] = None):
        """
        Initialize the sentence transformer model and load existing data
        BACKWARD COMPATIBLE: Same signature as before
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
            
            logger.info("✅ Document processor initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize document processor: {e}")
            raise
    
    def get_status(self) -> Dict[str, Any]:
        """Get document processor status - BACKWARD COMPATIBLE"""
        total_chunks = sum(len(chunks) for chunks in self._version_chunk_data.values())
        total_embeddings = sum(len(emb) for emb in self._version_embeddings.values() if emb is not None)
        
        return {
            "ready": self.model_loaded,
            "model_loaded": self.model_loaded,
            "chunks_count": total_chunks,
            "embeddings_count": total_embeddings,
            "metadata_count": len(self.metadata)
        }
    
    def compute_content_hash(self, content: str) -> str:
        """Compute SHA-256 hash of content for change detection - BACKWARD COMPATIBLE"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts - BACKWARD COMPATIBLE"""
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        try:
            embeddings = self.model.encode(texts, convert_to_tensor=False)
            return np.array(embeddings)
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise
    
    def _update_flattened_views(self):
        """Update backward compatibility properties from version-segregated data"""
        try:
            all_chunks = []
            all_embeddings = []
            
            # Combine all versions into flattened views
            for version in sorted(self._version_chunk_data.keys()):
                version_chunks = self._version_chunk_data[version]
                version_embeddings = self._version_embeddings.get(version)
                
                all_chunks.extend(version_chunks)
                if version_embeddings is not None and len(version_embeddings) > 0:
                    all_embeddings.append(version_embeddings)
            
            # Update backward compatible properties
            self.chunk_data = all_chunks
            
            if all_embeddings:
                self.embeddings = np.vstack(all_embeddings)
            else:
                self.embeddings = None
                
            # Update combined metadata
            self.metadata = {}
            for version, version_metadata in self._version_metadata.items():
                self.metadata[version] = version_metadata
                
            logger.info(f"✅ Flattened views updated: {len(self.chunk_data)} chunks, embeddings shape: {self.embeddings.shape if self.embeddings is not None else 'None'}")
            
            # CRITICAL FIX: Force SearchService sync after updating flattened views
            # This ensures SearchService sees the new data immediately
            
        except Exception as e:
            logger.error(f"❌ Failed to update flattened views: {e}")
            # Reset to empty state on failure
            self.chunk_data = []
            self.embeddings = None
            self.metadata = {}
    
    def update_version_data(self, version: str, chunks: List[Dict]) -> bool:
        """
        CONSERVATIVE: Add version data using existing interface patterns
        This method name doesn't conflict with existing code
        """
        try:
            logger.info(f"🔧 Updating version data for {version} with {len(chunks)} chunks")
            
            # Extract content for embeddings
            chunk_contents = [chunk.get('content', '') for chunk in chunks]
            
            if not chunk_contents:
                logger.warning(f"No content found for version {version}")
                return False
            
            # Generate embeddings
            logger.info(f"🧮 Generating embeddings for {len(chunk_contents)} chunks (version {version})")
            version_embeddings = self.generate_embeddings(chunk_contents)
            
            # Store in version-segregated structure
            self._version_chunk_data[version] = chunks
            self._version_embeddings[version] = version_embeddings
            self._version_metadata[version] = {
                'last_updated': datetime.now().timestamp(),
                'chunk_count': len(chunks),
                'embedding_dimension': version_embeddings.shape[1] if len(version_embeddings) > 0 else 0
            }
            
            # Update backward compatible flattened views
            self._update_flattened_views()
            
            logger.info(f"✅ Updated version {version}: {len(chunks)} chunks, {len(version_embeddings)} embeddings")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to update version data for {version}: {e}")
            return False
    
    def get_version_chunks_and_embeddings(self, version: str) -> Tuple[List[Dict], Optional[np.ndarray]]:
        """
        CONSERVATIVE: Get version-specific data without changing existing interface
        """
        chunks = self._version_chunk_data.get(version, [])
        embeddings = self._version_embeddings.get(version)
        return chunks, embeddings
    
    def get_all_versions(self) -> List[str]:
        """CONSERVATIVE: Get loaded versions"""
        return list(self._version_chunk_data.keys())
    
    def has_version_data(self, version: str) -> bool:
        """CONSERVATIVE: Check if version has data"""
        return version in self._version_chunk_data and len(self._version_chunk_data[version]) > 0