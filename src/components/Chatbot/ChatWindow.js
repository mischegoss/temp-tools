// src/components/Chatbot/ChatWindow.js
import React from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

const ChatWindow = ({
  messages,
  inputValue,
  setInputValue,
  isLoading,
  isTyping,
  serverStatus,
  wakeUpProgress,
  messagesEndRef,
  messagesContainerRef,
  inputRef,
  sendMessage,
  retryMessage,
  handleKeyPress,
  canSendMessage,
  isCompactHeader,
  pageContext,
  feedback,
  handleFeedback,
  handleClearChat,
  handleCopyChatClick,
  handleSupportClick,
  onClose,
  showScrollToBottom,
  forceScrollToBottom,
  handleScroll,
}) => {
  const styles = {
    chatContainer: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    scrollToBottomButton: {
      position: 'absolute',
      bottom: '120px', // Above the input area
      right: '20px',
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
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
  }

  const cssString = `
    .scroll-to-bottom-btn:hover {
      transform: translateY(-2px) scale(1.1);
      box-shadow: 0 6px 16px rgba(23, 162, 184, 0.4);
    }

    .scroll-to-bottom-btn:active {
      transform: translateY(-1px) scale(1.05);
    }
  `

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.chatContainer}>
        {/* Header */}
        <ChatHeader
          isCompactHeader={isCompactHeader}
          pageContext={pageContext}
          messages={messages}
          onClose={onClose}
          handleClearChat={handleClearChat}
        />

        {/* Messages */}
        <MessageList
          messages={messages}
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

        {/* Input */}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          canSendMessage={canSendMessage}
          isLoading={isLoading}
          isTyping={isTyping}
          serverStatus={serverStatus}
          handleCopyChatClick={handleCopyChatClick}
          handleSupportClick={handleSupportClick}
        />
      </div>
    </>
  )
}

export default ChatWindow
