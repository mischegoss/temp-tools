# Pro Helper - Direct Answers for Developers

# Core system prompt - simple and direct
PRO_SYSTEM_PROMPT = """You are RANI. You help developers understand Pro features and fix problems.

**Your job:**
- Give direct answers first
- Show examples when helpful (code, config, or steps)
- Use simple, clear English
- Always add source links at the end

**Answer format:**
1. Show the solution first
2. Give examples if available
3. Explain why it works
4. Add menu paths when relevant: Settings > Advanced > API
5. End with ## Sources section

**Topics:** workflows, API, configuration, monitoring, troubleshooting, integrations"""

# Response templates - solution-first, flexible format
PRO_RESPONSE_FORMATS = {
    "workflow": """
**Workflow Questions:**
1. Give the direct answer first
2. Show step-by-step process
3. Add examples if available (config, JSON, screenshots)
4. Mention common issues
5. End with sources
""",

    "api": """
**API Questions:**
1. Answer the question directly
2. Show request/response examples if available
3. Explain parameters and options
4. Include error handling info
5. End with sources
""",

    "config": """
**Configuration Questions:**
1. State what needs to be configured
2. Give exact navigation paths
3. Show settings and values if available
4. List validation steps
5. End with sources
""",

    "error": """
**Error/Problem Questions:**
1. Identify what causes the issue
2. Show the solution directly
3. Give prevention tips
4. Explain how to verify the fix
5. End with sources
""",

    "general": """
**General Questions:**
1. Answer directly
2. Give practical examples
3. List key points to remember
4. Mention related features
5. End with sources
"""
}

# Pro versions - simple reference
PRO_VERSIONS = {
    "7-8": "Pro 7.8 - Basic features",
    "7-9": "Pro 7.9 - More features", 
    "8-0": "Pro 8.0 - All features (latest)",
    "general": "All Pro versions"
}

def format_sources(context_chunks):
    """Create clean source citations from documentation chunks"""
    if not context_chunks:
        return "- [Pro Documentation](https://docs.resolve.io/pro/) - Complete Pro docs"
    
    sources = []
    seen_urls = set()
    
    for chunk in context_chunks:
        url = chunk.get('source_url', '')
        title = (chunk.get('page_title') or 
                chunk.get('metadata', {}).get('title') or 
                'Pro Documentation')
        
        # Clean up title
        if ' - ' in title:
            title = title.split(' - ')[0]
        
        if url and url not in seen_urls and url.startswith('http'):
            sources.append(f"- [{title}]({url})")
            seen_urls.add(url)
    
    return "\n".join(sources) if sources else "- Pro Documentation (processing sources)"

def build_pro_prompt(user_question, context_content, question_type="general", version="8-0", context_chunks=None):
    """Build prompt - direct and flexible"""
    
    version_info = PRO_VERSIONS.get(version, PRO_VERSIONS["general"])
    response_format = PRO_RESPONSE_FORMATS.get(question_type, PRO_RESPONSE_FORMATS["general"])
    sources = format_sources(context_chunks)
    
    return f"""{PRO_SYSTEM_PROMPT}

📋 **Question Type:** {question_type.upper()}
📦 **Version:** {version_info}

{response_format}

---
## DOCUMENTATION
{context_content}

## SOURCES TO USE
{sources}

---
## DEVELOPER QUESTION
{user_question}

---
🎯 **What to do:**
✅ Answer the question directly first
✅ Use simple words and short sentences  
✅ Give exact menu paths when available
✅ Include examples when helpful (not required)
✅ End with "## Sources" section
✅ Focus on practical, actionable information

**Response template:**
```
## Solution
[Direct answer to their question]

## How it works
1. Step one
2. Step two  
3. Step three

## Example (if helpful)
[Show config, settings, or workflow example if available]

## Important notes (if needed)
- Key point 1
- Key point 2

## Sources
[Links from above]
```

Write your answer now:"""

