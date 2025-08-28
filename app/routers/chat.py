from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import json
import logging
from datetime import datetime

from app.models.chat import ChatRequest, ChatResponse
from app.models.search import SearchRequest, SearchResponse
from app.models.upload import UploadRequest, UploadResponse, ComprehensiveUploadRequest
from app.models.metadata import StatusResponse, ProcessingStatus
from app.services.document_processor import DocumentProcessor
from app.services.search_service import SearchService
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["chat"])

# Global service instances (will be initialized lazily)
doc_processor: Optional[DocumentProcessor] = None
search_service: Optional[SearchService] = None
gemini_service: Optional[GeminiService] = None
_services_initialized = False

def get_services():
    """Dependency to ensure services are initialized"""
    global doc_processor, search_service, gemini_service, _services_initialized
    
    # If services aren't set, initialize them now
    if not _services_initialized or not all([doc_processor, search_service, gemini_service]):
        try:
            logger.info("Lazy initializing services in chat router...")
            
            # Initialize document processor
            if not doc_processor:
                doc_processor = DocumentProcessor()
                doc_processor.initialize()
            
            # Initialize search service
            if not search_service:
                search_service = SearchService(doc_processor)
                search_service.initialize()
            
            # Initialize Gemini service
            if not gemini_service:
                gemini_service = GeminiService(search_service)
                gemini_service.initialize()
            
            _services_initialized = True
            logger.info("Services initialized successfully in chat router")
            
        except Exception as e:
            logger.error(f"Service initialization failed in chat router: {e}")
            raise HTTPException(status_code=503, detail=f"Services failed to initialize: {str(e)}")
    
    return doc_processor, search_service, gemini_service

@router.get("/health")
async def health_check():
    """Router-level health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "services_initialized": _services_initialized
    }

@router.get("/status")
async def get_detailed_status(services = Depends(get_services)):
    """Get detailed system status from all services"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Get status from all services
        doc_status = doc_proc.get_status()
        search_stats = search_svc.get_search_stats()
        gemini_status = gemini_svc.get_status()
        
        processing_status = ProcessingStatus(
            total_chunks=doc_status["total_chunks"],
            embedded_chunks=doc_status["total_chunks"],
            pending_chunks=0,
            last_update=datetime.now(),
            sources=search_stats["sources"],
            embedding_model=doc_status["embedding_model"]
        )
        
        return StatusResponse(
            status=processing_status,
            ready=gemini_status["can_chat"],
            message="System ready for chat" if gemini_status["can_chat"] else "System initializing or no documents loaded"
        )
        
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

