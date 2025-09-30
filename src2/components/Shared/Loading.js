// src/components/Shared/Loading.js

import React from 'react'

/**
 * Loading Component
 * Displays a loading spinner with optional message
 *
 * Props:
 * - message: Optional loading message (default: "Loading...")
 */
const Loading = ({ message = 'Loading...' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.message}>{message}</p>
    </div>
  )
}

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '40px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#718096',
    fontWeight: '500',
  },
}

// Add keyframe animation
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0]
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `

  try {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
  } catch (e) {
    // Animation may already exist
  }
}

export default Loading
