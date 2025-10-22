// src/components/Chatbot/MessageList.js
// Enhanced MessageList with thinking and typing state animations

import React from 'react'
import MessageBubble from './MessageBubble'

const MessageList = ({
  messages,
  isThinking, // NEW: Thinking state
  isTyping,
  serverStatus,
  wakeUpProgress,
  messagesEndRef,
  feedback,
  handleFeedback,
  retryMessage,
}) => {
  const styles = {
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: '#fafafa',
      position: 'relative',
      minHeight: 0,
    },
    wakeUpStatus: {
      textAlign: 'center',
      padding: '20px',
      color: '#6c757d',
      fontSize: '14px',
    },
    // Enhanced typing/thinking indicator container
    activityIndicator: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      padding: '14px 18px',
      borderRadius: '18px',
      borderBottomLeftRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginRight: 'auto',
      marginBottom: '20px',
      maxWidth: '280px',
      transition: 'all 0.3s ease',
    },
  }

  const cssString = `
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
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #17a2b8;
      animation: thinking 2s infinite;
      margin-right: 4px;
    }
    
    .thinking-dot:nth-child(1) { animation-delay: 0ms; }
    .thinking-dot:nth-child(2) { animation-delay: 300ms; }
    .thinking-dot:nth-child(3) { animation-delay: 600ms; }
    
    /* Typing dots - faster, more active */
    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #20c997;
      animation: typing 1.4s infinite;
      margin-right: 4px;
    }
    
    .typing-dot:nth-child(1) { animation-delay: 0ms; }
    .typing-dot:nth-child(2) { animation-delay: 200ms; }
    .typing-dot:nth-child(3) { animation-delay: 400ms; }
    
    /* Text animation for smooth transitions */
    .activity-text {
      margin-left: 8px;
      font-size: 12px;
      color: #6c757d;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .thinking-text {
      color: #17a2b8;
    }
    
    .typing-text {
      color: #20c997;
    }
    
    /* Brain icon for thinking state */
    .thinking-icon {
      font-size: 14px;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    
    /* Keyboard icon for typing state */
    .typing-icon {
      font-size: 12px;
      margin-right: 8px;
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

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.messagesContainer} className='chatbot-messages'>
        {/* Server wake up status */}
        {serverStatus === 'waking' && wakeUpProgress && (
          <div style={styles.wakeUpStatus}>
            <div>Starting AI Assistant...</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              {wakeUpProgress}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
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
