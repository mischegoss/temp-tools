/**
 * Enhanced Actions Documentation Scanner - Complete Fixed Version
 * Features: Variable substitution, deeper metadata, enhanced chunking
 * Run with: node enhanced-scanner.js
 */

require('dotenv').config()
const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const crypto = require('crypto')

// Simple minifier fallback if the utility doesn't exist
const JsonMinifier = class {
  constructor(options = {}) {
    this.options = options
  }

  async minifyFile(filePath) {
    if (this.options.verbose) {
      console.log('Minification skipped - using fallback')
    }
    return true
  }
}

// Configuration
const CURRENT_VERSIONS = {
  actions: 'latest',
}

const PRODUCT_CONFIGS = {
  actions: {
    dirs: ['docs-actions-current'],
    routeBase: 'actions',
  },
}

// Variable replacements
const VARIABLE_REPLACEMENTS = {
  COMPANY: 'Resolve',
  PRODUCT: 'Actions',
  PRODUCT_FULL: 'Resolve Actions',
  CURRENT_YEAR: new Date().getFullYear().toString(),
  EXCHANGE: 'Resolve Automation Exchange',
}

// Initialize services
const skipMinify = process.argv.includes('--no-minify')
const verboseMode = process.argv.includes('--verbose')
const debugMode = process.argv.includes('--debug')
const minifier = new JsonMinifier({
  createBackups: true,
  verbose: verboseMode,
})

/**
 * Apply variable substitutions to content - FIXED VERSION
 */
function applyVariableSubstitutions(text) {
  if (!text) return text

  let result = text
  Object.entries(VARIABLE_REPLACEMENTS).forEach(([variable, replacement]) => {
    // Match various formats with proper replacement logic
    const patterns = [
      // ${VAR} format
      {
        regex: new RegExp(`\\$\\{${variable}\\}`, 'g'),
        replacement: replacement,
      },
      // {{VAR}} format
      {
        regex: new RegExp(`\\{\\{${variable}\\}\\}`, 'g'),
        replacement: replacement,
      },
      // [VAR] format
      {
        regex: new RegExp(`\\[${variable}\\]`, 'g'),
        replacement: replacement,
      },
      // VAR: format (fixed - only replace the variable part, keep the colon)
      {
        regex: new RegExp(`\\b${variable}:`, 'g'),
        replacement: `${replacement}:`,
      },
      // Standalone VAR (word boundary, not followed by colon)
      {
        regex: new RegExp(`\\b${variable}\\b(?!:)(?=\\s|$|[^A-Z_])`, 'g'),
        replacement: replacement,
      },
    ]

    patterns.forEach(pattern => {
      result = result.replace(pattern.regex, pattern.replacement)
    })
  })

  return result
}

/**
 * Extract code examples from content with metadata
 */
function extractCodeExamples(content) {
  const codeBlocks = []
  const codeRegex = /```(\w+)?\n?([\s\S]*?)```/g
  let match

  while ((match = codeRegex.exec(content)) !== null) {
    const language = match[1] || 'text'
    const code = match[2].trim()

    if (code) {
      codeBlocks.push({
        language,
        code,
        description: extractCodeDescription(content, match.index),
        line_count: code.split('\n').length,
      })
    }
  }

  return codeBlocks
}

/**
 * Extract description that appears before a code block
 */
function extractCodeDescription(content, codeIndex) {
  const beforeCode = content.substring(0, codeIndex).trim()
  const lines = beforeCode.split('\n').reverse()

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
      return trimmed.length > 100 ? trimmed.substring(0, 97) + '...' : trimmed
    }
  }

  return ''
}

/**
 * Extract internal and external links
 */
function extractLinks(content, baseUrl) {
  const links = {
    internal: [],
    external: [],
  }

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match

  while ((match = linkRegex.exec(content)) !== null) {
    const title = match[1].trim()
    const url = match[2].trim()

    if (url.startsWith('http') || url.startsWith('//')) {
      links.external.push({ title, url })
    } else if (
      url.startsWith('/') ||
      url.startsWith('./') ||
      url.startsWith('../')
    ) {
      links.internal.push({ title, url })
    }
  }

  return links
}

/**
 * Extract question variations and troubleshooting keywords
 */
function extractQuestionVariations(content, title, headers) {
  const variations = new Set()
  const troubleshootingKeywords = []

  // Generate questions from title and headers
  const allTitles = [title, ...headers]
  allTitles.forEach(t => {
    if (t) {
      // Convert statements to questions
      if (
        t.toLowerCase().includes('create') ||
        t.toLowerCase().includes('add')
      ) {
        variations.add(`How do I ${t.toLowerCase()}?`)
        variations.add(`Steps to ${t.toLowerCase()}`)
      }
      if (
        t.toLowerCase().includes('configure') ||
        t.toLowerCase().includes('setup')
      ) {
        variations.add(`How to ${t.toLowerCase()}?`)
        variations.add(`${t} guide`)
      }
      if (
        t.toLowerCase().includes('troubleshoot') ||
        t.toLowerCase().includes('fix')
      ) {
        variations.add(`How to ${t.toLowerCase()}?`)
        troubleshootingKeywords.push(...t.toLowerCase().split(' '))
      }
    }
  })

  // Extract troubleshooting keywords from content
  const troubleshootingPatterns =
    /\b(error|failed|issue|problem|troubleshoot|fix|resolve|debug|warning|exception)\b/gi
  const troubleshootingMatches = content.match(troubleshootingPatterns)
  if (troubleshootingMatches) {
    troubleshootingKeywords.push(
      ...troubleshootingMatches.map(m => m.toLowerCase()),
    )
  }

  return {
    question_variations: Array.from(variations).slice(0, 5), // Limit to 5
    troubleshooting_keywords: [...new Set(troubleshootingKeywords)].slice(
      0,
      10,
    ),
  }
}

