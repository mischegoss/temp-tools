import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api_endpoints():
    print("=== API ENDPOINTS TEST ===")
    print("Make sure to start the server first: uvicorn app.main:app --reload")
    print()
    
    try:
        # Test 1: Health check
        print("1. Testing health endpoint...")
        response = requests.get(f"{BASE_URL}/api/v1/health")
        if response.status_code == 200:
            print(f"✅ Health: {response.json()}")
        else:
            print(f"❌ Health failed: {response.status_code}")
            return
        
        # Test 2: Status check
        print("\n2. Testing status endpoint...")
        response = requests.get(f"{BASE_URL}/api/v1/status")
        if response.status_code == 200:
            status = response.json()
            print(f"✅ Status: ready={status['ready']}, chunks={status['status']['total_chunks']}")
        else:
            print(f"❌ Status failed: {response.status_code}")
        
        # Test 3: Test connection
        print("\n3. Testing Gemini connection...")
        response = requests.get(f"{BASE_URL}/api/v1/test-connection")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Connection: {result['message']}")
        else:
            print(f"❌ Connection failed: {response.status_code}")
        
        # Test 4: Search (if data exists)
        print("\n4. Testing search endpoint...")
        search_data = {
            "query": "workflow creation",
            "max_results": 3,
            "min_similarity": 0.1
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/search", json=search_data)
        if response.status_code == 200:
            results = response.json()
            print(f"✅ Search: {results['total_found']} results found")
        else:
            print(f"⚠️ Search: {response.status_code} (may need documents first)")
        
        # Test 5: Chat (if data exists)
        print("\n5. Testing chat endpoint...")
        chat_data = {
            "message": "How do I create a workflow?",
            "max_results": 3
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/chat", json=chat_data)
        if response.status_code == 200:
            chat_result = response.json()
            print(f"✅ Chat: Response generated ({len(chat_result['response'])} chars)")
            print(f"   Context used: {len(chat_result['context_used'])} chunks")
            print(f"   Sources: {chat_result['sources_count']}")
        else:
            print(f"⚠️ Chat: {response.status_code} (may need documents first)")
        
        print("\n=== API TEST COMPLETED ===")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the server is running:")
        print("   uvicorn app.main:app --reload --port 8000")
    except Exception as e:
        print(f"❌ API test error: {e}")

if __name__ == "__main__":
    test_api_endpoints()