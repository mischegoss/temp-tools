// src/firebase/config.js

// src/firebase/config.js

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

/**
 * Firebase Configuration
 * Get these from: Firebase Console > Project Settings > General > Your apps
 */
const firebaseConfig = {
  apiKey: 'AIzaSyBZ33N0mlSNhYMmJQ1FH4pAYFdu4jD2bQc',
  authDomain: 'training-admin-e4c47.firebaseapp.com',
  projectId: 'training-admin-e4c47',
  storageBucket: 'training-admin-e4c47.firebasestorage.app',
  messagingSenderId: '865281750611',
  appId: '1:865281750611:web:de8cf5d4b2206d52cfb8a6',
  measurementId: 'G-XSBZ0F7JN6',
}

/**
 * Initialize Firebase
 */
const app = initializeApp(firebaseConfig)

/**
 * Initialize Firebase Authentication
 */
export const auth = getAuth(app)

/**
 * Initialize Firestore Database
 */
export const db = getFirestore(app)

/**
 * Initialize Analytics (optional)
 */
export const analytics = getAnalytics(app)

/**
 * Export the app instance
 */
export default app
