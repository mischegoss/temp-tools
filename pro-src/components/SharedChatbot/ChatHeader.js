// src/components/SharedChatbot/ChatHeader.js
// Enhanced ChatHeader with drag functionality and window size display

import React, { useState } from 'react'

const ChatHeader = ({
  productConfig,
  pageContext,
  messages = [],
  onClose,
  onDragStart = () => {},
  handleClearChat,
  isCompactHeader = true,
  windowSize = { width: 380, height: 600 },
  isDragging = false,
}) => {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false)

  // Count user messages for display
  const userMessageCount = messages.filter(msg => msg.sender === 'user').length

  const styles = {
    // Compact header with drag support
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
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
    },
    // Compact header content
    compactHeaderLeft: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '2px',
      pointerEvents: 'none', // Prevent drag interference
    },
    compactHeaderTitle: {
      fontSize: '14px',
      fontWeight: '600',
      margin: 0,
    },
    compactHeaderSubtitle: {
      fontSize: '11px',
      opacity: 0.9,
      margin: 0,
      background: 'rgba(255,255,255,0.2)',
      padding: '2px 6px',
      borderRadius: '8px',
      fontWeight: '500',
    },
    compactHeaderCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      pointerEvents: 'none',
    },
    windowSizeIndicator: {
      fontSize: '10px',
      opacity: 0.7,
      background: 'rgba(255,255,255,0.15)',
      padding: '1px 4px',
      borderRadius: '4px',
      fontWeight: '400',
    },
    compactHeaderRight: {
      display: 'flex',
      gap: '6px',
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
    // Full header (when expanded)
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
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
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

    .chat-header-draggable {
      cursor: ${isDragging ? 'grabbing !important' : 'grab !important'};
    }

    .chat-header-draggable * {
      cursor: ${isDragging ? 'grabbing !important' : 'grab !important'};
    }
  `

  const handleHeaderClick = () => {
    if (isCompactHeader) {
      setIsHeaderExpanded(!isHeaderExpanded)
    }
  }

  // Show compact header by default (for fixed widget)
  if (isCompactHeader || userMessageCount > 0) {
    return (
      <>
        <style>{cssString}</style>
        <div
          style={styles.headerCompact}
          className='chat-header-draggable'
          onMouseDown={onDragStart}
        >
          <div style={styles.compactHeaderLeft} onClick={handleHeaderClick}>
            <div style={styles.compactHeaderTitle}>
              {productConfig?.icon || '💬'}{' '}
              {productConfig?.productName || 'Assistant'}
            </div>
            {userMessageCount > 0 && (
              <div style={styles.compactHeaderSubtitle}>
                {userMessageCount}{' '}
                {userMessageCount === 1 ? 'question' : 'questions'}
              </div>
            )}
          </div>

          {windowSize && (
            <div style={styles.compactHeaderCenter}>
              <div style={styles.windowSizeIndicator}>
                {windowSize.width}×{windowSize.height}
              </div>
            </div>
          )}

          <div style={styles.compactHeaderRight}>
            <button
              style={styles.compactHeaderButton}
              className='compact-header-button'
              onClick={handleClearChat}
              title='Clear chat'
            >
              🗑️
            </button>
            <button
              style={styles.compactHeaderButton}
              className='compact-header-button'
              onClick={onClose}
              title='Close chat'
            >
              ✕
            </button>
          </div>
        </div>
      </>
    )
  }

  // Show full header (for modal or initial state)
  return (
    <>
      <style>{cssString}</style>
      <div style={styles.headerFull} onMouseDown={onDragStart}>
        <div style={styles.icon}>{productConfig?.icon || '💬'}</div>
        <h3 style={styles.headerTitle}>
          {productConfig?.welcomeMessage?.split('.')[0] ||
            `${productConfig?.productName || 'AI'} Assistant`}
        </h3>
        <p style={styles.headerSubtitle}>
          {pageContext?.title
            ? `Ask me about "${pageContext.title}"`
            : productConfig?.placeholderText ||
              'Ask me anything about the documentation'}
        </p>
      </div>
    </>
  )
}

export default ChatHeader
