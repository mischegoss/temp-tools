/**
 * Enhanced Actions-Only Title Scanner - docs-actions-current hyphenated structure
 * Run with: npm run scan-titles
 *
 * UPDATED FOR NEW STRUCTURE:
 * - Directories: Proper-Case-With-Hyphens (Activity-Repository, Active-Directory)
 * - Files: lowercase-with-hyphens.mdx (ad-copy-user.mdx)
 * - URLs: /actions/Activity-Repository/Active-Directory/Accounts/ad-copy-user/
 */

const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const crypto = require('crypto')
const { JsonMinifier } = require('../src/utils/minifier')

// Hard-coded current versions - Actions only
const CURRENT_VERSIONS = {
  actions: 'latest', // Actions only has one version
}

// Configuration for Actions only
const PRODUCT_CONFIGS = {
  actions: {
    dirs: ['docs-actions-current'], // Updated for your structure
    routeBase: 'actions',
  },
}

// Initialize minifier
const skipMinify = process.argv.includes('--no-minify')
const verboseMode = process.argv.includes('--verbose')
const minifier = new JsonMinifier({
  createBackups: true,
  verbose: verboseMode,
})

/**
 * Normalize version strings - simplified for Actions
 */
function normalizeVersion(version) {
  return 'latest' // Actions only has latest
}

/**
 * Check if a version is the current version - always true for Actions
 */
function isCurrentVersion(productName, normalizedVersion) {
  return true // Actions only has current version
}

