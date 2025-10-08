// src/components/service-blueprinting/ChatbotButton.jsx
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useLocation } from '@docusaurus/router'

function ChatbotButtonComponent({
  className = '',
  style = {},
  variant = 'default',
  size = 'large',
  ...props
}) {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  // TEMPORARY: Always show for debugging
  const shouldShowChatbot = true // location.pathname.startsWith('/learning/service-blueprinting/modules')

  console.log('🔍 ChatbotButton Debug:')
  console.log('- Current path:', location.pathname)
  console.log('- Should show:', shouldShowChatbot)
  console.log('- Component mounted')

  // Check if chatbot is ready
  useEffect(() => {
    console.log('🔍 useEffect running, shouldShowChatbot:', shouldShowChatbot)

    const checkChatbotReady = () => {
      const originalButton = document.querySelector('button.ainiro')
      const chatContainer = document.querySelector('div.ainiro')

      console.log('🔍 Checking chatbot elements:')
      console.log('- Original button found:', !!originalButton)
      console.log('- Chat container found:', !!chatContainer)

      if (originalButton && chatContainer) {
        console.log('✅ Chatbot is ready!')
        setIsReady(true)
      } else {
        console.log('⏳ Chatbot not ready, checking again in 500ms')
        setTimeout(checkChatbotReady, 500)
      }
    }

    if (shouldShowChatbot) {
      checkChatbotReady()
    }
  }, [shouldShowChatbot])

  const handleClick = async () => {
    console.log('🔍 Button clicked!')
    if (!isReady || isLoading) {
      console.log('❌ Button not ready or loading')
      return
    }

    setIsLoading(true)

    try {
      const originalButton = document.querySelector('button.ainiro')
      if (originalButton) {
        originalButton.click()
        console.log('✅ Chatbot opened successfully')
      } else {
        console.error('❌ Chatbot button not found')
      }
    } catch (error) {
      console.error('❌ Error opening chatbot:', error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const buttonStyles = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: 'none',
    background: isReady ? '#007acc' : '#666',
    color: 'white',
    cursor: isReady ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
    ...style,
  }

  console.log('🔍 Rendering button with shouldShowChatbot:', shouldShowChatbot)

  return (
    <button
      onClick={handleClick}
      disabled={!isReady || isLoading}
      className={className}
      style={buttonStyles}
      title='Open RANI AI Assistant'
    >
      💬
    </button>
  )
}

export default function ChatbotButton(props) {
  console.log('🔍 ChatbotButton wrapper component rendering')

  return (
    <BrowserOnly fallback={<div>Loading chatbot...</div>}>
      {() => {
        console.log('🔍 BrowserOnly callback executing')
        return <ChatbotButtonComponent {...props} />
      }}
    </BrowserOnly>
  )
}
