// src/utils/urlFilterUtils.js - HYBRID SYSTEM WITH ORIGINAL DOM MANIPULATION
/**
 * Hybrid URL parameter + original DOM manipulation system
 */

/**
 * Get current filter from URL parameter
 */
export function getFilterFromURL() {
  if (typeof window === 'undefined') return null

  const urlParams = new URLSearchParams(window.location.search)
  const filter = urlParams.get('filter')

  if (filter === 'user' || filter === 'admin') {
    return filter
  }

  return null // Show all content
}

/**
 * Set filter in URL parameter using history.pushState
 */
export function setFilterInURL(filterType) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location)

  if (filterType && (filterType === 'user' || filterType === 'admin')) {
    url.searchParams.set('filter', filterType)
  } else {
    url.searchParams.delete('filter')
  }

  // Use pushState for smooth navigation without reload
  window.history.pushState({}, '', url.toString())

  // Manually trigger filtering since we're not reloading
  setTimeout(() => {
    applyFilteringToSidebar()
  }, 100)
}

/**
 * Convert URL parameter to filter state (like original system)
 */
function getFilterStateFromURL() {
  const activeFilter = getFilterFromURL()

  if (activeFilter === 'user') {
    return { users: true, admin: false }
  } else if (activeFilter === 'admin') {
    return { users: false, admin: true }
  } else {
    return { users: true, admin: true } // Both on = show all
  }
}

/**
 * Load filterable data (like original system)
 */
