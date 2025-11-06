// src/components/SharedChatbot/services/baseChatbotService.js
// Base service class for chatbot API communication - shared across all products

class BaseChatbotService {
  constructor(config) {
    this.config = config
    this.apiBaseUrl = config.apiBaseUrl
    this.productName = config.productName
    this.endpoints = config.endpoints

    // Health check state
    this.isServerAwake = false
    this.lastHealthCheck = null
    this.healthCheckInterval = 30000 // 30 seconds
    this.isWakingUp = false

    // Request configuration
    this.requestTimeout = 30000 // 30 seconds
    this.maxRetries = 3
    this.retryDelay = 1000 // 1 second
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: this.requestTimeout,
      ...options,
    }

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data, status: response.status }
    } catch (error) {
      console.error(`❌ Request failed to ${url}:`, error.message)
      throw error
    }
  }

  /**
   * Retry request with exponential backoff
   */
  async retryRequest(requestFn, maxRetries = this.maxRetries) {
    let lastError

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error

        if (attempt === maxRetries) {
          throw error
        }

        const delay = this.retryDelay * Math.pow(2, attempt - 1)
        console.log(
          `🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`,
        )
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  /**
   * Health check endpoint
   */
  async checkHealth() {
    try {
      const result = await this.makeRequest(
        this.endpoints.health || '/health',
        {
          method: 'GET',
        },
      )

      this.isServerAwake = true
      this.lastHealthCheck = Date.now()

      return {
        success: true,
        status: result.data,
      }
    } catch (error) {
      this.isServerAwake = false
      return {
        success: false,
        error: error.message,
        status: { server_status: 'unavailable' },
      }
    }
  }

  /**
   * Wake up server (for Cloud Run cold starts)
   */
  async wakeUpServer(onProgress = null) {
    if (this.isWakingUp) {
      return false
    }

    this.isWakingUp = true

    try {
      onProgress?.('Checking server status...')
      console.log('☕ Waking up server...')

      // Try health check with retries
      await this.retryRequest(async () => {
        onProgress?.('Attempting to connect...')
        return await this.checkHealth()
      }, 5) // More retries for wake-up

      onProgress?.('Server is ready!')
      console.log('✅ Server successfully woken up')
      return true
    } catch (error) {
      console.error('❌ Failed to wake up server:', error.message)
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
   * Send chat message to AI backend
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
        product: this.productName.toLowerCase(),
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

      // Validate response structure
      if (!result.data.response) {
        throw new Error('Invalid response format from server')
      }

      console.log(`🤖 ${this.productName} AI Response received`)
      return {
        success: true,
        message: result.data.response,
        metadata: {
          responseTime: result.data.response_time_ms || null,
          sources: result.data.sources || [],
          confidence: result.data.confidence || null,
        },
      }
    } catch (error) {
      console.error(`❌ ${this.productName} chat failed:`, error.message)
      return {
        success: false,
        error: error.message,
        message: this.getErrorFallbackMessage(error),
      }
    }
  }

  /**
   * Search documentation directly
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
            product: this.productName.toLowerCase(),
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
      console.error(
        `❌ ${this.productName} documentation search failed:`,
        error.message,
      )
      return {
        success: false,
        error: error.message,
        results: [],
      }
    }
  }

  /**
   * Get server status information
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
      return {
        success: false,
        error: error.message,
        status: { server_status: 'unavailable' },
      }
    }
  }

  /**
   * Get appropriate error fallback message
   */
  getErrorFallbackMessage(error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return `I'm having trouble connecting to the ${this.productName} AI backend. Let me direct you to our support team for immediate assistance.`
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return `The ${this.productName} AI service is starting up. Please try again in a few moments.`
    }

    return `I'm experiencing some technical difficulties with the ${this.productName} assistant. Please try again or contact support if the issue persists.`
  }
}

export default BaseChatbotService
