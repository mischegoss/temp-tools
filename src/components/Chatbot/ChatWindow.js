// src/components/Chatbot/ChatWindow.js
import React, { useRef, useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

const ChatWindow = ({
  isOpen,
  onClose,
  messages,
  inputValue,
  setInputValue,
  isLoading,
  isTyping,
  serverStatus,
  wakeUpProgress,
  messagesEndRef,
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
  dimensions,
  setDimensions,
}) => {
  const chatWindowRef = useRef(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeType, setResizeType] = useState(null)

  // Determine if we're in mobile view (simple check)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  // Mouse handlers for resizing (desktop only)
  const handleMouseDown = (e, type) => {
    if (isMobile) return
    e.preventDefault()
    setIsResizing(true)
    setResizeType(type)
  }

  useEffect(() => {
    const handleMouseMove = e => {
      if (!isResizing || !resizeType || isMobile) return

      const container = chatWindowRef.current?.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()

      if (resizeType === 'width' || resizeType === 'corner') {
        const newWidth = containerRect.right - e.clientX + 20 // 20px for right margin
        setDimensions(prev => ({
          ...prev,
          width: Math.max(350, Math.min(600, newWidth)),
        }))
      }

      if (resizeType === 'height' || resizeType === 'corner') {
        const newHeight = containerRect.bottom - e.clientY + 20 // 20px for bottom margin
        setDimensions(prev => ({
          ...prev,
          height: Math.max(400, Math.min(700, newHeight)),
        }))
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeType(null)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeType, isMobile, setDimensions])

  // Dynamic sizing
  const getWindowSize = () => {
    if (isMobile) {
      return {
        width: '350px',
        height: '600px',
        maxHeight: 'calc(100vh - 40px)',
      }
    }

    // Desktop - use dimensions from state
    return {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      maxHeight: `${dimensions.height}px`,
    }
  }

  const windowSize = getWindowSize()

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
      bottom: isMobile ? '10px' : '20px', // Higher on mobile to avoid blocking buttons
      right: '20px',
      zIndex: 10000,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    },
    chatWindow: {
      ...windowSize,
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      transform: isOpen
        ? 'scale(1) translateY(0)'
        : 'scale(0.8) translateY(20px)',
      opacity: isOpen ? 1 : 0,
      transition: isResizing
        ? 'none'
        : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'auto',
      position: 'relative',
    },
    // Resize handles (desktop only)
    resizeHandleWidth: {
      position: 'absolute',
      left: '-5px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '10px',
      height: '60px',
      cursor: 'ew-resize',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '5px',
      opacity: 0,
      transition: 'opacity 0.2s',
      zIndex: 11,
    },
    resizeHandleHeight: {
      position: 'absolute',
      top: '-5px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '10px',
      cursor: 'ns-resize',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '5px',
      opacity: 0,
      transition: 'opacity 0.2s',
      zIndex: 11,
    },
    resizeHandleCorner: {
      position: 'absolute',
      top: '-5px',
      left: '-5px',
      width: '20px',
      height: '20px',
      cursor: 'nw-resize',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '10px',
      opacity: 0,
      transition: 'opacity 0.2s',
      zIndex: 11,
    },
    resizeIndicator: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      width: '4px',
      height: '4px',
      backgroundColor: '#cbd5e0',
      borderRadius: '50%',
      opacity: 0,
      transition: 'opacity 0.2s',
    },
  }

  // CSS for hover effects
  const cssString = `
    .chatbot-window:hover .resize-handle {
      opacity: 0.6 !important;
    }
    
    .chatbot-window:hover .resize-indicator {
      opacity: 1 !important;
    }
    
    .resize-handle:hover {
      opacity: 1 !important;
    }
  `

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <div
            ref={chatWindowRef}
            style={styles.chatWindow}
            className='chatbot-window'
          >
            {/* Resize handles - desktop only */}
            {!isMobile && (
              <>
                <button
                  className='resize-handle'
                  style={styles.resizeHandleWidth}
                  onMouseDown={e => handleMouseDown(e, 'width')}
                />
                <button
                  className='resize-handle'
                  style={styles.resizeHandleHeight}
                  onMouseDown={e => handleMouseDown(e, 'height')}
                />
                <button
                  className='resize-handle'
                  style={styles.resizeHandleCorner}
                  onMouseDown={e => handleMouseDown(e, 'corner')}
                >
                  <div
                    className='resize-indicator'
                    style={styles.resizeIndicator}
                  />
                </button>
              </>
            )}

            {/* Header */}
            <ChatHeader
              isCompactHeader={isCompactHeader}
              pageContext={pageContext}
              messages={messages}
              onClose={onClose}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              isTyping={isTyping}
              serverStatus={serverStatus}
              wakeUpProgress={wakeUpProgress}
              messagesEndRef={messagesEndRef}
              feedback={feedback}
              handleFeedback={handleFeedback}
              retryMessage={retryMessage}
              handleClearChat={handleClearChat}
            />

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
        </div>
      </div>
    </>
  )
}

export default ChatWindow
