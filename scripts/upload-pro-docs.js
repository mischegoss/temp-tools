#!/usr/bin/env node

/**
 * Pro Documentation Upload Script - Single Version Upload
 * Usage: node upload-pro.js [version]
 * Examples:
 *   node upload-pro.js 8.0
 *   node upload-pro.js 7.9
 *   node upload-pro.js 7.8
 *
 * - Clean URL generation without anchors
 * - Version 8.0: NO version in URL (current version)
 * - Version 7.9, 7.8: Include version in URL
 * - Replaces VAR::PRODUCT_FULL with "Resolve Pro"
 * - Ready for deployment
 */

const fs = require('fs').promises
const path = require('path')
const https = require('https')
const http = require('http')
const { URL } = require('url')
const glob = require('glob')
const { promisify } = require('util')
const FormData = require('form-data')
const matter = require('gray-matter')

const globAsync = promisify(glob)

// Get version from command line argument
const targetVersion = process.argv[2]
if (!targetVersion) {
  console.log('❌ Please specify a version to upload')
  console.log('Usage: node upload-pro.js [version]')
  console.log('Examples:')
  console.log('  node upload-pro.js 8.0')
  console.log('  node upload-pro.js 7.9')
  console.log('  node upload-pro.js 7.8')
  process.exit(1)
}

// Validate version
const supportedVersions = ['8.0', '7.9', '7.8']
if (!supportedVersions.includes(targetVersion)) {
  console.log(`❌ Unsupported version: ${targetVersion}`)
  console.log(`Supported versions: ${supportedVersions.join(', ')}`)
  process.exit(1)
}

// Source URL generation configuration
const PRODUCT_CONFIGS = {
  pro_versioned_docs: {
    product: 'pro',
    routeBase: 'pro',
  },
}

// Current version configuration
const CURRENT_VERSIONS = {
  normalized: {
    pro: '8-0', // Version 8.0 gets NO version in URL
  },
}

class SourceUrlGenerator {
  constructor() {
    this.baseDocumentationUrl = 'https://docs.resolve.io'
  }

  normalizeVersion(version) {
    if (!version) return 'latest'

    return version
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '-')
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  isCurrentVersion(productName, normalizedVersion) {
    if (productName === 'pro') {
      return normalizedVersion === '8-0'
    }
    return CURRENT_VERSIONS.normalized[productName] === normalizedVersion
  }

  extractAndNormalizeVersion(filePath, productName) {
    const versionMatch = filePath.match(/version-([^\/]+)/)
    if (!versionMatch) {
      return CURRENT_VERSIONS.normalized[productName] || 'latest'
    }

    const rawVersion = decodeURIComponent(versionMatch[1])
    return this.normalizeVersion(rawVersion)
  }

