// Complete Fixed LoginComponent with proper redirect logic
// src/components/service-blueprinting/login/LoginComponent.jsx

import React, { useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useHistory } from '@docusaurus/router'
import { auth } from '@site/src/firebase/firebase'
import { useAuth } from '@site/src/contexts/AuthContext'
import {
  setItem,
  getSessionItem,
  removeSessionItem,
} from '@site/src/components/Forms/utils/BrowserStorage'

export default function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const { user } = useAuth()
  const [redirectAttempted, setRedirectAttempted] = useState(false)

  // Check if user was redirected from a protected page
  const redirectUrl = getSessionItem('redirectUrl', '')

  // Helper functions to classify pages
  const isPublicPage = url => {
    const publicPaths = [
      '/learning/',
      '/learning/discover',
      '/learning/actions',
      '/learning/contact-us',
      '/', // homepage
    ]
    return publicPaths.some(path => url.startsWith(path))
  }

  const isProtectedPage = url => {
    return (
      url.includes('/service-blueprinting') ||
      url.includes('/automation-essentials')
    )
  }

  // Determine page origin
  const cameFromPublic = isPublicPage(redirectUrl)
  const cameFromProtected = isProtectedPage(redirectUrl)

  // Get user-friendly course name for auth message
  const getAuthMessage = url => {
    if (url.includes('service-blueprinting')) {
      return 'The Service Blueprinting course requires you to login.'
    }
    if (url.includes('automation-essentials')) {
      return 'The Automation Essentials course requires you to login.'
    }
    return 'This content requires you to login.'
  }

  // Debug logging for component mounting and state changes
  useEffect(() => {
    console.log('[LoginComponent] Mounted')
    return () => console.log('[LoginComponent] Unmounted')
  }, [])

  // Handle redirect after successful authentication - FIXED LOGIC
  useEffect(() => {
    if (user && !redirectAttempted) {
      console.log('[LoginComponent] User authenticated, preparing redirect')
      setRedirectAttempted(true)

      try {
        // Try the protected key first, then fall back to regular key
        let redirectUrl =
          getSessionItem('protectedPageRedirect', '') ||
          getSessionItem('redirectUrl', '')
        console.log(
          '[LoginComponent] Raw redirectUrl from session:',
          redirectUrl,
        )

        // FIXED: Only default to discover if there's NO saved redirect URL at all
        // OR if the saved URL is the login page itself (invalid redirect)
        if (!redirectUrl || redirectUrl === '/learning/login') {
          console.log(
            '[LoginComponent] No valid redirectUrl found, using default',
          )
          redirectUrl = '/learning/discover/'
        } else {
          console.log('[LoginComponent] Using saved redirectUrl:', redirectUrl)
        }

        console.log('[LoginComponent] Final redirectUrl:', redirectUrl)

        // Clear both redirect URLs
        removeSessionItem('protectedPageRedirect')
        removeSessionItem('redirectUrl')

        // Immediate redirect for already-logged-in users (no delay needed)
        console.log('[LoginComponent] Executing redirect to:', redirectUrl)
        history.push(redirectUrl)
      } catch (error) {
        console.error('[LoginComponent] Error during redirect:', error)
        setLoading(false)
        // Use React Router's history for fallback too
        history.push('/learning/discover/')
      }
    }
  }, [user, redirectAttempted, history])

  // PREVENT RENDERING LOGIN FORM IF USER IS ALREADY AUTHENTICATED
  if (user && !redirectAttempted) {
    // Show loading state instead of flashing login form
    return (
      <div
        style={{
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          minHeight: '100vh',
          background: 'var(--brand-secondary-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontSize: '1.2rem',
            color: 'var(--brand-black-700)',
          }}
        >
          <div
            style={{
              marginBottom: '1rem',
              fontSize: '2rem',
            }}
          >
            ✓
          </div>
          Welcome back, {user.email}!
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '1rem',
              color: 'var(--brand-grey-600)',
            }}
          >
            Redirecting you to the learning hub...
          </div>
        </div>
      </div>
    )
  }

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('[LoginComponent] Attempting login for:', email)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      console.log('[LoginComponent] Login successful for:', email)

      // Check if there's company name in displayName and save to browserStorage
      if (userCredential.user.displayName) {
        console.log(
          '[LoginComponent] Company name found in profile:',
          userCredential.user.displayName,
        )
        setItem('companyName', userCredential.user.displayName)
      }

      // Don't set loading to false here - let the redirect useEffect handle it
    } catch (error) {
      console.error('[LoginComponent] Login error:', error)
      setError(getErrorMessage(error))
      setLoading(false) // Only set loading false on error
    }
  }

  const handleSignup = async e => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password should be at least 6 characters')
      return
    }

    if (!companyName.trim()) {
      setError('Company name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('[LoginComponent] Attempting signup for:', email)

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      console.log(
        '[LoginComponent] User created successfully:',
        userCredential.user.uid,
      )

      // Store company name in the user's displayName field
      await updateProfile(userCredential.user, {
        displayName: companyName,
      })
      console.log(
        '[LoginComponent] Company name stored in user profile displayName',
      )

      // Also store in browserStorage for easy access
      setItem('companyName', companyName)
      console.log('[LoginComponent] Company name stored in browserStorage')

      // MANUAL FIX: Force user state update for signup
      // The AuthContext listener might not catch the state change fast enough
      console.log(
        '[LoginComponent] Manually triggering auth state refresh after signup',
      )

      // Force Firebase to refresh the current user and trigger listeners
      await auth.currentUser.reload()
      console.log(
        '[LoginComponent] Auth state refreshed, current user:',
        auth.currentUser?.email,
      )

      // Don't set loading to false here - let the redirect useEffect handle it
    } catch (error) {
      console.error('[LoginComponent] Signup error:', error)
      setError(getErrorMessage(error))
      setLoading(false) // Only set loading false on error
    }
  }

  // Function to get user-friendly error messages
  const getErrorMessage = error => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered'
      case 'auth/invalid-email':
        return 'Invalid email format'
      case 'auth/weak-password':
        return 'Password is too weak'
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password'
      default:
        return error.message
    }
  }

  // FIXED STYLES - Remove conflicting properties
  const cardStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    border: '2px solid var(--brand-blue-400)',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'var(--brand-white)',
    padding: '0', // Remove padding from card, let sections handle it
    margin: '2rem auto',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    overflow: 'hidden',
  }

  const gradientStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 15% 25%, rgba(0, 80, 199, 0.08) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 1,
  }

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    padding: '3rem 2.5rem',
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  }

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--brand-black-700)',
    margin: '0 0 1rem 0',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  }

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: 'var(--brand-grey-600)',
    margin: 0,
    lineHeight: '1.5',
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  }

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--brand-black-700)',
    margin: 0,
  }

  const inputStyle = {
    padding: '0.75rem 1rem',
    border: '2px solid var(--brand-grey-300)',
    borderRadius: '6px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--brand-white)',
  }

  const buttonStyle = {
    padding: '0.875rem 2rem',
    backgroundColor: 'var(--brand-blue)',
    color: 'var(--brand-white)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    opacity: loading ? 0.7 : 1,
    transform: loading ? 'none' : 'scale(1)',
    boxShadow: loading
      ? 'none'
      : '0 4px 12px rgba(0, 102, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
  }

  const errorStyle = {
    color: 'var(--brand-red, #dc2626)',
    fontSize: '0.95rem',
    textAlign: 'center',
    margin: '1rem 0 0 0',
    padding: '0.75rem',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    borderRadius: '6px',
  }

  const toggleStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    color: 'var(--brand-grey-600)',
  }

  const toggleLinkStyle = {
    color: 'var(--brand-blue)',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--brand-secondary-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={cardStyle}>
        <div style={gradientStyle}></div>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={subtitleStyle}>
              {redirectUrl && cameFromProtected
                ? getAuthMessage(redirectUrl)
                : isLogin
                ? 'Sign in to access your learning dashboard'
                : 'Join thousands of automation professionals'}
            </p>
          </div>

          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            style={formStyle}
          >
            <div style={inputGroupStyle}>
              <label htmlFor='email' style={labelStyle}>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder='Enter your email'
                disabled={loading}
              />
            </div>

            <div style={inputGroupStyle}>
              <label htmlFor='password' style={labelStyle}>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder={
                  isLogin
                    ? 'Enter your password'
                    : 'Create a password (6+ characters)'
                }
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div style={inputGroupStyle}>
                <label htmlFor='companyName' style={labelStyle}>
                  Company Name
                </label>
                <input
                  type='text'
                  id='companyName'
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder='Enter your company name'
                  disabled={loading}
                />
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--brand-blue-400)'
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow =
                    '0 6px 16px rgba(0, 102, 255, 0.3), 0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--brand-blue)'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow =
                    '0 4px 12px rgba(0, 102, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {loading
                ? isLogin
                  ? 'Signing in...'
                  : 'Creating account...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>

            {error && <div style={errorStyle}>{error}</div>}
          </form>

          <div style={toggleStyle}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setEmail('')
                setPassword('')
                setCompanyName('')
              }}
              style={toggleLinkStyle}
              onMouseEnter={e => {
                e.target.style.textDecoration = 'underline'
              }}
              onMouseLeave={e => {
                e.target.style.textDecoration = 'none'
              }}
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </span>
          </div>

          {redirectUrl && cameFromPublic && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--brand-blue-50, #f0f7ff)',
                borderRadius: '6px',
                border: '1px solid var(--brand-blue-200, #bde0ff)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'var(--brand-blue-700, #1e40af)',
                }}
              >
                Don't want to login right now?{' '}
                <span
                  onClick={() => history.push('/learning/')}
                  style={{
                    color: 'var(--brand-blue)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Browse our free content
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
