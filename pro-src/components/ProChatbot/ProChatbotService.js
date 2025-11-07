// src/components/ProChatbot/ProChatbotService.js
// MINIMAL TEST VERSION - to verify the issue

import BaseChatbotService from '../SharedChatbot/services/baseChatbotService'
import PRO_CHATBOT_CONFIG from './proConfig'

class ProChatbotService extends BaseChatbotService {
  constructor() {
    super(PRO_CHATBOT_CONFIG)
    this.productName = 'Pro'
    console.log('🚀 TEST: ProChatbotService constructor called')
  }

  async sendMessage(message, conversationHistory = []) {
    console.log('🚀 TEST: ProChatbotService.sendMessage called')

    // For testing: return a proper error response
    const testError = {
      success: false,
      error: 'TEST: This is a proper error message', // ← This should NOT be undefined
      message: 'Test error message for Pro API',
    }

    console.log('🚀 TEST: Returning test error:', testError)
    return testError
  }

  setSelectedVersion(version) {
    console.log(`📌 Pro version manually set to: ${version}`)
  }

  getVersionInfo() {
    return {
      effective: { version: '8-0', label: '8.0' },
      detected: { version: '8-0', label: '8.0' },
      isManuallySelected: false,
    }
  }

  detectVersion() {
    return '8-0'
  }

  getEffectiveVersion() {
    return '8-0'
  }

  getErrorFallbackMessage(error) {
    return `Test Pro AI error: ${error?.message || 'Unknown error'}`
  }
}

export default ProChatbotService
