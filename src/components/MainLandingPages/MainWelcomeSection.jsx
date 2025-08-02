import React, { useState } from 'react'
import { useAuth } from '@site/src/contexts/AuthContext'
import Link from '@docusaurus/Link'
import { auth } from '@site/src/firebase/firebase'
import { signOut } from 'firebase/auth'
import { useHistory } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * Reusable welcome section component for form and course pages
 * Wrapped in BrowserOnly for SSR compatibility
 */
const WelcomeSection = props => {
  return (
    <BrowserOnly fallback={<div>Loading welcome information...</div>}>
      {() => <WelcomeSectionClient {...props} />}
    </BrowserOnly>
  )
}

/**
 * Client-side implementation of the welcome section
 * @param {Object} props Component props
 * @param {string} props.accessMessage Message about what access user has (optional)
 * @param {string} props.guestTitle Title to show for non-logged in users (optional)
 * @param {string} props.guestMessage Message to show for non-logged in users (optional)
 * @returns {JSX.Element} Welcome Section component
 */
const WelcomeSectionClient = ({
  accessMessage = 'You have full access to all content.',
  guestTitle = 'Welcome!',
  guestMessage = 'Please login to access all content.',
}) => {
  const { user, loading } = useAuth()
  const history = useHistory()
  const [isHovered, setIsHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isLinkHovered, setIsLinkHovered] = useState(false)
  const [showLogoutMessage, setShowLogoutMessage] = useState(false)

  // Handle logout detection and redirect
  React.useEffect(() => {
    console.log(
      '[WelcomeSection] useEffect triggered - loading:',
      loading,
      'user:',
      user ? user.email : 'null',
    )

    // Don't redirect while auth is still loading
    if (loading) {
      console.log('[WelcomeSection] Auth is loading, waiting...')
      return
    }

    if (!loading && !user) {
      // Check if we should show the logout banner
      const shouldShowBanner =
        sessionStorage.getItem('showLogoutBanner') === 'true'
      console.log('[WelcomeSection] Should show banner:', shouldShowBanner)

      if (shouldShowBanner) {
        // Clear the flag immediately so it only shows once
        sessionStorage.removeItem('showLogoutBanner')
        console.log('[WelcomeSection] Showing logout banner and redirecting')

        setShowLogoutMessage(true)

        // Redirect to Learning Hub after 3 seconds
        const timer = setTimeout(() => {
          console.log('[WelcomeSection] Redirecting to Learning Hub')
          history.push('/learning/')
        }, 3000)

        return () => clearTimeout(timer)
      } else {
        // Normal "not authenticated" behavior - redirect to login
        console.log(
          '[WelcomeSection] User not authenticated, redirecting to login',
        )
        history.push('/learning/login')
      }
    } else if (!loading && user) {
      console.log('[WelcomeSection] User authenticated:', user.email)
      setShowLogoutMessage(false)
    }
  }, [user, loading, history])

  const handleLogout = async () => {
    try {
      console.log('[MainWelcomeSection] User initiating logout')

      // Show banner immediately (don't wait for AuthContext)
      setShowLogoutMessage(true)
      console.log('[MainWelcomeSection] Logout banner shown immediately')

      // Sign out from Firebase
      await signOut(auth)
      console.log('[MainWelcomeSection] Firebase sign out successful')

      // Redirect after 3 seconds
      setTimeout(() => {
        console.log('[MainWelcomeSection] Redirecting to Learning Hub')
        history.push('/learning/')
      }, 3000)
    } catch (error) {
      console.error('[MainWelcomeSection] Error signing out:', error)
      // Still show banner even on error
      setShowLogoutMessage(true)
      setTimeout(() => {
        history.push('/learning/')
      }, 3000)
    }
  }

  // Show loading state while auth is being determined
  if (loading) {
    console.log('[WelcomeSection] Showing loading state')
    return (
      <div
        style={{
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '2px solid var(--brand-blue-400)',
          backgroundColor: 'var(--brand-white)',
          boxShadow:
            '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'inline-block',
              width: '30px',
              height: '30px',
              border: '3px solid var(--brand-blue-100)',
              borderTop: '3px solid var(--brand-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
        <p
          style={{
            color: 'var(--brand-grey-600)',
            margin: 0,
            fontSize: '1.1rem',
          }}
        >
          Loading your learning dashboard...
        </p>
      </div>
    )
  }

  // Show logout message
  if (showLogoutMessage) {
    return (
      <div
        style={{
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '2px solid var(--brand-green, #10b981)',
          backgroundColor: 'var(--brand-white)',
          boxShadow:
            '0 0 15px rgba(16, 185, 129, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              fontSize: '2rem',
              color: 'var(--brand-green, #10b981)',
            }}
          >
            ✓
          </div>
        </div>
        <h3
          style={{
            color: 'var(--brand-black-700)',
            margin: '0 0 1rem 0',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}
        >
          You have been logged out
        </h3>
        <p
          style={{
            color: 'var(--brand-grey-600)',
            margin: 0,
            fontSize: '1.1rem',
          }}
        >
          Redirecting you to the Learning Hub...
        </p>
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid var(--brand-green-200, #bbf7d0)',
              borderTop: '2px solid var(--brand-green, #10b981)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
      </div>
    )
  }

  // Brand-compliant styles
  const styles = {
    card: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5rem',
      borderRadius: '12px',
      border: '2px solid var(--brand-blue-400)',
      backgroundColor: 'var(--brand-white)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      marginBottom: '2rem',
      transform: isHovered && user ? 'translateY(-5px)' : 'translateY(0)',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
      borderRadius: '12px',
      pointerEvents: 'none',
      zIndex: 1,
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    headerSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    nameText: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: 'var(--brand-black-700)',
      margin: 0,
      lineHeight: '1.2',
    },
    infoSection: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '2rem',
    },
    userInfo: {
      flex: 1,
    },
    description: {
      fontSize: '1rem',
      color: 'var(--brand-grey-700)',
      margin: '0 0 0.5rem 0',
      lineHeight: '1.5',
    },
    email: {
      fontSize: '0.9rem',
      color: 'var(--brand-grey-600)',
      margin: 0,
      fontStyle: 'italic',
    },
    logoutButton: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      color: 'var(--brand-aqua-800)',
      border: '2px solid var(--brand-grey-400)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      outline: 'none',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      whiteSpace: 'nowrap',
    },
    logoutButtonHover: {
      borderColor: 'var(--brand-blue-400)',
      backgroundColor: 'var(--brand-blue-50)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)',
    },
    logoutButtonActive: {
      transform: 'translateY(-1px)',
    },
    guestTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: 'var(--brand-black-700)',
      margin: '0 0 1rem 0',
    },
    guestMessage: {
      fontSize: '1rem',
      color: 'var(--brand-grey-700)',
      margin: 0,
      lineHeight: '1.5',
    },
    loginLink: {
      color: 'var(--brand-aqua-800)',
      textDecoration: 'underline',
      fontWeight: '600',
      transition: 'color 0.3s ease',
    },
    loginLinkHover: {
      color: 'var(--brand-aqua)',
    },
  }

  const getCardStyle = () => {
    return {
      ...styles.card,
      ...(isHovered && user ? { transform: 'translateY(-5px)' } : {}),
    }
  }

  const getButtonStyle = () => {
    return {
      ...styles.logoutButton,
      ...(isButtonHovered ? styles.logoutButtonHover : {}),
      ...(isButtonActive ? styles.logoutButtonActive : {}),
    }
  }

  const getLinkStyle = () => {
    return {
      ...styles.loginLink,
      ...(isLinkHovered ? styles.loginLinkHover : {}),
    }
  }

  const handleButtonMouseDown = () => setIsButtonActive(true)
  const handleButtonMouseUp = () => setIsButtonActive(false)

  // Conditional rendering based on user authentication status
  return (
    <div
      style={getCardStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand gradient overlay */}
      <div style={styles.gradientOverlay} />

      {user ? (
        <div style={styles.contentWrapper}>
          <div style={styles.headerSection}>
            <h2 style={styles.nameText}>
              Welcome, {user.displayName || user.email.split('@')[0]}
            </h2>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.userInfo}>
              <p style={styles.description}>{accessMessage}</p>
              <p style={styles.email}>Logged in as {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={getButtonStyle()}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => {
                setIsButtonHovered(false)
                setIsButtonActive(false)
              }}
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '1rem 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h3 style={styles.guestTitle}>{guestTitle}</h3>
          <p style={styles.guestMessage}>
            {guestMessage}{' '}
            <Link
              to='/learning/login'
              style={getLinkStyle()}
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              login
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default WelcomeSection
