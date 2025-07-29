const fs = require('fs').promises
const path = require('path')
const visit = require('unist-util-visit')
const yaml = require('js-yaml')

// Cache for mapping files
const mappingCache = new Map()

class ActionsIdResolver {
  constructor(version, versions) {
    this.version = version
    this.mapping = null
    this.idToFile = new Map()
    this.categoryPaths = new Map()
    this.fileContent = new Map()
    this.anchorToFile = new Map()
    this.versionMappings = this.buildVersionMappings(versions)
  }

  async initialize() {
    // Check if mapping is already cached
    if (mappingCache.has(this.version)) {
      this.mapping = mappingCache.get(this.version)
    } else {
      try {
        const mappingFileName = `actions-mapping-${this.version.replace(
          'version-',
          '',
        )}.json`
        const mappingPath = path.join(
          process.cwd(),
          'src',
          'plugins',
          'plugin-mappings',
          mappingFileName,
        )
        const mappingContent = await fs.readFile(mappingPath, 'utf8')
        const rawMapping = JSON.parse(mappingContent)

        // Extract only the actual mappings (skip metadata)
        this.mapping = {}
        for (const [key, value] of Object.entries(rawMapping)) {
          if (!key.startsWith('_')) {
            this.mapping[key] = value
          }
        }

        mappingCache.set(this.version, this.mapping)
      } catch (error) {
        // Mapping file doesn't exist or failed to load - use empty mapping
        this.mapping = {}
        mappingCache.set(this.version, {})
      }
    }
  }