/**
 * Extract tags from content using various heuristics
 */
function extractContentTags(content, filePath, headers) {
  const tags = new Set()

  // Technology tags
  const techPatterns = [
    /\bPowerShell\b/gi,
    /\bC#\b/gi,
    /\bJavaScript\b/gi,
    /\bPython\b/gi,
    /\bSQL\b/gi,
    /\bREST\b/gi,
    /\bAPI\b/gi,
    /\bJSON\b/gi,
    /\bXML\b/gi,
    /\bActive Directory\b/gi,
    /\bAzure\b/gi,
    /\bAWS\b/gi,
    /\bOffice 365\b/gi,
    /\bExchange\b/gi,
    /\bSharePoint\b/gi,
    /\bTeams\b/gi,
  ]

  // Action/process tags
  const actionPatterns = [
    /\b(create|add|new)\b/gi,
    /\b(update|modify|edit|change)\b/gi,
    /\b(delete|remove)\b/gi,
    /\b(get|retrieve|fetch|read)\b/gi,
    /\b(configure|setup|install)\b/gi,
    /\b(authenticate|login|connect)\b/gi,
  ]

  // Extract from file path
  const pathParts = filePath.split('/').map(p => p.replace(/-/g, ' '))
  pathParts.forEach(part => {
    if (part && part !== 'docs-actions-current') {
      tags.add(part.toLowerCase())
    }
  })

  // Extract from content
  const allText = [content, ...headers].join(' ')

  techPatterns.forEach(pattern => {
    const matches = allText.match(pattern)
    if (matches) {
      matches.forEach(match => tags.add(match.toLowerCase()))
    }
  })

  actionPatterns.forEach(pattern => {
    const matches = allText.match(pattern)
    if (matches) {
      matches.forEach(match => tags.add(match.toLowerCase()))
    }
  })

  return Array.from(tags).slice(0, 15) // Limit to 15 most relevant
}

/**
 * Enhanced chunking with multiple strategies and relationship context
 */
function chunkPageContent(content, headers, pageMetadata, allPages) {
  const chunks = []
  const processedContent = applyVariableSubstitutions(content)

  // Remove frontmatter
  const cleanContent = processedContent.replace(/^---[\s\S]*?---/, '').trim()

  // Strategy 1: Header-based chunking (primary)
  const headerChunks = createHeaderBasedChunks(
    cleanContent,
    headers,
    pageMetadata,
    allPages,
  )

  // Strategy 2: Paragraph-based chunking (fallback for content without headers)
  if (
    headerChunks.length === 0 ||
    headerChunks.some(chunk => chunk.content.length > 2000)
  ) {
    const paragraphChunks = createParagraphBasedChunks(
      cleanContent,
      pageMetadata,
      allPages,
    )
    chunks.push(...paragraphChunks)
  } else {
    chunks.push(...headerChunks)
  }

  // Strategy 3: Table and list chunking (supplementary)
  const structuredChunks = extractStructuredContent(
    cleanContent,
    pageMetadata,
    allPages,
  )
  chunks.push(...structuredChunks)

  return chunks.filter(chunk => chunk.content.trim().length > 50) // Filter very short chunks
}

/**
 * Create chunks based on headers
 */
