import logging
import logging.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from app.routers.chat import router as chat_router
from app.config import LOGGING_CONFIG, IS_CLOUD_RUN

# Set up logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

# Create FastAPI app with simple startup
app = FastAPI(
    title="RANI - Documentation Chat API",
    description="AI-powered chat interface for technical automation documentation",
    version="1.0.0"
)

# Add CORS middleware
allowed_origins = [
    "https://help.resolve.io",
    "http://localhost:3000",
    "http://localhost:8000",
    "*"  # Allow all for now, restrict later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "RANI - Documentation Chat API",
        "version": "1.0.0",
        "environment": "Cloud Run" if IS_CLOUD_RUN else "Development",
        "status": "running"
    }

@app.get("/health")
async def health():
    """Simple health check"""
    return {"status": "healthy"}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)