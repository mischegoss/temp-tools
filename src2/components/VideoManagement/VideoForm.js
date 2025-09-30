// src/components/VideoManagement/VideoForm.js

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../Shared/Header'
import Loading from '../Shared/Loading'
import ErrorMessage from '../Shared/ErrorMessage'
import { createVideo, updateVideo, getVideo } from '../../firebase/firestore'

/**
 * VideoForm Component
 * Form for creating and editing videos
 *
 * Props:
 * - mode: 'create' or 'edit'
 */
const VideoForm = ({ mode = 'create' }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    videoUrl: '',
    videoId: '',
    platform: 'youtube',
    duration: '',
    level: 'step-by-step',
    category: '',
    section: '',
    product: 'actions',
    featured: false,
    tags: '',
    template: 'instructional',
    learningObjectives: '',
    estimatedTime: '',
    transcript: '',
    tutorialSteps: [{ step: 1, title: '', content: '' }],
    learningResources: [{ title: '', description: '', link: '' }],
    documentResources: [{ title: '', description: '', link: '' }],
    learningPath: {
      isPartOfPath: false,
      pathName: '',
      pathId: '',
      orderInPath: '',
      previousVideoId: '',
      nextVideoId: '',
    },
    suggestedNextVideo: '',
  })

  // Load video data if editing
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadVideo()
    }
  }, [mode, id])

  const loadVideo = async () => {
    try {
      const result = await getVideo(id)

      if (result.success) {
        // Convert tags array to string
        const videoData = result.data

        if (Array.isArray(videoData.tags)) {
          videoData.tags = videoData.tags.join(', ')
        }

        setFormData(videoData)
      } else {
        setError('Failed to load video: ' + result.error)
      }
    } catch (error) {
      setError('Error loading video: ' + error.message)
    }

    setLoading(false)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLearningPathChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      learningPath: {
        ...prev.learningPath,
        [field]: value,
      },
    }))
  }

  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.tutorialSteps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setFormData(prev => ({ ...prev, tutorialSteps: newSteps }))
  }

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      tutorialSteps: [
        ...prev.tutorialSteps,
        {
          step: prev.tutorialSteps.length + 1,
          title: '',
          content: '',
        },
      ],
    }))
  }

  const removeStep = index => {
    setFormData(prev => ({
      ...prev,
      tutorialSteps: prev.tutorialSteps.filter((_, i) => i !== index),
    }))
  }

  const handleResourceChange = (type, index, field, value) => {
    const resourceKey =
      type === 'learning' ? 'learningResources' : 'documentResources'
    const newResources = [...formData[resourceKey]]
    newResources[index] = { ...newResources[index], [field]: value }
    setFormData(prev => ({ ...prev, [resourceKey]: newResources }))
  }

  const addResource = type => {
    const resourceKey =
      type === 'learning' ? 'learningResources' : 'documentResources'
    setFormData(prev => ({
      ...prev,
      [resourceKey]: [
        ...prev[resourceKey],
        { title: '', description: '', link: '' },
      ],
    }))
  }

  const removeResource = (type, index) => {
    const resourceKey =
      type === 'learning' ? 'learningResources' : 'documentResources'
    setFormData(prev => ({
      ...prev,
      [resourceKey]: prev[resourceKey].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    setError('')
    setSaving(true)

    // Validate required fields
    if (
      !formData.id ||
      !formData.title ||
      !formData.videoUrl ||
      !formData.videoId
    ) {
      setError(
        'Please fill in all required fields (ID, Title, Video URL, Video ID)',
      )
      setSaving(false)
      return
    }

    // Prepare data for Firebase
    const dataToSave = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
    }

    let result
    if (mode === 'create') {
      result = await createVideo(dataToSave)
    } else {
      // For updates, we need to use the Firestore document ID, not the custom ID
      result = await updateVideo(id, dataToSave)
    }

    if (result.success) {
      navigate('/videos')
    } else {
      setError(result.error || 'Failed to save video')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <>
        <Header />
        <Loading message='Loading video...' />
      </>
    )
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.container}>
        <h1 style={styles.title}>
          {mode === 'create' ? 'Add New Video' : 'Edit Video'}
        </h1>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Basic Information */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Video ID *</label>
            <input
              type='text'
              name='id'
              value={formData.id}
              onChange={handleChange}
              placeholder='e.g., getting-started-actions'
              style={styles.input}
              disabled={mode === 'edit'}
            />
            <small style={styles.helpText}>
              {mode === 'edit'
                ? 'ID cannot be changed after creation'
                : 'Unique identifier (lowercase, hyphens only)'}
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g., How to Get Started with Workflow Designer'
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Brief description of what the video covers...'
              style={styles.textarea}
            />
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Platform *</label>
              <select
                name='platform'
                value={formData.platform}
                onChange={handleChange}
                style={styles.select}
              >
                <option value='youtube'>YouTube</option>
                <option value='vimeo'>Vimeo</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duration *</label>
              <input
                type='text'
                name='duration'
                value={formData.duration}
                onChange={handleChange}
                placeholder='e.g., 7:15'
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Video URL *</label>
            <input
              type='text'
              name='videoUrl'
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder='https://www.youtube.com/watch?v=... or https://player.vimeo.com/video/...'
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Video ID *</label>
            <input
              type='text'
              name='videoId'
              value={formData.videoId}
              onChange={handleChange}
              placeholder='e.g., WvqMUsNTBtY'
              style={styles.input}
            />
            <small style={styles.helpText}>The ID from the video URL</small>
          </div>
        </section>

        {/* Classification */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Classification</h2>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product *</label>
              <select
                name='product'
                value={formData.product}
                onChange={handleChange}
                style={styles.select}
              >
                <option value='actions'>Actions</option>
                <option value='express'>Express</option>
                <option value='insights'>Insights</option>
                <option value='pro'>Pro</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Level *</label>
              <select
                name='level'
                value={formData.level}
                onChange={handleChange}
                style={styles.select}
              >
                <option value='step-by-step'>Step-by-Step</option>
                <option value='intermediate'>Intermediate</option>
                <option value='advanced'>Advanced</option>
                <option value='quick-start'>Quick Start</option>
              </select>
            </div>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <input
                type='text'
                name='category'
                value={formData.category}
                onChange={handleChange}
                placeholder='e.g., Platform Overview'
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Section</label>
              <input
                type='text'
                name='section'
                value={formData.section}
                onChange={handleChange}
                placeholder='e.g., Getting Started'
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tags (comma-separated)</label>
            <input
              type='text'
              name='tags'
              value={formData.tags}
              onChange={handleChange}
              placeholder='basics, getting-started, workflow'
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='featured'
                checked={formData.featured}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Featured Video
            </label>
          </div>
        </section>

        {/* Learning Path */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Learning Path</h2>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type='checkbox'
                checked={formData.learningPath.isPartOfPath}
                onChange={e =>
                  handleLearningPathChange('isPartOfPath', e.target.checked)
                }
                style={styles.checkbox}
              />
              Part of Learning Path
            </label>
          </div>

          {formData.learningPath.isPartOfPath && (
            <>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Path Name</label>
                  <input
                    type='text'
                    value={formData.learningPath.pathName}
                    onChange={e =>
                      handleLearningPathChange('pathName', e.target.value)
                    }
                    placeholder='e.g., Automation Essentials'
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Path ID</label>
                  <input
                    type='text'
                    value={formData.learningPath.pathId}
                    onChange={e =>
                      handleLearningPathChange('pathId', e.target.value)
                    }
                    placeholder='e.g., automation-essentials'
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Order in Path</label>
                <input
                  type='number'
                  value={formData.learningPath.orderInPath}
                  onChange={e =>
                    handleLearningPathChange('orderInPath', e.target.value)
                  }
                  placeholder='e.g., 1'
                  style={styles.input}
                  min='1'
                />
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Previous Video ID</label>
                  <input
                    type='text'
                    value={formData.learningPath.previousVideoId}
                    onChange={e =>
                      handleLearningPathChange(
                        'previousVideoId',
                        e.target.value,
                      )
                    }
                    placeholder='e.g., workflow-basics'
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Next Video ID</label>
                  <input
                    type='text'
                    value={formData.learningPath.nextVideoId}
                    onChange={e =>
                      handleLearningPathChange('nextVideoId', e.target.value)
                    }
                    placeholder='e.g., advanced-triggers'
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}

          {!formData.learningPath.isPartOfPath && (
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Suggested Next Video (Standalone)
              </label>
              <input
                type='text'
                name='suggestedNextVideo'
                value={formData.suggestedNextVideo}
                onChange={handleChange}
                placeholder='e.g., related-video-id'
                style={styles.input}
              />
            </div>
          )}
        </section>

        {/* Template & Learning Content */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Template & Learning Content</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Template Type *</label>
            <select
              name='template'
              value={formData.template}
              onChange={handleChange}
              style={styles.select}
            >
              <option value='instructional'>Instructional</option>
              <option value='summary'>Summary</option>
              <option value='informational'>Informational</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Learning Objectives</label>
            <textarea
              name='learningObjectives'
              value={formData.learningObjectives}
              onChange={handleChange}
              placeholder='After completing this tutorial, you will be able to...'
              style={styles.textareaSmall}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Estimated Time</label>
            <input
              type='text'
              name='estimatedTime'
              value={formData.estimatedTime}
              onChange={handleChange}
              placeholder='e.g., 8-10 minutes'
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Transcript</label>
            <textarea
              name='transcript'
              value={formData.transcript}
              onChange={handleChange}
              placeholder='Enter the full video transcript here...'
              style={styles.textareaLarge}
            />
            <small style={styles.helpText}>
              Full video transcript (optional)
            </small>
          </div>
        </section>

        {/* Tutorial Steps */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Tutorial Steps</h2>
            <button onClick={addStep} style={styles.addButton}>
              + Add Step
            </button>
          </div>

          {formData.tutorialSteps.map((step, index) => (
            <div key={index} style={styles.stepCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Step {step.step}</h3>
                {formData.tutorialSteps.length > 1 && (
                  <button
                    onClick={() => removeStep(index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Step Title</label>
                <input
                  type='text'
                  value={step.title}
                  onChange={e =>
                    handleStepChange(index, 'title', e.target.value)
                  }
                  placeholder='e.g., Navigate the Workflow Designer Interface'
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Step Content</label>
                <textarea
                  value={step.content}
                  onChange={e =>
                    handleStepChange(index, 'content', e.target.value)
                  }
                  placeholder='Describe what the user should do in this step...'
                  style={styles.textarea}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Learning Resources */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Learning Resources</h2>
            <button
              onClick={() => addResource('learning')}
              style={styles.addButton}
            >
              + Add Resource
            </button>
          </div>

          {formData.learningResources.map((resource, index) => (
            <div key={index} style={styles.resourceCardGreen}>
              <div style={styles.cardHeader}>
                <h4 style={styles.resourceTitle}>Resource {index + 1}</h4>
                {formData.learningResources.length > 1 && (
                  <button
                    onClick={() => removeResource('learning', index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type='text'
                value={resource.title}
                onChange={e =>
                  handleResourceChange(
                    'learning',
                    index,
                    'title',
                    e.target.value,
                  )
                }
                placeholder='Resource title'
                style={styles.inputSmall}
              />

              <input
                type='text'
                value={resource.description}
                onChange={e =>
                  handleResourceChange(
                    'learning',
                    index,
                    'description',
                    e.target.value,
                  )
                }
                placeholder='Resource description'
                style={styles.inputSmall}
              />

              <input
                type='text'
                value={resource.link}
                onChange={e =>
                  handleResourceChange(
                    'learning',
                    index,
                    'link',
                    e.target.value,
                  )
                }
                placeholder='https://...'
                style={styles.inputSmall}
              />
            </div>
          ))}
        </section>

        {/* Document Resources */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Documentation Resources</h2>
            <button
              onClick={() => addResource('document')}
              style={styles.addButton}
            >
              + Add Resource
            </button>
          </div>

          {formData.documentResources.map((resource, index) => (
            <div key={index} style={styles.resourceCardBlue}>
              <div style={styles.cardHeader}>
                <h4 style={styles.resourceTitle}>Document {index + 1}</h4>
                {formData.documentResources.length > 1 && (
                  <button
                    onClick={() => removeResource('document', index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type='text'
                value={resource.title}
                onChange={e =>
                  handleResourceChange(
                    'document',
                    index,
                    'title',
                    e.target.value,
                  )
                }
                placeholder='Document title'
                style={styles.inputSmall}
              />

              <input
                type='text'
                value={resource.description}
                onChange={e =>
                  handleResourceChange(
                    'document',
                    index,
                    'description',
                    e.target.value,
                  )
                }
                placeholder='Document description'
                style={styles.inputSmall}
              />

              <input
                type='text'
                value={resource.link}
                onChange={e =>
                  handleResourceChange(
                    'document',
                    index,
                    'link',
                    e.target.value,
                  )
                }
                placeholder='https://...'
                style={styles.inputSmall}
              />
            </div>
          ))}
        </section>

        {/* Submit Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : mode === 'create'
              ? 'Create Video'
              : 'Update Video'}
          </button>
          <button
            onClick={() => navigate('/videos')}
            style={styles.cancelButton}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Styles (same as before)
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '30px',
  },
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
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
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
  labelSmall: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '12px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  inputSmall: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '100px',
    resize: 'vertical',
  },
  textareaSmall: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '80px',
    resize: 'vertical',
  },
  textareaLarge: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '200px',
    resize: 'vertical',
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
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  removeButton: {
    padding: '6px 12px',
    backgroundColor: '#fc8181',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  stepCard: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  resourceCardGreen: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#f0fff4',
    borderRadius: '8px',
    border: '1px solid #c6f6d5',
  },
  resourceCardBlue: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardTitle: {
    margin: '0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
  },
  resourceTitle: {
    margin: '0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    paddingTop: '20px',
    borderTop: '2px solid #e2e8f0',
  },
  submitButton: {
    flex: '1',
    padding: '12px 24px',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: '1',
    padding: '12px 24px',
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

export default VideoForm
