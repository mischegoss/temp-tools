// src/components/ProChatbot/ProChatbotService.js
// COMPLETE Pro-specific chatbot service extending the base service
// FIXED: Full implementation with proper error handling

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
  setSelectedVersion(version) {
    this.currentSelectedVersion = version
    console.log(`📌 Pro version manually set to: ${version}`)
  }

  /**
   * Get version info for display
   */
  getVersionInfo() {
    const effectiveVersion = this.getEffectiveVersion()
    const detectedVersion = this.detectVersion()

    return {
      effective: {
        version: effectiveVersion,
        label: effectiveVersion.replace('-', '.'),
      },
      detected: {
        version: detectedVersion,
        label: detectedVersion.replace('-', '.'),
      },
      isManuallySelected: this.currentSelectedVersion !== null,
    }
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
   * COMPLETE Pro sendMessage implementation with comprehensive error handling
   */
  async sendMessage(message, conversationHistory = []) {
    if (!message || typeof message !== 'string') {
      return {
        success: false,
        error: 'Message must be a non-empty string',
        message: 'Please provide a valid message.',
      }
    }

    const effectiveVersion = this.getEffectiveVersion()
    const detectedVersion = this.detectVersion()
    const currentPage =
      typeof window !== 'undefined' ? window.location.pathname : '/'

    // Pro-API specific request format
    const requestBody = {
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
      // Ensure server is awake first
      console.log('🔍 Ensuring Pro server is awake...')
      await this.ensureServerAwake()
      console.log('✅ Pro server is ready')

      console.log('💼 Sending Pro message:', {
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messageLength: message.length,
        effectiveVersion,
        detectedVersion,
        isManuallySelected: this.currentSelectedVersion !== null,
        page: currentPage,
        apiUrl: `${this.apiBaseUrl}${this.endpoints.chat}`,
      })

      // Make the API request with retries
      const result = await this.retryRequest(async () => {
        console.log('📡 Making Pro API request...')
        const response = await this.makeRequest(this.endpoints.chat, {
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
        console.log('📨 Pro API raw response:', {
          success: response?.success,
          hasData: !!response?.data,
          dataKeys: response?.data ? Object.keys(response.data) : [],
        })
        return response
      })

      // Validate the API response structure
      if (!result || !result.success) {
        const errorMsg =
          result?.error || result?.message || 'API request failed'
        console.error('❌ Pro API request unsuccessful:', {
          success: result?.success,
          error: errorMsg,
          status: result?.status,
        })
        throw new Error(`Pro API request failed: ${errorMsg}`)
      }

      if (!result.data) {
        console.error('❌ Pro API returned no data:', result)
        throw new Error('Pro API returned empty response data')
      }

      // Check for the response message in different possible fields
      const responseData = result.data
      const responseMessage =
        responseData.message ||
        responseData.response ||
        responseData.text ||
        responseData.answer

      if (!responseMessage) {
        console.error('❌ Pro API response missing message field:', {
          responseData,
          availableFields: Object.keys(responseData),
        })
        throw new Error('Pro API response missing message content')
      }

      console.log('🤖 Pro AI Response processed successfully:', {
        messageLength: responseMessage.length,
        processingTime: responseData.processing_time,
        contextUsed: responseData.context_used?.length || 0,
        conversationId: responseData.conversation_id,
        modelUsed: responseData.model_used || 'unknown',
      })

      // Return successful response
      return {
        success: true,
        message: responseMessage,
        metadata: {
          responseTime: responseData.processing_time
            ? responseData.processing_time * 1000 // Convert seconds to ms
            : responseData.response_time_ms || null,
          sources: responseData.context_used || responseData.sources || [],
          confidence: responseData.confidence || null,
          modelUsed: responseData.model_used || 'gemini-2.5-flash',
          versionContext: responseData.version_context,
          enhancedFeaturesUsed: responseData.enhanced_features_used || false,
          relationshipEnhancedChunks:
            responseData.relationship_enhanced_chunks || 0,
          conversationId: responseData.conversation_id,
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
      // Comprehensive error handling with detailed logging
      const errorMessage = error?.message || 'Unknown error occurred'
      const errorType = error?.constructor?.name || 'Unknown'

      const errorDetails = {
        errorType,
        errorMessage,
        originalError: error,
        apiUrl: `${this.apiBaseUrl}${this.endpoints.chat}`,
        effectiveVersion,
        currentPage,
        serverStatus: this.isServerAwake ? 'awake' : 'sleeping',
        requestBody: {
          ...requestBody,
          message: requestBody.message.substring(0, 50) + '...', // Truncate for logging
        },
      }

      console.error('❌ Pro chat request failed completely:', errorDetails)

      // Return structured error response
      return {
        success: false,
        error: errorMessage, // This was undefined before!
        message: this.getErrorFallbackMessage(error),
        errorDetails, // Include for debugging (optional)
      }
    }
  }

  /**
   * Enhanced search with Pro version context
   */
  async searchDocumentation(query) {
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        error: 'Query must be a non-empty string',
        results: [],
      }
    }

    try {
      await this.ensureServerAwake()

      const effectiveVersion = this.getEffectiveVersion()

      console.log('🔍 Pro documentation search:', {
        query: query.substring(0, 50) + '...',
        effectiveVersion,
        apiUrl: `${this.apiBaseUrl}${this.endpoints.search}`,
      })

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.search, {
          method: 'POST',
          body: JSON.stringify({
            query: query.trim(),
            version: effectiveVersion,
            max_results: 5,
            similarity_threshold: 0.3,
            content_type_filter: null,
          }),
        })
      })

      if (!result?.success || !result?.data) {
        throw new Error('Search API returned invalid response')
      }

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
      console.error('❌ Pro documentation search failed:', {
        error: error.message,
        query: query.substring(0, 50) + '...',
      })
      return {
        success: false,
        error: error.message,
        results: [],
      }
    }
  }

  /**
   * Pro-specific error messages with context
   */
  getErrorFallbackMessage(error) {
    const errorMessage = (error?.message || '').toLowerCase()

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return `I'm having trouble connecting to the Pro AI system. This might be a temporary network issue. Please check your connection and try again.`
    }

    if (
      errorMessage.includes('server') ||
      errorMessage.includes('startup') ||
      errorMessage.includes('fetch')
    ) {
      return `The Pro AI service appears to be starting up or temporarily unavailable. This usually takes 30-60 seconds. Please try again in a moment.`
    }

    if (errorMessage.includes('version')) {
      return `I encountered an issue with version-specific content for Pro ${this.getEffectiveVersion().replace(
        '-',
        '.',
      )}. Try selecting a different version or contact support.`
    }

    if (errorMessage.includes('cors') || errorMessage.includes('blocked')) {
      return `I'm unable to reach the Pro AI service due to a connectivity issue. Please try refreshing the page or contact support.`
    }

    if (errorMessage.includes('json') || errorMessage.includes('parse')) {
      return `I received an unexpected response from the Pro AI service. The development team has been notified. Please try again.`
    }

    if (errorMessage.includes('401') || errorMessage.includes('403')) {
      return `Authentication issue with the Pro AI service. Please refresh the page or contact support.`
    }

    if (
      errorMessage.includes('500') ||
      errorMessage.includes('502') ||
      errorMessage.includes('503')
    ) {
      return `The Pro AI service is experiencing technical difficulties. Please try again in a few minutes.`
    }

    // Generic fallback with error details for debugging
    return `I'm experiencing technical difficulties with the Pro assistant. Error: "${
      error?.message || 'Unknown error'
    }". Please try again or contact support if the issue persists.`
  }

  /**
   * Test connection to Pro API with detailed diagnostics
   */
  async testConnection() {
    try {
      console.log('🔧 Testing Pro API connection...')

      const result = await this.makeRequest('/api/v1/test-connection', {
        method: 'GET',
      })

      console.log('✅ Pro API connection test successful:', result)
      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      console.error('❌ Pro API connection test failed:', {
        error: error.message,
        apiUrl: this.apiBaseUrl,
      })
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Get Pro API status with enhanced diagnostics
   */
  async getProStatus() {
    try {
      console.log('📊 Checking Pro API status...')

      const result = await this.makeRequest('/status', {
        method: 'GET',
      })

      console.log('✅ Pro API status check successful:', result.data)
      return {
        success: true,
        status: result.data,
      }
    } catch (error) {
      console.error('❌ Pro API status check failed:', {
        error: error.message,
        apiUrl: this.apiBaseUrl,
      })
      return {
        success: false,
        error: error.message,
        status: { server_status: 'unavailable' },
      }
    }
  }

  /**
   * Warm up the Pro API for faster responses
   */
  async warmUpAPI() {
    try {
      console.log('🔥 Warming up Pro API...')
      const warmupResponse = await this.makeRequest('/warmup', {
        method: 'GET',
      })
      console.log('✅ Pro API warmed up successfully')
      return warmupResponse
    } catch (error) {
      console.warn(
        '⚠️ Pro API warmup failed (this is usually okay):',
        error.message,
      )
      // Don't throw error - warmup failure shouldn't block chat
    }
  }

  /**
   * Enhanced ensureServerAwake with comprehensive diagnostics
   */
  async ensureServerAwake(onProgress = null) {
    if (this.isServerAwake && this.isHealthCheckValid()) {
      console.log('✅ Pro server already awake and healthy')
      return true
    }

    try {
      onProgress?.('Checking Pro API availability...')
      console.log('☕ Ensuring Pro server is awake...')

      // Wake up server first
      await this.wakeUpServer(onProgress)

      // Warm up API for faster responses
      onProgress?.('Optimizing Pro API performance...')
      await this.warmUpAPI()

      console.log('✅ Pro server is fully ready')
      return true
    } catch (error) {
      console.error('❌ Failed to ensure Pro server is awake:', error.message)
      onProgress?.('Failed to connect to Pro service')
      throw error
    }
  }
}

export default ProChatbotService
