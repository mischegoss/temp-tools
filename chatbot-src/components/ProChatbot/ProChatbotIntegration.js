// ProChatbotIntegration.js
// Helper component for easy integration of Pro chatbot into existing layouts

import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

// Lazy load to avoid SSR issues
const ProChatbotManager = React.lazy(() =>
  import('./ProChatbot/ProChatbotManager').catch(() => ({
    default: () => null, // Graceful fallback if component not available
  })),
)

/**
 * Simple integration component that detects Pro routes and shows Pro chatbot
 * Usage: Add <ProChatbotIntegration /> to your Root.js or Layout component
 */
const ProChatbotIntegration = () => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => {
        // Only show on Pro routes
        const isProRoute =
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/pro')

        if (!isProRoute) {
          return null
        }

        return (
          <React.Suspense fallback={<div style={{ display: 'none' }} />}>
            <ProChatbotManager />
          </React.Suspense>
        )
      }}
    </BrowserOnly>
  )
}

export default ProChatbotIntegration

/**
 * Advanced integration with custom route detection
 * Usage: For more complex routing scenarios
 */
export const ProChatbotWithCustomRoutes = ({
  routePatterns = ['/pro'],
  enabled = true,
}) => {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => {
        if (!enabled) return null

        const currentPath =
          typeof window !== 'undefined' ? window.location.pathname : ''

        const shouldShow = routePatterns.some(pattern =>
          typeof pattern === 'string'
            ? currentPath.startsWith(pattern)
            : pattern.test(currentPath),
        )

        if (!shouldShow) return null

        return (
          <React.Suspense fallback={<div style={{ display: 'none' }} />}>
            <ProChatbotManager />
          </React.Suspense>
        )
      }}
    </BrowserOnly>
  )
}

