// scripts/generateBadgeData.js - UPDATED TO SUPPORT OWNER FRONT MATTER
// Also includes: preprocessing for common YAML issues + improved error reporting
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const matter = require('gray-matter')

/**
 * Pre-process frontmatter to fix common YAML issues before parsing
 * This prevents the script from failing on minor syntax errors
 */
function preprocessFrontmatter(content, filePath) {
  // Extract frontmatter section
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return content

  let frontmatter = match[1]
  const originalFrontmatter = frontmatter

  // Fix 1: Trailing commas in inline arrays [item1, item2,] → [item1, item2]
  frontmatter = frontmatter.replace(/,(\s*)\]/g, '$1]')

  // Fix 2: Trailing commas in multi-line arrays
  frontmatter = frontmatter.replace(/,(\s*\n\s*)\]/g, '$1]')

  // Fix 3: Trailing whitespace on lines (can cause issues)
  frontmatter = frontmatter
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')

  // Log if we made any fixes
  if (frontmatter !== originalFrontmatter) {
    console.log(`🔧 Auto-fixed YAML issues in ${filePath}`)
  }

  return content.replace(match[1], frontmatter)
}

/**
 * Enhanced error logging for YAML parsing failures
 */
function logParseError(file, error) {
  console.error(`❌ Error processing ${file}:`)
  console.error(`   Message: ${error.message}`)

  // If it's a YAML parsing error with line info, show context
  if (error.mark) {
    console.error(
      `   Location: Line ${error.mark.line + 1}, Column ${error.mark.column}`,
    )
    try {
      const lines = fs.readFileSync(file, 'utf8').split('\n')
      const errorLine = error.mark.line
      // Show a few lines of context around the error
      const startLine = Math.max(0, errorLine - 2)
      const endLine = Math.min(lines.length - 1, errorLine + 2)

      console.error(`   Context:`)
      for (let i = startLine; i <= endLine; i++) {
        const marker = i === errorLine ? ' → ' : '   '
        console.error(`   ${marker}${i + 1}: ${lines[i]}`)
      }
    } catch (readError) {
      // Couldn't read file for context, that's okay
    }
  }
  console.error('') // Blank line for readability
}

function generateBadgeData() {
  console.log('🔍 Scanning frontmatter for badge properties...')

  const badgeData = {}

  // Find all MDX files in docs-rita-go-current
  const files = glob.sync('docs-rita-go-current/**/*.{md,mdx}')

  console.log(`📄 Found ${files.length} files to scan`)

  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8')

      // Pre-process to fix common YAML issues
      content = preprocessFrontmatter(content, file)

      // Parse frontmatter to get badge properties
      const { data: frontmatter } = matter(content)

      if (!frontmatter.id) {
        console.log(`⚠️  No id found in frontmatter for ${file}`)
        return
      }

      // Simple URL generation - let Docusaurus handle the complex logic
      const urlPath = generateSimpleURL(file, frontmatter)

      // Extract badge data directly from frontmatter
      // UPDATED: Now accepts both admin: true and owner: true
      const badges = {
        users: frontmatter.users === true,
        admin: frontmatter.admin === true || frontmatter.owner === true,
        trial: frontmatter.trial === true,
        premium: frontmatter.premium === true,
        enterprise: frontmatter.enterprise === true,
      }

      // Only include pages that have at least one badge set to true
      const hasBadges = Object.values(badges).some(value => value === true)

      if (hasBadges) {
        badgeData[urlPath] = badges
        console.log(`✅ Found badges in ${file}:`)
        console.log(`📝 URL: ${urlPath}`)
        Object.entries(badges).forEach(([key, value]) => {
          if (value) console.log(`  📋 ${key}: ${value}`)
        })
      } else {
        console.log(
          `⚪ No badge properties found in ${file} - will ALWAYS SHOW`,
        )
      }
    } catch (error) {
      logParseError(file, error)
    }
  })

  return badgeData
}

