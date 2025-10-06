// src/components/Chatbot/MessageList.js
import React from 'react'
import MessageBubble from './MessageBubble'

const MessageList = ({
  messages,
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

        {/* MINIMAL CHANGE: Remove floating clear chat button from here - moved to header */}
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

        {/* Typing indicator */}
        {renderTypingIndicator()}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </>
  )
}

export default MessageList
