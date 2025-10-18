// src/utils/availabilityChecker.js
/**
 * Utility functions for checking page availability based on filters
 * Used by both sidebar filtering and search filtering
 */

/**
 * Check if a page should be visible based on current filters
 * @param {string} pageUrl - The URL/path of the page
 * @param {Object} filters - Current filter state
 * @param {Object} availabilityManifest - Availability data from plugin
 * @returns {boolean} - Whether the page should be shown
 */
export function checkAvailability(pageUrl, filters, availabilityManifest) {
  // If no filters applied or no manifest data, show everything
  if (!filters || !availabilityManifest) {
    return true
  }

  // Normalize the URL for lookup
  const normalizedUrl = normalizeUrl(pageUrl)

  // Get page availability data
  const pageData = availabilityManifest[normalizedUrl]

  // If page has no availability metadata, show it by default
  if (!pageData) {
    return true
  }

  // Check role filtering
  if (filters.role && filters.role !== 'all') {
    if (filters.role === 'users' && !pageData.users) {
      return false
    }
    if (filters.role === 'admin' && !pageData.admin) {
      return false
    }
  }

  // Check plan filtering
  if (filters.plans && filters.plans.length > 0) {
    const hasMatchingPlan = filters.plans.some(plan => pageData[plan])
    if (!hasMatchingPlan) {
      return false
    }
  }

  return true
}

/**
 * Normalize URL for consistent lookup in manifest
 * @param {string} url - Original URL
 * @returns {string} - Normalized URL
 */
export function normalizeUrl(url) {
  if (!url) return ''

  // Remove leading/trailing slashes and normalize
  let normalized = url.replace(/^\/+|\/+$/g, '')

  // Handle empty string (root)
  if (!normalized) return '/'

  // Add leading slash back
  return `/${normalized}`
}

/**
 * Get all pages that match current filters
 * @param {Object} availabilityManifest - Availability data
 * @param {Object} filters - Current filter state
 * @returns {Array} - Array of [url, pageData] pairs that match filters
 */
export function getFilteredPages(availabilityManifest, filters) {
  if (!availabilityManifest) return []

  return Object.entries(availabilityManifest).filter(([url, pageData]) => {
    return checkAvailability(url, filters, availabilityManifest)
  })
}

/**
 * Get count of pages that match current filters
 * @param {Object} availabilityManifest - Availability data
 * @param {Object} filters - Current filter state
 * @returns {number} - Count of matching pages
 */
export function getFilteredPageCount(availabilityManifest, filters) {
  return getFilteredPages(availabilityManifest, filters).length
}

/**
 * Check what filter options are available based on manifest data
 * @param {Object} availabilityManifest - Availability data
 * @returns {Object} - Available filter options
 */
export function getAvailableFilterOptions(availabilityManifest) {
  if (!availabilityManifest) {
    return {
      hasUsers: false,
      hasAdmin: false,
      hasTrial: false,
      hasPremium: false,
      hasEnterprise: false,
    }
  }

  const allPages = Object.values(availabilityManifest)

  return {
    hasUsers: allPages.some(page => page.users),
    hasAdmin: allPages.some(page => page.admin),
    hasTrial: allPages.some(page => page.trial),
    hasPremium: allPages.some(page => page.premium),
    hasEnterprise: allPages.some(page => page.enterprise),
  }
}

/**
 * Extract availability metadata from page frontmatter
 * This is used as a fallback when manifest data isn't available
 * @param {Object} frontmatter - Page frontmatter object
 * @returns {Object} - Availability data
 */
export function extractAvailabilityFromFrontmatter(frontmatter) {
  const availability = {
    users: false,
    admin: false,
    trial: false,
    premium: false,
    enterprise: false,
  }

  if (!frontmatter) return availability

  // Check for availability object
  if (frontmatter.availability) {
    Object.assign(availability, frontmatter.availability)
  }

  // Check for legacy badges object
  if (frontmatter.badges) {
    Object.assign(availability, frontmatter.badges)
  }

  // Check for individual properties
  ;['users', 'admin', 'trial', 'premium', 'enterprise'].forEach(key => {
    if (frontmatter[key] !== undefined) {
      availability[key] = frontmatter[key]
    }
  })

  return availability
}

/**
 * Debug helper to log filtering results
 * @param {string} pageUrl - Page URL being checked
 * @param {Object} filters - Applied filters
 * @param {Object} pageData - Page availability data
 * @param {boolean} result - Filter result
 */
export function debugFilterResult(pageUrl, filters, pageData, result) {
  if (process.env.NODE_ENV === 'development') {
    console.debug('Filter check:', {
      url: pageUrl,
      filters,
      pageData,
      result,
    })
  }
}
