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

  // Handle redirect after successful authentication - PREVENT FLASH
  useEffect(() => {
    if (user && !redirectAttempted) {
      console.log('[LoginComponent] User authenticated, preparing redirect')
      setRedirectAttempted(true)

      try {
        let redirectUrl = getSessionItem('redirectUrl', '')
        console.log(
          '[LoginComponent] Raw redirectUrl from session:',
          redirectUrl,
        )

        // FIXED: Handle cases where redirectUrl is invalid or points to login page
        if (
          !redirectUrl ||
          redirectUrl === '/learning/login' ||
          redirectUrl.includes('/login')
        ) {
          console.log(
            '[LoginComponent] Invalid or missing redirectUrl, using default',
          )
          redirectUrl = '/learning/discover/'
        }

        console.log('[LoginComponent] Final redirectUrl:', redirectUrl)

        // Clear the saved redirect URL
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
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    backgroundColor: 'var(--brand-white)',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  }

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow:
      '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)',
  }

  const headerStyle = {
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    color: 'var(--brand-white)',
    padding: '1.5rem',
    textAlign: 'center',
    position: 'relative',
    marginBottom: '1rem',
  }

  // FIXED - Remove conflicting border properties
  const inputStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--brand-grey-300)',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'var(--brand-white)',
    color: 'var(--brand-aqua-800)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  }

  const inputFocusStyle = {
    borderColor: 'var(--brand-blue-400)',
    boxShadow: '0 0 10px rgba(0, 102, 255, 0.2)',
  }

  const buttonPrimaryStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    width: '100%',
    padding: '14px 24px',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-blue-400)',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    outline: 'none',
  }

  const buttonSecondaryStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    background: 'transparent',
    color: 'var(--brand-aqua-800)',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    textDecoration: 'underline',
  }

  const labelStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    display: 'block',
    marginBottom: '8px',
    color: 'var(--brand-aqua-800)',
    fontSize: '14px',
    fontWeight: '600',
  }

  const errorStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    padding: '12px 16px',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-orange) 100%)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-orange)',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '14px',
  }

  const containerStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    minHeight: '100vh',
    background: 'var(--brand-secondary-white)',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  }

  return (
    <div style={containerStyle}>
      <div className='container margin-vert--xl'>
        <div className='row'>
          <div className='col col--4 col--offset-4'>
            <div
              style={cardStyle}
              onMouseEnter={e => {
                Object.assign(e.target.style, cardHoverStyle)
              }}
              onMouseLeave={e => {
                Object.assign(e.target.style, cardStyle)
              }}
            >
              <div style={headerStyle}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'var(--brand-white)',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  {isLogin ? 'Login' : 'Create an Account'}
                </h2>
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background:
                      'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Authentication Required Message */}
              {cameFromProtected && (
                <div
                  style={{
                    padding: '1.5rem 2rem 0',
                    textAlign: 'center',
                    backgroundColor: 'var(--brand-blue-50, #f0f8ff)',
                    borderBottom: '2px solid var(--brand-blue-200, #bfdbfe)',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      background:
                        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
                      color: 'var(--brand-white)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    🔒 {getAuthMessage(redirectUrl)}
                  </div>
                </div>
              )}

              <div style={{ padding: '2rem', marginBottom: '1rem' }}>
                {error && (
                  <div style={errorStyle} role='alert'>
                    {error}
                  </div>
                )}

                <form onSubmit={isLogin ? handleLogin : handleSignup}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor='email' style={labelStyle}>
                      Email:
                    </label>
                    <input
                      id='email'
                      type='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={inputStyle}
                      onFocus={e =>
                        Object.assign(e.target.style, {
                          ...inputStyle,
                          ...inputFocusStyle,
                        })
                      }
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                      required
                      autoComplete='email'
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor='password' style={labelStyle}>
                      Password:
                    </label>
                    <input
                      id='password'
                      type='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={e =>
                        Object.assign(e.target.style, {
                          ...inputStyle,
                          ...inputFocusStyle,
                        })
                      }
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                      required
                      autoComplete={
                        isLogin ? 'current-password' : 'new-password'
                      }
                    />
                  </div>

                  {!isLogin && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label htmlFor='companyName' style={labelStyle}>
                        Company Name:
                      </label>
                      <input
                        id='companyName'
                        type='text'
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        style={inputStyle}
                        onFocus={e =>
                          Object.assign(e.target.style, {
                            ...inputStyle,
                            ...inputFocusStyle,
                          })
                        }
                        onBlur={e => Object.assign(e.target.style, inputStyle)}
                        required
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <button
                      type='submit'
                      style={buttonPrimaryStyle}
                      onMouseEnter={e => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow =
                            '0 0 20px rgba(0, 102, 255, 0.4), 0 4px 16px rgba(0, 102, 255, 0.3)'
                        }
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      onMouseDown={e => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-1px)'
                        }
                      }}
                      onMouseUp={e => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)'
                        }
                      }}
                      disabled={loading}
                    >
                      {loading
                        ? 'Processing...'
                        : isLogin
                        ? 'Login'
                        : 'Sign Up'}
                    </button>
                  </div>
                </form>
              </div>

              <div
                style={{
                  padding: '1rem 2rem 2rem',
                  textAlign: 'center',
                  borderTop: '1px solid var(--brand-grey-250)',
                }}
              >
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null) // Clear any previous errors
                  }}
                  style={buttonSecondaryStyle}
                  onMouseEnter={e => {
                    e.target.style.color = 'var(--brand-aqua)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.color = 'var(--brand-aqua-800)'
                  }}
                >
                  {isLogin
                    ? 'Need an account? Sign up'
                    : 'Already have an account? Login'}
                </button>
              </div>
            </div>

            {/* Don't Want to Login Menu - Below the login card */}
            <div
              style={{
                marginTop: '2rem',
                textAlign: 'center',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--brand-aqua-800)',
                  marginBottom: '1rem',
                }}
              >
                Don't want to login right now?
              </h3>

              <div
                style={{
                  border: '2px solid var(--brand-blue-400)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--brand-white)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 102, 255, 0.1)',
                  maxWidth: '400px',
                  margin: '0 auto',
                }}
              >
                {/* Learning Hub Option */}
                <button
                  onClick={() => {
                    removeSessionItem('redirectUrl')
                    history.push('/learning/')
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    border: '2px solid var(--brand-grey-300)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-white)',
                    color: 'var(--brand-aqua-800)',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = 'var(--brand-blue-400)'
                    e.target.style.backgroundColor = 'var(--brand-blue-50)'
                    e.target.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = 'var(--brand-grey-300)'
                    e.target.style.backgroundColor = 'var(--brand-white)'
                    e.target.style.transform = 'translateX(0)'
                  }}
                  disabled={loading}
                >
                  → Learning Hub
                </button>

                {/* Discover Resolve Option */}
                <button
                  onClick={() => {
                    removeSessionItem('redirectUrl')
                    history.push('/learning/discover')
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    border: '2px solid var(--brand-grey-300)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-white)',
                    color: 'var(--brand-aqua-800)',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = 'var(--brand-blue-400)'
                    e.target.style.backgroundColor = 'var(--brand-blue-50)'
                    e.target.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = 'var(--brand-grey-300)'
                    e.target.style.backgroundColor = 'var(--brand-white)'
                    e.target.style.transform = 'translateX(0)'
                  }}
                  disabled={loading}
                >
                  → Discover Resolve
                </button>

                {/* Service Blueprinting Catalog Option */}
                <button
                  onClick={() => {
                    removeSessionItem('redirectUrl')
                    history.push('/learning/service-blueprinting/')
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid var(--brand-grey-300)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-white)',
                    color: 'var(--brand-aqua-800)',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = 'var(--brand-blue-400)'
                    e.target.style.backgroundColor = 'var(--brand-blue-50)'
                    e.target.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = 'var(--brand-grey-300)'
                    e.target.style.backgroundColor = 'var(--brand-white)'
                    e.target.style.transform = 'translateX(0)'
                  }}
                  disabled={loading}
                >
                  → Service Blueprinting Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
