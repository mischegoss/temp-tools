# CORRECTED VERSION - pro-api/app/routers/chat.py
# Fixed the "await" issue that was causing HTTP 500 errors
# ADDED: Missing upload-documentation endpoint with CRITICAL INTEGRATION FIX
# ✅ NEW FIX: Proper version detection from _VERSION field (handles "production-8-0-only" etc.)
# ✅ FIX 1: Query expansion before search
# ✅ FIX 2: Zero results handling with no hallucinations
# ✅ FIX 3: Unsupported version warning
# ✅ FIX 4: Removed non-existent ENABLE_QUERY_EXPANSION import
# ✅ PHASE 6: Added /upload-kb endpoint for Knowledge Base articles
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, Tuple, Dict, Any
import json
import logging
from datetime import datetime

from app.models.chat import ChatRequest, ChatResponse, ChatHealthCheck, ErrorResponse
from app.models.search import SearchRequest, SearchResponse, BulkSearchRequest, BulkSearchResponse
from app.models.upload import UploadRequest, UploadResponse, ComprehensiveUploadRequest, UploadStatus
from app.models.metadata import StatusResponse, ProcessingStatus
from app.config import (
    PRODUCT_NAME, 
    PRODUCT_DISPLAY_NAME, 
    PRO_SUPPORTED_VERSIONS,
    normalize_pro_version,
    detect_pro_documentation_type,
    detect_kb_intent,
    format_kb_version_display
)

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1", tags=["pro-chat"])

def get_services() -> Tuple:
    """
    Dependency to get initialized Pro services from main app.
    No initialization - just access pre-initialized services and validate readiness.
    """
    # Import here to avoid circular imports
    import app.main as main_app
    
    # Get services from main app's globals
    doc_processor = main_app.doc_processor
    search_service = main_app.search_service
    gemini_service = main_app.gemini_service
    services_initialized = main_app.services_initialized
    
    # Validate that services were initialized during startup
    if not services_initialized or not all([doc_processor, search_service, gemini_service]):
        raise HTTPException(
            status_code=503, 
            detail="Pro services not ready. Please wait for application startup to complete."
        )
    
    return doc_processor, search_service, gemini_service

