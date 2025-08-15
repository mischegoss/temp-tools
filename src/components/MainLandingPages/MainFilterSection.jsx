// @site/src/components/LandingPageLibrary/MainFilterSection.js

import React from 'react'

/**
 * MainFilterSection component - Complete, self-contained filter section for landing pages
 *
 * No imports, no dependencies, no duplication. Everything needed is right here.
 * Used by Actions, Pro, Insights, and Express landing pages.
 * ONLY CHANGE: Added halo glow for active filter buttons
 */
const MainFilterSection = ({
  // Filter configuration
  filterSectionProps = {
    title: 'Explore Learning Paths',
    pathDescription:
      'Select a learning path by skill level or choose All Levels to browse all available learning paths.',
  },

  // Filter state and data
  activeFilter,
  setActiveFilter,
  totalByLevel,
  resources,

  // Product theming
  productTheme = 'actions', // actions, pro, insights, express
}) => {
  // Get product-specific colors
  const getProductColors = theme => {
    switch (theme) {
      case 'actions':
        return {
          primary: '#0066FF',
          secondary: '#00B8DE',
          accent: '#008B8B',
        }
      case 'pro':
        return {
          primary: '#8B5CF6', // Purple
          secondary: '#A78BFA',
          accent: '#7C3AED',
        }
      case 'insights':
        return {
          primary: '#10B981', // Green
          secondary: '#34D399',
          accent: '#059669',
        }
      case 'express':
        return {
          primary: '#F59E0B', // Orange
          secondary: '#FBBF24',
          accent: '#D97706',
        }
      default:
        return {
          primary: '#0066FF',
          secondary: '#00B8DE',
          accent: '#008B8B',
        }
    }
  }

  const colors = getProductColors(productTheme)

  // Section styles
  const sectionStyle = {
    background: '#FFFFFF',
    padding: '40px 0 20px 0',
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

  // Header styles
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px',
  }

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: '16px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const descriptionStyle = {
    fontSize: '1.25rem',
    color: '#4A5568',
    fontWeight: '500',
    margin: '0 0 32px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    lineHeight: '1.5',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  }

  // Filter button styles with ONLY halo glow addition
  const getFilterButtonStyle = (filterType, isActive) => {
    const baseStyle = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      fontSize: '0.9rem',
      padding: '12px 24px',
      border: `2px solid ${colors.primary}`,
      borderRadius: '6px',
      background: isActive
        ? `linear-gradient(to bottom, ${colors.primary} 0%, ${colors.secondary} 100%)`
        : `linear-gradient(to bottom, #05070f 0%, ${colors.primary} 100%)`,
      color: 'var(--brand-white)',
      cursor: 'pointer',
      userSelect: 'none',
      pointerEvents: 'auto',
      transition: 'all 0.2s ease',
      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
    }

    // ONLY NEW ADDITION: Add halo glow for active state
    if (isActive) {
      baseStyle.boxShadow =
        '0 0 20px rgba(0, 102, 255, 0.6), 0 0 40px rgba(0, 102, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)'
    } else {
      baseStyle.boxShadow =
        '0 0 10px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
    }

    return baseStyle
  }

  // Button hover handlers
  const handleButtonMouseEnter = (e, filterType) => {
    if (activeFilter !== filterType) {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow =
        '0 0 15px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  }

  const handleButtonMouseLeave = (e, filterType) => {
    if (activeFilter !== filterType) {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow =
        '0 0 10px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
    }
  }

  // Filter change handler
  const handleFilterChange = filterType => {
    setActiveFilter(filterType)
  }

  // Count helpers
  const getCount = level => {
    if (level === 'all') {
      return resources?.length || 0
    }
    return totalByLevel?.[level] || 0
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{filterSectionProps.title}</h2>
          <p style={descriptionStyle}>{filterSectionProps.pathDescription}</p>

          {/* Filter Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            }}
          >
            <button
              style={getFilterButtonStyle('all', activeFilter === 'all')}
              onClick={() => handleFilterChange('all')}
              onMouseEnter={e => handleButtonMouseEnter(e, 'all')}
              onMouseLeave={e => handleButtonMouseLeave(e, 'all')}
            >
              All Levels ({getCount('all')})
            </button>
            <button
              style={getFilterButtonStyle(
                'beginner',
                activeFilter === 'beginner',
              )}
              onClick={() => handleFilterChange('beginner')}
              onMouseEnter={e => handleButtonMouseEnter(e, 'beginner')}
              onMouseLeave={e => handleButtonMouseLeave(e, 'beginner')}
            >
              Beginner ({getCount('beginner')})
            </button>
            <button
              style={getFilterButtonStyle(
                'intermediate',
                activeFilter === 'intermediate',
              )}
              onClick={() => handleFilterChange('intermediate')}
              onMouseEnter={e => handleButtonMouseEnter(e, 'intermediate')}
              onMouseLeave={e => handleButtonMouseLeave(e, 'intermediate')}
            >
              Intermediate ({getCount('intermediate')})
            </button>
            <button
              style={getFilterButtonStyle(
                'advanced',
                activeFilter === 'advanced',
              )}
              onClick={() => handleFilterChange('advanced')}
              onMouseEnter={e => handleButtonMouseEnter(e, 'advanced')}
              onMouseLeave={e => handleButtonMouseLeave(e, 'advanced')}
            >
              Advanced ({getCount('advanced')})
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainFilterSection
