// src/components/ProChatbot/ProChatbotService.js
// Pro-specific chatbot service extending the base service
// UPDATED: Fixed request/response format for Cloud Run API

import BaseChatbotService from '../SharedChatbot/services/baseChatbotService'
import PRO_CHATBOT_CONFIG from './proConfig'

class ProChatbotService extends BaseChatbotService {
  constructor() {
    super(PRO_CHATBOT_CONFIG)
    this.productName = 'Pro'
    this.currentSelectedVersion = null // Track manually selected version
  }

  /**
   * Set version manually (for version selector)
   */
  setVersion(version) {
    this.currentSelectedVersion = version
    console.log(`📌 Pro version manually set to: ${version}`)
  }

  /**
   * Get version info for display
   */
  getVersionInfo() {
    const effectiveVersion = this.getEffectiveVersion()
    const versionConfig = this.config.availableVersions.find(
      v => v.value === effectiveVersion,
    )
    return versionConfig || { value: effectiveVersion, label: effectiveVersion }
  }

  /**
   * Detect Pro version from current URL
   */
  detectVersion() {
    if (typeof window === 'undefined') return this.config.defaultVersion

    const pathname = window.location.pathname
    const match = pathname.match(this.config.versionDetectionPattern)

    if (match) {
      const rawVersion = match[1]

      // Use version mapping to normalize (e.g., "7.9" -> "7-9")
      const normalizedVersion = this.config.versionMappings[rawVersion]
      if (normalizedVersion) {
        return normalizedVersion
      }

      // Fallback: convert dots to hyphens
      return rawVersion.replace(/\./g, '-')
    }

    // Default to current version if not explicitly versioned
    return this.config.defaultVersion
  }

  /**
   * Get effective version (manual override > detected > default)
   */
  getEffectiveVersion() {
    if (this.currentSelectedVersion) {
      return this.currentSelectedVersion
    }

    return this.detectVersion()
  }

  /**
   * Detect documentation type from current page for context
   */
  detectDocumentationType(pathname) {
    const lowerPath = pathname.toLowerCase()

    if (lowerPath.includes('/workflow') || lowerPath.includes('/activities')) {
      return 'workflow'
    }
    if (lowerPath.includes('/getting') || lowerPath.includes('/introduction')) {
      return 'getting_started'
    }
    if (
      lowerPath.includes('/administration') ||
      lowerPath.includes('/config')
    ) {
      return 'administration'
    }
    if (lowerPath.includes('/integration') || lowerPath.includes('/api')) {
      return 'integration'
    }
    if (lowerPath.includes('/troubleshooting') || lowerPath.includes('/faq')) {
      return 'troubleshooting'
    }
    if (lowerPath.includes('/reference')) {
      return 'reference'
    }

    return 'general'
  }

  /**
   * Warm up the Pro API for faster responses
   */
  async warmUpAPI() {
    try {
      const warmupResponse = await this.makeRequest(this.endpoints.warmup, {
        method: 'GET',
      })
      console.log('🔥 Pro API warmed up successfully')
      return warmupResponse
    } catch (error) {
      console.warn('⚠️ Pro API warmup failed:', error.message)
      // Don't throw error - warmup failure shouldn't block chat
    }
  }

  /**
   * Enhanced ensureServerAwake with API warmup
   */
  async ensureServerAwake(onProgress = null) {
    if (this.isServerAwake && this.isHealthCheckValid()) {
      return true
    }

    // Wake up server first
    await this.wakeUpServer(onProgress)

    // Warm up API for faster responses
    await this.warmUpAPI()

    return true
  }

