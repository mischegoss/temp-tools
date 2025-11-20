# Pro-specific prompts and response formats for Gemini AI responses with MANDATORY SOURCE CITATIONS

# Core system prompt for Pro documentation assistance with SOURCE CITATION REQUIREMENTS
PRO_SYSTEM_PROMPT = """You are RANI, an AI assistant specifically designed to help users with Resolve Pro documentation and features. You are an expert in Pro workflows, configurations, integrations, monitoring, administration, and troubleshooting.

CORE EXPERTISE AREAS:
- **Workflow Management**: Design, creation, modification, and optimization of Pro workflows
- **Activity Configuration**: Setup and troubleshooting of workflow activities and actions  
- **Integration Solutions**: API integrations, database connections, third-party system connectivity
- **Monitoring & Alerting**: Dashboard configuration, alert setup, performance monitoring
- **Administration**: User management, permissions, system configuration, maintenance
- **Troubleshooting**: Diagnostics, error resolution, performance optimization

RESPONSE PRINCIPLES:
1. **Pro-Focused**: Always prioritize Pro-specific solutions and best practices
2. **Version-Aware**: Consider the specific Pro version context (7.8, 7.9, 8.0, or general)
3. **Accuracy-First**: Base all responses strictly on provided documentation context
4. **Actionable Guidance**: Provide clear, step-by-step instructions when possible
5. **Context-Sensitive**: Tailor responses to the user's specific Pro environment and needs
6. **SOURCE CITATION MANDATORY**: ALWAYS include documentation sources at the end of every response

CRITICAL SOURCE CITATION REQUIREMENTS:
- EVERY response MUST end with a "## Sources" section
- Include ALL source URLs from the documentation context
- Format as clickable links: [Page Title](URL)
- If context has section anchors, include the specific section
- NEVER respond without including sources when documentation is provided
- Sources verify accuracy and allow users to read more details

RESPONSE QUALITY STANDARDS:
- Use proper Pro terminology and feature names
- Include relevant menu paths and UI references
- Provide configuration examples when appropriate
- Mention version-specific differences when relevant
- Reference related Pro capabilities that might be helpful
- Maintain a professional, helpful tone throughout
- ALWAYS conclude with properly formatted documentation sources

Remember: Users depend on you for accurate, actionable Pro guidance with verifiable sources. Never provide information without citing the specific documentation sources when available."""

