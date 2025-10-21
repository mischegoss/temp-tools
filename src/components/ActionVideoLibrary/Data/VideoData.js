
// src-learning/components/ActionVideoLibrary/Data/VideoData.js
// FIXED: Resolves subscription timing issue where hooks don't receive existing data

import { useState, useEffect } from 'react'
import { videoStore } from '../../../firebase/videoOperations'

/**
 * React hook for real-time video library data
 * FIXED: Now properly handles case where data exists before subscription
 *
 * @returns {Object} { videos, loading, error }
 */
export const useVideoLibrary = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🎬 Setting up video library hook')

    // FIX: Check if data already exists in the store
    const existingVideos = videoStore.getVideos()
    if (existingVideos.length > 0) {
      console.log(`📊 Found existing videos in store: ${existingVideos.length}`)
      setVideos(existingVideos)
      setLoading(false)
      setError(null)
    }

    // Subscribe to real-time video updates
    const unsubscribe = videoStore.subscribe((updatedVideos, updateError) => {
      if (updateError) {
        console.error('Video library error:', updateError)
        setError(updateError.message || 'Failed to load videos')
        setLoading(false)
      } else {
        console.log(`📊 Video library hook updated: ${updatedVideos.length} videos`)
        setVideos(updatedVideos)
        setError(null)
        setLoading(false)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 Cleaning up video library subscription')
      unsubscribe()
    }
  }, [])

  return { videos, loading, error }
}

/**
 * Global video library state for backward compatibility
 * This gets updated automatically when Firebase data changes
 */
let globalVideoLibrary = []

// Set up global listener to keep backward compatibility array updated
if (typeof window !== 'undefined') {
  // Only run in browser environment (not during SSR)
  videoStore.subscribe(updatedVideos => {
    globalVideoLibrary = updatedVideos
  })
}

/**
 * BACKWARD COMPATIBILITY EXPORT
 * This maintains compatibility with existing imports like:
 * import { videoLibrary } from './VideoData'
 *
 * Note: For real-time updates, components should use useVideoLibrary() hook instead
 */
export const videoLibrary = globalVideoLibrary

/**
 * Get video library synchronously (may be empty on first load)
 * For real-time updates, use useVideoLibrary() hook instead
 *
 * @returns {Array} Current video array
 */
export const getVideoLibrary = () => {
  return videoStore.getVideos()
}

/**
 * Force refresh video library from Firebase
 * Usually not needed as real-time updates are automatic
 *
 * @returns {Promise} Refresh operation result
 */
export const refreshVideoLibrary = async () => {
  try {
    // This will trigger the real-time listener to update
    videoStore.startListening()
    return { success: true }
  } catch (error) {
    console.error('Failed to refresh video library:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Search videos (works with current data)
 *
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching videos
 */
export const searchVideoLibrary = searchTerm => {
  const { searchVideos } = require('../../../firebase/videoOperations')
  return searchVideos(searchTerm)
}

/**
 * Get videos by product (works with current data)
 *
 * @param {string} product - Product name
 * @returns {Array} Videos for that product
 */
export const getVideosByProduct = product => {
  const { getVideosByProduct } = require('../../../firebase/videoOperations')
  return getVideosByProduct(product)
}

/**
 * Get featured videos (works with current data)
 *
 * @returns {Array} Featured videos
 */
export const getFeaturedVideos = () => {
  const { getFeaturedVideos } = require('../../../firebase/videoOperations')
  return getFeaturedVideos()
}

// Export video store for advanced usage
export { videoStore }

// LEGACY COMPATIBILITY: Static video library is now empty by default
// Components should migrate to useVideoLibrary() hook for real-time updates
// But existing imports will continue to work

console.log('📚 VideoData.js loaded - using Firebase real-time data')

// For debugging in development
if (process.env.NODE_ENV === 'development') {
  window.videoLibraryDebug = {
    videoStore,
    useVideoLibrary,
    getVideoLibrary,
    refreshVideoLibrary,
  }
}