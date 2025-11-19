import os
import time
import logging
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from app.config import GEMINI_MODEL, PRODUCT_DISPLAY_NAME, PRO_SUPPORTED_VERSIONS
from app.config_loader import load_environment

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Pro-specific Gemini AI service for generating contextual responses about Pro documentation
    Compatible with google-generativeai==0.3.2 and flexible router calling patterns
    """
    
    def __init__(self, product_name: str = "pro"):
        self.product_name = product_name
        self.model_name = GEMINI_MODEL
        self.model = None
        self.request_count = 0
        self.error_count = 0
        self.total_response_time = 0
        self.last_response_time = None
        self.startup_time = time.time()
        
        # Initialize Gemini
        self._initialize_gemini()
        
        logger.info(f"✅ Pro Gemini service initialized with model: {self.model_name}")

    def _initialize_gemini(self):
        """Initialize Gemini model with Pro-specific configuration"""
        try:
            # Load environment using config loader (consistent with Actions API)
            env = load_environment()
            
            # Configure Gemini API using GOOGLE_API_KEY (for compatibility)
            api_key = os.getenv("GOOGLE_API_KEY") or env.get('gemini_api_key')
            if not api_key:
                raise ValueError("GOOGLE_API_KEY environment variable not set")
            
            genai.configure(api_key=api_key)
            
            # Create model with Pro-optimized settings (compatible with 0.3.2)
            generation_config = {
                "temperature": 0.7,  # Balanced creativity for Pro responses
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
            
            # Safety settings optimized for technical Pro documentation
            safety_settings = [
                {
                    "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
                    "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ]
            
            # Initialize the Gemini model (compatible with 0.3.2 - no system_instruction)
            self.model = genai.GenerativeModel(
                model_name=env.get('gemini_model', 'gemini-2.5-flash'),
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            logger.info(f"🚀 Pro Gemini model initialized: {env.get('gemini_model', 'gemini-2.5-flash')}")
            logger.info(f"🔑 API key configured successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Pro Gemini service: {e}")
            raise

    def test_connection(self) -> Dict[str, Any]:
        """Test Gemini API connection with Pro context"""
        try:
            test_prompt = f"""You are RANI, the AI assistant for {PRODUCT_DISPLAY_NAME}. 
            Please respond with a brief test message confirming you can help with Pro documentation."""
            
            start_time = time.time()
            response = self.model.generate_content(test_prompt)
            response_time = time.time() - start_time
            
            return {
                "success": True,
                "model": self.model_name,
                "response_time": round(response_time, 3),
                "test_response": response.text[:200] + "..." if len(response.text) > 200 else response.text,
                "pro_ready": True,
                "supported_versions": PRO_SUPPORTED_VERSIONS
            }
            
        except Exception as e:
            logger.error(f"❌ Pro Gemini connection test failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "model": self.model_name,
                "pro_ready": False
            }

    def get_status(self) -> Dict[str, Any]:
        """Get comprehensive Pro Gemini service status"""
        uptime = time.time() - self.startup_time
        avg_response_time = self.total_response_time / max(self.request_count, 1)
        
        return {
            "ready": self.model is not None,
            "can_chat": self.model is not None,
            "model": self.model_name,
            "product": self.product_name,
            "uptime_seconds": round(uptime, 1),
            "requests_processed": self.request_count,
            "errors": self.error_count,
            "success_rate": round((self.request_count - self.error_count) / max(self.request_count, 1), 3),
            "average_response_time": round(avg_response_time, 3),
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

    def generate_response(self, user_message: str = None, prompt: str = None, 
                          context_chunks: List = None, version: str = "8-0", 
                          conversation_history: List = None, **kwargs) -> str:
        """
        Public method to generate response using Gemini
        This method is expected by the chat router
        Flexible parameter handling to work with different calling patterns
        """
        try:
            if not self.model:
                return self._get_pro_fallback_response("Service temporarily unavailable")
            
            # Handle flexible parameter input
            if prompt:
                # If prompt is provided directly, use it
                final_prompt = prompt
            elif user_message:
                # If user_message is provided, build a Pro prompt
                final_prompt = self._build_pro_prompt(
                    user_message, 
                    context_chunks or [], 
                    version, 
                    conversation_history or []
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
                    time.sleep(0.5 * (attempt + 1))  # Exponential backoff
            
            return self._get_pro_fallback_response("Could not generate response after retries")
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"❌ Pro Gemini response generation failed: {e}")
            return self._get_pro_fallback_response(f"Error: {str(e)}")

    def chat(self, request) -> object:
        """
        Generate Pro-specific chat response using Gemini with conversation history support
        """
        from app.models.chat import ChatResponse, ContextChunk
        
        start_time = time.time()
        self.request_count += 1
        
        try:
            # Get search service from the initialized services
            import app.main as main_app
            search_service = main_app.search_service
            
            if not search_service or not search_service.ready:
                logger.warning("🔍 Search service not ready for Pro chat")
                return self._generate_fallback_response(request.message)
            
            # Build Pro-specific prompt with conversation history
            conversation_history = getattr(request, 'conversation_history', []) or []
            
            # Use generate_response method for consistency
            response_text = self.generate_response(
                user_message=request.message,
                context_chunks=[],
                version=getattr(request, 'version', '8-0'),
                conversation_history=conversation_history
            )
            
            # Calculate processing time
            processing_time = time.time() - start_time
            self.last_response_time = round(processing_time, 3)
            self.total_response_time += processing_time
            
            # Create and return response
            return ChatResponse(
                message=response_text,
                context_used=[],  # For now, empty context
                processing_time=self.last_response_time,
                model_used=self.model_name,
                enhanced_features_used=False,
                relationship_enhanced_chunks=0,
                version_context=f"Pro {getattr(request, 'version', '8-0').replace('-', '.')}",
                conversation_id=getattr(request, 'conversation_id', None)
            )
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"❌ Pro chat request failed: {e}")
            return self._generate_fallback_response(request.message, str(e))

    def _build_pro_prompt(self, user_message: str, context_chunks: List, version: str = "8-0", conversation_history: List = None) -> str:
        """Build Pro-specific prompt with version context and conversation history"""
        
        # Build version context
        version_display = version.replace('-', '.')
        
        # Build conversation history section
        history_section = ""
        if conversation_history and len(conversation_history) > 0:
            history_section = "\n\nCONVERSATION HISTORY:\n"
            for msg in conversation_history[-5:]:  # Last 5 messages only
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                if isinstance(msg, dict):
                    history_section += f"{role.upper()}: {content}\n"
                elif hasattr(msg, 'role') and hasattr(msg, 'content'):
                    history_section += f"{msg.role.upper()}: {msg.content}\n"
        
        # Build the complete prompt with system instruction embedded
        prompt = f"""You are RANI, an AI assistant specifically designed to help users with Resolve Pro documentation and features. You are an expert in Pro workflows, configurations, integrations, monitoring, administration, and troubleshooting.

