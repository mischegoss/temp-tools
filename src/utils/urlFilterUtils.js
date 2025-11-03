// src/utils/urlFilterUtils.js - DEBUG VERSION TO IDENTIFY BADGE LOGIC ISSUE
/**
 * 4-state filter system with DEBUGGING: 'none', 'user', 'admin', 'both'
 */

/**
 * Get current filter from URL parameter
 */
export function getFilterFromURL() {
  if (typeof window === 'undefined') return 'none'

  const urlParams = new URLSearchParams(window.location.search)
  const filter = urlParams.get('filter')

  if (filter === 'user' || filter === 'admin' || filter === 'both') {
    return filter
  }

  return 'none' // Default: both toggles off, show all content
}

/**
 * Set filter in URL parameter with better persistence
 */
export function setFilterInURL(filterType) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location)

  console.log(
    '🔗 Setting filter in URL:',
    filterType,
    'for path:',
    url.pathname,
  )

  if (
    filterType === 'user' ||
    filterType === 'admin' ||
    filterType === 'both'
  ) {
    url.searchParams.set('filter', filterType)
  } else {
    url.searchParams.delete('filter')
  }

  window.history.replaceState({ filter: filterType }, '', url.toString())

  console.log('✅ URL updated to:', url.toString())

  setTimeout(() => {
    applySimpleFiltering()
  }, 50)
}

/**
 * Load filterable data
 */
export async function loadFilterableData() {
  try {
    const response = await fetch('/data/filterableData.json')
    if (!response.ok) {
      console.warn('Could not load filterable data:', response.status)
      return []
    }
    const filterableData = await response.json()
    console.log('📋 Loaded filterable data:', filterableData.length, 'pages')
    return filterableData
  } catch (error) {
    console.error('Failed to load filterable data:', error)
    return []
  }
}

/**
 * DEBUG: Apply filtering with detailed logging
 */
export async function applySimpleFiltering() {
  if (typeof window === 'undefined') return

  const activeFilter = getFilterFromURL()
  console.log('🎯 Applying simple filtering with filter:', activeFilter)

  // If no filter or both, show all content
  if (activeFilter === 'none' || activeFilter === 'both') {
    console.log('✅ Showing all content (no filter or both toggles)')
    showAllSidebarItems()
    return
  }

  // Load the filterable data
  const filterableData = await loadFilterableData()

  // DEBUG: Log all pages with badges to understand the data structure
  console.log('🔍 DEBUG: All pages with badges:')
  filterableData.forEach(page => {
    if (page.badges) {
      console.log(
        `  📄 ${page.url} - users:${page.badges.users}, admin:${page.badges.admin}`,
      )
    }
  })

  const sidebarLinks = document.querySelectorAll('.menu__link')
  console.log(`🔍 Found ${sidebarLinks.length} sidebar links to process`)

  let visibleCount = 0
  let hiddenCount = 0

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href')
    const sidebarItem =
      link.closest('.theme-doc-sidebar-item-link') ||
      link.closest('[class*="sidebar-item"]') ||
      link.closest('.menu__list-item')

    if (href && sidebarItem) {
      const pageData = filterableData.find(item => item.url === href)

      if (pageData?.badges) {
        // DEBUG: Detailed logging for each page decision
        const shouldShow = shouldPageBeVisible(pageData.badges, activeFilter)
        console.log(`🔍 DEBUG: Page ${href}`)
        console.log(
          `  📊 Badges: users=${pageData.badges.users}, admin=${pageData.badges.admin}`,
        )
        console.log(`  🎯 Filter: ${activeFilter}`)
        console.log(`  ✅ Should show: ${shouldShow}`)
        console.log(
          `  📝 Logic: ${getLogicExplanation(pageData.badges, activeFilter)}`,
        )

        if (shouldShow) {
          sidebarItem.style.display = ''
          visibleCount++
          console.log(`✅ SHOWING: ${href} (${pageData.title})`)
        } else {
          sidebarItem.style.display = 'none'
          hiddenCount++
          console.log(`🚫 HIDING: ${href} (${pageData.title})`)
        }
      } else {
        sidebarItem.style.display = ''
        visibleCount++
        console.log(`📄 Always visible: ${href} (no badges)`)
      }
    }
  })

  hideEmptyCategories()

  console.log('🎨 Simple filtering complete:')
  console.log(`  - Active filter: ${activeFilter}`)
  console.log(`  - Visible items: ${visibleCount}`)
  console.log(`  - Hidden items: ${hiddenCount}`)
}

/**
 * DEBUG: Get explanation of filtering logic for debugging
 */
function getLogicExplanation(badges, activeFilter) {
  if (activeFilter === 'user') {
    return `User filter: looking for badges.users === true. Found: ${badges.users}`
  } else if (activeFilter === 'admin') {
    return `Admin filter: looking for badges.admin === true. Found: ${badges.admin}`
  }
  return 'Unknown filter'
}

/**
 * DEBUG: Enhanced visibility check with detailed logging
 */
function shouldPageBeVisible(badges, activeFilter) {
  console.log(`    🧮 shouldPageBeVisible called with:`)
  console.log(`       badges:`, badges)
  console.log(`       activeFilter:`, activeFilter)

  if (activeFilter === 'user') {
    const result = badges.users === true
    console.log(
      `    👤 User filter: badges.users (${badges.users}) === true → ${result}`,
    )
    return result
  } else if (activeFilter === 'admin') {
    const result = badges.admin === true
    console.log(
      `    🔧 Admin filter: badges.admin (${badges.admin}) === true → ${result}`,
    )
    return result
  }

  console.log(`    ❓ Unknown filter, defaulting to true`)
  return true
}

/**
 * Show all sidebar items with correct selectors
 */
function showAllSidebarItems() {
  const allSidebarItems = document.querySelectorAll(
    '.theme-doc-sidebar-item-link, .menu__list-item, [class*="sidebar-item"]',
  )

  allSidebarItems.forEach(item => {
    item.style.display = ''
  })

  const allCategories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category, [class*="sidebar-category"]',
  )

  allCategories.forEach(category => {
    category.style.display = ''
  })

  console.log(`✅ All ${allSidebarItems.length} sidebar items now visible`)
}

/**
 * Hide categories with correct selectors
 */
function hideEmptyCategories() {
  const categories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category, [class*="sidebar-category"]',
  )

  categories.forEach(category => {
    const visibleChildren = category.querySelectorAll(
      '.theme-doc-sidebar-item-link:not([style*="display: none"]), .menu__list-item:not([style*="display: none"])',
    )

    if (visibleChildren.length === 0) {
      category.style.display = 'none'
      console.log('📁 Hiding empty category:', category.textContent?.trim())
    } else {
      category.style.display = ''
    }
  })
}

/**
 * Get count of filtered pages for display
 */
export async function getFilteredPageCount() {
  const activeFilter = getFilterFromURL()

  if (activeFilter === 'none' || activeFilter === 'both') {
    return null
  }

  const filterableData = await loadFilterableData()

  const visiblePages = filterableData.filter(page => {
    if (!page.badges) return true
    return shouldPageBeVisible(page.badges, activeFilter)
  })

  return visiblePages.length
}

/**
 * Initialize filtering on page load
 */
export function initializeSimpleFiltering() {
  console.log('🚀 Initializing simple filtering system')
  console.log('📍 Current URL:', window.location.href)
  console.log('🔍 Current filter from URL:', getFilterFromURL())

  setTimeout(() => {
    applySimpleFiltering()
  }, 300)
}
