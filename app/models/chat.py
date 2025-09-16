from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User's question or message")
    max_results: Optional[int] = Field(5, ge=1, le=10, description="Maximum number of context chunks to use")
    source_filter: Optional[str] = Field(None, description="Filter results by document source")
    
    # Enhanced filtering options
    content_type_filter: Optional[str] = Field(None, description="Filter by content type (activity, tutorial, reference, etc.)")
    complexity_filter: Optional[str] = Field(None, description="Filter by complexity (simple, moderate, detailed)")
    has_code_filter: Optional[bool] = Field(None, description="Filter for chunks with/without code examples")
    directory_filter: Optional[str] = Field(None, description="Filter by directory path")

class ContextChunk(BaseModel):
    id: str = Field(..., description="Unique chunk identifier")
    content: str = Field(..., description="Chunk text content")
    source_url: str = Field(..., description="URL of source document")
    page_title: str = Field(..., description="Title of source page")
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score")
    header: Optional[str] = Field(None, description="Section header")
    
    # Enhanced metadata fields from comprehensive JSON
    content_type: Optional[str] = Field(None, description="Content type (activity, tutorial, reference, etc.)")
    complexity: Optional[str] = Field(None, description="Content complexity level")
    has_code: Optional[bool] = Field(None, description="Whether chunk contains code examples")
    has_relationships: Optional[bool] = Field(None, description="Whether chunk has directory relationships")
    directory_path: Optional[str] = Field(None, description="Full directory path")
    tags: Optional[List[str]] = Field(default=[], description="Content tags")
    is_relationship_enhanced: Optional[bool] = Field(default=False, description="Whether this chunk was included via relationships")

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI generated response")
    context_used: List[ContextChunk] = Field(..., description="Context chunks used for response")
    sources_count: int = Field(..., description="Number of unique sources referenced")
    processing_time: float = Field(..., description="Response processing time in seconds")
    
    # Enhanced response fields
    enhanced_features_used: Optional[bool] = Field(default=False, description="Whether enhanced relationship features were used")
    relationship_enhanced_chunks: Optional[int] = Field(default=0, description="Number of chunks enhanced by relationships")
    directories_referenced: Optional[List[str]] = Field(default=[], description="Directories referenced in response")
    content_types_used: Optional[List[str]] = Field(default=[], description="Content types included in response")