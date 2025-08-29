// src/components/Chatbot/ChatInput.js
import React from 'react'

const ChatInput = ({
  inputValue,
  setInputValue,
  inputRef,
  handleKeyPress,
  sendMessage,
  canSendMessage,
  isLoading,
  isTyping,
  serverStatus,
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
      transition: 'border-color 0.2s',
    },
    sendButton: {
      width: '44px',
      height: '44px',
      background: canSendMessage
        ? 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)'
        : '#6c757d',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: canSendMessage ? 'pointer' : 'not-allowed',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: canSendMessage ? '0 2px 8px rgba(23, 162, 184, 0.3)' : 'none',
      transition: 'all 0.2s',
    },
    footerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
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
    },
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
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      color: '#6c757d',
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: getStatusColor(),
    },
  }

  // Get status dot color based on server status
  function getStatusColor() {
    switch (serverStatus) {
      case 'ready':
      case 'connected':
        return '#28a745'
      case 'error':
      case 'unavailable':
        return '#dc3545'
      default:
        return '#ffc107'
    }
  }

  // Get status text
  const getStatusText = () => {
    switch (serverStatus) {
      case 'ready':
      case 'connected':
        return 'Connected'
      case 'error':
      case 'unavailable':
        return 'Unavailable'
      default:
        return 'Connecting...'
    }
  }

  const cssString = `
    .chatbot-send-button:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .chatbot-support-button:hover {
      background: #e9ecef !important;
      transform: translateY(-1px);
    }
    
    .chatbot-copy-button:hover {
      background: #bbdefb !important;
      transform: translateY(-1px);
    }
    
    .chatbot-message-input:focus {
      border-color: #17a2b8 !important;
    }
  `

  const isInputDisabled = isLoading || isTyping || serverStatus === 'waking'

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.inputSection}>
        <div style={styles.inputContainer}>
          <textarea
            ref={inputRef}
            placeholder='Type your message...'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.messageInput}
            className='chatbot-message-input'
            maxLength={2000}
            rows={1}
            disabled={isInputDisabled}
          />
          <button
            style={styles.sendButton}
            className='chatbot-send-button'
            onClick={() => sendMessage()}
            disabled={!canSendMessage || isInputDisabled}
            title='Send message'
          >
            {isLoading || isTyping ? '⏳' : '➤'}
          </button>
        </div>

        <div style={styles.footerActions}>
          <button
            style={styles.supportButton}
            className='chatbot-support-button'
            onClick={handleSupportClick}
            title='Copy chat and open support'
          >
            Support Ticket
          </button>
          <button
            style={styles.copyButton}
            className='chatbot-copy-button'
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
