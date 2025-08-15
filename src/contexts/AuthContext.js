// AuthContext with navigation loading state fix
// src/contexts/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useLocation } from '@docusaurus/router'
import { auth } from '@site/src/firebase/firebase'
import useFormAssociation from '../components/Forms/utils/UseFormAssociation'
import { useFirebase } from './FirebaseContext'
import {
  getItem,
  setItem,
  removeItem,
} from '../components/Forms/utils/BrowserStorage'

const AuthContext = createContext()

export function AuthProvider({ children, skipAuthCheck = false }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!skipAuthCheck)
  const [authInitialized, setAuthInitialized] = useState(false)
  const location = useLocation()
  const { db } = useFirebase()

  // Memoize company name function to prevent recreations
  const getCompanyName = useCallback(() => {
    if (user && user.displayName) {
      return user.displayName
    }
    return getItem('companyName', '')
  }, [user])

  // FIX 3: Conditionally call useFormAssociation only when user exists
  useFormAssociation(user ? db : null, user)

  // FIXED: Single auth listener that doesn't re-initialize on navigation
  useEffect(() => {
    console.log(
      '[AuthContext] Setting up auth listener for:',
      location.pathname,
    )

    // FIX 2: Don't set loading=false immediately, wait for auth listener to fire
    if (skipAuthCheck) {
      console.log(
        '[AuthContext] Login page - will set loading=false after auth listener fires',
      )
    } else {
      console.log('[AuthContext] Protected page - full auth checking')
    }

    // FIX 1: Remove the early return that prevents auth listener setup
    // Always set up the auth listener regardless of authInitialized state

    const unsubscribe = onAuthStateChanged(
      auth,
      currentUser => {
        console.log(
          '[AuthContext] Auth state changed:',
          currentUser ? currentUser.email : 'null',
        )

        setUser(currentUser)

        if (currentUser) {
          // Store user data
          setItem('userEmail', currentUser.email)
          setItem('userId', currentUser.uid)

          if (currentUser.displayName) {
            setItem('companyName', currentUser.displayName)
          }
        } else {
          // Clear user data
          removeItem('userEmail')
          removeItem('userId')
          removeItem('companyName')
        }

        // FIX 2: Always set loading=false and authInitialized=true after first auth state change
        setLoading(false)
        setAuthInitialized(true)
      },
      error => {
        console.error('[AuthContext] Auth error:', error)
        // FIX 2: Set loading=false even on error
        setLoading(false)
        setAuthInitialized(true)
      },
    )

    // Cleanup
    return () => {
      console.log('[AuthContext] Cleaning up auth listener')
      unsubscribe()
    }
  }, [skipAuthCheck]) // FIXED: Removed location.pathname dependency to prevent re-initialization on navigation

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      getCompanyName,
    }),
    [user, loading, getCompanyName],
  )

  // Show loading screen until auth resolves - prevents button issues
  if (loading && !skipAuthCheck) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          fontSize: '1.1rem',
          color: 'var(--brand-grey-600, #666)',
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

// Simplified useAuth hook with better error handling
export function useAuth() {
  try {
    const context = useContext(AuthContext)
    if (context === undefined) {
      console.warn(
        '[AuthContext] useAuth used outside AuthProvider - returning defaults',
      )
      return {
        user: null,
        loading: false,
        getCompanyName: () => '',
      }
    }
    return context
  } catch (error) {
    console.error('[AuthContext] Error in useAuth:', error)
    return {
      user: null,
      loading: false,
      getCompanyName: () => '',
    }
  }
}