export async function loadFilterableData() {
  try {
    // Load the full filterable data like the original system
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
 * Check if page should be visible (using original logic)
 */
function shouldShowPage(badges, filters) {
  if (!badges) return true // Pages without badges are always visible

  // User role filtering with boolean toggles (original logic)
  const hasUserBadge = badges.users
  const hasAdminBadge = badges.admin

  // If page has user content and users toggle is off, hide it
  if (hasUserBadge && !filters.users) {
    return false
  }

  // If page has admin content and admin toggle is off, hide it
  if (hasAdminBadge && !filters.admin) {
    return false
  }

  // If page has ONLY user content and user toggle is off, hide it
  // If page has ONLY admin content and admin toggle is off, hide it
  // If page has both user and admin content, show if either toggle is on
  if (hasUserBadge && hasAdminBadge) {
    // Page has both - show if either toggle is on
    return filters.users || filters.admin
  } else if (hasUserBadge) {
    // Page has only user content - show only if users toggle is on
    return filters.users
  } else if (hasAdminBadge) {
    // Page has only admin content - show only if admin toggle is on
    return filters.admin
  }

  return true
}

/**
 * Apply filtering to sidebar (using original working DOM manipulation)
 */
export async function applyFilteringToSidebar() {
  if (typeof window === 'undefined') return

  const filters = getFilterStateFromURL()
  const filterableData = await loadFilterableData()

  console.log('🎯 Applying sidebar filtering with filters:', filters)
  console.log('📋 Filterable data loaded:', filterableData.length, 'pages')

  // Check if filters are active (any toggle is off)
  const hasActiveFilters = !filters.users || !filters.admin

  console.log(
    '🎨 Has active filters:',
    hasActiveFilters,
    `(users: ${filters.users}, admin: ${filters.admin})`,
  )

  if (!hasActiveFilters) {
    // No filters active - show everything (ORIGINAL LOGIC)
    console.log(
      '✅ No active filters, removing all filtering and showing everything',
    )
    applyCSSShowAll()
    return
  }

  // Filter the data (ORIGINAL LOGIC)
  const visiblePages = filterableData.filter(
    page => !page.hasFiltering || shouldShowPage(page.badges, filters),
  )
  const visibleUrls = new Set(visiblePages.map(page => page.url))

  console.log('🔍 Filtered data results:')
  console.log('  - Total pages:', filterableData.length)
  console.log('  - Visible pages:', visiblePages.length)
  console.log('  - Hidden pages:', filterableData.length - visiblePages.length)

  visiblePages.forEach(page => {
    console.log(`  ✅ Visible: ${page.url} (${page.title})`)
  })

  const hiddenPages = filterableData.filter(
    page => page.hasFiltering && !shouldShowPage(page.badges, filters),
  )
  hiddenPages.forEach(page => {
    console.log(`  🚫 Hidden: ${page.url} (${page.title})`)
  })

  // Apply CSS to DOM based on visible URLs (ORIGINAL WORKING METHOD)
  applyCSSBasedOnVisibleUrls(visibleUrls)
}

/**
 * Remove all filtering and show everything (ORIGINAL FUNCTION)
 */
function applyCSSShowAll() {
  // Find all sidebar items and remove any filtering classes
  const allSidebarItems = document.querySelectorAll(
    '.theme-doc-sidebar-item, [class*="sidebar-item"]',
  )

  const allCategories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category',
  )

  console.log('🎨 Showing all items - removing filtering classes')

  allSidebarItems.forEach(item => {
    item.classList.remove('sidebar-filtered-hidden')
  })

  allCategories.forEach(category => {
    category.classList.remove('sidebar-filtered-hidden')
  })

  console.log('✅ All filtering removed, everything visible')
}

/**
 * Apply CSS to DOM based on visible URLs (ORIGINAL WORKING FUNCTION)
 */
function applyCSSBasedOnVisibleUrls(visibleUrls) {
  // Wait for DOM to be ready
  setTimeout(() => {
    console.log('🎨 Applying CSS based on visible URLs...')

    // First, remove all existing filtering classes
    const allSidebarItems = document.querySelectorAll(
      '.theme-doc-sidebar-item, [class*="sidebar-item"]',
    )
    allSidebarItems.forEach(item => {
      item.classList.remove('sidebar-filtered-hidden')
    })

    // Find all sidebar links and apply filtering (ORIGINAL SELECTORS)
    const sidebarLinks = document.querySelectorAll(
      '.theme-doc-sidebar-item-link, a[class*="sidebarItemLink"]',
    )

    let visibleCount = 0
    let hiddenCount = 0

    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href')
      if (href) {
        // Find the container element (ORIGINAL LOGIC)
        const containerElement =
          link.closest('.theme-doc-sidebar-item') ||
          link.closest('[class*="sidebar-item"]')

        if (containerElement) {
          if (visibleUrls.has(href)) {
            containerElement.classList.remove('sidebar-filtered-hidden')
            visibleCount++
            console.log(
              `✅ Showing: ${href} ${
                link.textContent ? `(${link.textContent.trim()})` : ''
              }`,
            )
          } else {
            containerElement.classList.add('sidebar-filtered-hidden')
            hiddenCount++
            console.log(`🚫 Hiding: ${href}`)
          }
        } else {
          console.log(`⚠️ No container found for: ${href}`)
        }
      }
    })

    // Hide empty categories after filtering (ORIGINAL LOGIC)
    const allCategories = document.querySelectorAll(
      '.theme-doc-sidebar-item-category',
    )
    allCategories.forEach(category => {
      const visibleLinks = category.querySelectorAll(
        ':not(.sidebar-filtered-hidden)',
      )
      if (visibleLinks.length === 0) {
        category.classList.add('sidebar-filtered-hidden')
        hiddenCount++
      }
    })

    console.log('🎨 CSS application summary:')
    console.log(`  - Links visible: ${visibleCount}`)
    console.log(`  - Links hidden: ${hiddenCount}`)
    console.log('✅ CSS filtering complete')
  }, 500) // Wait 500ms for DOM to stabilize (ORIGINAL TIMING)
}

/**
 * Get count of filtered pages for display
 */
export async function getFilteredPageCount() {
  const activeFilter = getFilterFromURL()

  if (!activeFilter) {
    return null // No filter active - show "All content"
  }

  const filterableData = await loadFilterableData()
  const filters = getFilterStateFromURL()

  const visiblePages = filterableData.filter(
    page => !page.hasFiltering || shouldShowPage(page.badges, filters),
  )

  return visiblePages.length
}

/**
 * Initialize filtering on page load
 */
export function initializePageFiltering() {
  // Apply filtering after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(applyFilteringToSidebar, 500)
    })
  } else {
    setTimeout(applyFilteringToSidebar, 500)
  }
}
