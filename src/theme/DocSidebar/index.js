// src/theme/DocSidebar/index.js - FIXED VERSION
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from '@docusaurus/router'
import MainDocSidebar from '@theme-original/DocSidebar'
import ChatbotButton from '@site/src/components/Chatbot/ChatbotButton'
import EmbeddedFilterControls from '../../components/FilterControls/index.js'

function ChatbotPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()

  // Check if current page is Rita Go (not homepage, not actions)
  const isRitaGo =
    location.pathname !== '/' && !location.pathname.startsWith('/actions')

  // Don't render RANI button for Rita Go pages
  if (isRitaGo) {
    return null
  }

  useEffect(() => {
    const findAndCreateMountPoint = () => {
      const selectors = [
        '.theme-doc-sidebar-menu',
        '[class*="sidebar"] ul:first-of-type',
        '.menu__list:first-of-type',
        '[class*="sidebar"] > div:first-child',
      ]

      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          const existingMount = element.querySelector('[data-chatbot-mount]')
          if (existingMount) {
            setMountNode(existingMount)
            return
          }

          const mountDiv = document.createElement('div')
          mountDiv.setAttribute('data-chatbot-mount', 'true')
          mountDiv.style.cssText = `
            margin: 16px 16px 20px 16px;
            display: flex;
            justify-content: center;
          `

          // Insert at the beginning of the sidebar content
          element.insertBefore(mountDiv, element.firstChild)
          setMountNode(mountDiv)
          return
        }
      }

      setMountNode(null)
    }

    findAndCreateMountPoint()
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!mountNode) return null

  return createPortal(
    <ChatbotButton
      variant='default'
      size='medium'
      style={{
        width: '80%',
      }}
    />,
    mountNode,
  )
}

function FilterPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()

  // FIXED: ONLY show on Rita-Go pages (check path starts with /rita-go)
  const isRitaGo = location.pathname.startsWith('/rita-go')

  if (!isRitaGo) {
    return null
  }

  useEffect(() => {
    const findAndCreateMountPoint = () => {
      // FIXED: Use same selectors and pattern as working chatbot code
      const selectors = [
        '.theme-doc-sidebar-menu',
        '[class*="sidebar"] ul:first-of-type',
        '.menu__list:first-of-type',
        '[class*="sidebar"] > div:first-child',
      ]

      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          // Check for existing mount to avoid duplicates
          const existingMount = element.querySelector('[data-filter-mount]')
          if (existingMount) {
            setMountNode(existingMount)
            return
          }

          // FIXED: Use same simple pattern as working chatbot code
          const mountDiv = document.createElement('div')
          mountDiv.setAttribute('data-filter-mount', 'true')
          mountDiv.style.cssText = `
            margin: 16px 16px 20px 16px;
            display: flex;
            justify-content: center;
          `

          // FIXED: Use insertBefore like working code, but at the END
          // Insert at the end of the sidebar content
          element.appendChild(mountDiv)
          setMountNode(mountDiv)
          return
        }
      }

      setMountNode(null)
    }

    findAndCreateMountPoint()
    // FIXED: Use same 2 second interval as working code
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!mountNode) return null

  return createPortal(<EmbeddedFilterControls />, mountNode)
}

// SIMPLIFIED: Use original DocSidebar with CSS-based filtering
function SimplifiedDocSidebar(props) {
  const location = useLocation()

  // Check if we're on Rita Go pages
  const isRitaGo = location.pathname.startsWith('/rita-go')

  // Apply CSS-based filtering using global styles
  useEffect(() => {
    if (isRitaGo) {
      // Add filtering CSS when on Rita Go pages
      const filteringCSS = document.getElementById('filtering-styles')
      if (!filteringCSS) {
        const style = document.createElement('style')
        style.id = 'filtering-styles'
        style.textContent = `
          /* Hide filtered sidebar items */
          .sidebar-filtered-hidden {
            display: none !important;
          }
          
          /* Hide categories with no visible children */
          .theme-doc-sidebar-item-category:not(:has(.theme-doc-sidebar-item-link:not(.sidebar-filtered-hidden))) {
            display: none !important;
          }
        `
        document.head.appendChild(style)
      }
    }

    return () => {
      // Clean up on unmount
      const filteringCSS = document.getElementById('filtering-styles')
      if (filteringCSS && !isRitaGo) {
        filteringCSS.remove()
      }
    }
  }, [isRitaGo])

  // Render original sidebar without modification
  return <MainDocSidebar {...props} />
}

export default function DocSidebar(props) {
  return (
    <>
      <SimplifiedDocSidebar {...props} />
      <ChatbotPortal />
      <FilterPortal />
    </>
  )
}
