from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    """Individual chat message in conversation history"""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[str] = Field(None, description="Message timestamp in ISO format")

class ProContext(BaseModel):
    """Pro-specific context information"""
    page: Optional[str] = Field(None, description="Current documentation page path")
    product_full_name: str = Field("Resolve Pro", description="Full product name")
    documentation_type: Optional[str] = Field(None, description="Type of documentation being viewed")
    detected_version: Optional[str] = Field(None, description="Version detected from URL")
    is_version_manually_selected: bool = Field(False, description="Whether version was manually selected")
    is_latest_version: bool = Field(True, description="Whether using latest Pro version")
    available_versions: Optional[List[str]] = Field(None, description="Available Pro versions")
    version_display_info: Optional[Dict[str, Any]] = Field(None, description="Version display information")

class ChatRequest(BaseModel):
    """Pro chat request model with version and context awareness"""
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    conversation_history: Optional[List[ChatMessage]] = Field(
        default=[], description="Previous conversation messages"
    )
    product: str = Field("pro", description="Product identifier")
    version: Optional[str] = Field("8-0", description="Pro version (7-8, 7-9, 8-0, general)")
    context: Optional[ProContext] = Field(None, description="Pro-specific context")
    conversation_id: Optional[str] = Field(None, description="Unique conversation identifier")
    user_id: Optional[str] = Field(None, description="Optional user identifier")
    
    # Pro-specific options
    include_version_info: bool = Field(True, description="Include version information in response")
    prefer_latest_features: bool = Field(True, description="Prefer latest Pro features when applicable")

class SourceDocument(BaseModel):
    """Source document information for Pro responses"""
    title: str = Field(..., description="Document title")
    url: str = Field(..., description="Full URL to Pro documentation page")
    section: Optional[str] = Field(None, description="Specific section within document")
    relevance_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Relevance score (0-1)")
    version: Optional[str] = Field(None, description="Pro version this document applies to")
    content_type: Optional[str] = Field(None, description="Type of Pro content (workflow, config, etc.)")

class ContextChunk(BaseModel):
    """Context chunk used in Pro response generation"""
    content: str = Field(..., description="Chunk content")
    source_url: str = Field(..., description="Source Pro documentation URL")
    page_title: str = Field(..., description="Page title")
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Relevance score")
    header: Optional[str] = Field(None, description="Section header")
    content_type: Optional[str] = Field(None, description="Pro content type")
    version: Optional[str] = Field(None, description="Pro version")

class ChatResponseMetadata(BaseModel):
    """Metadata for Pro chat responses"""
    response_time_ms: Optional[float] = Field(None, description="Response generation time in milliseconds")
    processing_time: Optional[float] = Field(None, description="Processing time in seconds")
    sources: List[SourceDocument] = Field(default=[], description="Source documents used")
    context_chunks: List[ContextChunk] = Field(default=[], description="Context chunks used")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Response confidence score")
    version: str = Field("8-0", description="Pro version used for response")
    context_info: Optional[Dict[str, Any]] = Field(None, description="Additional context information")
    model_used: Optional[str] = Field("gemini-1.5-flash", description="AI model used")
    tokens_used: Optional[int] = Field(None, description="Approximate tokens used")
    
    # Pro-specific metadata
    version_specific: bool = Field(False, description="Whether response is version-specific")
    feature_availability: Optional[Dict[str, Any]] = Field(None, description="Feature availability by version")
    related_versions: Optional[List[str]] = Field(None, description="Related Pro versions")

class ChatResponse(BaseModel):
    """Pro chat response model"""
    response: str = Field(..., description="AI assistant response")
    conversation_id: Optional[str] = Field(None, description="Conversation identifier")
    metadata: Optional[ChatResponseMetadata] = Field(None, description="Response metadata")
    success: bool = Field(True, description="Whether response was successful")
    error: Optional[str] = Field(None, description="Error message if unsuccessful")
    
    # Pro-specific response fields
    version_note: Optional[str] = Field(None, description="Version-specific note or warning")
    suggested_versions: Optional[List[str]] = Field(None, description="Suggested Pro versions")
    upgrade_recommendations: Optional[List[str]] = Field(None, description="Upgrade recommendations")

class ChatHealthCheck(BaseModel):
    """Health check model for Pro chat service"""
    status: str = Field(..., description="Service status")
    can_chat: bool = Field(..., description="Whether chat is available")
    model_loaded: bool = Field(..., description="Whether AI model is loaded")
    last_response_time: Optional[float] = Field(None, description="Last response time")
    error_rate: Optional[float] = Field(None, description="Recent error rate")
    
    # Pro-specific health info
    pro_version_support: Dict[str, bool] = Field(
        default={"7-8": True, "7-9": True, "8-0": True, "general": True},
        description="Support status for each Pro version"
    )
    documentation_loaded: bool = Field(True, description="Whether Pro docs are loaded")

class ErrorResponse(BaseModel):
    """Error response model for Pro API"""
    success: bool = Field(False, description="Always false for errors")
    error: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Specific error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    
    # Pro-specific error info
    version_related: bool = Field(False, description="Whether error is version-related")
    suggested_action: Optional[str] = Field(None, description="Suggested user action")