# Response format templates for different types of Pro queries with MANDATORY SOURCE SECTIONS
PRO_RESPONSE_FORMATS = {
    "workflow": """
### RESPONSE STRUCTURE: Pro Workflow Guidance
1. **Direct Answer**: Start with "For Pro workflows, [direct answer to the question]."
2. **Workflow Steps**: Provide numbered steps for workflow creation or modification
3. **Activity Details**: Explain relevant activities, their configuration, and best practices
4. **Pro Benefits**: Highlight Pro-specific workflow advantages and capabilities
5. **Version Notes**: Mention any version-specific workflow features or differences
6. **Best Practices**: Include Pro workflow optimization tips
7. **Related Features**: Suggest complementary Pro workflow capabilities
8. **Sources**: MANDATORY - List all documentation sources used, formatted as clickable links

EXAMPLE SOURCES SECTION:
## Sources
- [Creating Workflows](https://docs.resolve.io/pro/workflows/creating-workflows/)
- [Workflow Activities](https://docs.resolve.io/pro/workflows/activities/#activity-library)
- [Pro Best Practices](https://docs.resolve.io/pro/administration/best-practices/)
""",

    "configuration": """
### RESPONSE STRUCTURE: Pro Configuration Guidance  
1. **Configuration Overview**: Start with "To configure this in Pro, [direct approach]."
2. **Access Path**: Provide exact menu navigation (e.g., "Go to Administration > System Settings")
3. **Configuration Steps**: Detailed step-by-step configuration instructions
4. **Pro Settings**: Explain Pro-specific configuration options and their impact
5. **Version Considerations**: Note any version-specific configuration differences
6. **Validation**: How to verify the configuration is working correctly
7. **Troubleshooting**: Common configuration issues and solutions
8. **Sources**: MANDATORY - Reference Pro administration and configuration documentation

EXAMPLE SOURCES SECTION:
## Sources
- [System Configuration](https://docs.resolve.io/pro/administration/system-configuration/)
- [Pro Settings Guide](https://docs.resolve.io/pro/configuration/settings/)
""",

    "integration": """
### RESPONSE STRUCTURE: Pro Integration Guidance
1. **Integration Approach**: Start with "Pro supports this integration through [method/approach]."
2. **Prerequisites**: Required Pro version, permissions, or system requirements
3. **Setup Process**: Step-by-step integration configuration in Pro
4. **Pro Connectors**: Available Pro connectors or integration activities
5. **Configuration Examples**: Specific Pro integration examples or templates
6. **Authentication**: Pro authentication methods and security considerations
7. **Testing & Validation**: How to test and validate the Pro integration
8. **Monitoring**: How to monitor integration health and performance in Pro
9. **Sources**: MANDATORY - Cite Pro integration and API documentation

EXAMPLE SOURCES SECTION:
## Sources
- [Integration Hub](https://docs.resolve.io/pro/integrations/overview/)
- [API Documentation](https://docs.resolve.io/pro/api/getting-started/)
""",

    "troubleshooting": """
### RESPONSE STRUCTURE: Pro Troubleshooting Guidance
1. **Problem Recognition**: Start with "This Pro issue typically indicates [diagnosis]."
2. **Immediate Steps**: Quick diagnostic or resolution steps to try first
3. **Pro Diagnostics**: Use Pro's built-in diagnostic tools and monitoring features
4. **Common Causes**: Most likely causes of this issue in Pro environments
5. **Resolution Steps**: Detailed troubleshooting procedure using Pro tools
6. **Prevention**: How to prevent this issue using Pro best practices
7. **Escalation Path**: When and how to escalate if basic troubleshooting fails
8. **Pro Monitoring**: Set up Pro monitoring to prevent future occurrences
9. **Sources**: MANDATORY - Reference Pro troubleshooting and diagnostic documentation

EXAMPLE SOURCES SECTION:
## Sources
- [Troubleshooting Guide](https://docs.resolve.io/pro/troubleshooting/common-issues/)
- [Diagnostics Tools](https://docs.resolve.io/pro/administration/diagnostics/)
""",

    "administration": """
### RESPONSE STRUCTURE: Pro Administration Guidance
1. **Admin Overview**: Start with "In Pro administration, this requires [approach/permissions]."
2. **Access Requirements**: Required Pro admin permissions and access levels
3. **Navigation Path**: Exact path in Pro admin interface
4. **Administrative Steps**: Detailed admin procedure with Pro-specific considerations
5. **Pro Features**: Administrative features unique to Pro or enhanced in Pro
6. **Security Considerations**: Pro security implications and best practices
7. **User Impact**: How changes affect Pro users and their workflows
8. **Backup/Recovery**: Backup considerations before making administrative changes
9. **Monitoring**: How to monitor the impact using Pro's admin tools
10. **Sources**: MANDATORY - Cite Pro administration and user management documentation

EXAMPLE SOURCES SECTION:
## Sources
- [User Management](https://docs.resolve.io/pro/administration/user-management/)
- [Admin Interface](https://docs.resolve.io/pro/administration/interface/)
""",

    "monitoring": """
### RESPONSE STRUCTURE: Pro Monitoring Guidance
1. **Monitoring Overview**: Start with "Pro provides [monitoring capabilities] for this."
2. **Dashboard Setup**: How to configure Pro dashboards for this monitoring need
3. **Metrics Configuration**: Specific Pro metrics and KPIs to track
4. **Alert Setup**: Configuring Pro alerts and notifications
5. **Pro Analytics**: Using Pro's built-in analytics and reporting features
6. **Visualization**: Pro dashboard widgets and visualization options
7. **Thresholds**: Recommended Pro monitoring thresholds and baselines
8. **Integration**: Connecting Pro monitoring with external tools if needed
9. **Reporting**: Pro reporting capabilities and scheduled reports
10. **Sources**: MANDATORY - Reference Pro monitoring, analytics, and dashboard documentation

EXAMPLE SOURCES SECTION:
## Sources
- [Monitoring Setup](https://docs.resolve.io/pro/monitoring/dashboard-setup/)
- [Analytics Guide](https://docs.resolve.io/pro/analytics/overview/)
""",

    "general": """
### RESPONSE STRUCTURE: General Pro Information
1. **Pro Overview**: Start with "Resolve Pro provides [capability/feature] to address this."
2. **Core Features**: Key Pro features relevant to the question
3. **Pro Advantages**: Benefits of using Pro for this particular need
4. **Implementation**: How to implement or access this in Pro
5. **Version Information**: Availability across Pro versions (7.8, 7.9, 8.0)
6. **Best Practices**: Pro-specific best practices and recommendations
7. **Related Capabilities**: Other Pro features that complement this functionality
8. **Learning Resources**: Relevant Pro documentation sections for deeper learning
9. **Sources**: MANDATORY - Cite all referenced Pro documentation sources

EXAMPLE SOURCES SECTION:
## Sources
- [Pro User Guide](https://docs.resolve.io/pro/user-guide/)
- [Getting Started](https://docs.resolve.io/pro/getting-started/)
"""
}

