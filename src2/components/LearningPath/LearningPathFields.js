// src/components/LearningPath/LearningPathFields.js

import React from 'react'

/**
 * LearningPathFields Component
 * Reusable form fields for learning path information
 *
 * Props:
 * - learningPath: Learning path object
 * - suggestedNextVideo: Suggested next video ID (for standalone videos)
 * - onLearningPathChange: Callback for learning path field changes
 * - onSuggestedVideoChange: Callback for suggested video change
 */
const LearningPathFields = ({
  learningPath,
  suggestedNextVideo,
  onLearningPathChange,
  onSuggestedVideoChange,
}) => {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Learning Path</h2>

      <div style={styles.formGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type='checkbox'
            checked={learningPath.isPartOfPath}
            onChange={e =>
              onLearningPathChange('isPartOfPath', e.target.checked)
            }
            style={styles.checkbox}
          />
          Part of Learning Path
        </label>
      </div>

      {learningPath.isPartOfPath ? (
        <>
          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Path Name *</label>
              <input
                type='text'
                value={learningPath.pathName}
                onChange={e => onLearningPathChange('pathName', e.target.value)}
                placeholder='e.g., Automation Essentials'
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Path ID *</label>
              <input
                type='text'
                value={learningPath.pathId}
                onChange={e => onLearningPathChange('pathId', e.target.value)}
                placeholder='e.g., automation-essentials'
                style={styles.input}
              />
              <small style={styles.helpText}>Lowercase with hyphens</small>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Order in Path *</label>
            <input
              type='number'
              value={learningPath.orderInPath}
              onChange={e =>
                onLearningPathChange('orderInPath', e.target.value)
              }
              placeholder='e.g., 1'
              style={styles.input}
              min='1'
            />
            <small style={styles.helpText}>
              Position in the learning path sequence
            </small>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Previous Video ID</label>
              <input
                type='text'
                value={learningPath.previousVideoId}
                onChange={e =>
                  onLearningPathChange('previousVideoId', e.target.value)
                }
                placeholder='e.g., workflow-basics'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Leave empty if this is the first video
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Next Video ID</label>
              <input
                type='text'
                value={learningPath.nextVideoId}
                onChange={e =>
                  onLearningPathChange('nextVideoId', e.target.value)
                }
                placeholder='e.g., advanced-triggers'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Leave empty if this is the last video
              </small>
            </div>
          </div>

          <div style={styles.infoBox}>
            <strong>💡 Tip:</strong> Use the "Show All Videos" page to find
            video IDs. The ID is displayed below each video title in the list.
          </div>
        </>
      ) : (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Suggested Next Video</label>
            <input
              type='text'
              value={suggestedNextVideo}
              onChange={e => onSuggestedVideoChange(e.target.value)}
              placeholder='e.g., related-video-id'
              style={styles.input}
            />
            <small style={styles.helpText}>
              Recommended next video for standalone videos (not in a learning
              path)
            </small>
          </div>

          <div style={styles.infoBox}>
            <strong>ℹ️ Note:</strong> This video is not part of a learning path.
            You can optionally suggest a related video for users to watch next.
          </div>
        </>
      )}
    </section>
  )
}

// Styles
const styles = {
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    margin: '0 0 20px 0',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  helpText: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#718096',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  infoBox: {
    background: '#e6fffa',
    border: '1px solid #81e6d9',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#234e52',
    lineHeight: '1.5',
  },
}

export default LearningPathFields
