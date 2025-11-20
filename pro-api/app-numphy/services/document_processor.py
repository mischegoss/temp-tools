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
        FIXED: Now includes page titles and headers in embeddings for better search results
        """
        if not self.model_loaded:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        try:
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
            
            # Update stored data
            if self.embeddings is None:
                # First upload
                self.embeddings = new_embeddings
                self.chunk_data = processed_chunks.copy()
                logger.info(f"✅ Initial data loaded: {len(self.chunk_data)} chunks")
                logger.info(f"   - Embeddings shape: {self.embeddings.shape}")
                logger.info(f"   - Context-enhanced embeddings (titles + headers + content)")
            else:
                # Append to existing data
                old_count = len(self.chunk_data)
                self.embeddings = np.vstack([self.embeddings, new_embeddings])
                self.chunk_data.extend(processed_chunks)
                logger.info(f"✅ Data appended: {old_count} → {len(self.chunk_data)} total chunks")
                logger.info(f"   - Embeddings shape: {self.embeddings.shape}")
            
            return {
                "success": True,
                "total_chunks": len(self.chunk_data),
                "new_chunks_added": len(processed_chunks),
                "embeddings_shape": self.embeddings.shape if self.embeddings is not None else None,
                "enhanced_embeddings": True,
                "embedding_strategy": "title + header + content"
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to update DocumentProcessor: {e}")
            import traceback
            logger.error(traceback.format_exc())
            raise RuntimeError(f"Failed to update document processor: {e}")