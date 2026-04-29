// src/components/ExpressChatbot/ExpressChatbotManager.js
// Express chatbot manager using shared components

import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { FixedChatbotWidget } from '../SharedChatbot'
import ExpressChatbotService from './ExpressChatbotService'
import EXPRESS_CHATBOT_CONFIG from './expressConfig'

// Create singleton service instance
const expressApiService = new ExpressChatbotService()

const ExpressChatbotManagerComponent = () => {
  // Handle chat state changes for analytics/debugging
  const handleChatStateChange = state => {
    console.log('⚡ Express chatbot state change:', state)

    // You can add analytics tracking here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chatbot_interaction', {
        product: 'express',
        action: state.isOpen ? 'open' : 'close',
      })
    }
  }

  return (
    <FixedChatbotWidget
      productConfig={EXPRESS_CHATBOT_CONFIG}
      apiService={expressApiService}
      onChatStateChange={handleChatStateChange}
    />
  )
}

// Wrap with BrowserOnly for SSR compatibility
const ExpressChatbotManager = () => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <ExpressChatbotManagerComponent />}
    </BrowserOnly>
  )
}

export default ExpressChatbotManager