  generateCompleteUrl(filePath, frontmatter, productDir, version) {
    const config = PRODUCT_CONFIGS[productDir]
    if (!config) {
      console.error(`❌ Unknown product directory: ${productDir}`)
      return null
    }

    const { product: productName, routeBase } = config

    // Extract and normalize version
    const normalizedVersion = this.extractAndNormalizeVersion(
      filePath,
      productName,
    )
    const skipVersion = this.isCurrentVersion(productName, normalizedVersion)

    // Clean path extraction - remove version directories completely
    let relativePath = filePath
      .replace(/.*_versioned_docs\/version-[^\/]+\//, '') // Remove version prefix completely
      .replace(/.*docs-[^\/]+\//, '') // Remove docs prefix
      .replace(/^version-[^\/]+\//, '') // Remove any remaining version prefix
      .replace(/\.(md|mdx)$/, '') // Remove extension
      .replace(/\\/g, '/') // Convert Windows paths

    if (!relativePath || relativePath === 'index') {
      relativePath = ''
    }

    // Split path into directories and filename
    const pathParts = relativePath.split('/').filter(part => part.length > 0)
    const originalFilename = pathParts.pop() || ''
    const directories = pathParts

    // Directory transformation
    const transformedDirectories = directories.map(dir =>
      encodeURIComponent(dir),
    )

    // Filename/Slug handling with priority order
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

    // URL Construction
    let url = `${this.baseDocumentationUrl}/${routeBase}`

    // Add version only if not current version
    if (!skipVersion && normalizedVersion !== 'latest') {
      let urlVersion

      if (
        productName === 'express' &&
        normalizedVersion.startsWith('on-premise-')
      ) {
        const versionNumber = normalizedVersion
          .replace('on-premise-', '')
          .replace('-', '.')
        urlVersion = encodeURIComponent(`On-Premise ${versionNumber}`)
      } else if (normalizedVersion === 'saas') {
        urlVersion = 'SaaS'
      } else {
        // Pro versions: 8-0 → 8.0
        urlVersion = normalizedVersion.replace(/-/g, '.')
      }

      url += `/${urlVersion}`
    }

    // Add directories
    if (transformedDirectories.length > 0) {
      url += `/${transformedDirectories.join('/')}`
    }

    // Add filename/slug
    if (urlSegment) {
      url += `/${urlSegment}`
    }

    // Add trailing slash (except for root)
    if (
      url !== `${this.baseDocumentationUrl}/${routeBase}` &&
      !url.endsWith('/')
    ) {
      url += '/'
    }

    return url
  }

  // SIMPLIFIED: No anchor generation - just return base URL
  generateChunkSourceUrl(baseUrl, chunkTitle, chunkLevel) {
    return baseUrl
  }
}

class MarkdownChunker {
  constructor(options = {}) {
    this.maxChunkSize = options.maxChunkSize || 3000
    this.minChunkSize = options.minChunkSize || 500
    this.chunkOverlap = options.chunkOverlap || 200
    this.preserveCodeBlocks = options.preserveCodeBlocks !== false
    this.preserveTables = options.preserveTables !== false
  }

  chunkMarkdown(content, metadata = {}) {
    const sections = this.splitByHeaders(content)
    const chunks = []

    for (const section of sections) {
      if (section.content.length <= this.maxChunkSize) {
        chunks.push(this.createChunk(section, metadata))
      } else {
        const subChunks = this.splitLargeSection(section, metadata)
        chunks.push(...subChunks)
      }
    }

    return chunks.filter(
      chunk => chunk.content.trim().length >= this.minChunkSize,
    )
  }

  splitByHeaders(content) {
    const sections = []
    const lines = content.split('\n')
    let currentSection = { title: '', content: '', level: 0, startLine: 0 }
    let lineIndex = 0

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/)

      if (headerMatch) {
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection })
        }

        const level = headerMatch[1].length
        const title = headerMatch[2].trim()

        currentSection = {
          title: title,
          content: line + '\n',
          level: level,
          startLine: lineIndex,
          header: line,
        }
      } else {
        currentSection.content += line + '\n'
      }

