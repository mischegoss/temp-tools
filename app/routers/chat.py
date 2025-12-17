# express-api/app/routers/chat.py
# Updated for Express with proper version handling and chat logging
# FIXED: Removed content_type_filter from chat endpoint to prevent over-filtering
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
    EXPRESS_SUPPORTED_VERSIONS,
    EXPRESS_DEFAULT_VERSION,
    normalize_express_version,
    detect_express_documentation_type
)
from app.prompts.express_prompts import format_version_display

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["express-chat"])

def get_services() -> Tuple:
    """
    Dependency to get initialized Express services from main app.
    No initialization - just access pre-initialized services and validate readiness.
    """
    # Import at runtime to avoid circular import
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
            detail="Express services not ready. Please wait for application startup to complete."
        )
    
    return doc_processor, search_service, gemini_service

@router.post("/chat", response_model=ChatResponse)
async def chat_with_express_documentation(
    request: ChatRequest,
    services: Tuple = Depends(get_services)
) -> ChatResponse:
    """
    Chat endpoint specifically for Express documentation with version awareness
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Express version
        effective_version = normalize_express_version(request.version)
        original_version = request.version  # Track original for warning
        
        # Detect documentation type from context (used for logging only now)
        doc_type = detect_express_documentation_type(request.message)
        
        # Get display version for logging
        version_display = format_version_display(effective_version)
        
        logger.info(f"💬 Express chat request: '{request.message[:50]}...' (version: {version_display})")
        
        # ========================================
        # QUERY EXPANSION
        # ========================================
        expanded_query = gemini_service.expand_query(request.message)
        logger.info(f"🔍 Using query: '{expanded_query[:100]}...'")
        
        search_start = datetime.now()
        
        # FIXED: Removed content_type_filter to prevent over-filtering
        # The doc_type detection was too aggressive and filtered out relevant results
        search_results = search_service.search_similarity(
            query=expanded_query,
            max_results=15,
            similarity_threshold=0.2,
            version_filter=effective_version,
            content_type_filter=None  # FIXED: Don't filter by content type for chat
        )
        
        search_time = (datetime.now() - search_start).total_seconds() * 1000
        
        # ========================================
        # ZERO RESULTS HANDLING
        # ========================================
        results_list = search_results.get("results", [])
        
        if len(results_list) == 0:
            logger.warning(f"⚠️ Zero results found for query: '{request.message}' (version: {effective_version})")
            
            # Call Gemini with NO context but block URLs to prevent hallucinations
            chat_start = datetime.now()
            
            chat_response = gemini_service.generate_response(
                user_message=request.message,
                context_chunks=[],  # No context from docs
                version=effective_version,
                conversation_history=request.conversation_history or [],
                block_urls=True  # Prevent fake documentation URLs
            )
            
            chat_time = (datetime.now() - chat_start).total_seconds() * 1000
            
            # Prepend disclaimer to response
            response_with_disclaimer = f"**No exact matches found in Express {version_display} documentation. This is a general response:**\n\n{chat_response}"
            
            # NEW: Log the interaction
            import app.main as main_app  # Import at runtime to avoid circular import
            if main_app.chat_logger:
                main_app.chat_logger.log_interaction(
                    prompt=request.message,
                    response=response_with_disclaimer,
                    metadata={
                        "version": effective_version,
                        "processing_time_ms": chat_time + search_time,
                        "conversation_id": request.conversation_id,
                        "chunks_used": 0,
                        "search_time_ms": search_time,
                        "chat_time_ms": chat_time,
                        "zero_results": True,
                        "model_used": "gemini-2.5-flash-general"
                    }
                )
            
            return ChatResponse(
                message=response_with_disclaimer,
                context_used=[],  # No sources
                processing_time=(chat_time + search_time) / 1000,
                model_used="gemini-2.5-flash-general",
                enhanced_features_used=False,
                relationship_enhanced_chunks=0,
                version_context=f"Express {version_display} (general)",
                conversation_id=request.conversation_id
            )
        
        # ========================================
        # NORMAL FLOW: We have results, proceed with Gemini
        # ========================================
        chat_start = datetime.now()
        
        # Generate response with context
        chat_response = gemini_service.generate_response(
            user_message=request.message,
            context_chunks=results_list,
            version=effective_version,
            conversation_history=request.conversation_history or []
        )
        
        chat_time = (datetime.now() - chat_start).total_seconds() * 1000
        
        # Handle response - generate_response returns a string directly
        response_text = chat_response
        
        # ========================================
        # UNSUPPORTED VERSION WARNING
        # ========================================
        # Check if original version was valid
        valid_express_versions = [
            "on-premise-2-5", "on-premise-2-4", "on-premise-2-1",
            "On-Premise 2.5", "On-Premise 2.4", "On-Premise 2.1",
            "2.5", "2.4", "2.1", "2-5", "2-4", "2-1"
        ]
        if original_version and original_version not in valid_express_versions and original_version not in EXPRESS_SUPPORTED_VERSIONS:
            # User requested an unsupported version
            response_text += f"\n\n*Note: This response is from Express On-Premise 2.5 (most recent version) as Express {original_version} documentation is not available.*"
        elif effective_version != EXPRESS_DEFAULT_VERSION:
            # Add version-specific context for older versions
            response_text += f"\n\n*Note: This response is specific to Express {version_display}. Some features may differ in other versions.*"
        
        # Prepare source documents
        source_docs = []
        for result in results_list:
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
            context_used=[
                {
                    "content": result.get("content", ""),
                    "source": result.get("source_url", ""),
                    "score": result.get("similarity_score", 0.0),
                    "metadata": {
                        "page_title": result.get("page_title", ""),
                        "version": effective_version
                    }
                } for result in results_list[:3]
            ],
            processing_time=(chat_time + search_time) / 1000,
            model_used="gemini-2.5-flash",
            enhanced_features_used=True,
            relationship_enhanced_chunks=len(results_list),
            version_context=f"Express {version_display}",
            conversation_id=request.conversation_id
        )
        
        # NEW: Log the interaction
        import app.main as main_app  # Import at runtime to avoid circular import
        if main_app.chat_logger:
            main_app.chat_logger.log_interaction(
                prompt=request.message,
                response=response_text,
                metadata={
                    "version": effective_version,
                    "processing_time_ms": chat_time + search_time,
                    "conversation_id": request.conversation_id,
                    "chunks_used": len(results_list),
                    "search_time_ms": search_time,
                    "chat_time_ms": chat_time,
                    "model_used": "gemini-2.5-flash",
                    "top_similarity_score": results_list[0].get("similarity_score", 0.0) if results_list else 0.0,
                    "enhanced_features_used": True
                }
            )
        
        logger.info(f"✅ Express chat response generated in {chat_time + search_time:.0f}ms")
        return final_response
        
    except Exception as e:
        logger.error(f"❌ Express chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating Express response: {str(e)}"
        )

@router.post("/search", response_model=SearchResponse)
async def search_express_documentation(
    request: SearchRequest,
    services: Tuple = Depends(get_services)
) -> SearchResponse:
    """
    Search Express documentation with version and content type filtering
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Express version
        effective_version = normalize_express_version(request.version)
        version_display = format_version_display(effective_version)
        
        logger.info(f"🔍 Express search: '{request.query}' (version: {version_display})")
        
        # Perform search with Express-specific parameters
        # Note: content_type_filter IS used for explicit search requests
        search_results = search_service.search_similarity(
            query=request.query,
            max_results=request.max_results,
            similarity_threshold=request.similarity_threshold,
            version_filter=effective_version,
            content_type_filter=request.content_type_filter,
            complexity_filter=request.complexity_filter if hasattr(request, 'complexity_filter') else None
        )
        
        return SearchResponse(**search_results)
        
    except Exception as e:
        logger.error(f"❌ Express search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Express documentation: {str(e)}"
        )

