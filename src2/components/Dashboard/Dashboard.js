// src/components/Dashboard/Dashboard.js

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Shared/Header'
import Stats from './Stats'
import Loading from '../Shared/Loading'
import ErrorMessage from '../Shared/ErrorMessage'
import { getAllVideos } from '../../firebase/firestore'

/**
 * Dashboard Component
 * Main admin dashboard with stats and action cards
 */
const Dashboard = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load videos on mount
  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setLoading(true)
    setError('')

    const result = await getAllVideos()

    if (result.success) {
      setVideos(result.data)
    } else {
      setError(result.error || 'Failed to load videos')
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Header />
        <Loading message='Loading dashboard...' />
      </>
    )
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.container}>
        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Stats Section */}
        <Stats videos={videos} />

        {/* Dashboard Actions */}
        <div style={styles.actionsGrid}>
          {/* Add New Video */}
          <div
            style={styles.actionCard}
            onClick={() => navigate('/videos/add')}
          >
            <span style={styles.actionIcon}>➕</span>
            <h3 style={styles.actionTitle}>Add New Video</h3>
            <p style={styles.actionDescription}>
              Create a new video entry with all metadata and learning path
              information
            </p>
          </div>

          {/* Edit Video */}
          <div style={styles.actionCard} onClick={() => navigate('/videos')}>
            <span style={styles.actionIcon}>✏️</span>
            <h3 style={styles.actionTitle}>Edit Video</h3>
            <p style={styles.actionDescription}>
              Search and update existing video information, transcripts, and
              settings
            </p>
          </div>

          {/* Show All Videos */}
          <div style={styles.actionCard} onClick={() => navigate('/videos')}>
            <span style={styles.actionIcon}>📋</span>
            <h3 style={styles.actionTitle}>Show All Videos</h3>
            <p style={styles.actionDescription}>
              Browse complete video library sorted by title, date, or learning
              path
            </p>
          </div>

          {/* Delete Video */}
          <div style={styles.actionCard} onClick={() => navigate('/videos')}>
            <span style={styles.actionIcon}>🗑️</span>
            <h3 style={styles.actionTitle}>Delete Video</h3>
            <p style={styles.actionDescription}>
              Remove videos from the library with confirmation prompt
            </p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div style={styles.quickActions}>
          <h2 style={styles.quickActionsTitle}>Quick Actions</h2>
          <div style={styles.quickActionsGrid}>
            <button
              style={styles.quickButton}
              onClick={() => navigate('/videos/add')}
            >
              ➕ Add Video
            </button>
            <button
              style={styles.quickButton}
              onClick={() => navigate('/videos')}
            >
              📋 View All
            </button>
            <button style={styles.quickButton} onClick={loadVideos}>
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div style={styles.recentSection}>
          <h2 style={styles.recentTitle}>Recent Videos</h2>
          {videos.length === 0 ? (
            <p style={styles.emptyState}>
              No videos found. Click "Add New Video" to get started.
            </p>
          ) : (
            <div style={styles.recentList}>
              {videos.slice(0, 5).map(video => (
                <div key={video.id} style={styles.recentItem}>
                  <div style={styles.recentInfo}>
                    <h4 style={styles.recentVideoTitle}>{video.title}</h4>
                    <p style={styles.recentVideoId}>ID: {video.id}</p>
                  </div>
                  <button
                    style={styles.editButton}
                    onClick={() => navigate(`/videos/edit/${video.id}`)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
          {videos.length > 5 && (
            <button
              style={styles.viewAllButton}
              onClick={() => navigate('/videos')}
            >
              View All Videos →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Styles
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  actionCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  },
  actionIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '15px',
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c5282',
    marginBottom: '10px',
  },
  actionDescription: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.5',
    margin: '0',
  },
  quickActions: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '40px',
  },
  quickActionsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  quickButton: {
    padding: '12px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  recentSection: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  recentTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  emptyState: {
    textAlign: 'center',
    color: '#718096',
    padding: '40px 20px',
    fontSize: '14px',
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    transition: 'border-color 0.2s',
  },
  recentInfo: {
    flex: '1',
  },
  recentVideoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '5px',
    margin: '0 0 5px 0',
  },
  recentVideoId: {
    fontSize: '13px',
    color: '#718096',
    fontFamily: 'Courier New, monospace',
    margin: '0',
  },
  editButton: {
    padding: '8px 16px',
    background: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  viewAllButton: {
    width: '100%',
    padding: '12px',
    background: '#edf2f7',
    color: '#2d3748',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.2s',
  },
}

export default Dashboard