async function scanActionsDocumentation() {
  console.log('🔍 Scanning Actions documentation from docs-actions-current...')

  const config = PRODUCT_CONFIGS.actions

  // Single version group for Actions
  const pages = []
  let totalPages = 0
  let skippedReleaseNotes = 0

  console.log('\n📁 Scanning docs-actions-current...')
  console.log(
    '📍 Expected structure: docs-actions-current/Activity-Repository/Active-Directory/...',
  )
  console.log('📍 Directory format: Proper-Case-With-Hyphens')
  console.log('📍 File format: lowercase-with-hyphens.mdx')

  for (const dirName of config.dirs) {
    const dirPath = path.join(process.cwd(), dirName)

    try {
      await fs.access(dirPath)
      const scannedPages = await scanDirectory(dirPath, 'actions')

      scannedPages.forEach(page => {
        // Skip release notes entirely
        if (isReleaseNotesFile(page.filePath)) {
          skippedReleaseNotes++
          return
        }

        // Add page to collection
        pages.push({
          title: page.title,
          headers: page.headers,
          filePath: page.filePath,
          url: generateActionsPageUrl(
            page.filePath,
            page.frontmatter,
            config.routeBase,
          ),
          slug: page.frontmatter?.slug || null,
          id: page.frontmatter?.id || null,
          excerpt: page.excerpt || '',
          metadata: page.metadata || {},
          contentType: page.contentType || {},
          complexity: page.complexity || 'simple',
          hasCode: page.hasCode || false,
          hasImages: page.hasImages || false,
          wordCount: page.wordCount || 0,
          product: 'actions',
          version: 'latest',
        })

        if (verboseMode) {
          console.log(
            `  ✅ "${page.title}" → latest [${page.contentType.type}]`,
          )
        }
      })

      totalPages += scannedPages.length
      console.log(
        `  📊 Found ${scannedPages.length} pages with ${scannedPages.reduce(
          (sum, p) => sum + p.headers.length,
          0,
        )} headers in ${dirName}`,
      )
    } catch (error) {
      console.log(`  📂 Skipping ${dirName} (not present)`)
    }
  }

  // Create enhanced mappings for Actions
  const enhancedMappings = {}
  let totalHeaders = 0

  // Enhanced statistics tracking
  const contentStats = {
    totalActivities: 0,
    totalConfigurations: 0,
    totalTutorials: 0,
    totalOverviews: 0,
    pagesWithCode: 0,
    pagesWithImages: 0,
    totalWords: 0,
    complexityBreakdown: {
      simple: 0,
      moderate: 0,
      detailed: 0,
    },
  }

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
    }

    // Update statistics
    totalHeaders += page.headers.length
    contentStats.totalWords += page.wordCount || 0
    if (page.hasCode) contentStats.pagesWithCode++
    if (page.hasImages) contentStats.pagesWithImages++

    // Content type statistics
    if (page.contentType.type === 'activity') contentStats.totalActivities++
    if (page.contentType.type === 'configuration')
      contentStats.totalConfigurations++
    if (page.contentType.type === 'tutorial') contentStats.totalTutorials++
    if (page.contentType.type === 'overview') contentStats.totalOverviews++

    // Complexity statistics
    contentStats.complexityBreakdown[page.complexity]++
  })

  // Calculate enhanced statistics
  contentStats.averageHeadersPerPage =
    pages.length > 0 ? Math.round(totalHeaders / pages.length) : 0
  contentStats.averageWordsPerPage =
    pages.length > 0 ? Math.round(contentStats.totalWords / pages.length) : 0

  // Calculate checksum for validation
  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(enhancedMappings))
    .digest('hex')

  // Add metadata
  const output = {
    _GENERATED: new Date().toISOString(),
    _PRODUCT: 'actions',
    _VERSION: 'latest',
    _IS_CURRENT_VERSION: true,
    _TOTAL_PAGES: pages.length,
    _TOTAL_HEADERS: totalHeaders,
    _SKIPPED_RELEASE_NOTES: skippedReleaseNotes,
    _CONTENT_STATS: contentStats,
    _CURRENT_VERSIONS: CURRENT_VERSIONS,
    _CHECKSUM: checksum,
    _VERSION_INFO: 'Actions-only scan from docs-actions-current',
    _WARNING: '🚨 AUTO-GENERATED FILE - DO NOT EDIT MANUALLY 🚨',
    _REGENERATE: "Run 'npm run scan-titles' to regenerate this file",
    _FORMAT: 'Enhanced format with rich search metadata for Actions',
    _ACTIONS_ONLY: 'Optimized for docs-actions-current flat structure',
    ...enhancedMappings,
  }

  // Write the Actions mapping file to static/data directory
  const outputPath = path.join(
    process.cwd(),
    'static/data/enhanced-title-mappings-actions-latest.json',
  )

  // Ensure static/data directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  try {
    if (skipMinify) {
      // Write readable version without minification
      await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')
      console.log('\n✅ Generated Actions mappings (readable)!')
    } else {
      // Write readable version first
      await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')

      // Then minify in place for protection
      await minifier.minifyFile(outputPath)
      console.log('\n✅ Generated and protected Actions mappings!')
    }

    console.log(`📊 Pages: ${pages.length}`)
    console.log(`📊 Headers: ${totalHeaders}`)
    console.log(`📊 Activities: ${contentStats.totalActivities}`)
    console.log(`📊 Configurations: ${contentStats.totalConfigurations}`)
    console.log(`📊 Tutorials: ${contentStats.totalTutorials}`)
    console.log(`📝 Saved to: ${outputPath}`)
    console.log(`🔐 Checksum: ${checksum.substring(0, 12)}...`)

    if (!skipMinify) {
      console.log('🛡️  File minified and protected from casual editing')
      console.log('📋 Readable backup available in backup/ directory')
    }

    return outputPath
  } catch (error) {
    console.error(`❌ Error writing file ${outputPath}: ${error.message}`)
    throw error
  }
}

