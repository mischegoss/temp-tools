/**
 * Chatbot Training Data Generator
 * Transforms documentation into prompt-completion format for chatbot training
 * Run with: npm run generate-chatbot-data
 *
 * Features:
 * - Product selection interface (same as title scanner)
 * - Self-sufficient document scanning and URL generation
 * - Multiple prompt-completion pairs per document
 * - Automatic file chunking (100 pairs max per file)
 * - Chunked content by headers/sections
 * - Keywords extraction and URL prefixing
 * - Activity-specific and navigation queries
 */

const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const readline = require('readline')

// Hard-coded current versions for each product (same as title scanner)
const CURRENT_VERSIONS = {
  actions: null, // Actions only has one version, always no version in URL
  insights: ['latest', '11.0'], // Latest Insights version
  express: ['On-Premise 2.5'], // Latest Express version
  pro: ['latest', '8.0'], // Latest Pro version
}

// Product configurations (same as title scanner)
const PRODUCT_CONFIGS = {
  actions: {
    dirs: ['docs-actions', 'actions_versioned_docs'],
    routeBase: 'actions',
    name: 'Resolve Actions',
    description: 'IT automation and workflow orchestration platform',
  },
  express: {
    dirs: ['docs-express', 'express_versioned_docs'],
    routeBase: 'express',
    name: 'Resolve Express',
    description: 'Incident management and automation platform',
  },
  pro: {
    dirs: ['docs-pro', 'pro_versioned_docs'],
    routeBase: 'pro',
    name: 'Resolve Pro',
    description: 'Advanced monitoring and incident management',
  },
  insights: {
    dirs: ['docs-insights', 'insights_versioned_docs'],
    routeBase: 'insights',
    name: 'Resolve Insights',
    description: 'Analytics and business intelligence platform',
  },
}

const BASE_URL = 'https://docs.resolve.io'

