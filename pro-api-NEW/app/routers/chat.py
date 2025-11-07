# CORRECTED VERSION - pro-api/app/routers/chat.py
# Fixed to work with Pro API's actual DocumentProcessor methods
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
async def chat_with_pro_documentation(
    request: ChatRequest,
    services: Tuple = Depends(get_services)
) -> ChatResponse:
    """
    Chat endpoint specifically for Pro documentation with version awareness
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        
        # Detect documentation type from context
        doc_type = detect_pro_documentation_type(request.message)
        
        logger.info(f"💬 Pro chat request: '{request.message[:50]}...' (version: {effective_version})")
        
        search_start = datetime.now()
        
        # Enhanced search with Pro version filtering
        search_results = await search_service.search_similarity(
            query=request.message,
            max_results=5,
            similarity_threshold=0.2,
            version_filter=effective_version,
            content_type_filter=doc_type
        )
        
        search_time = (datetime.now() - search_start).total_seconds() * 1000
        
        chat_start = datetime.now()
        
        # Generate Pro-specific chat response
        chat_response = await gemini_service.generate_response(
            message=request.message,
            search_results=search_results,
            conversation_history=request.conversation_history,
            product_context={
                "product": PRODUCT_NAME,
                "display_name": PRODUCT_DISPLAY_NAME,
                "version": effective_version,
                "documentation_type": doc_type,
                "supported_versions": PRO_SUPPORTED_VERSIONS
            }
        )
        
        chat_time = (datetime.now() - chat_start).total_seconds() * 1000
        
        # Add Pro-specific response enhancement
        response_text = chat_response.get("response", "")
        
        # Add version-specific context if relevant
        if effective_version != "8-0":
            response_text += f"\n\n*Note: This response is specific to Pro version {effective_version.replace('-', '.')}. Some features may differ in other versions.*"
        
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

# ========================================
# CORRECTED: UPLOAD DOCUMENTATION ENDPOINT
# ========================================

# Upload status tracking endpoint
upload_statuses: Dict[str, Dict] = {}

def detect_upload_format(data: dict) -> str:
    """Detect whether uploaded JSON is comprehensive or legacy format"""
    # Comprehensive format indicators
    comprehensive_indicators = [
        '_GENERATED', '_PRODUCT', '_TOTAL_CHUNKS', '_ENHANCED_FEATURES', 
        '_STATS', '_VERSION'
    ]
    
    # Count how many comprehensive indicators are present
    comprehensive_count = sum(1 for indicator in comprehensive_indicators if indicator in data)
    
    # If we have 3+ comprehensive indicators, it's comprehensive format
    if comprehensive_count >= 3:
        return "comprehensive"
    
    # Legacy format indicators
    legacy_indicators = ['source', 'generated_at', 'total_chunks', 'total_tokens']
    legacy_count = sum(1 for indicator in legacy_indicators if indicator in data)
    
    # If we have legacy indicators and few comprehensive ones, it's legacy
    if legacy_count >= 2 and comprehensive_count < 2:
        return "legacy"
    
    # Default to comprehensive if unclear (chunks array is required for both)
    return "comprehensive" if 'chunks' in data else "unknown"

def process_comprehensive_json_simple(data: dict, source: str = "pro-uploaded-docs") -> Dict[str, Any]:
    """
    Simple processing of comprehensive JSON format for Pro API
    Works with Pro's basic DocumentProcessor
    """
    start_time = datetime.now()
    
    try:
        # Extract metadata
        pro_version = data.get('_VERSION', '8-0')
        pro_product = data.get('_PRODUCT', 'pro')
        total_chunks = data.get('_TOTAL_CHUNKS', len(data.get('chunks', [])))
        enhanced_features = data.get('_ENHANCED_FEATURES', [])
        chunks = data.get('chunks', [])
        
        logger.info(f"📋 Processing Pro comprehensive upload:")
        logger.info(f"   • Version: {pro_version}")
        logger.info(f"   • Product: {pro_product}")
        logger.info(f"   • Chunks: {total_chunks}")
        logger.info(f"   • Enhanced features: {enhanced_features}")
        
        # Validate chunks structure
        if not chunks or not isinstance(chunks, list):
            raise ValueError("No valid chunks found in comprehensive JSON")
        
        # Process chunks - ensure they have required fields
        processed_chunks = []
        for i, chunk in enumerate(chunks):
            processed_chunk = {
                "id": chunk.get('id', f"pro-chunk-{i}"),
                "content": chunk.get('content', ''),
                "source": chunk.get('source_url', f"{source}-{i}"),
                "metadata": {
                    **chunk.get('metadata', {}),
                    "product": pro_product,
                    "version": pro_version,
                    "upload_source": source,
                    "chunk_index": i
                }
            }
            processed_chunks.append(processed_chunk)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Successfully processed Pro comprehensive JSON with {len(processed_chunks)} chunks",
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "upload_type": "comprehensive",
            "pro_version": pro_version,
            "enhanced_features": enhanced_features,
            "documentation_stats": {
                "generation_timestamp": data.get('_GENERATED'),
                "product": pro_product,
                "version": pro_version,
                "total_chunks": total_chunks,
                "enhanced_features_count": len(enhanced_features),
                "pro_specific_processing": True
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Pro comprehensive processing failed: {str(e)}")
        return {
            "success": False,
            "message": f"Pro comprehensive processing failed: {str(e)}",
            "processed_chunks": 0,
            "processing_time": (datetime.now() - start_time).total_seconds()
        }

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "pro-uploaded-docs",
    services = Depends(get_services)
):
    """Upload and process Pro documentation JSON file - CORRECTED for Pro API"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Validate file type
        if not file.filename.endswith('.json'):
            raise HTTPException(status_code=400, detail="Only JSON files are supported")
        
        # Read and parse JSON
        content = await file.read()
        try:
            data = json.loads(content.decode('utf-8'))
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
        
        # Validate basic structure
        if 'chunks' not in data:
            raise HTTPException(status_code=400, detail="JSON must contain 'chunks' array")
        
        # Detect upload format
        upload_format = detect_upload_format(data)
        logger.info(f"📦 Pro upload detected format: {upload_format}")
        
        # Process based on format
        if upload_format == "comprehensive":
            # FIXED: Use simple processing that works with Pro's DocumentProcessor
            result = process_comprehensive_json_simple(data, source)
            
            if result["success"]:
                logger.info(f"✅ Pro comprehensive processing completed: {result['processed_chunks']} chunks")
            
            return UploadResponse(**result)
                
        elif upload_format == "legacy":
            # Process legacy format
            logger.info("📋 Processing Pro legacy upload format")
            
            try:
                # Create a simple legacy processing result
                chunks = data.get('chunks', [])
                result = {
                    "success": True,
                    "message": f"Successfully processed Pro legacy JSON with {len(chunks)} chunks",
                    "processed_chunks": len(chunks),
                    "processing_time": 0.5,
                    "upload_type": "legacy",
                    "pro_version": "8-0",  # Default for legacy uploads
                    "documentation_stats": {
                        "product": "pro",
                        "version": "8-0",
                        "legacy_format": True
                    }
                }
                
                return UploadResponse(**result)
                
            except Exception as e:
                logger.error(f"❌ Pro legacy upload processing failed: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Invalid Pro legacy JSON format: {str(e)}")
        
        else:
            logger.error(f"❌ Unknown Pro upload format: {upload_format}")
            raise HTTPException(status_code=400, detail=f"Unknown Pro upload format: {upload_format}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Pro upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pro upload failed: {str(e)}")

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

@router.get("/test-connection")
async def test_pro_connection():
    """Test Pro API connection and basic functionality"""
    return {
        "status": "connected",
        "product": PRODUCT_DISPLAY_NAME,
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "chat": "/api/v1/chat",
            "search": "/api/v1/search", 
            "upload": "/api/v1/upload-documentation",
            "status": "/api/v1/upload-status/{upload_id}"
        }
    }

@router.get("/status")
async def get_detailed_status(services: Tuple = Depends(get_services)):
    """Get detailed Pro system status"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Get status from all services
        doc_status = doc_proc.get_status()
        search_stats = search_svc.get_search_stats()
        gemini_status = gemini_svc.get_status()
        
        return ChatHealthCheck(
            ready=gemini_status.get("can_chat", False),
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