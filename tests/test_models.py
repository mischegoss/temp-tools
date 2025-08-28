import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.models.chat import ChatRequest, ChatResponse
from app.models.search import SearchRequest
from datetime import datetime

def test_models():
    try:
        # Test ChatRequest
        chat_req = ChatRequest(message="How do I create a workflow?")
        print("✅ ChatRequest model works")
        
        # Test SearchRequest
        search_req = SearchRequest(query="JSON activities")
        print("✅ SearchRequest model works")
        
        print("✅ All models imported successfully")
        
    except Exception as e:
        print(f"❌ Model error: {e}")

if __name__ == "__main__":
    test_models()