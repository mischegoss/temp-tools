# COMPLETE FIXED VERSION - app/routers/chat.py
# CRITICAL FIX: Proper integration between search, gemini, and response with sources
# Fixed all method name mismatches and field name issues

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, Tuple, Dict, Any, List
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

# Upload status tracking
upload_statuses: Dict[str, Dict] = {}

def detect_upload_format(data: dict) -> str:
    """Detect whether uploaded JSON is comprehensive or legacy format"""
    comprehensive_indicators = [
        '_GENERATED', '_PRODUCT', '_TOTAL_CHUNKS', '_ENHANCED_FEATURES', 
        '_STATS', '_VERSION'
    ]
    
    comprehensive_count = sum(1 for indicator in comprehensive_indicators if indicator in data)
    
    if comprehensive_count >= 3:
        return "comprehensive"
    elif 'chunks' in data and isinstance(data['chunks'], list):
        return "legacy"
    else:
        return "unknown"

def process_comprehensive_json_with_search_connection(data: dict, source: str, search_service) -> dict:
    """
    Process comprehensive JSON format with search service connection
    """
    start_time = datetime.now()
    
    try:
        # Extract comprehensive metadata
        pro_product = data.get('_PRODUCT', 'pro')
        pro_version = data.get('_VERSION', '8-0')
        total_chunks = data.get('_TOTAL_CHUNKS', 0)
        enhanced_features = data.get('_ENHANCED_FEATURES', [])
        
        logger.info(f"📦 Processing Pro comprehensive upload: {total_chunks} chunks, version {pro_version}")
        
        # Process chunks
        processed_chunks = []
        chunks = data.get('chunks', [])
        
        for i, chunk in enumerate(chunks):
            # Ensure chunk has all required fields for Pro processing
            processed_chunk = {
                'id': chunk.get('id', f'chunk-{i}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('original_content', chunk.get('content', '')),
                'header': chunk.get('header', ''),
                'source_url': chunk.get('source_url', ''),
                'page_title': chunk.get('page_title', ''),
                'content_type': chunk.get('content_type', {
                    'type': 'documentation',
                    'category': 'pro'
                }),
                'complexity': chunk.get('complexity', 'moderate'),
                'tokens': chunk.get('tokens', 0),
                'metadata': {
                    **(chunk.get('metadata', {})),
                    'product': 'pro',
                    'version': pro_version,
                    'upload_timestamp': datetime.now().timestamp(),
                    'pro_version_display': pro_version.replace('-', '.'),
                    'is_current_version': pro_version == '8-0',
                    'version_family': 'pro',
                    'source': source
                }
            }
            
            processed_chunks.append(processed_chunk)
        
        # CRITICAL FIX: Connect processed chunks to search service
        search_connection_success = False
        search_error = None
        
        try:
            if search_service and hasattr(search_service, 'load_new_data'):
                logger.info(f"🔗 Connecting {len(processed_chunks)} chunks to Pro search service...")
                search_service.load_new_data(processed_chunks)
                search_connection_success = True
                logger.info("✅ Successfully connected upload to Pro search service")
            else:
                logger.warning("⚠️ Search service not available or missing load_new_data method")
                search_error = "Search service not available"
        except Exception as search_exc:
            logger.error(f"❌ Failed to connect to search service: {search_exc}")
            search_error = str(search_exc)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Successfully processed Pro comprehensive JSON with {len(processed_chunks)} chunks" + 
                      (" and connected to search service" if search_connection_success else " (search connection failed)"),
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "upload_type": "comprehensive",
            "pro_version": pro_version,
            "enhanced_features": enhanced_features,
            "search_connected": search_connection_success,
            "search_error": search_error,
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
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "search_connected": False,
            "search_error": str(e)
        }

