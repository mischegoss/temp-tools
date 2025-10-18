// src/components/EmbeddedFilterControls/index.js - UPDATED WITH BADGE INTEGRATION
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

function EmbeddedFilterControlsComponent() {
  const [filters, setFilters] = useState({
    role: 'all',
    plans: [],
    showUnavailable: false,
  })

  const [isMainCollapsed, setIsMainCollapsed] = useState(false)
  const [isRoleCollapsed, setIsRoleCollapsed] = useState(true)
  const [isPlansCollapsed, setIsPlansCollapsed] = useState(true)
  const [realResultsCount, setRealResultsCount] = useState(0)

  // Initialize global state and badge integration
  useEffect(() => {
    if (!window.globalFilterState) {
      window.globalFilterState = {
        filters: {
          role: 'all',
          plans: [],
          showUnavailable: false,
        },
        setFilters: null,
        pagesBadgeData: new Map(),
        updatePageBadges: null,
        filterChangeCallbacks: new Set(),
      }
    }

    // Set our functions to global state
    window.globalFilterState.setFilters = setFilters
    window.globalFilterState.filters = filters

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

    // Calculate real results count based on badge data
    const calculateRealResults = () => {
      try {
        if (!window.globalFilterState?.pagesBadgeData) {
          return
        }

        const allPages = Array.from(
          window.globalFilterState.pagesBadgeData.values(),
        )

        const filteredPages = allPages.filter(page => {
          // Role filtering
          if (filters.role === 'users' && !page.users) return false
          if (filters.role === 'admin' && !page.admin) return false
          // 'all' role shows everything

          // Plan filtering (if any plans are selected, page must match at least one)
          if (filters.plans.length > 0) {
            const hasMatchingPlan = filters.plans.some(plan => page[plan])
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

    return () => {
      if (window.globalFilterState) {
        window.globalFilterState.setFilters = null
      }
    }
  }, [filters])

  // Recalculate results when badge data changes
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

          setRealResultsCount(filteredPages.length)
        } catch (error) {
          console.error('Error calculating results:', error)
        }
      }
    }, 1000) // Check every second for new badge data

    return () => clearInterval(interval)
  }, [filters])

  const handleRoleChange = role => {
    const newFilters = { ...filters, role }
    setFilters(newFilters)
  }

  const handlePlanToggle = plan => {
    const newFilters = {
      ...filters,
      plans: filters.plans.includes(plan)
        ? filters.plans.filter(p => p !== plan)
        : [...filters.plans, plan],
    }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      role: 'all',
      plans: [],
      showUnavailable: false,
    }
    setFilters(clearedFilters)
  }

  const hasActiveFilters = filters.role !== 'all' || filters.plans.length > 0

  // Use real results count from badge data, fallback to estimated count
  const getResultsCount = () => {
    try {
      if (window.globalFilterState?.pagesBadgeData?.size > 0) {
        return realResultsCount
      }
    } catch (error) {
      console.error('Error getting results count:', error)
    }

    // Fallback estimation if no badge data yet
    let base = 45
    if (filters.role === 'admin') base = Math.floor(base * 0.6)
    if (filters.role === 'users') base = Math.floor(base * 0.8)
    if (filters.plans.length > 0) base = Math.floor(base * 0.7)
    return Math.max(base, 8)
  }

  // Get available filter options based on actual badge data
  const getAvailableOptions = () => {
    try {
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

  return (
    <div
      style={{
        width: '100%',
        fontFamily: 'var(--ifm-font-family-base)',
      }}
    >
      {/* Widget Container */}
      <div
        style={{
          backgroundColor: 'white',
          border: '2px solid #e9ecef',
          borderRadius: '10px',
          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Header with gradient background */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0066FF 0%, #4285f4 100%)',
            color: 'white',
            padding: '10px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={() => setIsMainCollapsed(!isMainCollapsed)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '3px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'></polygon>
              </svg>
            </div>
            <span
              style={{
                fontWeight: '600',
                fontSize: '13px',
                letterSpacing: '0.3px',
              }}
            >
              CUSTOMIZE VIEW
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasActiveFilters && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <span>{getResultsCount()}</span>
              </div>
            )}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '3px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width='10'
                height='10'
                viewBox='0 0 24 24'
                fill='none'
                stroke='white'
                strokeWidth='2'
                style={{
                  transform: isMainCollapsed
                    ? 'rotate(0deg)'
                    : 'rotate(180deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <polyline points='6 9 12 15 18 9'></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        {!isMainCollapsed && (
          <div
            style={{
              maxHeight: '350px',
              overflowY: 'auto',
              backgroundColor: '#fafbfc',
            }}
          >
            <div
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Role Filter Section */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  overflow: 'hidden',
                }}
              >
                {/* Role Header */}
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    borderBottom: isRoleCollapsed
                      ? 'none'
                      : '1px solid #e9ecef',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => setIsRoleCollapsed(!isRoleCollapsed)}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#495057',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    <span style={{ fontSize: '11px' }}>👤</span>
                    <span>User Role</span>
                    {filters.role !== 'all' && (
                      <span
                        style={{
                          backgroundColor: '#0066FF',
                          color: 'white',
                          fontSize: '9px',
                          fontWeight: '700',
                          padding: '2px 5px',
                          borderRadius: '6px',
                        }}
                      >
                        {filters.role === 'users'
                          ? 'Users'
                          : filters.role === 'admin'
                          ? 'Admin'
                          : 'All'}
                      </span>
                    )}
                  </div>
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#6c757d'
                    strokeWidth='2'
                    style={{
                      transform: isRoleCollapsed
                        ? 'rotate(0deg)'
                        : 'rotate(180deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points='6 9 12 15 18 9'></polyline>
                  </svg>
                </div>

                {/* Role Content */}
                {!isRoleCollapsed && (
                  <div style={{ padding: '12px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '6px',
                      }}
                    >
                      {[
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
                        {
                          value: 'all',
                          label: 'All',
                          icon: '🌐',
                          available: true,
                        },
                      ].map(role => (
                        <button
                          key={role.value}
                          onClick={() => handleRoleChange(role.value)}
                          disabled={!role.available}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 6px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '600',
                            border: '2px solid',
                            borderColor:
                              filters.role === role.value
                                ? '#0066FF'
                                : '#e9ecef',
                            backgroundColor:
                              filters.role === role.value
                                ? '#e7f3ff'
                                : role.available
                                ? 'white'
                                : '#f8f9fa',
                            color:
                              filters.role === role.value
                                ? '#0066FF'
                                : role.available
                                ? '#6c757d'
                                : '#adb5bd',
                            cursor: role.available ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            boxShadow:
                              filters.role === role.value
                                ? '0 1px 4px rgba(0, 102, 255, 0.15)'
                                : 'none',
                            opacity: role.available ? 1 : 0.6,
                          }}
                        >
                          <div
                            style={{
                              backgroundColor:
                                filters.role === role.value
                                  ? '#0066FF'
                                  : '#f8f9fa',
                              color:
                                filters.role === role.value
                                  ? 'white'
                                  : '#6c757d',
                              padding: '4px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {role.icon}
                          </div>
                          <span>{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Plans Filter Section */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  overflow: 'hidden',
                }}
              >
                {/* Plans Header */}
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#f8f9fa',
                    borderBottom: isPlansCollapsed
                      ? 'none'
                      : '1px solid #e9ecef',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => setIsPlansCollapsed(!isPlansCollapsed)}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#495057',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    <svg
                      width='10'
                      height='10'
                      viewBox='0 0 24 24'
                      fill='#0066FF'
                      stroke='none'
                    >
                      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                    </svg>
                    <span>Subscription Level</span>
                    {filters.plans.length > 0 && (
                      <span
                        style={{
                          backgroundColor: '#0066FF',
                          color: 'white',
                          fontSize: '9px',
                          fontWeight: '700',
                          padding: '2px 5px',
                          borderRadius: '6px',
                        }}
                      >
                        {filters.plans.join(', ')}
                      </span>
                    )}
                  </div>
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#6c757d'
                    strokeWidth='2'
                    style={{
                      transform: isPlansCollapsed
                        ? 'rotate(0deg)'
                        : 'rotate(180deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points='6 9 12 15 18 9'></polyline>
                  </svg>
                </div>

                {/* Plans Content */}
                {!isPlansCollapsed && (
                  <div style={{ padding: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {[
                        {
                          value: 'trial',
                          label: 'Trial',
                          icon: '🚀',
                          color: '#0066FF',
                          available: availableOptions.hasTrial,
                        },
                        {
                          value: 'premium',
                          label: 'Premium (Coming Soon)',
                          icon: '⭐',
                          color: '#8b5cf6',
                          available: availableOptions.hasPremium,
                        },
                        {
                          value: 'enterprise',
                          label: 'Enterprise (Coming Soon)',
                          icon: '🏢',
                          color: '#3b82f6',
                          available: availableOptions.hasEnterprise,
                        },
                      ].map(plan => (
                        <button
                          key={plan.value}
                          onClick={() =>
                            plan.available && handlePlanToggle(plan.value)
                          }
                          disabled={!plan.available}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            border: '2px solid',
                            borderColor:
                              plan.available &&
                              filters.plans.includes(plan.value)
                                ? plan.color
                                : '#e9ecef',
                            backgroundColor:
                              plan.available &&
                              filters.plans.includes(plan.value)
                                ? '#e7f3ff'
                                : plan.available
                                ? 'white'
                                : '#f8f9fa',
                            color: plan.available
                              ? filters.plans.includes(plan.value)
                                ? plan.color
                                : '#495057'
                              : '#adb5bd',
                            cursor: plan.available ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            opacity: plan.available ? 1 : 0.6,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <div
                              style={{
                                backgroundColor:
                                  plan.available &&
                                  filters.plans.includes(plan.value)
                                    ? plan.color
                                    : plan.available
                                    ? '#f8f9fa'
                                    : '#e9ecef',
                                color:
                                  plan.available &&
                                  filters.plans.includes(plan.value)
                                    ? 'white'
                                    : '#6c757d',
                                padding: '4px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                opacity: plan.available ? 1 : 0.5,
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {plan.icon}
                            </div>
                            <span>{plan.label}</span>
                          </div>
                          <div
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '3px',
                              border: '2px solid',
                              borderColor:
                                plan.available &&
                                filters.plans.includes(plan.value)
                                  ? plan.color
                                  : '#dee2e6',
                              backgroundColor:
                                plan.available &&
                                filters.plans.includes(plan.value)
                                  ? plan.color
                                  : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: plan.available ? 1 : 0.5,
                            }}
                          >
                            {plan.available &&
                              filters.plans.includes(plan.value) && (
                                <svg
                                  width='8'
                                  height='8'
                                  viewBox='0 0 24 24'
                                  fill='white'
                                  stroke='none'
                                >
                                  <polyline
                                    points='20 6 9 17 4 12'
                                    strokeWidth='3'
                                    stroke='white'
                                    fill='none'
                                  />
                                </svg>
                              )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Summary - Compact */}
              {hasActiveFilters && (
                <div
                  style={{
                    padding: '10px 12px',
                    background:
                      'linear-gradient(135deg, #e7f3ff 0%, #f0f8ff 100%)',
                    borderRadius: '6px',
                    border: '1px solid #b3d9ff',
                    fontSize: '11px',
                    color: '#0066FF',
                    textAlign: 'center',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#0066FF',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '700',
                    }}
                  >
                    {getResultsCount()}
                  </div>
                  <span>results found</span>
                </div>
              )}
            </div>

            {/* Sticky Clear Button */}
            {hasActiveFilters && (
              <div
                style={{
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: '#fafbfc',
                  borderTop: '1px solid #e9ecef',
                  padding: '10px 14px',
                }}
              >
                <button
                  onClick={clearFilters}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#dc3545',
                    backgroundColor: 'white',
                    border: '2px solid #dc3545',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = '#dc3545'
                    e.target.style.color = 'white'
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.color = '#dc3545'
                  }}
                >
                  🗑️ Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

export default function EmbeddedFilterControls() {
  return <BrowserOnly>{() => <EmbeddedFilterControlsComponent />}</BrowserOnly>
}
