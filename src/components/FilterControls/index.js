// src/components/FilterControls/index.js - REVISED WITH SIDEBAR INTEGRATION
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useAvailabilityData } from '../../hooks/useAvailabilityData'

function EmbeddedFilterControlsComponent() {
  const [filters, setFilters] = useState({
    role: 'all',
    plans: ['trial'], // Default to trial selected
    showUnavailable: false,
  })

  const [isMainCollapsed, setIsMainCollapsed] = useState(false)
  const [realResultsCount, setRealResultsCount] = useState(0)

  // Load availability data from the manifest
  const { availabilityData, isLoading: dataLoading } = useAvailabilityData()

  // Initialize global state and badge integration
  useEffect(() => {
    if (!window.globalFilterState) {
      window.globalFilterState = {
        filters: {
          role: 'all',
          plans: ['trial'],
          showUnavailable: false,
        },
        setFilters: null,
        pagesBadgeData: new Map(),
        updatePageBadges: null,
        filterChangeCallbacks: new Set(),
        sidebarUpdateCallbacks: new Set(), // NEW: Sidebar update callbacks
        availabilityManifest: null, // NEW: Store manifest data
      }
    }

    // Set our functions to global state
    window.globalFilterState.setFilters = setFilters
    window.globalFilterState.filters = filters

    // Store availability manifest in global state
    if (availabilityData) {
      window.globalFilterState.availabilityManifest = availabilityData
    }

    // Notify all badge components of filter changes
    const notifyFilterChange = () => {
      window.globalFilterState.filterChangeCallbacks.forEach(callback => {
        try {
          callback()
        } catch (error) {
          console.error('Error in filter change callback:', error)
        }
      })
    }

    // NEW: Notify sidebar components of filter changes
    const notifySidebarUpdate = () => {
      window.globalFilterState.sidebarUpdateCallbacks.forEach(callback => {
        try {
          callback(filters)
        } catch (error) {
          console.error('Error in sidebar update callback:', error)
        }
      })
    }

    // Calculate real results count based on availability manifest
    const calculateRealResults = () => {
      try {
        if (!availabilityData) {
          return
        }

        const allPages = Object.entries(availabilityData)

        const filteredPages = allPages.filter(([url, pageData]) => {
          // Role filtering
          if (filters.role === 'users' && !pageData.users) return false
          if (filters.role === 'admin' && !pageData.admin) return false
          // 'all' role shows everything

          // Plan filtering (if any plans are selected, page must match at least one)
          if (filters.plans.length > 0) {
            const hasMatchingPlan = filters.plans.some(plan => pageData[plan])
            if (!hasMatchingPlan) return false
          }

          return true
        })

        setRealResultsCount(filteredPages.length)
      } catch (error) {
        console.error('Error calculating real results:', error)
      }
    }

    // Update results when filters change
    calculateRealResults()
    notifyFilterChange()
    notifySidebarUpdate() // NEW: Trigger sidebar updates

    return () => {
      if (window.globalFilterState) {
        window.globalFilterState.setFilters = null
      }
    }
  }, [filters, availabilityData])

  // Also update badge data fallback for compatibility
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.globalFilterState?.pagesBadgeData?.size > 0) {
        try {
          const allPages = Array.from(
            window.globalFilterState.pagesBadgeData.values(),
          )

          const filteredPages = allPages.filter(page => {
            if (filters.role === 'users' && !page.users) return false
            if (filters.role === 'admin' && !page.admin) return false

            if (filters.plans.length > 0) {
              const hasMatchingPlan = filters.plans.some(plan => page[plan])
              if (!hasMatchingPlan) return false
            }

            return true
          })

          // Only update if we don't have manifest data
          if (!availabilityData && filteredPages.length > 0) {
            setRealResultsCount(filteredPages.length)
          }
        } catch (error) {
          console.error('Error calculating results:', error)
        }
      }
    }, 1000) // Check every second for new badge data

    return () => clearInterval(interval)
  }, [filters, availabilityData])

  const handleRoleChange = role => {
    const newFilters = { ...filters, role }
    setFilters(newFilters)
  }

  const handlePlanToggle = plan => {
    // For now, only allow trial selection
    if (plan === 'trial') {
      const newFilters = {
        ...filters,
        plans: filters.plans.includes(plan) ? [] : ['trial'],
      }
      setFilters(newFilters)
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      role: 'all',
      plans: ['trial'], // Reset to trial default
      showUnavailable: false,
    }
    setFilters(clearedFilters)
  }

  const hasActiveFilters =
    filters.role !== 'all' ||
    filters.plans.length !== 1 ||
    !filters.plans.includes('trial')

  // Use real results count from availability manifest, fallback to badge data
  const getResultsCount = () => {
    try {
      // Prioritize availability manifest data
      if (availabilityData && Object.keys(availabilityData).length > 0) {
        return realResultsCount
      }

      // Fallback to badge data
      if (window.globalFilterState?.pagesBadgeData?.size > 0) {
        return realResultsCount
      }
    } catch (error) {
      console.error('Error getting results count:', error)
    }

    // Return null if no data is available yet
    return null
  }

  // Get available filter options based on availability manifest
  const getAvailableOptions = () => {
    try {
      if (!availabilityData || Object.keys(availabilityData).length === 0) {
        // Fallback to badge data
        if (
          !window.globalFilterState?.pagesBadgeData ||
          window.globalFilterState.pagesBadgeData.size === 0
        ) {
          return {
            hasUsers: true,
            hasAdmin: true,
            hasTrial: true,
            hasPremium: false,
            hasEnterprise: false,
          }
        }

        const allPages = Array.from(
          window.globalFilterState.pagesBadgeData.values(),
        )

        return {
          hasUsers: allPages.some(page => page.users),
          hasAdmin: allPages.some(page => page.admin),
          hasTrial: allPages.some(page => page.trial),
          hasPremium: allPages.some(page => page.premium),
          hasEnterprise: allPages.some(page => page.enterprise),
        }
      }

      // Use availability manifest
      const allPages = Object.values(availabilityData)

      return {
        hasUsers: allPages.some(page => page.users),
        hasAdmin: allPages.some(page => page.admin),
        hasTrial: allPages.some(page => page.trial),
        hasPremium: allPages.some(page => page.premium),
        hasEnterprise: allPages.some(page => page.enterprise),
      }
    } catch (error) {
      console.error('Error getting available options:', error)
      return {
        hasUsers: true,
        hasAdmin: true,
        hasTrial: true,
        hasPremium: false,
        hasEnterprise: false,
      }
    }
  }

  const availableOptions = getAvailableOptions()

  // Role options
  const roleOptions = [
    {
      value: 'users',
      label: 'Users',
      icon: '👤',
      available: availableOptions.hasUsers,
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: '🔒',
      available: availableOptions.hasAdmin,
    },
    { value: 'all', label: 'All', icon: '🌐', available: true },
  ]

  return (
    <div
      style={{
        width: '100%',
        fontFamily: 'var(--ifm-font-family-base)',
      }}
    >
      {/* Collapsible Widget Container */}
      <div
        style={{
          backgroundColor: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Header with brand gradient */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0050c7 0%, #0066ff 100%)',
            color: 'white',
            padding: '12px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--ifm-font-family-base)',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setIsMainCollapsed(!isMainCollapsed)}
          onMouseEnter={e => {
            e.target.style.background =
              'linear-gradient(135deg, #004bb3 0%, #005ce6 100%)'
          }}
          onMouseLeave={e => {
            e.target.style.background =
              'linear-gradient(135deg, #0050c7 0%, #0066ff 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width='10'
                height='10'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M4.22 11.29l-2.12-2.12c-.78-.78-.78-2.05 0-2.83L4.22 4.22c.78-.78 2.05-.78 2.83 0L9.17 6.34c.78.78.78 2.05 0 2.83L7.05 11.29c-.78.78-2.05.78-2.83 0zM15.78 11.29l-2.12-2.12c-.78-.78-.78-2.05 0-2.83l2.12-2.12c.78-.78 2.05-.78 2.83 0l2.12 2.12c.78.78.78 2.05 0 2.83l-2.12 2.12c-.78.78-2.05.78-2.83 0zM4.22 22.71l-2.12-2.12c-.78-.78-.78-2.05 0-2.83l2.12-2.12c.78-.78 2.05-.78 2.83 0l2.12 2.12c.78.78.78 2.05 0 2.83l-2.12 2.12c-.78.78-2.05.78-2.83 0zM15.78 22.71l-2.12-2.12c-.78-.78-.78-2.05 0-2.83l2.12-2.12c.78-.78 2.05-.78 2.83 0l2.12 2.12c.78.78.78 2.05 0 2.83l-2.12 2.12c-.78.78-2.05.78-2.83 0z' />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                Filter Articles
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9, margin: 0 }}>
                by User & Version
              </div>
            </div>
          </div>
          <svg
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 24 24'
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
                    value={filters.plans.includes('trial') ? 'trial' : ''}
                    onChange={e => handlePlanToggle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--ifm-font-family-base)',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 8px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '14px',
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
                </div>
              </div>

              {/* Results Counter or Loading State */}
              {dataLoading ? (
                <div
                  style={{
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '13px',
                    color: '#9ca3af',
                    textAlign: 'center',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: '500',
                    marginBottom: hasActiveFilters ? '12px' : '0',
                  }}
                >
                  Loading articles...
                </div>
              ) : getResultsCount() !== null ? (
                <div
                  style={{
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '13px',
                    color: '#1a1a1a',
                    textAlign: 'center',
                    fontFamily: 'var(--ifm-font-family-base)',
                    fontWeight: '500',
                    marginBottom: hasActiveFilters ? '12px' : '0',
                  }}
                >
                  <span style={{ fontWeight: '700', color: '#0050c7' }}>
                    {getResultsCount()}
                  </span>{' '}
                  articles found
                </div>
              ) : null}

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--ifm-font-family-base)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: getResultsCount() === null ? '0' : '0',
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = '#cbd5e1'
                    e.target.style.backgroundColor = '#f8fafc'
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.backgroundColor = 'white'
                  }}
                >
                  Clear Filters
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EmbeddedFilterControls() {
  return <BrowserOnly>{() => <EmbeddedFilterControlsComponent />}</BrowserOnly>
}
