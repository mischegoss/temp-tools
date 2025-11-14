// src/theme/DocSidebar/index.js - CORRECTED FOR 4-STATE FILTERING
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from '@docusaurus/router'
import MainDocSidebar from '@theme-original/DocSidebar'
import ChatbotButton from '@site/src/components/Chatbot/ChatbotButton'
import EmbeddedFilterControls from '@site/src/components/FilterControls'
import {
  applySimpleFiltering,
  initializeSimpleFiltering,
} from '@site/src/utils/urlFilterUtils'

// Filter Portal Component for RitaGo pages
function FilterPortal() {
  const [mountNode, setMountNode] = useState(null)
  const location = useLocation()
  const isRitaGoPage = location.pathname.startsWith('/rita-go')

  // Find and create mount point for filter controls (AT THE BOTTOM)
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
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          `
          element.appendChild(mountDiv) // Add at the END (bottom)
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

  // Initialize filtering on mount and when location changes
  useEffect(() => {
    if (isRitaGoPage) {
      console.log(
        '🚀 FilterPortal: Initializing 4-state filtering for',
        location.pathname,
      )

      // Use a delay to ensure Docusaurus sidebar is fully rendered
      setTimeout(() => {
        initializeSimpleFiltering()
      }, 500)
    }
  }, [isRitaGoPage, location.pathname])

  // Handle URL parameter changes (from filter controls or browser navigation)
  useEffect(() => {
    if (isRitaGoPage) {
      console.log(
        '🔍 FilterPortal: URL search params changed:',
        location.search,
      )

      // Re-apply simple filtering when URL parameters change
      setTimeout(() => applySimpleFiltering(), 100)
    }
  }, [isRitaGoPage, location.search])

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!isRitaGoPage) return

    const handlePopState = () => {
      console.log(
        '🔄 Browser navigation detected, re-applying 4-state filtering',
      )
      setTimeout(() => applySimpleFiltering(), 100)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isRitaGoPage])

  // Render filter controls if mount node is available
  if (isRitaGoPage && mountNode) {
    return createPortal(<EmbeddedFilterControls />, mountNode)
  }

  return null
}

// Chatbot Portal Component (FIXED - RANI button now appears at TOP)
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
            margin: 16px 12px 20px 12px;
            display: flex;
            justify-content: stretch;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 16px;
          `
          element.insertBefore(mountDiv, element.firstChild) // Add at the BEGINNING (top)
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

  if (isActionsPage && mountNode) {
    return createPortal(<ChatbotButton />, mountNode)
  }

  return null
}

// Main component
export default function DocSidebar(props) {
  return (
    <>
      <MainDocSidebar {...props} />
      <FilterPortal />
      <ChatbotPortal />
    </>
  )
}