@router.post("/chat", response_model=ChatResponse)
async def chat_with_pro_documentation(
    request: ChatRequest,
    services: Tuple = Depends(get_services)
) -> ChatResponse:
    """
    Chat endpoint specifically for Pro documentation with version awareness.
    
    KB Search Behavior (docs-first):
    1. Default: Search docs only, then offer to search support articles
    2. Explicit triggers: "support", "zendesk", "kb" → search KB directly
    3. User confirms "yes" after offer → search KB
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Validate and normalize Pro version
        effective_version = normalize_pro_version(request.version)
        original_version = request.version
        
        # Detect documentation type from context
        doc_type = detect_pro_documentation_type(request.message)
        
        logger.info(f"💬 Pro chat request: '{request.message[:50]}...' (version: {effective_version})")
        
        # ========================================
        # KB INTENT DETECTION
        # ========================================
        
        # Check for explicit KB triggers
        explicit_kb_request = detect_kb_intent(request.message)
        
        # Check for "yes" confirmation (user responding to KB offer)
        is_kb_confirmation = is_kb_search_confirmation(
            request.message, 
            request.conversation_history or []
        )
        
        # ========================================
        # KB SEARCH PATH (explicit trigger or confirmation)
        # ========================================
        if explicit_kb_request or is_kb_confirmation:
            logger.info(f"📚 KB search triggered: explicit={explicit_kb_request}, confirmation={is_kb_confirmation}")
            
            # Get the actual query (for confirmations, use previous user message)
            kb_query = request.message
            if is_kb_confirmation and request.conversation_history:
                # Find the last substantive user query before the confirmation
                kb_query = get_previous_user_query(request.conversation_history)
            
            # Expand query for better search
            expanded_query = gemini_service.expand_query(kb_query)
            
            search_start = datetime.now()
            
            # Search KB with version scoring
            kb_results = search_service.search_kb(
                query=expanded_query,
                user_version=effective_version,
                max_results=5
            )
            
            search_time = (datetime.now() - search_start).total_seconds() * 1000
            
            # Generate response from KB results
            chat_start = datetime.now()
            
            if kb_results.get("primary_match"):
                # Build KB response
                kb_response = generate_kb_response(
                    kb_results, 
                    gemini_service, 
                    kb_query,
                    effective_version,
                    request.conversation_history or []
                )
                chat_time = (datetime.now() - chat_start).total_seconds() * 1000
                
                return ChatResponse(
                    message=kb_response,
                    context_used=[{
                        "content": kb_results["primary_match"].get("content", "")[:200] + "...",
                        "source": kb_results["primary_match"].get("source_url", ""),
                        "score": kb_results["primary_match"].get("combined_score", 0),
                        "metadata": {"source_type": "knowledge-base"}
                    }],
                    processing_time=search_time + chat_time,
                    model_used=gemini_service.model_name,
                    enhanced_features_used=True,
                    relationship_enhanced_chunks=kb_results.get("total_found", 0),
                    version_context=effective_version
                )
            else:
                # No KB results found
                chat_time = (datetime.now() - chat_start).total_seconds() * 1000
                return ChatResponse(
                    message="I couldn't find any relevant support articles for that query. Would you like me to search the documentation instead?",
                    context_used=[],
                    processing_time=search_time + chat_time,
                    model_used=gemini_service.model_name,
                    enhanced_features_used=False,
                    relationship_enhanced_chunks=0,
                    version_context=effective_version
                )
        
        # ========================================
        # NORMAL DOCS-FIRST PATH
        # ========================================
        
        # Query expansion
        expanded_query = gemini_service.expand_query(request.message)
        logger.info(f"🔍 Using query: '{expanded_query[:100]}...'")
        
        search_start = datetime.now()
        
        # Enhanced search with Pro version filtering
        search_results = search_service.search_similarity(
            query=expanded_query,
            max_results=15,
            similarity_threshold=0.2,
            version_filter=effective_version,
            content_type_filter=doc_type
        )
        
        search_time = (datetime.now() - search_start).total_seconds() * 1000
        
        results_list = search_results.get("results", [])
        
        # ========================================
        # ZERO RESULTS HANDLING
        # ========================================
        if len(results_list) == 0:
            logger.warning(f"⚠️ Zero results found for query: '{request.message}' (version: {effective_version})")
            
            chat_start = datetime.now()
            
            chat_response = gemini_service.generate_response(
                user_message=request.message,
                context_chunks=[],
                version=effective_version,
                conversation_history=request.conversation_history or [],
                block_urls=True
            )
            
            chat_time = (datetime.now() - chat_start).total_seconds() * 1000
            
            # Offer KB search when no docs found
            response_with_offer = f"**No exact matches found in Pro {effective_version.replace('-', '.')} documentation.** Based on general knowledge:\n\n{chat_response}\n\n---\n💡 **Would you like me to search support articles?** These may contain troubleshooting guides and additional information."
            
            return ChatResponse(
                message=response_with_offer,
                context_used=[],
                processing_time=search_time + chat_time,
                model_used=gemini_service.model_name,
                enhanced_features_used=False,
                relationship_enhanced_chunks=0,
                version_context=effective_version
            )
        
        # ========================================
        # GENERATE RESPONSE WITH CONTEXT
        # ========================================
        chat_start = datetime.now()
        
        context_chunks = [
            {
                "content": result.get("content", ""),
                "source": result.get("source_url", result.get("source", "")),
                "page_title": result.get("page_title", ""),
                "score": result.get("score", 0)
            }
            for result in results_list[:5]
        ]
        
        chat_response = gemini_service.generate_response(
            user_message=request.message,
            context_chunks=context_chunks,
            version=effective_version,
            conversation_history=request.conversation_history or []
        )
        
        chat_time = (datetime.now() - chat_start).total_seconds() * 1000
        
        # ========================================
        # APPEND KB OFFER TO DOCS RESPONSE
        # ========================================
        kb_offer = "\n\n---\n💡 **Would you like me to search support articles?** These may contain additional troubleshooting information."
        
        final_response = chat_response + kb_offer
        
        # Version warning if needed
        if original_version and original_version not in PRO_SUPPORTED_VERSIONS:
            version_warning = f"\n\n⚠️ **Note:** Version '{original_version}' was not recognized. Showing results for Pro {effective_version.replace('-', '.')}."
            final_response = final_response + version_warning
        
        return ChatResponse(
            message=final_response,
            context_used=[
                {
                    "content": chunk.get("content", "")[:200] + "...",
                    "source": chunk.get("source", ""),
                    "score": chunk.get("score", 0),
                    "metadata": {}
                }
                for chunk in context_chunks
            ],
            processing_time=search_time + chat_time,
            model_used=gemini_service.model_name,
            enhanced_features_used=True,
            relationship_enhanced_chunks=len(context_chunks),
            version_context=effective_version
        )
        
    except Exception as e:
        logger.error(f"❌ Pro chat error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing Pro chat request: {str(e)}"
        )


def is_kb_search_confirmation(message: str, conversation_history: list) -> bool:
    """
    Check if the user message is a confirmation to search KB articles.
    
    Returns True if:
    1. Message is a short affirmative (yes, sure, please, etc.)
    2. Previous assistant message contained the KB offer
    """
    # Short affirmative patterns
    affirmative_patterns = [
        "yes", "yeah", "yep", "sure", "please", "ok", "okay",
        "yes please", "sure thing", "go ahead", "do it",
        "search support", "search kb", "check support"
    ]
    
    message_lower = message.lower().strip()
    
    # Check if message is a short affirmative
    is_affirmative = any(
        message_lower == pattern or message_lower.startswith(pattern + " ")
        for pattern in affirmative_patterns
    )
    
    if not is_affirmative:
        return False
    
    # Check if previous assistant message contained KB offer
    if not conversation_history:
        return False
    
    # Find last assistant message
    for msg in reversed(conversation_history):
        role = msg.role if hasattr(msg, 'role') else msg.get('role', '')
        content = msg.content if hasattr(msg, 'content') else msg.get('content', '')
        
        if role == 'assistant':
            # Check if it contained the KB offer
            return 'support articles' in content.lower() or 'search support' in content.lower()
    
    return False


def get_previous_user_query(conversation_history: list) -> str:
    """
    Get the previous substantive user query from conversation history.
    Used when user confirms KB search to find what they were asking about.
    """
    # Look backwards for a user message that's not just a confirmation
    confirmation_patterns = ["yes", "yeah", "yep", "sure", "please", "ok", "okay"]
    
    for msg in reversed(conversation_history):
        role = msg.role if hasattr(msg, 'role') else msg.get('role', '')
        content = msg.content if hasattr(msg, 'content') else msg.get('content', '')
        
        if role == 'user':
            content_lower = content.lower().strip()
            # Skip if it's just a short confirmation
            if content_lower not in confirmation_patterns and len(content) > 10:
                return content
    
    return ""


def generate_kb_response(kb_results: dict, gemini_service, query: str, 
                         version: str, conversation_history: list) -> str:
    """
    Generate a formatted response from KB search results.
    
    Uses KB-specific prompts from pro_prompts.py for better synthesis.
    
    Format:
    📋 **From Support Articles** (requires Zendesk login):
    
    [Synthesized answer from primary match]
    
    **Source:** [Title](URL)
    
    ---
    **Related support articles:**
    • [Title](URL) - Version info
    """
    from app.prompts.pro_prompts import build_kb_prompt
    
    primary = kb_results.get("primary_match")
    additional = kb_results.get("additional_matches", [])
    
    if not primary:
        return "I couldn't find relevant support articles for that query."
    
    # Generate synthesized answer using Gemini with KB-specific prompt
    try:
        # Build KB-specific prompt
        kb_prompt = build_kb_prompt(
            user_message=query,
            kb_article_content=primary.get("content", ""),
            article_title=primary.get("page_title", "Support Article"),
            version=version,
            conversation_history=conversation_history
        )
        
        # Generate response using the KB prompt directly
        synthesized_answer = gemini_service.generate_response(
            prompt=kb_prompt
        )
    except Exception as e:
        logger.warning(f"Gemini KB synthesis failed, using content directly: {e}")
        # Fallback: use a truncated version of the content
        content = primary.get("content", "")
        synthesized_answer = content[:1500] if len(content) > 1500 else content
    
    # Build response with KB header
    response_parts = [
        "📋 **From Support Articles** (requires Zendesk login):\n\n",
        synthesized_answer,
        f"\n\n**Source:** [{primary.get('page_title', 'Support Article')}]({primary.get('source_url', '')})"
    ]
    
    # Add related articles if any
    if additional:
        response_parts.append("\n\n---\n**Related support articles:**")
        for article in additional[:4]:  # Max 4 additional
            title = article.get("page_title", "Article")
            url = article.get("source_url", "")
            version_display = article.get("version_display", "All versions")
            response_parts.append(f"\n• [{title}]({url}) - {version_display}")
    
    return "".join(response_parts)

@router.post("/search", response_model=SearchResponse)
async def search_pro_documentation(
    request: SearchRequest,
    services: Tuple = Depends(get_services)
) -> SearchResponse:
    """
    Search endpoint for Pro documentation with version filtering
    """
    doc_processor, search_service, gemini_service = services
    
    try:
        # Normalize version
        effective_version = normalize_pro_version(request.version)
        
        logger.info(f"🔍 Pro search: '{request.query[:50]}...' (version: {effective_version})")
        
        search_results = search_service.search_similarity(
            query=request.query,
            max_results=request.max_results,
            similarity_threshold=request.similarity_threshold,
            version_filter=effective_version,
            content_type_filter=request.content_type_filter,
            complexity_filter=request.complexity_filter if hasattr(request, 'complexity_filter') else None
        )
        
        return SearchResponse(**search_results)
        
    except Exception as e:
        logger.error(f"❌ Pro search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching Pro documentation: {str(e)}"
        )

# ========================================
# KNOWLEDGE BASE UPLOAD ENDPOINT (PHASE 6)
# ========================================

@router.post("/upload-kb")
async def upload_kb_articles(
    file: UploadFile = File(...),
    services: Tuple = Depends(get_services)
):
    """
    Upload Knowledge Base articles JSON from Zendesk export.
    
    Expected JSON format:
    {
        "_GENERATED": "2026-01-03T...",
        "_PRODUCT": "pro",
        "_SOURCE_TYPE": "knowledge-base",
        "_TOTAL_ARTICLES": 385,
        "articles": [
            {
                "id": "article-slug",
                "search_text": "Title. First paragraph. Keywords: ...",
                "content": "Full article content...",
                "source_url": "https://resolvesystemssupport.zendesk.com/...",
                "page_title": "Article Title",
                "requires_login": true,
                "source_type": "knowledge-base",
                "applies_to_versions": ["8-0", "7-9"] or null,
                "metadata": {...}
            },
            ...
        ]
    }
    
    Returns:
        Success response with processing statistics
    """
    doc_proc, search_svc, gemini_svc = services
    start_time = datetime.now()
    
    try:
        # Validate file type
        if not file.filename.endswith('.json'):
            raise HTTPException(
                status_code=400, 
                detail="Only JSON files are supported. Please upload a .json file."
            )
        
        logger.info(f"📥 KB Upload started: {file.filename}")
        
        # Read and parse JSON
        content = await file.read()
        try:
            data = json.loads(content.decode('utf-8'))
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid JSON format: {str(e)}"
            )
        
        # Validate structure
        validation_result = validate_kb_json_structure(data)
        if not validation_result["valid"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid KB JSON structure: {validation_result['error']}"
            )
        
        # Extract articles
        articles = data.get('articles', [])
        if not articles:
            raise HTTPException(
                status_code=400,
                detail="No articles found in JSON. Expected 'articles' array."
            )
        
        logger.info(f"📦 Processing {len(articles)} KB articles...")
        
        # Process articles through DocumentProcessor
        try:
            result = doc_proc.update_with_kb_articles(articles)
            
            if not result.get("success"):
                raise HTTPException(
                    status_code=500,
                    detail=f"KB processing failed: {result.get('error', 'Unknown error')}"
                )
            
            logger.info(f"✅ DocumentProcessor updated with KB articles: {result}")
            
        except Exception as e:
            logger.error(f"❌ Failed to process KB articles: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process KB articles: {str(e)}"
            )
        
        # Sync SearchService with DocumentProcessor
        try:
            sync_result = search_svc.sync_kb_with_document_processor()
            logger.info(f"✅ SearchService KB sync: {sync_result}")
        except Exception as e:
            logger.warning(f"⚠️ SearchService KB sync warning: {e}")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Build response
        response = {
            "success": True,
            "message": f"Successfully processed {result['articles_processed']} KB articles",
            "filename": file.filename,
            "articles_processed": result.get("articles_processed", 0),
            "articles_skipped": result.get("articles_skipped", 0),
            "processing_time": processing_time,
            "embeddings_shape": result.get("embeddings_shape"),
            "gcs_persisted": result.get("gcs_persisted", False),
            "statistics": result.get("statistics", {}),
            "kb_ready": True
        }
        
        logger.info(f"✅ KB Upload complete: {result['articles_processed']} articles in {processing_time:.2f}s")
        
        return JSONResponse(content=response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ KB upload failed: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"KB upload failed: {str(e)}"
        )


def validate_kb_json_structure(data: dict) -> Dict[str, Any]:
    """
    Validate the structure of uploaded KB JSON.
    
    Required fields in each article:
    - id
    - search_text
    - content
    - source_url
    - page_title
    
    Returns:
        {"valid": True} or {"valid": False, "error": "..."}
    """
    # Check if it's a dict
    if not isinstance(data, dict):
        return {"valid": False, "error": "Root must be a JSON object"}
    
    # Check for articles array
    if 'articles' not in data:
        return {"valid": False, "error": "Missing 'articles' array"}
    
    articles = data['articles']
    if not isinstance(articles, list):
        return {"valid": False, "error": "'articles' must be an array"}
    
    if len(articles) == 0:
        return {"valid": False, "error": "'articles' array is empty"}
    
    # Validate first few articles have required fields
    required_fields = ['id', 'search_text', 'content', 'source_url', 'page_title']
    sample_size = min(5, len(articles))
    
    for i, article in enumerate(articles[:sample_size]):
        missing = [f for f in required_fields if not article.get(f)]
        if missing:
            return {
                "valid": False, 
                "error": f"Article {i} missing required fields: {missing}"
            }
    
    # Check source_type if present
    source_type = data.get('_SOURCE_TYPE')
    if source_type and source_type != 'knowledge-base':
        return {
            "valid": False,
            "error": f"Expected _SOURCE_TYPE 'knowledge-base', got '{source_type}'"
        }
    
    return {"valid": True}


@router.get("/kb-status")
async def get_kb_status(services: Tuple = Depends(get_services)):
    """
    Get Knowledge Base status and statistics.
    
    Returns:
        KB loading status, article count, and search readiness
    """
    doc_proc, search_svc, gemini_svc = services
    
    doc_status = doc_proc.get_status()
    search_status = search_svc.get_status()
    
    return {
        "kb_loaded": doc_status.get("kb_loaded", False),
        "kb_articles_count": doc_status.get("kb_articles_count", 0),
        "kb_embeddings_count": doc_status.get("kb_embeddings_count", 0),
        "kb_gcs_enabled": doc_status.get("kb_gcs_enabled", False),
        "kb_search_ready": search_status.get("can_search_kb", False),
        "message": "KB ready for search" if search_status.get("can_search_kb") else "KB not loaded"
    }


@router.post("/search-kb")
async def search_kb_articles(
    query: str,
    version: Optional[str] = "8-0",
    max_results: Optional[int] = 5,
    services: Tuple = Depends(get_services)
):
    """
    Search Knowledge Base articles with version-aware scoring.
    
    Args:
        query: Search query string
        version: User's Pro version (default: "8-0")
        max_results: Maximum results to return (default: 5)
        
    Returns:
        Primary match and additional related articles
    """
    doc_proc, search_svc, gemini_svc = services
    
    try:
        # Normalize version
        effective_version = normalize_pro_version(version)
        
        logger.info(f"🔍 KB search: '{query[:50]}...' (version: {effective_version})")
        
        # Perform KB search with version scoring
        results = search_svc.search_kb(
            query=query,
            user_version=effective_version,
            max_results=max_results
        )
        
        return results
        
    except Exception as e:
        logger.error(f"❌ KB search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error searching KB: {str(e)}"
        )


# ========================================
# UPLOAD DOCUMENTATION ENDPOINT WITH CRITICAL INTEGRATION FIX
# ========================================

# Upload status tracking
upload_statuses: Dict[str, Dict] = {}

def detect_upload_format(data: dict) -> str:
    """Detect whether uploaded JSON is comprehensive or legacy format"""
    # Comprehensive format indicators
    comprehensive_indicators = [
        '_GENERATED', '_PRODUCT', '_TOTAL_CHUNKS', '_ENHANCED_FEATURES', 
        '_STATS', '_VERSION'
    ]
    
    # Count how many comprehensive indicators are present
    comprehensive_count = sum(1 for indicator in comprehensive_indicators if indicator in data)
    
    if comprehensive_count >= 3:
        return "comprehensive"
    elif 'chunks' in data and isinstance(data['chunks'], list):
        return "legacy"
    else:
        return "unknown"

def clean_version_string(version: str) -> str:
    """
    Clean version string to normalized format (8-0, 7-9, 7-8)
    
    Handles formats like:
    - "production-8-0-only" -> "8-0"
    - "production-7-9-only" -> "7-9"
    - "8-0" -> "8-0"
    - "8.0" -> "8-0"
    """
    if not version:
        return "8-0"
    
    # Remove common prefixes and suffixes
    cleaned = version.replace('production-', '').replace('-only', '').strip()
    
    # Convert dots to dashes
    cleaned = cleaned.replace('.', '-')
    
    # Validate format
    if cleaned in ['8-0', '7-9', '7-8']:
        return cleaned
    
    # Default to 8-0 if invalid
    logger.warning(f"⚠️ Could not parse version '{version}', defaulting to 8-0")
    return "8-0"

def process_comprehensive_json_simple(data: dict, source: str) -> dict:
    """
    Process comprehensive JSON format for Pro documentation upload
    FIXED: Now returns actual processed chunks for integration
    ✅ NEW FIX: Properly cleans version string from _VERSION field
    """
    start_time = datetime.now()
    
    try:
        # Extract comprehensive metadata
        pro_product = data.get('_PRODUCT', 'pro')
        
        # ✅ CRITICAL FIX: Clean version string from _VERSION field
        # _VERSION can be "production-8-0-only", "production-7-9-only", "8-0", etc.
        raw_version = data.get('_VERSION', '8-0')
        pro_version = clean_version_string(raw_version)
        
        logger.info(f"📦 Processing Pro comprehensive upload: version '{raw_version}' -> '{pro_version}'")
        
        total_chunks = data.get('_TOTAL_CHUNKS', 0)
        enhanced_features = data.get('_ENHANCED_FEATURES', [])
        
        logger.info(f"   Total chunks: {total_chunks}, enhanced features: {len(enhanced_features)}")
        
        # Process chunks
        processed_chunks = []
        chunks = data.get('chunks', [])
        
        for chunk in chunks:
            # ✅ CRITICAL FIX: Clean version from chunk metadata too
            chunk_metadata = chunk.get('metadata', {})
            chunk_version = chunk_metadata.get('version', pro_version)
            
            # Clean the chunk version if present
            if chunk_version:
                chunk_version = clean_version_string(chunk_version)
            else:
                chunk_version = pro_version
            
            # Ensure chunk has all required fields for Pro processing
            processed_chunk = {
                'id': chunk.get('id', f'chunk-{len(processed_chunks)}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('original_content', chunk.get('content', '')),
                'header': chunk.get('header', ''),
                'source_url': chunk.get('source_url', ''),
                'page_title': chunk.get('page_title', ''),
                'content_type': chunk.get('content_type', {
                    'type': 'documentation',
                    'category': 'pro'
                }),
                'complexity': chunk.get('complexity', 'moderate'),
                'tokens': chunk.get('tokens', 0),
                'metadata': {
                    **(chunk_metadata),
                    'product': 'pro',
                    'version': chunk_version,  # ✅ Now using cleaned version
                    'upload_timestamp': datetime.now().timestamp(),
                    'pro_version_display': chunk_version.replace('-', '.')
                }
            }
            processed_chunks.append(processed_chunk)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Processed {len(processed_chunks)} Pro comprehensive chunks for version {pro_version}",
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "pro_version": pro_version,
            "pro_product": pro_product,
            "enhanced_features": enhanced_features,
            "processed_chunks_data": processed_chunks  # ✅ Return actual chunks for integration
        }
        
    except Exception as e:
        logger.error(f"❌ Comprehensive processing failed: {e}")
        return {
            "success": False,
            "message": f"Pro comprehensive processing failed: {str(e)}",
            "processed_chunks": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "processed_chunks_data": []  # ✅ Return empty list on failure
        }

def process_legacy_json_simple(chunks: list, source: str) -> dict:
    """
    Process legacy JSON format (simple chunks array) for Pro documentation
    FIXED: Now returns actual processed chunks for integration
    """
    start_time = datetime.now()
    
    try:
        processed_chunks = []
        
        for chunk in chunks:
            processed_chunk = {
                'id': chunk.get('id', f'chunk-{len(processed_chunks)}'),
                'content': chunk.get('content', ''),
                'original_content': chunk.get('original_content', chunk.get('content', '')),
                'header': chunk.get('header', ''),
                'source_url': chunk.get('source_url', ''),
                'page_title': chunk.get('page_title', ''),
                'content_type': chunk.get('content_type', 'general'),
                'complexity': chunk.get('complexity', 'intermediate'),
                'tokens': chunk.get('tokens', 0),
                'metadata': {
                    **chunk.get('metadata', {}),
                    'product': 'pro',
                    'upload_timestamp': datetime.now().timestamp(),
                    'source': source
                }
            }
            processed_chunks.append(processed_chunk)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            "success": True,
            "message": f"Processed {len(processed_chunks)} Pro legacy chunks",
            "processed_chunks": len(processed_chunks),
            "processing_time": processing_time,
            "processed_chunks_data": processed_chunks  # ✅ Return actual chunks for integration
        }
        
    except Exception as e:
        logger.error(f"❌ Legacy processing failed: {e}")
        return {
            "success": False,
            "message": f"Pro legacy processing failed: {str(e)}",
            "processed_chunks": 0,
            "processing_time": (datetime.now() - start_time).total_seconds(),
            "processed_chunks_data": []  # ✅ Return empty list on failure
        }

@router.post("/upload-documentation", response_model=UploadResponse)
async def upload_documentation(
    file: UploadFile = File(...),
    source: str = "pro-uploaded-docs",
    services = Depends(get_services)
):
    """Upload and process Pro documentation JSON file - WITH CRITICAL INTEGRATION FIX"""
    try:
        doc_proc, search_svc, gemini_svc = services
        
        # Validate file type
        if not file.filename.endswith('.json'):
            raise HTTPException(status_code=400, detail="Only JSON files are supported")
        
        # Read and parse JSON
        content = await file.read()
        try:
            data = json.loads(content.decode('utf-8'))
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
        
        # Validate basic structure
        if 'chunks' not in data:
            raise HTTPException(status_code=400, detail="JSON must contain 'chunks' array")
        
        # Detect upload format
        upload_format = detect_upload_format(data)
        logger.info(f"📦 Pro upload detected format: {upload_format}")
        
        # Process based on format
        if upload_format == "comprehensive":
            # Process comprehensive format
            result = process_comprehensive_json_simple(data, source)
            
            if result["success"]:
                logger.info(f"✅ Pro comprehensive processing completed: {result['processed_chunks']} chunks for version {result.get('pro_version', 'unknown')}")
                
                # ✅ CRITICAL INTEGRATION FIX: Store processed chunks in DocumentProcessor
                try:
                    processed_chunks = result.get("processed_chunks_data", [])
                    if processed_chunks:
                        update_result = doc_proc.update_with_processed_chunks(processed_chunks)
                        logger.info(f"✅ DocumentProcessor updated: {update_result}")
                        
                        # ✅ CRITICAL FIX: Sync SearchService with DocumentProcessor
                        sync_result = search_svc.sync_with_document_processor()
                        logger.info(f"✅ SearchService synced via sync_with_document_processor: {sync_result}")
                    else:
                        logger.warning("⚠️ No processed chunks data to integrate")
                        
                except Exception as e:
                    logger.error(f"❌ Failed to integrate chunks into DocumentProcessor: {e}")
                    return UploadResponse(
                        success=False,
                        message=f"Upload processed but integration failed: {str(e)}",
                        chunks_processed=0,
                        processing_time=result.get("processing_time", 0.0)
                    )
            
            # Remove processed_chunks_data before returning (not needed in response)
            result.pop("processed_chunks_data", None)
            return UploadResponse(**result)
                
        elif upload_format == "legacy":
            # Process legacy format
            logger.info("📋 Processing Pro legacy upload format")
            
            chunks = data.get('chunks', [])
            result = process_legacy_json_simple(chunks, source)
            
            if result["success"]:
                logger.info(f"✅ Pro legacy processing completed: {result['processed_chunks']} chunks")
                
                # ✅ CRITICAL INTEGRATION FIX: Store processed chunks in DocumentProcessor
                try:
                    processed_chunks = result.get("processed_chunks_data", [])
                    if processed_chunks:
                        update_result = doc_proc.update_with_processed_chunks(processed_chunks)
                        logger.info(f"✅ DocumentProcessor updated: {update_result}")
                        
                        # ✅ CRITICAL FIX: Sync SearchService with DocumentProcessor
                        sync_result = search_svc.sync_with_document_processor()
                        logger.info(f"✅ SearchService synced via sync_with_document_processor: {sync_result}")
                    else:
                        logger.warning("⚠️ No processed chunks data to integrate")
                        
                except Exception as e:
                    logger.error(f"❌ Failed to integrate chunks into DocumentProcessor: {e}")
                    return UploadResponse(
                        success=False,
                        message=f"Upload processed but integration failed: {str(e)}",
                        chunks_processed=0,
                        processing_time=result.get("processing_time", 0.0)
                    )
            
            # Remove processed_chunks_data before returning (not needed in response)
            result.pop("processed_chunks_data", None)
            return UploadResponse(**result)
        
        else:
            logger.error(f"❌ Unknown Pro upload format: {upload_format}")
            raise HTTPException(status_code=400, detail=f"Unknown Pro upload format: {upload_format}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Pro upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pro upload failed: {str(e)}")

@router.get("/upload-status/{upload_id}")
async def get_upload_status(upload_id: str) -> UploadStatus:
    """
    Get status of a Pro documentation upload operation
    """
    if upload_id not in upload_statuses:
        raise HTTPException(status_code=404, detail="Upload not found")
    
    status_data = upload_statuses[upload_id]
    
    return UploadStatus(
        upload_id=upload_id,
        status=status_data.get("status", "pending"),
        progress_percentage=status_data.get("progress", 0.0),
        documents_processed=status_data.get("processed", 0),
        total_documents=status_data.get("total", 1),
        current_document=status_data.get("current"),
        estimated_completion=status_data.get("eta"),
        errors_encountered=status_data.get("errors", 0),
        last_error=status_data.get("last_error")
    )