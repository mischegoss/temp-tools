// src/utils/browserStorage.js

/**
 * Utility to safely access browser storage APIs in a way that's compatible with SSR
 * Provides fallbacks for server-side rendering contexts where window/localStorage isn't available
 */

// Memory storage fallback for server-side rendering
const memoryStorage = {
    _data: {},
    getItem(key) {
      return this._data[key] || null;
    },
    setItem(key, value) {
      this._data[key] = value;
    },
    removeItem(key) {
      delete this._data[key];
    },
    clear() {
      this._data = {};
    }
  };
  
  /**
   * Checks if code is running in browser environment
   * @returns {boolean} True if in browser environment
   */
  const isBrowser = () => {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  };
  
  /**
   * Safely gets item from localStorage with SSR support
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key not found
   * @returns {string|null} Stored value or default
   */
  const getItem = (key, defaultValue = null) => {
    if (!isBrowser()) {
      return memoryStorage.getItem(key) || defaultValue;
    }
    
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return defaultValue;
    }
  };
  
  /**
   * Safely sets item in localStorage with SSR support
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   */
  const setItem = (key, value) => {
    if (!isBrowser()) {
      memoryStorage.setItem(key, value);
      return true;
    }
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Safely removes item from localStorage with SSR support
   * @param {string} key - Storage key to remove
   * @returns {boolean} Success status
   */
  const removeItem = (key) => {
    if (!isBrowser()) {
      memoryStorage.removeItem(key);
      return true;
    }
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  };
  
  /**
   * Clears all localStorage items with SSR support
   * @returns {boolean} Success status
   */
  const clear = () => {
    if (!isBrowser()) {
      memoryStorage.clear();
      return true;
    }
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  };
  
  /**
   * Similar functions for sessionStorage
   */
  const getSessionItem = (key, defaultValue = null) => {
    if (!isBrowser()) {
      return defaultValue;
    }
    
    try {
      return sessionStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      return defaultValue;
    }
  };
  
  const setSessionItem = (key, value) => {
    if (!isBrowser()) {
      return false;
    }
    
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
      return false;
    }
  };
  
  const removeSessionItem = (key) => {
    if (!isBrowser()) {
      return false;
    }
    
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  };
  
  export {
    isBrowser,
    getItem,
    setItem,
    removeItem,
    clear,
    getSessionItem,
    setSessionItem,
    removeSessionItem
  };