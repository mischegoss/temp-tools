// src/components/Chatbot/ChatHeader.js
import React, { useState } from 'react'

const ChatHeader = ({
  isCompactHeader,
  pageContext,
  messages,
  onClose,
  handleClearChat,
}) => {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false)

  // Count user messages for display
  const userMessageCount = messages.filter(msg => msg.sender === 'user').length

  const styles = {
    // Full header (initial state)
    headerFull: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    },
    // Compact header (after messages)
    headerCompact: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    },
    headerTitle: {
      margin: '0 0 8px 0',
      fontSize: '18px',
      fontWeight: '600',
    },
    headerSubtitle: {
      margin: 0,
      fontSize: '14px',
      opacity: 0.9,
    },
    // Compact header content
    compactHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
    },
    compactHeaderRight: {
      display: 'flex',
      gap: '8px',
    },
    // Full header buttons
    headerButtons: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      display: 'flex',
      gap: '8px',
    },
    headerButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    // Compact header buttons
    compactHeaderButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      width: '28px',
      height: '28px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
  }

  const cssString = `
    .chatbot-header-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  `

  // Toggle between compact and full header
  const toggleHeaderExpansion = () => {
    setIsHeaderExpanded(!isHeaderExpanded)
  }

  // Determine which header to show
  const shouldShowCompactHeader = isCompactHeader && !isHeaderExpanded

  if (shouldShowCompactHeader) {
    // Compact Header
    return (
      <>
        <style>{cssString}</style>
        <div style={styles.headerCompact}>
          <div style={styles.compactHeaderLeft}>
            <span>RANI</span>
            <span style={{ opacity: 0.7, fontSize: '12px' }}>•</span>
            <span style={{ opacity: 0.7, fontSize: '12px' }}>
              {pageContext?.title || 'Resolve Actions'}
            </span>
            {userMessageCount > 0 && (
              <>
                <span style={{ opacity: 0.7, fontSize: '12px' }}>•</span>
                <span style={{ opacity: 0.7, fontSize: '12px' }}>
                  {userMessageCount} message{userMessageCount !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
          <div style={styles.compactHeaderRight}>
            <button
              style={styles.compactHeaderButton}
              className='chatbot-header-button'
              onClick={toggleHeaderExpansion}
              title='Expand header'
            >
              ↕
            </button>
            {/* MINIMAL CHANGE: Add trash can button to compact header */}
            <button
              style={styles.compactHeaderButton}
              className='chatbot-header-button'
              onClick={handleClearChat}
              title='Clear chat'
            >
              🗑️
            </button>
            <button
              style={styles.compactHeaderButton}
              className='chatbot-header-button'
              onClick={onClose}
              title='Close chat'
            >
              ×
            </button>
          </div>
        </div>
      </>
    )
  }

  // Full Header
  return (
    <>
      <style>{cssString}</style>
      <div style={styles.headerFull}>
        <div style={styles.headerButtons}>
          {isCompactHeader && (
            <button
              style={styles.headerButton}
              className='chatbot-header-button'
              onClick={toggleHeaderExpansion}
              title='Minimize header'
            >
              ↕
            </button>
          )}
          {/* MINIMAL CHANGE: Add trash can button to full header */}
          <button
            style={styles.headerButton}
            className='chatbot-header-button'
            onClick={handleClearChat}
            title='Clear chat'
          >
            🗑️
          </button>
          <button
            style={styles.headerButton}
            className='chatbot-header-button'
            onClick={onClose}
            title='Close chat'
          >
            ×
          </button>
        </div>
        <h3 style={styles.headerTitle}>Ask RANI about Resolve Actions</h3>
        {/* MINIMAL CHANGE: Remove context message from header subtitle */}
        <p style={styles.headerSubtitle}>How can I help you today?</p>
      </div>
    </>
  )
}

export default ChatHeader
