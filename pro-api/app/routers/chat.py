# FIXED VERSION - pro-api/app/routers/chat.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, Tuple, Dict, Any
import json
import logging
from datetime import datetime

from app.models.chat import ChatRequest, ChatResponse, ChatHealthCheck, ErrorResponse
from app.models.search import SearchRequest, SearchResponse, BulkSearchRequest, BulkSearchResponse
from app.models.upload import UploadRequest, UploadResponse, ComprehensiveUploadRequest, UploadStatus
from app.models.metadata import StatusResponse, ProcessingStatus
from app.config import (
    PRODUCT_NAME, 
    PRODUCT_DISPLAY_NAME, 
    PRO_SUPPORTED_VERSIONS,
    normalize_pro_version,
    detect_pro_documentation_type
)

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["pro-chat"])

def get_services() -> Tuple:
    """
    Dependency to get initialized Pro services from main app.
    No initialization - just access pre-initialized services and validate readiness.
    """
    # Import here to avoid circular imports
    import app.main as main_app
    
    # Get services from main app's globals
    doc_processor = main_app.doc_processor
    search_service = main_app.search_service
    gemini_service = main_app.gemini_service
    services_initialized = main_app.services_initialized
    
    # Validate that services were initialized during startup
    if not services_initialized or not all([doc_processor, search_service, gemini_service]):
        raise HTTPException(
            status_code=503, 
            detail="Pro services not ready. Please wait for application startup to complete."
        )
    
    return doc_processor, search_service, gemini_service

@router.post("/chat", response_model=ChatResponse)
async def chat_with_pro_assistant(
    request: ChatRequest,
    services: Tuple = Depends(get_services)
) -> ChatResponse:
    """
    Chat with the Pro AI assistant with version-aware responses
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        
        # Enhanced logging for Pro context
        logger.info(f"💼 Pro chat request: {request.message[:50]}...")
        logger.info(f"   Version: {request.version} -> {effective_version}")
        if request.context:
            logger.info(f"   Page: {request.context.page}")
            logger.info(f"   Doc Type: {request.context.documentation_type}")
        
        # Detect documentation type from context or message
        doc_type = None
        if request.context and request.context.documentation_type:
            doc_type = request.context.documentation_type
        elif request.context and request.context.page:
            doc_type = detect_pro_documentation_type(request.context.page)
        
        # Search for relevant Pro documentation
        search_start = datetime.now()
        search_results = await search_service.search_similarity(
            query=request.message,
            max_results=5,
            version_filter=effective_version,
            content_type_filter=doc_type
        )
        search_time = (datetime.now() - search_start).total_seconds() * 1000
        
        # ===== FIXED: Use chat method without await and proper parameters =====
        # Check if services are ready for chat
        gemini_status = gemini_service.get_status()
        if not gemini_status.get("can_chat", False):
            raise HTTPException(
                status_code=400, 
                detail="Pro chat service not ready. Please ensure documents are uploaded and services are initialized."
            )
        
        # Add Pro version to request for processing
        request.version = effective_version
        
        # Generate Pro response using Gemini - FIXED: No await, use chat method
        chat_start = datetime.now()
        chat_response = gemini_service.chat(request)  # ✅ FIXED: No await, correct method
        chat_time = (datetime.now() - chat_start).total_seconds() * 1000
        
        # ===== FIXED: Handle ChatResponse object properly =====
        # Process response for Pro-specific enhancements
        response_text = chat_response.message if hasattr(chat_response, 'message') else str(chat_response)
        
        # Add version-specific notes if needed
        version_note = None
        if effective_version != "8-0":  # Not latest version
            version_note = f"This response is tailored for Pro {effective_version.replace('-', '.')}. Some features may differ in other versions."
        
        # Prepare source documents
        source_docs = []
        for result in search_results.get("results", []):
            source_docs.append({
                "title": result.get("page_title", ""),
                "url": result.get("source_url", ""),
                "section": result.get("header", ""),
                "relevance_score": result.get("similarity_score", 0.0),
                "version": effective_version,
                "content_type": result.get("content_type", doc_type)
            })
        
        # ===== FIXED: Use correct response structure =====
        # Update the chat response with Pro-specific metadata
        if hasattr(chat_response, 'processing_time'):
            chat_response.processing_time = (chat_time + search_time) / 1000
        
        # Add version context
        if hasattr(chat_response, 'version_context'):
            chat_response.version_context = f"Pro {effective_version.replace('-', '.')}"
        
        # Add conversation ID if provided
        if hasattr(chat_response, 'conversation_id'):
            chat_response.conversation_id = request.conversation_id
        
        # Return the properly structured ChatResponse
        final_response = ChatResponse(
            message=response_text,
            context_used=getattr(chat_response, 'context_used', []),
            processing_time=(chat_time + search_time) / 1000,
            model_used=getattr(chat_response, 'model_used', 'gemini-1.5-flash'),
            enhanced_features_used=getattr(chat_response, 'enhanced_features_used', False),
            relationship_enhanced_chunks=getattr(chat_response, 'relationship_enhanced_chunks', 0),
            version_context=f"Pro {effective_version.replace('-', '.')}",
            conversation_id=request.conversation_id
        )
        
        logger.info(f"✅ Pro chat response generated in {chat_time + search_time:.0f}ms")
        return final_response
        
    except Exception as e:
        logger.error(f"❌ Pro chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating Pro response: {str(e)}"
        )

@router.post("/search", response_model=SearchResponse)
async def search_pro_documentation(
    request: SearchRequest,
    services: Tuple = Depends(get_services)
) -> SearchResponse:
    """
    Search Pro documentation with version and content type filtering
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        
        logger.info(f"🔍 Pro search: '{request.query}' (version: {effective_version})")
        
        # Perform search with Pro-specific parameters
        search_results = await search_service.search_similarity(
            query=request.query,
            max_results=request.max_results,
            similarity_threshold=request.similarity_threshold,
            version_filter=effective_version,
            content_type_filter=request.content_type_filter,
            complexity_filter=request.complexity_filter if hasattr(request, 'complexity_filter') else None
        )
        
        return SearchResponse(**search_results)
        
    except Exception as e:
        logger.error(f"❌ Pro search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Pro documentation: {str(e)}"
        )

