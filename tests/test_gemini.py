import sys
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_enhanced_gemini_service():
    print("=== ENHANCED GEMINI SERVICE TEST ===")
    
    try:
        print("Step 1: Initialize all services...")
        from app.services.document_processor import DocumentProcessor
        from app.services.search_service import SearchService
        from app.services.gemini_service import GeminiService
        from app.models.chat import ChatRequest
        
        # Initialize services
        doc_processor = DocumentProcessor()
        doc_processor.initialize()
        
        search_service = SearchService(doc_processor)
        search_service.initialize()
        
        gemini_service = GeminiService(search_service)
        gemini_service.initialize()
        
        print("✅ All services initialized")
        
        print("Step 2: Test question type detection...")
        test_questions = [
            "How do I create a new workflow?",
            "What is a JSON activity?",
            "I'm getting an error when running my workflow",
            "Show me an example of data mapping"
        ]
        
        for question in test_questions:
            q_type = gemini_service.detect_question_type(question)
            print(f"   '{question[:30]}...' → {q_type}")
        
        print("Step 3: Check enhanced status...")
        status = gemini_service.get_status()
        print("✅ Enhanced status:")
        for key, value in status.items():
            print(f"   {key}: {value}")
        
        print("Step 4: Test connection...")
        connection_test = gemini_service.test_connection()
        print(f"✅ Enhanced connection test: {connection_test['success']}")
        if connection_test['success']:
            print(f"   Response: {connection_test['test_response']}")
        
        # Test different question types if service is ready
        if status['can_chat']:
            print("\nStep 5: Test different question types...")
            
            test_cases = [
                ChatRequest(message="How do I create a workflow?", max_results=2),
                ChatRequest(message="What is JSON processing?", max_results=2),
            ]
            
            for i, chat_req in enumerate(test_cases, 1):
                print(f"\n--- Test Case {i}: {chat_req.message} ---")
                response = gemini_service.chat(chat_req)
                
                print(f"✅ Response generated:")
                print(f"   Length: {len(response.response)} chars")
                print(f"   Context chunks: {len(response.context_used)}")
                print(f"   Sources: {response.sources_count}")
                print(f"   Time: {response.processing_time:.3f}s")
                print(f"\n   Preview: {response.response[:300]}...")
                
                if response.context_used:
                    print(f"\n   Sources used:")
                    for chunk in response.context_used:
                        print(f"     - {chunk.page_title}: {chunk.source_url}")
        
        else:
            print("❌ Cannot test chat - need to run search test first to create data")
        
        print("\n=== ENHANCED GEMINI TEST COMPLETED ===")
        return True
        
    except Exception as e:
        print(f"❌ Enhanced Gemini test error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_enhanced_gemini_service()
    print(f"\nFinal result: {'SUCCESS' if success else 'FAILED'}")