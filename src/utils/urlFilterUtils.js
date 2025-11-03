// src/utils/urlFilterUtils.js - ROBUST PERSISTENCE VERSION
/**
 * Robust filtering with comprehensive link persistence
 * Uses mutation observer to catch dynamically generated links
 */

// Cache for filter lists
let filterLists = null
let currentFilter = 'none'
let linkObserver = null

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
 * Set filter in URL and start persistent link updating
 */
export function setFilterInURL(filterType) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location)
  currentFilter = filterType

  console.log('🔗 Setting filter:', filterType)

  // Update current page URL
  if (
    filterType === 'user' ||
    filterType === 'admin' ||
    filterType === 'both'
  ) {
    url.searchParams.set('filter', filterType)
  } else {
    url.searchParams.delete('filter')
  }

  window.history.replaceState({}, '', url.toString())

  // Start comprehensive link persistence
  startLinkPersistence(filterType)

  // Apply sidebar filtering
  setTimeout(() => {
    applySimpleFiltering()
  }, 50)
}

/**
 * COMPREHENSIVE PERSISTENCE: Update all links and watch for new ones
 */
function startLinkPersistence(filterType) {
  console.log('🔄 Starting comprehensive link persistence for:', filterType)

  // Stop any existing observer
  if (linkObserver) {
    linkObserver.disconnect()
  }

  // Update all existing links immediately
  updateAllLinks(filterType)

  // Set up mutation observer to catch new links
  if (filterType !== 'none') {
    linkObserver = new MutationObserver(mutations => {
      let hasNewLinks = false

      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the new node contains links
              const newLinks = node.querySelectorAll
                ? node.querySelectorAll('a[href*="rita-go"]')
                : []
              if (
                newLinks.length > 0 ||
                (node.tagName === 'A' &&
                  node.href &&
                  node.href.includes('rita-go'))
              ) {
                hasNewLinks = true
              }
            }
          })
        }

        // Also check for attribute changes on existing links
        if (
          mutation.type === 'attributes' &&
          mutation.target.tagName === 'A' &&
          mutation.attributeName === 'href'
        ) {
          const href = mutation.target.getAttribute('href')
          if (href && href.includes('rita-go')) {
            hasNewLinks = true
          }
        }
      })

      if (hasNewLinks) {
        console.log('🔄 New links detected, updating...')
        updateAllLinks(currentFilter)
      }
    })

    // Start observing
    linkObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    })

    console.log('👁️ Started watching for new links')
  }
}

/**
 * Update ALL links comprehensively
 */
function updateAllLinks(filterType) {
  // SUPER COMPREHENSIVE selector - catch everything
  const selectors = [
    'a[href*="/rita-go"]', // Any link containing rita-go
    'a[href^="/rita-go"]', // Links starting with /rita-go
    '.menu__link', // Sidebar menu links
    '.navbar__item a', // Navbar links
    '.pagination-nav a', // Pagination links
    '.table-of-contents a', // TOC links
    '[class*="sidebar"] a', // Any sidebar links
    '[class*="menu"] a', // Any menu links
    'nav a', // Any nav links
    '.theme-doc-sidebar-item-link a', // Docusaurus sidebar links
  ]

  let totalUpdated = 0

  selectors.forEach(selector => {
    try {
      const links = document.querySelectorAll(selector)
      let selectorUpdated = 0

      links.forEach(link => {
        const currentHref = link.getAttribute('href')
        if (!currentHref || !currentHref.includes('rita-go')) return

        try {
          let newHref

          if (currentHref.startsWith('http')) {
            // Absolute URL
            const url = new URL(currentHref)
            url.searchParams.delete('filter')
            if (filterType !== 'none') {
              url.searchParams.set('filter', filterType)
            }
            newHref = url.toString()
          } else {
            // Relative URL
            const url = new URL(currentHref, window.location.origin)
            url.searchParams.delete('filter')
            if (filterType !== 'none') {
              url.searchParams.set('filter', filterType)
            }
            newHref = url.pathname + url.search + url.hash
          }

          if (newHref !== currentHref) {
            link.setAttribute('href', newHref)
            selectorUpdated++
            totalUpdated++
          }
        } catch (error) {
          // Fallback for problematic URLs
          if (currentHref.includes('rita-go')) {
            let cleanHref = currentHref.split('?')[0]
            if (filterType !== 'none') {
              cleanHref += `?filter=${filterType}`
            }
            if (cleanHref !== currentHref) {
              link.setAttribute('href', cleanHref)
              selectorUpdated++
              totalUpdated++
            }
          }
        }
      })

      if (selectorUpdated > 0) {
        console.log(`  📎 ${selector}: ${selectorUpdated} links updated`)
      }
    } catch (error) {
      console.warn(`Could not process selector ${selector}:`, error)
    }
  })

  console.log(`✅ Total links updated: ${totalUpdated}`)

  // Also set up click interceptor for any missed links
  if (filterType !== 'none') {
    setupClickInterceptor(filterType)
  }
}

