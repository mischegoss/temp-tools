import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from '@docusaurus/router' // Add this import
import MainDocSidebar from '@theme-original/DocSidebar'
import ChatbotButton from '@site/src/components/Chatbot/ChatbotButton'

function ChatbotPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation() // Add this line

  // Check if current page is Rita Go (not homepage, not actions)
  const isRitaGo =
    location.pathname !== '/' && !location.pathname.startsWith('/actions')

  // Don't render RANI button for Rita Go pages
  if (isRitaGo) {
    return null
  }

  useEffect(() => {
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

export default function DocSidebar(props) {
  return (
    <>
      <MainDocSidebar {...props} />
      <ChatbotPortal />
    </>
  )
}
