import React from 'react'
import LevelFilter from './levelfilter.js'
import {
  filterTitleStyle,
  filterDescriptionStyle,
  filterButtonsContainerStyle,
} from './sharedStyles.js'

/**
 * FilterSection component - Pure content component for filter title, description, and buttons
 * No section-level styling - parent component handles containers and backgrounds
 *
 * @param {Object} props Component props
 * @param {string} props.title Section title (optional)
 * @param {string} props.pathDescription The learning path description text (optional)
 * @param {string} props.activeFilter Current active filter value
 * @param {Function} props.setActiveFilter Function to update the filter
 * @param {Object} props.totalByLevel Count of resources by level
 * @param {Array} props.resources Array of all resources for total count
 * @returns {JSX.Element} FilterSection content
 */
const FilterSection = ({
  title = '',
  pathDescription = '',
  activeFilter = 'all',
  setActiveFilter,
  totalByLevel = {},
  resources = [],
}) => {
  return (
    <>
      {/* Conditional Title */}
      {title && <h2 style={filterTitleStyle}>{title}</h2>}

      {/* Conditional Description */}
      {pathDescription && (
        <p style={filterDescriptionStyle}>{pathDescription}</p>
      )}

      {/* Filter Buttons */}
      <div
        style={{
          ...filterButtonsContainerStyle,
          marginTop: '32px', // Add more space above the buttons
        }}
      >
        <LevelFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          totalByLevel={totalByLevel}
          totalResources={resources.length}
        />
      </div>
    </>
  )
}

export default FilterSection
