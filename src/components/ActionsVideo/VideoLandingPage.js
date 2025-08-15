// @site/src/components/ActionsVideo/VideoLandingPage.js

import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  learningHubSectionStyle,
  containerStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * VideoLandingPage component - Individual video landing page
 * Fixed for SSR compatibility using BrowserOnly
 */
const VideoLandingPage = ({ videoData }) => {
  // Handle missing video data
  if (!videoData) {
    return (
      <Layout
        title='Video Not Found'
        description='The requested video could not be found.'
      >
        <div style={containerStyle}>
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h1>Video Not Found</h1>
            <p>The requested video could not be found.</p>
            <Link
              to='/learning/actions-videos'
              style={{
                background: 'var(--brand-blue)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
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

  // Styles
  const navigationStyle = {
    background: 'var(--brand-grey-100)',
    padding: '20px 0',
    borderBottom: '1px solid var(--color-border-light)',
  }

  const breadcrumbStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.95rem',
    color: 'var(--brand-grey-600)',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const backLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'var(--brand-blue)',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  }

  const contentSectionStyle = {
    padding: '60px 0',
    background: 'var(--color-bg-card-light)',
  }

  const sectionTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '0 0 16px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const accentLineStyle = {
    width: '60px',
    height: '4px',
    background: 'var(--brand-blue)',
    margin: '0 auto 24px auto',
  }

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    margin: '0 0 40px 0',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const videoPlayerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto 40px auto',
    paddingBottom: '50.625%', // 16:9 aspect ratio
    background: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  }

  const metaInfoStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  }

  const metaBadgeStyle = {
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '0.95rem',
    fontWeight: '500',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const durationBadgeStyle = {
    ...metaBadgeStyle,
    background: 'var(--brand-grey-100)',
    color: 'var(--brand-grey-600)',
  }

  const categoryBadgeStyle = {
    ...metaBadgeStyle,
    background: 'var(--brand-blue-100)',
    color: 'var(--brand-blue)',
  }

  // Helper function for level badge colors
  function getLevelBadgeColor(level) {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4A90E2'
      case 'intermediate':
        return '#1E3A8A'
      case 'advanced':
        return '#008B8B'
      default:
        return '#008B8B'
    }
  }

  const levelBadgeStyle = {
    ...metaBadgeStyle,
    background: getLevelBadgeColor(videoData.level),
    color: 'white',
  }

  // Tutorial section styles
  const tutorialSectionStyle = {
    padding: '80px 0',
    background: 'var(--brand-grey-50)',
  }

  const tutorialTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    margin: '0 0 50px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const stepsContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
  }

  const stepStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
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
      {/* Navigation/Breadcrumb */}
      <section style={navigationStyle}>
        <div style={containerStyle}>
          <div style={breadcrumbStyle}>
            <Link
              to='/learning/actions-videos'
              style={{ color: 'var(--brand-blue)' }}
            >
              Actions Learning
            </Link>
            <span>›</span>
            <Link
              to='/learning/actions-videos'
              style={{ color: 'var(--brand-blue)' }}
            >
              Video Library
            </Link>
            <span>›</span>
            <span>{videoData.title}</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Link to='/learning/actions-videos' style={backLinkStyle}>
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
