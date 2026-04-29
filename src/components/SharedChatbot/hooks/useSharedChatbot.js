// src/components/SharedChatbot/hooks/useSharedChatbot.js
// FIXED: Clear button uses exact same UI notification as copy chat

import { useState, useCallback, useRef, useEffect } from 'react'

export const useSharedChatbot = (productConfig, apiService) => {
  // Core chat state
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Server state
  const [serverStatus, setServerStatus] = useState('ready')
  const [wakeUpProgress, setWakeUpProgress] = useState(null)
  const [connectionError, setConnectionError] = useState(null)

  // UI state
  const [feedback, setFeedback] = useState({})
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // Toast state for notifications
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  // Refs for DOM manipulation
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Toast helper function
  const showToastMessage = useCallback((message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const forceScrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    setShowScrollToBottom(!isNearBottom && messages.length > 2)
  }, [messages.length])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, scrollToBottom])

  // Focus input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Server readiness check
  const ensureServerReady = useCallback(async () => {
    if (serverStatus === 'ready') return true

    try {
      setServerStatus('waking')
      setWakeUpProgress('Checking server status...')

      await apiService.ensureServerAwake(progress => {
        setWakeUpProgress(progress)
      })

      setServerStatus('ready')
      setWakeUpProgress(null)
      setConnectionError(null)
      return true
    } catch (error) {
      console.error('Failed to wake up server:', error)
      setServerStatus('error')
      setWakeUpProgress(null)
      setConnectionError(error.message)
      return false
    }
  }, [apiService, serverStatus])

  // Message management
  const addMessage = useCallback(message => {
    setMessages(prev => [...prev, message])
  }, [])

  const updateMessage = useCallback((messageId, updates) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === messageId ? { ...msg, ...updates } : msg)),
    )
  }, [])

  // FIXED: Clear conversation with exact same UI notification as copy
  const clearConversation = useCallback(() => {
    setMessages([])
    setInputValue('')
    setFeedback({})
    setConnectionError(null)
    // FIXED: Use exact same toast notification pattern as copy chat
    showToastMessage('Conversation cleared', 'success')
    console.log(
      `🧹 ${productConfig?.productName || 'Chat'} conversation cleared`,
    )
  }, [productConfig?.productName, showToastMessage])

  // Handle feedback
  const handleFeedback = useCallback((messageId, feedbackType) => {
    setFeedback(prev => ({ ...prev, [messageId]: feedbackType }))
    console.log(`👍 Feedback for message ${messageId}: ${feedbackType}`)
  }, [])

  // Retry failed message
  const retryMessage = useCallback(
    async messageId => {
      const messageToRetry = messages.find(msg => msg.id === messageId)
      if (!messageToRetry) return

      const messageIndex = messages.findIndex(msg => msg.id === messageId)
      if (messageIndex > 0) {
        const userMessage = messages[messageIndex - 1]
        if (userMessage.sender === 'user') {
          setMessages(prev => prev.filter(msg => msg.id !== messageId))
          await sendMessage(userMessage.text)
        }
      }
    },
    [messages],
  )

  // Enhanced send message with proper validation
  const sendMessage = useCallback(
    async (messageText = null) => {
      try {
        let message = messageText

        if (message === null || message === undefined) {
          message = inputValue
        }

        if (typeof message !== 'string') {
          console.warn('Invalid message type:', typeof message, message)
          return false
        }

        message = message.trim()

        if (!message) {
          console.warn('Empty message, not sending')
          return false
        }

        console.log(
          `💬 Sending ${productConfig?.productName || 'Chat'} message:`,
          {
            message:
              message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            messageLength: message.length,
            inputValueLength:
              typeof inputValue === 'string' ? inputValue.length : 'N/A',
          },
        )

        if (messageText === null || messageText === undefined) {
          setInputValue('')
        }

        setIsLoading(true)
        setIsThinking(true)
        setConnectionError(null)

        const serverReady = await ensureServerReady()
        if (!serverReady) {
          setIsLoading(false)
          setIsThinking(false)
          return false
        }

        const userMessage = {
          id: Date.now(),
          text: message,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent',
        }

        addMessage(userMessage)

        const conversationHistory = messages.slice(-10)

        console.log(`📝 ${productConfig?.productName || 'Chat'} context:`, {
          historyLength: conversationHistory.length,
          contextMessages: conversationHistory.length,
          totalContextChars: conversationHistory.reduce(
            (sum, msg) =>
              sum + (typeof msg.text === 'string' ? msg.text.length : 0),
            0,
          ),
        })

        setTimeout(() => {
          setIsThinking(false)
          setIsTyping(true)
        }, 1000)

        const response = await apiService.sendMessage(
          message,
          conversationHistory,
        )

        if (response.success) {
          const botMessage = {
            id: Date.now() + 1,
            text: response.message,
            sender: 'bot',
            timestamp: new Date(),
            status: 'received',
            metadata: response.metadata,
          }

          addMessage(botMessage)

          console.log(
            `✅ ${
              productConfig?.productName || 'Chat'
            } conversation completed successfully`,
          )
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            text:
              response.message ||
              `Sorry, I'm having trouble connecting to the ${
                productConfig?.productName || 'AI'
              } documentation system.`,
            sender: 'bot',
            timestamp: new Date(),
            status: 'error',
            isError: true,
          }

          addMessage(errorMessage)
          console.error(
            `❌ ${productConfig?.productName || 'Chat'} API error:`,
            response.error,
          )
        }

        return true
      } catch (error) {
        console.error(
          `❌ ${productConfig?.productName || 'Chat'} send message failed:`,
          error,
        )

        const errorMessage = {
          id: Date.now() + 1,
          text: `I'm experiencing technical difficulties. Please try again or contact support if the issue persists.`,
          sender: 'bot',
          timestamp: new Date(),
          status: 'error',
          isError: true,
        }

        addMessage(errorMessage)
        return false
      } finally {
        setIsLoading(false)
        setIsThinking(false)
        setIsTyping(false)
      }
    },
    [
      inputValue,
      setInputValue,
      productConfig,
      messages,
      apiService,
      addMessage,
      ensureServerReady,
    ],
  )

  // Handle key press
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  // Can send message validation
  const canSendMessage =
    !isLoading &&
    !isThinking &&
    !isTyping &&
    typeof inputValue === 'string' &&
    inputValue.trim().length > 0

  // FIXED: Copy chat functionality with same UI notification pattern
  const handleCopyChatClick = useCallback(() => {
    try {
      const chatSummary = messages
        .map(msg => {
          const sender =
            msg.sender === 'bot' ? productConfig?.productName || 'AI' : 'User'
          const status = msg.isError ? ' [ERROR]' : ''
          return `${sender}${status}: ${msg.text}`
        })
        .join('\n\n')

      const header = `=== ${productConfig?.productName || 'AI'} Chat Summary ===
Generated: ${new Date().toLocaleString()}
Messages: ${messages.length}
Page: ${typeof window !== 'undefined' ? window.location.pathname : '/'}

`

      const fullSummary = header + chatSummary

      navigator.clipboard
        .writeText(fullSummary)
        .then(() => {
          console.log(
            `✅ ${productConfig?.productName || 'Chat'} copied to clipboard`,
          )
          // FIXED: Exact same notification pattern as clear
          showToastMessage('Chat copied to clipboard', 'success')
        })
        .catch(err => {
          console.error('Failed to copy chat:', err)
          showToastMessage('Failed to copy chat', 'error')
        })
    } catch (error) {
      console.error('Error generating chat summary:', error)
      showToastMessage('Failed to copy chat', 'error')
    }
  }, [messages, productConfig?.productName, showToastMessage])

  // Support click with notification before opening
  const handleSupportClick = useCallback(() => {
    try {
      const chatSummary = `Chat Summary for Support Ticket
Generated: ${new Date().toLocaleString()}
Product: ${productConfig?.productName || 'Documentation'}
Page: ${typeof window !== 'undefined' ? window.location.pathname : '/'}
========================

${messages
  .map((msg, index) => {
    const sender = msg.sender === 'bot' ? 'RANI' : 'USER'
    const status = msg.isError ? ' [ERROR]' : ''
    return `${sender}${status}: ${msg.text}`
  })
  .join('\n\n')}

------------------------
End of chat summary. Please use this context when responding to the support ticket.`

      navigator.clipboard.writeText(chatSummary)

      showToastMessage('Chat copied to share with support', 'success')

      setTimeout(() => {
        window.open('https://support.resolve.io/', '_blank')
      }, 1000)

      console.log('✅ Support: Chat copied and opening support portal')
    } catch (error) {
      console.error('❌ Support error:', error)
      showToastMessage('Failed to copy chat', 'error')
    }
  }, [messages, productConfig, showToastMessage])

  return {
    // State
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isThinking,
    isTyping,
    serverStatus,
    wakeUpProgress,
    connectionError,
    feedback,
    showScrollToBottom,

    // Toast state
    showToast,
    toastMessage,
    toastType,
    showToastMessage,

    // Refs
    messagesEndRef,
    messagesContainerRef,
    inputRef,

    // Actions
    sendMessage,
    retryMessage,
    clearConversation, // FIXED: Now shows exact same UI as copy chat
    handleKeyPress,
    handleFeedback,
    handleScroll,
    scrollToBottom,
    forceScrollToBottom,
    handleCopyChatClick, // FIXED: Same notification pattern
    handleSupportClick,

    // Computed values
    canSendMessage,
  }
}

export default useSharedChatbot
