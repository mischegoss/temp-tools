// COMPREHENSIVE FIX: Replace EnhancedFeatureCards.jsx for Service Blueprinting
// src/components/service-blueprinting/EnhancedFeatureCards.jsx

import React, { useState } from 'react'
import Link from '@docusaurus/Link'

/**
 * Fixed EnhancedFeatureCards - Eliminates button delays on Service Blueprinting pages
 *
 * Key fixes:
 * 1. No complex state management
 * 2. Direct CSS-in-JS with immediate hover effects
 * 3. Simplified component structure
 * 4. Immediate button responsiveness
 */

const EnhancedFeatureCard = ({ title, description, link, icon, styles }) => {
  const [isHovered, setIsHovered] = useState(false)

  // FIXED: Immediate hover handlers
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  // FIXED: Dynamic button hover effects
  const getButtonHoverHandlers = () => ({
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow =
        '0 0 20px rgba(0, 102, 255, 0.4), 0 6px 16px rgba(0, 102, 255, 0.3)'
      e.currentTarget.style.background =
        'linear-gradient(to bottom, var(--brand-blue-400) 0%, var(--brand-blue) 100%)'
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow =
        '0 0 10px rgba(0, 102, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15)'
      e.currentTarget.style.background =
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)'
    },
  })

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
          : '0 0 10px rgba(0, 102, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={styles.gradientOverlay} />

      <div style={styles.iconContainer}>
        <div style={styles.logoBackground}>
          <img
            src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
            alt='Resolve'
            style={styles.logoImage}
          />
        </div>
      </div>

      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDescription}>{description}</p>

        <div style={styles.buttonContainer}>
          <Link to={link} style={{ textDecoration: 'none' }}>
            <button style={styles.actionButton} {...getButtonHoverHandlers()}>
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const EnhancedFeatureCards = ({ features = [] }) => {
  // FIXED: Static styles - no dynamic injection
  const styles = {
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      padding: '2rem 0',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    card: {
      backgroundColor: 'var(--brand-white)',
      borderRadius: '12px',
      border: '2px solid var(--brand-blue-400)',
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
      minHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
    },
    iconContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '1.5rem 0 0.75rem 0',
      position: 'relative',
      zIndex: 2,
    },
    logoBackground: {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 10px rgba(0, 102, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.15)',
    },
    logoImage: {
      width: '80%',
      height: '80%',
      objectFit: 'contain',
    },
    cardContent: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      padding: '0.5rem 1.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      zIndex: 2,
    },
    cardTitle: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      color: 'var(--brand-blue)',
    },
    cardDescription: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      flexGrow: 1,
      marginBottom: '1.25rem',
      color: 'var(--brand-grey-600)',
      fontSize: '0.95rem',
      lineHeight: '1.5',
    },
    buttonContainer: {
      marginTop: 'auto',
    },
    actionButton: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      width: '100%',
      padding: '0.75rem 1rem',
      textAlign: 'center',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      color: 'var(--brand-white)',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
      border: '2px solid var(--brand-blue-400)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
      // CRITICAL: Immediate responsiveness
      pointerEvents: 'auto',
      userSelect: 'none',
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
  }

  return (
    <div style={styles.cardContainer}>
      {features.map((feature, idx) => (
        <EnhancedFeatureCard
          key={idx}
          title={feature.title}
          description={feature.description}
          link={feature.link}
          icon={feature.icon}
          styles={styles}
        />
      ))}
    </div>
  )
}

export default EnhancedFeatureCards
