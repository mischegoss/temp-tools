/**
 * Enhanced Rita Go Title Scanner - docs-rita-go-current structure
 * Run with: npm run scan-rita-go
 *
 * RITA GO STRUCTURE:
 * - Directories: Proper-Case-With-Hyphens (Getting-Started, Knowledge-Base-Management)
 * - Files: lowercase-with-hyphens.mdx (knowledge-base-setup.mdx)
 * - URLs: /rita-go/Getting-Started/page-slug/ OR /rita-go/category/getting-started/
 * - Badges: users: true/false, admin: true/false (from frontmatter)
 */

const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const crypto = require('crypto')

// Hard-coded current versions - Rita Go only
const CURRENT_VERSIONS = {
  ritago: 'latest', // Rita Go only has one version
}

// Configuration for Rita Go only
const PRODUCT_CONFIGS = {
  ritago: {
    dirs: ['docs-rita-go-current'], // Rita Go documentation directory
    routeBase: 'rita-go',
  },
}

// Configuration flags
const verboseMode = process.argv.includes('--verbose')

/**
 * Normalize version strings - simplified for Rita Go
 */
function normalizeVersion(version) {
  return 'latest' // Rita Go only has latest
}

/**
 * Check if a version is the current version - always true for Rita Go
 */
function isCurrentVersion(productName, normalizedVersion) {
  return true // Rita Go only has current version
}

