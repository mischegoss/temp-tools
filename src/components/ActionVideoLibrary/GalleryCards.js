// @site/src/components/ActionVideoLibrary/VideoGalleryCards.js

import React from 'react'
import VideoCard from '@site/src/components/ActionVideoLibrary/VideoCard.js'
import VideoPagination from '@site/src/components/ActionVideoLibrary/VideoPagination.js'
import {
  learningHubSectionStyle,
  containerStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * VideoGalleryCards component - Netflix-style sectioned video gallery or flat grid
 * Groups videos by section with horizontal scrolling rows, OR shows flat grid when hideSection=true
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
      color: '#718096',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    }

    const noVideosTextStyle = {
      fontSize: '1.2rem',
      fontWeight: '500',
      color: '#718096',
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

  // Helper function to get section name with fallback
  const getVideoSection = video => {
    return video.section || video.category || 'Other Videos'
  }

  // Group videos by section, excluding empty groups (only when hideSection is false)
  const videoSections = React.useMemo(() => {
    if (hideSection) {
      // When hideSection is true, don't group - return all videos as one flat array
      return [['All Videos', videos]]
    }

    // Group videos by section
    const grouped = videos.reduce((acc, video) => {
      const sectionName = getVideoSection(video)
      if (!acc[sectionName]) {
        acc[sectionName] = []
      }
      acc[sectionName].push(video)
      return acc
    }, {})

    // Sort sections by sectionOrder, with fallback ordering
    const sortedSections = Object.entries(grouped).sort(
      ([, videosA], [, videosB]) => {
        const orderA = videosA[0]?.sectionOrder || 999
        const orderB = videosB[0]?.sectionOrder || 999
        return orderA - orderB
      },
    )

    return sortedSections
  }, [videos, hideSection])

  // Section title style
  const sectionTitleStyle = {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '20px',
    paddingLeft: '4px',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Video section container style
  const videoSectionStyle = {
    marginBottom: '50px',
  }

  // Video row style (horizontal scrolling for sectioned view) - Updated for smaller cards
  const videoRowStyle = {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '10px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#cbd5e0 #f7fafc',
  }

  // Video grid style (for flat view when hideSection=true) - Updated for 3 columns
  const videoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  }

  // Video row wrapper to handle mouse wheel scrolling
  const handleWheelScroll = e => {
    // Only handle horizontal scrolling when mouse wheel is used
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    e.preventDefault()
    e.currentTarget.scrollLeft += e.deltaY
  }

  const videosContent = (
    <div>
      {hideSection ? (
        // Flat grid view - no sections, no sub-headings
        <div style={videoGridStyle}>
          {videos.map((video, index) => (
            <VideoCard
              key={video.id || index}
              video={video}
              index={index}
              colorTheme={colorTheme}
            />
          ))}
        </div>
      ) : (
        // Sectioned view - group by sections with horizontal scrolling
        videoSections.map(([sectionName, sectionVideos]) => (
          <div key={sectionName} style={videoSectionStyle}>
            <h2 style={sectionTitleStyle}>{sectionName}</h2>
            <div
              style={videoRowStyle}
              onWheel={handleWheelScroll}
              className='video-row-scrollbar'
            >
              {sectionVideos.map((video, index) => (
                <div key={video.id || index} style={{ flex: '0 0 300px' }}>
                  <VideoCard
                    video={video}
                    index={index}
                    colorTheme={colorTheme}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Pagination - only show when there are multiple pages */}
      {false && totalPages > 1 && (
        <VideoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* CSS for scrollbar styling (only needed for sectioned view) */}
      {!hideSection && (
        <style jsx>{`
          .video-row-scrollbar::-webkit-scrollbar {
            height: 8px;
          }

          .video-row-scrollbar::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 4px;
          }

          .video-row-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
          }

          .video-row-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
        `}</style>
      )}
    </div>
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
