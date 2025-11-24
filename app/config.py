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

# ========================================
# GOOGLE CLOUD STORAGE CONFIGURATION
# ========================================
GCS_PROJECT_ID = os.getenv("GCS_PROJECT_ID", "express-chatbot")
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "express-chatbot-data")
GCS_EMBEDDINGS_PATH = "embeddings"
GCS_CHUNKS_PATH = "chunks"
GCS_METADATA_PATH = "metadata"

# Enable GCS storage in production (Cloud Run), disable for local development
USE_GCS_STORAGE = os.getenv("USE_GCS_STORAGE", str(IS_CLOUD_RUN)).lower() in ('true', '1', 'yes')

# Sentence transformer settings
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384

# Search settings
MAX_SEARCH_RESULTS = 15
SIMILARITY_THRESHOLD = 0.3

# Gemini settings
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash") 
MAX_CONTEXT_CHUNKS = 5
MAX_TOKENS_PER_CHUNK = 800

# API settings
UPLOAD_MAX_SIZE = 50 * 1024 * 1024  # 50MB

# Express-specific URL settings
BASE_DOCUMENTATION_URL = "https://docs.resolve.io"
PRODUCT_NAME = "express"
PRODUCT_DISPLAY_NAME = "Resolve Express"

# Express version configuration
EXPRESS_SUPPORTED_VERSIONS = [
    "on-premise-2-5",
    "on-premise-2-4", 
    "on-premise-2-1",
    "general"
]
EXPRESS_DEFAULT_VERSION = "on-premise-2-5"

EXPRESS_VERSION_MAPPINGS = {
    # Display format (matches UI dropdown)
    "On-Premise 2.5": "on-premise-2-5",
    "On-Premise 2.4": "on-premise-2-4",
    "On-Premise 2.1": "on-premise-2-1",
    
    # Lowercase variations
    "on-premise 2.5": "on-premise-2-5",
    "on-premise 2.4": "on-premise-2-4",
    "on-premise 2.1": "on-premise-2-1",
    
    # Internal format (already normalized)
    "on-premise-2-5": "on-premise-2-5",
    "on-premise-2-4": "on-premise-2-4",
    "on-premise-2-1": "on-premise-2-1",
    
    # Shorthand versions
    "2.5": "on-premise-2-5",
    "2.4": "on-premise-2-4",
    "2.1": "on-premise-2-1",
    "2-5": "on-premise-2-5",
    "2-4": "on-premise-2-4",
    "2-1": "on-premise-2-1",
    
    # Defaults
    "general": "on-premise-2-5",
    "latest": "on-premise-2-5"
}

# Express-specific route patterns
EXPRESS_ROUTE_PATTERNS = ["/express"]

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
    """Convert relative Express documentation URL to absolute URL"""
    if relative_url.startswith('http'):
        return relative_url  # Already absolute
    
    # Remove leading slash if present
    clean_path = relative_url.lstrip('/')
    
    # Ensure Express prefix for relative URLs
    if not clean_path.startswith('express/'):
        clean_path = f"express/{clean_path}"
    
    return f"{BASE_DOCUMENTATION_URL}/{clean_path}"

def get_version_display_name(version: str) -> str:
    """Get display name for Express version"""
    version_displays = {
        "on-premise-2-5": "Express On-Premise 2.5 (Latest)",
        "on-premise-2-4": "Express On-Premise 2.4",
        "on-premise-2-1": "Express On-Premise 2.1",
        "general": "General (Express On-Premise 2.5)"
    }
    return version_displays.get(version, f"Express {version}")

def normalize_express_version(version: str) -> str:
    """Normalize Express version string to internal format"""
    if not version:
        return EXPRESS_DEFAULT_VERSION
    
    # Use mappings to normalize
    normalized = EXPRESS_VERSION_MAPPINGS.get(version, version)
    
    # Validate against supported versions
    if normalized not in EXPRESS_SUPPORTED_VERSIONS:
        return EXPRESS_DEFAULT_VERSION
        
    return normalized

def detect_express_documentation_type(pathname: str) -> str:
    """Detect Express documentation type from path"""
    lowerPath = pathname.lower()
    
    if 'workflow' in lowerPath or 'activities' in lowerPath:
        return 'workflow'
    elif 'getting' in lowerPath or 'introduction' in lowerPath:
        return 'getting_started'
    elif 'administration' in lowerPath or 'config' in lowerPath:
        return 'administration'
    elif 'integration' in lowerPath or 'api' in lowerPath:
        return 'integration'
    elif 'troubleshooting' in lowerPath or 'faq' in lowerPath:
        return 'troubleshooting'
    elif 'reference' in lowerPath:
        return 'reference'
    
    return 'general'