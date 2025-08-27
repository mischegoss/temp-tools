// src/components/Chatbot/GlobalChatbotManager.js
import React, { useEffect, useState } from 'react'
import chatbotService from '../../services/chatbotService'

const GlobalChatbotManager = () => {
  const [ChatbotComponent, setChatbotComponent] = useState(null)
  const [shouldRender, setShouldRender] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loadingError, setLoadingError] = useState(null)
  const [connectionInitialized, setConnectionInitialized] = useState(false)

  console.log('🚀 GlobalChatbotManager: Component rendering...')

  // Register the global state function and initialize connection
  useEffect(() => {
    console.log(
      '🚀 GlobalChatbotManager: useEffect for global state registration',
    )

    if (typeof window !== 'undefined') {
      // Initialize global state if it doesn't exist
      if (!window.globalChatbotState) {
        window.globalChatbotState = { isOpen: false, setIsOpen: null }
      }

      window.globalChatbotState.setIsOpen = setIsOpen
      console.log('✅ GlobalChatbotManager: Global state registered')

      // Initialize chatbot service with Cloud Run URL
      initializeChatbotService()
    }

    return () => {
      console.log('🚀 GlobalChatbotManager: Cleanup global state')
      if (typeof window !== 'undefined' && window.globalChatbotState) {
        window.globalChatbotState.setIsOpen = null
      }
    }
  }, [])

  // Initialize chatbot service with configuration
  const initializeChatbotService = async () => {
    try {
      console.log('🔧 Chatbot service initialized with hardcoded Cloud Run URL')

      // Optional: Perform initial health check to wake up Cloud Run instance
      // This is optional - you can remove it if you want on-demand wake-up only
      console.log('💚 Performing initial health check (optional)...')
      setTimeout(async () => {
        try {
          await chatbotService.checkHealth()
          console.log('✅ Initial health check successful')
        } catch (error) {
          console.log(
            'ℹ️ Initial health check failed (expected for cold start):',
            error.message,
          )
        }
      }, 1000) // Delay to avoid blocking page load

      setConnectionInitialized(true)
      console.log('✅ Chatbot service ready with URL:', chatbotService.baseURL)
    } catch (error) {
      console.error('❌ Failed to initialize chatbot service:', error)
      setConnectionInitialized(false)
    }
  }

  // Load the chatbot component
  useEffect(() => {
    console.log('🚀 GlobalChatbotManager: useEffect for component loading')

    // Only render in browser environment
    if (typeof window !== 'undefined') {
      setShouldRender(true)
      console.log('🚀 GlobalChatbotManager: Setting shouldRender to true')

      // Import DocusaurusChatbot dynamically
      import('./DocusaurusChatbot')
        .then(module => {
          console.log('✅ DocusaurusChatbot component loaded successfully')
          setChatbotComponent(() => module.default)
          setLoadingError(null)
        })
        .catch(error => {
          console.error('❌ Failed to load DocusaurusChatbot:', error)
          setLoadingError(error.message)

          // Fallback: Still allow the app to function without chatbot
          // Could show a notification or disable chatbot features
        })
    } else {
      console.log(
        '🚀 GlobalChatbotManager: Window not available, skipping browser setup',
      )
    }
  }, [])

  // Handle connection state changes
  useEffect(() => {
    if (connectionInitialized && ChatbotComponent) {
      console.log('🎯 GlobalChatbotManager: Fully initialized and ready')

      // Optional: Update global state to indicate chatbot is ready
      if (window.globalChatbotState) {
        window.globalChatbotState.isReady = true
      }
    }
  }, [connectionInitialized, ChatbotComponent])

  console.log('🚀 GlobalChatbotManager render state:', {
    shouldRender,
    hasChatbotComponent: !!ChatbotComponent,
    isOpen,
    connectionInitialized,
    loadingError,
    serviceURL: chatbotService.baseURL,
  })

  // Don't render anything if we're not in browser or if there's a critical error
  if (!shouldRender) {
    console.log(
      '🚀 GlobalChatbotManager: Not rendering - shouldRender is false',
    )
    return null
  }

  // Handle component loading error
  if (loadingError) {
    console.error(
      '🚀 GlobalChatbotManager: Component loading error:',
      loadingError,
    )
    // Silently fail - don't break the page
    return null
  }

  // Handle component not loaded yet
  if (!ChatbotComponent) {
    console.log('🚀 GlobalChatbotManager: Component not loaded yet, waiting...')
    // Return null - no loading indicator needed for chatbot
    return null
  }

  // Render the chatbot component
  console.log(
    '🚀 GlobalChatbotManager: Rendering ChatbotComponent with isOpen:',
    isOpen,
  )

  return (
    <React.Fragment>
      {/* Optional: Add a debug indicator in development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            zIndex: 999999,
            pointerEvents: 'none',
          }}
        >
          🤖 API: {connectionInitialized ? '✅' : '⏳'} | Component:{' '}
          {ChatbotComponent ? '✅' : '⏳'}
        </div>
      )}

      <ChatbotComponent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </React.Fragment>
  )
}

export default GlobalChatbotManager
