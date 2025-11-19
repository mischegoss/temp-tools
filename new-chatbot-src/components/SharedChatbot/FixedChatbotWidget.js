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

  // Fixed default position + user customization
  const defaultPosition = { right: 20, bottom: 20 }
  const [windowPosition, setWindowPosition] = useState(defaultPosition)

  // Simple show/hide based on footer overlap
  const [isHiddenByFooter, setIsHiddenByFooter] = useState(false)

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

  // Refs for drag and resize functionality
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

  // Close chat and reset to default position
  const handleClose = () => {
    setIsOpen(false)
    // Reset to default position when closing
    setWindowPosition(defaultPosition)
    console.log('✅ Chat closed, position reset to default')
    onChatStateChange?.({ isOpen: false, product: productConfig.productName })
  }

  // Simple footer overlap detection - hide button when footer appears in button area
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkFooterOverlap = () => {
      const footer = document.querySelector('.footer')
      if (!footer) {
        setIsHiddenByFooter(false)
        return
      }

      const footerRect = footer.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Button area: 20px from bottom, with button height
      const buttonHeight = isOpen ? windowSize.height : 48
      const buttonBottom = 20
      const buttonTop = buttonBottom + buttonHeight

      // Hide if footer overlaps with button area (footer top is above button bottom)
      const footerOverlapsButton = footerRect.top < viewportHeight - buttonTop

      setIsHiddenByFooter(footerOverlapsButton)
    }

    checkFooterOverlap()
    window.addEventListener('scroll', checkFooterOverlap, { passive: true })
    window.addEventListener('resize', checkFooterOverlap)

    return () => {
      window.removeEventListener('scroll', checkFooterOverlap)
      window.removeEventListener('resize', checkFooterOverlap)
    }
  }, [isOpen, windowSize])

  // Ensure position reset when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setWindowPosition(defaultPosition)
    }
  }, [isOpen])

  // Drag functionality with simple constraints
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

      // Simple viewport constraints - no complex footer logic during drag
      const newRight = Math.max(
        10,
        Math.min(
          window.innerWidth - windowSize.width - 10,
          dragStartWindowPos.current.right - deltaX,
        ),
      )

      const newBottom = Math.max(
        20, // Simple minimum bottom
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

  // Resize functionality with position adjustments
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

      // Keep within viewport bounds
      newRight = Math.max(
        10,
        Math.min(window.innerWidth - newWidth - 10, newRight),
      )
      newBottom = Math.max(
        20,
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

  // Global mouse event handlers for drag and resize
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
      // Simple hide when footer overlaps
      opacity: isHiddenByFooter ? 0 : 1,
      visibility: isHiddenByFooter ? 'hidden' : 'visible',
      transition: 'opacity 0.3s ease',
    },
    widget: {
      width: isOpen ? `${windowSize.width}px` : '120px',
      height: isOpen ? `${windowSize.height}px` : '48px',
      transition:
        isOpen && !isDragging && !isResizing
          ? 'none'
          : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      borderRadius: isOpen ? '12px' : '24px',
      overflow: 'hidden',
      boxShadow: isOpen
        ? '0 8px 32px rgba(0, 0, 0, 0.12)'
        : `0 4px 20px ${
            productConfig.shadowColor || 'rgba(23, 162, 184, 0.4)'
          }`,
      position: 'relative',
      cursor: isOpen && !isResizing && !isDragging ? 'default' : 'pointer',
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

      <div
        style={styles.widget}
        onClick={!isOpen ? handleOpen : undefined}
        ref={chatWindowRef}
      >
        {isOpen ? (
          <>
            <ChatWindow
              {...chatHookProps}
              productConfig={productConfig}
              onClose={handleClose}
              onDragStart={handleDragStart}
              windowSize={windowSize}
              isDragging={isDragging}
              isResizing={isResizing}
            />
            {/* Resize handles for desktop */}
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
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleLeft,
                  }}
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
                  onMouseDown={e => handleResizeStart(e, 'top-left')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleTopRight,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'top-right')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleBottomLeft,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'bottom-left')}
                />
                <div
                  style={{
                    ...styles.resizeHandle,
                    ...styles.resizeHandleBottomRight,
                  }}
                  onMouseDown={e => handleResizeStart(e, 'bottom-right')}
                />
              </>
            )}
          </>
        ) : (
          <ChatbotButton
            productConfig={productConfig}
            onClick={handleOpen}
            size='medium'
          />
        )}
      </div>
    </div>
  )
}

export default function FixedChatbotWidget(props) {
  return (
    <BrowserOnly fallback={<div></div>}>
      {() => <FixedChatbotWidgetComponent {...props} />}
    </BrowserOnly>
  )
}
