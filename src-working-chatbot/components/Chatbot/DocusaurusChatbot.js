// src/components/Chatbot/DocusaurusChatbot.js
// Fixed DocusaurusChatbot with proper validation and thinking state support

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useChatbot } from '../../hooks/useChatbot'
import ChatWindow from './ChatWindow'
import usePageContext from './hooks/usePageContext'
import useChatValidation from './hooks/useChatValidation'

const DocusaurusChatbotComponent = ({ isOpen = false, onClose }) => {
  const pageContext = usePageContext()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [feedback, setFeedback] = useState({}) // Local feedback storage
  const [dimensions, setDimensions] = useState({ width: 450, height: 550 })
  const [connectionError, setConnectionError] = useState(false)
  const [isServerUnavailable, setIsServerUnavailable] = useState(false)

  // Resize state
  const [isResizing, setIsResizing] = useState(false)
  const [resizeType, setResizeType] = useState(null)
  const chatContainerRef = useRef(null)

  // Use the existing chatbot hook with enhanced auto-scroll and thinking state
  const chatbotHook = useChatbot()

  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isThinking, // NEW: Destructure thinking state
    isTyping,
    serverStatus,
    wakeUpProgress,
    messagesEndRef,
    messagesContainerRef,
    inputRef,
    sendMessage: originalSendMessage,
    retryMessage,
    clearConversation,
    generateChatSummary,
    handleKeyPress,
    focusInput,
    canSendMessage,
    updateInitialMessage,
    addMessage,
    // Enhanced auto-scroll functions
    showScrollToBottom,
    forceScrollToBottom,
    handleScroll,
  } = chatbotHook

  // Chat validation for local responses
  const {
    shouldSendToAPI,
    getLocalResponse,
    validateAndGetResponse,
    updateConversationState,
  } = useChatValidation(pageContext)

  // Monitor server status and connection errors
  useEffect(() => {
    if (serverStatus === 'error' || serverStatus === 'unavailable') {
      setIsServerUnavailable(true)
      setConnectionError(true)
    } else if (serverStatus === 'connected' || serverStatus === 'ready') {
      setIsServerUnavailable(false)
      setConnectionError(false)
    }
  }, [serverStatus])

  // Determine if header should be compact
  const hasUserMessages = messages.some(
    msg => msg.sender === 'user' && msg.id !== 1,
  )
  const isCompactHeader = hasUserMessages

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

      const container = chatContainerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()

      if (resizeType === 'width') {
        const newWidth = Math.max(
          350,
          Math.min(800, e.clientX - rect.left + 15),
        )
        setDimensions(prev => ({ ...prev, width: newWidth }))
      } else if (resizeType === 'height') {
        const newHeight = Math.max(
          400,
          Math.min(800, rect.bottom - e.clientY + 15),
        )
        setDimensions(prev => ({ ...prev, height: newHeight }))
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
  }, [isResizing, resizeType, isMobile])

  // Enhanced send message with validation and feedback - FIXED
  const enhancedSendMessage = useCallback(
    async (messageText = null) => {
      try {
        const message = (messageText || inputValue).trim()
        if (!message) return false

        // FIXED: Update conversation state with the last bot message text (string)
        const lastBotMessage = messages
          .filter(msg => msg.sender === 'bot')
          .pop()

        if (lastBotMessage && lastBotMessage.text) {
          updateConversationState(lastBotMessage.text) // Pass string, not object
        }

        // Use validation to determine response strategy
        const validation = validateAndGetResponse(message)

        if (!validation.shouldSendToAPI) {
          // Handle local response
          if (messageText === null) {
            setInputValue('')
          }

          // Add user message first
          const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date(),
            status: 'delivered',
          }

          addMessage(userMessage)

          // Add local response after brief delay for better UX
          setTimeout(() => {
            const localMessage = {
              id: Date.now() + 1,
              text: validation.response,
              sender: 'bot',
              timestamp: new Date(),
              status: 'delivered',
              isLocal: true,
            }
            addMessage(localMessage)

            // FIXED: Update conversation state with the response text (string)
            updateConversationState(validation.response)
          }, 500)

          return true
        } else {
          // Send to API via original function
          const result = await originalSendMessage(messageText)

          // FIXED: Update conversation state when bot responds from API
          if (result) {
            // Wait a moment for the message to be added, then update state
            setTimeout(() => {
              const latestBotMessage = messages
                .filter(
                  msg =>
                    msg.sender === 'bot' &&
                    msg.timestamp > new Date(Date.now() - 10000),
                )
                .pop()

              if (latestBotMessage && latestBotMessage.text) {
                updateConversationState(latestBotMessage.text) // Pass string, not object
              }
            }, 1000)
          }

          return result
        }
      } catch (error) {
        console.error('Enhanced send message error:', error)
        showToastMessage(
          'Sorry, there was an error processing your message.',
          'error',
        )
        return false
      }
    },
    [
      originalSendMessage,
      inputValue,
      messages,
      addMessage,
      setInputValue,
      updateConversationState,
      validateAndGetResponse,
    ],
  )

  // Enhanced retry with feedback
  const enhancedRetryMessage = useCallback(
    async messageId => {
      try {
        await retryMessage(messageId)
        showToastMessage('Message retry sent successfully', 'success')
      } catch (error) {
        console.error('Retry error:', error)
        showToastMessage('Failed to retry message', 'error')
      }
    },
    [retryMessage],
  )

  // Enhanced key press handler
  const enhancedHandleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        enhancedSendMessage()
      }
    },
    [enhancedSendMessage],
  )

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      focusInput()
      // Update initial message based on page context
      updateInitialMessage(pageContext)
    }
  }, [isOpen, focusInput, updateInitialMessage, pageContext])

  // Toast message helper
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Feedback handling
  const handleFeedback = useCallback((messageId, feedbackType) => {
    setFeedback(prev => ({
      ...prev,
      [messageId]: feedbackType,
    }))

    const feedbackMessages = {
      thumbs_up: 'Thank you for your feedback!',
      thumbs_down: "Thanks for the feedback. We'll work to improve!",
      copy: 'Message copied to clipboard',
    }

    showToastMessage(feedbackMessages[feedbackType], 'success')
  }, [])

  // Clear chat with confirmation
  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      clearConversation()
      showToastMessage('Conversation cleared', 'success')
    }
  }, [clearConversation])

  // Copy chat functionality
  const handleCopyChatClick = useCallback(() => {
    try {
      const chatSummary = generateChatSummary()
      navigator.clipboard.writeText(chatSummary)
      showToastMessage('Chat summary copied to clipboard', 'success')
    } catch (error) {
      console.error('Failed to copy chat:', error)
      showToastMessage('Failed to copy chat summary', 'error')
    }
  }, [generateChatSummary])

  // Support ticket functionality
  const handleSupportClick = useCallback(() => {
    try {
      const chatSummary = generateChatSummary()
      const supportUrl = `mailto:support@resolve.com?subject=Support Request - Chat Summary&body=${encodeURIComponent(
        chatSummary,
      )}`
      window.open(supportUrl, '_blank')
      showToastMessage('Opening support ticket with chat context', 'success')
    } catch (error) {
      console.error('Failed to open support:', error)
      showToastMessage('Failed to open support ticket', 'error')
    }
  }, [generateChatSummary])

  // Close handler
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  // Portal target
  const getPortalTarget = () => {
    return document.getElementById('chatbot-portal') || document.body
  }

  // Toast styles based on type
  const toastStyles = {
    success: { backgroundColor: '#28a745', icon: '✅' },
    error: { backgroundColor: '#dc3545', icon: '❌' },
    info: { backgroundColor: '#17a2b8', icon: '💡' },
    warning: { backgroundColor: '#ffc107', icon: '⚠️' },
  }

  const currentToastStyle = toastStyles[toastType] || toastStyles.success

  // Component styles
  const styles = {
    overlay: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 10000,
      pointerEvents: isOpen ? 'auto' : 'none',
    },
    container: {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      maxWidth: isMobile ? '100vw' : '800px',
      maxHeight: isMobile ? '100vh' : '800px',
      minWidth: '350px',
      minHeight: '400px',
    },
    chatWindow: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
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
      // Add visual indicator for connection issues
      border: isServerUnavailable ? '2px solid #ffc107' : 'none',
    },
    // Enhanced toast styles with type support
    toastStyle: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: currentToastStyle.backgroundColor,
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
      lineHeight: '1.4',
    },
    // Oval resize handles
    resizeHandleWidth: {
      position: 'absolute',
      left: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '16px',
      height: '32px',
      cursor: 'ew-resize',
      opacity: 1,
      transition: 'all 0.2s ease',
      zIndex: 10002,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4a90e2',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.8)',
    },
    resizeHandleHeight: {
      position: 'absolute',
      top: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '32px',
      height: '16px',
      cursor: 'ns-resize',
      opacity: 1,
      transition: 'all 0.2s ease',
      zIndex: 10002,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4a90e2',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.8)',
    },
    resizeIconWidth: {
      fontSize: '10px',
      color: 'white',
      lineHeight: 1,
      fontWeight: 'bold',
      letterSpacing: '-1px',
    },
    resizeIconHeight: {
      fontSize: '10px',
      color: 'white',
      lineHeight: 1,
      fontWeight: 'bold',
      letterSpacing: '1px',
    },
  }

  // CSS for hover effects
  const cssString = `
    .resize-handle:hover {
      background-color: #357abd !important;
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 1) !important;
    }
    
    .resize-handle:active {
      background-color: #2968a3 !important;
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .resize-handle {
      backdrop-filter: blur(4px);
    }
    
    .chatbot-window.resizing {
      transition: none !important;
    }
    
    .chatbot-window.server-unavailable {
      border-color: #ffc107 !important;
    }
  `

  // Enhanced chatWindowProps with thinking state
  const chatWindowProps = {
    isOpen,
    onClose: handleClose,
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isThinking, // NEW: Pass thinking state to ChatWindow
    isTyping,
    serverStatus,
    wakeUpProgress,
    messagesEndRef,
    messagesContainerRef,
    inputRef,
    sendMessage: enhancedSendMessage,
    retryMessage: enhancedRetryMessage,
    handleKeyPress: enhancedHandleKeyPress,
    canSendMessage: canSendMessage && !isServerUnavailable,
    isCompactHeader,
    pageContext,
    feedback,
    handleFeedback,
    handleClearChat,
    handleCopyChatClick,
    handleSupportClick,
    dimensions,
    setDimensions,
    isServerUnavailable,
    connectionError,
    // Enhanced auto-scroll props
    showScrollToBottom,
    forceScrollToBottom,
    handleScroll,
  }

  const widgetContent = (
    <>
      <style>{cssString}</style>
      {/* Toast notifications */}
      {showToast && (
        <div style={styles.toastStyle}>
          {currentToastStyle.icon} {toastMessage}
        </div>
      )}

      <div style={styles.overlay}>
        <div ref={chatContainerRef} style={styles.container}>
          {/* Oval resize handles - desktop only */}
          {!isMobile && isOpen && (
            <>
              <div
                className='resize-handle'
                style={styles.resizeHandleWidth}
                onMouseDown={e => handleMouseDown(e, 'width')}
                title='Drag to resize width'
              >
                <div style={styles.resizeIconWidth}>⋮</div>
              </div>
              <div
                className='resize-handle'
                style={styles.resizeHandleHeight}
                onMouseDown={e => handleMouseDown(e, 'height')}
                title='Drag to resize height'
              >
                <div style={styles.resizeIconHeight}>⋯</div>
              </div>
            </>
          )}

          {/* Chat Window */}
          <div
            style={styles.chatWindow}
            className={`chatbot-window ${isResizing ? 'resizing' : ''} ${
              isServerUnavailable ? 'server-unavailable' : ''
            }`}
          >
            <ChatWindow {...chatWindowProps} />
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(widgetContent, getPortalTarget())
}

// Wrap with BrowserOnly
const DocusaurusChatbot = ({ isOpen = false, onClose }) => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <DocusaurusChatbotComponent isOpen={isOpen} onClose={onClose} />}
    </BrowserOnly>
  )
}

export default DocusaurusChatbot
