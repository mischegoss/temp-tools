// src/components/VideoManagement/VideoJSONEditor.js

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../Shared/Header'
import Loading from '../Shared/Loading'
import ErrorMessage from '../Shared/ErrorMessage'
import { getVideo, updateVideo } from '../../firebase/firestore'

/**
 * VideoJSONEditor Component
 * Allows viewing and editing raw JSON of video data
 */
const VideoJSONEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams() // This is the firestoreId
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [jsonText, setJsonText] = useState('')
  const [originalVideo, setOriginalVideo] = useState(null)
  const [jsonError, setJsonError] = useState('')

  // Load video on mount
  useEffect(() => {
    loadVideo()
  }, [id])

  const loadVideo = async () => {
    setLoading(true)
    setError('')

    // Use the firestoreId from URL params to get video
    const result = await getVideo(id)

    if (result.success) {
      setOriginalVideo(result.data)
      // Pretty print JSON with 2 space indentation
      setJsonText(JSON.stringify(result.data, null, 2))
    } else {
      setError(result.error || 'Failed to load video')
    }

    setLoading(false)
  }

  const handleJsonChange = e => {
    const value = e.target.value
    setJsonText(value)
    setJsonError('')

    // Try to parse JSON to validate
    try {
      JSON.parse(value)
    } catch (err) {
      setJsonError(`Invalid JSON: ${err.message}`)
    }
  }

  const handleSave = async () => {
    // Validate JSON
    let parsedData
    try {
      parsedData = JSON.parse(jsonText)
    } catch (err) {
      setError(`Cannot save invalid JSON: ${err.message}`)
      return
    }

    setSaving(true)
    setError('')

    // Save to Firestore using the firestoreId from URL params
    const result = await updateVideo(id, parsedData)

    if (result.success) {
      navigate('/videos')
    } else {
      setError(result.error || 'Failed to save video')
    }

    setSaving(false)
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText)
      setJsonText(JSON.stringify(parsed, null, 2))
      setJsonError('')
    } catch (err) {
      setJsonError(`Cannot format invalid JSON: ${err.message}`)
    }
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Reset to original data? All unsaved changes will be lost.',
      )
    ) {
      setJsonText(JSON.stringify(originalVideo, null, 2))
      setJsonError('')
      setError('')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <Loading message='Loading video data...' />
      </>
    )
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>JSON Editor</h1>
            <p style={styles.videoTitle}>{originalVideo?.title}</p>
            <p style={styles.videoId}>
              Custom ID: {originalVideo?.customId || originalVideo?.id}
            </p>
            <p style={styles.firestoreId}>
              Firestore ID: {originalVideo?.firestoreId}
            </p>
          </div>
          <button style={styles.backButton} onClick={() => navigate('/videos')}>
            ← Back to Videos
          </button>
        </div>

        {/* Error Messages */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {jsonError && <div style={styles.jsonError}>⚠️ {jsonError}</div>}

        {/* Warning Box */}
        <div style={styles.warningBox}>
          <strong>⚠️ Advanced Mode:</strong> You are editing the raw JSON data.
          Invalid JSON or incorrect data types may cause errors. Make sure you
          know what you're doing before saving changes.
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            style={styles.formatButton}
            onClick={handleFormat}
            disabled={saving}
          >
            🎨 Format JSON
          </button>
          <button
            style={styles.resetButton}
            onClick={handleReset}
            disabled={saving}
          >
            ↺ Reset to Original
          </button>
        </div>

        {/* JSON Editor */}
        <div style={styles.editorContainer}>
          <textarea
            value={jsonText}
            onChange={handleJsonChange}
            style={styles.editor}
            spellCheck='false'
            disabled={saving}
          />
        </div>

        {/* Character Count */}
        <div style={styles.info}>
          Characters: {jsonText.length} | Lines: {jsonText.split('\n').length}
        </div>

        {/* Save Buttons */}
        <div style={styles.buttonGroup}>
          <button
            style={{
              ...styles.saveButton,
              ...(saving || jsonError ? styles.saveButtonDisabled : {}),
            }}
            onClick={handleSave}
            disabled={saving || jsonError}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button
            style={styles.cancelButton}
            onClick={() => navigate('/videos')}
            disabled={saving}
          >
            Cancel
          </button>
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
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0 0 8px 0',
  },
  videoTitle: {
    fontSize: '16px',
    color: '#4a5568',
    margin: '0 0 4px 0',
  },
  videoId: {
    fontSize: '13px',
    color: '#718096',
    fontFamily: 'Courier New, monospace',
    margin: '0 0 4px 0',
  },
  firestoreId: {
    fontSize: '13px',
    color: '#a0aec0',
    fontFamily: 'Courier New, monospace',
    margin: '0',
  },
  backButton: {
    padding: '10px 20px',
    background: '#edf2f7',
    color: '#2d3748',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  warningBox: {
    background: '#fffaf0',
    border: '1px solid #fbd38d',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#744210',
    lineHeight: '1.5',
  },
  jsonError: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fc8181',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  formatButton: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resetButton: {
    padding: '10px 20px',
    background: '#ed8936',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  editorContainer: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  editor: {
    width: '100%',
    minHeight: '600px',
    padding: '20px',
    border: 'none',
    outline: 'none',
    fontFamily: 'Courier New, monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    resize: 'vertical',
    background: '#1e293b',
    color: '#e2e8f0',
  },
  info: {
    fontSize: '13px',
    color: '#718096',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
  },
  saveButton: {
    flex: '1',
    padding: '14px 24px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  saveButtonDisabled: {
    background: '#a0aec0',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  cancelButton: {
    flex: '1',
    padding: '14px 24px',
    background: '#e2e8f0',
    color: '#2d3748',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}

export default VideoJSONEditor