  buildVersionMappings(versions) {
    // Sort versions to determine the latest version
    const sortedVersions = versions
      .filter(v => v.startsWith('version-'))
      .sort((a, b) => {
        const vA = a.replace('version-', '')
        const vB = b.replace('version-', '')
        // Handle 'latest' specially
        if (vA === 'latest') return -1
        if (vB === 'latest') return 1
        // Otherwise compare version numbers
        return this.compareVersions(vB, vA)
      })

    const mappings = {}

    // Process all versions
    versions.forEach(version => {
      const versionNumber = version.replace('version-', '')
      // Latest version gets empty string (no prefix)
      if (version === sortedVersions[0]) {
        mappings[version] = ''
      } else {
        // Other versions get their version number as prefix
        mappings[version] = versionNumber
      }
    })

    return mappings
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number)
    const parts2 = v2.split('.').map(Number)

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0
      const part2 = parts2[i] || 0
      if (part1 !== part2) {
        return part1 - part2
      }
    }
    return 0
  }

  normalizeId(id) {
    // Remove anchor before normalization
    const baseId = id.split('#')[0]

    return baseId
      .toLowerCase()
      .replace(/,/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .trim()
  }

  extractFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]+?)\n---/)
    if (!match) return null
    try {
      return yaml.load(match[1])
    } catch (err) {
      return null
    }
  }

  extractAnchors(content) {
    const headings = content.match(/^#{1,6}\s+(.+)$/gm) || []
    const anchors = new Set()

    headings.forEach(heading => {
      const text = heading.replace(/^#{1,6}\s+/, '')
      const anchor = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
      anchors.add(anchor)
    })

    return anchors
  }

  async buildIndex(dir, categoryPath = '') {
    const files = await fs.readdir(dir)

    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stats = await fs.stat(fullPath)

      if (
        stats.isDirectory() &&
        !file.startsWith('_') &&
        file !== 'img' &&
        file !== 'files'
      ) {
        // Preserve original casing for the new path segment
        const newCategoryPath = categoryPath ? `${categoryPath}/${file}` : file

        // Index both the full path and each subpath
        const pathParts = newCategoryPath.split('/')
        let currentPath = ''
        for (let i = 0; i < pathParts.length; i++) {
          currentPath =
            i === 0 ? pathParts[i] : `${currentPath}/${pathParts[i]}`
          this.categoryPaths.set(currentPath.toLowerCase(), currentPath)
        }

        await this.buildIndex(fullPath, newCategoryPath)
      } else if (file.endsWith('.md') && !file.startsWith('_')) {
        const content = await fs.readFile(fullPath, 'utf8')
        const frontmatter = this.extractFrontMatter(content)

        const entry = {
          filePath: fullPath,
          relativePath: path.relative(dir, fullPath),
          categoryPath,
          fileName: file.replace(/\.md$/, ''),
          id: frontmatter?.id || null,
          title: frontmatter?.title || null,
          content,
          version: this.version,
        }

        this.fileContent.set(fullPath, content)
        const anchors = this.extractAnchors(content)
        this.anchorToFile.set(fullPath, anchors)

        // Index variations without anchors
        if (entry.id) {
          const normalizedId = this.normalizeId(entry.id)
          this.addToIndex(normalizedId, entry)
          this.addToIndex(normalizedId.replace(/-/g, ''), entry)
        }

        // Index filename variations
        const normalizedFileName = this.normalizeId(entry.fileName)
        this.addToIndex(normalizedFileName, entry)
        this.addToIndex(normalizedFileName.replace(/-/g, ''), entry)

        // Index by path - both full and partial paths
        const pathParts = categoryPath.split('/').filter(Boolean)
        let currentPath = ''
        for (let i = 0; i <= pathParts.length; i++) {
          currentPath =
            i === 0
              ? entry.fileName
              : `${pathParts.slice(0, i).join('/')}/${entry.fileName}`
          const pathKey = this.normalizeId(currentPath)
          this.addToIndex(pathKey, entry)
        }
      }
    }
  }

  addToIndex(key, entry) {
    if (!this.idToFile.has(key)) {
      this.idToFile.set(key, [])
    }
    this.idToFile.get(key).push(entry)
  }

  validateAnchor(filePath, anchor) {
    if (!anchor) return true
    const fileAnchors = this.anchorToFile.get(filePath)
    return fileAnchors?.has(anchor) || false
  }

  encodePathSegment(segment) {
    // Preserve case while encoding spaces and special characters
    return encodeURIComponent(segment)
  }

  findMappingMatch(normalizedId) {
    if (!this.mapping) return null

    if (this.mapping[normalizedId]) {
      return this.mapping[normalizedId]
    }

    const noDashesId = normalizedId.replace(/-/g, '')
    if (this.mapping[noDashesId]) {
      return this.mapping[noDashesId]
    }

    return null
  }

  generatePath(entry, anchor = null) {
    // Process category path segments - preserve case but encode spaces
    let categoryPath = ''
    if (entry.categoryPath) {
      // Split by forward slash, encode each segment while preserving case, then rejoin
      categoryPath = entry.categoryPath
        .split('/')
        .map(segment => this.encodePathSegment(segment))
        .join('/')
    }

    // Process filename - lowercase and replace spaces with hyphens
    let filename = entry.fileName.toLowerCase().replace(/\s+/g, '-')

    // Handle version-specific URL prefix
    let versionPrefix =
      this.versionMappings[entry.version] === ''
        ? '/actions'
        : `/actions/${this.versionMappings[entry.version]}`

    let relativePath = categoryPath
      ? `${versionPrefix}/${categoryPath}/${filename}`
      : `${versionPrefix}/${filename}`

    // Handle anchor - if it contains a UUID pattern, remove it completely
    if (anchor && !anchor.match(/UUID-[0-9a-f-]+/i)) {
      if (this.validateAnchor(entry.filePath, anchor)) {
        relativePath += `#${anchor}`
      }
    }

    return relativePath
  }

  findMatch(id, sourceFilePath) {
    const [baseId, rawAnchor] = id.split('#')
    const normalizedId = this.normalizeId(baseId)
    const anchor = rawAnchor ? this.normalizeId(rawAnchor) : null

    // First try mapping match
    let resolvedPath = this.findMappingMatch(normalizedId)

    // Check if mapping returned a complete URL
    if (resolvedPath && resolvedPath.startsWith('/')) {
      // It's already a complete URL - return as-is, just add anchor if needed
      if (anchor && !anchor.match(/UUID-[0-9a-f-]+/i)) {
        return `${resolvedPath}#${anchor}`
      }
      return resolvedPath
    }

    // If no mapping match, try filesystem search
    if (!resolvedPath) {
      const sourceDir = path.dirname(sourceFilePath)
      const entry = this.findBestMatch(normalizedId, sourceDir)
      if (!entry) {
        return null
      }
      // Generated from filesystem scanning
      return this.generatePath(entry, anchor)
    } else {
      // Only do legacy processing for relative paths from mapping
      // For Actions, relative paths from mapping would need custom processing
      // For now, treat as if no mapping was found and use filesystem
      const sourceDir = path.dirname(sourceFilePath)
      const entry = this.findBestMatch(normalizedId, sourceDir)
      if (!entry) {
        return null
      }
      return this.generatePath(entry, anchor)
    }
  }

  findBestMatch(normalizedId, sourceDir) {
    // Strategy 1: Exact match
    const exactMatches = this.idToFile.get(normalizedId)
    if (exactMatches?.length) {
      return this.findClosestMatch(exactMatches, sourceDir)
    }

    // Strategy 2: Partial match (remove dashes)
    const noDashesId = normalizedId.replace(/-/g, '')
    const partialMatches = this.idToFile.get(noDashesId)
    if (partialMatches?.length) {
      return this.findClosestMatch(partialMatches, sourceDir)
    }

    // Strategy 3: Fuzzy match based on substrings
    const fuzzyMatches = Array.from(this.idToFile.entries())
      .filter(
        ([key, _]) => key.includes(normalizedId) || normalizedId.includes(key),
      )
      .flatMap(([_, entries]) => entries)

    if (fuzzyMatches.length) {
      return this.findClosestMatch(fuzzyMatches, sourceDir)
    }

    // Strategy 4: Content search (last resort)
    const contentMatches = Array.from(this.fileContent.entries())
      .filter(([_, content]) => content.toLowerCase().includes(normalizedId))
      .map(([filePath]) =>
        Array.from(this.idToFile.values())
          .flat()
          .find(entry => entry.filePath === filePath),
      )
      .filter(Boolean)

    if (contentMatches.length) {
      return this.findClosestMatch(contentMatches, sourceDir)
    }

    return null
  }

  findClosestMatch(matches, sourceDir) {
    if (matches.length === 1) return matches[0]

    return matches.reduce((closest, current) => {
      if (!closest) return current

      const closestDistance = path
        .relative(sourceDir, closest.filePath)
        .split('/').length
      const currentDistance = path
        .relative(sourceDir, current.filePath)
        .split('/').length

      return currentDistance < closestDistance ? current : closest
    }, null)
  }

  async scanFiles(versionDir) {
    await this.initialize()
    await this.buildIndex(versionDir)
  }

  // Method to display consolidated stats
  logStats() {
    const total =
      this.stats.fromMapping + this.stats.constructed + this.stats.unresolved
    if (total > 0) {
      console.log(`\n📊 Actions ID Resolution Stats (${this.version}):`)
      console.log(`  ✅ Resolved from mappings: ${this.stats.fromMapping}`)
      console.log(`  🔧 Resolved from generation: ${this.stats.constructed}`)
      console.log(`  ❌ Unresolved: ${this.stats.unresolved}`)
      console.log(`  📈 Total processed: ${total}`)
    }
  }

  // Reset stats
  resetStats() {
    this.stats = {
      fromMapping: 0,
      constructed: 0,
      unresolved: 0,
    }
  }
}

