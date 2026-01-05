import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging
from sklearn.metrics.pairwise import cosine_similarity

from app.config import (
    EMBEDDING_MODEL, MAX_SEARCH_RESULTS, SIMILARITY_THRESHOLD,
    # KB-specific imports
    KB_SIMILARITY_THRESHOLD, KB_VERSION_EXACT_BONUS, KB_VERSION_ALL_BONUS,
    KB_MAX_ADDITIONAL_MATCHES, format_kb_version_display
)
from app.models.search import SearchRequest

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, document_processor=None):
        self.document_processor = document_processor
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.ready = False
        
        # ========================================
        # KNOWLEDGE BASE INSTANCE VARIABLES
        # ========================================
        self.kb_embeddings = None
        self.kb_articles = []
        self.kb_ready = False
        
    def initialize(self):
        """Initialize the search service"""
        try:
            if self.document_processor:
                self.embeddings = self.document_processor.embeddings
                self.metadata = self.document_processor.metadata
                self.chunk_data = self.document_processor.chunk_data
                
                # ========================================
                # NEW: Initialize KB data from DocumentProcessor
                # ========================================
                self.kb_embeddings = self.document_processor.kb_embeddings
                self.kb_articles = self.document_processor.kb_articles
                self.kb_ready = self.document_processor.kb_loaded
            
            # For initial setup, the service is considered ready even without data
            self.ready = True
            logger.info("✅ Search service initialized successfully")
            
            # Log KB status
            if self.kb_ready:
                logger.info(f"📚 KB search ready: {len(self.kb_articles)} articles")
            else:
                logger.info("📚 KB search not yet loaded (no KB data)")
            
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
    
    # ========================================
    # KNOWLEDGE BASE SYNC METHOD
    # ========================================
    
    def sync_kb_with_document_processor(self) -> bool:
        """
        Sync KB data from DocumentProcessor.
        Call this after uploading KB articles to make them searchable.
        
        Returns:
            True if synced successfully, False otherwise
        """
        try:
            if self.document_processor:
                self.kb_embeddings = self.document_processor.kb_embeddings
                self.kb_articles = self.document_processor.kb_articles
                self.kb_ready = self.document_processor.kb_loaded
                
                if self.kb_ready:
                    logger.info(f"🔄 KB SearchService synced: {len(self.kb_articles)} articles, {len(self.kb_embeddings)} embeddings")
                else:
                    logger.info("🔄 KB SearchService synced: no KB data available")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to sync KB with SearchService: {e}")
            return False
    
    def get_status(self) -> Dict[str, Any]:
        """Get search service status"""
        return {
            "ready": self.ready,
            "embeddings_available": self.embeddings is not None,
            "chunks_count": len(self.chunk_data),
            "can_search": self.ready and self.embeddings is not None,
            # ========================================
            # NEW: KB status fields
            # ========================================
            "kb_ready": self.kb_ready,
            "kb_articles_count": len(self.kb_articles),
            "kb_embeddings_available": self.kb_embeddings is not None,
            "can_search_kb": self.kb_ready and self.kb_embeddings is not None
        }
    
    def get_search_stats(self) -> Dict[str, Any]:
        """Get search statistics"""
        return {
            "ready": self.ready,
            "total_chunks": len(self.chunk_data),
            "has_embeddings": self.embeddings is not None,
            # ========================================
            # NEW: KB stats
            # ========================================
            "kb_ready": self.kb_ready,
            "kb_articles_count": len(self.kb_articles),
            "has_kb_embeddings": self.kb_embeddings is not None
        }
    
    # ========================================
    # KNOWLEDGE BASE SEARCH WITH VERSION SCORING
    # ========================================
    
    def search_kb(self, query: str, user_version: str = "8-0",
                  max_results: int = 5,
                  similarity_threshold: float = None) -> Dict[str, Any]:
        """
        Search KB articles with version-aware scoring.
        
        Scoring algorithm:
        - Base score = semantic similarity (0.0 to 1.0)
        - Version bonus:
          - +0.15 if article's applies_to_versions contains user_version
          - +0.05 if article's applies_to_versions is null (applies to all)
          - +0.00 if article is for a different version
        - Combined score = base_score + version_bonus
        
        Args:
            query: Search query string
            user_version: User's Pro version (e.g., "8-0", "7-9")
            max_results: Maximum total results (primary + additional)
            similarity_threshold: Minimum similarity score (default: KB_SIMILARITY_THRESHOLD)
            
        Returns:
            {
                "primary_match": {...} or None,
                "additional_matches": [...],
                "total_found": int,
                "processing_time": float,
                "query": str,
                "user_version": str
            }
        """
        if similarity_threshold is None:
            similarity_threshold = KB_SIMILARITY_THRESHOLD
        
        start_time = datetime.now()
        
        logger.info(f"🔍 KB SEARCH: query='{query[:50]}...', version={user_version}, threshold={similarity_threshold}")
        
        # Check if KB data is available
        if self.kb_embeddings is None or len(self.kb_articles) == 0:
            logger.warning("No KB data available for search")
            return {
                "primary_match": None,
                "additional_matches": [],
                "total_found": 0,
                "processing_time": 0.0,
                "query": query,
                "user_version": user_version,
                "message": "No knowledge base articles available. Please upload KB data first."
            }
        
        # Check document processor for embedding generation
        if not self.document_processor or not self.document_processor.model_loaded:
            logger.error("Document processor not ready for KB search")
            return {
                "primary_match": None,
                "additional_matches": [],
                "total_found": 0,
                "processing_time": 0.0,
                "query": query,
                "user_version": user_version,
                "error": "Document processor not ready"
            }
        
        try:
            # Step 1: Generate query embedding
            query_embedding = self.document_processor.generate_embeddings([query])[0]
            
            # Step 2: Compute similarities against KB embeddings
            similarities = cosine_similarity([query_embedding], self.kb_embeddings)[0]
            
            logger.info(f"🔍 KB SIMILARITY SCORES: max={np.max(similarities):.4f}, min={np.min(similarities):.4f}, mean={np.mean(similarities):.4f}")
            
            # Step 3: Build scored matches with version bonus
            scored_matches = []
            
            for idx, similarity_score in enumerate(similarities):
                if similarity_score < similarity_threshold:
                    continue
                
                article = self.kb_articles[idx]
                applies_to_versions = article.get('applies_to_versions')
                
                # Calculate version bonus
                version_bonus, version_matched = self._calculate_version_bonus(
                    applies_to_versions, user_version
                )
                
                combined_score = float(similarity_score) + version_bonus
                
                scored_matches.append({
                    "id": article.get('id'),
                    "page_title": article.get('page_title'),
                    "source_url": article.get('source_url'),
                    "content": article.get('content'),
                    "search_text": article.get('search_text'),
                    "requires_login": article.get('requires_login', True),
                    "source_type": article.get('source_type', 'knowledge-base'),
                    "applies_to_versions": applies_to_versions,
                    "similarity_score": float(similarity_score),
                    "version_bonus": version_bonus,
                    "combined_score": combined_score,
                    "version_matched": version_matched,
                    "version_display": format_kb_version_display(applies_to_versions),
                    "metadata": article.get('metadata', {})
                })
            
            # Step 4: Sort by combined score (highest first)
            scored_matches.sort(key=lambda x: x['combined_score'], reverse=True)
            
            # Step 5: Split into primary and additional matches
            primary_match = None
            additional_matches = []
            
            if scored_matches:
                primary_match = scored_matches[0]
                # Limit additional matches
                additional_matches = scored_matches[1:KB_MAX_ADDITIONAL_MATCHES + 1]
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Log results
            if primary_match:
                logger.info(f"✅ KB SEARCH: Found {len(scored_matches)} matches, primary='{primary_match['page_title'][:40]}...' (score={primary_match['combined_score']:.3f})")
            else:
                logger.info(f"✅ KB SEARCH: No matches above threshold {similarity_threshold}")
            
            return {
                "primary_match": primary_match,
                "additional_matches": additional_matches,
                "total_found": len(scored_matches),
                "processing_time": processing_time,
                "query": query,
                "user_version": user_version,
                "similarity_threshold": similarity_threshold
            }
            
        except Exception as e:
            logger.error(f"KB search failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {
                "primary_match": None,
                "additional_matches": [],
                "total_found": 0,
                "processing_time": 0.0,
                "query": query,
                "user_version": user_version,
                "error": str(e)
            }
    
    def _calculate_version_bonus(self, applies_to_versions: Optional[List[str]], 
                                  user_version: str) -> Tuple[float, bool]:
        """
        Calculate version scoring bonus for a KB article.
        
        Args:
            applies_to_versions: Article's version list or None
            user_version: User's current Pro version
            
        Returns:
            Tuple of (bonus_score, version_matched)
        """
        if applies_to_versions is None:
            # Article applies to ALL versions - small bonus
            return (KB_VERSION_ALL_BONUS, True)
        
        if not applies_to_versions:
            # Empty list treated same as null
            return (KB_VERSION_ALL_BONUS, True)
        
        # Normalize user version for comparison
        normalized_user = user_version.replace('.', '-').lower()
        normalized_article_versions = [v.replace('.', '-').lower() for v in applies_to_versions]
        
        if normalized_user in normalized_article_versions:
            # Exact version match - larger bonus
            return (KB_VERSION_EXACT_BONUS, True)
        
        # Different version - no bonus
        return (0.0, False)

    # ========================================
    # EXISTING DOCS SEARCH METHODS (UNCHANGED)
    # ========================================
    
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