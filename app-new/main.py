import os
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer
import numpy as np
from pathlib import Path

# Import Pro-specific services
from app.services.document_processor import DocumentProcessor
from app.services.search_service import SearchService
from app.services.gemini_service import GeminiService
from app.routers.chat import router as chat_router
from app.config import PRODUCT_DISPLAY_NAME, PRO_DEFAULT_VERSION, USE_GCS_KB_STORAGE

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

def detect_environment():
    """Detect if running in Docker or local development"""
    # Check for Docker-specific indicators
    is_docker = (
        os.path.exists('/.dockerenv') or 
        os.getenv('K_SERVICE') is not None or  # Cloud Run
        os.path.exists('/home/appuser') or
        os.getenv('RUNNING_IN_DOCKER') == 'true'
    )
    return 'docker' if is_docker else 'local'

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events using lifespan context manager for Pro API"""
    global sentence_model, startup_time, models_loaded
    global doc_processor, search_service, gemini_service, services_initialized
    
    # Startup
    startup_time = time.time()
    environment = detect_environment()
    logger.info(f"Starting up Pro Chatbot API in {environment} environment...")
    
    try:
        # Environment-specific setup
        if environment == 'docker':
            # Docker/Production setup with offline mode
            os.environ['HF_HUB_OFFLINE'] = '1'
            os.environ['TRANSFORMERS_OFFLINE'] = '1'
            
            # Use Docker cache paths
            cache_dir = os.getenv('SENTENCE_TRANSFORMERS_HOME', '/home/appuser/.cache/torch/sentence_transformers')
            
            # Verify cache exists
            cache_path = Path(cache_dir)
            if cache_path.exists():
                logger.info(f"✅ Model cache found at: {cache_dir}")
                cache_files = list(cache_path.rglob('*'))
                logger.info(f"✅ Cache contains {len(cache_files)} items")
            else:
                logger.error(f"❌ Cache directory not found at: {cache_dir}")
                raise RuntimeError(f"Model cache not found at {cache_dir}. Docker build may have failed.")
        else:
            # Local development - normal mode
            logger.info("Running in local development mode")
        
        # Load sentence transformer model
        logger.info("Loading sentence transformer model...")
        model_start = time.time()
        
        from app.config import EMBEDDING_MODEL
        sentence_model = SentenceTransformer(EMBEDDING_MODEL)
        
        # Test the model
        test_encoding = sentence_model.encode("test")
        model_load_time = time.time() - model_start
        logger.info(f"✅ Model loaded successfully. Embedding dimension: {len(test_encoding)}")
        logger.info(f"Model loaded/tested in {model_load_time:.2f} seconds")
        
        # Pre-warm the model for faster first response
        logger.info("Pre-warming model for faster Pro responses...")
        warmup_start = time.time()
        sentence_model.encode([
            "how to create Pro workflow",
            "what is Resolve Pro", 
            "troubleshoot Pro issue",
            "configure Pro settings",
            "Pro workflow activities",
            "Pro monitoring and alerts"
        ])
        warmup_time = time.time() - warmup_start
        logger.info(f"Model pre-warmed in {warmup_time:.2f} seconds")
        
        models_loaded = True
        
        # Initialize business services with shared model
        logger.info("Initializing Pro business services with shared model instance...")
        service_start = time.time()
        
        # Initialize document processor with shared model (this loads from GCS)
        doc_processor = DocumentProcessor()
        doc_processor.initialize(shared_model=sentence_model)
        logger.info("✅ Pro document processor initialized (using shared model)")
        
        # Log GCS data load status
        doc_status = doc_processor.get_status()
        if doc_status.get('chunks_count', 0) > 0:
            logger.info(f"📦 Loaded {doc_status['chunks_count']} chunks from GCS persistence")
            logger.info(f"   Embeddings: {doc_status.get('embeddings_count', 0)} vectors ready")
        else:
            logger.info("📂 No existing docs data in GCS - starting fresh")
        
        # ========================================
        # NEW: Log KB data load status
        # ========================================
        if doc_status.get('kb_loaded', False):
            logger.info(f"📚 Loaded {doc_status.get('kb_articles_count', 0)} KB articles from GCS")
            logger.info(f"   KB Embeddings: {doc_status.get('kb_embeddings_count', 0)} vectors ready")
        else:
            logger.info("📚 No KB data in GCS - KB search not available until upload")
        
        # Initialize search service
        search_service = SearchService(doc_processor)
        search_service.initialize()
        logger.info("✅ Pro search service initialized")
        
        # Log search service data sync status
        search_stats = search_service.get_search_stats()
        if search_stats.get('total_chunks', 0) > 0:
            logger.info(f"🔍 Search service ready with {search_stats['total_chunks']} searchable chunks")
        else:
            logger.info("🔍 Search service ready (waiting for data upload)")
        
        # ========================================
        # NEW: Log KB search readiness
        # ========================================
        if search_stats.get('kb_ready', False):
            logger.info(f"📚 KB search ready with {search_stats.get('kb_articles_count', 0)} articles")
        
        # Initialize Gemini service with Pro configuration
        gemini_service = GeminiService(product_name="pro")
        logger.info("✅ Pro Gemini service initialized")
        
        # CRITICAL FIX: Inject search service to avoid circular import
        gemini_service.set_search_service(search_service)
        logger.info("✅ Search service injected into Gemini service")
        
        service_init_time = time.time() - service_start
        services_initialized = True
        
        startup_duration = time.time() - startup_time
        
        logger.info("🎉 Pro Chatbot API startup completed!")
        logger.info(f"   - Environment: {environment}")
        logger.info(f"   - Service initialization: {service_init_time:.2f}s")
        logger.info("💡 Memory optimized: Single shared sentence transformer model instance for Pro")
        logger.info(f"   - Model load time: {model_load_time:.2f}s")
        logger.info(f"   - Warmup time: {warmup_time:.2f}s")
        logger.info(f"   - Total startup: {startup_duration:.2f}s")
        
        # GCS persistence summary
        if doc_status.get('gcs_enabled'):
            logger.info("🗄️  GCS persistence: ENABLED")
        else:
            logger.info("📁 GCS persistence: DISABLED (local/development mode)")
        
        # ========================================
        # NEW: KB GCS persistence summary
        # ========================================
        if doc_status.get('kb_gcs_enabled'):
            logger.info("📚 KB GCS persistence: ENABLED")
        else:
            logger.info("📚 KB GCS persistence: DISABLED")
        
    except Exception as e:
        logger.error(f"Failed to initialize Pro services during startup: {e}")
        import traceback
        traceback.print_exc()
        models_loaded = False
        services_initialized = False
        raise
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("Shutting down Pro Chatbot API...")

# Create FastAPI app with lifespan events
app = FastAPI(
    title="Pro Chatbot API",
    description="AI-powered chatbot for Resolve Pro documentation with Gemini 2.5 Flash",
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

@app.get("/")
async def root():
    """Root endpoint with Pro service information"""
    return {
        "message": "Pro Chatbot API - Optimized for Fast Cold Starts",
        "product": PRODUCT_DISPLAY_NAME,
        "version": "1.0.0",
        "status": "running" if (models_loaded and services_initialized) else "starting",
        "ready_for_chat": models_loaded and services_initialized,
        "default_version": PRO_DEFAULT_VERSION,
        "documentation": {
            "health_check": "/health",
            "service_warmup": "/warmup",
            "detailed_status": "/status",
            "api_endpoints": "/api/v1/*",
            "kb_status": "/api/v1/kb-status"  # NEW: KB status endpoint
        },
        "optimization_features": [
            "Model pre-downloaded and cached",
            "Model loaded once from cache at startup",
            "Shared model instance across services (50% memory reduction)",
            "No duplicate model loading",
            "Pre-warmed model for faster first response",
            "GCS persistence for documentation data",
            "Knowledge Base support with version-aware search",  # NEW
            "Optimized for both local development and Cloud Run deployment"
        ]
    }

@app.get("/health")
async def health_check():
    """Basic health check endpoint for Pro API"""
    doc_status = doc_processor.get_status() if doc_processor else {"gcs_enabled": False}
    
    return {
        "status": "healthy",
        "product": "pro",
        "models_loaded": models_loaded,
        "services_initialized": services_initialized,
        "uptime_seconds": time.time() - startup_time if startup_time else 0,
        "ready_for_chat": models_loaded and services_initialized,
        "memory_optimized": True,
        "gcs_persistence": doc_status.get("gcs_enabled", False),
        "data_loaded": doc_status.get("chunks_count", 0) > 0,
        "default_version": PRO_DEFAULT_VERSION,
        "environment": detect_environment(),
        # ========================================
        # NEW: Knowledge Base status fields
        # ========================================
        "kb_loaded": doc_status.get("kb_loaded", False),
        "kb_articles_count": doc_status.get("kb_articles_count", 0),
        "kb_gcs_enabled": doc_status.get("kb_gcs_enabled", USE_GCS_KB_STORAGE),
        "kb_search_ready": doc_status.get("kb_loaded", False) and doc_status.get("kb_embeddings_count", 0) > 0
    }

@app.get("/warmup")
async def warmup():
    """
    Warmup endpoint that forces model initialization and tests Pro functionality.
    Useful for warming up the service after deployment.
    """
    global models_loaded, services_initialized
    
    if not models_loaded or not services_initialized:
        raise HTTPException(status_code=503, detail="Pro services not ready")
    
    try:
        # Test Pro-specific embedding
        test_query = "How do I configure Pro workflows?"
        test_embedding = sentence_model.encode(test_query)
        
        # Test Gemini service if available
        gemini_status = gemini_service.get_status() if gemini_service else {"ready": False}
        
        # ========================================
        # NEW: Get KB status for warmup response
        # ========================================
        doc_status = doc_processor.get_status() if doc_processor else {}
        
        return {
            "status": "warmed_up",
            "model_test": "passed",
            "embedding_dimension": len(test_embedding),
            "gemini_ready": gemini_status.get("ready", False),
            "pro_optimized": True,
            "test_query": test_query,
            # NEW: KB warmup info
            "kb_ready": doc_status.get("kb_loaded", False),
            "kb_articles_available": doc_status.get("kb_articles_count", 0)
        }
    except Exception as e:
        logger.error(f"Warmup test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Warmup failed: {str(e)}")

@app.get("/status")
async def detailed_status():
    """
    Detailed status endpoint showing model state and service performance metrics for Pro
    """
    # Get detailed service status if available
    doc_status = doc_processor.get_status() if doc_processor else {"ready": False}
    search_stats = search_service.get_search_stats() if search_service else {"ready": False}
    gemini_status = gemini_service.get_status() if gemini_service else {"ready": False}
    
    return {
        "service": "Pro Chatbot API",
        "status": "running" if (models_loaded and services_initialized) else "starting",
        "environment": detect_environment(),
        "uptime_seconds": time.time() - startup_time if startup_time else 0,
        "models": {
            "sentence_transformer": {
                "loaded": models_loaded,
                "model_name": "all-MiniLM-L6-v2",
                "embedding_dimension": 384
            },
            "gemini": gemini_status
        },
        "services": {
            "document_processor": {
                "ready": doc_status.get("ready", False),
                "chunks_count": doc_status.get("chunks_count", 0),
                "embeddings_count": doc_status.get("embeddings_count", 0),
                "gcs_enabled": doc_status.get("gcs_enabled", False)
            },
            "search_service": {
                "ready": search_stats.get("ready", False),
                "total_chunks": search_stats.get("total_chunks", 0),
                "has_embeddings": search_stats.get("has_embeddings", False)
            }
        },
        # ========================================
        # Knowledge Base detailed status
        # ========================================
        "knowledge_base": {
            "loaded": doc_status.get("kb_loaded", False),
            "articles_count": doc_status.get("kb_articles_count", 0),
            "embeddings_count": doc_status.get("kb_embeddings_count", 0),
            "gcs_enabled": doc_status.get("kb_gcs_enabled", False),
            "search_ready": search_stats.get("kb_ready", False),
            "source": "Zendesk Help Center",
            "requires_login": True
        },
        "default_version": PRO_DEFAULT_VERSION,
        "supported_versions": ["8-0", "7-9", "7-8"],
        "memory_optimization": {
            "shared_model": True,
            "single_instance": True,
            "pre_warmed": True
        },
        "endpoints": {
            "health": "/health",
            "warmup": "/warmup",
            "status": "/status",
            "upload_docs": "/api/v1/upload-documentation (POST)",
            "upload_kb": "/api/v1/upload-kb (POST)",
            "search": "/api/v1/search (POST)",
            "search_kb": "/api/v1/search-kb (GET)",
            "chat": "/api/v1/chat (POST)",
            "kb_status": "/api/v1/kb-status (GET)",
            "test_connection": "/api/v1/test-connection"
        }
    }


# ========================================
# Exception Handler
# ========================================
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled exception: {exc}")
    import traceback
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "type": type(exc).__name__
        }
    )


# ========================================
# Main Entry Point
# ========================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)