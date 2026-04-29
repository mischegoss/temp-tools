#!/usr/bin/env node

/**
 * Pro Documentation URL Extractor
 * Generates separate JSON files with all documentation URLs for each Pro version
 *
 * Output: One JSON file per version with all external URLs
 * - pro-urls-8-0.json
 * - pro-urls-7-9.json
 * - pro-urls-7-8.json
 *
 * Usage: node extract-pro-urls.js
 */

const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')

// Pro versions to extract
const PRO_VERSIONS = ['8.0', '7.9', '7.8']

// Configuration
const BASE_DOCS_URL = 'https://docs.resolve.io'
const PRODUCT_NAME = 'pro'
const ROUTE_BASE = 'pro'
const DOCS_DIR = path.resolve('./pro_versioned_docs')

// Current version (gets NO version in URL)
const CURRENT_VERSION = '8-0' // Version 8.0

/**
 * Normalize version strings to consistent hyphen format
 */
function normalizeVersion(version) {
  if (!version) return 'latest'

  return version
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extract version from file path
 */
function extractVersionFromPath(filePath) {
  const versionMatch = filePath.match(/version-([^\/]+)/)
  if (!versionMatch) {
    return CURRENT_VERSION
  }

  const rawVersion = decodeURIComponent(versionMatch[1])
  return normalizeVersion(rawVersion)
}

/**
 * Check if version is the current version (no version in URL)
 */
function isCurrentVersion(normalizedVersion) {
  return normalizedVersion === CURRENT_VERSION
}

/**
 * Generate complete external URL for a page
 */
function generatePageUrl(filePath, frontmatter) {
  // Extract and normalize version
  const normalizedVersion = extractVersionFromPath(filePath)
  const skipVersion = isCurrentVersion(normalizedVersion)

  // FIXED: More robust path extraction to prevent version duplication
  let relativePath = filePath
    .replace(/.*pro_versioned_docs\/version-[^\/]+\//, '') // Remove versioned_docs/version-X.X/
    .replace(/.*docs-pro\//, '') // Remove docs-pro/
    .replace(/^version-[^\/]+\//, '') // Remove any remaining version-X.X/
    .replace(/\.(md|mdx)$/, '') // Remove extension
    .replace(/\\/g, '/') // Convert Windows paths

  if (!relativePath || relativePath === 'index') {
    relativePath = ''
  }

  // Split path into directories and filename
  const pathParts = relativePath.split('/').filter(part => part.length > 0)
  const originalFilename = pathParts.pop() || ''
  const directories = pathParts

  // FIXED: Directory transformation with proper URL encoding
  const transformedDirectories = directories.map(dir => encodeURIComponent(dir))

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

  // FIXED: URL Construction - simpler logic
  let url = `${BASE_DOCS_URL}/${ROUTE_BASE}`

  // Version 8.0 (current): NO version in URL
  // Version 7.9, 7.8: Include version in URL
  if (!skipVersion && normalizedVersion !== 'latest') {
    // Convert 7-9 → 7.9, 7-8 → 7.8
    const urlVersion = normalizedVersion.replace(/-/g, '.')
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
  if (url !== `${BASE_DOCS_URL}/${ROUTE_BASE}` && !url.endsWith('/')) {
    url += '/'
  }

  return url
}

/**
 * Extract page title from file
 */
async function extractPageTitle(filePath, frontmatter, content) {
  let title = null

  // Method 1: Try frontmatter title
  if (frontmatter.title) {
    title = frontmatter.title.trim()
  }

  // Method 2: Try frontmatter id as title
  if (!title && frontmatter.id) {
    title = frontmatter.id.trim()
  }

  // Method 3: Try first H1 in content
  if (!title) {
    const h1Match = content.match(/^#\s+(.+)$/m)
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

  return title
}

/**
 * Scan directory recursively for markdown files
 */
async function scanDirectory(dirPath, targetVersion) {
  const pages = []

  async function scanRecursive(currentPath) {
    const items = await fs.readdir(currentPath, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(currentPath, item.name)

      if (item.isDirectory()) {
        // Skip system directories
        if (
          !item.name.startsWith('.') &&
          !item.name.startsWith('_') &&
          item.name !== 'node_modules'
        ) {
          await scanRecursive(itemPath)
        }
      } else if (
        item.isFile() &&
        (item.name.endsWith('.md') || item.name.endsWith('.mdx'))
      ) {
        // Skip system files
        if (
          !item.name.startsWith('_') &&
          !item.name.startsWith('.') &&
          item.name !== 'README.md'
        ) {
          try {
            const content = await fs.readFile(itemPath, 'utf8')
            const parsed = matter(content)

            const relativePath = path.relative(DOCS_DIR, itemPath)
            const fileVersion = extractVersionFromPath(relativePath)

            // Only include files from target version
            if (fileVersion === targetVersion) {
              const title = await extractPageTitle(
                itemPath,
                parsed.data,
                parsed.content,
              )
              const url = generatePageUrl(relativePath, parsed.data)

              pages.push({
                title: title,
                url: url,
                file: relativePath,
                slug: parsed.data.slug || null,
                id: parsed.data.id || null,
                sidebar_label: parsed.data.sidebar_label || null,
              })
            }
          } catch (error) {
            console.log(
              `    ⚠️  Error processing ${item.name}: ${error.message}`,
            )
          }
        }
      }
    }
  }

  await scanRecursive(dirPath)
  return pages
}

/**
 * Extract URLs for a specific Pro version
 */
async function extractVersionUrls(version) {
  const normalizedVersion = normalizeVersion(version)
  const versionDir = path.join(DOCS_DIR, `version-${version}`)

  console.log(`\n🔍 Scanning Pro ${version}...`)

  try {
    await fs.access(versionDir)
  } catch (error) {
    console.log(`   ❌ Directory not found: ${versionDir}`)
    return null
  }

  const pages = await scanDirectory(DOCS_DIR, normalizedVersion)

  console.log(`   ✅ Found ${pages.length} pages`)

  // Sort pages by URL for easier reading
  pages.sort((a, b) => a.url.localeCompare(b.url))

  // Create output object
  const output = {
    _GENERATED: new Date().toISOString(),
    _PRODUCT: 'pro',
    _VERSION: normalizedVersion,
    _VERSION_DISPLAY: version,
    _IS_CURRENT_VERSION: isCurrentVersion(normalizedVersion),
    _TOTAL_URLS: pages.length,
    _BASE_URL: BASE_DOCS_URL,
    _NOTE: isCurrentVersion(normalizedVersion)
      ? 'Version 8.0 URLs do NOT include version number (current version)'
      : `Version ${version} URLs include version number`,
    pages: pages,
  }

  // Write to file
  const outputPath = path.join(
    process.cwd(),
    `pro-urls-${normalizedVersion}.json`,
  )

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8')

  console.log(`   📝 Saved to: pro-urls-${normalizedVersion}.json`)

  return {
    version: version,
    normalized: normalizedVersion,
    count: pages.length,
    file: outputPath,
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Pro Documentation URL Extractor')
  console.log('===================================')
  console.log(`📁 Scanning: ${DOCS_DIR}`)
  console.log(`🌐 Base URL: ${BASE_DOCS_URL}`)
  console.log(`📋 Versions: ${PRO_VERSIONS.join(', ')}`)

  const results = []

  for (const version of PRO_VERSIONS) {
    const result = await extractVersionUrls(version)
    if (result) {
      results.push(result)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log('='.repeat(50))

  let totalUrls = 0
  for (const result of results) {
    console.log(`   Pro ${result.version}: ${result.count} URLs`)
    totalUrls += result.count
  }

  console.log(`   ───────────────────────────────`)
  console.log(`   Total: ${totalUrls} URLs`)

  console.log('\n📁 Output Files:')
  for (const result of results) {
    console.log(`   • pro-urls-${result.normalized}.json`)
  }

  console.log('\n✅ URL extraction completed successfully!')

  // Print sample URLs
  console.log('\n📝 Sample URLs:')
  for (const result of results) {
    const filePath = path.join(
      process.cwd(),
      `pro-urls-${result.normalized}.json`,
    )
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'))
    if (data.pages.length > 0) {
      console.log(`\n   Pro ${result.version}:`)
      // Show first 3 URLs
      data.pages.slice(0, 3).forEach(page => {
        console.log(`      ${page.url}`)
      })
      if (data.pages.length > 3) {
        console.log(`      ... and ${data.pages.length - 3} more`)
      }
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
}

module.exports = { extractVersionUrls, generatePageUrl }
