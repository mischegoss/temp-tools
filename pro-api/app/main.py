import os
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import numpy as np

# Import Pro-specific services
from app.services.document_processor import DocumentProcessor
from app.services.search_service import SearchService
from app.services.gemini_service import GeminiService
from app.routers.chat import router as chat_router
from app.config import PRODUCT_DISPLAY_NAME, PRO_DEFAULT_VERSION

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables to store models and services
sentence_model = None
startup_time = None
models_loaded = False

# Global service instances - SINGLE SOURCE OF TRUTH for Pro
doc_processor = None
search_service = None
gemini_service = None
services_initialized = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events using lifespan context manager for Pro API"""
    global sentence_model, startup_time, models_loaded
    global doc_processor, search_service, gemini_service, services_initialized
    
    # CRITICAL: Set offline mode FIRST, before any imports or model loading
    # This must be the very first thing to prevent HuggingFace API calls
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    
    # Startup
    startup_time = time.time()
    logger.info("Starting up Pro Chatbot API...")
    
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
        
        # Load sentence transformer model ONCE from cache
        model_start = time.time()
        logger.info("📚 Loading sentence transformer model for Pro from cache...")
        
        sentence_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', 
                                           cache_folder=cache_dir,
                                           device='cpu')
        
        model_load_time = time.time() - model_start
        models_loaded = True
        
        logger.info(f"✅ Model loaded successfully in {model_load_time:.2f}s")
        
        # Pre-warm the model with a test embedding for Pro
        warmup_start = time.time()
        logger.info("🔥 Pre-warming model for Pro documentation...")
        test_embedding = sentence_model.encode(["Pro workflow configuration documentation"])
        warmup_time = time.time() - warmup_start
        
        logger.info(f"✅ Model pre-warmed in {warmup_time:.2f}s")
        logger.info(f"   - Test embedding shape: {test_embedding.shape}")
        
        # Initialize Pro-specific services with the SHARED model instance
        service_start = time.time()
        logger.info("🚀 Initializing Pro services...")
        
        # DocumentProcessor with Pro-specific settings
        doc_processor = DocumentProcessor(
            sentence_model=sentence_model,  # Shared model instance!
            product_name="pro"
        )
        
        # SearchService with Pro context
        search_service = SearchService(
            sentence_model=sentence_model,  # Same shared instance!
            product_name="pro"
        )
        
        # GeminiService with Pro-optimized prompts
        gemini_service = GeminiService(
            product_name="pro"
        )
        
        service_init_time = time.time() - service_start
        services_initialized = True
        
        startup_duration = time.time() - startup_time
        
        logger.info("🎉 Pro Chatbot API startup completed!")
        logger.info(f"   - Service initialization: {service_init_time:.2f}s")
        logger.info("💡 Memory optimized: Single shared sentence transformer model instance for Pro")
        logger.info(f"   - Model load time: {model_load_time:.2f}s (from Docker cache)")
        logger.info(f"   - Warmup time: {warmup_time:.2f}s")
        logger.info(f"   - Total startup: {startup_duration:.2f}s")
        
    except Exception as e:
        logger.error(f"Failed to initialize Pro services during startup: {e}")
        models_loaded = False
        services_initialized = False
        raise
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("Shutting down Pro Chatbot API...")

# Create FastAPI app with lifespan events
app = FastAPI(
    title="Pro Chatbot API",
    description="AI-powered chatbot for Resolve Pro documentation with optimized cold start performance",
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

# Include Pro chat router
app.include_router(chat_router)

@app.get("/health")
async def health_check():
    """Basic health check endpoint for Pro API"""
    return {
        "status": "healthy",
        "product": "pro",
        "models_loaded": models_loaded,
        "services_initialized": services_initialized,
        "uptime_seconds": time.time() - startup_time if startup_time else 0,
        "ready_for_chat": models_loaded and services_initialized,
        "memory_optimized": True,
        "default_version": PRO_DEFAULT_VERSION
    }

@app.get("/warmup")
async def warmup():
    """
    Warmup endpoint that forces model initialization and tests Pro functionality.
    Useful for warming up the service after deployment.
    """
    global models_loaded, services_initialized
    
    if not models_loaded or not services_initialized:
        raise HTTPException(status_code=503, detail="Services not ready")
    
    try:
        # Test Pro-specific embedding
        test_query = "How do I configure Pro workflows?"
        test_embedding = sentence_model.encode([test_query])
        
        # Test Pro search functionality
        test_search = await search_service.search_similarity(test_query, max_results=1)
        
        # Test Pro Gemini service
        test_status = gemini_service.get_status()
        
        return {
            "status": "warmed_up",
            "product": "pro",
            "embedding_test": {
                "query": test_query,
                "embedding_shape": test_embedding.shape,
                "success": True
            },
            "search_test": {
                "results_found": len(test_search.get("results", [])),
                "success": True
            },
            "gemini_status": test_status,
            "all_systems_ready": True
        }
    except Exception as e:
        return {
            "status": "warmup_failed", 
            "error": str(e),
            "models_loaded": models_loaded,
            "services_initialized": services_initialized
        }

@app.get("/status")
async def detailed_status():
    """
    Detailed status endpoint showing Pro model state and service performance metrics
    """
    # Get detailed service status if available
    doc_status = doc_processor.get_status() if doc_processor else {"ready": False}
    search_stats = search_service.get_search_stats() if search_service else {"ready": False}
    gemini_status = gemini_service.get_status() if gemini_service else {"ready": False}
    
    return {
        "service": f"{PRODUCT_DISPLAY_NAME} Chatbot API",
        "status": "running" if (models_loaded and services_initialized) else "starting",
        "product": "pro",
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
        "pro_specific": {
            "default_version": PRO_DEFAULT_VERSION,
            "supported_versions": ["7-8", "7-9", "8-0", "general"],
            "version_aware": True
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
    """Root endpoint with Pro service information"""
    return {
        "message": f"{PRODUCT_DISPLAY_NAME} Chatbot API - Optimized for Fast Cold Starts",
        "product": "pro",
        "version": "1.0.0",
        "status": "running" if (models_loaded and services_initialized) else "starting",
        "ready_for_chat": models_loaded and services_initialized,
        "documentation": {
            "health_check": "/health",
            "service_warmup": "/warmup",
            "detailed_status": "/status",
            "api_endpoints": "/api/v1/*"
        },
        "pro_features": [
            "Version-aware responses (Pro 7.8, 7.9, 8.0)",
            "Workflow and configuration expertise", 
            "Integration and administration guidance",
            "Context-aware documentation search"
        ],
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
    logger.error(f"Unhandled exception in Pro API: {exc}")
    return {
        "status": "error",
        "message": "Internal server error",
        "product": "pro",
        "models_loaded": models_loaded,
        "services_initialized": services_initialized
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)