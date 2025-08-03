// Clean Enhanced ProtectedRoute - Built from scratch
// src/components/service-blueprinting/login/ProtectedRoute.jsx

import React, { useState } from 'react'
import { useHistory } from '@docusaurus/router'
import { useAuth } from '@site/src/contexts/AuthContext'
import { auth } from '@site/src/firebase/firebase'
import { signOut } from 'firebase/auth'
import Link from '@docusaurus/Link'

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth()
  const history = useHistory()

  // Simple path detection - no complex state management
  const currentPath = window.location.pathname
  const isProtectedPath =
    currentPath.startsWith('/learning/') && currentPath !== '/learning/login'

  console.log('[ProtectedRoute] Simple check:', {
    currentPath,
    isProtectedPath,
    loading,
    user: !!user,
  })

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('[ProtectedRoute] Logout clicked')
      await signOut(auth)
      console.log(
        '[ProtectedRoute] Logout successful, redirecting to Learning Hub',
      )
      history.push('/learning/')
    } catch (error) {
      console.error('[ProtectedRoute] Logout error:', error)
      history.push('/learning/')
    }
  }

  // Non-protected paths - just render children
  if (!isProtectedPath) {
    console.log('[ProtectedRoute] Non-protected path, rendering children')
    return children
  }

  // Protected paths - check authentication
  console.log('[ProtectedRoute] Protected path detected')

  // Still loading authentication
  if (loading) {
    console.log('[ProtectedRoute] Loading authentication...')
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
      >
        <div>Loading authentication...</div>
      </div>
    )
  }

  // Not authenticated - show login overlay
  if (!user) {
    console.log('[ProtectedRoute] No user, showing login overlay')

    // Save redirect URL
    try {
      if (currentPath !== '/learning/login') {
        sessionStorage.setItem('redirectUrl', currentPath)
        console.log('[ProtectedRoute] Saved redirect URL:', currentPath)
      }
    } catch (error) {
      console.error('[ProtectedRoute] Error saving redirect URL:', error)
    }

    // Determine course name for personalized message
    let courseName = 'this content'
    let courseIcon = '🔒'

    if (currentPath.includes('service-blueprinting')) {
      courseName = 'Service Blueprinting'
      courseIcon = '🔰'
    } else if (currentPath.includes('automation-essentials')) {
      courseName = 'Automation Essentials'
      courseIcon = '⚡'
    }

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--brand-white)',
            padding: '3rem',
            borderRadius: '16px',
            border: '2px solid var(--brand-blue-400)',
            boxShadow: '0 0 30px rgba(0, 102, 255, 0.3)',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '1rem',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
            {courseIcon}
          </div>

          <h2
            style={{
              color: 'var(--brand-black-700)',
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              fontWeight: '600',
            }}
          >
            Login Required
          </h2>

          <p
            style={{
              color: 'var(--brand-grey-600)',
              margin: '0 0 2rem 0',
              fontSize: '1.2rem',
              lineHeight: '1.6',
            }}
          >
            {courseName === 'this content'
              ? 'This content requires you to login to continue.'
              : `The ${courseName} course requires you to login to continue.`}
          </p>

          <Link
            to='/learning/login'
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--brand-blue)',
              color: 'var(--brand-white)',
              padding: '1rem 2.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)',
            }}
          >
            Login to Continue
          </Link>

          <p
            style={{
              color: 'var(--brand-grey-500)',
              margin: '2rem 0 0 0',
              fontSize: '0.95rem',
            }}
          >
            Don't have an account?{' '}
            <Link
              to='/learning/login'
              style={{
                color: 'var(--brand-blue)',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Authenticated - show content with logout button
  console.log(
    '[ProtectedRoute] User authenticated, showing content with logout button',
  )

  return (
    <>
      {/* Logout button - custom styled */}
      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--brand-aqua-600)',
          color: 'white',
          border: '2px solid white',
          borderRadius: '25px',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer',
          zIndex: 99999,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = 'var(--brand-aqua-800)'
          e.target.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = 'var(--brand-aqua-600)'
          e.target.style.transform = 'translateY(0)'
        }}
        title={`Logout ${user.email}`}
      >
        Logout
      </button>

      {/* Page content */}
      {children}
    </>
  )
}
