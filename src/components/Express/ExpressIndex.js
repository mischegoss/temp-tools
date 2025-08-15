// @site/src/components/Express/ExpressIndex.js

import React, { useState, useMemo } from 'react'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsExpress.js'
// import { videoLibrary } from '@site/src/components/ExpressVideoLibrary/Data/VideoData.js' // Ready for future use

// Import the shared modular components
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
// import FeaturedVideoSection from '../LandingPageLibrary/FeaturedVideoSection.js' // Ready for future use
import MainFilterSection from '../LandingPageLibrary/MainFilterSection.js'
import CardsSection from '../LandingPageLibrary/CardsSection.js'
import HelpSection from '../LandingPageLibrary/HelpSection.js'

/**
 * ExpressIndex component - Express landing page
 *
 * This component maintains exact styling compatibility with ActionsIndex
 * but without the featured video section. The video section can be easily
 * added later by uncommenting the imports and JSX.
 *
 * Structure:
 * 1. Welcome Section
 * 2. [Featured Video Section] - Ready to add when needed
 * 3. Filter Section
 * 4. Cards Section
 * 5. Help Section
 */
const ExpressIndex = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Express Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Express. Get started with rapid incident resolution and streamlined workflows.',
  },

  // Featured video section props (ready for future use)
  // featuredVideoSectionProps = {
  //   label: 'Featured Learning Video',
  //   buttonText: 'View Full Video Gallery →',
  //   buttonLink: '/learning/express-videos',
  //   showGalleryButton: false, // Set to true when video gallery is ready
  // },

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

  // Data sources
  resources = learningPaths,
  // videoResources = videoLibrary, // Ready for future use
}) => {
  // State management (same as Actions)
  const [activeFilter, setActiveFilter] = useState('all')

  // Calculate how many learning paths match each level (using primaryLevel and secondaryLevel)
  const totalByLevel = useMemo(() => {
    const counts = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    }

    resources.forEach(path => {
      // Count primary levels
      const primaryLevel = path.primaryLevel?.toLowerCase()
      if (primaryLevel === 'beginner') counts.beginner++
      if (primaryLevel === 'intermediate') counts.intermediate++
      if (primaryLevel === 'advanced') counts.advanced++

      // Count secondary levels if they exist
      const secondaryLevel = path.secondaryLevel?.toLowerCase()
      if (secondaryLevel === 'beginner') counts.beginner++
      if (secondaryLevel === 'intermediate') counts.intermediate++
      if (secondaryLevel === 'advanced') counts.advanced++
    })

    return counts
  }, [resources])

  // Filter learning paths based on selected level (using primaryLevel and secondaryLevel)
  const filteredPaths = useMemo(() => {
    if (activeFilter === 'all') return resources

    return resources.filter(
      path =>
        path.primaryLevel?.toLowerCase() === activeFilter ||
        path.secondaryLevel?.toLowerCase() === activeFilter,
    )
  }, [activeFilter, resources])

  // Get featured video (ready for future use)
  // const featuredVideo = useMemo(() => {
  //   if (!videoResources || videoResources.length === 0) return null
  //   return videoResources[0]
  // }, [videoResources])

  return (
    <>
      {/* Welcome Section */}
      <WelcomeSection welcomeSectionProps={welcomeSectionProps} />

      {/* Featured Video Section - Ready to add when needed */}
      {/* {featuredVideo && (
        <FeaturedVideoSection
          featuredVideo={featuredVideo}
          sectionProps={featuredVideoSectionProps}
        />
      )} */}

      {/* Filter Section */}
      <MainFilterSection
        filterSectionProps={filterSectionProps}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        totalByLevel={totalByLevel}
        resources={resources}
        productTheme='express'
      />

      {/* Cards Section */}
      <CardsSection filteredPaths={filteredPaths} />

      {/* Help Section */}
      <HelpSection helpSectionProps={helpSectionProps} />
    </>
  )
}

export default ExpressIndex
