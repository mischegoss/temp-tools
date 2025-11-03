// src/theme/DocSidebar/index.js - FIXED VERSION (NO STYLES MODULE)
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from '@docusaurus/router'
import MainDocSidebar from '@theme-original/DocSidebar'
import ChatbotButton from '@site/src/components/Chatbot/ChatbotButton'
import EmbeddedFilterControls from '@site/src/components/FilterControls'
import {
  applyFilteringToSidebar,
  initializePageFiltering,
} from '@site/src/utils/urlFilterUtils'

// Chatbot Portal Component (unchanged)
function ChatbotPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()
  const isActionsPage = location.pathname.startsWith('/actions')

  useEffect(() => {
    if (!isActionsPage) return

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
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          `
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
  }, [isActionsPage])

  if (!isActionsPage || !mountNode) return null
  return createPortal(
    <ChatbotButton variant='default' size='medium' style={{ width: '80%' }} />,
    mountNode,
  )
}

// Filter Portal Component (updated for hybrid system)
function FilterPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()
  const isRitaGoPage = location.pathname.startsWith('/rita-go')

  // Create mount point for filter controls
  useEffect(() => {
    if (!isRitaGoPage) return

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
          const existingMount = element.querySelector('[data-filter-mount]')
          if (existingMount) {
            setMountNode(existingMount)
            return
          }

          const mountDiv = document.createElement('div')
          mountDiv.setAttribute('data-filter-mount', 'true')
          mountDiv.style.cssText = `
            margin: 16px 16px 20px 16px;
            display: flex;
            justify-content: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          `
          element.appendChild(mountDiv) // Add at the end
          setMountNode(mountDiv)
          return
        }
      }
      setMountNode(null)
    }

    findAndCreateMountPoint()
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => clearInterval(interval)
  }, [isRitaGoPage])

  // HYBRID: Initialize filtering on mount and when location changes
  useEffect(() => {
    if (isRitaGoPage) {
      console.log(
        '🚀 FilterPortal: Initializing hybrid filtering for',
        location.pathname,
      )

      // Use a longer delay to ensure Docusaurus sidebar is fully rendered
      setTimeout(() => {
        initializePageFiltering()
      }, 1000) // Increased delay
    }
  }, [isRitaGoPage, location.pathname])

  // HYBRID: Handle URL parameter changes (from filter controls or browser navigation)
  useEffect(() => {
    if (isRitaGoPage) {
      console.log(
        '🔍 FilterPortal: URL search params changed:',
        location.search,
      )

      // Re-apply filtering when URL parameters change
      // Use multiple attempts to ensure DOM is ready
      setTimeout(() => applyFilteringToSidebar(), 100)
      setTimeout(() => applyFilteringToSidebar(), 500)
      setTimeout(() => applyFilteringToSidebar(), 1000)
    }
  }, [isRitaGoPage, location.search])

  // HYBRID: Add CSS for filtering (original system)
  useEffect(() => {
    if (isRitaGoPage) {
      const filteringCSS = document.getElementById('filtering-styles')
      if (!filteringCSS) {
        const style = document.createElement('style')
        style.id = 'filtering-styles'
        style.textContent = `
          .sidebar-filtered-hidden {
            display: none !important;
          }
          
          /* Optional: Add transition for smoother hiding/showing */
          .theme-doc-sidebar-item {
            transition: opacity 0.2s ease;
          }
        `
        document.head.appendChild(style)
      }
    }

    return () => {
      if (!isRitaGoPage) {
        const filteringCSS = document.getElementById('filtering-styles')
        if (filteringCSS) {
          filteringCSS.remove()
        }
      }
    }
  }, [isRitaGoPage])

  // HYBRID: Handle browser back/forward navigation
  useEffect(() => {
    if (!isRitaGoPage) return

    const handlePopState = () => {
      console.log(
        '🔄 Browser navigation detected, re-applying hybrid filtering',
      )

      // Multiple attempts with different delays
      setTimeout(() => applyFilteringToSidebar(), 100)
      setTimeout(() => applyFilteringToSidebar(), 500)
      setTimeout(() => applyFilteringToSidebar(), 1000)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isRitaGoPage])

  // HYBRID: Force refresh filtering when sidebar content changes
  useEffect(() => {
    if (!isRitaGoPage) return

    // Watch for sidebar DOM changes and re-apply filtering
    const observer = new MutationObserver(mutations => {
      const hasSidebarChanges = mutations.some(mutation =>
        Array.from(mutation.addedNodes).some(
          node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.classList?.contains('theme-doc-sidebar-item') ||
              node.querySelector?.('.theme-doc-sidebar-item')),
        ),
      )

      if (hasSidebarChanges) {
        console.log('🔄 Sidebar DOM changed, re-applying filtering')
        setTimeout(() => applyFilteringToSidebar(), 500)
      }
    })

    // Start observing sidebar for changes
    setTimeout(() => {
      const sidebar =
        document.querySelector('.theme-doc-sidebar-menu') ||
        document.querySelector('[class*="sidebar"]')
      if (sidebar) {
        observer.observe(sidebar, {
          childList: true,
          subtree: true,
        })
      }
    }, 1000)

    return () => observer.disconnect()
  }, [isRitaGoPage, location.pathname])

  if (!isRitaGoPage || !mountNode) return null
  return createPortal(<EmbeddedFilterControls />, mountNode)
}

// URL Logger Component (enhanced for debugging)
function URLLogger() {
  const location = useLocation()
  const isRitaGoPage = location.pathname.startsWith('/rita-go')

  useEffect(() => {
    if (!isRitaGoPage) return

    const logSidebarURLs = () => {
      const allSidebarLinks = document.querySelectorAll('a[href^="/rita-go/"]')

      console.log('🔍 DEBUG: HYBRID SYSTEM SIDEBAR URLs:')
      console.log(`📊 Found ${allSidebarLinks.length} Rita Go links in sidebar`)
      console.log(`🎯 Current URL: ${location.pathname}${location.search}`)

      allSidebarLinks.forEach((linkElement, index) => {
        const href = linkElement.getAttribute('href')
        const text = linkElement.textContent?.trim() || 'No text'
        const isHidden = linkElement.closest('.sidebar-filtered-hidden')
        const container = linkElement.closest('.theme-doc-sidebar-item')

        console.log(
          `  ${index + 1}. ${isHidden ? '🚫' : '📄'} ${href} "${text}"${
            container ? ' [has container]' : ' [no container]'
          }`,
        )
      })

      console.log('🔍 END OF HYBRID SIDEBAR URL LIST')
    }

    // Log sidebar URLs for debugging with multiple timings
    setTimeout(logSidebarURLs, 500)
    setTimeout(logSidebarURLs, 2000)
  }, [location.pathname, location.search, isRitaGoPage])

  return null
}

// Main DocSidebar Component
export default function DocSidebar(props) {
  return (
    <>
      <MainDocSidebar {...props} />
      <ChatbotPortal />
      <FilterPortal />
      <URLLogger />
    </>
  )
}