# ========================================
# UPLOAD DOCUMENTATION ENDPOINT
# ========================================

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

def clean_version_string(version: str) -> str:
    """
    Clean version string to normalized format for Express
    
    Handles formats like:
    - "production-on-premise-2-5-only" -> "on-premise-2-5"
    - "on-premise-2-5" -> "on-premise-2-5"
    - "On-Premise 2.5" -> "on-premise-2-5"
    - "2.5" -> "on-premise-2-5"
    """
    if not version:
        return EXPRESS_DEFAULT_VERSION
    
    # Remove common prefixes and suffixes
    cleaned = version.replace('production-', '').replace('-only', '').strip()
    
    # Handle display format "On-Premise 2.5" -> "on-premise-2-5"
    cleaned = cleaned.lower().replace(' ', '-').replace('.', '-')
    
    # Handle shorthand versions like "2-5" -> "on-premise-2-5"
    if cleaned in ['2-5', '2-4', '2-1']:
        cleaned = f"on-premise-{cleaned}"
    
    # Validate format
    if cleaned in ['on-premise-2-5', 'on-premise-2-4', 'on-premise-2-1']:
        return cleaned
    
    # Default if invalid
    logger.warning(f"⚠️ Could not parse version '{version}', defaulting to {EXPRESS_DEFAULT_VERSION}")
    return EXPRESS_DEFAULT_VERSION

