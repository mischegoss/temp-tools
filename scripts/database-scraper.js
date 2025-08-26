/**
 * Enhanced Actions Documentation Scanner with Vector Embeddings
 * Updated to use js-tiktoken for accurate token estimation
 * Run with: npm run scan-titles-vectors
 */

require('dotenv').config()
const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const crypto = require('crypto')
const { JsonMinifier } = require('../src/utils/minifier')
const { TokenEstimator } = require('./token-estimator') // Import token estimator

// Google Cloud imports
const { Storage } = require('@google-cloud/storage')
const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1

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

// Google Cloud Configuration
const GOOGLE_CLOUD_CONFIG = {
  projectId: 'actions-chatbot-470114',
  location: 'us-central1',
  bucketName: 'actions-storage-bucket',
  indexName: 'documentation-search-index',
}

// Enhanced Chunking Configuration with more realistic token limits
const CHUNK_CONFIG = {
  maxTokens: 800, // Maximum tokens per chunk
  minTokens: 100, // Minimum viable chunk size
  overlapTokens: 50, // Overlap between chunks for context
  targetChunkSize: 400, // Ideal chunk size
  embeddingModel: 'text-embedding-3-small', // Model for token estimation
}

// Initialize services
const skipMinify = process.argv.includes('--no-minify')
const verboseMode = process.argv.includes('--verbose')
const generateVectors = process.argv.includes('--vectors')
const minifier = new JsonMinifier({
  createBackups: true,
  verbose: verboseMode,
})

let storage = null
let predictionClient = null
let tokenEstimator = null

// Initialize token estimator
async function initializeTokenEstimator() {
  try {
    tokenEstimator = new TokenEstimator(CHUNK_CONFIG.embeddingModel)
    console.log('✅ Token estimator initialized with js-tiktoken')

    // Test the estimator with a sample
    const testText =
      'This is a test to verify token counting accuracy with the Actions documentation scanner.'
    const tokenCount = tokenEstimator.countTokens(testText)
    console.log(
      `📊 Test: "${testText.substring(0, 50)}..." = ${tokenCount} tokens`,
    )

    return tokenEstimator
  } catch (error) {
    console.error('❌ Failed to initialize token estimator:', error.message)
    console.log('📦 Make sure to install js-tiktoken: npm install js-tiktoken')
    throw error
  }
}

// Initialize Google Cloud services
async function initializeGoogleCloud() {
  if (!generateVectors) return

  try {
    // Initialize Prediction Service Client for Vertex AI
    predictionClient = new PredictionServiceClient({
      apiEndpoint: `${GOOGLE_CLOUD_CONFIG.location}-aiplatform.googleapis.com`,
    })

    // Initialize Cloud Storage
    storage = new Storage({
      projectId: GOOGLE_CLOUD_CONFIG.projectId,
    })

    console.log('✅ Google Cloud services initialized')
    console.log(`📍 Project: ${GOOGLE_CLOUD_CONFIG.projectId}`)
    console.log(`📍 Location: ${GOOGLE_CLOUD_CONFIG.location}`)
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud:', error.message)
    throw error
  }
}

/**
 * Enhanced chunking function with accurate token counting
 */
