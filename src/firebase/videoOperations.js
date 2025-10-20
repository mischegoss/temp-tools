// src-learning/firebase/videoOperations.js - Firebase operations for Video Gallery

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { videoGalleryDb } from './videoGalleryFirebase'

// Collection name for videos
const VIDEOS_COLLECTION = 'videos'

/**
 * Global state for real-time video updates
 */
class VideoStore {
  constructor() {
    this.videos = []
    this.listeners = new Set()
    this.isListening = false
    this.unsubscribe = null
  }

  /**
   * Start real-time listener for all videos
   */
  startListening() {
    if (this.isListening) return

    console.log('🔥 Starting Firebase real-time listener for videos')

    try {
      // Create query to get videos ordered by sectionOrder, then by title
      const videosQuery = query(
        collection(videoGalleryDb, VIDEOS_COLLECTION),
        orderBy('sectionOrder', 'asc'),
        orderBy('title', 'asc'),
      )

      this.unsubscribe = onSnapshot(
        videosQuery,
        snapshot => {
          console.log('🔄 Video data updated from Firebase')

          // Transform Firebase documents to video objects
          this.videos = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
              ...data,
              firestoreId: doc.id,
              customId: data.id,
              // Ensure new fields exist with defaults
              vimeoHash: data.vimeoHash || '',
              sectionOrder: data.sectionOrder || 0,
              publishDate: data.publishDate || '',
            }
          })

          console.log(`📊 Loaded ${this.videos.length} videos from Firebase`)

          // Notify all subscribers of the update
          this.listeners.forEach(callback => {
            try {
              callback(this.videos)
            } catch (error) {
              console.error('Error in video update callback:', error)
            }
          })
        },
        error => {
          console.error('🚨 Firebase listener error:', error)
          // Notify listeners of error state
          this.listeners.forEach(callback => {
            try {
              callback([], error)
            } catch (callbackError) {
              console.error('Error in error callback:', callbackError)
            }
          })
        },
      )

      this.isListening = true
    } catch (error) {
      console.error('🚨 Failed to start Firebase listener:', error)
    }
  }

  /**
   * Subscribe to video updates
   * @param {function} callback - Function to call when videos update
   * @returns {function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback)
    this.startListening()

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)

      // If no more listeners, stop Firebase listener
      if (this.listeners.size === 0) {
        this.stopListening()
      }
    }
  }

  /**
   * Stop the Firebase listener
   */
  stopListening() {
    if (this.unsubscribe) {
      console.log('🛑 Stopping Firebase listener')
      this.unsubscribe()
      this.unsubscribe = null
      this.isListening = false
    }
  }

  /**
   * Get current videos (starts listener if not already started)
   * @returns {Array} Current video array
   */
  getVideos() {
    this.startListening()
    return this.videos
  }
}

// Create global video store instance
export const videoStore = new VideoStore()

/**
 * Get all videos with real-time updates
 * @returns {Promise} Result with video array
 */
export const getAllVideos = async () => {
  try {
    // For one-time fetch without real-time updates
    const querySnapshot = await getDocs(
      query(
        collection(videoGalleryDb, VIDEOS_COLLECTION),
        orderBy('sectionOrder', 'asc'),
        orderBy('title', 'asc'),
      ),
    )

    const videos = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        firestoreId: doc.id,
        customId: data.id,
        vimeoHash: data.vimeoHash || '',
        sectionOrder: data.sectionOrder || 0,
        publishDate: data.publishDate || '',
      }
    })

    return { success: true, data: videos }
  } catch (error) {
    console.error('Error getting all videos:', error)
    return { success: false, error: error.message, data: [] }
  }
}

/**
 * Get a single video by custom ID (not Firestore document ID)
 * @param {string} customVideoId - The custom video ID (video.id field)
 * @returns {Promise} Video data or null
 */
export const getVideoByCustomId = async customVideoId => {
  try {
    console.log('🔍 Looking for video with custom ID:', customVideoId)

    // First try to find in store (if real-time listener is active)
    if (videoStore.videos.length > 0) {
      const video = videoStore.videos.find(v => v.id === customVideoId)
      if (video) {
        console.log('✅ Found video in store:', video.title)
        return { success: true, data: video }
      }
    }

    // If not in store, fetch all videos and find the one we need
    const result = await getAllVideos()
    if (result.success) {
      const video = result.data.find(v => v.id === customVideoId)
      if (video) {
        console.log('✅ Found video in Firebase:', video.title)
        return { success: true, data: video }
      }
    }

    console.log('❌ Video not found:', customVideoId)
    return { success: false, error: 'Video not found', data: null }
  } catch (error) {
    console.error('Error getting video by custom ID:', error)
    return { success: false, error: error.message, data: null }
  }
}

/**
 * Get a single video by Firestore document ID
 * @param {string} firestoreId - The Firestore document ID
 * @returns {Promise} Video data or null
 */
export const getVideoByFirestoreId = async firestoreId => {
  try {
    const docRef = doc(videoGalleryDb, VIDEOS_COLLECTION, firestoreId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      const video = {
        ...data,
        firestoreId: docSnap.id,
        customId: data.id,
        vimeoHash: data.vimeoHash || '',
        sectionOrder: data.sectionOrder || 0,
        publishDate: data.publishDate || '',
      }

      return { success: true, data: video }
    } else {
      return { success: false, error: 'Video not found', data: null }
    }
  } catch (error) {
    console.error('Error getting video by Firestore ID:', error)
    return { success: false, error: error.message, data: null }
  }
}

/**
 * Search videos by title or description
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching videos
 */
export const searchVideos = searchTerm => {
  if (!searchTerm || searchTerm.trim() === '') {
    return videoStore.getVideos()
  }

  const term = searchTerm.toLowerCase()
  return videoStore
    .getVideos()
    .filter(
      video =>
        video.title?.toLowerCase().includes(term) ||
        video.description?.toLowerCase().includes(term) ||
        video.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        video.category?.toLowerCase().includes(term),
    )
}

/**
 * Get videos by product
 * @param {string} product - Product name (actions, express, pro, insights)
 * @returns {Array} Videos for that product
 */
export const getVideosByProduct = product => {
  return videoStore.getVideos().filter(video => video.product === product)
}

/**
 * Get featured videos
 * @returns {Array} Featured videos
 */
export const getFeaturedVideos = () => {
  return videoStore.getVideos().filter(video => video.featured === true)
}