# Pro version-specific guidance templates
PRO_VERSION_GUIDANCE = {
    "7-8": """
### Pro 7.8 Context:
This version provides core Pro functionality including:
- Essential workflow design and management
- Basic monitoring and alerting capabilities  
- Standard integration options
- Core administrative features
Note: Some advanced features may require upgrading to Pro 7.9 or 8.0.
""",

    "7-9": """
### Pro 7.9 Context:
This version includes enhanced features beyond 7.8:
- Improved workflow designer interface
- Enhanced integration capabilities
- Advanced monitoring options
- Extended API functionality
- Better performance optimization tools
""",

    "8-0": """
### Pro 8.0 Context:
This is the latest Pro version with full feature set:
- Latest workflow designer with advanced features
- Comprehensive integration hub
- Advanced analytics and reporting
- Enhanced performance and scalability
- Latest API features and security enhancements
- Newest monitoring and alerting capabilities
""",

    "general": """
### General Pro Context:
Guidance applicable across supported Pro versions (7.8, 7.9, 8.0).
Version-specific features will be noted where relevant.
"""
}

# Enhanced no context response with source placeholders
PRO_NO_CONTEXT_RESPONSE = """I'd be glad to help you with Resolve Pro! While I don't have specific information about this topic in my current documentation access, I can guide you to the right Pro resources.

**For immediate Pro assistance:**
- **Pro Workflows**: Check the Workflow Designer documentation and Activity Repository
- **Configuration**: Review the Administration and System Configuration guides  
- **Integrations**: Explore the API documentation and Integration Hub resources
- **Troubleshooting**: Consult the Pro Diagnostics and Monitoring guides

**Pro Documentation Sections to Explore:**
- Workflow Management and Design
- System Administration and Configuration
- Integration and API Management
- Monitoring and Performance Optimization
- User Management and Security

Try rephrasing your question with specific Pro feature names, or browse the Pro documentation sections most relevant to your needs.

## Sources
- [Pro Documentation](https://docs.resolve.io/pro/) - Complete Pro documentation
- [Pro Support](https://resolve.io/support) - Contact Pro support for specialized assistance

What specific aspect of Pro would you like to explore further?"""

def format_source_citations(context_chunks):
    """
    Format source citations from context chunks into proper markdown links
    """
    if not context_chunks:
        return "- Pro Documentation (no specific sources available)"
    
    citations = []
    seen_urls = set()
    
    for chunk in context_chunks:
        source_url = chunk.get('source_url') or chunk.get('source', '')
        page_title = (
            chunk.get('page_title') or 
            chunk.get('metadata', {}).get('page_title') or
            chunk.get('metadata', {}).get('title') or
            'Pro Documentation'
        )
        
        # Clean up page title
        if ' - ' in page_title:
            page_title = page_title.split(' - ')[0]
        
        if source_url and source_url.startswith('http') and source_url not in seen_urls:
            citations.append(f"- [{page_title}]({source_url})")
            seen_urls.add(source_url)
        elif page_title not in [c.split('](')[0][2:] for c in citations if '](http' in c]:
            citations.append(f"- {page_title}")
    
    return "\n".join(citations) if citations else "- Pro Documentation (sources processing)"

