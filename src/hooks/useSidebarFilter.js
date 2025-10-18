// src/hooks/useSidebarFilter.js
import { useState, useEffect, useMemo } from 'react'
import { checkAvailability } from '../utils/availabilityChecker'

/**
 * Hook to filter sidebar items based on current filter state
 * Works with Docusaurus sidebar structure and availability metadata
 */
export function useSidebarFilter(originalSidebar, isRitaGo = true) {
  const [filteredSidebar, setFilteredSidebar] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFilters, setCurrentFilters] = useState(null)

  // Get current filter state from global state
  const filters = useMemo(() => {
    if (typeof window !== 'undefined' && window.globalFilterState) {
      return window.globalFilterState.filters
    }
    return { role: 'all', plans: ['trial'], showUnavailable: false }
  }, [])

  // Get availability manifest from global state
  const availabilityManifest = useMemo(() => {
    if (typeof window !== 'undefined' && window.globalFilterState) {
      return window.globalFilterState.availabilityManifest
    }
    return null
  }, [])

  // Filter a single sidebar item
  const filterSidebarItem = item => {
    if (!item) return null

    // Handle category items (with items array)
    if (item.items && Array.isArray(item.items)) {
      const filteredItems = item.items.map(filterSidebarItem).filter(Boolean) // Remove null items

      // If no items remain after filtering, hide the category
      if (filteredItems.length === 0) {
        return null
      }

      return {
        ...item,
        items: filteredItems,
      }
    }

    // Handle leaf items (actual pages)
    if (item.href || item.id) {
      const pageUrl = item.href || `/${item.id}`

      // Check if page should be visible based on filters
      const shouldShow = checkAvailability(
        pageUrl,
        filters,
        availabilityManifest,
      )

      return shouldShow ? item : null
    }

    // Handle other item types (links, etc.)
    return item
  }

  // Filter the entire sidebar
  const filterSidebar = sidebar => {
    if (!sidebar || !Array.isArray(sidebar)) {
      return sidebar
    }

    return sidebar.map(filterSidebarItem).filter(Boolean) // Remove null items
  }

  // Listen for filter changes
  useEffect(() => {
    if (!isRitaGo || !originalSidebar) {
      setFilteredSidebar(null)
      return
    }

    let isMounted = true

    const updateSidebar = newFilters => {
      if (!isMounted) return

      setIsLoading(true)
      setCurrentFilters(newFilters)

      // Use setTimeout to avoid blocking the UI
      setTimeout(() => {
        if (!isMounted) return

        try {
          const filtered = filterSidebar(originalSidebar)
          setFilteredSidebar(filtered)
        } catch (error) {
          console.error('Error filtering sidebar:', error)
          setFilteredSidebar(originalSidebar) // Fallback to original
        } finally {
          setIsLoading(false)
        }
      }, 50)
    }

    // Initial filter
    updateSidebar(filters)

    // Register for filter updates
    if (typeof window !== 'undefined' && window.globalFilterState) {
      window.globalFilterState.sidebarUpdateCallbacks.add(updateSidebar)
    }

    return () => {
      isMounted = false
      if (typeof window !== 'undefined' && window.globalFilterState) {
        window.globalFilterState.sidebarUpdateCallbacks.delete(updateSidebar)
      }
    }
  }, [originalSidebar, isRitaGo, filters, availabilityManifest])

  return {
    filteredSidebar,
    isLoading,
    currentFilters,
  }
}
