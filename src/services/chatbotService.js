// src/services/chatbotService.js
// API client for FastAPI chatbot backend integration

class ChatbotService {
  constructor() {
    // Hardcoded Cloud Run URL - simple and direct
    this.baseURL =
      'https://actions-chatbot-api-716168339016.us-central1.run.app'
    this.timeout = 60000 // 60 seconds (Cloud Run cold starts can be slow)
    this.maxRetries = 3
    this.retryDelay = 2000 // Start with 2 seconds for Cloud Run

    // Connection state
    this.isServerAwake = false
    this.isWakingUp = false
    this.lastHealthCheck = null
    this.healthCheckInterval = 5 * 60 * 1000 // 5 minutes

    // Preemptive warmup constants
    this.WARMUP_COOLDOWN = 5 * 60 * 1000 // 5 minutes between warmups
    this.WARMUP_SESSION_KEY = 'chatbot-preemptive-warmup'

    console.log(
      '🤖 ChatbotService initialized with Cloud Run URL:',
      this.baseURL,
    )
  }

  /**
   * Create headers for API requests
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  }

  /**
   * Generic HTTP request with timeout and retry logic - FIXED
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    // FIX: Remove the invalid timeout option from fetch options
    const requestOptions = {
      headers: this.getHeaders(),
      ...options,
      // DO NOT include timeout here - it's not a valid fetch option
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    requestOptions.signal = controller.signal

    try {
      console.log(`📡 API Request: ${options.method || 'GET'} ${url}`)

      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ API Response received')
      return { success: true, data }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('❌ API Request failed:', error.message)

      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Server may be starting up.')
      }

      throw error
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  async retryRequest(requestFn, maxRetries = this.maxRetries) {
    let lastError

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error

        if (attempt === maxRetries) {
          break
        }

        const delay = this.retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} in ${delay}ms`)
        await this.sleep(delay)
      }
    }

    throw lastError
  }

  /**
   * Sleep utility for delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Check if server is healthy and awake
   */
  async checkHealth() {
    try {
      const result = await this.makeRequest('/api/v1/health', {
        method: 'GET',
      })

      this.isServerAwake = true
      this.lastHealthCheck = Date.now()
      console.log('💚 Server is healthy')

      return result.data
    } catch (error) {
      this.isServerAwake = false
      console.log('💔 Server health check failed:', error.message)
      throw error
    }
  }

  /**
   * Preemptive warmup - called by GlobalChatbotManager
   * This method warms up the server silently without user-facing errors
   */
  async preemptiveWarmup() {
    try {
      // Check if we've warmed up recently (session-based cooldown)
      const lastWarmup = sessionStorage.getItem(this.WARMUP_SESSION_KEY)
      const now = Date.now()

      if (lastWarmup && now - parseInt(lastWarmup) < this.WARMUP_COOLDOWN) {
        console.log('⏱️ Preemptive warmup skipped - recently warmed')
        return { success: true, skipped: true }
      }

      console.log('🚀 Starting preemptive chatbot warmup...')

      // Call health endpoint to wake up the service
      const result = await this.checkHealth()

      // Update last warmup time only on success
      sessionStorage.setItem(this.WARMUP_SESSION_KEY, now.toString())
      console.log('✨ Preemptive warmup completed successfully!')

      return {
        success: true,
        skipped: false,
        serverStatus: result,
      }
    } catch (error) {
      // Fail silently for preemptive warmup - don't disrupt user experience
      console.log(
        '⚠️ Preemptive warmup failed (service may be cold starting):',
        error.message,
      )

      // Don't update last warmup time on failure so we'll retry sooner
      return {
        success: false,
        error: error.message,
        skipped: false,
      }
    }
  }

  /**
   * Wake up server with retry logic and progress callback
   */
  async wakeUpServer(onProgress = null) {
    if (this.isWakingUp) {
      throw new Error('Server is already waking up')
    }

    if (this.isServerAwake && this.isHealthCheckValid()) {
      console.log('💚 Server is already awake')
      return true
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
   * Send chat message to AI backend - OPTIMIZED TO MATCH WORKING CURL
   */
  async sendMessage(message, conversationHistory = []) {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string')
    }

    try {
      // Ensure server is awake first
      await this.ensureServerAwake()

      // OPTIMIZED: Match the exact format that works in curl
      const requestBody = {
        message: message.trim(),
        conversation_history: conversationHistory.map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.text,
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
        })),
      }

      console.log('💬 Sending message to AI:', message.substring(0, 50) + '...')

      const result = await this.retryRequest(async () => {
        return await this.makeRequest('/api/v1/chat', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      })

      // Validate response structure
      if (!result.data.response) {
        throw new Error('Invalid response format from server')
      }

      console.log('🤖 AI Response received')
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
      console.error('❌ Failed to send message:', error.message)
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
        return await this.makeRequest('/api/v1/search', {
          method: 'POST',
          body: JSON.stringify({ query: query.trim() }),
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
      console.error('❌ Documentation search failed:', error.message)
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
      const result = await this.makeRequest('/api/v1/status', {
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
      return "I'm having trouble connecting to my AI backend. Let me direct you to our support team for immediate assistance."
    }

    if (errorMessage.includes('server') || errorMessage.includes('startup')) {
      return 'My AI service is starting up. Please try again in a moment, or I can connect you with our support team.'
    }

    return 'I encountered a technical issue. Let me help you connect with our support team for the best assistance.'
  }

  /**
   * Reset connection state (useful for testing or manual reset)
   */
  resetConnection() {
    this.isServerAwake = false
    this.isWakingUp = false
    this.lastHealthCheck = null
    console.log('🔄 Connection state reset')
  }

  /**
   * Get connection status for UI display
   */
  getConnectionStatus() {
    return {
      isAwake: this.isServerAwake,
      isWakingUp: this.isWakingUp,
      lastHealthCheck: this.lastHealthCheck,
      healthCheckValid: this.isHealthCheckValid(),
      serverUrl: this.baseURL,
    }
  }
}

// Create and export singleton instance
const chatbotService = new ChatbotService()

export default chatbotService

// Named exports for specific functions if needed
export {
  ChatbotService, // For testing or multiple instances
}
