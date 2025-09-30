// src/components/VideoManagement/VideoItem.js

import React from 'react'

/**
 * VideoItem Component
 * Single video item in the list
 *
 * Props:
 * - video: Video object
 * - onEdit: Callback for edit action
 * - onDelete: Callback for delete action
 * - onViewJSON: Callback for view JSON action
 */
const VideoItem = ({ video, onEdit, onDelete, onViewJSON }) => {
  // Use the Firestore document ID (video.id) for operations,
  // but display the custom ID field (video.id) for user reference
  const firestoreDocId = video.id // This is the actual document ID from Firestore
  const customVideoId = video.id // This is the custom ID field inside the document
  // Determine learning path status
  const isInLearningPath = video.learningPath?.isPartOfPath
  const learningPathInfo = isInLearningPath
    ? `${video.learningPath.pathName} (Position ${video.learningPath.orderInPath})`
    : 'Not in Learning Path'

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Title */}
        <h3 style={styles.title}>{video.title}</h3>

        {/* Video ID */}
        <div style={styles.idContainer}>
          <span style={styles.idLabel}>ID:</span>
          <span style={styles.id}>{video.id}</span>
        </div>

        {/* Metadata */}
        <div style={styles.metadata}>
          <span style={styles.metaItem}>⏱️ {video.duration}</span>
          <span style={styles.metaItem}>📊 {video.level}</span>
          <span style={styles.metaItem}>🎯 {video.category}</span>
          <span style={styles.metaItem}>
            {isInLearningPath ? '🔗' : '❌'} {learningPathInfo}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.editButton} onClick={() => onEdit(video.id)}>
          Edit
        </button>
        <button style={styles.jsonButton} onClick={() => onViewJSON(video.id)}>
          View JSON
        </button>
        <button style={styles.deleteButton} onClick={() => onDelete(video)}>
          Delete
        </button>
      </div>
    </div>
  )
}

// Styles
const styles = {
  container: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  content: {
    flex: '1',
    minWidth: '250px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  idContainer: {
    marginBottom: '12px',
  },
  idLabel: {
    fontSize: '13px',
    color: '#718096',
    marginRight: '8px',
  },
  id: {
    fontSize: '13px',
    color: '#4a5568',
    fontFamily: 'Courier New, monospace',
    background: '#f7fafc',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    fontSize: '13px',
    color: '#718096',
  },
  metaItem: {
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
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
  jsonButton: {
    padding: '8px 16px',
    background: '#edf2f7',
    color: '#2d3748',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteButton: {
    padding: '8px 16px',
    background: '#fc8181',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}

export default VideoItem
