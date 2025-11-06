// src/components/SharedChatbot/ChatInput.js
// Enhanced ChatInput with product-specific styling and compact design

import React from 'react'

const ChatInput = ({
  productConfig,
  inputValue = '',
  setInputValue = () => {},
  inputRef,
  handleKeyPress,
  sendMessage,
  canSendMessage = false,
  isLoading = false,
  isThinking = false,
  isTyping = false,
  serverStatus = 'ready',
  handleCopyChatClick,
  handleSupportClick,
}) => {
  const styles = {
    inputSection: {
      background: 'white',
      borderTop: '1px solid #e8e8e8',
      padding: '12px 16px',
      flexShrink: 0,
    },
    inputContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      marginBottom: '8px',
    },
    messageInput: {
      flex: 1,
      padding: '10px 14px',
      border: '1.5px solid #e1e5e9',
      borderRadius: '20px',
      outline: 'none',
      fontSize: '13px',
      resize: 'none',
      maxHeight: '80px',
      transition: 'border-color 0.2s, opacity 0.2s',
      fontFamily: 'var(--ifm-font-family-base)',
    },
    sendButton: {
      width: '36px',
      height: '36px',
      background: canSendMessage
        ? productConfig?.gradient ||
          'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)'
        : '#6c757d',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: canSendMessage ? 'pointer' : 'not-allowed',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: canSendMessage ? '0 2px 6px rgba(23, 162, 184, 0.3)' : 'none',
      transition: 'all 0.2s',
    },
    footerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px',
    },
    supportButton: {
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      color: '#495057',
      padding: '6px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500',
      flex: 1,
      transition: 'all 0.2s',
    },
    copyButton: {
      background: '#e3f2fd',
      border: '1px solid #90caf9',
      color: '#1976d2',
      padding: '6px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500',
      flex: 1,
      transition: 'all 0.2s',
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '10px',
      color: '#6c757d',
    },
    statusDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
    },
  }

  // Get status dot color based on server status
  function getStatusColor() {
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

  // Get status text
  function getStatusText() {
    if (isThinking) return 'Thinking...'
    if (isTyping) return 'Typing...'
    if (isLoading) return 'Loading...'

    switch (serverStatus) {
      case 'ready':
        return 'Online'
      case 'waking':
        return 'Starting...'
      case 'error':
        return 'Offline'
      default:
        return 'Connecting...'
    }
  }

  // Get button content based on state
  function getButtonContent() {
    if (isThinking) return '🧠'
    if (isTyping) return '⌨️'
    if (isLoading)
      return <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
    return '→'
  }

  // Handle input focus styles
  const getInputStyles = () => {
    const baseStyles = { ...styles.messageInput }

    if (isThinking || isTyping) {
      baseStyles.opacity = 0.7
      baseStyles.pointerEvents = 'none'
    } else {
      baseStyles.borderColor = inputValue
        ? productConfig?.primaryColor || '#17a2b8'
        : '#e1e5e9'
    }

    return baseStyles
  }

  const cssString = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .chatbot-support-button:hover {
      background: #e9ecef !important;
    }
    
    .chatbot-copy-button:hover {
      background: #bbdefb !important;
    }
    
    .chat-send-button:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .chat-send-button:active:not(:disabled) {
      transform: scale(0.95);
    }
    
    .chat-input:focus {
      border-color: ${productConfig?.primaryColor || '#17a2b8'} !important;
    }
  `

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.inputSection}>
        <div style={styles.inputContainer}>
          <textarea
            ref={inputRef}
            style={getInputStyles()}
            className='chat-input'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isThinking
                ? 'RANI is thinking...'
                : isTyping
                ? 'RANI is typing...'
                : `Ask about ${
                    productConfig?.productName || 'documentation'
                  }...`
            }
            disabled={isThinking || isTyping}
            rows={1}
          />
          <button
            style={styles.sendButton}
            className='chat-send-button'
            onClick={sendMessage}
            disabled={!canSendMessage}
            title={
              isThinking
                ? 'RANI is thinking...'
                : isTyping
                ? 'RANI is typing...'
                : 'Send message'
            }
          >
            {getButtonContent()}
          </button>
        </div>

        <div style={styles.footerActions}>
          <button
            style={styles.supportButton}
            className='chatbot-support-button'
            onClick={handleSupportClick}
            title='Copy chat and open support'
          >
            📧 Support
          </button>
          <button
            style={styles.copyButton}
            className='chatbot-copy-button'
            onClick={handleCopyChatClick}
            title='Copy chat summary'
          >
            📋 Copy Chat
          </button>
          <div style={styles.statusIndicator}>
            <div
              style={{
                ...styles.statusDot,
                background: getStatusColor(),
              }}
            ></div>
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInput
