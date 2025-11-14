// src/components/Shared/ErrorMessage.js

import React from 'react'

/**
 * ErrorMessage Component
 * Displays error messages with optional close button
 *
 * Props:
 * - message: Error message to display
 * - onClose: Optional callback when close button is clicked
 */
const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <span style={styles.icon}>⚠️</span>
        <span style={styles.message}>{message}</span>
      </div>

      {onClose && (
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  )
}

// Styles
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fed7d7',
    color: '#c53030',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fc8181',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: '1',
  },
  icon: {
    fontSize: '20px',
  },
  message: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#c53030',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 8px',
    marginLeft: '12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    fontWeight: 'bold',
  },
}

export default ErrorMessage
