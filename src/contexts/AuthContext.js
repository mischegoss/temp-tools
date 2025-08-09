// Optimized AuthContext with stable state management
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

  // FIXED: Always call hooks in the same order - move useCallback before useFormAssociation
  // Memoize company name function to prevent recreations
  const getCompanyName = useCallback(() => {
    if (user && user.displayName) {
      return user.displayName
    }
    return getItem('companyName', '')
  }, [user])

  // FIXED: Use the form association hook but ensure it's always called
  // Pass null instead of undefined to maintain hook order
  useFormAssociation(db || null, user)

  // Single auth listener with optimized logic
  useEffect(() => {
    // Always set up auth listener, but behavior differs based on skipAuthCheck
    if (skipAuthCheck) {
      console.log(
        '[AuthContext] Setting up auth listener for login page:',
        location.pathname,
      )
      // For login page: listen for auth changes but don't show loading states
      setLoading(false)
      setAuthInitialized(true)
    } else {
      console.log(
        '[AuthContext] Setting up auth listener for protected page:',
        location.pathname,
      )
      // For protected pages: full auth checking with loading states
    }

    // Only initialize once
    if (authInitialized && !skipAuthCheck) {
      return
    }

    // Single auth state listener - ALWAYS set up for both login and protected pages
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

        // Only set loading false for protected pages (login page already has loading=false)
        if (!skipAuthCheck) {
          setLoading(false)
          setAuthInitialized(true)
        }
      },
      error => {
        console.error('[AuthContext] Auth error:', error)
        if (!skipAuthCheck) {
          setLoading(false)
          setAuthInitialized(true)
        }
      },
    )

    // Cleanup
    return () => {
      console.log('[AuthContext] Cleaning up auth listener')
      unsubscribe()
    }
  }, [skipAuthCheck, authInitialized, location.pathname])

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
