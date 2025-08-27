import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const DocusaurusChatbot = ({ isOpen = false, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I am RANI, Resolve's AI Support Technician. How may I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [showToast, setShowToast] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const handleClose = () => {
    console.log('Close button clicked')
    if (onClose) {
      onClose()
    }
  }

  const botResponses = [
    "That's a great question about Resolve Actions! Let me help you with that.",
    "I understand what you're looking for in Actions. Here's what I can tell you...",
    'Thanks for reaching out! Based on our Resolve Actions documentation...',
    "I'd be happy to help with that Actions feature. You might want to check our user guide...",
    "That's covered in our Actions guides. Let me point you in the right direction...",
    'Great question! You can find more details in our Actions API reference for that feature.',
    "I see what you're asking about. This is a common question about Actions functionality.",
  ]

  // Debug logging
  useEffect(() => {
    console.log('DocusaurusChatbot render - isOpen:', isOpen)
  }, [isOpen])

  const generateChatSummary = () => {
    const timestamp = new Date().toLocaleString()
    let summary = `Chat Summary for Support Ticket\n`
    summary += `Generated: ${timestamp}\n`
    summary += `Platform: Resolve Actions (via RANI AI Support Technician)\n\n`
    summary += `Conversation History:\n`
    summary += `------------------------\n`

    messages.forEach((message, index) => {
      const sender = message.sender === 'bot' ? 'RANI' : 'User'
      summary += `${sender}: ${message.text}\n\n`
    })

    summary += `------------------------\n`
    summary += `End of chat summary. Please use this context when responding to the support ticket.`

    return summary
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

      setShowToast(true)

      setTimeout(() => {
        setShowToast(false)
        window.open('https://support.resolve.io', '_blank')
      }, 3000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        window.open('https://support.resolve.io', '_blank')
      }, 3000)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = () => {
    const message = inputValue.trim()
    if (!message) return

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)]
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  // CSS styles with higher z-index and fixed positioning
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999, // Very high z-index to ensure visibility
      pointerEvents: isOpen ? 'auto' : 'none',
    },
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 10000, // Even higher z-index
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    },
    chatWindow: {
      width: '380px',
      height: '550px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      transform: isOpen
        ? 'scale(1) translateY(0)'
        : 'scale(0.8) translateY(20px)',
      opacity: isOpen ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      overflow: 'hidden',
      border: '1px solid #e1e5e9',
      pointerEvents: 'auto',
      // Add visible background for debugging
      backgroundColor: isOpen ? 'white' : 'transparent',
    },
    header: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
    },
    headerTitle: {
      margin: 0,
      fontWeight: 600,
      fontSize: '18px',
    },
    headerSubtitle: {
      margin: '5px 0 0 0',
      opacity: 0.9,
      fontSize: '14px',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '50%',
      transition: 'background 0.2s',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messagesContainer: {
      height: '280px',
      overflowY: 'auto',
      padding: '20px',
      background: '#f8f9fa',
    },
    message: {
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '18px',
      fontSize: '14px',
      lineHeight: 1.4,
    },
    botMessage: {
      background: 'white',
      color: '#2e3440',
      borderBottomLeftRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginRight: 'auto',
    },
    userMessage: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      borderBottomRightRadius: '4px',
      marginLeft: 'auto',
    },
    inputContainer: {
      padding: '20px',
      background: 'white',
      borderTop: '1px solid #e1e5e9',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    messageInput: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #e1e5e9',
      borderRadius: '25px',
      outline: 'none',
      fontSize: '14px',
      transition: 'border-color 0.2s',
    },
    sendButton: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
      fontSize: '16px',
    },
    supportFooter: {
      padding: '15px 20px',
      background: 'white',
      borderTop: '1px solid #e1e5e9',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    },
    supportButton: {
      width: '100%',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#28a745',
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
    },
  }

  // CSS for hover effects and responsive design
  const cssString = `
    .chatbot-close-button:hover {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    .chatbot-send-button:hover {
      transform: scale(1.05);
    }
    
    .chatbot-send-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .chatbot-support-button:hover {
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
      transform: translateY(-1px);
    }
    
    .chatbot-message-input:focus {
      border-color: #17a2b8;
    }
    
    .chatbot-messages::-webkit-scrollbar {
      width: 4px;
    }
    
    .chatbot-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb {
      background: #c1c7d0;
      border-radius: 2px;
    }
    
    .chatbot-messages::-webkit-scrollbar-thumb:hover {
      background: #a8b2c1;
    }
    
    @media (max-width: 420px) {
      .chatbot-window {
        width: calc(100vw - 40px) !important;
        right: 20px !important;
        left: 20px !important;
      }
    }
  `

  console.log('DocusaurusChatbot rendering, isOpen:', isOpen)

  // Create portal target
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

  const widgetContent = (
    <>
      <style>{cssString}</style>

      {/* DEBUG: Always visible test button - positioned in main content area */}
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px', // Position on the right side of main content
          zIndex: 99999,
          background: 'red',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          fontFamily: 'monospace',
          borderRadius: '4px',
          pointerEvents: 'auto',
        }}
      >
        Chatbot Loaded - isOpen: {isOpen ? 'true' : 'false'}
        <br />
        <button
          onClick={() => {
            if (isOpen) {
              onClose && onClose()
            } else {
              // Open it via global state
              if (
                window.globalChatbotState &&
                window.globalChatbotState.setIsOpen
              ) {
                window.globalChatbotState.setIsOpen(true)
              }
            }
          }}
          style={{ marginTop: '5px', padding: '5px' }}
        >
          {isOpen ? 'Close' : 'Open'} Test
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={styles.toast}>
          ✅ Chat summary copied to clipboard! Opening support portal...
        </div>
      )}

      {/* Chatbot widget with proper positioning */}
      <div
        style={{
          ...styles.overlay,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div style={styles.container}>
          <div style={styles.chatWindow} className='chatbot-window'>
            <div style={styles.header}>
              <button
                style={styles.closeButton}
                className='chatbot-close-button'
                onClick={handleClose}
                aria-label='Close chat'
              >
                ×
              </button>
              <h3 style={styles.headerTitle}>Ask RANI about Resolve Actions</h3>
              <p style={styles.headerSubtitle}>How can I help you today?</p>
            </div>

            <div style={styles.messagesContainer} className='chatbot-messages'>
              {messages.map(message => (
                <div key={message.id} style={styles.message}>
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(message.sender === 'bot'
                        ? styles.botMessage
                        : styles.userMessage),
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputContainer}>
              <input
                ref={inputRef}
                type='text'
                placeholder='Type your message...'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.messageInput}
                className='chatbot-message-input'
                maxLength={500}
              />
              <button
                style={styles.sendButton}
                className='chatbot-send-button'
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                aria-label='Send message'
              >
                ➤
              </button>
            </div>

            {/* Support Footer */}
            <div style={styles.supportFooter}>
              <button
                style={styles.supportButton}
                className='chatbot-support-button'
                onClick={handleSupportClick}
              >
                📝 Copy Chat & Create Support Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Use portal to render at document body level
  if (typeof window !== 'undefined') {
    return createPortal(widgetContent, getPortalTarget())
  }

  return widgetContent
}

export default DocusaurusChatbot
