// Enhanced Root provider - BETTER SOLUTION
// src/theme/Root/index.js
import React from 'react'
import { useLocation } from '@docusaurus/router'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'

export default function Root({ children }) {
  const location = useLocation()

  // Only skip auth for non-learning paths (NOT for login page)
  // This allows login page to get proper auth state updates
  const shouldSkipAuth = React.useMemo(() => {
    const path = location.pathname

    // Skip auth ONLY for:
    // - Homepage and non-learning paths (don't start with /learning)
    // - But NOT for /learning/login (we want auth state updates there)
    return !path.startsWith('/learning')
  }, [location.pathname])

  console.log('[Root] Auth decision:', {
    path: location.pathname,
    skipAuth: shouldSkipAuth,
  })

  return (
    <FirebaseProvider>
      <AuthProvider skipAuthCheck={shouldSkipAuth}>{children}</AuthProvider>
    </FirebaseProvider>
  )
}
