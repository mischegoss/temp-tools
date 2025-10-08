// @site/src/components/LandingPageLibrary/MainFilterSection.js

import React from 'react'

/**
 * MainFilterSection component - Complete, self-contained filter section for landing pages
 *
 * No imports, no dependencies, no duplication. Everything needed is right here.
 * Used by Actions, Pro, Insights, and Express landing pages.
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

  // Help section frame style
  const helpSectionStyle = {
    background: `linear-gradient(145deg, rgba(${parseInt(
      colors.primary.slice(1, 3),
      16,
    )}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(
      colors.primary.slice(5, 7),
      16,
    )}, 0.02) 0%, rgba(${parseInt(
      colors.secondary.slice(1, 3),
      16,
    )}, ${parseInt(colors.secondary.slice(3, 5), 16)}, ${parseInt(
      colors.secondary.slice(5, 7),
      16,
    )}, 0.02) 100%)`,
    border: `1px solid ${colors.primary}1A`, // 10% opacity
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: `0 4px 20px ${colors.primary}1A, 0 1px 3px rgba(0, 0, 0, 0.1)`,
  }

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2D3748',
    margin: '0 0 16px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const descriptionStyle = {
    fontSize: '1.25rem',
    color: '#4A5568',
    margin: '0 0 32px 0',
    lineHeight: '1.6',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Filter button styles - using original button colors
  const filterButtonsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    margin: '0 auto',
  }

  // Original filter button color schemes
  const getFilterColors = filterType => {
    const colorSchemes = {
      all: {
        gradient: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
        border: '#0d1637',
        shadow: 'rgba(13, 22, 55, 0.2)',
        activeGlow: 'rgba(13, 22, 55, 0.4)',
      },
      beginner: {
        gradient: 'linear-gradient(to bottom, #05070f 0%, #00b8de 100%)',
        border: '#00b8de',
        shadow: 'rgba(0, 184, 222, 0.2)',
        activeGlow: 'rgba(0, 184, 222, 0.4)',
      },
      intermediate: {
        gradient: 'linear-gradient(to bottom, #05070f 0%, #0050c7 100%)',
        border: '#0050c7',
        shadow: 'rgba(0, 80, 199, 0.2)',
        activeGlow: 'rgba(0, 80, 199, 0.4)',
      },
      advanced: {
        gradient: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
        border: '#0d1637',
        shadow: 'rgba(13, 22, 55, 0.2)',
        activeGlow: 'rgba(13, 22, 55, 0.4)',
      },
    }
    return colorSchemes[filterType] || colorSchemes.all
  }

  const getFilterButtonStyle = (filterType, isActive) => {
    const filterColors = getFilterColors(filterType)

    return {
      background: filterColors.gradient,
      color: 'white',
      border: `2px solid ${filterColors.border}`,
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      boxShadow: isActive
        ? `0 0 20px ${filterColors.activeGlow}`
        : `0 4px 12px ${filterColors.shadow}`,
      transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
    }
  }

  // Calculate total count - with proper validation
  const totalCount =
    resources && Array.isArray(resources) ? resources.length : 0

  // Get count for each level - with proper validation
  const getCount = level => {
    if (level === 'all') return totalCount
    return totalByLevel && totalByLevel[level] ? totalByLevel[level] : 0
  }

  // Button hover handlers - using original color scheme
  const handleButtonMouseEnter = (e, filterType) => {
    if (filterType === activeFilter) return // Don't change active button

    const filterColors = getFilterColors(filterType)
    e.target.style.boxShadow = `0 6px 16px ${filterColors.shadow}, 0 0 12px ${filterColors.activeGlow}`
    e.target.style.transform = 'translateY(-1px)'
  }

  const handleButtonMouseLeave = (e, filterType) => {
    if (filterType === activeFilter) return // Don't change active button

    const filterColors = getFilterColors(filterType)
    e.target.style.boxShadow = `0 4px 12px ${filterColors.shadow}`
    e.target.style.transform = 'translateY(0)'
  }

  // Enhanced filter handler with validation
  const handleFilterChange = newFilter => {
    if (typeof setActiveFilter === 'function') {
      setActiveFilter(newFilter)
    } else {
      console.warn('Missing setActiveFilter function in MainFilterSection')
    }
  }

  return (
    <section style={sectionStyle} className='filter-section'>
      <div style={containerStyle}>
        <div style={helpSectionStyle}>
          <h2 style={titleStyle}>
            <strong>{filterSectionProps.title}</strong>
          </h2>
          <p style={descriptionStyle}>{filterSectionProps.pathDescription}</p>

          {/* Filter Buttons */}
          <div style={filterButtonsContainerStyle}>
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
