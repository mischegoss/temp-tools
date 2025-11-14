// src/components/VideoManagement/DeleteConfirmation.js

import React from 'react'

/**
 * DeleteConfirmation Component
 * Modal dialog for confirming video deletion
 *
 * Props:
 * - video: Video object to delete
 * - onConfirm: Callback when user confirms deletion
 * - onCancel: Callback when user cancels
 * - isDeleting: Boolean indicating if deletion is in progress
 */
const DeleteConfirmation = ({ video, onConfirm, onCancel, isDeleting }) => {
  if (!video) return null

  // Handle both old and new data structures for backward compatibility
  const customVideoId = video.customId || video.id
  const firestoreId = video.firestoreId

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>⚠️ Delete Video?</h2>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <p style={styles.warning}>
            Are you sure you want to delete this video? This action cannot be
            undone.
          </p>

          <div style={styles.videoInfo}>
            <p style={styles.videoTitle}>{video.title}</p>
            <p style={styles.videoId}>Custom ID: {customVideoId}</p>
            {firestoreId && (
              <p style={styles.firestoreId}>Firestore ID: {firestoreId}</p>
            )}
          </div>

          {video.learningPath?.isPartOfPath && (
            <div style={styles.warningBox}>
              <strong>Warning:</strong> This video is part of a learning path:{' '}
              <strong>{video.learningPath.pathName}</strong>. Deleting it may
              break the learning path sequence.
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={styles.cancelButton}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.deleteButton,
              ...(isDeleting ? styles.deleteButtonDisabled : {}),
            }}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Video'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'slideIn 0.2s ease-out',
  },
  header: {
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0',
  },
  content: {
    padding: '24px',
  },
  warning: {
    fontSize: '15px',
    color: '#2d3748',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  videoInfo: {
    background: '#f7fafc',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  videoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  videoId: {
    fontSize: '13px',
    color: '#718096',
    fontFamily: 'Courier New, monospace',
    margin: '0 0 4px 0',
  },
  firestoreId: {
    fontSize: '12px',
    color: '#a0aec0',
    fontFamily: 'Courier New, monospace',
    margin: '0',
  },
  warningBox: {
    background: '#fff5f5',
    border: '1px solid #feb2b2',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#c53030',
    lineHeight: '1.5',
  },
  actions: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#edf2f7',
    color: '#2d3748',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  deleteButton: {
    padding: '10px 20px',
    background: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  deleteButtonDisabled: {
    background: '#fc8181',
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}

// Add slide-in animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  document.head.appendChild(style)
}

export default DeleteConfirmation
