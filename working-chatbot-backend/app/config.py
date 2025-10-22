import os
from pathlib import Path

# Environment detection
IS_PRODUCTION = os.getenv("GAE_ENV", "").startswith("standard") or os.getenv("GOOGLE_CLOUD_PROJECT") is not None
IS_CLOUD_RUN = os.getenv("K_SERVICE") is not None

# File paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
EMBEDDINGS_FILE = DATA_DIR / "embeddings.npy"
METADATA_FILE = DATA_DIR / "metadata.json"
CHUNKS_FILE = DATA_DIR / "documentation-chunks.json"
LAST_PROCESSED_FILE = DATA_DIR / "last_processed.json"

# Sentence transformer settings
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384

# Search settings
MAX_SEARCH_RESULTS = 5
SIMILARITY_THRESHOLD = 0.3

# Gemini settings
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
MAX_CONTEXT_CHUNKS = 5
MAX_TOKENS_PER_CHUNK = 800

# API settings
UPLOAD_MAX_SIZE = 50 * 1024 * 1024  # 50MB

# URL settings
BASE_DOCUMENTATION_URL = "https://help.resolve.io"

# Logging configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["default"],
    },
    "loggers": {
        "uvicorn": {
            "level": "INFO",
        },
        "uvicorn.error": {
            "level": "INFO",
        },
        "uvicorn.access": {
            "level": "INFO",
        },
    },
}

def make_absolute_url(relative_url: str) -> str:
    """Convert relative documentation URL to absolute URL"""
    if relative_url.startswith('http'):
        return relative_url  # Already absolute
    
    # Remove leading slash if present
    clean_path = relative_url.lstrip('/')
    
    return f"{BASE_DOCUMENTATION_URL}/{clean_path}"