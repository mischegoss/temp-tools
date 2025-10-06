// src/hooks/useChatbot.js
// Complete enhanced custom hook with advanced context management and auto-scroll

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
    if (savedExpanded) {
      setIsExpanded(JSON.parse(savedExpanded))
    }
  }, [])

  // Save expanded state to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot-expanded', JSON.stringify(isExpanded))
  }, [isExpanded])

  // Enhanced scroll to bottom
  const scrollToBottom = useCallback(
    (force = false) => {
      if (messagesEndRef.current && (!isUserScrolledUp || force)) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
        setIsUserScrolledUp(false)
        setShowScrollToBottom(false)
      }
    },
    [isUserScrolledUp],
  )

  // Force scroll to bottom (always scrolls regardless of user position)
  const forceScrollToBottom = useCallback(() => {
    scrollToBottom(true)
  }, [scrollToBottom])

  // Handle scroll detection
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50 // 50px threshold

    setIsUserScrolledUp(!isAtBottom)

    // Show scroll to bottom button if user scrolled up and there are new messages
    if (!isAtBottom && messages.length > lastMessageCount.current) {
      setShowScrollToBottom(true)
    } else if (isAtBottom) {
      setShowScrollToBottom(false)
    }
  }, [messages.length])

  // Auto-scroll when messages change
  useEffect(() => {
    const messageCountChanged = messages.length !== lastMessageCount.current
    const hasNewBotMessage =
      messages.length > lastMessageCount.current &&
      messages[messages.length - 1]?.sender === 'bot'

    // Always scroll to bottom for new bot messages
    if (hasNewBotMessage) {
      setTimeout(() => forceScrollToBottom(), 100)
    }
    // Scroll normally for other new messages if user hasn't scrolled up
    else if (messageCountChanged && !isUserScrolledUp) {
      setTimeout(() => scrollToBottom(), 100)
    }

    lastMessageCount.current = messages.length
  }, [messages, isUserScrolledUp, scrollToBottom, forceScrollToBottom])

  // Focus input when chat opens
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Update initial message with context
  const updateInitialMessage = useCallback(newText => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === 1 ? { ...msg, text: newText, timestamp: new Date() } : msg,
      ),
    )
  }, [])

  // Session Management Functions
  const saveConversationSession = useCallback(() => {
    try {
      // Don't save if only initial message or if disabled
      if (messages.length <= 1) return

      const sessionData = {
        messages: messages.filter(
          msg => !msg.isError && msg.status !== 'failed',
        ), // Only save successful messages
        timestamp: new Date().toISOString(),
        serverStatus,
        contextInfo,
      }

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
      console.log(
        '💾 Conversation session saved:',
        sessionData.messages.length,
        'messages',
      )
    } catch (error) {
      console.error('Failed to save conversation session:', error)
    }
  }, [messages, serverStatus, contextInfo])

  const loadConversationSession = useCallback(() => {
    try {
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!savedSession) return false

      const sessionData = JSON.parse(savedSession)

      // Check if session is recent and valid
      const sessionAge = Date.now() - new Date(sessionData.timestamp).getTime()
      const maxAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000

      if (
        sessionAge < maxAge &&
        sessionData.messages &&
        sessionData.messages.length > 1
      ) {
        // Restore messages with fresh timestamps for recent ones
        const restoredMessages = sessionData.messages.map((msg, index) => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // Convert back to Date object
        }))

        setMessages(restoredMessages)

        if (sessionData.contextInfo) {
          setContextInfo(sessionData.contextInfo)
        }

        console.log(
          '📂 Conversation session restored:',
          restoredMessages.length,
          'messages',
        )
        return true
      } else {
        // Session expired, clear it
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
        console.log('🗑️ Expired session cleared')
      }
    } catch (error) {
      console.error('Failed to load conversation session:', error)
      // Clear corrupted session
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
    return false
  }, [])

  const clearConversationSession = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      console.log('🗑️ Conversation session cleared')
    } catch (error) {
      console.error('Failed to clear conversation session:', error)
    }
  }, [])

  // Context Management Functions
  const getOptimizedConversationHistory = useCallback(() => {
    // Filter out system messages, failed messages, and error messages
    const validMessages = messages.filter(
      msg =>
        msg.sender !== 'system' &&
        msg.status !== 'failed' &&
        !msg.isError &&
        !msg.isRetrieving &&
        msg.text &&
        msg.text.trim().length > 0,
    )

    // Take only recent messages to stay within context window
    let recentMessages = validMessages.slice(-CONTEXT_WINDOW_SIZE)

    // Calculate total length and trim if necessary to stay within character limit
    let totalLength = 0
    const optimizedHistory = []

    // Work backwards to prioritize the most recent messages
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const msg = recentMessages[i]
      const messageLength = msg.text.length

      if (totalLength + messageLength <= MAX_CONTEXT_LENGTH) {
        optimizedHistory.unshift(msg)
        totalLength += messageLength
      } else {
        // If we can't fit the whole message, we stop here
        break
      }
    }

    // Update context info for debugging and UI display
    setContextInfo({
      messagesInContext: optimizedHistory.length,
      contextCharacters: totalLength,
      contextTruncated: optimizedHistory.length < validMessages.length,
      totalValidMessages: validMessages.length,
    })

    return optimizedHistory
  }, [messages])

  const getContextStatus = useCallback(() => {
    const validMessages = messages.filter(
      msg => msg.sender !== 'system' && msg.status !== 'failed' && !msg.isError,
    )

    return {
      totalMessages: validMessages.length,
      contextMessages: Math.min(validMessages.length, CONTEXT_WINDOW_SIZE),
      hasContext: validMessages.length > 1,
      contextTruncated: validMessages.length > CONTEXT_WINDOW_SIZE,
      ...contextInfo,
    }
  }, [messages, contextInfo])

  // Check server status
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

  // Ensure server is ready
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

  // Message management functions
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

  // Enhanced send message with context management
  const sendMessage = useCallback(
    async (messageText = null) => {
      const message = (messageText || inputValue).trim()
      if (!message || isLoading || isTyping) return false

      // Clear input if using current input value
      if (!messageText) {
        setInputValue('')
      }

      // Create user message
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
      }

      addMessage(userMessage)
      setIsLoading(true)

      // Create and immediately show "Retrieving your answer..." message
      const retrievingMessageId = Date.now() + 1
      const retrievingMessage = {
        id: retrievingMessageId,
        text: 'Retrieving your answer...',
        sender: 'bot',
        timestamp: new Date(),
        status: 'delivered',
        isRetrieving: true,
      }

      addMessage(retrievingMessage)

      try {
        // Ensure server is ready
        if (serverStatus !== 'ready') {
          const serverReady = await ensureServerReady()
          if (!serverReady) {
            removeMessage(retrievingMessageId)
            updateMessage(userMessage.id, { status: 'failed' })
            return false
          }
        }

        // Update user message status
        updateMessage(userMessage.id, { status: 'sent' })

        // Show typing indicator
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

        // Remove retrieving message and typing indicator
        removeMessage(retrievingMessageId)
        setIsTyping(false)

        if (result.success) {
          // Add AI response with context metadata
          const botMessage = {
            id: Date.now() + 2,
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
            id: Date.now() + 2,
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

        // Remove retrieving message and typing indicator
        removeMessage(retrievingMessageId)
        setIsTyping(false)

        // Add generic error message
        const errorMessage = {
          id: Date.now() + 2,
          text: "I'm experiencing technical difficulties. Let me connect you with our support team for immediate assistance.",
          sender: 'bot',
          timestamp: new Date(),
          status: 'delivered',
          isError: true,
        }

        addMessage(errorMessage)
        updateMessage(userMessage.id, { status: 'failed' })
        return false
      } finally {
        setIsLoading(false)
        setIsTyping(false)
      }
    },
    [
      inputValue,
      isLoading,
      isTyping,
      serverStatus,
      getOptimizedConversationHistory,
      contextInfo.contextTruncated,
      ensureServerReady,
      addMessage,
      updateMessage,
      removeMessage,
    ],
  )

  // Retry failed message
  const retryMessage = useCallback(
    async messageId => {
      const failedMessage = messages.find(msg => msg.id === messageId)
      if (!failedMessage || failedMessage.sender !== 'user') return

      // Remove failed message and subsequent messages
      removeMessagesAfter(new Date(failedMessage.timestamp.getTime() - 1))

      // Clear any existing retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }

      // Retry sending the message after a short delay
      retryTimeoutRef.current = setTimeout(() => {
        sendMessage(failedMessage.text)
      }, 100)
    },
    [messages, removeMessagesAfter, sendMessage],
  )

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  // Enhanced clear conversation that also clears session
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
    setInputValue('')
    setIsLoading(false)
    setIsTyping(false)
    setConnectionError(null)
    setWakeUpProgress('')
    setContextInfo({
      messagesInContext: 0,
      contextCharacters: 0,
      contextTruncated: false,
    })

    // Reset scroll state
    setIsUserScrolledUp(false)
    setShowScrollToBottom(false)
    lastMessageCount.current = 1

    // Clear the session storage
    clearConversationSession()
    console.log('🧹 Conversation and session cleared')
  }, [clearConversationSession])

  // Generate enhanced chat summary for support tickets
  const generateChatSummary = useCallback(() => {
    const timestamp = new Date().toLocaleString()
    const contextStatus = getContextStatus()

    let summary = `Chat Summary for Support Ticket\n`
    summary += `Generated: ${timestamp}\n`
    summary += `Platform: Resolve Actions (via RANI AI Support Technician)\n`
    summary += `Session Status: ${serverStatus}\n`
    summary += `Context: ${contextStatus.totalMessages} total messages, ${contextStatus.contextMessages} in context\n`
    if (contextStatus.contextTruncated) {
      summary += `Note: Earlier messages truncated due to context limits\n`
    }
    if (connectionError) {
      summary += `Connection Error: ${connectionError}\n`
    }
    summary += `\nConversation History:\n`
    summary += `------------------------\n`

    // Include all messages in summary, even if not all were in context
    messages.forEach((message, index) => {
      const sender = message.sender === 'bot' ? 'RANI' : 'User'
      const status = message.status ? ` [${message.status}]` : ''
      const errorFlag = message.isError ? ' [ERROR]' : ''
      const contextFlag = index === 0 ? ' [INITIAL]' : '' // Mark initial message
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
  }, [messages, serverStatus, connectionError, getContextStatus])

  // Handle keyboard shortcuts
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  // Auto-save conversation to session storage
  useEffect(() => {
    if (messages.length > 1 && !isLoading) {
      // Don't save while processing
      const saveTimeout = setTimeout(saveConversationSession, 2000) // Debounce saves
      return () => clearTimeout(saveTimeout)
    }
  }, [messages, isLoading, saveConversationSession])

  // Initialize session on first mount
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

  // Cleanup on unmount
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
    canSendMessage: !isLoading && !isTyping && inputValue.trim().length > 0,
    isServerReady: serverStatus === 'ready',
    hasError: serverStatus === 'error' || !!connectionError,
    hasContext: getContextStatus().hasContext,

    // Session info
    sessionRestored: sessionInitialized.current,
  }
}
