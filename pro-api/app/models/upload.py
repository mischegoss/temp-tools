# app/models/upload.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from enum import Enum

class DocumentChunk(BaseModel):
    """A processed document chunk"""
    id: str = Field(..., description="Unique identifier for the chunk")
    content: str = Field(..., description="Content of the chunk")
    source: str = Field(..., description="Source document or URL")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class UploadStatus(str, Enum):
    """Upload status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class UploadRequest(BaseModel):
    """Basic upload request"""
    source_url: Optional[str] = Field(None, description="URL of the source document")
    content: Optional[str] = Field(None, description="Direct content to process")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class UploadResponse(BaseModel):
    """Upload response"""
    success: bool = Field(..., description="Whether upload was successful")
    message: str = Field(..., description="Response message")
    chunks_processed: int = Field(0, description="Number of chunks processed")
    processing_time: float = Field(0.0, description="Time taken to process")
    upload_id: Optional[str] = Field(None, description="Upload identifier")
    status: UploadStatus = Field(UploadStatus.COMPLETED, description="Upload status")

class ComprehensiveUploadRequest(BaseModel):
    """Comprehensive upload request with full Pro processing options"""
    source_type: str = Field(..., description="Source type: file, url, or content")
    source_data: Union[str, Dict[str, Any]] = Field(..., description="Source data")
    pro_version: Optional[str] = Field("8-0", description="Target Pro version")
    content_category: Optional[str] = Field(None, description="Pro content category")
    processing_options: Dict[str, Any] = Field(default_factory=dict, description="Processing options")