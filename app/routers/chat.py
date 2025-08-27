from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import json
import logging
from datetime import datetime

from app.models.chat import ChatRequest, ChatResponse
from app.models.search import SearchRequest, SearchResponse
from app.models.upload import UploadRequest, UploadResponse
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
    
    if not _services_initialized:
        try:
            logger.info("Initializing services on first request...")
            
            # Initialize document processor
            doc_processor = DocumentProcessor()
            doc_processor.initialize()
            
            # Initialize search service
            search_service = SearchService(doc_processor)
            search_service.initialize()
            
            # Initialize Gemini service
            gemini_service = GeminiService(search_service)
            gemini_service.initialize()
            
            _services_initialized = True
            logger.info("Services initialized successfully")
            
        except Exception as e:
            logger.error(f"Service initialization failed: {e}")
            raise HTTPException(status_code=503, detail="Services failed to initialize")
    
    if not all([doc_processor, search_service, gemini_service]):
        raise HTTPException(status_code=503, detail="Services not available")
    
    return doc_processor, search_service, gemini_service

@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@router.get("/status")
async def get_status(services = Depends(get_services)):
    """Get detailed system status"""
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

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "uploaded-docs",
    services = Depends(get_services)
):
    """Upload and process documentation JSON file"""
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
        
        # Validate JSON structure
        if 'chunks' not in data:
            raise HTTPException(status_code=400, detail="JSON must contain 'chunks' array")
        
        # Convert to UploadRequest
        upload_request = UploadRequest(
            source=source,
            chunks=[chunk for chunk in data['chunks']],
            generated_at=datetime.now(),
            total_chunks=len(data['chunks']),
            total_tokens=data.get('_TOTAL_TOKENS', 0)
        )
        
        # Process upload
        result = doc_proc.process_upload(upload_request)
        
        # Refresh search service if successful
        if result["success"]:
            search_svc.refresh_data()
            logger.info("Search service refreshed after upload")
        
        return UploadResponse(**result)
        
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
    """Search through documentation"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        if not search_svc.ready:
            raise HTTPException(status_code=400, detail="Search service not ready. Please upload documents first.")
        
        response = search_svc.search(request)
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
    """Main chat endpoint with AI responses"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        if not gemini_svc.get_status()["can_chat"]:
            raise HTTPException(
                status_code=400, 
                detail="Chat service not ready. Please ensure documents are uploaded and services are initialized."
            )
        
        response = gemini_svc.chat(request)
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat request failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat request failed: {str(e)}")

@router.get("/test-connection")
async def test_gemini_connection(services = Depends(get_services)):
    """Test Gemini API connection"""
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