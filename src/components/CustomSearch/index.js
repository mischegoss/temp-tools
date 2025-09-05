/**
 * Enhanced Custom React Search Component with Advanced Phrase Matching
 * Now supports better multi-word searches like "test workflow" → "Testing Your Workflow"
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useHistory, useLocation } from '@docusaurus/router'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
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

// Direct imports - no more async loading!
import actionsLatest from '../../../static/data/enhanced-title-mappings-actions-latest.json'
import expressOnPremise25 from '../../../static/data/enhanced-title-mappings-express-on-premise-2-5.json'
import expressOnPremise24 from '../../../static/data/enhanced-title-mappings-express-on-premise-2-4.json'
import expressOnPremise21 from '../../../static/data/enhanced-title-mappings-express-on-premise-2-1.json'
import expressSaas from '../../../static/data/enhanced-title-mappings-express-saas.json'
import insights110 from '../../../static/data/enhanced-title-mappings-insights-11-0.json'
import insights94 from '../../../static/data/enhanced-title-mappings-insights-9-4.json'
import insights96 from '../../../static/data/enhanced-title-mappings-insights-9-6.json'
import pro80 from '../../../static/data/enhanced-title-mappings-pro-8-0.json'
import pro75 from '../../../static/data/enhanced-title-mappings-pro-7-5.json'
import pro76 from '../../../static/data/enhanced-title-mappings-pro-7-6.json'
import pro77 from '../../../static/data/enhanced-title-mappings-pro-7-7.json'
import pro78 from '../../../static/data/enhanced-title-mappings-pro-7-8.json'
import pro79 from '../../../static/data/enhanced-title-mappings-pro-7-9.json'

// Simple mapping object - no more complex caching
const ALL_MAPPINGS = {
  'actions-latest': actionsLatest,
  'express-on-premise-2-5': expressOnPremise25,
  'express-on-premise-2-4': expressOnPremise24,
  'express-on-premise-2-1': expressOnPremise21,
  'express-saas': expressSaas,
  'insights-11-0': insights110,
  'insights-9-4': insights94,
  'insights-9-6': insights96,
  'pro-8-0': pro80,
  'pro-7-5': pro75,
  'pro-7-6': pro76,
  'pro-7-7': pro77,
  'pro-7-8': pro78,
  'pro-7-9': pro79,
}

// Current versions per product (file format)
const CURRENT_VERSIONS = {
  actions: 'latest',
  insights: '11-0',
  express: 'on-premise-2-5',
  pro: '8-0',
}

// Version mapping: URL format → File format (must match scan-titles.js)
const VERSION_URL_TO_FILE = {
  // Pro versions - COMPLETE LIST
  '8.0': '8-0',
  7.9: '7-9',
  7.8: '7-8',
  7.7: '7-7',
  7.6: '7-6',
  7.5: '7-5',
  // Insights versions - ACTUAL PUBLISHED VERSIONS
  '11.0': '11-0',
  9.6: '9-6',
  9.5: '9-5',
  9.4: '9-4',
  // Express versions
  'On-Premise%202.5': 'on-premise-2-5',
  'On-Premise 2.5': 'on-premise-2-5',
  'On-Premise%202.4': 'on-premise-2-4',
  'On-Premise 2.4': 'on-premise-2-4',
  'On-Premise%202.1': 'on-premise-2-1',
  'On-Premise 2.1': 'on-premise-2-1',
  SaaS: 'saas',
  // Actions (no version)
  null: 'latest',
  undefined: 'latest',
}

// Cache for processed search data
let processedSearchDataCache = {}
let searchCategoriesCache = {}

// ENHANCED PHRASE MATCHING FUNCTIONS

// Simple stemming function to handle word variations
const stemWord = word => {
  const lowerWord = word.toLowerCase()

  // Common suffixes to remove for better matching
  const suffixes = [
    'ing',
    'ed',
    'er',
    'est',
    'ly',
    'tion',
    'sion',
    'ness',
    'ment',
    'ful',
    'less',
    's',
  ]

  // Remove common suffixes
  for (const suffix of suffixes) {
    if (lowerWord.endsWith(suffix) && lowerWord.length > suffix.length + 2) {
      return lowerWord.slice(0, -suffix.length)
    }
  }

  return lowerWord
}

// Enhanced tokenization that preserves word relationships
const tokenizeQuery = query => {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)

  return {
    originalWords: words,
    stemmedWords: words.map(stemWord),
    phrases: generatePhrases(words),
    fullQuery: query.toLowerCase().trim(),
  }
}

// Generate phrase combinations from query words
const generatePhrases = words => {
  const phrases = []

  // Add individual words
  words.forEach(word => phrases.push([word]))

  // Add 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push([words[i], words[i + 1]])
  }

  // Add 3-word phrases if query is long enough
  if (words.length >= 3) {
    for (let i = 0; i < words.length - 2; i++) {
      phrases.push([words[i], words[i + 1], words[i + 2]])
    }
  }

  return phrases
}

// Levenshtein distance for fuzzy matching
const levenshteinDistance = (str1, str2) => {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Score how well a phrase matches in the text
const scorePhraseMatch = (textWords, textStemmed, phraseWords) => {
  if (phraseWords.length === 1) {
    // Single word matching
    const queryWord = phraseWords[0]
    const queryStemmed = stemWord(queryWord)

    for (let i = 0; i < textWords.length; i++) {
      const textWord = textWords[i]
      const textWordStemmed = textStemmed[i]

      if (textWord === queryWord) {
        return {
          match: true,
          score: 0.95,
          type: 'exact_word',
          matchedWords: [queryWord],
        }
      }
      if (textWordStemmed === queryStemmed) {
        return {
          match: true,
          score: 0.85,
          type: 'stemmed_word',
          matchedWords: [queryWord],
        }
      }
      if (textWord.includes(queryWord)) {
        return {
          match: true,
          score: 0.75,
          type: 'contains_word',
          matchedWords: [queryWord],
        }
      }
    }
  } else {
    // Multi-word phrase matching
    const phraseLength = phraseWords.length

    for (let i = 0; i <= textWords.length - phraseLength; i++) {
      const textSlice = textWords.slice(i, i + phraseLength)
      const textSliceStemmed = textStemmed.slice(i, i + phraseLength)

      // Check for exact phrase match
      if (textSlice.join(' ').includes(phraseWords.join(' '))) {
        return {
          match: true,
          score: 0.95,
          type: 'exact_phrase',
          matchedWords: phraseWords,
        }
      }

      // Check for stemmed phrase match
      const phraseStemmed = phraseWords.map(stemWord)
      if (JSON.stringify(textSliceStemmed) === JSON.stringify(phraseStemmed)) {
        return {
          match: true,
          score: 0.85,
          type: 'stemmed_phrase',
          matchedWords: phraseWords,
        }
      }

      // Check for partial phrase match (most words match)
      let matchCount = 0
      for (let j = 0; j < phraseLength; j++) {
        const queryWord = phraseWords[j]
        const queryStemmed = stemWord(queryWord)
        const textWord = textSlice[j]
        const textWordStemmed = textSliceStemmed[j]

        if (
          textWord === queryWord ||
          textWordStemmed === queryStemmed ||
          textWord.includes(queryWord) ||
          queryWord.includes(textWord)
        ) {
          matchCount++
        }
      }

      const matchRatio = matchCount / phraseLength
      if (matchRatio >= 0.6) {
        // At least 60% of words match
        return {
          match: true,
          score: 0.7 * matchRatio,
          type: 'partial_phrase',
          matchedWords: phraseWords.slice(0, matchCount),
        }
      }
    }
  }

  return { match: false, score: 0, type: 'none', matchedWords: [] }
}

// Calculate proximity bonus when multiple query words appear near each other
const calculateProximityBonus = wordMatches => {
  if (wordMatches.length < 2) return 0

  const positions = wordMatches
    .map(match => match.position)
    .sort((a, b) => a - b)
  let proximityScore = 0

  for (let i = 0; i < positions.length - 1; i++) {
    const distance = positions[i + 1] - positions[i]

    // Closer words get higher bonus
    if (distance === 1) {
      proximityScore += 0.3 // Adjacent words
    } else if (distance <= 3) {
      proximityScore += 0.2 // Words within 3 positions
    } else if (distance <= 5) {
      proximityScore += 0.1 // Words within 5 positions
    }
  }

  return Math.min(proximityScore, 0.5) // Cap the proximity bonus
}

// Enhanced fuzzy matching that handles phrases better
const enhancedFuzzyMatch = (text, queryTokens, threshold = 0.75) => {
  const textLower = text.toLowerCase()
  const textWords = textLower.split(/\s+/)
  const textStemmed = textWords.map(stemWord)

  let bestMatch = { match: false, score: 0, type: 'none', matchedWords: [] }

  // 1. Exact phrase match (highest priority)
  if (textLower.includes(queryTokens.fullQuery)) {
    return {
      match: true,
      score: 1.0,
      type: 'exact_phrase',
      matchedWords: queryTokens.originalWords,
    }
  }

  // 2. Check each phrase combination
  for (const phrase of queryTokens.phrases) {
    const phraseScore = scorePhraseMatch(textWords, textStemmed, phrase)
    if (phraseScore.score > bestMatch.score) {
      bestMatch = phraseScore
    }
  }

  // 3. Individual word matching with proximity bonus
  const wordMatches = []
  let totalWordScore = 0

  for (let i = 0; i < queryTokens.originalWords.length; i++) {
    const queryWord = queryTokens.originalWords[i]
    const queryStemmed = queryTokens.stemmedWords[i]

    // Find best match for this word
    let bestWordMatch = { score: 0, position: -1, type: 'none' }

    textWords.forEach((textWord, pos) => {
      const textStemmed = stemWord(textWord)

      // Exact match
      if (textWord === queryWord) {
        bestWordMatch = { score: 1.0, position: pos, type: 'exact' }
      }
      // Stemmed match
      else if (textStemmed === queryStemmed && bestWordMatch.score < 0.9) {
        bestWordMatch = { score: 0.9, position: pos, type: 'stemmed' }
      }
      // Contains match
      else if (textWord.includes(queryWord) && bestWordMatch.score < 0.8) {
        bestWordMatch = { score: 0.8, position: pos, type: 'contains' }
      }
      // Prefix match
      else if (
        textWord.startsWith(queryWord) &&
        queryWord.length >= 3 &&
        bestWordMatch.score < 0.75
      ) {
        bestWordMatch = { score: 0.75, position: pos, type: 'prefix' }
      }
      // Fuzzy match using Levenshtein
      else if (
        queryWord.length >= 3 &&
        textWord.length >= 3 &&
        bestWordMatch.score < 0.7
      ) {
        const distance = levenshteinDistance(textWord, queryWord)
        const similarity =
          1 - distance / Math.max(textWord.length, queryWord.length)

        if (similarity >= threshold) {
          bestWordMatch = {
            score: similarity * 0.7,
            position: pos,
            type: 'fuzzy',
          }
        }
      }
    })

    if (bestWordMatch.score > 0) {
      wordMatches.push(bestWordMatch)
      totalWordScore += bestWordMatch.score
    }
  }

  // Calculate proximity bonus for multi-word queries
  if (wordMatches.length > 1) {
    const proximityBonus = calculateProximityBonus(wordMatches)
    totalWordScore += proximityBonus
  }

  // Calculate final word-based score
  const averageWordScore =
    wordMatches.length > 0
      ? totalWordScore / queryTokens.originalWords.length
      : 0
  const wordCoverage = wordMatches.length / queryTokens.originalWords.length
  const wordBasedScore = averageWordScore * wordCoverage

  if (wordBasedScore > bestMatch.score) {
    bestMatch = {
      match: wordBasedScore > 0.3,
      score: wordBasedScore,
      type: 'word_combination',
      matchedWords: wordMatches
        .map((_, i) => queryTokens.originalWords[i])
        .filter((_, i) => wordMatches[i]),
    }
  }

  return bestMatch
}

// Helper functions (keeping existing ones that are still needed)
function highlightMatch(text, query) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        style={{
          backgroundColor: 'var(--brand-orange)', // Using brand orange
          color: 'var(--brand-white)', // Using brand white
          padding: '0 2px',
          borderRadius: '2px',
        }}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function getProductColor(product) {
  const colors = {
    pro: 'var(--brand-green)', // #00B070
    actions: 'var(--brand-blue)', // #0050C7
    express: 'var(--brand-purple)', // #8F4AFF
    insights: 'var(--brand-aqua)', // #00D4FF
  }
  return colors[product] || 'var(--brand-grey-600)'
}

function getVersionBadgeColor(version) {
  if (version === 'latest') return 'var(--brand-blue-100)' // #CBE0FF
  if (version === 'saas') return 'var(--brand-blue-400)' // #0066FF
  if (version === 'Previous') return 'var(--brand-blue-100)' // #CBE0FF
  if (version.includes('on-premise')) return 'var(--brand-blue-100)' // #CBE0FF
  if (version.match(/^[0-9\-]+$/)) return 'var(--brand-blue-100)' // #CBE0FF
  return 'var(--brand-blue-100)' // #CBE0FF
}

function getVersionTextColor(version) {
  if (version === 'saas') return 'var(--brand-white)' // #FFFFFF
  return 'var(--brand-blue)' // #0050C7
}

function formatVersionForDisplay(version) {
  if (version === 'latest') return 'latest'
  if (version === 'saas') return 'SaaS'
  if (version.includes('on-premise-')) {
    const versionNumber = version.replace('on-premise-', '').replace('-', '.')
    return `${versionNumber}`
  }
  if (version.match(/^[0-9\-]+$/)) {
    return `v${version.replace('-', '.')}`
  }
  return version
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Theme helpers with brand colors - ALWAYS USE LIGHT PALETTE
const getBackgroundColor = () => {
  return 'var(--brand-white)' // Always light background
}

const getTextColor = () => {
  return 'var(--brand-black)' // Always dark text
}

const getSelectedBackgroundColor = () => {
  return 'var(--brand-grey-200)' // Always light selection
}

// Simplified data access functions - no more async!
const getVersionMappings = (product, version) => {
  const key = `${product}-${version}`
  return ALL_MAPPINGS[key] || {}
}

const getAllVersionsForProduct = product => {
  const productMappings = {}
  let totalPages = 0
  let totalHeaders = 0

  Object.entries(ALL_MAPPINGS).forEach(([key, mappings]) => {
    if (key.startsWith(`${product}-`)) {
      const version = key.replace(`${product}-`, '')

      Object.entries(mappings).forEach(([title, data]) => {
        if (!title.startsWith('_')) {
          // Create unique key to prevent overwrites
          const uniqueKey = `${title}|||${version}`
          productMappings[uniqueKey] = {
            ...data,
            title,
            originalTitle: title,
            version: version,
          }
        }
      })

      totalPages += mappings._TOTAL_PAGES || 0
      totalHeaders += mappings._TOTAL_HEADERS || 0
    }
  })

  return {
    ...productMappings,
    _TOTAL_PAGES: totalPages,
    _TOTAL_HEADERS: totalHeaders,
    _PRODUCT: product,
    _ALL_VERSIONS_COMBINED: true,
  }
}

const getCurrentVersions = () => {
  const combinedMappings = {}
  let totalPages = 0
  let totalHeaders = 0

  Object.entries(CURRENT_VERSIONS).forEach(([product, version]) => {
    const mappings = getVersionMappings(product, version)
    if (mappings && Object.keys(mappings).length > 0) {
      Object.entries(mappings).forEach(([key, value]) => {
        if (!key.startsWith('_')) {
          combinedMappings[key] = value
        }
      })
      totalPages += mappings._TOTAL_PAGES || 0
      totalHeaders += mappings._TOTAL_HEADERS || 0
    }
  })

  return {
    ...combinedMappings,
    _TOTAL_PAGES: totalPages,
    _TOTAL_HEADERS: totalHeaders,
    _PRODUCTS: Object.keys(CURRENT_VERSIONS),
    _IS_HOMEPAGE_COMBINED: true,
  }
}

// Enhanced search data processing (same as before)
const processSearchData = (mappings, cacheKey) => {
  if (processedSearchDataCache[cacheKey])
    return processedSearchDataCache[cacheKey]

  const processed = {}
  const categories = {
    byProduct: {},
    bySection: {},
    byActivityType: {},
    suggestions: new Set(),
  }

  Object.entries(mappings).forEach(([uniqueKey, data]) => {
    if (uniqueKey.startsWith('_')) return // Skip metadata

    // EXTRACT original title from versioned key
    const title = uniqueKey.includes('|||')
      ? uniqueKey.split('|||')[0]
      : uniqueKey

    const pathContext = extractPathContext(data.filePath)
    const contentTypeInfo = analyzeContentType(
      data.url,
      data.filePath,
      data.headers,
    )
    const searchableContent = buildEnhancedSearchableContent(
      { title, ...data },
      pathContext,
      contentTypeInfo,
    )

    // USE UNIQUE KEY for storage to prevent overwrites
    processed[uniqueKey] = {
      ...data,
      title, // Use original title for display
      pathContext,
      contentTypeInfo,
      searchableContent,
    }

    // Build categories using original title
    if (!categories.byProduct[data.product])
      categories.byProduct[data.product] = []
    categories.byProduct[data.product].push(uniqueKey)

    if (!categories.bySection[pathContext.section])
      categories.bySection[pathContext.section] = []
    categories.bySection[pathContext.section].push(uniqueKey)

    if (!categories.byActivityType[contentTypeInfo.type])
      categories.byActivityType[contentTypeInfo.type] = []
    categories.byActivityType[contentTypeInfo.type].push(uniqueKey)

    // Build suggestions from headers, titles, and ID keywords
    data.headers.forEach(header => {
      const words = header.split(/\s+/).filter(word => word.length > 3)
      words.forEach(word => categories.suggestions.add(word))
    })

    const titleWords = title.split(/\s+/).filter(word => word.length > 3)
    titleWords.forEach(word => categories.suggestions.add(word))

    // Add ID keywords to suggestions
    if (data.id) {
      const idWords = data.id.split('-').filter(word => word.length > 2)
      idWords.forEach(word => categories.suggestions.add(word))
    }
  })

  categories.suggestions = Array.from(categories.suggestions)
  processedSearchDataCache[cacheKey] = processed
  searchCategoriesCache[cacheKey] = categories
  return processed
}

// Extract contextual data from file paths (same as before)
const extractPathContext = filePath => {
  const pathParts = filePath.split('/')

  // Extract version info
  const versionMatch = filePath.match(/version-([^\/]+)/)
  const version = versionMatch ? decodeURIComponent(versionMatch[1]) : 'latest'

  // Extract ALL meaningful path segments
  const allSegments = pathParts.filter(
    part =>
      part &&
      !part.endsWith('.md') &&
      !part.includes('_versioned_docs') &&
      !part.startsWith('version-'),
  )

  // Clean up segment names for better searchability
  const cleanedSegments = allSegments.map(segment =>
    decodeURIComponent(segment)
      .replace(/([A-Z])/g, ' $1')
      .replace(/%20/g, ' ')
      .replace(/[-_]/g, ' ')
      .trim(),
  )

  // Extract category hierarchy
  const productIndex = allSegments.findIndex(seg =>
    ['actions', 'express', 'pro', 'insights'].includes(seg.toLowerCase()),
  )
  const categories =
    productIndex >= 0 ? allSegments.slice(productIndex + 1) : allSegments

  // Create comprehensive searchable path terms
  const pathTerms = cleanedSegments.filter(seg => seg.length > 1)

  // Build breadcrumbs for display
  const breadcrumbs = cleanedSegments.slice(-3).join(' > ')

  return {
    version,
    categories,
    breadcrumbs,
    pathTerms,
    allSegments: cleanedSegments,
    depth: categories.length,
    section: cleanedSegments[0] ? cleanedSegments[0] : 'General',
  }
}

// Analyze URL patterns to detect content types (same as before)
const analyzeContentType = (url, filePath, headers) => {
  const urlLower = url.toLowerCase()
  const pathLower = filePath.toLowerCase()

  // Activity documentation patterns
  if (
    urlLower.includes('/list%20of%20activities/') ||
    urlLower.includes('/list of activities/')
  ) {
    return {
      type: 'activity',
      subtype: 'general-activity',
      category: 'documentation',
      searchTerms: ['activity', 'action', 'task', 'automation'],
    }
  }

  // Configuration and setup patterns
  if (urlLower.includes('/configuration/') || urlLower.includes('/config/')) {
    return {
      type: 'configuration',
      subtype: 'setup',
      category: 'setup',
      searchTerms: ['configuration', 'config', 'setup', 'settings'],
    }
  }

  // Getting started and tutorial patterns
  if (
    urlLower.includes('/getting%20started/') ||
    urlLower.includes('/getting started/')
  ) {
    return {
      type: 'tutorial',
      subtype: 'guide',
      category: 'guide',
      searchTerms: [
        'tutorial',
        'guide',
        'getting started',
        'beginner',
        'setup',
      ],
    }
  }

  // Builder and designer patterns
  if (urlLower.includes('/builder/') || urlLower.includes('/designer/')) {
    return {
      type: 'builder',
      subtype: 'tool',
      category: 'tool',
      searchTerms: ['builder', 'designer', 'create', 'design', 'tool'],
    }
  }

  // Insight and analytics patterns
  if (urlLower.includes('/insight/') || urlLower.includes('/analytics/')) {
    return {
      type: 'insight',
      subtype: 'analytics',
      category: 'analytics',
      searchTerms: ['insight', 'analytics', 'report', 'dashboard', 'metrics'],
    }
  }

  // Home page and portal patterns
  if (urlLower.includes('/home%20page/') || urlLower.includes('/portal/')) {
    return {
      type: 'portal',
      subtype: 'interface',
      category: 'interface',
      searchTerms: ['home', 'portal', 'dashboard', 'interface'],
    }
  }

  // Integration and module patterns
  if (urlLower.includes('/integration/') || urlLower.includes('/module/')) {
    return {
      type: 'integration',
      subtype: 'connectivity',
      category: 'connectivity',
      searchTerms: ['integration', 'module', 'connector', 'api', 'connection'],
    }
  }

  // Overview and introduction patterns
  if (
    urlLower.includes('overview') ||
    urlLower.includes('introduction') ||
    headers.some(
      h =>
        h.toLowerCase().includes('overview') ||
        h.toLowerCase().includes('introduction'),
    )
  ) {
    return {
      type: 'overview',
      subtype: 'conceptual',
      category: 'conceptual',
      searchTerms: ['overview', 'introduction', 'concept', 'about'],
    }
  }

  // Repository patterns
  if (urlLower.includes('/repository/')) {
    return {
      type: 'repository',
      subtype: 'management',
      category: 'organization',
      searchTerms: ['repository', 'manage', 'organize', 'workflow', 'template'],
    }
  }

  // Default content type
  return {
    type: 'reference',
    subtype: 'documentation',
    category: 'documentation',
    searchTerms: ['reference', 'documentation', 'guide'],
  }
}

// Build comprehensive searchable content (same as before)
const buildEnhancedSearchableContent = (
  entry,
  pathContext,
  contentTypeInfo,
) => {
  const primaryText = entry.title

  // Extract searchable keywords from ID field
  const idKeywords = entry.id
    ? entry.id
        .split('-')
        .filter(word => word.length > 1)
        .join(' ')
    : ''

  // Use excerpt from scanner data
  const excerpt = entry.excerpt || ''

  // Extract metadata keywords
  const metadataTerms = []
  if (entry.metadata) {
    if (entry.metadata.description)
      metadataTerms.push(entry.metadata.description)
    if (entry.metadata.keywords) metadataTerms.push(...entry.metadata.keywords)
    if (entry.metadata.tags) metadataTerms.push(...entry.metadata.tags)
    if (entry.metadata.sidebar_label)
      metadataTerms.push(entry.metadata.sidebar_label)
    if (entry.metadata.category) metadataTerms.push(entry.metadata.category)
  }

  // Include ALL searchable content
  const secondaryText = [
    ...entry.headers,
    ...pathContext.pathTerms,
    ...pathContext.allSegments,
    pathContext.breadcrumbs,
    pathContext.section,
    entry.product,
    contentTypeInfo.type,
    contentTypeInfo.category || '',
    contentTypeInfo.subtype || '',
    ...(contentTypeInfo.searchTerms || []),
    idKeywords,
    excerpt,
    ...metadataTerms,
    entry.filePath.replace(/[\/\-_\.]/g, ' '),
  ]
    .filter(Boolean)
    .join(' ')

  return {
    primaryText,
    secondaryText,
    fullText: `${primaryText} ${secondaryText}`.toLowerCase(),
    tokens: `${primaryText} ${secondaryText}`
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
    pathSearchText: pathContext.allSegments.join(' ').toLowerCase(),
    idSearchText: idKeywords.toLowerCase(),
    excerptSearchText: excerpt.toLowerCase(),
    metadataSearchText: metadataTerms.join(' ').toLowerCase(),
    contentType: contentTypeInfo.type,
    complexity: entry.complexity || 'simple',
  }
}

// Get version priority for sorting (higher number = higher priority)
const getVersionPriority = (result, searchContext) => {
  const resultVersion = result.version
  const userVersion = searchContext.currentFileVersion
  const currentVersion = CURRENT_VERSIONS[searchContext.currentProduct]
  const product = searchContext.currentProduct

  // Exact version match gets highest priority
  if (resultVersion === userVersion) {
    return 1000 // Highest priority
  }

  // Current version gets high priority (when user is on older version)
  if (resultVersion === currentVersion && !searchContext.isCurrentVersion) {
    return 900 // High priority
  }

  // For Express, SaaS gets lowest priority unless user is on SaaS
  if (product === 'express' && resultVersion === 'saas') {
    return userVersion === 'saas' ? 1000 : 100 // Lowest unless exact match
  }

  // Version proximity - closer versions get higher priority
  const proximity = calculateVersionProximity(
    resultVersion,
    userVersion,
    product,
  )
  const proximityPriority = Math.max(100, 800 - proximity) // Scale: 100-800

  return proximityPriority
}

// Calculate version proximity for intelligent sorting
const calculateVersionProximity = (version1, version2, product) => {
  // Handle identical versions
  if (version1 === version2) return 0

  // Special handling for Express SaaS (always distant unless exact match)
  if (product === 'express') {
    if (version1 === 'saas' || version2 === 'saas') {
      return version1 === version2 ? 0 : 1000 // Very high distance
    }
  }

  // Handle latest/current versions
  if (version1 === 'latest' || version2 === 'latest') {
    return 100 // Moderate distance
  }

  // Extract numerical versions for comparison
  const extractNumber = version => {
    if (product === 'express' && version.includes('on-premise-')) {
      const match = version.match(/on-premise-(\d+)-(\d+)/)
      return match ? parseFloat(`${match[1]}.${match[2]}`) : 0
    }

    if (product === 'pro' || product === 'insights') {
      const match = version.match(/(\d+)-(\d+)/)
      return match ? parseFloat(`${match[1]}.${match[2]}`) : 0
    }

    return 0
  }

  const num1 = extractNumber(version1)
  const num2 = extractNumber(version2)

  if (num1 === 0 || num2 === 0) return 500 // Unknown versions get moderate distance

  return Math.abs(num1 - num2) * 10 // Scale the difference
}

// ENHANCED relevance scoring with better phrase handling
const enhancedCalculateRelevanceScore = (
  uniqueKey,
  processedData,
  query,
  context,
) => {
  let score = 0
  const data = processedData[uniqueKey]

  if (!data) return 0

  // Tokenize the query for better phrase matching
  const queryTokens = tokenizeQuery(query)

  // Skip very short queries that aren't meaningful
  if (queryTokens.fullQuery.length < 2) return 0

  // Extract original title for scoring
  const title = data.title || uniqueKey.split('|||')[0]

  // 1. Title matches (highest priority with phrase support)
  const titleMatch = enhancedFuzzyMatch(title, queryTokens, 0.7)
  if (titleMatch.match) {
    let titleScore = titleMatch.score * 100

    // Bonus for phrase types
    if (titleMatch.type === 'exact_phrase') titleScore += 30
    else if (titleMatch.type === 'stemmed_phrase') titleScore += 25
    else if (titleMatch.type === 'partial_phrase') titleScore += 20
    else if (titleMatch.type === 'word_combination') titleScore += 15

    // Bonus for coverage (how many query words matched)
    const coverage =
      titleMatch.matchedWords.length / queryTokens.originalWords.length
    titleScore += coverage * 20

    score += titleScore
  } else {
    // If no title match for multi-word queries, heavily penalize
    if (queryTokens.originalWords.length > 1) {
      return 0
    }
  }

  // 2. ID field matches with phrase support
  if (data.searchableContent.idSearchText) {
    const idMatch = enhancedFuzzyMatch(
      data.searchableContent.idSearchText,
      queryTokens,
      0.7,
    )
    if (idMatch.match) {
      score += idMatch.score * (idMatch.type.includes('phrase') ? 45 : 35)
    }
  }

  // 3. Excerpt matches with phrase support
  if (data.searchableContent.excerptSearchText) {
    const excerptMatch = enhancedFuzzyMatch(
      data.searchableContent.excerptSearchText,
      queryTokens,
      0.7,
    )
    if (excerptMatch.match) {
      score +=
        excerptMatch.score * (excerptMatch.type.includes('phrase') ? 40 : 30)
    }
  }

  // 4. Header matches with phrase support
  let headerScore = 0
  data.headers.forEach(header => {
    const headerMatch = enhancedFuzzyMatch(header, queryTokens, 0.7)
    if (headerMatch.match) {
      headerScore +=
        headerMatch.score * (headerMatch.type.includes('phrase') ? 25 : 18)
    }
  })
  score += Math.min(headerScore, 60) // Cap header score

  // 5. Metadata matches
  if (data.searchableContent.metadataSearchText) {
    const metadataMatch = enhancedFuzzyMatch(
      data.searchableContent.metadataSearchText,
      queryTokens,
      0.7,
    )
    if (metadataMatch.match) {
      score += metadataMatch.score * 25
    }
  }

  // 6. Path matches with phrase support
  const pathMatch = enhancedFuzzyMatch(
    data.searchableContent.pathSearchText,
    queryTokens,
    0.7,
  )
  if (pathMatch.match) {
    score += pathMatch.score * 30
  }

  // 7. Individual path segment matches
  data.pathContext.allSegments.forEach(segment => {
    const segmentMatch = enhancedFuzzyMatch(segment, queryTokens, 0.7)
    if (segmentMatch.match) {
      score += segmentMatch.score * 25
    }
  })

  // 8. Secondary content matches
  const secondaryMatch = enhancedFuzzyMatch(
    data.searchableContent.secondaryText,
    queryTokens,
    0.7,
  )
  if (secondaryMatch.match) {
    score += secondaryMatch.score * 12
  }

  // 9. Content type context boost
  const contentTypeInfo = data.contentTypeInfo || data.contentType || {}
  const contentType = contentTypeInfo.type || 'reference'
  const subtype = contentTypeInfo.subtype || ''
  const lowerQuery = queryTokens.fullQuery

  if (lowerQuery.includes('activity') && contentType === 'activity') {
    score += 25
  }
  if (lowerQuery.includes('config') && contentType === 'configuration') {
    score += 25
  }
  if (lowerQuery.includes('guide') && contentType === 'tutorial') {
    score += 25
  }
  if (lowerQuery.includes('overview') && contentType === 'overview') {
    score += 25
  }
  if (lowerQuery.includes('create') && subtype.includes('creation')) {
    score += 20
  }
  if (lowerQuery.includes('setup') && contentType === 'configuration') {
    score += 20
  }

  // 10. Complexity-based scoring
  const complexity =
    data.complexity || data.searchableContent.complexity || 'simple'
  if (lowerQuery.includes('detailed') && complexity === 'detailed') {
    score += 15
  }
  if (lowerQuery.includes('simple') && complexity === 'simple') {
    score += 15
  }

  // 11. Content feature boosts
  if (lowerQuery.includes('code') && data.hasCode) {
    score += 10
  }
  if (lowerQuery.includes('example') && data.hasCode) {
    score += 10
  }

  // Minimum score threshold - be more generous for phrase matches
  const minThreshold = queryTokens.originalWords.length > 1 ? 20 : 10
  if (score < minThreshold) {
    return 0
  }

  // 12. Product-specific boost
  if (data.product === context.currentProduct) {
    score += 45
  }

  // 13. Version boosts
  if (data.version === context.currentFileVersion) {
    score += 25 // Small boost for exact match
  }
  // Current version gets small boost (if user is not on current)
  else if (
    data.version === CURRENT_VERSIONS[context.currentProduct] &&
    !context.isCurrentVersion
  ) {
    score += 15 // Small boost for current version
  }
  // Small proximity boost
  else {
    const proximity = calculateVersionProximity(
      data.version,
      context.currentFileVersion,
      context.currentProduct,
    )
    const proximityBoost = Math.max(0, 10 - proximity / 10)
    score += proximityBoost
  }

  // 14. Content richness boost
  let richnessScore = Math.min(data.headers.length * 1.5, 15)

  if (data.hasCode) richnessScore += 5
  if (data.hasImages) richnessScore += 3
  if (data.excerpt && data.excerpt.length > 50) richnessScore += 5
  if (complexity === 'detailed') richnessScore += 8
  if (complexity === 'moderate') richnessScore += 4

  score += Math.min(richnessScore, 25)

  // 15. Content type relevance (if filtering)
  if (context.contentTypeFilter && contentType === context.contentTypeFilter) {
    score += 22
  }

  return score
}

// Generate smart suggestions (same as before but could be enhanced for phrases)
const generateSuggestions = (query, categories) => {
  if (!query || query.length < 2) return []

  const suggestions = new Set()
  const queryTokens = tokenizeQuery(query)

  categories.suggestions.forEach(suggestion => {
    const match = enhancedFuzzyMatch(suggestion, queryTokens, 0.6)
    if (match.match && suggestion.length > query.length) {
      suggestions.add(suggestion)
    }
  })

  Object.keys(categories.byProduct).forEach(product => {
    const match = enhancedFuzzyMatch(product, queryTokens, 0.7)
    if (match.match) {
      suggestions.add(`${product} documentation`)
      suggestions.add(`${product} activities`)
    }
  })

  Object.keys(categories.bySection).forEach(section => {
    const match = enhancedFuzzyMatch(section, queryTokens, 0.7)
    if (match.match) {
      suggestions.add(section)
    }
  })

  return Array.from(suggestions).slice(0, 5)
}

// Version detection (same as before)
const getCurrentSectionAndVersion = () => {
  const path = window.location.pathname
  const segments = path.split('/').filter(Boolean)

  let currentProduct = 'default'
  let currentUrlVersion = null
  let currentFileVersion = 'latest'
  let isCurrentVersion = false

  // Find the product position in the segments array
  const productIndex = segments.findIndex(seg =>
    ['actions', 'express', 'pro', 'insights'].includes(seg.toLowerCase()),
  )

  if (productIndex >= 0) {
    currentProduct = segments[productIndex].toLowerCase()

    // Check the segment immediately after the product for version patterns
    if (segments[productIndex + 1]) {
      const versionSegment = decodeURIComponent(segments[productIndex + 1])

      // Check if this segment looks like a version (not a regular doc path)
      const isVersionSegment =
        versionSegment.match(/^[0-9]+\.[0-9]+$/) || // x.y format (Pro/Insights)
        versionSegment.startsWith('On-Premise') || // Express versions
        versionSegment === 'SaaS' || // Express SaaS
        versionSegment.includes('Premise') // URL encoded versions

      if (isVersionSegment) {
        currentUrlVersion = versionSegment
        // Convert URL version to file version
        currentFileVersion =
          VERSION_URL_TO_FILE[versionSegment] ||
          VERSION_URL_TO_FILE[versionSegment.replace(/%20/g, ' ')] ||
          CURRENT_VERSIONS[currentProduct]
        isCurrentVersion =
          currentFileVersion === CURRENT_VERSIONS[currentProduct]
      } else {
        // Next segment is not a version = current version
        currentFileVersion = CURRENT_VERSIONS[currentProduct]
        isCurrentVersion = true
      }
    } else {
      // No segment after product = current version
      currentFileVersion = CURRENT_VERSIONS[currentProduct]
      isCurrentVersion = true
    }
  }

  console.log('🔍 VERSION DETECTION:')
  console.log(`  - URL: ${path}`)
  console.log(`  - Product: ${currentProduct}`)
  console.log(`  - File Version: "${currentFileVersion}"`)
  console.log(`  - Is Current Version: ${isCurrentVersion}`)

  return {
    currentProduct,
    currentUrlVersion,
    currentFileVersion,
    isCurrentVersion,
  }
}

const CustomSearch = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [currentProduct, setCurrentProduct] = useState('default')
  const [currentFileVersion, setCurrentFileVersion] = useState('latest')
  const [isCurrentVersion, setIsCurrentVersion] = useState(true)
  const [filters, setFilters] = useState({
    contentType: '',
    section: '',
    otherFilter: '',
  })

  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const history = useHistory()
  const location = useLocation()

  // No more async loading needed!
  useEffect(() => {
    console.log('✅ All mappings loaded via direct imports')
    console.log('📊 Available mappings:', Object.keys(ALL_MAPPINGS))
  }, [])

  // Detect current product and version context from URL
  useEffect(() => {
    const detectContext = () => {
      const context = getCurrentSectionAndVersion()
      return {
        product: context.currentProduct,
        fileVersion: context.currentFileVersion,
        isCurrentVersion: context.isCurrentVersion,
      }
    }

    const context = detectContext()
    setCurrentProduct(context.product)
    setCurrentFileVersion(context.fileVersion)
    setIsCurrentVersion(context.isCurrentVersion)

    console.log('🔍 Context Updated:', {
      product: context.product,
      fileVersion: context.fileVersion,
      isCurrentVersion: context.isCurrentVersion,
    })

    // Clear search when changing context
    if (query) {
      setQuery('')
      setResults([])
      setIsOpen(false)
    }
  }, [location.pathname])

  // ENHANCED search function with phrase matching!
  const performEnhancedSearchWithPhrases = useCallback(
    (searchQuery, context = {}) => {
      if (!searchQuery.trim()) {
        setResults([])
        setSuggestions([])
        setIsLoading(false)
        return
      }

      // Get mappings - no async needed!
      let searchMappings
      let cacheKey

      if (currentProduct === 'default') {
        cacheKey = 'homepage-current'
        searchMappings = getCurrentVersions()
      } else {
        cacheKey = `${currentProduct}-all-versions`
        searchMappings = getAllVersionsForProduct(currentProduct)
      }

      if (!searchMappings || Object.keys(searchMappings).length === 0) {
        console.warn(`No mappings available for ${currentProduct}`)
        setResults([])
        setSuggestions([])
        setIsLoading(false)
        return
      }

      // Process search data
      const processedData = processSearchData(searchMappings, cacheKey)
      const searchCategories = searchCategoriesCache[cacheKey]

      // Build search context
      const searchContext = {
        currentProduct,
        currentFileVersion,
        isCurrentVersion:
          currentFileVersion === CURRENT_VERSIONS[currentProduct],
        contentTypeFilter: filters.contentType,
        ...context,
      }

      console.log('🔍 ENHANCED SEARCH CONTEXT:', searchContext)

      // Generate suggestions (enhanced with phrase support)
      if (searchCategories) {
        const newSuggestions = generateSuggestions(
          searchQuery,
          searchCategories,
        )
        setSuggestions(newSuggestions)
      }

      // Get entries to search
      const entries = Object.keys(processedData).filter(uniqueKey => {
        const data = processedData[uniqueKey]
        // Homepage: current versions, Product pages: all versions of current product
        if (currentProduct === 'default') return true
        return data.product === currentProduct
      })

      console.log(
        `🔍 Found ${entries.length} entries for enhanced phrase search`,
      )

      // Calculate relevance scores using ENHANCED phrase matching
      const allResults = entries
        .map(uniqueKey => {
          const data = processedData[uniqueKey]
          const score = enhancedCalculateRelevanceScore(
            uniqueKey,
            processedData,
            searchQuery,
            searchContext,
          )

          if (score === 0) return null

          // Extract original title
          const title = data.title || uniqueKey.split('|||')[0]

          // Calculate version priority info
          const isExactVersion =
            data.version === searchContext.currentFileVersion
          const isCurrentVersionResult =
            data.version === CURRENT_VERSIONS[searchContext.currentProduct]
          const versionPriority = getVersionPriority(
            { version: data.version },
            searchContext,
          )

          return {
            title,
            product: data.product,
            version: data.version,
            url: data.url,
            breadcrumbs: data.pathContext.breadcrumbs,
            contentType: data.contentTypeInfo
              ? data.contentTypeInfo.type
              : 'reference',
            subtype: data.contentTypeInfo ? data.contentTypeInfo.subtype : '',
            complexity: data.complexity || 'simple',
            excerpt: data.excerpt || '',
            score,
            isExactVersion,
            isCurrentVersion: isCurrentVersionResult,
            versionPriority,
            data,
          }
        })
        .filter(Boolean)

      let finalResults

      if (currentProduct === 'default') {
        // HOMEPAGE: Enhanced scoring first, then Actions first
        finalResults = allResults
          .sort((a, b) => {
            // First, prioritize by relevance score (phrase matches will score MUCH higher)
            if (Math.abs(a.score - b.score) > 15) {
              return b.score - a.score
            }
            // Then Actions first on homepage
            if (a.product === 'actions' && b.product !== 'actions') return -1
            if (b.product === 'actions' && a.product !== 'actions') return 1
            // Finally by score
            return b.score - a.score
          })
          .slice(0, 8)
      } else {
        // PRODUCT PAGE: Enhanced scoring first, then version priority
        finalResults = allResults
          .sort((a, b) => {
            // If one result has significantly higher relevance score, prioritize it
            const scoreDiff = b.score - a.score
            if (Math.abs(scoreDiff) > 30) {
              // Increased threshold for phrase matches
              return scoreDiff
            }

            // Otherwise use version priority
            const aVersionPriority = getVersionPriority(a, searchContext)
            const bVersionPriority = getVersionPriority(b, searchContext)

            if (aVersionPriority !== bVersionPriority) {
              return bVersionPriority - aVersionPriority
            }

            // Finally by relevance score
            return b.score - a.score
          })
          .slice(0, 8)
      }

      console.log('🔍 ENHANCED PHRASE SEARCH RESULTS:')
      finalResults.forEach((result, i) => {
        console.log(
          `  ${i + 1}. ${result.title} (v${
            result.version
          }) - Score: ${result.score.toFixed(2)}`,
        )
      })

      setResults(finalResults)
      setIsLoading(false)
    },
    [currentProduct, currentFileVersion, filters.contentType],
  )

  // Re-run search when context changes (if there's an active query)
  useEffect(() => {
    if (query.trim() && isOpen) {
      console.log(
        '🔍 Context changed, re-running enhanced phrase search for:',
        query,
      )
      setIsLoading(true)
      performEnhancedSearchWithPhrases(query)
    }
  }, [currentProduct, currentFileVersion, performEnhancedSearchWithPhrases])

  // Debounced search function with enhanced phrase matching
  const debouncedSearch = useCallback(
    debounce(searchQuery => {
      performEnhancedSearchWithPhrases(searchQuery)
    }, 300),
    [performEnhancedSearchWithPhrases],
  )

  // Handle search input changes
  const handleInputChange = e => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    if (value.trim()) {
      setIsLoading(true)
      setIsOpen(true)
      debouncedSearch(value)
    } else {
      setResults([])
      setSuggestions([])
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
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // Handle suggestion click
  const handleSuggestionClick = suggestion => {
    setQuery(suggestion)
    performEnhancedSearchWithPhrases(suggestion)
    setSelectedIndex(-1)
  }

  // Get product-specific focus color using brand colors
  const getProductFocusColor = () => {
    const colors = {
      express: 'var(--brand-purple)', // #8F4AFF
      actions: 'var(--brand-blue)', // #0050C7
      pro: 'var(--brand-green)', // #00B070
      insights: 'var(--brand-aqua)', // #00D4FF
    }
    return colors[currentProduct] || 'var(--brand-blue)'
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={searchRef}
      className='custom-search'
      style={{ position: 'relative', width: '280px' }}
    >
      <div className='search-input-container' style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type='text'
          placeholder={
            currentProduct === 'default'
              ? 'Search all docs...'
              : `Search ${currentProduct}...`
          }
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={e => {
            if (query) setIsOpen(true)
            const focusColor = getProductFocusColor()
            e.target.style.borderColor = focusColor
            e.target.style.boxShadow = `0 0 0 2px ${focusColor}33`
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
          aria-label='Search documentation'
          aria-expanded={isOpen}
          aria-autocomplete='list'
          aria-controls={isOpen ? 'search-results' : undefined}
        />

        {isLoading && (
          <div
            className='search-loading'
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: 'var(--brand-grey-600)',
            }}
          >
            ⏳
          </div>
        )}
      </div>

      {isOpen && (
        <Paper
          ref={dropdownRef}
          id='search-results'
          role='listbox'
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            marginTop: '6px',
            height: '300px',
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            border: `1px solid var(--brand-grey-400)`,
          }}
        >
          {/* Loading State */}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                padding: 2,
              }}
            >
              <CircularProgress
                size={16}
                sx={{ color: getProductFocusColor() }}
              />
              <Typography
                variant='body2'
                sx={{ color: 'var(--brand-grey-600)' }}
              >
                Searching...
              </Typography>
            </Box>
          )}

          {/* Results Content */}
          {!isLoading && (
            <>
              {results.length > 0 ? (
                <List
                  sx={{
                    height: '300px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    padding: 0,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'var(--brand-grey-300)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'var(--brand-grey-600)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: 'var(--brand-grey-500)',
                    },
                  }}
                >
                  {results.map((result, index) => (
                    <React.Fragment key={`result-${index}`}>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={index === selectedIndex}
                          onClick={() => navigateToResult(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 0.5,
                            padding: '10px 14px',
                            position: 'relative',
                            backgroundColor: 'transparent',
                            '&.Mui-selected': {
                              backgroundColor: getSelectedBackgroundColor(),
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '3px',
                                backgroundColor: getProductFocusColor(),
                              },
                            },
                            '&:hover': {
                              backgroundColor: getSelectedBackgroundColor(),
                            },
                          }}
                        >
                          {/* Top Row: Badges + Title */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              width: '100%',
                            }}
                          >
                            {/* Product Badge */}
                            <Chip
                              label={result.product.toUpperCase()}
                              size='small'
                              sx={{
                                backgroundColor: getProductColor(
                                  result.product,
                                ),
                                color: 'var(--brand-white)',
                                fontSize: '9px',
                                height: '20px',
                                minWidth: '50px',
                                fontWeight: '600',
                                fontFamily:
                                  'SeasonMix, var(--ifm-font-family-base)',
                                '& .MuiChip-label': {
                                  paddingX: '6px',
                                },
                              }}
                            />

                            {/* Version Badge */}
                            {result.version && result.version !== 'latest' && (
                              <Chip
                                label={formatVersionForDisplay(result.version)}
                                size='small'
                                variant='outlined'
                                sx={{
                                  backgroundColor: getVersionBadgeColor(
                                    result.version,
                                  ),
                                  color: getVersionTextColor(result.version),
                                  fontSize: '8px',
                                  height: '18px',
                                  maxWidth: '55px',
                                  borderColor: getVersionBadgeColor(
                                    result.version,
                                  ),
                                  fontFamily:
                                    'SeasonMix, var(--ifm-font-family-base)',
                                  '& .MuiChip-label': {
                                    paddingX: '4px',
                                  },
                                }}
                                title={result.version}
                              />
                            )}

                            {/* Title with enhanced highlighting */}
                            <Typography
                              variant='body2'
                              sx={{
                                fontWeight: '600',
                                fontSize: '13px',
                                lineHeight: 1.3,
                                flex: 1,
                                wordBreak: 'break-word',
                                color: getTextColor(),
                                fontFamily:
                                  'SeasonMix, var(--ifm-font-family-base)',
                              }}
                            >
                              {highlightMatch(result.title, query)}
                            </Typography>
                          </Box>

                          {/* Bottom Row: Breadcrumbs */}
                          {result.breadcrumbs && (
                            <Typography
                              variant='caption'
                              sx={{
                                fontSize: '11px',
                                lineHeight: 1.2,
                                marginLeft: '66px',
                                opacity: 0.8,
                                color: 'var(--brand-grey-600)',
                                fontFamily:
                                  'SeasonMix, var(--ifm-font-family-base)',
                              }}
                            >
                              {result.breadcrumbs}
                            </Typography>
                          )}
                        </ListItemButton>
                      </ListItem>
                      {index < results.length - 1 && (
                        <Divider
                          sx={{ borderColor: 'var(--brand-grey-400)' }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                /* No Results */
                <Box
                  sx={{
                    padding: 4,
                    textAlign: 'center',
                    color: 'var(--brand-grey-600)',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ opacity: 0.5, marginBottom: 1 }}
                  >
                    🔍
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 500,
                      marginBottom: 0.5,
                      color: getTextColor(),
                      fontFamily: 'SeasonMix, var(--ifm-font-family-base)',
                    }}
                  >
                    No results found
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{
                      opacity: 0.7,
                      color: 'var(--brand-grey-600)',
                      fontFamily: 'SeasonMix, var(--ifm-font-family-base)',
                    }}
                  >
                    {currentProduct !== 'default'
                      ? `Try different terms or search all products`
                      : 'Try different search terms'}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      )}
    </div>
  )
}

export default CustomSearch
