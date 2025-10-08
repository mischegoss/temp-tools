import React from 'react'
import LevelFilter from '../../MainLandingPages/MainLevelFilter'

/**
 * FilterSection component - Contains the filter description and filter buttons
 * Styled to visually connect with the MainWelcomeSection and card design
 * Updated with subheader
 *
 * @param {Object} props Component props
 * @param {string} props.pathDescription The learning path description text
 * @param {string} props.activeFilter Current active filter value
 * @param {Function} props.setActiveFilter Function to update the filter
 * @param {Object} props.totalByLevel Count of resources by level
 * @param {Object} props.style Additional style properties to apply (optional)
 * @returns {JSX.Element} FilterSection component
 */
const FilterSection = ({
  pathDescription = 'To get started, select a learning path by skill level or choose All Levels to browse all available learning paths.',
  activeFilter = 'all',
  setActiveFilter,
  totalByLevel = {},
  style = {},
}) => {
  // Base styles for the section - connecting with MainWelcomeSection using brand guidelines
  const baseStyles = {
    background:
      'linear-gradient(to bottom, var(--brand-secondary-white) 0%, var(--brand-blue-100) 100%)',
    padding: '1.5rem 2.5rem 3rem 2.5rem',
    marginBottom: '2rem',
    position: 'relative',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid var(--brand-blue-400)',
    borderTop: 'none', // No top border to connect with welcome section
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Merge provided style overrides with base styles
  const mergedStyles = { ...baseStyles, ...style }

  // Handler for filter changes - ensures we're using the passed-in setter
  const handleFilterChange = newFilter => {
    if (typeof setActiveFilter === 'function') {
      setActiveFilter(newFilter)
    } else {
      console.warn('Missing setActiveFilter function in FilterSection')
    }
  }

  return (
    <section className='filter-section' style={mergedStyles}>
      {/* Subheader */}
      <h3
        style={{
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          fontWeight: 600,
          fontSize: '1.8rem',
          color: 'var(--brand-black)',
          margin: '0 0 0.75rem 0',
          textAlign: 'center',
        }}
      >
        Explore Learning Paths
      </h3>

      {/* Learning Path Description */}
      <p
        style={{
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          fontSize: '1.2rem',
          lineHeight: '1.7',
          color: 'var(--brand-black-700)',
          margin: '0 0 1.5rem 0',
          textAlign: 'center',
          maxWidth: '900px',
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
        }}
      >
        <LevelFilter
          activeFilter={activeFilter}
          setActiveFilter={handleFilterChange}
          totalByLevel={totalByLevel}
        />
      </div>
    </section>
  )
}

export default FilterSection
