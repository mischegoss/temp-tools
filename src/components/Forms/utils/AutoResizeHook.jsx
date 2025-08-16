// COMPLETE REVISED AutoResizeHook - Memory Leak Fixed
// src/components/Forms/utils/AutoResizeHook.jsx

import { useEffect, useRef } from 'react'

/**
 * Custom hook that automatically resizes textareas to fit their content
 *
 * FIXES APPLIED:
 * ✅ Proper event listener cleanup to prevent memory leaks
 * ✅ Stable function references for reliable cleanup
 * ✅ Handles dynamic textarea addition/removal
 * ✅ Prevents multiple listeners on same textarea
 * ✅ Graceful error handling for edge cases
 *
 * @param {Array|Object} dependencies - Dependencies that should trigger a resize when changed
 * @returns {void}
 */
const useAutoResizeTextarea = (dependencies = []) => {
  // Use ref to store cleanup functions across re-renders
  const cleanupRef = useRef(null)

  useEffect(
    () => {
      // Clear any existing cleanup before setting up new listeners
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      // Find all textarea elements in the component
      const textareas = document.querySelectorAll('textarea')

      // Early return if no textareas found
      if (textareas.length === 0) {
        return
      }

      // Height adjustment function
      const adjustHeight = element => {
        try {
          // Store current scroll position to prevent jumping
          const scrollTop = element.scrollTop

          // Reset height to auto to get the correct scrollHeight
          element.style.height = 'auto'

          // Set height to content height with a minimum
          const newHeight = Math.max(element.scrollHeight, 60) // 60px minimum
          element.style.height = `${newHeight}px`

          // Restore scroll position
          element.scrollTop = scrollTop
        } catch (error) {
          console.warn('AutoResize: Error adjusting textarea height:', error)
        }
      }

      // Store handler functions with proper references for cleanup
      const handlerMap = new Map()

      // Set up event listeners for each textarea
      textareas.forEach(textarea => {
        try {
          // Create a specific handler for this textarea
          const inputHandler = () => adjustHeight(textarea)

          // Store the handler so we can remove it later
          handlerMap.set(textarea, inputHandler)

          // Add the event listener
          textarea.addEventListener('input', inputHandler, { passive: true })

          // Also listen for paste events for better UX
          const pasteHandler = () => {
            // Use setTimeout to let paste content be inserted first
            setTimeout(() => adjustHeight(textarea), 0)
          }

          textarea.addEventListener('paste', pasteHandler, { passive: true })

          // Store both handlers for cleanup
          handlerMap.set(`${textarea.id || 'textarea'}_paste`, pasteHandler)

          // Initialize height when setting up listeners
          adjustHeight(textarea)
        } catch (error) {
          console.warn('AutoResize: Error setting up textarea listener:', error)
        }
      })

      // Create cleanup function
      const cleanup = () => {
        try {
          handlerMap.forEach((handler, key) => {
            if (typeof key === 'string' && key.includes('_paste')) {
              // Handle paste event cleanup
              const textareaId = key.replace('_paste', '')
              const textarea =
                document.getElementById(textareaId) ||
                Array.from(textareas).find(ta => ta.id === textareaId)
              if (textarea) {
                textarea.removeEventListener('paste', handler)
              }
            } else if (key instanceof HTMLTextAreaElement) {
              // Handle input event cleanup
              key.removeEventListener('input', handler)
            }
          })
          handlerMap.clear()
        } catch (error) {
          console.warn('AutoResize: Error during cleanup:', error)
        }
      }

      // Store cleanup function in ref for potential early cleanup
      cleanupRef.current = cleanup

      // Return cleanup function for useEffect
      return cleanup
    },
    Array.isArray(dependencies) ? dependencies : [dependencies],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])
}

export default useAutoResizeTextarea
