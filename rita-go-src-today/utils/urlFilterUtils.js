// src/utils/urlFilterUtils.js - UPDATED WITH ADMIN/OWNER NORMALIZATION
import { normalizeAdminKey } from './terminology'

/**
 * 4-state filter system with WORKING persistence: 'none', 'user', 'admin', 'both'
 * UPDATED: Now accepts both 'admin' and 'owner' in front matter
 */

/**
 * ADDED: History API Interception for comprehensive navigation capture
 */
function addFilterToUrl(url, filterType) {
  if (!url || !url.includes('rita-go') || filterType === 'none') {
    return url
  }

  try {
    const urlObj = new URL(url, window.location.origin)
    urlObj.searchParams.delete('filter')
    if (filterType !== 'none') {
      urlObj.searchParams.set('filter', filterType)
    }
    return urlObj.pathname + urlObj.search + urlObj.hash
  } catch (error) {
    // Fallback for relative URLs
    const cleanUrl = url.split('?')[0]
    return filterType !== 'none' ? cleanUrl + `?filter=${filterType}` : cleanUrl
  }
}

/**
 * ADDED: Intercept browser history API for comprehensive navigation capture
 */
function setupHistoryAPIInterception() {
  // Store original methods
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  // Intercept pushState (for navigation)
  history.pushState = function (state, title, url) {
    // Use the active filter from persistence system, not URL
    const currentFilter = window.filterPersistence?.filterType || 'none'
    if (currentFilter !== 'none' && url && url.includes('rita-go')) {
      const modifiedUrl = addFilterToUrl(url, currentFilter)
      console.log(
        '🎯 HISTORY API: Intercepted pushState:',
        url,
        '→',
        modifiedUrl,
        `(using active filter: ${currentFilter})`,
      )
      originalPushState.call(this, state, title, modifiedUrl)
    } else {
      originalPushState.call(this, state, title, url)
    }
  }

  // DON'T intercept replaceState - let filter system manage its own URL updates
  // This prevents interference with setFilterInURL() calls
  console.log('✅ History API interception setup complete (pushState only)')

  // Also intercept popstate for back/forward buttons
  window.addEventListener('popstate', function (event) {
    const currentFilter = getFilterFromURL()
    console.log('🎯 HISTORY API: Popstate detected, filter:', currentFilter)

    // Re-apply filtering after navigation
    setTimeout(() => {
      applySimpleFiltering()
      if (currentFilter !== 'none') {
        startUltraRobustPersistence(currentFilter)
      }
    }, 100)
  })
}

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
 * Set filter in URL parameter
 */
export function setFilterInURL(filterType) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location)

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

  // START AGGRESSIVE PERSISTENCE (restore working original pattern)
  startUltraRobustPersistence(filterType)

  setTimeout(() => {
    applySimpleFiltering()
  }, 50)
}

/**
 * AGGRESSIVE PERSISTENCE with optimized performance
 */
function startUltraRobustPersistence(filterType) {
  // Stop any existing persistence
  if (window.filterPersistence) {
    clearInterval(window.filterPersistence.interval)
    if (window.filterPersistence.observer) {
      window.filterPersistence.observer.disconnect()
    }
    document.removeEventListener(
      'click',
      window.filterPersistence.clickHandler,
      true,
    )
  }

  if (filterType === 'none') {
    window.filterPersistence = null
    return
  }

  // Strategy 1: Immediate comprehensive update
  updateAllLinksComprehensively(filterType)

  // Strategy 2: Less aggressive interval for better performance
  const interval = setInterval(() => {
    updateAllLinksComprehensively(filterType)
  }, 10000) // Changed from 2s to 10s for better performance

  // Strategy 3: Mutation observer for dynamic content
  const observer = new MutationObserver(mutations => {
    let shouldUpdate = false
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            // Element node
            if (
              node.tagName === 'A' ||
              node.querySelector?.('a') ||
              node.classList?.contains('menu__link')
            ) {
              shouldUpdate = true
            }
          }
        })
      }
    })

    if (shouldUpdate) {
      setTimeout(() => updateAllLinksComprehensively(filterType), 100)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Strategy 4: Click handler for immediate link updates
  const clickHandler = event => {
    // Small delay to let navigation start, then update new page links
    setTimeout(() => updateAllLinksComprehensively(filterType), 50)
  }

  document.addEventListener('click', clickHandler, true)

  // Store persistence state
  window.filterPersistence = {
    filterType,
    interval,
    observer,
    clickHandler,
  }
}

/**
 * UPDATE ALL LINKS - More comprehensive and optimized
 */
function updateAllLinksComprehensively(filterType) {
  if (typeof window === 'undefined') return 0

  let grandTotal = 0

  // Define selectors in order of priority
  const selectors = [
    'a[href*="rita-go"]', // Rita Go links
    '.menu__link', // Sidebar navigation
    '.navbar__link', // Navbar links
    'a[href^="/rita-go"]', // Relative Rita Go links
    'a[href*="/rita-go/"]', // Any Rita Go paths
  ]

  selectors.forEach(selector => {
    try {
      const links = document.querySelectorAll(selector)
      links.forEach(link => {
        const originalHref = link.getAttribute('href')
        if (originalHref) {
          let newHref
          const cleanHref = originalHref.split('?')[0]
          if (filterType !== 'none') {
            newHref = cleanHref + `?filter=${filterType}`
          } else {
            newHref = cleanHref
          }

          if (newHref !== originalHref) {
            link.setAttribute('href', newHref)
            grandTotal++
          }
        }
      })
    } catch (error) {
      // Silently skip problematic selectors
    }
  })

  return grandTotal
}

