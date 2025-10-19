// src/components/FilterControls/index.js - FIXED VERSION
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  initializeGlobalFilterState,
  updateFilters,
  getPageBadgeData,
} from '../../utils/globalFilterState'

function EmbeddedFilterControlsComponent() {
  const [filters, setFilters] = useState({
    role: 'all',
    plans: ['trial'],
    showUnavailable: false,
  })

  const [isMainCollapsed, setIsMainCollapsed] = useState(false)
  const [realResultsCount, setRealResultsCount] = useState(null)

  // Initialize global state
  useEffect(() => {
    const state = initializeGlobalFilterState()
    if (state) {
      state.setFilters = setFilters
      state.filters = filters
    }
  }, [])

  // Update global state and apply filtering when filters change
  useEffect(() => {
    // For initial mount, don't mark as user interaction
    updateFilters(filters, false)
    calculateResults()
  }, [])

  // For subsequent filter changes (user interactions)
  useEffect(() => {
    // Skip the initial render
    if (
      filters.role === 'all' &&
      filters.plans.length === 1 &&
      filters.plans[0] === 'trial' &&
      !filters.showUnavailable
    ) {
      return // This is the initial state, don't mark as user interaction
    }

    // This is a real user interaction
    updateFilters(filters, true)
    calculateResults()
  }, [filters])

  // Calculate results based on badge data
  const calculateResults = () => {
    try {
      const badgeData = getPageBadgeData()

      if (badgeData.size === 0) {
        setRealResultsCount(null)
        return
      }

      // Check if any meaningful filters are active
      const hasActiveFilters =
        (filters.role && filters.role !== 'all') ||
        (filters.plans &&
          filters.plans.length > 0 &&
          !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

      if (!hasActiveFilters) {
        setRealResultsCount(null) // Show "All content"
        return
      }

      // Count filtered pages
      const allPages = Array.from(badgeData.values())
      const filteredPages = allPages.filter(page => {
        // Role filtering
        if (filters.role === 'users' && !page.users) return false
        if (filters.role === 'admin' && !page.admin) return false

        // Plan filtering
        if (filters.plans.length > 0) {
          const hasMatchingPlan = filters.plans.some(plan => page[plan])
          if (!hasMatchingPlan) return false
        }

        return true
      })

      setRealResultsCount(filteredPages.length)
    } catch (error) {
      console.error('Error calculating results:', error)
      setRealResultsCount(0)
    }
  }

  // Update results when badge data changes
  useEffect(() => {
    const interval = setInterval(calculateResults, 2000)
    return () => clearInterval(interval)
  }, [filters])

  const handleRoleChange = role => {
    const newFilters = { ...filters, role }
    setFilters(newFilters)
  }

  const handlePlanToggle = plan => {
    if (plan === 'trial') {
      const newFilters = {
        ...filters,
        plans: filters.plans.includes(plan)
          ? filters.plans.filter(p => p !== plan)
          : [...filters.plans, plan],
      }
      setFilters(newFilters)
    }
  }

  const handleToggleMainSection = () => {
    setIsMainCollapsed(!isMainCollapsed)
  }

  const roleOptions = [
    {
      value: 'all',
      label: 'All',
      icon: '👥',
      available: true,
    },
    {
      value: 'users',
      label: 'Users',
      icon: '👤',
      available: true,
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: '⚙️',
      available: true,
    },
  ]

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow:
          '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
        fontFamily: 'var(--ifm-font-family-base)',
        maxWidth: '280px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontWeight: '600',
            fontSize: '14px',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          Filter Content
        </div>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          {realResultsCount !== null
            ? `${realResultsCount} results`
            : 'All content'}
        </div>
      </div>

      {/* Main Filter Section */}
      <div>
        <div
          onClick={handleToggleMainSection}
          style={{
            padding: '12px 16px',
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
              fontSize: '13px',
              color: '#1a1a1a',
              fontFamily: 'var(--ifm-font-family-base)',
            }}
          >
            User Type & Plans
          </span>
          <svg
            width='16'
            height='16'
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
            maxHeight: isMainCollapsed ? '0' : '400px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            padding: isMainCollapsed ? '0 16px' : '16px',
          }}
        >
          {!isMainCollapsed && (
            <>
              {/* User Role Section */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--ifm-font-family-base)',
                  }}
                >
                  User Role
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '6px',
                  }}
                >
                  {roleOptions.map(role => (
                    <button
                      key={role.value}
                      onClick={() =>
                        role.available && handleRoleChange(role.value)
                      }
                      style={{
                        padding: '12px 8px',
                        background: 'white',
                        border: `2px solid ${
                          filters.role === role.value ? '#0050c7' : '#e2e8f0'
                        }`,
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: role.available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        fontFamily: 'var(--ifm-font-family-base)',
                        backgroundColor:
                          filters.role === role.value ? '#cbe0ff' : 'white',
                        boxShadow:
                          filters.role === role.value
                            ? '0 0 0 1px #0050c7, 0 1px 4px rgba(0, 80, 199, 0.15)'
                            : 'none',
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={e => {
                        if (role.available && filters.role !== role.value) {
                          e.target.style.borderColor = '#cbd5e1'
                          e.target.style.backgroundColor = '#f8fafc'
                          e.target.style.boxShadow =
                            '0 1px 4px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (role.available && filters.role !== role.value) {
                          e.target.style.borderColor = '#e2e8f0'
                          e.target.style.backgroundColor = 'white'
                          e.target.style.boxShadow = 'none'
                        }
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          background:
                            filters.role === role.value ? '#0050c7' : '#f1f5f9',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          transition: 'all 0.2s ease',
                          color:
                            filters.role === role.value ? 'white' : 'inherit',
                          marginBottom: '4px',
                        }}
                      >
                        {role.icon}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color:
                            filters.role === role.value ? '#0050c7' : '#1a1a1a',
                          transition: 'all 0.2s ease',
                          fontFamily: 'var(--ifm-font-family-base)',
                        }}
                      >
                        {role.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscription Level Section */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--ifm-font-family-base)',
                  }}
                >
                  Subscription Level
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    value={filters.plans.includes('trial') ? 'trial' : 'none'}
                    onChange={e => handlePlanToggle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: 'white',
                      fontSize: '13px',
                      fontFamily: 'var(--ifm-font-family-base)',
                      appearance: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <option value='trial'>Trial</option>
                    <option value='premium' disabled>
                      Premium (Coming Soon)
                    </option>
                    <option value='enterprise' disabled>
                      Enterprise (Coming Soon)
                    </option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#64748b',
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M6 9l6 6 6-6' />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EmbeddedFilterControls() {
  return (
    <BrowserOnly fallback={<div style={{ display: 'none' }} />}>
      {() => <EmbeddedFilterControlsComponent />}
    </BrowserOnly>
  )
}
