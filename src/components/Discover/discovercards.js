// Optimized DiscoverCards - Instant button response, minimal JavaScript
// src/components/Discover/discovercards.js

import React, { useState, useMemo, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Link from '@docusaurus/Link'
import {
  learningHubSectionStyle,
  containerStyle,
  cardsContainerStyle,
  noResourcesStyle,
  noResourcesTextStyle,
} from './styles/cardstyles'

// CSS-in-JS styles for instant hover effects
const injectDiscoverStyles = () => {
  const styleId = 'discover-cards-styles'

  // Check if styles already exist
  if (document.getElementById(styleId)) return

  const styles = `
    .discover-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    .discover-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 8px 24px rgba(0, 139, 139, 0.15) !important;
    }
    
    .discover-button {
      transition: all 0.2s ease !important;
      pointer-events: auto !important;
      user-select: none !important;
    }
    
    .discover-button:hover {
      background: linear-gradient(135deg, #0052CC 0%, #0099B8 100%) !important;
      transform: translateY(-1px) !important;
      text-decoration: none !important;
      color: #FFFFFF !important;
    }
    
    .discover-button:active {
      transform: translateY(0) !important;
    }
    
    .discover-button:disabled {
      pointer-events: none !important;
      transform: none !important;
    }
    
    .discover-button:focus {
      outline: 2px solid #0066FF !important;
      outline-offset: 2px !important;
    }
    
    @media (max-width: 768px) {
      .discover-card:hover {
        transform: none !important;
      }
      
      .discover-button:hover {
        transform: none !important;
      }
    }
  `

  const styleSheet = document.createElement('style')
  styleSheet.id = styleId
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

const DiscoverCards = ({ resources = [], hideSection = false }) => {
  // Inject CSS styles on component mount
  useEffect(() => {
    injectDiscoverStyles()
  }, [])

  // Early validation with minimal processing
  if (!resources?.length) {
    const noResourcesContent = (
      <div style={noResourcesStyle}>
        <p style={noResourcesTextStyle}>
          No resources to display. Please provide a valid array of resources.
        </p>
      </div>
    )
    return hideSection ? (
      noResourcesContent
    ) : (
      <section style={learningHubSectionStyle}>
        <div style={containerStyle}>{noResourcesContent}</div>
      </section>
    )
  }

  // Minimal state - only what's actually needed
  const [expandedCards, setExpandedCards] = useState({})

  // Memoized styles to prevent recalculation
  const styles = useMemo(
    () => ({
      card: {
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '2px solid #008B8B',
        boxShadow: '0 4px 12px rgba(0, 139, 139, 0.1)',
        marginBottom: '30px',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      },
      cardContent: {
        padding: '30px',
      },
      logoContainer: {
        background: '#05070f',
        borderRadius: '8px',
        padding: '8px',
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(5, 7, 15, 0.2)',
      },
      title: {
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#2D3748',
        margin: '0 0 8px 0',
      },
      description: {
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        color: '#4A5568',
        fontSize: '1rem',
        lineHeight: '1.6',
        margin: '0',
      },
      buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '32px',
      },
      primaryButton: {
        background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '0.95rem',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        cursor: 'pointer',
        fontWeight: '500',
        textDecoration: 'none',
        display: 'inline-block',
        lineHeight: '1',
      },
      disabledButton: {
        background: '#E2E8F0',
        color: '#718096',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '0.95rem',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        cursor: 'not-allowed',
        fontWeight: '500',
      },
      expandedContent: {
        backgroundColor: '#F7FAFC',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        marginTop: '16px',
      },
      footer: {
        padding: '12px 20px',
        backgroundColor: '#008B8B',
        color: '#FFFFFF',
        fontSize: '0.9rem',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        textAlign: 'center',
      },
    }),
    [],
  )

  // Simple toggle function
  const toggleCard = index => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Simple ResourceCard - minimal complexity
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index]
    const isDisabled = resource.disabled || resource.comingSoon

    return (
      <div
        className='discover-card' // Use CSS class for hover effects
        style={styles.card}
      >
        <div style={styles.cardContent}>
          {/* Header with logo and content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div style={styles.logoContainer}>
              <img
                src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
                alt='Resolve'
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={styles.title}>{resource.title}</h3>
              <p style={styles.description}>{resource.description}</p>
            </div>
          </div>

          {/* Expanded content - only render when needed */}
          {isExpanded && resource.courses && (
            <div style={styles.expandedContent}>
              <h5
                style={{
                  margin: '0 0 12px 0',
                  fontWeight: 600,
                  color: '#2D3748',
                }}
              >
                Courses Include
              </h5>
              <ul style={{ margin: 0, paddingLeft: '24px' }}>
                {resource.courses.map((course, i) => (
                  <li key={i} style={{ marginBottom: '8px', color: '#4A5568' }}>
                    {course}
                  </li>
                ))}
              </ul>
              {resource.usageInstructions && (
                <p
                  style={{
                    marginTop: '12px',
                    marginBottom: 0,
                    color: '#4A5568',
                  }}
                >
                  {resource.usageInstructions}
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div style={styles.buttonContainer}>
            {isExpanded ? (
              // Expanded state buttons
              <>
                <button
                  onClick={() => toggleCard(index)}
                  style={styles.primaryButton}
                  className='discover-button' // CSS hover effects
                >
                  Close Details
                </button>
                {isDisabled ? (
                  <button style={styles.disabledButton} disabled>
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                ) : (
                  <Link
                    to={resource.link}
                    style={styles.primaryButton}
                    className='discover-button'
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </Link>
                )}
              </>
            ) : (
              // Collapsed state buttons
              <>
                <button
                  onClick={() => toggleCard(index)}
                  style={styles.primaryButton}
                  className='discover-button'
                >
                  View Details
                </button>
                {isDisabled ? (
                  <button style={styles.disabledButton} disabled>
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                ) : (
                  <Link
                    to={resource.link}
                    style={styles.primaryButton}
                    className='discover-button'
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          {resource.primaryLevel || resource.contentType || 'Course'}
        </div>
      </div>
    )
  }

  const cardsContent = (
    <div style={cardsContainerStyle}>
      {resources.map((resource, idx) => (
        <ResourceCard
          key={`${resource.title}-${idx}`}
          resource={resource}
          index={idx}
        />
      ))}
    </div>
  )

  return hideSection ? (
    cardsContent
  ) : (
    <section style={learningHubSectionStyle}>
      <div style={containerStyle}>{cardsContent}</div>
    </section>
  )
}

export default DiscoverCards
