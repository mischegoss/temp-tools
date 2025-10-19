// src/utils/globalFilterState.js - SIMPLIFIED VERSION
/**
 * Minimal global filter state for static badge data
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
      badgeData: new Map(),
    }
  }

  return window.globalFilterState
}

/**
 * Set badge data from JSON
 */
export function setBadgeData(badgeDataObject) {
  const state = initializeGlobalFilterState()
  if (!state) return

  state.badgeData.clear()
  Object.entries(badgeDataObject).forEach(([url, badges]) => {
    state.badgeData.set(url, { ...badges, url })
  })
}

/**
 * Get all badge data
 */
export function getBadgeData() {
  const state = initializeGlobalFilterState()
  return state ? state.badgeData : new Map()
}

/**
 * Update filters and apply to DOM
 */
export function updateFilters(newFilters) {
  const state = initializeGlobalFilterState()
  if (!state) return

  state.filters = { ...state.filters, ...newFilters }
  applyCSSFiltering(state.filters, state.badgeData)
}

/**
 * Apply CSS filtering to sidebar items
 */
function applyCSSFiltering(filters, badgeData) {
  if (typeof window === 'undefined') return

  // Get all sidebar items
  const allSidebarItems = document.querySelectorAll(
    '.theme-doc-sidebar-item-link',
  )
  const allCategories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category',
  )

  // Reset: show everything first
  allSidebarItems.forEach(linkElement => {
    const itemElement = linkElement.closest('.theme-doc-sidebar-item')
    if (itemElement) {
      itemElement.classList.remove('sidebar-filtered-hidden')
    }
  })

  allCategories.forEach(category => {
    category.classList.remove('sidebar-filtered-hidden')
  })

  // Check if filters are active
  const hasActiveFilters =
    (filters.role && filters.role !== 'all') ||
    (filters.plans &&
      filters.plans.length > 0 &&
      !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

  // If no active filters, we're done
  if (!hasActiveFilters) return

  // Apply filtering
  allSidebarItems.forEach(linkElement => {
    const href = linkElement.getAttribute('href')
    if (!href) return

    const pageData = findPageDataByHref(href, badgeData)
    if (pageData && !shouldShowPage(pageData, filters)) {
      const itemElement = linkElement.closest('.theme-doc-sidebar-item')
      if (itemElement) {
        itemElement.classList.add('sidebar-filtered-hidden')
      }
    }
  })

  // Hide empty categories
  allCategories.forEach(category => {
    const visibleLinks = category.querySelectorAll(
      '.theme-doc-sidebar-item-link:not(.sidebar-filtered-hidden)',
    )
    if (visibleLinks.length === 0) {
      category.classList.add('sidebar-filtered-hidden')
    }
  })
}

/**
 * Find page data by href
 */
function findPageDataByHref(href, badgeData) {
  const cleanHref = href.replace(/^\/+|\/+$/g, '')

  for (const [pageUrl, pageData] of badgeData.entries()) {
    const cleanPageUrl = pageUrl.replace(/^\/+|\/+$/g, '')
    if (cleanHref === cleanPageUrl || href.includes(cleanPageUrl)) {
      return pageData
    }
  }
  return null
}

/**
 * Check if page should be visible
 */

function shouldShowPage(pageData, filters) {
  // Role filtering - FIXED LOGIC
  if (filters.role === 'users') {
    // When "Users" is selected, only show pages that have users=true
    if (!pageData.users) return false
  } else if (filters.role === 'admin') {
    // When "Admin" is selected, only show pages that have admin=true  
    if (!pageData.admin) return false
  }
  // When "All" is selected, show regardless of user/admin flags

  // Plan filtering
  if (filters.plans && filters.plans.length > 0) {
    const hasMatchingPlan = filters.plans.some(plan => pageData[plan])
    if (!hasMatchingPlan) return false
  }

  return true
}

/**
 * Count filtered pages
 */
export function countFilteredPages(filters) {
  const badgeData = getBadgeData()
  if (badgeData.size === 0) return null

  const hasActiveFilters =
    (filters.role && filters.role !== 'all') ||
    (filters.plans &&
      filters.plans.length > 0 &&
      !(filters.plans.length === 1 && filters.plans[0] === 'trial'))

  if (!hasActiveFilters) return null

  const allPages = Array.from(badgeData.values())
  const filteredPages = allPages.filter(page => shouldShowPage(page, filters))
  return filteredPages.length
}
