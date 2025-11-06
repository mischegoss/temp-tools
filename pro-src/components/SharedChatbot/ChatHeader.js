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
      pointerEvents: 'auto', // Allow button clicks
    },
    messageCount: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.8)',
      pointerEvents: 'none',
    },
    dragHint: {
      fontSize: '10px',
      opacity: 0.6,
      fontStyle: 'italic',
      pointerEvents: 'none',
    },
  }

  const cssString = `
    .compact-header-button:hover {
      background: rgba(255,255,255,0.3) !important;
    }
    
    .compact-header-button:active {
      background: rgba(255,255,255,0.4) !important;
    }

    .chat-header-draggable:hover .window-size-indicator {
      opacity: 1 !important;
    }

    .chat-header-draggable:active {
      cursor: grabbing !important;
    }
  `

  const handleMouseDown = e => {
    // Only start drag if clicking on the header background, not buttons
    if (e.target.closest('.compact-header-button')) {
      return
    }
    onDragStart(e)
  }

  return (
    <>
      <style>{cssString}</style>
      <div
        style={styles.headerCompact}
        className='chat-header-draggable'
        onMouseDown={handleMouseDown}
        title='Drag to move window'
      >
        <div style={styles.compactHeaderLeft}>
          <h3 style={styles.compactHeaderTitle}>Ask RANI</h3>
          <div style={styles.compactHeaderSubtitle}>
            {productConfig?.productName || 'Documentation'} Help
          </div>
        </div>

        <div style={styles.compactHeaderCenter}>
          {/* Removed window size indicator */}
        </div>

        <div style={styles.compactHeaderRight}>
          {/* Message count indicator */}
          {userMessageCount > 0 && (
            <div style={styles.messageCount}>
              {userMessageCount} message{userMessageCount !== 1 ? 's' : ''}
            </div>
          )}

          {/* Clear chat button - only show if there are messages */}
          {messages.length > 0 && (
            <button
              style={styles.compactHeaderButton}
              className='compact-header-button'
              onClick={handleClearChat}
              title='Clear conversation'
              aria-label='Clear conversation'
            >
              🗑️
            </button>
          )}

          {/* Close button */}
          <button
            style={styles.compactHeaderButton}
            className='compact-header-button'
            onClick={onClose}
            title='Close chat'
            aria-label='Close chat'
          >
            ×
          </button>
        </div>
      </div>
    </>
  )
}

export default ChatHeader
