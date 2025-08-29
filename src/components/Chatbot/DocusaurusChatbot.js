import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useChatbot } from '../../hooks/useChatbot'

// Custom link renderer for markdown
const LinkRenderer = ({ href, children }) => {
  if (href && href.startsWith('/')) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        style={{ color: '#17a2b8', textDecoration: 'none' }}
        onMouseOver={e => (e.target.style.textDecoration = 'underline')}
        onMouseOut={e => (e.target.style.textDecoration = 'none')}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      style={{ color: '#17a2b8', textDecoration: 'none' }}
      onMouseOver={e => (e.target.style.textDecoration = 'underline')}
      onMouseOut={e => (e.target.style.textDecoration = 'none')}
    >
      {children}
    </a>
  )
}

// Message chunking function
const chunkMessage = (text, maxLength = 800) => {
  if (text.length <= maxLength) return [text]

  const breakPoints = ['\n\n', '**Sources:**', '\n', '. ', ' ']

  for (const breakPoint of breakPoints) {
    const lastBreak = text.lastIndexOf(breakPoint, maxLength)
    if (lastBreak > maxLength * 0.5) {
      return [
        text.substring(0, lastBreak + breakPoint.length).trim(),
        ...chunkMessage(
          text.substring(lastBreak + breakPoint.length).trim(),
          maxLength,
        ),
      ]
    }
  }

  return [
    text.substring(0, maxLength).trim(),
    ...chunkMessage(text.substring(maxLength).trim(), maxLength),
  ]
}

// Enhanced message component with chunking
const MessageWithChunking = ({ message }) => {
  const [showFullMessage, setShowFullMessage] = useState(false)

  if (message.sender !== 'bot') {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: LinkRenderer }}
      >
        {message.text}
      </ReactMarkdown>
    )
  }

  const chunks = chunkMessage(message.text)

  if (chunks.length === 1 || showFullMessage) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: LinkRenderer,
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: '16px',
                margin: '12px 0 8px 0',
                fontWeight: '600',
                color: '#2e3440',
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: '15px',
                margin: '10px 0 6px 0',
                fontWeight: '600',
                color: '#2e3440',
              }}
            >
              {children}
            </h3>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: '600', color: '#1a1a1a' }}>
              {children}
            </strong>
          ),
          p: ({ children }) => (
            <p style={{ margin: '8px 0', lineHeight: '1.5' }}>{children}</p>
          ),
        }}
      >
        {message.text}
      </ReactMarkdown>
    )
  }

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: LinkRenderer,
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: '16px',
                margin: '12px 0 8px 0',
                fontWeight: '600',
                color: '#2e3440',
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: '15px',
                margin: '10px 0 6px 0',
                fontWeight: '600',
                color: '#2e3440',
              }}
            >
              {children}
            </h3>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: '600', color: '#1a1a1a' }}>
              {children}
            </strong>
          ),
          p: ({ children }) => (
            <p style={{ margin: '8px 0', lineHeight: '1.5' }}>{children}</p>
          ),
        }}
      >
        {chunks[0]}
      </ReactMarkdown>

      <div style={{ marginTop: '12px' }}>
        <button
          onClick={() => setShowFullMessage(true)}
          style={{
            background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Would you like more info?
        </button>
      </div>
    </div>
  )
}

