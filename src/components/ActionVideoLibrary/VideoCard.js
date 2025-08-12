// @site/src/components/ActionVideoLibrary/VideoCard.js

import React, { useState } from 'react'
import Link from '@docusaurus/Link'

/**
 * VideoCard component - Individual video card for the gallery
 * Styled to match the Actions theme and existing card patterns
 */
const VideoCard = ({ video, index, colorTheme }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get level badge color based on video level
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

  // Video card base styles
  const cardStyle = {
    background: 'var(--brand-white)',
    borderRadius: '12px',
    border: '1px solid var(--brand-grey-200)',
    boxShadow: isHovered
      ? '0 8px 24px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  // Video thumbnail container styles
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
    pointerEvents: 'none', // Disable iframe interactions so clicks go to the Link
  }

  // Play overlay styles
  const playOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: isHovered
      ? 'translate(-50%, -50%) scale(1.1)'
      : 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    background: isHovered
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
    fontSize: '20px',
    marginLeft: '3px', // Slight offset to center the triangle
  }

  // Video info section styles
  const videoInfoStyle = {
    padding: '24px',
  }

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: 'var(--brand-black-700)',
    margin: '0 0 12px 0',
    lineHeight: '1.3',
    fontFamily: 'var(--ifm-font-family-heading)',
  }

  const descriptionStyle = {
    fontSize: '1rem',
    color: 'var(--brand-grey-600)',
    lineHeight: '1.5',
    margin: '0 0 16px 0',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  // Video meta section styles
  const metaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  // Handle card click to open video landing page
  const handleCardClick = () => {
    if (video.id) {
      // Navigate to the video's dedicated landing page using your structure
      window.location.href = `/learning/actions-videos/videos/${video.id}`
    }
  }

  // Generate YouTube embed URL
  const getEmbedUrl = videoId => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
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
        role="button"
        tabIndex={0}
        aria-label={`View tutorial: ${video.title}`}
      >
      {/* Video Thumbnail with Iframe */}
      <div style={thumbnailStyle}>
        <iframe
          src={getEmbedUrl(video.videoId)}
          style={iframeStyle}
          allowFullScreen
          title={video.title}
        />
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
