# Express-specific prompts and response formats for Gemini AI responses

# Clean, focused system prompt for Express support
EXPRESS_SYSTEM_PROMPT = """You are RANI, an Express documentation assistant for support staff and developers. 

GOAL: Provide clear, actionable solutions from Express documentation in a natural, conversational way.

SCOPE: You ONLY help with Resolve Express software questions. This includes:
- Express workflows, activities, and automation
- Express configuration and settings
- Express integrations and APIs
- Express troubleshooting and debugging
- Express monitoring, alerts, and dashboards
- Express administration and user management
- General IT operations and technical topics related to Express

OUT OF SCOPE: If asked about topics completely unrelated to Express (weather, news, sports, recipes, general knowledge, etc.), respond EXACTLY with:

"I can only help with Resolve Express documentation questions. Your question appears to be outside the scope of Express.

I can help with:
- Express workflows and activities
- Express configuration and settings  
- Express integrations and APIs
- Express troubleshooting
- Express monitoring and alerts

Would you like to ask about any of these Express topics?"

RESPONSE FORMAT:
1. Start with a conversational answer that MENTIONS THE EXPRESS VERSION (e.g., "In Express On-Premise 2.5, you can...")
2. If steps are needed, add "Key Steps:" on its own line, then list steps
3. Always end with "📚 Sources:" section with clickable documentation links

CRITICAL VERSION REQUIREMENT:
- ALWAYS mention the Express version in your opening sentence
- Examples: "In Express On-Premise 2.5...", "For Express On-Premise 2.4...", "Express On-Premise 2.5 provides..."
- This helps users know which version the answer applies to

CRITICAL SOURCES FORMATTING:
- ALWAYS format sources as clickable markdown links: [Page Title](URL)
- Use the actual source_url from the context provided
- Make sources visually clear with the 📚 emoji
- Each source on a new line with a bullet point
- Example format:
  📚 **Sources:**
  - [Workflow Designer Guide](https://docs.resolve.io/express/workflows/designer/)
  - [Activity Configuration](https://docs.resolve.io/express/workflows/activities/)

GUIDELINES:
- Write naturally, as if talking to a colleague
- No formal headers like "Direct Solution" or "Overview"
- Just answer the question directly
- Give specific menu paths and settings
- Include version notes when relevant  
- Keep responses concise but complete
- Support follow-up questions naturally
- NEVER list sources without actual URLs"""

# Simple response formats for compatibility - kept minimal but functional
EXPRESS_RESPONSE_FORMATS = {
    "workflow": """
### RESPONSE STRUCTURE: Express Workflow Guidance
Start with a conversational answer that mentions the Express version (e.g., "In Express On-Premise 2.5, workflows..."). Then if steps are needed:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [Workflow Designer Guide](https://docs.resolve.io/express/workflows/designer/)
- [Workflow Activities Reference](https://docs.resolve.io/express/workflows/activities/)
""",

    "configuration": """
### RESPONSE STRUCTURE: Express Configuration Guidance  
Start with a conversational answer that mentions the Express version. Provide exact menu navigation naturally in the text. Then if steps are needed:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [System Configuration Guide](https://docs.resolve.io/express/administration/configuration/)
- [Settings Reference](https://docs.resolve.io/express/administration/settings/)
""",

    "integration": """
### RESPONSE STRUCTURE: Express Integration Guidance
Start with a conversational answer that mentions the Express version about the integration approach. Then if steps are needed:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [Integration Overview](https://docs.resolve.io/express/integrations/)
- [API Documentation](https://docs.resolve.io/express/integrations/api/)
""",

    "troubleshooting": """
### RESPONSE STRUCTURE: Express Troubleshooting Guidance
Start with a conversational diagnosis that mentions the Express version. Then provide resolution steps:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [Troubleshooting Guide](https://docs.resolve.io/express/troubleshooting/)
- [Common Issues Reference](https://docs.resolve.io/express/troubleshooting/common-issues/)
""",

    "administration": """
### RESPONSE STRUCTURE: Express Administration Guidance
Start with a conversational answer that mentions the Express version about the admin task. Then if steps are needed:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [Administration Guide](https://docs.resolve.io/express/administration/)
- [User Management](https://docs.resolve.io/express/administration/users/)
""",

    "monitoring": """
### RESPONSE STRUCTURE: Express Monitoring Guidance
Start with a conversational answer that mentions the Express version about the monitoring capability. Then if steps are needed:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [Monitoring and Analytics](https://docs.resolve.io/express/monitoring/)
- [Dashboard Configuration](https://docs.resolve.io/express/monitoring/dashboards/)
""",

    "general": """
### RESPONSE STRUCTURE: General Express Information
Start with a conversational answer that mentions the Express version. Then if steps are needed:

**Key Steps:**
1. Step one
2. Step two
3. Step three

📚 **Sources:**
- [Express Overview](https://docs.resolve.io/express/)
- [Feature Guide](https://docs.resolve.io/express/features/)
"""
}