      lineIndex++
    }

    if (currentSection.content.trim()) {
      sections.push(currentSection)
    }

    return sections.length > 0
      ? sections
      : [{ title: 'Document', content: content, level: 1 }]
  }

  splitLargeSection(section, metadata) {
    const chunks = []
    let remainingContent = section.content
    let chunkIndex = 0

    while (remainingContent.length > this.maxChunkSize) {
      let splitPoint = this.findBestSplitPoint(
        remainingContent,
        this.maxChunkSize,
      )

      let chunkContent = remainingContent.substring(0, splitPoint)

      if (chunkIndex > 0 && section.title) {
        chunkContent = `## ${section.title} (continued)\n\n${chunkContent}`
      }

      chunks.push(
        this.createChunk(
          {
            title: `${section.title}${
              chunkIndex > 0 ? ` (part ${chunkIndex + 1})` : ''
            }`,
            content: chunkContent,
            level: section.level,
            isPartial: true,
            partIndex: chunkIndex,
          },
          metadata,
        ),
      )

      const nextStart = Math.max(
        splitPoint - this.chunkOverlap,
        splitPoint - 500,
      )
      remainingContent = remainingContent.substring(nextStart)
      chunkIndex++
    }

    if (remainingContent.trim().length >= this.minChunkSize) {
      let finalContent = remainingContent
      if (chunkIndex > 0 && section.title) {
        finalContent = `## ${section.title} (continued)\n\n${finalContent}`
      }

      chunks.push(
        this.createChunk(
          {
            title: `${section.title}${chunkIndex > 0 ? ` (final part)` : ''}`,
            content: finalContent,
            level: section.level,
            isPartial: chunkIndex > 0,
            partIndex: chunkIndex,
          },
          metadata,
        ),
      )
    }

    return chunks
  }

  findBestSplitPoint(content, maxLength) {
    if (content.length <= maxLength) return content.length

    const searchStart = Math.max(0, maxLength - 500)
    const searchEnd = Math.min(content.length, maxLength + 200)
    const searchArea = content.substring(searchStart, searchEnd)

    const splitPatterns = [
      /\n\n(?=#{1,6}\s)/g,
      /\n\n(?=\*\*|__)/g,
      /\n\n(?=[A-Z])/g,
      /\n\n/g,
      /\n(?=#{1,6}\s)/g,
      /\. \n/g,
      /\n/g,
      / /g,
    ]

    for (const pattern of splitPatterns) {
      const matches = [...searchArea.matchAll(pattern)]
      if (matches.length > 0) {
        const targetPos = maxLength - searchStart
        let bestMatch = matches[0]
        let bestDistance = Math.abs(bestMatch.index - targetPos)

        for (const match of matches) {
          const distance = Math.abs(match.index - targetPos)
          if (distance < bestDistance) {
            bestMatch = match
            bestDistance = distance
          }
        }

        return searchStart + bestMatch.index + bestMatch[0].length
      }
    }

    return maxLength
  }

  createChunk(section, baseMetadata) {
    const chunkId = baseMetadata.baseId
      ? `${baseMetadata.baseId}-${this.generateSectionId(section)}`
      : this.generateSectionId(section)

    return {
      id: chunkId,
      content: section.content.trim(),
      title: section.title || 'Untitled Section',
      header: section.header || section.title || '',
      level: section.level || 1,
      isPartial: section.isPartial || false,
      partIndex: section.partIndex || 0,
      tokens: Math.ceil(section.content.length / 4),
      ...baseMetadata,
    }
  }

  generateSectionId(section) {
    if (section.title) {
      return section.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
    }
    return `section-${section.startLine || 0}`
  }
}

class ProDocumentationUploader {
  constructor(version) {
    this.apiBaseUrl = 'https://pro-chatbot-api-146019630513.us-central1.run.app'

    this.uploadEndpoint = `${this.apiBaseUrl}/api/v1/upload-documentation`
    this.statusEndpoint = `${this.apiBaseUrl}/status`
    this.healthEndpoint = `${this.apiBaseUrl}/health`
    this.chatEndpoint = `${this.apiBaseUrl}/api/v1/chat`

    this.docsDir = path.resolve('./pro_versioned_docs')

    // Version configuration based on input
    this.targetVersion = version
    this.version = version.replace('.', '-')
    this.versionDir = `version-${version}`
    this.versionDisplay = version

    this.healthRetries = 5
    this.healthRetryDelay = 3000

    this.chunker = new MarkdownChunker({
      maxChunkSize: 2500,
      minChunkSize: 300,
      chunkOverlap: 150,
    })

    this.urlGenerator = new SourceUrlGenerator()
  }

  /**
   * Replace product variables with actual product name
   * @param {string} content - Content to clean
   * @returns {string} - Cleaned content
   */
  replaceProductVariables(content) {
    // Replace VAR::PRODUCT_FULL with "Resolve Pro"
    return content.replace(/VAR::PRODUCT_FULL/g, 'Resolve Pro')
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const client = urlObj.protocol === 'https:' ? https : http

      const req = client.request(
        url,
        {
          method: options.method || 'GET',
          headers: options.headers || {},
          timeout: options.timeout || 30000,
        },
        res => {
          let data = ''
          res.on('data', chunk => (data += chunk))
          res.on('end', () => {
            try {
              const jsonData = data ? JSON.parse(data) : {}
              resolve({
                status: res.statusCode,
                data: jsonData,
                rawData: data,
                headers: res.headers,
              })
            } catch (e) {
              resolve({
                status: res.statusCode,
                data: null,
                rawData: data,
                headers: res.headers,
              })
            }
          })
        },
      )

      req.on('error', reject)
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })

      if (options.body) {
        req.write(options.body)
      }
      req.end()
    })
  }

  async makeMultipartRequest(url, formData, timeout = 300000) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const client = urlObj.protocol === 'https:' ? https : http

      const req = client.request(
        url,
        {
          method: 'POST',
          headers: formData.getHeaders(),
          timeout: timeout,
        },
        res => {
          let data = ''
          res.on('data', chunk => (data += chunk))
          res.on('end', () => {
            try {
              const jsonData = data ? JSON.parse(data) : {}
              resolve({
                status: res.statusCode,
                data: jsonData,
                rawData: data,
                headers: res.headers,
              })
            } catch (e) {
              resolve({
                status: res.statusCode,
                data: null,
                rawData: data,
                headers: res.headers,
              })
            }
          })
        },
      )

      req.on('error', reject)
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })

      formData.pipe(req)
    })
  }

  async checkHealthWithRetries() {
    console.log(`🏥 Checking Pro API health...`)

    for (let attempt = 1; attempt <= this.healthRetries; attempt++) {
      try {
        const response = await this.makeRequest(this.healthEndpoint, {
          timeout: 15000,
        })

        if (response.status === 200) {
          console.log(`✅ Pro API is healthy`)
          return true
        }
      } catch (error) {
        console.log(`⚠️ Health check attempt ${attempt} failed`)
      }

      if (attempt < this.healthRetries) {
        await new Promise(resolve => setTimeout(resolve, this.healthRetryDelay))
      }
    }

    console.log(
      `❌ Pro API health check failed after ${this.healthRetries} attempts`,
    )
    return false
  }

  async findAllMarkdownFiles() {
    console.log(`🔍 Scanning Pro ${this.targetVersion} documentation files...`)

    const targetPath = path.join(this.docsDir, this.versionDir)

    try {
      await fs.access(targetPath)
    } catch (error) {
      console.log(`❌ Directory not found: ${targetPath}`)
      return []
    }

    const pattern = `${targetPath}/**/*.md`
    let versionFiles = []

    try {
      versionFiles = await globAsync(pattern)
    } catch (error) {
      console.log(`⚠️ Failed to scan version ${this.targetVersion}`)
      return []
    }

    versionFiles = [...new Set(versionFiles)].sort()

    const allFiles = []
    let processed = 0,
      skipped = 0

    for (const filePath of versionFiles) {
      try {
        const relPath = path.relative(this.docsDir, filePath)
        const stats = await fs.stat(filePath)

        // Skip system/hidden files
        if (
          path.basename(filePath).startsWith('_') ||
          path.basename(filePath).startsWith('.') ||
          relPath.includes('node_modules') ||
          relPath.includes('.git')
        ) {
          skipped++
          continue
        }

        if (stats.size === 0) {
          skipped++
          continue
        }

        // Validate Pro structure
        if (
          !relPath.match(
            new RegExp(`version-${this.targetVersion.replace('.', '\\.')}\\/`),
          )
        ) {
          skipped++
          continue
        }

        allFiles.push({
          path: filePath,
          relativePath: relPath,
          version: this.version,
          versionDisplay: this.versionDisplay,
          size: stats.size,
          name: path.basename(filePath),
          directory: this.versionDir,
        })
        processed++
      } catch (error) {
        skipped++
      }
    }

    console.log(`   📂 ${this.version}: ${processed} files processed`)
    console.log(`   📊 Total: ${processed} files ready for upload`)

    return allFiles
  }

  async processMarkdownFiles(files) {
    console.log(
      `📝 Processing ${files.length} Pro ${this.targetVersion} files with chunking...`,
    )

    const allChunks = []
    const processingStats = {
      filesProcessed: 0,
      totalChunks: 0,
      skipped: 0,
      errors: 0,
      urlsGenerated: 0,
      variablesReplaced: 0,
    }

    const batchSize = 25
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(files.length / batchSize)

      console.log(`📦 Processing batch ${batchNum}/${totalBatches}`)

      for (const fileInfo of batch) {
        try {
          const content = await fs.readFile(fileInfo.path, 'utf8')
          const parsed = matter(content)

          if (!parsed.content.trim()) {
            processingStats.skipped++
            continue
          }

          // ✅ CRITICAL FIX: Replace VAR::PRODUCT_FULL with "Resolve Pro"
          const cleanedContent = this.replaceProductVariables(parsed.content)

          // Track if we replaced any variables
          if (cleanedContent !== parsed.content) {
            processingStats.variablesReplaced++
          }

          // Generate clean source URL without anchors
          const sourceUrl = this.urlGenerator.generateCompleteUrl(
            fileInfo.relativePath,
            parsed.data,
            'pro_versioned_docs',
            fileInfo.versionDisplay,
          )

          if (sourceUrl) {
            processingStats.urlsGenerated++
          }

          const baseMetadata = {
            baseId: `${fileInfo.version}-${path.basename(
              fileInfo.path,
              '.md',
            )}`,
            original_content: content,
            source_url: sourceUrl,
            page_title:
              parsed.data.title || path.basename(fileInfo.path, '.md'),
            content_type: {
              type: 'documentation',
              category: 'pro',
            },
            complexity: 'moderate',
            metadata: {
              ...parsed.data,
              product: 'pro',
              version: fileInfo.version,
              version_dotted: fileInfo.versionDisplay,
              version_full: `${fileInfo.version}`, // ✅ SIMPLIFIED: Just the version
              source_file: fileInfo.relativePath,
              source_type: 'markdown',
              upload_timestamp: Date.now(),
              pro_version_display: fileInfo.versionDisplay,
              is_current_version: fileInfo.version === '8-0',
              version_family: 'pro',
              directory: fileInfo.directory,
              file_size: fileInfo.size,
              original_file_title:
                parsed.data.title || parsed.data.sidebar_label || '',
              generated_source_url: sourceUrl,
              url_generation_method: 'production_clean',
            },
          }

          // ✅ Use cleaned content for chunking
          const fileChunks = this.chunker.chunkMarkdown(
            cleanedContent,
            baseMetadata,
          )

          fileChunks.forEach((chunk, index) => {
            // Use base URL only - no anchors
            const chunkSourceUrl = this.urlGenerator.generateChunkSourceUrl(
              sourceUrl,
              chunk.title,
              chunk.level,
            )

            const finalChunk = {
              id: chunk.id,
              content: chunk.content,
              header: chunk.header || chunk.title,
              source_url: chunkSourceUrl || sourceUrl,
              page_title: `${baseMetadata.page_title}${
                chunk.isPartial ? ` - ${chunk.title}` : ''
              }`,
              content_type: baseMetadata.content_type,
              complexity: baseMetadata.complexity,
              tokens: chunk.tokens,
              metadata: {
                ...baseMetadata.metadata,
                chunk_index: index,
                total_chunks_in_file: fileChunks.length,
                chunk_title: chunk.title,
                chunk_level: chunk.level,
                is_partial_chunk: chunk.isPartial,
                part_index: chunk.partIndex,
                original_file_chunks: fileChunks.length,
                chunk_source_url: chunkSourceUrl,
                base_source_url: sourceUrl,
              },
            }

            allChunks.push(finalChunk)
          })

          processingStats.filesProcessed++
          processingStats.totalChunks += fileChunks.length
        } catch (error) {
          processingStats.errors++
        }
      }
    }

    console.log(`📊 Processing complete:`)
    console.log(`   • Files processed: ${processingStats.filesProcessed}`)
    console.log(`   • Total chunks: ${processingStats.totalChunks}`)
    console.log(`   • URLs generated: ${processingStats.urlsGenerated}`)
    console.log(`   • Variables replaced: ${processingStats.variablesReplaced}`)
    console.log(`   • Errors: ${processingStats.errors}`)

    return allChunks
  }

  async uploadDocumentation(chunks) {
    console.log(
      `📤 Uploading ${chunks.length} Pro ${this.targetVersion} chunks to API...`,
    )

    const chunkSizeStats = { min: Infinity, max: 0, average: 0, total: 0 }
    const urlStats = { withUrls: 0, withoutUrls: 0 }

    chunks.forEach(chunk => {
      const size = chunk.content.length
      chunkSizeStats.min = Math.min(chunkSizeStats.min, size)
      chunkSizeStats.max = Math.max(chunkSizeStats.max, size)
      chunkSizeStats.total += size

      if (chunk.source_url) {
        urlStats.withUrls++
      } else {
        urlStats.withoutUrls++
      }
    })

    chunkSizeStats.average = Math.round(chunkSizeStats.total / chunks.length)

    console.log(`📊 Upload Statistics:`)
    console.log(`   • Version ${this.targetVersion}: ${chunks.length} chunks`)
    console.log(
      `   • URL Coverage: ${((urlStats.withUrls / chunks.length) * 100).toFixed(
        1,
      )}%`,
    )

    const versionKey = this.version

    const uploadData = {
      _GENERATED: new Date().toISOString(),
      _PRODUCT: 'pro',
      _VERSION: this.version, // ✅ SIMPLIFIED: Just "8-0", "7-9", or "7-8"
      _TOTAL_CHUNKS: chunks.length,
      _ENHANCED_FEATURES: [
        'intelligent_chunking',
        'clean_url_generation',
        'no_anchors',
        'production_ready',
        'variable_replacement',
        `version_${this.targetVersion.replace('.', '_')}_only`,
        this.targetVersion === '8.0'
          ? 'current_version_no_url_version'
          : 'versioned_url',
      ],
      _STATS: {
        version_distribution: { [versionKey]: chunks.length },
        chunk_size_stats: chunkSizeStats,
        url_stats: urlStats,
        total_chunks: chunks.length,
        total_size_bytes: chunkSizeStats.total,
        supported_versions: [versionKey],
        processing_timestamp: Date.now(),
        chunking_strategy: 'header_based_with_smart_splitting',
        url_generation: `production_clean_no_anchors_${this.targetVersion.replace(
          '.',
          '_',
        )}`,
      },
      chunks: chunks,
      metadata: {
        product: 'pro',
        upload_type: `production_${this.targetVersion.replace('.', '_')}_only`,
        total_documents: chunks.length,
        total_files: chunks.length,
        version_distribution: { [versionKey]: chunks.length },
        upload_timestamp: Date.now(),
        uploader_version: `pro-uploader-${this.targetVersion}-only-2.0.0`,
        supported_versions: [versionKey],
        features: [
          'production_ready',
          'clean_urls',
          'no_anchors',
          'variable_replacement',
          `version_${this.targetVersion.replace('.', '_')}_only`,
          this.targetVersion === '8.0'
            ? 'current_version_no_url_version'
            : 'versioned_url',
          'intelligent_chunking',
        ],
        chunking_config: {
          max_chunk_size: this.chunker.maxChunkSize,
          min_chunk_size: this.chunker.minChunkSize,
          chunk_overlap: this.chunker.chunkOverlap,
          strategy: 'header_based_optimized',
        },
        url_generation_config: {
          base_documentation_url: this.urlGenerator.baseDocumentationUrl,
          method: 'production_clean',
          includes_chunk_anchors: false,
          url_coverage_percentage: (
            (urlStats.withUrls / chunks.length) *
            100
          ).toFixed(1),
          version_handling:
            this.targetVersion === '8.0'
              ? 'current_version_8_0_no_version_in_url'
              : `versioned_${this.targetVersion.replace(
                  '.',
                  '_',
                )}_includes_version`,
        },
      },
    }

    try {
      const formData = new FormData()
      const tempFilePath = `/tmp/pro-docs-${this.targetVersion.replace(
        '.',
        '-',
      )}-${Date.now()}.json`
      const jsonContent = JSON.stringify(uploadData, null, 2)
      await fs.writeFile(tempFilePath, jsonContent)

      const fileBuffer = await fs.readFile(tempFilePath)
      formData.append('file', fileBuffer, {
        filename: `pro-documentation-${this.targetVersion}-only.json`,
        contentType: 'application/json',
      })

      formData.append(
        'source',
        `pro-uploaded-docs-${this.targetVersion.replace('.', '-')}-only`,
      )

      console.log(
        `🚀 Uploading ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB...`,
      )

      const response = await this.makeMultipartRequest(
        this.uploadEndpoint,
        formData,
        600000,
      )

      // Clean up
      try {
        await fs.unlink(tempFilePath)
      } catch (e) {}

      console.log(`📊 Upload response: ${response.status}`)

      if (response.status === 200) {
        console.log('✅ Upload successful!')
        if (response.data) {
          console.log(
            `📈 Processed: ${
              response.data.processed_chunks ||
              response.data.chunks_processed ||
              'N/A'
            } chunks`,
          )
          console.log(`⏱️ Time: ${response.data.processing_time || 'N/A'}s`)
        }
        return true
      } else {
        console.log(`❌ Upload failed with status: ${response.status}`)
        return false
      }
    } catch (error) {
      console.log(`❌ Upload failed: ${error.message}`)
      return false
    }
  }
}

