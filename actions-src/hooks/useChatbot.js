// src/hooks/useChatbot.js
// Fixed custom hook with stable dependencies and improved messaging flow

import { useState, useEffect, useCallback, useRef } from 'react'
import chatbotService from '../services/chatbotService'

// Context management constants
const CONTEXT_WINDOW_SIZE = 10 // Keep last 10 messages for context
const MAX_CONTEXT_LENGTH = 8000 // Rough character limit for context
const SESSION_STORAGE_KEY = 'chatbot-conversation-session'
const SESSION_EXPIRY_HOURS = 1 // Session expires after 1 hour

export const useChatbot = () => {
  // Message state
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I am RANI, Resolve's AI Support Technician. How may I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered',
    },
  ])

  // UI state
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false) // NEW: Immediate thinking state
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-scroll state
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // Server state
  const [serverStatus, setServerStatus] = useState('unknown')
  const [wakeUpProgress, setWakeUpProgress] = useState('')
  const [connectionError, setConnectionError] = useState(null)

  // Context state
  const [contextInfo, setContextInfo] = useState({
    messagesInContext: 0,
    contextCharacters: 0,
    contextTruncated: false,
  })

  // Refs
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const retryTimeoutRef = useRef(null)
  const sessionInitialized = useRef(false)
  const messagesContainerRef = useRef(null)
  const lastMessageCount = useRef(messages.length)

  // Load expanded state from localStorage
  useEffect(() => {
    const savedExpanded = localStorage.getItem('chatbot-expanded')
    if (savedExpanded === 'true') {
      setIsExpanded(true)
    }
  }, [])

  // Save expanded state to localStorage - FIXED: Remove dependencies that change frequently
  useEffect(() => {
    localStorage.setItem('chatbot-expanded', isExpanded.toString())
  }, [isExpanded])

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  // Focus input
  const focusInput = useCallback(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }, [])

  // Auto-scroll logic - FIXED: Stable function
  const scrollToBottom = useCallback(
    (force = false) => {
      if (messagesEndRef.current && (!isUserScrolledUp || force)) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }
    },
    [isUserScrolledUp],
  )

  // Force scroll to bottom (used by scroll button)
  const forceScrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
      setIsUserScrolledUp(false)
      setShowScrollToBottom(false)
    }
  }, [])

  // Handle scroll events - FIXED: Stable function with proper dependencies
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const isScrolledToBottom =
      container.scrollHeight - container.clientHeight <= container.scrollTop + 1

    const shouldShowButton = !isScrolledToBottom && messages.length > 3

    setIsUserScrolledUp(!isScrolledToBottom)
    setShowScrollToBottom(shouldShowButton)
  }, [messages.length]) // Only depend on messages.length, not the entire messages array

  // Auto-scroll when new messages arrive - FIXED: Stable dependencies
  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      // New message arrived, scroll to bottom
      setTimeout(() => scrollToBottom(), 100)
      lastMessageCount.current = messages.length
    }
  }, [messages.length, scrollToBottom]) // Only depend on messages.length

  // Session management functions - STABLE
  const saveConversationSession = useCallback(() => {
    try {
      const sessionData = {
        messages: messages.slice(1), // Exclude initial message
        timestamp: new Date().toISOString(),
        contextInfo,
      }
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.warn('Failed to save conversation session:', error)
    }
  }, [messages, contextInfo])

  const loadConversationSession = useCallback(() => {
    try {
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!savedSession) return false

      const sessionData = JSON.parse(savedSession)
      const sessionTime = new Date(sessionData.timestamp)
      const now = new Date()
      const hoursSinceSession = (now - sessionTime) / (1000 * 60 * 60)

      if (hoursSinceSession > SESSION_EXPIRY_HOURS) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
        return false
      }

      if (sessionData.messages && sessionData.messages.length > 0) {
        setMessages(prev => [
          prev[0], // Keep initial message
          ...sessionData.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        ])

        if (sessionData.contextInfo) {
          setContextInfo(sessionData.contextInfo)
        }

        console.log(
          '🔄 Conversation session restored:',
          sessionData.messages.length,
          'messages',
        )
        return true
      }
    } catch (error) {
      console.warn('Failed to load conversation session:', error)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
    return false
  }, [])

  const clearConversationSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  }, [])

  // Get optimized conversation history for context - STABLE
  const getOptimizedConversationHistory = useCallback(() => {
    const conversationMessages = messages
      .slice(1)
      .filter(msg => msg.sender === 'user' || msg.sender === 'bot')

    let optimizedHistory = conversationMessages.slice(-CONTEXT_WINDOW_SIZE)
    let totalLength = optimizedHistory.reduce(
      (sum, msg) => sum + msg.text.length,
      0,
    )

    if (totalLength > MAX_CONTEXT_LENGTH) {
      while (optimizedHistory.length > 2 && totalLength > MAX_CONTEXT_LENGTH) {
        const removed = optimizedHistory.shift()
        totalLength -= removed.text.length
      }
      setContextInfo(prev => ({ ...prev, contextTruncated: true }))
    }

    setContextInfo(prev => ({
      ...prev,
      messagesInContext: optimizedHistory.length,
      contextCharacters: totalLength,
    }))

    return optimizedHistory
  }, [messages])

  // Get context status for UI display - STABLE
  const getContextStatus = useCallback(() => {
    return {
      totalMessages: messages.length - 1,
      contextMessages: contextInfo.messagesInContext,
      contextCharacters: contextInfo.contextCharacters,
      contextTruncated: contextInfo.contextTruncated,
      contextInfo,
    }
  }, [messages.length, contextInfo]) // Only depend on length, not entire messages array

  // Check server status - STABLE
  const checkServerStatus = useCallback(async () => {
    try {
      const status = chatbotService.getConnectionStatus()

      if (status.isAwake && status.healthCheckValid) {
        setServerStatus('ready')
        setConnectionError(null)
      } else if (status.isWakingUp) {
        setServerStatus('waking')
      } else {
        setServerStatus('sleeping')
      }
    } catch (error) {
      console.error('Failed to check server status:', error)
      setServerStatus('error')
      setConnectionError(error.message)
    }
  }, [])

  // Ensure server is ready - STABLE
  const ensureServerReady = useCallback(async () => {
    try {
      setServerStatus('waking')
      setWakeUpProgress('Checking server status...')
      setConnectionError(null)

      await chatbotService.wakeUpServer(progress => {
        setWakeUpProgress(progress)
      })

      setServerStatus('ready')
      setWakeUpProgress('')
      return true
    } catch (error) {
      console.error('Failed to wake server:', error)
      setServerStatus('error')
      setWakeUpProgress('Server startup failed')
      setConnectionError(error.message)
      return false
    }
  }, [])

  // Message management functions - STABLE
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

  // Enhanced send message with immediate thinking state - FIXED: Stable dependencies
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
        console.log('📝 Sending message with context:', {
          message:
            message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          contextMessages: conversationHistory.length,
          totalContextChars: conversationHistory.reduce(
            (sum, msg) => sum + msg.text.length,
            0,
          ),
          contextPreview: conversationHistory.slice(-3).map(msg => ({
            sender: msg.sender,
            preview:
              msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : ''),
          })),
        })

        // Send to AI service with enhanced context
        const result = await chatbotService.sendMessage(
          message,
          conversationHistory,
        )

        // Clear all loading states
        setIsTyping(false)
        setIsLoading(false)

        if (result.success) {
          // Add AI response with context metadata
          const botMessage = {
            id: Date.now() + 1,
            text: result.message,
            sender: 'bot',
            timestamp: new Date(),
            status: 'delivered',
            metadata: {
              ...result.metadata,
              contextInfo: {
                messagesUsed: conversationHistory.length,
                contextLength: conversationHistory.reduce(
                  (sum, msg) => sum + msg.text.length,
                  0,
                ),
                contextTruncated: contextInfo.contextTruncated,
              },
            },
          }

          addMessage(botMessage)
          updateMessage(userMessage.id, { status: 'delivered' })

          console.log('✅ AI response received with context:', {
            contextUsed: botMessage.metadata.contextInfo,
            responseMetadata: result.metadata,
          })
          return true
        } else {
          // Handle AI service error
          const errorMessage = {
            id: Date.now() + 1,
            text: result.message,
            sender: 'bot',
            timestamp: new Date(),
            status: 'delivered',
            isError: true,
          }

          addMessage(errorMessage)
          updateMessage(userMessage.id, { status: 'failed' })

          console.error('❌ AI service error:', result.error)
          return false
        }
      } catch (error) {
        console.error('❌ Unexpected error:', error)

        // Clear all loading states
        setIsThinking(false)
        setIsTyping(false)
        setIsLoading(false)

        // Add generic error message
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm experiencing technical difficulties. Let me connect you with our support team for immediate assistance.",
          sender: 'bot',
          timestamp: new Date(),
          status: 'delivered',
          isError: true,
        }

        addMessage(errorMessage)
        updateMessage(userMessage.id, { status: 'failed' })
        return false
      }
    },
    [
      inputValue,
      isLoading,
      isThinking,
      isTyping,
      serverStatus,
      ensureServerReady,
      addMessage,
      updateMessage,
      getOptimizedConversationHistory,
      contextInfo.contextTruncated,
    ],
  )

  // Retry failed message - STABLE
  const retryMessage = useCallback(
    async messageId => {
      const message = messages.find(msg => msg.id === messageId)
      if (!message || message.sender !== 'user') return

      // Find and remove any bot responses after this message
      const messageTime = message.timestamp
      removeMessagesAfter(messageTime)

      // Resend the message
      await sendMessage(message.text)
    },
    [messages, removeMessagesAfter, sendMessage],
  )

  // Clear conversation - STABLE
  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "Hi, I am RANI, Resolve's AI Support Technician. How may I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        status: 'delivered',
      },
    ])
    setContextInfo({
      messagesInContext: 0,
      contextCharacters: 0,
      contextTruncated: false,
    })
    clearConversationSession()
    console.log('🗑️ Conversation cleared')
  }, [clearConversationSession])

  // Update initial message for context - STABLE
  const updateInitialMessage = useCallback((pageContext = {}) => {
    const contextMessage = pageContext.title
      ? `Hi, I am RANI, Resolve's AI Support Technician. I can help you with questions about ${pageContext.title}. How may I assist you?`
      : "Hi, I am RANI, Resolve's AI Support Technician. How may I help you today?"

    setMessages(prev => [
      {
        ...prev[0],
        text: contextMessage,
        timestamp: new Date(),
      },
      ...prev.slice(1),
    ])
  }, [])

  // Generate chat summary for support - STABLE
  const generateChatSummary = useCallback(() => {
    const contextStatus = getContextStatus()

    let summary = `Chat Summary for Support Ticket\n`
    summary += `Generated: ${new Date().toLocaleString()}\n`
    summary += `========================\n\n`

    messages.forEach((message, index) => {
      const sender = message.sender === 'user' ? 'USER' : 'RANI'
      const status = message.status === 'failed' ? ' [FAILED]' : ''
      const errorFlag = message.isError ? ' [ERROR]' : ''
      const contextFlag = index === 1 ? ' [INITIAL]' : '' // Mark initial message
      summary += `${sender}${status}${errorFlag}${contextFlag}: ${message.text}\n\n`
    })

    summary += `------------------------\n`
    summary += `Technical Details:\n`
    summary += `- Context window: ${contextStatus.contextMessages}/${contextStatus.totalMessages} messages\n`
    summary += `- Context size: ${contextStatus.contextCharacters} characters\n`
    summary += `- Session restored: ${
      sessionInitialized.current ? 'Yes' : 'No'
    }\n`
    summary += `------------------------\n`
    summary += `End of chat summary. Please use this context when responding to the support ticket.`

    return summary
  }, [messages, getContextStatus])

  // Handle keyboard shortcuts - STABLE
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  // Auto-save conversation to session storage - FIXED: Stable dependencies
  useEffect(() => {
    if (messages.length > 1 && !isLoading && !isThinking) {
      // Don't save while processing
      const saveTimeout = setTimeout(saveConversationSession, 2000) // Debounce saves
      return () => clearTimeout(saveTimeout)
    }
  }, [messages.length, isLoading, isThinking, saveConversationSession]) // Only depend on length and processing states

  // Initialize session on first mount - STABLE
  useEffect(() => {
    if (!sessionInitialized.current) {
      sessionInitialized.current = true

      // Try to restore session first
      const sessionRestored = loadConversationSession()

      // Then check server status
      checkServerStatus()

      console.log(
        '🚀 Chatbot hook initialized, session restored:',
        sessionRestored,
      )
    }
  }, [loadConversationSession, checkServerStatus])

  // Cleanup on unmount - STABLE
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      // Save final session state
      saveConversationSession()
    }
  }, [saveConversationSession])

  // Return all state and functions needed by the chat component
  return {
    // Message state
    messages,
    inputValue,
    setInputValue,

    // UI state
    isLoading,
    isThinking, // NEW: Expose thinking state
    isTyping,
    isExpanded,
    toggleExpanded,

    // Auto-scroll state
    isUserScrolledUp,
    showScrollToBottom,

    // Server state
    serverStatus,
    wakeUpProgress,
    connectionError,

    // Context state
    contextInfo,
    getContextStatus,

    // Refs
    messagesEndRef,
    inputRef,
    messagesContainerRef,

    // Core actions
    sendMessage,
    retryMessage,
    clearConversation,
    focusInput,
    checkServerStatus,
    generateChatSummary,
    handleKeyPress,
    updateInitialMessage,
    addMessage,

    // Scroll actions
    scrollToBottom,
    forceScrollToBottom,
    handleScroll,

    // Context management
    getOptimizedConversationHistory,
    clearConversationSession,
    loadConversationSession,

    // Computed values
    canSendMessage:
      !isLoading && !isThinking && !isTyping && inputValue.trim().length > 0,
    isServerReady: serverStatus === 'ready',
    hasError: serverStatus === 'error' || !!connectionError,
  }
}
