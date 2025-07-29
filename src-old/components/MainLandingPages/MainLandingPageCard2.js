import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
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
            '0 0 10px rgba(0, 102, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05)',
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

  // Helper function to format level display - ALL CAPS
  const formatLevelDisplay = level => {
    if (!level) return ''
    return level.toUpperCase()
  }

  // Get the level badge background color using brand colors - updated for gradients
  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'linear-gradient(135deg, #00D4FF 0%, #00B4D8 100%)' // Cyan gradient
      case 'intermediate':
        return 'linear-gradient(135deg, #0066FF 0%, #0050C7 100%)' // Blue gradient
      case 'advanced':
        return 'linear-gradient(135deg, #0D1637 0%, #05070F 100%)' // Dark navy gradient
      default:
        return 'var(--brand-grey-600)' // Default gray
    }
  }

  // Get footer background color - matching your design
  const getFooterBackgroundColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'linear-gradient(135deg, #00D4FF 0%, #00B4D8 100%)' // Cyan gradient to match your image
      case 'intermediate':
        return 'linear-gradient(135deg, #0066FF 0%, #0050C7 100%)' // Blue gradient to match your image
      case 'advanced':
        return 'linear-gradient(135deg, #0D1637 0%, #05070F 100%)' // Dark navy gradient to match your image
      default:
        return 'var(--brand-grey-600)' // Default gray
    }
  }

  // Get content type from resource - NOW USES PRIMARY LEVEL FIRST
  const getContentType = resource => {
    // First check for primaryLevel - this is the key change
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

  // Get footer color based on content type (solid colors only)
  const getFooterColor = resource => {
    const contentType = getContentType(resource)

    switch (contentType) {
      case 'device discovery and management':
        return 'var(--brand-aqua)'
      case 'automation development':
        return 'var(--brand-blue)'
      case 'automation design':
        return 'var(--brand-purple)'
      case 'product overview':
        return 'var(--brand-green)'
      default:
        return 'var(--brand-grey-600)'
    }
  }

  // Get dual footer color for resources with secondary content type
  const getDualFooterColor = resource => {
    const primaryType = getContentType(resource)
    const secondaryType = resource.secondaryContentType?.toLowerCase() || null

    if (secondaryType) {
      const primaryColor = getFooterColor(resource)
      const secondaryColorMap = {
        'device discovery and management': 'var(--brand-aqua)',
        'automation development': 'var(--brand-blue)',
        'automation design': 'var(--brand-purple)',
        'product overview': 'var(--brand-green)',
      }
      const secondaryColor =
        secondaryColorMap[secondaryType] || 'var(--brand-grey-600)'
      return `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
    }

    return getFooterColor(resource)
  }

  // Get border color based on primary level using brand colors - updated
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'var(--brand-aqua)' // Cyan/aqua for beginner
      case 'intermediate':
        return 'var(--brand-blue)' // Blue for intermediate
      case 'advanced':
        return 'var(--brand-black-700)' // Dark navy for advanced
      default:
        return 'var(--brand-grey-300)' // Default gray
    }
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

  // Get content type display name - UPDATED TO HANDLE PRIMARY LEVEL VALUES
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
    const primaryLevel = resource.primaryLevel || resource.level || 'beginner'
    const secondaryLevel = resource.secondaryLevel || null

    // Check if card is disabled
    const isDisabled = resource.disabled === true

    // Text and card styles
    const titleStyle = {
      fontFamily: 'var(--ifm-font-family-base)',
      fontWeight: 600,
      fontSize: '1.75rem',
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
                  background: 'var(--brand-black)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 0 10px rgba(5, 7, 15, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--brand-black-700)',
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
                gap: '20px',
                marginTop: '32px',
              }}
            >
              <Button
                onClick={() => !isDisabled && toggleCardDetails(index)}
                style={{
                  background: 'var(--brand-blue)',
                  color: 'var(--brand-white)',
                  border: '2px solid var(--brand-blue)',
                  borderRadius: '6px',
                  padding: '12px 28px',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--ifm-font-family-base)',
                  cursor: isDisabled ? 'default' : 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow:
                    '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  opacity: isDisabled ? 0.6 : 1,
                }}
                onMouseOver={e => {
                  if (!isDisabled) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow =
                      '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
                    e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
                    e.currentTarget.style.background = 'var(--brand-blue-400)'
                  }
                }}
                onMouseOut={e => {
                  if (!isDisabled) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.borderColor = 'var(--brand-blue)'
                    e.currentTarget.style.background = 'var(--brand-blue)'
                  }
                }}
                disabled={isDisabled}
              >
                View Details
              </Button>

              {isDisabled ? (
                <Button
                  style={{
                    background: 'var(--brand-blue)',
                    color: 'var(--brand-white)',
                    border: '2px solid var(--brand-blue)',
                    borderRadius: '6px',
                    padding: '12px 28px',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--ifm-font-family-base)',
                    cursor: 'default',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow:
                      '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                    opacity: 0.6,
                  }}
                  disabled={true}
                >
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </Button>
              ) : (
                <Link to={resource.link}>
                  <Button
                    style={{
                      background: 'var(--brand-blue)',
                      color: 'var(--brand-white)',
                      border: '2px solid var(--brand-blue)',
                      borderRadius: '6px',
                      padding: '12px 28px',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--ifm-font-family-base)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow:
                        '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
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
                        '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                      e.currentTarget.style.borderColor = 'var(--brand-blue)'
                      e.currentTarget.style.background = 'var(--brand-blue)'
                    }}
                    onClick={handleButtonClick}
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
                  background: 'var(--brand-black)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 0 10px rgba(5, 7, 15, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--brand-black-700)',
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
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid var(--brand-grey-300)',
                marginBottom: '1.5rem',
              }}
            >
              {/* Extended Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5
                  style={{
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: isDisabled
                      ? 'var(--brand-grey-500)'
                      : 'var(--brand-black-700)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Course Description
                </h5>
                <div
                  style={{
                    backgroundColor: 'var(--brand-grey-100)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '2px solid var(--brand-grey-300)',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontSize: '1.1rem',
                    color: isDisabled
                      ? 'var(--brand-grey-500)'
                      : 'var(--brand-black)',
                  }}
                >
                  <p>{resource.extendedDescription}</p>
                </div>
              </div>

              {/* Level Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h5
                  style={{
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: isDisabled
                      ? 'var(--brand-grey-500)'
                      : 'var(--brand-black-700)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Level Information
                </h5>
                <div
                  style={{
                    backgroundColor: 'var(--brand-grey-100)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '2px solid var(--brand-grey-300)',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontSize: '1.1rem',
                    color: isDisabled
                      ? 'var(--brand-grey-500)'
                      : 'var(--brand-black)',
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
                        background: getLevelBadgeColor(primaryLevel),
                        borderRadius: '4px',
                        padding: '0.25rem 0.75rem',
                        color: 'var(--brand-white)',
                        fontWeight: '500',
                        fontSize: '1.05rem',
                        marginRight: '0.75rem',
                        fontFamily: 'var(--ifm-font-family-base)',
                        opacity: isDisabled ? 0.7 : 1,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {formatLevelDisplay(primaryLevel)}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
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
                          background: getLevelBadgeColor(secondaryLevel),
                          borderRadius: '4px',
                          padding: '0.25rem 0.75rem',
                          color: 'var(--brand-white)',
                          fontWeight: '500',
                          fontSize: '1.05rem',
                          marginRight: '0.75rem',
                          fontFamily: 'var(--ifm-font-family-base)',
                          opacity: isDisabled ? 0.7 : 1,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {formatLevelDisplay(secondaryLevel)}
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--ifm-font-family-base)',
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
                        fontFamily: 'var(--ifm-font-family-base)',
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
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: isDisabled
                      ? 'var(--brand-grey-500)'
                      : 'var(--brand-black-700)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Courses Include
                </h5>
                <div
                  style={{
                    backgroundColor: 'var(--brand-grey-100)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '2px solid var(--brand-grey-300)',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontSize: '1.1rem',
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
                style={{
                  background: 'var(--brand-blue)',
                  color: 'var(--brand-white)',
                  border: '2px solid var(--brand-blue)',
                  borderRadius: '6px',
                  padding: '12px 28px',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--ifm-font-family-base)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow:
                    '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
                  e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
                  e.currentTarget.style.background = 'var(--brand-blue-400)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.borderColor = 'var(--brand-blue)'
                  e.currentTarget.style.background = 'var(--brand-blue)'
                }}
              >
                Close Details
              </Button>

              {isDisabled ? (
                <Button
                  style={{
                    background: 'var(--brand-blue)',
                    color: 'var(--brand-white)',
                    border: '2px solid var(--brand-blue)',
                    borderRadius: '6px',
                    padding: '12px 28px',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--ifm-font-family-base)',
                    cursor: 'default',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow:
                      '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                    opacity: 0.6,
                  }}
                  disabled={true}
                >
                  {resource.resourceType === 'module'
                    ? 'Get Started'
                    : 'View Module'}
                </Button>
              ) : (
                <Link to={resource.link}>
                  <Button
                    style={{
                      background: 'var(--brand-blue)',
                      color: 'var(--brand-white)',
                      border: '2px solid var(--brand-blue)',
                      borderRadius: '6px',
                      padding: '12px 28px',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--ifm-font-family-base)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow:
                        '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
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
                        '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                      e.currentTarget.style.borderColor = 'var(--brand-blue)'
                      e.currentTarget.style.background = 'var(--brand-blue)'
                    }}
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

        {/* Footer with level indicator - using matching gradients */}
        {resource.secondaryLevel ? (
          // Dual level footer - blend the two gradients
          <div
            style={{
              height: '40px',
              background: `linear-gradient(to right, 
                ${getFooterBackgroundColor(primaryLevel)
                  .replace('linear-gradient(135deg, ', '')
                  .replace(')', '')}, 
                ${getFooterBackgroundColor(resource.secondaryLevel)
                  .replace('linear-gradient(135deg, ', '')
                  .replace(')', '')})`,
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
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
          // Single level footer with gradient
          <div
            style={{
              height: '40px',
              background: getFooterBackgroundColor(primaryLevel),
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
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
