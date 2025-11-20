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
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.page_mappings = {}
        self.documentation_stats = {}
        self.model_loaded = False
        
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
            "metadata_count": len(self.metadata)
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
        CRITICAL: This is what makes uploaded chunks available for search
        """
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        try:
            # Extract content for embedding generation
            chunk_texts = [chunk.get('content', '') for chunk in processed_chunks]
            
            # Generate embeddings for new chunks
            logger.info(f"🔄 Generating embeddings for {len(chunk_texts)} chunks...")
            new_embeddings = self.generate_embeddings(chunk_texts)
            
            # Update stored data
            if self.embeddings is None:
                # First upload
                self.embeddings = new_embeddings
                self.chunk_data = processed_chunks.copy()
                logger.info(f"✅ Initial data loaded: {len(self.chunk_data)} chunks")
            else:
                # Append to existing data
                self.embeddings = np.vstack([self.embeddings, new_embeddings])
                self.chunk_data.extend(processed_chunks)
                logger.info(f"✅ Data appended: {len(self.chunk_data)} total chunks")
            
            return {
                "success": True,
                "total_chunks": len(self.chunk_data),
                "new_chunks_added": len(processed_chunks),
                "embeddings_shape": self.embeddings.shape if self.embeddings is not None else None
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to update DocumentProcessor: {e}")
            raise RuntimeError(f"Failed to update document processor: {e}")