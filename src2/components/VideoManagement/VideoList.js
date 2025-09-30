// src/components/VideoManagement/VideoList.js

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Shared/Header'
import Loading from '../Shared/Loading'
import ErrorMessage from '../Shared/ErrorMessage'
import VideoSearch from './VideoSearch'
import VideoItem from './VideoItem'
import DeleteConfirmation from './DeleteConfirmation'
import { getAllVideos, deleteVideo } from '../../firebase/firestore'

/**
 * VideoList Component
 * Displays all videos with search and CRUD actions
 */
const VideoList = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load videos on mount
  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setLoading(true)
    setError('')

    const result = await getAllVideos()

    if (result.success) {
      // Sort by title
      const sorted = result.data.sort((a, b) => a.title.localeCompare(b.title))
      setVideos(sorted)
      setFilteredVideos(sorted)
    } else {
      setError(result.error || 'Failed to load videos')
    }

    setLoading(false)
  }

  const handleSearch = searchTerm => {
    if (!searchTerm.trim()) {
      setFilteredVideos(videos)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = videos.filter(
      video =>
        video.title.toLowerCase().includes(term) ||
        video.id.toLowerCase().includes(term) ||
        video.description?.toLowerCase().includes(term),
    )

    setFilteredVideos(filtered)
  }

  const handleEdit = videoId => {
    navigate(`/videos/edit/${videoId}`)
  }

  const handleViewJSON = videoId => {
    navigate(`/videos/json/${videoId}`)
  }

  const handleDeleteClick = video => {
    setVideoToDelete(video)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return

    setDeleting(true)
    const result = await deleteVideo(videoToDelete.id)

    if (result.success) {
      // Remove from local state
      setVideos(videos.filter(v => v.id !== videoToDelete.id))
      setFilteredVideos(filteredVideos.filter(v => v.id !== videoToDelete.id))
      setDeleteModalOpen(false)
      setVideoToDelete(null)
    } else {
      setError(result.error || 'Failed to delete video')
    }

    setDeleting(false)
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setVideoToDelete(null)
  }

  if (loading) {
    return (
      <>
        <Header />
        <Loading message='Loading videos...' />
      </>
    )
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Video Library</h1>
          <button
            style={styles.addButton}
            onClick={() => navigate('/videos/add')}
          >
            ➕ Add New Video
          </button>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Search */}
        <VideoSearch onSearch={handleSearch} />

        {/* Video Count */}
        <div style={styles.resultsInfo}>
          Showing {filteredVideos.length} of {videos.length} videos
        </div>

        {/* Video List */}
        {filteredVideos.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {videos.length === 0
                ? 'No videos found. Click "Add New Video" to get started.'
                : 'No videos match your search. Try a different search term.'}
            </p>
          </div>
        ) : (
          <div style={styles.videoList}>
            {filteredVideos.map(video => (
              <VideoItem
                key={video.firestoreId}
                video={video}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onViewJSON={handleViewJSON}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteConfirmation
          video={videoToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deleting}
        />
      )}
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
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0',
  },
  addButton: {
    padding: '12px 24px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resultsInfo: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '20px',
    fontWeight: '500',
  },
  videoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  emptyState: {
    background: 'white',
    padding: '60px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyText: {
    fontSize: '16px',
    color: '#718096',
    margin: '0',
  },
}

export default VideoList
