// src/components/FilterControls/index.js - COMPLETE CORRECTED VERSION
import React, { useState, useEffect } from 'react'
import { useLocation } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  getFilterFromURL,
  setFilterInURL,
  getFilteredPageCount,
} from '../../utils/urlFilterUtils'

function EmbeddedFilterControlsComponent() {
  const location = useLocation()
  const [userToggle, setUserToggle] = useState(true)
  const [adminToggle, setAdminToggle] = useState(true) // Start with both on
  const [pageCount, setPageCount] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize from URL on component mount and URL changes
  useEffect(() => {
    const currentFilter = getFilterFromURL()

    console.log('🎯 Reading filter from URL:', currentFilter)

    // Set toggles based on URL parameter
    if (currentFilter === 'user') {
      setUserToggle(true)
      setAdminToggle(false)
    } else if (currentFilter === 'admin') {
      setUserToggle(false)
      setAdminToggle(true)
    } else {
      // No filter parameter = show all content
      setUserToggle(true)
      setAdminToggle(true)
    }

    // Update page count
    getFilteredPageCount().then(count => {
      setPageCount(count)
      setLoading(false)
    })
  }, [location.search]) // Only watch URL parameters

  // Handle user toggle click
  const handleUserToggle = () => {
    console.log('👤 User toggle clicked')

    if (userToggle && adminToggle) {
      // Both on -> turn off admin, keep user (user only)
      setFilterInURL('user')
    } else if (userToggle && !adminToggle) {
      // User on, admin off -> turn on admin, keep user (both on)
      setFilterInURL(null)
    } else if (!userToggle && adminToggle) {
      // User off, admin on -> turn off admin, turn on user (user only)
      setFilterInURL('user')
    } else {
      // Both off (shouldn't happen) -> user only
      setFilterInURL('user')
    }
  }

  // Handle admin toggle click
  const handleAdminToggle = () => {
    console.log('🔧 Admin toggle clicked')

    if (userToggle && adminToggle) {
      // Both on -> turn off user, keep admin (admin only)
      setFilterInURL('admin')
    } else if (!userToggle && adminToggle) {
      // User off, admin on -> turn on user, keep admin (both on)
      setFilterInURL(null)
    } else if (userToggle && !adminToggle) {
      // User on, admin off -> turn off user, turn on admin (admin only)
      setFilterInURL('admin')
    } else {
      // Both off (shouldn't happen) -> admin only
      setFilterInURL('admin')
    }
  }

  // FIXED: Don't show "All content" when both toggles are on
  const getDisplayText = () => {
    if (loading) return 'Loading...'

    if (userToggle && adminToggle) {
      return null // Don't show any text when showing all content
    } else if (userToggle && !adminToggle) {
      return pageCount !== null
        ? `User content (${pageCount} pages)`
        : 'User content'
    } else if (!userToggle && adminToggle) {
      return pageCount !== null
        ? `Admin content (${pageCount} pages)`
        : 'Admin content'
    }

    return null
  }

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange, label, icon }) => (
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
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: 'var(--ifm-color-content)',
          }}
        >
          {label}
        </span>
      </div>

      <div
        onClick={onChange}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? '#3b82f6' : '#d1d5db',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            transition: 'left 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  )

  return (
    <div
      style={{
        background: 'var(--ifm-color-emphasis-100)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        fontFamily: 'var(--ifm-font-family-base)',
      }}
    >
      {/* FIXED: Conditional display text */}
      <div
        style={{
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--ifm-color-content-secondary)',
            marginBottom: getDisplayText() ? '4px' : '0px',
          }}
        >
          📚 Filter Content
        </div>
        {getDisplayText() && (
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--ifm-color-content-secondary)',
              fontWeight: '500',
            }}
          >
            {getDisplayText()}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--ifm-color-emphasis-300)',
          paddingTop: '8px',
        }}
      >
        <ToggleSwitch
          checked={userToggle}
          onChange={handleUserToggle}
          label='User'
          icon='👤'
        />

        <ToggleSwitch
          checked={adminToggle}
          onChange={handleAdminToggle}
          label='Admin'
          icon='🔧'
        />
      </div>
    </div>
  )
}

export default function EmbeddedFilterControls() {
  return (
    <BrowserOnly fallback={null}>
      {() => <EmbeddedFilterControlsComponent />}
    </BrowserOnly>
  )
}