/**
 * Load filterable data with correct structure handling
 * UPDATED: Now normalizes admin/owner front matter
 */
export async function loadFilterableData() {
  try {
    const response = await fetch('/data/filterableData.json')

    if (!response.ok) {
      return []
    }

    const rawData = await response.json()

    // The file structure has allPages as the main array
    let filterableData
    if (rawData && Array.isArray(rawData.allPages)) {
      filterableData = rawData.allPages
    } else if (Array.isArray(rawData)) {
      filterableData = rawData
    } else {
      return []
    }

    // UPDATED: Normalize admin/owner keys in each item's badges
    return filterableData.map(item => {
      if (item.badges) {
        return {
          ...item,
          badges: normalizeAdminKey(item.badges),
        }
      }
      return item
    })
  } catch (error) {
    return []
  }
}

/**
 * FIXED: Smart filtering with DOM readiness check and retry mechanism
 * UPDATED: Uses normalized data but keeps same filtering logic
 */
export async function applySimpleFiltering() {
  if (typeof window === 'undefined') return

  const activeFilter = getFilterFromURL()

  // Show everything when no filter is active
  if (activeFilter === 'none' || activeFilter === 'both') {
    showAllSidebarItems()
    return
  }

  // Load the filterable data first (now normalized)
  const filterableData = await loadFilterableData()

  // DOM readiness check with retry mechanism
  let sidebarLinks = document.querySelectorAll('.menu__link')
  let retryCount = 0

  // Retry if no sidebar links found (DOM not ready)
  while (sidebarLinks.length === 0 && retryCount < 5) {
    await new Promise(resolve => setTimeout(resolve, 200)) // Wait 200ms
    sidebarLinks = document.querySelectorAll('.menu__link')
    retryCount++
  }

  // If still no links found, exit gracefully
  if (sidebarLinks.length === 0) {
    return
  }

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href')
    const sidebarItem =
      link.closest('.theme-doc-sidebar-item-link') ||
      link.closest('[class*="sidebar-item"]') ||
      link.closest('.menu__list-item')

    if (href && sidebarItem) {
      const cleanHref = stripQueryParams(href)
      const pageData = filterableData.find(item => item.url === cleanHref)

      // Always show items without filtering badges
      if (!pageData?.badges) {
        sidebarItem.style.display = ''
        return
      }

      // Check if item should be visible based on active filter
      // NOTE: Still uses 'admin' key internally after normalization
      let shouldShow = false

      if (activeFilter === 'user') {
        shouldShow = pageData.badges.users === true
      } else if (activeFilter === 'admin') {
        shouldShow = pageData.badges.admin === true
      }

      if (shouldShow) {
        sidebarItem.style.display = ''
      } else {
        sidebarItem.style.display = 'none'
      }
    }
  })

  // Always show all categories
  showAllCategories()
}

/**
 * Strip query parameters from URL for comparison
 */
function stripQueryParams(url) {
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.pathname
  } catch (error) {
    return url.split('?')[0]
  }
}

/**
 * Show all sidebar items and categories
 */
function showAllSidebarItems() {
  const allSidebarItems = document.querySelectorAll(
    '.theme-doc-sidebar-item-link, .menu__list-item, [class*="sidebar-item"]',
  )

  allSidebarItems.forEach(item => {
    item.style.display = ''
  })

  showAllCategories()
}

/**
 * Always show all categories
 */
function showAllCategories() {
  const allCategories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category, [class*="sidebar-category"]',
  )

  allCategories.forEach(category => {
    category.style.display = ''
  })
}

/**
 * Get count of filtered pages for display
 * UPDATED: Uses normalized data
 */
export async function getFilteredPageCount() {
  const activeFilter = getFilterFromURL()

  if (activeFilter === 'none' || activeFilter === 'both') {
    return null
  }

  const filterableData = await loadFilterableData()

  const visiblePages = filterableData.filter(page => {
    if (!page.badges) return true

    if (activeFilter === 'user') {
      return page.badges.users === true
    } else if (activeFilter === 'admin') {
      // NOTE: Still uses 'admin' key internally after normalization
      return page.badges.admin === true
    }

    return true
  })

  return visiblePages.length
}

/**
 * Initialize filtering with optimized performance
 */
export function initializeSimpleFiltering() {
  const activeFilter = getFilterFromURL()

  // ADDED: Setup History API interception FIRST
  setupHistoryAPIInterception()

  // CRITICAL: Start persistence if filter is active on page load
  if (activeFilter !== 'none') {
    startUltraRobustPersistence(activeFilter)
  }

  // Increased delay for better timing with build performance
  setTimeout(() => {
    applySimpleFiltering()
  }, 500) // Increased from 300ms to 500ms
}
