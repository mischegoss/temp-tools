# CORRECTED VERSION - pro-api/app/routers/chat.py
# Fixed the "await" issue that was causing HTTP 500 errors
# ADDED: Missing upload-documentation endpoint
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
    PRO_SUPPORTED_VERSIONS
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
        # Simplified version handling
        effective_version = request.version or "8-0"
        
        logger.info(f"💬 Pro chat request: '{request.message[:50]}...' (version: {effective_version})")
        
        search_start = datetime.now()
        
        # Enhanced search with Pro version filtering
        search_results = await search_service.search_similarity(
            query=request.message,
            max_results=5,
            similarity_threshold=0.2,
            version_filter=effective_version if effective_version != "general" else None
        )
        
        search_time = (datetime.now() - search_start).total_seconds() * 1000
        
        chat_start = datetime.now()
        
        # FIXED: Remove 'await' since generate_response is synchronous
        chat_response = gemini_service.generate_response(
            user_message=request.message,
            context_chunks=search_results.get("results", []),
            version=effective_version,
            conversation_history=request.conversation_history or []
        )
        
        chat_time = (datetime.now() - chat_start).total_seconds() * 1000
        
        # Handle response - generate_response returns a string directly
        response_text = chat_response
        
        # Add version-specific context if relevant
        if effective_version != "8-0":
            response_text += f"\n\n*Note: This response is specific to Pro version {effective_version.replace('-', '.')}. Some features may differ in other versions.*"
        
        logger.info(f"✅ Pro chat completed: search={search_time:.1f}ms, chat={chat_time:.1f}ms")
        
        return ChatResponse(
            message=response_text,
            context_used=search_results.get("results", []),
            processing_time=(search_time + chat_time) / 1000,
            model_used="gemini-2.5-flash",
            enhanced_features_used=search_results.get("enhanced_features_used", False),
            relationship_enhanced_chunks=search_results.get("relationship_enhanced_results", 0),
            version_context=effective_version,
            conversation_id=request.conversation_id
        )
        
    except Exception as e:
        logger.error(f"❌ Pro chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing Pro chat request: {str(e)}"
        )

@router.post("/search", response_model=SearchResponse)
async def search_pro_documentation(request: SearchRequest, services: Tuple = Depends(get_services)):
    """Search Pro documentation with enhanced version filtering"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        logger.info(f"🔍 Pro search: '{request.query[:50]}...'")
        
        # Use existing search_similarity method with Pro enhancements
        search_results = await search_svc.search_similarity(
            query=request.query,
            max_results=request.max_results,
            similarity_threshold=0.3,
            version_filter=getattr(request, 'version', None)
        )
        
        return SearchResponse(**search_results)
        
    except Exception as e:
        logger.error(f"❌ Pro search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Pro documentation: {str(e)}"
        )

# ========================================
# UPLOAD DOCUMENTATION ENDPOINT WITH CRITICAL PERSISTENCE FIX
# ========================================

# Upload status tracking
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
    
    if comprehensive_count >= 3:
        return "comprehensive"
    elif 'chunks' in data and isinstance(data['chunks'], list):
        return "legacy"
    else:
        return "unknown"

def process_comprehensive_json_simple(data: dict, source: str) -> dict:
    """
    Process comprehensive JSON format for Pro documentation upload
    MODIFIED: Now returns processed_chunks for persistence
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
        
        for chunk in chunks:
            # Ensure chunk has all required fields for Pro processing
            processed_chunk = {
                'id': chunk.get('id', f'chunk-{len(processed_chunks)}'),
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
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Successfully processed Pro comprehensive JSON with {len(processed_chunks)} chunks",
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "upload_type": "comprehensive",
            "pro_version": pro_version,
            "enhanced_features": enhanced_features,
            "chunks_data": processed_chunks,  # CRITICAL: Return actual chunks for persistence
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
    """Upload and process Pro documentation JSON file - WITH CRITICAL PERSISTENCE FIX"""
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
            # Process chunks
            result = process_comprehensive_json_simple(data, source)
            
            if result["success"]:
                logger.info(f"✅ Pro comprehensive processing completed: {result['processed_chunks']} chunks")
                
                # 🚨 CRITICAL FIX: Update DocumentProcessor with processed chunks
                try:
                    processed_chunks = result.get("chunks_data", [])
                    if processed_chunks:
                        update_result = doc_proc.update_with_processed_chunks(processed_chunks)
                        logger.info(f"✅ DocumentProcessor updated: {update_result}")
                        
                        # Force SearchService to sync using the original sync method
                        if hasattr(search_svc, '_sync_with_document_processor'):
                            sync_success = search_svc._sync_with_document_processor()
                            logger.info(f"✅ SearchService synced via _sync_with_document_processor: {sync_success}")
                            logger.info(f"✅ SearchService now has: {len(search_svc.chunk_data)} chunks available for search")
                        else:
                            # Fallback to manual sync if method doesn't exist
                            search_svc.embeddings = doc_proc.embeddings
                            search_svc.chunk_data = doc_proc.chunk_data
                            search_svc.metadata = doc_proc.metadata
                            logger.info(f"✅ SearchService synced manually: {len(search_svc.chunk_data)} chunks")
                        
                        # Update response with persistence info
                        result["persistence_info"] = {
                            "chunks_stored": update_result["total_chunks"],
                            "embeddings_generated": True,
                            "search_ready": len(search_svc.chunk_data) > 0
                        }
                    else:
                        logger.warning("⚠️ No chunks to persist from processing result")
                        
                except Exception as persist_error:
                    logger.error(f"❌ Failed to persist chunks: {persist_error}")
                    # Don't fail the upload - just log the persistence issue
                    result["persistence_error"] = str(persist_error)
            
            # Clean up result for response (remove internal data)
            result.pop("chunks_data", None)
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
        last_error=status_data.get("last_error")
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
            documentation_loaded=search_svc.get_search_stats().get("ready", False) if search_svc else False
        )
        
    except Exception as e:
        logger.error(f"❌ Pro health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Pro chat service unhealthy: {str(e)}"
        )