function createHeaderBasedChunks(content, headers, pageMetadata, allPages) {
  const chunks = []
  const headerRegex = /^(#{2,6})\s+(.+)$/gm
  const sections = []
  let currentSection = {
    header: pageMetadata.title || 'Introduction',
    level: 1,
    content: '',
    startIndex: 0,
  }

  let lastIndex = 0
  let match

  while ((match = headerRegex.exec(content)) !== null) {
    currentSection.content = content.slice(lastIndex, match.index).trim()
    if (currentSection.content) {
      sections.push({ ...currentSection })
    }

    currentSection = {
      header: match[2].trim(),
      level: match[1].length,
      content: '',
      startIndex: match.index,
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    currentSection.content = content.slice(lastIndex).trim()
    if (currentSection.content) {
      sections.push(currentSection)
    }
  }

  if (sections.length === 0) {
    sections.push({
      header: pageMetadata.title || 'Content',
      level: 1,
      content: content,
    })
  }

  sections.forEach((section, sectionIndex) => {
    if (section.content.trim()) {
      // Split large sections into smaller chunks with overlap
      const sectionChunks = splitLargeContent(section.content, 1000, 100)

      sectionChunks.forEach((chunkContent, chunkIndex) => {
        chunks.push(
          createChunk(
            chunkContent,
            section.header,
            pageMetadata,
            sectionIndex,
            chunkIndex,
            section.level,
            allPages,
          ),
        )
      })
    }
  })

  return chunks
}

/**
 * Create chunks based on paragraphs (fallback strategy)
 */
function createParagraphBasedChunks(content, pageMetadata, allPages) {
  const chunks = []
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)

  let currentChunk = ''
  let chunkIndex = 0

  paragraphs.forEach(paragraph => {
    if (
      currentChunk.length + paragraph.length > 1000 &&
      currentChunk.length > 0
    ) {
      chunks.push(
        createChunk(
          currentChunk.trim(),
          'Content',
          pageMetadata,
          0,
          chunkIndex,
          1,
          allPages,
        ),
      )
      chunkIndex++
      currentChunk = paragraph
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
    }
  })

  if (currentChunk.trim()) {
    chunks.push(
      createChunk(
        currentChunk.trim(),
        'Content',
        pageMetadata,
        0,
        chunkIndex,
        1,
        allPages,
      ),
    )
  }

  return chunks
}

/**
 * Extract tables and lists as separate chunks
 */
function extractStructuredContent(content, pageMetadata, allPages) {
  const chunks = []

  // Extract tables
  const tableRegex = /\|[\s\S]*?\|/g
  let match
  let tableIndex = 0

  while ((match = tableRegex.exec(content)) !== null) {
    const tableContent = match[0].trim()
    if (tableContent.split('\n').length > 2) {
      // Must have header + separator + data
      chunks.push(
        createChunk(
          tableContent,
          'Table Data',
          pageMetadata,
          999, // Special section index for tables
          tableIndex,
          3,
          allPages,
        ),
      )
      tableIndex++
    }
  }

  return chunks
}

/**
 * Split large content into smaller chunks with overlap
 */
function splitLargeContent(content, maxSize, overlap) {
  if (content.length <= maxSize) return [content]

  const chunks = []
  let start = 0

  while (start < content.length) {
    let end = start + maxSize

    // Try to break at sentence boundary
    if (end < content.length) {
      const nextPeriod = content.indexOf('.', end - 100)
      const nextNewline = content.indexOf('\n', end - 100)
      const breakPoint = Math.max(nextPeriod, nextNewline)

      if (breakPoint > start && breakPoint < end + 100) {
        end = breakPoint + 1
      }
    }

    chunks.push(content.slice(start, end).trim())
    start = Math.max(start + 1, end - overlap) // Ensure progress with overlap
  }

  return chunks
}

/**
 * Create enhanced chunk with rich metadata
 */
function createChunk(
  content,
  header,
  pageMetadata,
  sectionIndex,
  chunkIndex,
  headerLevel = 1,
  allPages = [],
) {
  // Apply variable substitutions
  const processedContent = applyVariableSubstitutions(content)
  const processedHeader = applyVariableSubstitutions(header)

  // Extract enhanced metadata
  const codeExamples = extractCodeExamples(processedContent)
  const links = extractLinks(processedContent, pageMetadata.url)
  const questionData = extractQuestionVariations(
    processedContent,
    pageMetadata.title,
    [processedHeader],
  )
  const contentTags = extractContentTags(
    processedContent,
    pageMetadata.filePath || '',
    [processedHeader],
  )

  // Clean content for search (preserve more context than before)
  const searchContent = processedContent
    .replace(/```[\s\S]*?```/g, ' [CODE] ') // Replace with placeholder but keep context
    .replace(/\|[\s\S]*?\|/g, ' [TABLE] ') // Replace tables with placeholder
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images (as requested)
    .replace(/\s+/g, ' ')
    .trim()

  const chunkId = `${pageMetadata.url.replace(
    /[^a-zA-Z0-9]/g,
    '_',
  )}_s${sectionIndex}_c${chunkIndex}`

  // Calculate path segments for navigation
  const pathSegments = (pageMetadata.filePath || '')
    .replace('docs-actions-current/', '')
    .split('/')
    .filter(segment => segment && segment !== 'index')

  // Calculate directory-based relationships
  const directoryRelationships = calculateDirectoryRelationships(
    pageMetadata.filePath,
    pageMetadata.title,
    allPages,
  )

  return {
    id: chunkId,
    content: searchContent,
    original_content: processedContent,
    header: processedHeader,
    header_level: headerLevel,
    source_url: pageMetadata.url,
    page_title: pageMetadata.title,
    content_type: pageMetadata.contentType,
    complexity: pageMetadata.complexity,
    tokens: Math.ceil(searchContent.length / 4),

    // Enhanced metadata
    metadata: {
      ...pageMetadata.metadata,
      section_index: sectionIndex,
      chunk_index: chunkIndex,
      file_path_segments: pathSegments,
      parent_sections: pathSegments.slice(0, -1), // All but the last segment

      // Content analysis
      has_code: codeExamples.length > 0,
      has_tables: processedContent.includes('|'),
      has_links: links.internal.length > 0 || links.external.length > 0,
      word_count: searchContent.split(/\s+/).length,

      // Enhanced search fields
      tags_from_content: contentTags,
      question_variations: questionData.question_variations,
      troubleshooting_keywords: questionData.troubleshooting_keywords,

      // Structured content
      code_examples: codeExamples,
      internal_links: links.internal.slice(0, 5), // Limit to 5
      external_links: links.external.slice(0, 3), // Limit to 3

      // Directory-based relationships
      directory_relationships: directoryRelationships,

      // Search optimization
      search_terms: [
        ...(pageMetadata.contentType?.searchTerms || []),
        ...contentTags,
        ...questionData.troubleshooting_keywords,
        processedHeader.toLowerCase(),
        ...(directoryRelationships.semantic_keywords || []),
      ]
        .filter((term, index, arr) => arr.indexOf(term) === index)
        .slice(0, 25), // Unique, expanded limit
    },
  }
}

/**
 * Main scanning function with enhanced logging
 */
async function scanActionsDocumentation() {
  console.log('🔍 Enhanced Actions Documentation Scanner Starting...')
  console.log(
    `📝 Variable substitutions enabled: ${
      Object.keys(VARIABLE_REPLACEMENTS).length
    } variables`,
  )

  const config = PRODUCT_CONFIGS.actions
  const pages = []
  const allChunks = []
  let totalPages = 0
  let skippedReleaseNotes = 0
  let skippedFiles = 0
  let processedFiles = 0

  console.log('\n📁 Scanning docs-actions-current...')

  for (const dirName of config.dirs) {
    const dirPath = path.join(process.cwd(), dirName)

    try {
      await fs.access(dirPath)
      const scannedPages = await scanDirectory(dirPath, 'actions')

      scannedPages.forEach(page => {
        if (isReleaseNotesFile(page.filePath)) {
          skippedReleaseNotes++
          return
        }

        const pageMetadata = {
          title: page.title,
          url: generateActionsPageUrl(
            page.filePath,
            page.frontmatter,
            config.routeBase,
          ),
          contentType: page.contentType,
          complexity: page.complexity,
          metadata: page.metadata,
          filePath: page.filePath,
        }

        const chunks = chunkPageContent(
          page.content,
          page.headers,
          pageMetadata,
        )
        allChunks.push(...chunks)
        processedFiles++

        pages.push({
          ...page,
          url: pageMetadata.url,
          product: 'actions',
          version: 'latest',
          chunkCount: chunks.length,
        })

        if (verboseMode) {
          console.log(`  ✅ "${page.title}" → ${chunks.length} chunks`)
        }
      })

      totalPages += scannedPages.length
      console.log(`  📊 Found ${scannedPages.length} pages in ${dirName}`)
    } catch (error) {
      console.log(`  📂 Skipping ${dirName} (not present)`)
    }
  }

  // Enhanced statistics
  const stats = calculateEnhancedStats(pages, allChunks)

  console.log(`\n📈 Enhanced Processing Summary:`)
  console.log(`  📄 Processed files: ${processedFiles}`)
  console.log(`  ⚠️  Skipped files: ${skippedFiles}`)
  console.log(`  📝 Skipped release notes: ${skippedReleaseNotes}`)
  console.log(`  📚 Total pages: ${pages.length}`)
  console.log(`  🧩 Total chunks: ${allChunks.length}`)
  console.log(
    `  📊 Avg chunks/page: ${Math.round(allChunks.length / pages.length)}`,
  )
  console.log(`  💻 Pages with code: ${stats.pagesWithCode}`)
  console.log(`  🔗 Pages with links: ${stats.pagesWithLinks}`)
  console.log(`  🏷️  Avg tags/chunk: ${Math.round(stats.avgTagsPerChunk)}`)

  // Create enhanced mappings for inclusion in chunks file
  const enhancedMappings = {}
  let totalHeaders = 0

  pages.forEach(page => {
    enhancedMappings[page.title] = {
      product: page.product,
      version: page.version,
      headers: page.headers,
      filePath: page.filePath,
      url: page.url,
      slug: page.slug,
      id: page.id,
      excerpt: page.excerpt,
      metadata: page.metadata,
      contentType: page.contentType,
      complexity: page.complexity,
      hasCode: page.hasCode,
      hasImages: page.hasImages,
      wordCount: page.wordCount,
      chunkCount: page.chunkCount,
    }
    totalHeaders += page.headers.length
  })

  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(allChunks))
    .digest('hex')

  // Create single comprehensive output file for FastAPI
  const chunksPath = path.join(
    process.cwd(),
    'static/data/documentation-chunks.json',
  )
  await fs.mkdir(path.dirname(chunksPath), { recursive: true })

  const comprehensiveOutput = {
    // Metadata
    _GENERATED: new Date().toISOString(),
    _PRODUCT: 'actions',
    _VERSION: 'latest',
    _IS_CURRENT_VERSION: true,
    _TOTAL_PAGES: pages.length,
    _TOTAL_HEADERS: totalHeaders,
    _TOTAL_CHUNKS: allChunks.length,
    _SKIPPED_RELEASE_NOTES: skippedReleaseNotes,
    _VARIABLE_SUBSTITUTIONS: VARIABLE_REPLACEMENTS,
    _CURRENT_VERSIONS: CURRENT_VERSIONS,
    _CHECKSUM: checksum,
    _WARNING: '🚨 AUTO-GENERATED FILE - DO NOT EDIT MANUALLY 🚨',
    _REGENERATE: "Run 'node enhanced-scanner.js' to regenerate this file",

    // Enhanced features
    _ENHANCED_FEATURES: [
      'Variable substitution applied',
      'Rich metadata extraction',
      'Code examples preserved',
      'Link relationships mapped',
      'Question variations generated',
      'Multi-strategy chunking',
      'Content tags extracted',
      'Directory-based relationships',
    ],

    // Statistics
    _STATS: stats,

    // Page mappings for reference
    _PAGE_MAPPINGS: enhancedMappings,

    // Main data for FastAPI
    chunks: allChunks,
  }

  if (skipMinify) {
    await fs.writeFile(
      chunksPath,
      JSON.stringify(comprehensiveOutput, null, 2),
      'utf8',
    )
    console.log(
      '\n✅ Generated comprehensive documentation chunks file (readable)!',
    )
  } else {
    await fs.writeFile(
      chunksPath,
      JSON.stringify(comprehensiveOutput, null, 2),
      'utf8',
    )
    await minifier.minifyFile(chunksPath)
    console.log(
      '\n✅ Generated and protected comprehensive documentation chunks file!',
    )
  }

  console.log(`📁 Single output file saved to: ${chunksPath}`)
  console.log(
    `💾 Contains ${allChunks.length} enhanced chunks + ${pages.length} page mappings`,
  )

  return {
    chunksPath,
    stats: {
      ...stats,
      totalChunks: allChunks.length,
      totalPages: pages.length,
      averageChunksPerPage: Math.round(allChunks.length / pages.length),
    },
  }
}

