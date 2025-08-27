// src/components/Chatbot/ChatbotButton.js
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

// Global state for widget visibility - simple and direct
window.globalChatbotState = {
  isOpen: false,
  setIsOpen: null,
}

function ChatbotButtonComponent({
  className = '',
  style = {},
  variant = 'default', // 'default', 'icon-only', 'text-only'
  size = 'medium', // 'small', 'medium', 'large'
  ...props
}) {
  const [isReady, setIsReady] = useState(true) // Always ready for custom widget
  const [isLoading, setIsLoading] = useState(false)

  // Set ready state immediately
  useEffect(() => {
    setIsReady(true)
  }, [])

  const handleClick = async () => {
    if (!isReady || isLoading) return

    setIsLoading(true)

    try {
      // Directly open the custom widget using global state
      if (window.globalChatbotState.setIsOpen) {
        window.globalChatbotState.setIsOpen(true)
        console.log('✅ Custom chatbot widget opened successfully')
      } else {
        console.log('⏳ Custom widget not ready yet')
      }
    } catch (error) {
      console.error('❌ Error opening chatbot widget:', error)
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  // Size variants matching the navigation button style
  const sizeStyles = {
    small: {
      padding: '12px 18px',
      fontSize: '14px',
      gap: '6px',
      minWidth: '44px', // Ensures roundness
    },
    medium: {
      padding: '16px 24px',
      fontSize: '16px',
      gap: '8px',
      minWidth: '56px', // Ensures roundness
    },
    large: {
      padding: '20px 30px',
      fontSize: '18px',
      gap: '10px',
      minWidth: '68px', // Ensures roundness
    },
  }

  // Base button styles using color palette
  const baseStyles = {
    background: isReady
      ? 'var(--ifm-color-primary)'
      : 'var(--color-text-secondary)',
    color: 'var(--color-text-white)',
    border: 'none',
    borderRadius: '9999px', // Maximum roundness
    cursor: isReady ? 'pointer' : 'not-allowed',
    opacity: isReady ? 1 : 0.6,
    transition: 'all 0.3s ease',
    fontFamily: 'var(--ifm-font-family-base)',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...style,
  }

  // Content based on variant
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          {variant !== 'icon-only' && <span>Loading...</span>}
        </>
      )
    }

    switch (variant) {
      case 'icon-only':
        return <span>💬</span>

      case 'text-only':
        return <span>RANI</span>

      default:
        return (
          <>
            <span>💬</span>
            <span>RANI</span>
          </>
        )
    }
  }

  return (
    <>
      {/* Add keyframes for loading animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .chatbot-button:hover:not(:disabled) {
            background: var(--ifm-color-primary-dark) !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--color-shadow-medium);
          }
          .chatbot-button:disabled:hover {
            transform: none;
            box-shadow: none;
          }
        `}
      </style>

      <button
        onClick={handleClick}
        disabled={!isReady || isLoading}
        className={`chatbot-button ${className}`}
        style={baseStyles}
        title={isReady ? 'Open AI Assistant' : 'AI Assistant loading...'}
        aria-label='Open AI Assistant'
        {...props}
      >
        {renderContent()}
      </button>
    </>
  )
}

export default function ChatbotButton(props) {
  return (
    <BrowserOnly
      fallback={
        <button
          disabled
          className={`chatbot-button ${props.className || ''}`}
          style={{
            background: 'var(--color-text-secondary)',
            color: 'var(--color-text-white)',
            border: 'none',
            borderRadius: '9999px', // Maximum roundness
            cursor: 'not-allowed',
            opacity: 0.6,
            padding: '16px 24px',
            fontSize: '16px',
            gap: '8px',
            minWidth: '56px',
            fontFamily: 'var(--ifm-font-family-base)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            ...props.style,
          }}
          title='AI Assistant loading...'
          aria-label='AI Assistant loading...'
        >
          💬 <span>RANI</span>
        </button>
      }
    >
      {() => <ChatbotButtonComponent {...props} />}
    </BrowserOnly>
  )
}