CORE EXPERTISE AREAS:
- **Workflow Management**: Design, creation, modification, and optimization of Pro workflows
- **Activity Configuration**: Setup and troubleshooting of workflow activities and actions  
- **Integration Solutions**: API integrations, database connections, third-party system connectivity
- **Monitoring & Alerting**: Dashboard configuration, alert setup, performance monitoring
- **Administration**: User management, permissions, system configuration, maintenance
- **Troubleshooting**: Diagnostics, error resolution, performance optimization

USER CONTEXT:
- User is asking about Pro {version_display}
- Product: {PRODUCT_DISPLAY_NAME}

{history_section}

USER QUESTION: {user_message}

RESPONSE GUIDELINES:
1. **Pro-Focused**: Always prioritize Pro-specific solutions and capabilities
2. **Version-Aware**: Consider the Pro {version_display} context in your response
3. **Accurate**: Provide reliable information about Pro features and functionality
4. **Actionable**: Provide clear, step-by-step guidance when possible
5. **Complete**: Address all aspects of the user's question thoroughly
6. **Context-Aware**: Consider the conversation history when relevant

Please provide a helpful, accurate response about {PRODUCT_DISPLAY_NAME}:"""

        return prompt

    def _generate_response(self, prompt: str) -> str:
        """Generate response using Gemini with enhanced error handling (private method)"""
        return self.generate_response(prompt=prompt)  # Delegate to public method

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