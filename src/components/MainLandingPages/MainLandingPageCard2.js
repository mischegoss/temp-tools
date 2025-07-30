import React, { useState } from 'react'
import Link from '@docusaurus/Link'

const MainLandingPageCards = ({ resources = [] }) => {
  // Check if resources is valid before rendering
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--brand-grey-100)',
          borderRadius: '8px',
          textAlign: 'center',
          margin: '2rem 0',
          border: '2px solid var(--brand-grey-300)',
          boxShadow:
            '0 0 10px rgba(0, 80, 199, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05)',
          fontFamily: 'var(--ifm-font-family-base)',
        }}
      >
        <p
          style={{
            fontSize: '1.1rem',
            fontFamily: 'var(--ifm-font-family-base)',
            color: 'var(--brand-black)',
          }}
        >
          No resources to display. Please provide a valid array of resources.
        </p>
      </div>
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

  // Get the level badge background color using professional blue/teal palette
  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-blue)' // Professional blue
      case 'intermediate':
        return 'var(--brand-blue-400)' // Slightly lighter blue
      case 'advanced':
        return 'var(--brand-black-700)' // Dark professional
      default:
        return 'var(--brand-grey-600)' // Professional grey
    }
  }

  // Get border color based on level
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-blue)'
      case 'intermediate':
        return 'var(--brand-blue-400)'
      case 'advanced':
        return 'var(--brand-black-700)'
      default:
        return 'var(--brand-grey-600)'
    }
  }

  // Get content type from resource
  const getContentType = resource => {
    // First check for primaryLevel
    if (resource.primaryLevel) {
      return resource.primaryLevel.toLowerCase()
    }

    // Check for explicit contentType property
    if (resource.contentType) {
      return resource.contentType.toLowerCase()
    }
    // Check for featureType property
    if (resource.featureType) {
      return resource.featureType.toLowerCase()
    }

    // Check for resourceType property
    if (resource.resourceType) {
      return resource.resourceType.toLowerCase()
    }

    // Return a default value
    return 'learning resource'
  }

  // Helper function to format level for display
  const formatLevelDisplay = level => {
    if (!level) return ''
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  }

  // Button styles
  const baseButtonStyle = {
    background: 'var(--brand-blue)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-blue)',
    borderRadius: '6px',
    padding: '12px 28px',
    fontSize: '1.1rem',
    fontFamily: 'var(--ifm-font-family-base)',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    display: 'inline-block',
  }

  const disabledButtonStyle = {
    ...baseButtonStyle,
    background: 'var(--brand-grey-400)',
    color: 'var(--brand-grey-600)',
    border: '2px solid var(--brand-grey-400)',
    cursor: 'not-allowed',
    opacity: 0.6,
  }

  // Card component for individual resources
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index]
    const isHovered = hoveredCards[index]
    const isDisabled = resource.available === false
    const primaryLevel = resource.primaryLevel || resource.level || 'beginner'

    const titleStyle = {
      fontFamily: 'var(--ifm-font-family-base)',
      fontSize: '1.5rem',
      fontWeight: '600',
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
        style={{
          border: `2px solid ${getBorderColor(primaryLevel)}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--brand-white)',
          boxShadow:
            isHovered && !isDisabled
              ? '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
              : '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          transform:
            isHovered && !isDisabled ? 'translateY(-5px)' : 'translateY(0)',
          marginBottom: '1.5rem',
          position: 'relative',
          cursor: isDisabled ? 'default' : 'pointer',
          fontFamily: 'var(--ifm-font-family-base)',
        }}
        onMouseEnter={() => !isDisabled && setCardHover(index, true)}
        onMouseLeave={() => !isDisabled && setCardHover(index, false)}
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
                    onClick={() => toggleCardDetails(index)}
                    style={{
                      ...baseButtonStyle,
                      padding: '10px 20px',
                      fontSize: '0.95rem',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
                      e.currentTarget.style.borderColor =
                        'var(--brand-blue-400)'
                      e.currentTarget.style.background = 'var(--brand-blue-400)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow =
                        baseButtonStyle.boxShadow
                      e.currentTarget.style.borderColor = 'var(--brand-blue)'
                      e.currentTarget.style.background = 'var(--brand-blue)'
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
                      style={baseButtonStyle}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow =
                          '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
                        e.currentTarget.style.borderColor =
                          'var(--brand-blue-400)'
                        e.currentTarget.style.background =
                          'var(--brand-blue-400)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow =
                          baseButtonStyle.boxShadow
                        e.currentTarget.style.borderColor = 'var(--brand-blue)'
                        e.currentTarget.style.background = 'var(--brand-blue)'
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
          </div>
        ) : (
          // Expanded Card View
          <div style={{ padding: '32px' }}>
            <h3 style={titleStyle}>{resource.title}</h3>
            <p style={descriptionStyle}>{resource.description}</p>

            {/* Detailed content */}
            <div
              style={{
                marginTop: '24px',
                borderTop: '1px solid var(--brand-grey-300)',
                paddingTop: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '32px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left column - Course list */}
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontFamily: 'var(--ifm-font-family-base)',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                      color: isDisabled
                        ? 'var(--brand-grey-500)'
                        : 'var(--brand-black-700)',
                    }}
                  >
                    {resource.resourceType === 'module'
                      ? 'What you will learn:'
                      : 'Courses included:'}
                  </h4>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      lineHeight: '1.6',
                      color: isDisabled
                        ? 'var(--brand-grey-500)'
                        : 'var(--brand-black)',
                    }}
                  >
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {resource.courses &&
                        resource.courses.map((course, i) => (
                          <li key={i} style={{ marginBottom: '0.5rem' }}>
                            {course}
                          </li>
                        ))}
                    </ul>
                    {resource.usageInstructions && (
                      <p style={{ marginTop: '0.75rem' }}>
                        {resource.usageInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right column - Level badge */}
                {primaryLevel && (
                  <div
                    style={{
                      background: getLevelBadgeColor(primaryLevel),
                      color: 'var(--brand-white)',
                      padding: '12px 20px',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      fontFamily: 'var(--ifm-font-family-base)',
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      whiteSpace: 'nowrap',
                      opacity: isDisabled ? 0.7 : 1,
                    }}
                  >
                    {formatLevelDisplay(primaryLevel)}
                  </div>
                )}
              </div>
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
                onClick={() => toggleCardDetails(index)}
                style={baseButtonStyle}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
                  e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
                  e.currentTarget.style.background = 'var(--brand-blue-400)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = baseButtonStyle.boxShadow
                  e.currentTarget.style.borderColor = 'var(--brand-blue)'
                  e.currentTarget.style.background = 'var(--brand-blue)'
                }}
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
                    style={baseButtonStyle}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
                      e.currentTarget.style.borderColor =
                        'var(--brand-blue-400)'
                      e.currentTarget.style.background = 'var(--brand-blue-400)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow =
                        baseButtonStyle.boxShadow
                      e.currentTarget.style.borderColor = 'var(--brand-blue)'
                      e.currentTarget.style.background = 'var(--brand-blue)'
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

        {/* Footer with level indicator */}
        {resource.secondaryLevel ? (
          // Dual level footer
          <div
            style={{
              padding: '12px 20px',
              background: `linear-gradient(135deg, ${getLevelBadgeColor(
                primaryLevel,
              )} 0%, ${getLevelBadgeColor(resource.secondaryLevel)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: isDisabled ? 0.7 : 1,
            }}
          >
            <span
              style={{
                color: 'var(--brand-white)',
                fontSize: '1.05rem',
                fontFamily: 'var(--ifm-font-family-base)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              {formatLevelDisplay(primaryLevel)}
            </span>
            <span
              style={{
                color: 'var(--brand-white)',
                fontSize: '1.05rem',
                fontFamily: 'var(--ifm-font-family-base)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              {formatLevelDisplay(resource.secondaryLevel)}
            </span>
          </div>
        ) : (
          // Single level footer
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: getLevelBadgeColor(primaryLevel),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isDisabled ? 0.7 : 1,
            }}
          >
            <span
              style={{
                color: 'var(--brand-white)',
                fontSize: '1.05rem',
                fontFamily: 'var(--ifm-font-family-base)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              {formatLevelDisplay(primaryLevel)}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '2rem 0',
        fontFamily: 'var(--ifm-font-family-base)',
      }}
    >
      {resources.map((resource, idx) => (
        <ResourceCard key={idx} resource={resource} index={idx} />
      ))}
    </div>
  )
}

export default MainLandingPageCards
