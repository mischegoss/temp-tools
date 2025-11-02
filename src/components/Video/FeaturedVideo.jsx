import React from 'react'

/**
 * FeaturedVideoComponent - Simplified video preview component
 * Displays video thumbnail with title header and external linking
 */
const FeaturedVideoComponent = ({
  title = 'Video Title',
  thumbnailUrl = '',
  thumbnailFileName = '',
  videoUrl = '#',
  className = '',
}) => {
  // Container styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }

  // Header styles
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
  }

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2D3748',
    margin: '0',
    lineHeight: '1.2',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Video thumbnail container
  const videoContainerStyle = {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  }

  const videoThumbnailStyle = {
    width: '100%',
    height: '315px',
    objectFit: 'cover',
    display: 'block',
    background: '#000',
  }

  // Play button overlay
  const playButtonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '68px',
    height: '48px',
    background: '#ff0000',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const playIconStyle = {
    width: '0',
    height: '0',
    borderLeft: '20px solid white',
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    marginLeft: '4px',
  }

  // Handle video click
  const handleVideoClick = () => {
    if (videoUrl && videoUrl !== '#') {
      window.open(videoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Get thumbnail source - prioritize local file from static/img/thumbnails, fallback to URL
  const getThumbnailSrc = () => {
    if (thumbnailFileName) {
      return `/img/thumbnails/${thumbnailFileName}`
    }
    return thumbnailUrl || null
  }

  const thumbnailSrc = getThumbnailSrc()

  return (
    <div className={className} style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>{title}</h2>
      </div>

      {/* Video Thumbnail */}
      <div
        style={videoContainerStyle}
        onClick={handleVideoClick}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}
      >
        {thumbnailSrc ? (
          <img src={thumbnailSrc} alt={title} style={videoThumbnailStyle} />
        ) : (
          <div
            style={{
              ...videoThumbnailStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
            }}
          >
            Video Thumbnail
          </div>
        )}

        {/* Play Button Overlay */}
        <div
          style={playButtonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#cc0000'
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ff0000'
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
          }}
        >
          <div style={playIconStyle}></div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedVideoComponent
