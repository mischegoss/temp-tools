import React from 'react'

/**
 * LevelFilter component - Renders buttons for filtering by skill level
 * Updated with brand-compliant styling
 *
 * @param {Object} props Component props
 * @param {string} props.activeFilter Currently selected filter
 * @param {Function} props.setActiveFilter Function to update filter
 * @param {Object} props.totalByLevel Object containing counts for each level
 * @returns {JSX.Element} LevelFilter component
 */
const LevelFilter = ({ activeFilter, setActiveFilter, totalByLevel = {} }) => {
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

    // Base style for all buttons
    const baseStyle = {
      padding: '0.6rem 1.2rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '1.05rem',
      background: gradients[filterType],
      color: 'var(--brand-white)',
      border: `2px solid ${borderColors[filterType]}`,
      transition: 'all 0.3s ease-in-out',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      boxShadow: `0 0 10px ${shadowColors[filterType]}, 0 2px 8px rgba(0, 0, 0, 0.1)`,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    }

    // Add active state styling
    if (activeFilter === filterType) {
      const activeGlowColors = {
        all: 'rgba(13, 22, 55, 0.4)',
        beginner: 'rgba(0, 212, 255, 0.4)',
        intermediate: 'rgba(0, 80, 199, 0.4)',
        advanced: 'rgba(13, 22, 55, 0.4)',
      }

      return {
        ...baseStyle,
        boxShadow: `0 0 0 3px var(--brand-white), 0 0 0 5px ${borderColors[filterType]}, 0 0 20px ${activeGlowColors[filterType]}`,
        transform: 'translateY(-3px)',
        borderColor: 'var(--brand-blue-400)',
      }
    }

    return baseStyle
  }

  // Button hover and mouse out handlers
  const handleMouseOver = (e, filterType) => {
    if (activeFilter !== filterType) {
      const shadowColors = {
        all: 'rgba(13, 22, 55, 0.3)',
        beginner: 'rgba(0, 212, 255, 0.3)',
        intermediate: 'rgba(0, 80, 199, 0.3)',
        advanced: 'rgba(13, 22, 55, 0.3)',
      }

      e.currentTarget.style.boxShadow = `0 0 15px ${shadowColors[filterType]}, 0 4px 12px rgba(0, 0, 0, 0.2)`
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
    }
  }

  const handleMouseOut = (e, isActive, filterType) => {
    if (!isActive) {
      const shadowColors = {
        all: 'rgba(13, 22, 55, 0.2)',
        beginner: 'rgba(0, 212, 255, 0.2)',
        intermediate: 'rgba(0, 80, 199, 0.2)',
        advanced: 'rgba(13, 22, 55, 0.2)',
      }

      const borderColors = {
        all: 'var(--brand-black-700)',
        beginner: 'var(--brand-aqua)',
        intermediate: 'var(--brand-blue)',
        advanced: 'var(--brand-black-700)',
      }

      e.currentTarget.style.boxShadow = `0 0 10px ${shadowColors[filterType]}, 0 2px 8px rgba(0, 0, 0, 0.1)`
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = borderColors[filterType]
    } else {
      // Reset to active style
      const borderColors = {
        all: 'var(--brand-black-700)',
        beginner: 'var(--brand-aqua)',
        intermediate: 'var(--brand-blue)',
        advanced: 'var(--brand-black-700)',
      }

      const activeGlowColors = {
        all: 'rgba(13, 22, 55, 0.4)',
        beginner: 'rgba(0, 212, 255, 0.4)',
        intermediate: 'rgba(0, 80, 199, 0.4)',
        advanced: 'rgba(13, 22, 55, 0.4)',
      }

      e.currentTarget.style.boxShadow = `0 0 0 3px var(--brand-white), 0 0 0 5px ${borderColors[filterType]}, 0 0 20px ${activeGlowColors[filterType]}`
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
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
        onClick={() => setActiveFilter('all')}
        style={getButtonStyle('all')}
        onMouseOver={e => handleMouseOver(e, 'all')}
        onMouseOut={e => handleMouseOut(e, activeFilter === 'all', 'all')}
      >
        ALL
      </button>

      <button
        onClick={() => setActiveFilter('beginner')}
        style={getButtonStyle('beginner')}
        onMouseOver={e => handleMouseOver(e, 'beginner')}
        onMouseOut={e =>
          handleMouseOut(e, activeFilter === 'beginner', 'beginner')
        }
      >
        BEGINNER
      </button>

      <button
        onClick={() => setActiveFilter('intermediate')}
        style={getButtonStyle('intermediate')}
        onMouseOver={e => handleMouseOver(e, 'intermediate')}
        onMouseOut={e =>
          handleMouseOut(e, activeFilter === 'intermediate', 'intermediate')
        }
      >
        INTERMEDIATE
      </button>

      <button
        onClick={() => setActiveFilter('advanced')}
        style={getButtonStyle('advanced')}
        onMouseOver={e => handleMouseOver(e, 'advanced')}
        onMouseOut={e =>
          handleMouseOut(e, activeFilter === 'advanced', 'advanced')
        }
      >
        ADVANCED
      </button>
    </div>
  )
}

export default LevelFilter
