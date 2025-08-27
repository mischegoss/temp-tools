import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import google.generativeai as genai

from app.config_loader import load_environment
from app.config import MAX_CONTEXT_CHUNKS, MAX_TOKENS_PER_CHUNK
from app.models.chat import ChatRequest, ChatResponse, ContextChunk
from app.models.search import SearchRequest
from app.services.search_service import SearchService
from app.prompts.gemini_prompts import (
    build_full_prompt, 
    NO_CONTEXT_RESPONSE, 
    QUESTION_PATTERNS
)

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
            logger.info(f"✅ Gemini service initialized with model: {env['gemini_model']}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {e}")
            self.ready = False
            raise
    
    def detect_question_type(self, message: str) -> str:
        """Detect the type of question to apply appropriate formatting"""
        message_lower = message.lower()
        
        for question_type, patterns in QUESTION_PATTERNS.items():
            if any(pattern in message_lower for pattern in patterns):
                return question_type
        
        return "general"
    
    def build_context_chunks(self, search_results: List[Any]) -> List[ContextChunk]:
        """Convert search results to context chunks for the response"""
        context_chunks = []
        
        for result in search_results:
            context_chunk = ContextChunk(
                id=result.id,
                content=result.content,
                source_url=result.source_url,
                page_title=result.page_title,
                similarity_score=result.similarity_score,
                header=result.header
            )
            context_chunks.append(context_chunk)
        
        return context_chunks
    
    def build_context_section(self, context_chunks: List[ContextChunk]) -> str:
        """Build enhanced context section with technical metadata"""
        if not context_chunks:
            return "No relevant context found in the documentation."
        
        context_parts = []
        context_parts.append("AVAILABLE DOCUMENTATION CONTEXT:")
        context_parts.append("=" * 60)
        
        for i, chunk in enumerate(context_chunks, 1):
            context_parts.append(f"\n📄 SOURCE {i}: {chunk.page_title}")
            
            if chunk.header:
                context_parts.append(f"   📍 Section: {chunk.header}")
                
            context_parts.append(f"   🔗 URL: {chunk.source_url}")
            context_parts.append(f"   📊 Relevance: {chunk.similarity_score:.3f}")
            context_parts.append(f"\n   📝 Content:")
            context_parts.append(f"   {chunk.content}")
            context_parts.append("-" * 50)
        
        return "\n".join(context_parts)
    
    def post_process_response(self, response: str, context_chunks: List[ContextChunk]) -> str:
        """Post-process the response to ensure it meets requirements"""
        # Ensure sources section exists and is properly formatted
        if "**Sources:**" not in response and "**Source:**" not in response and context_chunks:
            sources_section = "\n\n**Sources:**\n"
            for chunk in context_chunks:
                sources_section += f"- **{chunk.page_title}**: {chunk.source_url}\n"
            response += sources_section
        
        return response
    
    def generate_response(self, prompt: str) -> str:
        """Generate response using Gemini with enhanced error handling"""
        try:
            if not self.ready:
                return "Sorry, the AI service is not ready. Please try again later."
            
            logger.info("Generating enhanced technical response with Gemini...")
            
            # Configure generation parameters for technical content
            generation_config = {
                "temperature": 0.1,  # Lower temperature for more consistent technical responses
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
            
            # Generate response
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            if response.text:
                logger.info("✅ Enhanced Gemini response generated successfully")
                return response.text.strip()
            else:
                logger.warning("Gemini returned empty response")
                return "I apologize, but I couldn't generate a response based on the available documentation. Please try rephrasing your question or check if there's relevant documentation available."
                
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return f"I apologize, but I encountered a technical issue while accessing the documentation: {str(e)}. Please try again or contact support if the issue persists."
    
    def chat(self, chat_request: ChatRequest) -> ChatResponse:
        """Enhanced chat method with question type detection and specialized formatting"""
        start_time = datetime.now()
        
        try:
            # Step 1: Detect question type for appropriate formatting
            question_type = self.detect_question_type(chat_request.message)
            logger.info(f"Processing {question_type} question: {chat_request.message[:50]}...")
            
            # Step 2: Search for relevant context
            search_request = SearchRequest(
                query=chat_request.message,
                max_results=min(chat_request.max_results or MAX_CONTEXT_CHUNKS, MAX_CONTEXT_CHUNKS),
                min_similarity=0.15,  # Lower threshold for technical docs
                source_filter=chat_request.source_filter
            )
            
            search_response = self.search_service.search(search_request)
            logger.info(f"Found {search_response.total_found} relevant documentation chunks")
            
            # Step 3: Build context chunks
            context_chunks = self.build_context_chunks(search_response.results)
            
            # Step 4: Generate specialized response
            if context_chunks:
                context_section = self.build_context_section(context_chunks)
                prompt = build_full_prompt(chat_request.message, context_section, question_type)
                ai_response = self.generate_response(prompt)
                
                # Post-process to ensure all requirements are met
                ai_response = self.post_process_response(ai_response, context_chunks)
            else:
                ai_response = NO_CONTEXT_RESPONSE
            
            # Step 5: Calculate metrics
            unique_sources = set(chunk.source_url for chunk in context_chunks)
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ChatResponse(
                response=ai_response,
                context_used=context_chunks,
                sources_count=len(unique_sources),
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Enhanced chat request failed: {e}")
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ChatResponse(
                response=f"I apologize, but I encountered a technical error while processing your request: {str(e)}. Please try again or contact support if the issue persists.",
                context_used=[],
                sources_count=0,
                processing_time=processing_time
            )
    
    def get_status(self) -> Dict[str, Any]:
        """Get enhanced Gemini service status"""
        return {
            "ready": self.ready,
            "search_service_ready": self.search_service.ready,
            "can_chat": self.ready and self.search_service.ready,
            "model_name": "gemini-1.5-flash" if self.ready else None,
            "features": {
                "question_type_detection": True,
                "technical_formatting": True,
                "source_attribution": True,
                "step_by_step_instructions": True
            }
        }
    
    def test_connection(self) -> Dict[str, Any]:
        """Test the enhanced Gemini API connection"""
        try:
            if not self.ready:
                return {"success": False, "error": "Service not initialized"}
            
            # Test with a technical prompt similar to actual usage
            test_response = self.model.generate_content(
                "Respond with: 'Technical documentation AI assistant is ready to help with automation workflows and activities.'"
            )
            
            if test_response.text:
                return {
                    "success": True, 
                    "message": "Enhanced Gemini API connection working",
                    "test_response": test_response.text.strip(),
                    "features_enabled": "Question type detection, technical formatting, source attribution"
                }
            else:
                return {"success": False, "error": "Empty response from Gemini"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}