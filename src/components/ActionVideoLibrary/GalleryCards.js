// @site/src/components/ActionVideoLibrary/VideoGalleryCards.js

import React from 'react'
import VideoCard from '@site/src/components/ActionVideoLibrary/VideoCard.js'
import VideoPagination from '@site/src/components/ActionVideoLibrary/VideoPagination.js'
import {
  learningHubSectionStyle,
  containerStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * VideoGalleryCards component - Container for video cards with pagination
 * Follows the same pattern as LandingPageCards
 */
const VideoGalleryCards = ({
  videos = [],
  currentPage,
  totalPages,
  onPageChange,
  hideSection = false,
  colorTheme,
}) => {
  // Check if videos is valid before rendering
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    const noVideosStyle = {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--ifm-font-family-base)',
    }

    const noVideosTextStyle = {
      fontSize: '1.2rem',
      fontWeight: '500',
      color: 'var(--color-text-secondary)',
      margin: 0,
    }

    const noVideosContent = (
      <div style={noVideosStyle}>
        <p style={noVideosTextStyle}>
          No videos to display. Please check your filters or try again later.
        </p>
      </div>
    )

    if (hideSection) {
      return noVideosContent
    }

    return (
      <section style={learningHubSectionStyle}>
        <div style={containerStyle}>{noVideosContent}</div>
      </section>
    )
  }

  // Video cards grid container style
  const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '30px',
    margin: 0,
    padding: 0,
  }

  const videosContent = (
    <>
      <div style={cardsContainerStyle}>
        {videos.map((video, index) => (
          <VideoCard
            key={video.id || index}
            video={video}
            index={index}
            colorTheme={colorTheme}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <VideoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  )

  if (hideSection) {
    return videosContent
  }

  return (
    <section style={learningHubSectionStyle}>
      <div style={containerStyle}>{videosContent}</div>
    </section>
  )
}

export default VideoGalleryCards
