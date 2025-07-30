// src/components/Forms/utils/EnhancedFeatureCards.jsx

import React from 'react'
import Link from '@docusaurus/Link'
import { useUserActivity } from '../../contexts/UserActivityContext'

const EnhancedFeatureCard = ({ title, description, link, icon, styles }) => {
  const { viewedCards, markCardAsViewed } = useUserActivity()
  const [isHovered, setIsHovered] = React.useState(false)

  // Create a consistent ID from the title
  const cardId = title.replace(/\s+/g, '-').toLowerCase()
  const isViewed = viewedCards[cardId] || false

  const handleCardClick = () => {
    markCardAsViewed(title)
  }

  // Extract number from icon if it exists (for course modules)
  const moduleNumber = icon && icon.match(/\d+/) ? icon.match(/\d+/)[0] : null

  return (
    <Link to={link} style={styles.cardLink} onClick={handleCardClick}>
      <div
        style={{
          ...styles.card,
          border: isHovered
            ? `2px solid var(--brand-blue-400)`
            : `2px solid var(--brand-blue)`,
          transform: isHovered ? 'translateY(-5px)' : 'none',
          boxShadow: isHovered
            ? '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
            : '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Status Banner - Always present with different styling based on viewed status */}
        <div
          style={{
            ...styles.statusBanner,
            background: isViewed
              ? 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-green) 100%)' // Success gradient when viewed
              : 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)', // Primary gradient when not viewed
            color: 'var(--brand-white)',
          }}
        >
          {isViewed ? 'VIEWED' : 'CLICK TO GET STARTED'}
        </div>

        {/* Icon Container - Centered below the banner */}
        <div style={styles.iconContainer}>
          <div style={styles.logoBackground}>
            <img
              src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
              alt='Resolve'
              style={styles.logoImage}
            />
          </div>
        </div>

        {/* Card Content */}
        <div style={styles.cardContent}>
          <h3 style={styles.cardTitle}>{title}</h3>
          <p style={styles.cardDescription}>{description}</p>

          {/* Action Button */}
          <div style={styles.buttonContainer}>
            <div
              style={{
                ...styles.actionButton,
                background: isHovered
                  ? 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue-400) 100%)'
                  : 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
                boxShadow: isHovered
                  ? '0 0 15px rgba(0, 102, 255, 0.4), 0 2px 8px rgba(0, 102, 255, 0.3)'
                  : 'none',
                transform: isHovered ? 'translateY(-1px)' : 'none',
              }}
            >
              View Module
            </div>
          </div>
        </div>

        {/* Gradient overlay for depth */}
        <div style={styles.gradientOverlay} />
      </div>
    </Link>
  )
}

const EnhancedFeatureCards = ({ features }) => {
  const styles = {
    cardContainer: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      margin: '2rem 0',
    },
    card: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '0',
      borderRadius: '12px',
      backgroundColor: 'var(--brand-white)',
      border: '2px solid var(--brand-blue)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      overflow: 'hidden',
      position: 'relative',
    },
    cardLink: {
      textDecoration: 'none !important',
      color: 'inherit',
    },
    statusBanner: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      width: '100%',
      padding: '0.4rem 0',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: '0.8rem',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand-white)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      zIndex: 2,
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
      transition: 'all 0.3s ease-in-out',
      border: '2px solid var(--brand-blue-400)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
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
