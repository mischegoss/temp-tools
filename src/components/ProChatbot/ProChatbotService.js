// src/components/ProChatbot/ProChatbotService.js
// Pro chatbot service with actual API implementation

import BaseChatbotService from '../SharedChatbot/services/baseChatbotService'
import PRO_CHATBOT_CONFIG from './proConfig'

class ProChatbotService extends BaseChatbotService {
  constructor() {
    super(PRO_CHATBOT_CONFIG)
    this.productName = 'Pro'
    this.selectedVersion = null
    this.versionDetected = false

    console.log('🚀 ProChatbotService initialized with API:', this.apiBaseUrl)
  }

  /**
   * Detect Pro version from current URL
   * Pro uses patterns like /pro/8.0/ or /pro/8-0/
   */
  detectVersion() {
    if (typeof window === 'undefined') {
      return this.config.defaultVersion
    }

    const pathname = window.location.pathname
    const match = pathname.match(this.config.versionDetectionPattern)

    if (match) {
      const rawVersion = match[1]

      // Use version mapping to normalize (e.g., "8.0" -> "8-0")
      const normalizedVersion = this.config.versionMappings[rawVersion]
      if (normalizedVersion) {
        console.log(
          `📋 Pro version detected: ${rawVersion} -> ${normalizedVersion}`,
        )
        return normalizedVersion
      }

      // Fallback: convert dots to hyphens
      const fallbackVersion = rawVersion.replace(/\./g, '-')
      console.log(
        `📋 Pro version fallback: ${rawVersion} -> ${fallbackVersion}`,
      )
      return fallbackVersion
    }

    console.log(`📋 Pro version defaulted to: ${this.config.defaultVersion}`)
    return this.config.defaultVersion
  }

  /**
   * Get effective version (manual selection takes priority over detection)
   */
  getEffectiveVersion() {
    return this.selectedVersion || this.detectVersion()
  }

  /**
   * Get version info for UI display
   */
  getVersionInfo() {
    const detected = this.detectVersion()
    const effective = this.getEffectiveVersion()
    const isManuallySelected = this.selectedVersion !== null

    return {
      detected: {
        version: detected,
        label: detected.replace('-', '.'),
      },
      effective: {
        version: effective,
        label: effective.replace('-', '.'),
      },
      isManuallySelected,
    }
  }

  /**
   * Set manually selected version
   */
  setSelectedVersion(version) {
    this.selectedVersion = version
    console.log(`📌 Pro version manually set to: ${version}`)
  }

  /**
   * Build context object for API request
   */
  buildContext() {
    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : '/pro'
    const currentVersion = this.getEffectiveVersion()
    const versionLabel = currentVersion.replace('-', '.')

    // Determine documentation type from path
    let documentationType = 'general'
    if (currentPath.includes('workflow')) {
      documentationType = 'workflow'
    } else if (currentPath.includes('activity')) {
      documentationType = 'activity'
    } else if (currentPath.includes('configuration')) {
      documentationType = 'configuration'
    } else if (currentPath.includes('getting-started')) {
      documentationType = 'tutorial'
    }

    return {
      page: currentPath,
      product_full_name: 'Resolve Pro',
      documentation_type: documentationType,
      is_latest_version: currentVersion === this.config.defaultVersion,
    }
  }

  /**
   * Enhanced sendMessage with Pro-specific context
   */
  async sendMessage(message, conversationHistory = []) {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string')
    }

    try {
      console.log(`💬 Sending Pro message: "${message.substring(0, 50)}..."`)

      // Ensure server is awake
      await this.ensureServerAwake()

      const currentVersion = this.getEffectiveVersion()
      const context = this.buildContext()

      // Build request payload matching Pro API format
      const requestBody = {
        message: message.trim(),
        product: 'pro',
        version: currentVersion,
        context: context,
        conversation_history: conversationHistory.map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.text,
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
        })),
      }

      console.log('📤 Pro API request:', {
        endpoint: this.endpoints.chat,
        version: currentVersion,
        context: context,
        messageLength: message.length,
        historyLength: conversationHistory.length,
      })

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.chat, {
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      })

      const responseData = result.data
      const responseMessage = responseData.message

      if (!responseMessage) {
        throw new Error(
          'Invalid response format from Pro API - no message found',
        )
      }

      console.log(`✅ Pro API response received:`, {
        processingTime: responseData.processing_time,
        modelUsed: responseData.model_used,
        versionContext: responseData.version_context,
        contextUsed: responseData.context_used?.length || 0,
      })

      return {
        success: true,
        message: responseMessage,
        metadata: {
          processingTime: responseData.processing_time || null,
          sources: responseData.context_used || [],
          modelUsed: responseData.model_used || 'unknown',
          versionContext: responseData.version_context || null,
          conversationId: responseData.conversation_id || null,
          enhancedFeaturesUsed: responseData.enhanced_features_used || false,
          relationshipChunks: responseData.relationship_enhanced_chunks || 0,
        },
      }
    } catch (error) {
      console.error('❌ Pro send message failed:', error.message)
      return {
        success: false,
        error: error.message,
        message: this.getErrorFallbackMessage(error),
      }
    }
  }

  /**
   * Enhanced search with Pro-specific parameters
   */
  async searchDocumentation(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string')
    }

    try {
      console.log(`🔍 Searching Pro docs: "${query.substring(0, 50)}..."`)

      await this.ensureServerAwake()

      const currentVersion = this.getEffectiveVersion()
      const context = this.buildContext()

      const requestBody = {
        query: query.trim(),
        product: 'pro',
        version: currentVersion,
        context: context,
        max_results: this.config.apiSettings.maxResults,
        similarity_threshold: this.config.apiSettings.similarityThreshold,
      }

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.search, {
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      })

      console.log(`✅ Pro search completed`)
      return {
        success: true,
        results: result.data.results || [],
        metadata: {
          totalResults: result.data.total_results || 0,
          searchTime: result.data.search_time_ms || null,
          versionContext: result.data.version_context || null,
        },
      }
    } catch (error) {
      console.error('❌ Pro search failed:', error.message)
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
      return `I'm having trouble connecting to the Pro AI service. Please try again in a moment.`
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return `The Pro AI service is starting up. Please try again in a few moments.`
    }

    if (errorMessage.includes('version') || errorMessage.includes('context')) {
      return `I'm having trouble with version detection. You can manually select your Pro version if needed.`
    }

    return `I'm experiencing some technical difficulties with Pro documentation. Please try again or contact Pro support if the issue persists.`
  }

  /**
   * Test connection to Pro API
   */
  async testConnection() {
    try {
      console.log('🔧 Testing Pro API connection...')

      const result = await this.makeRequest(this.endpoints.testConnection, {
        method: 'GET',
      })

      console.log('✅ Pro API connection test successful')
      return {
        success: true,
        status: result.data,
      }
    } catch (error) {
      console.error('❌ Pro API connection test failed:', error.message)
      return {
        success: false,
        error: error.message,
        status: { server_status: 'unavailable' },
      }
    }
  }
}

export default ProChatbotService