/**
 * Calculate enhanced statistics including relationship data
 */
function calculateEnhancedStats(pages, chunks) {
  const stats = {
    pagesWithCode: 0,
    pagesWithLinks: 0,
    totalCodeExamples: 0,
    totalInternalLinks: 0,
    totalExternalLinks: 0,
    avgTagsPerChunk: 0,
    totalDirectoryRelationships: 0,
    avgRelationshipsPerPage: 0,
    relationshipBreakdown: {
      siblings: 0,
      cousins: 0,
      parent_siblings: 0,
      semantic_matches: 0,
    },
    complexityBreakdown: { simple: 0, moderate: 0, detailed: 0 },
    contentTypeBreakdown: {},
  }

  pages.forEach(page => {
    if (page.hasCode) stats.pagesWithCode++
    stats.complexityBreakdown[page.complexity]++

    const contentType = page.contentType?.type || 'unknown'
    stats.contentTypeBreakdown[contentType] =
      (stats.contentTypeBreakdown[contentType] || 0) + 1
  })

  let totalRelationships = 0

  chunks.forEach(chunk => {
    stats.totalCodeExamples += chunk.metadata.code_examples?.length || 0
    stats.totalInternalLinks += chunk.metadata.internal_links?.length || 0
    stats.totalExternalLinks += chunk.metadata.external_links?.length || 0

    // Count directory relationships
    const relationships = chunk.metadata.directory_relationships
    if (relationships) {
      const relationshipCount =
        relationships.relationship_counts?.total_related || 0
      totalRelationships += relationshipCount
      stats.totalDirectoryRelationships += relationshipCount

      // Add to breakdown
      stats.relationshipBreakdown.siblings +=
        relationships.relationship_counts?.siblings || 0
      stats.relationshipBreakdown.cousins +=
        relationships.relationship_counts?.cousins || 0
      stats.relationshipBreakdown.parent_siblings +=
        relationships.relationship_counts?.parent_siblings || 0
      stats.relationshipBreakdown.semantic_matches +=
        relationships.relationship_counts?.semantic_matches || 0
    }

    if (
      chunk.metadata.internal_links?.length > 0 ||
      chunk.metadata.external_links?.length > 0
    ) {
      // Track pages with links (approximated from chunks)
      stats.pagesWithLinks++
    }
  })

  const totalTags = chunks.reduce(
    (sum, chunk) => sum + (chunk.metadata.tags_from_content?.length || 0),
    0,
  )
  stats.avgTagsPerChunk = chunks.length > 0 ? totalTags / chunks.length : 0

  // Calculate average relationships per page (from chunks)
  stats.avgRelationshipsPerPage =
    pages.length > 0 ? totalRelationships / pages.length : 0

  return stats
}

