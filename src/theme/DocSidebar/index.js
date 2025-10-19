// src/theme/DocSidebar/index.js - SIMPLIFIED VERSION
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from '@docusaurus/router'
import MainDocSidebar from '@theme-original/DocSidebar'
import ChatbotButton from '@site/src/components/Chatbot/ChatbotButton'
import EmbeddedFilterControls from '../../components/FilterControls/index.js'

function ChatbotPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()

  // Don't render RANI button for Rita Go pages
  const isRitaGo =
    location.pathname !== '/' && !location.pathname.startsWith('/actions')
  if (isRitaGo) return null

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

          element.insertBefore(mountDiv, element.firstChild)
          setMountNode(mountDiv)
          return
        }
      }
    }

    findAndCreateMountPoint()
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!mountNode) return null
  return createPortal(
    <ChatbotButton variant='icon-only' size='small' />,
    mountNode,
  )
}

function FilterPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()

  // Only show filter on Rita Go pages
  const isRitaGo = location.pathname.startsWith('/rita-go')
  if (!isRitaGo) return null

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

          const mountDiv = document.createElement('div')
          mountDiv.setAttribute('data-filter-mount', 'true')
          mountDiv.style.cssText = `
            margin: 16px 16px 20px 16px;
            display: flex;
            justify-content: center;
          `

          // Append to bottom of sidebar
          element.appendChild(mountDiv)
          setMountNode(mountDiv)
          return
        }
      }
    }

    findAndCreateMountPoint()
    const interval = setInterval(findAndCreateMountPoint, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!mountNode) return null
  return createPortal(<EmbeddedFilterControls />, mountNode)
}

function SimplifiedDocSidebar(props) {
  const location = useLocation()
  const isRitaGo = location.pathname.startsWith('/rita-go')

  // Add CSS for filtering on Rita Go pages
  useEffect(() => {
    if (isRitaGo) {
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
      if (!isRitaGo) {
        const filteringCSS = document.getElementById('filtering-styles')
        if (filteringCSS) {
          filteringCSS.remove()
        }
      }
    }
  }, [isRitaGo])

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
