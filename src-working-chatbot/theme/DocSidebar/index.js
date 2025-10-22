import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from '@docusaurus/router'
import MainDocSidebar from '@theme-original/DocSidebar'
import ChatbotButton from '@site/src/components/Chatbot/ChatbotButton'
import EmbeddedFilterControls from '@site/src/components/FilterControls'

function ChatbotPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()
  const isActionsPage = location.pathname.startsWith('/actions')

  useEffect(() => {
    if (!isActionsPage) return

    const findAndCreateMountPoint = () => {
      // Try different possible selectors for the sidebar content
      const selectors = [
        '.theme-doc-sidebar-menu',
        '[class*="sidebar"] ul:first-of-type',
        '.menu__list:first-of-type',
        '[class*="sidebar"] > div:first-child',
      ]
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          // Check if we already have a mount node in this element
          const existingMount = element.querySelector('[data-chatbot-mount]')
          if (existingMount) {
            setMountNode(existingMount)
            return
          }
          // Create a div to mount our component
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
      // If no sidebar found, clear mount node
      setMountNode(null)
    }
    // Check immediately
    findAndCreateMountPoint()
    // Check every 2 seconds to handle sidebar appearing/disappearing
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [isActionsPage])

  if (!isActionsPage || !mountNode) return null
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
  const isRitaGoPage = location.pathname.startsWith('/rita-go')

  useEffect(() => {
    if (!isRitaGoPage) return

    const findAndCreateMountPoint = () => {
      // Try different possible selectors for the sidebar content (SAME AS CHATBOT)
      const selectors = [
        '.theme-doc-sidebar-menu',
        '[class*="sidebar"] ul:first-of-type',
        '.menu__list:first-of-type',
        '[class*="sidebar"] > div:first-child',
      ]
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          // Check if we already have a mount node in this element
          const existingMount = element.querySelector('[data-filter-mount]')
          if (existingMount) {
            setMountNode(existingMount)
            return
          }
          // Create a div to mount our component (SAME STYLE AS CHATBOT)
          const mountDiv = document.createElement('div')
          mountDiv.setAttribute('data-filter-mount', 'true')
          mountDiv.style.cssText = `
            margin: 16px 16px 20px 16px;
            display: flex;
            justify-content: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          `
          // Insert at the END of the sidebar content (ONLY DIFFERENCE)
          element.appendChild(mountDiv)
          setMountNode(mountDiv)
          return
        }
      }
      // If no sidebar found, clear mount node
      setMountNode(null)
    }
    // Check immediately
    findAndCreateMountPoint()
    // Check every 2 seconds to handle sidebar appearing/disappearing
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [isRitaGoPage])

  // Add minimal CSS for filtering
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

  if (!isRitaGoPage || !mountNode) return null
  return createPortal(<EmbeddedFilterControls />, mountNode)
}

// ADD URL LOGGING COMPONENT
function URLLogger() {
  const location = useLocation()
  const isRitaGoPage = location.pathname.startsWith('/rita-go')

  useEffect(() => {
    if (!isRitaGoPage) return

    // Wait a bit for the sidebar to fully render, then log all URLs
    const logSidebarURLs = () => {
      const allSidebarLinks = document.querySelectorAll('a[href^="/rita-go/"]')

      console.log('🔍 DEBUG: ACTUAL SIDEBAR URLs GENERATED BY DOCUSAURUS:')
      console.log(`📊 Found ${allSidebarLinks.length} Rita Go links in sidebar`)

      allSidebarLinks.forEach((linkElement, index) => {
        const href = linkElement.getAttribute('href')
        const text = linkElement.textContent?.trim() || 'No text'
        console.log(`  ${index + 1}. 📄 ${href} "${text}"`)
      })

      console.log('🔍 END OF SIDEBAR URL LIST')
    }

    // Log immediately and after a delay to catch dynamic content
    setTimeout(logSidebarURLs, 100)
    setTimeout(logSidebarURLs, 1000)
    setTimeout(logSidebarURLs, 3000)
  }, [location.pathname, isRitaGoPage])

  return null // This component doesn't render anything
}

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
