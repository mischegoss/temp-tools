// src/components/Shared/Header.js

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../../firebase/auth'

/**
 * Header Component
 * App header with navigation and logout
 */
const Header = () => {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const user = getCurrentUser()

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setLoggingOut(true)
      const result = await logout()

      if (result.success) {
        navigate('/login')
      } else {
        alert('Logout failed. Please try again.')
        setLoggingOut(false)
      }
    }
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1 style={styles.title} onClick={() => navigate('/dashboard')}>
            🎬 Video Admin Panel
          </h1>
          <p style={styles.subtitle}>Manage video library and learning paths</p>
        </div>

        <div style={styles.rightSection}>
          {user && <span style={styles.userEmail}>{user.email}</span>}
          <button
            style={styles.dashboardButton}
            onClick={() => navigate('/dashboard')}
          >
            🏠 Dashboard
          </button>
          <button
            style={{
              ...styles.logoutButton,
              ...(loggingOut ? styles.logoutButtonDisabled : {}),
            }}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}

// Styles
const styles = {
  header: {
    background: '#2c5282',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  leftSection: {
    flex: '1',
    minWidth: '200px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
    cursor: 'pointer',
    margin: '0 0 5px 0',
    transition: 'opacity 0.2s',
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.9,
    margin: '0',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userEmail: {
    fontSize: '14px',
    opacity: 0.9,
    display: 'none', // Hidden on mobile
  },
  dashboardButton: {
    background: '#48bb78',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    marginRight: '10px',
  },
  logoutButton: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}

// Show user email on larger screens
if (typeof window !== 'undefined' && window.innerWidth > 768) {
  styles.userEmail.display = 'block'
}

export default Header
