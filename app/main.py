import os
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import numpy as np

# Import your existing services
from app.services.document_processor import DocumentProcessor
from app.services.search_service import SearchService
from app.services.gemini_service import GeminiService
from app.routers.chat import router as chat_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables to store models and services
sentence_model = None
startup_time = None
models_loaded = False

# Global service instances
doc_processor = None
search_service = None
gemini_service = None
services_initialized = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events using lifespan context manager (FastAPI 0.93+)"""
    global sentence_model, startup_time, models_loaded
    global doc_processor, search_service, gemini_service, services_initialized
    
    # Startup
    startup_time = time.time()
    logger.info("Starting up Actions Chatbot API...")
    
    try:
        # Step 1: Pre-load the sentence transformer model into memory
        logger.info("Loading sentence transformer model...")
        sentence_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        
        # Test the model with a simple encoding to ensure it's working
        logger.info("Testing model functionality...")
        test_encoding = sentence_model.encode("test sentence")
        logger.info(f"Model test successful. Embedding dimension: {len(test_encoding)}")
        models_loaded = True
        
        # Step 2: Initialize your business services
        logger.info("Initializing business services...")
        
        # Initialize document processor
        doc_processor = DocumentProcessor()
        doc_processor.initialize()
        logger.info("✅ Document processor initialized")
        
        # Initialize search service
        search_service = SearchService(doc_processor)
        search_service.initialize()
        logger.info("✅ Search service initialized")
        
        # Initialize Gemini service
        gemini_service = GeminiService(search_service)
        gemini_service.initialize()
        logger.info("✅ Gemini service initialized")
        
        services_initialized = True
        
        # Update the chat router's global services
        chat_router.doc_processor = doc_processor
        chat_router.search_service = search_service
        chat_router.gemini_service = gemini_service
        chat_router._services_initialized = True
        
        startup_duration = time.time() - startup_time
        logger.info(f"🎉 Startup completed successfully in {startup_duration:.2f} seconds")
        logger.info("Actions Chatbot API is ready to serve requests!")
        
    except Exception as e:
        logger.error(f"Failed to initialize services during startup: {e}")
        models_loaded = False
        services_initialized = False
        raise
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("Shutting down Actions Chatbot API...")

# Create FastAPI app with lifespan events
app = FastAPI(
    title="Actions Chatbot API",
    description="AI-powered chatbot for Resolve Actions documentation with optimized cold start performance",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your existing chat router
app.include_router(chat_router)

@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": models_loaded,
        "services_initialized": services_initialized,
        "uptime_seconds": time.time() - startup_time if startup_time else 0,
        "ready_for_chat": models_loaded and services_initialized
    }

@app.get("/warmup")
async def warmup():
    """
    Warmup endpoint that forces model initialization and tests functionality.
    Useful for warming up the service after deployment.
    """
    global sentence_model, models_loaded, services_initialized
    
    if not models_loaded or sentence_model is None:
        raise HTTPException(status_code=503, detail="Models not loaded yet")
    
    if not services_initialized:
        raise HTTPException(status_code=503, detail="Services not initialized yet")
    
    try:
        # Test embedding generation to ensure everything works
        start_time = time.time()
        test_embedding = sentence_model.encode("This is a warmup test for the model")
        embedding_time = time.time() - start_time
        
        # Test search service if ready
        search_ready = search_service.ready if search_service else False
        
        # Test Gemini service if ready  
        gemini_ready = gemini_service.ready if gemini_service else False
        
        return {
            "status": "warmed_up",
            "models_loaded": True,
            "services_initialized": True,
            "model_type": "sentence-transformers/all-MiniLM-L6-v2",
            "embedding_dimension": len(test_embedding),
            "embedding_test_time_seconds": round(embedding_time, 3),
            "search_service_ready": search_ready,
            "gemini_service_ready": gemini_ready,
            "chat_ready": search_ready and gemini_ready,
            "uptime_seconds": time.time() - startup_time if startup_time else 0
        }
    except Exception as e:
        logger.error(f"Warmup test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Warmup failed: {str(e)}")

@app.get("/status")
async def get_status():
    """
    Detailed status endpoint showing model state and service performance metrics
    """
    # Get detailed service status if available
    doc_status = doc_processor.get_status() if doc_processor else {"ready": False}
    search_stats = search_service.get_search_stats() if search_service else {"ready": False}
    gemini_status = gemini_service.get_status() if gemini_service else {"ready": False}
    
    return {
        "service": "Actions Chatbot API",
        "status": "running" if (models_loaded and services_initialized) else "starting",
        "models": {
            "sentence_transformer": {
                "loaded": sentence_model is not None,
                "model_name": "sentence-transformers/all-MiniLM-L6-v2",
                "ready": models_loaded
            }
        },
        "services": {
            "document_processor": doc_status,
            "search_service": search_stats,
            "gemini_service": gemini_status
        },
        "performance": {
            "startup_time_seconds": time.time() - startup_time if startup_time else 0,
            "models_loaded": models_loaded,
            "services_initialized": services_initialized,
            "chat_ready": gemini_status.get("can_chat", False)
        },
        "endpoints": {
            "health": "/health",
            "warmup": "/warmup", 
            "status": "/status",
            "upload": "/api/v1/upload-documentation (POST)",
            "search": "/api/v1/search (POST)",
            "chat": "/api/v1/chat (POST)",
            "test_connection": "/api/v1/test-connection"
        }
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "message": "Actions Chatbot API - Optimized for Fast Cold Starts",
        "version": "1.0.0",
        "status": "running" if (models_loaded and services_initialized) else "starting",
        "ready_for_chat": models_loaded and services_initialized,
        "documentation": {
            "health_check": "/health",
            "service_warmup": "/warmup",
            "detailed_status": "/status",
            "api_endpoints": "/api/v1/*"
        },
        "optimization_features": [
            "Pre-loaded sentence transformer model",
            "Startup-time service initialization", 
            "Fast embedding generation",
            "Optimized for Cloud Run deployment"
        ]
    }

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {
        "status": "error",
        "message": "Internal server error",
        "models_loaded": models_loaded,
        "services_initialized": services_initialized
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)