// src/components/SharedChatbot/ChatbotButton.js
// Oval "Ask RANI" button for the closed state

import React from 'react'

const ChatbotButton = ({
  productConfig,
  onClick,
  size = 'large',
  isLoading = false,
  serverStatus = 'ready',
  className = '',
  style = {},
  ...props
}) => {
  // Oval button dimensions - proper oval proportions
  const buttonWidth = size === 'large' ? 120 : 100 // Back to original width
  const buttonHeight = size === 'large' ? 48 : 40 // Slightly taller than original (was 45/36)
  const fontSize = size === 'large' ? 13 : 11 // Slightly smaller text for better fit

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'ready':
        return '#28a745'
      case 'loading':
        return '#ffc107'
      case 'error':
        return '#dc3545'
      case 'waking':
        return '#17a2b8'
      default:
        return '#6c757d'
    }
  }

  const getButtonTitle = () => {
    const productName = productConfig?.productName || 'Documentation'
    if (isLoading) return `${productName} Assistant is thinking...`
    if (serverStatus === 'waking') return `Starting ${productName} Assistant...`
    if (serverStatus === 'error') return `${productName} Assistant unavailable`
    return `Ask RANI about ${productName} - AI Documentation Assistant`
  }

  const isClickable = !isLoading && serverStatus !== 'error'

  const baseStyles = {
    position: 'relative',
    width: `${buttonWidth}px`,
    height: `${buttonHeight}px`,
    background: isClickable
      ? productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)'
      : '#6c757d',
    border: 'none',
    borderRadius: `${buttonHeight / 2}px`, // Perfect oval
    color: 'white',
    fontSize: `${fontSize}px`,
    fontWeight: '600',
    cursor: isClickable ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: isClickable
      ? `0 4px 20px ${productConfig?.shadowColor || 'rgba(23, 162, 184, 0.4)'}`
      : 'none',
    transition: 'all 0.3s ease',
    zIndex: 1,
    opacity: isClickable ? 1 : 0.6,
    fontFamily: 'var(--ifm-font-family-base)',
    ...style,
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
          <span>Thinking...</span>
        </>
      )
    }

    switch (serverStatus) {
      case 'waking':
        return (
          <>
            <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
              💤
            </span>
            <span>Starting...</span>
          </>
        )
      case 'error':
        return (
          <>
            <span>⚠️</span>
            <span>Unavailable</span>
          </>
        )
      default:
        return (
          <>
            <span>{productConfig?.icon || '💬'}</span>
            <span>Ask RANI</span>
          </>
        )
    }
  }

  const renderStatusIndicator = () => {
    if (!isClickable) return null

    const statusColor = getStatusColor()
    const shouldPulse = serverStatus === 'ready'

    return (
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          right: '8px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          border: '2px solid white',
          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          zIndex: 2,
          animation: shouldPulse ? 'pulse 2s infinite' : 'none',
        }}
      />
    )
  }

  const handleClick = e => {
    if (!isClickable) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }

  return (
    <>
      {/* CSS animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.7; 
              transform: scale(1.1); 
            }
          }
          
          .chatbot-button-oval:hover:not(:disabled) {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 6px 25px ${
              productConfig?.shadowColor || 'rgba(23, 162, 184, 0.5)'
            } !important;
          }
          
          .chatbot-button-oval:active:not(:disabled) {
            transform: translateY(-1px) scale(1.01);
          }
          
          .chatbot-button-oval:disabled:hover {
            transform: none;
            box-shadow: none;
          }
        `}
      </style>

      <button
        onClick={handleClick}
        disabled={!isClickable}
        className={`chatbot-button-oval ${className}`}
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

export default ChatbotButton
