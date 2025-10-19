// src/utils/globalFilterState.js - FINAL SIMPLIFIED DATA-BASED VERSION - FIXED
/**
 * Simplified global filter state using pre-generated filterable data
 */

/**
 * Initialize global filter state if it doesn't exist
 */
export function initializeGlobalFilterState() {
  if (typeof window === 'undefined') return null

  if (!window.globalFilterState) {
    window.globalFilterState = {
      filters: {
        role: 'all',
        plans: ['trial'],
      },
      filterableData: [],
      visibleUrls: new Set(),
    }
    console.log('🚀 Initializing new global filter state')
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

  // Check if filters are active
  const hasActiveFilters =
    (filters.role && filters.role !== 'all') ||
    (filters.plans &&
      filters.plans.length > 0 &&
      !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

  console.log(
    '🎨 Has active filters:',
    hasActiveFilters,
    `(role: ${filters.role})`,
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

  console.log(
    '🎨 Removing all filtering, found',
    allSidebarItems.length,
    'sidebar items',
  )

  // Remove filtering classes from all items
  allSidebarItems.forEach(item => {
    item.classList.remove('sidebar-filtered-hidden')
  })

  // Remove filtering classes from all categories
  allCategories.forEach(category => {
    category.classList.remove('sidebar-filtered-hidden')
  })

  console.log('🎨 CSS removal summary: All items and categories now visible')
  console.log('✅ CSS filtering removal complete')
}

/**
 * Apply CSS classes based on which URLs should be visible
 */
function applyCSSBasedOnVisibleUrls(visibleUrls) {
  // Wait longer for DOM to be fully updated, then apply filtering
  setTimeout(() => {
    // STEP 1: ALWAYS RESET EVERYTHING TO VISIBLE FIRST
    console.log('🔄 Resetting all items to visible first...')

    // Find ALL elements with our filtering class and remove it
    const allFilteredElements = document.querySelectorAll(
      '.sidebar-filtered-hidden',
    )
    allFilteredElements.forEach(element => {
      element.classList.remove('sidebar-filtered-hidden')
    })

    console.log('✅ Reset complete - all items now visible')

    // STEP 2: AGGRESSIVE SEARCH FOR ALL SIDEBAR LINKS
    console.log('🔍 AGGRESSIVE DEBUG: Searching for ALL sidebar links...')

    // Try multiple search strategies
    const searchStrategies = [
      () => document.querySelectorAll('a[href^="/rita-go/"]'),
      () => document.querySelectorAll('a[href*="rita-go"]'),
      () => document.querySelectorAll('.theme-doc-sidebar-menu a'),
      () => document.querySelectorAll('[class*="sidebar"] a'),
      () => document.querySelectorAll('nav a'),
      () => document.querySelectorAll('a'), // ALL links
    ]

    let allFoundLinks = new Set()

    searchStrategies.forEach((strategy, index) => {
      const links = strategy()
      console.log(`Strategy ${index + 1}: Found ${links.length} links`)

      links.forEach(link => {
        const href = link.getAttribute('href')
        if (href && href.includes('rita-go')) {
          allFoundLinks.add(link)
          console.log(
            `  📄 ${href} "${link.textContent?.trim()?.substring(0, 50)}..."`,
          )
        }
      })
    })

    console.log(`🎯 Total unique Rita Go links found: ${allFoundLinks.size}`)

    // Convert Set back to Array
    const allSidebarLinks = Array.from(allFoundLinks)

    // STEP 3: APPLY FILTERING TO ALL FOUND LINKS
    let hiddenCount = 0
    let visibleCount = 0

    allSidebarLinks.forEach(linkElement => {
      const href = linkElement.getAttribute('href')

      // ALWAYS show category and tag pages - they should never be filtered
      const isCategoryOrTag =
        href.includes('/category/') || href.includes('/tags/')
      const shouldBeVisible = isCategoryOrTag || visibleUrls.has(href)

      // Find the container to hide/show - try multiple container types
      const possibleContainers = [
        linkElement.closest('.theme-doc-sidebar-item-link'),
        linkElement.closest('[class*="sidebar-item"]'),
        linkElement.closest('li'),
        linkElement.closest('[class*="menu__list-item"]'),
        linkElement.closest('[class*="menu-item"]'),
        linkElement.parentElement,
      ].filter(Boolean)

      const containerElement = possibleContainers[0]

      if (containerElement) {
        if (shouldBeVisible) {
          // Already visible from reset, just count it
          visibleCount++
          console.log(
            `👁️ Showing: ${href}${isCategoryOrTag ? ' (category/tag)' : ''}`,
          )
        } else {
          containerElement.classList.add('sidebar-filtered-hidden')
          hiddenCount++
          console.log(`🚫 Hiding: ${href}`)
        }
      } else {
        console.log(`⚠️ No container found for: ${href}`)
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
  }, 500) // Wait 500ms for DOM to stabilize (increased from 100ms)
}

/**
 * Check if page should be visible based on badge data
 */
function shouldShowPage(badges, filters) {
  if (!badges) return true // Pages without badges are always visible

  // Role filtering
  if (filters.role === 'users') {
    if (!badges.users) {
      return false
    }
  } else if (filters.role === 'admin') {
    if (!badges.admin) {
      return false
    }
  }

  // Plan filtering - FIXED: Only apply if plan filters are actually active
  // Skip plan filtering when only 'trial' is selected (same logic as hasActiveFilters)
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

  const hasActiveFilters =
    (filters.role && filters.role !== 'all') ||
    (filters.plans &&
      filters.plans.length > 0 &&
      !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

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
