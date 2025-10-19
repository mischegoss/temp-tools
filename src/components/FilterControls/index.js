// src/components/FilterControls/index.js - SIMPLIFIED VERSION
import React, { useState, useEffect } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  initializeGlobalFilterState,
  setBadgeData,
  updateFilters,
  countFilteredPages,
} from '../../utils/globalFilterState'

// Import static badge data
import staticBadgeData from '../../data/badgeData.json'

function EmbeddedFilterControlsComponent() {
  const [filters, setFilters] = useState({
    role: 'all',
    plans: ['trial'],
  })
  const [isMainCollapsed, setIsMainCollapsed] = useState(false)
  const [resultCount, setResultCount] = useState(null)

  // Initialize once on mount
  useEffect(() => {
    initializeGlobalFilterState()
    setBadgeData(staticBadgeData)
    updateResultCount()
  }, [])

  // Update when filters change
  useEffect(() => {
    updateFilters(filters)
    updateResultCount()
  }, [filters])

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
          {resultCount !== null ? `${resultCount} results` : 'All content'}
        </div>
      </div>

      {/* Main Filter Section */}
      <div>
        <div
          onClick={() => setIsMainCollapsed(!isMainCollapsed)}
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
                            filters.role === role.value ? '#0050c7' : '#64748b',
                          textAlign: 'center',
                        }}
                      >
                        {role.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Section */}
              <div style={{ marginBottom: '12px' }}>
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
                  Plans
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={() => handlePlanToggle('trial')}
                    style={{
                      padding: '10px 12px',
                      background: filters.plans.includes('trial')
                        ? '#cbe0ff'
                        : 'white',
                      border: `2px solid ${
                        filters.plans.includes('trial') ? '#0050c7' : '#e2e8f0'
                      }`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--ifm-font-family-base)',
                      fontSize: '13px',
                      fontWeight: '500',
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
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        background: filters.plans.includes('trial')
                          ? '#0050c7'
                          : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: filters.plans.includes('trial')
                          ? 'white'
                          : '#64748b',
                        fontSize: '12px',
                      }}
                    >
                      {filters.plans.includes('trial') ? '✓' : ''}
                    </div>
                  </button>
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
    <BrowserOnly fallback={<div>Loading filters...</div>}>
      {() => <EmbeddedFilterControlsComponent />}
    </BrowserOnly>
  )
}