/**
 * Calculate directory-based relationships for a page
 */
function calculateDirectoryRelationships(filePath, pageTitle, allPages) {
  if (!filePath) return {}

  // Parse current page path
  const cleanPath = filePath.replace('docs-actions-current/', '')
  const pathParts = cleanPath
    .split('/')
    .filter(part => part && part !== 'index')
  const fileName = pathParts.pop() || '' // Remove file name, keep directory path
  const directoryPath = pathParts
  const currentDirectory = pathParts[pathParts.length - 1] || ''
  const parentDirectory = pathParts[pathParts.length - 2] || ''
  const grandparentDirectory = pathParts[pathParts.length - 3] || ''

  const relationships = {
    current_directory: currentDirectory,
    parent_directory: parentDirectory,
    grandparent_directory: grandparentDirectory,
    directory_depth: pathParts.length,
    full_path: directoryPath.join('/'),
    siblings: [],
    cousins: [],
    parent_siblings: [],
    semantic_matches: [],
    semantic_keywords: [],
  }

  // Analyze all other pages for relationships
  allPages.forEach(page => {
    if (!page.filePath || page.filePath === filePath) return // Skip self and invalid paths

    const otherCleanPath = page.filePath.replace('docs-actions-current/', '')
    const otherPathParts = otherCleanPath
      .split('/')
      .filter(part => part && part !== 'index')
    const otherFileName = otherPathParts.pop() || ''
    const otherDirectoryPath = otherPathParts
    const otherCurrentDirectory =
      otherPathParts[otherPathParts.length - 1] || ''
    const otherParentDirectory = otherPathParts[otherPathParts.length - 2] || ''

    // SIBLINGS: Same exact directory path (strongest relationship)
    if (
      directoryPath.join('/') === otherDirectoryPath.join('/') &&
      directoryPath.length > 0
    ) {
      relationships.siblings.push({
        title: page.title,
        file_name: otherFileName,
        url: page.url || generateFileUrl(page.filePath),
        similarity_score: calculateTitleSimilarity(pageTitle, page.title),
      })
    }

    // COUSINS: Same parent directory, different immediate directory
    else if (
      pathParts.length > 1 &&
      otherPathParts.length > 1 &&
      parentDirectory === otherParentDirectory &&
      currentDirectory !== otherCurrentDirectory
    ) {
      relationships.cousins.push({
        title: page.title,
        directory: otherCurrentDirectory,
        file_name: otherFileName,
        url: page.url || generateFileUrl(page.filePath),
        similarity_score: calculateTitleSimilarity(pageTitle, page.title),
      })
    }

    // PARENT SIBLINGS: Pages in the parent directory (if parent has direct files)
    else if (
      pathParts.length > 1 &&
      otherPathParts.length === pathParts.length - 1 &&
      otherDirectoryPath.join('/') === pathParts.slice(0, -1).join('/')
    ) {
      relationships.parent_siblings.push({
        title: page.title,
        file_name: otherFileName,
        url: page.url || generateFileUrl(page.filePath),
        similarity_score: calculateTitleSimilarity(pageTitle, page.title),
      })
    }

    // SEMANTIC MATCHES: Similar file names or titles across any directory
    const semanticScore = calculateSemanticSimilarity(
      fileName,
      otherFileName,
      pageTitle,
      page.title,
    )
    if (semanticScore > 0.3) {
      // Threshold for semantic similarity
      relationships.semantic_matches.push({
        title: page.title,
        directory: otherDirectoryPath.join('/'),
        file_name: otherFileName,
        url: page.url || generateFileUrl(page.filePath),
        similarity_score: semanticScore,
        match_type: getSemanticMatchType(
          fileName,
          otherFileName,
          pageTitle,
          page.title,
        ),
      })
    }
  })

  // Sort all relationships by similarity score (highest first)
  relationships.siblings = relationships.siblings
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 8) // Limit to top 8

  relationships.cousins = relationships.cousins
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 6) // Limit to top 6

  relationships.parent_siblings = relationships.parent_siblings
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 4) // Limit to top 4

  relationships.semantic_matches = relationships.semantic_matches
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 5) // Limit to top 5

  // Generate semantic keywords from directory structure and relationships
  relationships.semantic_keywords = generateSemanticKeywords(
    pathParts,
    fileName,
    pageTitle,
    relationships,
  )

  // Add relationship counts for statistics
  relationships.relationship_counts = {
    total_related:
      relationships.siblings.length +
      relationships.cousins.length +
      relationships.parent_siblings.length +
      relationships.semantic_matches.length,
    siblings: relationships.siblings.length,
    cousins: relationships.cousins.length,
    parent_siblings: relationships.parent_siblings.length,
    semantic_matches: relationships.semantic_matches.length,
  }

  return relationships
}

