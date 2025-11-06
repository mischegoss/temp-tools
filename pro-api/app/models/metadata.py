# app/models/metadata.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from enum import Enum

class ProcessingStatus(str, Enum):
    """Processing status enumeration"""
    READY = "ready"
    PROCESSING = "processing"
    ERROR = "error"
    NOT_INITIALIZED = "not_initialized"

class EmbeddingMetadata(BaseModel):
    """Metadata for embeddings"""
    chunk_id: str = Field(..., description="Unique chunk identifier")
    content_hash: str = Field(..., description="Hash of the content")
    source: str = Field(..., description="Source document")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    content_type: Optional[str] = Field(None, description="Type of content")
    complexity: Optional[str] = Field(None, description="Complexity level")
    tags: List[str] = Field(default_factory=list, description="Content tags")

class StatusResponse(BaseModel):
    """General status response"""
    service: str = Field(..., description="Service name")
    status: str = Field(..., description="Current status")
    ready: bool = Field(False, description="Whether service is ready")
    message: Optional[str] = Field(None, description="Status message")
    details: Dict[str, Any] = Field(default_factory=dict, description="Additional status details")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Status timestamp")

# Additional metadata classes for Pro API compatibility
class ChunkingOptions(BaseModel):
    """Options for document chunking"""
    chunk_size: int = Field(1000, ge=100, le=2000, description="Size of each chunk")
    chunk_overlap: int = Field(200, ge=0, le=500, description="Overlap between chunks")
    split_on_sentences: bool = Field(True, description="Split on sentence boundaries")
    preserve_context: bool = Field(True, description="Preserve context headers in chunks")

class EmbeddingOptions(BaseModel):
    """Options for embedding generation"""
    model_name: str = Field("all-MiniLM-L6-v2", description="Embedding model to use")
    batch_size: int = Field(32, ge=1, le=100, description="Batch size for embedding generation")
    normalize_vectors: bool = Field(True, description="Normalize embedding vectors")
    enhance_pro_terms: bool = Field(True, description="Enhance Pro-specific terminology")
    include_version_context: bool = Field(True, description="Include version context in embeddings")

class ProcessingOptions(BaseModel):
    """Comprehensive processing options"""
    chunking: ChunkingOptions = Field(default_factory=ChunkingOptions, description="Chunking options")
    embedding: EmbeddingOptions = Field(default_factory=EmbeddingOptions, description="Embedding options")
    detect_pro_features: bool = Field(True, description="Detect Pro-specific features")
    extract_workflow_info: bool = Field(True, description="Extract workflow information")
    categorize_by_version: bool = Field(True, description="Categorize content by Pro version")
    validate_links: bool = Field(False, description="Validate internal links")
    check_formatting: bool = Field(True, description="Check markdown formatting")
    extract_metadata: bool = Field(True, description="Extract metadata from content")