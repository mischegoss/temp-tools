# app/models/search.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class SearchRequest(BaseModel):
    """Search request model for Pro documentation"""
    query: str = Field(..., description="Search query text")
    max_results: int = Field(5, ge=1, le=20, description="Maximum number of results to return")
    version: Optional[str] = Field("8-0", description="Pro version to search within")
    content_type_filter: Optional[str] = Field(None, description="Filter by content type")
    complexity_filter: Optional[str] = Field(None, description="Filter by complexity level")

class SearchResult(BaseModel):
    """Individual search result"""
    content: str = Field(..., description="Content of the search result")
    source: str = Field(..., description="Source of the content")
    score: float = Field(..., description="Similarity score")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class SearchResponse(BaseModel):
    """Search response with results and metadata"""
    results: List[SearchResult] = Field(default_factory=list, description="Search results")
    total_found: int = Field(0, description="Total number of results found")
    processing_time: float = Field(0.0, description="Time taken to process the search")
    query: Optional[str] = Field(None, description="Original query")
    enhanced_features_used: bool = Field(False, description="Whether enhanced features were used")
    relationship_enhanced_results: int = Field(0, description="Number of relationship-enhanced results")
    directories_searched: List[str] = Field(default_factory=list, description="Directories searched")
    content_types_found: List[str] = Field(default_factory=list, description="Content types in results")
    filters_applied: Dict[str, Any] = Field(default_factory=dict, description="Filters applied to search")
    version_context: Optional[str] = Field(None, description="Version context for the search")

class BulkSearchRequest(BaseModel):
    """Bulk search request for multiple queries"""
    queries: List[str] = Field(..., description="List of search queries")
    max_results_per_query: int = Field(5, ge=1, le=10, description="Max results per query")
    version: Optional[str] = Field("8-0", description="Pro version context")

class BulkSearchResponse(BaseModel):
    """Bulk search response"""
    results: Dict[str, SearchResponse] = Field(default_factory=dict, description="Results keyed by query")
    total_processing_time: float = Field(0.0, description="Total processing time")
    queries_processed: int = Field(0, description="Number of queries processed")