/**
 * Calculate title similarity score between two pages
 */
function calculateTitleSimilarity(title1, title2) {
  if (!title1 || !title2) return 0

  const normalize = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
  const norm1 = normalize(title1)
  const norm2 = normalize(title2)

  // Exact match
  if (norm1 === norm2) return 1.0

  // Word overlap scoring
  const words1 = norm1.split(/\s+/).filter(w => w.length > 2) // Skip short words
  const words2 = norm2.split(/\s+/).filter(w => w.length > 2)

  if (words1.length === 0 || words2.length === 0) return 0

  const commonWords = words1.filter(word => words2.includes(word))
  const overlapScore =
    commonWords.length / Math.max(words1.length, words2.length)

  // Substring scoring
  const substringScore = Math.max(
    norm1.includes(norm2) ? 0.8 : 0,
    norm2.includes(norm1) ? 0.8 : 0,
  )

  return Math.max(overlapScore, substringScore)
}

/**
 * Calculate semantic similarity between file names and titles
 */
function calculateSemanticSimilarity(fileName1, fileName2, title1, title2) {
  const fileScore = calculateTitleSimilarity(
    fileName1.replace(/-/g, ' '),
    fileName2.replace(/-/g, ' '),
  )

  const titleScore = calculateTitleSimilarity(title1, title2)

  // Weight file name similarity higher as it's more reliable
  return fileScore * 0.6 + titleScore * 0.4
}

/**
 * Determine the type of semantic match
 */
function getSemanticMatchType(fileName1, fileName2, title1, title2) {
  const f1 = fileName1.toLowerCase()
  const f2 = fileName2.toLowerCase()

  // Action-based matching
  if (
    (f1.includes('create') && f2.includes('create')) ||
    (f1.includes('add') && f2.includes('add'))
  ) {
    return 'create_action'
  }
  if (
    (f1.includes('update') && f2.includes('update')) ||
    (f1.includes('modify') && f2.includes('modify')) ||
    (f1.includes('edit') && f2.includes('edit'))
  ) {
    return 'update_action'
  }
  if (
    (f1.includes('delete') && f2.includes('delete')) ||
    (f1.includes('remove') && f2.includes('remove'))
  ) {
    return 'delete_action'
  }
  if (
    (f1.includes('get') && f2.includes('get')) ||
    (f1.includes('retrieve') && f2.includes('retrieve')) ||
    (f1.includes('fetch') && f2.includes('fetch'))
  ) {
    return 'retrieve_action'
  }

  // Entity-based matching
  if (f1.includes('user') && f2.includes('user')) {
    return 'user_management'
  }
  if (f1.includes('group') && f2.includes('group')) {
    return 'group_management'
  }
  if (
    (f1.includes('mail') && f2.includes('mail')) ||
    (f1.includes('email') && f2.includes('email'))
  ) {
    return 'email_management'
  }

  // Title-based similarity
  if (calculateTitleSimilarity(title1, title2) > 0.5) {
    return 'title_similarity'
  }

  return 'general_similarity'
}

/**
 * Generate semantic keywords from path structure and relationships
 */
