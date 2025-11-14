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

  // Determine if button should be clickable
  const isClickable = isReady && !isLoading

  // Status-based styling - simplified
  const getButtonBackground = () => {
    if (!isClickable) {
      return '#94a3b8'
    }
    return '#0050C7' // Bright blue to match screenshot
  }

  // Base button styles to match screenshot exactly
  const baseStyles = {
    background: getButtonBackground(),
    color: '#ffffff',
    border: 'none',
    borderRadius: '25px', // Rounded corners like in screenshot
    cursor: isClickable ? 'pointer' : 'not-allowed',
    opacity: isClickable ? 1 : 0.6,
    transition: 'all 0.3s ease',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    fontSize: '15px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    width: '100%', // Full width like in screenshot
    padding: '12px 20px', // Good padding to match screenshot
    gap: '8px', // Space between icon and text
    minHeight: '44px', // Good touch target
    ...style,
  }

  // Content based on variant - simplified
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          <span>Loading...</span>
        </>
      )
    }

    // Always show consistent content matching screenshot
    switch (variant) {
      case 'icon-only':
        return <span>💬</span>

      case 'text-only':
        return <span>RANI</span>

      default:
        return (
          <>
            <span style={{ fontSize: '16px' }}>💬</span>
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
            background: #003d99 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 80, 199, 0.3);
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
            background: '#94a3b8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            cursor: 'not-allowed',
            opacity: 0.6,
            padding: '12px 20px',
            fontSize: '15px',
            gap: '8px',
            minHeight: '44px',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            width: '100%',
            ...props.style,
          }}
          title='AI Assistant loading...'
          aria-label='AI Assistant loading...'
        >
          <span style={{ fontSize: '16px' }}>💬</span>
          <span>RANI</span>
        </button>
      }
    >
      {() => <ChatbotButtonComponent {...props} />}
    </BrowserOnly>
  )
}