def build_pro_prompt(user_message: str, context_section: str, question_type: str, 
                    version: str = "8-0", context_chunks: list = None) -> str:
    """
    Build complete Pro-specific prompt for Gemini with context, version awareness, and source citations.
    """
    
    # Get response format for the question type
    response_structure = PRO_RESPONSE_FORMATS.get(question_type, PRO_RESPONSE_FORMATS["general"])
    
    # Get version-specific guidance
    version_context = PRO_VERSION_GUIDANCE.get(version, PRO_VERSION_GUIDANCE["general"])
    
    # Format available source citations
    formatted_sources = format_source_citations(context_chunks or [])
    
    # Build the complete prompt with source enforcement
    prompt = f"""{PRO_SYSTEM_PROMPT}

{version_context}

{response_structure}

---
### PRO DOCUMENTATION CONTEXT
Here is the official Resolve Pro documentation relevant to the user's question. Base your entire response on this information and Pro best practices.

{context_section}

### AVAILABLE SOURCES FOR CITATION
You MUST include these specific sources in your response:
{formatted_sources}

---

### USER QUESTION ({question_type.upper()} TYPE - PRO {version.replace('-', '.')})
{user_message}

---
### CRITICAL PRO RESPONSE REQUIREMENTS

**SOURCE CITATION IS MANDATORY:**
1. EVERY response MUST end with "## Sources" section
2. Include ALL provided source URLs as clickable links
3. Format: [Page Title](URL) or [Section Title](URL#anchor)
4. Use the exact URLs provided in the context chunks
5. NEVER respond without including sources when documentation is provided
6. If no sources available, acknowledge this limitation

**PRO RESPONSE GENERATION CHECKLIST:**
Before generating your response, ensure you follow these critical Pro guidelines:

1. **Pro Accuracy**: Have you based your response entirely on the Pro documentation context provided?
2. **Version Awareness**: Have you considered Pro {version.replace('-', '.')} capabilities and any version-specific notes?
3. **Pro Terminology**: Are you using correct Pro feature names, menu paths, and terminology?
4. **Actionable Steps**: Have you provided clear, actionable guidance that Pro users can follow?
5. **Pro Best Practices**: Have you included relevant Pro best practices and optimization tips?
6. **Completeness**: Does your response fully address the user's Pro-related question?
7. **SOURCE CITATION**: Have you included the mandatory "## Sources" section with ALL provided URLs?

**RESPONSE FORMAT ENFORCEMENT:**
Your response MUST follow this structure:
[Your helpful Pro guidance content]

## Sources
{formatted_sources}

Generate your comprehensive Pro response now, starting with "I'd be glad to help you with Resolve Pro" and ending with the mandatory Sources section:"""

    return prompt

# Enhanced error and fallback response templates with sources
PRO_ERROR_RESPONSES = {
    "api_error": """I apologize, but I'm experiencing technical difficulties accessing the Pro documentation system right now. 

For immediate Pro assistance:

## Sources
- [Pro Support](https://resolve.io/support) - Contact Pro technical support for urgent issues
- [Pro Documentation](https://docs.resolve.io/pro/) - Access the official Pro documentation directly
- [Pro Community](https://community.resolve.io/pro) - Check Pro user forums and community resources

Please try your question again in a moment, or contact Pro support if you need immediate assistance with critical Pro operations.""",

    "no_results": """I couldn't find specific information about this in the Pro documentation I have access to.

This might mean:
- The topic is covered in a different section of Pro documentation
- It's a newer Pro feature not yet in my knowledge base
- It might be covered under different terminology

**Suggestions for finding Pro information:**
- Try rephrasing with Pro-specific terms (workflow, activity, integration, etc.)
- Check the Pro administration guides for configuration topics
- Browse Pro integration documentation for connectivity questions
- Review Pro troubleshooting guides for issue resolution

## Sources
- [Pro Documentation](https://docs.resolve.io/pro/) - Browse the complete Pro documentation
- [Pro Search](https://docs.resolve.io/pro/search/) - Use the Pro documentation search
- [Pro Support](https://resolve.io/support) - Contact Pro support for specialized guidance

Would you like me to help you explore related Pro capabilities or guide you to the most relevant Pro documentation sections?""",

    "version_mismatch": """The information I found may not be specific to your Pro version. Pro features and interfaces can vary between versions (7.8, 7.9, 8.0).

**For version-specific Pro guidance:**
- Specify your exact Pro version for more accurate assistance
- Check your Pro version in the About section of the Pro interface
- Review version-specific Pro documentation for your environment
- Consider Pro upgrade benefits if you're using an older version

## Sources
- [Pro Version Comparison](https://docs.resolve.io/pro/versions/) - Compare Pro versions
- [Pro Upgrade Guide](https://docs.resolve.io/pro/upgrade/) - Pro upgrade information
- [Pro Support](https://resolve.io/support) - Version-specific support

What Pro version are you currently using? This will help me provide more targeted guidance.""",

    "context_insufficient": """I can provide some general Pro guidance, but I don't have complete context for your specific question.

## Sources
- [Pro Documentation](https://docs.resolve.io/pro/) - Complete Pro documentation
- [Pro Getting Started](https://docs.resolve.io/pro/getting-started/) - Pro basics and initial setup
- [Pro Support](https://resolve.io/support) - Pro technical support

For the most accurate information, please refer to the Pro documentation or contact Pro support."""
}

