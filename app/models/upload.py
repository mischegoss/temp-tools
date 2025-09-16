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
    # Required metadata fields - using aliases to preserve JSON structure
    generated: str = Field(..., alias="_GENERATED", description="Generation timestamp")
    product: str = Field(..., alias="_PRODUCT", description="Product name (e.g., 'actions')")
    version: str = Field(..., alias="_VERSION", description="Product version")
    is_current_version: bool = Field(..., alias="_IS_CURRENT_VERSION", description="Whether this is current version")
    total_pages: int = Field(..., alias="_TOTAL_PAGES", description="Total number of pages processed")
    total_headers: int = Field(..., alias="_TOTAL_HEADERS", description="Total number of headers extracted")
    total_chunks: int = Field(..., alias="_TOTAL_CHUNKS", description="Total number of chunks generated")
    checksum: str = Field(..., alias="_CHECKSUM", description="Content checksum for validation")
    
    # Optional metadata fields
    skipped_release_notes: Optional[int] = Field(default=0, alias="_SKIPPED_RELEASE_NOTES", description="Number of release notes skipped")
    variable_substitutions: Optional[Dict[str, str]] = Field(default={}, alias="_VARIABLE_SUBSTITUTIONS", description="Variable replacements applied")
    current_versions: Optional[Dict[str, str]] = Field(default={}, alias="_CURRENT_VERSIONS", description="Current version mapping")
    warning: Optional[str] = Field(default=None, alias="_WARNING", description="Warning message")
    regenerate: Optional[str] = Field(default=None, alias="_REGENERATE", description="Regeneration instructions")
    enhanced_features: Optional[List[str]] = Field(default=[], alias="_ENHANCED_FEATURES", description="List of enhanced features")
    
    # Enhanced data fields
    stats: Optional[Dict[str, Any]] = Field(default={}, alias="_STATS", description="Documentation statistics")
    page_mappings: Optional[Dict[str, Any]] = Field(default={}, alias="_PAGE_MAPPINGS", description="Page-level mappings")
    
    # Main content
    chunks: List[Dict[str, Any]] = Field(..., description="List of enhanced document chunks")
    
    @validator('chunks')
    def validate_chunks(cls, v, values):
        """Validate chunks array matches expected count"""
        expected_count = values.get('total_chunks', 0)
        if len(v) != expected_count:
            raise ValueError(f"Chunk count mismatch: expected {expected_count}, got {len(v)}")
        return v
    
    @validator('generated')
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