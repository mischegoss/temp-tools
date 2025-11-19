// src/components/SharedChatbot/ChatWindow.js
// Fixed ChatWindow with proper prop passing for clear button
// FIXED: All handlers properly passed to child components

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
  // Chat state props from useSharedChatbot
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
  handleClearChat = () => {}, // FIXED: Properly received and logged
  handleCopyChatClick = () => {},
  handleSupportClick = () => {},
  showScrollToBottom = false,
  forceScrollToBottom = () => {},
  handleScroll = () => {},
}) => {
  // Debug logging for clear chat
  React.useEffect(() => {
    console.log('ChatWindow received handleClearChat:', typeof handleClearChat)
  }, [handleClearChat])

  const styles = {
    chatContainer: {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '12px', // Actions border radius
      overflow: 'hidden',
      pointerEvents: 'auto',
    },
    scrollToBottomButton: {
      position: 'absolute',
      bottom: '120px', // Above the input area
      right: '20px',
      width: '40px',
      height: '40px',
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
      fontSize: '18px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      opacity: showScrollToBottom ? 1 : 0,
      visibility: showScrollToBottom ? 'visible' : 'hidden',
      transform: showScrollToBottom ? 'translateY(0)' : 'translateY(10px)',
    },
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
      box-shadow: 0 6px 16px ${
        productConfig?.shadowColor || 'rgba(23, 162, 184, 0.4)'
      };
    }

    .scroll-to-bottom-btn:active {
      transform: translateY(-1px) scale(1.05);
    }

    .chat-window-container {
      user-select: ${isDragging || isResizing ? 'none' : 'auto'};
    }
  `

  // Create page context for the chatbot
  const pageContext = {
    product: productConfig?.productName || 'Documentation',
    version: 'auto-detect',
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
  }

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.chatContainer} className='chat-window-container'>
        {/* FIXED: Header with all proper handlers */}
        <ChatHeader
          productConfig={productConfig}
          pageContext={pageContext}
          messages={messages}
          onClose={onClose}
          onDragStart={onDragStart}
          handleClearChat={handleClearChat} // FIXED: Properly passed
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

        {/* FIXED: Input with all Actions-style handlers */}
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
          handleCopyChatClick={handleCopyChatClick} // FIXED: Properly passed
          handleSupportClick={handleSupportClick} // FIXED: Properly passed
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
