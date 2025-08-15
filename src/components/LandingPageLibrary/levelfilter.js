// Fixed LevelFilter with BrowserOnly wrapper to prevent hydration issues
// src/components/LandingPageLibrary/levelfilter.js
import React, { useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  getFilterButtonStyle,
  getFilterHoverStyle,
  getFilterActiveStyle,
} from './sharedStyles.js'

/**
 * LevelFilter component - Renders buttons for filtering by skill level
 * Updated with BrowserOnly wrapper to fix button delay issues
 *
 * @param {Object} props Component props
 * @param {string} props.activeFilter Currently selected filter
 * @param {Function} props.setActiveFilter Function to update filter
 * @param {Object} props.totalByLevel Object containing counts for each level
 * @param {number} props.totalResources Total count of all resources
 * @returns {JSX.Element} LevelFilter component
 */
const LevelFilter = ({
  activeFilter,
  setActiveFilter,
  totalByLevel = {},
  totalResources = 0,
}) => {
  return (
    <BrowserOnly
      fallback={
        <div style={{ padding: '8px 16px', color: '#666' }}>
          Loading filters...
        </div>
      }
    >
      {() => (
        <LevelFilterClient
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          totalByLevel={totalByLevel}
          totalResources={totalResources}
        />
      )}
    </BrowserOnly>
  )
}

const LevelFilterClient = ({
  activeFilter,
  setActiveFilter,
  totalByLevel,
  totalResources,
}) => {
  const [hoveredFilter, setHoveredFilter] = useState(null)

  // Filter button click handler with immediate response
  const handleFilterClick = filterType => {
    // Immediate visual feedback
    console.log(`[LevelFilter] Filter clicked: ${filterType}`)
    setActiveFilter(filterType)
  }

  // Filter button mouse handlers
  const handleFilterMouseOver = filterType => {
    setHoveredFilter(filterType)
  }

  const handleFilterMouseOut = () => {
    setHoveredFilter(null)
  }

  // Get combined button style
  const getCombinedButtonStyle = filterType => {
    const baseStyle = getFilterButtonStyle(filterType)
    const isActive = activeFilter === filterType
    const isHovered = hoveredFilter === filterType

    // Add cursor pointer and user-select none for better UX
    const enhancedStyle = {
      ...baseStyle,
      cursor: 'pointer',
      userSelect: 'none',
      // Ensure button is immediately responsive
      pointerEvents: 'auto',
    }

    if (isActive) {
      return { ...enhancedStyle, ...getFilterActiveStyle(filterType) }
    }
    if (isHovered) {
      return { ...enhancedStyle, ...getFilterHoverStyle(filterType) }
    }
    return enhancedStyle
  }

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
        style={getCombinedButtonStyle('all')}
        onMouseOver={() => handleFilterMouseOver('all')}
        onMouseOut={handleFilterMouseOut}
        // Add explicit button attributes for better responsiveness
        disabled={false}
        tabIndex={0}
      >
        ALL ({totalResources})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('beginner')}
        style={getCombinedButtonStyle('beginner')}
        onMouseOver={() => handleFilterMouseOver('beginner')}
        onMouseOut={handleFilterMouseOut}
        disabled={false}
        tabIndex={0}
      >
        BEGINNER ({totalByLevel.beginner || 0})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('intermediate')}
        style={getCombinedButtonStyle('intermediate')}
        onMouseOver={() => handleFilterMouseOver('intermediate')}
        onMouseOut={handleFilterMouseOut}
        disabled={false}
        tabIndex={0}
      >
        INTERMEDIATE ({totalByLevel.intermediate || 0})
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('advanced')}
        style={getCombinedButtonStyle('advanced')}
        onMouseOver={() => handleFilterMouseOver('advanced')}
        onMouseOut={handleFilterMouseOut}
        disabled={false}
        tabIndex={0}
      >
        ADVANCED ({totalByLevel.advanced || 0})
      </button>
    </div>
  )
}

export default LevelFilter
