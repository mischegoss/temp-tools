// Simple Root provider - Only provide auth for specific paths that need it
// src/theme/Root/index.js
import React from 'react'
import { useLocation } from '@docusaurus/router'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

export default function Root({ children }) {
  const location = useLocation()

  // Only provide auth for these specific paths
  const needsAuth = React.useMemo(() => {
    const path = location.pathname

    // Auth required ONLY for:
    return (
      path.startsWith('/learning/service-blueprinting') ||
      path.startsWith('/learning/automation-essentials') ||
      path.startsWith('/learning/login') ||
      path.includes('/forms') ||
      path.includes('/courses')
    )
  }, [location.pathname])

  console.log('[Root] Auth decision:', {
    path: location.pathname,
    needsAuth,
  })

  // For pages that don't need auth, render without auth providers
  if (!needsAuth) {
    return children
  }

  // For auth-required pages, provide full auth context
  return (
    <FirebaseProvider>
      <AuthProvider skipAuthCheck={false}>{children}</AuthProvider>
    </FirebaseProvider>
  )
}
