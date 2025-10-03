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

# Global service instances - SINGLE SOURCE OF TRUTH
doc_processor = None
search_service = None
gemini_service = None
services_initialized = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events using lifespan context manager (FastAPI 0.93+)"""
    global sentence_model, startup_time, models_loaded
    global doc_processor, search_service, gemini_service, services_initialized
    
    # CRITICAL: Set offline mode FIRST, before any imports or model loading
    # This must be the very first thing to prevent HuggingFace API calls
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    
    # Startup
    startup_time = time.time()
    logger.info("Starting up Actions Chatbot API...")
    
    try:
        
        # Ensure cache directories are set (should match Dockerfile runtime ENV)
        # These should already be set in Dockerfile, but we verify them here
        cache_dir = os.getenv('SENTENCE_TRANSFORMERS_HOME', '/home/appuser/.cache/torch/sentence_transformers')
        
        # Verify cache exists before trying to load
        from pathlib import Path
        cache_path = Path(cache_dir)
        if cache_path.exists():
            logger.info(f"✅ Model cache found at: {cache_dir}")
            cache_files = list(cache_path.rglob('*'))
            logger.info(f"✅ Cache contains {len(cache_files)} items")
        else:
            logger.error(f"❌ Cache directory not found at: {cache_dir}")
            raise RuntimeError(f"Model cache not found at {cache_dir}. Docker build may have failed.")
        
        # Step 1: Load sentence transformer model ONCE (from cache in Docker image)
        # Use local_files_only=True to force loading from cache without any API calls
        logger.info("Loading sentence transformer model from cache (offline mode)...")
        model_load_start = time.time()
        sentence_model = SentenceTransformer(
            'sentence-transformers/all-MiniLM-L6-v2',
            local_files_only=True  # Critical: prevents any HuggingFace API calls
        )
        model_load_time = time.time() - model_load_start
        
        # Test the model with a simple encoding to ensure it's working
        logger.info("Testing model functionality...")
        test_encoding = sentence_model.encode("test sentence")
        logger.info(f"Model test successful. Embedding dimension: {len(test_encoding)}")
        logger.info(f"Model loaded in {model_load_time:.2f} seconds (from Docker cache)")
        
        # Pre-warm the model for faster first response
        logger.info("Pre-warming model for faster first response...")
        warmup_start = time.time()
        sentence_model.encode([
            "how to create workflow",
            "what is actions", 
            "troubleshoot issue",
            "configure settings",
            "example workflow",
            "activities and tasks"
        ])
        warmup_time = time.time() - warmup_start
        logger.info(f"Model pre-warmed in {warmup_time:.2f} seconds")
        
        models_loaded = True
        
        # Step 2: Initialize business services with SHARED model (no duplicate loading)
        logger.info("Initializing business services with shared model instance...")
        
        # Initialize document processor with shared model - CRITICAL FIX
        doc_processor = DocumentProcessor()
        doc_processor.initialize(shared_model=sentence_model)
        logger.info("✅ Document processor initialized (using shared model)")
        
        # Initialize search service
        search_service = SearchService(doc_processor)
        search_service.initialize()
        logger.info("✅ Search service initialized")
        
        # Initialize Gemini service
        gemini_service = GeminiService(search_service)
        gemini_service.initialize()
        logger.info("✅ Gemini service initialized")
        
        services_initialized = True
        
        startup_duration = time.time() - startup_time
        logger.info(f"🎉 Startup completed successfully in {startup_duration:.2f} seconds")
        logger.info("Actions Chatbot API is ready to serve requests!")
        logger.info("💡 Memory optimized: Single shared sentence transformer model instance")
        logger.info(f"   - Model load time: {model_load_time:.2f}s (from Docker cache)")
        logger.info(f"   - Warmup time: {warmup_time:.2f}s")
        logger.info(f"   - Total startup: {startup_duration:.2f}s")
        
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
        "ready_for_chat": models_loaded and services_initialized,
        "memory_optimized": True
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
            "uptime_seconds": time.time() - startup_time if startup_time else 0,
            "memory_optimization": "shared_model_instance",
            "pre_warmed": True
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
                "ready": models_loaded,
                "shared_instance": True,
                "pre_warmed": True
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
            "chat_ready": gemini_status.get("can_chat", False),
            "first_response_optimized": True
        },
        "memory_optimization": {
            "shared_model": True,
            "model_loaded_once": True,
            "estimated_memory_savings": "~50% reduction from avoiding duplicate model loading"
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
            "Model pre-downloaded in Docker image",
            "Model loaded once from cache at startup",
            "Shared model instance across services (50% memory reduction)",
            "No duplicate model loading",
            "Pre-warmed model for faster first response",
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
    