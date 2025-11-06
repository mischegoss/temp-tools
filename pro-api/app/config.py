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

# Pro-specific URL settings
BASE_DOCUMENTATION_URL = "https://docs.resolve.io"
PRODUCT_NAME = "pro"
PRODUCT_DISPLAY_NAME = "Resolve Pro"

# Pro version configuration
PRO_SUPPORTED_VERSIONS = ["7-8", "7-9", "8-0", "general"]
PRO_DEFAULT_VERSION = "8-0"
PRO_VERSION_MAPPINGS = {
    "7.8": "7-8",
    "7.9": "7-9", 
    "8.0": "8-0",
    "7-8": "7-8",
    "7-9": "7-9",
    "8-0": "8-0",
    "general": "8-0",
    "latest": "8-0"
}

# Pro-specific route patterns
PRO_ROUTE_PATTERNS = ["/pro"]

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
    """Convert relative Pro documentation URL to absolute URL"""
    if relative_url.startswith('http'):
        return relative_url  # Already absolute
    
    # Remove leading slash if present
    clean_path = relative_url.lstrip('/')
    
    # Ensure Pro prefix for relative URLs
    if not clean_path.startswith('pro/'):
        clean_path = f"pro/{clean_path}"
    
    return f"{BASE_DOCUMENTATION_URL}/{clean_path}"

def get_version_display_name(version: str) -> str:
    """Get display name for Pro version"""
    version_displays = {
        "7-8": "Pro 7.8",
        "7-9": "Pro 7.9", 
        "8-0": "Pro 8.0 (Latest)",
        "general": "General (Pro 8.0)"
    }
    return version_displays.get(version, f"Pro {version.replace('-', '.')}")

def normalize_pro_version(version: str) -> str:
    """Normalize Pro version string to internal format"""
    if not version:
        return PRO_DEFAULT_VERSION
    
    # Use mappings to normalize
    normalized = PRO_VERSION_MAPPINGS.get(version, version)
    
    # Validate against supported versions
    if normalized not in PRO_SUPPORTED_VERSIONS:
        return PRO_DEFAULT_VERSION
        
    return normalized

def detect_pro_documentation_type(pathname: str) -> str:
    """Detect Pro documentation type from path"""
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