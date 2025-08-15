// Secure by Default Root provider - Fixed certificate path protection
// src/theme/Root/index.js
import React, { useMemo } from 'react'
import { useLocation } from '@docusaurus/router'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

// Define PROTECTED path stubs - these are the ONLY paths that need AuthContext with auth checks
const PROTECTED_PATH_STUBS = [
  '/learning/service-blueprinting/courses', // Protected: course catalog
  '/learning/service-blueprinting/modules', // Protected: all modules
  '/learning/service-blueprinting/certificate', // FIXED: Protected: certificate pages
  '/learning/automation-essentials', // Protected: all automation essentials
]

// Define LOGIN pages that need AuthProvider but no auth checks
const LOGIN_PATHS = ['/learning/login']

// Define COMPLETELY PUBLIC pages that need NO auth/Firebase at all
const COMPLETELY_PUBLIC_PATHS = [
  '/', // Homepage
  '/learning/discover', // Discovery page
  '/learning/actions', // Public documentation
  '/learning/contact-us', // Public contact
  '/learning/service-blueprinting', // Public: service blueprinting landing page
]

// Check if page is protected (needs AuthContext with auth checks)
const isProtectedPage = pathname => {
  return PROTECTED_PATH_STUBS.some(stub => pathname.startsWith(stub))
}

// Check if page is login page (needs AuthProvider but no auth checks)
const isLoginPage = pathname => {
  return LOGIN_PATHS.some(path => pathname === path) // EXACT match only for login
}

// SECURE BY DEFAULT: If it's not explicitly protected or login, it's public
const isCompletelyPublicPage = pathname => {
  // First check if it's explicitly in the public paths list
  if (
    COMPLETELY_PUBLIC_PATHS.some(path => {
      if (path === '/' || path === '/learning/') {
        return pathname === path // Exact match for these
      }
      // FIXED: Exact match for service-blueprinting landing page too
      if (path === '/learning/service-blueprinting') {
        return pathname === path // Exact match only
      }
      return pathname.startsWith(path) // Starts with for others
    })
  ) {
    return true
  }

  // Handle learning root as exact match
  if (pathname === '/learning/' || pathname === '/learning') {
    return true
  }

  // If not protected and not login, it's public (secure by default)
  return !isProtectedPage(pathname) && !isLoginPage(pathname)
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
      '[Root] Public page detected (secure by default), rendering without auth providers:',
      pathname,
    )
    return children
  }

  // For protected and login pages, provide auth context
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
