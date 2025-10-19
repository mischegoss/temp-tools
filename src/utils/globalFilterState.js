// src/utils/globalFilterState.js - SIMPLIFIED VERSION
/**
 * Simplified global filter state management using existing badge system
 */

/**
 * Initialize global filter state if it doesn't exist
 */
export function initializeGlobalFilterState() {
  if (typeof window === 'undefined') return null

  if (!window.globalFilterState) {
    window.globalFilterState = {
      // Current filter settings
      filters: {
        role: 'all',
        plans: ['trial'],
        showUnavailable: false,
      },

      // Component callbacks
      setFilters: null,
      filterChangeCallbacks: new Set(),

      // Existing badge data (already working)
      pagesBadgeData: new Map(),
      updatePageBadges: null,
    }
  }

  return window.globalFilterState
}

/**
 * Get current filter state
 */
export function getCurrentFilters() {
  const state = initializeGlobalFilterState()
  return state
    ? state.filters
    : { role: 'all', plans: ['trial'], showUnavailable: false }
}

/**
 * Update filter state and apply CSS filtering
 */
export function updateFilters(newFilters) {
  const state = initializeGlobalFilterState()
  if (!state) return

  // Update filters
  state.filters = { ...state.filters, ...newFilters }

  // Apply CSS-based filtering
  applyCSSFiltering(state.filters)

  // Notify filter change callbacks
  state.filterChangeCallbacks.forEach(callback => {
    try {
      callback()
    } catch (error) {
      console.error('Error in filter change callback:', error)
    }
  })
}

/**
 * Apply CSS-based filtering to sidebar items
 */
function applyCSSFiltering(filters) {
  if (typeof window === 'undefined') return

  const state = window.globalFilterState

  // Check if any meaningful filters are active
  const hasActiveFilters =
    (filters.role && filters.role !== 'all') ||
    (filters.plans &&
      filters.plans.length > 0 &&
      !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

  // If no active filters, show everything (remove all hidden classes)
  if (!hasActiveFilters) {
    document.querySelectorAll('.sidebar-filtered-hidden').forEach(el => {
      el.classList.remove('sidebar-filtered-hidden')
    })
    return
  }

  // If active filters are applied, we need to check ALL sidebar items
  // not just those with badge data
  const allSidebarItems = document.querySelectorAll(
    '.theme-doc-sidebar-item-link',
  )

  allSidebarItems.forEach(linkElement => {
    const href = linkElement.getAttribute('href')
    if (!href) return

    // Check if this page has badge data
    const pageData = findPageDataByHref(href, state)

    if (pageData) {
      // Page has badge data - apply filtering
      const shouldShow = checkPageVisibility(pageData, filters)
      const itemElement = linkElement.closest('.theme-doc-sidebar-item')

      if (itemElement) {
        if (shouldShow) {
          itemElement.classList.remove('sidebar-filtered-hidden')
        } else {
          itemElement.classList.add('sidebar-filtered-hidden')
        }
      }
    } else {
      // Page has NO badge data - always show it (default behavior)
      const itemElement = linkElement.closest('.theme-doc-sidebar-item')
      if (itemElement) {
        itemElement.classList.remove('sidebar-filtered-hidden')
      }
    }
  })
}

/**
 * Find page data by href from the badge data
 */
function findPageDataByHref(href, state) {
  if (!state || !state.pagesBadgeData.size) return null

  // Try to match the href with registered page URLs
  for (const [pageUrl, pageData] of state.pagesBadgeData.entries()) {
    // Clean up URLs for comparison
    const cleanHref = href.replace(/^\/+|\/+$/g, '')
    const cleanPageUrl = pageUrl.replace(/^\/+|\/+$/g, '')

    if (
      cleanHref === cleanPageUrl ||
      href.includes(cleanPageUrl) ||
      pageUrl.includes(cleanHref)
    ) {
      return pageData
    }
  }

  return null
}

/**
 * Check if a page should be visible based on filters
 */
function checkPageVisibility(pageData, filters) {
  // Role filtering
  if (filters.role === 'users' && !pageData.users) return false
  if (filters.role === 'admin' && !pageData.admin) return false

  // Plan filtering
  if (filters.plans && filters.plans.length > 0) {
    const hasMatchingPlan = filters.plans.some(plan => pageData[plan])
    if (!hasMatchingPlan) return false
  }

  return true
}

/**
 * Find sidebar link element for a given page URL
 */
function findSidebarLinkElement(pageUrl) {
  // Clean up the URL to match what appears in hrefs
  const cleanUrl = pageUrl.replace(/^\/+|\/+$/g, '')

  // Try different URL patterns that might appear in the sidebar
  const patterns = [
    `[href="/${cleanUrl}"]`,
    `[href="${cleanUrl}"]`,
    `[href*="${cleanUrl}"]`,
  ]

  for (const pattern of patterns) {
    const element = document.querySelector(
      `.theme-doc-sidebar-item-link${pattern}`,
    )
    if (element) return element.closest('.theme-doc-sidebar-item')
  }

  return null
}

/**
 * Register a callback for filter changes
 */
export function onFilterChange(callback) {
  const state = initializeGlobalFilterState()
  if (!state) return () => {}

  state.filterChangeCallbacks.add(callback)

  return () => {
    state.filterChangeCallbacks.delete(callback)
  }
}

/**
 * Register page badge data (existing functionality)
 */
export function registerPageBadge(url, badgeData) {
  const state = initializeGlobalFilterState()
  if (!state) return

  state.pagesBadgeData.set(url, {
    ...badgeData,
    url,
    timestamp: Date.now(),
  })
}

/**
 * Get all registered page badge data
 */
export function getPageBadgeData() {
  const state = initializeGlobalFilterState()
  return state ? state.pagesBadgeData : new Map()
}
