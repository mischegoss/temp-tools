// src/components/Chatbot/DocusaurusChatbot.js
import React, { useEffect, useState } from 'react'
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
  const [feedback, setFeedback] = useState({}) // Local feedback storage
  const [dimensions, setDimensions] = useState({ width: 450, height: 550 })

  // Use the existing chatbot hook
  const chatbotHook = useChatbot()
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isTyping,
    serverStatus,
    wakeUpProgress,
    messagesEndRef,
    inputRef,
    sendMessage: originalSendMessage,
    retryMessage,
    clearConversation,
    generateChatSummary,
    handleKeyPress,
    focusInput,
    canSendMessage,
  } = chatbotHook

  // Chat validation for local responses
  const { shouldSendToAPI, getLocalResponse } = useChatValidation(pageContext)

  // Determine if header should be compact
  const hasUserMessages = messages.some(
    msg => msg.sender === 'user' && msg.id !== 1,
  )
  const isCompactHeader = hasUserMessages

  // Enhanced send message with local validation
  const enhancedSendMessage = async (messageText = null) => {
    const message = (messageText || inputValue).trim()
    if (!message) return false

    // Check if this should be handled locally
    if (!shouldSendToAPI(message)) {
      const localResponse = getLocalResponse(message)

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
        text: localResponse,
        sender: 'bot',
        timestamp: new Date(),
        status: 'delivered',
        isLocalResponse: true,
      }

      // Add both messages (this would need to be implemented in the hook)
      // For now, we'll fall back to sending to API
      return originalSendMessage(messageText)
    }

    // Send to API as normal
    return originalSendMessage(messageText)
  }

  // Generate context-aware initial greeting
  const getInitialGreeting = () => {
    if (!pageContext.title) {
      return "Hi, I am RANI, Resolve's AI Support Technician. How may I help you today?"
    }
    return `Hi, I'm RANI! I see you're reading about ${pageContext.title}. What would you like to know about it?`
  }

  // Override initial message if we have context
  useEffect(() => {
    if (pageContext.title && messages.length === 1 && messages[0].id === 1) {
      // Update the initial message with context-aware greeting
      const contextualGreeting = getInitialGreeting()
      if (messages[0].text !== contextualGreeting) {
        // This would need to be implemented in the chatbot hook
        // For now, the greeting logic would be handled in the backend integration later
      }
    }
  }, [pageContext, messages])

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
    showToastNotification('Thanks for your feedback!', 'success')
  }

  // Toast notifications
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(
      () => {
        setShowToast(false)
        setToastMessage('')
      },
      type === 'error' ? 5000 : 3000,
    )
  }

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  // Generate chat summaries
  const handleCopyChatClick = async () => {
    const summary = generateCleanChatSummary()
    try {
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
      showToastNotification('Chat summary copied to clipboard!', 'success')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      showToastNotification('Failed to copy chat summary', 'error')
    }
  }

  const handleSupportClick = async () => {
    const summary = generateChatSummary()
    try {
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
        'Support summary copied! Opening portal...',
        'success',
      )
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

    return summary
  }

  // Clear conversation
  const handleClearChat = () => {
    clearConversation()
    setFeedback({}) // Clear local feedback
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

  // Toast styles
  const toastStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: toastMessage.includes('error') ? '#dc3545' : '#28a745',
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
  }

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
    inputRef,
    sendMessage: enhancedSendMessage,
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
  }

  const widgetContent = (
    <>
      {/* Toast notifications */}
      {showToast && (
        <div style={toastStyle}>
          {toastMessage.includes('error') ? '❌' : '✅'} {toastMessage}
        </div>
      )}

      {/* Chat Window */}
      <ChatWindow {...chatWindowProps} />
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
