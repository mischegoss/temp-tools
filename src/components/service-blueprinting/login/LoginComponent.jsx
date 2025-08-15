// src/components/service-blueprinting/login/LoginComponent.jsx

import React, { useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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

  // Password reset states
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

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

    // FIXED: Cleanup function to reset states when component unmounts
    return () => {
      console.log('[LoginComponent] Unmounted')
      setLoading(false)
      setError(null)
    }
  }, [])

  // Handle redirect after successful authentication
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

        // Only default to discover if there's NO saved redirect URL at all
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

        // Immediate redirect for already-logged-in users
        console.log('[LoginComponent] Executing redirect to:', redirectUrl)
        history.push(redirectUrl)
      } catch (error) {
        console.error('[LoginComponent] Error during redirect:', error)
        setLoading(false)
        history.push('/learning/discover/')
      }
    }
  }, [user, redirectAttempted, history])

  // Login handler
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
      setLoading(false)
    }
  }

  // Signup handler
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
      setLoading(false)
    }
  }

  // Password reset handler
  const handlePasswordReset = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log(
        '[LoginComponent] Sending password reset email to:',
        resetEmail,
      )
      await sendPasswordResetEmail(auth, resetEmail)
      console.log('[LoginComponent] Password reset email sent successfully')
      setResetEmailSent(true)
      setLoading(false)
    } catch (error) {
      console.error('[LoginComponent] Password reset error:', error)
      setError(getErrorMessage(error))
      setLoading(false)
    }
  }

  // FIXED: Consistent error message function
  const getErrorMessage = error => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered'
      case 'auth/invalid-email':
        return 'Invalid email format'
      case 'auth/weak-password':
        return 'Password is too weak'
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Invalid email or password'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.'
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again.'
      default:
        return error.message || 'An unexpected error occurred'
    }
  }

  // FIXED: Complete state reset when toggling modes
  const toggleMode = () => {
    setIsLogin(!isLogin)
    setIsPasswordReset(false)
    setResetEmailSent(false)
    setResetEmail('')
    setError(null) // FIXED: Clear error state
    setEmail('')
    setPassword('')
    setCompanyName('')
    setLoading(false) // FIXED: Clear loading state
  }

  // FIXED: Complete password reset flow cleanup
  const resetPasswordFlow = () => {
    setIsPasswordReset(false)
    setResetEmailSent(false)
    setResetEmail('')
    setError(null)
    setLoading(false) // FIXED: Clear loading state
  }

  // FIXED: Only pre-fill email if in login mode
  const startPasswordReset = () => {
    setIsPasswordReset(true)
    setError(null)
    setLoading(false) // FIXED: Clear loading state
    // Only pre-fill with email if user was in login mode
    setResetEmail(isLogin ? email : '')
  }

  // FIXED: HANDLE REDIRECT IMMEDIATELY WHEN USER IS AUTHENTICATED
  // This fixes the direct navigation issue by executing redirect logic immediately
  if (user && !redirectAttempted) {
    console.log(
      '[LoginComponent] User authenticated, executing immediate redirect',
    )

    // Execute redirect logic immediately (moved from useEffect)
    setTimeout(() => {
      try {
        setRedirectAttempted(true)

        // Try the protected key first, then fall back to regular key
        let redirectUrl =
          getSessionItem('protectedPageRedirect', '') ||
          getSessionItem('redirectUrl', '')
        console.log(
          '[LoginComponent] Raw redirectUrl from session:',
          redirectUrl,
        )

        // Only default to discover if there's NO saved redirect URL at all
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

        // Immediate redirect for already-logged-in users
        console.log('[LoginComponent] Executing redirect to:', redirectUrl)
        history.push(redirectUrl)
      } catch (error) {
        console.error('[LoginComponent] Error during redirect:', error)
        setLoading(false)
        history.push('/learning/discover/')
      }
    }, 100) // Small delay to ensure state updates

    // Show welcome message while redirect executes
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
              marginTop: '1rem',
              fontSize: '1rem',
              color: 'var(--brand-grey-600)',
            }}
          >
            Redirecting you now...
          </div>
        </div>
      </div>
    )
  }

  // Style definitions
  const containerStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    minHeight: '100vh',
    background: 'var(--brand-secondary-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  }

  const cardStyle = {
    background: 'var(--brand-white)',
    borderRadius: '16px',
    border: '2px solid var(--brand-blue-400)',
    boxShadow: '0 0 30px rgba(0, 102, 255, 0.15)',
    padding: '0',
    width: '100%',
    maxWidth: '500px',
    overflow: 'hidden',
  }

  const contentStyle = {
    padding: '3rem',
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  }

  const titleStyle = {
    color: 'var(--brand-black-700)',
    margin: '0 0 1rem 0',
    fontSize: '2.5rem',
    fontWeight: '600',
  }

  const subtitleStyle = {
    color: 'var(--brand-grey-600)',
    margin: '0',
    fontSize: '1.2rem',
    lineHeight: '1.6',
  }

  const formStyle = {
    marginBottom: '2rem',
  }

  const inputGroupStyle = {
    marginBottom: '1.5rem',
  }

  const labelStyle = {
    display: 'block',
    color: 'var(--brand-black-700)',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
  }

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    border: '2px solid var(--brand-grey-300)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  }

  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'var(--brand-blue)',
    color: 'var(--brand-white)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontFamily: 'inherit',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  }

  const toggleStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: 'var(--brand-grey-600)',
    fontSize: '1rem',
  }

  const toggleLinkStyle = {
    color: 'var(--brand-blue)',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '500',
  }

  const errorStyle = {
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    padding: '1rem',
    color: '#c33',
    fontSize: '0.95rem',
    marginTop: '1rem',
    textAlign: 'center',
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {resetEmailSent ? (
          // Success message after password reset email sent
          <div style={contentStyle}>
            <div style={headerStyle}>
              <div
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                }}
              >
                ✅
              </div>
              <h1 style={titleStyle}>Check Your Email</h1>
              <p style={subtitleStyle}>
                We've sent a password reset link to {resetEmail}.
              </p>
            </div>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--brand-grey-600)',
                fontSize: '1rem',
                marginBottom: '2rem',
              }}
            >
              The email may take a few minutes to arrive.
              <br />
              Check your spam/junk folder.
            </p>
            <button
              type='button'
              onClick={resetPasswordFlow}
              style={{
                ...buttonStyle,
                backgroundColor: 'var(--brand-grey-500)',
              }}
            >
              Back to Login
            </button>
          </div>
        ) : isPasswordReset ? (
          // Password reset form
          <div style={contentStyle}>
            <div style={headerStyle}>
              <h1 style={titleStyle}>Reset Password</h1>
              <p style={subtitleStyle}>
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <form onSubmit={handlePasswordReset} style={formStyle}>
              <div style={inputGroupStyle}>
                <label htmlFor='resetEmail' style={labelStyle}>
                  Email Address
                </label>
                <input
                  type='email'
                  id='resetEmail'
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder='Enter your email'
                  disabled={loading}
                />
              </div>

              <button type='submit' disabled={loading} style={buttonStyle}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              {error && <div style={errorStyle}>{error}</div>}
            </form>

            <div style={toggleStyle}>
              <span onClick={resetPasswordFlow} style={toggleLinkStyle}>
                ← Back to Login
              </span>
            </div>
          </div>
        ) : (
          // Login/Signup form
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
                      : 'Create a password (min 6 characters)'
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

              <button type='submit' disabled={loading} style={buttonStyle}>
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

            {/* Forgot Password Link - Only show for login mode */}
            {isLogin && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span
                  onClick={startPasswordReset}
                  style={{
                    ...toggleLinkStyle,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Forgot your password?
                </span>
              </div>
            )}

            {/* Toggle between login/signup */}
            <div style={toggleStyle}>
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span onClick={toggleMode} style={toggleLinkStyle}>
                    Sign up here
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span onClick={toggleMode} style={toggleLinkStyle}>
                    Login here
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
