// src/utils/globalFilterState.js - UPDATED FOR BOOLEAN TOGGLES WITH PRODUCT FILTERING READY
/**
 * Global filter state using pre-generated filterable data with simplified boolean toggles
 */

/**
 * Initialize global filter state if it doesn't exist
 */
export function initializeGlobalFilterState() {
  if (typeof window === 'undefined') return null

  if (!window.globalFilterState) {
    window.globalFilterState = {
      filters: {
        users: true,
        admin: false,
        // TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available
        // plans: ['trial'],
      },
      filterableData: [],
      visibleUrls: new Set(),
    }
    console.log('🚀 Initializing new global filter state with boolean toggles')
  }

  return window.globalFilterState
}

/**
 * Set filterable data from JSON
 */
export function setFilterableData(filterableDataArray) {
  const state = initializeGlobalFilterState()
  if (!state) return

  state.filterableData = filterableDataArray

  console.log(
    '📋 setFilterableData called with',
    filterableDataArray.length,
    'entries',
  )
  console.log('📋 Filterable data loaded:', filterableDataArray.length, 'pages')
  console.log(
    '📊 Pages with filtering:',
    filterableDataArray.filter(page => page.hasFiltering).length,
  )
}

/**
 * Update filters and apply to DOM
 */
export function updateFilters(newFilters) {
  const state = initializeGlobalFilterState()
  if (!state) return

  console.log('🎯 Global updateFilters called with:', newFilters)
  state.filters = { ...state.filters, ...newFilters }
  console.log('🎯 Global state updated to:', state.filters)
  console.log('🎯 Filterable data size:', state.filterableData.length)

  // Filter the data and apply CSS
  applyDataBasedFiltering(state.filters, state.filterableData)
}

/**
 * Apply filtering based on data instead of DOM manipulation
 */
function applyDataBasedFiltering(filters, filterableData) {
  if (typeof window === 'undefined') return

  console.log('🎨 applyDataBasedFiltering called with filters:', filters)
  console.log('🎨 Filterable data size:', filterableData.length)

  // Check if filters are active (any toggle is off or product filters are applied)
  const hasActiveFilters = !filters.users || !filters.admin
  // TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available
  // || (filters.plans && filters.plans.length > 0 && !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

  console.log(
    '🎨 Has active filters:',
    hasActiveFilters,
    `(users: ${filters.users}, admin: ${filters.admin})`,
  )

  if (!hasActiveFilters) {
    // No filters active - show everything by removing all filtering
    console.log(
      '✅ No active filters, removing all filtering and showing everything',
    )
    applyCSSShowAll()
    return
  }

  // Filter the data
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

  // Store visible URLs in global state
  const state = initializeGlobalFilterState()
  state.visibleUrls = visibleUrls

  // Apply CSS to DOM based on visible URLs
  applyCSSBasedOnVisibleUrls(visibleUrls)
}

/**
 * Remove all filtering and show everything (used when no filters are active)
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
 * Apply CSS to DOM based on visible URLs
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

    // Find all sidebar links and apply filtering
    const sidebarLinks = document.querySelectorAll(
      '.theme-doc-sidebar-item-link, a[class*="sidebarItemLink"]',
    )

    let visibleCount = 0
    let hiddenCount = 0

    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href')
      if (href) {
        // Find the container element (usually the parent with the sidebar item class)
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

    // Hide empty categories after filtering
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
  }, 500) // Wait 500ms for DOM to stabilize
}

/**
 * Check if page should be visible based on badge data and boolean toggles
 */
function shouldShowPage(badges, filters) {
  if (!badges) return true // Pages without badges are always visible

  // User role filtering with boolean toggles
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

  // TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available
  /*
  // Plan filtering - only apply if plan filters are actually active
  // Skip plan filtering when only 'trial' is selected (default state)
  const hasActivePlanFilters =
    filters.plans &&
    filters.plans.length > 0 &&
    !(filters.plans.length === 1 && filters.plans[0] === 'trial')

  if (hasActivePlanFilters) {
    const hasMatchingPlan = filters.plans.some(plan => badges[plan])
    if (!hasMatchingPlan) {
      return false
    }
  }
  */

  return true
}

/**
 * Count filtered pages using the data
 */
export function countFilteredPages(filters) {
  const state = initializeGlobalFilterState()
  const filterableData = state ? state.filterableData : []

  if (filterableData.length === 0) return null

  console.log('📊 Counting filtered pages with filters:', filters)

  const hasActiveFilters = !filters.users || !filters.admin
  // TODO: READY FOR PRODUCT FILTERING - Uncomment when additional plans become available
  // || (filters.plans && filters.plans.length > 0 && !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

  console.log('📊 Has active filters:', hasActiveFilters)

  if (!hasActiveFilters) {
    console.log('📊 No active filters, returning null (shows "All content")')
    return null
  }

  // Filter using the data
  const visiblePages = filterableData.filter(
    page => !page.hasFiltering || shouldShowPage(page.badges, filters),
  )

  console.log('📊 Total pages:', filterableData.length)
  console.log('📊 Filtered pages:', visiblePages.length)

  return visiblePages.length
}
