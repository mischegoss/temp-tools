// @site/src/components/ActionsVideo/ActionsVideoIndex.js

import React, { useState, useMemo } from 'react'
import Link from '@docusaurus/Link'
import { videoLibrary } from '../ActionVideoLibrary/Data/VideoData'
import VideoGalleryCards from '../ActionVideoLibrary/GalleryCards.js'
import VideoFilterSection from '../ActionVideoLibrary/FilterSection.js'
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
const ITEMS_PER_PAGE = 6

/**
 * ActionsVideoIndex component - Video gallery version of the Actions learning page
 * Following the exact same structure and styling as ActionsIndex
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
      'Filter videos by category or topic to find exactly what you need to learn.',
  },
  // Help section props
  helpSectionProps = {
    title: 'Need Help with Video Content?',
    description:
      "Can't find the video you're looking for or have suggestions for new content?",
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
  // Resources - BACK TO ORIGINAL: No safety checks
  resources = videoLibrary,
}) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate how many videos match each category - BACK TO ORIGINAL
  const totalByLevel = useMemo(() => {
    const counts = {
      integrations: 0,
      workflows: 0,
      'automation-design': 0,
      rita: 0,
      jarvis: 0,
    }

    resources.forEach(video => {
      const level = video.level?.toLowerCase()
      if (level === 'integrations') counts.integrations++
      if (level === 'workflows') counts.workflows++
      if (level === 'automation-design') counts['automation-design']++
      if (level === 'rita') counts.rita++
      if (level === 'jarvis') counts.jarvis++
    })

    return counts
  }, [resources])

  // Filter videos based on selected category - BACK TO ORIGINAL
  const filteredVideos = useMemo(() => {
    if (activeFilter === 'all') return resources

    return resources.filter(
      video => video.level?.toLowerCase() === activeFilter,
    )
  }, [activeFilter, resources])

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentVideos = filteredVideos.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter])

  // Modified section styles with reduced spacing (same as Actions)
  const welcomeSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '60px 0 40px 0', // Reduced from 80px to 60px top, 40px bottom
  }

  const filterSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '20px 0 40px 0', // Reduced from 80px to 20px top, 40px bottom
  }

  const cardsSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '20px 0 60px 0', // Reduced spacing
  }

  const helpSectionStyleReduced = {
    ...helpSectionStyle,
    padding: '60px 0 80px 0', // Keep bottom padding for final section
  }

  return (
    <>
      {/* Welcome Section - Same styling as Actions but video-focused content */}
      <section style={welcomeSectionStyleReduced}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <div style={accentLineStyle}></div>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
          </div>
        </div>
      </section>

      {/* Filter Section - Exactly matching Actions but with video categories */}
      <section style={filterSectionStyleReduced}>
        <div style={containerStyle}>
          <VideoFilterSection
            filterSectionProps={filterSectionProps}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            totalByLevel={totalByLevel}
            resources={resources}
          />
        </div>
      </section>

      {/* Video Cards Section - Same as Actions Cards but with video cards */}
      <section style={cardsSectionStyleReduced}>
        <div style={containerStyle}>
          <VideoGalleryCards
            videos={currentVideos}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hideSection={true} // Hide the outer section wrapper
            colorTheme={actionsTheme}
          />
        </div>
      </section>

      {/* Help Section - Exact same as Actions */}
      <section style={helpSectionStyleReduced}>
        <div style={containerStyle}>
          <h2 style={helpTitleStyle}>{helpSectionProps.title}</h2>
          <p style={helpDescriptionStyle}>
            {helpSectionProps.description}{' '}
            <Link to={`mailto:${helpSectionProps.email}`} style={helpLinkStyle}>
              Email us
            </Link>{' '}
            {helpSectionProps.additionalText}
          </p>
        </div>
      </section>
    </>
  )
}

export default ActionsVideoIndex
