# Pro-specific prompts and response formats for Gemini AI responses

# Clean, focused system prompt for Pro support
PRO_SYSTEM_PROMPT = """You are RANI, a Pro documentation assistant for support staff and developers. 

GOAL: Provide clear, actionable solutions from Pro documentation.

RESPONSE FORMAT:
1. **Direct solution** first
2. **Key steps** (if applicable) 
3. **Sources** section with documentation links

GUIDELINES:
- Use Pro documentation context only
- Give specific menu paths and settings
- Include version notes when relevant  
- Keep responses concise but complete
- Support follow-up questions naturally"""

# Simple response building - no complex templates
def build_pro_prompt(user_message: str, context_section: str, question_type: str, version: str = "8-0") -> str:
    """Build clean Pro prompt focused on solutions."""
    
    version_display = version.replace('-', '.')
    
    return f"""You are RANI, a Pro documentation assistant. Provide a clear, solution-focused answer.

DOCUMENTATION CONTEXT:
{context_section}

USER QUESTION (Pro {version_display}):
{user_message}

INSTRUCTIONS:
- Give the direct solution first
- Include specific steps if needed
- Always end with a "Sources:" section listing relevant documentation pages
- Be concise but thorough
- Use the provided context only

Respond now:"""

# Simple error responses
PRO_ERROR_RESPONSES = {
    "api_error": """I'm having trouble accessing the Pro documentation right now. Please try again in a moment or contact Pro support directly for urgent issues.""",
    
    "no_results": """I couldn't find specific information about this in the current Pro documentation. 

Try rephrasing your question with specific Pro terms, or contact Pro support for assistance with this topic."""
}

def get_pro_fallback_response(error_type: str = "api_error") -> str:
    """Get simple fallback response for errors."""
    return PRO_ERROR_RESPONSES.get(error_type, PRO_ERROR_RESPONSES["api_error"])

# Simple question categorization
PRO_CATEGORIES = {
    "workflow": ["workflow", "activity", "action", "designer", "automation"],
    "config": ["config", "setting", "setup", "admin", "system"],
    "integration": ["integration", "api", "connector", "database", "connection"],
    "monitoring": ["monitor", "dashboard", "alert", "performance", "analytics"],
    "troubleshooting": ["error", "problem", "issue", "debug", "fix", "troubleshoot"]
}

def categorize_pro_question(question: str) -> str:
    """Simple question categorization."""
    question_lower = question.lower()
    
    for category, keywords in PRO_CATEGORIES.items():
        if any(keyword in question_lower for keyword in keywords):
            return category
    
    return "general"

def detect_pro_version_from_question(question: str) -> str:
    """Simple version detection."""
    question_lower = question.lower()
    
    if any(v in question_lower for v in ["7.8", "7-8"]):
        return "7-8"
    elif any(v in question_lower for v in ["7.9", "7-9"]):
        return "7-9"
    elif any(v in question_lower for v in ["8.0", "8-0", "latest", "current"]):
        return "8-0"
    
    return "8-0"  # Default to current