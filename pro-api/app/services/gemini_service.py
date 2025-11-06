import os
import time
import logging
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from app.config import GEMINI_MODEL, PRODUCT_DISPLAY_NAME, PRO_SUPPORTED_VERSIONS

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Pro-specific Gemini AI service for generating contextual responses about Pro documentation
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
            # Configure Gemini API
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY environment variable not set")
            
            genai.configure(api_key=api_key)
            
            # Create model with Pro-optimized settings
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
            
            self.model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config=generation_config,
                safety_settings=safety_settings,
                system_instruction=self._get_pro_system_prompt()
            )
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Pro Gemini service: {e}")
            raise

    def _get_pro_system_prompt(self) -> str:
        """Get Pro-specific system prompt for Gemini"""
        return f"""You are RANI, an AI assistant specifically designed to help with {PRODUCT_DISPLAY_NAME} documentation. You are an expert in workflows, configurations, integrations, monitoring, and troubleshooting for Resolve Pro.

CORE DIRECTIVES:
1. **Product Focus**: Always focus on {PRODUCT_DISPLAY_NAME} features, capabilities, and best practices
2. **Version Awareness**: Consider the specific Pro version context provided in each request
3. **Accuracy**: Base all responses on the provided documentation context. Never invent features or steps
4. **Clarity**: Provide clear, actionable guidance suitable for technical users
5. **Completeness**: Address the user's question thoroughly while staying focused on Pro

RESPONSE STRUCTURE:
1. **Direct Answer**: Start with a clear, direct answer to the user's question
2. **Detailed Guidance**: Provide step-by-step instructions or detailed explanations
3. **Pro Context**: Highlight Pro-specific features, benefits, or considerations
4. **Best Practices**: Include relevant Pro best practices or recommendations
5. **Version Notes**: Mention version-specific differences when relevant
6. **Sources**: Reference the documentation sections used (without inventing sources)

PRO-SPECIFIC EXPERTISE:
- Workflow Design and Management
- Activity Configuration and Troubleshooting  
- Integration Setup (APIs, databases, third-party systems)
- Monitoring and Alerting Configuration
- Performance Optimization
- Security and Access Management
- Administration and Maintenance
- Troubleshooting and Diagnostics

VERSION HANDLING:
- Pro 7.8: Focus on core workflow and monitoring capabilities
- Pro 7.9: Include enhanced integration features and improved UI
- Pro 8.0: Emphasize latest features, improved performance, and new integrations
- General: Provide answers applicable across current supported versions

RESPONSE QUALITY:
- Use technical terminology appropriately
- Provide specific configuration examples when possible
- Include relevant Pro feature names and menu paths
- Suggest related Pro capabilities when helpful
- Maintain professional, helpful tone

Remember: You are the expert Pro assistant. Users rely on you for accurate, actionable Pro guidance."""

    async def generate_response(
        self, 
        user_message: str,
        conversation_history: Optional[List[Dict]] = None,
        context: Optional[Dict[str, Any]] = None,
        product_name: str = "pro"
    ) -> Dict[str, Any]:
        """
        Generate Pro-specific response using Gemini with context awareness
        """
        start_time = time.time()
        
        try:
            # Build the comprehensive prompt for Pro
            full_prompt = self._build_pro_prompt(
                user_message=user_message,
                conversation_history=conversation_history or [],
                context=context or {}
            )
            
            logger.info(f"🤖 Pro Gemini generating response for: {user_message[:50]}...")
            logger.info(f"   Context: {len(context.get('search_results', []))} search results")
            logger.info(f"   Version: {context.get('version', 'not specified')}")
            
            # Generate response
            response = await asyncio.get_event_loop().run_in_executor(
                None, self._generate_sync, full_prompt
            )
            
            response_time = (time.time() - start_time) * 1000
            
            # Update metrics
            self.request_count += 1
            self.total_response_time += response_time
            self.last_response_time = response_time
            
            # Extract response text
            response_text = response.text if hasattr(response, 'text') else str(response)
            
            logger.info(f"✅ Pro response generated in {response_time:.0f}ms")
            
            return {
                "response": response_text,
                "model_used": self.model_name,
                "response_time_ms": response_time,
                "tokens_used": self._estimate_tokens(response_text),
                "confidence": 0.85,  # Base confidence for Pro responses
                "context_used": len(context.get('search_results', [])),
                "version_specific": context.get('version') != 'general'
            }
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"❌ Pro Gemini error: {str(e)}")
            
            # Return fallback response
            return {
                "response": self._get_pro_fallback_response(user_message),
                "model_used": self.model_name,
                "response_time_ms": (time.time() - start_time) * 1000,
                "error": str(e),
                "confidence": 0.1,
                "fallback_used": True
            }

    def _generate_sync(self, prompt: str):
        """Synchronous generation for executor"""
        return self.model.generate_content(prompt)

    def _build_pro_prompt(
        self, 
        user_message: str,
        conversation_history: List[Dict],
        context: Dict[str, Any]
    ) -> str:
        """
        Build comprehensive Pro-specific prompt with context
        """
        # Extract Pro context
        pro_version = context.get('version', '8-0')
        doc_type = context.get('documentation_type', 'general')
        search_results = context.get('search_results', [])
        page_context = context.get('page_context')
        
        # Build context section
        context_section = ""
        if search_results:
            context_section = "\n### RELEVANT PRO DOCUMENTATION:\n"
            for i, result in enumerate(search_results[:5], 1):
                context_section += f"\n**Source {i}: {result.get('page_title', 'Unknown')}**\n"
                context_section += f"URL: {result.get('source_url', '')}\n"
                if result.get('header'):
                    context_section += f"Section: {result.get('header')}\n"
                context_section += f"Content: {result.get('content', '')[:800]}...\n"
                context_section += f"Relevance: {result.get('similarity_score', 0):.2f}\n"
        
        # Build conversation context
        conversation_context = ""
        if conversation_history:
            conversation_context = "\n### CONVERSATION HISTORY:\n"
            for msg in conversation_history[-3:]:  # Last 3 messages
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                conversation_context += f"{role.upper()}: {content[:200]}...\n"
        
        # Build version context
        version_context = f"\n### PRO VERSION CONTEXT:\n"
        version_context += f"Target Version: Pro {pro_version.replace('-', '.')}\n"
        version_context += f"Documentation Type: {doc_type}\n"
        if page_context:
            version_context += f"Current Page: {page_context}\n"
        version_context += f"Supported Versions: {', '.join(PRO_SUPPORTED_VERSIONS)}\n"
        
        # Build the complete prompt
        prompt = f"""# {PRODUCT_DISPLAY_NAME} ASSISTANT REQUEST

{version_context}

{context_section}

{conversation_context}

### USER QUESTION:
{user_message}

### RESPONSE INSTRUCTIONS:
Generate a comprehensive, accurate response about {PRODUCT_DISPLAY_NAME} based on the provided documentation context. Focus on Pro version {pro_version.replace('-', '.')} capabilities and ensure your response is:

1. **Technically Accurate**: Base your response only on the provided documentation
2. **Pro-Specific**: Focus on Pro features, workflows, and capabilities
3. **Version-Aware**: Consider the specific Pro version context
4. **Actionable**: Provide clear steps or guidance where applicable
5. **Complete**: Address all aspects of the user's question
6. **Well-Structured**: Use clear headings and formatting

If the question relates to workflows, include specific Pro workflow guidance.
If about configuration, provide Pro-specific configuration steps.
If about integrations, focus on Pro's integration capabilities.
If about troubleshooting, provide Pro diagnostic and resolution steps.

Begin your response now:"""

        return prompt

    def _get_pro_fallback_response(self, user_message: str) -> str:
        """
        Generate fallback response for Pro when Gemini fails
        """
        return f"""I'd be glad to help you with {PRODUCT_DISPLAY_NAME}! However, I'm experiencing some technical difficulties right now.

For immediate assistance with Pro, I recommend:

1. **Browse the Pro Documentation**: Check the specific section related to your question
2. **Pro Workflows**: If asking about workflows, look at the workflow designer documentation
3. **Configuration Help**: For setup questions, check the administration guides
4. **Integration Support**: For integration questions, review the API and integration documentation

Your question about "{user_message[:100]}..." is important, and I want to make sure you get accurate information. Please try again in a moment, or contact Pro support for immediate assistance.

I apologize for the inconvenience!"""

    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation for Pro responses"""
        return len(text.split()) * 1.3  # Rough approximation

    def get_status(self) -> Dict[str, Any]:
        """Get Pro Gemini service status"""
        avg_response_time = (
            self.total_response_time / self.request_count 
            if self.request_count > 0 else 0
        )
        
        error_rate = (
            self.error_count / self.request_count 
            if self.request_count > 0 else 0
        )
        
        return {
            "ready": self.model is not None,
            "can_chat": self.model is not None,
            "model_loaded": self.model is not None,
            "model_name": self.model_name,
            "product": self.product_name,
            "uptime_seconds": time.time() - self.startup_time,
            "requests_processed": self.request_count,
            "error_count": self.error_count,
            "error_rate": error_rate,
            "average_response_time_ms": avg_response_time,
            "last_response_time_ms": self.last_response_time,
            "pro_optimized": True,
            "supported_versions": PRO_SUPPORTED_VERSIONS,
            "version_aware": True
        }

    async def test_connection(self) -> Dict[str, Any]:
        """Test Pro Gemini connection and functionality"""
        try:
            test_message = "How do I create a workflow in Pro?"
            test_context = {
                "version": "8-0",
                "documentation_type": "workflow",
                "search_results": []
            }
            
            response = await self.generate_response(
                user_message=test_message,
                context=test_context
            )
            
            return {
                "status": "connected",
                "test_successful": True,
                "test_response_time_ms": response.get("response_time_ms"),
                "model_responding": True
            }
            
        except Exception as e:
            return {
                "status": "error",
                "test_successful": False,
                "error": str(e),
                "model_responding": False
            }