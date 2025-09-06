import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging
from sklearn.metrics.pairwise import cosine_similarity

from app.config import EMBEDDING_MODEL, MAX_SEARCH_RESULTS, SIMILARITY_THRESHOLD
from app.models.search import SearchRequest, SearchResult, SearchResponse
from app.services.document_processor import DocumentProcessor

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, document_processor: DocumentProcessor):
        self.document_processor = document_processor
        self.embeddings = None
        self.metadata = {}
        self.chunk_data = []
        self.chunk_lookup = {}  # Fast lookup by chunk ID
        self.page_mappings = {}  # Page-level information
        self.documentation_stats = {}  # Overall documentation statistics
        self.relationship_index = {}  # Index for fast relationship lookups
        self.ready = False
        
    def initialize(self):
        """Initialize the search service with existing data from Cloud Storage"""
        try:
            # Get data from document processor (which loads from Cloud Storage)
            self.embeddings = self.document_processor.embeddings
            self.metadata = self.document_processor.metadata
            self.chunk_data = self.document_processor.chunk_data
            self.page_mappings = self.document_processor.page_mappings
            self.documentation_stats = self.document_processor.documentation_stats
            
            if self.chunk_data:
                # Create lookup dictionary for fast access
                self.chunk_lookup = {chunk['id']: chunk for chunk in self.chunk_data}
                logger.info(f"Loaded {len(self.chunk_data)} chunks for search")
                
                # Build relationship index for enhanced search
                self._build_relationship_index()
            
            # Check if we have everything needed
            self.ready = (
                self.embeddings is not None and 
                len(self.metadata) > 0 and 
                len(self.chunk_data) > 0 and
                self.document_processor.model_loaded
            )
            
            if self.ready:
                logger.info(f"Search service ready with {len(self.embeddings)} embeddings")
                if self.page_mappings:
                    logger.info(f"Enhanced search features available with {len(self.page_mappings)} page mappings")
            else:
                logger.warning("Search service not ready - missing data or model not loaded")
                logger.info(f"Debug - embeddings: {self.embeddings is not None}, metadata: {len(self.metadata)}, chunks: {len(self.chunk_data)}, model: {self.document_processor.model_loaded}")
            
        except Exception as e:
            logger.error(f"Failed to initialize search service: {e}")
            self.ready = False
    
    def _build_relationship_index(self):
        """Build indexes for relationship-based searches - only when needed for performance"""
        # Only build minimal index structure
        return {
            'by_directory': {},
            'enabled': False  # Disabled by default for performance
        }
    
    def refresh_data(self):
        """Refresh search data after new uploads"""
        logger.info("Refreshing search data...")
        
        # Get fresh data from document processor
        self.embeddings = self.document_processor.embeddings
        self.metadata = self.document_processor.metadata
        self.chunk_data = self.document_processor.chunk_data
        self.page_mappings = self.document_processor.page_mappings
        self.documentation_stats = self.document_processor.documentation_stats
        
        if self.chunk_data:
            self.chunk_lookup = {chunk['id']: chunk for chunk in self.chunk_data}
            # Rebuild relationship index
            self._build_relationship_index()
        
        # Update ready state
        self.ready = (
            self.embeddings is not None and 
            len(self.metadata) > 0 and 
            len(self.chunk_data) > 0 and
            self.document_processor.model_loaded
        )
        
        logger.info(f"Search data refreshed. Ready: {self.ready}")
        if self.ready:
            logger.info(f"Available: {len(self.embeddings)} embeddings, {len(self.chunk_data)} chunks")
    
    def compute_similarities(self, query_embedding: np.ndarray, source_filter: Optional[str] = None) -> List[Tuple[int, float, str]]:
        """
        Compute similarities between query and all embeddings
        Returns: List of (embedding_index, similarity_score, chunk_id)
        """
        if not self.ready:
            raise RuntimeError("Search service not ready. No embeddings available.")
        
        # Compute cosine similarities
        similarities = cosine_similarity([query_embedding], self.embeddings)[0]
        
        # Create list of (index, similarity, chunk_id) tuples
        results = []
        for chunk_id, meta in self.metadata.items():
            embedding_idx = meta['embedding_index']
            similarity = similarities[embedding_idx]
            
            # Apply source filter if specified
            if source_filter:
                chunk = self.chunk_lookup.get(chunk_id)
                if chunk and chunk.get('source_url', '').find(source_filter) == -1:
                    continue
            
            results.append((embedding_idx, similarity, chunk_id))
        
        return results

    def select_relationship_enhanced_chunks(self, similarity_results: List[Tuple[int, float, str]], max_results: int = 5) -> List[Tuple[int, float, str]]:
        """
        Enhanced chunk selection using relationship data for better coverage.
        Retrieves more candidates then selects diverse, complementary chunks.
        """
        # Get more candidates than needed (8 for selection to final 5)
        candidate_count = min(max_results * 2, len(similarity_results))
        candidates = sorted(similarity_results, key=lambda x: x[1], reverse=True)[:candidate_count]
        
        if len(candidates) <= max_results:
            # If we don't have many candidates, return all
            return candidates
        
        selected_chunks = []
        selected_directories = set()
        selected_content_types = set()
        used_chunk_ids = set()
        
        # Phase 1: Select top chunk (highest similarity)
        if candidates:
            best_chunk = candidates[0]
            selected_chunks.append(best_chunk)
            used_chunk_ids.add(best_chunk[2])
            
            # Track diversity metrics for the best chunk
            chunk_data = self.chunk_lookup.get(best_chunk[2])
            if chunk_data:
                relationships = chunk_data.get('metadata', {}).get('directory_relationships', {})
                if relationships.get('current_directory'):
                    selected_directories.add(relationships['current_directory'])
                
                content_type = chunk_data.get('content_type', {}).get('type', 'unknown')
                selected_content_types.add(content_type)
        
        # Phase 2: Add high-value related chunks from relationships
        self._add_relationship_chunks(candidates[0][2], selected_chunks, used_chunk_ids, max_additional=2)
        
        # Phase 3: Fill remaining slots with diverse candidates
        remaining_slots = max_results - len(selected_chunks)
        
        for candidate in candidates[1:]:  # Skip the first one we already selected
            if len(selected_chunks) >= max_results:
                break
                
            embedding_idx, similarity, chunk_id = candidate
            
            if chunk_id in used_chunk_ids:
                continue
            
            chunk_data = self.chunk_lookup.get(chunk_id)
            if not chunk_data:
                continue
            
            # Calculate diversity score
            diversity_score = self._calculate_diversity_score(
                chunk_data, selected_directories, selected_content_types
            )
            
            # Select if high similarity OR good diversity (balanced approach)
            if similarity > 0.5 or diversity_score > 0.3:
                selected_chunks.append(candidate)
                used_chunk_ids.add(chunk_id)
                
                # Update tracking sets
                relationships = chunk_data.get('metadata', {}).get('directory_relationships', {})
                if relationships.get('current_directory'):
                    selected_directories.add(relationships['current_directory'])
                
                content_type = chunk_data.get('content_type', {}).get('type', 'unknown')
                selected_content_types.add(content_type)
        
        # Sort final results by similarity (preserve ranking)
        selected_chunks.sort(key=lambda x: x[1], reverse=True)
        
        logger.info(f"Enhanced selection: {len(selected_chunks)} chunks from {len(candidates)} candidates")
        logger.info(f"Directories covered: {selected_directories}")
        logger.info(f"Content types covered: {selected_content_types}")
        
        return selected_chunks
    
    def _add_relationship_chunks(self, primary_chunk_id: str, selected_chunks: List, used_chunk_ids: set, max_additional: int = 2):
        """Add high-value chunks based on relationship data"""
        primary_chunk = self.chunk_lookup.get(primary_chunk_id)
        if not primary_chunk:
            return
        
        relationships = primary_chunk.get('metadata', {}).get('directory_relationships', {})
        if not relationships:
            return
        
        # Prioritize siblings (same directory) with high similarity scores
        siblings = relationships.get('siblings', [])
        added_count = 0
        
        for sibling in siblings:
            if added_count >= max_additional:
                break
                
            sibling_title = sibling.get('title', '')
            sibling_similarity = sibling.get('similarity_score', 0)
            
            # Only add high-quality siblings
            if sibling_similarity > 0.6:
                # Find the chunk by matching page title
                sibling_chunk = self._find_chunk_by_title(sibling_title)
                if sibling_chunk and sibling_chunk['id'] not in used_chunk_ids:
                    # Calculate its embedding similarity to original query
                    if sibling_chunk['id'] in self.metadata:
                        embedding_idx = self.metadata[sibling_chunk['id']]['embedding_index']
                        
                        # Add with a slightly reduced similarity score to maintain ranking
                        adjusted_similarity = sibling_similarity * 0.9
                        selected_chunks.append((embedding_idx, adjusted_similarity, sibling_chunk['id']))
                        used_chunk_ids.add(sibling_chunk['id'])
                        added_count += 1
                        
                        logger.info(f"Added sibling: {sibling_title} (similarity: {sibling_similarity:.3f})")
    
    def _find_chunk_by_title(self, title: str) -> Optional[Dict[str, Any]]:
        """Find a chunk by matching page title"""
        for chunk in self.chunk_data:
            if chunk.get('page_title', '').strip() == title.strip():
                return chunk
        return None
    
    def _calculate_diversity_score(self, chunk_data: Dict, selected_directories: set, selected_content_types: set) -> float:
        """Calculate how much this chunk adds to diversity of results"""
        score = 0.0
        
        # Directory diversity
        relationships = chunk_data.get('metadata', {}).get('directory_relationships', {})
        current_dir = relationships.get('current_directory', '')
        if current_dir and current_dir not in selected_directories:
            score += 0.4  # New directory adds significant diversity
        
        # Content type diversity
        content_type = chunk_data.get('content_type', {}).get('type', 'unknown')
        if content_type not in selected_content_types:
            score += 0.3  # New content type adds moderate diversity
        
        # Complexity diversity (prefer having different complexity levels)
        complexity = chunk_data.get('complexity', 'unknown')
        if complexity == 'detailed':
            score += 0.2  # Detailed content often valuable
        
        # Code presence diversity
        has_code = chunk_data.get('metadata', {}).get('has_code', False)
        if has_code:
            score += 0.1  # Code examples add value
        
        return min(score, 1.0)  # Cap at 1.0
    
    def filter_results(self, 
                      similarities: List[Tuple[int, float, str]], 
                      max_results: int,
                      min_similarity: float,
                      content_type_filter: Optional[str] = None,
                      complexity_filter: Optional[str] = None,
                      has_code_filter: Optional[bool] = None) -> List[Tuple[int, float, str]]:
        """Enhanced filter and sort search results - now with relationship-enhanced selection"""
        
        # Apply minimum similarity threshold
        filtered = [(idx, sim, chunk_id) for idx, sim, chunk_id in similarities if sim >= min_similarity]
        
        # Apply content type filter if specified
        if content_type_filter:
            content_filtered = []
            for idx, sim, chunk_id in filtered:
                chunk = self.chunk_lookup.get(chunk_id)
                if chunk and chunk.get('content_type', {}).get('type', '') == content_type_filter:
                    content_filtered.append((idx, sim, chunk_id))
            filtered = content_filtered
        
        # Apply complexity filter if specified
        if complexity_filter:
            complexity_filtered = []
            for idx, sim, chunk_id in filtered:
                chunk = self.chunk_lookup.get(chunk_id)
                if chunk and chunk.get('complexity', '') == complexity_filter:
                    complexity_filtered.append((idx, sim, chunk_id))
            filtered = complexity_filtered
        
        # Apply code filter if specified
        if has_code_filter is not None:
            code_filtered = []
            for idx, sim, chunk_id in filtered:
                chunk = self.chunk_lookup.get(chunk_id)
                if chunk:
                    has_code = chunk.get('metadata', {}).get('has_code', False)
                    if has_code == has_code_filter:
                        code_filtered.append((idx, sim, chunk_id))
            filtered = code_filtered
        
        # ENHANCED: Use relationship-enhanced selection instead of simple sorting
        enhanced_selection = self.select_relationship_enhanced_chunks(filtered, max_results)
        
        return enhanced_selection
    
    def build_search_results(self, filtered_similarities: List[Tuple[int, float, str]]) -> List[SearchResult]:
        """Convert similarity results to SearchResult objects with enhanced metadata"""
        results = []
        
        for embedding_idx, similarity, chunk_id in filtered_similarities:
            chunk = self.chunk_lookup.get(chunk_id)
            if not chunk:
                logger.warning(f"Chunk not found: {chunk_id}")
                continue
            
            try:
                # Extract enhanced metadata
                metadata = chunk.get('metadata', {})
                relationships = metadata.get('directory_relationships', {})
                
                result = SearchResult(
                    id=chunk['id'],
                    content=chunk['content'],
                    source_url=chunk.get('source_url', ''),
                    page_title=chunk.get('page_title', ''),
                    header=chunk.get('header', ''),
                    content_type=chunk.get('content_type', {}).get('type', 'unknown'),
                    complexity=chunk.get('complexity', 'unknown'),
                    similarity_score=float(similarity),
                    tokens=chunk.get('tokens', 0),
                    # Enhanced fields
                    has_code=metadata.get('has_code', False),
                    has_tables=metadata.get('has_tables', False),
                    has_relationships=bool(relationships.get('relationship_counts', {}).get('total_related', 0)),
                    directory_path=relationships.get('full_path', ''),
                    tags=metadata.get('tags_from_content', [])[:5],  # Limit to 5 tags
                    code_examples_count=len(metadata.get('code_examples', [])),
                    question_variations=metadata.get('question_variations', [])[:3]  # Limit to 3
                )
                results.append(result)
                
            except Exception as e:
                logger.warning(f"Error building search result for chunk {chunk_id}: {e}")
                continue
        
        return results
    
    def search(self, search_request: SearchRequest) -> SearchResponse:
        """Perform enhanced semantic search with relationship-based context selection"""
        start_time = datetime.now()
        
        try:
            if not self.ready:
                return SearchResponse(
                    results=[],
                    total_found=0,
                    query=search_request.query,
                    processing_time=0.0
                )
            
            # Generate query embedding
            query_embedding = self.document_processor.model.encode([search_request.query])[0]
            
            # Compute similarities
            similarities = self.compute_similarities(
                query_embedding, 
                search_request.source_filter
            )
            
            # ENHANCED: Filter and select with relationship-enhanced logic
            filtered_similarities = self.filter_results(
                similarities,
                search_request.max_results,
                search_request.min_similarity,
                getattr(search_request, 'content_type_filter', None),
                getattr(search_request, 'complexity_filter', None),
                getattr(search_request, 'has_code_filter', None)
            )
            
            # Build search results
            search_results = self.build_search_results(filtered_similarities)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Check if relationship enhancement was used
            relationship_enhanced = any(
                result.has_relationships for result in search_results
            ) if search_results else False
            
            logger.info(f"Enhanced search completed: {len(search_results)} results in {processing_time:.3f}s")
            if relationship_enhanced:
                logger.info("Relationship enhancement active - diverse context selected")
            
            return SearchResponse(
                results=search_results,
                total_found=len(search_results),
                query=search_request.query,
                processing_time=processing_time,
                enhanced_features_used=relationship_enhanced
            )
            
        except Exception as e:
            logger.error(f"Enhanced search failed: {e}")
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return SearchResponse(
                results=[],
                total_found=0,
                query=search_request.query,
                processing_time=processing_time
            )
    
    def search_by_directory(self, directory: str, max_results: int = 10) -> List[SearchResult]:
        """Search for chunks in a specific directory"""
        if not self.ready or not self.relationship_index:
            return []
        
        chunk_ids = self.relationship_index['by_directory'].get(directory, [])
        chunks = [self.chunk_lookup.get(chunk_id) for chunk_id in chunk_ids[:max_results]]
        chunks = [chunk for chunk in chunks if chunk]  # Filter out None values
        
        # Convert to SearchResult format (with default similarity)
        results = []
        for chunk in chunks:
            try:
                metadata = chunk.get('metadata', {})
                relationships = metadata.get('directory_relationships', {})
                
                result = SearchResult(
                    id=chunk['id'],
                    content=chunk['content'],
                    source_url=chunk.get('source_url', ''),
                    page_title=chunk.get('page_title', ''),
                    header=chunk.get('header', ''),
                    content_type=chunk.get('content_type', {}).get('type', 'unknown'),
                    complexity=chunk.get('complexity', 'unknown'),
                    similarity_score=1.0,  # Directory match is perfect
                    tokens=chunk.get('tokens', 0),
                    has_code=metadata.get('has_code', False),
                    has_tables=metadata.get('has_tables', False),
                    has_relationships=bool(relationships.get('relationship_counts', {}).get('total_related', 0)),
                    directory_path=relationships.get('full_path', ''),
                    tags=metadata.get('tags_from_content', [])[:5]
                )
                results.append(result)
            except Exception as e:
                logger.warning(f"Error building directory search result: {e}")
                continue
        
        return results
    
    def get_chunk_relationships(self, chunk_id: str) -> Dict[str, Any]:
        """Get raw relationship data without object conversions"""
        chunk = self.chunk_lookup.get(chunk_id)
        if not chunk:
            return {}
        
        return chunk.get('metadata', {}).get('directory_relationships', {})
    
    def get_directory_chunks(self, directory: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Get raw chunk data for a specific directory without object conversions"""
        if not self.ready or not self.relationship_index:
            return []
        
        chunk_ids = self.relationship_index['by_directory'].get(directory, [])
        chunks = []
        
        for chunk_id in chunk_ids[:max_results]:
            chunk = self.chunk_lookup.get(chunk_id)
            if chunk:
                chunks.append(chunk)
        
        return chunks
    
    def get_chunk_by_id(self, chunk_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific chunk by its ID"""
        return self.chunk_lookup.get(chunk_id)
    
    def get_chunks_by_ids(self, chunk_ids: List[str]) -> List[Dict[str, Any]]:
        """Get multiple chunks by their IDs"""
        chunks = []
        for chunk_id in chunk_ids:
            chunk = self.get_chunk_by_id(chunk_id)
            if chunk:
                chunks.append(chunk)
        return chunks
    
    def get_similar_chunks(self, chunk_id: str, max_results: int = 5) -> List[SearchResult]:
        """Find chunks similar to a given chunk using content similarity"""
        if not self.ready:
            return []
        
        chunk = self.get_chunk_by_id(chunk_id)
        if not chunk:
            return []
        
        # Use the chunk's content as the query
        search_request = SearchRequest(
            query=chunk['content'][:500],  # Use first 500 chars to avoid token limits
            max_results=max_results + 1,  # +1 because we'll exclude the original
            min_similarity=0.3
        )
        
        response = self.search(search_request)
        
        # Remove the original chunk from results
        filtered_results = [r for r in response.results if r.id != chunk_id]
        
        return filtered_results[:max_results]
    
    def get_search_stats(self) -> Dict[str, Any]:
        """Get enhanced search service statistics"""
        if not self.ready:
            return {
                "ready": False,
                "total_chunks": 0,
                "total_embeddings": 0,
                "sources": [],
                "content_types": [],
                "enhanced_features": False
            }
        
        # Get unique sources
        sources = set()
        content_types = set()
        complexities = set()
        
        chunks_with_code = 0
        chunks_with_relationships = 0
        
        for chunk in self.chunk_data:
            if chunk.get('source_url'):
                # Extract source from URL (e.g., "/actions/..." -> "actions")
                url_parts = chunk['source_url'].strip('/').split('/')
                if url_parts:
                    sources.add(url_parts[0])
            
            if chunk.get('content_type', {}).get('type'):
                content_types.add(chunk['content_type']['type'])
                
            if chunk.get('complexity'):
                complexities.add(chunk['complexity'])
            
            metadata = chunk.get('metadata', {})
            if metadata.get('has_code'):
                chunks_with_code += 1
                
            relationships = metadata.get('directory_relationships', {})
            if relationships.get('relationship_counts', {}).get('total_related', 0) > 0:
                chunks_with_relationships += 1
        
        return {
            "ready": self.ready,
            "total_chunks": len(self.chunk_data),
            "total_embeddings": len(self.embeddings) if self.embeddings is not None else 0,
            "page_mappings": len(self.page_mappings),
            "sources": list(sources),
            "content_types": list(content_types),
            "complexities": list(complexities),
            "chunks_with_code": chunks_with_code,
            "chunks_with_relationships": chunks_with_relationships,
            "relationship_index_size": len(self.relationship_index.get('by_directory', {})),
            "embedding_model": EMBEDDING_MODEL,
            "enhanced_features": True,  # Now always true with relationship enhancement
            "documentation_stats": self.documentation_stats
        }