// @site/src/components/ActionVideoLibrary/FilterSection.js

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
        style={getFilterButtonStyle(
          'integrations',
          activeFilter === 'integrations',
        )}
        onClick={() => setActiveFilter('integrations')}
        onMouseEnter={e => handleMouseEnter(e, 'integrations')}
        onMouseLeave={e => handleMouseLeave(e, 'integrations')}
      >
        Integrations ({totalByLevel.integrations})
      </button>
      <button
        style={getFilterButtonStyle('workflows', activeFilter === 'workflows')}
        onClick={() => setActiveFilter('workflows')}
        onMouseEnter={e => handleMouseEnter(e, 'workflows')}
        onMouseLeave={e => handleMouseLeave(e, 'workflows')}
      >
        Workflows ({totalByLevel.workflows})
      </button>
      <button
        style={getFilterButtonStyle(
          'automation-design',
          activeFilter === 'automation-design',
        )}
        onClick={() => setActiveFilter('automation-design')}
        onMouseEnter={e => handleMouseEnter(e, 'automation-design')}
        onMouseLeave={e => handleMouseLeave(e, 'automation-design')}
      >
        Automation Design ({totalByLevel['automation-design']})
      </button>
      <button
        style={getFilterButtonStyle('rita', activeFilter === 'rita')}
        onClick={() => setActiveFilter('rita')}
        onMouseEnter={e => handleMouseEnter(e, 'rita')}
        onMouseLeave={e => handleMouseLeave(e, 'rita')}
      >
        RITA ({totalByLevel.rita})
      </button>
      <button
        style={getFilterButtonStyle('jarvis', activeFilter === 'jarvis')}
        onClick={() => setActiveFilter('jarvis')}
        onMouseEnter={e => handleMouseEnter(e, 'jarvis')}
        onMouseLeave={e => handleMouseLeave(e, 'jarvis')}
      >
        Jarvis ({totalByLevel.jarvis})
      </button>
    </div>
  )
}

export default VideoFilterSection
