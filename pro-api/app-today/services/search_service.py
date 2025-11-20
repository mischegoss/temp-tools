# COMPLETE FIXED VERSION - app/services/search_service.py
# CRITICAL FIX: Added search_similarity() method expected by chat router
# Fixed all method name mismatches and integration issues

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
            "can_search": self.ready and self.embeddings is not None,
            "embedding_dimension": self.embeddings.shape[1] if self.embeddings is not None else 0,
            "last_updated": self.metadata.get('last_updated', 'Never')
        }
    
    def get_search_stats(self) -> Dict[str, Any]:
        """Get search statistics"""
        return {
            "ready": self.ready,
            "total_chunks": len(self.chunk_data),
            "has_embeddings": self.embeddings is not None,
            "embedding_dimension": self.embeddings.shape[1] if self.embeddings is not None else 0,
            "metadata_keys": list(self.metadata.keys()) if self.metadata else [],
            "can_perform_search": self.ready and self.embeddings is not None and len(self.chunk_data) > 0
        }
    
    def load_new_data(self, processed_chunks: List[Dict[str, Any]]):
        """
        CRITICAL FIX: Load new processed chunks into search service
        """
        try:
            logger.info(f"🔗 Loading {len(processed_chunks)} new chunks into Pro search service...")
            
            if not self.document_processor or not self.document_processor.model_loaded:
                logger.error("❌ Document processor not ready for loading new data")
                raise RuntimeError("Document processor not initialized")
            
            # Extract content from processed chunks for embedding generation
            chunk_contents = []
            valid_chunks = []
            
            for i, chunk in enumerate(processed_chunks):
                content = chunk.get('content', '')
                if content and content.strip():
                    chunk_contents.append(content)
                    valid_chunks.append(chunk)
                else:
                    logger.warning(f"⚠️ Skipping chunk {i} - no valid content")
            
            if not chunk_contents:
                logger.warning("⚠️ No valid content found in processed chunks")
                return
            
            logger.info(f"📝 Processing {len(valid_chunks)} valid chunks out of {len(processed_chunks)} total")
            
            # Generate embeddings for new chunks
            logger.info(f"🧠 Generating embeddings for {len(chunk_contents)} chunks...")
            new_embeddings = self.document_processor.generate_embeddings(chunk_contents)
            
            logger.info(f"✅ Generated embeddings with shape: {new_embeddings.shape}")
            
            # Update search service data structures
            if self.embeddings is None:
                # First time loading data
                self.embeddings = new_embeddings
                self.chunk_data = valid_chunks.copy()
                logger.info("✅ First-time data load completed")
            else:
                # Append to existing data
                self.embeddings = np.vstack([self.embeddings, new_embeddings])
                self.chunk_data.extend(valid_chunks)
                logger.info("✅ Appended new data to existing embeddings")
            
            # Update metadata
            self.metadata.update({
                'last_updated': datetime.now().isoformat(),
                'total_chunks': len(self.chunk_data),
                'embedding_dimension': new_embeddings.shape[1] if len(new_embeddings) > 0 else 0,
                'pro_version': valid_chunks[0].get('metadata', {}).get('version', '8-0') if valid_chunks else '8-0',
                'data_source': 'uploaded_documentation',
                'last_upload_size': len(valid_chunks)
            })
            
            # Update document processor references to keep in sync
            if self.document_processor:
                self.document_processor.embeddings = self.embeddings
                self.document_processor.chunk_data = self.chunk_data
                self.document_processor.metadata = self.metadata
                logger.info("🔗 Synchronized data with document processor")
            
            # Mark service as ready
            self.ready = True
            
            logger.info(f"✅ Successfully loaded {len(valid_chunks)} chunks into Pro search service")
            logger.info(f"📊 Total chunks now available: {len(self.chunk_data)}")
            logger.info(f"📐 Embedding matrix shape: {self.embeddings.shape}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load new data into search service: {e}")
            self.ready = False
            raise RuntimeError(f"Failed to load new data: {e}")
    
    def search(self, request: SearchRequest) -> Dict[str, Any]:
        """
        Search for relevant chunks using SearchRequest model
        """
        try:
            # Check if search data is available
            if not self.embeddings or len(self.chunk_data) == 0:
                logger.warning("No search data available - returning empty results")
                return {
                    "results": [],
                    "total_found": 0,
                    "processing_time": 0.0,
                    "message": "No documentation data available. Please upload documentation first.",
                    "enhanced_features_used": False,
                    "relationship_enhanced_results": 0,
                    "error": "No search data available"
                }
            
            # Validate document processor
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
            query = request.query
            max_results = min(request.max_results, 20)
            similarity_threshold = request.similarity_threshold
            version_filter = getattr(request, 'version', None)
            content_type_filter = getattr(request, 'content_type_filter', None)
            complexity_filter = getattr(request, 'complexity_filter', None)
            
            logger.info(f"🔍 Performing Pro search: '{query}' (max_results={max_results}, threshold={similarity_threshold})")
            
            # Generate query embedding
            try:
                query_embedding = self.document_processor.generate_embeddings([query])[0]
            except Exception as e:
                logger.error(f"Failed to generate query embedding: {e}")
                return {
                    "results": [],
                    "total_found": 0,
                    "processing_time": 0.0,
                    "error": f"Query embedding failed: {str(e)}"
                }
            
            # Compute similarities
            similarities = cosine_similarity([query_embedding], self.embeddings)[0]
            
            # Get top results above threshold
            top_indices = np.argsort(similarities)[::-1][:max_results * 3]
            
            results = []
            for idx in top_indices:
                if len(results) >= max_results:
                    break
                    
                if similarities[idx] >= similarity_threshold and idx < len(self.chunk_data):
                    chunk = self.chunk_data[idx]
                    
                    # Apply filters if specified
                    if version_filter and chunk.get("metadata", {}).get("version"):
                        if version_filter not in chunk.get("metadata", {}).get("version", ""):
                            continue
                    
                    chunk_content_type = chunk.get("content_type", {})
                    if isinstance(chunk_content_type, dict):
                        chunk_content_type_str = chunk_content_type.get("category", "general")
                    else:
                        chunk_content_type_str = str(chunk_content_type)
                    
                    if content_type_filter and chunk_content_type_str != content_type_filter:
                        continue
                        
                    if complexity_filter and chunk.get("complexity") != complexity_filter:
                        continue
                    
                    # Build result with proper field names for chat router
                    result = {
                        "content": chunk.get("content", ""),
                        "source_url": chunk.get("source_url", chunk.get("source", "Pro Documentation")),  # FIXED: Proper source field
                        "source": chunk.get("source_url", chunk.get("source", "Pro Documentation")),  # Both fields for compatibility
                        "similarity_score": float(similarities[idx]),  # FIXED: Proper score field name
                        "score": float(similarities[idx]),  # Both fields for compatibility
                        "page_title": chunk.get("page_title", ""),
                        "header": chunk.get("header", ""),
                        "content_type": chunk_content_type_str,
                        "complexity": chunk.get("complexity", "moderate"),
                        "metadata": {
                            **chunk.get("metadata", {}),
                            "version_context": version_filter,
                            "content_type": chunk_content_type_str,
                            "complexity": chunk.get("complexity", "moderate"),
                            "page_title": chunk.get("page_title", ""),
                            "header": chunk.get("header", ""),
                            "chunk_id": chunk.get("id", f"chunk-{idx}")
                        }
                    }
                    
                    results.append(result)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"✅ Search completed: {len(results)} results in {processing_time:.3f}s")
            
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
                "similarity_threshold": similarity_threshold,
                "directories_searched": ["pro-documentation"],
                "content_types_found": list(set([r["metadata"].get("content_type", "general") for r in results])),
                "version_context": version_filter or "8-0"
            }
            
        except Exception as e:
            logger.error(f"Similarity search failed: {e}")
            return {
                "results": [],
                "total_found": 0,
                "processing_time": 0.0,
                "enhanced_features_used": False,
                "relationship_enhanced_results": 0,
                "error": str(e),
                "query": getattr(request, 'query', 'unknown')
            }
    
    def search_similarity(self, query: str, max_results: int = 5, 
                               similarity_threshold: float = 0.3,
                               version_filter: str = None,
                               content_type_filter: str = None,
                               complexity_filter: str = None) -> Dict[str, Any]:
        """
        CRITICAL FIX: Method expected by chat router
        Converts parameters to SearchRequest and calls main search method
        """
        try:
            logger.info(f"🔍 search_similarity called: query='{query[:50]}...', threshold={similarity_threshold}")
            
            # Create SearchRequest from parameters
            search_request = SearchRequest(
                query=query,
                max_results=max_results,
                similarity_threshold=similarity_threshold,
                version=version_filter or "8-0",
                content_type_filter=content_type_filter,
                complexity_filter=complexity_filter
            )
            
            # Use main search method
            return self.search(search_request)
            
        except Exception as e:
            logger.error(f"❌ search_similarity failed: {e}")
            return {
                "results": [],
                "total_found": 0,
                "processing_time": 0.0,
                "error": str(e)
            }
    
    def clear_data(self):
        """Clear all search data"""
        try:
            logger.info("🗑️ Clearing search service data...")
            self.embeddings = None
            self.chunk_data = []
            self.metadata = {}
            self.ready = False
            
            # Also clear document processor data if available
            if self.document_processor:
                self.document_processor.embeddings = None
                self.document_processor.chunk_data = []
                self.document_processor.metadata = {}
            
            logger.info("✅ Search service data cleared")
        except Exception as e:
            logger.error(f"❌ Failed to clear search data: {e}")
    
    def get_chunk_by_id(self, chunk_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific chunk by ID"""
        for chunk in self.chunk_data:
            if chunk.get('id') == chunk_id:
                return chunk
        return None
    
    def get_chunks_by_source(self, source_url: str) -> List[Dict[str, Any]]:
        """Get all chunks from a specific source URL"""
        matching_chunks = []
        for chunk in self.chunk_data:
            if chunk.get('source_url') == source_url:
                matching_chunks.append(chunk)
        return matching_chunks
    
    def get_version_stats(self) -> Dict[str, int]:
        """Get statistics by Pro version"""
        version_counts = {}
        for chunk in self.chunk_data:
            version = chunk.get('metadata', {}).get('version', 'unknown')
            version_counts[version] = version_counts.get(version, 0) + 1
        return version_counts
    
    def validate_embeddings(self) -> bool:
        """Validate that embeddings and chunk data are consistent"""
        try:
            if self.embeddings is None or len(self.chunk_data) == 0:
                return True  # Empty state is valid
            
            if self.embeddings.shape[0] != len(self.chunk_data):
                logger.error(f"Embedding count ({self.embeddings.shape[0]}) doesn't match chunk count ({len(self.chunk_data)})")
                return False
            
            return True
        except Exception as e:
            logger.error(f"Validation failed: {e}")
            return False
    
    def rebuild_from_chunks(self):
        """Rebuild embeddings from existing chunk data"""
        try:
            if not self.chunk_data or not self.document_processor:
                logger.warning("Cannot rebuild - no chunks or document processor")
                return False
            
            logger.info(f"🔄 Rebuilding embeddings for {len(self.chunk_data)} chunks...")
            
            # Extract content
            contents = [chunk.get('content', '') for chunk in self.chunk_data]
            contents = [c for c in contents if c.strip()]  # Remove empty
            
            if not contents:
                logger.warning("No valid content to rebuild embeddings")
                return False
            
            # Generate new embeddings
            self.embeddings = self.document_processor.generate_embeddings(contents)
            
            # Update metadata
            self.metadata['last_updated'] = datetime.now().isoformat()
            self.metadata['total_chunks'] = len(self.chunk_data)
            self.metadata['embedding_dimension'] = self.embeddings.shape[1]
            
            self.ready = True
            logger.info("✅ Embeddings rebuilt successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to rebuild embeddings: {e}")
            self.ready = False
            return False