// src/components/Chatbot/GlobalChatbotManager.js
import React, { useEffect, useState } from 'react'

const GlobalChatbotManager = () => {
  const [ChatbotComponent, setChatbotComponent] = useState(null)
  const [shouldRender, setShouldRender] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  console.log('🚀 GlobalChatbotManager: Component rendering...')

  // Register the global state function - simple and direct
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
      console.log(
        '✅ GlobalChatbotManager: Global state registered',
        window.globalChatbotState,
      )
    }

    return () => {
      console.log('🚀 GlobalChatbotManager: Cleanup global state')
      if (typeof window !== 'undefined' && window.globalChatbotState) {
        window.globalChatbotState.setIsOpen = null
        console.log('GlobalChatbotManager: Global state unregistered')
      }
    }
  }, [])

  useEffect(() => {
    console.log('🚀 GlobalChatbotManager: useEffect for component loading')
    // Only render in browser environment
    if (typeof window !== 'undefined') {
      setShouldRender(true)
      console.log('🚀 GlobalChatbotManager: Setting shouldRender to true')

      // Import DocusaurusChatbot dynamically
      import('./DocusaurusChatbot')
        .then(module => {
          console.log('✅ DocusaurusChatbot component loaded')
          setChatbotComponent(() => module.default)
        })
        .catch(error => {
          console.error('❌ Failed to load DocusaurusChatbot:', error)
        })
    } else {
      console.log(
        '🚀 GlobalChatbotManager: Window not available, skipping browser setup',
      )
    }
  }, [])

  console.log('🚀 GlobalChatbotManager render state:', {
    shouldRender,
    hasChatbotComponent: !!ChatbotComponent,
    isOpen,
  })

  if (!shouldRender) {
    console.log(
      '🚀 GlobalChatbotManager: Not rendering - shouldRender is false',
    )
    return <div>Loading chatbot manager...</div> // Temporary visible element for debugging
  }

  if (!ChatbotComponent) {
    console.log(
      '🚀 GlobalChatbotManager: Not rendering - ChatbotComponent not loaded',
    )
    return <div>Loading chatbot component...</div> // Temporary visible element for debugging
  }

  console.log(
    '🚀 GlobalChatbotManager: Rendering ChatbotComponent with isOpen:',
    isOpen,
  )
  return <ChatbotComponent isOpen={isOpen} onClose={() => setIsOpen(false)} />
}

export default GlobalChatbotManager
