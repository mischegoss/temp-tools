import os
from dotenv import load_dotenv
from pathlib import Path

def load_environment():
    """Load environment variables from .env file"""
    # Load .env file from project root
    env_path = Path(__file__).parent.parent / ".env"
    load_dotenv(env_path)
    
    # Validate required environment variables
    required_vars = ["GEMINI_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    return {
        "gemini_api_key": os.getenv("GEMINI_API_KEY"),
        "gemini_model": os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
        "debug": os.getenv("DEBUG", "False").lower() == "true",
        "app_name": os.getenv("APP_NAME", "FastAPI Gemini Chatbot")
    }