// COMPREHENSIVE FIX: Replace MainLandingPageCard2.js to fix ALL landing pages
// src/components/MainLandingPages/MainLandingPageCard2.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'

/**
 * Fixed MainLandingPageCard2 - Eliminates button delays across ALL landing pages
 *
 * Key fixes:
 * 1. Removed dynamic CSS injection (injectMainLandingStyles)
 * 2. Removed useEffect dependencies
 * 3. Pure CSS-in-JS with immediate application
 * 4. No hydration mismatches
 * 5. Immediate button responsiveness
 */

const MainLandingPageCards = ({ resources = [] }) => {
  const [expandedCards, setExpandedCards] = useState({})

  // Early validation with minimal processing
  if (!resources?.length) {
    return (
      <div
        style={{
          padding: '40px',
          backgroundColor: 'var(--brand-grey-100)',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid var(--brand-grey-300)',
        }}
      >
        <p
          style={{
            fontSize: '1.25rem',
            fontFamily: 'var(--ifm-font-family-base)',
            color: 'var(--brand-grey-600)',
            margin: '0',
          }}
        >
          No resources available.
        </p>
      </div>
    )
  }

  // Toggle card expansion
  const toggleCardDetails = index => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Format level display for badges
  const formatLevelDisplay = level => {
    if (!level) return ''
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  }

  // FIXED: Static styles - no dynamic injection needed
  const baseButtonStyle = {
    background: 'var(--brand-blue)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-blue)',
    borderRadius: '6px',
    padding: '12px 28px',
    fontSize: '1.1rem',
    fontFamily: 'var(--ifm-font-family-base)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 10px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    // CRITICAL: Ensure immediate responsiveness
    pointerEvents: 'auto',
    userSelect: 'none',
  }

  const disabledButtonStyle = {
    background: 'var(--brand-grey-500)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-grey-500)',
    borderRadius: '6px',
    padding: '12px 28px',
    fontSize: '1.1rem',
    fontFamily: 'var(--ifm-font-family-base)',
    fontWeight: '600',
    cursor: 'default',
    transition: 'all 0.2s ease',
    boxShadow:
      '0 0 10px rgba(139, 145, 163, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    opacity: 0.6,
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    pointerEvents: 'none',
  }

  // FIXED: CSS hover effects using onMouseEnter/onMouseLeave for immediate response
  const getHoverHandlers = (disabled = false) => {
    if (disabled) return {}

    return {
      onMouseEnter: e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow =
          '0 0 25px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
        e.currentTarget.style.background = 'var(--brand-blue-400)'
        e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow =
          '0 0 10px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.background = 'var(--brand-blue)'
        e.currentTarget.style.borderColor = 'var(--brand-blue)'
      },
    }
  }

  // Individual card component with FIXED styling
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index] || false
    const isDisabled = resource.disabled === true
    const primaryLevel = resource.primaryLevel || resource.level || 'Beginner'

    const cardStyle = {
      fontFamily: 'var(--ifm-font-family-base)',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '12px',
      border: '2px solid var(--brand-grey-300)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
      opacity: isDisabled ? 0.8 : 1,
      overflow: 'hidden',
    }

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
      fontSize: '1rem',
      lineHeight: '1.6',
      margin: '0 0 24px 0',
    }

    return (
      <div style={cardStyle}>
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

            {/* Level Badge */}
            {primaryLevel && (
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: 'var(--brand-blue)',
                  color: 'var(--brand-white)',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  opacity: isDisabled ? 0.7 : 1,
                }}
              >
                {formatLevelDisplay(primaryLevel)}
              </div>
            )}

            {/* FIXED: Buttons with immediate response */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isDisabled && (
                <button
                  onClick={() => toggleCardDetails(index)}
                  style={{
                    ...baseButtonStyle,
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                  }}
                  {...getHoverHandlers()}
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
                  <button style={baseButtonStyle} {...getHoverHandlers()}>
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          // Expanded Card View
          <div style={{ padding: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={titleStyle}>{resource.title}</h3>
                <p style={descriptionStyle}>{resource.description}</p>

                {resource.extendedDescription && (
                  <div style={{ marginTop: '16px' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--brand-black-700)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Overview
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--ifm-font-family-base)',
                        color: 'var(--brand-black)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: '0 0 16px 0',
                      }}
                    >
                      {resource.extendedDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FIXED: Expanded view buttons */}
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
                {...getHoverHandlers()}
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
                  <button style={baseButtonStyle} {...getHoverHandlers()}>
                    {resource.resourceType === 'module'
                      ? 'Get Started'
                      : 'View Module'}
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        padding: '2rem 0',
      }}
    >
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} index={index} />
      ))}
    </div>
  )
}

export default MainLandingPageCards