// Main plugin function
const plugin = () => {
  let resolver
  let cachedVersions = null

  async function getVersions() {
    if (cachedVersions) return cachedVersions

    try {
      const actionsDocsDir = path.join(process.cwd(), 'actions_versioned_docs')
      const items = await fs.readdir(actionsDocsDir)
      cachedVersions = items.filter(item => item.startsWith('version-'))
      return cachedVersions
    } catch (err) {
      return []
    }
  }

  return async function transformer(ast, vfile) {
    // Extract version from file path
    const versionMatch = vfile.path.match(/version-[\d.]+|version-latest/)
    if (!versionMatch) return

    const version = versionMatch[0]
    const versions = await getVersions()

    // Initialize resolver for this version if needed
    if (!resolver || resolver.version !== version) {
      resolver = new ActionsIdResolver(version, versions)
      const versionDir = path.join(
        process.cwd(),
        'actions_versioned_docs',
        version,
      )
      await resolver.scanFiles(versionDir)
    }

    // Process nodes
    visit(ast, ['text', 'link'], (node, index, parent) => {
      if (node.type === 'text') {
        const idRegex = /id::([a-zA-Z0-9-_#]+(?:\.[a-zA-Z0-9-_#]+)*)/g
        const matches = [...node.value.matchAll(idRegex)]

        if (matches.length) {
          let newValue = node.value
          matches.forEach(match => {
            const [fullMatch, id] = match
            const resolvedPath = resolver.findMatch(id, vfile.path)
            if (resolvedPath) {
              newValue = newValue.replace(fullMatch, `[${id}](${resolvedPath})`)
            }
          })
          node.value = newValue
        }
      } else if (node.type === 'link' && node.url.startsWith('id::')) {
        const id = node.url.replace('id::', '')
        const resolvedPath = resolver.findMatch(id, vfile.path)
        if (resolvedPath) {
          node.url = resolvedPath
        } else {
          parent.children.splice(index, 1, {
            type: 'text',
            value: node.children[0].value || id,
          })
        }
      }
    })
  }
}

module.exports = plugin
