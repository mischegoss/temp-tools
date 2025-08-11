// src/components/CustomChatModal.js
import React, { useState, useEffect, useRef } from 'react'
import chatbotProxy from '../../utils/ChatbotProxy.js'

// Inline styles object
const styles = {
  chatModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },

  chatModalContainer: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '800px',
    height: '80vh',
    maxHeight: '700px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  chatModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
    background: 'linear-gradient(135deg, #7892e5, #142660)',
    color: 'white',
  },

  chatModalHeaderH2: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
  },

  chatModalActions: {
    display: 'flex',
    gap: '10px',
  },

  actionBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'background-color 0.2s',
  },

  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: '#f8f9fa',
  },

  message: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '80%',
  },

  messageUser: {
    alignSelf: 'flex-end',
  },

  messageBot: {
    alignSelf: 'flex-start',
  },

  messageError: {
    alignSelf: 'center',
    maxWidth: '100%',
  },

  messageContent: {
    padding: '12px 16px',
    borderRadius: '18px',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.4,
  },

  messageContentUser: {
    background: 'linear-gradient(135deg, #7892e5, #142660)',
    color: 'white',
    borderBottomRightRadius: '4px',
  },

  messageContentBot: {
    background: 'white',
    color: '#333',
    border: '1px solid #e0e0e0',
    borderBottomLeftRadius: '4px',
  },

  messageContentError: {
    background: '#ffe6e6',
    color: '#d32f2f',
    border: '1px solid #ffcdd2',
    textAlign: 'center',
  },

  messageTime: {
    fontSize: '11px',
    color: '#666',
    marginTop: '4px',
    textAlign: 'right',
  },

  messageTimeBot: {
    textAlign: 'left',
  },

  messageContentLoading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  typingIndicator: {
    display: 'flex',
    gap: '4px',
  },

  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#7892e5',
    animation: 'typing 1.4s infinite ease-in-out',
  },

  errorMessage: {
    background: '#ffe6e6',
    color: '#d32f2f',
    padding: '12px 20px',
    borderTop: '1px solid #ffcdd2',
    textAlign: 'center',
    fontSize: '14px',
  },

  chatInputForm: {
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
    background: 'white',
  },

  formRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '16px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  formGroupFlex: {
    flex: 1,
  },

  formLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },

  formInput: {
    padding: '10px 12px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },

  questionTextarea: {
    padding: '10px 12px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    resize: 'vertical',
    minHeight: '80px',
  },

  sendButton: {
    width: '100%',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #7892e5, #142660)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '12px',
  },

  sendButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
}

// CSS Animation keyframes for typing indicator
const cssKeyframes = `
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`