async function scanRitaGoDocumentation() {
  console.log('🔍 Scanning Rita Go documentation from docs-rita-go-current...')

  const config = PRODUCT_CONFIGS.ritago

  // Single version group for Rita Go
  const pages = []
  let totalPages = 0
  let skippedReleaseNotes = 0

  console.log('\n📁 Scanning docs-rita-go-current...')
  console.log(
    '📍 Expected structure: docs-rita-go-current/Getting-Started/Knowledge-Base-Management/...',
  )
  console.log('📍 Directory format: Proper-Case-With-Hyphens')
  console.log('📍 File format: lowercase-with-hyphens.mdx')

  for (const dirName of config.dirs) {
    const dirPath = path.join(process.cwd(), dirName)

    try {
      await fs.access(dirPath)
      const scannedPages = await scanDirectory(dirPath, 'ritago')

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
          url: generateRitaGoPageUrl(
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
          // Rita Go specific badges
          badges: page.badges || {},
          badgeType: page.badgeType || 'none',
          product: 'ritago',
          version: 'latest',
        })

        if (verboseMode) {
          console.log(
            `  ✅ "${page.title}" → latest [${page.contentType.type}] [${page.badgeType}]`,
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

  // Create enhanced mappings for Rita Go
  const enhancedMappings = {}
  let totalHeaders = 0

  // Enhanced statistics tracking
  const contentStats = {
    totalGettingStarted: 0,
    totalAdministration: 0,
    totalKnowledgeBase: 0,
    totalUserManagement: 0,
    totalTutorials: 0,
    totalConfigurations: 0,
    pagesWithCode: 0,
    pagesWithImages: 0,
    totalWords: 0,
    complexityBreakdown: {
      simple: 0,
      moderate: 0,
      detailed: 0,
    },
    badgeBreakdown: {
      users: 0,
      admin: 0,
      both: 0,
      none: 0,
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
      // Rita Go specific
      badges: page.badges,
      badgeType: page.badgeType,
    }

    // Update statistics
    totalHeaders += page.headers.length
    contentStats.totalWords += page.wordCount || 0
    if (page.hasCode) contentStats.pagesWithCode++
    if (page.hasImages) contentStats.pagesWithImages++

    // Content type statistics
    if (page.contentType.category === 'getting-started')
      contentStats.totalGettingStarted++
    if (page.contentType.category === 'administration')
      contentStats.totalAdministration++
    if (page.contentType.category === 'knowledge-management')
      contentStats.totalKnowledgeBase++
    if (page.contentType.category === 'user-management')
      contentStats.totalUserManagement++
    if (page.contentType.type === 'tutorial') contentStats.totalTutorials++
    if (page.contentType.type === 'configuration')
      contentStats.totalConfigurations++

    // Complexity statistics
    contentStats.complexityBreakdown[page.complexity]++

    // Badge statistics
    contentStats.badgeBreakdown[page.badgeType]++
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
    _PRODUCT: 'ritago',
    _VERSION: 'latest',
    _IS_CURRENT_VERSION: true,
    _TOTAL_PAGES: pages.length,
    _TOTAL_HEADERS: totalHeaders,
    _SKIPPED_RELEASE_NOTES: skippedReleaseNotes,
    _CONTENT_STATS: contentStats,
    _CURRENT_VERSIONS: CURRENT_VERSIONS,
    _CHECKSUM: checksum,
    _VERSION_INFO: 'Rita Go-only scan from docs-rita-go-current',
    _WARNING: '🚨 AUTO-GENERATED FILE - DO NOT EDIT MANUALLY 🚨',
    _REGENERATE: "Run 'npm run scan-rita-go' to regenerate this file",
    _FORMAT: 'Enhanced format with rich search metadata for Rita Go',
    _RITA_GO_ONLY:
      'Optimized for docs-rita-go-current structure with badge system',
    _FILTER_CATEGORIES: {
      byBadge: ['users', 'admin', 'both'],
      byContentType: ['users', 'admin'], // For filtering system
    },
    ...enhancedMappings,
  }

  // Write the Rita Go mapping file to static/data directory
  const outputPath = path.join(
    process.cwd(),
    'static/data/enhanced-title-mappings-rita-go-latest.json',
  )

  // Ensure static/data directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  try {
    // Write readable version only (no minification)
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')
    console.log('\n✅ Generated Rita Go mappings (readable)!')

    console.log(`📊 Pages: ${pages.length}`)
    console.log(`📊 Headers: ${totalHeaders}`)
    console.log(`📊 Getting Started: ${contentStats.totalGettingStarted}`)
    console.log(`📊 Administration: ${contentStats.totalAdministration}`)
    console.log(`📊 Knowledge Base: ${contentStats.totalKnowledgeBase}`)
    console.log(`📊 User Management: ${contentStats.totalUserManagement}`)
    console.log(`👤 Users Badge: ${contentStats.badgeBreakdown.users}`)
    console.log(`🔧 Admin Badge: ${contentStats.badgeBreakdown.admin}`)
    console.log(`🔄 Both Badge: ${contentStats.badgeBreakdown.both}`)
    console.log(`📝 Saved to: ${outputPath}`)
    console.log(`🔐 Checksum: ${checksum.substring(0, 12)}...`)

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
        (item.name.endsWith('.mdx') || item.name.endsWith('.md'))
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

  // Extract badge information from frontmatter
  const badges = extractBadges(parsed.data)
  const badgeType = determineBadgeType(badges)

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
    // Rita Go specific badge fields
    badges,
    badgeType,
  }
}

/**
 * Extract badge information from frontmatter
 */
function extractBadges(frontmatter) {
  return {
    users: frontmatter.users === true,
    admin: frontmatter.admin === true,
    trial: frontmatter.trial === true,
    premium: frontmatter.premium === true,
    enterprise: frontmatter.enterprise === true,
  }
}

/**
 * Determine badge type based on users/admin flags
 */
function determineBadgeType(badges) {
  const isUsers = badges.users === true
  const isAdmin = badges.admin === true

  if (isUsers && isAdmin) return 'both'
  if (isAdmin && !isUsers) return 'admin'
  if (isUsers && !isAdmin) return 'users'
  return 'none'
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
 * Smart content type detection for Rita Go - updated for Rita Go structure
 */
function detectContentType(filePath, title, headers, frontmatter) {
  const pathLower = filePath.toLowerCase()
  const titleLower = title.toLowerCase()
  const headerText = headers.join(' ').toLowerCase()

  // Getting-Started patterns
  if (pathLower.includes('/getting-started/')) {
    return {
      type: 'tutorial',
      subtype: 'getting-started',
      category: 'getting-started',
      searchTerms: [
        'getting started',
        'setup',
        'tutorial',
        'beginner',
        'introduction',
      ],
    }
  }

  // Administration patterns
  if (pathLower.includes('/administration/')) {
    return {
      type: 'configuration',
      subtype: 'administration',
      category: 'administration',
      searchTerms: [
        'administration',
        'admin',
        'management',
        'settings',
        'config',
      ],
    }
  }

  // Knowledge-Base-Management patterns
  if (pathLower.includes('/knowledge-base-management/')) {
    return {
      type: 'tutorial',
      subtype: 'knowledge-management',
      category: 'knowledge-management',
      searchTerms: [
        'knowledge base',
        'knowledge management',
        'documents',
        'articles',
        'content',
      ],
    }
  }

  // User-Management patterns
  if (pathLower.includes('/user-management/')) {
    return {
      type: 'configuration',
      subtype: 'user-management',
      category: 'user-management',
      searchTerms: [
        'user management',
        'users',
        'permissions',
        'accounts',
        'access',
      ],
    }
  }

  // Release-Notes patterns
  if (pathLower.includes('/release-notes/')) {
    return {
      type: 'reference',
      subtype: 'release-notes',
      category: 'release-notes',
      searchTerms: [
        'release notes',
        'updates',
        'changes',
        'version',
        'changelog',
      ],
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
 * Generate Rita Go page URL - adapted for Rita Go structure
 */
function generateRitaGoPageUrl(filePath, frontmatter, routeBase) {
  // Step 1: Path Extraction for docs-rita-go-current
  let relativePath = filePath
    .replace(/.*docs-rita-go-current\//, '') // Remove docs-rita-go-current prefix
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

  // Step 5: URL Construction (no version for Rita Go)
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
🔍 Rita Go Title Scanner

Usage: node rita-go-title-scanner.js [options]

Options:
  --verbose           Show detailed progress information
  --help              Show this help

Examples:
  node rita-go-title-scanner.js                    # Generate readable JSON
  node rita-go-title-scanner.js --verbose          # Show detailed progress
  npm run scan-rita-go                             # Generate readable JSON

📁 INPUT:
  Scans: docs-rita-go-current/ directory
  Structure: docs-rita-go-current/Getting-Started/Knowledge-Base-Management/page.mdx

📁 OUTPUT:
  File saved to: static/data/enhanced-title-mappings-rita-go-latest.json
  URLs generated: /rita-go/Getting-Started/Knowledge-Base-Management/page/

🏷️ BADGE SYSTEM:
  Reads frontmatter: users: true/false, admin: true/false
  Badge Types: users, admin, both, none
`)
    process.exit(0)
  }

  ;(async () => {
    try {
      console.log('🚀 Rita Go Title Scanner Starting...')
      console.log('📝 Generating readable JSON file with badge system')

      await scanRitaGoDocumentation()

      console.log('\n🎉 Rita Go title scanning completed successfully!')
      console.log(
        '📋 Generated clean, readable JSON file with badge filtering support',
      )
    } catch (error) {
      console.error('❌ Scanner failed:', error.message)
      console.error(
        '💡 Make sure you are running this from the project root directory',
      )
      process.exit(1)
    }
  })()
}

module.exports = { scanRitaGoDocumentation }
