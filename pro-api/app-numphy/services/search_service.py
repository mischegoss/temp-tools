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

    def sync_with_document_processor(self) -> bool:
        """
        Sync SearchService with latest DocumentProcessor data
        CRITICAL FIX: This makes uploaded data accessible for search
        """
        try:
            if self.document_processor:
                self.embeddings = self.document_processor.embeddings
                self.chunk_data = self.document_processor.chunk_data
                self.metadata = self.document_processor.metadata
                logger.info(f"🔄 SearchService synced: {len(self.chunk_data)} chunks, {len(self.embeddings) if self.embeddings is not None else 0} embeddings")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to sync SearchService: {e}")
            return False
    
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
            # ✅ FIXED: Check for None explicitly
            if self.embeddings is None or len(self.chunk_data) == 0:
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
                        "source": chunk.get("source_url", f"Pro Documentation"),
                        "source_url": chunk.get("source_url", ""),
                        "page_title": chunk.get("page_title", ""),
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
    
    def search_similarity(self, query: str, max_results: int = 5,
                         similarity_threshold: float = 0.3,
                         version_filter: str = None,
                         content_type_filter: str = None,
                         complexity_filter: str = None) -> Dict[str, Any]:
        """
        Search for similar chunks using similarity search
        This method is expected by the chat router
        """
        
        # ✅ CRITICAL DEBUG LINE - Shows if embeddings exist and their shape
        logger.info(f"🔍 SEARCH DEBUG: query='{query}', chunks={len(self.chunk_data)}, embeddings_shape={self.embeddings.shape if self.embeddings is not None else None}, threshold={similarity_threshold}")
        
        try:
            # ✅ CRITICAL FIX: Check for None explicitly, not truthiness (Line 141 fix)
            if self.embeddings is None or len(self.chunk_data) == 0:
                logger.warning("No search data available for similarity search - returning empty results")
                return {
                    "results": [],
                    "total_found": 0,
                    "processing_time": 0.0,
                    "query": query,
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
                    "query": query,
                    "enhanced_features_used": False,
                    "relationship_enhanced_results": 0,
                    "error": "Document processor not ready"
                }
            
            start_time = datetime.now()
            
            # Generate query embedding
            query_embedding = self.document_processor.generate_embeddings([query])[0]
            
            # Compute similarities
            similarities = cosine_similarity([query_embedding], self.embeddings)[0]
            
            # ✅ ADD DEBUG INFO - Show similarity score distribution
            logger.info(f"🔍 SIMILARITY SCORES: max={np.max(similarities):.4f}, min={np.min(similarities):.4f}, mean={np.mean(similarities):.4f}, above_threshold={np.sum(similarities >= similarity_threshold)}")
            
            # Get top results above threshold
            top_indices = np.argsort(similarities)[::-1][:max_results * 2]  # Get more to filter
            
            # ✅ SHOW TOP SCORES EVEN IF BELOW THRESHOLD
            logger.info(f"🔍 TOP 5 SCORES: {[f'{similarities[i]:.4f}' for i in top_indices[:5]]}")
            
            results = []
            for idx in top_indices:
                if len(results) >= max_results:
                    break
                    
                if similarities[idx] >= similarity_threshold:
                    chunk = self.chunk_data[idx] if idx < len(self.chunk_data) else {}
                    
                    # ✅ FIXED: Version filter checks metadata.version
                    if version_filter:
                        chunk_version = chunk.get("metadata", {}).get("version", "")
                        if chunk_version and version_filter not in chunk_version:
                            logger.debug(f"Skipping chunk due to version filter: {chunk_version} vs {version_filter}")
                            continue
                    
                    # ✅ OPTION A FIX: Don't filter if content_type_filter is "general"
                    if content_type_filter and content_type_filter != "general":
                        chunk_content_type = chunk.get("content_type")
                        # Handle both dict and string formats
                        if isinstance(chunk_content_type, dict):
                            # Extract type from dict: {'type': 'documentation', 'category': 'pro'}
                            chunk_type = chunk_content_type.get("category", chunk_content_type.get("type", ""))
                        else:
                            chunk_type = str(chunk_content_type) if chunk_content_type else ""
                        
                        # Skip if content type doesn't match (flexible matching)
                        if chunk_type and content_type_filter not in chunk_type and chunk_type != content_type_filter:
                            logger.debug(f"Skipping chunk due to content_type filter: {chunk_type} vs {content_type_filter}")
                            continue
                    
                    # Apply complexity filter if specified
                    if complexity_filter and chunk.get("complexity") != complexity_filter:
                        logger.debug(f"Skipping chunk due to complexity filter")
                        continue
                    
                    results.append({
                        "content": chunk.get("content", ""),
                        "source": chunk.get("source_url", f"Pro Documentation"),
                        "source_url": chunk.get("source_url", ""),
                        "page_title": chunk.get("page_title", ""),
                        "score": float(similarities[idx]),
                        "metadata": {
                            **chunk.get("metadata", {}),
                            "version_context": version_filter,
                            "content_type": chunk.get("content_type", "general"),
                            "complexity": chunk.get("complexity", "intermediate")
                        }
                    })
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"✅ SEARCH COMPLETE: found {len(results)} results in {processing_time:.3f}s")
            
            return {
                "results": results,
                "total_found": len(results),
                "processing_time": processing_time,
                "query": query,
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
            import traceback
            logger.error(traceback.format_exc())
            return {
                "results": [],
                "total_found": 0,
                "processing_time": 0.0,
                "query": query,
                "enhanced_features_used": False,
                "relationship_enhanced_results": 0,
                "error": str(e)
            }