  /**
   * Enhanced sendMessage with Pro-specific context and version awareness
   * UPDATED: Fixed request format for Cloud Run API
   */
  async sendMessage(message, conversationHistory = []) {
    const effectiveVersion = this.getEffectiveVersion()
    const detectedVersion = this.detectVersion()
    const currentPage =
      typeof window !== 'undefined' ? window.location.pathname : '/'

    // FIXED: Updated request format to match Cloud Run API expectations
    const enhancedRequestBody = {
      message: message.trim(),
      version: effectiveVersion,
      conversation_history: conversationHistory.map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text,
        timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
      })),
      conversation_id: `pro-chat-${Date.now()}`,
      context: {
        page: currentPage,
        documentation_type: this.detectDocumentationType(currentPage),
        user_role: 'user',
      },
    }

    try {
      await this.ensureServerAwake()

      console.log('💼 Sending Pro message:', {
        message: message.substring(0, 50) + '...',
        effectiveVersion,
        detectedVersion,
        isManuallySelected: this.currentSelectedVersion !== null,
        page: currentPage,
      })

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.chat, {
          method: 'POST',
          body: JSON.stringify(enhancedRequestBody),
        })
      })

      // FIXED: Updated response field mapping for Cloud Run API
      if (!result.data.message) {
        throw new Error('Invalid response format from Pro API')
      }

      console.log('🤖 Pro AI Response received')
      return {
        success: true,
        message: result.data.message, // FIXED: API returns 'message' field
        metadata: {
          responseTime: result.data.processing_time
            ? result.data.processing_time * 1000
            : null, // FIXED: Convert seconds to ms
          sources: result.data.context_used || [], // FIXED: API returns 'context_used'
          confidence: null, // API doesn't return confidence
          modelUsed: result.data.model_used || 'gemini-2.5-flash',
          versionContext: result.data.version_context,
          enhancedFeaturesUsed: result.data.enhanced_features_used || false,
          relationshipEnhancedChunks:
            result.data.relationship_enhanced_chunks || 0,
          conversationId: result.data.conversation_id,
          version: effectiveVersion,
          contextInfo: {
            version: effectiveVersion,
            detectedVersion,
            isManuallySelected: this.currentSelectedVersion !== null,
            documentationType: this.detectDocumentationType(currentPage),
          },
        },
      }
    } catch (error) {
      console.error('❌ Pro chat failed:', error.message)
      return {
        success: false,
        error: error.message,
        message: this.getErrorFallbackMessage(error),
      }
    }
  }

  /**
   * Enhanced search with Pro version context
   * UPDATED: Fixed search request format for Cloud Run API
   */
  async searchDocumentation(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string')
    }

    try {
      await this.ensureServerAwake()

      const effectiveVersion = this.getEffectiveVersion()

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.search, {
          method: 'POST',
          body: JSON.stringify({
            query: query.trim(),
            version: effectiveVersion, // FIXED: Keep version, remove product
            max_results: 5,
            similarity_threshold: 0.3,
            content_type_filter: null,
          }),
        })
      })

      return {
        success: true,
        results: result.data.results || [],
        metadata: {
          totalResults: result.data.total_results || 0,
          searchTime: result.data.search_time_ms || null,
          version: effectiveVersion,
        },
      }
    } catch (error) {
      console.error('❌ Pro documentation search failed:', error.message)
      return {
        success: false,
        error: error.message,
        results: [],
      }
    }
  }

  /**
   * Pro-specific error messages
   */
  getErrorFallbackMessage(error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return `I'm having trouble connecting to the Pro AI backend. Let me direct you to our support team for immediate assistance.`
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return `The Pro AI service is starting up. Please try again in a few moments.`
    }

    if (errorMessage.includes('version')) {
      return `I encountered an issue with version-specific content. Try selecting a different version or contact support.`
    }

    return `I'm experiencing some technical difficulties with the Pro assistant. Please try again or contact support if the issue persists.`
  }

  /**
   * Test connection to Pro API
   */
  async testConnection() {
    try {
      const result = await this.makeRequest('/api/v1/test-connection', {
        method: 'GET',
      })

      console.log('✅ Pro API connection test successful')
      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      console.error('❌ Pro API connection test failed:', error.message)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Get Pro API status
   */
  async getProStatus() {
    try {
      const result = await this.makeRequest('/status', {
        method: 'GET',
      })

      return {
        success: true,
        status: result.data,
      }
    } catch (error) {
      console.error('❌ Pro API status check failed:', error.message)
      return {
        success: false,
        error: error.message,
        status: { server_status: 'unavailable' },
      }
    }
  }
}

export default ProChatbotService
