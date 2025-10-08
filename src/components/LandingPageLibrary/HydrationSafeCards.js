// @site/src/components/LandingPageLibrary/HydrationSafeCards.js

import React, { useState, useEffect } from 'react'
import Link from '@docusaurus/Link'

/**
 * HydrationSafeCards - Best of both worlds:
 * 1. DiscoverCards' simple, working expand/collapse logic
 * 2. NO React Bootstrap - pure HTML buttons + Docusaurus Links
 * 3. Learning Hub footer colors
 * 4. Clean CSS-only interactions
 */
const HydrationSafeCards = ({
  resources = [],
  productInfo = {
    product: 'general',
    accent: '#008B8B',
    contentTypeDisplay: 'General',
  },
}) => {
  // Simple state management - exactly like DiscoverCards
  const [expandedCards, setExpandedCards] = useState({})

  // CSS injection for working buttons - no React Bootstrap needed
  useEffect(() => {
    const styleId = 'clean-working-cards-styles'

    if (document.getElementById(styleId)) return

    const styles = `
      .clean-card {
        background: #FFFFFF;
        border-radius: 12px;
        border: 2px solid #008B8B;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 139, 139, 0.1);
        transition: all 0.15s ease;
        position: relative;
        width: 100%;
        margin-bottom: 30px;
      }
      
      .clean-card:hover {
        box-shadow: 0 8px 24px rgba(0, 139, 139, 0.15);
        transform: translateY(-4px);
      }
      
      /* Clean button styles - no Bootstrap conflicts */
      .clean-btn {
        background: linear-gradient(135deg, #0066FF 0%, #00B8DE 100%);
        color: #FFFFFF !important;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 0.95rem;
        font-family: SeasonMix, system-ui, -apple-system, sans-serif;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none !important;
        display: inline-block;
        text-align: center;
        line-height: 1.2;
        transition: all 0.2s ease !important;
        pointer-events: auto !important;
        user-select: none !important;
      }
      
      .clean-btn:hover {
        background: linear-gradient(135deg, #0052CC 0%, #0099B8 100%) !important;
        transform: translateY(-1px) !important;
        text-decoration: none !important;
        color: #FFFFFF !important;
      }
      
      .clean-btn:active {
        transform: translateY(0) !important;
      }
      
      .clean-btn:focus {
        outline: 2px solid #0066FF !important;
        outline-offset: 2px !important;
      }
      
      .clean-btn-secondary {
        background: linear-gradient(135deg, #718096 0%, #4A5568 100%);
        color: #FFFFFF !important;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 0.95rem;
        font-family: SeasonMix, system-ui, -apple-system, sans-serif;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none !important;
        display: inline-block;
        text-align: center;
        line-height: 1.2;
        transition: all 0.2s ease !important;
        pointer-events: auto !important;
        user-select: none !important;
      }
      
      .clean-btn-secondary:hover {
        background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%) !important;
        transform: translateY(-1px) !important;
        text-decoration: none !important;
        color: #FFFFFF !important;
      }
      
      .clean-btn:disabled {
        background: #E2E8F0 !important;
        color: #718096 !important;
        cursor: not-allowed;
        transform: none !important;
        pointer-events: none !important;
      }
      
      .clean-btn:disabled:hover {
        transform: none !important;
        background: #E2E8F0 !important;
      }
      
      @media (max-width: 768px) {
        .clean-card:hover {
          transform: none !important;
        }
        
        .clean-btn:hover,
        .clean-btn-secondary:hover {
          transform: none !important;
        }
      }
    `

    const styleSheet = document.createElement('style')
    styleSheet.id = styleId
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
  }, [])

  // Simple toggle function - exactly like DiscoverCards
  const toggleCard = index => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Static styles matching current appearance
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

  const buttonContainerStyle = {
    padding: '0 24px 24px 24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  }

  const expandedContentStyle = {
    backgroundColor: '#F7FAFC',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    margin: '16px 24px 0 24px',
  }

  const footerStyle = {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    fontWeight: '500',
    color: '#FFFFFF',
  }

  // Footer color logic - Learning Hub colors
  const getFooterColor = product => {
    switch (product?.toLowerCase()) {
      case 'actions':
      case 'pro':
      case 'express':
        return '#1E3A8A' // Automation Development - Dark Blue
      case 'insights':
        return '#008B8B' // Device Discovery and Management - Teal
      case 'service-blueprinting':
        return '#4A90E2' // Automation Design - Blue
      default:
        return '#008B8B' // Default teal
    }
  }

  // Content type display logic
  const getContentTypeDisplay = product => {
    // Debug logging to see what we're receiving
    console.log('Footer product value:', product)

    switch (product?.toLowerCase()) {
      case 'actions':
      case 'pro':
      case 'express':
        return 'Automation Development'
      case 'insights':
        return 'Device Discovery and Management'
      case 'service-blueprinting':
      case 'service blueprinting':
        return 'Automation Design'
      default:
        // More descriptive default based on common patterns
        return 'Product Overview'
    }
  }

  // Early validation
  if (!resources?.length) {
    return (
      <section style={learningHubSectionStyle}>
        <div style={containerStyleOriginal}>
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
              No resources to display. Please provide a valid array of
              resources.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ResourceCard component - clean and simple like DiscoverCards
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index] // Simple check, no hydration complexity
    const isDisabled = resource.disabled || resource.comingSoon

    // Debug logging for Service Blueprinting
    console.log(
      'Resource:',
      resource.title,
      'disabled:',
      resource.disabled,
      'comingSoon:',
      resource.comingSoon,
      'isDisabled:',
      isDisabled,
    )

    // Get footer color with resource-specific logic for discover page
    const getResourceSpecificColor = (product, resource) => {
      // Debug logging for discover page
      if (product?.toLowerCase() === 'discover') {
        console.log('Discover page - Resource title:', resource?.title)
        console.log(
          'Title includes service blueprinting:',
          resource?.title?.toLowerCase().includes('service blueprinting'),
        )
        console.log(
          'Title includes blueprinting:',
          resource?.title?.toLowerCase().includes('blueprinting'),
        )
      }

      // Special handling for discover page
      if (product?.toLowerCase() === 'discover') {
        // Check if this is a Service Blueprinting card
        if (
          resource?.title?.toLowerCase().includes('service blueprinting') ||
          resource?.title?.toLowerCase().includes('blueprinting')
        ) {
          console.log('Using blue color for Service Blueprinting card')
          return '#4A90E2' // Automation Design - Blue (same as service-blueprinting pages)
        }
        // Default for other discover content (including Automation Essentials)
        console.log('Using teal color for other discover content')
        return '#008B8B' // Teal
      }

      // For non-discover pages, use the standard logic
      return getFooterColor(product)
    }
    const getResourceSpecificDisplay = (product, resource) => {
      // Special handling for discover page
      if (product?.toLowerCase() === 'discover') {
        // Check if this is the Automation Essentials card
        if (resource?.title?.toLowerCase().includes('automation essentials')) {
          return 'Discover Actions'
        }
        // Check if this is a Service Blueprinting card
        if (
          resource?.title?.toLowerCase().includes('service blueprinting') ||
          resource?.title?.toLowerCase().includes('blueprinting')
        ) {
          return 'Automation Design'
        }
        // Default for other discover content
        return 'Learning Path'
      }

      // For non-discover pages, use the standard logic
      return getContentTypeDisplay(product)
    }

    return (
      <div
        className='clean-card'
        style={{
          opacity: isDisabled ? 0.6 : 1,
          filter: isDisabled ? 'grayscale(20%)' : 'none',
          pointerEvents: isDisabled ? 'none' : 'auto',
        }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h3
            style={{
              ...titleStyle,
              color: isDisabled ? '#9CA3AF' : titleStyle.color,
            }}
          >
            {resource.title}
          </h3>
          <p
            style={{
              ...descriptionStyle,
              color: isDisabled ? '#9CA3AF' : descriptionStyle.color,
            }}
          >
            {resource.description}
          </p>
        </div>

        {/* Expanded content - only render when needed, like DiscoverCards */}
        {isExpanded && resource.extendedDescription && !isDisabled && (
          <div style={expandedContentStyle}>
            <h5
              style={{
                margin: '0 0 12px 0',
                fontWeight: 600,
                color: '#2D3748',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              }}
            >
              Overview
            </h5>
            <p
              style={{
                color: '#4A5568',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: '0 0 16px 0',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              }}
            >
              {resource.extendedDescription}
            </p>

            {/* Courses list if available */}
            {resource.courses && resource.courses.length > 0 && (
              <>
                <h5
                  style={{
                    margin: '0 0 12px 0',
                    fontWeight: 600,
                    color: '#2D3748',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                  }}
                >
                  What's Included:
                </h5>
                <ul style={{ margin: 0, paddingLeft: '24px' }}>
                  {resource.courses.map((course, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: '8px',
                        color: '#4A5568',
                        lineHeight: '1.6',
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
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
                      color: '#4A5568',
                      lineHeight: '1.6',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {resource.usageInstructions}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Buttons - Clean HTML buttons + Docusaurus Links */}
        <div style={buttonContainerStyle}>
          {!isDisabled && isExpanded ? (
            // Expanded state buttons (only when not disabled)
            <>
              <button
                type='button'
                className='clean-btn-secondary'
                onClick={() => toggleCard(index)}
              >
                Close Details
              </button>
              <Link to={resource.link} className='clean-btn'>
                {resource.resourceType === 'module'
                  ? 'Get Started'
                  : 'View Module'}
              </Link>
            </>
          ) : !isDisabled ? (
            // Collapsed state buttons (only when not disabled)
            <>
              <button
                type='button'
                className='clean-btn-secondary'
                onClick={() => toggleCard(index)}
              >
                View Details
              </button>
              <Link to={resource.link} className='clean-btn'>
                {resource.resourceType === 'module'
                  ? 'Get Started'
                  : 'View Module'}
              </Link>
            </>
          ) : (
            // Disabled state - single button only
            <button type='button' className='clean-btn' disabled>
              Coming Soon
            </button>
          )}
        </div>

        {/* Footer with Learning Hub colors */}
        <div
          style={{
            ...footerStyle,
            backgroundColor: getResourceSpecificColor(
              productInfo.product,
              resource,
            ),
            opacity: isDisabled ? 0.7 : 1,
          }}
        >
          {getResourceSpecificDisplay(productInfo.product, resource)}
        </div>
      </div>
    )
  }

  // Main render
  return (
    <section style={learningHubSectionStyle}>
      <div style={containerStyleOriginal}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            margin: 0,
            padding: 0,
          }}
        >
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
