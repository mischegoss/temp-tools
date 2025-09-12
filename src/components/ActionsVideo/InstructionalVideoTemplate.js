// @site/src/components/ActionsVideo/InstructionalVideoTemplate.js

import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * InstructionalVideoTemplate - Props-driven instructional video template
 * Rebuilt using InformationalVideoTemplate structure with instructional-specific content
 */
const InstructionalVideoTemplate = ({ videoData }) => {
  // Handle missing video data
  if (!videoData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1>Video Not Found</h1>
        <p>The requested video could not be found.</p>
      </div>
    )
  }

  const styles = {
    container: {
      maxWidth: '896px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
    },
    backButton: {
      color: '#3b82f6',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none',
      marginBottom: '32px',
      display: 'inline-block',
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '16px',
    },
    divider: {
      width: '64px',
      height: '4px',
      backgroundColor: '#14b8a6',
      margin: '0 auto 24px auto',
    },
    description: {
      color: '#6b7280',
      fontSize: '18px',
      lineHeight: '1.75',
      maxWidth: '512px',
      margin: '0 auto',
    },
    videoContainer: {
      marginBottom: '32px',
    },
    videoPlayer: {
      backgroundColor: '#111827',
      borderRadius: '8px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      position: 'relative',
      minHeight: '300px',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    videoTags: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px',
      flexWrap: 'wrap',
    },
    tag: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
    },
    tagGray: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    tagTeal: {
      backgroundColor: '#ccfbf1',
      color: '#115e59',
    },
    tagBlue: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
    learningSection: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      margin: '32px 0',
    },
    learningGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
    },
    learningTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '8px',
    },
    learningContent: {
      color: '#111827',
      fontWeight: '500',
    },
    tutorialSection: {
      background: '#F7FAFC',
      padding: '80px 0',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      textAlign: 'center',
      marginBottom: '32px',
    },
    stepsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    stepCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
    },
    stepHeader: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    stepNumber: {
      flexShrink: 0,
      width: '32px',
      height: '32px',
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '14px',
      marginRight: '16px',
    },
    stepContent: {
      flexGrow: 1,
    },
    stepTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    stepDescription: {
      color: '#6b7280',
      lineHeight: '1.75',
    },
    resourcesSection: {
      background: 'white',
      padding: '80px 0',
    },
    learnMoreSection: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '32px',
      marginTop: '48px',
    },
    resourcesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    resourceTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    resourceIcon: {
      width: '20px',
      height: '20px',
      color: '#6b7280',
      marginRight: '8px',
    },
    resourceList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    resourceItem: {
      marginBottom: '12px',
    },
    resourceLink: {
      color: '#2563eb',
      textDecoration: 'none',
      display: 'block',
      fontWeight: '500',
    },
    resourceMeta: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '2px',
    },
  }

  // Generate embed URL based on platform
  const getEmbedUrl = (videoId, platform) => {
    if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`
    }
    // Default to YouTube
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${
      typeof window !== 'undefined' ? window.location.origin : ''
    }&rel=0&modestbranding=1`
  }

  return (
    <div style={styles.container}>
      {/* Back to Video Gallery */}
      <div style={{ marginBottom: '32px' }}>
        <a href='/learning/video-gallery' style={styles.backButton}>
          ← Back to Video Gallery
        </a>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{videoData.title}</h1>
        <div style={styles.divider}></div>
        <p style={styles.description}>{videoData.description}</p>
      </div>

      {/* Video Player */}
      <div style={styles.videoContainer}>
        <div style={styles.videoPlayer}>
          <BrowserOnly
            fallback={
              <div
                style={{ ...styles.videoPlayer, backgroundColor: '#111827' }}
              />
            }
          >
            {() => (
              <iframe
                src={getEmbedUrl(videoData.videoId, videoData.platform)}
                style={styles.iframe}
                allowFullScreen
                title={videoData.title}
              />
            )}
          </BrowserOnly>
        </div>

        {/* Video Tags */}
        <div style={styles.videoTags}>
          <span style={{ ...styles.tag, ...styles.tagGray }}>
            Duration: {videoData.duration}
          </span>
          <span style={{ ...styles.tag, ...styles.tagTeal }}>
            {videoData.level}
          </span>
          <span style={{ ...styles.tag, ...styles.tagBlue }}>
            {videoData.category}
          </span>
        </div>
      </div>

      {/* Learning Objectives & Time (Instructional Only) */}
      <div style={styles.learningSection}>
        <div style={styles.learningGrid}>
          <div>
            <h3 style={styles.learningTitle}>What You Will Learn</h3>
            <p style={styles.learningContent}>
              {videoData.learningObjectives ||
                'Master the concepts and techniques covered in this video tutorial.'}
            </p>
          </div>
          <div>
            <h3 style={styles.learningTitle}>Estimated Time</h3>
            <p style={styles.learningContent}>
              {videoData.estimatedTime || `${videoData.duration} minutes`}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Tutorial Section */}
      {videoData.tutorialSteps && videoData.tutorialSteps.length > 0 && (
        <section style={styles.tutorialSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Step-by-Step Tutorial</h2>
            <div style={styles.stepsContainer}>
              {videoData.tutorialSteps.map((step, index) => (
                <div key={index} style={styles.stepCard}>
                  <div style={styles.stepHeader}>
                    <div style={styles.stepNumber}>
                      {step.step || index + 1}
                    </div>
                    <div style={styles.stepContent}>
                      <h3 style={styles.stepTitle}>{step.title}</h3>
                      <p style={styles.stepDescription}>
                        {typeof step.content === 'string'
                          ? step.content
                          : step.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learn More Section */}
      {((videoData.learningResources &&
        videoData.learningResources.length > 0) ||
        (videoData.documentResources &&
          videoData.documentResources.length > 0)) && (
        <section style={styles.resourcesSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Learn More</h2>
            <div style={styles.resourcesGrid}>
              {/* Related Documents */}
              {videoData.documentResources &&
                videoData.documentResources.length > 0 && (
                  <div>
                    <h3 style={styles.resourceTitle}>
                      <svg
                        style={styles.resourceIcon}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      Related Documents
                    </h3>
                    <ul style={styles.resourceList}>
                      {videoData.documentResources.map((document, index) => (
                        <li key={index} style={styles.resourceItem}>
                          <a
                            href={document.link}
                            style={styles.resourceLink}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {document.title}
                          </a>
                          <div style={styles.resourceMeta}>
                            {document.description}
                            {document.type && ` • ${document.type}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Related Training */}
              {videoData.learningResources &&
                videoData.learningResources.length > 0 && (
                  <div>
                    <h3 style={styles.resourceTitle}>
                      <svg
                        style={styles.resourceIcon}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                        />
                      </svg>
                      Related Training
                    </h3>
                    <ul style={styles.resourceList}>
                      {videoData.learningResources.map((resource, index) => (
                        <li key={index} style={styles.resourceItem}>
                          <a
                            href={resource.link}
                            style={styles.resourceLink}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {resource.title}
                          </a>
                          <div style={styles.resourceMeta}>
                            {resource.description}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default InstructionalVideoTemplate
