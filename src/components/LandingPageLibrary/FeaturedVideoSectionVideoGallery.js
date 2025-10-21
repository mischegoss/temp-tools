// @site/src/components/LandingPageLibrary/FeaturedVideoSectionVideoGallery.js

import React, { useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { getEmbedUrl } from '../../utils/videoUtils.js'

/**
 * FeaturedVideoSection-VideoGallery component
 *
 * Full-featured version with gallery integration:
 * - Has "View Full Video Gallery" button
 * - Smart fallback: Gallery first, then YouTube/Vimeo
 * - Checks if video exists in gallery
 * - Supports both YouTube and Vimeo videos
 * FIXED: Updated all routing to /learning/video-gallery/
 */
const FeaturedVideoSectionVideoGallery = ({
  featuredVideo,
  videoGallery = [],
  sectionProps = {
    label: 'Featured Learning Video',
    buttonText: 'View Full Video Gallery →',
    buttonLink: '/learning/video-gallery',
  },
}) => {
  // Ensure we have a valid button link - FIXED: Updated default to video-gallery
  const buttonLink = sectionProps?.buttonLink || '/learning/video-gallery'
  const [isVideoHovered, setIsVideoHovered] = useState(false)

  // Section wrapper styles (same as other sections)
  const learningHubSectionStyle = {
    background: '#FFFFFF',
    padding: '80px 0',
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

  // HELP SECTION FRAME STYLING
  const videoFrameStyle = {
    background: '#F7FAFC',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    border: '1px solid #008B8B',
  }

  const featuredVideoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
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
    background: isVideoHovered ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 10,
  }

  const playIconStyle = {
    fontSize: '24px',
    color: 'white',
    marginLeft: '4px',
  }

  // Video content styles
  const videoContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }

  const featuredLabelStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#008B8B',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    lineHeight: '1.2',
    margin: 0,
    color: '#2D3748',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoDescriptionStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#4A5568',
    margin: 0,
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const videoMetaStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  const durationBadgeStyle = {
    background: '#E2E8F0',
    color: '#2D3748',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const levelBadgeStyle = {
    background: '#008B8B',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const galleryButtonStyle = {
    background: '#0066FF',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    alignSelf: 'flex-start',
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
            {/* Video Player */}
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
                // Get external video URL for fallback
                const getExternalVideoUrl = (videoId, platform) => {
                  if (platform === 'vimeo') {
                    return `https://vimeo.com/${videoId}`
                  }
                  // Default to YouTube
                  return `https://www.youtube.com/watch?v=${videoId}`
                }

                // SMART FALLBACK: Gallery first, then YouTube/Vimeo - FIXED ROUTING
                const handleVideoClick = () => {
                  if (!featuredVideo?.videoId || typeof window === 'undefined')
                    return

                  // Check if video exists in the gallery
                  const videoExistsInGallery =
                    videoGallery && videoGallery.length > 0
                      ? videoGallery.some(
                          video => video.videoId === featuredVideo.videoId,
                        )
                      : false

                  if (videoExistsInGallery) {
                    // FIXED: Video found in gallery - go to video-gallery page
                    const galleryUrl = `/learning/video-gallery/videos?video=${featuredVideo.id}`
                    window.location.href = galleryUrl
                  } else {
                    // Video not in gallery - go directly to YouTube or Vimeo
                    const externalUrl = getExternalVideoUrl(
                      featuredVideo.videoId,
                      featuredVideo.platform,
                    )
                    window.open(externalUrl, '_blank')
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
                      src={getEmbedUrl(
                        featuredVideo.videoId,
                        featuredVideo.platform,
                        featuredVideo.vimeoHash,
                      )}
                      style={videoIframeStyle}
                      frameBorder='0'
                      allow={
                        featuredVideo.platform === 'vimeo'
                          ? 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share'
                          : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      }
                      referrerPolicy={
                        featuredVideo.platform === 'vimeo'
                          ? 'strict-origin-when-cross-origin'
                          : undefined
                      }
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

            {/* Video Content - With fixed gallery button */}
            <div style={videoContentStyle}>
              <div style={featuredLabelStyle}>{sectionProps.label}</div>
              <h2 style={videoTitleStyle}>{featuredVideo.title}</h2>
              <p style={videoDescriptionStyle}>{featuredVideo.description}</p>

              <div style={videoMetaStyle}>
                <span style={durationBadgeStyle}>{featuredVideo.duration}</span>
                <span style={levelBadgeStyle}>{featuredVideo.level}</span>
              </div>

              {/* FIXED: Gallery button with correct video-gallery navigation */}
              <button
                style={galleryButtonStyle}
                onClick={() => {
                  if (typeof window === 'undefined') return
                  window.location.href = buttonLink
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#0052CC'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#0066FF'
                  e.target.style.transform = 'translateY(0)'
                }}
                type='button'
              >
                {sectionProps.buttonText || 'View Full Video Gallery →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedVideoSectionVideoGallery
