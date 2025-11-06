// src/components/SharedChatbot/ChatWindow.js
// Enhanced ChatWindow with drag and resize support

import React from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

const ChatWindow = ({
  productConfig,
  apiService,
  onClose,
  onDragStart = () => {},
  isCompactMode = true,
  hasInteracted = false,
  windowSize = { width: 380, height: 600 },
  isDragging = false,
  isResizing = false,
  // Chat state props (will be added when we integrate the chat logic)
  messages = [],
  inputValue = '',
  setInputValue = () => {},
  isLoading = false,
  isThinking = false,
  isTyping = false,
  serverStatus = 'ready',
  wakeUpProgress = null,
  messagesEndRef = null,
  messagesContainerRef = null,
  inputRef = null,
  sendMessage = () => {},
  retryMessage = () => {},
  handleKeyPress = () => {},
  canSendMessage = false,
  feedback = {},
  handleFeedback = () => {},
  handleClearChat = () => {},
  handleCopyChatClick = () => {},
  handleSupportClick = () => {},
  showScrollToBottom = false,
  forceScrollToBottom = () => {},
  handleScroll = () => {},
}) => {
  const styles = {
    chatContainer: {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      pointerEvents: 'auto',
    },
    scrollToBottomButton: {
      position: 'absolute',
      bottom: '80px', // Above the input area
      right: '16px',
      width: '36px',
      height: '36px',
      background:
        productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      opacity: showScrollToBottom ? 1 : 0,
      visibility: showScrollToBottom ? 'visible' : 'hidden',
      transform: showScrollToBottom ? 'translateY(0)' : 'translateY(10px)',
    },
    // Dynamic sizing indicator
    resizeIndicator: {
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      width: '12px',
      height: '12px',
      opacity: 0.3,
      pointerEvents: 'none',
      fontSize: '10px',
      color: '#6c757d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }

  const cssString = `
    .scroll-to-bottom-btn:hover {
      transform: translateY(-2px) scale(1.1);
      box-shadow: 0 6px 16px rgba(23, 162, 184, 0.4);
    }

    .scroll-to-bottom-btn:active {
      transform: translateY(-1px) scale(1.05);
    }

    .chat-window-container {
      user-select: ${isDragging || isResizing ? 'none' : 'auto'};
    }

    .chat-header-draggable {
      cursor: ${isDragging ? 'grabbing' : 'grab'};
    }

    .resize-indicator {
      transition: opacity 0.3s ease;
    }

    .chat-window-container:hover .resize-indicator {
      opacity: 0.6;
    }
  `

  // Create page context for the chatbot
  const pageContext = {
    product: productConfig?.productName || 'Documentation',
    version: 'auto-detect', // Will be detected from URL
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
  }

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.chatContainer} className='chat-window-container'>
        {/* Header with drag functionality */}
        <ChatHeader
          productConfig={productConfig}
          pageContext={pageContext}
          messages={messages}
          onClose={onClose}
          onDragStart={onDragStart}
          handleClearChat={handleClearChat}
          isCompactHeader={true}
          windowSize={windowSize}
          isDragging={isDragging}
        />

        {/* Messages with enhanced thinking/typing support */}
        <MessageList
          productConfig={productConfig}
          messages={messages}
          isThinking={isThinking}
          isTyping={isTyping}
          serverStatus={serverStatus}
          wakeUpProgress={wakeUpProgress}
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
          feedback={feedback}
          handleFeedback={handleFeedback}
          retryMessage={retryMessage}
          onScroll={handleScroll}
        />

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <button
            onClick={forceScrollToBottom}
            style={styles.scrollToBottomButton}
            className='scroll-to-bottom-btn'
            title='Scroll to bottom'
            aria-label='Scroll to latest message'
          >
            ↓
          </button>
        )}

        {/* Input with enhanced state handling */}
        <ChatInput
          productConfig={productConfig}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          canSendMessage={canSendMessage}
          isLoading={isLoading}
          isThinking={isThinking}
          isTyping={isTyping}
          serverStatus={serverStatus}
          handleCopyChatClick={handleCopyChatClick}
          handleSupportClick={handleSupportClick}
        />

        {/* Resize indicator */}
        <div style={styles.resizeIndicator} className='resize-indicator'>
          ⋱
        </div>
      </div>
    </>
  )
}

export default ChatWindow
