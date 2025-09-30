// src/firebase/firestore.js

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// Collection name for videos
const VIDEOS_COLLECTION = 'videos'

/**
 * CREATE: Add a new video to Firestore
 * @param {object} videoData - Video data object
 * @returns {Promise} Result with video ID
 */
export const createVideo = async videoData => {
  try {
    // Add timestamp
    const dataWithTimestamp = {
      ...videoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(
      collection(db, VIDEOS_COLLECTION),
      dataWithTimestamp,
    )
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating video:', error)
    return { success: false, error: error.message }
  }
}

/**
 * READ: Get a single video by ID
 * @param {string} videoId - Video document ID (Firestore document ID)
 * @returns {Promise} Video data
 */
export const getVideo = async videoId => {
  try {
    const docRef = doc(db, VIDEOS_COLLECTION, videoId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        success: true,
        data: {
          firestoreId: docSnap.id, // Firestore document ID
          ...data, // All document fields
        },
      }
    } else {
      return { success: false, error: 'Video not found' }
    }
  } catch (error) {
    console.error('Error getting video:', error)
    return { success: false, error: error.message }
  }
}

/**
 * READ: Get all videos
 * @returns {Promise} Array of all videos
 */
export const getAllVideos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, VIDEOS_COLLECTION))
    const videos = []

    querySnapshot.forEach(doc => {
      const data = doc.data()
      videos.push({
        firestoreId: doc.id, // Firestore document ID
        ...data, // All document fields (including custom 'id' field)
      })
    })

    return { success: true, data: videos }
  } catch (error) {
    console.error('Error getting videos:', error)
    return { success: false, error: error.message }
  }
}

/**
 * READ: Search videos by title
 * @param {string} searchTerm - Search term
 * @returns {Promise} Array of matching videos
 */
export const searchVideosByTitle = async searchTerm => {
  try {
    const videos = await getAllVideos()

    if (!videos.success) {
      return videos
    }

    // Filter videos by title (case-insensitive)
    const filtered = videos.data.filter(
      video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return { success: true, data: filtered }
  } catch (error) {
    console.error('Error searching videos:', error)
    return { success: false, error: error.message }
  }
}

/**
 * READ: Get videos by learning path
 * @param {string} pathId - Learning path ID
 * @returns {Promise} Array of videos in the path
 */
export const getVideosByLearningPath = async pathId => {
  try {
    const q = query(
      collection(db, VIDEOS_COLLECTION),
      where('learningPath.pathId', '==', pathId),
      orderBy('learningPath.orderInPath'),
    )

    const querySnapshot = await getDocs(q)
    const videos = []

    querySnapshot.forEach(doc => {
      videos.push({ id: doc.id, ...doc.data() })
    })

    return { success: true, data: videos }
  } catch (error) {
    console.error('Error getting videos by learning path:', error)
    return { success: false, error: error.message }
  }
}

/**
 * UPDATE: Update an existing video
 * @param {string} videoId - Video document ID
 * @param {object} updates - Updated video data
 * @returns {Promise} Update result
 */
export const updateVideo = async (videoId, updates) => {
  try {
    const docRef = doc(db, VIDEOS_COLLECTION, videoId)

    // Add updated timestamp
    const dataWithTimestamp = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, dataWithTimestamp)
    return { success: true, id: videoId }
  } catch (error) {
    console.error('Error updating video:', error)
    return { success: false, error: error.message }
  }
}

/**
 * DELETE: Delete a video
 * @param {string} videoId - Video document ID
 * @returns {Promise} Delete result
 */
export const deleteVideo = async videoId => {
  try {
    const docRef = doc(db, VIDEOS_COLLECTION, videoId)
    await deleteDoc(docRef)
    return { success: true, id: videoId }
  } catch (error) {
    console.error('Error deleting video:', error)
    return { success: false, error: error.message }
  }
}

/**
 * READ: Get video statistics
 * @returns {Promise} Stats object
 */
export const getVideoStats = async () => {
  try {
    const result = await getAllVideos()

    if (!result.success) {
      return result
    }

    const videos = result.data

    // Count videos in learning paths
    const videosInPaths = videos.filter(
      v => v.learningPath?.isPartOfPath,
    ).length

    // Get unique learning paths
    const uniquePaths = new Set(
      videos
        .filter(v => v.learningPath?.isPartOfPath)
        .map(v => v.learningPath.pathId),
    )

    // Count videos added this month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const addedThisMonth = videos.filter(v => {
      if (!v.createdAt) return false
      const createdDate = v.createdAt.toDate
        ? v.createdAt.toDate()
        : new Date(v.createdAt)
      return createdDate >= firstDayOfMonth
    }).length

    return {
      success: true,
      data: {
        totalVideos: videos.length,
        videosInPaths,
        uniqueLearningPaths: uniquePaths.size,
        addedThisMonth,
      },
    }
  } catch (error) {
    console.error('Error getting video stats:', error)
    return { success: false, error: error.message }
  }
}
