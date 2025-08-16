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
    title: 'Actions Video Learning Library',
    content:
      'Watch our comprehensive video tutorials designed to help you master Resolve Actions. From basic concepts to advanced techniques, learn at your own pace with expert-guided content.',
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
  // Resources
  resources = videoLibrary,
}) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate how many videos match each category
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

  // Filter videos based on selected category
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
    padding: '80px 0 0px 0', // Eliminated bottom padding
  }

  const filterSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '0px 0 20px 0', // Eliminated top padding, kept bottom for cards spacing
  }

  const cardsSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '40px 0 20px 0', // Reduced spacing above and below cards
  }

  const helpSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '20px 0 80px 0', // Reduced top padding
  }

  return (
    <>
      {/* Welcome Section */}
      <section style={welcomeSectionStyleReduced} className='welcome-section'>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <div style={accentLineStyle}></div>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
          </div>
        </div>
      </section>

      {/* Filter Section with Frame */}
      <section style={filterSectionStyleReduced} className='filter-section'>
        <div style={containerStyle}>
          <div style={helpSectionStyle}>
            <h2 style={helpTitleStyle}>
              <strong>{filterSectionProps.title}</strong>
            </h2>
            <p
              style={{
                ...helpDescriptionStyle,
                fontSize: '1.25rem', // Larger font size as requested
                marginBottom: '24px',
              }}
            >
              {filterSectionProps.pathDescription}
            </p>
            <VideoFilterSection
              title={filterSectionProps.title}
              pathDescription={filterSectionProps.pathDescription}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              totalByLevel={totalByLevel}
              resources={resources}
            />
          </div>
        </div>
      </section>

      {/* Video Cards Section */}
      <section style={cardsSectionStyleReduced} className='cards-section'>
        <div style={containerStyle}>
          <VideoGalleryCards
            videos={currentVideos}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hideSection={true}
            colorTheme={actionsTheme}
          />
        </div>
      </section>

      {/* Help Section */}
      <section style={helpSectionStyleReduced} className='help-section'>
        <div style={containerStyle}>
          <div style={helpSectionStyle}>
            <h2 style={helpTitleStyle}>{helpSectionProps.title}</h2>
            <p style={helpDescriptionStyle}>
              {helpSectionProps.description}{' '}
              <Link
                to={`mailto:${helpSectionProps.email}`}
                style={helpLinkStyle}
              >
                {helpSectionProps.email}
              </Link>{' '}
              {helpSectionProps.additionalText}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default ActionsVideoIndex
