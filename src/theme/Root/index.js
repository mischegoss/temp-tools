// Optimized Root provider - Fix auth loop issue
// src/theme/Root/index.js
import React, { useMemo } from 'react'
import { useLocation } from '@docusaurus/router'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

// Define auth-required paths as constants to avoid re-creating arrays
const AUTH_REQUIRED_PATHS = [
  '/learning/service-blueprinting',
  '/learning/automation-essentials',
]

const AUTH_REQUIRED_INCLUDES = ['/forms', '/courses']

// Memoized function to check if auth is needed
const checkIfAuthNeeded = pathname => {
  return (
    AUTH_REQUIRED_PATHS.some(path => pathname.startsWith(path)) ||
    AUTH_REQUIRED_INCLUDES.some(include => pathname.includes(include))
  )
}

export default function Root({ children }) {
  const location = useLocation()

  // Use useMemo with stable comparison to prevent unnecessary re-renders
  const authConfig = useMemo(() => {
    const isAuthRequiredPath = checkIfAuthNeeded(location.pathname)
    const isLoginPage = location.pathname.startsWith('/learning/login')

    // Login page needs AuthProvider but skips auth checks
    // Protected pages need AuthProvider with auth checks
    const needsAuthProvider = isAuthRequiredPath || isLoginPage
    const skipAuthCheck = isLoginPage

    console.log('[Root] Auth decision for:', location.pathname, {
      needsAuthProvider,
      skipAuthCheck,
      isAuthRequiredPath,
      isLoginPage,
    })

    return { needsAuthProvider, skipAuthCheck }
  }, [location.pathname])

  // Always call useMemo for the providers to maintain hook order
  const authProviders = useMemo(
    () => (
      <FirebaseProvider>
        <AuthProvider skipAuthCheck={authConfig.skipAuthCheck}>
          {children}
        </AuthProvider>
      </FirebaseProvider>
    ),
    [children, authConfig.skipAuthCheck],
  )

  // For pages that don't need any auth context, render without providers
  if (!authConfig.needsAuthProvider) {
    return children
  }

  // For auth-required pages and login page, provide auth context
  return authProviders
}
