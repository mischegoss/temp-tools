import os
import json
import time
import logging
import numpy as np
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path
from sentence_transformers import SentenceTransformer

from app.config import (
    DATA_DIR, 
    EMBEDDINGS_FILE, 
    METADATA_FILE, 
    CHUNKS_FILE,
    MAX_SEARCH_RESULTS,
    SIMILARITY_THRESHOLD,
    PRODUCT_NAME,
    PRO_SUPPORTED_VERSIONS,
    normalize_pro_version
)

logger = logging.getLogger(__name__)

class SearchService:
    """
    Pro-specific search service using semantic embeddings for documentation search
    """
    
    def __init__(self, sentence_model: SentenceTransformer, product_name: str = "pro"):
        self.sentence_model = sentence_model
        self.product_name = product_name
        self.embeddings = None
        self.metadata = None
        self.chunks = None
        
        # Search metrics
        self.search_count = 0
        self.successful_searches = 0
        self.failed_searches = 0
        self.total_search_time = 0
        self.startup_time = time.time()
        
        # Pro-specific search tracking
        self.version_searches = {version: 0 for version in PRO_SUPPORTED_VERSIONS}
        self.content_type_searches = {}
        self.popular_terms = {}
        
        # Load Pro documentation data
        self._load_pro_data()
        
        logger.info(f"✅ Pro search service initialized with {len(self.chunks) if self.chunks else 0} chunks")

    def _load_pro_data(self):
        """Load Pro documentation embeddings, metadata, and chunks"""
        try:
            # Load embeddings
            if EMBEDDINGS_FILE.exists():
                self.embeddings = np.load(EMBEDDINGS_FILE)
                logger.info(f"📊 Loaded Pro embeddings: {self.embeddings.shape}")
            else:
                logger.warning(f"⚠️ Pro embeddings file not found: {EMBEDDINGS_FILE}")
                self.embeddings = np.array([])
            
            # Load metadata
            if METADATA_FILE.exists():
                with open(METADATA_FILE, 'r') as f:
                    self.metadata = json.load(f)
                logger.info(f"📋 Loaded Pro metadata: {len(self.metadata.get('chunks', []))} entries")
            else:
                logger.warning(f"⚠️ Pro metadata file not found: {METADATA_FILE}")
                self.metadata = {"chunks": []}
            
            # Load chunks
            if CHUNKS_FILE.exists():
                with open(CHUNKS_FILE, 'r') as f:
                    chunks_data = json.load(f)
                    self.chunks = chunks_data.get('chunks', [])
                logger.info(f"📚 Loaded Pro chunks: {len(self.chunks)} documents")
            else:
                logger.warning(f"⚠️ Pro chunks file not found: {CHUNKS_FILE}")
                self.chunks = []
            
            # Validate data consistency
            self._validate_pro_data()
            
        except Exception as e:
            logger.error(f"❌ Failed to load Pro search data: {e}")
            self.embeddings = np.array([])
            self.metadata = {"chunks": []}
            self.chunks = []

    def _validate_pro_data(self):
        """Validate Pro search data consistency"""
        if len(self.chunks) == 0:
            logger.warning("⚠️ No Pro documentation chunks loaded")
            return
        
        embeddings_count = len(self.embeddings) if self.embeddings.size > 0 else 0
        metadata_count = len(self.metadata.get('chunks', []))
        chunks_count = len(self.chunks)
        
        if not (embeddings_count == metadata_count == chunks_count):
            logger.warning(
                f"⚠️ Pro data count mismatch: "
                f"embeddings={embeddings_count}, metadata={metadata_count}, chunks={chunks_count}"
            )
        else:
            logger.info(f"✅ Pro search data validated: {chunks_count} consistent entries")

    async def search_similarity(
        self, 
        query: str,
        max_results: int = MAX_SEARCH_RESULTS,
        similarity_threshold: float = SIMILARITY_THRESHOLD,
        version_filter: Optional[str] = None,
        content_type_filter: Optional[str] = None,
        complexity_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Perform semantic similarity search on Pro documentation
        """
        start_time = time.time()
        
        try:
            # Validate inputs
            if not query or not query.strip():
                raise ValueError("Search query cannot be empty")
            
            if len(self.chunks) == 0 or self.embeddings.size == 0:
                logger.warning("⚠️ No Pro search data available")
                return self._empty_search_result(query, start_time)
            
            # Normalize Pro version filter
            if version_filter:
                version_filter = normalize_pro_version(version_filter)
            
            # Track search metrics
            self.search_count += 1
            self._track_search_terms(query)
            if version_filter:
                self.version_searches[version_filter] = self.version_searches.get(version_filter, 0) + 1
            if content_type_filter:
                self.content_type_searches[content_type_filter] = self.content_type_searches.get(content_type_filter, 0) + 1
            
            logger.info(f"🔍 Pro search: '{query}' (version: {version_filter}, type: {content_type_filter})")
            
            # Generate query embedding
            query_embedding = self.sentence_model.encode([query])[0]
            
            # Compute similarities
            similarities = np.dot(self.embeddings, query_embedding)
            
            # Get indices of results above threshold
            valid_indices = np.where(similarities >= similarity_threshold)[0]
            
            if len(valid_indices) == 0:
                logger.info(f"🔍 No Pro results above threshold {similarity_threshold}")
                return self._empty_search_result(query, start_time)
            
            # Sort by similarity (descending)
            sorted_indices = valid_indices[np.argsort(similarities[valid_indices])[::-1]]
            
            # Apply Pro-specific filters and collect results
            results = []
            for idx in sorted_indices:
                if len(results) >= max_results:
                    break
                
                chunk = self.chunks[idx]
                similarity_score = float(similarities[idx])
                
                # Apply Pro version filter
                if version_filter and not self._matches_pro_version(chunk, version_filter):
                    continue
                
                # Apply content type filter
                if content_type_filter and not self._matches_content_type(chunk, content_type_filter):
                    continue
                
                # Apply complexity filter
                if complexity_filter and not self._matches_complexity(chunk, complexity_filter):
                    continue
                
                # Build Pro search result
                result = {
                    "content": chunk.get("content", ""),
                    "source_url": chunk.get("source_url", ""),
                    "page_title": chunk.get("page_title", ""),
                    "header": chunk.get("header", ""),
                    "similarity_score": similarity_score,
                    "content_type": chunk.get("metadata", {}).get("content_type", "general"),
                    "complexity": chunk.get("complexity", "moderate"),
                    "tags": chunk.get("metadata", {}).get("tags", []),
                    "pro_version": self._extract_pro_version(chunk),
                    "feature_category": self._extract_feature_category(chunk),
                    "tokens": chunk.get("tokens", 0)
                }
                
                results.append(result)
            
            search_time = (time.time() - start_time) * 1000
            self.total_search_time += search_time
            self.successful_searches += 1
            
            logger.info(f"✅ Pro search completed: {len(results)} results in {search_time:.0f}ms")
            
            return {
                "results": results,
                "total_found": len(results),
                "query": query,
                "processing_time": search_time / 1000,
                "similarity_threshold": similarity_threshold,
                "filters_applied": {
                    "version": version_filter,
                    "content_type": content_type_filter,
                    "complexity": complexity_filter
                },
                "search_stats": {
                    "total_candidates": len(valid_indices),
                    "filtered_results": len(results),
                    "average_similarity": float(np.mean([r["similarity_score"] for r in results])) if results else 0.0
                }
            }
            
        except Exception as e:
            self.failed_searches += 1
            logger.error(f"❌ Pro search error: {str(e)}")
            return self._error_search_result(query, str(e), start_time)

    def _matches_pro_version(self, chunk: Dict[str, Any], version_filter: str) -> bool:
        """Check if chunk matches Pro version filter"""
        if version_filter == "general":
            return True  # General matches all versions
        
        chunk_version = self._extract_pro_version(chunk)
        if not chunk_version:
            return version_filter == "8-0"  # Default to latest for unversioned content
        
        return chunk_version == version_filter

    def _matches_content_type(self, chunk: Dict[str, Any], content_type_filter: str) -> bool:
        """Check if chunk matches content type filter"""
        chunk_content_type = chunk.get("metadata", {}).get("content_type", "general")
        return chunk_content_type == content_type_filter

    def _matches_complexity(self, chunk: Dict[str, Any], complexity_filter: str) -> bool:
        """Check if chunk matches complexity filter"""
        chunk_complexity = chunk.get("complexity", "moderate")
        return chunk_complexity == complexity_filter

    def _extract_pro_version(self, chunk: Dict[str, Any]) -> Optional[str]:
        """Extract Pro version from chunk"""
        # Check metadata first
        metadata = chunk.get("metadata", {})
        if "pro_version" in metadata:
            return metadata["pro_version"]
        
        # Try to extract from URL
        source_url = chunk.get("source_url", "")
        for version in PRO_SUPPORTED_VERSIONS:
            version_pattern = version.replace("-", ".")
            if f"/{version_pattern}/" in source_url or f"/pro/{version_pattern}" in source_url:
                return version
        
        # Default to latest
        return "8-0"

    def _extract_feature_category(self, chunk: Dict[str, Any]) -> Optional[str]:
        """Extract Pro feature category from chunk"""
        content = chunk.get("content", "").lower()
        source_url = chunk.get("source_url", "").lower()
        
        # Categorize based on content and URL patterns
        if any(term in content for term in ["workflow", "activity", "action"]):
            return "workflows"
        elif any(term in content for term in ["config", "setting", "admin"]):
            return "configuration"
        elif any(term in content for term in ["integration", "api", "connect"]):
            return "integration"
        elif any(term in content for term in ["monitor", "alert", "dashboard"]):
            return "monitoring"
        elif any(term in content for term in ["troubleshoot", "error", "problem"]):
            return "troubleshooting"
        
        return "general"

    def _track_search_terms(self, query: str):
        """Track popular search terms for Pro"""
        terms = query.lower().split()
        for term in terms:
            if len(term) > 2:  # Only track meaningful terms
                self.popular_terms[term] = self.popular_terms.get(term, 0) + 1

    def _empty_search_result(self, query: str, start_time: float) -> Dict[str, Any]:
        """Return empty search result"""
        search_time = (time.time() - start_time) * 1000
        self.total_search_time += search_time
        
        return {
            "results": [],
            "total_found": 0,
            "query": query,
            "processing_time": search_time / 1000,
            "message": "No Pro documentation matches found. Try broader search terms or check different content types."
        }

    def _error_search_result(self, query: str, error: str, start_time: float) -> Dict[str, Any]:
        """Return error search result"""
        search_time = (time.time() - start_time) * 1000
        self.total_search_time += search_time
        
        return {
            "results": [],
            "total_found": 0,
            "query": query,
            "processing_time": search_time / 1000,
            "error": error,
            "message": "Search failed. Please try again or contact support."
        }

    async def update_index(self, new_chunks: List[Dict[str, Any]]):
        """Update Pro search index with new chunks"""
        try:
            logger.info(f"📚 Updating Pro search index with {len(new_chunks)} new chunks")
            
            if not new_chunks:
                return
            
            # Generate embeddings for new chunks
            new_texts = [chunk.get("content", "") for chunk in new_chunks]
            new_embeddings = self.sentence_model.encode(new_texts)
            
            # Append to existing data
            if self.embeddings.size > 0:
                self.embeddings = np.vstack([self.embeddings, new_embeddings])
            else:
                self.embeddings = new_embeddings
            
            self.chunks.extend(new_chunks)
            
            # Update metadata
            if not self.metadata:
                self.metadata = {"chunks": []}
            
            for chunk in new_chunks:
                metadata_entry = {
                    "id": chunk.get("id"),
                    "source_url": chunk.get("source_url"),
                    "content_type": chunk.get("metadata", {}).get("content_type"),
                    "pro_version": self._extract_pro_version(chunk),
                    "updated_at": datetime.utcnow().isoformat()
                }
                self.metadata["chunks"].append(metadata_entry)
            
            # Save updated data
            await self._save_pro_data()
            
            logger.info(f"✅ Pro search index updated: {len(self.chunks)} total chunks")
            
        except Exception as e:
            logger.error(f"❌ Failed to update Pro search index: {e}")

    async def _save_pro_data(self):
        """Save Pro search data to files"""
        try:
            # Save embeddings
            np.save(EMBEDDINGS_FILE, self.embeddings)
            
            # Save metadata
            with open(METADATA_FILE, 'w') as f:
                json.dump(self.metadata, f, indent=2)
            
            # Save chunks
            chunks_data = {
                "_generated": datetime.utcnow().isoformat(),
                "_total_chunks": len(self.chunks),
                "chunks": self.chunks
            }
            with open(CHUNKS_FILE, 'w') as f:
                json.dump(chunks_data, f, indent=2)
            
            logger.info("💾 Pro search data saved successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to save Pro search data: {e}")

    def get_search_stats(self) -> Dict[str, Any]:
        """Get Pro search service statistics"""
        avg_search_time = (
            self.total_search_time / self.search_count 
            if self.search_count > 0 else 0
        )
        
        success_rate = (
            self.successful_searches / self.search_count 
            if self.search_count > 0 else 0
        )
        
        return {
            "ready": len(self.chunks) > 0 and self.embeddings.size > 0,
            "total_documents": len(self.chunks),
            "total_searches": self.search_count,
            "successful_searches": self.successful_searches,
            "failed_searches": self.failed_searches,
            "success_rate": success_rate,
            "average_search_time_ms": avg_search_time,
            "uptime_seconds": time.time() - self.startup_time,
            "embedding_dimensions": self.embeddings.shape[1] if self.embeddings.size > 0 else 0,
            
            # Pro-specific stats
            "pro_versions_indexed": list(set(
                self._extract_pro_version(chunk) for chunk in self.chunks
                if self._extract_pro_version(chunk)
            )),
            "content_types_indexed": list(set(
                chunk.get("metadata", {}).get("content_type", "general")
                for chunk in self.chunks
            )),
            "version_search_distribution": self.version_searches,
            "content_type_search_distribution": self.content_type_searches,
            "popular_search_terms": dict(
                sorted(self.popular_terms.items(), key=lambda x: x[1], reverse=True)[:10]
            ),
            "feature_categories": list(set(
                self._extract_feature_category(chunk) for chunk in self.chunks
            ))
        }

    async def test_search(self) -> Dict[str, Any]:
        """Test Pro search functionality"""
        try:
            test_query = "How to configure Pro workflows?"
            
            result = await self.search_similarity(
                query=test_query,
                max_results=3,
                version_filter="8-0"
            )
            
            return {
                "status": "success",
                "test_query": test_query,
                "results_found": result.get("total_found", 0),
                "search_time_ms": result.get("processing_time", 0) * 1000,
                "search_working": True
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "search_working": False
            }