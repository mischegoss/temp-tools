// src/components/InsightsChatbot/insightsChatbotService.js
// Insights-specific chatbot service extending the base service

import BaseChatbotService from '../SharedChatbot/services/baseChatbotService'
import INSIGHTS_CHATBOT_CONFIG from './insightsConfig'

class InsightsChatbotService extends BaseChatbotService {
  constructor() {
    super(INSIGHTS_CHATBOT_CONFIG)
    this.productName = 'Insights'
  }

  /**
   * Detect Insights version from current URL
   */
  detectVersion() {
    if (typeof window === 'undefined') return this.config.defaultVersion

    const pathname = window.location.pathname
    const match = pathname.match(this.config.versionDetectionPattern)

    if (match) {
      const rawVersion = match[1]

      // Use version mapping to normalize
      const normalizedVersion = this.config.versionMappings[rawVersion]
      if (normalizedVersion) {
        return normalizedVersion
      }

      // Fallback: convert dots to hyphens
      return rawVersion.replace(/\./g, '-')
    }

    return this.config.defaultVersion
  }

  /**
   * Enhanced sendMessage with Insights-specific context
   */
  async sendMessage(message, conversationHistory = []) {
    const currentVersion = this.detectVersion()
    const currentPage =
      typeof window !== 'undefined' ? window.location.pathname : '/'

    // Add Insights-specific context to the request
    const enhancedRequestBody = {
      message: message.trim(),
      conversation_history: conversationHistory.map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text,
        timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
      })),
      product: 'insights',
      version: currentVersion,
      context: {
        page: currentPage,
        product_full_name: 'Resolve Insights',
        documentation_type: this.detectDocumentationType(currentPage),
        is_latest_version: currentVersion === '11-0',
      },
    }

    try {
      await this.ensureServerAwake()

      console.log('📊 Sending Insights message:', {
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
        throw new Error('Invalid response format from Insights API')
      }

      console.log('🤖 Insights AI Response received')
      return {
        success: true,
        message: result.data.response,
        metadata: {
          responseTime: result.data.response_time_ms || null,
          sources: result.data.sources || [],
          confidence: result.data.confidence || null,
          version: currentVersion,
          product: 'insights',
        },
      }
    } catch (error) {
      console.error('❌ Insights chat failed:', error.message)
      return {
        success: false,
        error: error.message,
        message: this.getInsightsErrorFallbackMessage(error),
      }
    }
  }

  /**
   * Detect documentation type from URL for better Insights context
   */
  detectDocumentationType(pathname) {
    const path = pathname.toLowerCase()

    if (path.includes('/discovery') && path.includes('/dependency')) {
      return 'discovery_mapping'
    }
    if (path.includes('/applications')) {
      return 'applications'
    }
    if (path.includes('/device') && path.includes('/discovery')) {
      return 'device_discovery'
    }
    if (path.includes('/organizations') || path.includes('/sites')) {
      return 'organizations_sites'
    }
    if (path.includes('/event') && path.includes('/clustering')) {
      return 'event_clustering'
    }
    if (path.includes('/administrator') || path.includes('/admin')) {
      return 'administration'
    }
    if (path.includes('/itsm') && path.includes('/configuration')) {
      return 'itsm_configuration'
    }
    if (path.includes('/ldap') && path.includes('/configuration')) {
      return 'ldap_configuration'
    }
    if (path.includes('/cmdb') && path.includes('/integration')) {
      return 'cmdb_integration'
    }
    if (path.includes('/backend') && path.includes('/administration')) {
      return 'backend_administration'
    }
    if (path.includes('/getting') && path.includes('/started')) {
      return 'getting_started'
    }
    if (path.includes('/ui') && path.includes('/overview')) {
      return 'ui_overview'
    }

    return 'general'
  }

  /**
   * Insights-specific error messages
   */
  getInsightsErrorFallbackMessage(error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return "I'm having trouble connecting to the Insights documentation system. Please try again or contact Insights support for immediate assistance with analytics and dependency mapping."
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return 'The Insights AI assistant is starting up. Please try your question again in a moment.'
    }

    if (
      errorMessage.includes('version') ||
      errorMessage.includes('not found')
    ) {
      return 'I might not have information for this specific Insights version. Please check the version selector or try a more general question about Insights analytics.'
    }

    return "I'm experiencing some technical difficulties with the Insights documentation system. Please try again or contact Insights support if you need immediate help with analytics or dependency mapping."
  }

  /**
   * Insights-specific search with version context
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
            product: 'insights',
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
          product: 'insights',
        },
      }
    } catch (error) {
      console.error('❌ Insights documentation search failed:', error.message)
      return {
        success: false,
        error: error.message,
        results: [],
      }
    }
  }

  /**
   * Insights-specific status check
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
          product: 'insights',
          version: this.detectVersion(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: {
          server_status: 'unavailable',
          product: 'insights',
        },
      }
    }
  }

  /**
   * Insights-specific method to get dependency information
   */
  async getDependencyInfo(componentName) {
    try {
      const searchResult = await this.searchDocumentation(
        `${componentName} dependency mapping`,
      )

      if (searchResult.success && searchResult.results.length > 0) {
        return {
          success: true,
          dependency: searchResult.results[0],
          metadata: searchResult.metadata,
        }
      }

      return {
        success: false,
        error: `Dependency information for "${componentName}" not found`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Insights-specific method to get analytics information
   */
  async getAnalyticsInfo(reportType) {
    try {
      const searchResult = await this.searchDocumentation(
        `${reportType} analytics report`,
      )

      if (searchResult.success && searchResult.results.length > 0) {
        return {
          success: true,
          analytics: searchResult.results[0],
          metadata: searchResult.metadata,
        }
      }

      return {
        success: false,
        error: `Analytics information for "${reportType}" not found`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

export default InsightsChatbotService
