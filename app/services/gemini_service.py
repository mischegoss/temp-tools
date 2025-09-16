import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import google.generativeai as genai

from app.config_loader import load_environment
from app.config import MAX_CONTEXT_CHUNKS, MAX_TOKENS_PER_CHUNK
from app.models.chat import ChatRequest, ChatResponse, ContextChunk
from app.models.search import SearchRequest
from app.services.search_service import SearchService
from app.prompts.gemini_prompts import build_full_prompt

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, search_service: SearchService):
        self.search_service = search_service
        self.client = None
        self.model = None
        self.ready = False
        
    def initialize(self):
        """Initialize the Gemini client"""
        try:
            # Load environment variables
            env = load_environment()
            
            # Configure Gemini
            genai.configure(api_key=env['gemini_api_key'])
            
            # Initialize the model
            self.model = genai.GenerativeModel(env['gemini_model'])
            
            self.ready = True
            logger.info(f"Gemini service initialized with model: {env['gemini_model']}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {e}")
            self.ready = False
            raise
    
    def detect_question_type(self, message: str) -> str:
        """
        Detects the general intent of the user's question to select a response format.
        Support routing decisions are now handled by the LLM based on the prompt's Core Directives.
        """
        if not message:
            return "general"
            
        message_lower = message.lower()
        
        # Define patterns for documentation-searchable questions ONLY
        question_patterns = {
            "how_to": ["how do i", "how to", "how can i", "steps to", "guide to", "create a", "build a", "set up"],
            "definition": ["what is", "what are", "define", "explain", "meaning of", "difference between"],
            "configuration": ["configure", "setup", "settings", "options", "parameters", "customize"],
            "example": ["example", "sample", "demo", "show me", "walkthrough"],
            "troubleshooting": ["not working", "having trouble", "issue with", "problem", "error", "fix"]
        }
        
        # Check patterns for documentation questions
        for question_type, patterns in question_patterns.items():
            if any(pattern in message_lower for pattern in patterns):
                return question_type
        
        # If no specific pattern matches, default to "general"
        return "general"
    
    def _should_use_relationships(self, message: str, question_type: str) -> bool:
        """Determine if relationships should be used based on query complexity and type"""
        
        # Use relationships for workflow and how-to questions where related steps matter
        if question_type in ['how_to', 'configuration']:
            return True
            
        # Use relationships for broad exploratory queries
        exploratory_terms = ['workflow', 'automation', 'activities', 'overview', 'guide']
        if any(term in message.lower() for term in exploratory_terms):
            return True
            
        # Skip relationships for simple definitions and specific technical questions
        if question_type in ['definition'] or len(message.split()) <= 5:
            return False
            
        # Default to fast search for most queries
        return False
    
    def format_url_with_domain(self, url: str) -> str:
        """Convert relative URLs to complete help.resolve.io URLs with defensive checks"""
        if not url or not isinstance(url, str):
            return ""
        
        url = url.strip()
        if not url:
            return ""
        
        if url.startswith('http'):
            return url
        
        clean_url = url.lstrip('/')
        if not clean_url:
            return ""
        
        return f"https://help.resolve.io/{clean_url}"
    
    def build_context_chunks(self, search_results: List[Any]) -> List[ContextChunk]:
        """Convert search results to context chunks with enhanced metadata and defensive checks"""
        context_chunks = []
        
        for i, result in enumerate(search_results):
            try:
                # Defensive check for result attributes
                result_id = getattr(result, 'id', f'unknown_id_{i}')
                result_content = getattr(result, 'content', '')
                result_source_url = getattr(result, 'source_url', '')
                result_page_title = getattr(result, 'page_title', 'Unknown Page')
                result_similarity = getattr(result, 'similarity_score', 0.0)
                result_header = getattr(result, 'header', '')
                
                # Format URL with defensive checks
                formatted_url = self.format_url_with_domain(result_source_url)
                
                if not formatted_url:
                    continue  # Skip results with invalid URLs
                
                # Create enhanced context chunk
                context_chunk = ContextChunk(
                    id=result_id,
                    content=result_content,
                    source_url=formatted_url,
                    page_title=result_page_title,
                    similarity_score=float(result_similarity),
                    header=result_header,
                    # Enhanced fields from search results with defensive checks
                    content_type=getattr(result, 'content_type', 'unknown'),
                    complexity=getattr(result, 'complexity', 'unknown'),
                    has_code=getattr(result, 'has_code', False),
                    has_relationships=getattr(result, 'has_relationships', False),
                    directory_path=getattr(result, 'directory_path', ''),
                    tags=getattr(result, 'tags', []),
                    is_relationship_enhanced=getattr(result, 'is_relationship_enhanced', False)
                )
                context_chunks.append(context_chunk)
                
            except Exception as e:
                logger.error(f"Failed to process search result {i}: {e}")
                continue  # Skip problematic results
        
        return context_chunks
    
    def build_context_section(self, context_chunks: List[ContextChunk]) -> str:
        """Build enhanced context section with complete URLs and metadata"""
        if not context_chunks:
            return "No relevant context found in the Actions documentation."
        
        context_parts = []
        context_parts.append("AVAILABLE ACTIONS DOCUMENTATION:")
        context_parts.append("=" * 60)
        
        for i, chunk in enumerate(context_chunks, 1):
            context_parts.append(f"\n[SOURCE {i}: {chunk.page_title}]")
            
            if chunk.header:
                context_parts.append(f"Section: {chunk.header}")
            
            # Add enhanced metadata
            metadata_parts = []
            if hasattr(chunk, 'content_type') and chunk.content_type != 'unknown':
                metadata_parts.append(f"Type: {chunk.content_type}")
            if hasattr(chunk, 'complexity') and chunk.complexity != 'unknown':
                metadata_parts.append(f"Complexity: {chunk.complexity}")
            if hasattr(chunk, 'has_code') and chunk.has_code:
                metadata_parts.append("Contains code examples")
            if hasattr(chunk, 'directory_path') and chunk.directory_path:
                metadata_parts.append(f"Path: {chunk.directory_path}")
            if hasattr(chunk, 'tags') and chunk.tags:
                metadata_parts.append(f"Tags: {', '.join(chunk.tags[:3])}")
            if hasattr(chunk, 'is_relationship_enhanced') and chunk.is_relationship_enhanced:
                metadata_parts.append("Related content")
            
            if metadata_parts:
                context_parts.append(f"Metadata: {' | '.join(metadata_parts)}")
                
            context_parts.append(f"URL: {chunk.source_url}")
            context_parts.append(f"Relevance: {chunk.similarity_score:.3f}")
            context_parts.append(f"\nContent:")
            context_parts.append(f"{chunk.content}")
            context_parts.append("-" * 50)
        
        return "\n".join(context_parts)
    
    def get_related_context_for_workflow(self, context_chunks: List[ContextChunk], query: str) -> List[str]:
        """Get related context for workflow creation questions using direct chunk access"""
        related_resources = []
        
        # Check if any context chunks are about workflow creation
        workflow_chunks = [chunk for chunk in context_chunks if 
                          'workflow' in chunk.content.lower() or 
                          'workflow' in chunk.page_title.lower()]
        
        if workflow_chunks:
            try:
                for chunk in workflow_chunks[:2]:  # Check top 2 workflow chunks
                    # Get relationship data directly from chunk
                    relationships = self.search_service.get_chunk_relationships(chunk.id)
                    
                    # Add sibling resources directly from relationship data
                    siblings = relationships.get('siblings', [])
                    for sibling in siblings[:3]:
                        if sibling.get('similarity_score', 0) > 0.6 and sibling.get('url'):
                            url = self.format_url_with_domain(sibling['url'])
                            if url not in related_resources:
                                related_resources.append(url)
                    
                    # Add same-directory resources
                    current_dir = relationships.get('current_directory', '')
                    if current_dir:
                        dir_chunks = self.search_service.get_directory_chunks(current_dir, 3)
                        for dir_chunk in dir_chunks:
                            if dir_chunk['id'] != chunk.id and dir_chunk.get('source_url'):
                                url = self.format_url_with_domain(dir_chunk['source_url'])
                                if url not in related_resources:
                                    related_resources.append(url)
                                    
            except Exception as e:
                logger.warning(f"Failed to get related workflow context: {e}")
        
        # Default next steps resources if no specific related content found
        if not related_resources:
            related_resources = [
                "https://help.resolve.io/actions/Product-Navigation/Workflow-Designer/Add-Activities/adding-from-activities-tree/",
                "https://help.resolve.io/actions/Product-Navigation/Workflow-Designer/Add-Activities/adding-activities-using-search-tool/",
                "https://help.resolve.io/actions/Product-Navigation/Workflow-Designer/Add-Activities/adding-suggested-activities/"
            ]
        
        return related_resources[:5]  # Limit to 5 resources
    
    def get_related_suggestions(self, context_chunks: List[ContextChunk], query: str) -> List[Dict[str, str]]:
        """Get related page suggestions using direct chunk access"""
        suggestions = []
        
        try:
            # Get unique related chunks from top context chunks
            for chunk in context_chunks[:3]:  # Top 3 chunks
                if hasattr(chunk, 'has_relationships') and chunk.has_relationships:
                    # Get relationship data directly
                    relationships = self.search_service.get_chunk_relationships(chunk.id)
                    
                    # Add siblings (strongest relationship) - direct access
                    siblings = relationships.get('siblings', [])
                    for sibling in siblings[:2]:  # Top 2 siblings
                        if sibling.get('similarity_score', 0) > 0.5:
                            suggestions.append({
                                'title': sibling.get('title', ''),
                                'url': self.format_url_with_domain(sibling.get('url', '')),
                                'relationship': 'related procedure',
                                'reason': f"Related to {chunk.page_title}"
                            })
                    
                    # Add cousins (same category, different subcategory) - direct access
                    cousins = relationships.get('cousins', [])
                    for cousin in cousins[:1]:  # Limit cousins
                        if cousin.get('similarity_score', 0) > 0.4:
                            suggestions.append({
                                'title': cousin.get('title', ''),
                                'url': self.format_url_with_domain(cousin.get('url', '')),
                                'relationship': 'related topic',
                                'reason': f"Similar category to {chunk.page_title}"
                            })
            
        except Exception as e:
            logger.warning(f"Failed to get related suggestions: {e}")
        
        # Remove duplicates by URL and limit results
        seen_urls = set()
        unique_suggestions = []
        for suggestion in suggestions:
            if suggestion['url'] not in seen_urls and suggestion['url']:
                seen_urls.add(suggestion['url'])
                unique_suggestions.append(suggestion)
        
        return unique_suggestions[:4]  # Limit to 4 suggestions
    
    def post_process_response(self, response: str, context_chunks: List[ContextChunk], user_message: str) -> str:
        """Enhanced post-processing with relationship-aware suggestions and defensive source handling"""
        
        # Ensure all URLs use complete help.resolve.io format
        import re
        response = re.sub(r'(?<!https://help\.resolve\.io)(/actions/[^)\s]+)', 
                         r'https://help.resolve.io\1', response)
        
        # For workflow creation questions, add specific next steps if not present
        if any(term in user_message.lower() for term in ['create workflow', 'new workflow', 'workflow']):
            if 'Next Steps:' not in response and context_chunks:
                next_steps_resources = self.get_related_context_for_workflow(context_chunks, user_message)
                if next_steps_resources:
                    next_steps_section = "\n\n**Next Steps:**\nAfter creating your workflow, you'll want to add activities to it. Here are some helpful resources:\n"
                    for i, resource in enumerate(next_steps_resources[:3], 1):
                        if 'adding-from-activities-tree' in resource:
                            next_steps_section += f"- Adding Activities from the Activities Tree: {resource}\n"
                        elif 'adding-activities-using-search-tool' in resource:
                            next_steps_section += f"- Adding Activities Using the Search Tool: {resource}\n"
                        elif 'adding-suggested-activities' in resource:
                            next_steps_section += f"- Adding Suggested Activities: {resource}\n"
                        else:
                            next_steps_section += f"- Related Resource {i}: {resource}\n"
                    
                    # Insert next steps before the Sources section
                    if "**Sources:**" in response:
                        response = response.replace("**Sources:**", next_steps_section + "\n**Sources:**")
                    else:
                        response += next_steps_section
        
        # Add related suggestions if we have relationship data
        related_suggestions = self.get_related_suggestions(context_chunks, user_message)
        if related_suggestions and "**Related Topics:**" not in response:
            related_section = "\n\n**Related Topics:**\n"
            for suggestion in related_suggestions:
                title = suggestion.get('title', 'Related Topic')
                url = suggestion.get('url', '')
                relationship = suggestion.get('relationship', 'related')
                if url:
                    related_section += f"- {title}: {url} ({relationship})\n"
            
            # Insert before Sources section or at end
            if "**Sources:**" in response:
                response = response.replace("**Sources:**", related_section + "\n**Sources:**")
            else:
                response += related_section
        
        # Enhanced Sources section with defensive checks
        if "**Sources:**" not in response and "**Source:**" not in response and context_chunks:
            valid_sources = []
            for i, chunk in enumerate(context_chunks):
                # Defensive checks for chunk attributes
                page_title = getattr(chunk, 'page_title', f'Source {i+1}')
                source_url = getattr(chunk, 'source_url', '')
                
                # Only include sources with valid URLs
                if source_url and source_url.strip():
                    # Add metadata indicators in source listing
                    metadata_indicators = []
                    if hasattr(chunk, 'has_code') and getattr(chunk, 'has_code', False):
                        metadata_indicators.append("includes code")
                    if hasattr(chunk, 'complexity') and getattr(chunk, 'complexity', '') == 'detailed':
                        metadata_indicators.append("detailed guide")
                    if hasattr(chunk, 'is_relationship_enhanced') and getattr(chunk, 'is_relationship_enhanced', False):
                        metadata_indicators.append("related content")
                    
                    source_line = f"- {page_title}: {source_url}"
                    if metadata_indicators:
                        source_line += f" ({', '.join(metadata_indicators)})"
                    
                    valid_sources.append(source_line)
            
            if valid_sources:
                sources_section = "\n\n**Sources:**\n" + "\n".join(valid_sources) + "\n"
                response += sources_section
            else:
                # Add a fallback message
                sources_section = "\n\n**Note:** For additional documentation, please browse the Actions help site or use the support button below.\n"
                response += sources_section
        
        return response
    
    def generate_response(self, prompt: str) -> str:
        """Generate response using Gemini with enhanced error handling"""
        try:
            if not self.ready:
                return "I'd be glad to help you, though I'm not ready at the moment. Please try again shortly!"
            
            logger.info("Generating response with enhanced prompts...")
            
            # Configure generation parameters for friendly technical content
            generation_config = {
                "temperature": 0.2,  # Slightly higher for friendlier tone while maintaining accuracy
                "top_p": 0.85,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
            
            # Generate response
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            if response.text:
                logger.info("Gemini response generated successfully")
                return response.text.strip()
            else:
                logger.warning("Gemini returned empty response")
                return "I'd be glad to help you, though I wasn't able to generate a response just now. Could you try rephrasing your question, or use the support button below for direct assistance?"
                
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return f"I'd be glad to help you, though I encountered a technical issue: {str(e)}. Please try again, or use the support button below if this continues!"
    
    def chat(self, chat_request: ChatRequest) -> ChatResponse:
        """Simplified chat method - all routing decisions handled by the LLM via the prompt"""
        start_time = datetime.now()
        
        try:
            # Step 1: Detect question type for response formatting only
            question_type = self.detect_question_type(chat_request.message)
            logger.info(f"Processing {question_type} question: {chat_request.message[:50]}...")
            
            # Step 2: Search for documentation with relationship enhancement when beneficial
            search_request = SearchRequest(
                query=chat_request.message,
                max_results=min(chat_request.max_results or MAX_CONTEXT_CHUNKS, MAX_CONTEXT_CHUNKS),
                min_similarity=0.15,  # Lower threshold for technical docs
                source_filter=chat_request.source_filter,
                # Smart relationship usage based on query type
                include_relationships=self._should_use_relationships(chat_request.message, question_type)
            )
            
            search_response = self.search_service.search(search_request)
            logger.info(f"Found {search_response.total_found} relevant Actions documentation chunks")
            
            # Log if relationship features were used
            if hasattr(search_response, 'enhanced_features_used') and search_response.enhanced_features_used:
                logger.info(f"Used relationship enhancement: +{search_response.relationship_enhanced_results} related chunks")
            
            # Step 3: Build context chunks with enhanced metadata and defensive checks
            context_chunks = self.build_context_chunks(search_response.results)
            
            # Step 4: ALWAYS generate the response using the LLM
            # The prompt's safety nets will handle cases with no or irrelevant context
            context_section = self.build_context_section(context_chunks)
            prompt = build_full_prompt(chat_request.message, context_section, question_type)
            ai_response = self.generate_response(prompt)
            
            # Step 5: Always post-process the LLM's response for consistency
            ai_response = self.post_process_response(ai_response, context_chunks, chat_request.message)
            
            # Step 6: Calculate metrics and return response
            unique_sources = set(chunk.source_url for chunk in context_chunks)
            relationship_enhanced_chunks = sum(1 for chunk in context_chunks if hasattr(chunk, 'is_relationship_enhanced') and chunk.is_relationship_enhanced)
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ChatResponse(
                response=ai_response,
                context_used=context_chunks,
                sources_count=len(unique_sources),
                processing_time=processing_time,
                enhanced_features_used=relationship_enhanced_chunks > 0,
                relationship_enhanced_chunks=relationship_enhanced_chunks
            )
            
        except Exception as e:
            logger.error(f"Chat request failed: {e}")
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ChatResponse(
                response=f"I'd be glad to help you, though I encountered an issue while processing your request: {str(e)}. Please try again, or use the support button below for direct assistance!",
                context_used=[],
                sources_count=0,
                processing_time=processing_time
            )
    
    def get_status(self) -> Dict[str, Any]:
        """Get enhanced Gemini service status"""
        search_stats = self.search_service.get_search_stats()
        
        return {
            "ready": self.ready,
            "search_service_ready": self.search_service.ready,
            "can_chat": self.ready and self.search_service.ready,
            "model_name": "gemini-1.5-flash" if self.ready else None,
            "approach": "simplified_prompt_based_routing_with_trust",
            "enhanced_features_available": search_stats.get('enhanced_features', False),
            "relationship_data_available": search_stats.get('chunks_with_relationships', 0) > 0,
            "features": {
                "prompt_based_routing": True,
                "account_password_disambiguation": True,
                "documentation_bounded_responses": True,
                "complete_urls": True,
                "smart_relationship_search": True,
                "workflow_next_steps": True,
                "related_suggestions": True,
                "simplified_question_detection": True,
                "trust_the_prompt_approach": True
            },
            "statistics": {
                "total_chunks": search_stats.get('total_chunks', 0),
                "chunks_with_relationships": search_stats.get('chunks_with_relationships', 0),
                "chunks_with_code": search_stats.get('chunks_with_code', 0),
                "available_directories": search_stats.get('relationship_index_size', 0),
                "question_types_supported": ["how_to", "definition", "configuration", "example", "troubleshooting", "general"]
            }
        }
    
    def test_connection(self) -> Dict[str, Any]:
        """Test the enhanced Gemini API connection with simplified prompt-based routing"""
        try:
            if not self.ready:
                return {"success": False, "error": "Service not initialized"}
            
            # Test with a professional prompt
            test_response = self.model.generate_content(
                "Respond with: 'I'd be glad to help you test the connection! The simplified RANI assistant is ready with prompt-based routing, smart documentation search, and account/password disambiguation.'"
            )
            
            if test_response.text:
                search_stats = self.search_service.get_search_stats()
                return {
                    "success": True, 
                    "message": "Simplified Gemini API connection working",
                    "test_response": test_response.text.strip(),
                    "features": "Prompt-based routing, relationship-enhanced search, documentation-bounded responses, account/password disambiguation",
                    "relationship_data_status": f"{search_stats.get('chunks_with_relationships', 0)} chunks with relationship data available",
                    "routing_approach": "All routing and disambiguation decisions handled by LLM via sophisticated prompt template"
                }
            else:
                return {"success": False, "error": "Empty response from Gemini"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}