// Fixed LandingPageCards - Only button hover handlers changed to fix hydration delays
// src/components/LandingPageLibrary/landingpagecards.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import {
  learningHubSectionStyle,
  containerStyle,
  cardsContainerStyle,
  noResourcesStyle,
  noResourcesTextStyle,
  buttonStyle,
  buttonHoverStyle,
  disabledButtonStyle,
} from './sharedStyles.js'

/**
 * LandingPageCards component - Fixed button responsiveness issue
 *
 * ONLY CHANGE: Simplified button hover handlers to prevent hydration delays
 * Everything else is exactly the same as the original
 */

const LandingPageCards = ({
  resources = [],
  hideSection = false,
  colorTheme = {},
}) => {
  const [hoveredCards, setHoveredCards] = useState({})
  const [expandedCards, setExpandedCards] = useState({})

  // No resources case
  if (!resources?.length) {
    return (
      <div style={noResourcesStyle}>
        <p style={noResourcesTextStyle}>
          No learning paths available for the selected level.
        </p>
      </div>
    )
  }

  // Card hover handlers
  const setCardHover = (index, isHovered) => {
    setHoveredCards(prev => ({ ...prev, [index]: isHovered }))
  }

  // Card expansion toggle
  const toggleCardDetails = index => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }))
  }

  // Get level badge color
  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4A90E2' // Automation Design blue
      case 'intermediate':
        return '#1E3A8A' // Automation Development blue
      case 'advanced':
        return '#008B8B' // Teal for advanced
      default:
        return '#008B8B' // Default teal
    }
  }

  // Get footer color
  const getFooterColor = contentType => {
    switch (contentType) {
      case 'device discovery and management':
        return '#008B8B' // Teal
      case 'automation development':
        return '#1E3A8A' // Dark blue
      case 'automation design':
        return '#4A90E2' // Blue
      case 'product overview':
        return '#008B8B' // Teal
      default:
        return '#008B8B' // Default teal
    }
  }

  // Get border color
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4A90E2' // Blue
      case 'intermediate':
        return '#1E3A8A' // Dark blue
      case 'advanced':
        return '#008B8B' // Teal
      default:
        return '#008B8B' // Default teal
    }
  }

  // Get dual footer color for resources with secondary content type
  const getDualFooterColor = resource => {
    const primaryType = getContentType(resource)
    const secondaryType = resource.secondaryContentType?.toLowerCase() || null

    if (secondaryType) {
      const primaryColor = getFooterColor(primaryType)
      // LearningHub secondary color mapping
      const secondaryColorMap = {
        'device discovery and management': '#008B8B',
        'automation development': '#1E3A8A',
        'automation design': '#4A90E2',
        'product overview': '#008B8B',
      }
      const secondaryColor = secondaryColorMap[secondaryType] || '#008B8B'
      return `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
    }

    return getFooterColor(primaryType)
  }

  // Get content type
  const getContentType = resource => {
    return (
      resource.contentType?.toLowerCase() ||
      resource.category?.toLowerCase() ||
      'default'
    )
  }

  // Get level description
  const getLevelDescription = level => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'Perfect for new users with no prior experience.'
      case 'intermediate':
        return 'For users who are familiar with basic functionality and want to expand their skills.'
      case 'advanced':
        return 'Designed for experienced users who want to master complex features.'
      default:
        return 'Suitable for all skill levels.'
    }
  }

  // Content type display names
  const getContentTypeDisplay = resource => {
    const contentType = getContentType(resource)

    switch (contentType) {
      case 'device discovery and management':
        return 'Device Discovery and Management'
      case 'automation development':
        return 'Automation Development'
      case 'automation design':
        return 'Automation Design'
      case 'product overview':
        return 'Product Overview'
      default:
        return 'General'
    }
  }

  // Individual card component
  const ResourceCard = ({ resource, index }) => {
    const isHovered = hoveredCards[index] || false
    const isExpanded = expandedCards[index] || false

    // Use primaryLevel and secondaryLevel from resource or default to level for backward compatibility
    const primaryLevel = resource.primaryLevel || resource.level || 'Beginner'
    const secondaryLevel = resource.secondaryLevel || null

    // Check if card is disabled
    const isDisabled = resource.disabled === true

    // Text and card styles
    const titleStyle = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: isDisabled ? '#718096' : '#2D3748',
      margin: '0 0 8px 0',
    }

    const descriptionStyle = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: isDisabled ? '#718096' : '#4A5568',
      fontSize: '1rem',
      lineHeight: '1.6',
      margin: '0',
    }

    // Handle button click for disabled cards
    const handleButtonClick = e => {
      if (isDisabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          border: '2px solid #008B8B',
          borderLeft: `6px solid ${getBorderColor(primaryLevel)}`,
          overflow: 'hidden',
          boxShadow:
            isHovered && !isDisabled
              ? '0 8px 24px rgba(0, 139, 139, 0.15)'
              : '0 4px 12px rgba(0, 139, 139, 0.1)',
          transform:
            isHovered && !isDisabled ? 'translateY(-4px)' : 'translateY(0)',
          marginBottom: '30px',
          position: 'relative',
          cursor: isDisabled ? 'default' : 'pointer',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          opacity: isDisabled ? 0.8 : 1,
        }}
        onMouseEnter={() => !isDisabled && setCardHover(index, true)}
        onMouseLeave={() => !isDisabled && setCardHover(index, false)}
      >
        {/* Coming Soon Banner */}
        {isDisabled && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
              color: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: '6px',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              zIndex: 2,
              boxShadow:
                '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              opacity: 1,
              border: '1px solid #0066FF',
            }}
          >
            Coming Soon
          </div>
        )}

        {!isExpanded ? (
          // Summary View
          <div style={{ padding: '30px' }}>
            {/* Logo and Title Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  background: '#05070f',
                  borderRadius: '8px',
                  padding: '8px',
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(5, 7, 15, 0.2)',
                }}
              >
                <img
                  src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
                  alt='Resolve'
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={titleStyle}>{resource.title}</h3>
                <p style={descriptionStyle}>{resource.description}</p>
              </div>
            </div>

            {/* FIXED: Simplified buttons with immediate responsiveness */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '32px',
              }}
            >
              <button
                onClick={() => !isDisabled && toggleCardDetails(index)}
                style={{
                  background: isDisabled
                    ? '#E2E8F0'
                    : 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
                  color: isDisabled ? '#718096' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500',
                  pointerEvents: 'auto', // CRITICAL: Immediate responsiveness
                }}
                onMouseOver={e => {
                  if (!isDisabled) {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseOut={e => {
                  if (!isDisabled) {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
                disabled={isDisabled}
              >
                View Details
              </button>

              {isDisabled ? (
                <button
                  style={{
                    background: '#E2E8F0',
                    color: '#718096',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    cursor: 'not-allowed',
                    fontWeight: '500',
                    pointerEvents: 'auto',
                  }}
                  disabled={true}
                >
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </button>
              ) : (
                <Link to={resource.link} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '0.95rem',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                      pointerEvents: 'auto', // CRITICAL: Immediate responsiveness
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseOut={e => {
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
            </div>
          </div>
        ) : (
          // Expanded Details View
          <div style={{ padding: '30px' }}>
            {/* Header with Logo and Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  background: '#05070f',
                  borderRadius: '8px',
                  padding: '8px',
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(5, 7, 15, 0.2)',
                }}
              >
                <img
                  src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
                  alt='Resolve'
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={titleStyle}>{resource.title}</h3>
                <p style={descriptionStyle}>{resource.description}</p>
              </div>
            </div>

            {/* Additional Details - Full Width */}
            <div style={{ marginBottom: '20px' }}>
              {/* Level badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                {primaryLevel && (
                  <div
                    style={{
                      display: 'inline-block',
                      background: getLevelBadgeColor(primaryLevel),
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      opacity: isDisabled ? 0.7 : 1,
                    }}
                  >
                    {primaryLevel.charAt(0).toUpperCase() +
                      primaryLevel.slice(1).toLowerCase()}
                  </div>
                )}
                {secondaryLevel && (
                  <div
                    style={{
                      display: 'inline-block',
                      background: getLevelBadgeColor(secondaryLevel),
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      opacity: isDisabled ? 0.7 : 1,
                    }}
                  >
                    {secondaryLevel.charAt(0).toUpperCase() +
                      secondaryLevel.slice(1).toLowerCase()}
                  </div>
                )}
              </div>

              {/* Course List */}
              <div style={{ marginBottom: '20px' }}>
                <h5
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: '#2D3748',
                    marginBottom: '12px',
                    margin: '0 0 12px 0',
                  }}
                >
                  Courses Include
                </h5>
                <div
                  style={{
                    backgroundColor: '#F7FAFC',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontSize: '1rem',
                    color: '#4A5568',
                    lineHeight: '1.6',
                  }}
                >
                  <ul style={{ margin: 0, paddingLeft: '24px' }}>
                    {resource.courses &&
                      resource.courses.map((course, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>
                          {course}
                        </li>
                      ))}
                  </ul>
                  {resource.usageInstructions && (
                    <p style={{ marginTop: '12px', marginBottom: 0 }}>
                      {resource.usageInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* FIXED: Simplified buttons in expanded view */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '32px',
              }}
            >
              <button
                onClick={() => toggleCardDetails(index)}
                style={{
                  background:
                    'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500',
                  pointerEvents: 'auto', // CRITICAL: Immediate responsiveness
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Close Details
              </button>

              {isDisabled ? (
                <button
                  style={{
                    background: '#E2E8F0',
                    color: '#718096',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    cursor: 'not-allowed',
                    fontWeight: '500',
                    pointerEvents: 'auto',
                  }}
                  disabled={true}
                >
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </button>
              ) : (
                <Link to={resource.link} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '0.95rem',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                      pointerEvents: 'auto', // CRITICAL: Immediate responsiveness
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseOut={e => {
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
            </div>
          </div>
        )}

        {/* Footer with content type indicator */}
        {resource.secondaryContentType ? (
          // Dual content type footer
          <div
            style={{
              padding: '12px 20px',
              background: getDualFooterColor(resource),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: isDisabled ? 0.7 : 1,
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                fontWeight: '500',
              }}
            >
              {getContentTypeDisplay(resource)}
            </span>
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                fontWeight: '500',
              }}
            >
              {resource.secondaryContentType}
            </span>
          </div>
        ) : (
          // Single content type footer
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: getFooterColor(getContentType(resource)),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isDisabled ? 0.7 : 1,
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
              {getContentTypeDisplay(resource)}
            </span>
          </div>
        )}
      </div>
    )
  }

  const cardsContent = (
    <div style={cardsContainerStyle}>
      {resources.map((resource, idx) => (
        <ResourceCard key={idx} resource={resource} index={idx} />
      ))}
    </div>
  )

  if (hideSection) {
    return cardsContent
  }

  return (
    <section style={learningHubSectionStyle}>
      <div style={containerStyle}>{cardsContent}</div>
    </section>
  )
}

export default LandingPageCards
