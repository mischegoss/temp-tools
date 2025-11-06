from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class ContentType(str, Enum):
    """Pro content type enumeration"""
    WORKFLOW = "workflow"
    CONFIGURATION = "configuration"
    INTEGRATION = "integration"
    ADMINISTRATION = "administration"
    TROUBLESHOOTING = "troubleshooting"
    REFERENCE = "reference"
    GETTING_STARTED = "getting_started"
    GENERAL = "general"

class ComplexityLevel(str, Enum):
    """Content complexity levels for Pro docs"""
    SIMPLE = "simple"
    MODERATE = "moderate"
    DETAILED = "detailed"
    ADVANCED = "advanced"

class ProcessingStatus(str, Enum):
    """Document processing status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"

class DocumentMetadata(BaseModel):
    """Metadata for Pro documentation"""
    title: str = Field(..., description="Document title")
    content_type: ContentType = Field(ContentType.GENERAL, description="Pro content type")
    complexity: ComplexityLevel = Field(ComplexityLevel.MODERATE, description="Content complexity")
    pro_version: Optional[str] = Field(None, description="Applicable Pro version")
    tags: List[str] = Field(default=[], description="Content tags")
    last_updated: Optional[datetime] = Field(None, description="Last update timestamp")
    author: Optional[str] = Field(None, description="Document author")
    section: Optional[str] = Field(None, description="Document section/category")

class DocumentChunk(BaseModel):
    """Individual chunk of Pro documentation content"""
    id: str = Field(..., description="Unique chunk identifier")
    content: str = Field(..., description="Chunk content")
    original_content: str = Field(..., description="Original unprocessed content")
    header: Optional[str] = Field(None, description="Section header")
    source_url: str = Field(..., description="Source Pro documentation URL")
    page_title: str = Field(..., description="Page title")
    
    # Pro-specific chunk data
    metadata: DocumentMetadata = Field(..., description="Document metadata")
    tokens: int = Field(..., ge=0, description="Approximate token count")
    embedding_vector: Optional[List[float]] = Field(None, description="Embedding vector")
    
    # Processing info
    processed_at: datetime = Field(default_factory=datetime.utcnow, description="Processing timestamp")
    checksum: Optional[str] = Field(None, description="Content checksum for change detection")

class UploadRequest(BaseModel):
    """Basic upload request for Pro documentation"""
    file_path: Optional[str] = Field(None, description="File path for processing")
    content: Optional[str] = Field(None, description="Direct content to process")
    url: Optional[str] = Field(None, description="URL to Pro documentation")
    
    # Pro-specific upload options
    force_version: Optional[str] = Field(None, description="Force specific Pro version")
    content_type_hint: Optional[ContentType] = Field(None, description="Hint for content type detection")
    processing_options: Optional[Dict[str, Any]] = Field(None, description="Additional processing options")
    
    # Validation
    overwrite_existing: bool = Field(False, description="Whether to overwrite existing content")
    validate_pro_format: bool = Field(True, description="Validate Pro documentation format")

class ChunkingOptions(BaseModel):
    """Options for content chunking"""
    max_chunk_size: int = Field(800, ge=100, le=2000, description="Maximum tokens per chunk")
    overlap_size: int = Field(50, ge=0, le=200, description="Overlap between chunks")
    respect_boundaries: bool = Field(True, description="Respect section boundaries")
    
    # Pro-specific chunking
    preserve_pro_sections: bool = Field(True, description="Preserve Pro section structure")
    chunk_by_workflow_steps: bool = Field(False, description="Chunk by workflow steps")
    include_context_headers: bool = Field(True, description="Include context headers in chunks")

class EmbeddingOptions(BaseModel):
    """Options for embedding generation"""
    model_name: str = Field("all-MiniLM-L6-v2", description="Embedding model to use")
    batch_size: int = Field(32, ge=1, le=100, description="Batch size for embedding generation")
    normalize_vectors: bool = Field(True, description="Normalize embedding vectors")
    
    # Pro-specific embedding options
    enhance_pro_terms: bool = Field(True, description="Enhance Pro-specific terminology")
    include_version_context: bool = Field(True, description="Include version context in embeddings")

class ProcessingOptions(BaseModel):
    """Comprehensive processing options"""
    chunking: ChunkingOptions = Field(default_factory=ChunkingOptions, description="Chunking options")
    embedding: EmbeddingOptions = Field(default_factory=EmbeddingOptions, description="Embedding options")
    
    # Pro-specific processing
    detect_pro_features: bool = Field(True, description="Detect Pro-specific features")
    extract_workflow_info: bool = Field(True, description="Extract workflow information")
    categorize_by_version: bool = Field(True, description="Categorize content by Pro version")
    
    # Quality control
    validate_links: bool = Field(False, description="Validate internal links")
    check_formatting: bool = Field(True, description="Check markdown formatting")
    extract_metadata: bool = Field(True, description="Extract metadata from content")

class ComprehensiveUploadRequest(BaseModel):
    """Comprehensive upload request with full Pro processing options"""
    # Source specification
    source_type: str = Field(..., description="Source type: file, url, or content")
    source_data: Union[str, Dict[str, Any]] = Field(..., description="Source data")
    
    # Pro documentation context
    pro_version: Optional[str] = Field("8-0", description="Target Pro version")
    content_category: Optional[str] = Field(None, description="Pro content category")
    intended_audience: Optional[str] = Field(None, description="Intended audience")
    
    # Processing configuration
    processing: ProcessingOptions = Field(default_factory=ProcessingOptions, description="Processing options")
    
    # Output options
    generate_preview: bool = Field(True, description="Generate content preview")
    return_chunks: bool = Field(False, description="Return processed chunks in response")
    save_to_index: bool = Field(True, description="Save to search index")
    
    # Metadata
    upload_metadata: Optional[Dict[str, Any]] = Field(None, description="Additional upload metadata")

class ProcessingResult(BaseModel):
    """Result of processing a single document"""
    source_url: str = Field(..., description="Source URL or identifier")
    status: ProcessingStatus = Field(..., description="Processing status")
    chunks_created: int = Field(..., ge=0, description="Number of chunks created")
    tokens_processed: int = Field(..., ge=0, description="Total tokens processed")
    
    # Processing details
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    detected_content_type: Optional[ContentType] = Field(None, description="Detected content type")
    detected_complexity: Optional[ComplexityLevel] = Field(None, description="Detected complexity")
    
    # Pro-specific results
    pro_version_detected: Optional[str] = Field(None, description="Detected Pro version")
    workflow_steps_found: int = Field(0, description="Number of workflow steps found")
    features_mentioned: List[str] = Field(default=[], description="Pro features mentioned")
    
    # Quality metrics
    quality_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Content quality score")
    completeness_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Content completeness score")
    
    # Errors and warnings
    errors: List[str] = Field(default=[], description="Processing errors")
    warnings: List[str] = Field(default=[], description="Processing warnings")

class UploadSummary(BaseModel):
    """Summary of upload operation"""
    total_documents: int = Field(..., ge=0, description="Total documents processed")
    successful_uploads: int = Field(..., ge=0, description="Successful uploads")
    failed_uploads: int = Field(..., ge=0, description="Failed uploads")
    skipped_documents: int = Field(..., ge=0, description="Skipped documents")
    
    total_chunks_created: int = Field(..., ge=0, description="Total chunks created")
    total_tokens_processed: int = Field(..., ge=0, description="Total tokens processed")
    total_processing_time_ms: float = Field(..., description="Total processing time")
    
    # Pro-specific summary
    pro_versions_processed: List[str] = Field(default=[], description="Pro versions processed")
    content_types_found: Dict[str, int] = Field(default={}, description="Content types count")
    complexity_distribution: Dict[str, int] = Field(default={}, description="Complexity distribution")

class UploadResponse(BaseModel):
    """Response from Pro documentation upload"""
    success: bool = Field(..., description="Overall success status")
    message: str = Field(..., description="Response message")
    upload_id: str = Field(..., description="Unique upload identifier")
    
    # Processing results
    summary: UploadSummary = Field(..., description="Upload summary")
    results: List[ProcessingResult] = Field(..., description="Individual processing results")
    
    # Preview data (if requested)
    preview_chunks: Optional[List[DocumentChunk]] = Field(None, description="Preview of processed chunks")
    
    # Metadata
    upload_timestamp: datetime = Field(default_factory=datetime.utcnow, description="Upload timestamp")
    processing_version: str = Field("1.0.0", description="Processing engine version")
    
    # Pro-specific response data
    pro_index_updated: bool = Field(False, description="Whether Pro search index was updated")
    version_compatibility: Dict[str, bool] = Field(default={}, description="Version compatibility status")

class UploadStatus(BaseModel):
    """Status of an ongoing upload operation"""
    upload_id: str = Field(..., description="Upload identifier")
    status: ProcessingStatus = Field(..., description="Current status")
    progress_percentage: float = Field(..., ge=0.0, le=100.0, description="Progress percentage")
    
    documents_processed: int = Field(..., ge=0, description="Documents processed so far")
    total_documents: int = Field(..., ge=0, description="Total documents to process")
    
    current_document: Optional[str] = Field(None, description="Currently processing document")
    estimated_completion: Optional[datetime] = Field(None, description="Estimated completion time")
    
    # Error tracking
    errors_encountered: int = Field(0, description="Number of errors encountered")
    last_error: Optional[str] = Field(None, description="Last error message")
    
    # Pro-specific status
    pro_features_detected: int = Field(0, description="Pro features detected so far")
    current_pro_version: Optional[str] = Field(None, description="Currently processing Pro version")

class UploadErrorResponse(BaseModel):
    """Error response for upload operations"""
    success: bool = Field(False, description="Always false for errors")
    error: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Specific error code")
    upload_id: Optional[str] = Field(None, description="Upload identifier if available")
    
    # Error details
    failed_documents: Optional[List[str]] = Field(None, description="List of failed documents")
    partial_results: Optional[List[ProcessingResult]] = Field(None, description="Partial results if any")
    
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    
    # Pro-specific error context
    pro_validation_errors: Optional[List[str]] = Field(None, description="Pro-specific validation errors")
    suggested_fixes: Optional[List[str]] = Field(None, description="Suggested fixes")