def process_legacy_json_with_search_connection(data: dict, source: str, search_service) -> dict:
    """
    Process legacy JSON format with search service connection
    """
    start_time = datetime.now()
    
    try:
        chunks = data.get('chunks', [])
        logger.info(f"📋 Processing Pro legacy upload: {len(chunks)} chunks")
        
        # Convert legacy chunks to Pro format
        processed_chunks = []
        
        for i, chunk in enumerate(chunks):
            processed_chunk = {
                'id': chunk.get('id', f'legacy-chunk-{i}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('content', ''),
                'header': chunk.get('title', ''),
                'source_url': chunk.get('url', ''),
                'page_title': chunk.get('page_title', ''),
                'content_type': {
                    'type': 'documentation',
                    'category': 'pro'
                },
                'complexity': 'moderate',
                'tokens': len(chunk.get('content', '').split()),
                'metadata': {
                    **(chunk.get('metadata', {})),
                    'product': 'pro',
                    'version': '8-0',  # Default for legacy
                    'upload_timestamp': datetime.now().timestamp(),
                    'upload_format': 'legacy',
                    'source': source
                }
            }
            processed_chunks.append(processed_chunk)
        
        # Connect processed chunks to search service
        search_connection_success = False
        search_error = None
        
        try:
            if search_service and hasattr(search_service, 'load_new_data'):
                logger.info(f"🔗 Connecting {len(processed_chunks)} legacy chunks to Pro search service...")
                search_service.load_new_data(processed_chunks)
                search_connection_success = True
                logger.info("✅ Successfully connected legacy upload to Pro search service")
            else:
                logger.warning("⚠️ Search service not available or missing load_new_data method")
                search_error = "Search service not available"
        except Exception as search_exc:
            logger.error(f"❌ Failed to connect legacy upload to search service: {search_exc}")
            search_error = str(search_exc)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Successfully processed Pro legacy JSON with {len(processed_chunks)} chunks" + 
                      (" and connected to search service" if search_connection_success else " (search connection failed)"),
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "upload_type": "legacy",
            "pro_version": "8-0",
            "search_connected": search_connection_success,
            "search_error": search_error
        }
        
    except Exception as e:
        logger.error(f"❌ Pro legacy processing failed: {str(e)}")
        return {
            "success": False,
            "message": f"Pro legacy processing failed: {str(e)}",
            "processed_chunks": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "search_connected": False,
            "search_error": str(e)
        }

# ========================================
# CORE ENDPOINTS - FIXED INTEGRATION
# ========================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_pro_documentation(
    request: ChatRequest,
    services: Tuple = Depends(get_services)
) -> ChatResponse:
    """
    CRITICAL FIX: Chat endpoint with proper search-gemini integration and source attribution
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        
        logger.info(f"💬 Pro chat request: '{request.message[:50]}...' (version: {effective_version})")
        
        # FIXED: Use the GeminiService.chat() method which now performs its own search
        # This ensures proper integration between search and response generation
        response = gemini_service.chat(request)
        
        # The GeminiService.chat() method now:
        # 1. Performs search using search_service.search_similarity()
        # 2. Uses search results as context in prompt
        # 3. Returns properly formatted ChatResponse with sources
        
        logger.info(f"✅ Pro chat response generated successfully")
        return response
        
    except Exception as e:
        logger.error(f"❌ Pro chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing Pro chat request: {str(e)}"
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
        
        # Use the main search method
        search_results = search_service.search(request)
        
        # Convert to SearchResponse format
        return SearchResponse(**search_results)
        
    except Exception as e:
        logger.error(f"❌ Pro search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Pro documentation: {str(e)}"
        )

# ========================================
# UPLOAD DOCUMENTATION ENDPOINT - FIXED
# ========================================

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "pro-uploaded-docs",
    services = Depends(get_services)
):
    """
    Upload and process Pro documentation JSON file with search service connection
    """
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
        
        # Process based on format WITH SEARCH CONNECTION
        if upload_format == "comprehensive":
            result = process_comprehensive_json_with_search_connection(data, source, search_svc)
            
            if result["success"]:
                logger.info(f"✅ Pro comprehensive processing completed: {result['processed_chunks']} chunks")
            
            return UploadResponse(**result)
                
        elif upload_format == "legacy":
            result = process_legacy_json_with_search_connection(data, source, search_svc)
            
            if result["success"]:
                logger.info(f"✅ Pro legacy processing completed: {result['processed_chunks']} chunks")
            
            return UploadResponse(**result)
        
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported upload format: {upload_format}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Pro upload processing failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Upload processing failed: {str(e)}"
        )

@router.get("/upload-status/{upload_id}")
async def get_upload_status(upload_id: str):
    """Get Pro upload status"""
    if upload_id in upload_statuses:
        return upload_statuses[upload_id]
    else:
        raise HTTPException(status_code=404, detail="Upload ID not found")

# ========================================
# BULK OPERATIONS
# ========================================

@router.post("/bulk-search", response_model=BulkSearchResponse)
async def bulk_search_pro(request: BulkSearchRequest, services: Tuple = Depends(get_services)):
    """Perform bulk search across multiple Pro queries"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        results = {}
        start_time = datetime.now()
        
        for query in request.queries:
            search_request = SearchRequest(
                query=query,
                max_results=request.max_results_per_query,
                version=request.version
            )
            search_result = search_svc.search(search_request)
            results[query] = SearchResponse(**search_result)
        
        total_time = (datetime.now() - start_time).total_seconds()
        
        return BulkSearchResponse(
            results=results,
            total_processing_time=total_time,
            queries_processed=len(request.queries)
        )
        
    except Exception as e:
        logger.error(f"❌ Pro bulk search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Bulk search failed: {str(e)}"
        )

