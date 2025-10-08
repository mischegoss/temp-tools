// Fixed version - Remove BrowserOnly wrapper to prevent hydration issues
// src/components/MainLandingPages/MainLevelFilter.jsx
import React, { useState } from 'react'

/**
 * Fixed MainLevelFilter component - Eliminates filter button delays
 *
 * Key fixes:
 * 1. Removed BrowserOnly wrapper
 * 2. Direct rendering without hydration delays
 * 3. Immediate button responsiveness
 * 4. Static styles with CSS-in-JS hover effects
 * 5. ONLY VISUAL CHANGE: Added halo glow for active state
 */
const LevelFilter = ({ activeFilter, setActiveFilter, totalByLevel = {} }) => {
  const [hoveredFilter, setHoveredFilter] = useState(null)

  // FIXED: Direct button handlers
  const handleFilterClick = filterType => {
    console.log(`[MainLevelFilter] Filter clicked: ${filterType}`)
    setActiveFilter(filterType)
  }

  const handleFilterMouseOver = filterType => {
    setHoveredFilter(filterType)
  }

  const handleFilterMouseOut = () => {
    setHoveredFilter(null)
  }

  // FIXED: Static button styles - no dynamic injection
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
      // CRITICAL: Immediate responsiveness
      pointerEvents: 'auto',
      transition: 'all 0.2s ease',
      boxShadow:
        isActive || isHovered
          ? `0 0 15px ${shadowColors[filterType]}, 0 4px 12px ${shadowColors[filterType]}`
          : `0 0 10px ${shadowColors[filterType]}, 0 2px 8px rgba(0, 0, 0, 0.1)`,
      // ONLY NEW ADDITION: Add halo glow for active state
      ...(isActive && {
        boxShadow: `0 0 20px rgba(0, 102, 255, 0.6), 0 0 40px rgba(0, 102, 255, 0.3), 0 0 15px ${shadowColors[filterType]}, 0 4px 12px ${shadowColors[filterType]}`,
      }),
      transform: isActive || isHovered ? 'translateY(-2px)' : 'translateY(0)',
    }
  }

  // Calculate totals
  const totalAll = Object.values(totalByLevel).reduce(
    (sum, count) => sum + count,
    0,
  )

  // FIXED: Direct render without BrowserOnly
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        padding: '0',
        margin: '0',
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

export default LevelFilter
