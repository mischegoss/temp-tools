// src/App.js

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Auth Components
import Login from './components/Auth/Login'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Dashboard Components (we'll create these next)
import Dashboard from './components/Dashboard/Dashboard'

// Video Management Components (we'll create these next)
import VideoList from './components/VideoManagement/VideoList'
import VideoForm from './components/VideoManagement/VideoForm'
import VideoJSONEditor from './components/VideoManagement/VideoJSONEditor'

/**
 * Main App Component
 * Sets up routing for the entire application
 *
 * Routes:
 * - / -> Redirects to /dashboard
 * - /login -> Public login page
 * - /dashboard -> Protected dashboard (main admin page)
 * - /videos -> Protected video list
 * - /videos/add -> Protected add new video form
 * - /videos/edit/:id -> Protected edit video form
 * - /videos/json/:id -> Protected JSON editor
 */
const App = () => {
  return (
    <div className='app'>
      <Routes>
        {/* Root - Redirect to dashboard */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Public Routes */}
        <Route path='/login' element={<Login />} />

        {/* Protected Routes - Dashboard */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Video List */}
        <Route
          path='/videos'
          element={
            <ProtectedRoute>
              <VideoList />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Add New Video */}
        <Route
          path='/videos/add'
          element={
            <ProtectedRoute>
              <VideoForm mode='create' />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Edit Video */}
        <Route
          path='/videos/edit/:id'
          element={
            <ProtectedRoute>
              <VideoForm mode='edit' />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - JSON Editor */}
        <Route
          path='/videos/json/:id'
          element={
            <ProtectedRoute>
              <VideoJSONEditor />
            </ProtectedRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

/**
 * Simple 404 Not Found Component
 */
const NotFound = () => {
  return (
    <div style={styles.notFound}>
      <h1 style={styles.notFoundTitle}>404</h1>
      <p style={styles.notFoundText}>Page not found</p>
      <a href='/dashboard' style={styles.notFoundLink}>
        Go to Dashboard
      </a>
    </div>
  )
}

// Styles
const styles = {
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f5f7fa',
    textAlign: 'center',
  },
  notFoundTitle: {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '16px',
  },
  notFoundText: {
    fontSize: '20px',
    color: '#718096',
    marginBottom: '32px',
  },
  notFoundLink: {
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
}

export default App
