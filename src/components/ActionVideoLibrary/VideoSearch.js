// @site/src/components/ActionVideoLibrary/VideoSearch.js

import React, { useState, useEffect, useMemo, useCallback } from 'react'

/**
 * VideoSearch component - Advanced search with intent recognition for video library
 * Supports fuzzy matching, phrase matching, and intelligent intent analysis
 * Updated to include Rita Go product support
 */
const VideoSearch = ({
  resources = [],
  onSearchResults,
  searchTerm,
  onSearchTermChange,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '')
  const [searchIntent, setSearchIntent] = useState({ suggestions: [] })

  // Search input styles
  const searchContainerStyle = {
    position: 'relative',
    marginTop: '24px',
    marginBottom: '16px',
  }

  const searchInputStyle = {
    width: '100%',
    padding: '16px 50px 16px 20px',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    color: '#2d3748',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }

  const searchIconStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '1.2rem',
    pointerEvents: 'none',
  }

  const searchSuggestionsStyle = {
    marginTop: '12px',
    fontSize: '0.875rem',
    color: '#6b7280',
    fontStyle: 'italic',
    minHeight: '20px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Enhanced fuzzy matching with phrase support
  const fuzzyMatch = useCallback((text, query, threshold = 0.6) => {
    if (!text || !query) return { match: false, score: 0, type: 'none' }

    const normalizedText = text.toLowerCase().trim()
    const normalizedQuery = query.toLowerCase().trim()

    // Exact phrase match (highest priority)
    if (normalizedText.includes(normalizedQuery)) {
      const position = normalizedText.indexOf(normalizedQuery)
      const score = 1.0 - (position / normalizedText.length) * 0.2
      return { match: true, score, type: 'exact_phrase' }
    }

    // Word boundary phrase match
    const wordBoundaryRegex = new RegExp(
      `\\b${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
    )
    if (wordBoundaryRegex.test(normalizedText)) {
      return { match: true, score: 0.9, type: 'word_boundary_phrase' }
    }

    // Individual word matching
    const queryWords = normalizedQuery
      .split(/\s+/)
      .filter(word => word.length > 0)
    const textWords = normalizedText.split(/\s+/)

    let matchedWords = 0
    let totalScore = 0

    queryWords.forEach(queryWord => {
      let bestWordScore = 0

      textWords.forEach(textWord => {
        if (textWord.includes(queryWord)) {
          const score = queryWord.length / textWord.length
          bestWordScore = Math.max(bestWordScore, score)
        }
      })

      if (bestWordScore > 0) {
        matchedWords++
        totalScore += bestWordScore
      }
    })

    const finalScore =
      queryWords.length > 0
        ? (matchedWords / queryWords.length) * (totalScore / queryWords.length)
        : 0

    return {
      match: finalScore >= threshold,
      score: finalScore,
      type: matchedWords === queryWords.length ? 'all_words' : 'partial_words',
    }
  }, [])

  // Analyze search intent
  const analyzeSearchIntent = useCallback(term => {
    const intents = {
      type: 'general',
      modifiers: [],
      suggestions: [],
    }

    if (!term) return intents

    const normalizedTerm = term.toLowerCase()

    // Tutorial/guide intent
    if (
      /(tutorial|guide|how to|walkthrough|step by step)/.test(normalizedTerm)
    ) {
      intents.type = 'tutorial'
      intents.modifiers.push('prioritize_tutorials')
      intents.suggestions.push('Looking for step-by-step guides')
    }

    // Quick/fast intent
    if (/(quick|fast|rapid|brief|short|simple|easy)/.test(normalizedTerm)) {
      intents.type = 'quick_help'
      intents.modifiers.push('prioritize_short_videos')
      intents.suggestions.push('Showing shorter videos first')
    }

    // Beginner intent
    if (
      /(beginner|basic|intro|introduction|getting started|new to|learn|first time)/.test(
        normalizedTerm,
      )
    ) {
      intents.type = 'learning'
      intents.modifiers.push('prioritize_beginner')
      intents.suggestions.push('Focusing on beginner-friendly content')
    }

    // Advanced/expert intent
    if (
      /(advanced|expert|complex|detailed|in-depth|professional)/.test(
        normalizedTerm,
      )
    ) {
      intents.type = 'advanced'
      intents.modifiers.push('prioritize_advanced')
      intents.suggestions.push('Showing advanced tutorials')
    }

    // Product-specific intent - Updated to include Rita Go
    const products = [
      'rita-go',
      'rita go',
      'actions',
      'express',
      'pro',
      'insights',
    ]
    const foundProduct = products.find(product =>
      normalizedTerm.includes(product),
    )
    if (foundProduct) {
      intents.type = 'product_specific'
      const productKey = foundProduct === 'rita go' ? 'rita-go' : foundProduct
      intents.modifiers.push(`product_${productKey}`)
      intents.suggestions.push(`Filtering for ${foundProduct} content`)
    }

    // Configuration/setup intent
    if (
      /(configure|configuration|config|setup|set up|install|create|build)/.test(
        normalizedTerm,
      )
    ) {
      intents.type = 'setup'
      intents.modifiers.push('prioritize_configuration')
      intents.suggestions.push('Focusing on setup and configuration')
    }

    // Troubleshooting intent
    if (
      /(error|issue|problem|fix|troubleshoot|not working|failed|help)/.test(
        normalizedTerm,
      )
    ) {
      intents.type = 'troubleshooting'
      intents.modifiers.push('prioritize_troubleshooting')
      intents.suggestions.push('Looking for troubleshooting content')
    }

    return intents
  }, [])

  // Enhanced search with scoring
  const performSearch = useCallback(
    query => {
      if (!query.trim()) {
        return resources
      }

      const intent = analyzeSearchIntent(query)
      setSearchIntent(intent)

      const results = resources
        .map(video => {
          let score = 0
          const matchDetails = []

          // Title matching (highest weight)
          const titleMatch = fuzzyMatch(video.title, query, 0.3)
          if (titleMatch.match) {
            score +=
              titleMatch.score * (titleMatch.type.includes('phrase') ? 100 : 70)
            matchDetails.push(`title:${titleMatch.type}`)
          }

          // Description matching
          const descMatch = fuzzyMatch(video.description, query, 0.3)
          if (descMatch.match) {
            score +=
              descMatch.score * (descMatch.type.includes('phrase') ? 60 : 40)
            matchDetails.push(`desc:${descMatch.type}`)
          }

          // Category/section matching
          const categoryMatch = fuzzyMatch(
            video.category || video.section || '',
            query,
            0.4,
          )
          if (categoryMatch.match) {
            score += categoryMatch.score * 50
            matchDetails.push(`category:${categoryMatch.type}`)
          }

          // Tags matching
          if (video.tags && Array.isArray(video.tags)) {
            video.tags.forEach(tag => {
              const tagMatch = fuzzyMatch(tag, query, 0.4)
              if (tagMatch.match) {
                score += tagMatch.score * 30
                matchDetails.push(`tag:${tagMatch.type}`)
              }
            })
          }

          // Product matching - Updated to include Rita Go
          const productMatch = fuzzyMatch(video.product, query, 0.5)
          if (productMatch.match) {
            score += productMatch.score * 40
            matchDetails.push(`product:${productMatch.type}`)
          }

          // Level matching
          const levelMatch = fuzzyMatch(video.level, query, 0.5)
          if (levelMatch.match) {
            score += levelMatch.score * 35
            matchDetails.push(`level:${levelMatch.type}`)
          }

          // Intent-based scoring adjustments
          if (
            intent.type === 'tutorial' &&
            (video.category?.toLowerCase().includes('tutorial') ||
              video.tags?.some(tag => tag.toLowerCase().includes('tutorial')))
          ) {
            score *= 1.2
          }

          if (
            intent.type === 'quick_help' &&
            video.duration &&
            parseInt(video.duration) < 300
          ) {
            // Less than 5 minutes
            score *= 1.15
          }

          if (
            intent.type === 'learning' &&
            video.level?.toLowerCase() === 'beginner'
          ) {
            score *= 1.1
          }

          if (
            intent.type === 'advanced' &&
            video.level?.toLowerCase() === 'advanced'
          ) {
            score *= 1.1
          }

          return {
            ...video,
            searchScore: score,
            matchDetails,
            searchQuery: query,
          }
        })
        .filter(video => video.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore)

      return results
    },
    [resources, fuzzyMatch, analyzeSearchIntent],
  )

  // Memoize search results
  const searchResults = useMemo(() => {
    return performSearch(localSearchTerm)
  }, [localSearchTerm, performSearch])

  // Handle input changes
  const handleInputChange = useCallback(
    e => {
      const value = e.target.value
      setLocalSearchTerm(value)
      if (onSearchTermChange) {
        onSearchTermChange(value)
      }
    },
    [onSearchTermChange],
  )

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearchResults) {
        onSearchResults(searchResults, localSearchTerm, searchIntent)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchResults, localSearchTerm, searchIntent, onSearchResults])

  // Sync with external search term changes
  useEffect(() => {
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm || '')
    }
  }, [searchTerm, localSearchTerm])

  return (
    <div style={searchContainerStyle}>
      <input
        type='text'
        placeholder="Search videos... (e.g., 'Rita Go tutorial', 'workflow automation', 'beginner guide')"
        value={localSearchTerm}
        onChange={handleInputChange}
        style={searchInputStyle}
        onFocus={e => {
          e.target.style.borderColor = '#4299e1'
          e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)'
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e2e8f0'
          e.target.style.boxShadow = 'none'
        }}
      />
      <span style={searchIconStyle}>🔍</span>

      {searchIntent.suggestions.length > 0 && (
        <div style={searchSuggestionsStyle}>
          {searchIntent.suggestions.join(' • ')}
          {localSearchTerm && (
            <span style={{ marginLeft: '12px', color: '#4b5563' }}>
              ({searchResults.length} result
              {searchResults.length !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoSearch
