// src/components/VideoManagement/VideoForm.js

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../Shared/Header'
import Loading from '../Shared/Loading'
import ErrorMessage from '../Shared/ErrorMessage'
import {
  createVideo,
  updateVideo,
  getVideo,
  searchVideosByTitle,
} from '../../firebase/firestore'

/**
 * VideoForm Component
 * Form for creating and editing videos with template support
 *
 * Props:
 * - mode: 'create' or 'edit'
 */
const VideoForm = ({ mode = 'create' }) => {
  const navigate = useNavigate()
  const { id } = useParams() // This is the firestoreId when editing
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
    vimeoHash: '',
    sectionOrder: 0,
    publishDate: '',
    template: 'instructional',
    learningObjectives: '',
    estimatedTime: '',
    transcript: '',
    // Template-specific fields
    tutorialSteps: [{ step: 1, title: '', content: '' }],
    summary: '',
    keyConcepts: [{ title: '', content: '', icon: '💡' }],
    // Resources
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

  const [idValidation, setIdValidation] = useState({
    checking: false,
    isValid: null,
    message: '',
  })

  // Icon picker options
  const iconOptions = [
    '💡',
    '🔧',
    '📊',
    '🎯',
    '🚀',
    '⚡',
    '🔑',
    '📋',
    '🎨',
    '🔍',
    '💪',
    '🌟',
    '📈',
    '🛠️',
    '💎',
    '🔥',
  ]

  // Load video data if editing
  const loadVideo = useCallback(async () => {
    try {
      // Use the firestoreId from URL params to get video
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
  }, [id])

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadVideo()
    }
  }, [mode, id, loadVideo])

  // Function to check if Custom Video ID is unique
  const checkIdUniqueness = useCallback(
    async id => {
      if (!id || mode === 'edit') return // Skip check for edit mode

      setIdValidation({ checking: true, isValid: null, message: 'Checking...' })

      try {
        const result = await searchVideosByTitle(id)
        if (result.success) {
          const exists = result.data.some(
            video => video.id === id || video.customId === id,
          )
          if (exists) {
            setIdValidation({
              checking: false,
              isValid: false,
              message: 'This ID already exists. Please choose a different one.',
            })
          } else {
            setIdValidation({
              checking: false,
              isValid: true,
              message: 'ID is available ✓',
            })
          }
        }
      } catch (error) {
        setIdValidation({
          checking: false,
          isValid: null,
          message: 'Could not verify uniqueness',
        })
      }
    },
    [mode],
  )

  // Debounced ID checking
  useEffect(() => {
    if (!formData.id || mode === 'edit') return

    const timeoutId = setTimeout(() => {
      checkIdUniqueness(formData.id)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [formData.id, mode, checkIdUniqueness])

  // Function to extract video ID from URL
  const extractVideoId = url => {
    if (!url) return ''

    // YouTube pattern: extract ID after v=
    const youtubeMatch = url.match(/[?&]v=([^&]+)/)
    if (youtubeMatch) {
      return youtubeMatch[1]
    }

    // Vimeo pattern: extract first number sequence after vimeo.com/
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return vimeoMatch[1]
    }

    return ''
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Auto-extract video ID when Video URL changes
    if (name === 'videoUrl' && value) {
      const extractedId = extractVideoId(value)
      if (extractedId) {
        setFormData(prev => ({
          ...prev,
          videoId: extractedId,
        }))
      }
    }
  }

  const handleTemplateChange = newTemplate => {
    if (formData.template !== newTemplate) {
      const hasContent = checkForTemplateContent()

      if (
        hasContent &&
        !window.confirm(
          'Switching templates will clear template-specific content. Are you sure you want to continue?',
        )
      ) {
        return
      }

      setFormData(prev => ({
        ...prev,
        template: newTemplate,
        // Reset template-specific fields
        tutorialSteps: [{ step: 1, title: '', content: '' }],
        summary: '',
        keyConcepts: [{ title: '', content: '', icon: '💡' }],
      }))
    }
  }

  const checkForTemplateContent = () => {
    switch (formData.template) {
      case 'instructional':
        return formData.tutorialSteps.some(step => step.title || step.content)
      case 'summary':
        return formData.summary.trim().length > 0
      case 'informational':
        return formData.keyConcepts.some(
          concept => concept.title || concept.content,
        )
      default:
        return false
    }
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

  const handleConceptChange = (index, field, value) => {
    const newConcepts = [...formData.keyConcepts]
    newConcepts[index] = { ...newConcepts[index], [field]: value }
    setFormData(prev => ({ ...prev, keyConcepts: newConcepts }))
  }

  const addConcept = () => {
    setFormData(prev => ({
      ...prev,
      keyConcepts: [
        ...prev.keyConcepts,
        { title: '', content: '', icon: '💡' },
      ],
    }))
  }

  const removeConcept = index => {
    setFormData(prev => ({
      ...prev,
      keyConcepts: prev.keyConcepts.filter((_, i) => i !== index),
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

  const validateTemplateFields = () => {
    switch (formData.template) {
      case 'instructional':
        return formData.tutorialSteps.some(step => step.title && step.content)
      case 'summary':
        return formData.summary.trim().length > 0
      case 'informational':
        return formData.keyConcepts.some(
          concept => concept.title && concept.content,
        )
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setError('')
    setSaving(true)

    // Validate required fields
    if (
      !formData.id ||
      !formData.title ||
      !formData.description ||
      !formData.videoUrl ||
      !formData.videoId ||
      !formData.category
    ) {
      setError(
        'Please fill in all required fields (Custom Video ID, Title, Description, Video URL, Unique URL Code, Category)',
      )
      setSaving(false)
      return
    }

    // Check ID uniqueness for create mode
    if (mode === 'create' && idValidation.isValid === false) {
      setError('Custom Video ID already exists. Please choose a different one.')
      setSaving(false)
      return
    }

    // Validate template-specific fields
    if (!validateTemplateFields()) {
      let templateError = ''
      switch (formData.template) {
        case 'instructional':
          templateError =
            'Please add at least one tutorial step with title and content.'
          break
        case 'summary':
          templateError = 'Please provide summary content.'
          break
        case 'informational':
          templateError =
            'Please add at least one key concept with title and content.'
          break
      }
      setError(templateError)
      setSaving(false)
      return
    }

    // Prepare data for Firebase
    const dataToSave = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [],
    }

    // Create or update
    const result =
      mode === 'create'
        ? await createVideo(dataToSave)
        : await updateVideo(id, dataToSave)

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
            <h1 style={styles.pageTitle}>
              {mode === 'create' ? 'Create New Video' : 'Edit Video'}
            </h1>
            {mode === 'edit' && (
              <p style={styles.editingNote}>
                Editing: {formData.title || 'Untitled Video'}
              </p>
            )}
          </div>
          <button style={styles.backButton} onClick={() => navigate('/videos')}>
            ← Back to Videos
          </button>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Basic Information */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Custom Video ID *</label>
            <input
              type='text'
              name='id'
              value={formData.id}
              onChange={handleChange}
              placeholder='e.g., getting-started-workflow'
              style={{
                ...styles.input,
                ...(idValidation.isValid === false ? styles.inputError : {}),
                ...(idValidation.isValid === true ? styles.inputSuccess : {}),
              }}
              disabled={mode === 'edit'}
            />
            {idValidation.checking && (
              <small style={styles.validationChecking}>
                {idValidation.message}
              </small>
            )}
            {idValidation.isValid === false && (
              <small style={styles.validationError}>
                {idValidation.message}
              </small>
            )}
            {idValidation.isValid === true && (
              <small style={styles.validationSuccess}>
                {idValidation.message}
              </small>
            )}
            <small style={styles.helpText}>
              Lowercase with hyphens, used in URLs (cannot be changed after
              creation)
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g., Getting Started with Workflow Builder'
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Brief description of what this video teaches...'
              style={styles.textareaSmall}
            />
          </div>
        </section>

        {/* Video Details */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Video Details</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Video URL *</label>
            <input
              type='url'
              name='videoUrl'
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder='https://www.youtube.com/watch?v=... or https://vimeo.com/...'
              style={styles.input}
            />
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Unique URL Code *</label>
              <input
                type='text'
                name='videoId'
                value={formData.videoId}
                onChange={handleChange}
                placeholder='Auto-extracted from URL'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Automatically extracted from the video URL
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Platform</label>
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
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Duration</label>
              <input
                type='text'
                name='duration'
                value={formData.duration}
                onChange={handleChange}
                placeholder='e.g., 5:30'
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Vimeo Hash</label>
              <input
                type='text'
                name='vimeoHash'
                value={formData.vimeoHash}
                onChange={handleChange}
                placeholder='e.g., abc123def456 (for private Vimeo videos)'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Required for private Vimeo videos (leave empty for public
                videos)
              </small>
            </div>
          </div>
        </section>

        {/* Organization */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Organization</h2>

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
              <label style={styles.label}>Display Category (badge) *</label>
              <input
                type='text'
                name='category'
                value={formData.category}
                onChange={handleChange}
                placeholder='e.g., Platform Overview'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Shown as a badge on the video detail page
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gallery Section (grouping)</label>
              <input
                type='text'
                name='section'
                value={formData.section}
                onChange={handleChange}
                placeholder='e.g., Getting Started'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Used to group videos in the gallery. If empty, will use the
                Display Category for grouping.
              </small>
            </div>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Section Order</label>
              <input
                type='number'
                name='sectionOrder'
                value={formData.sectionOrder}
                onChange={handleChange}
                placeholder='0'
                style={styles.input}
                min='0'
              />
              <small style={styles.helpText}>
                Lower numbers appear first in the gallery (0 = first)
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Publish Date</label>
              <input
                type='date'
                name='publishDate'
                value={formData.publishDate}
                onChange={handleChange}
                style={styles.input}
              />
              <small style={styles.helpText}>
                When this video was published (used for sorting and AI search)
              </small>
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

        {/* Template Selection */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Video Template *</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Template Type *</label>
            <div style={styles.templateGrid}>
              <div
                style={{
                  ...styles.templateCard,
                  ...(formData.template === 'instructional'
                    ? styles.templateCardActive
                    : {}),
                }}
                onClick={() => handleTemplateChange('instructional')}
              >
                <h4 style={styles.templateTitle}>📚 Instructional</h4>
                <p style={styles.templateDescription}>
                  Step-by-step tutorials with learning objectives and detailed
                  steps
                </p>
              </div>

              <div
                style={{
                  ...styles.templateCard,
                  ...(formData.template === 'summary'
                    ? styles.templateCardActive
                    : {}),
                }}
                onClick={() => handleTemplateChange('summary')}
              >
                <h4 style={styles.templateTitle}>📋 Summary</h4>
                <p style={styles.templateDescription}>
                  Overview videos with concise summary content
                </p>
              </div>

              <div
                style={{
                  ...styles.templateCard,
                  ...(formData.template === 'informational'
                    ? styles.templateCardActive
                    : {}),
                }}
                onClick={() => handleTemplateChange('informational')}
              >
                <h4 style={styles.templateTitle}>🔍 Informational</h4>
                <p style={styles.templateDescription}>
                  Concept explanations with key points and insights
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Template Content */}
        {formData.template === 'instructional' && (
          <>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Instructional Content</h2>

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
            </section>

            {/* Tutorial Steps */}
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Tutorial Steps *</h2>
                <button
                  type='button'
                  onClick={addStep}
                  style={styles.addButton}
                >
                  + Add Step
                </button>
              </div>

              {formData.tutorialSteps.map((step, index) => (
                <div key={index} style={styles.stepCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Step {step.step}</h3>
                    {formData.tutorialSteps.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeStep(index)}
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.labelSmall}>Step Title *</label>
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
                    <label style={styles.labelSmall}>Step Content *</label>
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
          </>
        )}

        {formData.template === 'summary' && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Summary Content</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Summary *</label>
              <textarea
                name='summary'
                value={formData.summary}
                onChange={handleChange}
                placeholder='Provide a comprehensive summary of the video content...'
                style={styles.textareaLarge}
              />
            </div>
          </section>
        )}

        {formData.template === 'informational' && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Key Concepts *</h2>
              <button
                type='button'
                onClick={addConcept}
                style={styles.addButton}
              >
                + Add Concept
              </button>
            </div>

            {formData.keyConcepts.map((concept, index) => (
              <div key={index} style={styles.conceptCard}>
                <div style={styles.cardHeader}>
                  <h4 style={styles.cardTitle}>Concept {index + 1}</h4>
                  {formData.keyConcepts.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeConcept(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={styles.gridTwo}>
                  <div style={styles.formGroup}>
                    <label style={styles.labelSmall}>Icon</label>
                    <select
                      value={concept.icon}
                      onChange={e =>
                        handleConceptChange(index, 'icon', e.target.value)
                      }
                      style={styles.select}
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>
                          {icon} {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.labelSmall}>Concept Title *</label>
                    <input
                      type='text'
                      value={concept.title}
                      onChange={e =>
                        handleConceptChange(index, 'title', e.target.value)
                      }
                      placeholder='e.g., Workflow Triggers'
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.labelSmall}>Concept Content *</label>
                  <textarea
                    value={concept.content}
                    onChange={e =>
                      handleConceptChange(index, 'content', e.target.value)
                    }
                    placeholder='Explain this key concept...'
                    style={styles.textarea}
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Transcript */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Additional Content</h2>

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
                  <label style={styles.label}>Path Name *</label>
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
                  <label style={styles.label}>Path ID *</label>
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
                <label style={styles.label}>Order in Path *</label>
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
                  <small style={styles.helpText}>
                    You can find the id by viewing All Videos
                  </small>
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
              <small style={styles.helpText}>
                You can find the id by viewing All Videos
              </small>
            </div>
          )}
        </section>

        {/* Learning Resources */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Learning Resources</h2>
            <button
              type='button'
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
                    type='button'
                    onClick={() => removeResource('learning', index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Title</label>
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
                  placeholder='Resource name'
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Description</label>
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
                  placeholder='Brief description'
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Link</label>
                <input
                  type='url'
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
                  style={styles.input}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Document Resources */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Document Resources</h2>
            <button
              type='button'
              onClick={() => addResource('document')}
              style={styles.addButton}
            >
              + Add Resource
            </button>
          </div>

          {formData.documentResources.map((document, index) => (
            <div key={index} style={styles.resourceCardBlue}>
              <div style={styles.cardHeader}>
                <h4 style={styles.resourceTitle}>Document {index + 1}</h4>
                {formData.documentResources.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeResource('document', index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Title</label>
                <input
                  type='text'
                  value={document.title}
                  onChange={e =>
                    handleResourceChange(
                      'document',
                      index,
                      'title',
                      e.target.value,
                    )
                  }
                  placeholder='Document name'
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Description</label>
                <input
                  type='text'
                  value={document.description}
                  onChange={e =>
                    handleResourceChange(
                      'document',
                      index,
                      'description',
                      e.target.value,
                    )
                  }
                  placeholder='Brief description'
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelSmall}>Link</label>
                <input
                  type='url'
                  value={document.link}
                  onChange={e =>
                    handleResourceChange(
                      'document',
                      index,
                      'link',
                      e.target.value,
                    )
                  }
                  placeholder='https://...'
                  style={styles.input}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Submit Section */}
        <section style={styles.submitSection}>
          <div style={styles.buttonGroup}>
            <button
              type='button'
              onClick={() => navigate('/videos')}
              style={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              style={{
                ...styles.submitButton,
                ...(saving ? styles.submitButtonDisabled : {}),
              }}
              disabled={saving}
            >
              {saving
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                ? 'Create Video'
                : 'Save Changes'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

// Styles
const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px 40px 20px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    paddingTop: '30px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0',
  },
  editingNote: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
  },
  backButton: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
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
    marginBottom: '6px',
    fontWeight: '500',
    color: '#4a5568',
    fontSize: '13px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#f56565',
    backgroundColor: '#fed7d7',
  },
  inputSuccess: {
    borderColor: '#48bb78',
    backgroundColor: '#c6f6d5',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
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
    minHeight: '150px',
    resize: 'vertical',
  },
  helpText: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#718096',
  },
  validationChecking: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#4a5568',
  },
  validationError: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#e53e3e',
  },
  validationSuccess: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#38a169',
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
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  templateCard: {
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#ffffff',
  },
  templateCardActive: {
    borderColor: '#4299e1',
    backgroundColor: '#ebf8ff',
  },
  templateTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
  },
  templateDescription: {
    margin: 0,
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.5',
  },
  stepCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  conceptCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  resourceCardGreen: {
    backgroundColor: '#f0fff4',
    border: '1px solid #c6f6d5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  resourceCardBlue: {
    backgroundColor: '#ebf8ff',
    border: '1px solid #bee3f8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
  },
  resourceTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
  },
  addButton: {
    backgroundColor: '#4299e1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  submitSection: {
    borderTop: '2px solid #e2e8f0',
    paddingTop: '30px',
    marginTop: '40px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#38a169',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
  },
}

export default VideoForm
