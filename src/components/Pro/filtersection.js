import React from 'react'
import LevelFilter from './levelfilter'
import {
  filterSectionStyle,
  containerStyle,
  filterTitleStyle,
  filterDescriptionStyle,
  filterButtonsContainerStyle,
} from './styles/prostyles.js'

/**
 * FilterSection component - Contains the filter description and filter buttons
 * Styled to match the LearningHub design system
 *
 * @param {Object} props Component props
 * @param {string} props.title Section title
 * @param {string} props.pathDescription The learning path description text
 * @param {string} props.activeFilter Current active filter value
 * @param {Function} props.setActiveFilter Function to update the filter
 * @param {Object} props.totalByLevel Count of resources by level
 * @param {Array} props.resources Array of all resources for total count
 * @returns {JSX.Element} FilterSection component
 */
const FilterSection = ({
  title = 'Explore Learning Paths',
  pathDescription = 'Select a learning path by skill level or choose All Levels to browse all available learning paths.',
  activeFilter = 'all',
  setActiveFilter,
  totalByLevel = {},
  resources = [],
}) => {
  return (
    <section style={filterSectionStyle} className='filter-section'>
      <div style={containerStyle}>
        <h2 style={filterTitleStyle}>{title}</h2>
        <p style={filterDescriptionStyle}>{pathDescription}</p>

        {/* Filter Buttons */}
        <div style={filterButtonsContainerStyle}>
          <LevelFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            totalByLevel={totalByLevel}
            totalResources={resources.length}
          />
        </div>
      </div>
    </section>
  )
}

export default FilterSection