/**
 * Backup: Intercept clicks on rita-go links and add filter if missing
 */
function setupClickInterceptor(filterType) {
  // Remove any existing interceptor
  document.removeEventListener('click', handleLinkClick)

  function handleLinkClick(event) {
    const link = event.target.closest('a')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || !href.includes('rita-go')) return

    // Check if filter is missing
    if (!href.includes('filter=')) {
      event.preventDefault()

      let newHref
      try {
        const url = new URL(href, window.location.origin)
        url.searchParams.set('filter', filterType)
        newHref = url.toString()
      } catch (error) {
        newHref = href + `?filter=${filterType}`
      }

      console.log(`🔄 Intercepted click, adding filter: ${href} → ${newHref}`)
      window.location.href = newHref
    }
  }

  document.addEventListener('click', handleLinkClick)
  console.log('🎯 Click interceptor activated')
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
 * Load pre-computed filter lists from JSON
 */
async function loadFilterLists() {
  if (filterLists) return filterLists

  try {
    const response = await fetch('/data/filterableData.json')
    if (!response.ok) {
      console.warn('Could not load filterable data:', response.status)
      return null
    }
    const data = await response.json()
    filterLists = data.filterLists
    console.log('📋 Loaded filter lists')
    return filterLists
  } catch (error) {
    console.error('Failed to load filter lists:', error)
    return null
  }
}

/**
 * Apply filtering with fixed category URL support
 */
export async function applySimpleFiltering() {
  if (typeof window === 'undefined') return

  const activeFilter = getFilterFromURL()
  currentFilter = activeFilter
  console.log('🎯 Applying filtering, filter:', activeFilter)

  // Load pre-computed filter lists
  const lists = await loadFilterLists()
  if (!lists) {
    console.error('❌ Could not load filter lists')
    return
  }

  // Get the list of URLs to show for current filter
  let urlsToShow = []

  if (activeFilter === 'admin') {
    urlsToShow = lists.adminFilter.map(item => item.url)
  } else if (activeFilter === 'user') {
    urlsToShow = lists.userFilter.map(item => item.url)
  } else {
    urlsToShow = lists.noFilter.map(item => item.url)
  }

  console.log(
    `📋 Filter '${activeFilter}' should show ${urlsToShow.length} items`,
  )

  // Apply to sidebar
  const sidebarLinks = document.querySelectorAll('.menu__link')
  let visibleCount = 0
  let hiddenCount = 0

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href')
    const sidebarItem =
      link.closest('.theme-doc-sidebar-item-link') ||
      link.closest('[class*="sidebar-item"]') ||
      link.closest('.menu__list-item')

    if (href && sidebarItem) {
      const cleanHref = stripQueryParams(href)
      const shouldShow = urlsToShow.includes(cleanHref)

      if (shouldShow) {
        sidebarItem.style.display = ''
        visibleCount++
      } else {
        sidebarItem.style.display = 'none'
        hiddenCount++
      }
    }
  })

  hideEmptyCategories()

  console.log(
    `🎨 Filtering complete: ${visibleCount} visible, ${hiddenCount} hidden`,
  )

  // Restart link persistence after filtering
  if (activeFilter !== 'none') {
    setTimeout(() => {
      updateAllLinks(activeFilter)
    }, 100)
  }
}

/**
 * Hide empty sidebar categories
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

  const lists = await loadFilterLists()
  if (!lists) return null

  if (activeFilter === 'admin') {
    return lists.adminFilter.length
  } else if (activeFilter === 'user') {
    return lists.userFilter.length
  }

  return null
}

/**
 * Initialize filtering with robust persistence
 */
export function initializeSimpleFiltering() {
  console.log('🚀 Initializing robust filtering with persistence')

  const activeFilter = getFilterFromURL()
  currentFilter = activeFilter

  // Start persistence if filter is active
  if (activeFilter !== 'none') {
    console.log('🔗 Filter active, starting comprehensive persistence')
    startLinkPersistence(activeFilter)
  }

  // Apply sidebar filtering
  setTimeout(() => {
    applySimpleFiltering()
  }, 300)
}
