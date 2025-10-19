// src/components/FilterControls/index.js - STATIC FLOW VERSION (NO OVERLAPPING)
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

  const handlePlanToggle = plan => {
    if (plan === 'trial') {
      const newPlans = filters.plans.includes(plan)
        ? filters.plans.filter(p => p !== plan)
        : [...filters.plans, plan]
      setFilters({ ...filters, plans: newPlans })
    }
  }

  const roleOptions = [
    { value: 'all', label: 'All', icon: '👥', available: true },
    { value: 'users', label: 'Users', icon: '👤', available: true },
    { value: 'admin', label: 'Admin', icon: '⚙️', available: true },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          fontFamily: 'var(--ifm-font-family-base)',
          fontSize: '13px',
          color: '#64748b',
          // CRITICAL: No positioning that could cause overlay
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
          // CRITICAL: No positioning that could cause overlay
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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        fontFamily: 'var(--ifm-font-family-base)',
        // CRITICAL: Static positioning to prevent overlay
        position: 'static',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        // Remove any transforms or z-index that could cause positioning issues
        transform: 'none',
        zIndex: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontWeight: '600',
            fontSize: '12px',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          Filter Content
        </div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: '500',
          }}
        >
          {resultCount !== null ? `${resultCount} results` : 'All content'}
        </div>
      </div>

      {/* Main Filter Section */}
      <div>
        <div
          onClick={() => setIsMainCollapsed(!isMainCollapsed)}
          style={{
            padding: '10px 12px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.target.style.background = '#f1f5f9'
          }}
          onMouseLeave={e => {
            e.target.style.background = '#f8fafc'
          }}
        >
          <span
            style={{
              fontWeight: '500',
              fontSize: '11px',
              color: '#1a1a1a',
              fontFamily: 'var(--ifm-font-family-base)',
            }}
          >
            User Type & Plans
          </span>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{
              transition: 'transform 0.2s ease',
              transform: isMainCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              flexShrink: 0,
            }}
          >
            <path d='M7 14l5-5 5 5z' />
          </svg>
        </div>

        {/* Collapsible Content */}
        <div
          style={{
            maxHeight: isMainCollapsed ? '0' : '300px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            padding: isMainCollapsed ? '0 12px' : '12px',
          }}
        >
          {/* Role Filter */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '500',
                color: '#475569',
                marginBottom: '6px',
                fontFamily: 'var(--ifm-font-family-base)',
              }}
            >
              User Type
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
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
                      filters.role === option.value ? '#0050c7' : '#f8fafc',
                    color: filters.role === option.value ? 'white' : '#64748b',
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

          {/* Plan Filter */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '500',
                color: '#475569',
                marginBottom: '6px',
                fontFamily: 'var(--ifm-font-family-base)',
              }}
            >
              Plans
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <button
                onClick={() => handlePlanToggle('trial')}
                style={{
                  padding: '6px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--ifm-font-family-base)',
                  color: filters.plans.includes('trial')
                    ? '#0050c7'
                    : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Trial</span>
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    background: filters.plans.includes('trial')
                      ? '#0050c7'
                      : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: filters.plans.includes('trial')
                      ? 'white'
                      : '#64748b',
                    fontSize: '10px',
                  }}
                >
                  {filters.plans.includes('trial') ? '✓' : ''}
                </div>
              </button>
            </div>
          </div>
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
