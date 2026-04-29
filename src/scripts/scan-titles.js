/**
 * Enhanced Title Scanner with Per-Version JSON Files - FINAL CLEAN VERSION
 * Run with: npm run scan-titles
 *
 * ENHANCEMENTS:
 * - Creates separate JSON files per product version
 * - Consistent hyphen-based version naming
 * - Current version detection and priority
 * - Lazy-loading friendly structure
 * - 🛡️ JSON minification for protection against manual editing
 * - FIXED: Express version URL encoding issue
 */

const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const crypto = require('crypto')
const readline = require('readline')
const { JsonMinifier } = require('../utils/minifier')

// Hard-coded current versions for each product (using consistent format)
const CURRENT_VERSIONS = {
  actions: 'latest', // Actions only has one version
  insights: '11-0', // Current Insights version
  express: 'on-premise-2-5', // Current Express version
  pro: '8-0', // Current Pro version
}

// All known versions per product
const ALL_VERSIONS = {
  actions: ['latest'],
  insights: ['11-0', '9-6', '9-4'],
  express: ['on-premise-2-5', 'on-premise-2-4', 'on-premise-2-1', 'saas'],
  pro: ['8-0', '7-9', '7-8', '7-7', '7-6', '7-5'],
}

// Configuration: which directories belong to which products
const PRODUCT_CONFIGS = {
  actions: {
    dirs: ['docs-actions', 'actions_versioned_docs'],
    routeBase: 'actions',
  },
  express: {
    dirs: ['docs-express', 'express_versioned_docs'],
    routeBase: 'express',
  },
  pro: {
    dirs: ['docs-pro', 'pro_versioned_docs'],
    routeBase: 'pro',
  },
  insights: {
    dirs: ['docs-insights', 'insights_versioned_docs'],
    routeBase: 'insights',
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
 * Normalize version strings to consistent hyphen format
 */
function normalizeVersion(version) {
  if (!version) return 'latest'

  return version
    .toLowerCase()
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/\./g, '-') // Dots to hyphens
    .replace(/[^a-z0-9\-]/g, '-') // Other chars to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Convert file path version to normalized format
 */
function extractAndNormalizeVersion(filePath, productName) {
  // Extract version from file path
  const versionMatch = filePath.match(/version-([^\/]+)/)
  if (!versionMatch) {
    // Return the actual current version for this product
    return CURRENT_VERSIONS[productName] || 'latest'
  }

  const rawVersion = decodeURIComponent(versionMatch[1])
  return normalizeVersion(rawVersion)
}

/**
 * Check if a version is the current version for a product
 */
function isCurrentVersion(productName, normalizedVersion) {
  return CURRENT_VERSIONS[productName] === normalizedVersion
}

async function selectProduct() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    console.log('\n🔍 Title Scanner - Product Selection')
    console.log('=====================================')
    console.log('Available products:')
    const products = Object.keys(PRODUCT_CONFIGS)
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product}`)
    })
    console.log(
      `  ${products.length + 1}. all (generate files for all products)`,
    )

    rl.question(`\nSelect a product (1-${products.length + 1}): `, answer => {
      const choice = parseInt(answer)

      if (choice >= 1 && choice <= products.length) {
        const selectedProduct = products[choice - 1]
        console.log(`\n✅ Selected product: ${selectedProduct}`)
        rl.close()
        resolve(selectedProduct)
      } else if (choice === products.length + 1) {
        console.log('\n✅ Selected: Generate for all products')
        rl.close()
        resolve('all')
      } else {
        console.log('\n❌ Invalid selection. Please run again.')
        rl.close()
        process.exit(1)
      }
    })
  })
}

async function scanProductDocumentation(productName) {
  console.log(
    `🔍 Scanning ${productName} documentation with per-version file generation...`,
  )

  const config = PRODUCT_CONFIGS[productName]
  if (!config) {
    throw new Error(`Unknown product: ${productName}`)
  }

  // Group pages by version
  const pagesByVersion = {}
  let totalPages = 0
  let skippedReleaseNotes = 0

  console.log(`\n📁 Scanning ${productName}...`)

  for (const dirName of config.dirs) {
    const dirPath = path.join(process.cwd(), dirName)

    try {
      await fs.access(dirPath)
      const pages = await scanDirectory(dirPath, productName)

      pages.forEach(page => {
        // Skip release notes entirely
        if (isReleaseNotesFile(page.filePath)) {
          skippedReleaseNotes++
          return
        }

        // Extract and normalize version
        const normalizedVersion = extractAndNormalizeVersion(
          page.filePath,
          productName,
        )

        // Initialize version group if needed
        if (!pagesByVersion[normalizedVersion]) {
          pagesByVersion[normalizedVersion] = []
        }

        // Add page to version group
        pagesByVersion[normalizedVersion].push({
          title: page.title,
          headers: page.headers,
          filePath: page.filePath,
          url: generateCorrectedPageUrl(
            page.filePath,
            page.frontmatter,
            productName,
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
          product: productName,
          version: normalizedVersion, // Store normalized version
        })

        if (verboseMode) {
          console.log(
            `  ✅ "${page.title}" → v${normalizedVersion} [${page.contentType.type}]`,
          )
        }
      })

      totalPages += pages.length
      console.log(
        `  📊 Found ${pages.length} pages with ${pages.reduce(
          (sum, p) => sum + p.headers.length,
          0,
        )} headers in ${dirName}`,
      )
    } catch (error) {
      console.log(`  📂 Skipping ${dirName} (not present)`)
    }
  }

  // Generate separate JSON file for each version
  const generatedFiles = []
  let totalMinified = 0

  for (const [version, pages] of Object.entries(pagesByVersion)) {
    if (pages.length === 0) continue

    // Create version-specific mappings
    const enhancedMappings = {}
    let totalHeaders = 0

    // Enhanced statistics tracking for this version
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

    // Add metadata for this version
    const output = {
      _GENERATED: new Date().toISOString(),
      _PRODUCT: productName,
      _VERSION: version,
      _IS_CURRENT_VERSION: isCurrentVersion(productName, version),
      _TOTAL_PAGES: pages.length,
      _TOTAL_HEADERS: totalHeaders,
      _SKIPPED_RELEASE_NOTES:
        version === CURRENT_VERSIONS[productName] ? skippedReleaseNotes : 0,
      _CONTENT_STATS: contentStats,
      _CURRENT_VERSIONS: CURRENT_VERSIONS,
      _ALL_VERSIONS: ALL_VERSIONS,
      _CHECKSUM: checksum,
      _VERSION_INFO: `Per-version scan for ${productName} v${version}`,
      _WARNING: '🚨 AUTO-GENERATED FILE - DO NOT EDIT MANUALLY 🚨',
      _REGENERATE: "Run 'npm run scan-titles' to regenerate this file",
      _FORMAT: 'Per-version format with enhanced search metadata',
      ...enhancedMappings,
    }

    // Write the version-specific mapping file to static/data directory
    const outputPath = path.join(
      process.cwd(),
      `static/data/enhanced-title-mappings-${productName}-${version}.json`,
    )

    // Ensure static/data directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })

    try {
      if (skipMinify) {
        // Write readable version without minification
        await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')
        console.log(
          `\n✅ Generated ${productName} v${version} mappings (readable)!`,
        )
      } else {
        // Write readable version first
        await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')

        // Then minify in place for protection
        await minifier.minifyFile(outputPath)
        totalMinified++
        console.log(
          `\n✅ Generated and protected ${productName} v${version} mappings!`,
        )
      }

      generatedFiles.push(outputPath)

      console.log(`📊 Pages: ${pages.length}`)
      console.log(`📊 Headers: ${totalHeaders}`)
      console.log(
        `📊 Current version: ${
          isCurrentVersion(productName, version) ? 'YES' : 'NO'
        }`,
      )
      console.log(`📝 Saved to: ${outputPath}`)
      console.log(`🔐 Checksum: ${checksum.substring(0, 12)}...`)

      if (!skipMinify) {
        console.log(`🛡️  File minified and protected from casual editing`)
        console.log(`📋 Readable backup available in backup/ directory`)
      }
    } catch (error) {
      console.error(`❌ Error writing file ${outputPath}: ${error.message}`)
      throw error
    }
  }

  console.log(
    `\n🎉 Generated ${generatedFiles.length} version-specific files for ${productName}`,
  )
  if (!skipMinify && totalMinified > 0) {
    console.log(`🛡️  Protected ${totalMinified} files from manual editing`)
  }
  console.log(`📈 Versions created: ${Object.keys(pagesByVersion).join(', ')}`)

  return generatedFiles
}

async function scanAllDocumentation() {
  console.log('🔍 Generating per-version documentation files...')

  if (!skipMinify) {
    console.log('🛡️  Auto-minification enabled for protection')
  } else {
    console.log('📝 Minification disabled (--no-minify flag)')
  }

  const products = Object.keys(PRODUCT_CONFIGS)
  let allGeneratedFiles = []

  for (const product of products) {
    const files = await scanProductDocumentation(product)
    allGeneratedFiles = allGeneratedFiles.concat(files)
    console.log('') // Add spacing between products
  }

  console.log(`✅ Total files generated: ${allGeneratedFiles.length}`)

  if (!skipMinify) {
    // Print minification summary
    minifier.printSummary()
    console.log(`🛡️  All files are now protected from casual editing`)
    console.log(`📋 Readable backups stored in backup/ directories`)
  }

  console.log('\n🎯 Current versions for homepage preloading:')
  Object.entries(CURRENT_VERSIONS).forEach(([product, version]) => {
    console.log(
      `   ${product}: enhanced-title-mappings-${product}-${version}.json`,
    )
  })

  return allGeneratedFiles
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
        (item.name.endsWith('.md') || item.name.endsWith('.mdx'))
      ) {
        // Skip certain file patterns - this automatically excludes _category_.yml files
        if (
          !item.name.startsWith('_') &&
          !item.name.startsWith('.') &&
          item.name !== 'README.md'
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
 * Smart content type detection based on path, title, headers, and frontmatter
 */
function detectContentType(filePath, title, headers, frontmatter) {
  const pathLower = filePath.toLowerCase()
  const titleLower = title.toLowerCase()
  const headerText = headers.join(' ').toLowerCase()

  // Activity documentation patterns
  if (
    pathLower.includes('/list of activities/') ||
    pathLower.includes('/activities/')
  ) {
    return {
      type: 'activity',
      subtype: detectActivitySubtype(title, headers),
      category: 'automation',
      searchTerms: ['activity', 'action', 'task', 'automation', 'workflow'],
    }
  }

  // Configuration and setup patterns
  if (
    pathLower.includes('/configuration/') ||
    pathLower.includes('/config/') ||
    headerText.includes('settings') ||
    headerText.includes('configuration')
  ) {
    return {
      type: 'configuration',
      subtype: 'setup',
      category: 'setup',
      searchTerms: ['configuration', 'config', 'setup', 'settings', 'install'],
    }
  }

  // Getting started and tutorial patterns
  if (
    pathLower.includes('/getting started/') ||
    pathLower.includes('/getting%20started/') ||
    titleLower.includes('tutorial') ||
    titleLower.includes('getting started')
  ) {
    return {
      type: 'tutorial',
      subtype: 'guide',
      category: 'learning',
      searchTerms: [
        'tutorial',
        'guide',
        'getting started',
        'beginner',
        'how to',
      ],
    }
  }

  // Builder and designer patterns
  if (pathLower.includes('/builder/') || pathLower.includes('/designer/')) {
    return {
      type: 'builder',
      subtype: 'tool',
      category: 'design',
      searchTerms: [
        'builder',
        'designer',
        'create',
        'design',
        'tool',
        'editor',
      ],
    }
  }

  // Insight and analytics patterns
  if (pathLower.includes('/insight/') || pathLower.includes('/analytics/')) {
    return {
      type: 'insight',
      subtype: 'analytics',
      category: 'reporting',
      searchTerms: ['insight', 'analytics', 'report', 'dashboard', 'metrics'],
    }
  }

  // Home page and portal patterns
  if (pathLower.includes('/home page/') || pathLower.includes('/portal/')) {
    return {
      type: 'portal',
      subtype: 'interface',
      category: 'navigation',
      searchTerms: ['home', 'portal', 'dashboard', 'interface', 'main'],
    }
  }

  // Integration and module patterns
  if (
    pathLower.includes('/integration/') ||
    pathLower.includes('/module/') ||
    pathLower.includes('/connector/')
  ) {
    return {
      type: 'integration',
      subtype: 'connectivity',
      category: 'connectivity',
      searchTerms: ['integration', 'module', 'connector', 'api', 'connection'],
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
      searchTerms: ['overview', 'introduction', 'concept', 'about', 'summary'],
    }
  }

  // Repository and management patterns
  if (pathLower.includes('/repository/') || titleLower.includes('repository')) {
    return {
      type: 'repository',
      subtype: 'management',
      category: 'organization',
      searchTerms: ['repository', 'manage', 'organize', 'store', 'library'],
    }
  }

  // Default content type
  return {
    type: 'reference',
    subtype: 'documentation',
    category: 'reference',
    searchTerms: ['reference', 'documentation', 'guide', 'manual'],
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
 * FINAL FIXED: URL generation function - Clean and Simple
 */
function generateCorrectedPageUrl(
  filePath,
  frontmatter,
  productName,
  routeBase,
) {
  // Step 1: Extract and normalize version
  const normalizedVersion = extractAndNormalizeVersion(filePath, productName)
  const skipVersion = isCurrentVersion(productName, normalizedVersion)

  // Step 2: Path Extraction
  let relativePath = filePath
    .replace(/.*_versioned_docs\/[^\/]+\//, '') // Remove version prefix
    .replace(/.*docs-[^\/]+\//, '') // Remove docs prefix
    .replace(/\.(md|mdx)$/, '') // Remove extension
    .replace(/\\/g, '/') // Convert Windows paths

  if (!relativePath || relativePath === 'index') {
    relativePath = ''
  }

  // Step 3: Split path into directories and filename
  const pathParts = relativePath.split('/').filter(part => part.length > 0)
  const originalFilename = pathParts.pop() || ''
  const directories = pathParts

  // Step 4: Directory Transformation (preserve original structure - NO path changes)
  const transformedDirectories = directories.map(dir => encodeURIComponent(dir))

  // Step 5: Filename/Slug Handling
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

  // Step 6: FIXED URL Construction
  let url = `/${routeBase}`

  // Add version only if not current version
  if (!skipVersion && normalizedVersion !== 'latest') {
    let urlVersion

    if (
      productName === 'express' &&
      normalizedVersion.startsWith('on-premise-')
    ) {
      // FIXED: Proper Express version conversion
      // on-premise-2-4 → On-Premise 2.4 → On-Premise%202.4
      const versionNumber = normalizedVersion
        .replace('on-premise-', '') // Remove prefix: 2-4
        .replace('-', '.') // Convert to dots: 2.4
      urlVersion = encodeURIComponent(`On-Premise ${versionNumber}`)
    } else if (normalizedVersion === 'saas') {
      // Express SaaS version
      urlVersion = 'SaaS'
    } else {
      // Pro/Insights versions: 8-0 → 8.0
      urlVersion = normalizedVersion.replace(/-/g, '.')
    }

    url += `/${urlVersion}`
  }

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
🔍 Enhanced Title Scanner with Protection

Usage: node scan-titles.js [options]

Options:
  --verbose           Show detailed progress information
  --no-minify         Skip minification (keep files readable)
  --help              Show this help

Examples:
  node scan-titles.js                    # Interactive mode with protection
  node scan-titles.js --no-minify        # Keep files readable
  npm run scan-titles                    # Protected files (recommended)

📁 OUTPUT:
  Files saved to: static/data/enhanced-title-mappings-{product}-{version}.json
`)
    process.exit(0)
  }

  ;(async () => {
    try {
      console.log('🚀 Enhanced Title Scanner Starting...')

      if (!skipMinify) {
        console.log('🛡️  Auto-minification enabled for protection')
      } else {
        console.log('📝 Minification disabled (--no-minify flag)')
      }

      const selectedProduct = await selectProduct()

      if (selectedProduct === 'all') {
        console.log(
          '\n🚀 Generating per-version mappings for all products...\n',
        )
        await scanAllDocumentation()
      } else {
        await scanProductDocumentation(selectedProduct)
      }

      console.log('\n🎉 Title scanning completed successfully!')

      if (!skipMinify) {
        console.log('🛡️  All files are now protected from casual editing')
        console.log('📋 Readable backups available in backup/ directories')
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

module.exports = { scanAllDocumentation, scanProductDocumentation }
