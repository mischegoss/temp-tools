# app/services/search_service.py - CONSERVATIVE VERSION AWARE SEARCH
# Full backward compatibility - no new methods, same interface
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
        # BACKWARD COMPATIBLE: Keep same properties
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.ready = False
        
    def initialize(self):
        """Initialize the search service - BACKWARD COMPATIBLE"""
        try:
            if self.document_processor:
                # Use existing interface - these get updated by DocumentProcessor
                self.embeddings = self.document_processor.embeddings
                self.metadata = self.document_processor.metadata
                self.chunk_data = self.document_processor.chunk_data
            
            self.ready = True
            logger.info("✅ Search service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize search service: {e}")
            self.ready = False
            raise
    
    def get_status(self) -> Dict[str, Any]:
        """Get search service status - BACKWARD COMPATIBLE"""
        return {
            "ready": self.ready,
            "embeddings_available": self.embeddings is not None,
            "chunks_count": len(self.chunk_data),
            "can_search": self.ready and self.embeddings is not None
        }
    
    def get_search_stats(self) -> Dict[str, Any]:
        """Get search statistics - BACKWARD COMPATIBLE"""
        return {
            "ready": self.ready,
            "total_chunks": len(self.chunk_data),
            "has_embeddings": self.embeddings is not None
        }
    
    def _sync_with_document_processor(self):
        """CONSERVATIVE: Internal method to sync with updated DocumentProcessor"""
        if self.document_processor:
            # Force immediate sync from DocumentProcessor's current state
            self.chunk_data = self.document_processor.chunk_data
            self.embeddings = self.document_processor.embeddings  
            self.metadata = self.document_processor.metadata
            
            # Log the sync for debugging
            chunks_count = len(self.chunk_data) if self.chunk_data else 0
            embeddings_count = len(self.embeddings) if self.embeddings is not None else 0
            
            logger.info(f"🔄 SearchService synced: {chunks_count} chunks, {embeddings_count} embeddings")
            
            if chunks_count == 0:
                logger.warning("⚠️ SearchService sync resulted in zero chunks - DocumentProcessor may be empty")
            
            return chunks_count > 0
        else:
            logger.error("❌ Cannot sync - DocumentProcessor not available")
            return False
    
    def search(self, request: SearchRequest) -> Dict[str, Any]:
        """
        Search for relevant chunks - BACKWARD COMPATIBLE with version awareness
        """
        try:
            # Sync with document processor in case it was updated
            self._sync_with_document_processor()
            
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
            
            # VERSION FILTERING: Filter chunks if version specified
            search_chunks = self.chunk_data
            search_embeddings = self.embeddings
            
            if hasattr(request, 'version') and request.version and request.version != "general":
                # Filter for specific version
                version_filtered_indices = []
                version_filtered_chunks = []
                
                for i, chunk in enumerate(self.chunk_data):
                    chunk_version = chunk.get("metadata", {}).get("version", "8-0")
                    if chunk_version == request.version:
                        version_filtered_indices.append(i)
                        version_filtered_chunks.append(chunk)
                
                if version_filtered_chunks:
                    search_chunks = version_filtered_chunks
                    search_embeddings = self.embeddings[version_filtered_indices]
                    logger.debug(f"Filtered to {len(search_chunks)} chunks for version {request.version}")
                else:
                    logger.warning(f"No chunks found for version {request.version}")
                    return {
                        "results": [],
                        "total_found": 0,
                        "processing_time": 0.0,
                        "message": f"No documentation data available for version {request.version}."
                    }
            
            # Compute similarities
            similarities = cosine_similarity([query_embedding], search_embeddings)[0]
            
            # Get top results
            top_indices = np.argsort(similarities)[::-1][:request.max_results]
            
            results = []
            for idx in top_indices:
                if similarities[idx] >= SIMILARITY_THRESHOLD:
                    chunk = search_chunks[idx] if idx < len(search_chunks) else {}
                    results.append({
                        "content": chunk.get("content", ""),
                        "source": chunk.get("source_url", chunk.get("source", "")),  # Prefer source_url
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
        BACKWARD COMPATIBLE: Search with version filtering
        """
        try:
            # Sync with document processor
            self._sync_with_document_processor()
            
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
            
            # VERSION FILTERING: Use version-aware filtering if DocumentProcessor has the method
            search_chunks = self.chunk_data
            search_embeddings = self.embeddings
            
            if version_filter and version_filter != "general":
                # Try to use version-specific data if available
                if hasattr(self.document_processor, 'get_version_chunks_and_embeddings'):
                    version_chunks, version_embeddings = self.document_processor.get_version_chunks_and_embeddings(version_filter)
                    if version_chunks and version_embeddings is not None:
                        search_chunks = version_chunks
                        search_embeddings = version_embeddings
                        logger.debug(f"Using version-specific data for {version_filter}: {len(search_chunks)} chunks")
                    else:
                        # Fall back to manual filtering
                        version_filtered_indices = []
                        version_filtered_chunks = []
                        
                        for i, chunk in enumerate(self.chunk_data):
                            chunk_version = chunk.get("metadata", {}).get("version", "8-0")
                            if chunk_version == version_filter:
                                version_filtered_indices.append(i)
                                version_filtered_chunks.append(chunk)
                        
                        if version_filtered_chunks:
                            search_chunks = version_filtered_chunks
                            search_embeddings = self.embeddings[version_filtered_indices]
                else:
                    # Manual filtering for backward compatibility
                    version_filtered_indices = []
                    version_filtered_chunks = []
                    
                    for i, chunk in enumerate(self.chunk_data):
                        chunk_version = chunk.get("metadata", {}).get("version", "8-0")
                        if chunk_version == version_filter:
                            version_filtered_indices.append(i)
                            version_filtered_chunks.append(chunk)
                    
                    if version_filtered_chunks:
                        search_chunks = version_filtered_chunks
                        search_embeddings = self.embeddings[version_filtered_indices]
            
            # Compute similarities
            similarities = cosine_similarity([query_embedding], search_embeddings)[0]
            
            # Get top results above threshold
            top_indices = np.argsort(similarities)[::-1][:max_results * 2]  # Get more to filter
            
            results = []
            for idx in top_indices:
                if len(results) >= max_results:
                    break
                    
                if similarities[idx] >= similarity_threshold:
                    chunk = search_chunks[idx] if idx < len(search_chunks) else {}
                    
                    # Apply additional filters
                    if content_type_filter and chunk.get("content_type") != content_type_filter:
                        continue
                        
                    if complexity_filter and chunk.get("complexity") != complexity_filter:
                        continue
                    
                    results.append({
                        "content": chunk.get("content", ""),
                        "source": chunk.get("source_url", chunk.get("source", f"Pro Documentation")),  # Prefer source_url
                        "score": float(similarities[idx]),
                        "metadata": {
                            **chunk.get("metadata", {}),
                            "version_context": version_filter,
                            "content_type": chunk.get("content_type", "general"),
                            "complexity": chunk.get("complexity", "intermediate")
                        },
                        "page_title": chunk.get("page_title", ""),
                        "header": chunk.get("header", ""),
                        "source_url": chunk.get("source_url", ""),  # Explicit source_url field
                        "version": chunk.get("metadata", {}).get("version", "unknown")
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