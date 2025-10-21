// GlobalChatbotManager with route checking and global state setup

import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useLocation } from '@docusaurus/router'

const GlobalChatbotManagerComponent = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [ChatbotComponent, setChatbotComponent] = useState(null)

  // Check if we should show chatbot on current route
  const shouldShowChatbot = location.pathname.startsWith('/actions')

  // Early return if not on /actions pages - this prevents the hook from running!
  if (!shouldShowChatbot) {
    console.log(
      '🚀 GlobalChatbotManager: Not on /actions page, skipping chatbot',
    )
    return null
  }

  // Only load chatbot component when on /actions pages
  useEffect(() => {
    if (shouldShowChatbot) {
      console.log(
        '🚀 GlobalChatbotManager: Loading ChatbotComponent for /actions page',
      )

      // Dynamically import your existing chatbot component
      import('../Chatbot/DocusaurusChatbot')
        .then(module => {
          setChatbotComponent(() => module.default)
        })
        .catch(error => {
          console.error('Failed to load ChatbotComponent:', error)
        })
    }
  }, [shouldShowChatbot])

  // Set up global state for the chatbot button
  useEffect(() => {
    if (shouldShowChatbot) {
      if (!window.globalChatbotState) {
        window.globalChatbotState = {
          isOpen: false,
          setIsOpen: null,
        }
      }

      // Connect our local state to the global state
      window.globalChatbotState.setIsOpen = setIsOpen
      window.globalChatbotState.isOpen = isOpen

      console.log('🚀 GlobalChatbotManager: Global state connected')
    }

    // Cleanup when component unmounts or route changes
    return () => {
      if (window.globalChatbotState) {
        window.globalChatbotState.setIsOpen = null
        console.log('🚀 GlobalChatbotManager: Global state disconnected')
      }
    }
  }, [shouldShowChatbot, isOpen])

  // Keep global state in sync
  useEffect(() => {
    if (window.globalChatbotState) {
      window.globalChatbotState.isOpen = isOpen
    }
  }, [isOpen])

  // Handle component not loaded yet
  if (!ChatbotComponent) {
    console.log('🚀 GlobalChatbotManager: Component not loaded yet, waiting...')
    return null
  }

  // Render the chatbot component
  console.log(
    '🚀 GlobalChatbotManager: Rendering ChatbotComponent with isOpen:',
    isOpen,
  )

  return (
    <React.Fragment>
      <ChatbotComponent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </React.Fragment>
  )
}

// Wrap the component with BrowserOnly
const GlobalChatbotManager = () => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <GlobalChatbotManagerComponent />}
    </BrowserOnly>
  )
}

export default GlobalChatbotManager
