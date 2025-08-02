// Simplified AuthContext with single auth listener and no race conditions
// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
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
  const location = useLocation()
  const { db } = useFirebase()

  // Use the form association hook to link anonymous submissions
  useFormAssociation(db, user)

  // Single auth listener with simplified logic
  useEffect(() => {
    // Skip auth checking for non-learning paths
    if (skipAuthCheck) {
      console.log('[AuthContext] Skipping auth check for:', location.pathname)
      setLoading(false)
      return
    }

    console.log(
      '[AuthContext] Setting up auth listener for:',
      location.pathname,
    )

    // Single auth state listener
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

        setLoading(false)
      },
      error => {
        console.error('[AuthContext] Auth error:', error)
        setLoading(false)
      },
    )

    // Cleanup
    return () => {
      console.log('[AuthContext] Cleaning up auth listener')
      unsubscribe()
    }
  }, [skipAuthCheck]) // Remove location.pathname dependency to prevent re-runs

  // Helper function to get the company name
  const getCompanyName = () => {
    if (user && user.displayName) {
      return user.displayName
    }
    return getItem('companyName', '')
  }

  // Show loading screen until auth resolves - prevents button issues
  if (loading) {
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

  // Provide context value
  const value = {
    user,
    loading: false, // Always false here since we handled loading above
    getCompanyName,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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
