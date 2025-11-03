// src/components/FilterControls/index.js - FIXED STATE UPDATES AND PERSISTENCE
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
  const [userToggle, setUserToggle] = useState(false) // Start OFF
  const [adminToggle, setAdminToggle] = useState(false) // Start OFF
  const [pageCount, setPageCount] = useState(null)
  const [loading, setLoading] = useState(true)

  // FIXED: Initialize from URL on component mount and URL changes
  useEffect(() => {
    const currentFilter = getFilterFromURL()

    console.log('🎯 FilterControls: Reading filter from URL:', currentFilter)
    console.log('📍 Current location:', location.pathname, location.search)

    // FIXED: Ensure state updates happen immediately
    if (currentFilter === 'user') {
      console.log('👤 Setting User ON, Admin OFF')
      setUserToggle(true)
      setAdminToggle(false)
    } else if (currentFilter === 'admin') {
      console.log('🔧 Setting User OFF, Admin ON')
      setUserToggle(false)
      setAdminToggle(true)
    } else if (currentFilter === 'both') {
      console.log('🔄 Setting Both ON')
      setUserToggle(true)
      setAdminToggle(true)
    } else {
      console.log('⭕ Setting Both OFF (no filter)')
      setUserToggle(false)
      setAdminToggle(false)
    }

    // Update page count
    getFilteredPageCount().then(count => {
      setPageCount(count)
      setLoading(false)
      console.log('📊 Page count updated:', count)
    })
  }, [location.search, location.pathname]) // FIXED: Watch both search and pathname

  // FIXED: Handle user toggle click with immediate state update
  const handleUserToggle = () => {
    const newUserState = !userToggle
    console.log('👤 User toggle clicked:', userToggle, '->', newUserState)
    console.log('🔧 Admin current state:', adminToggle)

    // FIXED: Update state immediately for UI responsiveness
    setUserToggle(newUserState)

    // Determine new filter state based on both toggles
    if (newUserState && adminToggle) {
      // Both will be on
      console.log('🔄 Setting filter to: both')
      setFilterInURL('both')
    } else if (newUserState && !adminToggle) {
      // User only
      console.log('👤 Setting filter to: user')
      setFilterInURL('user')
    } else if (!newUserState && adminToggle) {
      // Admin only
      console.log('🔧 Setting filter to: admin')
      setFilterInURL('admin')
    } else {
      // Both off
      console.log('⭕ Setting filter to: none')
      setFilterInURL('none')
    }
  }

  // FIXED: Handle admin toggle click with immediate state update
  const handleAdminToggle = () => {
    const newAdminState = !adminToggle
    console.log('🔧 Admin toggle clicked:', adminToggle, '->', newAdminState)
    console.log('👤 User current state:', userToggle)

    // FIXED: Update state immediately for UI responsiveness
    setAdminToggle(newAdminState)

    // Determine new filter state based on both toggles
    if (userToggle && newAdminState) {
      // Both will be on
      console.log('🔄 Setting filter to: both')
      setFilterInURL('both')
    } else if (!userToggle && newAdminState) {
      // Admin only
      console.log('🔧 Setting filter to: admin')
      setFilterInURL('admin')
    } else if (userToggle && !newAdminState) {
      // User only
      console.log('👤 Setting filter to: user')
      setFilterInURL('user')
    } else {
      // Both off
      console.log('⭕ Setting filter to: none')
      setFilterInURL('none')
    }
  }

  // Display text logic
  const getDisplayText = () => {
    if (loading) return 'Loading...'

    if (!userToggle && !adminToggle) {
      // Both off - show all content, no text
      return null
    } else if (userToggle && !adminToggle) {
      // User only
      return pageCount !== null
        ? `User content (${pageCount} pages)`
        : 'User content'
    } else if (!userToggle && adminToggle) {
      // Admin only
      return pageCount !== null
        ? `Admin content (${pageCount} pages)`
        : 'Admin content'
    } else if (userToggle && adminToggle) {
      // Both on - show all content, no text
      return null
    }

    return null
  }

  // FIXED: Toggle switch component with better visual feedback
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
          background: checked ? '#3b82f6' : '#d1d5db', // Blue when checked
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          border: checked ? '2px solid #1d4ed8' : '2px solid transparent', // ADDED: Border for better visual feedback
        }}
      >
        <div
          style={{
            width: '18px', // ADJUSTED: Slightly smaller to account for border
            height: '18px',
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: '1px', // ADJUSTED: Account for border
            left: checked ? '21px' : '1px', // ADJUSTED: Account for border
            transition: 'left 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  )

  // DEBUGGING: Log current state
  console.log('🎨 FilterControls render - toggles:', {
    userToggle,
    adminToggle,
  })

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
      {/* Header and display text */}
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
