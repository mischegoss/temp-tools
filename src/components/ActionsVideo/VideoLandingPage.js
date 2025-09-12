// @site/src/components/ActionsVideo/VideoLandingPage.js

import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * VideoLandingPage component - Individual video page with template support
 * Supports two templates: 'instructional' (default) and 'informational'
 */
const VideoLandingPage = ({ videoData }) => {
  // Show loading or error state if no video data
  if (!videoData) {
    return (
      <Layout title='Video Not Found' description='Video content not available'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div>
            <h1>Video Not Found</h1>
            <p>Sorry, we couldn't find the video you're looking for.</p>
            <Link
              to='/learning/video-gallery'
              style={{
                color: '#0066FF',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              ← Back to Video Gallery
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Determine template type
  const template = videoData.template || 'instructional'
  const isInformational = template === 'informational'

  // Shared container style
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    width: '100%',
  }

  // Navigation section styles
  const navigationStyle = {
    background: '#F7FAFC',
    padding: '20px 0',
    borderBottom: '1px solid #E2E8F0',
  }

  const breadcrumbStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    color: '#4A5568',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const backLinkStyle = {
    color: '#0066FF',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
  }

  // Content section styles
  const contentSectionStyle = {
    background: '#FFFFFF',
    padding: '60px 0',
  }

  const sectionTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2D3748',
    margin: 0,
    lineHeight: '1.2',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const accentLineStyle = {
    width: '60px',
    height: '4px',
    background: '#008B8B',
    margin: '16px auto 24px',
    borderRadius: '2px',
  }

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#4A5568',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const videoPlayerStyle = {
    maxWidth: '900px',
    margin: '40px auto',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  }

  const iframeStyle = {
    width: '100%',
    height: '506px', // 16:9 ratio for 900px width
    border: 'none',
    display: 'block',
  }

  const metaInfoStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    flexWrap: 'wrap',
  }

  const durationBadgeStyle = {
    background: '#E2E8F0',
    color: '#2D3748',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
  }

  const levelBadgeStyle = {
    background: '#008B8B',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
  }

  const categoryBadgeStyle = {
    background: '#0066FF',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
  }

  // Learning objectives section (instructional only)
  const learningSection = {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
  }

  const learningGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  }

  const learningTitle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  }

  const learningContent = {
    color: '#111827',
    fontWeight: '500',
  }

  // Tutorial/Concepts section styles
  const tutorialSectionStyle = {
    background: '#F7FAFC',
    padding: '80px 0',
  }

  const tutorialTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: '48px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const stepsContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  }

  const stepStyle = {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid var(--color-border-light)',
  }

  const stepHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '16px',
  }

  const stepNumberStyle = {
    background: 'var(--brand-blue)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: '700',
    flexShrink: 0,
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Concept icon for informational template
  const conceptIconStyle = {
    background: '#4A90E2',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    flexShrink: 0,
  }

  const stepTitleStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: 0,
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const stepContentStyle = {
    color: 'var(--color-text-secondary)',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginLeft: '60px',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  // Resources section styles
  const resourcesSection = {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '32px',
    marginTop: '48px',
  }

  const resourcesGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  }

  const resourceTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  }

  const resourceIcon = {
    width: '20px',
    height: '20px',
    color: '#6b7280',
    marginRight: '8px',
  }

  const resourceList = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const resourceItem = {
    marginBottom: '12px',
  }

  const resourceLink = {
    color: '#2563eb',
    textDecoration: 'none',
    display: 'block',
    fontWeight: '500',
  }

  const resourceMeta = {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '2px',
  }

  // Generate embed URL based on platform
  const getEmbedUrl = (videoId, platform) => {
    if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`
    }
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`
  }

  // Get content for the main section based on template
  const getMainContent = () => {
    if (isInformational) {
      return videoData.keyConcepts && videoData.keyConcepts.length > 0
        ? videoData.keyConcepts
        : null
    } else {
      return videoData.tutorialSteps && videoData.tutorialSteps.length > 0
        ? videoData.tutorialSteps
        : null
    }
  }

  const mainContent = getMainContent()

  return (
    <Layout title={videoData.title} description={videoData.description}>
      {/* Navigation/Breadcrumb */}
      <section style={navigationStyle}>
        <div style={containerStyle}>
          <div style={breadcrumbStyle}>
            <Link
              to='/learning/video-gallery'
              style={{ color: 'var(--brand-blue)' }}
            >
              Video Gallery
            </Link>
            <span>›</span>
            <Link
              to='/learning/video-gallery'
              style={{ color: 'var(--brand-blue)' }}
            >
              Video Library
            </Link>
            <span>›</span>
            <span>{videoData.title}</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Link to='/learning/video-gallery' style={backLinkStyle}>
              ← Back to Video Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section style={contentSectionStyle}>
        <div style={containerStyle}>
          {/* Video Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={sectionTitleStyle}>{videoData.title}</h1>
            <div style={accentLineStyle}></div>
            <p style={subtitleStyle}>{videoData.description}</p>
          </div>

          {/* Video Player */}
          <div style={videoPlayerStyle}>
            <BrowserOnly fallback={<div style={iframeStyle} />}>
              {() => (
                <iframe
                  src={getEmbedUrl(videoData.videoId, videoData.platform)}
                  style={iframeStyle}
                  allowFullScreen
                  title={videoData.title}
                />
              )}
            </BrowserOnly>
          </div>

          {/* Video Meta Information */}
          <div style={metaInfoStyle}>
            <span style={durationBadgeStyle}>
              Duration: {videoData.duration}
            </span>
            <span style={levelBadgeStyle}>{videoData.level}</span>
            <span style={categoryBadgeStyle}>{videoData.category}</span>
          </div>

          {/* Learning Objectives & Time (Instructional Only) */}
          {!isInformational && (
            <div style={learningSection}>
              <div style={learningGrid}>
                <div>
                  <h3 style={learningTitle}>What You Will Learn</h3>
                  <p style={learningContent}>
                    {videoData.learningObjectives ||
                      'Master the concepts and techniques covered in this video tutorial.'}
                  </p>
                </div>
                <div>
                  <h3 style={learningTitle}>Estimated Time</h3>
                  <p style={learningContent}>
                    {videoData.estimatedTime || `${videoData.duration} minutes`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tutorial/Concepts Section */}
      {mainContent && (
        <section style={tutorialSectionStyle}>
          <div style={containerStyle}>
            <h2 style={tutorialTitleStyle}>
              {isInformational ? 'Key Concepts' : 'Step-by-Step Tutorial'}
            </h2>
            <div style={stepsContainerStyle}>
              {mainContent.map((item, index) => (
                <div key={index} style={stepStyle}>
                  <div style={stepHeaderStyle}>
                    <div
                      style={
                        isInformational ? conceptIconStyle : stepNumberStyle
                      }
                    >
                      {isInformational
                        ? item.icon || '💡'
                        : item.step || index + 1}
                    </div>
                    <h3 style={stepTitleStyle}>{item.title}</h3>
                  </div>
                  <div style={stepContentStyle}>
                    {typeof item.content === 'string' ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Resources Section */}
            {((videoData.learningResources &&
              videoData.learningResources.length > 0) ||
              (videoData.documentResources &&
                videoData.documentResources.length > 0)) && (
              <div style={resourcesSection}>
                <h2 style={tutorialTitleStyle}>Learn More</h2>
                <div style={resourcesGrid}>
                  {/* Related Documents */}
                  {videoData.documentResources &&
                    videoData.documentResources.length > 0 && (
                      <div>
                        <h3 style={resourceTitle}>
                          <svg
                            style={resourceIcon}
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
                        <ul style={resourceList}>
                          {videoData.documentResources.map(
                            (document, index) => (
                              <li key={index} style={resourceItem}>
                                <a
                                  href={document.link}
                                  style={resourceLink}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {document.title}
                                </a>
                                <div style={resourceMeta}>
                                  {document.description}
                                  {document.type && ` • ${document.type}`}
                                </div>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Related Training */}
                  {videoData.learningResources &&
                    videoData.learningResources.length > 0 && (
                      <div>
                        <h3 style={resourceTitle}>
                          <svg
                            style={resourceIcon}
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
                        <ul style={resourceList}>
                          {videoData.learningResources.map(
                            (resource, index) => (
                              <li key={index} style={resourceItem}>
                                <a
                                  href={resource.link}
                                  style={resourceLink}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {resource.title}
                                </a>
                                <div style={resourceMeta}>
                                  {resource.description}
                                </div>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  )
}

export default VideoLandingPage
