// Enhanced AuthContext with better skipAuthCheck handling
// src/contexts/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useLocation } from '@docusaurus/router'
import { auth } from '@site/src/firebase/firebase'
import useFormAssociation from '../components/Forms/utils/UseFormAssociation'
import { useFirebase } from './FirebaseContext'
import {
  isBrowser,
  getItem,
  setItem,
  removeItem,
} from '../components/Forms/utils/BrowserStorage'

const AuthContext = createContext()

export function AuthProvider({ children, skipAuthCheck = false }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!skipAuthCheck)
  const location = useLocation()
  const { db } = useFirebase()

  // Use a ref to track mounted state and prevent double listeners
  const isMounted = useRef(true)
  const authListenerRef = useRef(null)

  // Use the form association hook to link anonymous submissions
  useFormAssociation(db, user)

  // Set isMounted to false when component unmounts
  useEffect(() => {
    console.log('[AuthContext] Provider mounted, skipAuthCheck:', skipAuthCheck)
    return () => {
      console.log('[AuthContext] Provider unmounting')
      isMounted.current = false
      // Clean up any existing auth listener
      if (authListenerRef.current) {
        authListenerRef.current()
        authListenerRef.current = null
      }
    }
  }, [])

  // Handle authentication state changes with better cleanup
  useEffect(() => {
    // Clean up any existing listener first
    if (authListenerRef.current) {
      console.log('[AuthContext] Cleaning up existing auth listener')
      authListenerRef.current()
      authListenerRef.current = null
    }

    // Skip auth checking for non-learning paths
    if (skipAuthCheck) {
      console.log(
        '[AuthContext] Skipping auth check as specified for path:',
        location.pathname,
      )
      if (isMounted.current) {
        setLoading(false)
      }
      return
    }

    console.log(
      '[AuthContext] Setting up auth state listener for path:',
      location.pathname,
    )

    const unsubscribe = onAuthStateChanged(
      auth,
      async currentUser => {
        console.log('[AuthContext] Auth state changed:', {
          user: currentUser
            ? `${currentUser.email} (${currentUser.uid})`
            : 'null',
          path: location.pathname,
          mounted: isMounted.current,
          skipAuthCheck,
        })

        // Only update state if component is still mounted
        if (!isMounted.current) {
          console.log(
            '[AuthContext] Component unmounted, skipping state updates',
          )
          return
        }

        // Set the user state
        setUser(currentUser)

        if (currentUser) {
          // Store user data for iframe communication
          console.log('[AuthContext] Setting user data in browserStorage')
          setItem('userEmail', currentUser.email)
          setItem('userId', currentUser.uid)

          // Store company name if available in displayName
          if (currentUser.displayName) {
            console.log(
              '[AuthContext] Setting company name from displayName:',
              currentUser.displayName,
            )
            setItem('companyName', currentUser.displayName)
          }
        } else {
          // Clear user data when logged out
          console.log('[AuthContext] No user, clearing browserStorage')
          removeItem('userEmail')
          removeItem('userId')
          removeItem('companyName')
        }

        if (isMounted.current) {
          console.log('[AuthContext] Setting loading state to false')
          setLoading(false)
        }
      },
      error => {
        // Error handler for onAuthStateChanged
        console.error('[AuthContext] Auth state observer error:', error)
        if (isMounted.current) {
          setLoading(false)
        }
      },
    )

    // Store the unsubscribe function
    authListenerRef.current = unsubscribe

    // Clean up subscription on unmount or effect re-run
    return () => {
      console.log('[AuthContext] Cleaning up auth state observer')
      if (authListenerRef.current) {
        authListenerRef.current()
        authListenerRef.current = null
      }
    }
  }, [skipAuthCheck, location.pathname]) // Include location.pathname for path-based logic

  // Debug log authentication state - Only log when NOT skipping auth check
  useEffect(() => {
    // Skip debug logging on non-learning paths
    if (skipAuthCheck) {
      return
    }

    console.log('[AuthContext] Current auth state:', {
      isAuthenticated: !!user,
      loading,
      path: location.pathname,
      userId: user?.uid,
      companyName: user?.displayName,
    })
  }, [user, loading, location.pathname, skipAuthCheck])

  // Helper function to get the company name
  const getCompanyName = () => {
    if (user && user.displayName) {
      return user.displayName
    }
    // Use browserStorage utility instead of direct localStorage access
    return getItem('companyName', '')
  }

  // Provide context value
  const value = {
    user,
    loading,
    getCompanyName,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  try {
    const context = useContext(AuthContext)
    if (context === undefined) {
      console.warn(
        '[AuthContext] useAuth hook used outside of AuthProvider context',
      )
      // Return a default value that won't break components
      return {
        user: null,
        loading: false,
        getCompanyName: () => '',
      }
    }
    return context
  } catch (error) {
    console.error('[AuthContext] Error using auth context:', error)
    // Return safe default values
    return {
      user: null,
      loading: false,
      getCompanyName: () => '',
    }
  }
}
