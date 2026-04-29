// src/components/SharedChatbot/FixedChatbotWidget.js
// FIXED: Removed confirmation dialog for clear chat
// REMOVED: Drag functionality (kept resize functionality)

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

  // Resize state only (removed drag state)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [windowSize, setWindowSize] = useState({ width: 380, height: 600 })

  // Fixed position - no dragging
  const fixedPosition = { right: 20, bottom: 20 }

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

  // Refs for resize functionality only
  const chatWindowRef = useRef(null)
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

  // Close chat
  const handleClose = () => {
    setIsOpen(false)
    console.log('✅ Chat closed')
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

  // Resize functionality (kept all resize functions)
  const handleResizeStart = useCallback(
    (e, direction) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setResizeDirection(direction)
      resizeStartPos.current = { x: e.clientX, y: e.clientY }
      resizeStartSize.current = { ...windowSize }
    },
    [windowSize],
  )

  const handleResizeMove = useCallback(
    e => {
      if (!isResizing || !resizeDirection) return

      const deltaX = e.clientX - resizeStartPos.current.x
      const deltaY = e.clientY - resizeStartPos.current.y

      let newWidth = resizeStartSize.current.width
      let newHeight = resizeStartSize.current.height

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth + deltaX))
      }
      if (resizeDirection.includes('left')) {
        const widthChange = Math.max(
          MIN_WIDTH - newWidth,
          Math.min(MAX_WIDTH - newWidth, -deltaX),
        )
        newWidth += widthChange
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, newHeight + deltaY),
        )
      }
      if (resizeDirection.includes('top')) {
        const heightChange = Math.max(
          MIN_HEIGHT - newHeight,
          Math.min(MAX_HEIGHT - newHeight, -deltaY),
        )
        newHeight += heightChange
      }

      setWindowSize({ width: newWidth, height: newHeight })
    },
    [isResizing, resizeDirection],
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeDirection('')
  }, [])

  // Global mouse event handlers for resize only (removed drag handlers)
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const styles = {
    container: {
      position: 'fixed',
      right: `${fixedPosition.right}px`,
      bottom: `${fixedPosition.bottom}px`,
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
        isOpen && !isResizing
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
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    resizeHandle: {
      position: 'absolute',
      background: 'transparent',
      zIndex: 10,
    },
    resizeHandleTop: {
      top: '-4px',
      left: '8px',
      right: '8px',
      height: '8px',
      cursor: 'n-resize',
    },
    resizeHandleBottom: {
      bottom: '-4px',
      left: '8px',
      right: '8px',
      height: '8px',
      cursor: 's-resize',
    },
    resizeHandleLeft: {
      left: '-4px',
      top: '8px',
      bottom: '8px',
      width: '8px',
      cursor: 'w-resize',
    },
    resizeHandleRight: {
      right: '-4px',
      top: '8px',
      bottom: '8px',
      width: '8px',
      cursor: 'e-resize',
    },
    resizeHandleTopLeft: {
      top: '-4px',
      left: '-4px',
      width: '12px',
      height: '12px',
      cursor: 'nw-resize',
    },
    resizeHandleTopRight: {
      top: '-4px',
      right: '-4px',
      width: '12px',
      height: '12px',
      cursor: 'ne-resize',
    },
    resizeHandleBottomLeft: {
      bottom: '-4px',
      left: '-4px',
      width: '12px',
      height: '12px',
      cursor: 'sw-resize',
    },
    resizeHandleBottomRight: {
      bottom: '-4px',
      right: '-4px',
      width: '12px',
      height: '12px',
      cursor: 'se-resize',
    },
  }

  return (
    <div style={styles.container}>
      {/* Toast notification matching copy chat style */}
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
              handleClearChat={handleClearChat}
              windowSize={windowSize}
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
