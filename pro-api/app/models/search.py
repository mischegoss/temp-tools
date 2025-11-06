from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SearchRequest(BaseModel):
    """Pro documentation search request"""
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    max_results: Optional[int] = Field(5, ge=1, le=20, description="Maximum results to return")
    similarity_threshold: Optional[float] = Field(0.3, ge=0.0, le=1.0, description="Minimum similarity threshold")
    
    # Pro-specific search parameters
    product: str = Field("pro", description="Product identifier")
    version: Optional[str] = Field("8-0", description="Pro version filter (7-8, 7-9, 8-0, general)")
    content_type_filter: Optional[str] = Field(None, description="Filter by content type")
    complexity_filter: Optional[str] = Field(None, description="Filter by complexity level")
    
    # Context for search
    context: Optional[Dict[str, Any]] = Field(None, description="Additional search context")
    include_version_specific: bool = Field(True, description="Include version-specific results")
    prefer_latest_features: bool = Field(True, description="Prefer latest Pro features")

class SearchResultMetadata(BaseModel):
    """Metadata for individual search results"""
    content_type: Optional[str] = Field(None, description="Type of Pro content")
    complexity: Optional[str] = Field(None, description="Content complexity level")
    tags: List[str] = Field(default=[], description="Content tags")
    last_updated: Optional[datetime] = Field(None, description="Last update timestamp")
    
    # Pro-specific metadata
    pro_version: Optional[str] = Field(None, description="Applicable Pro version")
    feature_category: Optional[str] = Field(None, description="Pro feature category")
    workflow_related: bool = Field(False, description="Whether content relates to workflows")
    configuration_related: bool = Field(False, description="Whether content relates to configuration")

class SearchResult(BaseModel):
    """Individual search result from Pro documentation"""
    content: str = Field(..., description="Result content snippet")
    source_url: str = Field(..., description="Full URL to Pro documentation")
    page_title: str = Field(..., description="Page title")
    section_header: Optional[str] = Field(None, description="Section header")
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score")
    
    # Additional Pro context
    metadata: Optional[SearchResultMetadata] = Field(None, description="Result metadata")
    preview_text: Optional[str] = Field(None, description="Preview text snippet")
    breadcrumb: Optional[str] = Field(None, description="Navigation breadcrumb")

class SearchStats(BaseModel):
    """Search operation statistics"""
    total_searched: int = Field(..., description="Total documents searched")
    results_found: int = Field(..., description="Results found")
    processing_time_ms: float = Field(..., description="Search processing time")
    similarity_threshold_used: float = Field(..., description="Similarity threshold applied")
    
    # Pro-specific stats
    version_filtered_results: Optional[int] = Field(None, description="Results after version filtering")
    content_types_found: List[str] = Field(default=[], description="Content types in results")
    versions_in_results: List[str] = Field(default=[], description="Pro versions represented in results")

class SearchResponse(BaseModel):
    """Response from Pro documentation search"""
    results: List[SearchResult] = Field(..., description="Search results")
    total_found: int = Field(..., description="Total matching results")
    query: str = Field(..., description="Original search query")
    processing_time: float = Field(..., description="Search processing time")
    
    # Enhanced Pro response metadata
    stats: Optional[SearchStats] = Field(None, description="Search statistics")
    enhanced_features_used: Optional[bool] = Field(default=False, description="Whether enhanced search features were used")
    relationship_enhanced_results: Optional[int] = Field(default=0, description="Number of relationship-enhanced results")
    directories_searched: Optional[List[str]] = Field(default=[], description="Directories included in search")
    content_types_found: Optional[List[str]] = Field(default=[], description="Content types in results")
    filters_applied: Optional[Dict[str, Any]] = Field(default={}, description="Filters that were applied")
    
    # Pro-specific response data
    version_context: Optional[str] = Field(None, description="Version context for results")
    suggested_refinements: Optional[List[str]] = Field(None, description="Suggested query refinements")
    related_topics: Optional[List[str]] = Field(None, description="Related Pro topics")

class DirectorySearchRequest(BaseModel):
    """Request for directory-based Pro search"""
    directory: str = Field(..., description="Directory path to search within Pro docs")
    max_results: Optional[int] = Field(10, ge=1, le=50, description="Maximum results to return")
    content_type_filter: Optional[str] = Field(None, description="Filter by Pro content type")
    complexity_filter: Optional[str] = Field(None, description="Filter by complexity")
    version_filter: Optional[str] = Field(None, description="Filter by Pro version")

class ChunkRelationship(BaseModel):
    """Relationship between Pro documentation chunks"""
    related_chunk_id: str = Field(..., description="ID of related chunk")
    relationship_type: str = Field(..., description="Type of relationship")
    strength: float = Field(..., ge=0.0, le=1.0, description="Relationship strength")
    pro_context: Optional[str] = Field(None, description="Pro-specific relationship context")

class ChunkRelationshipsResponse(BaseModel):
    """Response for chunk relationships request"""
    chunk_id: str = Field(..., description="Original chunk ID")
    relationships: List[ChunkRelationship] = Field(..., description="Related chunks")
    total_relationships: int = Field(..., description="Total relationships found")
    
    # Pro-specific relationship data
    version_relationships: Optional[Dict[str, int]] = Field(None, description="Relationships by Pro version")
    topic_relationships: Optional[Dict[str, int]] = Field(None, description="Relationships by Pro topic")

class SearchHealthStatus(BaseModel):
    """Health status for Pro search service"""
    status: str = Field(..., description="Service status")
    ready: bool = Field(..., description="Whether search is ready")
    embeddings_loaded: bool = Field(..., description="Whether embeddings are loaded")
    total_documents: Optional[int] = Field(None, description="Total Pro documents indexed")
    last_index_update: Optional[datetime] = Field(None, description="Last index update time")
    
    # Pro-specific search health
    pro_versions_indexed: List[str] = Field(default=[], description="Pro versions in search index")
    content_types_indexed: List[str] = Field(default=[], description="Content types indexed")
    average_response_time_ms: Optional[float] = Field(None, description="Average search response time")

class SearchErrorResponse(BaseModel):
    """Error response for Pro search operations"""
    success: bool = Field(False, description="Always false for errors")
    error: str = Field(..., description="Error message")
    query: Optional[str] = Field(None, description="Original query that failed")
    error_type: Optional[str] = Field(None, description="Classification of error")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    
    # Pro-specific error context
    version_related: bool = Field(False, description="Whether error is version-related")
    suggested_alternative: Optional[str] = Field(None, description="Suggested alternative query")

class BulkSearchRequest(BaseModel):
    """Request for bulk search operations across Pro docs"""
    queries: List[str] = Field(..., min_items=1, max_items=10, description="Multiple search queries")
    shared_filters: Optional[Dict[str, Any]] = Field(None, description="Filters applied to all queries")
    version: Optional[str] = Field("8-0", description="Pro version for all searches")
    max_results_per_query: Optional[int] = Field(3, ge=1, le=10, description="Max results per query")

class BulkSearchResponse(BaseModel):
    """Response for bulk search operations"""
    results: Dict[str, SearchResponse] = Field(..., description="Results keyed by query")
    total_processing_time: float = Field(..., description="Total processing time for all queries")
    queries_processed: int = Field(..., description="Number of queries processed")
    errors: Optional[Dict[str, str]] = Field(None, description="Errors keyed by query")
    
    # Pro-specific bulk search data
    version_used: str = Field(..., description="Pro version used for all searches")
    common_topics_found: Optional[List[str]] = Field(None, description="Topics common across results")