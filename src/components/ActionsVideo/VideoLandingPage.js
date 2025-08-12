// @site/src/components/Actions/VideoLandingPage.js

import React from 'react'
import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import {
  learningHubSectionStyle,
  containerStyle,
  sectionTitleStyle,
  subtitleStyle,
  createAccentLineStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme
const actionsTheme = getColorTheme('actions')
const accentLineStyle = createAccentLineStyle(actionsTheme.primary)

/**
 * VideoLandingPage component - Dynamic landing page for individual videos
 * Uses video ID to look up video data and render tutorial content
 */
const VideoLandingPage = ({ videoData }) => {
  if (!videoData) {
    return (
      <Layout title='Video Not Found' description='Video not found'>
        <section style={learningHubSectionStyle}>
          <div style={containerStyle}>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h1 style={sectionTitleStyle}>Video Not Found</h1>
              <div style={accentLineStyle}></div>
              <p style={subtitleStyle}>
                The video you're looking for doesn't exist or has been moved.
              </p>
              <Link
                to='/learning/actions/videos'
                style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  padding: '12px 24px',
                  background: 'var(--brand-blue)',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Back to Video Gallery
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  // Main content styles
  const contentSectionStyle = {
    ...learningHubSectionStyle,
    padding: '40px 0',
  }

  const videoPlayerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto 40px auto',
    paddingBottom: '50.625%', // 16:9 aspect ratio
    height: 0,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
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
    alignItems: 'center',
    gap: '24px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  }

  const metaBadgeStyle = {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const levelBadgeStyle = {
    ...metaBadgeStyle,
    background: getLevelBadgeColor(videoData.level),
    color: 'white',
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

  // Tutorial section styles
  const tutorialSectionStyle = {
    background: 'var(--brand-grey-100)',
    padding: '60px 0',
    marginTop: '40px',
  }

  const tutorialTitleStyle = {
    fontSize: '2.25rem',
    fontWeight: '600',
    color: 'var(--brand-black-700)',
    margin: '0 0 24px 0',
    fontFamily: 'var(--ifm-font-family-heading)',
    textAlign: 'center',
  }

  const stepsContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
  }

  const stepStyle = {
    background: 'var(--brand-white)',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid var(--brand-grey-200)',
  }

  const stepHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  }

  const stepNumberStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--brand-blue)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    marginRight: '16px',
  }

  const stepTitleStyle = {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: 'var(--brand-black-700)',
    margin: 0,
    fontFamily: 'var(--ifm-font-family-heading)',
  }

  const stepContentStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'var(--brand-grey-600)',
    margin: 0,
    fontFamily: 'var(--ifm-font-family-base)',
  }

  // Navigation styles
  const navigationStyle = {
    background: 'var(--brand-white)',
    padding: '20px 0',
    borderBottom: '1px solid var(--brand-grey-200)',
  }

  const breadcrumbStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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

  // Generate YouTube embed URL
  const getEmbedUrl = videoId => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`
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
            <iframe
              src={getEmbedUrl(videoData.videoId)}
              style={iframeStyle}
              allowFullScreen
              title={videoData.title}
            />
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
