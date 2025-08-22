// @site/src/components/ActionsVideo/VideoLandingPage.js

import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * VideoLandingPage component - Individual video page with player and tutorial
 * FIXED: Updated all navigation links to /learning/video-gallery/
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

  // Tutorial section styles
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

  return (
    <Layout title={videoData.title} description={videoData.description}>
      {/* Navigation/Breadcrumb - FIXED: Updated all links to video-gallery */}
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
              {() => {
                // Generate YouTube embed URL - only runs in browser
                const getEmbedUrl = videoId => {
                  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`
                }

                return (
                  <iframe
                    src={getEmbedUrl(videoData.videoId)}
                    style={iframeStyle}
                    allowFullScreen
                    title={videoData.title}
                  />
                )
              }}
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

      {/* Tutorial Section */}
      {videoData.tutorialSteps && videoData.tutorialSteps.length > 0 && (
        <section style={tutorialSectionStyle}>
          <div style={containerStyle}>
            <h2 style={tutorialTitleStyle}>Step-by-Step Tutorial</h2>
            <div style={stepsContainerStyle}>
              {videoData.tutorialSteps.map((step, index) => (
                <div key={index} style={stepStyle}>
                  <div style={stepHeaderStyle}>
                    <div style={stepNumberStyle}>{step.step || index + 1}</div>
                    <h3 style={stepTitleStyle}>{step.title}</h3>
                  </div>
                  <div style={stepContentStyle}>
                    {typeof step.content === 'string' ? (
                      <p>{step.content}</p>
                    ) : (
                      step.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}

export default VideoLandingPage
