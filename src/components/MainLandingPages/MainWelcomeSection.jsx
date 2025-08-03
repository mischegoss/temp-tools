// Universal WelcomeSection - Works for ALL pages (logout removed)
// Can be used for both Service Blueprinting and Main Landing Pages
// src/components/shared/WelcomeSection.jsx (new location)
//
// USAGE:
// Service Blueprinting: import WelcomeSection from '@site/src/components/shared/WelcomeSection'
// Main Landing Pages: import WelcomeSection from '@site/src/components/shared/WelcomeSection'

import React, { useState } from 'react'
import { useAuth } from '@site/src/contexts/AuthContext'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * Universal WelcomeSection - Authentication UI now handled by ProtectedRoute
 * This component focuses purely on content display and welcome messaging
 * Works for all page types with customizable props
 */
const WelcomeSection = props => {
  return (
    <BrowserOnly fallback={<div>Loading welcome information...</div>}>
      {() => <WelcomeSectionClient {...props} />}
    </BrowserOnly>
  )
}

const WelcomeSectionClient = ({
  accessMessage = 'You have full access to all content.',
  guestTitle = 'Welcome!',
  guestMessage = 'Please login to access all content.',
  showWelcomeCard = true,
}) => {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isLinkHovered, setIsLinkHovered] = useState(false)

  // Dynamic styles object
  const styles = {
    card: {
      background: 'var(--brand-white)',
      borderRadius: '12px',
      border: '2px solid var(--brand-blue-400)',
      padding: '2rem',
      margin: '2rem 0',
      boxShadow: '0 4px 15px rgba(0, 102, 255, 0.1)',
      transition: 'all 0.3s ease',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      position: 'relative',
      overflow: 'hidden',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(circle at 15% 25%, rgba(0, 80, 199, 0.08) 0%, transparent 50%)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      position: 'relative',
      zIndex: 2,
    },
    headerSection: {
      textAlign: 'center',
    },
    nameText: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: 'var(--brand-black-700)',
      margin: 0,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    infoSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
    },
    userInfo: {
      flex: 1,
      minWidth: '200px',
    },
    description: {
      fontSize: '1.1rem',
      color: 'var(--brand-grey-600)',
      margin: '0 0 0.5rem 0',
      lineHeight: '1.5',
    },
    email: {
      fontSize: '1.1rem', // Increased from 0.95rem
      color: 'var(--brand-blue-400)', // Changed from var(--brand-grey-500) to match border
      margin: 0,
      fontWeight: '600', // Increased from 500
    },
    guestTitle: {
      fontSize: '1.6rem',
      fontWeight: '600',
      color: 'var(--brand-black-700)',
      margin: '0 0 1rem 0',
    },
    guestMessage: {
      fontSize: '1.1rem',
      color: 'var(--brand-grey-600)',
      margin: 0,
      lineHeight: '1.5',
    },
    loginLink: {
      color: 'var(--brand-blue)',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      borderBottom: isLinkHovered
        ? '2px solid var(--brand-blue)'
        : '2px solid transparent',
    },
    loginLinkHover: {
      color: 'var(--brand-blue-400)',
    },
  }

  const getCardStyle = () => {
    return {
      ...styles.card,
      ...(isHovered ? { transform: 'translateY(-5px)' } : {}),
    }
  }

  const getLinkStyle = () => {
    return {
      ...styles.loginLink,
      ...(isLinkHovered ? styles.loginLinkHover : {}),
    }
  }

  // Render welcome content based on authentication status
  return (
    <div
      style={getCardStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand gradient overlay */}
      <div style={styles.gradientOverlay} />

      {user ? (
        // Authenticated user view - simplified, no logout button
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
          </div>
        </div>
      ) : (
        // Guest user view - informational only
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
