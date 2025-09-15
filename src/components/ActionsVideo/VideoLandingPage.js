// @site/src/components/ActionsVideo/VideoLandingPage.js

import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'

// Import template-specific content components
import InstructionalContent from './templates/InstructionalContent.js'
import SummaryContent from './templates/SummaryContent.js'
import InformationalContent from './templates/InformationalContent.js'

/**
 * VideoLandingPage component - Individual video page with template support
 * Supports three templates: 'instructional', 'summary', and 'informational'
 * RESTRUCTURED: Template-specific content extracted to separate components
 */
const VideoLandingPage = ({ videoData }) => {
  console.log('=== VideoLandingPage received videoData ===', !!videoData)
  console.log('VideoLandingPage videoData:', videoData)

  // Show loading or error state if no video data
  if (!videoData) {
    console.log('VideoLandingPage: No videoData, showing error state')
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

  console.log('VideoLandingPage: videoData exists, proceeding with render')

  // Template switcher - renders appropriate content component based on template field
  const renderTemplateContent = () => {
    const template = videoData.template || 'instructional'

    console.log('=== VideoLandingPage renderTemplateContent ===')
    console.log('videoData received:', !!videoData)
    console.log('template value:', template)
    console.log('videoData.template:', videoData.template)
    console.log('About to render template component...')

    switch (template) {
      case 'instructional':
        console.log('Rendering InstructionalContent')
        return <InstructionalContent videoData={videoData} />
      case 'summary':
        console.log('Rendering SummaryContent')
        return <SummaryContent videoData={videoData} />
      case 'informational':
        console.log('Rendering InformationalContent')
        return <InformationalContent videoData={videoData} />
      default:
        console.log('Rendering default InstructionalContent')
        return <InstructionalContent videoData={videoData} />
    }
  }

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

  // Template content section styles
  const templateSectionStyle = {
    background: '#F7FAFC',
    padding: '80px 0',
  }

  // Resources section styles (FIXED: Now shows for all templates)
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
    fontSize: '1.375rem',
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const resourceIcon = {
    width: '24px',
    height: '24px',
    color: '#4A5568',
    marginRight: '12px',
  }

  const resourceList = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const resourceItem = {
    marginBottom: '20px',
  }

  const resourceLink = {
    color: '#0066FF',
    textDecoration: 'none',
    display: 'block',
    fontWeight: '600',
    fontSize: '1.125rem',
    lineHeight: '1.6',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const resourceMeta = {
    fontSize: '1rem',
    color: '#4A5568',
    marginTop: '6px',
    lineHeight: '1.6',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const resourcesSectionTitle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: '48px',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  // Generate embed URL based on platform
  const getEmbedUrl = (videoId, platform) => {
    if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`
    }
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`
  }

  // Check if resources exist
  const hasResources =
    (videoData.learningResources && videoData.learningResources.length > 0) ||
    (videoData.documentResources && videoData.documentResources.length > 0)

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
        </div>
      </section>

      {/* Template-Specific Content Section */}
      <section style={templateSectionStyle}>
        <div style={containerStyle}>{renderTemplateContent()}</div>
      </section>

      {/* Resources Section - FIXED: Shows for ALL templates */}
      {hasResources && (
        <section style={{ background: '#F7FAFC', paddingBottom: '80px' }}>
          <div style={containerStyle}>
            <div style={resourcesSection}>
              <h2 style={resourcesSectionTitle}>Learn More</h2>
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
                        {videoData.documentResources.map((document, index) => (
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
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Learning Resources */}
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
                        {videoData.learningResources.map((resource, index) => (
                          <li key={index} style={resourceItem}>
                            <a href={resource.link} style={resourceLink}>
                              {resource.title}
                            </a>
                            <div style={resourceMeta}>
                              {resource.description}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}

export default VideoLandingPage
