// Fixed Root provider - Correct protected vs public path handling
// src/theme/Root/index.js
import React, { useMemo } from 'react'
import { useLocation } from '@docusaurus/router'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

// Define PROTECTED path stubs - these need AuthContext
const PROTECTED_PATH_STUBS = [
  '/learning/service-blueprinting',
  '/learning/automation-essentials',
]

// Define PUBLIC pages that need NO auth/Firebase at all
const PUBLIC_PATHS = [
  '/', // Homepage
  '/learning/', // Learning hub root (exact match)
  '/learning/discover', // Discovery page
  '/learning/actions', // Public documentation
  '/learning/contact-us', // Public contact
  '/learning/login', // Login page
]

// Check if page is protected (needs AuthContext)
const isProtectedPage = pathname => {
  return PROTECTED_PATH_STUBS.some(stub => pathname.startsWith(stub))
}

// Check if page is completely public (no auth needed)
const isPublicPage = pathname => {
  // Handle learning root as exact match
  if (pathname === '/learning/' || pathname === '/learning') {
    return true
  }

  // Check other public paths
  return PUBLIC_PATHS.some(path => {
    if (path === '/' || path === '/learning/') {
      return pathname === path // Exact match for these
    }
    return pathname.startsWith(path) // Starts with for others
  })
}

export default function Root({ children }) {
  const location = useLocation()
  const pathname = location.pathname

  // Early return for public pages - no auth providers at all
  if (isPublicPage(pathname)) {
    console.log(
      '[Root] Public page detected, rendering without auth providers:',
      pathname,
    )
    return children
  }

  // For all non-public pages, provide auth context
  const authConfig = useMemo(() => {
    const isProtected = isProtectedPage(pathname)
    const isLoginPage = pathname.startsWith('/learning/login')

    // Login page needs AuthProvider but skips auth checks
    // Protected pages need AuthProvider with auth checks
    const skipAuthCheck = isLoginPage

    console.log('[Root] Non-public page, providing auth context:', pathname, {
      isProtected,
      isLoginPage,
      skipAuthCheck,
    })

    return { skipAuthCheck }
  }, [pathname])

  // Always provide auth context for non-public pages
  return (
    <FirebaseProvider>
      <AuthProvider skipAuthCheck={authConfig.skipAuthCheck}>
        {children}
      </AuthProvider>
    </FirebaseProvider>
  )
}