async function selectProduct() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    console.log('\n🤖 Chatbot Data Generator - Product Selection')
    console.log('=============================================')
    console.log('Available products:')
    const products = Object.keys(PRODUCT_CONFIGS)
    products.forEach((product, index) => {
      console.log(
        `  ${index + 1}. ${product} (${PRODUCT_CONFIGS[product].name})`,
      )
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

async function generateChatbotDataForProduct(productName) {
  console.log(`\n🤖 Generating chatbot data for ${productName}...`)

  const config = PRODUCT_CONFIGS[productName]
  if (!config) {
    throw new Error(`Unknown product: ${productName}`)
  }

  // Scan documentation directly instead of loading mappings
  const documentationData = await scanProductDocumentation(productName, config)

  const promptCompletionPairs = []
  let processedDocuments = 0

  // Process each document
  for (const [title, data] of Object.entries(documentationData)) {
    // Skip metadata entries
    if (title.startsWith('_')) continue

    const fullUrl = `${BASE_URL}${data.url}`
    const keywords = extractKeywords(title, data)

    // Generate multiple prompt-completion pairs per document
    const pairs = generatePromptCompletionPairs(
      title,
      data,
      fullUrl,
      keywords,
      config,
    )
    promptCompletionPairs.push(...pairs)

    processedDocuments++

    if (processedDocuments % 10 === 0) {
      console.log(`  📄 Processed ${processedDocuments} documents...`)
    }
  }

  // Generate training data statistics
  const stats = generateTrainingStats(promptCompletionPairs, documentationData)

  // Split into chunks of 100 pairs maximum
  const maxPairsPerFile = 100
  const chunks = []

  for (let i = 0; i < promptCompletionPairs.length; i += maxPairsPerFile) {
    chunks.push(promptCompletionPairs.slice(i, i + maxPairsPerFile))
  }

  // Save each chunk as a separate file
  const savedFiles = []
  for (let i = 0; i < chunks.length; i++) {
    const chunkNumber = i + 1
    const outputPath = path.join(
      process.cwd(),
      `chatbot-training-data-${productName}-${chunkNumber
        .toString()
        .padStart(3, '0')}.json`,
    )

    await fs.writeFile(outputPath, JSON.stringify(chunks[i], null, 2))
    savedFiles.push({
      path: outputPath,
      pairs: chunks[i].length,
    })
  }

  console.log(`\n✅ Chatbot training data generated for ${productName}!`)
  console.log(`📊 Total documents processed: ${processedDocuments}`)
  console.log(
    `📊 Total prompt-completion pairs: ${promptCompletionPairs.length}`,
  )
  console.log(
    `📊 Average pairs per document: ${Math.round(
      promptCompletionPairs.length / processedDocuments,
    )}`,
  )
  console.log(`📊 Files created: ${savedFiles.length} (max 100 pairs each)`)
  console.log(`📊 Content breakdown:`)
  Object.entries(stats.contentTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} pairs`)
  })
  console.log(`📝 Saved files:`)
  savedFiles.forEach((file, index) => {
    console.log(
      `   ${index + 1}. ${path.basename(file.path)} (${file.pairs} pairs)`,
    )
  })

  return promptCompletionPairs
}

async function scanProductDocumentation(productName, config) {
  console.log(`\n📁 Scanning ${productName} documentation...`)

  const documentationData = {}
  let totalPages = 0
  let skippedReleaseNotes = 0

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

        documentationData[page.title] = {
          product: productName,
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
        }

        console.log(
          `  ✅ "${page.title}" → ${documentationData[page.title].url} [${
            page.contentType.type
          }]`,
        )
      })

      totalPages += pages.length
      console.log(`  📊 Found ${pages.length} pages in ${dirName}`)
    } catch (error) {
      console.log(`  📂 Skipping ${dirName} (not present)`)
    }
  }

  console.log(`📊 Total pages scanned: ${totalPages}`)
  console.log(`🚫 Skipped release notes: ${skippedReleaseNotes}`)

  return documentationData
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
        // Skip certain file patterns
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
            console.log(
              `    📄 Skipping ${path.basename(itemPath)} (parsing error)`,
            )
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

function extractHeaders(content) {
  const headers = []

  // Match H2 through H6 headers (## through ######)
  const headerRegex = /^(#{2,6})\s+(.+)$/gm
  let match

  while ((match = headerRegex.exec(content)) !== null) {
    const level = match[1].length // 2 for ##, 3 for ###, etc.
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

function isReleaseNotesFile(filePath) {
  const normalizedPath = filePath.toLowerCase()
  return (
    normalizedPath.includes('release notes') ||
    normalizedPath.includes('release-notes') ||
    normalizedPath.includes('releasenotes')
  )
}

function isCurrentVersion(productName, version) {
  if (productName === 'actions') {
    return true // Actions only has one version
  }

  const currentVersions = CURRENT_VERSIONS[productName] || []
  return !version || currentVersions.includes(version)
}

function generateCorrectedPageUrl(
  filePath,
  frontmatter,
  productName,
  routeBase,
) {
  // Step 1: Version Detection
  const versionMatch = filePath.match(/version-([^\/]+)\//)
  const version = versionMatch ? versionMatch[1] : null

  // Use corrected version logic
  const skipVersion = isCurrentVersion(productName, version)

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

  // Step 4: Directory Transformation (preserve case, encode spaces)
  const transformedDirectories = directories.map(dir =>
    encodeURIComponent(dir).replace(/%20/g, '%20'),
  )

  // Step 5: CORRECTED Filename/Slug Handling
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

  // Step 6: URL Construction
  let url = `/${routeBase}`

  // Add version only if not current version
  if (!skipVersion && version) {
    const encodedVersion = encodeURIComponent(version).replace(/%20/g, '%20')
    url += `/${encodedVersion}`
  }

  // Add directories
  if (transformedDirectories.length > 0) {
    url += `/${transformedDirectories.join('/')}`
  }

  // Add filename/slug
  if (urlSegment) {
    url += `/${urlSegment}`
  }

  // FIXED: Add trailing slash (except for root)
  if (url !== `/${routeBase}` && !url.endsWith('/')) {
    url += '/'
  }

  return url
}

function extractKeywords(title, data) {
  const keywords = new Set()

  // Add title words
  title
    .toLowerCase()
    .split(/\s+/)
    .forEach(word => {
      const cleaned = word.replace(/[^\w]/g, '')
      if (cleaned.length > 2) keywords.add(cleaned)
    })

  // Add product name
  keywords.add(data.product)

  // Add content type keywords
  if (data.contentType?.searchTerms) {
    data.contentType.searchTerms.forEach(term => keywords.add(term))
  }

  // Add header keywords (first few words of each header)
  data.headers?.slice(0, 5).forEach(header => {
    header
      .toLowerCase()
      .split(/\s+/)
      .slice(0, 3)
      .forEach(word => {
        const cleaned = word.replace(/[^\w]/g, '')
        if (cleaned.length > 2) keywords.add(cleaned)
      })
  })

  return Array.from(keywords)
}

function generatePromptCompletionPairs(
  title,
  data,
  fullUrl,
  keywords,
  productConfig,
) {
  const pairs = []

  // 1. Main document overview query
  pairs.push({
    prompt: `What is "${title}" in ${productConfig.name}?`,
    completion: generateDocumentOverview(title, data, fullUrl, productConfig),
  })

  // 2. Direct documentation request
  pairs.push({
    prompt: `Show me documentation for ${title}`,
    completion: generateDocumentationResponse(
      title,
      data,
      fullUrl,
      productConfig,
    ),
  })

  // 3. Activity-specific queries (if it's an activity)
  if (data.contentType?.type === 'activity') {
    pairs.push(...generateActivityQueries(title, data, fullUrl, productConfig))
  }

  // 4. Configuration queries (if it's configuration)
  if (data.contentType?.type === 'configuration') {
    pairs.push(
      ...generateConfigurationQueries(title, data, fullUrl, productConfig),
    )
  }

  // 5. Header-based queries (chunking by sections)
  if (data.headers?.length > 0) {
    pairs.push(
      ...generateHeaderBasedQueries(title, data, fullUrl, productConfig),
    )
  }

  // 6. Keyword-based queries
  if (keywords.length > 0) {
    pairs.push(
      ...generateKeywordQueries(title, data, fullUrl, keywords, productConfig),
    )
  }

  return pairs
}

function generateDocumentOverview(title, data, fullUrl, productConfig) {
  let overview = `"${title}" is a ${data.contentType?.type || 'feature'} in ${
    productConfig.name
  }`

  if (data.excerpt) {
    overview += `. ${data.excerpt}`
  }

  if (data.headers?.length > 0) {
    const topHeaders = data.headers.slice(0, 3).join(', ')
    overview += ` The documentation covers: ${topHeaders}`
    if (data.headers.length > 3) {
      overview += ` and ${data.headers.length - 3} more topics`
    }
    overview += '.'
  }

  // Add source information
  overview += `\n\nSource: "${title}"\nURL: ${fullUrl}`

  return overview
}

function generateDocumentationResponse(title, data, fullUrl, productConfig) {
  let response = `Here's the documentation for "${title}" in ${productConfig.name}:\n\n`

  if (data.excerpt) {
    response += `${data.excerpt}\n\n`
  }

  if (data.headers?.length > 0) {
    response += `This documentation includes:\n`
    data.headers.forEach(header => {
      response += `• ${header}\n`
    })
    response += '\n'
  }

  // Add source information
  response += `Source: "${title}"\nURL: ${fullUrl}`

  return response
}

function generateActivityQueries(title, data, fullUrl, productConfig) {
  const pairs = []

  // Activity purpose query
  pairs.push({
    prompt: `What does the ${title} activity do?`,
    completion: `The ${title} activity in ${productConfig.name} ${
      data.excerpt || 'performs automation tasks'
    }. ${
      data.headers?.includes('Activity Description')
        ? 'It includes detailed configuration options and output handling.'
        : ''
    }\n\nSource: "${title}"\nURL: ${fullUrl}`,
  })

  // Settings query (if has settings)
  if (data.headers?.some(h => h.toLowerCase().includes('settings'))) {
    pairs.push({
      prompt: `How do I configure ${title} settings?`,
      completion: `The ${title} activity can be configured through its settings panel. ${
        data.headers?.includes('Settings')
          ? 'The documentation covers all available configuration options.'
          : ''
      }\n\nSource: "${title}"\nURL: ${fullUrl}`,
    })
  }

  // Output query (if has output)
  if (data.headers?.some(h => h.toLowerCase().includes('output'))) {
    pairs.push({
      prompt: `What output does ${title} provide?`,
      completion: `The ${title} activity provides structured output data that can be used in subsequent workflow steps. For details on the output format and available variables, refer to the documentation.\n\nSource: "${title}"\nURL: ${fullUrl}`,
    })
  }

  return pairs
}

function generateConfigurationQueries(title, data, fullUrl, productConfig) {
  const pairs = []

  pairs.push({
    prompt: `How do I configure ${title}?`,
    completion: `To configure ${title} in ${productConfig.name}, ${
      data.excerpt || 'follow the setup instructions in the documentation'
    }. ${
      data.headers?.length > 0
        ? `The configuration covers: ${data.headers.slice(0, 3).join(', ')}.`
        : ''
    }\n\nSource: "${title}"\nURL: ${fullUrl}`,
  })

  return pairs
}

function generateHeaderBasedQueries(title, data, fullUrl, productConfig) {
  const pairs = []

  // Limit to first 5 headers to avoid too many pairs
  data.headers.slice(0, 5).forEach(header => {
    pairs.push({
      prompt: `Tell me about ${header} in ${title}`,
      completion: `The "${header}" section in ${title} provides specific information about this aspect of ${productConfig.name}. For detailed information about ${header}, refer to the complete documentation.\n\nSource: "${title}"\nURL: ${fullUrl}`,
    })
  })

  return pairs
}

function generateKeywordQueries(title, data, fullUrl, keywords, productConfig) {
  const pairs = []

  // Generate a few keyword-based queries
  const topKeywords = keywords.slice(0, 3)

  if (topKeywords.length > 1) {
    pairs.push({
      prompt: `${topKeywords.join(' ')} in ${productConfig.name}`,
      completion: `For information about ${topKeywords.join(', ')} in ${
        productConfig.name
      }, see "${title}". ${
        data.excerpt || ''
      }\n\nSource: "${title}"\nURL: ${fullUrl}`,
    })
  }

  return pairs
}

function generateTrainingStats(pairs, documentationData) {
  const stats = {
    contentTypes: {},
    totalPairs: pairs.length,
    averageCompletionLength: 0,
  }

  // Count by content type
  pairs.forEach(pair => {
    // Extract content type from completion or prompt
    const contentType = 'general' // Simplified for now
    stats.contentTypes[contentType] = (stats.contentTypes[contentType] || 0) + 1
  })

  // Calculate average completion length
  const totalLength = pairs.reduce(
    (sum, pair) => sum + pair.completion.length,
    0,
  )
  stats.averageCompletionLength = Math.round(totalLength / pairs.length)

  return stats
}

async function generateChatbotDataForAllProducts() {
  const products = Object.keys(PRODUCT_CONFIGS)
  const allResults = {}

  console.log('\n🚀 Generating chatbot data for all products...\n')

  for (const product of products) {
    try {
      const pairs = await generateChatbotDataForProduct(product)
      allResults[product] = pairs
      console.log('') // Add spacing between products
    } catch (error) {
      console.error(
        `❌ Failed to generate data for ${product}: ${error.message}`,
      )
    }
  }

  // Generate combined statistics
  const totalPairs = Object.values(allResults).reduce(
    (sum, pairs) => sum + pairs.length,
    0,
  )
  const totalFiles = Object.values(allResults).reduce(
    (sum, pairs) => sum + Math.ceil(pairs.length / 100),
    0,
  )

  console.log('✅ All product chatbot data generated!')
  console.log(`📊 Total training pairs across all products: ${totalPairs}`)
  console.log(`📊 Total files created: ${totalFiles}`)

  Object.entries(allResults).forEach(([product, pairs]) => {
    const fileCount = Math.ceil(pairs.length / 100)
    console.log(`   ${product}: ${pairs.length} pairs (${fileCount} files)`)
  })

  return allResults
}

// Main execution
if (require.main === module) {
  ;(async () => {
    try {
      const selectedProduct = await selectProduct()

      if (selectedProduct === 'all') {
        await generateChatbotDataForAllProducts()
      } else {
        await generateChatbotDataForProduct(selectedProduct)
      }
    } catch (error) {
      console.error('❌ Chatbot data generation failed:', error.message)
      console.error(
        '💡 Make sure you are running this from the project root directory',
      )
      process.exit(1)
    }
  })()
}

module.exports = {
  generateChatbotDataForProduct,
  generateChatbotDataForAllProducts,
}