function generateFilterableData() {
  console.log('🧭 Generating filter lists with CORRECT category URLs...')

  const allPages = []
  const categoryMap = {}

  // Find all MDX files in docs-rita-go-current
  const files = glob.sync('docs-rita-go-current/**/*.{md,mdx}')

  console.log(`📄 Scanning ${files.length} files`)

  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8')

      // Pre-process to fix common YAML issues
      content = preprocessFrontmatter(content, file)

      // Parse frontmatter to get the id and other metadata
      const { data: frontmatter } = matter(content)

      if (!frontmatter.id) {
        console.log(`⚠️  No id found in frontmatter for ${file} - skipping`)
        return
      }

      // Generate URL using same logic as badge data
      const urlPath = generateSimpleURL(file, frontmatter)
      const category = getCategoryFromFile(file)

      // Extract badge data
      // UPDATED: Now accepts both admin: true and owner: true
      const badges = {
        users: frontmatter.users === true,
        admin: frontmatter.admin === true || frontmatter.owner === true,
        trial: frontmatter.trial === true,
        premium: frontmatter.premium === true,
        enterprise: frontmatter.enterprise === true,
      }

      // Check if page has filtering (any badge is true)
      const hasFiltering = Object.values(badges).some(value => value === true)

      // Add to all pages list
      const pageData = {
        url: urlPath,
        title: frontmatter.title || 'Untitled',
        category: category,
        id: frontmatter.id,
        sidebar_position: frontmatter.sidebar_position || 999,
        hasFiltering: hasFiltering,
        badges: hasFiltering ? badges : null,
      }

      allPages.push(pageData)

      // Track categories and their pages
      if (category !== 'root') {
        if (!categoryMap[category]) {
          categoryMap[category] = []
        }
        categoryMap[category].push(pageData)
      }

      console.log(
        `📄 Added: ${urlPath} (${frontmatter.title}) category: ${category} ${
          hasFiltering ? '[WILL BE FILTERED]' : '[ALWAYS SHOWS]'
        }`,
      )
    } catch (error) {
      logParseError(file, error)
    }
  })

  // Sort all pages by category and sidebar_position
  allPages.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.sidebar_position - b.sidebar_position
  })

  // Separate pages into "always show" and "filterable"
  const alwaysShowPages = allPages.filter(page => !page.hasFiltering)
  const filterablePages = allPages.filter(page => page.hasFiltering)

  console.log(`\n📊 Page Classification:`)
  console.log(`  ✅ Always show (no badges): ${alwaysShowPages.length}`)
  console.log(`  🔄 Filterable (has badges): ${filterablePages.length}`)
  console.log(`  📁 Categories found: ${Object.keys(categoryMap).join(', ')}`)

  // Generate filter lists with BOTH individual pages AND category URLs
  const filterLists = {
    adminFilter: [],
    userFilter: [],
    bothFilter: [],
    noFilter: [],
  }

  // Add always-show pages to ALL filter lists
  alwaysShowPages.forEach(page => {
    const item = {
      url: page.url,
      title: page.title,
      category: page.category,
    }

    filterLists.adminFilter.push(item)
    filterLists.userFilter.push(item)
    filterLists.bothFilter.push(item)
    filterLists.noFilter.push(item)
  })

  // Add filterable pages based on their badges
  filterablePages.forEach(page => {
    const { badges } = page
    const item = {
      url: page.url,
      title: page.title,
      category: page.category,
    }

    // Admin filter: always-show pages + pages with admin=true
    if (badges.admin === true) {
      filterLists.adminFilter.push(item)
    }

    // User filter: always-show pages + pages with users=true
    if (badges.users === true) {
      filterLists.userFilter.push(item)
    }

    // Both/No filter: all pages
    filterLists.bothFilter.push(item)
    filterLists.noFilter.push(item)
  })

  // FIXED: Generate category URLs that match actual Docusaurus URLs
  Object.entries(categoryMap).forEach(([categoryName, pages]) => {
    // CRITICAL FIX: Map directory names to actual Docusaurus category URLs
    const categoryUrlMap = {
      'Getting-Started': 'getting-started',
      Administration: 'administration',
      'Knowledge-Base-Management': 'knowledge-base', // ← THE FIX!
      'User-Management': 'user-management',
    }

    const categorySlug =
      categoryUrlMap[categoryName] ||
      categoryName.toLowerCase().replace(/\s+/g, '-')
    const categoryUrl = `/rita-go/category/${categorySlug}`

    console.log(`\n📁 Processing category: ${categoryName}`)
    console.log(`   📂 Directory name: ${categoryName}`)
    console.log(`   🔗 Generated URL: ${categoryUrl}`)
    console.log(`   📄 Contains ${pages.length} pages`)

    // Check if category has admin pages OR always-show pages
    const hasAdminPages = pages.some(
      page => page.hasFiltering && page.badges.admin === true,
    )
    const hasAlwaysShowPages = pages.some(page => !page.hasFiltering)

    if (hasAdminPages || hasAlwaysShowPages) {
      filterLists.adminFilter.push({
        url: categoryUrl,
        title: `${categoryName} Category`,
        category: categoryName,
      })
      console.log(
        `   🔧 Added to admin filter (hasAdmin: ${hasAdminPages}, hasAlways: ${hasAlwaysShowPages})`,
      )
    }

    // Check if category has user pages OR always-show pages
    const hasUserPages = pages.some(
      page => page.hasFiltering && page.badges.users === true,
    )

    if (hasUserPages || hasAlwaysShowPages) {
      filterLists.userFilter.push({
        url: categoryUrl,
        title: `${categoryName} Category`,
        category: categoryName,
      })
      console.log(
        `   👤 Added to user filter (hasUser: ${hasUserPages}, hasAlways: ${hasAlwaysShowPages})`,
      )
    }

    // All categories go in both/no filter (always show all categories)
    filterLists.bothFilter.push({
      url: categoryUrl,
      title: `${categoryName} Category`,
      category: categoryName,
    })

    filterLists.noFilter.push({
      url: categoryUrl,
      title: `${categoryName} Category`,
      category: categoryName,
    })

    console.log(`   ✅ Added to both/no filter`)
  })

  console.log('\n📊 Final Filter Lists:')
  console.log(`  👤 User filter: ${filterLists.userFilter.length} items`)
  console.log(`  🔧 Admin filter: ${filterLists.adminFilter.length} items`)
  console.log(`  🔄 Both/No filter: ${filterLists.bothFilter.length} items`)

  // Show category URLs specifically
  console.log('\n📁 Generated Category URLs:')
  const categoryUrls = filterLists.noFilter.filter(item =>
    item.url.includes('/category/'),
  )
  categoryUrls.forEach(item => {
    console.log(`  📁 ${item.url}`)
  })

  return {
    allPages: allPages,
    alwaysShowPages: alwaysShowPages,
    filterablePages: filterablePages,
    categoryMap: categoryMap,
    filterLists: filterLists,
  }
}

