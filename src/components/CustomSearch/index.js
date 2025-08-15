/**
 * Simplified Custom React Search Component - Actions Only
 * No more dynamic loading - everything imported at build time
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

// Direct imports - Actions only!
import actionsLatest from '../../../static/data/enhanced-title-mappings-actions-latest.json'

// Simple mapping object - Actions only
const ALL_MAPPINGS = {
  'actions-latest': actionsLatest,
}

// Current versions per product - Actions only
const CURRENT_VERSIONS = {
  actions: 'latest',
}

// Version mapping: URL format → File format - Actions only
const VERSION_URL_TO_FILE = {
  null: 'latest',
  undefined: 'latest',
}

// Cache for processed search data
let processedSearchDataCache = {}
let searchCategoriesCache = {}

// Helper functions
function highlightMatch(text, query) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        style={{
          backgroundColor: 'var(--brand-blue)', // #0050C7 - Actions primary blue
          color: 'var(--brand-white)', // #FFFFFF - Brand white text
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
  return 'var(--brand-blue)' // #0050C7 - Actions primary blue
}

function getVersionBadgeColor(version) {
  return 'var(--brand-blue-100)' // #CBE0FF - Light blue background
}

function getVersionTextColor(version) {
  return 'var(--brand-blue)' // #0050C7 - Primary blue text
}

function formatVersionForDisplay(version) {
  return 'latest'
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

// Simplified data access functions - Actions only!
const getVersionMappings = (product, version) => {
  const key = `${product}-${version}`
  const result = ALL_MAPPINGS[key] || {}

  console.log('🔍 getVersionMappings:', {
    product,
    version,
    key,
    hasResult: !!result && Object.keys(result).length > 0,
    allMappingsKeys: Object.keys(ALL_MAPPINGS),
    resultKeys: Object.keys(result).slice(0, 10), // First 10 keys only
  })

  return result
}

const getCurrentVersions = () => {
  try {
    const mappings = getVersionMappings('actions', 'latest')

    console.log('🔍 getCurrentVersions - raw mappings:', {
      mappings,
      keys: Object.keys(mappings || {}),
      hasData: !!mappings && Object.keys(mappings).length > 0,
    })

    if (!mappings || Object.keys(mappings).length === 0) {
      console.warn('No mappings found for actions-latest')
      return {}
    }

    const combinedMappings = {}
    let totalPages = 0
    let totalHeaders = 0

    Object.entries(mappings).forEach(([key, value]) => {
      if (!key.startsWith('_')) {
        combinedMappings[key] = value
      }
    })

    totalPages += mappings._TOTAL_PAGES || 0
    totalHeaders += mappings._TOTAL_HEADERS || 0

    const result = {
      ...combinedMappings,
      _TOTAL_PAGES: totalPages,
      _TOTAL_HEADERS: totalHeaders,
      _PRODUCTS: ['actions'],
      _IS_HOMEPAGE_COMBINED: true,
    }

    console.log('🔍 getCurrentVersions - final result:', {
      resultKeys: Object.keys(result),
      totalMappings: Object.keys(combinedMappings).length,
    })

    return result
  } catch (error) {
    console.error('Error in getCurrentVersions:', error)
    return {}
  }
}

// Enhanced search data processing
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

  console.log('🔍 Processing search data:', { mappings, cacheKey })

  Object.entries(mappings).forEach(([uniqueKey, data]) => {
    if (uniqueKey.startsWith('_')) return // Skip metadata

    // Safety check for data structure
    if (!data || typeof data !== 'object') {
      console.warn('Invalid data for key:', uniqueKey, data)
      return
    }

    const title = uniqueKey.includes('|||')
      ? uniqueKey.split('|||')[0]
      : uniqueKey

    // Ensure required properties exist with defaults
    const safeData = {
      filePath: '',
      url: '',
      headers: [],
      product: 'actions',
      id: '',
      excerpt: '',
      ...data, // Override with actual data if present
    }

    const pathContext = extractPathContext(safeData.filePath)
    const contentTypeInfo = analyzeContentType(
      safeData.url,
      safeData.filePath,
      safeData.headers,
    )
    const searchableContent = buildEnhancedSearchableContent(
      { title, ...safeData },
      pathContext,
      contentTypeInfo,
    )

    processed[uniqueKey] = {
      ...safeData,
      title,
      pathContext,
      contentTypeInfo,
      searchableContent,
    }

    // Build categories
    if (!categories.byProduct[safeData.product])
      categories.byProduct[safeData.product] = []
    categories.byProduct[safeData.product].push(uniqueKey)

    if (!categories.bySection[pathContext.section])
      categories.bySection[pathContext.section] = []
    categories.bySection[pathContext.section].push(uniqueKey)

    if (!categories.byActivityType[contentTypeInfo.type])
      categories.byActivityType[contentTypeInfo.type] = []
    categories.byActivityType[contentTypeInfo.type].push(uniqueKey)

    // Build suggestions from headers, titles, and ID keywords
    if (Array.isArray(safeData.headers)) {
      safeData.headers.forEach(header => {
        if (typeof header === 'string') {
          const words = header.split(/\s+/).filter(word => word.length > 3)
          words.forEach(word => categories.suggestions.add(word))
        }
      })
    }

    const titleWords = title.split(/\s+/).filter(word => word.length > 3)
    titleWords.forEach(word => categories.suggestions.add(word))

    // Add ID keywords to suggestions
    if (safeData.id && typeof safeData.id === 'string') {
      const idWords = safeData.id.split('-').filter(word => word.length > 2)
      idWords.forEach(word => categories.suggestions.add(word))
    }
  })

  categories.suggestions = Array.from(categories.suggestions)
  processedSearchDataCache[cacheKey] = processed
  searchCategoriesCache[cacheKey] = categories

  console.log('✅ Processed search data:', {
    processedCount: Object.keys(processed).length,
    categoriesCount: categories.suggestions.length,
  })

  return processed
}

// Extract contextual data from file paths
const extractPathContext = filePath => {
  // Safety check for undefined or null filePath
  if (!filePath || typeof filePath !== 'string') {
    console.warn('extractPathContext: Invalid filePath:', filePath)
    return {
      version: 'latest',
      categories: [],
      breadcrumbs: 'Actions',
      pathTerms: [],
      allSegments: ['Actions'],
      depth: 0,
      section: 'Actions',
    }
  }

  const pathParts = filePath.split('/')

  const version = 'latest'

  // Extract ALL meaningful path segments
  const allSegments = pathParts.filter(
    part =>
      part &&
      !part.endsWith('.mdx') &&
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
    ['actions'].includes(seg.toLowerCase()),
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
    breadcrumbs: breadcrumbs || 'Actions',
    pathTerms,
    allSegments: cleanedSegments.length > 0 ? cleanedSegments : ['Actions'],
    depth: categories.length,
    section: cleanedSegments[0] ? cleanedSegments[0] : 'Actions',
  }
}

// Analyze URL patterns to detect content types - updated for hyphenated structure
const analyzeContentType = (url, filePath, headers) => {
  const urlLower = url.toLowerCase()
  const pathLower = filePath.toLowerCase()

  // Activity-Repository patterns (main activities section)
  if (
    urlLower.includes('/activity-repository/') ||
    pathLower.includes('/activity-repository/')
  ) {
    return {
      type: 'activity',
      subtype: 'general-activity',
      category: 'documentation',
      searchTerms: ['activity', 'action', 'task', 'automation'],
    }
  }

  // Support-and-Troubleshooting patterns
  if (
    urlLower.includes('/support-and-troubleshooting/') ||
    pathLower.includes('/support-and-troubleshooting/')
  ) {
    return {
      type: 'reference',
      subtype: 'troubleshooting',
      category: 'support',
      searchTerms: ['support', 'troubleshooting', 'help', 'issues'],
    }
  }

  // Creating-Self-Service-Forms patterns
  if (
    urlLower.includes('/creating-self-service-forms/') ||
    pathLower.includes('/creating-self-service-forms/')
  ) {
    return {
      type: 'tutorial',
      subtype: 'self-service',
      category: 'forms',
      searchTerms: ['self-service', 'forms', 'create', 'tutorial'],
    }
  }

  // Developing-Custom-Activities patterns
  if (
    urlLower.includes('/developing-custom-activities/') ||
    pathLower.includes('/developing-custom-activities/')
  ) {
    return {
      type: 'tutorial',
      subtype: 'development',
      category: 'development',
      searchTerms: ['development', 'custom', 'activities', 'coding'],
    }
  }

  // Automation-Use-Cases patterns
  if (
    urlLower.includes('/automation-use-cases/') ||
    pathLower.includes('/automation-use-cases/')
  ) {
    return {
      type: 'tutorial',
      subtype: 'use-cases',
      category: 'examples',
      searchTerms: ['automation', 'use cases', 'examples', 'scenarios'],
    }
  }

  // Building-Your-Workflow patterns
  if (
    urlLower.includes('/building-your-workflow/') ||
    pathLower.includes('/building-your-workflow/')
  ) {
    return {
      type: 'tutorial',
      subtype: 'workflow-guide',
      category: 'learning',
      searchTerms: ['workflow', 'building', 'guide', 'tutorial'],
    }
  }

  // Getting-Started patterns
  if (
    urlLower.includes('/getting-started/') ||
    pathLower.includes('/getting-started/')
  ) {
    return {
      type: 'tutorial',
      subtype: 'getting-started',
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

  // Product-Navigation patterns
  if (
    urlLower.includes('/product-navigation/') ||
    pathLower.includes('/product-navigation/')
  ) {
    return {
      type: 'reference',
      subtype: 'navigation',
      category: 'interface',
      searchTerms: ['navigation', 'interface', 'ui', 'product'],
    }
  }

  // Configuration patterns (general)
  if (urlLower.includes('/configuration/') || urlLower.includes('/config/')) {
    return {
      type: 'configuration',
      subtype: 'setup',
      category: 'setup',
      searchTerms: ['configuration', 'config', 'setup', 'settings'],
    }
  }

  // Workflow-Designer patterns
  if (
    urlLower.includes('/workflow-designer/') ||
    pathLower.includes('/workflow-designer/')
  ) {
    return {
      type: 'builder',
      subtype: 'workflow-designer',
      category: 'tool',
      searchTerms: [
        'workflow',
        'designer',
        'builder',
        'create',
        'design',
        'tool',
      ],
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

  // Insight patterns
  if (urlLower.includes('/insight/')) {
    return {
      type: 'insight',
      subtype: 'analytics',
      category: 'analytics',
      searchTerms: ['insight', 'analytics', 'report', 'dashboard', 'metrics'],
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

  // Default content type
  return {
    type: 'reference',
    subtype: 'documentation',
    category: 'documentation',
    searchTerms: ['reference', 'documentation', 'guide'],
  }
}

// Build comprehensive searchable content
const buildEnhancedSearchableContent = (
  entry,
  pathContext,
  contentTypeInfo,
) => {
  const primaryText = entry.title || ''

  // Extract searchable keywords from ID field
  const idKeywords =
    entry.id && typeof entry.id === 'string'
      ? entry.id
          .split('-')
          .filter(word => word.length > 1)
          .join(' ')
      : ''

  // Use excerpt from scanner data
  const excerpt = entry.excerpt || ''

  // Extract metadata keywords
  const metadataTerms = []
  if (entry.metadata && typeof entry.metadata === 'object') {
    if (entry.metadata.description)
      metadataTerms.push(entry.metadata.description)
    if (Array.isArray(entry.metadata.keywords))
      metadataTerms.push(...entry.metadata.keywords)
    if (Array.isArray(entry.metadata.tags))
      metadataTerms.push(...entry.metadata.tags)
    if (entry.metadata.sidebar_label)
      metadataTerms.push(entry.metadata.sidebar_label)
    if (entry.metadata.category) metadataTerms.push(entry.metadata.category)
  }

  // Include ALL searchable content with safety checks
  const secondaryText = [
    ...(Array.isArray(entry.headers) ? entry.headers : []),
    ...(Array.isArray(pathContext.pathTerms) ? pathContext.pathTerms : []),
    ...(Array.isArray(pathContext.allSegments) ? pathContext.allSegments : []),
    pathContext.breadcrumbs || '',
    pathContext.section || '',
    entry.product || 'actions',
    contentTypeInfo.type || '',
    contentTypeInfo.category || '',
    contentTypeInfo.subtype || '',
    ...(Array.isArray(contentTypeInfo.searchTerms)
      ? contentTypeInfo.searchTerms
      : []),
    idKeywords,
    excerpt,
    ...metadataTerms,
    (entry.filePath || '').replace(/[\/\-_\.]/g, ' '),
  ]
    .filter(Boolean)
    .filter(item => typeof item === 'string')
    .join(' ')

  return {
    primaryText,
    secondaryText,
    fullText: `${primaryText} ${secondaryText}`.toLowerCase(),
    tokens: `${primaryText} ${secondaryText}`
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
    pathSearchText: (Array.isArray(pathContext.allSegments)
      ? pathContext.allSegments.join(' ')
      : ''
    ).toLowerCase(),
    idSearchText: idKeywords.toLowerCase(),
    excerptSearchText: excerpt.toLowerCase(),
    metadataSearchText: metadataTerms.join(' ').toLowerCase(),
    contentType: contentTypeInfo.type || 'reference',
    complexity: entry.complexity || 'simple',
  }
}

// Fuzzy matching
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

const fuzzyMatch = (text, query, threshold = 0.75) => {
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()

  // Exact match (highest score)
  if (textLower.includes(queryLower)) {
    return { match: true, score: 1.0, type: 'exact' }
  }

  // For very short queries, be more flexible
  if (queryLower.length <= 2) {
    if (queryLower.length === 2) {
      const words = textLower.split(/\s+/)
      for (const word of words) {
        if (word.startsWith(queryLower)) {
          return { match: true, score: 0.8, type: 'prefix' }
        }
      }
    }
    return { match: false, score: 0, type: 'none' }
  }

  // Word boundary match
  const words = textLower.split(/\s+/)
  for (const word of words) {
    if (word.includes(queryLower)) {
      return { match: true, score: 0.9, type: 'word' }
    }

    if (word.startsWith(queryLower) && queryLower.length >= 2) {
      return { match: true, score: 0.85, type: 'prefix' }
    }
  }

  // Fuzzy match for typos
  if (queryLower.length >= 3) {
    for (const word of words) {
      if (word.length >= 3) {
        const distance = levenshteinDistance(word, queryLower)
        const similarity =
          1 - distance / Math.max(word.length, queryLower.length)

        if (similarity >= threshold) {
          return { match: true, score: similarity * 0.75, type: 'fuzzy' }
        }
      }
    }
  }

  return { match: false, score: 0, type: 'none' }
}

// Enhanced relevance scoring
const calculateRelevanceScore = (uniqueKey, processedData, query, context) => {
  let score = 0
  const lowerQuery = query.toLowerCase()
  const data = processedData[uniqueKey]

  if (!data) return 0

  // Extract original title for scoring
  const title = data.title || uniqueKey.split('|||')[0]

  // Title matches (highest priority)
  const titleMatch = fuzzyMatch(title, query, 0.75)
  if (titleMatch.match) {
    let titleScore = titleMatch.score * (titleMatch.type === 'exact' ? 100 : 75)
    if (title.toLowerCase().startsWith(lowerQuery)) {
      titleScore += 25
    }
    score += titleScore
  } else {
    if (query.length <= 2) {
      return 0
    }
  }

  // ID field matches
  if (data.searchableContent.idSearchText) {
    const idMatch = fuzzyMatch(data.searchableContent.idSearchText, query, 0.75)
    if (idMatch.match) {
      score += idMatch.score * (idMatch.type === 'exact' ? 40 : 30)
    }
  }

  // Excerpt matches
  if (data.searchableContent.excerptSearchText) {
    const excerptMatch = fuzzyMatch(
      data.searchableContent.excerptSearchText,
      query,
      0.75,
    )
    if (excerptMatch.match) {
      score += excerptMatch.score * (excerptMatch.type === 'exact' ? 35 : 25)
    }
  }

  // Header matches
  let headerScore = 0
  if (Array.isArray(data.headers)) {
    data.headers.forEach(header => {
      if (typeof header === 'string') {
        const headerMatch = fuzzyMatch(header, query, 0.75)
        if (headerMatch.match) {
          headerScore += headerMatch.score * 18
        }
      }
    })
  }
  score += Math.min(headerScore, 50)

  // Metadata matches
  if (data.searchableContent.metadataSearchText) {
    const metadataMatch = fuzzyMatch(
      data.searchableContent.metadataSearchText,
      query,
      0.75,
    )
    if (metadataMatch.match) {
      score += metadataMatch.score * 20
    }
  }

  // Content type relevance
  const contentTypeInfo = data.contentTypeInfo || data.contentType || {}
  if (contentTypeInfo.searchTerms) {
    const contentTypeMatch = fuzzyMatch(
      contentTypeInfo.searchTerms.join(' '),
      query,
      0.7,
    )
    if (contentTypeMatch.match) {
      score += contentTypeMatch.score * 15
    }
  }

  // Path matches
  const pathMatch = fuzzyMatch(
    data.searchableContent.pathSearchText,
    query,
    0.75,
  )
  if (pathMatch.match) {
    score += pathMatch.score * 25
  }

  // Specific path segment matches
  if (Array.isArray(data.pathContext.allSegments)) {
    data.pathContext.allSegments.forEach(segment => {
      if (typeof segment === 'string') {
        const segmentMatch = fuzzyMatch(segment, query, 0.75)
        if (segmentMatch.match) {
          score +=
            segmentMatch.score * (segmentMatch.type === 'exact' ? 30 : 20)
        }
      }
    })
  }

  // Secondary content matches
  const secondaryMatch = fuzzyMatch(
    data.searchableContent.secondaryText,
    query,
    0.75,
  )
  if (secondaryMatch.match) {
    score += secondaryMatch.score * 12
  }

  // Content type context boost
  const contentType = contentTypeInfo.type || 'reference'
  const subtype = contentTypeInfo.subtype || ''

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

  // Complexity-based scoring
  const complexity =
    data.complexity || data.searchableContent.complexity || 'simple'
  if (lowerQuery.includes('detailed') && complexity === 'detailed') {
    score += 15
  }
  if (lowerQuery.includes('simple') && complexity === 'simple') {
    score += 15
  }

  // Content feature boosts
  if (lowerQuery.includes('code') && data.hasCode) {
    score += 10
  }
  if (lowerQuery.includes('example') && data.hasCode) {
    score += 10
  }

  // Minimum score threshold
  if (score < 10) {
    return 0
  }

  // Content richness boost
  let richnessScore = 0
  if (Array.isArray(data.headers)) {
    richnessScore = Math.min(data.headers.length * 1.5, 15)
  }

  if (data.hasCode) richnessScore += 5
  if (data.hasImages) richnessScore += 3
  if (
    data.excerpt &&
    typeof data.excerpt === 'string' &&
    data.excerpt.length > 50
  )
    richnessScore += 5
  if (complexity === 'detailed') richnessScore += 8
  if (complexity === 'moderate') richnessScore += 4

  score += Math.min(richnessScore, 25)

  // Content type relevance (if filtering)
  if (context.contentTypeFilter && contentType === context.contentTypeFilter) {
    score += 22
  }

  return score
}

// Generate smart suggestions
const generateSuggestions = (query, categories) => {
  if (!query || query.length < 2) return []

  const suggestions = new Set()
  const lowerQuery = query.toLowerCase()

  categories.suggestions.forEach(suggestion => {
    const match = fuzzyMatch(suggestion, query, 0.6)
    if (match.match && suggestion.length > query.length) {
      suggestions.add(suggestion)
    }
  })

  // Add actions-specific suggestions
  if (fuzzyMatch('actions', query, 0.7).match) {
    suggestions.add('actions documentation')
    suggestions.add('actions activities')
  }

  Object.keys(categories.bySection).forEach(section => {
    if (fuzzyMatch(section, query, 0.7).match) {
      suggestions.add(section)
    }
  })

  return Array.from(suggestions).slice(0, 5)
}

// Version detection simplified for Actions only
const getCurrentSectionAndVersion = () => {
  const path = window.location.pathname
  const segments = path.split('/').filter(Boolean)

  let currentProduct = 'actions'
  let currentFileVersion = 'latest'
  let isCurrentVersion = true

  // Check if we're in actions section
  const productIndex = segments.findIndex(
    seg => seg.toLowerCase() === 'actions',
  )

  if (productIndex >= 0) {
    currentProduct = 'actions'
    currentFileVersion = 'latest'
    isCurrentVersion = true
  } else {
    // Not in actions section, use default
    currentProduct = 'default'
  }

  console.log('🔍 VERSION DETECTION:')
  console.log(`  - URL: ${path}`)
  console.log(`  - Product: ${currentProduct}`)
  console.log(`  - File Version: "${currentFileVersion}"`)
  console.log(`  - Is Current Version: ${isCurrentVersion}`)

  return {
    currentProduct,
    currentUrlVersion: null,
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
  const [currentProduct, setCurrentProduct] = useState('actions')
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

  // Actions mappings are always loaded!
  useEffect(() => {
    console.log('✅ Actions mappings loaded via direct imports')
    console.log('📊 Available mappings:', Object.keys(ALL_MAPPINGS))
    console.log('📊 Actions latest sample:', {
      keys: Object.keys(actionsLatest || {}),
      sampleEntries: Object.entries(actionsLatest || {}).slice(0, 3),
    })
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

  // Re-run search when context changes (if there's an active query)
  useEffect(() => {
    if (query.trim() && isOpen) {
      console.log('🔍 Context changed, re-running search for:', query)
      setIsLoading(true)
      performEnhancedSearch(query)
    }
  }, [currentProduct, currentFileVersion])

  // Simplified search function - Actions only!
  const performEnhancedSearch = useCallback(
    (searchQuery, context = {}) => {
      if (!searchQuery.trim()) {
        setResults([])
        setSuggestions([])
        setIsLoading(false)
        return
      }

      try {
        // Get Actions mappings - no async needed!
        let searchMappings
        let cacheKey

        if (currentProduct === 'default' || currentProduct === 'actions') {
          cacheKey = 'actions-current'
          searchMappings = getCurrentVersions()
        } else {
          // Fallback to actions
          cacheKey = 'actions-current'
          searchMappings = getCurrentVersions()
        }

        console.log('🔍 Search mappings structure:', {
          mappings: searchMappings,
          keys: Object.keys(searchMappings || {}),
          sampleEntry: Object.entries(searchMappings || {})[0],
        })

        if (!searchMappings || Object.keys(searchMappings).length === 0) {
          console.warn(`No Actions mappings available`)
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
          currentProduct: 'actions',
          currentFileVersion: 'latest',
          isCurrentVersion: true,
          contentTypeFilter: filters.contentType,
          ...context,
        }

        console.log('🔍 SEARCH CONTEXT:', searchContext)

        // Generate suggestions
        if (searchCategories) {
          const newSuggestions = generateSuggestions(
            searchQuery,
            searchCategories,
          )
          setSuggestions(newSuggestions)
        }

        // Get entries to search
        const entries = Object.keys(processedData)

        console.log(`🔍 Found ${entries.length} entries for search`)

        // Calculate relevance scores
        const allResults = entries
          .map(uniqueKey => {
            try {
              const data = processedData[uniqueKey]
              const score = calculateRelevanceScore(
                uniqueKey,
                processedData,
                searchQuery,
                searchContext,
              )

              if (score === 0) return null

              // Extract original title
              const title = data.title || uniqueKey.split('|||')[0]

              return {
                title,
                product: data.product || 'actions',
                version: data.version || 'latest',
                url: data.url || '#',
                breadcrumbs: data.pathContext?.breadcrumbs || 'Actions',
                contentType: data.contentTypeInfo
                  ? data.contentTypeInfo.type
                  : 'reference',
                subtype: data.contentTypeInfo
                  ? data.contentTypeInfo.subtype
                  : '',
                complexity: data.complexity || 'simple',
                excerpt: data.excerpt || '',
                score,
                isExactVersion: true,
                isCurrentVersion: true,
                versionPriority: 1000,
                data,
              }
            } catch (error) {
              console.error('Error processing result:', uniqueKey, error)
              return null
            }
          })
          .filter(Boolean)

        // Sort by content score only (since everything is Actions latest)
        const finalResults = allResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 8)

        console.log('🔍 SEARCH RESULTS:')
        finalResults.forEach((result, i) => {
          console.log(`  ${i + 1}. ${result.title}`)
        })

        setResults(finalResults)
        setIsLoading(false)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setSuggestions([])
        setIsLoading(false)
      }
    },
    [currentProduct, currentFileVersion, filters.contentType],
  )

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(searchQuery => {
      performEnhancedSearch(searchQuery)
    }, 300),
    [performEnhancedSearch],
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
    performEnhancedSearch(suggestion)
    setSelectedIndex(-1)
  }

  // Get Actions primary blue color
  const getProductFocusColor = () => {
    return 'var(--brand-blue)' // #0050C7 - Actions primary blue
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
      style={{ position: 'relative', width: '100%', maxWidth: '450px' }}
    >
      <div className='search-input-container' style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search Actions...'
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={e => {
            if (query) setIsOpen(true)
            const focusColor = getProductFocusColor()
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
          aria-label='Search Actions documentation'
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
            maxHeight: '300px',
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            border: `1px solid var(--brand-grey-400)`,
            boxShadow: '0 4px 20px rgba(5, 7, 15, 0.1)', // Using brand black with opacity
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
                    maxHeight: '300px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    padding: 0,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'var(--brand-grey-200)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'var(--brand-grey-500)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: 'var(--brand-blue)',
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
                          {/* Top Row: Badge + Title */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              width: '100%',
                            }}
                          >
                            {/* Actions Badge */}
                            <Chip
                              label='ACTIONS'
                              size='small'
                              sx={{
                                backgroundColor: getProductColor('actions'),
                                color: 'var(--brand-white)',
                                fontSize: '9px',
                                height: '20px',
                                minWidth: '60px',
                                fontWeight: '600',
                                fontFamily:
                                  'SeasonMix, var(--ifm-font-family-base)',
                                '& .MuiChip-label': {
                                  paddingX: '6px',
                                },
                              }}
                            />

                            {/* Title */}
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
                          sx={{ borderColor: 'var(--brand-grey-300)' }}
                        />
                      )}
                    </React.Fragment>
                  ))}

                  {/* Footer */}
                  <Divider sx={{ borderColor: 'var(--brand-grey-300)' }} />
                  <ListItem>
                    <Typography
                      variant='caption'
                      sx={{
                        textAlign: 'center',
                        width: '100%',
                        fontSize: '10px',
                        padding: '4px 0',
                        color: 'var(--brand-grey-600)',
                        fontFamily: 'SeasonMix, var(--ifm-font-family-base)',
                      }}
                    >
                      {results.length} result{results.length !== 1 ? 's' : ''} •
                      Use ↑↓ arrows
                    </Typography>
                  </ListItem>
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
                    Try different search terms
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
