from pydantic import BaseModel, Field, validator
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
    """Legacy upload request format for backwards compatibility"""
    source: str = Field(..., description="Source identifier (e.g., 'actions-docs')")
    chunks: List[DocumentChunk] = Field(..., description="List of document chunks")
    generated_at: datetime = Field(..., description="When the chunks were generated")
    total_chunks: int = Field(..., description="Total number of chunks")
    total_tokens: int = Field(..., description="Total token count")

class ComprehensiveUploadRequest(BaseModel):
    """New comprehensive JSON format from enhanced scanner"""
    # Required metadata fields
    _GENERATED: str = Field(..., description="Generation timestamp")
    _PRODUCT: str = Field(..., description="Product name (e.g., 'actions')")
    _VERSION: str = Field(..., description="Product version")
    _IS_CURRENT_VERSION: bool = Field(..., description="Whether this is current version")
    _TOTAL_PAGES: int = Field(..., description="Total number of pages processed")
    _TOTAL_HEADERS: int = Field(..., description="Total number of headers extracted")
    _TOTAL_CHUNKS: int = Field(..., description="Total number of chunks generated")
    _CHECKSUM: str = Field(..., description="Content checksum for validation")
    
    # Optional metadata fields
    _SKIPPED_RELEASE_NOTES: Optional[int] = Field(default=0, description="Number of release notes skipped")
    _VARIABLE_SUBSTITUTIONS: Optional[Dict[str, str]] = Field(default={}, description="Variable replacements applied")
    _CURRENT_VERSIONS: Optional[Dict[str, str]] = Field(default={}, description="Current version mapping")
    _WARNING: Optional[str] = Field(default=None, description="Warning message")
    _REGENERATE: Optional[str] = Field(default=None, description="Regeneration instructions")
    _ENHANCED_FEATURES: Optional[List[str]] = Field(default=[], description="List of enhanced features")
    
    # Enhanced data fields
    _STATS: Optional[Dict[str, Any]] = Field(default={}, description="Documentation statistics")
    _PAGE_MAPPINGS: Optional[Dict[str, Any]] = Field(default={}, description="Page-level mappings")
    
    # Main content
    chunks: List[Dict[str, Any]] = Field(..., description="List of enhanced document chunks")
    
    @validator('chunks')
    def validate_chunks(cls, v, values):
        """Validate chunks array matches expected count"""
        expected_count = values.get('_TOTAL_CHUNKS', 0)
        if len(v) != expected_count:
            raise ValueError(f"Chunk count mismatch: expected {expected_count}, got {len(v)}")
        return v
    
    @validator('_GENERATED')
    def validate_generated_timestamp(cls, v):
        """Validate generation timestamp format"""
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
        except ValueError:
            raise ValueError("Invalid ISO timestamp format")
        return v

class UploadResponse(BaseModel):
    """Enhanced upload response with comprehensive JSON support"""
    success: bool = Field(..., description="Upload success status")
    message: str = Field(..., description="Status message")
    processed_chunks: int = Field(..., description="Number of chunks processed")
    new_embeddings: int = Field(..., description="Number of new embeddings created")
    updated_embeddings: int = Field(..., description="Number of embeddings updated")
    processing_time: float = Field(..., description="Processing time in seconds")
    
    # Enhanced response fields for comprehensive uploads
    page_mappings: Optional[int] = Field(default=None, description="Number of page mappings processed")
    enhanced_features: Optional[List[str]] = Field(default=None, description="Enhanced features used")
    variable_substitutions: Optional[int] = Field(default=None, description="Number of variable substitutions applied")
    deleted_chunks: Optional[int] = Field(default=0, description="Number of chunks deleted")
    
    # Statistics from comprehensive upload
    upload_type: Optional[str] = Field(default="legacy", description="Type of upload (legacy or comprehensive)")
    documentation_stats: Optional[Dict[str, Any]] = Field(default=None, description="Documentation processing statistics")