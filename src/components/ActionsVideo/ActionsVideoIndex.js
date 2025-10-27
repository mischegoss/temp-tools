// @site/src/components/ActionsVideo/ActionsVideoIndex.js

import React, { useState, useMemo, useCallback } from 'react'
import Link from '@docusaurus/Link'
import { useVideoLibrary } from '../ActionVideoLibrary/Data/VideoData'
import VideoGalleryCards from '../ActionVideoLibrary/GalleryCards.js'
import NetflixStyleFilter from '../ActionVideoLibrary/NetflixStyleFilter.js'
import VideoSearch from '../ActionVideoLibrary/VideoSearch.js'
import {
  learningHubSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  subtitleStyle,
  createAccentLineStyle,
  createHelpSectionStyle,
  helpTitleStyle,
  helpDescriptionStyle,
  createHelpLinkStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme
const actionsTheme = getColorTheme('actions')

// Create themed styles
const accentLineStyle = createAccentLineStyle(actionsTheme.primary)
const helpSectionStyle = createHelpSectionStyle(actionsTheme.primary)
const helpLinkStyle = createHelpLinkStyle(actionsTheme.primary)

// Items per page for pagination
const ITEMS_PER_PAGE = 12

/**
 * ActionsVideoIndex component - Netflix-style video gallery with product/level filters
 * Displays videos in sections: Rita Go, Platform, Pro, Express, Insights
 */
const ActionsVideoIndex = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Video Learning Library',
    content:
      'Watch our comprehensive video tutorials designed to help you master Resolve. From basic concepts to advanced techniques, learn at your own pace with expert-guided content.',
  },
  // Filter section props
  filterSectionProps = {
    title: 'Browse Video Library',
    pathDescription:
      'Filter videos by product and level to find exactly what you need to learn.',
  },
  // Help section props
  helpSectionProps = {
    title: 'Need Help with Video Content?',
    description:
      "Can't find the video you're looking for or have suggestions for new content?",
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
}) => {
  // Get video data from Firebase
  const { videos: resources, loading, error } = useVideoLibrary()

  // State for filters
  const [activeProductFilter, setActiveProductFilter] = useState('all')
  const [activeLevelFilter, setActiveLevelFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  // Initialize search results when resources load
  React.useEffect(() => {
    if (resources.length > 0 && searchResults.length === 0 && !searchTerm) {
      console.log(
        '🎬 Initializing search results with',
        resources.length,
        'videos',
      )
      setSearchResults(resources)
    }
  }, [resources, searchResults.length, searchTerm])

  // Handle search results
  const handleSearchResults = useCallback((results, term) => {
    console.log('🔍 Search results updated:', {
      resultsCount: results.length,
      term,
    })
    setSearchResults(results)
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  // Handle page changes
  const handlePageChange = useCallback(page => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Determine which videos to process (search results take precedence)
  const videosToProcess = useMemo(() => {
    const result = searchTerm.trim() ? searchResults : resources
    console.log('📋 Videos to process:', {
      searchTerm,
      searchResultsCount: searchResults.length,
      resourcesCount: resources.length,
      resultCount: result.length,
    })
    return result
  }, [searchTerm, searchResults, resources])

  // Calculate how many videos match each individual product
  const totalByProduct = useMemo(() => {
    const counts = {
      'rita-go': 0,
      actions: 0,
      pro: 0,
      express: 0,
      insights: 0,
    }

    videosToProcess.forEach(video => {
      const product = video.product?.toLowerCase()
      if (counts.hasOwnProperty(product)) {
        counts[product]++
      }
    })

    return counts
  }, [videosToProcess])

  // Calculate how many videos match each level
  const totalByLevel = useMemo(() => {
    const counts = {
      'quick-start': 0,
      'step-by-step': 0,
      'deep-dive': 0,
      webinar: 0,
    }

    videosToProcess.forEach(video => {
      const level = video.level?.toLowerCase()
      if (counts.hasOwnProperty(level)) {
        counts[level]++
      }
    })

    return counts
  }, [videosToProcess])

  // Filter videos based on both selected filters (applied to search results)
  const filteredVideos = useMemo(() => {
    let filtered = videosToProcess

    // Apply product filter
    if (activeProductFilter !== 'all') {
      filtered = filtered.filter(
        video => video.product?.toLowerCase() === activeProductFilter,
      )
    }

    // Apply level filter
    if (activeLevelFilter !== 'all') {
      filtered = filtered.filter(
        video => video.level?.toLowerCase() === activeLevelFilter,
      )
    }

    return filtered
  }, [activeProductFilter, activeLevelFilter, videosToProcess])

  // Group filtered videos into sections for display
  const groupedVideos = useMemo(() => {
    const platformVideos = filteredVideos.filter(
      video => video.product === 'actions',
    )

    console.log('🏷️ Grouping videos:', {
      filteredCount: filteredVideos.length,
      platformCount: platformVideos.length,
      sampleProducts: filteredVideos.slice(0, 3).map(v => v.product),
    })

    // Group platform videos by section
    const platformBySection = platformVideos.reduce((acc, video) => {
      const section = video.section || video.category || 'Other'
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(video)
      return acc
    }, {})

    // Sort sections by sectionOrder
    const sortedPlatformSections = Object.entries(platformBySection).sort(
      ([, videosA], [, videosB]) => {
        const orderA = videosA[0]?.sectionOrder || 999
        const orderB = videosB[0]?.sectionOrder || 999
        return orderA - orderB
      },
    )

    const groups = {
      'rita-go': filteredVideos.filter(video => video.product === 'rita-go'),
      platform: platformVideos,
      platformSections: sortedPlatformSections,
      pro: filteredVideos.filter(video => video.product === 'pro'),
      express: filteredVideos.filter(video => video.product === 'express'),
      insights: filteredVideos.filter(video => video.product === 'insights'),
    }

    console.log('📦 Final groups:', {
      'rita-go': groups['rita-go'].length,
      platform: groups.platform.length,
      pro: groups.pro.length,
      express: groups.express.length,
      insights: groups.insights.length,
    })

    return groups
  }, [filteredVideos])

  // Styling
  const welcomeSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '60px 0 40px 0',
  }

  const filterSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '40px 0',
    background: '#F7FAFC',
  }

  const cardsSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '60px 0',
  }

  const firstSectionHeadingStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    marginBottom: '1.5rem',
  }

  const sectionHeadingStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2d3748',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    marginBottom: '1.5rem',
  }

  const subSectionHeadingStyle = {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#4a5568',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    marginBottom: '1rem',
  }

  // Badge styles
  const badgeStyle = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'white',
    marginLeft: '12px',
  }

  const newBadgeStyle = {
    ...badgeStyle,
    background: '#10B981', // Green for "New"
  }

  const featuredBadgeStyle = {
    ...badgeStyle,
    background: actionsTheme.primary, // Blue for "Featured"
  }

  const getMainSectionContainerStyle = index => ({
    marginBottom: index === 0 ? '60px' : '50px',
    marginTop: index === 0 ? '0' : '40px',
  })

  const getSubSectionContainerStyle = index => ({
    marginBottom: '40px',
    marginTop: index === 0 ? '0' : '30px',
  })

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '60px',
    padding: '20px 0',
  }

  const pageButtonStyle = {
    padding: '12px 24px',
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    color: '#4a5568',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    transition: 'all 0.2s ease',
  }

  const activePageButtonStyle = {
    ...pageButtonStyle,
    background: actionsTheme.primary,
    borderColor: actionsTheme.primary,
    color: 'white',
  }

  // Loading state
  if (loading) {
    return (
      <section style={welcomeSectionStyleReduced}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2 style={sectionTitleStyle}>Loading Video Library...</h2>
            <p style={subtitleStyle}>
              Please wait while we load the latest video content.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Error State
  if (error) {
    return (
      <section style={welcomeSectionStyleReduced}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2 style={sectionTitleStyle}>Unable to Load Videos</h2>
            <p style={subtitleStyle}>
              There was an error loading the video library: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: actionsTheme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginTop: '20px',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Main Content - Only show when not loading and no error
  return (
    <>
      {/* Welcome Section */}
      <section style={welcomeSectionStyleReduced}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section style={filterSectionStyleReduced}>
        <div style={containerStyle}>
          <div style={accentLineStyle}></div>
          <h2 style={sectionTitleStyle}>{filterSectionProps.title}</h2>
          <p style={subtitleStyle}>{filterSectionProps.pathDescription}</p>

          {/* Netflix-style filter */}
          <NetflixStyleFilter
            activeProductFilter={activeProductFilter}
            setActiveProductFilter={setActiveProductFilter}
            activeLevelFilter={activeLevelFilter}
            setActiveLevelFilter={setActiveLevelFilter}
            totalByProduct={totalByProduct}
            totalByLevel={totalByLevel}
            resources={videosToProcess}
          />

          {/* Search Component */}
          <VideoSearch
            resources={resources}
            onSearchResults={handleSearchResults}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                background: '#f0f8ff',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                marginTop: '20px',
              }}
            >
              Filtered videos: {filteredVideos.length}
              <br />
              Rita Go videos: {groupedVideos['rita-go'].length}
              <br />
              Platform videos: {groupedVideos.platform.length}
              <br />
              Pro videos: {groupedVideos.pro.length}
              <br />
              Express videos: {groupedVideos.express.length}
              <br />
              Insights videos: {groupedVideos.insights.length}
            </div>
          )}
        </div>
      </section>

      {/* Video Cards Section - Paginated content */}
      <section style={cardsSectionStyleReduced}>
        <div style={containerStyle}>
          {/* PAGE 1: Rita Go and Platform Sections */}
          {currentPage === 1 && (
            <>
              {/* Rita Go Section - First with "New" Badge */}
              {groupedVideos['rita-go'].length > 0 && (
                <div style={getMainSectionContainerStyle(0)}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '2rem',
                    }}
                  >
                    <h2 style={{ ...firstSectionHeadingStyle, margin: '0' }}>
                      Rita Go
                    </h2>
                    <span style={newBadgeStyle}>New</span>
                  </div>
                  <VideoGalleryCards
                    videos={groupedVideos['rita-go']}
                    hideSection={true}
                    colorTheme={actionsTheme}
                  />
                </div>
              )}

              {/* Platform Section with "Featured" Badge and Sub-sections */}
              {groupedVideos.platform.length > 0 && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '2rem',
                      marginTop:
                        groupedVideos['rita-go'].length > 0 ? '3rem' : '1rem',
                    }}
                  >
                    <h2 style={{ ...sectionHeadingStyle, margin: '0' }}>
                      Actions Platform
                    </h2>
                    <span style={featuredBadgeStyle}>Featured</span>
                    <span
                      style={{
                        background: '#6B7280',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginLeft: '12px',
                      }}
                    >
                      {groupedVideos.platform.length} videos
                    </span>
                  </div>

                  {/* Platform Sub-sections */}
                  {groupedVideos.platformSections.map(
                    ([sectionName, sectionVideos], index) => (
                      <div
                        key={sectionName}
                        style={getSubSectionContainerStyle(index)}
                      >
                        <h3 style={subSectionHeadingStyle}>{sectionName}</h3>
                        <VideoGalleryCards
                          videos={sectionVideos}
                          hideSection={true}
                          colorTheme={actionsTheme}
                        />
                      </div>
                    ),
                  )}
                </>
              )}
            </>
          )}

          {/* PAGE 2: Other Products (Pro, Express, Insights) */}
          {currentPage === 2 && (
            <>
              {/* Resolve Actions Pro Section */}
              {groupedVideos.pro.length > 0 && (
                <div style={getMainSectionContainerStyle(0)}>
                  <h2 style={{ ...firstSectionHeadingStyle, marginTop: '0' }}>
                    Pro
                  </h2>
                  <VideoGalleryCards
                    videos={groupedVideos.pro}
                    hideSection={true}
                    colorTheme={actionsTheme}
                  />
                </div>
              )}

              {/* Resolve Actions Express Section */}
              {groupedVideos.express.length > 0 && (
                <div style={getMainSectionContainerStyle(1)}>
                  <h2 style={{ ...sectionHeadingStyle, marginTop: '0' }}>
                    Express
                  </h2>
                  <VideoGalleryCards
                    videos={groupedVideos.express}
                    hideSection={true}
                    colorTheme={actionsTheme}
                  />
                </div>
              )}

              {/* Insights Section */}
              {groupedVideos.insights.length > 0 && (
                <div style={getMainSectionContainerStyle(2)}>
                  <h2 style={{ ...sectionHeadingStyle, marginTop: '0' }}>
                    Insights
                  </h2>
                  <VideoGalleryCards
                    videos={groupedVideos.insights}
                    hideSection={true}
                    colorTheme={actionsTheme}
                  />
                </div>
              )}
            </>
          )}

          {/* Pagination Controls - at the bottom */}
          <div style={paginationStyle}>
            <button
              style={
                currentPage === 1 ? activePageButtonStyle : pageButtonStyle
              }
              onClick={() => handlePageChange(1)}
            >
              Page 1
            </button>
            <button
              style={
                currentPage === 2 ? activePageButtonStyle : pageButtonStyle
              }
              onClick={() => handlePageChange(2)}
            >
              Page 2
            </button>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section style={helpSectionStyle}>
        <div style={containerStyle}>
          <h2 style={helpTitleStyle}>{helpSectionProps.title}</h2>
          <p style={helpDescriptionStyle}>
            {helpSectionProps.description}{' '}
            <Link to={`mailto:${helpSectionProps.email}`} style={helpLinkStyle}>
              Contact {helpSectionProps.email}
            </Link>{' '}
            {helpSectionProps.additionalText}
          </p>
        </div>
      </section>
    </>
  )
}

export default ActionsVideoIndex
