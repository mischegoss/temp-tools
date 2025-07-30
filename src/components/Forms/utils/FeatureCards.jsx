// src/components/Forms/utils/FeatureCards.jsx

import React from 'react'
import Link from '@docusaurus/Link'

const FeatureCard = ({ title, description, link, icon }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Extract icon character/emoji for potential use in badge
  const iconDisplay = icon || ''

  return (
    <Link to={link} style={styles.cardLink}>
      <div
        style={{
          ...styles.card,
          transform: isHovered ? 'translateY(-5px)' : 'none',
          boxShadow: isHovered
            ? '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
            : '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          borderColor: isHovered
            ? 'var(--brand-blue-400)'
            : 'var(--brand-blue-400)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon Container - Centered at the top */}
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
                  ? 'linear-gradient(to bottom, var(--brand-black-700) 0%, var(--brand-aqua-600) 100%)'
                  : 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered
                  ? '0 0 20px rgba(0, 212, 255, 0.3), 0 8px 24px rgba(0, 212, 255, 0.2)'
                  : '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              Open Form
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0',
    borderRadius: '8px',
    border: '2px solid var(--brand-blue-400)',
    backgroundColor: 'var(--brand-white)',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
  },
  cardLink: {
    textDecoration: 'none !important',
    color: 'inherit',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '1.5rem',
    marginBottom: '0.75rem',
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
    boxShadow: '0 0 10px rgba(0, 80, 199, 0.2)',
  },
  logoImage: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
  cardContent: {
    padding: '0.5rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'var(--brand-black)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  cardDescription: {
    flexGrow: 1,
    marginBottom: '1.25rem',
    color: 'var(--brand-black-700)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  actionButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    textAlign: 'center',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
    color: 'var(--brand-white)',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease-in-out',
    border: '2px solid var(--brand-aqua)',
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
}

export default function FeatureCards({ features }) {
  return (
    <div style={styles.cardContainer}>
      {features.map((feature, idx) => (
        <FeatureCard
          key={idx}
          title={feature.title}
          description={feature.description}
          link={feature.link}
          icon={feature.icon}
        />
      ))}
    </div>
  )
}