@router.get("/test-connection")
async def test_pro_connection(services: Tuple = Depends(get_services)):
    """
    Test connection to Pro services
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Test each service
        doc_status = doc_processor.get_status() if doc_processor else {"ready": False}
        search_status = search_service.get_search_stats() if search_service else {"ready": False}
        gemini_status = gemini_service.get_status() if gemini_service else {"ready": False}
        
        return {
            "status": "connected",
            "product": PRODUCT_NAME,
            "timestamp": datetime.utcnow().isoformat(),
            "services": {
                "document_processor": doc_status,
                "search_service": search_status,
                "gemini_service": gemini_status
            },
            "pro_ready": all([
                doc_status.get("ready", False),
                search_status.get("ready", False),
                gemini_status.get("ready", False)
            ]),
            "supported_versions": PRO_SUPPORTED_VERSIONS
        }
        
    except Exception as e:
        logger.error(f"❌ Pro connection test failed: {str(e)}")
        return {
            "status": "error", 
            "error": str(e),
            "product": PRODUCT_NAME,
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/health", response_model=ChatHealthCheck)
async def get_pro_chat_health(services: Tuple = Depends(get_services)):
    """
    Get health status of Pro chat service
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        gemini_status = gemini_service.get_status()
        
        return ChatHealthCheck(
            status="healthy",
            can_chat=gemini_status.get("can_chat", False),
            model_loaded=gemini_status.get("model_loaded", False),
            last_response_time=gemini_status.get("last_response_time"),
            error_rate=gemini_status.get("error_rate", 0.0),
            pro_version_support={
                "7-8": True,
                "7-9": True, 
                "8-0": True,
                "general": True
            },
            documentation_loaded=search_service.get_search_stats().get("ready", False) if search_service else False
        )
        
    except Exception as e:
        logger.error(f"❌ Pro health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Pro chat service unhealthy: {str(e)}"
        )

# Upload status tracking endpoint
upload_statuses: Dict[str, Dict] = {}

@router.get("/upload-status/{upload_id}")
async def get_upload_status(upload_id: str) -> UploadStatus:
    """
    Get status of a Pro documentation upload operation
    """
    if upload_id not in upload_statuses:
        raise HTTPException(status_code=404, detail="Upload not found")
    
    status_data = upload_statuses[upload_id]
    
    return UploadStatus(
        upload_id=upload_id,
        status=status_data.get("status", "pending"),
        progress_percentage=status_data.get("progress", 0.0),
        documents_processed=status_data.get("processed", 0),
        total_documents=status_data.get("total", 1),
        current_document=status_data.get("current"),
        estimated_completion=status_data.get("eta"),
        errors_encountered=status_data.get("errors", 0),
        last_error=status_data.get("last_error"),
        pro_features_detected=status_data.get("pro_features", 0),
        current_pro_version=status_data.get("version")
    )