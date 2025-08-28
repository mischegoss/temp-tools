print("=== Testing basic imports ===")

try:
    print("Testing numpy...")
    import numpy as np
    print("✅ numpy works")
    
    print("Testing sklearn...")
    from sklearn.metrics.pairwise import cosine_similarity
    print("✅ sklearn works")
    
    print("Testing sentence-transformers...")
    from sentence_transformers import SentenceTransformer
    print("✅ sentence-transformers import works")
    
    print("Testing model loading (this may take time)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Model loaded successfully")
    
    print("Testing encoding...")
    embeddings = model.encode(["test sentence"])
    print(f"✅ Encoding works, shape: {embeddings.shape}")
    
    print("=== All basic tests passed ===")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Other error: {e}")
    import traceback
    traceback.print_exc()