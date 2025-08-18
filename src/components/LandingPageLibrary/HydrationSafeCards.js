// @site/src/components/LandingPageLibrary/HydrationSafeCards.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'

/**
 * HydrationSafeCards - Completely hydration-safe card component
 *
 * FIXES ALL ISSUES:
 * 1. No AuthProvider dependency
 * 2. No complex event handlers
 * 3. No react-bootstrap Button conflicts
 * 4. No CSS injection
 * 5. No navigation-safe complexity
 * 6. Simple state management
 * 7. Native button elements
 * 8. Static styles only
 */
const HydrationSafeCards = ({
  resources = [],
  productInfo = { accent: '#008B8B', contentTypeDisplay: 'General' },
}) => {
  // Simple state - no refs, no complex management
  const [expandedCards, setExpandedCards] = useState({})

  // Simple toggle function
  const toggleCard = index => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Use the exact same styles as original cards
  const learningHubSectionStyle = {
    background: '#FFFFFF',
    padding: '80px 0',
    color: '#2D3748',
    width: '100%',
    margin: 0,
    position: 'relative',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const containerStyleOriginal = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    width: '100%',
  }

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '2px solid #008B8B',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 139, 139, 0.1)',
    transition: 'all 0.15s ease',
    position: 'relative',
    width: '100%', // Take full container width like Help section
  }

  const cardHoverStyle = {
    ...cardStyle,
    boxShadow: '0 8px 24px rgba(0, 139, 139, 0.15)',
    transform: 'translateY(-4px)',
  }

  const headerStyle = {
    padding: '24px 24px 16px 24px',
  }

  const titleStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    color: '#2D3748',
    margin: '0 0 8px 0',
  }

  const descriptionStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    color: '#4A5568',
    fontSize: '1rem',
    lineHeight: '1.6',
    margin: '0',
  }

  const badgeStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#FFFFFF',
  }

  const buttonContainerStyle = {
    padding: '0 24px 24px 24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  }

  // Native button styles - no react-bootstrap
  const primaryButtonStyle = {
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
    textAlign: 'center',
    transition: 'all 0.15s ease',
  }

  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    background: 'linear-gradient(135deg, #718096 0%, #4A5568 100%)',
  }

  const disabledButtonStyle = {
    ...primaryButtonStyle,
    background: '#E2E8F0',
    color: '#718096',
    cursor: 'not-allowed',
  }

  const footerStyle = {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const expandedContentStyle = {
    padding: '0 24px 24px 24px',
    borderTop: '1px solid #E2E8F0',
    backgroundColor: '#F7FAFC',
  }

  // Get level-specific colors using product accent
  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4A90E2' // Keep original blue for consistency
      case 'intermediate':
        return '#1E3A8A' // Keep original blue for consistency
      case 'advanced':
        return '#008B8B' // Keep original teal for consistency
      default:
        return productInfo.accent // Use product accent as fallback
    }
  }

  const getContentTypeColor = resource => {
    const contentType = resource.contentType?.toLowerCase() || 'general'
    switch (contentType) {
      case 'device discovery and management':
        return '#008B8B'
      case 'automation development':
        return '#1E3A8A'
      case 'automation design':
        return '#4A90E2'
      case 'product overview':
        return '#008B8B'
      default:
        return '#008B8B'
    }
  }

  const getBorderColor = level => {
    return getLevelBadgeColor(level)
  }

  // Individual card component - fully static
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index] || false
    const isDisabled = resource.disabled === true
    const level = resource.primaryLevel || resource.level || 'Beginner'

    const cardStyleWithBorder = {
      ...cardStyle,
      borderLeft: `6px solid ${getBorderColor(level)}`,
      opacity: isDisabled ? 0.7 : 1,
    }

    return (
      <div
        style={cardStyleWithBorder}
        onMouseEnter={e => {
          if (!isDisabled) {
            Object.assign(e.currentTarget.style, cardHoverStyle)
          }
        }}
        onMouseLeave={e => {
          if (!isDisabled) {
            Object.assign(e.currentTarget.style, cardStyleWithBorder)
          }
        }}
      >
        {/* Badge */}
        <div
          style={{
            ...badgeStyle,
            backgroundColor: getLevelBadgeColor(level),
          }}
        >
          {level}
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <h3 style={titleStyle}>{resource.title}</h3>
          <p style={descriptionStyle}>{resource.description}</p>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div style={expandedContentStyle}>
            {resource.extendedDescription && (
              <div style={{ marginBottom: '16px' }}>
                <h4
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2D3748',
                    margin: '0 0 8px 0',
                  }}
                >
                  Overview
                </h4>
                <p
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: '#4A5568',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: '0',
                  }}
                >
                  {resource.extendedDescription}
                </p>
              </div>
            )}

            {resource.courses && resource.courses.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2D3748',
                    margin: '0 0 8px 0',
                  }}
                >
                  What's Included:
                </h4>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <ul style={{ margin: 0, paddingLeft: '24px' }}>
                    {resource.courses.map((course, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: '8px',
                          fontFamily:
                            'SeasonMix, system-ui, -apple-system, sans-serif',
                          color: '#4A5568',
                          lineHeight: '1.6',
                        }}
                      >
                        {course}
                      </li>
                    ))}
                  </ul>
                  {resource.usageInstructions && (
                    <p
                      style={{
                        marginTop: '12px',
                        marginBottom: 0,
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
                        color: '#4A5568',
                        lineHeight: '1.6',
                      }}
                    >
                      {resource.usageInstructions}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={buttonContainerStyle}>
          {isExpanded ? (
            <>
              <button
                style={secondaryButtonStyle}
                onClick={() => toggleCard(index)}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #718096 0%, #4A5568 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Close Details
              </button>
              {isDisabled ? (
                <button style={disabledButtonStyle} disabled>
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </button>
              ) : (
                <Link to={resource.link} style={{ textDecoration: 'none' }}>
                  <button
                    style={primaryButtonStyle}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                </Link>
              )}
            </>
          ) : (
            <>
              <button
                style={secondaryButtonStyle}
                onClick={() => toggleCard(index)}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #718096 0%, #4A5568 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                View Details
              </button>
              {isDisabled ? (
                <button style={disabledButtonStyle} disabled>
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </button>
              ) : (
                <Link to={resource.link} style={{ textDecoration: 'none' }}>
                  <button
                    style={primaryButtonStyle}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Footer - Uses product-specific content type */}
        <div
          style={{
            ...footerStyle,
            backgroundColor: productInfo.accent, // Use product accent color
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            {productInfo.contentTypeDisplay}{' '}
            {/* Use product-specific content type */}
          </span>
        </div>
      </div>
    )
  }

  // Static styles - cards in single column (original layout)
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    margin: 0,
    padding: 0,
  }

  // Always return with section wrapper - exact same structure as original
  return (
    <section style={learningHubSectionStyle}>
      <div style={containerStyleOriginal}>
        <div style={containerStyle}>
          {resources.map((resource, index) => (
            <ResourceCard
              key={`${resource.title || 'resource'}-${index}`}
              resource={resource}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HydrationSafeCards