def detect_upload_format(data: dict) -> str:
    """Detect whether uploaded JSON is comprehensive or legacy format"""
    # Comprehensive format indicators
    comprehensive_indicators = [
        '_GENERATED', '_PRODUCT', '_TOTAL_CHUNKS', '_ENHANCED_FEATURES', 
        '_PAGE_MAPPINGS', '_STATS', '_VARIABLE_SUBSTITUTIONS'
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

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "uploaded-docs",
    services = Depends(get_services)
):
    """Upload and process documentation JSON file - supports both legacy and comprehensive formats"""
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
        logger.info(f"Detected upload format: {upload_format}")
        
        # Process based on format
        if upload_format == "comprehensive":
            # Validate comprehensive format
            try:
                comprehensive_request = ComprehensiveUploadRequest(**data)
                logger.info(f"Processing comprehensive upload with {len(comprehensive_request.chunks)} chunks")
                logger.info(f"Enhanced features: {comprehensive_request._ENHANCED_FEATURES}")
                
                # Process comprehensive upload
                result = doc_proc.process_comprehensive_upload(data, source)
                
                # Enhanced response for comprehensive uploads
                enhanced_result = {
                    **result,
                    "upload_type": "comprehensive",
                    "page_mappings": result.get("page_mappings", 0),
                    "enhanced_features": result.get("enhanced_features", []),
                    "variable_substitutions": result.get("variable_substitutions", 0),
                    "documentation_stats": {
                        "generation_timestamp": comprehensive_request._GENERATED,
                        "product": comprehensive_request._PRODUCT,
                        "version": comprehensive_request._VERSION,
                        "total_pages": comprehensive_request._TOTAL_PAGES,
                        "total_headers": comprehensive_request._TOTAL_HEADERS,
                        "enhanced_features_count": len(comprehensive_request._ENHANCED_FEATURES),
                        "variable_substitutions_applied": len(comprehensive_request._VARIABLE_SUBSTITUTIONS)
                    }
                }
                
            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Invalid comprehensive JSON format: {str(e)}")
                
        else:
            # Handle as legacy format
            logger.info(f"Processing legacy upload format with {len(data['chunks'])} chunks")
            
            # Convert to legacy UploadRequest for backwards compatibility
            try:
                upload_request = UploadRequest(
                    source=source,
                    chunks=[chunk for chunk in data['chunks']],
                    generated_at=datetime.now(),
                    total_chunks=len(data['chunks']),
                    total_tokens=data.get('total_tokens', 0)
                )
                
                # Process legacy upload
                result = doc_proc.process_upload(upload_request)
                enhanced_result = {
                    **result,
                    "upload_type": "legacy"
                }
                
            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Invalid legacy JSON format: {str(e)}")
        
        # Refresh search service if successful
        if enhanced_result["success"]:
            search_svc.refresh_data()
            logger.info(f"Search service refreshed after {upload_format} upload")
        
        return UploadResponse(**enhanced_result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")

@router.post("/search", response_model=SearchResponse)
async def search_documents(
    request: SearchRequest,
    services = Depends(get_services)
):
    """Search through documentation with enhanced features"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        if not search_svc.ready:
            raise HTTPException(
                status_code=400, 
                detail="Search service not ready. Please upload documents first."
            )
        
        response = search_svc.search(request)
        
        # Log enhanced features usage
        if hasattr(response, 'enhanced_features_used') and response.enhanced_features_used:
            logger.info("Enhanced search features used (relationships, metadata, etc.)")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    services = Depends(get_services)
):
    """Main chat endpoint with AI responses and enhanced relationship features"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Check if services are ready for chat
        gemini_status = gemini_svc.get_status()
        if not gemini_status["can_chat"]:
            raise HTTPException(
                status_code=400, 
                detail="Chat service not ready. Please ensure documents are uploaded and services are initialized."
            )
        
        # Process the chat request
        logger.info(f"Processing chat request: {request.message[:50]}...")
        
        # Log if enhanced features are available
        if gemini_status.get("enhanced_features_available", False):
            logger.info("Enhanced relationship features available for chat response")
        
        response = gemini_svc.chat(request)
        
        # Log search performance and feature usage
        if hasattr(response, 'enhanced_features_used') and response.enhanced_features_used:
            logger.info(f"Used relationship enhancement: +{response.relationship_enhanced_chunks} related chunks")
        
        logger.info(f"Chat response generated in {response.processing_time:.2f}s")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat request failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat request failed: {str(e)}")

@router.get("/test-connection")
async def test_gemini_connection(services = Depends(get_services)):
    """Test Gemini API connection with enhanced features status"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        result = gemini_svc.test_connection()
        
        if result["success"]:
            return JSONResponse(content=result)
        else:
            raise HTTPException(status_code=503, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Connection test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Connection test failed: {str(e)}")

# Enhanced utility endpoints

@router.get("/search-by-directory/{directory}")
async def search_by_directory(
    directory: str,
    max_results: int = 10,
    services = Depends(get_services)
):
    """Search for chunks in a specific directory (enhanced feature)"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        if not search_svc.ready:
            raise HTTPException(
                status_code=400, 
                detail="Search service not ready. Please upload documents first."
            )
        
        results = search_svc.search_by_directory(directory, max_results)
        
        return {
            "directory": directory,
            "results": results,
            "total_found": len(results)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Directory search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Directory search failed: {str(e)}")

@router.get("/chunk-relationships/{chunk_id}")
async def get_chunk_relationships(
    chunk_id: str,
    services = Depends(get_services)
):
    """Get raw relationship data for a chunk (lightweight alternative to complex conversions)"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        if not search_svc.ready:
            raise HTTPException(
                status_code=400, 
                detail="Search service not ready. Please upload documents first."
            )
        
        relationships = search_svc.get_chunk_relationships(chunk_id)
        
        if not relationships:
            raise HTTPException(status_code=404, detail=f"No relationships found for chunk {chunk_id}")
        
        return {
            "chunk_id": chunk_id,
            "relationships": relationships,
            "has_siblings": len(relationships.get('siblings', [])) > 0,
            "has_cousins": len(relationships.get('cousins', [])) > 0,
            "total_related": relationships.get('relationship_counts', {}).get('total_related', 0)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chunk relationships lookup failed: {e}")
        raise HTTPException(status_code=500, detail=f"Relationships lookup failed: {str(e)}")

@router.get("/service-health")
async def service_health_check():
    """Check individual service health without initializing them"""
    return {
        "doc_processor_available": doc_processor is not None,
        "search_service_available": search_service is not None,
        "gemini_service_available": gemini_service is not None,
        "services_initialized": _services_initialized,
        "enhanced_features_available": search_service.get_search_stats().get('enhanced_features', False) if search_service else False,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/ready")
async def readiness_check():
    """Kubernetes/Cloud Run readiness probe endpoint"""
    try:
        # Try to get services (will initialize if needed)
        doc_proc, search_svc, gemini_svc = get_services()
        
        # Quick health check of critical services
        if not gemini_svc.ready:
            raise HTTPException(status_code=503, detail="Gemini service not ready")
        
        # Check for enhanced features
        search_stats = search_svc.get_search_stats()
        
        return {
            "status": "ready",
            "timestamp": datetime.now().isoformat(),
            "chat_ready": True,
            "enhanced_features_ready": search_stats.get('enhanced_features', False),
            "relationship_data_available": search_stats.get('chunks_with_relationships', 0) > 0
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Service not ready: {str(e)}")