/**
 * Generate URL based on file path and frontmatter id
 * Docusaurus uses the frontmatter id for URLs, not the filename
 */
function generateSimpleURL(file, frontmatter) {
  // If frontmatter has a custom slug, use that first (highest priority)
  if (frontmatter.slug) {
    if (frontmatter.slug.startsWith('/')) {
      return frontmatter.slug // Absolute slug
    } else {
      return `/rita-go/${frontmatter.slug}` // Relative slug
    }
  }

  // Get the directory path from the file location
  const pathWithoutExtension = file
    .replace('docs-rita-go-current/', '')
    .replace(/\.(md|mdx)$/, '')

  const pathParts = pathWithoutExtension.split('/')

  // For root files (no subdirectory)
  if (pathParts.length === 1) {
    // Use frontmatter id for the URL (Docusaurus behavior)
    return `/rita-go/${frontmatter.id}`
  }

  // For subfolder files, use directory path + frontmatter id
  // Replace the filename (last part) with the frontmatter id
  pathParts[pathParts.length - 1] = frontmatter.id

  return `/rita-go/${pathParts.join('/')}`
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

function saveData() {
  console.log('🚀 Starting FIXED badge + filterable data generation...')

  try {
    // Generate badge data from frontmatter
    const badgeData = generateBadgeData()

    // Generate filterable data with correct category URLs
    const {
      allPages,
      alwaysShowPages,
      filterablePages,
      categoryMap,
      filterLists,
    } = generateFilterableData()

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'static', 'data')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write badge data file (for badge display) - formatted for readability
    const badgeDataPath = path.join(outputDir, 'badgeData.json')
    fs.writeFileSync(badgeDataPath, JSON.stringify(badgeData, null, 2))
    console.log(`📝 Saved badge data: ${badgeDataPath}`)

    // Write filterable data file with correct category URLs
    const filterableDataPath = path.join(outputDir, 'filterableData.json')
    fs.writeFileSync(
      filterableDataPath,
      JSON.stringify(
        {
          allPages: allPages,
          alwaysShowPages: alwaysShowPages,
          filterablePages: filterablePages,
          categoryMap: categoryMap,
          filterLists: filterLists,
        },
        null,
        2,
      ),
    )
    console.log(`📝 Saved filterable data: ${filterableDataPath}`)

    // Summary
    console.log('\n📊 Generation Summary:')
    console.log(`  📋 Pages with badges: ${Object.keys(badgeData).length}`)
    console.log(`  🧭 Total pages: ${allPages.length}`)
    console.log(`  ✅ Always show pages: ${alwaysShowPages.length}`)
    console.log(`  🔄 Filterable pages: ${filterablePages.length}`)
    console.log(`  📁 Categories: ${Object.keys(categoryMap).length}`)
    console.log(`  👤 User filter total: ${filterLists.userFilter.length}`)
    console.log(`  🔧 Admin filter total: ${filterLists.adminFilter.length}`)

    return {
      badgeData,
      allPages,
      alwaysShowPages,
      filterablePages,
      categoryMap,
      filterLists,
    }
  } catch (error) {
    console.error('❌ Error in data generation:', error)
    throw error
  }
}

// Run the generator
if (require.main === module) {
  saveData()
}

module.exports = {
  generateBadgeData,
  generateFilterableData,
  saveData,
}
