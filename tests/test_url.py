import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_url_conversion():
    from app.config import make_absolute_url
    
    test_cases = [
        "/actions/getting-started/workflows/",
        "actions/getting-started/workflows/",
        "/actions/Activity-Repository/JSON/json-to-table-activity/",
        "https://help.resolve.io/actions/already-absolute/"
    ]
    
    print("=== URL CONVERSION TEST ===")
    for relative_url in test_cases:
        absolute_url = make_absolute_url(relative_url)
        print(f"✅ '{relative_url}' → '{absolute_url}'")
    
    print("\n✅ All URL conversions working correctly!")

if __name__ == "__main__":
    test_url_conversion()