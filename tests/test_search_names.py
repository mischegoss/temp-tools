import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def check_search_methods():
    try:
        from app.services.document_processor import DocumentProcessor
        from app.services.search_service import SearchService
        
        doc_processor = DocumentProcessor()
        search_service = SearchService(doc_processor)
        
        print("=== SearchService Methods ===")
        methods = [method for method in dir(search_service) if not method.startswith('_')]
        for method in methods:
            print(f"  {method}")
        
        print(f"\n=== SearchService Attributes ===")
        attrs = ['ready', 'embeddings', 'metadata', 'chunk_data', 'chunk_lookup']
        for attr in attrs:
            if hasattr(search_service, attr):
                value = getattr(search_service, attr)
                print(f"  {attr}: {type(value)} - {value if not isinstance(value, (list, dict)) else f'{type(value).__name__} with {len(value)} items'}")
            else:
                print(f"  {attr}: MISSING")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_search_methods()