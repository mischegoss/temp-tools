// src/components/ProChatbot/ProChatbotService.js
// Pro-specific chatbot service extending the base service with version awareness

import BaseChatbotService from '../SharedChatbot/services/baseChatbotService'
import PRO_CHATBOT_CONFIG from './proConfig'

class ProChatbotService extends BaseChatbotService {
  constructor() {
    super(PRO_CHATBOT_CONFIG)
    this.productName = 'Pro'
    this.currentSelectedVersion = null // User-selected version override
  }

  /**
   * Detect Pro version from current URL
   * Current version (8.0) appears as /pro/ with no version number
   * Older versions appear as /pro/7.9/, /pro/7.8/, etc.
   */
  detectVersion() {
    if (typeof window === 'undefined') return this.config.defaultVersion

    const pathname = window.location.pathname
    const match = pathname.match(this.config.versionDetectionPattern)

    if (match) {
      const rawVersion = match[1]

      // Use version mapping to normalize (7.9 → 7-9)
      const normalizedVersion = this.config.versionMappings[rawVersion]
      if (normalizedVersion) {
        return normalizedVersion
      }

      // Fallback: convert dots to hyphens
      return rawVersion.replace(/\./g, '-')
    }

    // No version in URL = current version (8.0)
    // This handles URLs like /pro/workflows/ vs /pro/7.9/workflows/
    return this.config.defaultVersion
  }

  /**
   * Get the effective version (user-selected or detected)
   */
  getEffectiveVersion() {
    return this.currentSelectedVersion || this.detectVersion()
  }

  /**
   * Set user-selected version override
   */
  setSelectedVersion(version) {
    this.currentSelectedVersion = version
    console.log(`📋 Pro version manually set to: ${version}`)
  }

  /**
   * Clear user-selected version (revert to auto-detection)
   */
  clearSelectedVersion() {
    this.currentSelectedVersion = null
    console.log('🔄 Pro version selection cleared, reverting to auto-detection')
  }

  /**
   * Get version display info for UI
   */
  getVersionInfo() {
    const detectedVersion = this.detectVersion()
    const effectiveVersion = this.getEffectiveVersion()
    const isManuallySelected = this.currentSelectedVersion !== null

    const detectedVersionInfo = this.config.availableVersions.find(
      v => v.value === detectedVersion,
    )
    const effectiveVersionInfo = this.config.availableVersions.find(
      v => v.value === effectiveVersion,
    )

    return {
      detected: {
        version: detectedVersion,
        label: detectedVersionInfo?.label || detectedVersion,
        displayName:
          detectedVersionInfo?.displayName || `Pro ${detectedVersion}`,
      },
      effective: {
        version: effectiveVersion,
        label: effectiveVersionInfo?.label || effectiveVersion,
        displayName:
          effectiveVersionInfo?.displayName || `Pro ${effectiveVersion}`,
      },
      isManuallySelected,
      availableVersions: this.config.availableVersions,
    }
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
   * Enhanced sendMessage with Pro-specific context and version awareness
   */
  async sendMessage(message, conversationHistory = []) {
    const effectiveVersion = this.getEffectiveVersion()
    const detectedVersion = this.detectVersion()
    const currentPage =
      typeof window !== 'undefined' ? window.location.pathname : '/'

    // Add Pro-specific context to the request
    const enhancedRequestBody = {
      message: message.trim(),
      conversation_history: conversationHistory.map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text,
        timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
      })),
      product: 'pro',
      version: effectiveVersion,
      context: {
        page: currentPage,
        product_full_name: 'Resolve Pro',
        documentation_type: this.detectDocumentationType(currentPage),
        detected_version: detectedVersion,
        is_version_manually_selected: this.currentSelectedVersion !== null,
        is_latest_version: effectiveVersion === '8-0',
        available_versions: this.config.availableVersions.map(v => v.value),
        version_display_info: this.getVersionInfo(),
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

      if (!result.data.response) {
        throw new Error('Invalid response format from Pro API')
      }

      console.log('🤖 Pro AI Response received')
      return {
        success: true,
        message: result.data.response,
        metadata: {
          responseTime:
            result.data.response_time_ms ||
            result.data.processing_time * 1000 ||
            null,
          sources: result.data.sources || [],
          confidence: result.data.confidence || null,
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
            product: 'pro',
            version: effectiveVersion,
            context: {
              version_filter:
                effectiveVersion !== 'general' ? effectiveVersion : null,
            },
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
}

export default ProChatbotService
