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
GCS_PROJECT_ID = os.getenv("GCS_PROJECT_ID", "gen-lang-client-0962398129")
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "pro-chatbot-data")
GCS_EMBEDDINGS_PATH = "embeddings"
GCS_CHUNKS_PATH = "chunks"
GCS_METADATA_PATH = "metadata"

# Enable GCS storage in production (Cloud Run), disable for local development
USE_GCS_STORAGE = os.getenv("USE_GCS_STORAGE", str(IS_CLOUD_RUN)).lower() in ('true', '1', 'yes')

# ========================================
# KNOWLEDGE BASE GCS CONFIGURATION
# ========================================
# Separate bucket for KB articles (distinct from docs bucket)
GCS_KB_BUCKET_NAME = os.getenv("GCS_KB_BUCKET_NAME", "pro-chatbot-kb")
GCS_KB_ARTICLES_PATH = "articles"

# Enable GCS KB storage (follows same pattern as docs)
USE_GCS_KB_STORAGE = os.getenv("USE_GCS_KB_STORAGE", str(IS_CLOUD_RUN)).lower() in ('true', '1', 'yes')

# KB GCS file names
KB_ARTICLES_FILE = "kb-articles.json"
KB_EMBEDDINGS_FILE = "kb-embeddings.npy"

# ========================================
# KNOWLEDGE BASE SEARCH SETTINGS
# ========================================
# Minimum similarity score for KB results
KB_SIMILARITY_THRESHOLD = float(os.getenv("KB_SIMILARITY_THRESHOLD", "0.3"))

# Version scoring bonuses (additive to base similarity score)
KB_VERSION_EXACT_BONUS = 0.15    # Article's applies_to_versions contains user's version
KB_VERSION_ALL_BONUS = 0.05      # Article's applies_to_versions is null (applies to all)
# No bonus (0.0) for articles that don't match user's version

# Maximum additional matches to return alongside primary match
KB_MAX_ADDITIONAL_MATCHES = int(os.getenv("KB_MAX_ADDITIONAL_MATCHES", "4"))

# Keywords that trigger direct KB search (bypassing docs-first behavior)
KB_DIRECT_SEARCH_TRIGGERS = [
    "support",
    "support article",
    "support articles",
    "zendesk",
    "kb",
    "knowledge base",
    "help center"
]

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

def detect_kb_intent(message: str) -> bool:
    """
    Check if user message indicates intent to search Knowledge Base directly.
    Returns True if any KB trigger phrase is found in the message.
    """
    message_lower = message.lower()
    return any(trigger in message_lower for trigger in KB_DIRECT_SEARCH_TRIGGERS)

def format_kb_version_display(applies_to_versions: list) -> str:
    """
    Format version info for KB article display.
    
    Args:
        applies_to_versions: List of version strings or None
        
    Returns:
        Human-readable version string (e.g., "All versions", "Pro 8.0", "Pro 8.0, 7.9")
    """
    if applies_to_versions is None:
        return "All versions"
    
    if not applies_to_versions:
        return "All versions"
    
    # Convert internal format to display format
    display_versions = []
    for v in applies_to_versions:
        display_versions.append(f"Pro {v.replace('-', '.')}")
    
    return ", ".join(display_versions)