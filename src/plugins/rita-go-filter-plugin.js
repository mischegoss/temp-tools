// src/plugins/ritago-filter-plugin.js
const fs = require('fs')
const path = require('path')

/**
 * Docusaurus plugin to extract availability metadata from Rita-Go page frontmatter
 * and generate a manifest file for client-side filtering
 */
module.exports = function ritagoFilterPlugin(context, options) {
  return {
    name: 'ritago-filter-plugin',

    async loadContent() {
      // This runs during the build process
      const { siteDir } = context
      const availabilityManifest = {}

      // Helper function to extract availability from frontmatter
      const extractAvailability = frontmatter => {
        const availability = {
          users: false,
          admin: false,
          trial: false,
          premium: false,
          enterprise: false,
        }

        // Check for direct availability properties
        if (frontmatter.availability) {
          Object.assign(availability, frontmatter.availability)
        }

        // Check for legacy badge properties
        if (frontmatter.badges) {
          Object.assign(availability, frontmatter.badges)
        }

        // Check for individual properties at root level
        ;['users', 'admin', 'trial', 'premium', 'enterprise'].forEach(key => {
          if (frontmatter[key] !== undefined) {
            availability[key] = frontmatter[key]
          }
        })

        return availability
      }

      // Function to recursively scan for MDX files
      const scanDirectory = (dir, baseUrl = '') => {
        try {
          const items = fs.readdirSync(dir, { withFileTypes: true })

          items.forEach(item => {
            const fullPath = path.join(dir, item.name)

            if (item.isDirectory()) {
              // Recursively scan subdirectories
              const subUrl = baseUrl ? `${baseUrl}/${item.name}` : item.name
              scanDirectory(fullPath, subUrl)
            } else if (
              item.isFile() &&
              (item.name.endsWith('.md') || item.name.endsWith('.mdx'))
            ) {
              try {
                const content = fs.readFileSync(fullPath, 'utf8')

                // Extract frontmatter using simple regex
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
                if (frontmatterMatch) {
                  // Parse YAML frontmatter
                  const frontmatterText = frontmatterMatch[1]
                  const frontmatter = parseFrontmatter(frontmatterText)

                  // Generate URL path
                  let urlPath = baseUrl ? `/${baseUrl}` : ''
                  const fileName = item.name.replace(/\.(md|mdx)$/, '')

                  // Handle index files
                  if (fileName !== 'index') {
                    urlPath += `/${fileName}`
                  }

                  // Handle custom slug in frontmatter
                  if (frontmatter.slug) {
                    urlPath = `/${baseUrl}/${frontmatter.slug}`.replace(
                      /\/+/g,
                      '/',
                    )
                  }

                  // Extract availability metadata
                  const availability = extractAvailability(frontmatter)

                  // Only add to manifest if page has availability metadata
                  const hasAvailability = Object.values(availability).some(
                    val => val === true,
                  )
                  if (hasAvailability) {
                    availabilityManifest[urlPath] = {
                      ...availability,
                      title: frontmatter.title || fileName,
                      description: frontmatter.description || '',
                      lastModified: new Date().toISOString(),
                    }
                  }
                }
              } catch (error) {
                console.warn(
                  `Error processing file ${fullPath}:`,
                  error.message,
                )
              }
            }
          })
        } catch (error) {
          console.warn(`Error reading directory ${dir}:`, error.message)
        }
      }

      // Simple YAML parser for frontmatter
      const parseFrontmatter = yamlText => {
        const result = {}
        const lines = yamlText.split('\n')
        let currentKey = null
        let currentObject = null

        lines.forEach(line => {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine.startsWith('#')) return

          // Handle nested objects (like availability:)
          if (trimmedLine.endsWith(':') && !trimmedLine.includes(' ')) {
            currentKey = trimmedLine.slice(0, -1)
            currentObject = {}
            result[currentKey] = currentObject
            return
          }

          // Handle key-value pairs
          const colonIndex = trimmedLine.indexOf(':')
          if (colonIndex > 0) {
            const key = trimmedLine.slice(0, colonIndex).trim()
            const value = trimmedLine.slice(colonIndex + 1).trim()

            // Parse value
            let parsedValue = value
            if (value === 'true') parsedValue = true
            else if (value === 'false') parsedValue = false
            else if (value.startsWith('"') && value.endsWith('"')) {
              parsedValue = value.slice(1, -1)
            } else if (value.startsWith("'") && value.endsWith("'")) {
              parsedValue = value.slice(1, -1)
            } else if (!isNaN(value) && value !== '') {
              parsedValue = Number(value)
            }

            // Assign to current object or root
            if (currentObject && currentKey) {
              currentObject[key] = parsedValue
            } else {
              result[key] = parsedValue
              currentKey = null
              currentObject = null
            }
          }
        })

        return result
      }

      // Scan only the Rita-Go docs directory
      const ritaGoDocsPath = path.join(siteDir, 'docs-rita-go-current')
      if (fs.existsSync(ritaGoDocsPath)) {
        console.log('🔍 Scanning Rita-Go docs for availability metadata...')
        scanDirectory(ritaGoDocsPath)
      } else {
        console.warn('⚠️  Rita-Go docs directory not found:', ritaGoDocsPath)
      }

      console.log(
        `✅ Found ${
          Object.keys(availabilityManifest).length
        } pages with availability metadata`,
      )

      return availabilityManifest
    },

    async contentLoaded({ content, actions }) {
      const { createData } = actions

      // Write the availability manifest to static folder
      const manifestPath = 'availability-manifest.json'

      try {
        await createData(manifestPath, JSON.stringify(content, null, 2))
        console.log(
          `📄 Rita-Go filter manifest written to static/data/${manifestPath}`,
        )
      } catch (error) {
        console.error('Error writing Rita-Go filter manifest:', error)
      }
    },

    configureWebpack(config, isServer) {
      // Add any webpack configuration if needed
      return {}
    },

    getPathsToWatch() {
      // Watch for changes in Rita-Go docs directory only
      return [path.join(context.siteDir, 'docs-rita-go-current/**/*.{md,mdx}')]
    },
  }
}
