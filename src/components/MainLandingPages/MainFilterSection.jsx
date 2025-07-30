import React from 'react'
import MainLevelFilter from './MainLevelFilter'

/**
 * MainFilterSection component - Contains the filter description and filter buttons
 * Styled to visually connect with the MainWelcomeSection and card design
 *
 * @param {Object} props Component props
 * @param {string} props.title Section title (optional)
 * @param {string} props.pathDescription The learning path description text
 * @param {string} props.activeFilter Current active filter value
 * @param {Function} props.setActiveFilter Function to update the filter
 * @param {Object} props.totalByLevel Count of resources by level
 * @param {Object} props.style Additional style properties to apply (optional)
 * @param {string} props.background Background gradient (optional)
 * @param {boolean} props.connectToWelcome Whether this should visually connect to welcome section
 * @returns {JSX.Element} MainFilterSection component
 */
const MainFilterSection = ({
  title = 'Explore Learning Paths',
  pathDescription = 'Select a learning path by skill level or choose All Levels to browse all available learning paths.',
  activeFilter = 'all',
  setActiveFilter,
  totalByLevel = {},
  style = {},
  background = null, // Will use brand default if not provided
  connectToWelcome = true,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Base styles for the section - Fixed CSS conflicts by separating border properties
  const baseStyles = {
    backgroundColor: background || 'var(--brand-grey-100)',
    padding: '1.5rem 2.5rem 3rem 2.5rem', // Reduced top padding
    marginBottom: '2rem',
    position: 'relative',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // Fixed: Separated border properties to avoid conflicts
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--brand-black-700)',
    borderRightWidth: '2px',
    borderRightStyle: 'solid',
    borderRightColor: 'var(--brand-black-700)',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--brand-black-700)',
    borderTopWidth: connectToWelcome ? '0' : '2px',
    borderTopStyle: connectToWelcome ? 'none' : 'solid',
    borderTopColor: connectToWelcome ? 'transparent' : 'var(--brand-black-700)',
    borderTopLeftRadius: connectToWelcome ? '0' : '8px',
    borderTopRightRadius: connectToWelcome ? '0' : '8px',
    boxShadow: '0 0 15px rgba(13, 22, 55, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily:
      'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
  }

  const hoverStyles = {
    transform: 'translateY(-3px)',
    boxShadow:
      '0 0 20px rgba(13, 22, 55, 0.3), 0 6px 16px rgba(13, 22, 55, 0.2)',
    // Fixed: Use specific border color properties instead of shorthand
    borderLeftColor: 'var(--brand-blue-400)',
    borderRightColor: 'var(--brand-blue-400)',
    borderBottomColor: 'var(--brand-blue-400)',
    borderTopColor: connectToWelcome ? 'transparent' : 'var(--brand-blue-400)',
  }

  // Merge provided style overrides with base styles
  const mergedStyles = {
    ...baseStyles,
    ...style,
    ...(isHovered ? hoverStyles : {}),
  }

  // Handler for filter changes - ensures we're using the passed-in setter
  const handleFilterChange = newFilter => {
    if (typeof setActiveFilter === 'function') {
      setActiveFilter(newFilter)
    } else {
      console.warn('Missing setActiveFilter function in MainFilterSection')
    }
  }

  return (
    <section
      className='filter-section'
      style={mergedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay effect */}
      <div
        style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 10% 20%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          borderRadius: connectToWelcome ? '0 0 8px 8px' : '8px',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      ></div>

      {/* Content container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Conditional rendering of title */}
        {title && (
          <h3
            style={{
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              fontSize: '1.8rem',
              color: 'var(--brand-black-700)',
              margin: '0 0 0.75rem 0',
              textAlign: 'center',
              transition: 'color 0.3s ease',
            }}
          >
            {title}
          </h3>
        )}

        {/* Learning Path Description */}
        <p
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontSize: '1.2rem', // Matching card description size
            lineHeight: '1.7',
            color: 'var(--brand-black)', // Darker color matching cards
            margin: '0 0 1.5rem 0', // Reduced margin
            textAlign: 'center',
            maxWidth: '900px',
            transition: 'color 0.3s ease',
          }}
        >
          {pathDescription}
        </p>

        {/* Filter Buttons */}
        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <MainLevelFilter
            activeFilter={activeFilter}
            setActiveFilter={handleFilterChange}
            totalByLevel={totalByLevel}
          />
        </div>
      </div>
    </section>
  )
}

export default MainFilterSection
