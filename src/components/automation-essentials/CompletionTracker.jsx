// src/components/automation-essentials/CompletionTracker.jsx

import React from 'react'
import { useUserActivity } from '../../contexts/UserActivityContext'
import Link from '@docusaurus/Link'

// This component is specifically for the automation-essentials course
const CompletionTracker = ({ totalCards }) => {
  // Uses the UserActivityContext which already has the courseType from the parent provider
  const { allCardsViewed, isLoading } = useUserActivity()

  // Consistent styling with other components
  const styles = {
    container: {
      padding: '2.5rem',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '12px',
      border: '2px solid var(--brand-black-700)',
      textAlign: 'center',
      marginBottom: '2rem',
      boxShadow: '0 0 15px rgba(13, 22, 55, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: allCardsViewed ? 'fadeIn 0.5s forwards' : 'none',
      fontFamily:
        'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
      position: 'relative',
      transition: 'all 0.3s ease-in-out',
    },
    heading: {
      color: 'var(--brand-black-700)',
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid var(--brand-aqua)',
      fontSize: '2rem',
      fontWeight: 700,
      textAlign: 'center',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    text: {
      marginBottom: '1.5rem',
      fontSize: '1.1rem',
      fontWeight: 500,
      color: 'var(--brand-grey-600)',
      lineHeight: '1.5',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    button: {
      display: 'inline-block',
      padding: '0.75rem 1.75rem',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      color: 'var(--brand-white)',
      borderRadius: '8px',
      fontWeight: 500,
      fontSize: '1.1rem',
      textDecoration: 'none',
      transition: 'all 0.3s ease-in-out',
      boxShadow:
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '2px solid var(--brand-aqua)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    buttonHover: {
      transform: 'translateY(-3px)',
      boxShadow:
        '0 0 25px rgba(0, 212, 255, 0.4), 0 6px 16px rgba(0, 212, 255, 0.3)',
      borderColor: 'var(--brand-aqua)',
    },
  }

  const [isButtonHovered, setIsButtonHovered] = React.useState(false)
  const [isContainerHovered, setIsContainerHovered] = React.useState(false)

  // Don't render anything while loading or if not all cards are viewed
  if (isLoading || !allCardsViewed) {
    return null
  }

  const handleContainerHover = isHovering => {
    setIsContainerHovered(isHovering)
  }

  return (
    <div
      style={{
        ...styles.container,
        ...(isContainerHovered
          ? {
              transform: 'translateY(-5px)',
              boxShadow:
                '0 0 20px rgba(13, 22, 55, 0.3), 0 8px 24px rgba(13, 22, 55, 0.2)',
            }
          : {}),
      }}
      onMouseEnter={() => handleContainerHover(true)}
      onMouseLeave={() => handleContainerHover(false)}
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
          
          /* Add gradient overlay effect */
          .completion-tracker-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
              circle at 10% 20%,
              rgba(0, 212, 255, 0.05) 0%,
              transparent 50%
            );
            pointer-events: none;
            border-radius: 12px;
          }
        `}
      </style>
      <h3 style={styles.heading}>🎉 Congratulations! Course Completed</h3>
      <p style={styles.text}>
        You've successfully completed all {totalCards} course modules. You can
        now download your certificate to showcase your achievement.
      </p>
      <Link
        to='/learning/automation-essentials/certificate/certificate-sharing'
        style={{
          ...styles.button,
          ...(isButtonHovered ? styles.buttonHover : {}),
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        Get Your Certificate
      </Link>
    </div>
  )
}

export default CompletionTracker