const DocusaurusChatbotComponent = ({ isOpen = false, onClose }) => {
  // Use the custom hook for all chat logic
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isTyping,
    isExpanded,
    serverStatus,
    wakeUpProgress,
    messagesEndRef,
    inputRef,
    sendMessage,
    retryMessage,
    clearConversation,
    toggleExpanded,
    generateChatSummary,
    handleKeyPress,
    focusInput,
    canSendMessage,
  } = useChatbot()

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      focusInput()
    }
  }, [isOpen, focusInput])

  const handleClose = () => {
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

  // Handle clear conversation - fallback if not in hook
  const handleClearChat = () => {
    if (clearConversation) {
      clearConversation()
    } else {
      console.log('Clear conversation not available from hook')
    }
  }

  // Generate clean chat summary for personal use
  const generateCleanChatSummary = () => {
    let summary = `Chat Summary - ${new Date().toLocaleDateString()}\n`
    summary += `========================\n\n`

    messages.forEach(message => {
      if (message.id === 1) return // Skip initial greeting
      const sender = message.sender === 'bot' ? 'RANI' : 'You'
      summary += `${sender}: ${message.text}\n\n`
    })

    return summary
  }

  const handleCopyChatClick = async () => {
    const summary = generateCleanChatSummary()

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

      showToastNotification('Chat summary copied to clipboard!', 'success')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      showToastNotification('Failed to copy chat summary', 'error')
    }
  }

  const handleSupportClick = async () => {
    const summary = generateChatSummary() // Support-formatted summary

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
        'Support summary copied! Opening portal...',
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

  // Dynamic sizing - fixed to respect viewport constraints
  const getWindowSize = () => {
    if (typeof window === 'undefined') {
      return isExpanded
        ? { width: '600px', height: '750px' }
        : { width: '480px', height: '650px' }
    }

    const vh = window.innerHeight
    const vw = window.innerWidth

    // Calculate max dimensions with proper margins
    const maxHeight = Math.min(vh - 100, isExpanded ? 700 : 550)
    const maxWidth = Math.min(vw - 40, isExpanded ? 550 : 450)

    return {
      width: `${maxWidth}px`,
      height: `${maxHeight}px`,
      maxHeight: `${maxHeight}px`,
    }
  }

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
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      transform: isOpen
        ? 'scale(1) translateY(0)'
        : 'scale(0.8) translateY(20px)',
      opacity: isOpen ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'auto',
    },
    header: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    },
    headerTitle: {
      margin: '0 0 8px 0',
      fontSize: '18px',
      fontWeight: '600',
    },
    headerSubtitle: {
      margin: 0,
      fontSize: '14px',
      opacity: 0.9,
    },
    headerButtons: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      display: 'flex',
      gap: '8px',
    },
    headerButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: '#fafafa',
      position: 'relative',
      minHeight: 0,
    },
    floatingClearButton: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s',
      opacity: 0.7,
    },
    message: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
    },
    messageBubble: {
      padding: '14px 18px',
      borderRadius: '18px',
      fontSize: '14px',
      lineHeight: 1.5,
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    botMessage: {
      background: 'white',
      color: '#2e3440',
      borderBottomLeftRadius: '6px',
      marginRight: 'auto',
      maxWidth: '90%',
    },
    userMessage: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      borderBottomRightRadius: '6px',
      marginLeft: 'auto',
      maxWidth: '85%',
    },
    errorMessage: {
      background: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
      borderBottomLeftRadius: '6px',
      marginRight: 'auto',
      maxWidth: '90%',
    },
    retryButton: {
      background: 'none',
      border: 'none',
      color: '#dc3545',
      fontSize: '10px',
      cursor: 'pointer',
      position: 'absolute',
      bottom: '-18px',
      right: '8px',
      textDecoration: 'underline',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      padding: '14px 18px',
      borderRadius: '18px',
      borderBottomLeftRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginRight: 'auto',
      marginBottom: '20px',
      maxWidth: '200px',
    },
    wakeUpStatus: {
      textAlign: 'center',
      padding: '20px',
      color: '#6c757d',
      fontSize: '14px',
    },
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
      background:
        serverStatus === 'ready' || serverStatus === 'connected'
          ? '#28a745'
          : serverStatus === 'error' || serverStatus === 'unavailable'
          ? '#dc3545'
          : '#ffc107',
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: toastMessage.includes('error') ? '#dc3545' : '#28a745',
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

  const cssString = `
    .chatbot-header-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
    
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
    
    .chatbot-floating-clear:hover {
      opacity: 1 !important;
      transform: scale(1.05);
      background: rgba(248, 249, 250, 0.95) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    }
    
    .chatbot-message-input:focus {
      border-color: #17a2b8 !important;
    }
    
    .chatbot-messages::-webkit-scrollbar {
      width: 8px;
    }
    
    .chatbot-messages::-webkit-scrollbar-track {
      background: #f1f3f4;
      border-radius: 4px;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb {
      background: #c1c7d0;
      border-radius: 4px;
      border: 1px solid #f1f3f4;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb:hover {
      background: #9aa0a6;
    }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-10px); opacity: 1; }
    }
    
    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #17a2b8;
      animation: typing 1.4s infinite;
      margin-right: 4px;
    }
    
    .typing-dot:nth-child(1) { animation-delay: 0ms; }
    .typing-dot:nth-child(2) { animation-delay: 200ms; }
    .typing-dot:nth-child(3) { animation-delay: 400ms; }
    
    @media (max-height: 600px) {
      .chatbot-window {
        height: calc(100vh - 80px) !important;
        max-height: calc(100vh - 80px) !important;
      }
    }
    
    @media (max-width: 480px) {
      .chatbot-window {
        width: calc(100vw - 40px) !important;
        right: 20px !important;
        height: calc(100vh - 80px) !important;
        max-height: calc(100vh - 80px) !important;
      }
    }
  `

  const renderTypingIndicator = () => {
    if (!isTyping) return null

    return (
      <div style={styles.typingIndicator}>
        <div className='typing-dot'></div>
        <div className='typing-dot'></div>
        <div className='typing-dot'></div>
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
          <MessageWithChunking message={message} />

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
      </div>
    )
  }

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

      {showToast && (
        <div style={styles.toast}>
          {toastMessage.includes('error') ? '❌' : '✅'} {toastMessage}
        </div>
      )}

      <div style={styles.overlay}>
        <div style={styles.container}>
          <div style={styles.chatWindow}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerButtons}>
                <button
                  style={styles.headerButton}
                  className='chatbot-header-button'
                  onClick={toggleExpanded}
                  title={isExpanded ? 'Collapse chat' : 'Expand chat'}
                >
                  {isExpanded ? '⤡' : '⤢'}
                </button>
                <button
                  style={styles.headerButton}
                  className='chatbot-header-button'
                  onClick={handleClose}
                  title='Close chat'
                >
                  ×
                </button>
              </div>
              <h3 style={styles.headerTitle}>Ask RANI about Resolve Actions</h3>
              <p style={styles.headerSubtitle}>How can I help you today?</p>
            </div>

            {/* Messages Container */}
            <div style={styles.messagesContainer} className='chatbot-messages'>
              {serverStatus === 'waking' && wakeUpProgress && (
                <div style={styles.wakeUpStatus}>
                  <div>Starting AI Assistant...</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    {wakeUpProgress}
                  </div>
                </div>
              )}

              {messages.map(renderMessage)}
              {renderTypingIndicator()}

              {/* Floating Clear Chat Button - positioned after last message */}
              {messages.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <button
                    style={styles.floatingClearButton}
                    className='chatbot-floating-clear'
                    onClick={handleClearChat}
                    title='Clear Chat'
                  >
                    🗑️
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
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
                  disabled={isLoading || isTyping || serverStatus === 'waking'}
                />
                <button
                  style={styles.sendButton}
                  className='chatbot-send-button'
                  onClick={() => sendMessage()}
                  disabled={!canSendMessage || serverStatus === 'waking'}
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
                >
                  Support Ticket
                </button>
                <button
                  style={styles.copyButton}
                  className='chatbot-copy-button'
                  onClick={handleCopyChatClick}
                >
                  Copy Chat
                </button>
                <div style={styles.statusIndicator}>
                  <div style={styles.statusDot}></div>
                  <span>
                    {serverStatus === 'ready' || serverStatus === 'connected'
                      ? 'Connected'
                      : serverStatus === 'error' ||
                        serverStatus === 'unavailable'
                      ? 'Unavailable'
                      : 'Connecting...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Safe portal rendering - only in browser
  return createPortal(widgetContent, getPortalTarget())
}

// Wrap the main component with BrowserOnly
const DocusaurusChatbot = ({ isOpen = false, onClose }) => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <DocusaurusChatbotComponent isOpen={isOpen} onClose={onClose} />}
    </BrowserOnly>
  )
}

export default DocusaurusChatbot
