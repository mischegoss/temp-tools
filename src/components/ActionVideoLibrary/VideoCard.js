// @site/src/components/ActionVideoLibrary/VideoCard.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { getEmbedUrl } from '../../utils/videoUtils.js'

/**
 * VideoCard component - Individual video card for the gallery
 * Fixed for SSR compatibility using BrowserOnly
 * Supports both YouTube and Vimeo videos
 * FIXED: Updated to use video-gallery URLs
 * FIXED: Added consistent card sizing with flexbox layout
 * FIXED: Removed pointerEvents: 'none' to allow YouTube videos to work
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

  // Card styles - FIXED: Added flexbox for consistent heights
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
    height: '100%', // FIXED: Ensure all cards have same height
    display: 'flex', // FIXED: Flexbox layout
    flexDirection: 'column', // FIXED: Column direction
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
    // FIXED: Removed pointerEvents: 'none' to allow YouTube video interactions
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
    background: isHovered
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

  const videoInfoStyle = {
    padding: '20px',
    flex: 1, // FIXED: Allow content to expand and push footer down
    display: 'flex',
    flexDirection: 'column',
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
    lineHeight: '1.4',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const descriptionStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    marginBottom: '12px',
    flex: 1, // FIXED: Allow description to expand
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto', // FIXED: Push meta to bottom
  }

  const durationStyle = {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    background: 'var(--color-bg-secondary)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const levelBadgeStyle = {
    fontSize: '0.75rem',
    color: '#FFFFFF',
    background: getLevelBadgeColor(video.level),
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  return (
    <Link
      to={`/learning/video-gallery/videos?video=${video.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Thumbnail/Preview */}
        <div style={thumbnailStyle}>
          {video.thumbnail ? (
            // CUSTOM THUMBNAIL: Show image instead of iframe
            <>
              <img
                src={`/img/videoThumbnail/${video.thumbnail}`}
                alt={`${video.title} thumbnail`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Play Overlay */}
              <div style={playOverlayStyle}>
                <span style={playIconStyle}>▶</span>
              </div>
            </>
          ) : (
            // DEFAULT: Show iframe with play overlay
            <>
              <BrowserOnly fallback={<div style={iframeStyle} />}>
                {() => {
                  return (
                    <iframe
                      src={getEmbedUrl(
                        video.videoId,
                        video.platform,
                        video.vimeoHash,
                      )}
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
            </>
          )}
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
