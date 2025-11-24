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
  messagesContainerRef,
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
      0%, 80%, 100% { 
        transform: scale(1); 
        opacity: 1; 
      }
      40% { 
        transform: scale(1.3); 
        opacity: 0.8; 
      }
    }
    
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0px);
        opacity: 1;
      }
      30% {
        transform: translateY(-6px);
        opacity: 0.7;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
    }
    
    /* Thinking animation styles */
    .thinking-icon {
      font-size: 16px;
      margin-right: 8px;
      animation: thinking 1.5s ease-in-out infinite;
    }
    
    .thinking-dot {
      width: 4px;
      height: 4px;
      background: ${productConfig?.primaryColor || '#17a2b8'};
      border-radius: 50%;
      margin: 0 2px;
      animation: pulse 1.4s ease-in-out infinite;
    }
    
    .thinking-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .thinking-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    .thinking-text {
      margin-left: 8px;
      font-size: 12px;
      color: #6c757d;
      font-weight: 500;
    }
    
    /* Typing animation styles */
    .typing-icon {
      font-size: 16px;
      margin-right: 8px;
      animation: typing 1.2s ease-in-out infinite;
    }
    
    .typing-dot {
      width: 4px;
      height: 4px;
      background: ${productConfig?.primaryColor || '#20c997'};
      border-radius: 50%;
      margin: 0 2px;
      animation: typing 1.0s ease-in-out infinite;
    }
    
    .typing-dot:nth-child(2) {
      animation-delay: 0.15s;
    }
    
    .typing-dot:nth-child(3) {
      animation-delay: 0.3s;
    }
    
    .typing-text {
      margin-left: 8px;
      font-size: 12px;
      color: #6c757d;
      font-weight: 500;
    }
    
    /* Activity text animations */
    .activity-text {
      animation: pulse 2s ease-in-out infinite;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .chatbot-messages {
        padding: 12px;
      }
      
      .activity-indicator {
        padding: 10px 12px;
        max-width: 200px;
      }
      
      .thinking-icon, .typing-icon {
        font-size: 14px;
      }
      
      .thinking-text, .typing-text {
        font-size: 11px;
      }
    }
    
    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .thinking-icon, .typing-icon, 
      .thinking-dot, .typing-dot, 
      .activity-text {
        animation: none !important;
      }
    }
  `

  // Render activity indicator (thinking or typing)
  const renderActivityIndicator = () => {
    if (isThinking) {
      return (
        <div style={styles.activityIndicator}>
          <span className='thinking-icon'>🧠</span>
          <div className='thinking-dot'></div>
          <div className='thinking-dot'></div>
          <div className='thinking-dot'></div>
          <span className='activity-text thinking-text'>
            {productConfig?.productName || 'AI'} is thinking...
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
          <span className='activity-text typing-text'>
            {productConfig?.productName || 'AI'} is typing...
          </span>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <style>{cssString}</style>
      <div
        style={styles.messagesContainer}
        className='chatbot-messages'
        ref={messagesContainerRef}
        onScroll={onScroll}
      >
        {/* Server wake up status */}
        {serverStatus === 'waking' && wakeUpProgress && (
          <div style={styles.wakeUpStatus}>
            <div>
              Starting {productConfig?.productName || 'AI'} Assistant...
            </div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              {wakeUpProgress}
            </div>
          </div>
        )}

        {/* Welcome message when no messages */}
        {messages.length === 0 && !isThinking && !isTyping && (
          <div style={styles.welcomeMessage}>
            {productConfig?.welcomeMessage ||
              `👋 Hi! I'm your ${
                productConfig?.productName || 'AI'
              } assistant. How can I help you today?`}
          </div>
        )}

        {/* Messages */}
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            feedback={feedback[message.id]}
            onFeedback={feedbackType =>
              handleFeedback?.(message.id, feedbackType)
            }
            onRetry={() => retryMessage?.(message.id)}
            productConfig={productConfig}
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
