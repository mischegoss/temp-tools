// scripts/generateBadgeData.js - FIXED URL GENERATION VERSION
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const matter = require('gray-matter')

function generateBadgeData() {
  console.log('🔍 Scanning frontmatter for badge properties...')

  const badgeData = {}

  // Find all MDX files in docs-rita-go-current
  const files = glob.sync('docs-rita-go-current/**/*.{md,mdx}')

  console.log(`📄 Found ${files.length} files to scan`)

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8')

      // Parse frontmatter to get the id and badge properties
      const { data: frontmatter } = matter(content)

      if (!frontmatter.id) {
        console.log(`⚠️  No id found in frontmatter for ${file}`)
        return
      }

      // FIXED: Generate URLs based on actual file structure and frontmatter
      const urlPath = generateDocusaurusURL(file, frontmatter)

      // Extract badge data directly from frontmatter
      const badges = {
        users: frontmatter.users || false,
        admin: frontmatter.admin || false,
        trial: frontmatter.trial || false,
        premium: frontmatter.premium || false,
        enterprise: frontmatter.enterprise || false,
      }

      // Only include in badge data if any badges are true
      const hasBadges = Object.values(badges).some(value => value === true)

      if (hasBadges) {
        badgeData[urlPath] = badges
        console.log(`✅ Found badges in ${file}:`)
        console.log(`📝 URL: ${urlPath}`)
        Object.entries(badges).forEach(([key, value]) => {
          if (value) console.log(`  📋 ${key}: ${value}`)
        })
      } else {
        console.log(`⚪ No badge properties found in ${file}`)
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message)
    }
  })

  return badgeData
}

function generateSidebarData() {
  console.log('🧭 Generating sidebar data...')

  const sidebarData = []

  // Find all MDX files in docs-rita-go-current
  const files = glob.sync('docs-rita-go-current/**/*.{md,mdx}')

  console.log(`📄 Scanning ${files.length} files for sidebar structure`)

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8')

      // Parse frontmatter to get the id and other metadata
      const { data: frontmatter } = matter(content)

      if (!frontmatter.id) {
        console.log(`⚠️  No id found in frontmatter for ${file} - skipping`)
        return
      }

      // FIXED: Generate URLs based on actual file structure and frontmatter
      const urlPath = generateDocusaurusURL(file, frontmatter)
      const category = getCategoryFromFile(file)

      // Add to sidebar data
      sidebarData.push({
        url: urlPath,
        title: frontmatter.title || 'Untitled',
        category: category,
        id: frontmatter.id,
        sidebar_position: frontmatter.sidebar_position || 999,
        file: file,
      })

      console.log(`📄 Added to sidebar: ${urlPath} (${frontmatter.title})`)
    } catch (error) {
      console.error(`❌ Error processing ${file} for sidebar:`, error.message)
    }
  })

  // Sort by category and sidebar_position
  sidebarData.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.sidebar_position - b.sidebar_position
  })

  return sidebarData
}

/**
 * Generate the correct Docusaurus URL based on file path and frontmatter
 * This matches how Docusaurus actually generates URLs
 */
function generateDocusaurusURL(file, frontmatter) {
  // Remove the docs-rita-go-current/ prefix and file extension
  let basePath = file
    .replace('docs-rita-go-current/', '')
    .replace(/\.(md|mdx)$/, '')

  // If frontmatter has a custom slug, use that
  if (frontmatter.slug) {
    if (frontmatter.slug.startsWith('/')) {
      return frontmatter.slug // Absolute slug
    } else {
      return `/rita-go/${frontmatter.slug}` // Relative slug
    }
  }

  // For root files, use the filename unless there's a special mapping
  if (!basePath.includes('/')) {
    // Check for known URL mappings based on actual console log URLs
    const urlMappings = {
      new: 'whats-new', // new.mdx -> /rita-go/whats-new
      FAQs: 'FAQs', // FAQs.mdx -> /rita-go/FAQs
      intro: 'intro', // intro.mdx -> /rita-go/intro
    }

    const mappedUrl = urlMappings[basePath] || basePath
    return `/rita-go/${mappedUrl}`
  }

  // For subfolder files, check if frontmatter ID differs from filename
  const pathParts = basePath.split('/')
  const category = pathParts[0]
  const filename = pathParts[1]

  // If frontmatter.id differs from filename, use the frontmatter.id
  if (frontmatter.id && frontmatter.id !== filename) {
    return `/rita-go/${category}/${frontmatter.id}`
  }

  // Otherwise use the file-based path
  return `/rita-go/${basePath}`
}

