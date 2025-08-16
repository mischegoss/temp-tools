// Navigation-Safe LandingPageCards - Fixes Client-Side Navigation Issues
// src/components/LandingPageLibrary/landingpagecards.js

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import Link from '@docusaurus/Link'

// Navigation-safe CSS injection with cleanup
const injectButtonFixes = () => {
  const styleId = 'landing-button-fixes'

  // Remove existing styles first to prevent duplicates during navigation
  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
    existingStyle.remove()
  }

  const styles = `
    .landing-button-fix {
      pointer-events: auto !important;
      user-select: none !important;
      touch-action: manipulation !important;
    }
    
    .landing-button-fix:focus {
      outline: 2px solid #0066FF !important;
      outline-offset: 2px !important;
    }
  `

  const styleSheet = document.createElement('style')
  styleSheet.id = styleId
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)

  return () => {
    // Return cleanup function
    const style = document.getElementById(styleId)
    if (style) {
      style.remove()
    }
  }
}

const LandingPageCards = ({ resources = [], hideSection = false }) => {
  // Navigation-safe state with refs to prevent stale closures
  const [expandedCards, setExpandedCards] = useState({})
  const [hoveredCards, setHoveredCards] = useState({})
  const componentMounted = useRef(true)
  const cleanupFunctions = useRef([])

  // Navigation-safe CSS injection with cleanup
  useEffect(() => {
    componentMounted.current = true
    const cleanup = injectButtonFixes()
    cleanupFunctions.current.push(cleanup)

    return () => {
      componentMounted.current = false
      // Clean up all registered cleanup functions
      cleanupFunctions.current.forEach(fn => fn())
      cleanupFunctions.current = []
    }
  }, [])

  // Navigation-safe toggle function with mounted check
  const toggleCardDetails = useCallback(resourceId => {
    if (!componentMounted.current) return

    setExpandedCards(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }))
  }, [])

  // Navigation-safe hover state with mounted check
  const setCardHover = useCallback((resourceId, isHovered) => {
    if (!componentMounted.current) return

    setHoveredCards(prev => ({
      ...prev,
      [resourceId]: isHovered,
    }))
  }, [])

  // ORIGINAL styles - exactly the same
  const learningHubSectionStyle = {
    background: '#FFFFFF',
    padding: '40px 0',
    color: '#2D3748',
    width: '100%',
    margin: 0,
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    width: '100%',
  }

  const cardsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const noResourcesStyle = {
    padding: '40px',
    backgroundColor: '#F7FAFC',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #008B8B',
  }

  const noResourcesTextStyle = {
    fontSize: '1.25rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    color: '#4A5568',
    margin: '0',
  }

  // Early validation - exactly like original
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
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

  // Helper functions - exactly like original
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#00D4FF'
      case 'intermediate':
        return '#0066FF'
      case 'advanced':
        return '#2D3748'
      default:
        return '#008B8B'
    }
  }

  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#00D4FF'
      case 'intermediate':
        return '#0066FF'
      case 'advanced':
        return '#2D3748'
      default:
        return '#008B8B'
    }
  }

  const getContentType = resource => {
    if (resource.contentType) return resource.contentType
    if (resource.resourceType === 'module') return 'module'
    if (resource.resourceType === 'course') return 'course'
    return 'general'
  }

  const getFooterColor = contentType => {
    switch (contentType?.toLowerCase()) {
      case 'device discovery and management':
        return '#00D4FF'
      case 'automation development':
        return '#0066FF'
      case 'automation design':
        return '#2D3748'
      case 'product overview':
        return '#008B8B'
      case 'module':
        return '#0066FF'
      case 'course':
        return '#008B8B'
      default:
        return '#008B8B'
    }
  }

  const getDualFooterColor = resource => {
    const primaryColor = getFooterColor(getContentType(resource))
    return `linear-gradient(90deg, ${primaryColor} 0%, ${primaryColor}99 50%, #008B8B 50%, #008B8B 100%)`
  }

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

  // ORIGINAL button styles with navigation-safe positioning
  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontWeight: '500',
    // Navigation-safe positioning
    position: 'relative',
    zIndex: 1000,
  }

  const disabledButtonStyle = {
    background: '#E2E8F0',
    color: '#718096',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    cursor: 'not-allowed',
    fontWeight: '500',
  }

  // Navigation-safe event isolation with mounted checks
  const handleButtonClick = useCallback(
    (e, action, index) => {
      if (!componentMounted.current) return

      e.preventDefault()
      e.stopPropagation()

      if (action === 'toggle') {
        toggleCardDetails(index)
      }
    },
    [toggleCardDetails],
  )

  // Navigation-safe mouse handlers with mounted checks
  const createMouseHandlers = useCallback(
    index => ({
      onMouseEnter: () => {
        if (!componentMounted.current) return
        setCardHover(index, true)
      },
      onMouseLeave: () => {
        if (!componentMounted.current) return
        setCardHover(index, false)
      },
    }),
    [setCardHover],
  )

  // Navigation-safe button mouse handlers
  const createButtonMouseHandlers = useCallback(
    (gradientDefault, gradientHover) => ({
      onMouseOver: e => {
        if (!componentMounted.current) return
        e.currentTarget.style.background = gradientHover
        e.currentTarget.style.transform = 'translateY(-2px)'
      },
      onMouseOut: e => {
        if (!componentMounted.current) return
        e.currentTarget.style.background = gradientDefault
        e.currentTarget.style.transform = 'translateY(0)'
      },
    }),
    [],
  )

  // Individual card component - Navigation-safe with mounted checks
  const ResourceCard = useCallback(
    ({ resource, index }) => {
      const isHovered = hoveredCards[index] || false
      const isExpanded = expandedCards[index] || false
      const primaryLevel = resource.primaryLevel || resource.level || 'Beginner'
      const isDisabled = resource.disabled === true

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

      const mouseHandlers = createMouseHandlers(index)
      const defaultGradient =
        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
      const hoverGradient = 'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
      const buttonMouseHandlers = createButtonMouseHandlers(
        defaultGradient,
        hoverGradient,
      )

      return (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            transition: 'all 0.15s ease',
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
          {...(!isDisabled && mouseHandlers)}
        >
          {!isExpanded ? (
            // Summary View - EXACTLY like original
            <div style={{ padding: '30px 30px 80px 30px' }}>
              {/* Logo and Title Row - EXACTLY like original */}
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

              {/* Level Badge - EXACTLY like original */}
              {primaryLevel && (
                <div
                  style={{
                    display: 'inline-block',
                    background: getLevelBadgeColor(primaryLevel),
                    color: '#FFFFFF',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    marginBottom: '16px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {primaryLevel.charAt(0).toUpperCase() +
                    primaryLevel.slice(1).toLowerCase()}
                </div>
              )}

              {/* Buttons - Navigation-safe with proper event handling */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '32px',
                }}
              >
                <Button
                  onClick={e =>
                    !isDisabled && handleButtonClick(e, 'toggle', index)
                  }
                  style={isDisabled ? disabledButtonStyle : primaryButtonStyle}
                  className='landing-button-fix'
                  disabled={isDisabled}
                  {...(!isDisabled && buttonMouseHandlers)}
                >
                  View Details
                </Button>

                {isDisabled ? (
                  <Button
                    style={disabledButtonStyle}
                    disabled
                    className='landing-button-fix'
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </Button>
                ) : (
                  <Link to={resource.link}>
                    <Button
                      style={primaryButtonStyle}
                      className='landing-button-fix'
                      {...buttonMouseHandlers}
                      onClick={e => e.stopPropagation()}
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
            // Expanded View - Navigation-safe with same structure
            <div style={{ padding: '30px 30px 80px 30px' }}>
              {/* Logo and Title Row - EXACTLY like original */}
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

              {/* Extended Description - EXACTLY like original */}
              {resource.extendedDescription && (
                <div
                  style={{
                    backgroundColor: '#F7FAFC',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '20px',
                  }}
                >
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

              {/* Courses List - EXACTLY like original */}
              {resource.courses && (
                <div style={{ marginBottom: '20px' }}>
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
                      backgroundColor: '#F7FAFC',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      color: '#4A5568',
                      lineHeight: '1.6',
                    }}
                  >
                    <ul style={{ margin: 0, paddingLeft: '24px' }}>
                      {resource.courses.map((course, i) => (
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
              )}

              {/* Expanded buttons - Navigation-safe */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '32px',
                }}
              >
                <Button
                  onClick={e => handleButtonClick(e, 'toggle', index)}
                  style={primaryButtonStyle}
                  className='landing-button-fix'
                  {...buttonMouseHandlers}
                >
                  Close Details
                </Button>

                {isDisabled ? (
                  <Button
                    style={disabledButtonStyle}
                    disabled
                    className='landing-button-fix'
                  >
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </Button>
                ) : (
                  <Link to={resource.link}>
                    <Button
                      style={primaryButtonStyle}
                      className='landing-button-fix'
                      {...buttonMouseHandlers}
                      onClick={e => e.stopPropagation()}
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

          {/* Footer - EXACTLY like original */}
          {resource.secondaryContentType ? (
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
    },
    [
      expandedCards,
      hoveredCards,
      handleButtonClick,
      createMouseHandlers,
      createButtonMouseHandlers,
      getBorderColor,
      getLevelBadgeColor,
      getContentType,
      getDualFooterColor,
      getFooterColor,
      getContentTypeDisplay,
    ],
  )

  const cardsContent = (
    <div style={cardsContainerStyle}>
      {resources.map((resource, idx) => (
        <ResourceCard
          key={`${resource.title || 'resource'}-${idx}`}
          resource={resource}
          index={idx}
        />
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
