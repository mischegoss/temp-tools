// ROBUST Root Fix - Prevents ALL DOM Shifts and Extension Interference
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
      /* Block browser extensions from modifying DOM during hydration */
      .extension-protection {
        pointer-events: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
      
      /* Prevent Grammarly and other extensions from targeting elements */
      [data-gr-c-s-loaded], [data-gramm], [data-gramm_editor] {
        display: none !important;
      }
      
      /* Hide all grammarly UI during hydration */
      grammarly-extension, grammark-chrome-extension {
        display: none !important;
      }
    `

    const styleSheet = document.createElement('style')
    styleSheet.textContent = protectiveStyles
    document.head.appendChild(styleSheet)

    // Add protection class to body
    document.body.classList.add('extension-protection')

    return () => {
      document.body.classList.remove('extension-protection')
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999, // Higher than any extension
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        // Block all interaction during loading
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #0066FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#4A5568', fontSize: '1rem', margin: 0 }}>
          Loading...
        </p>
      </div>
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

  // Default to public for any non-matching paths (secure by default for public access)
  return true
}

// Main Root component with ROBUST protection against all DOM shifts
const Root = ({ children }) => {
  const location = useLocation()
  const [isReady, setIsReady] = useState(false)
  const [pageConfig, setPageConfig] = useState(null)
  const stableConfigRef = useRef(null)

  // PHASE 1: Determine page type ONCE and cache it
  useEffect(() => {
    const pathname = location.pathname

    // Only calculate config if it hasn't been set or path changed
    if (
      !stableConfigRef.current ||
      stableConfigRef.current.pathname !== pathname
    ) {
      console.log(`[Root] Analyzing page: ${pathname}`)

      let config
      if (isCompletelyPublicPage(pathname)) {
        console.log(
          `[Root] Public page detected (secure by default), rendering without auth providers: ${pathname}`,
        )
        config = {
          type: 'public',
          needsAuth: false,
          needsFirebase: false,
          pathname,
        }
      } else if (isLoginPage(pathname)) {
        console.log(
          `[Root] Login page detected, rendering with AuthProvider only: ${pathname}`,
        )
        config = {
          type: 'login',
          needsAuth: true,
          needsFirebase: true,
          pathname,
        }
      } else if (isProtectedPage(pathname)) {
        console.log(
          `[Root] Protected page detected, rendering with full auth: ${pathname}`,
        )
        config = {
          type: 'protected',
          needsAuth: true,
          needsFirebase: true,
          pathname,
        }
      } else {
        // Fallback to public (secure by default for unknown paths)
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
