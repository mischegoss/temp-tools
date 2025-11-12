// src/components/SharedChatbot/ChatInput.js
// Enhanced ChatInput with product-specific styling and compact design
// FIXED: Removed CSS property conflicts

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
      // FIXED: Use only border-color, not mixed with border shorthand
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
      boxShadow: canSendMessage
        ? `0 2px 8px ${productConfig?.shadowColor || 'rgba(23, 162, 184, 0.3)'}`
        : 'none',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '4px',
    },
    statusIndicator: {
      fontSize: '10px',
      color: '#6c757d',
      fontWeight: '500',
    },
    actionButtonsRight: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: {
      background: 'none',
      border: 'none',
      color: productConfig?.primaryColor || '#17a2b8',
      fontSize: '10px',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: '2px 4px',
      borderRadius: '3px',
      transition: 'background 0.2s',
    },
  }

  const getStatusText = () => {
    if (isThinking) return 'AI is thinking...'
    if (isTyping) return 'AI is typing...'
    if (isLoading) return 'Sending...'
    if (serverStatus === 'waking') return 'Starting up...'
    if (serverStatus === 'error') return 'Connection error'
    return `${productConfig?.productName || 'AI'} is ready`
  }

  const getInputStyle = () => {
    let style = { ...styles.messageInput }

    if (isLoading || isThinking || isTyping) {
      style = { ...style, ...styles.messageInputDisabled }
    }

    return style
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

    .action-button:hover {
      background: rgba(23, 162, 184, 0.1);
    }

    .message-input::placeholder {
      color: #9ca3af;
    }

    /* Auto-resize textarea */
    .message-input {
      overflow: hidden;
      min-height: 36px;
    }
  `

  const handleInputChange = e => {
    const value = e.target.value
    setInputValue(value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px'
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
            title={canSendMessage ? 'Send message' : 'Type a message first'}
          >
            {isLoading || isThinking || isTyping ? '⏳' : '➤'}
          </button>
        </div>

        <div style={styles.actionButtons}>
          <div style={styles.statusIndicator}>{getStatusText()}</div>

          <div style={styles.actionButtonsRight}>
            {handleCopyChatClick && (
              <button
                style={styles.actionButton}
                className='action-button'
                onClick={handleCopyChatClick}
                title='Copy conversation'
              >
                📋 Copy Chat
              </button>
            )}
            {handleSupportClick && (
              <button
                style={styles.actionButton}
                className='action-button'
                onClick={handleSupportClick}
                title='Contact support'
              >
                📧 Support
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInput
