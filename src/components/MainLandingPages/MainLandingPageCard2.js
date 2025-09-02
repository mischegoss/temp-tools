// Simple MainLandingPageCard2.js - Exact Original + Minimal Isolation
// src/components/MainLandingPages/MainLandingPageCard2.js

import React, { useState, useCallback } from 'react'
import Link from '@docusaurus/Link'

const MainLandingPageCards = ({ resources = [] }) => {
  const [expandedCards, setExpandedCards] = useState({})

  // Simple toggle function - exactly like original
  const toggleCardDetails = useCallback(index => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }, [])

  // Early validation - exactly like original
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

  // ORIGINAL button styles - exactly the same
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
    transition: 'all 0.15s ease',
    boxShadow: '0 0 10px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    pointerEvents: 'auto',
    userSelect: 'none',
    touchAction: 'manipulation',
    // MINIMAL isolation - just enough
    position: 'relative',
    zIndex: 1000,
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
    cursor: 'not-allowed',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    opacity: 0.6,
  }

  // ORIGINAL hover handlers - exactly the same
  const getHoverHandlers = () => ({
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.background = 'var(--brand-blue-400)'
      e.currentTarget.style.boxShadow =
        '0 0 20px rgba(0, 80, 199, 0.4), 0 4px 16px rgba(0, 80, 199, 0.3)'
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.background = 'var(--brand-blue)'
      e.currentTarget.style.boxShadow =
        '0 0 10px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
    },
  })

  // SIMPLE event isolation - just stop bubbling
  const handleButtonClick = (e, action, index) => {
    e.preventDefault()
    e.stopPropagation()
    if (action === 'toggle') {
      toggleCardDetails(index)
    }
  }

  // Format level display - exactly like original
  const formatLevelDisplay = level => {
    if (!level) return ''
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  }

  // Individual card component - EXACTLY like original
  const ResourceCard = ({ resource, index }) => {
    const isExpanded = expandedCards[index] || false
    const primaryLevel = resource.primaryLevel || resource.level || 'Beginner'
    const isDisabled = resource.disabled === true

    return (
      <div
        style={{
          border: '2px solid var(--brand-blue)',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'var(--brand-white)',
          boxShadow:
            '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.15s ease',
          marginBottom: '1.5rem',
          fontFamily: 'var(--ifm-font-family-base)',
        }}
      >
        {!isExpanded ? (
          // Summary View - EXACTLY like original
          <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  fontFamily: 'var(--ifm-font-family-base)',
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: isDisabled
                    ? 'var(--brand-grey-500)'
                    : 'var(--brand-black-700)',
                  margin: '0 0 16px 0',
                }}
              >
                {resource.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--ifm-font-family-base)',
                  fontSize: '1.2rem',
                  color: isDisabled
                    ? 'var(--brand-grey-500)'
                    : 'var(--brand-black)',
                  lineHeight: '1.5',
                  margin: '0',
                }}
              >
                {resource.description}
              </p>
            </div>

            {/* Level Badge - EXACTLY like original */}
            {primaryLevel && (
              <div
                style={{
                  display: 'inline-block',
                  background: 'var(--brand-blue)',
                  color: 'var(--brand-white)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                {formatLevelDisplay(primaryLevel)}
              </div>
            )}

            {/* Buttons - EXACTLY like original + minimal isolation */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isDisabled && (
                <button
                  onClick={e => handleButtonClick(e, 'toggle', index)}
                  style={baseButtonStyle}
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
                  <button
                    style={baseButtonStyle}
                    {...getHoverHandlers()}
                    onClick={e => e.stopPropagation()}
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
          // Expanded View - EXACTLY like original
          <div style={{ padding: '32px' }}>
            <h3
              style={{
                fontFamily: 'var(--ifm-font-family-base)',
                fontSize: '1.75rem',
                fontWeight: '600',
                color: 'var(--brand-black-700)',
                margin: '0 0 16px 0',
              }}
            >
              {resource.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--ifm-font-family-base)',
                fontSize: '1.2rem',
                color: 'var(--brand-black)',
                lineHeight: '1.5',
                margin: '0 0 16px 0',
              }}
            >
              {resource.description}
            </p>

            {resource.extendedDescription && (
              <div style={{ marginTop: '16px', marginBottom: '20px' }}>
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
                    margin: '0',
                  }}
                >
                  {resource.extendedDescription}
                </p>
              </div>
            )}

            {/* Expanded buttons - EXACTLY like original + minimal isolation */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '32px',
              }}
            >
              <button
                onClick={e => handleButtonClick(e, 'toggle', index)}
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
                  <button
                    style={baseButtonStyle}
                    {...getHoverHandlers()}
                    onClick={e => e.stopPropagation()}
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
