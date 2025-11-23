# COMPLETE FIXED VERSION - app/services/gemini_service.py
# CRITICAL FIX: Actually uses context_chunks in prompts for proper source attribution
# Fixed integration with search results
# ✅ NEW: Added expand_query() method for Fix 1

import os
import time
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai

from app.config import GEMINI_MODEL, MAX_CONTEXT_CHUNKS, MAX_TOKENS_PER_CHUNK, PRODUCT_DISPLAY_NAME, PRO_SUPPORTED_VERSIONS
from app.prompts.pro_prompts import PRO_SYSTEM_PROMPT, PRO_RESPONSE_FORMATS

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, product_name: str = "pro"):
        """Initialize Gemini service for Pro"""
        self.model = None
        self.model_name = GEMINI_MODEL
        self.product_name = product_name
        
        # Performance tracking
        self.request_count = 0
        self.error_count = 0
        self.total_response_time = 0.0
        self.last_response_time = None
        
        # Initialize Gemini API
        self._initialize_gemini()
    
    def _initialize_gemini(self):
        """Initialize the Gemini API"""
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                logger.warning("⚠️ GEMINI_API_KEY not found - Gemini service will be limited")
                return
            
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 2048,
                }
            )
            logger.info(f"✅ Gemini service initialized with model: {self.model_name}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini service: {e}")
            self.model = None
    
    def get_status(self) -> Dict[str, Any]:
        """Get Gemini service status"""
        return {
            "ready": self.model is not None,
            "model_loaded": self.model is not None,
            "model_name": self.model_name,
            "can_chat": self.model is not None,
            "request_count": self.request_count,
            "error_count": self.error_count,
            "error_rate": self.error_count / max(1, self.request_count),
            "average_response_time": self.total_response_time / max(1, self.request_count),
            "last_response_time": self.last_response_time,
            "supported_versions": PRO_SUPPORTED_VERSIONS,
            "enhanced_features_available": True,
            "pro_specific": {
                "version_aware": True,
                "workflow_support": True,
                "integration_guidance": True,
                "troubleshooting_support": True
            }
        }

    # ========================================
    # ✅ NEW METHOD - FIX 1: QUERY EXPANSION
    # ========================================
    def expand_query(self, user_query: str) -> str:
        """
        Expand a user query into related terms for better semantic search.
        
        Args:
            user_query: Original user query (e.g., "What is a filter?")
            
        Returns:
            Expanded query string with related terms (e.g., "filter, filters, filtering, filter condition...")
        """
        if not self.model:
            logger.warning("⚠️ Gemini not available for query expansion, using original query")
            return user_query
        
        try:
            expansion_prompt = f"""You are a Pro documentation search assistant. Expand this search query into related terms and variations.

Original query: "{user_query}"

Instructions:
1. Include the original term(s)
2. Add plural/singular variations
3. Add related technical terms used in Pro documentation
4. Add common synonyms and alternative phrasings
5. Keep it focused on Pro terminology
6. Return ONLY a comma-separated list of terms, no explanations

Example:
Query: "What is a filter?"
Expansion: "filter, filters, filtering, filter condition, filter criteria, filter rule, data filtering, apply filter, filter configuration"

Now expand this query: "{user_query}"

Return only the comma-separated terms:"""

            response = self.model.generate_content(
                expansion_prompt,
                generation_config={
                    "temperature": 0.3,  # Lower temperature for consistent expansions
                    "max_output_tokens": 150,  # Keep it concise
                }
            )
            
            if response and response.text:
                expanded_query = response.text.strip()
                logger.info(f"🔍 Expanded query: '{user_query}' → '{expanded_query}'")
                return expanded_query
            else:
                logger.warning("⚠️ Query expansion returned empty, using original query")
                return user_query
                
        except Exception as e:
            logger.warning(f"⚠️ Query expansion failed: {e}, using original query")
            return user_query

    def generate_response(self, user_message: str = None, prompt: str = None, 
                          context_chunks: List = None, version: str = "8-0", 
                          conversation_history: List = None, block_urls: bool = False, **kwargs) -> str:
        """
        CRITICAL FIX: Actually uses context_chunks in prompt generation
        
        Args:
            user_message: User's question
            prompt: Direct prompt (overrides user_message if provided)
            context_chunks: Search result chunks for context
            version: Pro version
            conversation_history: Previous messages
            block_urls: If True, instruct Gemini to not include any URLs (for zero-context responses)
            **kwargs: Additional arguments
        """
        try:
            if not self.model:
                return self._get_pro_fallback_response("Service temporarily unavailable")
            
            # Handle flexible parameter input
            if prompt:
                # If prompt is provided directly, use it
                final_prompt = prompt
            elif user_message:
                # FIXED: Build a Pro prompt that actually uses context_chunks
                final_prompt = self._build_pro_prompt_with_context(
                    user_message, 
                    context_chunks or [], 
                    version, 
                    conversation_history or [],
                    block_urls=block_urls  # ✅ NEW: Pass block_urls flag
                )
            else:
                raise ValueError("Either 'prompt' or 'user_message' must be provided")
            
            # Generate content with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = self.model.generate_content(final_prompt)
                    
                    if response and response.text:
                        # Update tracking
                        self.request_count += 1
                        return response.text
                    else:
                        logger.warning(f"⚠️ Empty response from Gemini on attempt {attempt + 1}")
                        
                except Exception as retry_error:
                    logger.warning(f"⚠️ Gemini generation attempt {attempt + 1} failed: {retry_error}")
                    if attempt == max_retries - 1:
                        raise retry_error
                    time.sleep(0.5 * (attempt + 1))
            
            return self._get_pro_fallback_response("Could not generate response after retries")
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"❌ Pro Gemini response generation failed: {e}")
            return self._get_pro_fallback_response(f"Error: {str(e)}")

    def _build_pro_prompt_with_context(self, user_message: str, context_chunks: List, version: str = "8-0", 
                                      conversation_history: List = None, block_urls: bool = False) -> str:
        """
        CRITICAL FIX: Build Pro-specific prompt that actually uses context chunks
        
        Args:
            user_message: User's question
            context_chunks: Search result chunks
            version: Pro version
            conversation_history: Previous messages
            block_urls: If True, instruct to not include URLs (for zero-context general guidance)
        """
        
        # Build version context
        version_display = version.replace('-', '.')
        
        # ✅ NEW: Add URL blocking instruction if requested (Fix 2)
        url_instruction = ""
        if block_urls:
            url_instruction = """
CRITICAL INSTRUCTION: This is general guidance only, not from official documentation.
DO NOT include any URLs or documentation links in your response.
DO NOT reference specific documentation pages.
Clearly state this is general guidance at the start of your response.
"""
        
        # Process context chunks into useful context
        context_section = ""
        if context_chunks:
            logger.info(f"📝 Building prompt with {len(context_chunks)} context chunks")
            
            context_section = "RELEVANT DOCUMENTATION CONTEXT:\n\n"
            for i, chunk in enumerate(context_chunks[:MAX_CONTEXT_CHUNKS]):
                # Handle both dict and object formats
                if hasattr(chunk, 'get'):
                    # Dictionary format from search results
                    content = chunk.get('content', '')
                    source = chunk.get('source_url', chunk.get('source', 'Pro Documentation'))
                    page_title = chunk.get('page_title', '')
                    header = chunk.get('header', '')
                    score = chunk.get('similarity_score', chunk.get('score', 0))
                elif hasattr(chunk, '__dict__'):
                    # Object format
                    content = getattr(chunk, 'content', '')
                    source = getattr(chunk, 'source', 'Pro Documentation')
                    page_title = getattr(chunk, 'page_title', '')
                    header = getattr(chunk, 'header', '')
                    score = getattr(chunk, 'score', 0)
                else:
                    # Unknown format
                    logger.warning(f"Unknown chunk format: {type(chunk)}")
                    continue
                
                # Truncate content if too long
                if len(content) > MAX_TOKENS_PER_CHUNK:
                    content = content[:MAX_TOKENS_PER_CHUNK] + "..."
                
                # Build context entry
                source_info = f"Source: {source}"
                if page_title:
                    source_info += f" | Page: {page_title}"
                if header:
                    source_info += f" | Section: {header}"
                source_info += f" | Relevance: {score:.3f}"
                
                context_section += f"--- Context {i+1} ---\n"
                context_section += f"{source_info}\n\n"
                context_section += f"{content}\n\n"
            
            context_section += "--- End Context ---\n\n"
        else:
            logger.info("📝 Building prompt with no context chunks")
        
        # Process conversation history
        history_section = ""
        if conversation_history:
            logger.info(f"💬 Adding {len(conversation_history)} conversation history items")
            history_section = "CONVERSATION HISTORY:\n\n"
            
            for msg in conversation_history[-5:]:  # Last 5 messages
                try:
                    # Handle both dict and object formats safely
                    if hasattr(msg, 'get'):
                        role = msg.get('role', 'unknown')
                        content = msg.get('content', '')
                    elif hasattr(msg, 'role'):
                        role = msg.role
                        content = msg.content
                    else:
                        # Skip unknown formats
                        logger.warning(f"Unknown message format: {type(msg)}")
                        continue
                    
                    # Truncate long messages
                    if len(content) > 200:
                        content = content[:200] + "..."
                    
                    role_display = "User" if role == "user" else "Assistant"
                    history_section += f"{role_display}: {content}\n\n"
                    
                except Exception as msg_error:
                    logger.warning(f"Error processing conversation message: {msg_error}")
                    continue
            
            history_section += "--- End History ---\n\n"
        
        # Choose appropriate response format based on message content
        doc_type = self._detect_documentation_type(user_message)
        response_format = PRO_RESPONSE_FORMATS.get(doc_type, PRO_RESPONSE_FORMATS["general"])
        
        # Build the complete prompt
        prompt = f"""{PRO_SYSTEM_PROMPT}

{response_format}

VERSION CONTEXT: You are providing guidance for {PRODUCT_DISPLAY_NAME} version {version_display}.

{url_instruction}

{history_section}{context_section}USER QUESTION: {user_message}

INSTRUCTIONS:
1. **Use the provided context**: Base your response primarily on the documentation context provided above
2. **Cite sources**: When referencing information from the context, mention the specific source
3. **Be Pro version-aware**: Consider the Pro {version_display} context in your response
4. **Stay focused**: Address the user's specific question directly
5. **Provide actionable guidance**: Include specific steps, menu paths, or configuration details when relevant

Please provide a helpful, accurate response about {PRODUCT_DISPLAY_NAME}:"""

        logger.info(f"📝 Built prompt with context: {len(context_chunks)} chunks, {len(conversation_history or [])} history items, block_urls={block_urls}")
        return prompt

    def _detect_documentation_type(self, message: str) -> str:
        """Detect Pro documentation type from message content"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['workflow', 'activity', 'action', 'process']):
            return 'workflow'
        elif any(word in message_lower for word in ['config', 'setting', 'setup', 'admin', 'configure']):
            return 'configuration'
        elif any(word in message_lower for word in ['integration', 'api', 'connect', 'webhook']):
            return 'integration'
        elif any(word in message_lower for word in ['error', 'problem', 'issue', 'troubleshoot', 'debug']):
            return 'troubleshooting'
        elif any(word in message_lower for word in ['monitor', 'alert', 'dashboard', 'report']):
            return 'monitoring'
        elif any(word in message_lower for word in ['user', 'permission', 'role', 'access']):
            return 'administration'
        else:
            return 'general'

    def set_search_service(self, search_service):
        """Set search service reference to avoid circular imports"""
        self.search_service = search_service

    def chat(self, request) -> object:
        """
        CRITICAL FIX: Generate Pro chat response with search integration
        """
        from app.models.chat import ChatResponse
        
        start_time = time.time()
        self.request_count += 1
        
        try:
            # Use injected search service instead of importing main
            search_service = getattr(self, 'search_service', None)
            
            if not search_service or not search_service.ready:
                logger.warning("🔍 Search service not ready for Pro chat")
                return self._generate_fallback_response(request.message)
            
            # CRITICAL FIX: Actually perform search to get context
            logger.info(f"🔍 Performing search for chat context: '{request.message[:50]}...'")
            
            try:
                # Use the search method to get context (synchronous)
                from app.models.search import SearchRequest
                search_request = SearchRequest(
                    query=request.message,
                    max_results=3,
                    similarity_threshold=0.2,
                    version=getattr(request, 'version', '8-0')
                )
                search_results = search_service.search(search_request)
                
                context_chunks = search_results.get('results', [])
                logger.info(f"📝 Found {len(context_chunks)} context chunks for chat")
                
            except Exception as search_error:
                logger.warning(f"Search failed, proceeding without context: {search_error}")
                context_chunks = []
            
            # Build conversation history
            conversation_history = getattr(request, 'conversation_history', []) or []
            
            # FIXED: Use actual context chunks in response generation
            response_text = self.generate_response(
                user_message=request.message,
                context_chunks=context_chunks,  # FIXED: Pass actual search results
                version=getattr(request, 'version', '8-0'),
                conversation_history=conversation_history
            )
            
            # Calculate processing time
            processing_time = time.time() - start_time
            self.last_response_time = round(processing_time, 3)
            self.total_response_time += processing_time
            
            # FIXED: Build context_used with actual search results
            context_used = []
            for chunk in context_chunks[:3]:  # Top 3 for context_used
                try:
                    context_used.append({
                        "content": chunk.get('content', ''),
                        "source": chunk.get('source_url', chunk.get('source', 'Pro Documentation')),
                        "score": chunk.get('similarity_score', chunk.get('score', 0)),
                        "metadata": {
                            "page_title": chunk.get('page_title', ''),
                            "header": chunk.get('header', ''),
                            "version": getattr(request, 'version', '8-0')
                        }
                    })
                except Exception as chunk_error:
                    logger.warning(f"Error processing context chunk: {chunk_error}")
                    continue
            
            # Create and return response
            return ChatResponse(
                message=response_text,
                context_used=context_used,  # FIXED: Actual context from search
                processing_time=self.last_response_time,
                model_used=self.model_name,
                enhanced_features_used=len(context_chunks) > 0,  # True if we found context
                relationship_enhanced_chunks=len(context_chunks),
                version_context=f"Pro {getattr(request, 'version', '8-0').replace('-', '.')}",
                conversation_id=getattr(request, 'conversation_id', None)
            )
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"❌ Pro chat request failed: {e}")
            return self._generate_fallback_response(request.message, str(e))

    def _generate_fallback_response(self, user_message: str, error: str = None) -> object:
        """Generate fallback response when Gemini fails"""
        from app.models.chat import ChatResponse
        
        fallback_text = self._get_pro_fallback_response(user_message, error)
        
        return ChatResponse(
            message=fallback_text,
            context_used=[],
            processing_time=0.1,
            model_used="fallback",
            enhanced_features_used=False,
            relationship_enhanced_chunks=0,
            version_context="Pro (fallback mode)"
        )

    def _get_pro_fallback_response(self, user_message: str, error: str = None) -> str:
        """Generate fallback response for Pro when Gemini fails"""
        base_response = f"""I'd be glad to help you with {PRODUCT_DISPLAY_NAME}! However, I'm experiencing some technical difficulties right now.

For immediate assistance with Pro, I recommend:

1. **Browse the Pro Documentation**: Check the specific section related to your question
2. **Pro Workflows**: If asking about workflows, look at the workflow designer documentation  
3. **Configuration Help**: For setup questions, check the administration guides
4. **Integration Support**: For integration questions, review the API and integration documentation

Your question about "{user_message[:100]}..." is important, and I want to make sure you get accurate information. Please try again in a moment, or contact Pro support for immediate assistance.

I apologize for the inconvenience!"""
        
        if error and not error.startswith("Error:"):
            base_response += f"\n\n*Technical details: {error}*"
        
        return base_response

    def __del__(self):
        """Cleanup when service is destroyed"""
        if hasattr(self, 'model') and self.model:
            logger.info(f"🧹 Pro Gemini service cleanup completed")