// src/components/Forms/utils/WelcomeSection.jsx
import React, { useState } from 'react'
import { useAuth } from '@site/src/contexts/AuthContext'
import Link from '@docusaurus/Link'
import { auth } from '@site/src/firebase/firebase'
import { signOut } from 'firebase/auth'
import { useHistory } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { setSessionItem } from '@site/src/components/Forms/utils/BrowserStorage'

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
  const { user, userProfile } = useAuth()
  const history = useHistory()
  const [isHovered, setIsHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  // Handle redirect for non-logged in users
  React.useEffect(() => {
    if (!user) {
      // Store the current URL before redirecting to login - using safe browserStorage
      setSessionItem('redirectUrl', window.location.pathname)
      // Use React Router history instead of window.location
      history.push('/learning/login')
    }
  }, [user, history])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      history.push('/learning/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Brand-compliant styles
  const styles = {
    card: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5rem',
      borderRadius: '12px',
      border: '2px solid var(--brand-blue-400)', // Brand secondary stroke outline
      backgroundColor: 'var(--brand-white)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', // Brand shadow
      transition: 'all 0.3s ease-in-out',
      marginBottom: '2rem',
      transform: isHovered && user ? 'translateY(-5px)' : 'none', // Brand hover lift
      position: 'relative',
      overflow: 'hidden',
    },
    cardHover: {
      boxShadow:
        '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)', // Enhanced brand shadow
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
      pointerEvents: 'none',
      borderRadius: '12px',
      zIndex: 1,
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
    },
    headerSection: {
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid var(--brand-aqua)', // Brand aqua divider
      textAlign: 'center',
    },
    nameText: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-blue)', // Brand blue
      fontSize: '2.25rem',
      fontWeight: '700',
      margin: '0',
    },
    infoSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    description: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontSize: '1.1rem',
      color: 'var(--brand-grey-600)',
      lineHeight: '1.5',
      fontWeight: '500',
    },
    email: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontSize: '1rem',
      marginTop: '0.5rem',
      color: 'var(--brand-grey-600)',
    },
    button: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      padding: '14px 28px',
      fontSize: '1.1rem',
      fontWeight: '600',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', // Brand aqua gradient
      color: 'var(--brand-white)',
      border: '2px solid var(--brand-aqua)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      boxShadow: 'none',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      outline: 'none',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow:
        '0 0 20px rgba(0, 212, 255, 0.4), 0 4px 16px rgba(0, 212, 255, 0.3)', // Brand aqua glow
    },
    buttonActive: {
      transform: 'translateY(-1px)',
    },
    loginLink: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: 'bold',
      color: 'var(--brand-aqua)',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    loginLinkHover: {
      color: 'var(--brand-blue)',
    },
    guestTitle: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontSize: '1.75rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      color: 'var(--brand-blue)',
      textAlign: 'center',
    },
    guestMessage: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontSize: '1.1rem',
      color: 'var(--brand-grey-600)',
      textAlign: 'center',
    },
  }

  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isLinkHovered, setIsLinkHovered] = useState(false)

  const getCardStyle = () => {
    let style = { ...styles.card }
    if (isHovered && user) {
      style = { ...style, ...styles.cardHover }
    }
    return style
  }

  const getButtonStyle = () => {
    let style = { ...styles.button }
    if (isButtonHovered) {
      style = { ...style, ...styles.buttonHover }
    }
    if (isButtonActive) {
      style = { ...style, ...styles.buttonActive }
    }
    return style
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
              Welcome, {userProfile?.companyName || user.email.split('@')[0]}
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
