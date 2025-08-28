from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

class EmbeddingMetadata(BaseModel):
    chunk_id: str = Field(..., description="Unique chunk identifier")
    embedding_index: int = Field(..., description="Index in embeddings array")
    source: str = Field(..., description="Document source")
    content_hash: str = Field(..., description="Hash of content for change detection")
    embedded_at: datetime = Field(..., description="When embedding was created")
    model_used: str = Field(..., description="Embedding model used")

class ProcessingStatus(BaseModel):
    total_chunks: int = Field(..., description="Total chunks in system")
    embedded_chunks: int = Field(..., description="Number of chunks with embeddings")
    pending_chunks: int = Field(..., description="Chunks waiting for embedding")
    last_update: datetime = Field(..., description="Last processing time")
    sources: List[str] = Field(..., description="Available document sources")
    embedding_model: str = Field(..., description="Current embedding model")

class StatusResponse(BaseModel):
    status: ProcessingStatus = Field(..., description="Current processing status")
    ready: bool = Field(..., description="System ready for queries")
    message: str = Field(..., description="Status message")