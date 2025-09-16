// src/components/Chatbot/DocusaurusChatbot.js
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

  // Use the existing chatbot hook with enhanced auto-scroll
  const chatbotHook = useChatbot()

  // Debug what we're getting from the hook
  console.log('Available functions from useChatbot:', Object.keys(chatbotHook))

  const {
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

      const containerRect = container.getBoundingClientRect()

      if (resizeType === 'width' || resizeType === 'corner') {
        const newWidth = containerRect.right - e.clientX + 20 // 20px for right margin
        setDimensions(prev => ({
          ...prev,
          width: Math.max(450, Math.min(800, newWidth)),
        }))
      }

      if (resizeType === 'height' || resizeType === 'corner') {
        const newHeight = containerRect.bottom - e.clientY + 20 // 20px for bottom margin
        setDimensions(prev => ({
          ...prev,
          height: Math.max(500, Math.min(800, newHeight)),
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
  }, [isResizing, resizeType, isMobile])

  // Enhanced send message with comprehensive validation and error handling
  const enhancedSendMessage = async (messageText = null) => {
    const message = (messageText || inputValue).trim()
    if (!message) return false

    // Check if server is unavailable before attempting to send
    if (isServerUnavailable) {
      showToastNotification(
        'RANI is currently unavailable. Please try again later or contact support.',
        'error',
      )
      return false
    }

    // Use the comprehensive validation system
    const validation = validateAndGetResponse(message)

    if (!validation.shouldSendToAPI) {
      // Clear input if using current input value
      if (!messageText) {
        setInputValue('')
      }

      // Add user message
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'delivered',
      }

      // Add local bot response
      const botMessage = {
        id: Date.now() + 1,
        text: validation.response,
        sender: 'bot',
        timestamp: new Date(),
        status: 'delivered',
        isLocalResponse: true,
        responseType: validation.type,
      }

      // Add both messages locally
      addMessage(userMessage)
      setTimeout(() => {
        addMessage(botMessage)
        // Update conversation state for context tracking
        updateConversationState(validation.response)
      }, 500) // Small delay to make it feel natural

      return true
    }

    try {
      // Send to API as normal for valid questions
      const result = await originalSendMessage(messageText)

      // Update conversation state when bot responds from API
      if (result) {
        // Get the last bot message to update conversation state
        setTimeout(() => {
          const lastBotMessage = messages.find(
            msg =>
              msg.sender === 'bot' &&
              msg.timestamp > new Date(Date.now() - 10000), // Within last 10 seconds
          )
          if (lastBotMessage) {
            updateConversationState(lastBotMessage.text)
          }
        }, 1000)
      }

      return result
    } catch (error) {
      console.error('Error sending message:', error)

      // Add user message even if API fails
      if (!messageText) {
        setInputValue('')
      }

      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'delivered',
      }
      addMessage(userMessage)

      // Add error response from bot
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm experiencing technical difficulties at the moment. Please try again in a few moments, or contact our support team if the issue persists.",
        sender: 'bot',
        timestamp: new Date(),
        status: 'error',
        isError: true,
      }

      setTimeout(() => {
        addMessage(errorMessage)
      }, 500)

      // Show toast notification
      showToastNotification(
        'Unable to connect to RANI. Your message has been recorded.',
        'error',
      )

      // Mark server as unavailable
      setIsServerUnavailable(true)
      setConnectionError(true)

      return false
    }
  }

  // Enhanced retry with connection check
  const enhancedRetryMessage = async messageId => {
    if (isServerUnavailable) {
      showToastNotification(
        'RANI is still unavailable. Please try again later.',
        'error',
      )
      return false
    }

    try {
      const result = await retryMessage(messageId)
      if (result) {
        setConnectionError(false)
        setIsServerUnavailable(false)
      }
      return result
    } catch (error) {
      console.error('Error retrying message:', error)
      showToastNotification(
        'Unable to retry message. Please check your connection.',
        'error',
      )
      return false
    }
  }

  // Generate context-aware initial greeting with connection status
  const getInitialGreeting = () => {
    if (isServerUnavailable) {
      return "I'm currently experiencing technical difficulties. Some features may be limited. Please try again later or contact support if you need immediate assistance."
    }

    if (!pageContext.title) {
      return "Hi, I am RANI, Resolve's AI Support Technician. How may I help you today?"
    }
    return `Hi, I am RANI. It looks like you are reading about ${pageContext.title}. How may I help you?`
  }

  // Enhanced key press handler that uses our enhanced send message
  const enhancedHandleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        enhancedSendMessage()
      }
    },
    [enhancedSendMessage],
  )

  useEffect(() => {
    // Update initial message based on connection status and page context
    if (messages.length === 1 && messages[0].id === 1) {
      const contextualGreeting = getInitialGreeting()
      if (messages[0].text !== contextualGreeting) {
        updateInitialMessage(contextualGreeting)
      }
    }
  }, [pageContext.title, messages, updateInitialMessage, isServerUnavailable])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      focusInput()
    }
  }, [isOpen, focusInput])

  // Handle feedback (store locally for now)
  const handleFeedback = (messageId, feedbackType) => {
    setFeedback(prev => ({
      ...prev,
      [messageId]: feedbackType,
    }))

    // Show confirmation toast
    showToastNotification(
      'Thank you for your feedback. We appreciate your input.',
      'success',
    )
  }

  // Enhanced toast notifications with type tracking
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(
      () => {
        setShowToast(false)
        setToastMessage('')
        setToastType('success')
      },
      type === 'error' ? 6000 : 3000,
    )
  }

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  // Generate chat summaries with error handling
  const handleCopyChatClick = async () => {
    try {
      const summary = generateCleanChatSummary()
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
        'Chat summary has been copied to your clipboard.',
        'success',
      )
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      showToastNotification(
        'Unable to copy chat summary. Please try again.',
        'error',
      )
    }
  }

  const handleSupportClick = async () => {
    try {
      const summary = generateChatSummary()
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary)
        showToastNotification(
          'Support summary copied to clipboard. Opening support portal...',
          'success',
        )
      } else {
        showToastNotification('Opening support portal...', 'info')
      }

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

  // Generate clean chat summary for personal use
  const generateCleanChatSummary = () => {
    let summary = `Chat Summary - ${new Date().toLocaleDateString()}\n`
    summary += `========================\n\n`

    messages.forEach(message => {
      if (message.id === 1) return // Skip initial greeting
      const sender = message.sender === 'bot' ? 'RANI' : 'You'
      summary += `${sender}: ${message.text}\n\n`
    })

    // Add connection status note if there were issues
    if (connectionError) {
      summary += `\nNote: Some responses may have been affected by connectivity issues.\n`
    }

    return summary
  }

  // Clear conversation
  const handleClearChat = () => {
    clearConversation()
    setFeedback({}) // Clear local feedback
    setConnectionError(false) // Reset connection error state
  }

  // Get portal target
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

  // Dynamic sizing
  const getWindowSize = () => {
    if (isMobile) {
      return {
        width: '380px',
        height: '640px',
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

  const getToastStyles = () => {
    let backgroundColor = '#28a745' // success
    let icon = '✅'

    if (toastType === 'error') {
      backgroundColor = '#dc3545'
      icon = '⚠️'
    } else if (toastType === 'info') {
      backgroundColor = '#17a2b8'
      icon = 'ℹ️'
    }

    return { backgroundColor, icon }
  }

  const toastStyles = getToastStyles()

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
      bottom: isMobile ? '10px' : '20px',
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
      // Add visual indicator for connection issues
      border: isServerUnavailable ? '2px solid #ffc107' : 'none',
    },
    // Enhanced toast styles with type support
    toastStyle: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: toastStyles.backgroundColor,
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

  const chatWindowProps = {
    isOpen,
    onClose: handleClose,
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
          {toastStyles.icon} {toastMessage}
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
