from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User's question or message")
    max_results: Optional[int] = Field(5, ge=1, le=10, description="Maximum number of context chunks to use")
    source_filter: Optional[str] = Field(None, description="Filter results by document source")

class ContextChunk(BaseModel):
    id: str = Field(..., description="Unique chunk identifier")
    content: str = Field(..., description="Chunk text content")
    source_url: str = Field(..., description="URL of source document")
    page_title: str = Field(..., description="Title of source page")
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score")
    header: Optional[str] = Field(None, description="Section header")

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI generated response")
    context_used: List[ContextChunk] = Field(..., description="Context chunks used for response")
    sources_count: int = Field(..., description="Number of unique sources referenced")
    processing_time: float = Field(..., description="Response processing time in seconds")