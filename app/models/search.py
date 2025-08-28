from pydantic import BaseModel, Field
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    max_results: Optional[int] = Field(5, ge=1, le=20, description="Maximum results to return")
    min_similarity: Optional[float] = Field(0.3, ge=0.0, le=1.0, description="Minimum similarity threshold")
    source_filter: Optional[str] = Field(None, description="Filter by document source")
    content_type_filter: Optional[str] = Field(None, description="Filter by content type")

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

class SearchResponse(BaseModel):
    results: List[SearchResult] = Field(..., description="Search results")
    total_found: int = Field(..., description="Total matching results")
    query: str = Field(..., description="Original search query")
    processing_time: float = Field(..., description="Search processing time")