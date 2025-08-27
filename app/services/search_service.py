import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging
from sklearn.metrics.pairwise import cosine_similarity

from app.config import (
    DATA_DIR, EMBEDDINGS_FILE, METADATA_FILE, CHUNKS_FILE,
    EMBEDDING_MODEL, MAX_SEARCH_RESULTS, SIMILARITY_THRESHOLD
)
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
        self.ready = False
        
    def initialize(self):
        """Initialize the search service with existing data"""
        try:
            # Load embeddings
            if EMBEDDINGS_FILE.exists():
                self.embeddings = np.load(EMBEDDINGS_FILE)
                logger.info(f"Loaded {len(self.embeddings)} embeddings for search")
            else:
                logger.warning("No embeddings file found")
                return
            
            # Load metadata
            if METADATA_FILE.exists():
                with open(METADATA_FILE, 'r') as f:
                    metadata_list = json.load(f)
                    self.metadata = {item['chunk_id']: item for item in metadata_list}
                logger.info(f"Loaded metadata for {len(self.metadata)} chunks")
            
            # Load chunk data
            if CHUNKS_FILE.exists():
                with open(CHUNKS_FILE, 'r') as f:
                    data = json.load(f)
                    self.chunk_data = data.get('chunks', [])
                    # Create lookup dictionary for fast access
                    self.chunk_lookup = {chunk['id']: chunk for chunk in self.chunk_data}
                logger.info(f"Loaded {len(self.chunk_data)} chunks for search")
            
            # Check if we have everything needed
            self.ready = (
                self.embeddings is not None and 
                len(self.metadata) > 0 and 
                len(self.chunk_data) > 0 and
                self.document_processor.model_loaded
            )
            
            logger.info(f"Search service ready: {self.ready}")
            
        except Exception as e:
            logger.error(f"Failed to initialize search service: {e}")
            self.ready = False
    
    def refresh_data(self):
        """Refresh search data after new uploads"""
        logger.info("Refreshing search data...")
        self.embeddings = self.document_processor.embeddings
        self.metadata = self.document_processor.metadata
        self.chunk_data = self.document_processor.chunk_data
        self.chunk_lookup = {chunk['id']: chunk for chunk in self.chunk_data}
        
        self.ready = (
            self.embeddings is not None and 
            len(self.metadata) > 0 and 
            len(self.chunk_data) > 0 and
            self.document_processor.model_loaded
        )
        logger.info(f"Search data refreshed. Ready: {self.ready}")
    
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
    
    def filter_results(self, 
                      similarities: List[Tuple[int, float, str]], 
                      max_results: int,
                      min_similarity: float,
                      content_type_filter: Optional[str] = None) -> List[Tuple[int, float, str]]:
        """Filter and sort search results"""
        
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
        
        # Sort by similarity (descending)
        filtered.sort(key=lambda x: x[1], reverse=True)
        
        # Limit results
        return filtered[:max_results]
    
    def build_search_results(self, filtered_similarities: List[Tuple[int, float, str]]) -> List[SearchResult]:
        """Convert similarity results to SearchResult objects"""
        results = []
        
        for embedding_idx, similarity, chunk_id in filtered_similarities:
            chunk = self.chunk_lookup.get(chunk_id)
            if not chunk:
                logger.warning(f"Chunk not found: {chunk_id}")
                continue
            
            try:
                result = SearchResult(
                    id=chunk['id'],
                    content=chunk['content'],
                    source_url=chunk.get('source_url', ''),
                    page_title=chunk.get('page_title', ''),
                    header=chunk.get('header', ''),
                    content_type=chunk.get('content_type', {}).get('type', 'unknown'),
                    complexity=chunk.get('complexity', 'unknown'),
                    similarity_score=float(similarity),
                    tokens=chunk.get('tokens', 0)
                )
                results.append(result)
                
            except Exception as e:
                logger.warning(f"Error building search result for chunk {chunk_id}: {e}")
                continue
        
        return results
    
    def search(self, search_request: SearchRequest) -> SearchResponse:
        """Perform semantic search"""
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
            
            # Filter and sort results
            filtered_similarities = self.filter_results(
                similarities,
                search_request.max_results,
                search_request.min_similarity,
                search_request.content_type_filter
            )
            
            # Build search results
            search_results = self.build_search_results(filtered_similarities)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return SearchResponse(
                results=search_results,
                total_found=len(search_results),
                query=search_request.query,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return SearchResponse(
                results=[],
                total_found=0,
                query=search_request.query,
                processing_time=processing_time
            )
    
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
        """Find chunks similar to a given chunk"""
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
        """Get search service statistics"""
        if not self.ready:
            return {
                "ready": False,
                "total_chunks": 0,
                "total_embeddings": 0,
                "sources": [],
                "content_types": []
            }
        
        # Get unique sources
        sources = set()
        content_types = set()
        
        for chunk in self.chunk_data:
            if chunk.get('source_url'):
                # Extract source from URL (e.g., "/actions/..." -> "actions")
                url_parts = chunk['source_url'].strip('/').split('/')
                if url_parts:
                    sources.add(url_parts[0])
            
            if chunk.get('content_type', {}).get('type'):
                content_types.add(chunk['content_type']['type'])
        
        return {
            "ready": self.ready,
            "total_chunks": len(self.chunk_data),
            "total_embeddings": len(self.embeddings) if self.embeddings is not None else 0,
            "sources": list(sources),
            "content_types": list(content_types),
            "embedding_model": EMBEDDING_MODEL
        }