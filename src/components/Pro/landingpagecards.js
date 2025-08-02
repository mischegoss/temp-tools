import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
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
  getLevelBadgeColor,
  getFooterColor,
  getBorderColor,
} from './styles/prostyles.js'

const LandingPageCards = ({ resources = [], hideSection = false }) => {
  // Check if resources is valid before rendering
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    const noResourcesContent = (
      <div style={noResourcesStyle}>
        <p style={noResourcesTextStyle}>
          No resources to display. Please provide a valid array of resources.
        </p>
      </div>
    )

    if (hideSection) {
      return noResourcesContent
    }

    return (
      <section style={learningHubSectionStyle}>
        <div style={containerStyle}>{noResourcesContent}</div>
      </section>
    )
  }

  // State to track which cards have expanded details
  const [expandedCards, setExpandedCards] = useState({})

  // State to track which cards are being hovered
  const [hoveredCards, setHoveredCards] = useState({})

  // Toggle expanded details for a specific card
  const toggleCardDetails = resourceId => {
    setExpandedCards(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }))
  }

  // Set card hover state
  const setCardHover = (resourceId, isHovered) => {
    setHoveredCards(prev => ({
      ...prev,
      [resourceId]: isHovered,
    }))
  }

  // Get content type from resource - FIXED: Remove primaryLevel check
  const getContentType = resource => {
    // Check for explicit contentType property first
    if (resource.contentType) {
      return resource.contentType.toLowerCase()
    }
    // Check for featureType property
    if (resource.featureType) {
      return resource.featureType.toLowerCase()
    }
    // Fallback to checking title/description for keywords
    const title = resource.title?.toLowerCase() || ''
    const description = resource.description?.toLowerCase() || ''
    const combined = title + ' ' + description

    if (
      combined.includes('device discovery') ||
      combined.includes('insights')
    ) {
      return 'device discovery and management'
    }
    if (
      combined.includes('automation development') ||
      combined.includes('actions') ||
      combined.includes('pro') ||
      combined.includes('express')
    ) {
      return 'automation development'
    }
    if (
      combined.includes('automation design') ||
      combined.includes('blueprint')
    ) {
      return 'automation design'
    }
    if (
      combined.includes('product overview') ||
      combined.includes('overview')
    ) {
      return 'product overview'
    }

    return 'default'
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

  // Helper function to get default level descriptions
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

    // Single button hover state (using proven filter pattern)
    const [hoveredButton, setHoveredButton] = useState(null)

    // Use primaryLevel and secondaryLevel from resource or default to level for backward compatibility
    const primaryLevel = resource.primaryLevel || resource.level || 'Beginner'
    const secondaryLevel = resource.secondaryLevel || null

    // Check if card is disabled
    const isDisabled = resource.disabled === true

    // Button hover handlers (using proven filter pattern)
    const handleButtonMouseOver = buttonType => {
      if (!isDisabled) {
        setHoveredButton(buttonType)
      }
    }

    const handleButtonMouseOut = () => {
      setHoveredButton(null)
    }

    // Combined button style function (using proven filter pattern)
    const getCombinedButtonStyle = buttonType => {
      const baseStyle = isDisabled ? disabledButtonStyle : buttonStyle
      const isButtonHovered = hoveredButton === buttonType

      if (isButtonHovered && !isDisabled) {
        return { ...baseStyle, ...buttonHoverStyle }
      }
      return baseStyle
    }

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
        {!isExpanded ? (
          // Summary View
          <div
            style={{
              padding: '30px',
            }}
          >
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

            {/* Buttons in center of card body */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '32px',
              }}
            >
              <Button
                onClick={() => !isDisabled && toggleCardDetails(index)}
                style={getCombinedButtonStyle('viewDetails')}
                onMouseOver={() => handleButtonMouseOver('viewDetails')}
                onMouseOut={handleButtonMouseOut}
                disabled={isDisabled}
              >
                View Details
              </Button>

              {isDisabled ? (
                <Button style={disabledButtonStyle} disabled={true}>
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </Button>
              ) : (
                <Link to={resource.link}>
                  <Button
                    style={getCombinedButtonStyle('actionButton')}
                    onMouseOver={() => handleButtonMouseOver('actionButton')}
                    onMouseOut={handleButtonMouseOut}
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          // Expanded Details View
          <div
            style={{
              padding: '30px',
            }}
          >
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
            <div
              style={{
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #E2E8F0',
                marginBottom: '24px',
              }}
            >
              {/* Extended Description */}
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
                  Course Description
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
                  <p style={{ margin: 0 }}>{resource.extendedDescription}</p>
                </div>
              </div>

              {/* Level Details */}
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
                  Level Information
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
                  {/* Primary Level */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getLevelBadgeColor(primaryLevel),
                        borderRadius: '4px',
                        padding: '6px 12px',
                        color: '#FFFFFF',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        marginRight: '12px',
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
                        opacity: isDisabled ? 0.7 : 1,
                      }}
                    >
                      {primaryLevel}
                    </div>
                    <span
                      style={{
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <strong>Primary Level:</strong>{' '}
                      {resource.primaryLevelDescription ||
                        resource.levelDescription ||
                        getLevelDescription(primaryLevel)}
                    </span>
                  </div>

                  {/* Secondary Level - Only show if it exists */}
                  {secondaryLevel && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: getLevelBadgeColor(secondaryLevel),
                          borderRadius: '4px',
                          padding: '6px 12px',
                          color: '#FFFFFF',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          marginRight: '12px',
                          fontFamily:
                            'SeasonMix, system-ui, -apple-system, sans-serif',
                          opacity: isDisabled ? 0.7 : 1,
                        }}
                      >
                        {secondaryLevel}
                      </div>
                      <span
                        style={{
                          fontFamily:
                            'SeasonMix, system-ui, -apple-system, sans-serif',
                        }}
                      >
                        <strong>Secondary Level:</strong>{' '}
                        {resource.secondaryLevelDescription ||
                          getLevelDescription(secondaryLevel)}
                      </span>
                    </div>
                  )}

                  {resource.prerequisites && (
                    <div
                      style={{
                        marginTop: '12px',
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <strong>Prerequisites:</strong> {resource.prerequisites}
                    </div>
                  )}
                </div>
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

            {/* Buttons in center of expanded card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '32px',
              }}
            >
              <Button
                onClick={() => toggleCardDetails(index)}
                style={getCombinedButtonStyle('closeDetails')}
                onMouseOver={() => handleButtonMouseOver('closeDetails')}
                onMouseOut={handleButtonMouseOut}
              >
                Close Details
              </Button>

              {isDisabled ? (
                <Button style={disabledButtonStyle} disabled={true}>
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </Button>
              ) : (
                <Link to={resource.link}>
                  <Button
                    style={getCombinedButtonStyle('actionButton')}
                    onMouseOver={() => handleButtonMouseOver('actionButton')}
                    onMouseOut={handleButtonMouseOut}
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </Button>
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
