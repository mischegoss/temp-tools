const fs = require('fs').promises
const path = require('path')
const visit = require('unist-util-visit')
const yaml = require('js-yaml')
const { CURRENT_VERSIONS } = require('./product-config')

// Cache for mapping files
const mappingCache = new Map()

class InsightsResolver {
  constructor(version) {
    this.version = version
    this.mapping = null
    this.idToFile = new Map()
    this.categoryPaths = new Map()
    this.fileContent = new Map()
    this.anchorToFile = new Map()
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
          `insights-mapping-${this.version}.json`,
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
      'insights_versioned_docs',
      `version-${this.version}`,
    )
    await this.buildIndex(versionDir)
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
    let resolvedPath = this.findMappingMatch(normalizedId)

    // Check if mapping returned a complete URL
    if (resolvedPath && resolvedPath.startsWith('/')) {
      // It's already a complete URL - return as-is, just add anchor if needed
      if (anchor) {
        return `${resolvedPath}#${anchor}`
      }
      return resolvedPath
    }

    // If no mapping match, try existing fallback methods
    if (!resolvedPath) {
      const entry = this.findBestMatch(
        normalizedId,
        path.dirname(sourceFilePath),
      )
      if (!entry) return null
      resolvedPath = this.generatePath(sourceFilePath, entry.filePath, anchor)
    } else {
      // Only do legacy processing for relative paths from mapping
      // Add anchor to mapping path if needed
      if (anchor) {
        resolvedPath += `#${anchor}`
      }
    }

    // Add version to path before returning (legacy behavior)
    return this.generateFinalPath(resolvedPath)
  }

  findMappingMatch(normalizedId) {
    if (!this.mapping) return null

    // 1. Direct match
    if (this.mapping[normalizedId]) {
      return this.mapping[normalizedId]
    }

    // 2. No dashes match
    const noDashesId = normalizedId.replace(/-/g, '')
    if (this.mapping[noDashesId]) {
      return this.mapping[noDashesId]
    }

    return null
  }

  generateFinalPath(path) {
    const CURRENT_VERSION = CURRENT_VERSIONS.dotFormat.insights
    const versionPath =
      this.version === CURRENT_VERSION
        ? '/insights'
        : `/insights/${this.version}`
    return `${versionPath}/${path}`
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
        const newCategoryPath = categoryPath ? `${categoryPath}/${file}` : file

        this.categoryPaths.set(file.toLowerCase(), newCategoryPath)
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
        }

        this.fileContent.set(fullPath, content)
        const anchors = this.extractAnchors(content)
        this.anchorToFile.set(fullPath, anchors)

        if (entry.id) {
          const normalizedId = this.normalizeId(entry.id)
          this.addToIndex(normalizedId, entry)
          this.addToIndex(normalizedId.replace(/-/g, ''), entry)
        }

        const normalizedFileName = this.normalizeId(entry.fileName)
        this.addToIndex(normalizedFileName, entry)
        this.addToIndex(normalizedFileName.replace(/-/g, ''), entry)

        const pathKey = this.normalizeId(`${categoryPath}/${entry.fileName}`)
        this.addToIndex(pathKey, entry)
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

  generatePath(sourcePath, targetPath, anchor = null) {
    let relativePath = path.relative(path.dirname(sourcePath), targetPath)

    relativePath = relativePath.replace(/\\/g, '/')
    let segments = relativePath.split('/')
    let filename = segments.pop().replace(/\.md$/, '')
    filename = filename.toLowerCase().replace(/\s+/g, '-')
    segments = segments.map(segment => encodeURIComponent(segment))
    relativePath = [...segments, filename].join('/')

    if (anchor) {
      if (!anchor.match(/UUID-[0-9a-f-]+/i)) {
        if (this.validateAnchor(targetPath, anchor)) {
          relativePath += `#${anchor}`
        }
      }
    }

    return relativePath
  }

  findBestMatch(normalizedId, sourceDir) {
    const exactMatches = this.idToFile.get(normalizedId)
    if (exactMatches?.length) {
      return this.findClosestMatch(exactMatches, sourceDir)
    }

    const noDashesId = normalizedId.replace(/-/g, '')
    const partialMatches = this.idToFile.get(noDashesId)
    if (partialMatches?.length) {
      return this.findClosestMatch(partialMatches, sourceDir)
    }

    const fuzzyMatches = Array.from(this.idToFile.entries())
      .filter(
        ([key, _]) => key.includes(normalizedId) || normalizedId.includes(key),
      )
      .flatMap(([_, entries]) => entries)

    if (fuzzyMatches.length) {
      return this.findClosestMatch(fuzzyMatches, sourceDir)
    }

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
}

const plugin = () => {
  const resolvers = new Map()
  const IGNORED_VERSIONS = ['9.5']
  const CURRENT_VERSION = CURRENT_VERSIONS.dotFormat.insights

  return async function transformer(ast, vfile) {
    if (!vfile.path.includes('insights_versioned_docs')) return

    const versionMatch = vfile.path.match(/version-(\d+\.\d+)/)
    const version = versionMatch ? versionMatch[1] : CURRENT_VERSION

    // Skip processing for ignored versions
    if (IGNORED_VERSIONS.includes(version)) {
      return
    }

    let resolver = resolvers.get(version)
    if (!resolver) {
      resolver = new InsightsResolver(version)
      await resolver.initialize()
      resolvers.set(version, resolver)
    }

    visit(ast, ['text', 'link'], node => {
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
        }
      }
    })
  }
}

module.exports = plugin
