// src/components/SharedChatbot/services/baseChatbotService.js
// Base chatbot service for all product chatbots - FIXED for Cloud Run APIs

class BaseChatbotService {
  constructor(config) {
    this.config = config
    this.productName = config.productName
    this.apiBaseUrl = config.apiBaseUrl
    this.endpoints = config.endpoints

    // Server state tracking
    this.isServerAwake = false
    this.lastHealthCheck = null
    this.healthCheckInterval = config.healthCheckInterval || 30000

    // Request settings
    this.requestTimeout = config.requestTimeout || 30000
    this.maxRetries = config.maxRetries || 3

    // Wake up state
    this.isWakingUp = false
  }

  /**
   * Make HTTP request to API with proper error handling
   * FIXED: Handle Cloud Run API response format correctly
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const requestOptions = {
      method: 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout)

    try {
      requestOptions.signal = controller.signal

      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // Parse JSON response
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${parseError.message}`)
      }

      // FIXED: Cloud Run APIs typically return data in this format
      return {
        success: true,
        data: data, // Don't wrap in another data property
        status: response.status,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.requestTimeout}ms`)
      }

      throw error
    }
  }

  /**
   * Retry request with exponential backoff
   */
  async retryRequest(requestFn, maxRetries = null) {
    const retries = maxRetries || this.maxRetries
    let lastError

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error

        if (attempt === retries) {
          break // Don't delay on final attempt
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        console.warn(
          `Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${
            retries + 1
          })`,
        )

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  /**
   * Check server health
   */
  async checkHealth() {
    try {
      const result = await this.makeRequest(this.endpoints.health, {
        method: 'GET',
      })

      this.isServerAwake = true
      this.lastHealthCheck = Date.now()

      console.log(`✅ ${this.productName} API health check passed`)
      return result
    } catch (error) {
      this.isServerAwake = false
      console.warn(
        `⚠️ ${this.productName} API health check failed:`,
        error.message,
      )
      throw error
    }
  }

  /**
   * Wake up Cloud Run server with progress updates
   */
  async wakeUpServer(onProgress = null) {
    if (this.isWakingUp) {
      return // Already waking up
    }

    this.isWakingUp = true

    try {
      onProgress?.('Checking server status...')
      console.log(`☕ Waking up ${this.productName} server...`)

      // Try health check with retries
      await this.retryRequest(async () => {
        onProgress?.('Attempting to connect...')
        return await this.checkHealth()
      }, 5) // More retries for wake-up

      onProgress?.('Server is ready!')
      console.log(`✅ ${this.productName} server successfully woken up`)
      return true
    } catch (error) {
      console.error(
        `❌ Failed to wake up ${this.productName} server:`,
        error.message,
      )
      onProgress?.('Failed to start server')
      throw new Error(`Server startup failed: ${error.message}`)
    } finally {
      this.isWakingUp = false
    }
  }

  /**
   * Check if last health check is still valid
   */
  isHealthCheckValid() {
    if (!this.lastHealthCheck) return false
    return Date.now() - this.lastHealthCheck < this.healthCheckInterval
  }

  /**
   * Ensure server is awake before making requests
   */
  async ensureServerAwake(onProgress = null) {
    if (this.isServerAwake && this.isHealthCheckValid()) {
      return true
    }

    return await this.wakeUpServer(onProgress)
  }

  /**
   * Base sendMessage implementation (to be overridden by product services)
   * FIXED: Standard format for all product APIs
   */
  async sendMessage(message, conversationHistory = []) {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string')
    }

    try {
      // Ensure server is awake first
      await this.ensureServerAwake()

      // Format request body to match backend expectations
      const requestBody = {
        message: message.trim(),
        conversation_history: conversationHistory.map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.text,
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
        })),
      }

      console.log(
        `💬 Sending ${this.productName} message:`,
        message.substring(0, 50) + '...',
      )

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.chat, {
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      })

      // FIXED: Handle different API response formats
      const responseData = result.data

      // Check for message in different possible fields
      const responseMessage =
        responseData.message || responseData.response || responseData.text

      if (!responseMessage) {
        throw new Error(
          'Invalid response format from server - no message found',
        )
      }

      console.log(`🤖 ${this.productName} AI Response received`)
      return {
        success: true,
        message: responseMessage,
        metadata: {
          responseTime:
            responseData.response_time_ms ||
            responseData.processing_time * 1000 ||
            null,
          sources: responseData.sources || responseData.context_used || [],
          confidence: responseData.confidence || null,
          modelUsed: responseData.model_used || responseData.model || 'unknown',
          conversationId: responseData.conversation_id || null,
        },
      }
    } catch (error) {
      console.error(
        `❌ ${this.productName} send message failed:`,
        error.message,
      )
      return {
        success: false,
        error: error.message,
        message: this.getErrorFallbackMessage(error),
      }
    }
  }

  /**
   * Base search implementation
   */
  async searchDocumentation(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string')
    }

    try {
      await this.ensureServerAwake()

      const result = await this.retryRequest(async () => {
        return await this.makeRequest(this.endpoints.search, {
          method: 'POST',
          body: JSON.stringify({
            query: query.trim(),
            max_results: 5,
            similarity_threshold: 0.3,
          }),
        })
      })

      return {
        success: true,
        results: result.data.results || [],
        metadata: {
          totalResults: result.data.total_results || 0,
          searchTime: result.data.search_time_ms || null,
        },
      }
    } catch (error) {
      console.error(`❌ ${this.productName} search failed:`, error.message)
      return {
        success: false,
        error: error.message,
        results: [],
      }
    }
  }

  /**
   * Get status of the API service
   */
  async getStatus() {
    try {
      const result = await this.makeRequest(this.endpoints.status, {
        method: 'GET',
      })

      return {
        success: true,
        status: result.data,
      }
    } catch (error) {
      console.error(
        `❌ ${this.productName} status check failed:`,
        error.message,
      )
      return {
        success: false,
        error: error.message,
        status: { server_status: 'unavailable' },
      }
    }
  }

  /**
   * Generic error fallback message (to be overridden by product services)
   */
  getErrorFallbackMessage(error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return `I'm having trouble connecting to the ${this.productName} AI service. Please try again in a moment.`
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return `The ${this.productName} AI service is starting up. Please try again in a few moments.`
    }

    return `I'm experiencing some technical difficulties. Please try again or contact support if the issue persists.`
  }
}

export default BaseChatbotService
