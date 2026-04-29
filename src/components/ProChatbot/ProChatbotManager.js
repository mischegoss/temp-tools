// src/components/ProChatbot/ProChatbotManager.js
// Pro chatbot manager using shared components with conversational version awareness

import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { FixedChatbotWidget } from '../SharedChatbot'
import ProChatbotService from './ProChatbotService'
import PRO_CHATBOT_CONFIG from './proConfig'

// Create singleton service instance
const proChatbotService = new ProChatbotService()

const ProChatbotManagerComponent = () => {
  const [versionInfo, setVersionInfo] = useState(null)
  const [hasShownVersionMessage, setHasShownVersionMessage] = useState(false)

  useEffect(() => {
    // Initialize version info
    const info = proChatbotService.getVersionInfo()
    setVersionInfo(info)
  }, [])

  // Handle chat state changes for analytics/debugging
  const handleChatStateChange = state => {
    console.log('💼 Pro chatbot state change:', state)

    // You can add analytics tracking here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chatbot_interaction', {
        product: 'pro',
        action: state.isOpen ? 'open' : 'close',
        version: versionInfo?.effective.version || 'unknown',
      })
    }
  }

  // Handle version selection through chat messages
  const handleVersionSelect = version => {
    proChatbotService.setSelectedVersion(version)
    const newVersionInfo = proChatbotService.getVersionInfo()
    setVersionInfo(newVersionInfo)

    console.log('📋 Pro version selected:', {
      version,
      versionInfo: newVersionInfo,
    })

    // Track version selection
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'version_selection', {
        product: 'pro',
        selected_version: version,
        detected_version: newVersionInfo.detected.version,
        is_manual: true,
      })
    }
  }

  // Create initial version detection message if needed
  const getInitialVersionMessage = () => {
    if (!versionInfo || hasShownVersionMessage) return null

    const { detected, effective, isManuallySelected } = versionInfo

    // Don't show message if already using current version by default
    if (
      detected.version === PRO_CHATBOT_CONFIG.defaultVersion &&
      !isManuallySelected
    ) {
      return null
    }

    setHasShownVersionMessage(true)

    const detectedLabel = detected.label || detected.version.replace('-', '.')
    let messageText = `🔍 I see you're viewing Pro ${detectedLabel} documentation.\n\n`
    messageText += `Would you like me to provide answers specific to this version, or would you prefer a different version?\n\n`
    messageText += `Reply with:\n`
    messageText += `• **7.8** for Pro 7.8\n`
    messageText += `• **7.9** for Pro 7.9\n`
    messageText += `• **8.0** for Pro 8.0 (Latest)\n`
    messageText += `• **General** for Pro 8.0 (current version)\n\n`
    messageText += `Or just ask your question and I'll use the detected version.`

    return {
      id: 'version-detection-' + Date.now(),
      text: messageText,
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered',
      metadata: {
        isVersionMessage: true,
        detectedVersion: detected.version,
        availableVersions: PRO_CHATBOT_CONFIG.availableVersions,
      },
    }
  }

  // Enhanced welcome message with version context
  const getWelcomeMessage = () => {
    if (!versionInfo) return PRO_CHATBOT_CONFIG.welcomeMessage

    const { effective, isManuallySelected } = versionInfo

    let message = PRO_CHATBOT_CONFIG.welcomeMessage

    if (isManuallySelected) {
      const effectiveLabel =
        effective.label || effective.version.replace('-', '.')
      message += `\n\n✅ I'll provide answers based on Pro ${effectiveLabel}.`
    }

    return message
  }

  // Enhanced config with version context
  const enhancedConfig = {
    ...PRO_CHATBOT_CONFIG,
    welcomeMessage: getWelcomeMessage(),
    // Add version info to placeholder if manually selected
    placeholderText: versionInfo?.isManuallySelected
      ? `Ask about Pro ${
          versionInfo.effective.label ||
          versionInfo.effective.version.replace('-', '.')
        } workflows, activities, or configurations...`
      : PRO_CHATBOT_CONFIG.placeholderText,
  }

  // Enhanced message processing to handle version selection
  const handleMessageProcessing = (message, conversationHistory) => {
    // Check if message is a version selection
    const versionKeywords = {
      7.8: '7-8',
      7.9: '7-9',
      '8.0': '8-0',
      general: '8-0', // General = current version (8.0) ONLY
      latest: '8-0',
    }

    const messageText = message.toLowerCase().trim()
    const selectedVersion = versionKeywords[messageText]

    if (selectedVersion) {
      handleVersionSelect(selectedVersion)

      const versionLabel =
        messageText === 'general'
          ? 'General (Pro 8.0)'
          : messageText === 'latest'
          ? '8.0'
          : messageText

      // Return a confirmation message instead of calling API
      return Promise.resolve({
        success: true,
        message: `✅ Perfect! I'll now provide answers based on Pro ${versionLabel}. What would you like to know?`,
        metadata: {
          isVersionSelection: true,
          selectedVersion: selectedVersion,
        },
      })
    }

    // Otherwise, proceed with normal API call
    return proChatbotService.sendMessage(message, conversationHistory)
  }

  return (
    <FixedChatbotWidget
      productConfig={enhancedConfig}
      apiService={proChatbotService}
      onChatStateChange={handleChatStateChange}
      initialMessage={getInitialVersionMessage()}
      messageProcessor={handleMessageProcessing}
    />
  )
}

// Wrap with BrowserOnly for SSR compatibility
const ProChatbotManager = () => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <ProChatbotManagerComponent />}
    </BrowserOnly>
  )
}

export default ProChatbotManager
