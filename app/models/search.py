from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    max_results: Optional[int] = Field(5, ge=1, le=20, description="Maximum results to return")
    min_similarity: Optional[float] = Field(0.3, ge=0.0, le=1.0, description="Minimum similarity threshold")
    source_filter: Optional[str] = Field(None, description="Filter by document source")
    content_type_filter: Optional[str] = Field(None, description="Filter by content type")
    
    # Enhanced filtering options from comprehensive JSON
    complexity_filter: Optional[str] = Field(None, description="Filter by complexity (simple, moderate, detailed)")
    has_code_filter: Optional[bool] = Field(None, description="Filter for chunks with/without code examples")
    directory_filter: Optional[str] = Field(None, description="Filter by directory path")
    tags_filter: Optional[List[str]] = Field(None, description="Filter by content tags")
    
    # Relationship-based search options (optional for performance)
    include_relationships: Optional[bool] = Field(False, description="Include relationship-based results (may increase response time)")
    relationship_types: Optional[List[str]] = Field(None, description="Types of relationships to include (siblings, cousins, semantic)")
    max_related_results: Optional[int] = Field(2, ge=1, le=5, description="Maximum relationship-based results to add")

class SearchResult(BaseModel):
    id: str = Field(..., description="Chunk identifier")
    content: str = Field(..., description="Chunk content")
    source_url: str = Field(..., description="Source document URL")
    page_title: str = Field(..., description="Source page title")
    header: Optional[str] = Field(None, description="Section header")
    content_type: str = Field(..., description="Content type")
    complexity: str = Field(..., description="Content complexity")
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score")
    tokens: int = Field(..., description="Token count")
    
    # Enhanced metadata fields from comprehensive JSON
    has_code: Optional[bool] = Field(default=False, description="Contains code examples")
    has_tables: Optional[bool] = Field(default=False, description="Contains tables")
    has_relationships: Optional[bool] = Field(default=False, description="Has directory relationships")
    directory_path: Optional[str] = Field(None, description="Full directory path")
    tags: Optional[List[str]] = Field(default=[], description="Content tags")
    code_examples_count: Optional[int] = Field(default=0, description="Number of code examples")
    question_variations: Optional[List[str]] = Field(default=[], description="Question variations this chunk can answer")
    
    # Context enrichment (not used for ranking)
    is_relationship_enhanced: Optional[bool] = Field(default=False, description="Whether this result was included via relationships")

class SearchResponse(BaseModel):
    results: List[SearchResult] = Field(..., description="Search results")
    total_found: int = Field(..., description="Total matching results")
    query: str = Field(..., description="Original search query")
    processing_time: float = Field(..., description="Search processing time")
    
    # Enhanced response metadata
    enhanced_features_used: Optional[bool] = Field(default=False, description="Whether enhanced search features were used")
    relationship_enhanced_results: Optional[int] = Field(default=0, description="Number of relationship-enhanced results")
    directories_searched: Optional[List[str]] = Field(default=[], description="Directories included in search")
    content_types_found: Optional[List[str]] = Field(default=[], description="Content types in results")
    filters_applied: Optional[Dict[str, Any]] = Field(default={}, description="Filters that were applied")

class DirectorySearchRequest(BaseModel):
    """Request for directory-based search"""
    directory: str = Field(..., description="Directory path to search within")
    max_results: Optional[int] = Field(10, ge=1, le=50, description="Maximum results to return")
    content_type_filter: Optional[str] = Field(None, description="Filter by content type")
    complexity_filter: Optional[str] = Field(None, description="Filter by complexity")

class ChunkRelationshipsResponse(BaseModel):
    """Response for chunk relationships request (lightweight alternative)"""
    chunk_id: str = Field(..., description="Source chunk ID")
    relationships: Dict[str, Any] = Field(..., description="Raw relationship data from chunk")
    has_siblings: bool = Field(..., description="Whether chunk has sibling relationships")
    has_cousins: bool = Field(..., description="Whether chunk has cousin relationships")
    total_related: int = Field(..., description="Total number of related items")

class SearchStats(BaseModel):
    """Search service statistics"""
    total_chunks: int = Field(..., description="Total chunks available for search")
    total_embeddings: int = Field(..., description="Total embeddings available")
    page_mappings: int = Field(default=0, description="Page mappings available")
    sources: List[str] = Field(..., description="Available document sources")
    content_types: List[str] = Field(..., description="Available content types")
    complexities: List[str] = Field(..., description="Available complexity levels")
    chunks_with_code: int = Field(default=0, description="Chunks containing code")
    chunks_with_relationships: int = Field(default=0, description="Chunks with directory relationships")
    relationship_index_size: int = Field(default=0, description="Size of relationship index")
    enhanced_features: bool = Field(default=False, description="Enhanced features available")
    embedding_model: str = Field(..., description="Embedding model used")
    documentation_stats: Optional[Dict[str, Any]] = Field(default={}, description="Documentation processing statistics")