function chunkPageContent(content, headers, pageMetadata) {
  if (!tokenEstimator) {
    throw new Error('Token estimator not initialized')
  }

  const chunks = []

  // Remove frontmatter
  const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim()

  // Split by H2 and H3 headers for logical sections
  const headerRegex = /^(#{2,3})\s+(.+)$/gm
  const sections = []
  let currentSection = {
    header: pageMetadata.title || 'Introduction',
    level: 1,
    content: '',
    startIndex: 0,
  }

  let lastIndex = 0
  let match

  while ((match = headerRegex.exec(cleanContent)) !== null) {
    // Save content before this header to current section
    currentSection.content = cleanContent.slice(lastIndex, match.index).trim()

    if (currentSection.content) {
      sections.push({ ...currentSection })
    }

    // Start new section
    currentSection = {
      header: match[2].trim(),
      level: match[1].length,
      content: '',
      startIndex: match.index,
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining content to last section
  if (lastIndex < cleanContent.length) {
    currentSection.content = cleanContent.slice(lastIndex).trim()
    if (currentSection.content) {
      sections.push(currentSection)
    }
  }

  // If no sections found, treat entire content as one section
  if (sections.length === 0) {
    sections.push({
      header: pageMetadata.title || 'Content',
      level: 1,
      content: cleanContent,
    })
  }

  // Process each section into optimally-sized chunks
  sections.forEach((section, sectionIndex) => {
    const sectionChunks = createOptimalChunksFromSection(
      section,
      pageMetadata,
      sectionIndex,
    )
    chunks.push(...sectionChunks)
  })

  return chunks
}

/**
 * Create optimally-sized chunks from a section using accurate token counting
 */
function createOptimalChunksFromSection(section, pageMetadata, sectionIndex) {
  if (!tokenEstimator) {
    throw new Error('Token estimator not initialized')
  }

  const chunks = []
  const actualTokenCount = tokenEstimator.countTokens(section.content)

  // Log token analysis if in verbose mode
  if (verboseMode) {
    console.log(`  🔍 Section "${section.header}": ${actualTokenCount} tokens`)
  }

  if (
    actualTokenCount <= CHUNK_CONFIG.maxTokens &&
    actualTokenCount >= CHUNK_CONFIG.minTokens
  ) {
    // Section fits perfectly in one chunk
    chunks.push(
      createChunk(
        section.content,
        section.header,
        pageMetadata,
        sectionIndex,
        0,
        actualTokenCount,
      ),
    )
  } else if (actualTokenCount < CHUNK_CONFIG.minTokens) {
    // Section is small but we'll keep it for completeness
    chunks.push(
      createChunk(
        section.content,
        section.header,
        pageMetadata,
        sectionIndex,
        0,
        actualTokenCount,
      ),
    )

    if (verboseMode) {
      console.log(
        `    ⚠️  Small chunk (${actualTokenCount} tokens) - may need combining`,
      )
    }
  } else {
    // Section is too large - use smart splitting
    const subChunks = tokenEstimator.splitIntoChunks(
      section.content,
      CHUNK_CONFIG.maxTokens,
      CHUNK_CONFIG.overlapTokens,
    )

    subChunks.forEach((chunkContent, chunkIndex) => {
      const chunkTokens = tokenEstimator.countTokens(chunkContent)
      chunks.push(
        createChunk(
          chunkContent,
          section.header,
          pageMetadata,
          sectionIndex,
          chunkIndex,
          chunkTokens,
        ),
      )

      if (verboseMode) {
        console.log(
          `    ✂️  Split chunk ${chunkIndex + 1}: ${chunkTokens} tokens`,
        )
      }
    })
  }

  return chunks
}

/**
 * Create a standardized chunk object with accurate token count
 */
function createChunk(
  content,
  header,
  pageMetadata,
  sectionIndex,
  chunkIndex,
  tokenCount = null,
) {
  if (!tokenEstimator) {
    throw new Error('Token estimator not initialized')
  }

  // Calculate actual token count if not provided
  const actualTokens = tokenCount || tokenEstimator.countTokens(content)

  // Clean content for embedding (but preserve original)
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '[CODE_BLOCK]')
    .replace(/!\[.*?\]\(.*?\)/g, '[IMAGE]')
    .replace(/\[.*?\]\(.*?\)/g, '[LINK]')
    .replace(/\s+/g, ' ')
    .trim()

  const chunkId = `${pageMetadata.url.replace(
    /[^a-zA-Z0-9]/g,
    '_',
  )}_s${sectionIndex}_c${chunkIndex}`

  return {
    id: chunkId,
    content: cleanContent,
    originalContent: content,
    header: header,
    sourceUrl: pageMetadata.url,
    pageTitle: pageMetadata.title,
    contentType: pageMetadata.contentType,
    complexity: pageMetadata.complexity,
    tokens: actualTokens, // Now accurate with js-tiktoken!
    tokenEstimationMethod: 'js-tiktoken', // Track which method was used
    metadata: {
      ...pageMetadata.metadata,
      sectionIndex,
      chunkIndex,
      hasCode: content.includes('```'),
      hasImages: content.includes('!['),
      hasLinks: content.includes(']('),
      tokenDensity: actualTokens / content.length, // Tokens per character
    },
  }
}

/**
 * Enhanced embedding content preparation with token-aware truncation
 */
async function generateEmbeddings(chunks) {
  if (!predictionClient || !tokenEstimator) {
    throw new Error('Required services not initialized')
  }

  const vectorChunks = []
  const EMBEDDING_TOKEN_LIMIT = 8000 // Vertex AI limit

  console.log(`🔄 Generating embeddings for ${chunks.length} chunks...`)

  // Use text-embedding-004 which is the latest model
  const endpoint = `projects/${GOOGLE_CLOUD_CONFIG.projectId}/locations/${GOOGLE_CLOUD_CONFIG.location}/publishers/google/models/text-embedding-004`

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]

    try {
      // Prepare content for embedding with accurate token management
      let embeddingContent = `${chunk.pageTitle}: ${chunk.header}\n\n${chunk.content}`

      // Check token count and truncate if necessary using accurate counting
      const contentTokens = tokenEstimator.countTokens(embeddingContent)

      if (contentTokens > EMBEDDING_TOKEN_LIMIT) {
        if (verboseMode) {
          console.log(
            `    ✂️  Truncating content from ${contentTokens} to ${EMBEDDING_TOKEN_LIMIT} tokens`,
          )
        }
        embeddingContent = tokenEstimator.truncateToTokens(
          embeddingContent,
          EMBEDDING_TOKEN_LIMIT,
        )
      }

      const request = {
        endpoint,
        instances: [
          {
            content: embeddingContent,
            task_type: 'RETRIEVAL_DOCUMENT',
          },
        ],
      }

      const [response] = await predictionClient.predict(request)

      if (response.predictions && response.predictions.length > 0) {
        const prediction = response.predictions[0]
        const embeddingValues =
          prediction.embeddings?.values || prediction.values

        if (embeddingValues && Array.isArray(embeddingValues)) {
          vectorChunks.push({
            id: chunk.id,
            embedding: embeddingValues,
            content: chunk.content,
            originalContent: chunk.originalContent,
            actualTokens: chunk.tokens, // Store the accurate count
            embeddingTokens: tokenEstimator.countTokens(embeddingContent), // Tokens used for embedding
            tokenEstimationMethod: chunk.tokenEstimationMethod,
            metadata: {
              sourceUrl: chunk.sourceUrl,
              pageTitle: chunk.pageTitle,
              header: chunk.header,
              contentType: chunk.contentType,
              complexity: chunk.complexity,
              ...chunk.metadata,
            },
          })

          if (verboseMode) {
            console.log(
              `  ✅ ${chunk.pageTitle} - ${chunk.header} (${chunk.tokens} tokens)`,
            )
          }
        } else {
          console.error(`❌ No embedding values for chunk ${chunk.id}`)
        }
      } else {
        console.error(`❌ No predictions for chunk ${chunk.id}`)
      }
    } catch (error) {
      console.error(
        `❌ Failed to generate embedding for chunk ${chunk.id}:`,
        error.message,
      )
    }

    // Progress logging
    if ((i + 1) % 100 === 0 || i + 1 >= chunks.length) {
      console.log(`  📊 Progress: ${i + 1}/${chunks.length} chunks processed`)
    }

    // Small delay for rate limiting
    if (i + 1 < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Token usage summary with accurate statistics
  if (vectorChunks.length > 0) {
    const stats = tokenEstimator.getTokenStats(vectorChunks.map(c => c.content))
    console.log('\n📊 Token Usage Statistics (js-tiktoken):')
    console.log(`  Total chunks: ${stats.totalTexts}`)
    console.log(`  Total tokens: ${stats.totalTokens.toLocaleString()}`)
    console.log(`  Average tokens per chunk: ${stats.averageTokens}`)
    console.log(`  Token range: ${stats.minTokens} - ${stats.maxTokens}`)
  }

  console.log(
    `✅ Generated ${vectorChunks.length} embeddings with accurate token counting`,
  )
  return vectorChunks
}

/**
 * Save vector chunks to Cloud Storage
 */
async function saveVectorChunks(vectorChunks) {
  if (!storage) {
    throw new Error('Cloud Storage not initialized')
  }

  const bucket = storage.bucket(GOOGLE_CLOUD_CONFIG.bucketName)
  const fileName = `embeddings/actions-documentation-${
    new Date().toISOString().split('T')[0]
  }.jsonl`

  // Convert to JSONL format for Vertex AI
  const jsonlContent = vectorChunks
    .map(chunk =>
      JSON.stringify({
        id: chunk.id,
        embedding: chunk.embedding,
        restricts: [], // No access restrictions
        crowding_tag: chunk.metadata.contentType.type, // Group similar content types
        ...chunk.metadata,
      }),
    )
    .join('\n')

  try {
    const file = bucket.file(fileName)
    await file.save(jsonlContent, {
      metadata: {
        contentType: 'application/jsonl',
      },
    })

    console.log(
      `✅ Saved vector chunks to gs://${GOOGLE_CLOUD_CONFIG.bucketName}/${fileName}`,
    )
    return `gs://${GOOGLE_CLOUD_CONFIG.bucketName}/${fileName}`
  } catch (error) {
    console.error('❌ Failed to save vector chunks:', error.message)
    throw error
  }
}

/**
 * Main scanning function - enhanced with accurate token counting
 */
async function scanActionsDocumentation() {
  console.log(
    '🔍 Scanning Actions documentation with accurate token estimation...',
  )

  // Initialize token estimator first
  await initializeTokenEstimator()

  if (generateVectors) {
    await initializeGoogleCloud()
  }

  const config = PRODUCT_CONFIGS.actions
  const pages = []
  const allChunks = []
  let totalPages = 0
  let skippedReleaseNotes = 0

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
        }

        // Generate chunks with accurate token counting
        const chunks = chunkPageContent(
          page.content,
          page.headers,
          pageMetadata,
        )
        allChunks.push(...chunks)

        pages.push({
          ...page,
          url: pageMetadata.url,
          product: 'actions',
          version: 'latest',
          chunkCount: chunks.length,
          totalTokens: chunks.reduce((sum, chunk) => sum + chunk.tokens, 0),
        })

        if (verboseMode) {
          const totalTokens = chunks.reduce(
            (sum, chunk) => sum + chunk.tokens,
            0,
          )
          console.log(
            `  ✅ "${page.title}" → ${chunks.length} chunks (${totalTokens} tokens)`,
          )
        }
      })

      totalPages += scannedPages.length
      console.log(`  📊 Found ${scannedPages.length} pages in ${dirName}`)
    } catch (error) {
      console.log(`  📂 Skipping ${dirName} (not present)`)
    }
  }

  // Enhanced chunking summary with accurate statistics
  const totalTokens = allChunks.reduce((sum, chunk) => sum + chunk.tokens, 0)
  const tokenStats = tokenEstimator.getTokenStats(allChunks.map(c => c.content))

  console.log(`\n📈 Enhanced Chunking Summary (js-tiktoken):`)
  console.log(`  Total pages: ${pages.length}`)
  console.log(`  Total chunks: ${allChunks.length}`)
  console.log(`  Total tokens: ${totalTokens.toLocaleString()}`)
  console.log(
    `  Average chunks per page: ${Math.round(allChunks.length / pages.length)}`,
  )
  console.log(`  Average tokens per chunk: ${tokenStats.averageTokens}`)
  console.log(
    `  Token range: ${tokenStats.minTokens} - ${tokenStats.maxTokens}`,
  )
  console.log(
    `  Chunks within target range (${CHUNK_CONFIG.minTokens}-${
      CHUNK_CONFIG.maxTokens
    }): ${
      allChunks.filter(
        c =>
          c.tokens >= CHUNK_CONFIG.minTokens &&
          c.tokens <= CHUNK_CONFIG.maxTokens,
      ).length
    }`,
  )

  // Generate vector embeddings if requested
  let vectorChunks = []
  let vectorStorageUri = null

  if (generateVectors) {
    vectorChunks = await generateEmbeddings(allChunks)
    vectorStorageUri = await saveVectorChunks(vectorChunks)
  }

  // Create enhanced mappings (existing functionality)
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
      totalTokens: page.totalTokens, // Now accurate!
    }
    totalHeaders += page.headers.length
  })

  // Calculate checksum
  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(enhancedMappings))
    .digest('hex')

  // Enhanced output with accurate chunking info
  const output = {
    _GENERATED: new Date().toISOString(),
    _PRODUCT: 'actions',
    _VERSION: 'latest',
    _IS_CURRENT_VERSION: true,
    _TOTAL_PAGES: pages.length,
    _TOTAL_HEADERS: totalHeaders,
    _TOTAL_CHUNKS: allChunks.length,
    _TOTAL_TOKENS: totalTokens,
    _TOKEN_ESTIMATION_METHOD: 'js-tiktoken',
    _AVERAGE_TOKENS_PER_CHUNK: tokenStats.averageTokens,
    _TOKEN_RANGE: `${tokenStats.minTokens}-${tokenStats.maxTokens}`,
    _VECTOR_EMBEDDINGS: generateVectors,
    _VECTOR_STORAGE_URI: vectorStorageUri,
    _SKIPPED_RELEASE_NOTES: skippedReleaseNotes,
    _CHUNK_CONFIG: CHUNK_CONFIG,
    _GOOGLE_CLOUD_CONFIG: generateVectors ? GOOGLE_CLOUD_CONFIG : null,
    _CURRENT_VERSIONS: CURRENT_VERSIONS,
    _CHECKSUM: checksum,
    _WARNING: '🚨 AUTO-GENERATED FILE - DO NOT EDIT MANUALLY 🚨',
    _REGENERATE: "Run 'npm run scan-titles' to regenerate this file",
    ...enhancedMappings,
  }

  // Save JSON mappings
  const outputPath = path.join(
    process.cwd(),
    'static/data/enhanced-title-mappings-actions-latest.json',
  )
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  if (skipMinify) {
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')
    console.log('\n✅ Generated Actions mappings (readable)!')
  } else {
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')
    await minifier.minifyFile(outputPath)
    console.log('\n✅ Generated and protected Actions mappings!')
  }

  // Save chunks separately for development/testing
  if (allChunks.length > 0) {
    const chunksPath = path.join(
      process.cwd(),
      'static/data/documentation-chunks.json',
    )
    await fs.writeFile(
      chunksPath,
      JSON.stringify(
        {
          _GENERATED: new Date().toISOString(),
          _TOTAL_CHUNKS: allChunks.length,
          _TOTAL_TOKENS: totalTokens,
          _TOKEN_ESTIMATION_METHOD: 'js-tiktoken',
          _AVERAGE_TOKENS_PER_CHUNK: tokenStats.averageTokens,
          _TOKEN_STATS: tokenStats,
          _VECTOR_EMBEDDINGS_GENERATED: generateVectors,
          chunks: allChunks,
        },
        null,
        2,
      ),
      'utf8',
    )
    console.log(`📝 Saved ${allChunks.length} chunks to: ${chunksPath}`)
  }

  // Clean up token estimator
  if (tokenEstimator) {
    tokenEstimator.cleanup()
  }

  console.log(`📝 Mappings saved to: ${outputPath}`)

  if (generateVectors) {
    console.log(`🚀 Vector embeddings ready for Vertex AI Vector Search!`)
    console.log(`📍 Storage location: ${vectorStorageUri}`)
  }

  return {
    outputPath,
    chunksPath:
      allChunks.length > 0 ? 'static/data/documentation-chunks.json' : null,
    vectorStorageUri,
    tokenStats: {
      totalChunks: allChunks.length,
      totalTokens,
      averageTokens: tokenStats.averageTokens,
      tokenRange: `${tokenStats.minTokens}-${tokenStats.maxTokens}`,
      method: 'js-tiktoken',
    },
  }
}

