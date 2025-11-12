// src/components/SharedChatbot/hooks/useSharedChatbot.js
// Enhanced chatbot hook adapted from working chatbot for multi-product use
// FIXED: Added proper null checks and type validation

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

  // Refs for DOM manipulation
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

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

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([])
    setInputValue('')
    setFeedback({})
    setConnectionError(null)
    console.log(
      `🧹 ${productConfig?.productName || 'Chat'} conversation cleared`,
    )
  }, [productConfig?.productName])

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

      // Find the user message that preceded this failed message
      const messageIndex = messages.findIndex(msg => msg.id === messageId)
      if (messageIndex > 0) {
        const userMessage = messages[messageIndex - 1]
        if (userMessage.sender === 'user') {
          // Remove the failed message and retry
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
        // FIXED: Proper null checks and type validation
        let message = messageText

        // If no messageText provided, use inputValue
        if (message === null || message === undefined) {
          message = inputValue
        }

        // Ensure message is a string
        if (typeof message !== 'string') {
          console.warn('Invalid message type:', typeof message, message)
          return false
        }

        // Trim the message
        message = message.trim()

        // Check if message is empty
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

        // Clear input if we're using inputValue
        if (messageText === null || messageText === undefined) {
          setInputValue('')
        }

        // Set loading states
        setIsLoading(true)
        setIsThinking(true)
        setConnectionError(null)

        // Ensure server is ready
        const serverReady = await ensureServerReady()
        if (!serverReady) {
          setIsLoading(false)
          setIsThinking(false)
          return false
        }

        // Create user message
        const userMessage = {
          id: Date.now(),
          text: message,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent',
        }

        addMessage(userMessage)

        // Prepare conversation history (last 10 messages for context)
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

        // Transition from thinking to typing
        setTimeout(() => {
          setIsThinking(false)
          setIsTyping(true)
        }, 1000)

        // Send to API
        const response = await apiService.sendMessage(
          message,
          conversationHistory,
        )

        if (response.success) {
          // Create bot message
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
          // Handle API error
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

  // Copy chat functionality
  const handleCopyChatClick = useCallback(() => {
    const chatSummary = messages
      .map(msg => {
        const sender =
          msg.sender === 'bot' ? productConfig?.productName || 'AI' : 'User'
        const status = msg.isError ? ' [ERROR]' : ''
        return `${sender}${status}: ${msg.text}`
      })
      .join('\n\n')

    navigator.clipboard
      .writeText(chatSummary)
      .then(() => {
        console.log('Chat copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy chat:', err)
      })
  }, [messages, productConfig?.productName])

  // Support click functionality
  const handleSupportClick = useCallback(() => {
    const chatSummary = messages
      .map(msg => {
        const sender =
          msg.sender === 'bot' ? productConfig?.productName || 'AI' : 'User'
        return `${sender}: ${msg.text}`
      })
      .join('\n\n')

    const supportUrl = productConfig?.supportUrl || 'mailto:support@company.com'
    const subject = `${
      productConfig?.productName || 'Documentation'
    } Help Request`
    const body = `Hi, I need help with the following conversation:\n\n${chatSummary}`

    const mailtoUrl = `${supportUrl}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, '_blank')
  }, [messages, productConfig])

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

    // Refs
    messagesEndRef,
    messagesContainerRef,
    inputRef,

    // Actions
    sendMessage,
    retryMessage,
    clearConversation,
    handleKeyPress,
    handleFeedback,
    handleScroll,
    scrollToBottom,
    forceScrollToBottom,
    handleCopyChatClick,
    handleSupportClick,

    // Computed values
    canSendMessage,
  }
}

export default useSharedChatbot
