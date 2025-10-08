// src/components/service-blueprinting/CompletionTracker.jsx

import React from 'react'
import { useUserActivity } from '../../contexts/UserActivityContext'
import Link from '@docusaurus/Link'

// This component is specifically for the service-blueprinting course
const CompletionTracker = ({ totalCards }) => {
  // Uses the UserActivityContext which already has the courseType from the parent provider
  const { allCardsViewed, isLoading } = useUserActivity()

  // Brand-compliant styling
  const styles = {
    container: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      padding: '2.5rem',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '12px',
      border: '2px solid var(--brand-green)', // Success theme with green
      textAlign: 'center',
      marginBottom: '2rem',
      boxShadow:
        '0 0 15px rgba(0, 176, 112, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', // Green shadow for success
      opacity: 0,
      transform: 'translateY(20px)',
      animation: allCardsViewed ? 'fadeIn 0.5s forwards' : 'none',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
    },
    containerHover: {
      transform: 'translateY(-5px)',
      boxShadow:
        '0 0 20px rgba(0, 176, 112, 0.3), 0 8px 24px rgba(0, 176, 112, 0.2)',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(circle at 10% 20%, rgba(0, 176, 112, 0.05) 0%, transparent 50%)',
      pointerEvents: 'none',
      borderRadius: '12px',
    },
    heading: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-green)', // Success green
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid var(--brand-aqua)', // Aqua divider for accent
      fontSize: '2rem',
      fontWeight: '700',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
    },
    text: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      marginBottom: '1.5rem',
      fontSize: '1.1rem',
      fontWeight: '500',
      color: 'var(--brand-grey-600)',
      lineHeight: '1.5',
      position: 'relative',
      zIndex: 1,
    },
    button: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      display: 'inline-block',
      padding: '14px 28px',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-green) 100%)', // Success gradient
      color: 'var(--brand-white)',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1.1rem',
      textDecoration: 'none',
      transition: 'all 0.3s ease-in-out',
      border: '2px solid var(--brand-green)',
      boxShadow: 'none',
      position: 'relative',
      zIndex: 1,
      outline: 'none',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow:
        '0 0 20px rgba(0, 176, 112, 0.4), 0 4px 16px rgba(0, 176, 112, 0.3)',
    },
    buttonActive: {
      transform: 'translateY(-1px)',
    },
  }

  const [isButtonHovered, setIsButtonHovered] = React.useState(false)
  const [isButtonActive, setIsButtonActive] = React.useState(false)
  const [isContainerHovered, setIsContainerHovered] = React.useState(false)

  // Don't render anything while loading or if not all cards are viewed
  if (isLoading || !allCardsViewed) {
    return null
  }

  const handleButtonMouseDown = () => setIsButtonActive(true)
  const handleButtonMouseUp = () => setIsButtonActive(false)

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

  const getContainerStyle = () => {
    let style = { ...styles.container }
    if (isContainerHovered) {
      style = { ...style, ...styles.containerHover }
    }
    return style
  }

  return (
    <div
      style={getContainerStyle()}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Brand gradient overlay */}
      <div style={styles.gradientOverlay} />

      <h3 style={styles.heading}>🎉 Congratulations! Course Completed</h3>
      <p style={styles.text}>
        You've successfully completed all {totalCards} course modules. You can
        now download your certificate to showcase your achievement.
      </p>
      <Link
        to='/learning/service-blueprinting/certificate/certificate-sharing'
        style={getButtonStyle()}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => {
          setIsButtonHovered(false)
          setIsButtonActive(false)
        }}
        onMouseDown={handleButtonMouseDown}
        onMouseUp={handleButtonMouseUp}
      >
        Get Your Certificate
      </Link>
    </div>
  )
}

export default CompletionTracker
