// @site/src/components/ActionVideoLibrary/VideoSearch.js

import React, { useState, useMemo } from 'react'

/**
 * VideoSearch component - Searches through video JSON data
 * Searches title, description, tags, and learning objectives
 */
const VideoSearch = ({
  videos = [],
  onSearchResults,
  placeholder = 'Search videos...',
  colorTheme,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Fuzzy search helper function for typo tolerance (kept from original)
  const fuzzyMatch = (text, searchWord, threshold = 0.7) => {
    if (!text || !searchWord) return false

    text = text.toLowerCase()
    searchWord = searchWord.toLowerCase()

    // Exact match (highest priority)
    if (text.includes(searchWord)) {
      return true
    }

    // Handle common typos and variations
    const variations = generateVariations(searchWord)
    for (const variation of variations) {
      if (text.includes(variation)) {
        return true
      }
    }

    // Levenshtein distance for remaining cases
    const words = text.split(/\s+/)
    for (const word of words) {
      if (calculateSimilarity(word, searchWord) >= threshold) {
        return true
      }
    }

    return false
  }

  // Domain-specific synonyms for video search
  const synonymMap = {
    // Core automation terms
    automation: [
      'workflow',
      'process',
      'automate',
      'automated',
      'scripting',
      'orchestration',
    ],
    workflow: [
      'automation',
      'process',
      'flow',
      'procedure',
      'sequence',
      'pipeline',
    ],
    integration: [
      'connection',
      'connector',
      'api',
      'webhook',
      'interface',
      'link',
    ],
    trigger: [
      'event',
      'listener',
      'condition',
      'signal',
      'activation',
      'initiator',
    ],
    activity: ['task', 'action', 'step', 'operation', 'function', 'component'],

    // Platform-specific terms
    actions: ['platform', 'resolve actions', 'workflow builder'],
    express: ['actions express', 'express platform'],
    pro: ['actions pro', 'professional', 'enterprise'],
    insights: ['discovery', 'mapping', 'ddm', 'dependency'],

    // Technical concepts
    schedule: [
      'timer',
      'recurring',
      'cron',
      'interval',
      'periodic',
      'automated',
    ],
    variable: ['parameter', 'value', 'data', 'field', 'property', 'input'],
    configuration: ['config', 'setup', 'settings', 'options', 'preferences'],
    authentication: [
      'auth',
      'login',
      'credentials',
      'oauth',
      'token',
      'security',
    ],
    notification: ['alert', 'message', 'email', 'notification', 'notify'],

    // Action types
    email: ['mail', 'message', 'notification', 'send', 'smtp'],
    slack: ['messaging', 'chat', 'communication', 'collaboration'],
    office365: ['o365', 'microsoft', 'outlook', 'exchange'],
    servicenow: ['itsm', 'ticketing', 'incident', 'service management'],

    // Learning concepts
    tutorial: ['guide', 'walkthrough', 'howto', 'instructions', 'lesson'],
    beginner: [
      'basic',
      'intro',
      'introduction',
      'getting started',
      'fundamentals',
    ],
    advanced: ['expert', 'complex', 'detailed', 'in-depth', 'professional'],
    quick: ['fast', 'rapid', 'brief', 'short', 'simple'],

    // Common misspellings and variations
    setup: ['set up', 'configuration', 'install', 'configure'],
    login: ['log in', 'signin', 'sign in', 'authentication'],
    api: ['application programming interface', 'endpoint', 'service'],
  }

  // User intent detection patterns
  const detectUserIntent = searchTerm => {
    const term = searchTerm.toLowerCase()
    const intents = {
      type: 'general',
      modifiers: [],
      suggestions: [],
    }

    // How-to intent
    if (/^(how to|how do i|how can i|show me how)/.test(term)) {
      intents.type = 'tutorial'
      intents.modifiers.push('prioritize_tutorials')
      intents.suggestions.push('Looking for step-by-step guides')
    }

    // Quick/fast intent
    if (/(quick|fast|rapid|brief|short|simple|easy)/.test(term)) {
      intents.type = 'quick_help'
      intents.modifiers.push('prioritize_short_videos')
      intents.suggestions.push('Showing shorter videos first')
    }

    // Beginner intent
    if (
      /(beginner|basic|intro|introduction|getting started|new to|learn|first time)/.test(
        term,
      )
    ) {
      intents.type = 'learning'
      intents.modifiers.push('prioritize_beginner')
      intents.suggestions.push('Focusing on beginner-friendly content')
    }

    // Advanced/expert intent
    if (/(advanced|expert|complex|detailed|in-depth|professional)/.test(term)) {
      intents.type = 'advanced'
      intents.modifiers.push('prioritize_advanced')
      intents.suggestions.push('Showing advanced tutorials')
    }

    // Product-specific intent
    const products = ['actions', 'express', 'pro', 'insights']
    const foundProduct = products.find(product => term.includes(product))
    if (foundProduct) {
      intents.type = 'product_specific'
      intents.modifiers.push(`product_${foundProduct}`)
      intents.suggestions.push(`Filtering for ${foundProduct} content`)
    }

    // Configuration/setup intent
    if (
      /(configure|configuration|config|setup|set up|install|create|build)/.test(
        term,
      )
    ) {
      intents.type = 'setup'
      intents.modifiers.push('prioritize_configuration')
      intents.suggestions.push('Focusing on setup and configuration')
    }

    // Troubleshooting intent
    if (
      /(error|issue|problem|fix|troubleshoot|not working|failed|help)/.test(
        term,
      )
    ) {
      intents.type = 'troubleshooting'
      intents.modifiers.push('prioritize_troubleshooting')
      intents.suggestions.push('Looking for troubleshooting content')
    }

    return intents
  }

  // Expand search terms with synonyms
  const expandWithSynonyms = word => {
    const expanded = new Set([word])

    // Add direct synonyms
    if (synonymMap[word]) {
      synonymMap[word].forEach(synonym => expanded.add(synonym))
    }

    // Add reverse synonyms (if word appears as synonym, add the key)
    Object.entries(synonymMap).forEach(([key, synonyms]) => {
      if (synonyms.includes(word)) {
        expanded.add(key)
      }
    })

    return Array.from(expanded)
  }

  // Enhanced fuzzy search with synonym support - STRICTER VERSION
  const fuzzyMatchWithSynonyms = (text, searchWord, threshold = 0.8) => {
    if (!text || !searchWord)
      return { match: false, score: 0, matchType: 'none' }

    text = text.toLowerCase()
    searchWord = searchWord.toLowerCase()

    // Check exact match first (highest score)
    if (text.includes(searchWord)) {
      return { match: true, score: 1.0, matchType: 'exact' }
    }

    // Check synonyms (high score, but less than exact)
    const synonyms = expandWithSynonyms(searchWord)
    for (const synonym of synonyms) {
      if (synonym !== searchWord && text.includes(synonym)) {
        return { match: true, score: 0.85, matchType: 'synonym' }
      }
    }

    // Only do fuzzy matching for longer words (4+ characters)
    if (searchWord.length >= 4 && fuzzyMatch(text, searchWord, threshold)) {
      return { match: true, score: 0.6, matchType: 'fuzzy' }
    }

    return { match: false, score: 0, matchType: 'none' }
  }

  // Score and rank results based on intent and match quality - STRICTER VERSION
  const scoreVideo = (video, searchWords, userIntent) => {
    let totalScore = 0
    let matchCount = 0
    let strongMatchCount = 0 // Count of high-quality matches

    const fields = [
      { field: video.title, weight: 3.0 },
      { field: video.tags?.join(' '), weight: 2.5 },
      { field: video.category, weight: 2.0 },
      { field: video.description, weight: 1.5 },
      { field: video.learningObjectives, weight: 1.2 },
      { field: video.section, weight: 1.0 },
    ]

    // Calculate base score from field matches - STRICTER MATCHING
    searchWords.forEach(word => {
      let wordFound = false
      let bestMatchScore = 0

      fields.forEach(({ field, weight }) => {
        if (field) {
          const matchResult = fuzzyMatchWithSynonyms(field, word, 0.8) // Higher threshold
          if (matchResult.match) {
            const weightedScore = matchResult.score * weight
            totalScore += weightedScore
            bestMatchScore = Math.max(bestMatchScore, matchResult.score)
            wordFound = true

            // Count strong matches (exact or synonym matches)
            if (
              matchResult.matchType === 'exact' ||
              matchResult.matchType === 'synonym'
            ) {
              strongMatchCount++
            }
          }
        }
      })

      if (wordFound) matchCount++
    })

    // STRICT REQUIREMENTS: All words must be found
    const completeness = matchCount / searchWords.length
    if (completeness < 1.0) {
      return 0 // Reject if not all words found
    }

    // QUALITY REQUIREMENT: At least half the words should be strong matches
    const strongMatchRatio = strongMatchCount / searchWords.length
    if (strongMatchRatio < 0.5) {
      totalScore *= 0.3 // Heavily penalize weak matches
    }

    // Apply intent-based bonuses (reduced)
    if (userIntent.type === 'quick_help' && video.duration) {
      const [minutes] = video.duration.split(':').map(Number)
      if (minutes <= 3) totalScore *= 1.1 // Reduced bonus
    }

    if (userIntent.type === 'tutorial' && video.template === 'instructional') {
      totalScore *= 1.1 // Reduced bonus
    }

    if (userIntent.type === 'learning' && video.level === 'quick-start') {
      totalScore *= 1.1 // Reduced bonus
    }

    // MINIMUM SCORE THRESHOLD
    return totalScore >= 2.0 ? totalScore : 0
  }

  // Generate common typo variations
  const generateVariations = word => {
    const variations = new Set()

    // Common substitutions
    const substitutions = {
      workflow: ['workfow', 'workflw', 'wokflow', 'workflov'],
      integration: [
        'intergration',
        'integeration',
        'intergation',
        'integretion',
      ],
      configuration: ['configration', 'configuraton', 'configuation'],
      automation: ['automaton', 'automatoin', 'automtion'],
      schedule: ['shedule', 'schedual', 'shcedule'],
      variable: ['varibale', 'variabel', 'varaiable'],
      trigger: ['triger', 'trigge', 'triggr'],
      activity: ['activty', 'activiy', 'acitivity'],
      actions: ['action', 'actinos', 'acitons'],
      express: ['expres', 'expresss'],
      insights: ['insight', 'insigths'],
      platform: ['platfrom', 'paltform'],
    }

    // Add known substitutions
    if (substitutions[word.toLowerCase()]) {
      substitutions[word.toLowerCase()].forEach(sub => variations.add(sub))
    }

    // Add original word
    variations.add(word)

    // Simple character swaps (transpose adjacent characters)
    for (let i = 0; i < word.length - 1; i++) {
      const swapped =
        word.substring(0, i) + word[i + 1] + word[i] + word.substring(i + 2)
      variations.add(swapped)
    }

    // Simple omissions (remove one character)
    for (let i = 0; i < word.length; i++) {
      const omitted = word.substring(0, i) + word.substring(i + 1)
      if (omitted.length >= 3) {
        // Only for words that remain meaningful
        variations.add(omitted)
      }
    }

    return Array.from(variations)
  }

  // Calculate similarity using simplified Levenshtein distance
  const calculateSimilarity = (str1, str2) => {
    if (str1.length < 3 || str2.length < 3) return 0

    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1

    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  // Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Simplified search - much more conservative
  const searchVideos = useMemo(() => {
    if (!searchTerm.trim()) {
      return videos
    }

    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/)

    return videos.filter(video => {
      // For each video, check if ALL search words are found somewhere in the video content
      return searchWords.every(word => {
        // Only search in key fields with exact matching (no synonyms, limited fuzzy)
        const searchableContent = [
          video.title?.toLowerCase() || '',
          video.description?.toLowerCase() || '',
          video.tags?.join(' ').toLowerCase() || '',
          video.category?.toLowerCase() || '',
          video.product?.toLowerCase() || '',
        ].join(' ')

        // Exact match first
        if (searchableContent.includes(word)) {
          return true
        }

        // Very limited fuzzy matching - only for obvious typos on longer words
        if (word.length >= 5) {
          // Only check for single character typos in longer words
          const words = searchableContent.split(/\s+/)
          for (const contentWord of words) {
            if (
              contentWord.length >= 4 &&
              calculateSimilarity(contentWord, word) >= 0.85
            ) {
              return true
            }
          }
        }

        return false
      })
    })
  }, [videos, searchTerm])

  // Update parent component when search results change - simplified
  React.useEffect(() => {
    if (onSearchResults) {
      onSearchResults(searchVideos, searchTerm, { suggestions: [] })
    }
  }, [searchVideos, searchTerm, onSearchResults])

  // Handle search input change
  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
  }

  // Container style
  const searchContainerStyle = {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto 30px auto',
  }

  // Input style
  const searchInputStyle = {
    width: '100%',
    padding: '14px 50px 14px 20px',
    fontSize: '1.1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#2d3748',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  }

  // Focus styles
  const searchInputFocusStyle = {
    borderColor: colorTheme?.primary || '#4299e1',
    boxShadow: `0 0 0 3px ${colorTheme?.primary || '#4299e1'}20`,
  }

  // Search icon style
  const searchIconStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '1.2rem',
    pointerEvents: 'none',
  }

  // Clear button style
  const clearButtonStyle = {
    position: 'absolute',
    right: searchTerm ? '45px' : '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
    display: searchTerm ? 'block' : 'none',
  }

  // Results summary style
  const resultsSummaryStyle = {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.95rem',
    marginBottom: '20px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  return (
    <div>
      <div style={searchContainerStyle}>
        <input
          type='text'
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          style={searchInputStyle}
          onFocus={e => Object.assign(e.target.style, searchInputFocusStyle)}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            style={clearButtonStyle}
            onClick={clearSearch}
            onMouseEnter={e => (e.target.style.color = '#374151')}
            onMouseLeave={e => (e.target.style.color = '#9ca3af')}
            title='Clear search'
          >
            ✕
          </button>
        )}

        {/* Search icon */}
        <span style={searchIconStyle}>🔍</span>
      </div>

      {/* Results summary */}
      {searchTerm && (
        <div style={resultsSummaryStyle}>
          {searchVideos.length === 1
            ? `Found 1 video for "${searchTerm}"`
            : `Found ${searchVideos.length} videos for "${searchTerm}"`}
        </div>
      )}
    </div>
  )
}

export default VideoSearch
