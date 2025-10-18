// src/theme/DocSidebar/index.js - SCROLL-SAFE VERSION
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

  // ONLY show on Rita-Go pages
  const isRitaGo =
    location.pathname !== '/' &&
    !location.pathname.startsWith('/actions') &&
    !location.pathname.startsWith('/blog')

  if (!isRitaGo) {
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
          const existingMount = element.querySelector('[data-filter-mount]')
          if (existingMount) {
            setMountNode(existingMount)
            return
          }

          // SCROLL-SAFE APPROACH: Natural flow, not absolute positioning
          const mountDiv = document.createElement('div')
          mountDiv.setAttribute('data-filter-mount', 'true')
          mountDiv.style.cssText = `
            margin: 20px 12px 16px 12px;
            padding: 16px 0 0 0;
            border-top: 1px solid var(--brand-grey-200);
            position: relative;
          `

          // Append naturally to end of sidebar content (participates in scroll)
          element.appendChild(mountDiv)
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

  return createPortal(<EmbeddedFilterControls />, mountNode)
}

export default function DocSidebar(props) {
  return (
    <>
      <MainDocSidebar {...props} />
      <ChatbotPortal />
      <FilterPortal />
    </>
  )
}
