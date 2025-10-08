// src/components/VideoManagement/VideoSearch.js

import React, { useState } from 'react'

/**
 * VideoSearch Component
 * Search input for filtering videos
 *
 * Props:
 * - onSearch: Callback function called with search term
 */
const VideoSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = e => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <span style={styles.icon}>🔍</span>
        <input
          type='text'
          value={searchTerm}
          onChange={handleChange}
          placeholder='Search by title, ID, or description...'
          style={styles.input}
        />
        {searchTerm && (
          <button style={styles.clearButton} onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
      <p style={styles.helpText}>
        Try searching: "workflow", "actions", or paste a video ID
      </p>
    </div>
  )
}

// Styles
const styles = {
  container: {
    marginBottom: '30px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    padding: '12px 16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  icon: {
    fontSize: '18px',
    marginRight: '12px',
  },
  input: {
    flex: '1',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: 'transparent',
  },
  clearButton: {
    background: 'transparent',
    border: 'none',
    color: '#718096',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: '13px',
    color: '#718096',
    marginTop: '8px',
    margin: '8px 0 0 0',
  },
}

export default VideoSearch
