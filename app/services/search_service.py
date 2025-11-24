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
        ✅ SURGICAL FIX: Search all versions but prefer version-matching chunks
        """
        
        # ✅ CRITICAL DEBUG LINE - Shows if embeddings exist and their shape
        logger.info(f"🔍 SEARCH DEBUG: query='{query}', chunks={len(self.chunk_data)}, embeddings_shape={self.embeddings.shape if self.embeddings is not None else None}, threshold={similarity_threshold}")
        
        try:
            # ✅ CRITICAL FIX: Check for None explicitly, not truthiness
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
            
            # ✅ SURGICAL FIX: Get more results initially to allow for sorting
            # We'll get 2x max_results, then sort by version match + similarity
            top_indices = np.argsort(similarities)[::-1][:max_results * 2]
            
            # ✅ SHOW TOP SCORES EVEN IF BELOW THRESHOLD
            logger.info(f"🔍 TOP 5 SCORES: {[f'{similarities[i]:.4f}' for i in top_indices[:5]]}")
            
            results = []
            for idx in top_indices:
                if similarities[idx] >= similarity_threshold:
                    chunk = self.chunk_data[idx] if idx < len(self.chunk_data) else {}
                    
                    # ✅ SURGICAL FIX: Don't filter out by version, but track if it matches
                    chunk_version = chunk.get("metadata", {}).get("version", "")
                    matches_version = False
                    
                    if version_filter and chunk_version:
                        # Normalize versions for comparison
                        normalized_chunk = chunk_version.replace('.', '-').replace('production-', '').replace('-only', '').lower()
                        normalized_filter = version_filter.replace('.', '-').lower()
                        matches_version = (normalized_filter in normalized_chunk or normalized_chunk == "general")
                    
                    # Apply content_type filter if specified
                    if content_type_filter and content_type_filter != "general":
                        chunk_content_type = chunk.get("content_type")
                        # Handle both dict and string formats
                        if isinstance(chunk_content_type, dict):
                            chunk_type = chunk_content_type.get("category", chunk_content_type.get("type", ""))
                        else:
                            chunk_type = str(chunk_content_type) if chunk_content_type else ""
                        
                        # Skip if content type doesn't match
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
                        },
                        "_version_match": matches_version,  # Internal flag for sorting
                        "_similarity": float(similarities[idx])  # Keep for sorting
                    })
            
            # ✅ SURGICAL FIX: Sort to prefer version-matching chunks, then by similarity
            # This ensures version-appropriate URLs appear first when available
            results.sort(key=lambda x: (
                not x.get("_version_match", False),  # False sorts first (matches on top)
                -x.get("_similarity", 0)  # Then by similarity (highest first)
            ))
            
            # Clean up internal flags and take top max_results
            final_results = []
            version_matched_count = 0
            for result in results[:max_results]:
                if result.pop("_version_match", False):
                    version_matched_count += 1
                result.pop("_similarity", None)
                final_results.append(result)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"✅ SEARCH COMPLETE: found {len(final_results)} results ({version_matched_count} version-matched) in {processing_time:.3f}s")
            
            return {
                "results": final_results,
                "total_found": len(final_results),
                "processing_time": processing_time,
                "query": query,
                "enhanced_features_used": False,
                "relationship_enhanced_results": 0,
                "filters_applied": {
                    "version": version_filter,
                    "content_type": content_type_filter, 
                    "complexity": complexity_filter
                },
                "similarity_threshold": similarity_threshold,
                "version_matched_chunks": version_matched_count  # New stat
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