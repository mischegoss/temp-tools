import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useChatbot } from '../../hooks/useChatbot'

const DocusaurusChatbot = ({ isOpen = false, onClose }) => {
  // Use the custom hook for all chat logic
  const {
    // State
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isTyping,
    isExpanded,
    serverStatus,
    wakeUpProgress,

    // Refs
    messagesEndRef,
    inputRef,

    // Actions
    sendMessage,
    retryMessage,
    toggleExpanded,
    generateChatSummary,
    handleKeyPress,
    focusInput,

    // Computed
    canSendMessage,
  } = useChatbot()

  // Toast notifications (keeping this in component since it's UI-specific)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      focusInput()
    }
  }, [isOpen, focusInput])

  const handleClose = () => {
    console.log('Close button clicked')
    if (onClose) {
      onClose()
    }
  }

  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message)
    setShowToast(true)

    setTimeout(
      () => {
        setShowToast(false)
        setToastMessage('')
      },
      type === 'error' ? 5000 : 3000,
    )
  }

  const handleSupportClick = async () => {
    const summary = generateChatSummary()

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = summary
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      showToastNotification(
        'Chat summary copied to clipboard! Opening support portal...',
        'success',
      )

      setTimeout(() => {
        window.open('https://support.resolve.io', '_blank')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      showToastNotification('Opening support portal...', 'info')
      setTimeout(() => {
        window.open('https://support.resolve.io', '_blank')
      }, 2000)
    }
  }

  // Dynamic sizing based on expanded state
  const getWindowSize = () => {
    if (isExpanded) {
      return {
        width: '600px',
        height: '700px',
      }
    }
    return {
      width: '380px',
      height: '550px',
    }
  }

  // CSS styles with dynamic sizing
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      pointerEvents: isOpen ? 'auto' : 'none',
    },
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 10000,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    },
    chatWindow: {
      ...getWindowSize(),
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      transform: isOpen
        ? 'scale(1) translateY(0)'
        : 'scale(0.8) translateY(20px)',
      opacity: isOpen ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      overflow: 'hidden',
      border: '1px solid #e1e5e9',
      pointerEvents: 'auto',
      backgroundColor: 'white',
    },
    header: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      margin: 0,
      fontWeight: 600,
      fontSize: '18px',
    },
    headerSubtitle: {
      margin: '5px 0 0 0',
      opacity: 0.9,
      fontSize: '14px',
    },
    headerButtons: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      gap: '8px',
    },
    headerButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '50%',
      transition: 'background 0.2s',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    serverStatus: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '12px',
      opacity: 0.8,
    },
    messagesContainer: {
      height: isExpanded ? '420px' : '280px',
      overflowY: 'auto',
      padding: '20px',
      background: '#f8f9fa',
    },
    message: {
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '18px',
      fontSize: '14px',
      lineHeight: 1.4,
      position: 'relative',
    },
    botMessage: {
      background: 'white',
      color: '#2e3440',
      borderBottomLeftRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginRight: 'auto',
    },
    userMessage: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      borderBottomRightRadius: '4px',
      marginLeft: 'auto',
    },
    errorMessage: {
      background: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
      borderBottomLeftRadius: '4px',
      marginRight: 'auto',
    },
    messageStatus: {
      fontSize: '10px',
      opacity: 0.6,
      position: 'absolute',
      bottom: '-15px',
      right: '8px',
    },
    retryButton: {
      background: 'none',
      border: 'none',
      color: '#dc3545',
      fontSize: '10px',
      cursor: 'pointer',
      position: 'absolute',
      bottom: '-15px',
      right: '8px',
      textDecoration: 'underline',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      padding: '12px 16px',
      borderRadius: '18px',
      borderBottomLeftRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginRight: 'auto',
      marginBottom: '15px',
    },
    typingDots: {
      display: 'flex',
      gap: '4px',
    },
    typingDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#17a2b8',
      animation: 'typing 1.4s infinite',
    },
    wakeUpStatus: {
      textAlign: 'center',
      padding: '20px',
      color: '#6c757d',
      fontSize: '14px',
      background: '#f8f9fa',
    },
    inputContainer: {
      padding: '20px',
      background: 'white',
      borderTop: '1px solid #e1e5e9',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    messageInput: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #e1e5e9',
      borderRadius: '25px',
      outline: 'none',
      fontSize: '14px',
      transition: 'border-color 0.2s',
      resize: 'none',
      maxHeight: '100px',
    },
    sendButton: {
      width: '40px',
      height: '40px',
      background:
        canSendMessage && serverStatus !== 'waking'
          ? 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)'
          : '#6c757d',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor:
        canSendMessage && serverStatus !== 'waking' ? 'pointer' : 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
      fontSize: '16px',
    },
    supportFooter: {
      padding: '15px 20px',
      background: 'white',
      borderTop: '1px solid #e1e5e9',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    },
    supportButton: {
      width: '100%',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: showToast
        ? toastMessage.includes('error') || toastMessage.includes('failed')
          ? '#dc3545'
          : '#28a745'
        : '#28a745',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10001,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      transform: showToast ? 'translateY(0)' : 'translateY(-100px)',
      opacity: showToast ? 1 : 0,
      transition: 'all 0.3s ease',
      maxWidth: '400px',
    },
  }

  // Enhanced CSS with animations
  const cssString = `
    .chatbot-header-button:hover {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    .chatbot-send-button:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .chatbot-support-button:hover {
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
      transform: translateY(-1px);
    }
    
    .chatbot-message-input:focus {
      border-color: #17a2b8;
    }
    
    .chatbot-messages::-webkit-scrollbar {
      width: 4px;
    }
    
    .chatbot-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb {
      background: #c1c7d0;
      border-radius: 2px;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb:hover {
      background: #a8b2c1;
    }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
    
    .chatbot-typing-dot:nth-child(1) { animation-delay: 0ms; }
    .chatbot-typing-dot:nth-child(2) { animation-delay: 200ms; }
    .chatbot-typing-dot:nth-child(3) { animation-delay: 400ms; }
    
    @media (max-width: 420px) {
      .chatbot-window {
        width: calc(100vw - 40px) !important;
        right: 20px !important;
        left: 20px !important;
      }
    }
    
    @media (max-width: 680px) {
      .chatbot-window {
        width: calc(100vw - 40px) !important;
        height: ${isExpanded ? '80vh' : '70vh'} !important;
      }
    }
  `

  const renderServerStatusIndicator = () => {
    const statusIcons = {
      ready: '🟢',
      sleeping: '😴',
      waking: '⏳',
      error: '🔴',
      unknown: '❓',
    }

    return (
      <div style={styles.serverStatus}>
        {statusIcons[serverStatus]} {wakeUpProgress || serverStatus}
      </div>
    )
  }

  const renderTypingIndicator = () => {
    if (!isTyping) return null

    return (
      <div style={styles.typingIndicator}>
        <div style={styles.typingDots}>
          <div
            style={{ ...styles.typingDot, animationDelay: '0ms' }}
            className='chatbot-typing-dot'
          ></div>
          <div
            style={{ ...styles.typingDot, animationDelay: '200ms' }}
            className='chatbot-typing-dot'
          ></div>
          <div
            style={{ ...styles.typingDot, animationDelay: '400ms' }}
            className='chatbot-typing-dot'
          ></div>
        </div>
        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6c757d' }}>
          RANI is typing...
        </span>
      </div>
    )
  }

  const renderMessage = message => {
    const isBot = message.sender === 'bot'
    const isError = message.isError || false

    let messageStyle = { ...styles.messageBubble }
    if (isBot && isError) {
      messageStyle = { ...messageStyle, ...styles.errorMessage }
    } else if (isBot) {
      messageStyle = { ...messageStyle, ...styles.botMessage }
    } else {
      messageStyle = { ...messageStyle, ...styles.userMessage }
    }

    return (
      <div key={message.id} style={styles.message}>
        <div style={messageStyle}>
          {message.text}

          {/* Message status */}
          {message.status && message.sender === 'user' && (
            <div style={styles.messageStatus}>
              {message.status === 'sending' && '📤'}
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'failed' && (
                <button
                  style={styles.retryButton}
                  onClick={() => retryMessage(message.id)}
                  title='Retry message'
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  console.log(
    '🚀 DocusaurusChatbot rendering, isOpen:',
    isOpen,
    'serverStatus:',
    serverStatus,
  )

  const getPortalTarget = () => {
    let portalTarget = document.getElementById('chatbot-portal')
    if (!portalTarget) {
      portalTarget = document.createElement('div')
      portalTarget.id = 'chatbot-portal'
      portalTarget.style.position = 'fixed'
      portalTarget.style.top = '0'
      portalTarget.style.left = '0'
      portalTarget.style.right = '0'
      portalTarget.style.bottom = '0'
      portalTarget.style.pointerEvents = 'none'
      portalTarget.style.zIndex = '9999'
      document.body.appendChild(portalTarget)
    }
    return portalTarget
  }

  const widgetContent = (
    <>
      <style>{cssString}</style>

      {/* Toast Notification */}
      {showToast && (
        <div style={styles.toast}>
          {toastMessage.includes('error') || toastMessage.includes('failed')
            ? '❌'
            : '✅'}{' '}
          {toastMessage}
        </div>
      )}

      <div
        style={{ ...styles.overlay, pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div style={styles.container}>
          <div style={styles.chatWindow} className='chatbot-window'>
            {/* Enhanced Header */}
            <div style={styles.header}>
              {renderServerStatusIndicator()}
              <div style={styles.headerContent}>
                <h3 style={styles.headerTitle}>
                  Ask RANI about Resolve Actions
                </h3>
                <p style={styles.headerSubtitle}>How can I help you today?</p>
              </div>
              <div style={styles.headerButtons}>
                <button
                  style={styles.headerButton}
                  className='chatbot-header-button'
                  onClick={toggleExpanded}
                  aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
                  title={isExpanded ? 'Collapse chat' : 'Expand chat'}
                >
                  {isExpanded ? '⤡' : '⤢'}
                </button>
                <button
                  style={styles.headerButton}
                  className='chatbot-header-button'
                  onClick={handleClose}
                  aria-label='Close chat'
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={styles.messagesContainer} className='chatbot-messages'>
              {serverStatus === 'waking' && wakeUpProgress && (
                <div style={styles.wakeUpStatus}>
                  <div>🚀 Starting AI Assistant...</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    {wakeUpProgress}
                  </div>
                </div>
              )}

              {messages.map(renderMessage)}
              {renderTypingIndicator()}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
                disabled={isLoading || isTyping || serverStatus === 'waking'}
              />
              <button
                style={styles.sendButton}
                className='chatbot-send-button'
                onClick={() => sendMessage()}
                disabled={!canSendMessage || serverStatus === 'waking'}
                aria-label='Send message'
              >
                {isLoading || isTyping ? '⏳' : '➤'}
              </button>
            </div>

            {/* Support Footer */}
            <div style={styles.supportFooter}>
              <button
                style={styles.supportButton}
                className='chatbot-support-button'
                onClick={handleSupportClick}
              >
                📝 Copy Chat & Create Support Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (typeof window !== 'undefined') {
    return createPortal(widgetContent, getPortalTarget())
  }

  return widgetContent
}

export default DocusaurusChatbot
