// @site/src/components/ActionVideoLibrary/VideoFilterSection.js

import React from 'react'
import {
  createFilterButtonStyle,
  createFilterHoverStyle,
  createFilterActiveStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme for filter styling
const actionsTheme = getColorTheme('actions')

/**
 * VideoFilterSection component - Filter buttons for video gallery
 * Matches the existing FilterSection component styling exactly
 */
const VideoFilterSection = ({
  activeFilter,
  setActiveFilter,
  totalByLevel,
  resources,
}) => {
  // Calculate total count
  const totalCount = resources.length

  // Filter button container style
  const filterButtonsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    margin: '0 auto',
  }

  // Create filter button styles using the theme
  const getFilterButtonStyle = (filterType, isActive) => {
    const baseStyle = createFilterButtonStyle(
      filterType,
      actionsTheme.filterColors,
    )
    if (isActive) {
      return {
        ...baseStyle,
        ...createFilterActiveStyle(filterType, actionsTheme.filterColors),
      }
    }
    return baseStyle
  }

  const getFilterHoverStyle = filterType =>
    createFilterHoverStyle(filterType, actionsTheme.filterColors)

  // Button hover handlers
  const handleMouseEnter = (e, filterType) => {
    const hoverStyle = getFilterHoverStyle(filterType)
    Object.assign(e.target.style, hoverStyle)
  }

  const handleMouseLeave = (e, filterType) => {
    const isActive = activeFilter === filterType
    const buttonStyle = getFilterButtonStyle(filterType, isActive)
    Object.assign(e.target.style, buttonStyle)
  }

  return (
    <div style={filterButtonsContainerStyle}>
      <button
        style={getFilterButtonStyle('all', activeFilter === 'all')}
        onClick={() => setActiveFilter('all')}
        onMouseEnter={e => handleMouseEnter(e, 'all')}
        onMouseLeave={e => handleMouseLeave(e, 'all')}
      >
        All Videos ({totalCount})
      </button>
      <button
        style={getFilterButtonStyle('beginner', activeFilter === 'beginner')}
        onClick={() => setActiveFilter('beginner')}
        onMouseEnter={e => handleMouseEnter(e, 'beginner')}
        onMouseLeave={e => handleMouseLeave(e, 'beginner')}
      >
        Beginner ({totalByLevel.beginner})
      </button>
      <button
        style={getFilterButtonStyle(
          'intermediate',
          activeFilter === 'intermediate',
        )}
        onClick={() => setActiveFilter('intermediate')}
        onMouseEnter={e => handleMouseEnter(e, 'intermediate')}
        onMouseLeave={e => handleMouseLeave(e, 'intermediate')}
      >
        Intermediate ({totalByLevel.intermediate})
      </button>
      <button
        style={getFilterButtonStyle('advanced', activeFilter === 'advanced')}
        onClick={() => setActiveFilter('advanced')}
        onMouseEnter={e => handleMouseEnter(e, 'advanced')}
        onMouseLeave={e => handleMouseLeave(e, 'advanced')}
      >
        Advanced ({totalByLevel.advanced})
      </button>
    </div>
  )
}

export default VideoFilterSection
