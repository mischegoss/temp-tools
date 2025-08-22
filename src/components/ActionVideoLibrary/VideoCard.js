// @site/src/components/ActionVideoLibrary/VideoCard.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'

/**
 * VideoCard component - Individual video card for the gallery
 * Fixed for SSR compatibility using BrowserOnly
 * Supports both YouTube and Vimeo videos
 */
const VideoCard = ({ video, index, colorTheme }) => {
  const [isHovered, setIsHovered] = useState(false)

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

  // Card styles
  const cardStyle = {
    background: 'var(--color-bg-card-light)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: isHovered
      ? '0 12px 40px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    cursor: 'pointer',
    border: '1px solid var(--color-border-light)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const thumbnailStyle = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    background: '#000',
    overflow: 'hidden',
  }

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'none', // Disable iframe interactions in gallery
  }

  const playOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: isHovered
      ? 'translate(-50%, -50%) scale(1.1)'
      : 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    background: isHovered ? 'rgba(74, 144, 226, 0.95)' : 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  }

  const playIconStyle = {
    color: 'white',
    fontSize: '24px',
    marginLeft: '4px', // Slight offset for visual balance
  }

  const videoInfoStyle = {
    padding: '24px',
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const descriptionStyle = {
    color: 'var(--color-text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: '0 0 16px 0',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const metaStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  const durationStyle = {
    background: 'var(--brand-grey-100)',
    color: 'var(--brand-grey-600)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  const levelBadgeStyle = {
    background: getLevelBadgeColor(video.level),
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  return (
    <Link
      to={`/learning/actions-videos/videos?video=${video.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role='button'
        tabIndex={0}
        aria-label={`View tutorial: ${video.title}`}
      >
        {/* Video Thumbnail with Iframe */}
        <div style={thumbnailStyle}>
          <BrowserOnly fallback={<div style={iframeStyle} />}>
            {() => {
              // Generate embed URL based on platform
              const getEmbedUrl = (videoId, platform) => {
                if (platform === 'vimeo') {
                  return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`
                }
                // Default to YouTube
                return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
              }

              return (
                <iframe
                  src={getEmbedUrl(video.videoId, video.platform)}
                  style={iframeStyle}
                  frameBorder='0'
                  allow={
                    video.platform === 'vimeo'
                      ? 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share'
                      : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  }
                  referrerPolicy={
                    video.platform === 'vimeo'
                      ? 'strict-origin-when-cross-origin'
                      : undefined
                  }
                  allowFullScreen
                  title={video.title}
                />
              )
            }}
          </BrowserOnly>

          {/* Play Overlay */}
          <div style={playOverlayStyle}>
            <span style={playIconStyle}>▶</span>
          </div>
        </div>

        {/* Video Info */}
        <div style={videoInfoStyle}>
          <h3 style={titleStyle}>{video.title}</h3>
          <p style={descriptionStyle}>{video.description}</p>
          <div style={metaStyle}>
            <span style={durationStyle}>{video.duration}</span>
            <span style={levelBadgeStyle}>{video.level}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
