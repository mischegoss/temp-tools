import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.services.document_processor import DocumentProcessor
from app.models.upload import DocumentChunk
from datetime import datetime

def test_document_processor():
    try:
        # Initialize processor
        processor = DocumentProcessor()
        print("✅ DocumentProcessor created")
        
        # Test initialization (this will download the model if needed)
        print("🔄 Initializing model (this may take a few minutes first time)...")
        processor.initialize()
        print("✅ DocumentProcessor initialized")
        
        # Test content hash
        test_content = "This is a test chunk"
        content_hash = processor.compute_content_hash(test_content)
        print(f"✅ Content hash generated: {content_hash[:16]}...")
        
        # Test status
        status = processor.get_status()
        print(f"✅ Status retrieved: {status['total_chunks']} chunks, ready: {status['ready']}")
        
        print("✅ All document processor tests passed!")
        
    except Exception as e:
        print(f"❌ Document processor error: {e}")

if __name__ == "__main__":
    test_document_processor()