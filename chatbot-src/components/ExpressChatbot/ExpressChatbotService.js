// src/components/ExpressChatbot/expressChatbotService.js
// Express-specific chatbot service extending the base service

import BaseChatbotService from '../SharedChatbot/services/baseChatbotService'
import EXPRESS_CHATBOT_CONFIG from './expressConfig'

class ExpressChatbotService extends BaseChatbotService {
  constructor() {
    super(EXPRESS_CHATBOT_CONFIG)
    this.productName = 'Express'
  }

  /**
   * Detect Express version from current URL
   * Express has complex version patterns like "On-Premise%202.5"
   */
  detectVersion() {
    if (typeof window === 'undefined') return this.config.defaultVersion

    const pathname = window.location.pathname
    const match = pathname.match(this.config.versionDetectionPattern)

    if (match) {
      const rawVersion = decodeURIComponent(match[1])

      // Use version mapping to normalize
      const normalizedVersion = this.config.versionMappings[rawVersion]
      if (normalizedVersion) {
        return normalizedVersion
      }

      // Fallback: convert spaces and dots to hyphens
      return rawVersion.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-')
    }

    return this.config.defaultVersion
  }

  /**
   * Enhanced sendMessage with Express-specific context
   */
  async sendMessage(message, conversationHistory = []) {
    const currentVersion = this.detectVersion()
    const currentPage =
      typeof window !== 'undefined' ? window.location.pathname : '/'

    // Add Express-specific context to the request
    const enhancedRequestBody = {
      message: message.trim(),
      conversation_history: conversationHistory.map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text,
        timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
      })),
      product: 'express',
      version: currentVersion,
      context: {
        page: currentPage,
        product_full_name: 'Resolve Express',
        documentation_type: this.detectDocumentationType(currentPage),
        is_on_premise: currentVersion.includes('on-premise'),
      },
    }

    try {
      await this.ensureServerAwake()

      console.log('🚀 Sending Express message:', {
        message: message.substring(0, 50) + '...',
        version: currentVersion,
        page: currentPage,
      })

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.chat, {
          method: 'POST',
          body: JSON.stringify(enhancedRequestBody),
        })
      })

      if (!result.data.response) {
        throw new Error('Invalid response format from Express API')
      }

      console.log('🤖 Express AI Response received')
      return {
        success: true,
        message: result.data.response,
        metadata: {
          responseTime: result.data.response_time_ms || null,
          sources: result.data.sources || [],
          confidence: result.data.confidence || null,
          version: currentVersion,
          product: 'express',
        },
      }
    } catch (error) {
      console.error('❌ Express chat failed:', error.message)
      return {
        success: false,
        error: error.message,
        message: this.getExpressErrorFallbackMessage(error),
      }
    }
  }

  /**
   * Detect documentation type from URL for better Express context
   */
  detectDocumentationType(pathname) {
    const path = pathname.toLowerCase()

    if (path.includes('/list') && path.includes('/activities')) {
      return 'activity_list'
    }
    if (path.includes('/activity') || path.includes('/activities')) {
      return 'activity'
    }
    if (path.includes('/insight') || path.includes('/analytics')) {
      return 'insight'
    }
    if (path.includes('/audit') && path.includes('/trail')) {
      return 'audit_trail'
    }
    if (path.includes('/installation') || path.includes('/upgrade')) {
      return 'installation'
    }
    if (path.includes('/configuration') || path.includes('/config')) {
      return 'configuration'
    }
    if (path.includes('/getting') && path.includes('/started')) {
      return 'getting_started'
    }
    if (path.includes('/troubleshoot') || path.includes('/error')) {
      return 'troubleshooting'
    }

    return 'general'
  }

  /**
   * Express-specific error messages
   */
  getExpressErrorFallbackMessage(error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return "I'm having trouble connecting to the Express documentation system. Please try again or contact Express support for immediate assistance with automation and workflows."
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return 'The Express AI assistant is starting up. Please try your question again in a moment.'
    }

    if (
      errorMessage.includes('version') ||
      errorMessage.includes('not found')
    ) {
      return 'I might not have information for this specific Express version. Please check the version selector or try a more general question about Express automation.'
    }

    return "I'm experiencing some technical difficulties with the Express documentation system. Please try again or contact Express support if you need immediate help with automation or activities."
  }

  /**
   * Express-specific search with version context
   */
  async searchDocumentation(query) {
    const currentVersion = this.detectVersion()

    try {
      await this.ensureServerAwake()

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.search, {
          method: 'POST',
          body: JSON.stringify({
            query: query.trim(),
            product: 'express',
            version: currentVersion,
          }),
        })
      })

      return {
        success: true,
        results: result.data.results || [],
        metadata: {
          totalResults: result.data.total_results || 0,
          searchTime: result.data.search_time_ms || null,
          version: currentVersion,
          product: 'express',
        },
      }
    } catch (error) {
      console.error('❌ Express documentation search failed:', error.message)
      return {
        success: false,
        error: error.message,
        results: [],
      }
    }
  }

  /**
   * Express-specific status check
   */
  async getStatus() {
    try {
      const result = await this.makeRequest(this.endpoints.status, {
        method: 'GET',
      })

      return {
        success: true,
        status: {
          ...result.data,
          product: 'express',
          version: this.detectVersion(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: {
          server_status: 'unavailable',
          product: 'express',
        },
      }
    }
  }

  /**
   * Express-specific method to get activity information
   */
  async getActivityInfo(activityName) {
    try {
      const searchResult = await this.searchDocumentation(
        `${activityName} activity`,
      )

      if (searchResult.success && searchResult.results.length > 0) {
        return {
          success: true,
          activity: searchResult.results[0],
          metadata: searchResult.metadata,
        }
      }

      return {
        success: false,
        error: `Activity "${activityName}" not found`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

export default ExpressChatbotService