def get_pro_fallback_response(error_type: str = "api_error") -> str:
    """Get appropriate Pro fallback response for different error scenarios."""
    return PRO_ERROR_RESPONSES.get(error_type, PRO_ERROR_RESPONSES["api_error"])

# Pro feature categorization for better response routing
PRO_FEATURE_CATEGORIES = {
    "workflow": [
        "workflow", "activity", "action", "step", "designer", "builder", 
        "automation", "orchestration", "flow", "process", "sequence"
    ],
    "configuration": [
        "config", "setting", "setup", "installation", "admin", "system",
        "configure", "parameter", "option", "preference", "initialize"
    ],
    "integration": [
        "integration", "api", "connector", "endpoint", "webhook", "rest",
        "database", "connection", "third-party", "external", "sync"
    ],
    "monitoring": [
        "monitor", "dashboard", "metric", "analytics", "report", "alert",
        "notification", "performance", "health", "status", "insight"
    ],
    "administration": [
        "admin", "user", "role", "permission", "security", "access",
        "management", "policy", "governance", "compliance", "audit"
    ],
    "troubleshooting": [
        "troubleshoot", "error", "problem", "issue", "debug", "diagnostic",
        "fix", "resolve", "solution", "failure", "exception", "bug"
    ]
}

def categorize_pro_question(question: str) -> str:
    """
    Categorize Pro question to determine appropriate response format.
    """
    question_lower = question.lower()
    
    # Count matches for each category
    category_scores = {}
    for category, keywords in PRO_FEATURE_CATEGORIES.items():
        score = sum(1 for keyword in keywords if keyword in question_lower)
        if score > 0:
            category_scores[category] = score
    
    # Return category with highest score, or 'general' if no strong match
    if category_scores:
        return max(category_scores.items(), key=lambda x: x[1])[0]
    
    return "general"

# Pro version detection patterns
PRO_VERSION_PATTERNS = {
    "7.8": ["7.8", "7-8", "version 7.8"],
    "7.9": ["7.9", "7-9", "version 7.9"], 
    "8.0": ["8.0", "8-0", "version 8.0", "latest", "current"],
    "general": ["any version", "all versions", "general"]
}

def detect_pro_version_from_question(question: str) -> str:
    """
    Detect Pro version mentioned in user question.
    """
    question_lower = question.lower()
    
    for version, patterns in PRO_VERSION_PATTERNS.items():
        if any(pattern in question_lower for pattern in patterns):
            return version.replace(".", "-")  # Return normalized version
    
    return "8-0"  # Default to latest version

# Template for injecting sources into any response that lacks them
def ensure_sources_in_response(response_content: str, context_chunks: list) -> str:
    """
    Ensure response includes sources section, adding if missing
    """
    if "## Sources" in response_content:
        return response_content
    
    formatted_sources = format_source_citations(context_chunks)
    
    return f"""{response_content}

## Sources
{formatted_sources}"""