export default function CustomChatModal({ isOpen, onClose }) {
  const [product, setProduct] = useState('Insights')
  const [version, setVersion] = useState('')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Product options
  const products = ['Insights', 'Express', 'Actions', 'Pro']

  // Inject CSS keyframes on component mount
  useEffect(() => {
    const styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerText = cssKeyframes
    document.head.appendChild(styleSheet)

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chatbot when modal opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChatbot()
    }
  }, [isOpen, isInitialized])

  const initializeChatbot = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Wait for the hidden chatbot to be ready
      await chatbotProxy.waitForChatbot()
      setIsInitialized(true)

      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content:
            "Hi! Please select your product and ask your question. I'll provide targeted assistance.",
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error('Failed to initialize chatbot:', err)
      setError('Failed to initialize chat service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!question.trim() || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Create structured message
      const structuredMessage = chatbotProxy.formatStructuredMessage(
        product,
        version,
        question,
      )

      // Add user message to display
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: `Product: ${product}${
          version ? ` (v${version})` : ''
        }\nQuestion: ${question}`,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, userMessage])

      // Send to hidden chatbot
      const response = await chatbotProxy.sendMessage(structuredMessage)

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])

      // Clear the question field for next question
      setQuestion('')
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')

      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error processing your message.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        content:
          'Chat cleared. Please select your product and ask your question.',
        timestamp: new Date(),
      },
    ])
    setQuestion('')
    setError(null)

    // Optionally clear the hidden chatbot too
    chatbotProxy.clearChat()
  }

  const handleInputFocus = e => {
    e.target.style.borderColor = '#7892e5'
  }

  const handleInputBlur = e => {
    e.target.style.borderColor = '#e0e0e0'
  }

  const handleButtonHover = e => {
    if (!e.target.disabled) {
      e.target.style.transform = 'translateY(-1px)'
      e.target.style.boxShadow = '0 4px 12px rgba(120, 146, 229, 0.4)'
    }
  }

  const handleButtonLeave = e => {
    e.target.style.transform = 'none'
    e.target.style.boxShadow = 'none'
  }

  const handleActionBtnHover = e => {
    e.target.style.background = 'rgba(255, 255, 255, 0.3)'
  }

  const handleActionBtnLeave = e => {
    e.target.style.background = 'rgba(255, 255, 255, 0.2)'
  }

  if (!isOpen) return null

  return (
    <div style={styles.chatModalOverlay} onClick={onClose}>
      <div style={styles.chatModalContainer} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.chatModalHeader}>
          <h2 style={styles.chatModalHeaderH2}>AI Assistant</h2>
          <div style={styles.chatModalActions}>
            <button
              onClick={handleClearChat}
              style={styles.actionBtn}
              title='Clear Chat'
              onMouseEnter={handleActionBtnHover}
              onMouseLeave={handleActionBtnLeave}
            >
              🗑️
            </button>
            <button
              onClick={onClose}
              style={styles.actionBtn}
              title='Close'
              onMouseEnter={handleActionBtnHover}
              onMouseLeave={handleActionBtnLeave}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={styles.chatMessages}>
          {messages.map(message => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.type === 'user'
                  ? styles.messageUser
                  : message.type === 'bot'
                  ? styles.messageBot
                  : styles.messageError),
              }}
            >
              <div
                style={{
                  ...styles.messageContent,
                  ...(message.type === 'user'
                    ? styles.messageContentUser
                    : message.type === 'bot'
                    ? styles.messageContentBot
                    : styles.messageContentError),
                }}
              >
                {message.content}
              </div>
              <div
                style={{
                  ...styles.messageTime,
                  ...(message.type === 'bot' ? styles.messageTimeBot : {}),
                }}
              >
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ ...styles.message, ...styles.messageBot }}>
              <div
                style={{
                  ...styles.messageContent,
                  ...styles.messageContentBot,
                  ...styles.messageContentLoading,
                }}
              >
                <div style={styles.typingIndicator}>
                  <span
                    style={{ ...styles.typingDot, animationDelay: '-0.32s' }}
                  ></span>
                  <span
                    style={{ ...styles.typingDot, animationDelay: '-0.16s' }}
                  ></span>
                  <span style={styles.typingDot}></span>
                </div>
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={styles.chatInputForm}>
          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, ...styles.formGroupFlex }}>
              <label htmlFor='product' style={styles.formLabel}>
                Product:
              </label>
              <select
                id='product'
                value={product}
                onChange={e => setProduct(e.target.value)}
                style={styles.formInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                {products.map(prod => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.formGroup, ...styles.formGroupFlex }}>
              <label htmlFor='version' style={styles.formLabel}>
                Version (optional):
              </label>
              <input
                id='version'
                type='text'
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder='e.g., 2.1.3'
                style={styles.formInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor='question' style={styles.formLabel}>
              Your Question:
            </label>
            <textarea
              id='question'
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder='Ask your question here...'
              style={styles.questionTextarea}
              rows={3}
              required
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <button
            type='submit'
            disabled={!question.trim() || isLoading || !isInitialized}
            style={{
              ...styles.sendButton,
              ...(!question.trim() || isLoading || !isInitialized
                ? styles.sendButtonDisabled
                : {}),
            }}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            {isLoading ? 'Sending...' : 'Send Question'}
          </button>
        </form>
      </div>
    </div>
  )
}
