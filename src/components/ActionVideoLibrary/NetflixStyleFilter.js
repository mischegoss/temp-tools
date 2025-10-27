// @site/src/components/ActionVideoLibrary/NetflixStyleFilter.js

import React from 'react'

/**
 * NetflixStyleFilter component - Two independent dropdown filters for video gallery
 * Product filter (Platform, Pro, Express, Insights, Rita Go) and Level filter working independently
 */
const NetflixStyleFilter = ({
  activeProductFilter,
  setActiveProductFilter,
  activeLevelFilter,
  setActiveLevelFilter,
  totalByProduct,
  totalByLevel,
  resources,
}) => {
  // Calculate total count
  const totalCount = resources.length

  // Container style
  const filterContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '20px 0',
    borderBottom: '1px solid #e5e5e5',
    marginBottom: '30px',
    flexWrap: 'wrap',
  }

  // Filter group style
  const filterGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  // Label style
  const filterLabelStyle = {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#2d3748',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    whiteSpace: 'nowrap',
  }

  // Dropdown style
  const dropdownStyle = {
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '1rem',
    color: '#2d3748',
    minWidth: '200px',
    cursor: 'pointer',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
  }

  // Focus and hover styles
  const dropdownFocusStyle = {
    borderColor: '#4299e1',
    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
  }

  return (
    <div style={filterContainerStyle}>
      {/* Product Filter */}
      <div style={filterGroupStyle}>
        <span style={filterLabelStyle}>Browse by Product:</span>
        <select
          style={dropdownStyle}
          value={activeProductFilter}
          onChange={e => setActiveProductFilter(e.target.value)}
          onFocus={e => Object.assign(e.target.style, dropdownFocusStyle)}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        >
          <option value='all'>All Products ({totalCount})</option>
          <option value='rita-go'>
            Rita Go ({totalByProduct['rita-go'] || 0})
          </option>
          <option value='actions'>
            Platform ({totalByProduct.actions || 0})
          </option>
          <option value='pro'>Pro ({totalByProduct.pro || 0})</option>
          <option value='express'>
            Express ({totalByProduct.express || 0})
          </option>
          <option value='insights'>
            Insights ({totalByProduct.insights || 0})
          </option>
        </select>
      </div>

      {/* Level Filter */}
      <div style={filterGroupStyle}>
        <span style={filterLabelStyle}>Browse by Level:</span>
        <select
          style={dropdownStyle}
          value={activeLevelFilter}
          onChange={e => setActiveLevelFilter(e.target.value)}
          onFocus={e => Object.assign(e.target.style, dropdownFocusStyle)}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        >
          <option value='all'>All Levels</option>
          <option value='quick-start'>
            Quick Start ({totalByLevel['quick-start'] || 0})
          </option>
          <option value='step-by-step'>
            Step-by-Step Tutorials ({totalByLevel['step-by-step'] || 0})
          </option>
          <option value='deep-dive'>
            Deep Dives ({totalByLevel['deep-dive'] || 0})
          </option>
          <option value='webinar'>
            Webinars ({totalByLevel.webinar || 0})
          </option>
        </select>
      </div>
    </div>
  )
}

export default NetflixStyleFilter
