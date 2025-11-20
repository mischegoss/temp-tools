# CONSERVATIVE VERSION - app/routers/chat.py  
# Full backward compatibility - uses only existing model fields
# Version-segregated storage without breaking existing APIs

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
    BACKWARD COMPATIBLE: Same signature
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
    """Detect whether uploaded JSON is comprehensive or legacy format - BACKWARD COMPATIBLE"""
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

def process_comprehensive_json_conservative(data: dict, source: str, doc_processor, search_service) -> dict:
    """
    CONSERVATIVE: Process comprehensive JSON using only existing model fields
    Version segregation without breaking backward compatibility
    """
    start_time = datetime.now()
    
    try:
        # Extract comprehensive metadata
        pro_product = data.get('_PRODUCT', 'pro')
        pro_version = data.get('_VERSION', '8-0')
        total_chunks = data.get('_TOTAL_CHUNKS', 0)
        enhanced_features = data.get('_ENHANCED_FEATURES', [])
        
        logger.info(f"📦 Processing Pro comprehensive upload: {total_chunks} chunks, version {pro_version}")
        
        # Process chunks with proper format
        processed_chunks = []
        chunks = data.get('chunks', [])
        
        for i, chunk in enumerate(chunks):
            # Ensure chunk has all required fields
            processed_chunk = {
                'id': chunk.get('id', f'chunk-{i}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('original_content', chunk.get('content', '')),
                'header': chunk.get('header', ''),
                'source_url': chunk.get('source_url', ''),  # ✅ URLs preserved from upload script
                'page_title': chunk.get('page_title', ''),
                'content_type': chunk.get('content_type', {
                    'type': 'documentation',
                    'category': 'pro'
                }),
                'complexity': chunk.get('complexity', 'moderate'),
                'tokens': chunk.get('tokens', 0),
                'source': chunk.get('source_url', f'Pro Documentation'),  # For search results
                'metadata': {
                    **(chunk.get('metadata', {})),
                    'product': 'pro',
                    'version': pro_version,
                    'upload_timestamp': datetime.now().timestamp(),
                    'pro_version_display': pro_version.replace('-', '.'),
                    'is_current_version': pro_version == '8-0',
                    'version_family': 'pro',
                    'source': source,
                    'source_url': chunk.get('source_url', '')  # ✅ URLs in metadata
                }
            }
            
            processed_chunks.append(processed_chunk)
        
        # CONSERVATIVE VERSION STORAGE: Use conservative DocumentProcessor method
        pipeline_success = False
        pipeline_message = ""
        
        try:
            logger.info(f"🔧 Updating version-segregated storage for Pro {pro_version}...")
            
            # Use conservative method that exists
            success = doc_processor.update_version_data(pro_version, processed_chunks)
            
            if success:
                # Trigger sync in search service using conservative method
                if hasattr(search_service, '_sync_with_document_processor'):
                    search_service._sync_with_document_processor()
                
                pipeline_success = True
                pipeline_message = f"Successfully stored {len(processed_chunks)} chunks for Pro version {pro_version}"
                logger.info(f"✅ Version {pro_version}: {len(processed_chunks)} chunks stored and synced")
            else:
                pipeline_message = f"Failed to store version data for {pro_version}"
                
        except Exception as pipeline_error:
            logger.error(f"❌ Version storage failed: {pipeline_error}")
            pipeline_message = f"Storage failed: {str(pipeline_error)}"
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # CONSERVATIVE RESPONSE: Only use fields that exist in UploadResponse model
        success_message = f"Successfully processed Pro {pro_version} documentation with {len(processed_chunks)} chunks"
        if pipeline_success:
            success_message += f". Version-segregated storage updated successfully"
        else:
            success_message += f". Warning: {pipeline_message}"
        
        return {
            "success": True,
            "message": success_message,
            "chunks_processed": len(processed_chunks),  # ✅ Field exists
            "processing_time": processing_time,         # ✅ Field exists
            "upload_id": f"pro-{pro_version}-{int(datetime.now().timestamp())}", # ✅ Field exists
            "status": UploadStatus.COMPLETED            # ✅ Field exists
        }
        
    except Exception as e:
        logger.error(f"❌ Pro comprehensive processing failed: {str(e)}")
        return {
            "success": False,
            "message": f"Pro comprehensive processing failed: {str(e)}",
            "chunks_processed": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "upload_id": None,
            "status": UploadStatus.FAILED
        }

def process_legacy_json_conservative(data: dict, source: str, doc_processor, search_service) -> dict:
    """
    CONSERVATIVE: Process legacy JSON using only existing model fields
    """
    start_time = datetime.now()
    
    try:
        chunks = data.get('chunks', [])
        logger.info(f"📋 Processing Pro legacy upload: {len(chunks)} chunks")
        
        # Convert legacy chunks to Pro format (default to version 8-0)
        processed_chunks = []
        
        for i, chunk in enumerate(chunks):
            processed_chunk = {
                'id': chunk.get('id', f'legacy-chunk-{i}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('content', ''),
                'header': chunk.get('title', ''),
                'source_url': chunk.get('url', ''),  # ✅ Preserve legacy URLs
                'page_title': chunk.get('page_title', ''),
                'content_type': {
                    'type': 'documentation',
                    'category': 'pro'
                },
                'complexity': 'moderate',
                'tokens': len(chunk.get('content', '').split()),
                'source': chunk.get('url', f'Pro Documentation'),
                'metadata': {
                    **(chunk.get('metadata', {})),
                    'product': 'pro',
                    'version': '8-0',  # Default for legacy
                    'upload_timestamp': datetime.now().timestamp(),
                    'upload_format': 'legacy',
                    'source': source,
                    'source_url': chunk.get('url', '')  # ✅ URLs preserved
                }
            }
            processed_chunks.append(processed_chunk)
        
        # Store using conservative method
        pipeline_success = False
        try:
            success = doc_processor.update_version_data('8-0', processed_chunks)
            if success and hasattr(search_service, '_sync_with_document_processor'):
                search_service._sync_with_document_processor()
                pipeline_success = True
        except Exception as e:
            logger.error(f"Failed to store legacy data: {e}")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        success_message = f"Successfully processed Pro legacy JSON with {len(processed_chunks)} chunks"
        if pipeline_success:
            success_message += " and updated search index"
        
        return {
            "success": True,
            "message": success_message,
            "chunks_processed": len(processed_chunks),
            "processing_time": processing_time,
            "upload_id": f"pro-legacy-{int(datetime.now().timestamp())}",
            "status": UploadStatus.COMPLETED
        }
        
    except Exception as e:
        logger.error(f"❌ Pro legacy processing failed: {str(e)}")
        return {
            "success": False,
            "message": f"Pro legacy processing failed: {str(e)}",
            "chunks_processed": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "upload_id": None,
            "status": UploadStatus.FAILED
        }

# ========================================
# CORE ENDPOINTS - BACKWARD COMPATIBLE
# ========================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_pro_documentation(
    request: ChatRequest,
    services: Tuple = Depends(get_services)
) -> ChatResponse:
    """
    Chat endpoint with version-aware search - BACKWARD COMPATIBLE
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        
        logger.info(f"💬 Pro chat request: '{request.message[:50]}...' (version: {effective_version})")
        
        # Use existing GeminiService.chat() method
        response = gemini_service.chat(request)
        
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
    Search Pro documentation - BACKWARD COMPATIBLE with version awareness
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        
        logger.info(f"🔍 Pro search: '{request.query}' (version: {effective_version})")
        
        # Use conservative search that handles version filtering
        search_results = await search_service.search_similarity(
            query=request.query,
            max_results=request.max_results,
            similarity_threshold=getattr(request, 'similarity_threshold', 0.3),  # Safe access
            version_filter=effective_version,
            content_type_filter=request.content_type_filter,
            complexity_filter=getattr(request, 'complexity_filter', None)  # Safe access
        )
        
        # Convert to SearchResponse format
        return SearchResponse(**search_results)
        
    except Exception as e:
        logger.error(f"❌ Pro search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Pro documentation: {str(e)}"
        )

# ========================================
# UPLOAD DOCUMENTATION ENDPOINT - CONSERVATIVE
# ========================================

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "pro-uploaded-docs",
    services = Depends(get_services)
):
    """
    CONSERVATIVE: Upload Pro documentation with version-segregated storage
    Uses only existing UploadResponse fields for compatibility
    """
    try:
        doc_processor, search_service, gemini_service = services
        
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
        
        # Process using conservative methods
        if upload_format == "comprehensive":
            result = process_comprehensive_json_conservative(data, source, doc_processor, search_service)
            
            if result["success"]:
                version = data.get('_VERSION', '8-0')
                logger.info(f"✅ Pro comprehensive processing completed for version {version}: {result['chunks_processed']} chunks")
            
            return UploadResponse(**result)
                
        elif upload_format == "legacy":
            result = process_legacy_json_conservative(data, source, doc_processor, search_service)
            
            if result["success"]:
                logger.info(f"✅ Pro legacy processing completed: {result['chunks_processed']} chunks")
            
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
    """Get Pro upload status - BACKWARD COMPATIBLE"""
    if upload_id in upload_statuses:
        return upload_statuses[upload_id]
    else:
        raise HTTPException(status_code=404, detail="Upload ID not found")

# ========================================
# BULK OPERATIONS - BACKWARD COMPATIBLE
# ========================================

@router.post("/bulk-search", response_model=BulkSearchResponse)
async def bulk_search_pro(request: BulkSearchRequest, services: Tuple = Depends(get_services)):
    """Perform bulk search - BACKWARD COMPATIBLE"""
    try:
        doc_processor, search_service, gemini_service = services
        
        results = {}
        start_time = datetime.now()
        
        for query in request.queries:
            search_result = await search_service.search_similarity(
                query=query,
                max_results=request.max_results_per_query,
                version_filter=request.version
            )
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
# HEALTH AND STATUS ENDPOINTS - BACKWARD COMPATIBLE
# ========================================

@router.get("/health", response_model=ChatHealthCheck)
async def health_check(services: Tuple = Depends(get_services)):
    """Pro system health check - BACKWARD COMPATIBLE"""
    try:
        doc_processor, search_service, gemini_service = services
        
        # Get status from all services
        doc_status = doc_processor.get_status() if doc_processor else {}
        search_status = search_service.get_status() if search_service else {}
        gemini_status = gemini_service.get_status() if gemini_service else {}
        
        # Check for version data if methods exist
        has_version_data = False
        if hasattr(doc_processor, 'get_all_versions'):
            versions = doc_processor.get_all_versions()
            has_version_data = len(versions) > 0
        
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
    """Get Pro upload processing status - BACKWARD COMPATIBLE"""
    try:
        doc_processor, search_service, gemini_service = services
        
        # Get comprehensive status
        doc_status = doc_processor.get_status() if doc_processor else {}
        search_stats = search_service.get_search_stats() if search_service else {}
        
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
    """Test Pro API connection - BACKWARD COMPATIBLE"""
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
    """Get detailed Pro system status - BACKWARD COMPATIBLE"""
    try:
        doc_processor, search_service, gemini_service = services
        
        # Get status from all services
        doc_status = doc_processor.get_status()
        search_stats = search_service.get_search_stats()
        gemini_status = gemini_service.get_status()
        
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
            documentation_loaded=search_service.get_search_stats().get("ready", False) if search_service else False
        )
        
    except Exception as e:
        logger.error(f"❌ Pro health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Pro chat service unhealthy: {str(e)}"
        )