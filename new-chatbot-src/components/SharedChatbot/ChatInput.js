// src/components/SharedChatbot/ChatInput.js
// Enhanced ChatInput matching Actions UI with proper styled buttons
// FIXED: Complete rewrite to match Actions appearance exactly

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
      padding: '16px 20px',
      flexShrink: 0,
    },
    inputContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '12px',
    },
    messageInput: {
      flex: 1,
      padding: '12px 16px',
      border: '1.5px solid #e1e5e9',
      borderRadius: '25px',
      outline: 'none',
      fontSize: '14px',
      resize: 'none',
      maxHeight: '100px',
      transition: 'border-color 0.2s, opacity 0.2s',
      fontFamily: 'var(--ifm-font-family-base)',
      borderColor: '#e1e5e9',
    },
    messageInputFocused: {
      borderColor: productConfig?.primaryColor || '#17a2b8',
    },
    messageInputDisabled: {
      opacity: 0.6,
      borderColor: '#dee2e6',
    },
    sendButton: {
      width: '44px',
      height: '44px',
      background: canSendMessage
        ? productConfig?.gradient ||
          'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)'
        : '#6c757d',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: canSendMessage ? 'pointer' : 'not-allowed',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: canSendMessage
        ? `0 2px 8px ${productConfig?.shadowColor || 'rgba(23, 162, 184, 0.3)'}`
        : 'none',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    // NEW: Actions-style footer layout
    footerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    // NEW: Actions-style Support Ticket button
    supportButton: {
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      color: '#495057',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      flex: 1,
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    // NEW: Actions-style Copy Chat button
    copyButton: {
      background: '#e3f2fd',
      border: '1px solid #90caf9',
      color: '#1976d2',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      flex: 1,
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    // NEW: Actions-style status indicator with colored dot
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      color: '#6c757d',
      fontWeight: '500',
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: getStatusColor(),
    },
  }

  // Get status dot color based on server status - matches Actions
  function getStatusColor() {
    if (isThinking || isTyping || isLoading) return '#ffc107' // Yellow for activity
    if (serverStatus === 'ready') return '#28a745' // Green for ready
    if (serverStatus === 'error') return '#dc3545' // Red for error
    if (serverStatus === 'waking') return '#ffc107' // Yellow for connecting
    return '#6c757d' // Gray for unknown
  }

  // Get status text matching Actions behavior
  const getStatusText = () => {
    if (isThinking)
      return `${productConfig?.productName || 'AI'} is thinking...`
    if (isTyping) return `${productConfig?.productName || 'AI'} is typing...`
    if (isLoading) return 'Sending...'
    if (serverStatus === 'waking') return 'Connecting...'
    if (serverStatus === 'error') return 'Connection error'
    return `${productConfig?.productName || 'AI'} is ready`
  }

  // Get input style based on state
  const getInputStyle = () => {
    let style = { ...styles.messageInput }

    if (isLoading || isThinking || isTyping) {
      style = { ...style, ...styles.messageInputDisabled }
    }

    return style
  }

  // Get button content matching Actions
  const getButtonContent = () => {
    if (isLoading || isThinking || isTyping) return '⏳'
    return '➤'
  }

  const cssString = `
    .chat-input-focused {
      border-color: ${productConfig?.primaryColor || '#17a2b8'} !important;
      box-shadow: 0 0 0 1px ${
        productConfig?.primaryColor || '#17a2b8'
      }33 !important;
    }

    .send-button:hover:enabled {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${
        productConfig?.shadowColor || 'rgba(23, 162, 184, 0.4)'
      };
    }

    .send-button:active:enabled {
      transform: translateY(0);
    }

    .support-button:hover {
      background: #e9ecef !important;
      border-color: #adb5bd !important;
    }

    .copy-button:hover {
      background: #bbdefb !important;
      border-color: #64b5f6 !important;
    }

    .message-input::placeholder {
      color: #9ca3af;
    }

    /* Auto-resize textarea */
    .message-input {
      overflow: hidden;
      min-height: 44px;
    }
  `

  const handleInputChange = e => {
    const value = e.target.value
    setInputValue(value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px'
  }

  const handleSendClick = () => {
    if (canSendMessage) {
      sendMessage()
    }
  }

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.inputSection}>
        {/* Input and Send Button Row */}
        <div style={styles.inputContainer}>
          <textarea
            ref={inputRef}
            style={getInputStyle()}
            className='message-input'
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={e => e.target.classList.add('chat-input-focused')}
            onBlur={e => e.target.classList.remove('chat-input-focused')}
            placeholder={
              productConfig?.placeholderText ||
              `Ask about ${productConfig?.productName || 'documentation'}...`
            }
            disabled={isLoading || isThinking || isTyping}
            rows={1}
          />
          <button
            style={styles.sendButton}
            className='send-button'
            onClick={handleSendClick}
            disabled={!canSendMessage}
            title={
              canSendMessage
                ? 'Send message'
                : isThinking
                ? `${productConfig?.productName || 'AI'} is thinking...`
                : isTyping
                ? `${productConfig?.productName || 'AI'} is typing...`
                : 'Send message'
            }
          >
            {getButtonContent()}
          </button>
        </div>

        {/* Actions Footer Row - EXACTLY like Actions chatbot */}
        <div style={styles.footerActions}>
          <button
            style={styles.supportButton}
            className='support-button'
            onClick={handleSupportClick}
            title='Copy chat and open support'
          >
            Support Ticket
          </button>
          <button
            style={styles.copyButton}
            className='copy-button'
            onClick={handleCopyChatClick}
            title='Copy chat summary'
          >
            Copy Chat
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
