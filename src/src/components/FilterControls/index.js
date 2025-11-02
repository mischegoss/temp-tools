// src/components/FilterControls/index.js - SIMPLIFIED WITH USER/ADMIN TOGGLES
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  initializeGlobalFilterState,
  setFilterableData,
  updateFilters,
  countFilteredPages,
} from '../../utils/globalFilterState'

function EmbeddedFilterControlsComponent() {
  // Simplified state with boolean toggles
  const [filters, setFilters] = useState({
    users: true,
    admin: false,
    // TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available
    // plans: ['trial'],
  })
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

  const handleUserToggle = () => {
    setFilters({ ...filters, users: !filters.users })
  }

  const handleAdminToggle = () => {
    setFilters({ ...filters, admin: !filters.admin })
  }

  // TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available
  /*
  const handlePlanChange = event => {
    const plan = event.target.value
    if (plan && plan !== 'trial') {
      setFilters({ ...filters, plans: [plan] })
    } else {
      setFilters({ ...filters, plans: ['trial'] })
    }
  }

  const planOptions = [
    { value: 'trial', label: 'Trial (Default)', available: true, locked: true },
    {
      value: 'enterprise',
      label: 'Enterprise (Coming Soon)',
      available: false,
    },
    { value: 'premium', label: 'Premium (Coming Soon)', available: false },
  ]
  */

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
      {/* Filter Content */}
      <div style={{ padding: '16px' }}>
        {/* Section Title */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--brand-grey-600)',
            marginBottom: '12px',
            textAlign: 'center',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          Filter Results by User
        </div>

        {/* Users Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid var(--brand-grey-200)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--brand-grey-600)',
              fontFamily: 'var(--ifm-font-family-base)',
            }}
          >
            <span style={{ fontSize: '14px' }}>👤</span>
            <span>Users</span>
          </div>
          <div
            onClick={handleUserToggle}
            style={{
              position: 'relative',
              width: '40px',
              height: '20px',
              background: filters.users
                ? 'var(--brand-blue)'
                : 'var(--brand-grey-300)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: filters.users ? '22px' : '2px',
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        </div>

        {/* Admin Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--brand-grey-600)',
              fontFamily: 'var(--ifm-font-family-base)',
            }}
          >
            <span style={{ fontSize: '14px' }}>⚙️</span>
            <span>Admin</span>
          </div>
          <div
            onClick={handleAdminToggle}
            style={{
              position: 'relative',
              width: '40px',
              height: '20px',
              background: filters.admin
                ? 'var(--brand-blue)'
                : 'var(--brand-grey-300)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: filters.admin ? '22px' : '2px',
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        </div>

        {/* TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available */}
        {/*
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--brand-grey-600)',
              marginBottom: '8px',
              fontFamily: 'var(--ifm-font-family-base)',
            }}
          >
            Plans
          </div>
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
        */}
      </div>

      {/* Result Count */}
      <div
        style={{
          fontSize: '10px',
          color: 'var(--brand-black-700)',
          textAlign: 'center',
          padding: '8px',
          background: 'var(--brand-grey-100)',
          borderTop: '1px solid var(--brand-grey-200)',
          margin: '0 0 0 0',
          fontFamily: 'var(--ifm-font-family-base)',
        }}
      >
        {resultCount !== null
          ? `Showing ${resultCount} articles`
          : 'All content'}
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