async function main() {
  console.log(`🚀 Pro Documentation Uploader - VERSION ${targetVersion} ONLY`)
  console.log(`📋 Processing ONLY version: ${targetVersion}`)
  console.log('🔗 Clean URLs without anchors')
  console.log('🔧 VAR::PRODUCT_FULL → Resolve Pro')

  if (targetVersion === '8.0') {
    console.log('📌 Version 8.0 = NO version in URL (current version)')
  } else {
    console.log(`📌 Version ${targetVersion} = INCLUDES version in URL`)
  }

  try {
    const uploader = new ProDocumentationUploader(targetVersion)

    if (!(await uploader.checkHealthWithRetries())) {
      console.log('❌ Pro API not healthy')
      process.exit(1)
    }

    const files = await uploader.findAllMarkdownFiles()
    if (files.length === 0) {
      console.log(`❌ No markdown files found for version ${targetVersion}`)
      process.exit(1)
    }

    const chunks = await uploader.processMarkdownFiles(files)
    if (chunks.length === 0) {
      console.log('❌ No processable content found')
      process.exit(1)
    }

    if (await uploader.uploadDocumentation(chunks)) {
      console.log(
        `\n🎉 Pro ${targetVersion} documentation upload completed successfully!`,
      )

      if (targetVersion === '8.0') {
        console.log(
          '✅ Version 8.0 uploaded with clean URLs (no version in URL)',
        )
      } else {
        console.log(`✅ Version ${targetVersion} uploaded with versioned URLs`)
      }

      console.log(`📊 Total chunks: ${chunks.length}`)
      console.log('🔧 URLs generated correctly for this version')
      console.log('✨ Product variables replaced with "Resolve Pro"')
      process.exit(0)
    } else {
      console.log('❌ Upload failed')
      process.exit(1)
    }
  } catch (error) {
    console.log(`❌ Script failed: ${error.message}`)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
