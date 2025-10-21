// src-admin/components/VideoManagement/VideoForm.js

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
    level: 'quick-start', // UPDATED: Changed from 'step-by-step' to 'quick-start'
    category: '',
    section: '',
    product: 'rita-go', // UPDATED: Changed default to 'rita-go'
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
        setFormData(result.data)
      } else {
        setError('Failed to load video: ' + result.error)
      }
    } catch (error) {
      console.error('Error loading video:', error)
      setError('Failed to load video')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadVideo()
    }
  }, [mode, id, loadVideo])

  // Extract video ID from URL
  const extractVideoId = url => {
    try {
      // YouTube patterns
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      const youtubeMatch = url.match(youtubeRegex)
      if (youtubeMatch) {
        return youtubeMatch[1]
      }

      // Vimeo patterns
      const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/
      const vimeoMatch = url.match(vimeoRegex)
      if (vimeoMatch) {
        return vimeoMatch[1]
      }

      return null
    } catch (error) {
      console.error('Error extracting video ID:', error)
      return null
    }
  }

  // Check if custom video ID is unique
  const checkIdUniqueness = async customId => {
    if (!customId || customId.trim() === '') {
      setIdValidation({ checking: false, isValid: null, message: '' })
      return
    }

    setIdValidation({ checking: true, isValid: null, message: 'Checking...' })

    try {
      const result = await searchVideosByTitle(customId, 'id')
      const isDuplicate = result.some(video => video.id === customId)

      if (isDuplicate) {
        setIdValidation({
          checking: false,
          isValid: false,
          message: 'This ID is already taken',
        })
      } else {
        setIdValidation({
          checking: false,
          isValid: true,
          message: 'ID is available',
        })
      }
    } catch (error) {
      console.error('Error checking ID uniqueness:', error)
      setIdValidation({
        checking: false,
        isValid: null,
        message: 'Error checking availability',
      })
    }
  }

  // Debounced ID checking
  useEffect(() => {
    if (mode === 'create') {
      const timer = setTimeout(() => {
        checkIdUniqueness(formData.id)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [formData.id, mode])

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
              placeholder='e.g., create-knowledge-base'
              style={{
                ...styles.input,
                ...(idValidation.isValid === false ? styles.inputError : {}),
                ...(idValidation.isValid === true ? styles.inputSuccess : {}),
              }}
              disabled={mode === 'edit'}
            />
            {idValidation.message && (
              <small
                style={{
                  ...styles.helpText,
                  color:
                    idValidation.isValid === true
                      ? '#38a169'
                      : idValidation.isValid === false
                      ? '#e53e3e'
                      : '#718096',
                }}
              >
                {idValidation.message}
              </small>
            )}
            <small style={styles.helpText}>
              Unique identifier (lowercase, hyphens only). Example:
              "create-knowledge-base"
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g., Create Your Knowledge Base'
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
              rows={3}
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
              placeholder={
                formData.platform === 'vimeo'
                  ? 'https://player.vimeo.com/video/1127035847'
                  : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              }
              style={styles.input}
            />
            <small style={styles.helpText}>
              {formData.platform === 'vimeo'
                ? 'Use the player.vimeo.com format for Vimeo videos'
                : 'Use the regular YouTube watch URL'}
            </small>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Unique URL Code *</label>
              <input
                type='text'
                name='videoId'
                value={formData.videoId}
                onChange={handleChange}
                placeholder={
                  formData.platform === 'vimeo'
                    ? 'e.g., 1127035847'
                    : 'e.g., dQw4w9WgXcQ'
                }
                style={styles.input}
              />
              <small style={styles.helpText}>
                {formData.platform === 'vimeo'
                  ? 'The numeric ID from the Vimeo URL'
                  : 'The ID from the YouTube URL (automatically extracted)'}
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
                placeholder='e.g., 2:00'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Format: MM:SS (e.g., "1:53", "12:45")
              </small>
            </div>

            {/* UPDATED: Show vimeoHash field conditionally for Vimeo videos */}
            {formData.platform === 'vimeo' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Vimeo Hash</label>
                <input
                  type='text'
                  name='vimeoHash'
                  value={formData.vimeoHash}
                  onChange={handleChange}
                  placeholder='e.g., b51ecd9d6e'
                  style={styles.input}
                />
                <small style={styles.helpText}>
                  Hash parameter from Vimeo embed code (after h=). Example:
                  "b51ecd9d6e"
                </small>
              </div>
            )}
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
                <option value='rita-go'>Rita Go</option>
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
                <option value='quick-start'>Quick Start</option>
                <option value='step-by-step'>Step-by-Step</option>
                <option value='deep-dive'>Deep Dive</option>
                <option value='webinar'>Webinar</option>
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
                placeholder='e.g., Rita Go Overview'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Examples: "Rita Go Overview", "Workflow Designer", "Platform
                Overview"
              </small>
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
              <small style={styles.helpText}>
                Examples: "Getting Started", "Workflow Designer", "Advanced
                Features"
              </small>
            </div>
          </div>

          {/* UPDATED: Add Section Order field to UI */}
          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Section Order</label>
              <input
                type='number'
                name='sectionOrder'
                value={formData.sectionOrder}
                onChange={handleChange}
                placeholder='e.g., 1'
                min='0'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Order within the section (0 = first, 1 = second, etc.)
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Estimated Time</label>
              <input
                type='text'
                name='estimatedTime'
                value={formData.estimatedTime}
                onChange={handleChange}
                placeholder='e.g., 5 minutes'
                style={styles.input}
              />
              <small style={styles.helpText}>
                Examples: "5 minutes", "3-4 minutes", "10-15 minutes"
              </small>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tags</label>
            <input
              type='text'
              name='tags'
              value={formData.tags}
              onChange={handleChange}
              placeholder='knowledge-base, setup, configuration'
              style={styles.input}
            />
            <small style={styles.helpText}>
              Comma-separated tags for searchability
            </small>
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
          <h2 style={styles.sectionTitle}>Template & Content</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Template Type *</label>
            <div style={styles.templateSelector}>
              {['instructional', 'summary', 'informational'].map(template => (
                <button
                  key={template}
                  type='button'
                  onClick={() => handleTemplateChange(template)}
                  style={{
                    ...styles.templateButton,
                    ...(formData.template === template
                      ? styles.templateButtonActive
                      : {}),
                  }}
                >
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Learning Objectives</label>
            <textarea
              name='learningObjectives'
              value={formData.learningObjectives}
              onChange={handleChange}
              placeholder='After completing this tutorial, you will be able to...'
              style={styles.textarea}
              rows={3}
            />
          </div>

          {/* Template-specific content */}
          {formData.template === 'instructional' && (
            <div style={styles.templateContent}>
              <h3 style={styles.templateTitle}>Tutorial Steps</h3>
              {formData.tutorialSteps.map((step, index) => (
                <div key={index} style={styles.stepCard}>
                  <div style={styles.cardHeader}>
                    <h4 style={styles.cardTitle}>Step {index + 1}</h4>
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
                    <label style={styles.labelSmall}>Step Title</label>
                    <input
                      type='text'
                      value={step.title}
                      onChange={e =>
                        handleStepChange(index, 'title', e.target.value)
                      }
                      placeholder='e.g., Add While Control to Workflow'
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
                      placeholder='Detailed instructions for this step...'
                      style={styles.textarea}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <button type='button' onClick={addStep} style={styles.addButton}>
                Add Step
              </button>
            </div>
          )}

          {formData.template === 'summary' && (
            <div style={styles.templateContent}>
              <h3 style={styles.templateTitle}>Summary Content</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Summary</label>
                <textarea
                  name='summary'
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder='Comprehensive summary of the video content...'
                  style={styles.textarea}
                  rows={6}
                />
              </div>
            </div>
          )}

          {formData.template === 'informational' && (
            <div style={styles.templateContent}>
              <h3 style={styles.templateTitle}>Key Concepts</h3>
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
                  <div style={styles.gridThree}>
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
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.labelSmall}>Title</label>
                      <input
                        type='text'
                        value={concept.title}
                        onChange={e =>
                          handleConceptChange(index, 'title', e.target.value)
                        }
                        placeholder='Concept name'
                        style={styles.input}
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.labelSmall}>Content</label>
                    <textarea
                      value={concept.content}
                      onChange={e =>
                        handleConceptChange(index, 'content', e.target.value)
                      }
                      placeholder='Explain this concept...'
                      style={styles.textarea}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <button
                type='button'
                onClick={addConcept}
                style={styles.addButton}
              >
                Add Concept
              </button>
            </div>
          )}
        </section>

        {/* Learning Resources */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Learning Resources</h2>
          {formData.learningResources.map((resource, index) => (
            <div key={index} style={styles.resourceCard}>
              <div style={styles.cardHeader}>
                <h4 style={styles.resourceTitle}>
                  Learning Resource {index + 1}
                </h4>
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

              <div style={styles.gridTwo}>
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
                    placeholder='e.g., Automation Essentials'
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
                    placeholder='/learning/actions'
                    style={styles.input}
                  />
                </div>
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
            </div>
          ))}
          <button
            type='button'
            onClick={() => addResource('learning')}
            style={styles.addButton}
          >
            Add Learning Resource
          </button>
        </section>

        {/* Document Resources */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Document Resources</h2>
          {formData.documentResources.map((document, index) => (
            <div key={index} style={styles.documentCard}>
              <div style={styles.cardHeader}>
                <h4 style={styles.resourceTitle}>
                  Document Resource {index + 1}
                </h4>
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

              <div style={styles.gridTwo}>
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
            </div>
          ))}
          <button
            type='button'
            onClick={() => addResource('document')}
            style={styles.addButton}
          >
            Add Document Resource
          </button>
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
    backgroundColor: '#f7fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e2e8f0',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0',
  },
  editingNote: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
  },
  backButton: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '24px',
    borderBottom: '2px solid #4299e1',
    paddingBottom: '8px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4a5568',
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
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#2d3748',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  inputSuccess: {
    borderColor: '#38a169',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#2d3748',
    backgroundColor: '#ffffff',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#2d3748',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  helpText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
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
  gridThree: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  templateSelector: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  templateButton: {
    padding: '10px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  templateButtonActive: {
    borderColor: '#4299e1',
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
  },
  templateContent: {
    marginTop: '20px',
  },
  templateTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '16px',
  },
  stepCard: {
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
  },
  conceptCard: {
    backgroundColor: '#f0fff4',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #c6f6d5',
  },
  resourceCard: {
    backgroundColor: '#f0fff4',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #c6f6d5',
  },
  documentCard: {
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #bee3f8',
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
