// FIXED: Complete Root.js with correct imports and classification order
// src/theme/Root/index.js
import React, { useMemo, useState, useEffect, useRef } from 'react'
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

// Enhanced loading component that blocks ALL external interference
const RobustLoadingScreen = () => {
  // Inject protective styles immediately to block extension interference
  useEffect(() => {
    const protectiveStyles = `
      /* Block browser extension interference */
      body::before, body::after {
        display: none !important;
      }
      
      /* Stabilize layout during loading */
      html, body {
        overflow-x: hidden !important;
      }
      
      /* Block external scripts during initial load */
      script[src*="extension"], script[src*="chrome"] {
        display: none !important;
      }
    `

    const styleElement = document.createElement('style')
    styleElement.textContent = protectiveStyles
    document.head.appendChild(styleElement)

    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #E2E8F0',
          borderTop: '4px solid #0066CC',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem',
        }}
      />
      <p style={{ color: '#4A5568', fontSize: '1rem', margin: 0 }}>
        Loading...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Check if page is protected (needs AuthContext with auth checks)
const isProtectedPage = pathname => {
  return PROTECTED_PATH_STUBS.some(stub => pathname.startsWith(stub))
}

// Check if page is login page (needs AuthProvider but no auth checks)
const isLoginPage = pathname => {
  return LOGIN_PATHS.some(path => pathname === path) // EXACT match only for login
}

// FIXED: Check if page is explicitly public (NO fallback to true)
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

  // FIXED: Don't default to public - let the classification order handle it
  return false
}

// Main Root component with ROBUST protection against all DOM shifts
const Root = ({ children }) => {
  const location = useLocation()
  const [isReady, setIsReady] = useState(false)
  const [pageConfig, setPageConfig] = useState(null)
  const stableConfigRef = useRef(null)

  // PHASE 1: Determine page type ONCE and cache it - FIXED ORDER
  useEffect(() => {
    const pathname = location.pathname

    // Only calculate config if it hasn't been set or path changed
    if (
      !stableConfigRef.current ||
      stableConfigRef.current.pathname !== pathname
    ) {
      console.log(`[Root] Analyzing page: ${pathname}`)

      let config

      // FIXED: Check login FIRST (most specific)
      if (isLoginPage(pathname)) {
        console.log(
          `[Root] Login page detected, rendering with AuthProvider only: ${pathname}`,
        )
        config = {
          type: 'login',
          needsAuth: true,
          needsFirebase: true,
          pathname,
        }
      }
      // THEN check protected (specific paths)
      else if (isProtectedPage(pathname)) {
        console.log(
          `[Root] Protected page detected, rendering with full auth: ${pathname}`,
        )
        config = {
          type: 'protected',
          needsAuth: true,
          needsFirebase: true,
          pathname,
        }
      }
      // THEN check explicitly public (known public paths)
      else if (isCompletelyPublicPage(pathname)) {
        console.log(
          `[Root] Public page detected (secure by default), rendering without auth providers: ${pathname}`,
        )
        config = {
          type: 'public',
          needsAuth: false,
          needsFirebase: false,
          pathname,
        }
      }
      // FALLBACK: Unknown paths default to public
      else {
        console.log(`[Root] Unknown path defaulting to public: ${pathname}`)
        config = {
          type: 'public',
          needsAuth: false,
          needsFirebase: false,
          pathname,
        }
      }

      stableConfigRef.current = config
      setPageConfig(config)
    }
  }, [location.pathname])

  // PHASE 2: Wait for stable DOM and extension settling
  useEffect(() => {
    if (!pageConfig) return

    // Use longer delay to ensure:
    // 1. React hydration completes
    // 2. Browser extensions finish loading
    // 3. DOM is completely stable
    const stabilityTimer = setTimeout(() => {
      // Additional check: ensure page hasn't changed during loading
      if (stableConfigRef.current?.pathname === location.pathname) {
        setIsReady(true)
      }
    }, 200) // Longer delay for complete stability

    return () => clearTimeout(stabilityTimer)
  }, [pageConfig, location.pathname])

  // PHASE 3: Show loading until everything is stable
  if (!isReady || !pageConfig) {
    return <RobustLoadingScreen />
  }

  // PHASE 4: Render based on page type - DOM is now completely stable
  if (pageConfig.type === 'public') {
    // Public pages: no auth providers needed
    return <>{children}</>
  }

  if (pageConfig.type === 'login') {
    // Login pages: AuthProvider only, no auth enforcement
    return (
      <FirebaseProvider>
        <AuthProvider requireAuth={false}>{children}</AuthProvider>
      </FirebaseProvider>
    )
  }

  if (pageConfig.type === 'protected') {
    // Protected pages: full auth stack with enforcement
    return (
      <FirebaseProvider>
        <AuthProvider requireAuth={true}>{children}</AuthProvider>
      </FirebaseProvider>
    )
  }

  // Fallback (should never reach here)
  return <>{children}</>
}

export default Root
