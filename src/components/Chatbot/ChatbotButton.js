// src/components/Chatbot/ChatbotButton.js
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import chatbotService from '../../services/chatbotService'

// Remove the global window access from top level - move it inside the component

function ChatbotButtonComponent({
  className = '',
  style = {},
  variant = 'default', // 'default', 'icon-only', 'text-only'
  size = 'medium', // 'small', 'medium', 'large'
  showStatus = true, // Whether to show server status in button
  ...props
}) {
  const [isReady, setIsReady] = useState(true) // Always ready to click
  const [isLoading, setIsLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState('unknown')

  // Initialize global state safely inside useEffect
  useEffect(() => {
    // Global state for widget visibility - initialize safely in browser
    if (!window.globalChatbotState) {
      window.globalChatbotState = {
        isOpen: false,
        setIsOpen: null,
      }
    }
  }, [])

  // Check server status on mount and periodically
  useEffect(() => {
    checkServerStatus()

    // Check server status every 30 seconds if component is mounted
    const interval = setInterval(checkServerStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkServerStatus = async () => {
    try {
      const status = chatbotService.getConnectionStatus()

      if (status.isAwake && status.healthCheckValid) {
        setServerStatus('ready')
      } else {
        setServerStatus('sleeping') // Sleeping, waking, or unknown - all treated the same
      }
    } catch (error) {
      console.error('Failed to check server status:', error)
      setServerStatus('error')
    }
  }

  const handleClick = async () => {
    if (!isReady || isLoading) return

    setIsLoading(true)

    try {
      // Always try to open the chat widget - let the chat component handle server wake-up
      if (window.globalChatbotState?.setIsOpen) {
        window.globalChatbotState.setIsOpen(true)
        console.log('✅ Chat widget opened successfully')
      } else {
        console.log('⏳ Chat widget not ready yet, retrying...')
        // Retry after a short delay
        setTimeout(() => {
          if (window.globalChatbotState?.setIsOpen) {
            window.globalChatbotState.setIsOpen(true)
          }
        }, 500)
      }
    } catch (error) {
      console.error('❌ Error opening chat widget:', error)
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  // Size variants matching the navigation button style
  const sizeStyles = {
    small: {
      padding: '10px 16px',
      fontSize: '13px',
      gap: '6px',
      minWidth: '44px',
    },
    medium: {
      padding: '12px 20px',
      fontSize: '14px',
      gap: '8px',
      minWidth: '56px',
    },
    large: {
      padding: '16px 24px',
      fontSize: '16px',
      gap: '10px',
      minWidth: '68px',
    },
  }

  // Determine if button should be clickable
  const isClickable = isReady && !isLoading

  // Status-based styling - simplified
  const getButtonBackground = () => {
    if (!isClickable) {
      return 'var(--ifm-color-emphasis-300)'
    }
    return 'var(--ifm-color-primary)' // Always use primary color
  }

  // Base button styles
  const baseStyles = {
    background: getButtonBackground(),
    color: 'var(--ifm-color-white)',
    border: 'none',
    borderRadius: '9999px', // Maximum roundness
    cursor: isClickable ? 'pointer' : 'not-allowed',
    opacity: isClickable ? 1 : 0.6,
    transition: 'all 0.3s ease',
    fontFamily: 'var(--ifm-font-family-base)',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    ...sizeStyles[size],
    ...style,
  }

  // Content based on variant - simplified
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          {variant !== 'icon-only' && <span>Loading...</span>}
        </>
      )
    }

    // Always show consistent content
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

  // Render status tooltip/title - simplified
  const getButtonTitle = () => {
    if (isLoading) {
      return 'Loading...'
    }
    return 'Open AI Assistant'
  }

  // Show status indicator - only green or red
  const renderStatusIndicator = () => {
    if (!showStatus || variant === 'icon-only') return null

    // Only show indicator for ready (green) or error (red)
    if (serverStatus !== 'ready' && serverStatus !== 'error') return null

    const statusColor = serverStatus === 'ready' ? '#28a745' : '#dc3545'

    return (
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          border: '1px solid white',
          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          zIndex: 1,
        }}
      />
    )
  }

  return (
    <>
      {/* Simplified CSS - removed pulse and complex hover states */}
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
        disabled={!isClickable}
        className={`chatbot-button ${className}`}
        style={baseStyles}
        title={getButtonTitle()}
        aria-label={getButtonTitle()}
        {...props}
      >
        {renderContent()}
        {renderStatusIndicator()}
      </button>
    </>
  )
}

// Wrap the component with BrowserOnly
export default function ChatbotButton(props) {
  return (
    <BrowserOnly
      fallback={
        <button
          disabled
          className={`chatbot-button ${props.className || ''}`}
          style={{
            background: 'var(--ifm-color-emphasis-300)',
            color: 'var(--ifm-color-white)',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'not-allowed',
            opacity: 0.6,
            padding: '12px 20px',
            fontSize: '14px',
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
