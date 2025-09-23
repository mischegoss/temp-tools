import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Link from '@docusaurus/Link'

const EnhancedProductCardsWithButton = ({ resources = [] }) => {
  // Check if resources is valid before rendering
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--brand-secondary-white)',
          borderRadius: '8px',
          textAlign: 'center',
          margin: '2rem 0',
          border: '2px solid var(--brand-grey-300)',
          boxShadow:
            '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
      >
        <p
          style={{
            fontSize: '1.1rem',
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            color: 'var(--brand-black)',
            margin: 0,
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

  // Get the level badge background color using brand colors
  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-aqua)' // Aqua for beginner
      case 'intermediate':
        return 'var(--brand-blue)' // Blue for intermediate
      case 'advanced':
        return 'var(--brand-purple)' // Purple for advanced
      default:
        return 'var(--brand-grey-600)' // Gray for unknown levels
    }
  }

  // Get gradient for footer based on level using brand gradients
  const getLevelGradient = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)'
      case 'intermediate':
        return 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)'
      case 'advanced':
        return 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-purple) 100%)'
      default:
        return 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-grey-600) 100%)'
    }
  }

  // Get dual level gradient for footer using brand colors
  const getDualLevelGradient = (primaryLevel, secondaryLevel) => {
    const primaryColor = getLevelBadgeColor(primaryLevel)
    const secondaryColor = getLevelBadgeColor(secondaryLevel)
    return `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
  }

  // Get border color based on primary level using brand colors
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-aqua)'
      case 'intermediate':
        return 'var(--brand-blue)'
      case 'advanced':
        return 'var(--brand-purple)'
      default:
        return 'var(--brand-grey-300)'
    }
  }

  // Individual card component
  const ResourceCard = ({ resource, index }) => {
    const isHovered = hoveredCards[index] || false
    const isExpanded = expandedCards[index] || false

    // Use primaryLevel and secondaryLevel from resource or default to level for backward compatibility
    const primaryLevel = resource.primaryLevel || resource.level || 'Beginner'
    const secondaryLevel = resource.secondaryLevel || null

    // Handle button hover effects
    const handleButtonHover = (e, isHovering) => {
      if (isHovering) {
        e.currentTarget.style.background =
          'linear-gradient(to bottom, var(--brand-black-700) 0%, var(--brand-blue-400) 100%)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow =
          '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
      } else {
        e.currentTarget.style.background =
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow =
          '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
      }
    }

    const buttonStyle = {
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      color: 'var(--brand-white)',
      border: '2px solid var(--brand-blue-400)',
      borderRadius: '6px',
      padding: '12px 28px',
      fontSize: '1.1rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    }

    return (
      <div
        style={{
          border: `2px solid ${getBorderColor(primaryLevel)}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--brand-white)',
          boxShadow: isHovered
            ? '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
            : '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          transform: isHovered ? 'translateY(-5px)' : 'none',
          marginBottom: '1.5rem',
          position: 'relative',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
        onMouseEnter={() => setCardHover(index, true)}
        onMouseLeave={() => setCardHover(index, false)}
      >
        {!isExpanded ? (
          // Summary View
          <div
            style={{
              padding: '24px',
            }}
          >
            {/* Logo and Title Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(0, 80, 199, 0.2)',
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
                <h3
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.75rem',
                    color: 'var(--brand-black)',
                    margin: '0 0 16px 0',
                  }}
                >
                  {resource.title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: 'var(--brand-black-700)',
                    fontSize: '1.2rem',
                    lineHeight: '1.5',
                    margin: '0',
                  }}
                >
                  {resource.description}
                </p>
              </div>
            </div>

            {/* Buttons in center of card body */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '32px',
              }}
            >
              <Button
                onClick={() => toggleCardDetails(index)}
                style={buttonStyle}
                onMouseEnter={e => handleButtonHover(e, true)}
                onMouseLeave={e => handleButtonHover(e, false)}
              >
                View Details
              </Button>

              <Link to={resource.link}>
                <Button
                  style={buttonStyle}
                  onMouseEnter={e => handleButtonHover(e, true)}
                  onMouseLeave={e => handleButtonHover(e, false)}
                >
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Expanded Details View
          <div
            style={{
              padding: '24px',
            }}
          >
            {/* Header with Logo and Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(0, 80, 199, 0.2)',
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
                <h3
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.75rem',
                    color: 'var(--brand-black)',
                    margin: '0 0 16px 0',
                  }}
                >
                  {resource.title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: 'var(--brand-black-700)',
                    fontSize: '1.2rem',
                    lineHeight: '1.5',
                    margin: '0',
                  }}
                >
                  {resource.description}
                </p>
              </div>
            </div>

            {/* Additional Details - Full Width */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid var(--brand-grey-200)',
                marginBottom: '1.5rem',
              }}
            >
              {/* Extended Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: 'var(--brand-black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Course Description
                </h5>
                <div
                  style={{
                    backgroundColor: 'var(--brand-secondary-white)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '2px solid var(--brand-grey-200)',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontSize: '1.1rem',
                    color: 'var(--brand-black)',
                    boxShadow: '0 0 10px rgba(0, 102, 255, 0.05)',
                  }}
                >
                  <p style={{ margin: 0 }}>{resource.extendedDescription}</p>
                </div>
              </div>

              {/* Level Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: 'var(--brand-black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Level Information
                </h5>
                <div
                  style={{
                    backgroundColor: 'var(--brand-secondary-white)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '2px solid var(--brand-grey-200)',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontSize: '1.1rem',
                    color: 'var(--brand-black)',
                    boxShadow: '0 0 10px rgba(0, 102, 255, 0.05)',
                  }}
                >
                  {/* Primary Level */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getLevelBadgeColor(primaryLevel),
                        borderRadius: '4px',
                        padding: '0.25rem 0.75rem',
                        color: 'var(--brand-white)',
                        fontWeight: '500',
                        fontSize: '1.05rem',
                        marginRight: '0.75rem',
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
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
                        marginBottom: '0.75rem',
                        marginTop: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: getLevelBadgeColor(secondaryLevel),
                          borderRadius: '4px',
                          padding: '0.25rem 0.75rem',
                          color: 'var(--brand-white)',
                          fontWeight: '500',
                          fontSize: '1.05rem',
                          marginRight: '0.75rem',
                          fontFamily:
                            'SeasonMix, system-ui, -apple-system, sans-serif',
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
                        marginTop: '0.75rem',
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
              <div style={{ marginBottom: '1.5rem' }}>
                <h5
                  style={{
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: 'var(--brand-black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Available Courses
                </h5>
                <div
                  style={{
                    backgroundColor: 'var(--brand-secondary-white)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '2px solid var(--brand-grey-200)',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontSize: '1.1rem',
                    color: 'var(--brand-black)',
                    boxShadow: '0 0 10px rgba(0, 102, 255, 0.05)',
                  }}
                >
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.5rem',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {resource.courses &&
                      resource.courses.map((course, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                          {course}
                        </li>
                      ))}
                  </ul>
                  {resource.usageInstructions && (
                    <p
                      style={{
                        marginTop: '0.75rem',
                        margin: '0.75rem 0 0 0',
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
                      }}
                    >
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
                gap: '20px',
                marginTop: '32px',
              }}
            >
              <Button
                onClick={() => toggleCardDetails(index)}
                style={buttonStyle}
                onMouseEnter={e => handleButtonHover(e, true)}
                onMouseLeave={e => handleButtonHover(e, false)}
              >
                Close Details
              </Button>

              <Link to={resource.link}>
                <Button
                  style={buttonStyle}
                  onMouseEnter={e => handleButtonHover(e, true)}
                  onMouseLeave={e => handleButtonHover(e, false)}
                >
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Narrow footer with level indicator(s) */}
        {secondaryLevel ? (
          // Dual level footer with gradient between colors
          <div
            style={{
              height: '40px',
              background: getDualLevelGradient(primaryLevel, secondaryLevel),
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
            }}
          >
            {/* Primary Level */}
            <span
              style={{
                color: 'var(--brand-white)',
                fontSize: '1.05rem',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {primaryLevel}
            </span>

            {/* Secondary Level */}
            <span
              style={{
                color: 'var(--brand-white)',
                fontSize: '1.05rem',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {secondaryLevel}
            </span>
          </div>
        ) : (
          // Single level footer
          <div
            style={{
              height: '40px',
              background: getLevelGradient(primaryLevel),
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: 'var(--brand-white)',
                fontSize: '1.05rem',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {primaryLevel}
            </span>
          </div>
        )}
      </div>
    )
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '2rem 0',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      }}
    >
      {resources.map((resource, idx) => (
        <ResourceCard key={idx} resource={resource} index={idx} />
      ))}
    </div>
  )
}

export default EnhancedProductCardsWithButton
