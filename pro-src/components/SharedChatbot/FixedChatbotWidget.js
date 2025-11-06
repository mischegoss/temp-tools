// src/components/SharedChatbot/FixedChatbotWidget.js
// Fixed bottom-right chatbot widget with drag-to-resize functionality

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
  const [windowPosition, setWindowPosition] = useState({
    right: 20,
    bottom: 20,
  })

  // Integrate chat functionality
  const chatHookProps = useSharedChatbot(productConfig, apiService)

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

  const handleClose = () => {
    setIsOpen(false)
    onChatStateChange?.({ isOpen: false, product: productConfig.productName })
  }

  // Ensure button stays within viewport on mount/resize
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkPosition = () => {
      const buttonWidth = isOpen ? windowSize.width : 120 // Back to 120px width
      const buttonHeight = isOpen ? windowSize.height : 48 // 48px height

      const maxRight = window.innerWidth - buttonWidth
      const maxBottom = window.innerHeight - buttonHeight

      setWindowPosition(prev => ({
        right: Math.max(10, Math.min(maxRight - 10, prev.right)),
        bottom: Math.max(10, Math.min(maxBottom - 10, prev.bottom)),
      }))
    }

    checkPosition()
    window.addEventListener('resize', checkPosition)
    return () => window.removeEventListener('resize', checkPosition)
  }, [isOpen, windowSize])

  // Drag functionality
  const handleDragStart = useCallback(
    e => {
      if (!isOpen || isResizing) return

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
        0,
        Math.min(
          window.innerWidth - windowSize.width,
          dragStartWindowPos.current.right - deltaX,
        ),
      )

      const newBottom = Math.max(
        0,
        Math.min(
          window.innerHeight - windowSize.height,
          dragStartWindowPos.current.bottom - deltaY,
        ),
      )

      setWindowPosition({ right: newRight, bottom: newBottom })
    },
    [isDragging, windowSize],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
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

      // Ensure window stays within viewport
      newRight = Math.max(0, Math.min(window.innerWidth - newWidth, newRight))
      newBottom = Math.max(
        0,
        Math.min(window.innerHeight - newHeight, newBottom),
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
    // Widget with dynamic sizing - corrected proportions
    widget: {
      width: isOpen ? `${windowSize.width}px` : '120px', // Back to reasonable width
      height: isOpen ? `${windowSize.height}px` : '48px', // Slightly taller than original
      transition:
        isOpen && !isDragging && !isResizing ? 'none' : 'all 0.3s ease',
      borderRadius: isOpen ? '16px' : '24px', // Perfect oval (half of height)
      overflow: 'hidden',
      boxShadow: isOpen
        ? '0 8px 30px rgba(0,0,0,0.15)'
        : `0 4px 20px ${
            productConfig.shadowColor || 'rgba(23, 162, 184, 0.4)'
          }`,
      position: 'relative',
      cursor: isOpen && !isResizing ? 'default' : 'pointer',
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
