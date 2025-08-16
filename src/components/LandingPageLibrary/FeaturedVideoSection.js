// @site/src/components/LandingPageLibrary/FeaturedVideoSection.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'
import {
  learningHubSectionStyle,
  containerStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme
const actionsTheme = getColorTheme('actions')

/**
 * FeaturedVideoSection component - Showcases a featured video from the video gallery
 * Links to the full Actions Video Gallery
 * Fixed for SSR compatibility using BrowserOnly
 */
const FeaturedVideoSection = ({
  featuredVideo,
  sectionProps = {
    label: 'Featured Learning Video',
    buttonText: 'View Full Video Gallery →',
    buttonLink: '/learning/actions-videos',
    showGalleryButton: true,
  },
}) => {
  const [isVideoHovered, setIsVideoHovered] = useState(false)

  // Featured video section styles
  const featuredVideoSectionStyle = {
    background: '#F7FAFC', // var(--brand-grey-100)
    padding: '60px 0',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const featuredVideoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  }

  // Video player styles
  const videoContainerStyle = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    background: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
  }

  const videoIframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'none', // Disable iframe interactions
  }

  const playOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: isVideoHovered
      ? 'translate(-50%, -50%) scale(1.1)'
      : 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    background: isVideoHovered
      ? 'rgba(74, 144, 226, 0.95)'
      : 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  }

  const playIconStyle = {
    color: 'white',
    fontSize: '28px',
    marginLeft: '4px',
  }

  // Video content styles
  const videoContentStyle = {
    padding: '0 20px',
  }

  const featuredLabelStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: actionsTheme.primary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '16px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoTitleStyle = {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    lineHeight: '1.2',
    margin: '0 0 16px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoDescriptionStyle = {
    fontSize: '1.1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const videoMetaStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '24px',
  }

  const metaBadgeStyle = {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const durationBadgeStyle = {
    ...metaBadgeStyle,
    background: 'var(--brand-grey-100)',
    color: 'var(--brand-grey-600)',
  }

  // Helper function for level badge colors
  const getLevelBadgeColor = level => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4A90E2' // Actions blue
      case 'intermediate':
        return '#1E3A8A' // Darker blue
      case 'advanced':
        return '#008B8B' // Teal
      default:
        return '#008B8B' // Default teal
    }
  }

  const levelBadgeStyle = {
    ...metaBadgeStyle,
    background: getLevelBadgeColor(featuredVideo?.level),
    color: 'white',
  }

  const galleryButtonStyle = {
    background: `linear-gradient(135deg, ${actionsTheme.primary} 0%, ${actionsTheme.secondary} 100%)`,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Don't render if no featured video
  if (!featuredVideo) {
    return null
  }

  return (
    <section style={featuredVideoSectionStyle}>
      <div style={containerStyle}>
        <div style={featuredVideoGridStyle}>
          {/* Video Player */}
          <BrowserOnly fallback={<div style={videoContainerStyle} />}>
            {() => {
              // Generate YouTube embed URL - only runs in browser
              const getEmbedUrl = videoId => {
                return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
              }

              // Handle video click - navigate to video landing page
              const handleVideoClick = () => {
                if (featuredVideo?.id) {
                  window.location.href = `/learning/actions-videos/videos?video=${featuredVideo.id}`
                }
              }

              return (
                <div
                  style={videoContainerStyle}
                  onMouseEnter={() => setIsVideoHovered(true)}
                  onMouseLeave={() => setIsVideoHovered(false)}
                  onClick={handleVideoClick}
                  role='button'
                  tabIndex={0}
                  aria-label={`Watch video: ${featuredVideo.title}`}
                  onKeyPress={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleVideoClick()
                    }
                  }}
                >
                  <iframe
                    src={getEmbedUrl(featuredVideo.videoId)}
                    style={videoIframeStyle}
                    allowFullScreen
                    title={featuredVideo.title}
                  />
                  <div style={playOverlayStyle}>
                    <span style={playIconStyle}>▶</span>
                  </div>
                </div>
              )
            }}
          </BrowserOnly>

          {/* Video Content */}
          <div style={videoContentStyle}>
            <div style={featuredLabelStyle}>{sectionProps.label}</div>
            <h2 style={videoTitleStyle}>{featuredVideo.title}</h2>
            <p style={videoDescriptionStyle}>{featuredVideo.description}</p>

            <div style={videoMetaStyle}>
              <span style={durationBadgeStyle}>{featuredVideo.duration}</span>
              <span style={levelBadgeStyle}>{featuredVideo.level}</span>
            </div>

            {sectionProps.showGalleryButton && (
              <Link to={sectionProps.buttonLink} style={galleryButtonStyle}>
                {sectionProps.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedVideoSection
