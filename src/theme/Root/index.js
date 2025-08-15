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
  '/learning/service-blueprinting/forms', // Protected: forms library
  '/learning/service-blueprinting/certificate', // Protected: certificate pages
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
  '/learning/service-blueprinting', // Public: service blueprinting landing page ONLY
  '/learning/automation-essentials', // Public: automation essentials landing page ONLY
  '/learning/pro', // Public: pro landing page
  '/learning/insights', // Public: insights landing page
  '/learning/express', // Public: express landing page
  '/learning/', // Learning hub root
  '/learning', // Learning hub root (without trailing slash)
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
      // EXACT matches for all specific pages
      if (path === '/' || path === '/learning/' || path === '/learning') {
        return pathname === path // Exact match for these
      }
      // EXACT match for all landing pages - NO sub-paths included
      if (path.startsWith('/learning/')) {
        return pathname === path // Exact match only - /learning/service-blueprinting does NOT match /learning/service-blueprinting/anything
      }
      return pathname.startsWith(path) // Starts with for others (like homepage)
    })
  ) {
    return true
  }

  // Handle learning root as exact match (redundant but explicit)
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
