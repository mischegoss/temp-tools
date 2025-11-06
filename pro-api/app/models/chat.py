# app/models/chat.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class ContextChunk(BaseModel):
    """A chunk of context used for generating responses"""
    content: str = Field(..., description="Content of the context chunk")
    source: str = Field(..., description="Source of the content")
    score: float = Field(0.0, description="Relevance score")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class ChatContext(BaseModel):
    """Context information for chat requests"""
    page: Optional[str] = Field(None, description="Current page or section")
    documentation_type: Optional[str] = Field(None, description="Type of documentation")
    user_role: Optional[str] = Field(None, description="User's role or permission level")

class ChatMessage(BaseModel):
    """Individual chat message"""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Message timestamp")

class ChatRequest(BaseModel):
    """Chat request model with conversation history support"""
    message: str = Field(..., description="User's message or question")
    version: Optional[str] = Field("8-0", description="Pro version context")
    context: Optional[ChatContext] = Field(None, description="Additional context")
    conversation_id: Optional[str] = Field(None, description="Conversation identifier")
    model: Optional[str] = Field("gemini-2.5-flash", description="AI model to use")
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Previous messages in conversation")
    max_history_length: Optional[int] = Field(5, description="Maximum number of history messages to include")

class ChatResponse(BaseModel):
    """Chat response model"""
    message: str = Field(..., description="AI assistant's response")
    context_used: List[ContextChunk] = Field(default_factory=list, description="Context chunks used")
    processing_time: float = Field(0.0, description="Time taken to generate response")
    model_used: str = Field("gemini-2.5-flash", description="AI model used")
    enhanced_features_used: bool = Field(False, description="Whether enhanced features were used")
    relationship_enhanced_chunks: int = Field(0, description="Number of relationship-enhanced chunks")
    version_context: Optional[str] = Field(None, description="Pro version context used")
    conversation_id: Optional[str] = Field(None, description="Conversation identifier")

class ChatHealthCheck(BaseModel):
    """Health check response for chat service"""
    chat_ready: bool = Field(False, description="Whether chat service is ready")
    gemini_available: bool = Field(False, description="Whether Gemini service is available")
    search_ready: bool = Field(False, description="Whether search service is ready")
    model_loaded: bool = Field(False, description="Whether AI model is loaded")

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(..., description="Error message")
    error_type: Optional[str] = Field(None, description="Type of error")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    request_id: Optional[str] = Field(None, description="Request identifier for debugging")