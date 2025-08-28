import sys
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_search_step_by_step():
    print("=== SEARCH SERVICE STEP BY STEP TEST ===")
    
    try:
        print("Step 1: Import and create DocumentProcessor...")
        from app.services.document_processor import DocumentProcessor
        doc_processor = DocumentProcessor()
        doc_processor.initialize()
        print("✅ DocumentProcessor ready")
        
        print("Step 2: Import and create SearchService...")
        from app.services.search_service import SearchService
        search_service = SearchService(doc_processor)
        print("✅ SearchService created")
        
        print("Step 3: Initialize SearchService...")
        search_service.initialize()
        print(f"✅ SearchService initialized, ready: {search_service.ready}")
        
        print("Step 4: Get search stats...")
        stats = search_service.get_search_stats()
        print("✅ Search stats:")
        for key, value in stats.items():
            print(f"   {key}: {value}")
        
        # If no data, create some test data
        if not stats['ready']:
            print("\nStep 5: Creating test data...")
            from app.models.upload import DocumentChunk, UploadRequest
            from datetime import datetime
            
            test_chunks = [
                DocumentChunk(
                    id="test_1",
                    content="How to create workflows in the automation system",
                    original_content="# How to create workflows",
                    header="Getting Started",
                    source_url="/actions/getting-started/workflows/",
                    page_title="Create Workflows",
                    content_type={"type": "tutorial", "category": "getting-started"},
                    complexity="simple",
                    tokens=50,
                    metadata={"tags": ["workflow", "tutorial"]}
                )
            ]
            
            upload_request = UploadRequest(
                source="test-docs",
                chunks=test_chunks,
                generated_at=datetime.now(),
                total_chunks=len(test_chunks),
                total_tokens=50
            )
            
            print("   Processing upload...")
            result = doc_processor.process_upload(upload_request)
            print(f"   Upload result: {result['success']}")
            
            print("   Refreshing search service...")
            search_service.refresh_data()
            print(f"   Search ready now: {search_service.ready}")
        
        # Test search
        if search_service.ready:
            print("\nStep 6: Testing search...")
            from app.models.search import SearchRequest
            
            search_req = SearchRequest(
                query="workflow creation",
                max_results=3,
                min_similarity=0.1
            )
            
            response = search_service.search(search_req)
            print(f"✅ Search completed:")
            print(f"   Query: {response.query}")
            print(f"   Results found: {response.total_found}")
            print(f"   Processing time: {response.processing_time:.3f}s")
            
            for i, result in enumerate(response.results):
                print(f"   {i+1}. {result.page_title} (score: {result.similarity_score:.3f})")
        else:
            print("❌ Search service not ready for testing")
        
        print("\n=== SEARCH TEST COMPLETED SUCCESSFULLY ===")
        return True
        
    except Exception as e:
        print(f"❌ Error in search test: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_search_step_by_step()
    print(f"\nFinal result: {'SUCCESS' if success else 'FAILED'}")