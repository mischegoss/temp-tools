# app/services/gemini_service.py - COMPATIBLE VERSION (accepts product_name)

import google.generativeai as genai
import time
import os
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.config import GEMINI_MODEL, PRODUCT_DISPLAY_NAME

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Compatible version - accepts product_name parameter and any other kwargs
    """
    
    def __init__(self, product_name=None, **kwargs):
        """Initialize with compatibility for existing code"""
        self.model = None
        self.model_name = GEMINI_MODEL
        self.product_name = product_name or PRODUCT_DISPLAY_NAME
        self.initialized = False
        self.request_count = 0
        self.error_count = 0
        self.last_response_time = 0.0
        self.total_response_time = 0.0
        
        # Accept any other keyword arguments for compatibility
        for key, value in kwargs.items():
            setattr(self, key, value)
        
    def initialize(self):
        """Initialize Gemini service"""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY environment variable not set")
            
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(self.model_name)
            self.initialized = True
            
            logger.info(f"✅ Gemini service initialized with model: {self.model_name}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini service: {e}")
            raise
    
    def get_status(self) -> Dict[str, Any]:
        """Get service status"""
        return {
            "initialized": self.initialized,
            "model_name": self.model_name,
            "product_name": self.product_name,
            "request_count": self.request_count,
            "error_count": self.error_count,
            "avg_response_time": (
                self.total_response_time / self.request_count 
                if self.request_count > 0 else 0.0
            ),
            "last_response_time": self.last_response_time
        }
    
    def generate_response(self, user_message: str, context_chunks: List = None, 
                         version: str = "8-0", conversation_history: List = None, **kwargs) -> str:
        """Generate response - accepts extra kwargs for compatibility"""
        if not self.initialized:
            raise RuntimeError("Gemini service not initialized")
        
        try:
            # Build prompt - THIS IS THE CORE FIX
            prompt = self._build_pro_prompt(
                user_message=user_message,
                context_chunks=context_chunks or [],
                version=version,
                conversation_history=conversation_history or []
            )
            
            # Generate with retry
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = self.model.generate_content(prompt)
                    
                    if response and response.text:
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

    def _build_pro_prompt(self, user_message: str, context_chunks: List, version: str = "8-0", conversation_history: List = None) -> str:
        """
        CORE FIX: Safe conversation history processing 
        This fixes your 'ChatMessage' object has no attribute 'get' error
        """
        
        # Build version context
        version_display = version.replace('-', '.')
        
        # FIXED: Safe conversation history processing
        history_section = ""
        if conversation_history and len(conversation_history) > 0:
            history_section = "\n\nCONVERSATION HISTORY:\n"
            for msg in conversation_history[-5:]:  # Last 5 messages only
                try:
                    # SAFE: Handle any message format
                    role = None
                    content = None
                    
                    if isinstance(msg, dict):
                        # Frontend format: {sender: 'user', text: 'message'}
                        if 'sender' in msg and 'text' in msg:
                            role = 'assistant' if msg.get('sender') == 'bot' else 'user'
                            content = msg.get('text', '')
                        # Backend format: {role: 'user', content: 'message'}  
                        elif 'role' in msg and 'content' in msg:
                            role = msg.get('role', 'user')
                            content = msg.get('content', '')
                    
                    # ChatMessage objects (the source of your error)
                    elif hasattr(msg, 'role') and hasattr(msg, 'content'):
                        role = str(msg.role)
                        content = str(msg.content)
                    
                    # Add to history if valid
                    if role and content and content.strip():
                        history_section += f"{role.upper()}: {content.strip()}\n"
                        
                except Exception as e:
                    # Skip problematic messages instead of crashing
                    logger.warning(f"Skipping message in history: {e}")
                    continue
        
        # Use the product name from initialization
        product_display = self.product_name or PRODUCT_DISPLAY_NAME
        
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
- Product: {product_display}

{history_section}

USER QUESTION: {user_message}

RESPONSE GUIDELINES:
1. **Pro-Focused**: Always prioritize Pro-specific solutions and capabilities
2. **Version-Aware**: Consider the Pro {version_display} context in your response
3. **Accurate**: Provide reliable information about Pro features and functionality
4. **Actionable**: Provide clear, step-by-step guidance when possible
5. **Complete**: Address all aspects of the user's question thoroughly
6. **Context-Aware**: Consider the conversation history when relevant

Please provide a helpful, accurate response about {product_display}:"""

        return prompt

    def chat(self, request, **kwargs) -> object:
        """Chat method - compatible with existing code"""
        from app.models.chat import ChatResponse
        
        start_time = time.time()
        self.request_count += 1
        
        try:
            if not hasattr(request, 'message') or not request.message:
                logger.error("Invalid request: missing message")
                return self._generate_fallback_response(request.message if hasattr(request, 'message') else "")
            
            # Safe conversation history extraction
            conversation_history = getattr(request, 'conversation_history', []) or []
            
            # Use generate_response method
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
                context_used=[],
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
            return self._generate_fallback_response(
                request.message if hasattr(request, 'message') else "", 
                str(e)
            )

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
        product_display = self.product_name or PRODUCT_DISPLAY_NAME
        
        base_response = f"""I'd be glad to help you with {product_display}! However, I'm experiencing some technical difficulties right now.

For immediate assistance with Pro, I recommend:

1. **Browse the Pro Documentation**: Check the specific section related to your question
2. **Pro Workflows**: If asking about workflows, look at the workflow designer documentation  
3. **Configuration Help**: For setup questions, check the administration guides
4. **Integration Support**: For integration questions, review the API and integration documentation

Your question about "{user_message[:100] if user_message else 'your request'}..." is important, and I want to make sure you get accurate information. Please try again in a moment, or contact Pro support for immediate assistance.

I apologize for the inconvenience!"""
        
        if error and not error.startswith("Error:"):
            base_response += f"\n\n*Technical details: {error}*"
        
        return base_response

    def __del__(self):
        """Cleanup when service is destroyed"""
        if hasattr(self, 'model') and self.model:
            logger.info(f"🧹 Pro Gemini service cleanup completed")