def process_comprehensive_json_simple(data: dict, source: str) -> dict:
    """
    Process comprehensive JSON format for Express documentation upload
    """
    start_time = datetime.now()
    
    try:
        # Extract comprehensive metadata
        express_product = data.get('_PRODUCT', 'express')
        
        # Clean version string from _VERSION field
        raw_version = data.get('_VERSION', EXPRESS_DEFAULT_VERSION)
        express_version = clean_version_string(raw_version)
        version_display = format_version_display(express_version)
        
        logger.info(f"📦 Processing Express comprehensive upload: version '{raw_version}' -> '{express_version}'")
        
        total_chunks = data.get('_TOTAL_CHUNKS', 0)
        enhanced_features = data.get('_ENHANCED_FEATURES', [])
        
        logger.info(f"   Total chunks: {total_chunks}, enhanced features: {len(enhanced_features)}")
        
        # Process chunks
        processed_chunks = []
        chunks = data.get('chunks', [])
        
        for chunk in chunks:
            chunk_metadata = chunk.get('metadata', {})
            chunk_version = chunk_metadata.get('version', express_version)
            
            # Clean the chunk version if present
            if chunk_version:
                chunk_version = clean_version_string(chunk_version)
            else:
                chunk_version = express_version
            
            chunk_version_display = format_version_display(chunk_version)
            
            # Ensure chunk has all required fields for Express processing
            processed_chunk = {
                'id': chunk.get('id', f'chunk-{len(processed_chunks)}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('original_content', chunk.get('content', '')),
                'header': chunk.get('header', ''),
                'source_url': chunk.get('source_url', ''),
                'page_title': chunk.get('page_title', ''),
                'content_type': chunk.get('content_type', {
                    'type': 'documentation',
                    'category': 'express'
                }),
                'complexity': chunk.get('complexity', 'moderate'),
                'tokens': chunk.get('tokens', 0),
                'metadata': {
                    **(chunk_metadata),
                    'product': 'express',
                    'version': chunk_version,
                    'upload_timestamp': datetime.now().timestamp(),
                    'express_version_display': chunk_version_display,
                    'is_current_version': chunk_version == EXPRESS_DEFAULT_VERSION,
                    'version_family': 'express',
                    'source': source
                }
            }
            
            processed_chunks.append(processed_chunk)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"✅ Processed {len(processed_chunks)} chunks for version {version_display}")
        
        return {
            "success": True,
            "message": f"Successfully processed Express comprehensive JSON with {len(processed_chunks)} chunks",
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "upload_type": "comprehensive",
            "express_version": express_version,
            "enhanced_features": enhanced_features,
            "processed_chunks_data": processed_chunks,
            "documentation_stats": {
                "generation_timestamp": data.get('_GENERATED'),
                "product": express_product,
                "version": express_version,
                "version_display": version_display,
                "raw_version": raw_version,
                "total_chunks": total_chunks,
                "enhanced_features_count": len(enhanced_features),
                "express_specific_processing": True
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Express comprehensive processing failed: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "success": False,
            "message": f"Express comprehensive processing failed: {str(e)}",
            "processed_chunks": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "processed_chunks_data": []
        }

def process_legacy_json_simple(chunks: list, source: str) -> dict:
    """
    Process legacy JSON format for Express documentation upload
    """
    start_time = datetime.now()
    
    try:
        processed_chunks = []
        default_version_display = format_version_display(EXPRESS_DEFAULT_VERSION)
        
        for chunk in chunks:
            processed_chunk = {
                'id': chunk.get('id', f'legacy-chunk-{len(processed_chunks)}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('content', ''),
                'header': chunk.get('header', ''),
                'source_url': chunk.get('source_url', ''),
                'page_title': chunk.get('page_title', ''),
                'content_type': {
                    'type': 'documentation',
                    'category': 'express'
                },
                'complexity': 'moderate',
                'tokens': len(chunk.get('content', '').split()),
                'metadata': {
                    **(chunk.get('metadata', {})),
                    'product': 'express',
                    'version': EXPRESS_DEFAULT_VERSION,
                    'upload_timestamp': datetime.now().timestamp(),
                    'express_version_display': default_version_display,
                    'is_current_version': True,
                    'version_family': 'express',
                    'source': source,
                    'legacy_format': True
                }
            }
            
            processed_chunks.append(processed_chunk)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Successfully processed Express legacy JSON with {len(processed_chunks)} chunks",
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "upload_type": "legacy",
            "express_version": EXPRESS_DEFAULT_VERSION,
            "processed_chunks_data": processed_chunks,
            "documentation_stats": {
                "product": "express",
                "version": EXPRESS_DEFAULT_VERSION,
                "version_display": default_version_display,
                "legacy_format": True,
                "total_chunks": len(processed_chunks)
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Express legacy processing failed: {str(e)}")
        return {
            "success": False,
            "message": f"Express legacy processing failed: {str(e)}",
            "processed_chunks": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "processed_chunks_data": []
        }

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "express-uploaded-docs",
    services = Depends(get_services)
):
    """Upload and process Express documentation JSON file"""
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
        logger.info(f"📦 Express upload detected format: {upload_format}")
        
        # Process based on format
        if upload_format == "comprehensive":
            result = process_comprehensive_json_simple(data, source)
            
            if result["success"]:
                logger.info(f"✅ Express comprehensive processing completed: {result['processed_chunks']} chunks for version {result.get('express_version', 'unknown')}")
                
                try:
                    processed_chunks = result.get("processed_chunks_data", [])
                    if processed_chunks:
                        update_result = doc_proc.update_with_processed_chunks(processed_chunks)
                        logger.info(f"✅ DocumentProcessor updated: {update_result}")
                        
                        sync_result = search_svc.sync_with_document_processor()
                        logger.info(f"✅ SearchService synced: {sync_result}")
                    else:
                        logger.warning("⚠️ No processed chunks data to integrate")
                        
                except Exception as e:
                    logger.error(f"❌ Failed to integrate chunks into DocumentProcessor: {e}")
                    return UploadResponse(
                        success=False,
                        message=f"Upload processed but integration failed: {str(e)}",
                        processed_chunks=0,
                        processing_time=result.get("processing_time", 0.0)
                    )
            
            result.pop("processed_chunks_data", None)
            return UploadResponse(**result)
                
        elif upload_format == "legacy":
            logger.info("📋 Processing Express legacy upload format")
            
            chunks = data.get('chunks', [])
            result = process_legacy_json_simple(chunks, source)
            
            if result["success"]:
                logger.info(f"✅ Express legacy processing completed: {result['processed_chunks']} chunks")
                
                try:
                    processed_chunks = result.get("processed_chunks_data", [])
                    if processed_chunks:
                        update_result = doc_proc.update_with_processed_chunks(processed_chunks)
                        logger.info(f"✅ DocumentProcessor updated: {update_result}")
                        
                        sync_result = search_svc.sync_with_document_processor()
                        logger.info(f"✅ SearchService synced: {sync_result}")
                    else:
                        logger.warning("⚠️ No processed chunks data to integrate")
                        
                except Exception as e:
                    logger.error(f"❌ Failed to integrate chunks into DocumentProcessor: {e}")
                    return UploadResponse(
                        success=False,
                        message=f"Upload processed but integration failed: {str(e)}",
                        processed_chunks=0,
                        processing_time=result.get("processing_time", 0.0)
                    )
            
            result.pop("processed_chunks_data", None)
            return UploadResponse(**result)
        
        else:
            logger.error(f"❌ Unknown Express upload format: {upload_format}")
            raise HTTPException(status_code=400, detail=f"Unknown Express upload format: {upload_format}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Express upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Express upload failed: {str(e)}")

@router.get("/upload-status/{upload_id}")
async def get_upload_status(upload_id: str) -> UploadStatus:
    """
    Get status of an Express documentation upload operation
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