function generateSemanticKeywords(
  pathParts,
  fileName,
  pageTitle,
  relationships,
) {
  const keywords = new Set()

  // Add directory-based keywords
  pathParts.forEach(part => {
    const normalized = part.toLowerCase().replace(/-/g, ' ')
    keywords.add(normalized)
    // Add individual words from hyphenated directory names
    normalized.split(' ').forEach(word => {
      if (word.length > 2) keywords.add(word)
    })
  })

  // Add file-based keywords
  if (fileName) {
    const fileWords = fileName.toLowerCase().replace(/-/g, ' ').split(' ')
    fileWords.forEach(word => {
      if (word.length > 2) keywords.add(word)
    })
  }

  // Add relationship-based keywords
  const allRelated = [
    ...relationships.siblings,
    ...relationships.cousins,
    ...relationships.semantic_matches,
  ]

  allRelated.forEach(related => {
    if (related.match_type) {
      keywords.add(related.match_type.replace('_', ' '))
    }
  })

  return Array.from(keywords).slice(0, 15) // Limit to 15 most relevant
}

/**
 * Generate URL from file path (fallback function)
 */
function generateFileUrl(filePath) {
  return (
    '/actions/' +
    filePath
      .replace('docs-actions-current/', '')
      .replace(/\.(md|mdx)$/, '')
      .replace(/\\/g, '/')
  )
}

async function scanDirectory(dirPath, productName) {
  const pages = []

  async function scanRecursive(currentPath) {
    const items = await fs.readdir(currentPath, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(currentPath, item.name)

      if (item.isDirectory()) {
        if (
          !item.name.startsWith('.') &&
          !item.name.startsWith('_') &&
          item.name !== 'node_modules' &&
          item.name !== 'build' &&
          item.name !== 'dist'
        ) {
          await scanRecursive(itemPath)
        }
      } else if (
        item.isFile() &&
        (item.name.endsWith('.mdx') || item.name.endsWith('.md'))
      ) {
        if (
          !item.name.startsWith('_') &&
          !item.name.startsWith('.') &&
          item.name !== 'README.mdx'
        ) {
          try {
            const page = await extractPageInfoWithHeaders(itemPath, productName)
            if (page && page.title) {
              pages.push(page)
            }
          } catch (error) {
            if (verboseMode || debugMode) {
              console.log(
                `    ⚠️  Skipping ${path.basename(itemPath)}: ${error.message}`,
              )
            }
          }
        }
      }
    }
  }

  await scanRecursive(dirPath)
  return pages
}