/**
 * Get category name from file path
 */
function getCategoryFromFile(file) {
  const pathParts = file.replace('docs-rita-go-current/', '').split('/')

  if (pathParts.length === 1) {
    return 'root'
  } else {
    return pathParts[0]
  }
}

function generateFilterableData(badgeData, sidebarData) {
  console.log('🔗 Combining badge and sidebar data...')

  const filterableData = sidebarData.map(sidebarItem => {
    const badges = badgeData[sidebarItem.url] || null

    return {
      url: sidebarItem.url,
      title: sidebarItem.title,
      category: sidebarItem.category,
      id: sidebarItem.id,
      sidebar_position: sidebarItem.sidebar_position,
      hasFiltering: !!badges,
      badges: badges,
    }
  })

  console.log(`🔗 Created ${filterableData.length} filterable items`)
  console.log(
    `📊 ${
      filterableData.filter(item => item.hasFiltering).length
    } items have filtering badges`,
  )

  return filterableData
}

function generateAllData() {
  console.log('🚀 Starting frontmatter-based data generation...')

  // Generate badge data from frontmatter
  const badgeData = generateBadgeData()

  // Generate sidebar data
  const sidebarData = generateSidebarData()

  // Generate combined filterable data
  const filterableData = generateFilterableData(badgeData, sidebarData)

  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'static', 'data')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write badge data file
  const badgeDataPath = path.join(outputDir, 'badgeData.json')
  fs.writeFileSync(badgeDataPath, JSON.stringify(badgeData, null, 2))
  console.log(`📝 Saved badge data: ${badgeDataPath}`)

  // Write sidebar data file
  const sidebarDataPath = path.join(outputDir, 'sidebarData.json')
  fs.writeFileSync(sidebarDataPath, JSON.stringify(sidebarData, null, 2))
  console.log(`📝 Saved sidebar data: ${sidebarDataPath}`)

  // Write filterable data file (combined)
  const filterableDataPath = path.join(outputDir, 'filterableData.json')
  fs.writeFileSync(filterableDataPath, JSON.stringify(filterableData, null, 2))
  console.log(`📝 Saved filterable data: ${filterableDataPath}`)

  // Summary
  console.log('\n📊 Generation Summary:')
  console.log(`  📋 Badge data entries: ${Object.keys(badgeData).length}`)
  console.log(`  🧭 Sidebar items: ${sidebarData.length}`)
  console.log(`  🔗 Filterable items: ${filterableData.length}`)
  console.log(
    `  📊 Items with filtering: ${
      filterableData.filter(item => item.hasFiltering).length
    }`,
  )

  console.log('\n📋 Pages with Badge Properties:')
  Object.entries(badgeData).forEach(([url, badges]) => {
    const badgeList = Object.entries(badges)
      .filter(([key, value]) => value)
      .map(([key, value]) => key)
      .join(', ')
    console.log(`  🏷️ ${url} [${badgeList}]`)
  })

  console.log('\n🧭 All Sidebar URLs:')
  sidebarData.forEach(item => {
    const hasFiltering = filterableData.find(
      f => f.url === item.url,
    )?.hasFiltering
    console.log(`  ${hasFiltering ? '🏷️' : '📄'} ${item.url} (${item.title})`)
  })

  return {
    badgeData,
    sidebarData,
    filterableData,
  }
}

// Run the generator
if (require.main === module) {
  generateAllData()
}

module.exports = {
  generateBadgeData,
  generateSidebarData,
  generateFilterableData,
  generateAllData,
}
