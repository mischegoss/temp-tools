// src/components/FilterControls/index.js - REVISED WITH INDEPENDENT COLLAPSIBLE SECTIONS
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  initializeGlobalFilterState,
  setFilterableData,
  updateFilters,
  countFilteredPages,
} from '../../utils/globalFilterState'

function EmbeddedFilterControlsComponent() {
  const [filters, setFilters] = useState({
    role: 'all',
    plans: ['trial'],
  })
  const [isMainCollapsed, setIsMainCollapsed] = useState(false)
  const [isUserTypesCollapsed, setIsUserTypesCollapsed] = useState(false)
  const [isPlansCollapsed, setIsPlansCollapsed] = useState(false)
  const [resultCount, setResultCount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Initialize and load filterable data
  useEffect(() => {
    const loadFilterableData = async () => {
      try {
        setIsLoading(true)

        // Initialize the global state
        initializeGlobalFilterState()

        // Fetch filterable data from static folder
        const response = await fetch('/data/filterableData.json')

        if (!response.ok) {
          throw new Error(`Failed to load filterable data: ${response.status}`)
        }

        const filterableData = await response.json()

        // Set the filterable data in global state
        setFilterableData(filterableData)

        // Update result count
        updateResultCount()

        console.log(
          '✅ Filterable data loaded successfully:',
          filterableData.length,
          'items',
        )
        console.log(
          '📊 Items with filtering:',
          filterableData.filter(item => item.hasFiltering).length,
        )
      } catch (error) {
        console.error('❌ Failed to load filterable data:', error)
        setLoadError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadFilterableData()
  }, [])

  // Update when filters change
  useEffect(() => {
    if (!isLoading && !loadError) {
      updateFilters(filters)
      updateResultCount()
    }
  }, [filters, isLoading, loadError])

  const updateResultCount = () => {
    const count = countFilteredPages(filters)
    setResultCount(count)
  }

  const handleRoleChange = role => {
    setFilters({ ...filters, role })
  }

  const handlePlanChange = event => {
    const plan = event.target.value
    // TODO: Remove this restriction when additional plans become available
    // Currently Trial is locked as always-on to prevent user confusion
    if (plan && plan !== 'trial') {
      setFilters({ ...filters, plans: [plan] })
    } else {
      // Prevent deselection of trial - always keep it selected
      setFilters({ ...filters, plans: ['trial'] })
    }
  }

  const handleResetFilters = () => {
    setFilters({
      role: 'all',
      plans: ['trial'],
    })
  }

  const roleOptions = [
    { value: 'all', label: 'All', icon: '👥', available: true },
    { value: 'users', label: 'Users', icon: '👤', available: true },
    { value: 'admin', label: 'Admin', icon: '⚙️', available: true },
  ]

  const planOptions = [
    // TODO: When additional plans become available, remove the 'locked' property
    // and allow users to toggle Trial on/off independently
    { value: 'trial', label: 'Trial (Default)', available: true, locked: true },
    {
      value: 'enterprise',
      label: 'Enterprise (Coming Soon)',
      available: false,
    },
    { value: 'premium', label: 'Premium (Coming Soon)', available: false },
  ]

  // Helper function to build dynamic header text
  const getHeaderText = () => {
    const isDefaultState =
      filters.role === 'all' &&
      filters.plans.length === 1 &&
      filters.plans[0] === 'trial'

    if (isDefaultState) {
      return 'Filter Content'
    }

    const activeFilters = []

    if (filters.role !== 'all') {
      const roleOption = roleOptions.find(
        option => option.value === filters.role,
      )
      if (roleOption) {
        activeFilters.push(roleOption.label)
      }
    }

    if (
      filters.plans.length > 0 &&
      !(filters.plans.length === 1 && filters.plans[0] === 'trial')
    ) {
      const planOption = planOptions.find(
        option => option.value === filters.plans[0],
      )
      if (planOption) {
        activeFilters.push(planOption.label.replace(' (Default)', ''))
      }
    }

    return activeFilters.length > 0
      ? `Filter Content (${activeFilters.join(' & ')})`
      : 'Filter Content'
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        style={{
          background: 'var(--brand-grey-100)',
          border: '1px solid var(--brand-grey-200)',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          fontFamily: 'var(--ifm-font-family-base)',
          fontSize: '13px',
          color: 'var(--brand-grey-600)',
          position: 'static',
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        Loading filters...
      </div>
    )
  }

  // Show error state
  if (loadError) {
    return (
      <div
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          fontFamily: 'var(--ifm-font-family-base)',
          fontSize: '13px',
          color: '#dc2626',
          position: 'static',
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
          Filter Error
        </div>
        <div style={{ fontSize: '11px' }}>{loadError}</div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--brand-white)',
        border: '1px solid var(--brand-grey-200)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        fontFamily: 'var(--ifm-font-family-base)',
        position: 'static',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Main Filter Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--brand-grey-100)',
          borderBottom: '1px solid var(--brand-grey-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '13px',
          color: 'var(--brand-grey-600)',
        }}
        onClick={() => setIsMainCollapsed(!isMainCollapsed)}
      >
        <span>{getHeaderText()}</span>
        <svg
          style={{
            width: '14px',
            height: '14px',
            transition: 'transform 0.2s ease',
            transform: isMainCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            flexShrink: 0,
            fill: 'currentColor',
          }}
          viewBox='0 0 20 20'
        >
          <path d='M7 14l5-5 5 5z' />
        </svg>
      </div>

      {/* Main Collapsible Content */}
      <div
        style={{
          maxHeight: isMainCollapsed ? '0' : '400px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          padding: isMainCollapsed ? '0 16px' : '16px',
        }}
      >
        {/* User Types Section */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: '1px solid var(--brand-grey-200)',
              marginBottom: '8px',
            }}
            onClick={() => setIsUserTypesCollapsed(!isUserTypesCollapsed)}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--brand-grey-600)',
                fontFamily: 'var(--ifm-font-family-base)',
              }}
            >
              User Types
            </span>
            <svg
              style={{
                width: '12px',
                height: '12px',
                transition: 'transform 0.2s ease',
                transform: isUserTypesCollapsed
                  ? 'rotate(-90deg)'
                  : 'rotate(0deg)',
                color: 'var(--brand-grey-500)',
                fill: 'currentColor',
              }}
              viewBox='0 0 20 20'
            >
              <path d='M7 14l5-5 5 5z' />
            </svg>
          </div>

          <div
            style={{
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
              maxHeight: isUserTypesCollapsed ? '0' : '200px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingTop: '4px',
              }}
            >
              {roleOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleRoleChange(option.value)}
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    background:
                      filters.role === option.value
                        ? 'var(--brand-blue)'
                        : 'var(--brand-grey-100)',
                    color:
                      filters.role === option.value
                        ? 'var(--brand-white)'
                        : 'var(--brand-grey-600)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--ifm-font-family-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                  {filters.role === option.value && (
                    <span style={{ fontSize: '10px' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: '1px solid var(--brand-grey-200)',
              marginBottom: '8px',
            }}
            onClick={() => setIsPlansCollapsed(!isPlansCollapsed)}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--brand-grey-600)',
                fontFamily: 'var(--ifm-font-family-base)',
              }}
            >
              Plans
            </span>
            <svg
              style={{
                width: '12px',
                height: '12px',
                transition: 'transform 0.2s ease',
                transform: isPlansCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                color: 'var(--brand-grey-500)',
                fill: 'currentColor',
              }}
              viewBox='0 0 20 20'
            >
              <path d='M7 14l5-5 5 5z' />
            </svg>
          </div>

          <div
            style={{
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
              maxHeight: isPlansCollapsed ? '0' : '200px',
            }}
          >
            <div style={{ paddingTop: '4px' }}>
              <select
                value={filters.plans[0] || 'trial'}
                onChange={handlePlanChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--brand-grey-200)',
                  borderRadius: '4px',
                  background: 'var(--brand-white)',
                  fontSize: '11px',
                  color: 'var(--brand-grey-600)',
                  cursor: 'pointer',
                  fontFamily: 'var(--ifm-font-family-base)',
                  outline: 'none',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--brand-blue)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 80, 199, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--brand-grey-200)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {planOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={!option.available}
                    style={{
                      color: option.available
                        ? 'var(--brand-grey-600)'
                        : 'var(--brand-grey-400)',
                      fontSize: '11px',
                      fontWeight: option.locked ? '600' : 'normal',
                    }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetFilters}
          style={{
            width: '100%',
            padding: '8px',
            background: '#cc7a00',
            color: 'var(--brand-white)',
            border: 'none',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            fontFamily: 'var(--ifm-font-family-base)',
            marginTop: '8px',
          }}
          onMouseEnter={e => {
            e.target.style.background = '#b36b00'
          }}
          onMouseLeave={e => {
            e.target.style.background = '#cc7a00'
          }}
        >
          Reset All Filters
        </button>

        {/* Result Count */}
        <div
          style={{
            fontSize: '10px',
            color: 'var(--brand-black-700)',
            textAlign: 'center',
            padding: '8px',
            background: 'var(--brand-grey-100)',
            borderTop: '1px solid var(--brand-grey-200)',
            margin: '16px -16px -16px -16px',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          {resultCount !== null
            ? `Showing ${resultCount} articles`
            : 'All content'}
        </div>
      </div>
    </div>
  )
}

export default function EmbeddedFilterControls() {
  return (
    <BrowserOnly fallback={<div>Loading filters...</div>}>
      {() => <EmbeddedFilterControlsComponent />}
    </BrowserOnly>
  )
}
