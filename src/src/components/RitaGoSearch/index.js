/**
 * Rita Go Search Component - UI Only (Non-functional for now)
 * Based on CustomSearch/index.js but simplified for UI review
 */

import React, { useState, useRef } from 'react'
import { useHistory, useLocation } from '@docusaurus/router'
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material'

// Theme helpers - using Rita Go colors (can be adjusted)
const getBackgroundColor = () => {
  return 'var(--brand-white)' // Always light background
}

const getTextColor = () => {
  return 'var(--brand-black)' // Always dark text
}

const getSelectedBackgroundColor = () => {
  return 'var(--brand-grey-200)' // Always light selection
}

const getRitaGoFocusColor = () => {
  return 'var(--brand-blue)' // Using same blue as Actions for now
}

const RitaGoSearch = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [useFilters, setUseFilters] = useState(false)

  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const history = useHistory()
  const location = useLocation()

  // Mock results for UI display
  const mockResults = [
    {
      title: 'Getting Started with Rita Go',
      url: '/rita-go/category/getting-started',
      breadcrumbs: 'Rita Go > Getting Started',
      contentType: 'guide',
      excerpt: 'Learn the basics of Rita Go and how to get started...',
    },
    {
      title: 'Knowledge Base Management',
      url: '/rita-go/category/knowledge-base-management',
      breadcrumbs: 'Rita Go > Knowledge Base',
      contentType: 'reference',
      excerpt: 'Upload docs and manage your custom knowledge base...',
    },
    {
      title: 'User Management',
      url: '/rita-go/category/user-management',
      breadcrumbs: 'Rita Go > User Management',
      contentType: 'guide',
      excerpt: 'Manage permissions and understand user roles...',
    },
  ]

  // Handle search input changes
  const handleInputChange = e => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    if (value.trim()) {
      setIsLoading(true)
      setIsOpen(true)
      // Simulate search delay
      setTimeout(() => {
        setResults(mockResults)
        setIsLoading(false)
      }, 300)
    } else {
      setResults([])
      setIsOpen(false)
      setIsLoading(false)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = e => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    const totalItems = results.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev))
        break

      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break

      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateToResult(results[selectedIndex])
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  // Navigate to selected result
  const navigateToResult = result => {
    history.push(result.url)
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // Highlight search matches (simplified)
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text
    // For now, just return the text without highlighting
    return text
  }

  return (
    <div
      ref={searchRef}
      className='rita-go-search'
      style={{ position: 'relative', width: '100%', maxWidth: '450px' }}
    >
      <div className='search-input-container' style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search Rita Go...'
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={e => {
            if (query) setIsOpen(true)
            const focusColor = getRitaGoFocusColor()
            e.target.style.borderColor = focusColor
            e.target.style.boxShadow = `0 0 0 2px ${focusColor}20` // 20 = 12.5% opacity
          }}
          onBlur={e => {
            setTimeout(() => {
              if (!dropdownRef.current?.contains(document.activeElement)) {
                e.target.style.borderColor = 'var(--brand-grey-400)'
                e.target.style.boxShadow = 'none'
              }
            }, 150)
          }}
          className='search-input'
          style={{
            width: '100%',
            padding: '9px 14px',
            border: '1.5px solid var(--brand-grey-400)',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            outline: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'SeasonMix, var(--ifm-font-family-base)',
          }}
          aria-label='Search Rita Go documentation'
          aria-expanded={isOpen}
          aria-autocomplete='list'
        />

        {/* Use Filters Option */}
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--brand-grey-600)',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            <input
              type='checkbox'
              checked={useFilters}
              onChange={e => setUseFilters(e.target.checked)}
              style={{
                width: '12px',
                height: '12px',
                cursor: 'pointer',
              }}
            />
            Use filters?
          </label>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Paper
          ref={dropdownRef}
          elevation={8}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: '4px',
            maxHeight: '400px',
            overflow: 'auto',
            backgroundColor: getBackgroundColor(),
            border: '1px solid var(--brand-grey-300)',
          }}
        >
          {isLoading ? (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
              }}
            >
              <CircularProgress
                size={20}
                style={{ color: getRitaGoFocusColor() }}
              />
              <Typography
                variant='body2'
                style={{
                  marginLeft: '10px',
                  color: getTextColor(),
                  fontFamily: 'var(--ifm-font-family-base)',
                }}
              >
                Searching Rita Go...
              </Typography>
            </Box>
          ) : results.length > 0 ? (
            <List style={{ padding: 0 }}>
              {results.map((result, index) => (
                <ListItem key={index} style={{ padding: 0 }}>
                  <ListItemButton
                    onClick={() => navigateToResult(result)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor:
                        selectedIndex === index
                          ? getSelectedBackgroundColor()
                          : 'transparent',
                      borderLeft:
                        selectedIndex === index
                          ? `3px solid ${getRitaGoFocusColor()}`
                          : '3px solid transparent',
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <Typography
                        variant='subtitle2'
                        style={{
                          fontWeight: '500',
                          color: getTextColor(),
                          fontFamily: 'var(--ifm-font-family-base)',
                          marginBottom: '4px',
                        }}
                      >
                        {highlightMatch(result.title, query)}
                      </Typography>

                      <Typography
                        variant='body2'
                        style={{
                          color: 'var(--brand-grey-600)',
                          fontFamily: 'var(--ifm-font-family-base)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        {result.breadcrumbs}
                      </Typography>

                      {result.excerpt && (
                        <Typography
                          variant='body2'
                          style={{
                            color: 'var(--brand-grey-500)',
                            fontFamily: 'var(--ifm-font-family-base)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                          }}
                        >
                          {result.excerpt}
                        </Typography>
                      )}

                      <div style={{ marginTop: '6px' }}>
                        <Chip
                          label={result.contentType}
                          size='small'
                          style={{
                            height: '20px',
                            fontSize: '10px',
                            backgroundColor: 'var(--brand-blue-100)',
                            color: getRitaGoFocusColor(),
                            fontFamily: 'var(--ifm-font-family-base)',
                          }}
                        />
                        {useFilters && (
                          <Chip
                            label='Filtered'
                            size='small'
                            style={{
                              height: '20px',
                              fontSize: '10px',
                              backgroundColor: 'var(--brand-orange-100)',
                              color: 'var(--brand-orange)',
                              fontFamily: 'var(--ifm-font-family-base)',
                              marginLeft: '4px',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : query.trim() ? (
            <Box style={{ padding: '20px', textAlign: 'center' }}>
              <Typography
                variant='body2'
                style={{
                  color: 'var(--brand-grey-600)',
                  fontFamily: 'var(--ifm-font-family-base)',
                }}
              >
                No results found for "{query}"
                {useFilters && ' with current filters applied'}
              </Typography>
            </Box>
          ) : null}
        </Paper>
      )}
    </div>
  )
}

export default RitaGoSearch
