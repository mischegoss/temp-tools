// src/components/SharedChatbot/MessageList.js
// Enhanced MessageList with thinking and typing state animations

import React from 'react'
import MessageBubble from './MessageBubble'

const MessageList = ({
  productConfig,
  messages = [],
  isThinking = false,
  isTyping = false,
  serverStatus = 'ready',
  wakeUpProgress = null,
  messagesEndRef,
  feedback = {},
  handleFeedback,
  retryMessage,
  onScroll,
}) => {
  const styles = {
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      background: '#fafafa',
      position: 'relative',
      minHeight: 0,
    },
    wakeUpStatus: {
      textAlign: 'center',
      padding: '20px',
      color: '#6c757d',
      fontSize: '13px',
    },
    // Enhanced typing/thinking indicator container
    activityIndicator: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      padding: '12px 16px',
      borderRadius: '16px',
      borderBottomLeftRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginRight: 'auto',
      marginBottom: '16px',
      maxWidth: '260px',
      transition: 'all 0.3s ease',
    },
    welcomeMessage: {
      textAlign: 'center',
      padding: '20px',
      color: '#6c757d',
      fontSize: '14px',
      fontStyle: 'italic',
    },
  }

  const cssString = `
    .chatbot-messages::-webkit-scrollbar {
      width: 6px;
    }
    
    .chatbot-messages::-webkit-scrollbar-track {
      background: #f1f3f4;
      border-radius: 3px;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb {
      background: #c1c7d0;
      border-radius: 3px;
      border: 1px solid #f1f3f4;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb:hover {
      background: #9aa0a6;
    }
    
    /* Enhanced animations for thinking vs typing */
    @keyframes thinking {
      0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
      40% { transform: scale(1.2); opacity: 1; }
    }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-10px); opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    
    /* Thinking dots - slower, more contemplative */
    .thinking-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${productConfig?.primaryColor || '#17a2b8'};
      animation: thinking 2s infinite;
      margin-right: 3px;
    }
    
    .thinking-dot:nth-child(2) { animation-delay: 300ms; }
    .thinking-dot:nth-child(3) { animation-delay: 600ms; }
    .thinking-dot:nth-child(4) { animation-delay: 900ms; }
    
    /* Typing dots - faster, more active */
    .typing-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: ${productConfig?.secondaryColor || '#20c997'};
      animation: typing 1.4s infinite;
      margin-right: 3px;
    }
    
    .typing-dot:nth-child(2) { animation-delay: 200ms; }
    .typing-dot:nth-child(3) { animation-delay: 400ms; }
    .typing-dot:nth-child(4) { animation-delay: 600ms; }
    
    /* Text animation for smooth transitions */
    .activity-text {
      margin-left: 8px;
      font-size: 12px;
      color: #6c757d;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .thinking-text {
      color: ${productConfig?.primaryColor || '#17a2b8'};
    }
    
    .typing-text {
      color: ${productConfig?.secondaryColor || '#20c997'};
    }
    
    /* Brain icon for thinking state */
    .thinking-icon {
      font-size: 14px;
      margin-right: 6px;
      animation: pulse 2s infinite;
    }
    
    /* Keyboard icon for typing state */
    .typing-icon {
      font-size: 12px;
      margin-right: 6px;
      animation: pulse 1s infinite;
    }
  `

  // Enhanced activity indicator that handles both thinking and typing
  const renderActivityIndicator = () => {
    // Don't show anything if neither thinking nor typing
    if (!isThinking && !isTyping) return null

    if (isThinking) {
      return (
        <div style={styles.activityIndicator}>
          <span className='thinking-icon'>🧠</span>
          <div className='thinking-dot'></div>
          <div className='thinking-dot'></div>
          <div className='thinking-dot'></div>
          <span className='activity-text thinking-text'>
            RANI is thinking...
          </span>
        </div>
      )
    }

    if (isTyping) {
      return (
        <div style={styles.activityIndicator}>
          <span className='typing-icon'>⌨️</span>
          <div className='typing-dot'></div>
          <div className='typing-dot'></div>
          <div className='typing-dot'></div>
          <span className='activity-text typing-text'>RANI is typing...</span>
        </div>
      )
    }

    return null
  }

  // Show welcome message if no messages and not loading
  const showWelcomeMessage =
    messages.length === 0 &&
    !isThinking &&
    !isTyping &&
    serverStatus === 'ready'

  return (
    <>
      <style>{cssString}</style>
      <div
        style={styles.messagesContainer}
        className='chatbot-messages'
        onScroll={onScroll}
      >
        {/* Server wake up status */}
        {serverStatus === 'waking' && wakeUpProgress && (
          <div style={styles.wakeUpStatus}>
            <div>Starting AI Assistant...</div>
            <div style={{ fontSize: '11px', marginTop: '6px' }}>
              {wakeUpProgress}
            </div>
          </div>
        )}

        {/* Welcome message for empty chat */}
        {showWelcomeMessage && (
          <div style={styles.welcomeMessage}>
            👋 Hi! I'm RANI, your AI assistant for{' '}
            {productConfig?.productName || 'Documentation'}.
            <br />
            How can I help you today?
          </div>
        )}

        {/* Messages */}
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            productConfig={productConfig}
            feedback={feedback[message.id]}
            onFeedback={feedbackType =>
              handleFeedback(message.id, feedbackType)
            }
            onRetry={() => retryMessage(message.id)}
          />
        ))}

        {/* Enhanced thinking/typing indicator */}
        {renderActivityIndicator()}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </>
  )
}

export default MessageList
