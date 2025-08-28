import sys
import logging
from pathlib import Path

# Set up logging to see all output
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s')

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def debug_verbose():
    print("=== VERBOSE DEBUG TEST ===")
    
    try:
        print("Step 1: Basic imports...")
        import json
        import numpy as np
        from datetime import datetime
        print("✅ Basic imports work")
        
        print("Step 2: ML imports...")
        from sentence_transformers import SentenceTransformer
        from sklearn.metrics.pairwise import cosine_similarity
        print("✅ ML imports work")
        
        print("Step 3: App imports...")
        from app.config import EMBEDDING_MODEL, DATA_DIR
        print(f"✅ Config works: {EMBEDDING_MODEL}")
        
        print("Step 4: Model imports...")
        from app.models.upload import DocumentChunk, UploadRequest
        print("✅ Models work")
        
        print("Step 5: DocumentProcessor import...")
        from app.services.document_processor import DocumentProcessor
        print("✅ DocumentProcessor imported")
        
        print("Step 6: Create DocumentProcessor...")
        processor = DocumentProcessor()
        print("✅ DocumentProcessor created")
        
        print("Step 7: Initialize (this may take time)...")
        sys.stdout.flush()  # Force output before long operation
        processor.initialize()
        print("✅ DocumentProcessor initialized")
        
        print("Step 8: Check status...")
        status = processor.get_status()
        print(f"✅ Status: ready={status['ready']}, chunks={status['total_chunks']}")
        
        print("=== VERBOSE TEST COMPLETED ===")
        
    except KeyboardInterrupt:
        print("\n❌ Test interrupted by user (Ctrl+C)")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    print("Starting verbose debug test...")
    print("If this hangs, press Ctrl+C to interrupt")
    success = debug_verbose()
    print(f"Test completed: {'SUCCESS' if success else 'FAILED'}")