// src/firebase/auth.js

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from './config'

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Firebase user credentials
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )
    return { success: true, user: userCredential.user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sign out current user
 * @returns {Promise} Logout result
 */
export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a new user account (for initial admin setup)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User creation result
 */
export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )
    return { success: true, user: userCredential.user }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Subscribe to authentication state changes
 * @param {function} callback - Function to call when auth state changes
 * @returns {function} Unsubscribe function
 */
export const onAuthChange = callback => {
  return onAuthStateChanged(auth, user => {
    callback(user)
  })
}

/**
 * Get current authenticated user
 * @returns {object|null} Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null
}