# ========================================
# HEALTH AND STATUS ENDPOINTS
# ========================================

@router.get("/health", response_model=ChatHealthCheck)
async def health_check(services: Tuple = Depends(get_services)):
    """Pro system health check"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Get status from all services
        doc_status = doc_proc.get_status() if doc_proc else {}
        search_status = search_svc.get_status() if search_svc else {}
        gemini_status = gemini_svc.get_status() if gemini_svc else {}
        
        return ChatHealthCheck(
            ready=all([
                doc_status.get("ready", False),
                search_status.get("ready", False),
                gemini_status.get("ready", False)
            ]),
            model_loaded=doc_status.get("model_loaded", False),
            last_response_time=gemini_status.get("last_response_time"),
            error_rate=gemini_status.get("error_rate", 0.0),
            pro_version_support={
                "7-8": True,
                "7-9": True, 
                "8-0": True,
                "general": True
            },
            documentation_loaded=search_status.get("ready", False) and search_status.get("chunks_count", 0) > 0
        )
        
    except Exception as e:
        logger.error(f"❌ Pro health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Pro chat service unhealthy: {str(e)}"
        )

@router.get("/upload-status", response_model=StatusResponse)
async def get_upload_processing_status(services: Tuple = Depends(get_services)):
    """Get Pro upload processing status"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Get comprehensive status
        doc_status = doc_proc.get_status() if doc_proc else {}
        search_stats = search_svc.get_search_stats() if search_svc else {}
        
        status_data = {
            **doc_status,
            **search_stats,
            "upload_processor_ready": True,
            "pro_features": len([f for f in ["embeddings", "search", "chat"] if True]),
            "version": "8-0"
        }
        
        return StatusResponse(
            status=ProcessingStatus.READY if status_data.get("ready") else ProcessingStatus.ERROR,
            message="Pro upload processor ready" if status_data.get("ready") else "Pro upload processor not ready",
            chunks_processed=status_data.get("chunks_count", 0),
            embeddings_generated=status_data.get("embeddings_count", 0),
            last_processing_time=status_data.get("last_response_time", 0),
            error_details=status_data.get("last_error"),
            pro_features_detected=status_data.get("pro_features", 0),
            current_pro_version=status_data.get("version")
        )
        
    except Exception as e:
        logger.error(f"❌ Pro upload status check failed: {str(e)}")
        
        return StatusResponse(
            status=ProcessingStatus.ERROR,
            message=f"Status check failed: {str(e)}",
            chunks_processed=0,
            embeddings_generated=0,
            last_processing_time=0,
            error_details=str(e),
            pro_features_detected=0,
            current_pro_version="8-0"
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
            "status": "/api/v1/upload-status"
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
            ready=gemini_status.get("ready", False),
            model_loaded=gemini_status.get("model_loaded", False),
            last_response_time=gemini_status.get("last_response_time"),
            error_rate=gemini_status.get("error_rate", 0.0),
            pro_version_support={
                "7-8": True,
                "7-9": True, 
                "8-0": True,
                "general": True
            },
            documentation_loaded=search_svc.get_search_stats().get("ready", False) if search_svc else False
        )
        
    except Exception as e:
        logger.error(f"❌ Pro health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Pro chat service unhealthy: {str(e)}"
        )