async function extractPageInfoWithHeaders(filePath, productName) {
  const content = await fs.readFile(filePath, 'utf8')
  const parsed = matter(content)

  // Apply variable substitutions to content and frontmatter
  parsed.content = applyVariableSubstitutions(parsed.content)
  if (parsed.data.title) {
    parsed.data.title = applyVariableSubstitutions(parsed.data.title)
  }
  if (parsed.data.description) {
    parsed.data.description = applyVariableSubstitutions(
      parsed.data.description,
    )
  }

  let title = null

  if (parsed.data.title) {
    title = parsed.data.title.trim()
  }
  if (!title && parsed.data.id) {
    title = applyVariableSubstitutions(parsed.data.id.trim())
  }
  if (!title) {
    const h1Match = parsed.content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      title = h1Match[1].trim()
    }
  }
  if (!title) {
    const filename = path.basename(filePath, path.extname(filePath))
    title = filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (title) {
    title = title
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const headers = extractHeaders(parsed.content)
  const excerpt = extractFirstLines(parsed.content)
  const metadata = extractMetadata(parsed.data)
  const contentType = detectContentType(filePath, title, headers, parsed.data)
  const complexity = analyzeComplexity(headers, parsed.content)
  const hasCode = parsed.content.includes('```')
  const hasImages = parsed.content.includes('![')
  const wordCount = excerpt ? (excerpt.match(/\w+/g) || []).length : 0

  return {
    title,
    headers,
    content: parsed.content,
    filePath: path.relative(process.cwd(), filePath),
    product: productName,
    frontmatter: parsed.data,
    excerpt,
    metadata,
    contentType,
    complexity,
    hasCode,
    hasImages,
    wordCount,
  }
}

function extractHeaders(content) {
  const headers = []
  const headerRegex = /^(#{2,6})\s+(.+)$/gm
  let match

  while ((match = headerRegex.exec(content)) !== null) {
    const headerText = match[2].trim()
    const cleanHeader = applyVariableSubstitutions(
      headerText
        .replace(/[#*_`\[\]]/g, '')
        .replace(/\{[^}]*\}/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )

    if (cleanHeader && cleanHeader.length > 0) {
      headers.push(cleanHeader)
    }
  }

  return headers
}

function extractFirstLines(content) {
  const contentBody = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#{1,6}\s+.*/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim()

  const paragraphs = contentBody.split('\n\n').filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0]?.trim()

  if (firstParagraph) {
    const sentences = firstParagraph
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0)
    const firstSentence = sentences[0]?.trim()
    const secondSentence = sentences[1]?.trim()

    let excerpt = firstSentence || ''
    if (secondSentence && (excerpt + '. ' + secondSentence).length < 150) {
      excerpt += '. ' + secondSentence
    }

    return applyVariableSubstitutions(
      excerpt
        .substring(0, 150)
        .replace(/[#*_`\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
  }

  return ''
}

function extractMetadata(frontmatter) {
  return {
    description: applyVariableSubstitutions(frontmatter.description || ''),
    keywords: frontmatter.keywords || [],
    tags: frontmatter.tags || [],
    sidebar_label: applyVariableSubstitutions(frontmatter.sidebar_label || ''),
    sidebar_position: frontmatter.sidebar_position || null,
    category: frontmatter.category || '',
    author: frontmatter.author || '',
    date: frontmatter.date || null,
  }
}

function detectContentType(filePath, title, headers, frontmatter) {
  const pathLower = filePath.toLowerCase()
  const titleLower = title.toLowerCase()
  const headerText = headers.join(' ').toLowerCase()

  if (pathLower.includes('/activity-repository/')) {
    return {
      type: 'activity',
      subtype: 'general-activity',
      category: 'automation',
      searchTerms: ['activity', 'action', 'task', 'automation', 'workflow'],
    }
  }

  if (pathLower.includes('/building-your-workflow/')) {
    return {
      type: 'tutorial',
      subtype: 'workflow-guide',
      category: 'learning',
      searchTerms: ['workflow', 'building', 'guide', 'tutorial', 'how to'],
    }
  }

  return {
    type: 'reference',
    subtype: 'documentation',
    category: 'reference',
    searchTerms: ['reference', 'documentation', 'guide'],
  }
}

function analyzeComplexity(headers, content) {
  const headerCount = headers.length
  const hasCode = content.includes('```')
  const hasImages = content.includes('![')

  if (headerCount > 8 || (headerCount > 5 && hasCode)) {
    return 'detailed'
  }
  if (headerCount > 3 || hasCode || hasImages) {
    return 'moderate'
  }
  return 'simple'
}

function isReleaseNotesFile(filePath) {
  const normalizedPath = filePath.toLowerCase()
  return (
    normalizedPath.includes('release notes') ||
    normalizedPath.includes('release-notes') ||
    normalizedPath.includes('releasenotes')
  )
}

function generateActionsPageUrl(filePath, frontmatter, routeBase) {
  let relativePath = filePath
    .replace(/.*docs-actions-current\//, '')
    .replace(/\.(md|mdx)$/, '')
    .replace(/\\/g, '/')

  if (!relativePath || relativePath === 'index') {
    relativePath = ''
  }

  const pathParts = relativePath.split('/').filter(part => part.length > 0)
  const originalFilename = pathParts.pop() || ''
  const directories = pathParts

  const transformedDirectories = directories.map(dir => encodeURIComponent(dir))

  let urlSegment = ''
  if (originalFilename && originalFilename !== 'index') {
    if (frontmatter && frontmatter.slug) {
      urlSegment = frontmatter.slug
    } else if (frontmatter && frontmatter.id) {
      urlSegment = frontmatter.id
    } else {
      urlSegment = originalFilename
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }
  }

  let url = `/${routeBase}`
  if (transformedDirectories.length > 0) {
    url += `/${transformedDirectories.join('/')}`
  }
  if (urlSegment) {
    url += `/${urlSegment}`
  }
  if (url !== `/${routeBase}` && !url.endsWith('/')) {
    url += '/'
  }

  return url
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔍 Enhanced Actions Documentation Scanner

Usage: node enhanced-scanner.js [options]

Options:
  --verbose           Show detailed progress information
  --debug             Show debug information and errors
  --no-minify         Skip minification (keep files readable)
  --help              Show this help

Features:
  ✅ Variable substitution (${
    Object.keys(VARIABLE_REPLACEMENTS).length
  } variables)
  ✅ Enhanced metadata extraction
  ✅ Code example preservation
  ✅ Link relationship mapping
  ✅ Question variation generation
  ✅ Multi-strategy chunking
  ✅ Content tag extraction

Examples:
  node enhanced-scanner.js                     # Generate enhanced JSON files
  node enhanced-scanner.js --verbose           # Detailed output
  node enhanced-scanner.js --debug             # Full debug information

OUTPUT:
  Enhanced chunks: static/data/documentation-chunks.json
`)
    process.exit(0)
  }

  ;(async () => {
    try {
      console.log('🚀 Enhanced Actions Documentation Scanner Starting...')
      console.log(
        `🔧 Features: Variable substitution, enhanced metadata, multi-strategy chunking`,
      )

      if (!skipMinify) {
        console.log('🛡️  Auto-minification enabled for protection')
      } else {
        console.log('📝 Minification disabled (--no-minify flag)')
      }

      const result = await scanActionsDocumentation()

      console.log('\n🎉 Enhanced scanning completed successfully!')
      console.log(`📊 Single comprehensive file created:`)
      console.log(`   📄 Documentation chunks: ${result.chunksPath}`)
      console.log(`   🧩 Contains chunks + page mappings + metadata`)

      console.log(`\n📈 Final Statistics:`)
      console.log(`   🧩 Total chunks: ${result.stats.totalChunks}`)
      console.log(`   📚 Total pages: ${result.stats.totalPages}`)
      console.log(
        `   📊 Average chunks per page: ${result.stats.averageChunksPerPage}`,
      )
      console.log(
        `   💻 Pages with code: ${result.stats.pagesWithCode || 'N/A'}`,
      )
      console.log(
        `   🏷️  Average tags per chunk: ${Math.round(
          result.stats.avgTagsPerChunk || 0,
        )}`,
      )
      console.log(
        `   🤝 Average relationships per page: ${Math.round(
          result.stats.avgRelationshipsPerPage || 0,
        )}`,
      )

      if (!skipMinify) {
        console.log('\n🛡️  File is now protected from casual editing')
        console.log('📋 Readable backup available in backup/ directory')
      }
    } catch (error) {
      console.error('❌ Enhanced scanner failed:', error.message)
      if (debugMode) {
        console.error('🐛 Full error stack:', error.stack)
      }
      console.error(
        '💡 Make sure you are running this from the project root directory',
      )
      process.exit(1)
    }
  })()
}

module.exports = { scanActionsDocumentation }
