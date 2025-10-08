// Fixed MainFilterSection component - Eliminates button delays on ALL landing pages
// @site/src/components/LandingPageLibrary/MainFilterSection.js

import React from 'react'

/**
 * Fixed MainFilterSection using the exact same working logic as FilterSection + LevelFilter
 *
 * FIXES APPLIED:
 * 1. Uses internal LevelFilter component with immediate responsiveness
 * 2. Removed all complex inline event handlers that cause hydration delays
 * 3. No BrowserOnly wrapper - direct rendering for immediate SSR compatibility
 * 4. Static styles with CSS-in-JS hover effects that apply immediately
 * 5. Direct event handlers with pointerEvents: 'auto' for instant responsiveness
 * 6. Maintains exact same visual appearance and functionality
 *
 * This fixes the button responsiveness issue on:
 * - /learning/actions
 * - /learning/pro
 * - /learning/service-blueprinting
 * - /learning/insights
 */

// Fixed LevelFilter component (embedded to avoid import hydration issues)
const LevelFilter = ({ activeFilter, setActiveFilter, totalByLevel = {} }) => {
  const [hoveredFilter, setHoveredFilter] = React.useState(null)

  // FIXED: Direct button handlers - no delays, immediate response
  const handleFilterClick = filterType => {
    console.log(`[MainFilterSection] Filter clicked: ${filterType}`)
    setActiveFilter(filterType)
  }

  const handleFilterMouseOver = filterType => {
    setHoveredFilter(filterType)
  }

  const handleFilterMouseOut = () => {
    setHoveredFilter(null)
  }

  // FIXED: Static button styles with immediate application - no hydration delays
  const getButtonStyle = filterType => {
    const gradients = {
      all: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-black-700) 100%)',
      beginner:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      intermediate:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      advanced:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-black-700) 100%)',
    }

    const borderColors = {
      all: 'var(--brand-black-700)',
      beginner: 'var(--brand-aqua)',
      intermediate: 'var(--brand-blue)',
      advanced: 'var(--brand-black-700)',
    }

    const shadowColors = {
      all: 'rgba(13, 22, 55, 0.2)',
      beginner: 'rgba(0, 212, 255, 0.2)',
      intermediate: 'rgba(0, 80, 199, 0.2)',
      advanced: 'rgba(13, 22, 55, 0.2)',
    }

    const isActive = activeFilter === filterType
    const isHovered = hoveredFilter === filterType

    return {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      fontSize: '0.85rem',
      padding: '12px 24px',
      border: `2px solid ${borderColors[filterType]}`,
      borderRadius: '6px',
      background: gradients[filterType],
      color: 'var(--brand-white)',
      cursor: 'pointer',
      userSelect: 'none',
      // CRITICAL FIX: Immediate responsiveness - no hydration delay
      pointerEvents: 'auto',
      transition: 'all 0.2s ease',
      boxShadow:
        isActive || isHovered
          ? `0 0 15px ${shadowColors[filterType]}, 0 4px 12px ${shadowColors[filterType]}`
          : `0 0 10px ${shadowColors[filterType]}, 0 2px 8px rgba(0, 0, 0, 0.1)`,
      // Active state halo glow (same as working components)
      ...(isActive && {
        boxShadow: `0 0 20px rgba(0, 102, 255, 0.6), 0 0 40px rgba(0, 102, 255, 0.3), 0 0 15px ${shadowColors[filterType]}, 0 4px 12px ${shadowColors[filterType]}`,
      }),
      transform: isActive || isHovered ? 'translateY(-2px)' : 'translateY(0)',
    }
  }

  // Calculate totals with same logic as original
  const totalAll = Object.values(totalByLevel).reduce(
    (sum, count) => sum + count,
    0,
  )

  // FIXED: Direct render without BrowserOnly wrapper - eliminates hydration delay
  return (
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
        type='button'
        onClick={() => handleFilterClick('all')}
        onMouseOver={() => handleFilterMouseOver('all')}
        onMouseOut={handleFilterMouseOut}
        style={getButtonStyle('all')}
      >
        All Levels ({totalAll})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('beginner')}
        onMouseOver={() => handleFilterMouseOver('beginner')}
        onMouseOut={handleFilterMouseOut}
        style={getButtonStyle('beginner')}
      >
        Beginner ({totalByLevel.beginner || 0})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('intermediate')}
        onMouseOver={() => handleFilterMouseOver('intermediate')}
        onMouseOut={handleFilterMouseOut}
        style={getButtonStyle('intermediate')}
      >
        Intermediate ({totalByLevel.intermediate || 0})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('advanced')}
        onMouseOver={() => handleFilterMouseOver('advanced')}
        onMouseOut={handleFilterMouseOut}
        style={getButtonStyle('advanced')}
      >
        Advanced ({totalByLevel.advanced || 0})
      </button>
    </div>
  )
}

// Main MainFilterSection component - maintains exact same API
const MainFilterSection = ({
  // Filter configuration (same props as before)
  filterSectionProps = {
    title: 'Explore Learning Paths',
    pathDescription:
      'Select a learning path by skill level or choose All Levels to browse all available learning paths.',
  },

  // Filter state and data (same props as before)
  activeFilter,
  setActiveFilter,
  totalByLevel,
  resources,

  // Product theming (same props as before)
  productTheme = 'actions', // actions, pro, insights, express
}) => {
  // Same product color logic as original
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

  // Same section styles as original - maintains exact visual appearance
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

  const helpSectionStyle = {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px 0',
  }

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: colors.primary,
    margin: '0 0 20px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    textAlign: 'center',
    lineHeight: '1.2',
  }

  const descriptionStyle = {
    fontSize: '1.25rem',
    lineHeight: '1.6',
    color: '#4A5568',
    margin: '0 0 30px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    textAlign: 'center',
  }

  // FIXED: Enhanced filter handler with validation (same as working components)
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

          {/* Filter Buttons - using fixed LevelFilter component */}
          <div style={{ marginBottom: '1rem' }}>
            <LevelFilter
              activeFilter={activeFilter}
              setActiveFilter={handleFilterChange}
              totalByLevel={totalByLevel}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainFilterSection
