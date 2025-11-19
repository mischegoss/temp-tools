// src/components/SharedChatbot/ChatHeader.js
// FIXED: Removed sizing indicator, fixed placeholder text

import React, { useState } from 'react'

const ChatHeader = ({
  productConfig,
  pageContext,
  messages = [],
  onClose,
  onDragStart = () => {},
  handleClearChat = () => {},
  isCompactHeader = true,
  windowSize = { width: 380, height: 600 },
  isDragging = false,
}) => {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false)

  const userMessageCount = messages.filter(msg => msg.sender === 'user').length

  const styles = {
    headerCompact: {
      background:
        productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      userSelect: 'none',
    },
    compactHeaderLeft: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '2px',
      cursor: isDragging ? 'grabbing' : 'grab',
      flex: 1,
    },
    compactHeaderTitle: {
      fontSize: '14px',
      fontWeight: '600',
      margin: 0,
      pointerEvents: 'none',
    },
    compactHeaderSubtitle: {
      fontSize: '11px',
      opacity: 0.9,
      margin: 0,
      background: 'rgba(255,255,255,0.2)',
      padding: '2px 6px',
      borderRadius: '8px',
      fontWeight: '500',
      pointerEvents: 'none',
    },
    // REMOVED: compactHeaderCenter and windowSizeIndicator
    compactHeaderRight: {
      display: 'flex',
      gap: '6px',
      pointerEvents: 'auto',
    },
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
      pointerEvents: 'auto',
      position: 'relative',
      zIndex: 11,
    },
    headerFull: {
      background:
        productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
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
    icon: {
      fontSize: '20px',
      marginBottom: '4px',
    },
  }

  const cssString = `
    .compact-header-button:hover {
      background: rgba(255,255,255,0.3) !important;
    }

    .compact-header-button:active {
      background: rgba(255,255,255,0.4) !important;
    }

    .chat-header-draggable {
      cursor: ${isDragging ? 'grabbing !important' : 'grab !important'};
    }

    .header-drag-zone {
      cursor: ${isDragging ? 'grabbing !important' : 'grab !important'};
    }
  `

  const handleHeaderClick = e => {
    const isButton = e.target.closest('button')
    if (isButton) return

    if (isCompactHeader) {
      setIsHeaderExpanded(!isHeaderExpanded)
    }
  }

  const handleDragStartEvent = e => {
    if (
      e.target.closest('button') ||
      e.target.closest('.compact-header-button')
    ) {
      console.log('🚫 Drag prevented - button clicked')
      e.preventDefault()
      e.stopPropagation()
      return
    }

    console.log('✅ Starting drag from header')
    onDragStart(e)
  }

  const handleClearButtonClick = e => {
    console.log('🗑️ Clear button clicked in ChatHeader')
    e.preventDefault()
    e.stopPropagation()

    if (typeof handleClearChat === 'function') {
      handleClearChat()
    } else {
      console.error('❌ handleClearChat is not a function:', handleClearChat)
    }
  }

  const handleCloseButtonClick = e => {
    console.log('✕ Close button clicked in ChatHeader')
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  if (isCompactHeader || userMessageCount > 0) {
    return (
      <>
        <style>{cssString}</style>
        <div style={styles.headerCompact} className='chat-header-draggable'>
          <div
            style={styles.compactHeaderLeft}
            className='header-drag-zone'
            onMouseDown={handleDragStartEvent}
            onClick={handleHeaderClick}
          >
            <div style={styles.compactHeaderTitle}>
              {productConfig?.icon && <span>{productConfig.icon} </span>}
              {productConfig?.productName || 'Assistant'}
            </div>
            {userMessageCount > 0 && (
              <div style={styles.compactHeaderSubtitle}>
                {userMessageCount}{' '}
                {userMessageCount === 1 ? 'question' : 'questions'}
              </div>
            )}
          </div>

          {/* REMOVED: Center section with sizing */}

          <div style={styles.compactHeaderRight}>
            <button
              style={styles.compactHeaderButton}
              className='compact-header-button'
              onClick={handleClearButtonClick}
              title='Clear chat'
              type='button'
            >
              🗑️
            </button>
            <button
              style={styles.compactHeaderButton}
              className='compact-header-button'
              onClick={handleCloseButtonClick}
              title='Close chat'
              type='button'
            >
              ✕
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{cssString}</style>
      <div
        style={styles.headerFull}
        onMouseDown={handleDragStartEvent}
        className='chat-header-draggable'
      >
        <div style={styles.icon}>{productConfig?.icon || '💬'}</div>
        <h3 style={styles.headerTitle}>
          {productConfig?.welcomeMessage?.split('.')[0] ||
            `Ask RANI about Resolve ${
              productConfig?.productName || 'Documentation'
            }`}
        </h3>
        <p style={styles.headerSubtitle}>How can I help you today?</p>
      </div>
    </>
  )
}

export default ChatHeader
