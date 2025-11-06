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
        
        # Prepare conversation history for Gemini
        conversation_history = []
        if request.conversation_history:
            conversation_history = [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp
                }
                for msg in request.conversation_history[-10:]  # Keep last 10 messages
            ]
        
        # Prepare Pro-specific context for Gemini
        pro_context = {
            "product": PRODUCT_NAME,
            "product_display_name": PRODUCT_DISPLAY_NAME,
            "version": effective_version,
            "supported_versions": PRO_SUPPORTED_VERSIONS,
            "documentation_type": doc_type,
            "search_results": search_results.get("results", []),
            "conversation_context": request.context.dict() if request.context else {},
            "page_context": request.context.page if request.context else None
        }
        
        # Generate Pro response using Gemini
        chat_start = datetime.now()
        response_data = await gemini_service.generate_response(
            user_message=request.message,
            conversation_history=conversation_history,
            context=pro_context,
            product_name=PRODUCT_NAME
        )
        chat_time = (datetime.now() - chat_start).total_seconds() * 1000
        
        # Process response for Pro-specific enhancements
        response_text = response_data.get("response", "")
        
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
        
        # Create response
        chat_response = ChatResponse(
            response=response_text,
            conversation_id=request.conversation_id,
            metadata={
                "response_time_ms": chat_time,
                "processing_time": (chat_time + search_time) / 1000,
                "sources": source_docs,
                "confidence": response_data.get("confidence", 0.8),
                "version": effective_version,
                "context_info": {
                    "version": effective_version,
                    "detected_version": request.context.detected_version if request.context else None,
                    "is_manually_selected": request.context.is_version_manually_selected if request.context else False,
                    "documentation_type": doc_type,
                    "search_results_count": len(search_results.get("results", [])),
                    "search_time_ms": search_time
                },
                "model_used": response_data.get("model_used", "gemini-1.5-flash"),
                "tokens_used": response_data.get("tokens_used"),
                "version_specific": effective_version != "general",
                "feature_availability": {
                    "workflows": True,
                    "configurations": True,
                    "integrations": effective_version in ["7-9", "8-0"],
                    "advanced_monitoring": effective_version == "8-0"
                }
            },
            version_note=version_note,
            suggested_versions=["8-0"] if effective_version != "8-0" else None
        )
        
        logger.info(f"✅ Pro chat response generated in {chat_time + search_time:.0f}ms")
        return chat_response
        
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
            complexity_filter=request.complexity_filter
        )
        
        # Enhance results with Pro-specific metadata
        enhanced_results = []
        for result in search_results.get("results", []):
            enhanced_result = {
                **result,
                "metadata": {
                    "content_type": result.get("content_type"),
                    "complexity": result.get("complexity"),
                    "tags": result.get("tags", []),
                    "pro_version": effective_version,
                    "feature_category": result.get("feature_category"),
                    "workflow_related": "workflow" in result.get("content", "").lower(),
                    "configuration_related": "config" in result.get("content", "").lower()
                }
            }
            enhanced_results.append(enhanced_result)
        
        # Create search response
        response = SearchResponse(
            results=enhanced_results,
            total_found=search_results.get("total_found", len(enhanced_results)),
            query=request.query,
            processing_time=search_results.get("processing_time", 0.0),
            enhanced_features_used=True,
            relationship_enhanced_results=0,
            directories_searched=[f"pro/{effective_version}"],
            content_types_found=list(set(r.get("content_type") for r in enhanced_results if r.get("content_type"))),
            filters_applied={
                "version": effective_version,
                "content_type": request.content_type_filter,
                "complexity": request.complexity_filter
            },
            version_context=f"Results filtered for Pro {effective_version.replace('-', '.')}",
            suggested_refinements=[
                f"Try searching for '{request.query} workflow'",
                f"Try searching for '{request.query} configuration'"
            ] if len(enhanced_results) < 3 else None,
            related_topics=[
                "Pro Workflows",
                "Configuration Management", 
                "Integration Setup"
            ]
        )
        
        logger.info(f"✅ Pro search completed: {len(enhanced_results)} results")
        return response
        
    except Exception as e:
        logger.error(f"❌ Pro search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Pro documentation: {str(e)}"
        )

