// src/utils/globalFilterState.js
/**
 * Centralized filter state management utilities
 * Manages the global filter state used across components
 */

/**
 * Initialize global filter state if it doesn't exist
 * This ensures consistent state structure across all components
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
      sidebarUpdateCallbacks: new Set(),

      // Data sources
      pagesBadgeData: new Map(), // Legacy: from FeatureBadges components
      availabilityManifest: null, // New: from plugin manifest

      // Update functions
      updatePageBadges: null,
    }
  }

  return window.globalFilterState
}

/**
 * Get current filter state
 * @returns {Object} Current filter state
 */
export function getCurrentFilters() {
  const state = initializeGlobalFilterState()
  return state
    ? state.filters
    : { role: 'all', plans: ['trial'], showUnavailable: false }
}

/**
 * Update filter state and notify all listeners
 * @param {Object} newFilters - New filter state
 */
export function updateFilters(newFilters) {
  const state = initializeGlobalFilterState()
  if (!state) return

  // Update filters
  state.filters = { ...state.filters, ...newFilters }

  // Notify filter change callbacks
  state.filterChangeCallbacks.forEach(callback => {
    try {
      callback()
    } catch (error) {
      console.error('Error in filter change callback:', error)
    }
  })

  // Notify sidebar update callbacks
  state.sidebarUpdateCallbacks.forEach(callback => {
    try {
      callback(state.filters)
    } catch (error) {
      console.error('Error in sidebar update callback:', error)
    }
  })
}

/**
 * Register a callback for filter changes
 * @param {Function} callback - Function to call when filters change
 * @returns {Function} Cleanup function to remove the callback
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
 * Register a callback for sidebar updates
 * @param {Function} callback - Function to call when sidebar should update
 * @returns {Function} Cleanup function to remove the callback
 */
export function onSidebarUpdate(callback) {
  const state = initializeGlobalFilterState()
  if (!state) return () => {}

  state.sidebarUpdateCallbacks.add(callback)

  return () => {
    state.sidebarUpdateCallbacks.delete(callback)
  }
}

/**
 * Set the availability manifest data
 * @param {Object} manifest - Availability manifest from plugin
 */
export function setAvailabilityManifest(manifest) {
  const state = initializeGlobalFilterState()
  if (!state) return

  state.availabilityManifest = manifest
  console.log(
    '📊 Availability manifest updated:',
    Object.keys(manifest || {}).length,
    'pages',
  )
}

/**
 * Get the availability manifest data
 * @returns {Object|null} Current availability manifest
 */
export function getAvailabilityManifest() {
  const state = initializeGlobalFilterState()
  return state ? state.availabilityManifest : null
}

/**
 * Register page badge data (legacy support)
 * @param {string} url - Page URL
 * @param {Object} badgeData - Badge availability data
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
 * @returns {Map} Map of page URLs to badge data
 */
export function getPageBadgeData() {
  const state = initializeGlobalFilterState()
  return state ? state.pagesBadgeData : new Map()
}

/**
 * Clear all registered page badge data
 */
export function clearPageBadgeData() {
  const state = initializeGlobalFilterState()
  if (!state) return

  state.pagesBadgeData.clear()
}

/**
 * Get filter statistics for debugging
 * @returns {Object} Filter statistics
 */
export function getFilterStats() {
  const state = initializeGlobalFilterState()
  if (!state) return null

  const manifest = state.availabilityManifest || {}
  const badgeData = state.pagesBadgeData || new Map()

  return {
    currentFilters: state.filters,
    manifestPages: Object.keys(manifest).length,
    badgePages: badgeData.size,
    filterCallbacks: state.filterChangeCallbacks.size,
    sidebarCallbacks: state.sidebarUpdateCallbacks.size,
  }
}

/**
 * Reset all filter state (useful for testing)
 */
export function resetFilterState() {
  if (typeof window !== 'undefined') {
    delete window.globalFilterState
  }
}

/**
 * Debug helper to log current state
 */
export function debugFilterState() {
  if (process.env.NODE_ENV === 'development') {
    const stats = getFilterStats()
    console.debug('🔍 Filter State Debug:', stats)
  }
}
