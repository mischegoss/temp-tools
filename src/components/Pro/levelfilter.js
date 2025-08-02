import React, { useState } from 'react'
import {
  getFilterButtonStyle,
  getFilterHoverStyle,
  getFilterActiveStyle,
} from './styles/prostyles'

/**
 * LevelFilter component - Renders buttons for filtering by skill level
 * Updated with brand-compliant styling matching LearningHub design system
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
  const [hoveredFilter, setHoveredFilter] = useState(null)

  // Filter button click handler
  const handleFilterClick = filterType => {
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

    if (isActive) {
      return { ...baseStyle, ...getFilterActiveStyle(filterType) }
    }
    if (isHovered) {
      return { ...baseStyle, ...getFilterHoverStyle(filterType) }
    }
    return baseStyle
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
        onClick={() => handleFilterClick('all')}
        style={getCombinedButtonStyle('all')}
        onMouseOver={() => handleFilterMouseOver('all')}
        onMouseOut={handleFilterMouseOut}
      >
        ALL ({totalResources})
      </button>

      <button
        onClick={() => handleFilterClick('beginner')}
        style={getCombinedButtonStyle('beginner')}
        onMouseOver={() => handleFilterMouseOver('beginner')}
        onMouseOut={handleFilterMouseOut}
      >
        BEGINNER ({totalByLevel.beginner || 0})
      </button>

      <button
        onClick={() => handleFilterClick('intermediate')}
        style={getCombinedButtonStyle('intermediate')}
        onMouseOver={() => handleFilterMouseOver('intermediate')}
        onMouseOut={handleFilterMouseOut}
      >
        INTERMEDIATE ({totalByLevel.intermediate || 0})
      </button>

      <button
        onClick={() => handleFilterClick('advanced')}
        style={getCombinedButtonStyle('advanced')}
        onMouseOver={() => handleFilterMouseOver('advanced')}
        onMouseOut={handleFilterMouseOut}
      >
        ADVANCED ({totalByLevel.advanced || 0})
      </button>
    </div>
  )
}

export default LevelFilter
