// @site/src/components/ActionsVideo/ActionsVideoIndex.js

import React, { useState, useMemo } from 'react'
import Link from '@docusaurus/Link'
import { videoLibrary } from '../ActionVideoLibrary/Data/VideoData'
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
 * Displays videos in 3 main sections: Platform, Device Discovery, Automation Design
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
  // Resources
  resources = videoLibrary,
}) => {
  const [activeProductFilter, setActiveProductFilter] = useState('all')
  const [activeLevelFilter, setActiveLevelFilter] = useState('all')
  const [searchResults, setSearchResults] = useState(resources)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchIntent, setSearchIntent] = useState({ suggestions: [] })
  const [currentPage, setCurrentPage] = useState(1)

  // Handle search results with intent detection
  const handleSearchResults = (results, term, intent = { suggestions: [] }) => {
    setSearchResults(results)
    setSearchTerm(term)
    setSearchIntent(intent)
  }

  // Handle page change with scroll to top
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Use search results instead of resources for all calculations
  const videosToProcess = searchTerm ? searchResults : resources

  // Calculate how many videos match each individual product
  const totalByProduct = useMemo(() => {
    const counts = {
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
      platform: platformVideos,
      platformSections: sortedPlatformSections,
      pro: filteredVideos.filter(video => video.product === 'pro'),
      express: filteredVideos.filter(video => video.product === 'express'),
      insights: filteredVideos.filter(video => video.product === 'insights'),
    }

    return groups
  }, [filteredVideos])

  // Reset filters when search changes
  React.useEffect(() => {
    // Optional: Could reset filters when search changes
    // setActiveProductFilter('all')
    // setActiveLevelFilter('all')
  }, [searchTerm])

  // Modified section styles with reduced spacing
  const welcomeSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '60px 0 40px 0',
  }

  const filterSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '20px 0 0 0',
  }

  const cardsSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '0 0 60px 0',
  }

  const helpSectionStyleReduced = {
    ...helpSectionStyle,
    padding: '60px 0 80px 0',
  }

  // Section heading styles
  const sectionHeadingStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3345',
    marginBottom: '2rem',
    marginTop: '3rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const firstSectionHeadingStyle = {
    ...sectionHeadingStyle,
    marginTop: '1rem', // Less top margin for first section
  }

  const subSectionHeadingStyle = {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1.5rem',
    marginTop: '0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  // Sub-section container styles with alternating backgrounds and bottom border
  const getSubSectionContainerStyle = index => ({
    padding: '2rem 2.5rem',
    background: index % 2 === 0 ? '#FAFBFC' : '#F5F7FA',
    marginLeft: '-2.5rem',
    marginRight: '-2.5rem',
    marginBottom: '0',
    borderBottom: '1px solid #E2E8F0',
  })

  // Main section container style for Page 2 (no sub-sections)
  const getMainSectionContainerStyle = index => ({
    padding: '2rem 2.5rem',
    background: index % 2 === 0 ? '#FAFBFC' : '#F5F7FA',
    marginLeft: '-2.5rem',
    marginRight: '-2.5rem',
    marginBottom: '0',
    borderBottom: '1px solid #E2E8F0',
  })

  // Pagination controls style
  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '3rem',
    marginBottom: '2rem',
  }

  const pageButtonStyle = {
    padding: '8px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#2d3748',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    transition: 'all 0.2s ease',
  }

  const activePageButtonStyle = {
    ...pageButtonStyle,
    background: actionsTheme.primary,
    borderColor: actionsTheme.primary,
    color: '#ffffff',
  }

  const disabledPageButtonStyle = {
    ...pageButtonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  }

  return (
    <>
      {/* Welcome Section */}
      <section style={welcomeSectionStyleReduced}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <div style={accentLineStyle}></div>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section style={filterSectionStyleReduced}>
        <div style={containerStyle}>
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
            videos={resources}
            onSearchResults={handleSearchResults}
            placeholder='Search videos by title, description, tags...'
            colorTheme={actionsTheme}
          />

          {/* Search Intent Feedback */}
          {searchTerm && searchIntent.suggestions.length > 0 && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#6c757d',
              }}
            >
              💡 {searchIntent.suggestions.join(' • ')}
            </div>
          )}
        </div>
      </section>

      {/* Video Cards Section - Paginated content */}
      <section style={cardsSectionStyleReduced}>
        <div style={containerStyle}>
          {/* PAGE 1: Platform Section with Sub-sections */}
          {currentPage === 1 && groupedVideos.platform.length > 0 && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '2rem',
                  marginTop: '1rem',
                }}
              >
                <h2 style={{ ...firstSectionHeadingStyle, margin: 0 }}>
                  Platform
                </h2>
                <span
                  style={{
                    backgroundColor: actionsTheme.primary,
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Featured
                </span>
              </div>

              {/* Platform Sub-sections with alternating backgrounds */}
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

          {/* PAGE 2: Pro, Express, Insights Sections with cards */}
          {currentPage === 2 && (
            <>
              {/* Resolve Actions Pro Section */}
              {groupedVideos.pro.length > 0 && (
                <div style={getMainSectionContainerStyle(0)}>
                  <h2 style={{ ...firstSectionHeadingStyle, marginTop: '0' }}>
                    Resolve Actions Pro
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
                    Resolve Actions Express
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
    </>
  )
}

export default ActionsVideoIndex
