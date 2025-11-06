// src/components/SharedChatbot/hooks/useSharedChatbot.js
// Enhanced chatbot hook adapted from working chatbot for multi-product use

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

  const removeMessage = useCallback(messageId => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }, [])

  const removeMessagesAfter = useCallback(timestamp => {
    setMessages(prev => prev.filter(msg => msg.timestamp <= timestamp))
  }, [])

  // Get optimized conversation history
  const getOptimizedConversationHistory = useCallback(() => {
    const MAX_HISTORY_MESSAGES = 10
    const MAX_CONTEXT_CHARS = 4000

    let history = messages
      .filter(msg => msg.status === 'sent' || msg.sender === 'bot')
      .slice(-MAX_HISTORY_MESSAGES)

    // Trim if total context is too large
    let totalChars = history.reduce((sum, msg) => sum + msg.text.length, 0)

    while (totalChars > MAX_CONTEXT_CHARS && history.length > 2) {
      history = history.slice(1) // Remove oldest message
      totalChars = history.reduce((sum, msg) => sum + msg.text.length, 0)
    }

    return history
  }, [messages])

  // Enhanced send message with immediate thinking state
  const sendMessage = useCallback(
    async (messageText = null) => {
      const message = (messageText || inputValue).trim()
      if (!message || isLoading || isThinking || isTyping) return false

      // Clear input if using current input value
      if (!messageText) {
        setInputValue('')
      }

      // IMMEDIATE FEEDBACK: Set thinking state right away
      setIsThinking(true)
      setIsLoading(true)

      // Create user message
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
      }

      addMessage(userMessage)

      try {
        // Ensure server is ready
        if (serverStatus !== 'ready') {
          const serverReady = await ensureServerReady()
          if (!serverReady) {
            setIsThinking(false)
            setIsLoading(false)
            updateMessage(userMessage.id, { status: 'failed' })
            return false
          }
        }

        // Update user message status
        updateMessage(userMessage.id, { status: 'sent' })

        // TRANSITION: From thinking to typing when server starts responding
        setIsThinking(false)
        setIsTyping(true)

        // Get optimized conversation history for better context
        const conversationHistory = getOptimizedConversationHistory()

        // Debug logging for context
        console.log(
          `📝 Sending ${productConfig.productName} message with context:`,
          {
            message:
              message.substring(0, 100) + (message.length > 100 ? '...' : ''),
            contextMessages: conversationHistory.length,
            totalContextChars: conversationHistory.reduce(
              (sum, msg) => sum + msg.text.length,
              0,
            ),
          },
        )

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
            `✅ ${productConfig.productName} conversation completed successfully`,
          )
        } else {
          // Handle API error
          const errorMessage = {
            id: Date.now() + 1,
            text:
              response.message ||
              `Sorry, I'm having trouble connecting to the ${productConfig.productName} documentation system.`,
            sender: 'bot',
            timestamp: new Date(),
            status: 'error',
            isError: true,
          }

          addMessage(errorMessage)
          console.error(
            `❌ ${productConfig.productName} API error:`,
            response.error,
          )
        }

        return true
      } catch (error) {
        console.error(
          `❌ ${productConfig.productName} send message failed:`,
          error,
        )

        const errorMessage = {
          id: Date.now() + 1,
          text: `I'm experiencing technical difficulties. Please try again or contact support.`,
          sender: 'bot',
          timestamp: new Date(),
          status: 'error',
          isError: true,
        }

        addMessage(errorMessage)
        updateMessage(userMessage.id, { status: 'failed' })

        return false
      } finally {
        setIsLoading(false)
        setIsThinking(false)
        setIsTyping(false)
      }
    },
    [
      inputValue,
      isLoading,
      isThinking,
      isTyping,
      serverStatus,
      productConfig,
      apiService,
      addMessage,
      updateMessage,
      ensureServerReady,
      getOptimizedConversationHistory,
    ],
  )

  // Retry failed message
  const retryMessage = useCallback(
    async messageId => {
      const messageToRetry = messages.find(msg => msg.id === messageId)
      if (!messageToRetry) return

      // Remove failed messages after this timestamp
      removeMessagesAfter(messageToRetry.timestamp)

      // If it's a user message, resend it
      if (messageToRetry.sender === 'user') {
        await sendMessage(messageToRetry.text)
      }
    },
    [messages, removeMessagesAfter, sendMessage],
  )

  // Handle key press in input
  const handleKeyPress = useCallback(
    e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  // Feedback handling
  const handleFeedback = useCallback(
    (messageId, feedbackType) => {
      setFeedback(prev => ({
        ...prev,
        [messageId]: {
          type: feedbackType,
          timestamp: new Date(),
        },
      }))

      console.log(`📊 ${productConfig.productName} feedback:`, {
        messageId,
        feedbackType,
      })
    },
    [productConfig],
  )

  // Clear chat
  const handleClearChat = useCallback(() => {
    setMessages([])
    setFeedback({})
    setInputValue('')
    console.log(`🗑️ ${productConfig.productName} chat cleared`)
  }, [productConfig])

  // Copy chat functionality
  const handleCopyChatClick = useCallback(() => {
    const chatSummary = messages
      .map(msg => `${msg.sender === 'user' ? 'You' : 'RANI'}: ${msg.text}`)
      .join('\n\n')

    const fullSummary = `${
      productConfig.productName
    } Chat Summary\n${'='.repeat(30)}\n\n${chatSummary}`

    navigator.clipboard
      .writeText(fullSummary)
      .then(() => {
        console.log(`📋 ${productConfig.productName} chat copied to clipboard`)
      })
      .catch(err => {
        console.error('Failed to copy chat:', err)
      })
  }, [messages, productConfig])

  // Support functionality
  const handleSupportClick = useCallback(() => {
    handleCopyChatClick() // Auto-copy chat

    // You can customize this URL for each product
    const supportUrl =
      productConfig.supportUrl || 'mailto:support@yourcompany.com'
    window.open(supportUrl, '_blank')

    console.log(`📧 ${productConfig.productName} support contacted`)
  }, [handleCopyChatClick, productConfig])

  // Calculate if send is possible
  const canSendMessage =
    inputValue.trim().length > 0 &&
    !isLoading &&
    !isThinking &&
    !isTyping &&
    serverStatus === 'ready'

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
    handleKeyPress,
    handleFeedback,
    handleClearChat,
    handleCopyChatClick,
    handleSupportClick,
    scrollToBottom,
    forceScrollToBottom,
    handleScroll,

    // Computed
    canSendMessage,

    // Utils
    addMessage,
    updateMessage,
    removeMessage,
    ensureServerReady,
  }
}

export default useSharedChatbot
