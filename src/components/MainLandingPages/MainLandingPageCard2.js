// Optimized MainLandingPageCard2 - Instant button response, minimal JavaScript
// src/components/MainLandingPages/MainLandingPageCard2.js

import React, { useState, useEffect } from 'react'
import Link from '@docusaurus/Link'

// CSS-in-JS styles for instant hover effects
const injectMainLandingStyles = () => {
  const styleId = 'main-landing-cards-styles'

  // Check if styles already exist
  if (document.getElementById(styleId)) return

  const styles = `
    .main-landing-card {
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out !important;
    }
    
    .main-landing-card:hover:not(.disabled) {
      transform: translateY(-5px) !important;
      box-shadow: 0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2) !important;
    }
    
    .main-landing-button {
      transition: all 0.2s ease !important;
      pointer-events: auto !important;
      user-select: none !important;
    }
    
    .main-landing-button:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3) !important;
      border-color: var(--brand-blue-400) !important;
      background: var(--brand-blue-400) !important;
      text-decoration: none !important;
      color: var(--brand-white) !important;
    }
    
    .main-landing-button:active:not(:disabled) {
      transform: translateY(0) !important;
    }
    
    .main-landing-button:disabled {
      pointer-events: none !important;
      transform: none !important;
    }
    
    .main-landing-button:focus {
      outline: 2px solid var(--brand-blue) !important;
      outline-offset: 2px !important;
    }
    
    @media (max-width: 768px) {
      .main-landing-card:hover:not(.disabled) {
        transform: translateY(-2px) !important;
      }
      
      .main-landing-button:hover:not(:disabled) {
        transform: translateY(-1px) !important;
      }
    }
  `

  const styleSheet = document.createElement('style')
  styleSheet.id = styleId
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

const MainLandingPageCards = ({ resources = [] }) => {
  // Inject CSS styles on component mount
  useEffect(() => {
    injectMainLandingStyles()
  }, [])

  // Early validation with minimal processing
  if (!resources?.length) {
    return (
      <div
        style={{
          padding: '40px',
          backgroundColor: 'var(--brand-grey-100)',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid var(--brand-grey-300)',
        }}
      >
        <p
          style={{
            fontSize: '1.25rem',
            fontFamily: 'var(--ifm-font-family-base)',
            color: 'var(--brand-grey-600)',
            margin: '0',
          }}
        >
          No resources available.
        </p>
      </div>
    )
  }

  // Only track expanded state - remove hoveredCards entirely
  const [expandedCards, setExpandedCards] = useState({})

  // Toggle expanded details for a specific card
  const toggleCardDetails = index => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Helper functions (simplified, no complex processing)
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-blue)'
      case 'intermediate':
        return 'var(--brand-blue-600)'
      case 'advanced':
        return 'var(--brand-blue-800)'
      default:
        return 'var(--brand-blue)'
    }
  }

  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-blue)'
      case 'intermediate':
        return 'var(--brand-blue-600)'
      case 'advanced':
        return 'var(--brand-blue-800)'
      default:
        return 'var(--brand-blue)'
    }
  }

  const formatLevelDisplay = level => {
    if (!level) return ''
    return level.toUpperCase()
  }

  // Base button styles (no hover - handled by CSS)
  const baseButtonStyle = {
    background: 'var(--brand-blue)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-blue)',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontFamily: 'var(--ifm-font-family-base)',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
  }

  const disabledButtonStyle = {
    background: 'var(--brand-grey-300)',
    color: 'var(--brand-grey-600)',
    border: '2px solid var(--brand-grey-300)',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontFamily: 'var(--ifm-font-family-base)',
    fontWeight: '600',
    cursor: 'not-allowed',
    boxShadow: 'none',
  }

  // Individual card component (simplified)
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index] || false
    const isDisabled = resource.disabled === true
    const primaryLevel = resource.primaryLevel || 'Beginner'

    const titleStyle = {
      fontFamily: 'var(--ifm-font-family-base)',
      fontWeight: '700',
      fontSize: '1.4rem',
      color: isDisabled ? 'var(--brand-grey-500)' : 'var(--brand-black-700)',
      margin: '0 0 16px 0',
    }

    const descriptionStyle = {
      fontFamily: 'var(--ifm-font-family-base)',
      color: isDisabled ? 'var(--brand-grey-500)' : 'var(--brand-black)',
      fontSize: '1.2rem',
      lineHeight: '1.5',
      margin: '0',
    }

    return (
      <div
        className={`main-landing-card ${isDisabled ? 'disabled' : ''}`}
        style={{
          border: `2px solid ${getBorderColor(primaryLevel)}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--brand-white)',
          boxShadow:
            '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
          position: 'relative',
          cursor: isDisabled ? 'default' : 'pointer',
          fontFamily: 'var(--ifm-font-family-base)',
        }}
      >
        {/* Coming Soon Banner for disabled cards */}
        {isDisabled && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'var(--brand-aqua)',
              color: 'var(--brand-white)',
              padding: '8px 20px',
              borderRadius: '6px',
              fontFamily: 'var(--ifm-font-family-base)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              zIndex: 2,
              boxShadow:
                '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              opacity: 1,
              border: '1px solid var(--brand-aqua)',
            }}
          >
            Coming Soon
          </div>
        )}

        {!isExpanded ? (
          // Condensed Card View
          <div style={{ padding: '32px' }}>
            <h3 style={titleStyle}>{resource.title}</h3>
            <p style={descriptionStyle}>{resource.description}</p>

            {/* Level badge and buttons container */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '24px',
              }}
            >
              {/* Level badge */}
              {primaryLevel && (
                <div
                  style={{
                    background: getLevelBadgeColor(primaryLevel),
                    color: 'var(--brand-white)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: '600',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    opacity: isDisabled ? 0.7 : 1,
                  }}
                >
                  {formatLevelDisplay(primaryLevel)}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {!isDisabled && (
                  <button
                    className='main-landing-button'
                    onClick={() => toggleCardDetails(index)}
                    style={{
                      ...baseButtonStyle,
                      padding: '10px 20px',
                      fontSize: '0.95rem',
                    }}
                  >
                    View Details
                  </button>
                )}

                {isDisabled ? (
                  <button style={disabledButtonStyle} disabled={true}>
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                ) : (
                  <Link to={resource.link} style={{ textDecoration: 'none' }}>
                    <button
                      className='main-landing-button'
                      style={baseButtonStyle}
                    >
                      {resource.resourceType === 'module'
                        ? 'Get Started'
                        : 'View Module'}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Expanded Card View
          <div style={{ padding: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={titleStyle}>{resource.title}</h3>
                <p style={descriptionStyle}>{resource.description}</p>

                {resource.extendedDescription && (
                  <div style={{ marginTop: '16px' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--brand-black-700)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Overview
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        color: 'var(--brand-black)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: '0 0 16px 0',
                      }}
                    >
                      {resource.extendedDescription}
                    </p>
                  </div>
                )}

                {resource.usageInstructions && (
                  <div style={{ marginTop: '16px' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--brand-black-700)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      What You'll Learn
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        color: 'var(--brand-black)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: '0',
                      }}
                    >
                      {resource.usageInstructions}
                    </p>
                  </div>
                )}

                {resource.courses && resource.courses.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--brand-black-700)',
                        margin: '0 0 12px 0',
                      }}
                    >
                      Course Modules
                    </h4>
                    <ul
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        color: 'var(--brand-black)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: '0',
                        paddingLeft: '20px',
                      }}
                    >
                      {resource.courses.map((course, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Level badge on right side for expanded view */}
              {primaryLevel && (
                <div
                  style={{
                    background: getLevelBadgeColor(primaryLevel),
                    color: 'var(--brand-white)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: '600',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    marginLeft: '20px',
                    opacity: isDisabled ? 0.7 : 1,
                  }}
                >
                  {formatLevelDisplay(primaryLevel)}
                </div>
              )}
            </div>

            {/* Buttons in center of expanded card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '32px',
              }}
            >
              <button
                className='main-landing-button'
                onClick={() => toggleCardDetails(index)}
                style={baseButtonStyle}
              >
                Close Details
              </button>

              {isDisabled ? (
                <button style={disabledButtonStyle} disabled={true}>
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </button>
              ) : (
                <Link to={resource.link} style={{ textDecoration: 'none' }}>
                  <button
                    className='main-landing-button'
                    style={baseButtonStyle}
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        padding: '2rem 0',
      }}
    >
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} index={index} />
      ))}
    </div>
  )
}

export default MainLandingPageCards
