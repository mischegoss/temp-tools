// src/components/InsightsChatbot/InsightsChatbotManager.js
// Insights chatbot manager using shared components

import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { FixedChatbotWidget } from '../SharedChatbot'
import InsightsChatbotService from './insightsChatbotService'
import INSIGHTS_CHATBOT_CONFIG from './insightsConfig'

// Create singleton service instance
const insightsApiService = new InsightsChatbotService()

const InsightsChatbotManagerComponent = () => {
  // Handle chat state changes for analytics/debugging
  const handleChatStateChange = state => {
    console.log('📊 Insights chatbot state change:', state)

    // You can add analytics tracking here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chatbot_interaction', {
        product: 'insights',
        action: state.isOpen ? 'open' : 'close',
      })
    }
  }

  return (
    <FixedChatbotWidget
      productConfig={INSIGHTS_CHATBOT_CONFIG}
      apiService={insightsApiService}
      onChatStateChange={handleChatStateChange}
    />
  )
}

// Wrap with BrowserOnly for SSR compatibility
const InsightsChatbotManager = () => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <InsightsChatbotManagerComponent />}
    </BrowserOnly>
  )
}

export default InsightsChatbotManager
