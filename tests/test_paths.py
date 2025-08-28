import sys
from pathlib import Path

print("=== Path Debug ===")
print(f"Current working directory: {Path.cwd()}")
print(f"Script location: {Path(__file__).parent}")
print(f"Project root should be: {Path(__file__).parent.parent}")

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

print(f"\nPython path includes:")
for path in sys.path[:5]:  # Show first 5
    print(f"  {path}")

print(f"\nChecking if app directory exists:")
app_dir = project_root / "app"
print(f"  {app_dir} exists: {app_dir.exists()}")

if app_dir.exists():
    print(f"  Contents of app/: {list(app_dir.iterdir())}")

print(f"\nTrying import...")
try:
    from app.config import EMBEDDING_MODEL
    print(f"✅ Config import works, model: {EMBEDDING_MODEL}")
except Exception as e:
    print(f"❌ Config import failed: {e}")
    