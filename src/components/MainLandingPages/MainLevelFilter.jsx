// Fixed MainLevelFilter with BrowserOnly wrapper to prevent hydration issues
// src/components/MainLandingPages/MainLevelFilter.jsx
import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * LevelFilter component - Renders buttons for filtering by skill level
 * Updated with BrowserOnly wrapper to fix button delay issues
 *
 * @param {Object} props Component props
 * @param {string} props.activeFilter Currently selected filter
 * @param {Function} props.setActiveFilter Function to update filter
 * @param {Object} props.totalByLevel Object containing counts for each level
 * @returns {JSX.Element} LevelFilter component
 */
const LevelFilter = ({ activeFilter, setActiveFilter, totalByLevel = {} }) => {
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
        />
      )}
    </BrowserOnly>
  )
}

const LevelFilterClient = ({ activeFilter, setActiveFilter, totalByLevel }) => {
  // Get button style based on filter type and active state
  const getButtonStyle = filterType => {
    // Define brand gradients for each filter type
    const gradients = {
      all: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-black-700) 100%)',
      beginner:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      intermediate:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      advanced:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-black-700) 100%)',
    }

    // Define border colors for each filter type
    const borderColors = {
      all: 'var(--brand-black-700)',
      beginner: 'var(--brand-aqua)',
      intermediate: 'var(--brand-blue)',
      advanced: 'var(--brand-black-700)',
    }

    // Define shadow colors for each filter type
    const shadowColors = {
      all: 'rgba(13, 22, 55, 0.2)',
      beginner: 'rgba(0, 212, 255, 0.2)',
      intermediate: 'rgba(0, 80, 199, 0.2)',
      advanced: 'rgba(13, 22, 55, 0.2)',
    }

    const isActive = activeFilter === filterType

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
      pointerEvents: 'auto', // Ensure buttons are immediately responsive
      transition: 'all 0.3s ease-in-out',
      boxShadow: isActive
        ? `0 0 15px ${shadowColors[filterType]}, 0 2px 8px rgba(0, 0, 0, 0.2)`
        : `0 0 8px ${shadowColors[filterType]}, 0 1px 4px rgba(0, 0, 0, 0.1)`,
      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
      opacity: isActive ? 1 : 0.9,
    }
  }

  // Handle filter click with immediate response
  const handleFilterClick = filterType => {
    console.log(`[MainLevelFilter] Filter clicked: ${filterType}`)
    setActiveFilter(filterType)
  }

  // Mouse event handlers for hover effects
  const handleMouseOver = (e, filterType) => {
    if (activeFilter !== filterType) {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
    }
  }

  const handleMouseOut = (e, isActive, filterType) => {
    if (!isActive) {
      e.currentTarget.style.transform = 'translateY(0)'

      // Reset to original border color
      const borderColors = {
        all: 'var(--brand-black-700)',
        beginner: 'var(--brand-aqua)',
        intermediate: 'var(--brand-blue)',
        advanced: 'var(--brand-black-700)',
      }
      e.currentTarget.style.borderColor = borderColors[filterType]
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      }}
    >
      <button
        type='button'
        onClick={() => handleFilterClick('all')}
        style={getButtonStyle('all')}
        onMouseOver={e => handleMouseOver(e, 'all')}
        onMouseOut={e => handleMouseOut(e, activeFilter === 'all', 'all')}
        disabled={false}
        tabIndex={0}
      >
        ALL
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('beginner')}
        style={getButtonStyle('beginner')}
        onMouseOver={e => handleMouseOver(e, 'beginner')}
        onMouseOut={e =>
          handleMouseOut(e, activeFilter === 'beginner', 'beginner')
        }
        disabled={false}
        tabIndex={0}
      >
        BEGINNER
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('intermediate')}
        style={getButtonStyle('intermediate')}
        onMouseOver={e => handleMouseOver(e, 'intermediate')}
        onMouseOut={e =>
          handleMouseOut(e, activeFilter === 'intermediate', 'intermediate')
        }
        disabled={false}
        tabIndex={0}
      >
        INTERMEDIATE
      </button>

      <button
        type='button'
        onClick={() => handleFilterClick('advanced')}
        style={getButtonStyle('advanced')}
        onMouseOver={e => handleMouseOver(e, 'advanced')}
        onMouseOut={e =>
          handleMouseOut(e, activeFilter === 'advanced', 'advanced')
        }
        disabled={false}
        tabIndex={0}
      >
        ADVANCED
      </button>
    </div>
  )
}

export default LevelFilter