// Keep all your existing functions unchanged:
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

  if (parsed.data.title) {
    title = parsed.data.title.trim()
  }
  if (!title && parsed.data.id) {
    title = parsed.data.id.trim()
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
    content: parsed.content, // Include full content for chunking
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
    const cleanHeader = headerText
      .replace(/[#*_`\[\]]/g, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/\s+/g, ' ')
      .trim()

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

    return excerpt
      .substring(0, 150)
      .replace(/[#*_`\[\]]/g, '')
      .replace(/\s+/g, ' ')
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
🔍 Enhanced Actions Documentation Scanner with js-tiktoken

Usage: node enhanced-scanner.js [options]

Options:
  --verbose           Show detailed progress information
  --no-minify         Skip minification (keep files readable)
  --vectors           Generate vector embeddings for Vertex AI
  --help              Show this help

Environment Variables:
  GOOGLE_CLOUD_PROJECT          Your Google Cloud project ID
  VECTOR_STORAGE_BUCKET         Cloud Storage bucket for vectors

Examples:
  node enhanced-scanner.js                     # JSON mappings only
  node enhanced-scanner.js --vectors           # With vector embeddings
  node enhanced-scanner.js --vectors --verbose # Detailed output

📁 OUTPUT:
  JSON mappings: static/data/enhanced-title-mappings-actions-latest.json
  Chunks: static/data/documentation-chunks.json
  Vectors: gs://your-bucket/embeddings/actions-documentation-YYYY-MM-DD.jsonl

📊 FEATURES:
  ✅ Accurate token counting with js-tiktoken
  ✅ Smart chunking with overlap
  ✅ Vector embeddings for Vertex AI
  ✅ Enhanced metadata tracking
`)
    process.exit(0)
  }

  ;(async () => {
    try {
      console.log('🚀 Enhanced Actions Documentation Scanner Starting...')

      if (generateVectors) {
        console.log('🔄 Vector embeddings will be generated for Vertex AI')
      }

      const result = await scanActionsDocumentation()

      console.log('\n🎉 Enhanced scanning completed successfully!')
      console.log(`📊 Results:`)
      console.log(`  - JSON mappings: ${result.outputPath}`)
      if (result.chunksPath) {
        console.log(`  - Chunks: ${result.chunksPath}`)
      }
      if (result.vectorStorageUri) {
        console.log(`  - Vector embeddings: ${result.vectorStorageUri}`)
      }

      console.log(`\n📈 Token Statistics:`)
      console.log(`  - Total chunks: ${result.tokenStats.totalChunks}`)
      console.log(
        `  - Total tokens: ${result.tokenStats.totalTokens.toLocaleString()}`,
      )
      console.log(`  - Average tokens: ${result.tokenStats.averageTokens}`)
      console.log(`  - Token range: ${result.tokenStats.tokenRange}`)
      console.log(`  - Method: ${result.tokenStats.method}`)
    } catch (error) {
      console.error('❌ Scanner failed:', error.message)
      if (verboseMode) {
        console.error(error.stack)
      }
      process.exit(1)
    }
  })()
}

module.exports = { scanActionsDocumentation }
