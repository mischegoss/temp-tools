// src-learning/firebase/videoGalleryFirebase.js - Firebase config for Video Gallery ONLY

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

/**
 * Firebase Configuration for Video Gallery
 * SEPARATE from forms Firebase - uses src-admin credentials
 * Get these from: Firebase Console > Project Settings > General > Your apps
 */
const videoGalleryFirebaseConfig = {
  apiKey: 'AIzaSyBZ33N0mlSNhYMmJQ1FH4pAYFdu4jD2bQc',
  authDomain: 'training-admin-e4c47.firebaseapp.com',
  projectId: 'training-admin-e4c47',
  storageBucket: 'training-admin-e4c47.firebasestorage.app',
  messagingSenderId: '865281750611',
  appId: '1:865281750611:web:de8cf5d4b2206d52cfb8a6',
  measurementId: 'G-XSBZ0F7JN6',
}

/**
 * Initialize Firebase app for Video Gallery
 * Using different app name to avoid conflicts with forms Firebase
 */
const videoGalleryApp = initializeApp(
  videoGalleryFirebaseConfig,
  'videoGallery',
)

/**
 * Initialize Firestore Database for Video Gallery
 */
export const videoGalleryDb = getFirestore(videoGalleryApp)

/**
 * Export the app instance
 */
export default videoGalleryApp
