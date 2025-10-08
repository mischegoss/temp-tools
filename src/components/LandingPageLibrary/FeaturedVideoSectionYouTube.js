// @site/src/components/LandingPageLibrary/FeaturedVideoSection-YouTube.js

import React, { useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * FeaturedVideoSection-YouTube component with product-specific colors
 *
 * Simple version that always goes to YouTube when clicked.
 * No gallery button, no gallery logic.
 * Perfect for landing pages without video galleries.
 * Uses product colors for the frame border.
 */
const FeaturedVideoSectionYouTube = ({
  featuredVideo,
  sectionProps = {
    label: 'Featured Learning Video',
  },
  productColors = {
    accent: 'var(--brand-blue)', // Default to Actions blue
  },
}) => {
  const [isVideoHovered, setIsVideoHovered] = useState(false)

  // Section wrapper styles - REDUCED padding to minimize dead space
  const learningHubSectionStyle = {
    background: '#FFFFFF',
    padding: '40px 0', // Reduced from 80px to 40px
    color: '#2D3748',
    width: '100%',
    margin: 0,
    position: 'relative',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    width: '100%',
  }

  // HELP SECTION FRAME STYLING - REDUCED padding with product-specific border
  const videoFrameStyle = {
    background: '#F7FAFC',
    borderRadius: '12px',
    padding: '30px', // Reduced from 40px to 30px
    textAlign: 'center',
    border: `1px solid ${productColors.accent}`, // Product-specific border color
    margin: '0', // Ensure no additional margins
  }

  const featuredVideoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px', // Reduced from 60px to 40px
    alignItems: 'center',
    textAlign: 'left', // Override center alignment for grid content
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
    pointerEvents: 'none',
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
      ? 'rgba(0, 102, 255, 0.95)'
      : 'rgba(0, 102, 255, 0.8)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
  }

  const playIconStyle = {
    color: '#FFFFFF',
    fontSize: '24px',
    marginLeft: '4px',
  }

  // Video content styles
  const videoContentStyle = {
    textAlign: 'left',
  }

  const featuredLabelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#008B8B',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoTitleStyle = {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: '16px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    lineHeight: '1.3',
  }

  const videoDescriptionStyle = {
    fontSize: '1rem',
    color: '#4A5568',
    lineHeight: '1.6',
    marginBottom: '16px', // Reduced from 24px to 16px
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoMetaStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px', // Reduced from 24px to 16px
  }

  const durationBadgeStyle = {
    backgroundColor: '#008B8B',
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const levelBadgeStyle = {
    backgroundColor: '#0066FF',
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Don't render if no featured video
  if (!featuredVideo) {
    return null
  }

  return (
    <section style={learningHubSectionStyle}>
      <div style={containerStyle}>
        <div style={videoFrameStyle}>
          <div style={featuredVideoGridStyle}>
            {/* Video Player - Always goes to YouTube */}
            <BrowserOnly
              fallback={
                <div
                  style={{
                    ...videoContainerStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f0f0f0',
                    color: '#666',
                  }}
                >
                  <p>Loading video player...</p>
                </div>
              }
            >
              {() => {
                const getEmbedUrl = videoId => {
                  const origin =
                    typeof window !== 'undefined'
                      ? window.location.origin
                      : 'https://resolve.io'

                  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${origin}`
                }

                // SIMPLE: Always go to YouTube
                const handleVideoClick = () => {
                  if (!featuredVideo?.videoId || typeof window === 'undefined')
                    return

                  const youtubeUrl = `https://www.youtube.com/watch?v=${featuredVideo.videoId}`
                  window.open(youtubeUrl, '_blank')
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

            {/* Video Content - No gallery button */}
            <div style={videoContentStyle}>
              <div style={featuredLabelStyle}>{sectionProps.label}</div>
              <h2 style={videoTitleStyle}>{featuredVideo.title}</h2>
              <p style={videoDescriptionStyle}>{featuredVideo.description}</p>

              <div style={videoMetaStyle}>
                <span style={durationBadgeStyle}>{featuredVideo.duration}</span>
                <span style={levelBadgeStyle}>{featuredVideo.level}</span>
              </div>

              {/* No gallery button in YouTube version */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedVideoSectionYouTube
