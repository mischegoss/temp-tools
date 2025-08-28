from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class DocumentChunk(BaseModel):
    id: str = Field(..., description="Unique chunk identifier")
    content: str = Field(..., description="Main text content")
    original_content: str = Field(..., description="Original markdown content")
    header: str = Field(..., description="Section header")
    source_url: str = Field(..., description="Source document URL")
    page_title: str = Field(..., description="Page title")
    content_type: Dict[str, Any] = Field(..., description="Content type metadata")
    complexity: str = Field(..., description="Content complexity level")
    tokens: int = Field(..., description="Estimated token count")
    metadata: Dict[str, Any] = Field(..., description="Additional metadata")

class UploadRequest(BaseModel):
    source: str = Field(..., description="Source identifier (e.g., 'actions-docs')")
    chunks: List[DocumentChunk] = Field(..., description="List of document chunks")
    generated_at: datetime = Field(..., description="When the chunks were generated")
    total_chunks: int = Field(..., description="Total number of chunks")
    total_tokens: int = Field(..., description="Total token count")

class UploadResponse(BaseModel):
    success: bool = Field(..., description="Upload success status")
    message: str = Field(..., description="Status message")
    processed_chunks: int = Field(..., description="Number of chunks processed")
    new_embeddings: int = Field(..., description="Number of new embeddings created")
    updated_embeddings: int = Field(..., description="Number of embeddings updated")
    processing_time: float = Field(..., description="Processing time in seconds")