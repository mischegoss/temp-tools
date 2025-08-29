// src/components/Chatbot/hooks/usePageContext.js
import { useState, useEffect } from 'react'
import { useLocation } from '@docusaurus/router'

const usePageContext = () => {
  const location = useLocation()
  const [pageContext, setPageContext] = useState({
    path: '/',
    title: null,
    section: null,
    breadcrumbs: [],
    timeOnPage: 0,
  })

  useEffect(() => {
    const updateContext = () => {
      const path = location.pathname
      const title = extractPageTitle()
      const section = extractSection(path)
      const breadcrumbs = extractBreadcrumbs(path)

      const newContext = {
        path,
        title,
        section,
        breadcrumbs,
        timeOnPage: 0, // Reset when page changes
        timestamp: Date.now(),
      }

      setPageContext(newContext)
    }

    updateContext()
  }, [location.pathname])

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setPageContext(prev => ({
        ...prev,
        timeOnPage: Math.floor((Date.now() - startTime) / 1000),
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [location.pathname])

  // Extract page title from document or URL
  const extractPageTitle = () => {
    // Try to get from document title first
    if (typeof document !== 'undefined' && document.title) {
      // Clean up Docusaurus title format
      const title = document.title
      const parts = title.split('|').map(part => part.trim())

      // Return the first part (page title) if it's not just the site name
      if (parts.length > 1 && parts[0] !== 'Resolve Actions') {
        return parts[0]
      }
    }

    // Fallback: extract from URL path
    const path = location.pathname
    const segments = path.split('/').filter(Boolean)

    if (segments.length === 0) return null

    // Get the last meaningful segment
    let lastSegment = segments[segments.length - 1]

    // Handle category pages
    if (lastSegment === 'category') {
      lastSegment =
        segments[segments.length - 2] || segments[segments.length - 1]
    }

    // Convert URL segment to readable title
    return formatUrlSegmentToTitle(lastSegment)
  }

  // Extract section from path
  const extractSection = path => {
    const segments = path.split('/').filter(Boolean)

    if (segments.length === 0) return 'Homepage'

    // First segment is usually the main section
    const mainSection = segments[0]

    switch (mainSection.toLowerCase()) {
      case 'actions':
        return 'Actions'
      case 'pro':
        return 'Pro'
      case 'express':
        return 'Express'
      case 'insights':
        return 'Insights'
      default:
        return formatUrlSegmentToTitle(mainSection)
    }
  }

  // Extract breadcrumbs from path
  const extractBreadcrumbs = path => {
    const segments = path.split('/').filter(Boolean)

    if (segments.length === 0) return ['Home']

    return segments.map(segment => formatUrlSegmentToTitle(segment))
  }

  // Convert URL segment to readable title
  const formatUrlSegmentToTitle = segment => {
    if (!segment) return null

    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Helper methods for common checks
  const isHomepage = () => pageContext.path === '/'
  const isActionsSection = () => pageContext.path.startsWith('/actions')
  const isProSection = () => pageContext.path.startsWith('/pro')
  const isExpressSection = () => pageContext.path.startsWith('/express')
  const isInsightsSection = () => pageContext.path.startsWith('/insights')

  // Get contextual greeting based on current page
  const getContextualGreeting = () => {
    if (!pageContext.title) {
      return "Hi, I'm RANI! How can I help you with Resolve Actions today?"
    }

    return `Hi, I'm RANI! I see you're reading about ${pageContext.title}. What would you like to know about it?`
  }

  // Get suggested questions based on current page
  const getSuggestedQuestions = () => {
    const path = pageContext.path.toLowerCase()

    if (path.includes('slack')) {
      return [
        'How do I set up the Slack connection?',
        'How do I test my Slack workflow?',
        'How do I troubleshoot connection errors?',
      ]
    }

    if (path.includes('workflow')) {
      return [
        'How do I create my first workflow?',
        'What activities should I use?',
        'How do I test my workflow?',
      ]
    }

    if (path.includes('troubleshoot')) {
      return [
        "My workflow isn't running",
        "I'm getting connection errors",
        'How do I debug activity failures?',
      ]
    }

    if (path.includes('getting-started')) {
      return [
        'How do I get started with Actions?',
        'What should I learn first?',
        'Where can I find examples?',
      ]
    }

    // Default suggestions
    return [
      'How do I create a workflow?',
      'How do I set up integrations?',
      'How do I troubleshoot issues?',
    ]
  }

  return {
    ...pageContext,
    isHomepage,
    isActionsSection,
    isProSection,
    isExpressSection,
    isInsightsSection,
    getContextualGreeting,
    getSuggestedQuestions,
  }
}

export default usePageContext
