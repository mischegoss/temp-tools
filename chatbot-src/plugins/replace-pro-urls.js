const fs = require('fs').promises
const path = require('path')
const visit = require('unist-util-visit')
const matter = require('gray-matter')
const { CURRENT_VERSIONS } = require('./product-config')

// Cache for mapping files
const mappingCache = new Map()

class ProIdResolver {
  constructor(version) {
    this.version = version
    this.mapping = null
    this.idToFile = new Map()
    this.fileContent = new Map()
  }

  async initialize() {
    // Check if mapping is already cached
    if (mappingCache.has(this.version)) {
      this.mapping = mappingCache.get(this.version)
    } else {
      try {
        const mappingPath = path.join(
          process.cwd(),
          'src',
          'plugins',
          'plugin-mappings',
          `pro-mapping-${this.version}.json`,
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

        // Cache the parsed mapping
        mappingCache.set(this.version, this.mapping)
      } catch (error) {
        this.mapping = {}
        // Cache empty mapping to avoid repeated failed reads
        mappingCache.set(this.version, {})
      }
    }

    const versionDir = path.join(
      process.cwd(),
      'pro_versioned_docs',
      `version-${this.version}`,
    )
    await this.buildIndex(versionDir)
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
        await this.buildIndex(fullPath, path.join(categoryPath, file))
      } else if (file.endsWith('.md') && !file.startsWith('_')) {
        const content = await fs.readFile(fullPath, 'utf8')
        const frontMatter = matter(content).data

        const entry = {
          filePath: fullPath,
          categoryPath,
          fileName: file.replace(/\.md$/, ''),
          frontMatter,
        }

        if (frontMatter && frontMatter.id) {
          this.addToIndex(this.normalizeId(frontMatter.id), entry)
        }

        this.fileContent.set(fullPath, content)
      }
    }
  }

  addToIndex(key, entry) {
    if (!this.idToFile.has(key)) {
      this.idToFile.set(key, [])
    }
    this.idToFile.get(key).push(entry)
  }

  normalizeId(id) {
    const baseId = id.split('#')[0]
    return baseId
      .toLowerCase()
      .replace(/,/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .trim()
  }

  findMatch(id, sourceFilePath) {
    const [baseId, rawAnchor] = id.split('#')
    const normalizedId = this.normalizeId(baseId)
    const anchor = rawAnchor ? this.normalizeId(rawAnchor) : null

    // First try mapping match
    let resolvedPath = this.findBestMappingMatch(normalizedId)

    // Check if mapping returned a complete URL
    if (resolvedPath && resolvedPath.startsWith('/')) {
      // It's already a complete URL - return as-is, just add anchor if needed
      if (anchor) {
        return `${resolvedPath}#${anchor}`
      }
      return resolvedPath
    }

    // If no mapping match, try front matter
    if (!resolvedPath) {
      resolvedPath = this.findFrontMatterMatch(normalizedId, sourceFilePath)
      if (!resolvedPath) {
        return null
      }
    }

    // Add version to path before cleaning (legacy behavior)
    const CURRENT_VERSION = CURRENT_VERSIONS.dotFormat.pro
    if (this.version !== CURRENT_VERSION) {
      resolvedPath = `${this.version}/${resolvedPath}`
    }

    return this.generateFinalPath(resolvedPath, anchor)
  }

  findBestMappingMatch(normalizedId) {
    if (!this.mapping) {
      return null
    }

    let matchedPath = null

    // 1. Direct match
    if (this.mapping[normalizedId]) {
      matchedPath = this.mapping[normalizedId]
    }
    // 2. No dashes match
    else {
      const noDashesId = normalizedId.replace(/-/g, '')
      if (this.mapping[noDashesId]) {
        matchedPath = this.mapping[noDashesId]
      }
      // 3. No dashes and lowercase
      else {
        const noDashesLowerId = noDashesId.toLowerCase()
        if (this.mapping[noDashesLowerId]) {
          matchedPath = this.mapping[noDashesLowerId]
        }
        // 4. Search through all mapping keys for partial matches
        else {
          const keys = Object.keys(this.mapping)
          const partialMatch = keys.find(key => {
            const normalizedKey = key.toLowerCase().replace(/-/g, '')
            const normalizedSearchId = normalizedId
              .toLowerCase()
              .replace(/-/g, '')
            return normalizedKey === normalizedSearchId
          })

          if (partialMatch) {
            matchedPath = this.mapping[partialMatch]
          }
        }
      }
    }

    return matchedPath
  }

  findFrontMatterMatch(normalizedId, sourceFilePath) {
    const matches = this.idToFile.get(normalizedId)
    if (!matches?.length) return null

    const entry = this.findClosestMatch(matches, sourceFilePath)
    if (!entry) return null

    const categoryPath = entry.categoryPath
      ? entry.categoryPath.split(path.sep).map(this.encodePathSegment).join('/')
      : ''
    const filename = entry.fileName.toLowerCase().replace(/\s+/g, '-')

    return `${categoryPath}/${filename}`
  }

  findClosestMatch(matches, sourceFilePath) {
    return matches.reduce((closest, current) => {
      if (!closest) return current

      const closestDistance = path
        .relative(sourceFilePath, closest.filePath)
        .split('/').length
      const currentDistance = path
        .relative(sourceFilePath, current.filePath)
        .split('/').length

      return currentDistance < closestDistance ? current : closest
    }, null)
  }

  generateFinalPath(path, anchor) {
    const pathParts = path.split('/')
    const fileName = pathParts.pop()

    const cleanFileName = fileName
      .replace(/\.(md|mdx)$/i, '') // Remove .md or .mdx extension
      .replace(/^[_*]+|[_*]+$/g, '') // Remove leading/trailing _ and *
      .toLowerCase() // Convert to lowercase
      .replace(/_+/g, '-') // Replace underscores with hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

    const cleanPath = [...pathParts, cleanFileName].join('/')

    // Version is already in the path if needed, just add the /pro prefix
    let finalPath = `/pro/${cleanPath}`
    if (anchor) {
      finalPath += `#${anchor}`
    }
    return finalPath
  }

  encodePathSegment(segment) {
    return segment.replace(/\s/g, '%20')
  }
}

const plugin = () => {
  // Create a Map to store separate resolvers for each version
  const resolvers = new Map()

  return async function transformer(ast, vfile) {
    if (!vfile.path.includes('docs-framework')) return

    const versionMatch = vfile.path.match(/version-(\d+\.\d+)/)
    const version = versionMatch
      ? versionMatch[1]
      : CURRENT_VERSIONS.dotFormat.pro

    // Get or create a resolver for this specific version
    let resolver = resolvers.get(version)
    if (!resolver) {
      resolver = new ProIdResolver(version)
      await resolver.initialize()
      resolvers.set(version, resolver)
    }

    visit(ast, ['text', 'link'], (node, index, parent) => {
      if (node.type === 'text') {
        const idRegex = /id::([a-zA-Z0-9-_#]+)/g
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
        }
      }
    })
  }
}

module.exports = plugin
