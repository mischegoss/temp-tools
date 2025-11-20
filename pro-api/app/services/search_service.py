import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging
from sklearn.metrics.pairwise import cosine_similarity

from app.config import EMBEDDING_MODEL, MAX_SEARCH_RESULTS, SIMILARITY_THRESHOLD
from app.models.search import SearchRequest

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, document_processor=None):
        self.document_processor = document_processor
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.ready = False
        
    def initialize(self):
        """Initialize the search service"""
        try:
            if self.document_processor:
                self.embeddings = self.document_processor.embeddings
                self.metadata = self.document_processor.metadata
                self.chunk_data = self.document_processor.chunk_data
            
            # For initial setup, the service is considered ready even without data
            self.ready = True
            logger.info("✅ Search service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize search service: {e}")
            self.ready = False
            raise
    
    def get_status(self) -> Dict[str, Any]:
        """Get search service status"""
        return {
            "ready": self.ready,
            "embeddings_available": self.embeddings is not None,
            "chunks_count": len(self.chunk_data),
            "can_search": self.ready and self.embeddings is not None
        }
    
    def get_search_stats(self) -> Dict[str, Any]:
        """Get search statistics"""
        return {
            "ready": self.ready,
            "total_chunks": len(self.chunk_data),
            "has_embeddings": self.embeddings is not None
        }
    
    def search(self, request: SearchRequest) -> Dict[str, Any]:
        """
        Search for relevant chunks
        For now, returns empty results when no data is available
        """
        try:
            if not self.embeddings or len(self.chunk_data) == 0:
                logger.warning("No search data available - returning empty results")
                return {
                    "results": [],
                    "total_found": 0,
                    "processing_time": 0.0,
                    "message": "No documentation data available. Please upload documentation first."
                }
            
            # Generate embedding for query
            if not self.document_processor or not self.document_processor.model_loaded:
                raise RuntimeError("Document processor not available for query embedding")
            
            query_embedding = self.document_processor.generate_embeddings([request.query])[0]
            
            # Compute similarities
            similarities = cosine_similarity([query_embedding], self.embeddings)[0]
            
            # Get top results
            top_indices = np.argsort(similarities)[::-1][:request.max_results]
            
            results = []
            for idx in top_indices:
                if similarities[idx] >= SIMILARITY_THRESHOLD:
                    chunk = self.chunk_data[idx] if idx < len(self.chunk_data) else {}
                    results.append({
                        "content": chunk.get("content", ""),
                        "source": chunk.get("source_url", f"Pro Documentation"),  # ✅ FIXED: source_url
                        "source_url": chunk.get("source_url", ""),  # ✅ ADDED: explicit URL field
                        "page_title": chunk.get("page_title", ""),  # ✅ ADDED: page title
                        "score": float(similarities[idx]),
                        "metadata": chunk.get("metadata", {})
                    })
            
            return {
                "results": results,
                "total_found": len(results),
                "processing_time": 0.1
            }
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return {
                "results": [],
                "total_found": 0,
                "processing_time": 0.0,
                "error": str(e)
            }
    
    async def search_similarity(self, query: str, max_results: int = 5, 
                               similarity_threshold: float = 0.3,
                               version_filter: str = None,
                               content_type_filter: str = None,
                               complexity_filter: str = None) -> Dict[str, Any]:
        """
        Search for similar chunks using similarity search
        This method is expected by the chat router
        """
        try:
            if not self.embeddings or len(self.chunk_data) == 0:
                logger.warning("No search data available for similarity search - returning empty results")
                return {
                    "results": [],
                    "total_found": 0,
                    "processing_time": 0.0,
                    "enhanced_features_used": False,
                    "relationship_enhanced_results": 0,
                    "message": "No documentation data available. Please upload Pro documentation first."
                }
            
            # Generate embedding for query
            if not self.document_processor or not self.document_processor.model_loaded:
                logger.warning("Document processor not ready for similarity search")
                return {
                    "results": [],
                    "total_found": 0,
                    "processing_time": 0.0,
                    "enhanced_features_used": False,
                    "relationship_enhanced_results": 0,
                    "error": "Document processor not ready"
                }
            
            start_time = datetime.now()
            
            # Generate query embedding
            query_embedding = self.document_processor.generate_embeddings([query])[0]
            
            # Compute similarities
            similarities = cosine_similarity([query_embedding], self.embeddings)[0]
            
            # Get top results above threshold
            top_indices = np.argsort(similarities)[::-1][:max_results * 2]  # Get more to filter
            
            results = []
            for idx in top_indices:
                if len(results) >= max_results:
                    break
                    
                if similarities[idx] >= similarity_threshold:
                    chunk = self.chunk_data[idx] if idx < len(self.chunk_data) else {}
                    
                    # Apply filters if specified
                    if version_filter and chunk.get("version") and version_filter not in chunk.get("version", ""):
                        continue
                    
                    if content_type_filter and chunk.get("content_type") != content_type_filter:
                        continue
                        
                    if complexity_filter and chunk.get("complexity") != complexity_filter:
                        continue
                    
                    results.append({
                        "content": chunk.get("content", ""),
                        "source": chunk.get("source_url", f"Pro Documentation"),  # ✅ FIXED: source_url
                        "source_url": chunk.get("source_url", ""),  # ✅ ADDED: explicit URL field
                        "page_title": chunk.get("page_title", ""),  # ✅ ADDED: page title
                        "score": float(similarities[idx]),
                        "metadata": {
                            **chunk.get("metadata", {}),
                            "version_context": version_filter,
                            "content_type": chunk.get("content_type", "general"),
                            "complexity": chunk.get("complexity", "intermediate")
                        }
                    })
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return {
                "results": results,
                "total_found": len(results),
                "processing_time": processing_time,
                "enhanced_features_used": False,
                "relationship_enhanced_results": 0,
                "filters_applied": {
                    "version": version_filter,
                    "content_type": content_type_filter, 
                    "complexity": complexity_filter
                },
                "similarity_threshold": similarity_threshold
            }
            
        except Exception as e:
            logger.error(f"Similarity search failed: {e}")
            return {
                "results": [],
                "total_found": 0,
                "processing_time": 0.0,
                "enhanced_features_used": False,
                "relationship_enhanced_results": 0,
                "error": str(e)
            }