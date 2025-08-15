// Fixed LevelFilter with BrowserOnly wrapper to prevent hydration issues
// src/components/LandingPageLibrary/levelfilter.js
import React, { useState } from 'react'
import {
  getFilterButtonStyle,
  getFilterHoverStyle,
  getFilterActiveStyle,
} from './sharedStyles.js'

/**
 * Fixed LevelFilter component - Eliminates button delays on ALL landing pages
 *
 * Key fixes:
 * 1. Removed BrowserOnly wrapper (causing hydration delays)
 * 2. Immediate button responsiveness
 * 3. No fallback loading states
 * 4. Direct event handlers for instant feedback
 * 5. ONLY VISUAL CHANGE: Added halo glow for active state
 */
const LevelFilter = ({
  activeFilter,
  setActiveFilter,
  totalByLevel = {},
  totalResources = 0,
}) => {
  const [hoveredFilter, setHoveredFilter] = useState(null)

  // FIXED: Direct filter handler - no delays
  const handleFilterClick = filterType => {
    console.log(`[LevelFilter] Filter clicked: ${filterType}`)
    setActiveFilter(filterType)
  }

  // FIXED: Immediate hover handlers
  const handleFilterMouseOver = filterType => {
    setHoveredFilter(filterType)
  }

  const handleFilterMouseOut = () => {
    setHoveredFilter(null)
  }

  // FIXED: Get combined button style with immediate application
  const getCombinedButtonStyle = filterType => {
    const baseStyle = getFilterButtonStyle(filterType)
    const isActive = activeFilter === filterType
    const isHovered = hoveredFilter === filterType

    const enhancedStyle = {
      ...baseStyle,
      cursor: 'pointer',
      userSelect: 'none',
      // CRITICAL: Ensure immediate responsiveness
      pointerEvents: 'auto',
      transition: 'all 0.2s ease',
    }

    if (isActive) {
      return {
        ...enhancedStyle,
        ...getFilterActiveStyle(filterType),
        // ONLY NEW ADDITION: Halo glow for active state
        boxShadow:
          '0 0 20px rgba(0, 102, 255, 0.6), 0 0 40px rgba(0, 102, 255, 0.3)',
      }
    }
    if (isHovered) {
      return { ...enhancedStyle, ...getFilterHoverStyle(filterType) }
    }
    return enhancedStyle
  }

  // FIXED: No BrowserOnly wrapper - render directly
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
        style={getCombinedButtonStyle('all')}
      >
        All Levels ({totalResources})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('beginner')}
        onMouseOver={() => handleFilterMouseOver('beginner')}
        onMouseOut={handleFilterMouseOut}
        style={getCombinedButtonStyle('beginner')}
      >
        Beginner ({totalByLevel.beginner || 0})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('intermediate')}
        onMouseOver={() => handleFilterMouseOver('intermediate')}
        onMouseOut={handleFilterMouseOut}
        style={getCombinedButtonStyle('intermediate')}
      >
        Intermediate ({totalByLevel.intermediate || 0})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('advanced')}
        onMouseOver={() => handleFilterMouseOver('advanced')}
        onMouseOut={handleFilterMouseOut}
        style={getCombinedButtonStyle('advanced')}
      >
        Advanced ({totalByLevel.advanced || 0})
      </button>
    </div>
  )
}

export default LevelFilter