async function scanDirectory(dirPath, productName) {
  const pages = []

  async function scanRecursive(currentPath) {
    const items = await fs.readdir(currentPath, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(currentPath, item.name)

      if (item.isDirectory()) {
        // Skip system directories and certain patterns
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
        (item.name.endsWith('.mdx') || item.name.endsWith('.mdx'))
      ) {
        // Skip certain file patterns
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
            if (verboseMode) {
              console.log(
                `    📄 Skipping ${path.basename(itemPath)} (parsing error)`,
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

  let title = null

  // Method 1: Try frontmatter title
  if (parsed.data.title) {
    title = parsed.data.title.trim()
  }

  // Method 2: Try frontmatter id as title
  if (!title && parsed.data.id) {
    title = parsed.data.id.trim()
  }

  // Method 3: Try first H1 in content
  if (!title) {
    const h1Match = parsed.content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      title = h1Match[1].trim()
    }
  }

  // Method 4: Use filename as fallback
  if (!title) {
    const filename = path.basename(filePath, path.extname(filePath))
    title = filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Clean up title
  if (title) {
    title = title
      .replace(/[#*_`]/g, '') // Remove markdown formatting
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }

  // Extract headers (H2 through H6) from content
  const headers = extractHeaders(parsed.content)

  // Extract first line/excerpt for search context
  const excerpt = extractFirstLines(parsed.content)

  // Extract enhanced frontmatter metadata
  const metadata = extractMetadata(parsed.data)

  // Detect content type and complexity
  const contentType = detectContentType(filePath, title, headers, parsed.data)
  const complexity = analyzeComplexity(headers, parsed.content)

  // Content flags
  const hasCode = parsed.content.includes('```')
  const hasImages = parsed.content.includes('![')

  // Approximate word count from excerpt
  const wordCount = excerpt ? (excerpt.match(/\w+/g) || []).length : 0

  return {
    title,
    headers,
    filePath: path.relative(process.cwd(), filePath),
    product: productName,
    frontmatter: parsed.data,
    // Enhanced fields
    excerpt,
    metadata,
    contentType,
    complexity,
    hasCode,
    hasImages,
    wordCount,
  }
}

/**
 * Enhanced header extraction - captures H2 through H6
 */
function extractHeaders(content) {
  const headers = []

  // Match H2 through H6 headers (## through ######)
  const headerRegex = /^(#{2,6})\s+(.+)$/gm
  let match

  while ((match = headerRegex.exec(content)) !== null) {
    const headerText = match[2].trim()

    // Clean up header text
    const cleanHeader = headerText
      .replace(/[#*_`\[\]]/g, '') // Remove markdown formatting
      .replace(/\{[^}]*\}/g, '') // Remove JSX props like {#anchor}
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    if (cleanHeader && cleanHeader.length > 0) {
      headers.push(cleanHeader)
    }
  }

  return headers
}

/**
 * Extract first 1-2 sentences for search context
 */
function extractFirstLines(content) {
  // Remove frontmatter and headers
  const contentBody = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/^#{1,6}\s+.*/gm, '') // Remove headers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .trim()

  // Get first meaningful paragraph
  const paragraphs = contentBody.split('\n\n').filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0]?.trim()

  if (firstParagraph) {
    // Extract first 1-2 sentences (up to 150 chars)
    const sentences = firstParagraph
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0)
    const firstSentence = sentences[0]?.trim()
    const secondSentence = sentences[1]?.trim()

    let excerpt = firstSentence || ''
    if (secondSentence && (excerpt + '. ' + secondSentence).length < 150) {
      excerpt += '. ' + secondSentence
    }

    // Clean up and limit length
    return excerpt
      .substring(0, 150)
      .replace(/[#*_`\[\]]/g, '') // Remove markdown
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }

  return ''
}

/**
 * Extract enhanced metadata from frontmatter
 */
function extractMetadata(frontmatter) {
  return {
    description: frontmatter.description || '',
    keywords: frontmatter.keywords || [],
    tags: frontmatter.tags || [],
    sidebar_label: frontmatter.sidebar_label || '',
    sidebar_position: frontmatter.sidebar_position || null,
    category: frontmatter.category || '',
    author: frontmatter.author || '',
    date: frontmatter.date || null,
  }
}

/**
 * Smart content type detection for Actions - updated for hyphenated structure
 */
function detectContentType(filePath, title, headers, frontmatter) {
  const pathLower = filePath.toLowerCase()
  const titleLower = title.toLowerCase()
  const headerText = headers.join(' ').toLowerCase()

  // Activity-Repository patterns (main activities section)
  if (pathLower.includes('/activity-repository/')) {
    return {
      type: 'activity',
      subtype: detectActivitySubtype(title, headers),
      category: 'automation',
      searchTerms: ['activity', 'action', 'task', 'automation', 'workflow'],
    }
  }

  // Building-Your-Workflow patterns
  if (pathLower.includes('/building-your-workflow/')) {
    return {
      type: 'tutorial',
      subtype: 'workflow-guide',
      category: 'learning',
      searchTerms: ['workflow', 'building', 'guide', 'tutorial', 'how to'],
    }
  }

  // Getting-Started patterns
  if (pathLower.includes('/getting-started/')) {
    return {
      type: 'tutorial',
      subtype: 'getting-started',
      category: 'learning',
      searchTerms: ['getting started', 'setup', 'tutorial', 'beginner'],
    }
  }

  // Product-Navigation patterns
  if (pathLower.includes('/product-navigation/')) {
    return {
      type: 'reference',
      subtype: 'navigation',
      category: 'interface',
      searchTerms: ['navigation', 'interface', 'ui', 'product', 'feature'],
    }
  }

  // Support-and-Troubleshooting patterns
  if (pathLower.includes('/support-and-troubleshooting/')) {
    return {
      type: 'reference',
      subtype: 'troubleshooting',
      category: 'support',
      searchTerms: ['support', 'troubleshooting', 'help', 'issues', 'problems'],
    }
  }

  // Creating-Self-Service-Forms patterns
  if (pathLower.includes('/creating-self-service-forms/')) {
    return {
      type: 'tutorial',
      subtype: 'self-service',
      category: 'forms',
      searchTerms: ['self-service', 'forms', 'create', 'tutorial'],
    }
  }

  // Developing-Custom-Activities patterns
  if (pathLower.includes('/developing-custom-activities/')) {
    return {
      type: 'tutorial',
      subtype: 'development',
      category: 'development',
      searchTerms: [
        'development',
        'custom',
        'activities',
        'coding',
        'advanced',
      ],
    }
  }

  // Automation-Use-Cases patterns
  if (pathLower.includes('/automation-use-cases/')) {
    return {
      type: 'tutorial',
      subtype: 'use-cases',
      category: 'examples',
      searchTerms: ['automation', 'use cases', 'examples', 'scenarios'],
    }
  }

  // Configuration patterns (general)
  if (
    pathLower.includes('/configuration/') ||
    headerText.includes('settings') ||
    headerText.includes('configuration')
  ) {
    return {
      type: 'configuration',
      subtype: 'setup',
      category: 'setup',
      searchTerms: ['configuration', 'config', 'setup', 'settings'],
    }
  }

  // Workflow-Designer patterns
  if (pathLower.includes('/workflow-designer/')) {
    return {
      type: 'builder',
      subtype: 'workflow-designer',
      category: 'design',
      searchTerms: ['workflow', 'designer', 'builder', 'create', 'design'],
    }
  }

  // Repository patterns
  if (pathLower.includes('/repository/')) {
    return {
      type: 'repository',
      subtype: 'management',
      category: 'organization',
      searchTerms: ['repository', 'manage', 'organize', 'store'],
    }
  }

  // Insight patterns
  if (pathLower.includes('/insight/')) {
    return {
      type: 'insight',
      subtype: 'analytics',
      category: 'reporting',
      searchTerms: ['insight', 'analytics', 'report', 'dashboard'],
    }
  }

  // Overview and introduction patterns
  if (
    titleLower.includes('overview') ||
    titleLower.includes('introduction') ||
    headers.some(
      h =>
        h.toLowerCase().includes('overview') ||
        h.toLowerCase().includes('introduction'),
    )
  ) {
    return {
      type: 'overview',
      subtype: 'conceptual',
      category: 'documentation',
      searchTerms: ['overview', 'introduction', 'concept', 'about'],
    }
  }

  // Default content type
  return {
    type: 'reference',
    subtype: 'documentation',
    category: 'reference',
    searchTerms: ['reference', 'documentation', 'guide'],
  }
}

/**
 * Detect specific activity subtype based on patterns
 */
function detectActivitySubtype(title, headers) {
  const titleLower = title.toLowerCase()
  const headerText = headers.join(' ').toLowerCase()

  if (headerText.includes('settings') && headerText.includes('output')) {
    return 'configurable-data-activity'
  }
  if (headerText.includes('settings')) {
    return 'configurable-activity'
  }
  if (headerText.includes('output')) {
    return 'data-activity'
  }
  if (titleLower.includes('create') || titleLower.includes('new')) {
    return 'creation-activity'
  }
  if (
    titleLower.includes('update') ||
    titleLower.includes('modify') ||
    titleLower.includes('edit')
  ) {
    return 'modification-activity'
  }
  if (titleLower.includes('delete') || titleLower.includes('remove')) {
    return 'deletion-activity'
  }
  if (
    titleLower.includes('get') ||
    titleLower.includes('retrieve') ||
    titleLower.includes('fetch')
  ) {
    return 'retrieval-activity'
  }
  if (titleLower.includes('send') || titleLower.includes('communicate')) {
    return 'communication-activity'
  }

  return 'general-activity'
}

/**
 * Analyze content complexity based on headers and content
 */
function analyzeComplexity(headers, content) {
  const headerCount = headers.length
  const hasCode = content.includes('```')
  const hasImages = content.includes('![')
  const hasLinks = content.includes('](')

  // Complex content indicators
  if (headerCount > 8 || (headerCount > 5 && hasCode)) {
    return 'detailed'
  }

  // Moderate complexity
  if (headerCount > 3 || hasCode || hasImages || hasLinks) {
    return 'moderate'
  }

  // Simple content
  return 'simple'
}

/**
 * Check if a file is a release notes file (to be skipped)
 */
function isReleaseNotesFile(filePath) {
  const normalizedPath = filePath.toLowerCase()
  return (
    normalizedPath.includes('release notes') ||
    normalizedPath.includes('release-notes') ||
    normalizedPath.includes('releasenotes')
  )
}

/**
 * Generate Actions page URL - simplified for flat structure
 */
function generateActionsPageUrl(filePath, frontmatter, routeBase) {
  // Step 1: Path Extraction for docs-actions-current
  let relativePath = filePath
    .replace(/.*docs-actions-current\//, '') // Remove docs-actions-current prefix
    .replace(/\.(md|mdx)$/, '') // Remove extension
    .replace(/\\/g, '/') // Convert Windows paths

  if (!relativePath || relativePath === 'index') {
    relativePath = ''
  }

  // Step 2: Split path into directories and filename
  const pathParts = relativePath.split('/').filter(part => part.length > 0)
  const originalFilename = pathParts.pop() || ''
  const directories = pathParts

  // Step 3: Directory Transformation (preserve original structure)
  const transformedDirectories = directories.map(dir => encodeURIComponent(dir))

  // Step 4: Filename/Slug Handling
  let urlSegment = ''
  if (originalFilename && originalFilename !== 'index') {
    // PRIORITY 1: Check frontmatter for slug
    if (frontmatter && frontmatter.slug) {
      urlSegment = frontmatter.slug
    }
    // PRIORITY 2: Check frontmatter for id
    else if (frontmatter && frontmatter.id) {
      urlSegment = frontmatter.id
    }
    // PRIORITY 3: Transform filename as fallback
    else {
      urlSegment = originalFilename
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }
  }

  // Step 5: URL Construction (no version for Actions)
  let url = `/${routeBase}`

  // Add directories (preserving original structure)
  if (transformedDirectories.length > 0) {
    url += `/${transformedDirectories.join('/')}`
  }

  // Add filename/slug
  if (urlSegment) {
    url += `/${urlSegment}`
  }

  // Add trailing slash (except for root)
  if (url !== `/${routeBase}` && !url.endsWith('/')) {
    url += '/'
  }

  if (verboseMode) {
    console.log(`🔧 URL Generated: ${url}`)
  }

  return url
}

// Run the scanner if this script is executed directly
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔍 Actions-Only Title Scanner

Usage: node actions-title-scanner.js [options]

Options:
  --verbose           Show detailed progress information
  --no-minify         Skip minification (keep files readable)
  --help              Show this help

Examples:
  node actions-title-scanner.js                    # Generate with protection
  node actions-title-scanner.js --no-minify        # Keep files readable
  npm run scan-actions                             # Protected files (recommended)

📁 INPUT:
  Scans: docs-actions-current/ directory
  Structure: docs-actions-current/Activity-Repository/Active-Directory/Accounts/ad-copy-user.mdx

📁 OUTPUT:
  File saved to: static/data/enhanced-title-mappings-actions-latest.json
  URLs generated: /actions/Activity-Repository/Active-Directory/Accounts/ad-copy-user/
`)
    process.exit(0)
  }

  ;(async () => {
    try {
      console.log('🚀 Actions Title Scanner Starting...')

      if (!skipMinify) {
        console.log('🛡️  Auto-minification enabled for protection')
      } else {
        console.log('📝 Minification disabled (--no-minify flag)')
      }

      await scanActionsDocumentation()

      console.log('\n🎉 Actions title scanning completed successfully!')

      if (!skipMinify) {
        console.log('🛡️  File is now protected from casual editing')
        console.log('📋 Readable backup available in backup/ directory')
      }
    } catch (error) {
      console.error('❌ Scanner failed:', error.message)
      console.error(
        '💡 Make sure you are running this from the project root directory',
      )
      process.exit(1)
    }
  })()
}

module.exports = { scanActionsDocumentation }
