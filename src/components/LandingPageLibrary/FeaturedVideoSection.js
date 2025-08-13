// @site/src/components/Actions/FeaturedVideoSection.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'
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
 */
const FeaturedVideoSection = ({
  featuredVideo,
  sectionProps = {
    label: 'Featured Learning Video',
    buttonText: 'View Full Video Gallery →',
    buttonLink: '/learning/actions-videos',
    showGalleryButton: true, // NEW: toggle button visibility
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
      ? 'rgba(0, 80, 199, 1)'
      : 'rgba(0, 80, 199, 0.9)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 2,
    pointerEvents: 'none',
  }

  const playIconStyle = {
    color: 'white',
    fontSize: '28px',
    marginLeft: '4px', // Slight offset to center the triangle
  }

  // Video content styles
  const videoContentStyle = {
    padding: '0',
  }

  const featuredLabelStyle = {
    fontSize: '1.1rem',
    color: actionsTheme.primary, // #0066FF
    fontWeight: '600',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoTitleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2D3748',
    margin: '0 0 16px 0',
    lineHeight: '1.3',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoDescriptionStyle = {
    fontSize: '1.1rem',
    color: '#4A5568',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoMetaStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  }

  const metaBadgeStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const durationBadgeStyle = {
    ...metaBadgeStyle,
    background: '#E2E8F0',
    color: '#4A5568',
  }

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

  // Generate YouTube embed URL
  const getEmbedUrl = videoId => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
  }

  // Handle video click - navigate to video landing page
  const handleVideoClick = () => {
    if (featuredVideo?.id) {
      window.location.href = `/learning/actions-videos/videos?video=${featuredVideo.id}`
    }
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
