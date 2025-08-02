// ServiceBlueprinting Cards Component - Exact Replica of DiscoverCards
// Location: /src/components/ServiceBlueprinting/serviceblueprintingcards.js

import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Link from '@docusaurus/Link'
import {
  learningHubSectionStyle,
  containerStyle,
  cardsContainerStyle,
} from './styles/serviceblueprintingstyles.js'

const ServiceBlueprintingCards = ({ resources = [], hideSection = false }) => {
  // Check if resources is valid before rendering
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    const noResourcesContent = (
      <div
        style={{
          padding: '40px',
          backgroundColor: '#F7FAFC',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #008B8B',
        }}
      >
        <p
          style={{
            fontSize: '1.25rem',
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            color: '#4A5568',
            margin: '0',
          }}
        >
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

  // Get content type from resource
  const getContentType = resource => {
    if (resource.primaryLevel) {
      return resource.primaryLevel.toLowerCase()
    }
    if (resource.contentType) {
      return resource.contentType.toLowerCase()
    }
    return 'automation design'
  }

  // Border colors
  const getBorderColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4A90E2'
      case 'intermediate':
        return '#1E3A8A'
      case 'advanced':
        return '#008B8B'
      default:
        return '#008B8B'
    }
  }

  // Footer colors
  const getFooterColor = contentType => {
    switch (contentType) {
      case 'automation design':
        return '#4A90E2'
      case 'automation development':
        return '#1E3A8A'
      default:
        return '#008B8B'
    }
  }

  // Content type display names
  const getContentTypeDisplay = resource => {
    const contentType = getContentType(resource)
    switch (contentType) {
      case 'automation design':
        return 'Automation Design'
      case 'automation development':
        return 'Automation Development'
      default:
        return 'Automation Design'
    }
  }

  // Button styles
  const buttonStyle = {
    background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
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
    transition: 'all 0.3s ease',
    fontWeight: '500',
  }

  // Individual card component
  const ResourceCard = ({ resource, index }) => {
    const isHovered = hoveredCards[index] || false
    const isExpanded = expandedCards[index] || false
    const isDisabled = resource.disabled === true
    const primaryLevel = resource.primaryLevel || 'Beginner'

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
          <div style={{ padding: '30px 30px 80px 30px' }}>
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

            {/* Buttons */}
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
                style={isDisabled ? disabledButtonStyle : buttonStyle}
                onMouseOver={e => {
                  if (!isDisabled) {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
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
              </Button>

              {isDisabled ? (
                <Button style={disabledButtonStyle} disabled={true}>
                  Coming Soon
                </Button>
              ) : (
                <Link to={resource.link}>
                  <Button
                    style={buttonStyle}
                    onMouseOver={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Start Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          // Expanded View
          <div style={{ padding: '30px 30px 80px 30px' }}>
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

            {/* Expanded Content */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #E2E8F0',
                marginBottom: '24px',
              }}
            >
              {/* Extended Description */}
              {resource.extendedDescription && (
                <div style={{ marginBottom: '20px' }}>
                  <h5
                    style={{
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      color: '#2D3748',
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
              )}

              {/* Course Level */}
              {resource.usageInstructions && (
                <div style={{ marginBottom: '20px' }}>
                  <h5
                    style={{
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      color: '#2D3748',
                      margin: '0 0 12px 0',
                    }}
                  >
                    Course Level
                  </h5>
                  <div
                    style={{
                      backgroundColor: '#F0F9FF',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #BAE6FD',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      fontSize: '1rem',
                      color: '#0C4A6E',
                      lineHeight: '1.6',
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      {resource.usageInstructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Course Modules */}
              {resource.courses && resource.courses.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h5
                    style={{
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      color: '#2D3748',
                      margin: '0 0 12px 0',
                    }}
                  >
                    What You'll Learn
                  </h5>
                  <ul
                    style={{
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      fontSize: '1rem',
                      color: '#4A5568',
                      lineHeight: '1.6',
                      paddingLeft: '20px',
                      margin: 0,
                    }}
                  >
                    {resource.courses.map((course, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buttons in expanded view */}
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
                style={buttonStyle}
                onMouseOver={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Show Less
              </Button>

              {!isDisabled && (
                <Link to={resource.link}>
                  <Button
                    style={buttonStyle}
                    onMouseOver={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Start Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Footer Badge */}
        <div
          style={{
            background: getFooterColor(getContentType(resource)),
            padding: '12px 24px',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            textAlign: 'center',
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
        </div>
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

export default ServiceBlueprintingCards
