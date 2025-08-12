// @site/src/components/Express/expressindex.js

import React, { useState, useMemo } from 'react'
import Link from '@docusaurus/Link'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsExpress.js'
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

// Get Express color theme
const expressTheme = getColorTheme('express')

// Create themed styles
const accentLineStyle = createAccentLineStyle(expressTheme.primary)
const helpSectionStyle = createHelpSectionStyle(expressTheme.primary)
const helpLinkStyle = createHelpLinkStyle(expressTheme.primary)

// Create filter section style that matches help section
const filterSectionStyle = createHelpSectionStyle(expressTheme.primary)

/**
 * ExpressIndex component - Creates a brand-compliant landing page for Resolve Actions Express
 * Following LearningHub/DiscoverPage design patterns
 */
const ExpressIndex = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Actions Express Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Actions Express. Our drag-and-drop, no-code IT automation platform with a large built-in library of automation actions will transform your workflow efficiency.',
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

  // Modified section styles with reduced spacing
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
          <div style={filterSectionStyle}>
            <h2 style={helpTitleStyle}>
              <strong>Explore Learning Paths</strong>
            </h2>
            <p
              style={{
                ...helpDescriptionStyle,
                fontSize: '1.25rem', // Larger font size as requested
                marginBottom: '24px',
              }}
            >
              Select a learning path by skill level or choose All Levels to
              browse all available learning paths.
            </p>
            <FilterSection
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

      {/* Cards Section */}
      <section style={cardsSectionStyleReduced} className='cards-section'>
        <div style={containerStyle}>
          <LandingPageCards
            resources={filteredPaths}
            hideSection={true}
            colorTheme={expressTheme}
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

export default ExpressIndex
