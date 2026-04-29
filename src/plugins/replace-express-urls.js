const fs = require('fs').promises
const path = require('path')
const visit = require('unist-util-visit')
const { CURRENT_VERSIONS } = require('./product-config')

// Cache for mapping files
const mappingCache = new Map()

class ExpressIdResolver {
  constructor(version) {
    this.version = version
    this.mapping = null
    this.idToFile = new Map()
    this.categoryPaths = new Map()
    this.fileContent = new Map()
    this.anchorToFile = new Map()
  }

  async initialize() {
    if (mappingCache.has(this.version)) {
      this.mapping = mappingCache.get(this.version)
    } else {
      try {
        const mappingFileName =
          this.version === 'version-SaaS'
            ? 'express-mapping-SaaS.json'
            : `express-mapping-${this.version.replace('version-', '')}.json`

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
        this.mapping = {}
        mappingCache.set(this.version, {})
      }
    }

    const versionDir = path.join(
      process.cwd(),
      'express_versioned_docs',
      this.version,
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
        const newCategoryPath = categoryPath ? `${categoryPath}/${file}` : file

        this.categoryPaths.set(file.toLowerCase(), newCategoryPath)
        await this.buildIndex(fullPath, newCategoryPath)
      } else if (file.endsWith('.md') && !file.startsWith('_')) {
        const content = await fs.readFile(fullPath, 'utf8')

        const entry = {
          filePath: fullPath,
          relativePath: path.relative(dir, fullPath),
          categoryPath,
          fileName: file.replace(/\.md$/, ''),
          content,
        }

        this.fileContent.set(fullPath, content)
        const anchors = this.extractAnchors(content)
        this.anchorToFile.set(fullPath, anchors)

        const normalizedFileName = this.normalizeId(entry.fileName)
        this.addToIndex(normalizedFileName, entry)
        this.addToIndex(normalizedFileName.replace(/-/g, ''), entry)

        const pathKey = this.normalizeId(`${categoryPath}/${entry.fileName}`)
        this.addToIndex(pathKey, entry)
      }
    }
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

  addToIndex(key, entry) {
    if (!this.idToFile.has(key)) {
      this.idToFile.set(key, [])
    }
    this.idToFile.get(key).push(entry)
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

  validateAnchor(filePath, anchor) {
    if (!anchor) return true
    const fileAnchors = this.anchorToFile.get(filePath)
    return fileAnchors?.has(anchor) || false
  }

  findMatch(id, sourceFilePath) {
    const [baseId, rawAnchor] = id.split('#')
    const normalizedId = this.normalizeId(baseId)
    const anchor =
      rawAnchor && !rawAnchor.match(/UUID-[0-9a-f-]+/i)
        ? this.normalizeId(rawAnchor)
        : null

    let resolvedPath = this.findMappingMatch(normalizedId)

    // Check if mapping returned a complete URL
    if (resolvedPath && resolvedPath.startsWith('/')) {
      // It's already a complete URL - return as-is, just add anchor if needed
      if (anchor && !anchor.match(/UUID-[0-9a-f-]+/i)) {
        return `${resolvedPath}#${anchor}`
      }
      return resolvedPath
    }

    if (!resolvedPath) {
      const sourceDir = path.dirname(sourceFilePath)
      const entry = this.findBestMatch(normalizedId, sourceDir)
      if (!entry) {
        return null
      }
      // Generated from frontmatter/file scanning
      resolvedPath = this.generatePath(entry, anchor)
    } else {
      // Only do legacy processing for relative paths from mapping
      resolvedPath = this.generateMappedPath(resolvedPath, anchor)
    }

    return resolvedPath
  }

  findMappingMatch(normalizedId) {
    if (!this.mapping) return null

    if (this.mapping[normalizedId]) {
      return this.mapping[normalizedId]
    }

    const withoutActivity = normalizedId.replace(/-activity$/, '')
    if (this.mapping[withoutActivity]) {
      return this.mapping[withoutActivity]
    }

    const noDashesId = normalizedId.replace(/-/g, '')
    if (this.mapping[noDashesId]) {
      return this.mapping[noDashesId]
    }

    return null
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

  generateMappedPath(mappedPath, anchor) {
    const pathParts = mappedPath.split('/').filter(Boolean)
    const fileName = pathParts.pop()

    const cleanFileName = fileName
      .replace(/\.(md|mdx)$/i, '')
      .replace(/^[_*]+|[_*]+$/g, '')
      .toLowerCase()
      .replace(/_+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Version-specific path handling
    const CURRENT_VERSION = `version-${CURRENT_VERSIONS.dotFormat.express}`
    let versionPath
    if (this.version === 'version-SaaS') {
      versionPath = '/express/SaaS'
    } else if (this.version === CURRENT_VERSION) {
      versionPath = '/express'
    } else {
      const versionNumber = this.version.match(
        /version-On-Premise (\d+\.\d+)/,
      )[1]
      versionPath = `/express/On-Premise%20${versionNumber}`
    }

    let finalPath = `${versionPath}/${pathParts
      .map(p => p.replace(/\s/g, '%20'))
      .join('/')}/${cleanFileName}`
    finalPath = finalPath.replace(/\/+/g, '/')

    if (anchor && !anchor.match(/UUID-[0-9a-f-]+/i)) {
      finalPath += `#${anchor}`
    }

    return finalPath
  }

  generatePath(entry, anchor = null) {
    let categoryPath = entry.categoryPath
      ? entry.categoryPath
          .split('/')
          .map(p => p.replace(/\s/g, '%20'))
          .join('/')
      : ''

    let filename = entry.fileName
      .toLowerCase()
      .replace(/\.(md|mdx)$/i, '')
      .replace(/^[_*]+|[_*]+$/g, '')
      .replace(/_+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Version-specific path handling
    const CURRENT_VERSION = `version-${CURRENT_VERSIONS.dotFormat.express}`
    let versionPath
    if (this.version === 'version-SaaS') {
      versionPath = '/express/SaaS'
    } else if (this.version === CURRENT_VERSION) {
      versionPath = '/express'
    } else {
      const versionNumber = this.version.match(
        /version-On-Premise (\d+\.\d+)/,
      )[1]
      versionPath = `/express/On-Premise%20${versionNumber}`
    }

    let finalPath = `${versionPath}/${categoryPath}/${filename}`
    finalPath = finalPath.replace(/\/+/g, '/')

    if (anchor && !anchor.match(/UUID-[0-9a-f-]+/i)) {
      if (this.validateAnchor(entry.filePath, anchor)) {
        finalPath += `#${anchor}`
      }
    }

    return finalPath
  }
}

const plugin = () => {
  const resolvers = new Map()

  return async function transformer(ast, vfile) {
    if (!vfile.path.includes('docs-framework')) return

    const versionMatch = vfile.path.match(/version-(On-Premise \d+\.\d+|SaaS)/)
    if (!versionMatch) return

    const version = `version-${versionMatch[1]}`

    let resolver = resolvers.get(version)
    if (!resolver) {
      resolver = new ExpressIdResolver(version)
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
