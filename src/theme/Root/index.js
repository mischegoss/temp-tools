// Fixed Root provider - Correct login page handling
// src/theme/Root/index.js
import React, { useMemo } from 'react'
import { useLocation } from '@docusaurus/router'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

// Define PROTECTED path stubs - these need AuthContext with auth checks
const PROTECTED_PATH_STUBS = [
  '/learning/service-blueprinting',
  '/learning/automation-essentials',
]

// Define COMPLETELY PUBLIC pages that need NO auth/Firebase at all
const COMPLETELY_PUBLIC_PATHS = [
  '/', // Homepage
  '/learning/discover', // Discovery page
  '/learning/actions', // Public documentation
  '/learning/contact-us', // Public contact
]

// Check if page is protected (needs AuthContext with auth checks)
const isProtectedPage = pathname => {
  return PROTECTED_PATH_STUBS.some(stub => pathname.startsWith(stub))
}

// Check if page is completely public (no auth needed at all)
const isCompletelyPublicPage = pathname => {
  // Handle learning root as exact match
  if (pathname === '/learning/' || pathname === '/learning') {
    return true
  }

  // Check other completely public paths (exact matches)
  return COMPLETELY_PUBLIC_PATHS.some(path => {
    if (path === '/' || path === '/learning/') {
      return pathname === path // Exact match for these
    }
    return pathname.startsWith(path) // Starts with for others
  })
}

// Check if page is login page (needs AuthProvider but no auth checks)
const isLoginPage = pathname => {
  return pathname === '/learning/login' // EXACT match only for login
}

export default function Root({ children }) {
  const location = useLocation()
  const pathname = location.pathname

  // ALWAYS call useMemo to avoid Rules of Hooks violation
  const authConfig = useMemo(() => {
    const isProtected = isProtectedPage(pathname)
    const isLogin = isLoginPage(pathname)
    const isCompletelyPublic = isCompletelyPublicPage(pathname)

    // Login page needs AuthProvider but skips auth checks
    // Protected pages need AuthProvider with auth checks
    const skipAuthCheck = isLogin

    return {
      skipAuthCheck,
      isCompletelyPublic,
      isProtected,
      isLogin,
    }
  }, [pathname])

  // Early return for completely public pages - no auth providers at all
  if (authConfig.isCompletelyPublic) {
    console.log(
      '[Root] Completely public page detected, rendering without auth providers:',
      pathname,
    )
    return children
  }

  // For all other pages (protected + login), provide auth context
  console.log('[Root] Providing auth context for:', pathname, {
    isProtected: authConfig.isProtected,
    isLogin: authConfig.isLogin,
    skipAuthCheck: authConfig.skipAuthCheck,
  })

  return (
    <FirebaseProvider>
      <AuthProvider skipAuthCheck={authConfig.skipAuthCheck}>
        {children}
      </AuthProvider>
    </FirebaseProvider>
  )
}
