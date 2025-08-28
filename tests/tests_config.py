import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.config_loader import load_environment
from app.config import DATA_DIR, EMBEDDING_MODEL

def test_config():
    try:
        # Test environment loading
        env = load_environment()
        print("✅ Environment loaded successfully")
        print(f"   App Name: {env['app_name']}")
        print(f"   Gemini Model: {env['gemini_model']}")
        print(f"   API Key: {env['gemini_api_key'][:10]}...")
        
        # Test file paths
        print(f"✅ Data directory: {DATA_DIR}")
        print(f"✅ Embedding model: {EMBEDDING_MODEL}")
        
        # Check if data directory exists
        if DATA_DIR.exists():
            print("✅ Data directory exists")
        else:
            print("❌ Data directory missing")
            
    except Exception as e:
        print(f"❌ Configuration error: {e}")

if __name__ == "__main__":
    test_config()