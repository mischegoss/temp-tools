// src/components/SharedChatbot/FixedChatbotWidget.js
// FIXED: Removed confirmation dialog for clear chat

import React, { useState, useRef, useCallback, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import ChatWindow from './ChatWindow'
import ChatbotButton from './ChatbotButton'
import { useSharedChatbot } from './hooks/useSharedChatbot'

const FixedChatbotWidgetComponent = ({
  productConfig,
  apiService,
  onChatStateChange = null,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Drag and resize state
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [windowSize, setWindowSize] = useState({ width: 380, height: 600 })

  // Track original and current positions separately
  const originalPosition = { right: 20, bottom: 80 }
  const [windowPosition, setWindowPosition] = useState(originalPosition)

  // Integrate chat functionality
  const chatHookProps = useSharedChatbot(productConfig, apiService)

  // Destructure toast props for display
  const { showToast, toastMessage, toastType } = chatHookProps

  // FIXED: Removed confirmation dialog - clear immediately with toast notification
  const handleClearChat = useCallback(() => {
    console.log('🗑️ handleClearChat called from FixedChatbotWidget')
    console.log('✅ Clearing conversation immediately')
    chatHookProps.clearConversation() // This will show the toast notification
  }, [chatHookProps.clearConversation])

  // Refs for drag/resize functionality
  const chatWindowRef = useRef(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const dragStartWindowPos = useRef({ right: 0, bottom: 0 })
  const resizeStartPos = useRef({ x: 0, y: 0 })
  const resizeStartSize = useRef({ width: 0, height: 0 })

  // Window constraints
  const MIN_WIDTH = 300
  const MIN_HEIGHT = 400
  const MAX_WIDTH = 800
  const MAX_HEIGHT = 800

  const handleOpen = () => {
    setIsOpen(true)
    setHasInteracted(true)
    onChatStateChange?.({ isOpen: true, product: productConfig.productName })
  }

  // Reset to original position when closing
  const handleClose = () => {
    setIsOpen(false)
    // Reset to original position when closing
    setWindowPosition(originalPosition)
    console.log('✅ Chat closed, position reset to original')
    onChatStateChange?.({ isOpen: false, product: productConfig.productName })
  }

  // Position management with bounds checking
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkPosition = () => {
      const buttonWidth = isOpen ? windowSize.width : 240
      const buttonHeight = isOpen ? windowSize.height : 96

      const maxRight = window.innerWidth - buttonWidth
      const maxBottom = window.innerHeight - buttonHeight

      setWindowPosition(prev => ({
        right: Math.max(10, Math.min(maxRight - 10, prev.right)),
        bottom: Math.max(80, Math.min(maxBottom - 10, prev.bottom)),
      }))
    }

    checkPosition()
    window.addEventListener('resize', checkPosition)
    return () => window.removeEventListener('resize', checkPosition)
  }, [isOpen, windowSize])

  // Reset position when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setWindowPosition(originalPosition)
    }
  }, [isOpen])

  // Improved drag functionality with better button exclusion
  const handleDragStart = useCallback(
    e => {
      if (!isOpen || isResizing) return

      const target = e.target
      const isButton =
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('.compact-header-button')

      if (isButton) {
        console.log('🚫 Drag blocked - button clicked:', target)
        e.preventDefault()
        e.stopPropagation()
        return
      }

      const isHeaderArea =
        target.closest('.chat-header-draggable') ||
        target.closest('.header-drag-zone')

      if (!isHeaderArea) {
        console.log('🚫 Drag blocked - not in header area')
        return
      }

      console.log('✅ Drag started from valid area')
      setIsDragging(true)
      dragStartPos.current = { x: e.clientX, y: e.clientY }
      dragStartWindowPos.current = { ...windowPosition }

      e.preventDefault()
    },
    [isOpen, isResizing, windowPosition],
  )

  const handleDragMove = useCallback(
    e => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y

      const newRight = Math.max(
        10,
        Math.min(
          window.innerWidth - windowSize.width - 10,
          dragStartWindowPos.current.right - deltaX,
        ),
      )

      const newBottom = Math.max(
        80,
        Math.min(
          window.innerHeight - windowSize.height - 10,
          dragStartWindowPos.current.bottom - deltaY,
        ),
      )

      setWindowPosition({ right: newRight, bottom: newBottom })
    },
    [isDragging, windowSize],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    console.log('✅ Drag ended')
  }, [])

  // Resize functionality
  const handleResizeStart = useCallback(
    (e, direction) => {
      if (!isOpen) return

      setIsResizing(true)
      setResizeDirection(direction)
      resizeStartPos.current = { x: e.clientX, y: e.clientY }
      resizeStartSize.current = { ...windowSize }

      e.preventDefault()
      e.stopPropagation()
    },
    [isOpen, windowSize],
  )

  const handleResizeMove = useCallback(
    e => {
      if (!isResizing) return

      const deltaX = e.clientX - resizeStartPos.current.x
      const deltaY = e.clientY - resizeStartPos.current.y

      let newWidth = resizeStartSize.current.width
      let newHeight = resizeStartSize.current.height
      let newRight = windowPosition.right
      let newBottom = windowPosition.bottom

      if (resizeDirection.includes('left')) {
        newWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, resizeStartSize.current.width - deltaX),
        )
        newRight =
          windowPosition.right + (resizeStartSize.current.width - newWidth)
      }
      if (resizeDirection.includes('right')) {
        newWidth = Math.max(
          MIN_WIDTH,
          Math.min(MAX_WIDTH, resizeStartSize.current.width + deltaX),
        )
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, resizeStartSize.current.height - deltaY),
        )
        newBottom =
          windowPosition.bottom + (resizeStartSize.current.height - newHeight)
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, resizeStartSize.current.height + deltaY),
        )
      }

      newRight = Math.max(
        10,
        Math.min(window.innerWidth - newWidth - 10, newRight),
      )
      newBottom = Math.max(
        80,
        Math.min(window.innerHeight - newHeight - 10, newBottom),
      )

      setWindowSize({ width: newWidth, height: newHeight })
      setWindowPosition({ right: newRight, bottom: newBottom })
    },
    [isResizing, resizeDirection, windowPosition],
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeDirection('')
  }, [])

  // Global mouse event handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [
    isDragging,
    isResizing,
    handleDragMove,
    handleDragEnd,
    handleResizeMove,
    handleResizeEnd,
  ])

  const styles = {
    container: {
      position: 'fixed',
      right: `${windowPosition.right}px`,
      bottom: `${windowPosition.bottom}px`,
      zIndex: 9999,
      fontFamily: 'var(--ifm-font-family-base)',
    },
    widget: {
      width: isOpen ? `${windowSize.width}px` : '240px',
      height: isOpen ? `${windowSize.height}px` : '96px',
      transition:
        isOpen && !isDragging && !isResizing
          ? 'none'
          : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      borderRadius: isOpen ? '12px' : '48px',
      overflow: 'hidden',
      boxShadow: isOpen
        ? '0 8px 32px rgba(0, 0, 0, 0.12)'
        : `0 4px 20px ${
            productConfig.shadowColor || 'rgba(23, 162, 184, 0.4)'
          }`,
      position: 'relative',
      cursor: isOpen && !isResizing ? 'default' : 'pointer',
    },
    // Toast style matches copy chat notification
    toastStyle: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: toastType === 'success' ? '#28a745' : '#dc3545',
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
      maxWidth: '400px',
    },
    // Resize handles
    resizeHandle: {
      position: 'absolute',
      background: 'transparent',
      zIndex: 10,
    },
    resizeHandleTop: {
      top: 0,
      left: '8px',
      right: '8px',
      height: '8px',
      cursor: 'ns-resize',
    },
    resizeHandleBottom: {
      bottom: 0,
      left: '8px',
      right: '8px',
      height: '8px',
      cursor: 'ns-resize',
    },
    resizeHandleLeft: {
      left: 0,
      top: '8px',
      bottom: '8px',
      width: '8px',
      cursor: 'ew-resize',
    },
    resizeHandleRight: {
      right: 0,
      top: '8px',
      bottom: '8px',
      width: '8px',
      cursor: 'ew-resize',
    },
    resizeHandleTopLeft: {
      top: 0,
      left: 0,
      width: '8px',
      height: '8px',
      cursor: 'nw-resize',
    },
    resizeHandleTopRight: {
      top: 0,
      right: 0,
      width: '8px',
      height: '8px',
      cursor: 'ne-resize',
    },
    resizeHandleBottomLeft: {
      bottom: 0,
      left: 0,
      width: '8px',
      height: '8px',
      cursor: 'sw-resize',
    },
    resizeHandleBottomRight: {
      bottom: 0,
      right: 0,
      width: '8px',
      height: '8px',
      cursor: 'se-resize',
    },
  }

  // Mobile responsiveness - full screen on small devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480

  if (isMobile && isOpen) {
    styles.container = {
      ...styles.container,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
    styles.widget = {
      ...styles.widget,
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      zIndex: 10000,
    }
  }

  return (
    <div style={styles.container}>
      {/* Toast notification uses same UI for all actions */}
      {showToast && (
        <div style={styles.toastStyle}>
          {toastType === 'success' ? '✅' : '❌'} {toastMessage}
        </div>
      )}

      <div style={styles.widget} ref={chatWindowRef}>
        {isOpen ? (
          <>
            {/* Resize handles - only on desktop */}
            {!isMobile && (
              <>
                <div
                  style={{ ...styles.resizeHandle, ...styles.resizeHandleTop }}
                  onMouseDown={e => handleResizeStart(e, 'top')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleBottom,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'bottom')}
                />
                <div
                  style={{ ...styles.resizeHandle, ...styles.resizeHandleLeft }}
                  onMouseDown={e => handleResizeStart(e, 'left')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleRight,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'right')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleTopLeft,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'topleft')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleTopRight,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'topright')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleBottomLeft,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'bottomleft')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleBottomRight,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'bottomright')}
                />
              </>
            )}

            <ChatWindow
              productConfig={productConfig}
              apiService={apiService}
              onClose={handleClose}
              onDragStart={handleDragStart}
              isCompactMode={true}
              hasInteracted={hasInteracted}
              windowSize={windowSize}
              isDragging={isDragging}
              isResizing={isResizing}
              handleClearChat={handleClearChat}
              {...chatHookProps}
            />
          </>
        ) : (
          <ChatbotButton
            productConfig={productConfig}
            onClick={handleOpen}
            size='large'
          />
        )}
      </div>
    </div>
  )
}

// Wrap with BrowserOnly for SSR compatibility
const FixedChatbotWidget = props => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <FixedChatbotWidgetComponent {...props} />}
    </BrowserOnly>
  )
}

export default FixedChatbotWidget
