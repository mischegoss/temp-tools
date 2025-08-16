// @site/src/components/ActionVideoLibrary/FilterSection.js

import React from 'react'
import {
  createFilterButtonStyle,
  createFilterHoverStyle,
  createFilterActiveStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * VideoFilterSection component - Filter buttons for video gallery
 * Uses custom filter colors that match the Actions dark theme
 */
const VideoFilterSection = ({
  activeFilter,
  setActiveFilter,
  totalByLevel,
  resources,
}) => {
  // Calculate total count
  const totalCount = resources.length

  // Custom filter colors for video categories using Actions dark theme
  const videoFilterColors = {
    gradients: {
      all: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
      integrations: 'linear-gradient(to bottom, #05070f 0%, #00b8de 100%)',
      workflows: 'linear-gradient(to bottom, #05070f 0%, #0050c7 100%)',
      'automation-design':
        'linear-gradient(to bottom, #05070f 0%, #0066FF 100%)',
      rita: 'linear-gradient(to bottom, #05070f 0%, #008B8B 100%)',
      jarvis: 'linear-gradient(to bottom, #05070f 0%, #6B46C1 100%)',
    },
    borderColors: {
      all: '#0d1637',
      integrations: '#00b8de',
      workflows: '#0050c7',
      'automation-design': '#0066FF',
      rita: '#008B8B',
      jarvis: '#6B46C1',
    },
    shadowColors: {
      all: 'rgba(13, 22, 55, 0.2)',
      integrations: 'rgba(0, 184, 222, 0.2)',
      workflows: 'rgba(0, 80, 199, 0.2)',
      'automation-design': 'rgba(0, 102, 255, 0.2)',
      rita: 'rgba(0, 139, 139, 0.2)',
      jarvis: 'rgba(107, 70, 193, 0.2)',
    },
    activeGlowColors: {
      all: 'rgba(13, 22, 55, 0.4)',
      integrations: 'rgba(0, 184, 222, 0.4)',
      workflows: 'rgba(0, 80, 199, 0.4)',
      'automation-design': 'rgba(0, 102, 255, 0.4)',
      rita: 'rgba(0, 139, 139, 0.4)',
      jarvis: 'rgba(107, 70, 193, 0.4)',
    },
  }

  // Filter button container style
  const filterButtonsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    margin: '0 auto',
  }

  // Create filter button styles using the custom video filter colors
  const getFilterButtonStyle = (filterType, isActive) => {
    const baseStyle = createFilterButtonStyle(filterType, videoFilterColors)
    if (isActive) {
      return {
        ...baseStyle,
        ...createFilterActiveStyle(filterType, videoFilterColors),
      }
    }
    return baseStyle
  }

  const getFilterHoverStyle = filterType =>
    createFilterHoverStyle(filterType, videoFilterColors)

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
