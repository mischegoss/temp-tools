// @site/src/components/Insights/insightsindex.js

import React, { useState, useMemo } from 'react'
import Link from '@docusaurus/Link'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsInsights.js'
import LandingPageCards from '@site/src/components/LandingPageLibrary/landingpagecards.js'
import FilterSection from '@site/src/components/LandingPageLibrary/filtersection.js'
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

// Get Insights color theme
const insightsTheme = getColorTheme('insights')

// Create themed styles
const accentLineStyle = createAccentLineStyle(insightsTheme.primary)
const helpSectionStyle = createHelpSectionStyle(insightsTheme.primary)
const helpLinkStyle = createHelpLinkStyle(insightsTheme.primary)

/**
 * InsightsIndex component - Creates a brand-compliant landing page for Resolve Insights
 * Following LearningHub/DiscoverPage design patterns
 */
const InsightsIndex = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Insights Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Insights. Our Discovery and Dependency Mapping (DDM) platform will help you understand your IT infrastructure like never before.',
  },
  // Filter section props
  filterSectionProps = {
    title: 'Explore Learning Paths',
    pathDescription:
      'Select a learning path by skill level or choose All Levels to browse all available learning paths.',
  },
  // Help section props
  helpSectionProps = {
    title: 'Need Help Getting Started?',
    description:
      'Have questions about which course is right for you? Our team is here to help you choose the perfect learning path.',
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
  // Resources
  resources = learningPaths,
}) => {
  // State for active filter
  const [activeFilter, setActiveFilter] = useState('all')

  // Calculate how many resources match each level
  const totalByLevel = useMemo(() => {
    const counts = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    }

    resources.forEach(path => {
      // Count primary levels
      if (path.primaryLevel?.toLowerCase() === 'beginner') counts.beginner++
      if (path.primaryLevel?.toLowerCase() === 'intermediate')
        counts.intermediate++
      if (path.primaryLevel?.toLowerCase() === 'advanced') counts.advanced++

      // Count secondary levels if they exist
      if (path.secondaryLevel?.toLowerCase() === 'beginner') counts.beginner++
      if (path.secondaryLevel?.toLowerCase() === 'intermediate')
        counts.intermediate++
      if (path.secondaryLevel?.toLowerCase() === 'advanced') counts.advanced++
    })

    return counts
  }, [resources])

  // Filter learning paths based on selected level
  const filteredPaths = useMemo(() => {
    if (activeFilter === 'all') return resources

    return resources.filter(
      path =>
        path.primaryLevel?.toLowerCase() === activeFilter ||
        path.secondaryLevel?.toLowerCase() === activeFilter,
    )
  }, [activeFilter, resources])

  return (
    <>
      {/* Welcome Section */}
      <section style={learningHubSectionStyle} className='learning-hub-section'>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
            <div style={accentLineStyle}></div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <FilterSection
        title={filterSectionProps.title}
        pathDescription={filterSectionProps.pathDescription}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        totalByLevel={totalByLevel}
        resources={resources}
        colorTheme={insightsTheme}
      />

      {/* Cards Section */}
      <section style={learningHubSectionStyle} className='cards-section'>
        <div style={containerStyle}>
          <LandingPageCards
            resources={filteredPaths}
            hideSection={true}
            colorTheme={insightsTheme}
          />
        </div>
      </section>

      {/* Help Section */}
      <section style={learningHubSectionStyle} className='help-section'>
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

export default InsightsIndex