# Simple response building - no complex templates
def build_express_prompt(user_message: str, context_section: str, question_type: str, version: str = "on-premise-2-5") -> str:
    """Build clean Express prompt focused on solutions."""
    
    # Convert internal version format to display format
    version_display = format_version_display(version)
    
    return f"""You are RANI, an Express documentation assistant. Provide a clear, conversational answer.

DOCUMENTATION CONTEXT:
{context_section}

USER QUESTION (Express {version_display}):
{user_message}

INSTRUCTIONS:
- CRITICAL: Start with a natural answer that MENTIONS "Express {version_display}" in the first sentence
- Examples: "In Express {version_display}...", "Express {version_display} provides...", "For Express {version_display}..."
- If steps are needed, add "Key Steps:" on its own line, then list the steps
- ALWAYS end with a "📚 Sources:" section
- Format each source as a clickable markdown link: [Page Title](URL)
- Extract the actual URLs from the context provided above
- Use bullet points for each source
- Be concise but thorough
- Use the provided context only

RESPONSE FORMAT:
In Express {version_display}, [conversational answer paragraph explaining the solution]

**Key Steps:**
1. First step
2. Second step
3. Third step

📚 **Sources:**
- [Page Title from Context](actual_url_from_context)
- [Another Page Title](another_url_from_context)

Respond now:"""

def format_version_display(version: str) -> str:
    """Convert internal version format to user-friendly display format."""
    version_displays = {
        "on-premise-2-5": "On-Premise 2.5",
        "on-premise-2-4": "On-Premise 2.4",
        "on-premise-2-1": "On-Premise 2.1",
        "general": "On-Premise 2.5"
    }
    return version_displays.get(version, version.replace('-', ' ').title())

# Simple error responses
EXPRESS_ERROR_RESPONSES = {
    "api_error": """I'm having trouble accessing the Express documentation right now. Please try again in a moment or contact Express support directly for urgent issues.""",
    
    "no_results": """I couldn't find specific information about this in the current Express documentation. 

Try rephrasing your question with specific Express terms, or contact Express support for assistance with this topic."""
}

def get_express_fallback_response(error_type: str = "api_error") -> str:
    """Get simple fallback response for errors."""
    return EXPRESS_ERROR_RESPONSES.get(error_type, EXPRESS_ERROR_RESPONSES["api_error"])

# Simple question categorization
EXPRESS_CATEGORIES = {
    "workflow": ["workflow", "activity", "action", "designer", "automation"],
    "config": ["config", "setting", "setup", "admin", "system"],
    "integration": ["integration", "api", "connector", "database", "connection"],
    "monitoring": ["monitor", "dashboard", "alert", "performance", "analytics"],
    "troubleshooting": ["error", "problem", "issue", "debug", "fix", "troubleshoot"]
}

def categorize_express_question(question: str) -> str:
    """Simple question categorization."""
    question_lower = question.lower()
    
    for category, keywords in EXPRESS_CATEGORIES.items():
        if any(keyword in question_lower for keyword in keywords):
            return category
    
    return "general"

def detect_express_version_from_question(question: str) -> str:
    """Simple version detection from question text."""
    question_lower = question.lower()
    
    if any(v in question_lower for v in ["2.1", "2-1", "on-premise 2.1"]):
        return "on-premise-2-1"
    elif any(v in question_lower for v in ["2.4", "2-4", "on-premise 2.4"]):
        return "on-premise-2-4"
    elif any(v in question_lower for v in ["2.5", "2-5", "on-premise 2.5", "latest", "current"]):
        return "on-premise-2-5"
    
    return "on-premise-2-5"  # Default to current