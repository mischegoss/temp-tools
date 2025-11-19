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
      minWidth: 0,
    },
    compactHeaderTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      lineHeight: '1.2',
    },
    compactHeaderSubtitle: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.2',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    compactHeaderRight: {
      display: 'flex',
      gap: '8px',
      flexShrink: 0,
    },
    compactHeaderButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      transition: 'background 0.2s',
    },
    headerFull: {
      background:
        productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      padding: '24px',
      textAlign: 'center',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      userSelect: 'none',
      cursor: isDragging ? 'grabbing' : 'grab',
    },
    icon: {
      fontSize: '24px',
      marginBottom: '8px',
    },
    headerTitle: {
      margin: '0 0 8px 0',
      fontSize: '18px',
      fontWeight: '600',
      color: 'white',
    },
    headerSubtitle: {
      margin: 0,
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.4',
    },
  }

  const cssString = `
    .compact-header-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }

    .compact-header-button:active {
      background: rgba(255, 255, 255, 0.4) !important;
    }

    .chat-header-draggable {
      cursor: ${isDragging ? 'grabbing !important' : 'grab !important'};
    }

    .header-drag-zone {
      cursor: ${isDragging ? 'grabbing !important' : 'grab !important'};
    }

    .beta-tag {
      background: #007bff;
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 6px;
      margin-left: 6px;
      display: inline-block;
      vertical-align: middle;
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
              <span className='beta-tag'>BETA</span>
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