@router.post("/bulk-search", response_model=BulkSearchResponse)
async def bulk_search_pro_documentation(
    request: BulkSearchRequest,
    services: Tuple = Depends(get_services)
) -> BulkSearchResponse:
    """
    Perform multiple Pro documentation searches in one request
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        start_time = datetime.now()
        effective_version = normalize_pro_version(request.version)
        
        logger.info(f"🔍📚 Pro bulk search: {len(request.queries)} queries (version: {effective_version})")
        
        results = {}
        errors = {}
        
        for query in request.queries:
            try:
                # Create individual search request
                search_req = SearchRequest(
                    query=query,
                    max_results=request.max_results_per_query,
                    version=effective_version,
                    **request.shared_filters if request.shared_filters else {}
                )
                
                # Perform search
                search_result = await search_pro_documentation(search_req, services)
                results[query] = search_result
                
            except Exception as e:
                errors[query] = str(e)
                logger.error(f"❌ Pro bulk search error for '{query}': {str(e)}")
        
        total_time = (datetime.now() - start_time).total_seconds()
        
        # Find common topics across results
        all_content_types = []
        for result in results.values():
            all_content_types.extend(result.content_types_found)
        
        common_topics = list(set(all_content_types)) if all_content_types else []
        
        response = BulkSearchResponse(
            results=results,
            total_processing_time=total_time,
            queries_processed=len(request.queries),
            errors=errors if errors else None,
            version_used=effective_version,
            common_topics_found=common_topics[:5]  # Top 5 common topics
        )
        
        logger.info(f"✅ Pro bulk search completed: {len(results)} successful, {len(errors)} errors")
        return response
        
    except Exception as e:
        logger.error(f"❌ Pro bulk search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error performing Pro bulk search: {str(e)}"
        )

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_pro_documentation(
    request: ComprehensiveUploadRequest,
    background_tasks: BackgroundTasks,
    services: Tuple = Depends(get_services)
) -> UploadResponse:
    """
    Upload and process Pro documentation
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        logger.info(f"📤 Pro doc upload: {request.source_type}")
        
        # Generate upload ID
        upload_id = f"pro-upload-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        # Validate Pro version
        effective_version = normalize_pro_version(request.pro_version)
        
        # Process upload based on source type
        if request.source_type == "content":
            # Direct content upload
            processing_result = await doc_processor.process_content(
                content=request.source_data,
                version=effective_version,
                options=request.processing
            )
        elif request.source_type == "url":
            # URL-based upload
            processing_result = await doc_processor.process_url(
                url=request.source_data,
                version=effective_version,
                options=request.processing
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported source type: {request.source_type}"
            )
        
        # Create upload summary
        summary = {
            "total_documents": 1,
            "successful_uploads": 1 if processing_result.get("success") else 0,
            "failed_uploads": 0 if processing_result.get("success") else 1,
            "skipped_documents": 0,
            "total_chunks_created": processing_result.get("chunks_created", 0),
            "total_tokens_processed": processing_result.get("tokens_processed", 0),
            "total_processing_time_ms": processing_result.get("processing_time_ms", 0),
            "pro_versions_processed": [effective_version],
            "content_types_found": {processing_result.get("content_type", "general"): 1},
            "complexity_distribution": {processing_result.get("complexity", "moderate"): 1}
        }
        
        # Update search index in background if requested
        if request.save_to_index and processing_result.get("success"):
            background_tasks.add_task(
                search_service.update_index,
                processing_result.get("chunks", [])
            )
        
        response = UploadResponse(
            success=processing_result.get("success", False),
            message=f"Pro documentation processed successfully" if processing_result.get("success") else "Processing failed",
            upload_id=upload_id,
            summary=summary,
            results=[processing_result],
            preview_chunks=processing_result.get("chunks", [])[:3] if request.generate_preview else None,
            pro_index_updated=request.save_to_index and processing_result.get("success"),
            version_compatibility={effective_version: True}
        )
        
        logger.info(f"✅ Pro upload completed: {upload_id}")
        return response
        
    except Exception as e:
        logger.error(f"❌ Pro upload error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading Pro documentation: {str(e)}"
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