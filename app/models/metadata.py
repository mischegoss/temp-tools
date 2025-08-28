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
    
    # Enhanced metadata flags for quick access
    has_code: Optional[bool] = Field(default=False, description="Whether chunk contains code examples")
    has_tables: Optional[bool] = Field(default=False, description="Whether chunk contains tables")
    has_relationships: Optional[bool] = Field(default=False, description="Whether chunk has directory relationships")
    content_type: Optional[Dict[str, Any]] = Field(default={}, description="Content type metadata")
    complexity: Optional[str] = Field(default="unknown", description="Content complexity level")

class ProcessingStatus(BaseModel):
    total_chunks: int = Field(..., description="Total chunks in system")
    embedded_chunks: int = Field(..., description="Number of chunks with embeddings")
    pending_chunks: int = Field(..., description="Chunks waiting for embedding")
    last_update: datetime = Field(..., description="Last processing time")
    sources: List[str] = Field(..., description="Available document sources")
    embedding_model: str = Field(..., description="Current embedding model")
    
    # Enhanced processing statistics
    page_mappings: Optional[int] = Field(default=0, description="Number of page mappings processed")
    chunks_with_code: Optional[int] = Field(default=0, description="Chunks containing code examples")
    chunks_with_relationships: Optional[int] = Field(default=0, description="Chunks with directory relationships")
    available_directories: Optional[int] = Field(default=0, description="Number of available directories")
    content_types: Optional[List[str]] = Field(default=[], description="Available content types")
    complexities: Optional[List[str]] = Field(default=[], description="Available complexity levels")
    enhanced_features_available: Optional[bool] = Field(default=False, description="Whether enhanced features are available")

class DocumentationStats(BaseModel):
    """Statistics from comprehensive JSON processing"""
    generation_timestamp: Optional[str] = Field(None, description="When documentation was generated")
    product: Optional[str] = Field(None, description="Product name")
    version: Optional[str] = Field(None, description="Product version")
    total_pages: Optional[int] = Field(None, description="Total pages processed")
    total_headers: Optional[int] = Field(None, description="Total headers extracted")
    enhanced_features_count: Optional[int] = Field(None, description="Number of enhanced features")
    variable_substitutions_applied: Optional[int] = Field(None, description="Variable substitutions applied")
    
    # Content breakdown statistics
    total_activities: Optional[int] = Field(default=0, description="Number of activity pages")
    total_tutorials: Optional[int] = Field(default=0, description="Number of tutorial pages")
    total_configurations: Optional[int] = Field(default=0, description="Number of configuration pages")
    total_overviews: Optional[int] = Field(default=0, description="Number of overview pages")
    pages_with_code: Optional[int] = Field(default=0, description="Pages containing code")
    pages_with_images: Optional[int] = Field(default=0, description="Pages containing images")
    average_chunks_per_page: Optional[int] = Field(default=0, description="Average chunks per page")
    
    # Relationship statistics
    total_directory_relationships: Optional[int] = Field(default=0, description="Total directory relationships")
    average_relationships_per_page: Optional[float] = Field(default=0.0, description="Average relationships per page")
    relationship_breakdown: Optional[Dict[str, int]] = Field(default={}, description="Breakdown by relationship type")

class StatusResponse(BaseModel):
    status: ProcessingStatus = Field(..., description="Current processing status")
    ready: bool = Field(..., description="System ready for queries")
    message: str = Field(..., description="Status message")
    
    # Enhanced status fields
    documentation_stats: Optional[DocumentationStats] = Field(None, description="Documentation processing statistics")
    enhanced_features_ready: Optional[bool] = Field(default=False, description="Enhanced features ready")
    relationship_data_available: Optional[bool] = Field(default=False, description="Directory relationship data available")
    last_upload_type: Optional[str] = Field(None, description="Type of last upload (legacy/comprehensive)")

class HealthStatus(BaseModel):
    """Detailed health status for all system components"""
    overall_status: str = Field(..., description="Overall system status")
    timestamp: datetime = Field(..., description="Status check timestamp")
    
    # Service health
    document_processor_ready: bool = Field(..., description="Document processor status")
    search_service_ready: bool = Field(..., description="Search service status")
    gemini_service_ready: bool = Field(..., description="Gemini service status")
    chat_ready: bool = Field(..., description="Chat functionality ready")
    
    # Enhanced features health
    enhanced_search_available: bool = Field(default=False, description="Enhanced search features available")
    relationship_data_loaded: bool = Field(default=False, description="Directory relationship data loaded")
    comprehensive_json_supported: bool = Field(default=True, description="Comprehensive JSON format supported")
    
    # Performance metrics
    total_chunks_loaded: int = Field(default=0, description="Total chunks in memory")
    embeddings_count: int = Field(default=0, description="Total embeddings available")
    page_mappings_count: int = Field(default=0, description="Page mappings available")
    
    # Feature availability
    available_features: List[str] = Field(default=[], description="List of available features")
    supported_content_types: List[str] = Field(default=[], description="Supported content types")
    supported_complexities: List[str] = Field(default=[], description="Supported complexity levels")