# Error responses - simple and direct
PRO_ERROR_RESPONSES = {
    "no_context": """## Solution
I need more specific Pro documentation for this question.

## What to try
- Use specific Pro terms: "workflow activities", "integration setup", "monitoring alerts"
- Check Pro docs directly (link below)
- Ask Pro support for detailed help

## Sources
- [Pro Docs](https://docs.resolve.io/pro/)
- [Pro Support](https://resolve.io/support)""",

    "api_error": """## Problem
Cannot access Pro docs right now.

## Quick fix
1. Go to Pro docs directly (link below)
2. Contact Pro support for urgent issues
3. Try question again in 5 minutes

## Sources  
- [Pro Docs](https://docs.resolve.io/pro/)
- [Pro Support](https://resolve.io/support)""",

    "version_unclear": """## Problem
Need to know your Pro version. Features are different in 7.8, 7.9, and 8.0.

## How to check version
1. Open Pro interface
2. Go to Help > About
3. Look for version number

## Sources
- [Version Info](https://docs.resolve.io/pro/versions/)"""
}

# Feature detection - focus on developer needs
PRO_FEATURES = {
    "api": ["api", "rest", "endpoint", "request", "response", "json", "http", "post", "get"],
    "workflow": ["workflow", "activity", "action", "step", "trigger", "automation"],
    "config": ["config", "setting", "setup", "install", "configure", "parameter", "env"],
    "integration": ["integration", "webhook", "connector", "database", "sync", "connection"],
    "monitoring": ["monitor", "log", "alert", "dashboard", "metric", "health", "status"],
    "error": ["error", "exception", "bug", "fail", "crash", "issue", "problem", "debug"],
    "auth": ["auth", "token", "key", "login", "permission", "security", "access"]
}

def get_question_type(question):
    """Figure out what type of question this is"""
    q = question.lower()
    
    scores = {}
    for category, keywords in PRO_FEATURES.items():
        scores[category] = sum(1 for word in keywords if word in q)
    
    if not any(scores.values()):
        return "general"
    
    return max(scores.items(), key=lambda x: x[1])[0]

def get_version(question):
    """Get Pro version from question, default to latest"""
    q = question.lower()
    if "7.8" in q or "7-8" in q:
        return "7-8"
    elif "7.9" in q or "7-9" in q:  
        return "7-9"
    return "8-0"  # Default to latest

def ensure_sources(response, context_chunks):
    """Make sure response has sources - add them if missing"""
    if "## Sources" in response:
        return response
    
    sources = format_sources(context_chunks)
    return f"{response}\n\n## Sources\n{sources}"

# Usage example for developers:
#
# Example developer question:
# question = "What are the different types of workflow activities in Pro?"
# doc_content = "[Documentation about Pro workflow activities and their purposes]"
# chunks = [{"source_url": "https://docs.resolve.io/pro/workflows/activities", "page_title": "Workflow Activities"}]
#
# Generate prompt:
# prompt = build_pro_prompt(
#     user_question=question,
#     context_content=doc_content, 
#     question_type=get_question_type(question),  # Returns "workflow"
#     version=get_version(question),              # Returns "8-0" 
#     context_chunks=chunks
# )
#
# This creates a prompt that will generate something like:
#
# ## Solution
# Pro has 5 main types of workflow activities: Action, Condition, Integration, Notification, and Timer activities.
#
# ## How it works
# 1. Action activities - perform operations like data updates
# 2. Condition activities - check conditions and branch workflow
# 3. Integration activities - connect to external systems
# 4. Notification activities - send alerts and messages  
# 5. Timer activities - add delays or schedule operations
#
# ## Example
# A typical workflow might use:
# - Timer activity to wait 5 minutes
# - Condition activity to check if ticket is urgent
# - Integration activity to update external database
# - Notification activity to alert team
#
# ## Important notes
# - Activities connect with arrows to create workflow sequence
# - Each activity has specific configuration options
# - Pro 8.0 has more activity types than earlier versions
#
# ## Sources
# - [Workflow Activities](https://docs.resolve.io/pro/workflows/activities)