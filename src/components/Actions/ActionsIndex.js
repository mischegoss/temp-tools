// @site/src/components/Actions/ActionsIndex.js

import React, { useState, useMemo } from 'react'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsActions.js'
import { videoLibrary } from '@site/src/components/ActionVideoLibrary/Data/VideoData.js'

// Import the shared modular components
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
import FeaturedVideoSection from '../LandingPageLibrary/FeaturedVideoSection.js'
import MainFilterSection from '../LandingPageLibrary/MainFilterSection.js'
import CardsSection from '../LandingPageLibrary/CardsSection.js'
import HelpSection from '../LandingPageLibrary/HelpSection.js'

/**
 * ActionsIndex component - Recreated Actions landing page with featured video section
 *
 * This is a clean recreation that maintains exact styling compatibility with the existing
 * ActionsIndex while adding the featured video section and breaking into modular components.
 *
 * Structure:
 * 1. Welcome Section (existing styling)
 * 2. Featured Video Section (NEW - showcases video from gallery)
 * 3. Filter Section (existing styling)
 * 4. Cards Section (existing styling)
 * 5. Help Section (existing styling)
 */
const ActionsIndex = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Actions Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Actions. Our Learning Paths will quickly get you started in exploring our latest automation platform.',
  },

  // Featured video section props
  featuredVideoSectionProps = {
    label: 'Featured Learning Video',
    buttonText: 'View Full Video Gallery →',
    buttonLink: '/learning/actions-videos',
    showGalleryButton: true, // Actions has a video gallery
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

  // Data sources
  resources = learningPaths,
  videoResources = videoLibrary,
}) => {
  // State management (same as original ActionsIndex)
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

  // Get featured video (first video from the library, or you can implement custom logic)
  const featuredVideo = useMemo(() => {
    if (!videoResources || videoResources.length === 0) return null

    // You can customize this logic to select which video to feature
    // For now, we'll take the first video, but you could:
    // - Select a specific video by ID
    // - Select the most recent video
    // - Select a random video
    // - Select based on user preferences
    return videoResources[0]
  }, [videoResources])

  return (
    <>
      {/* Welcome Section */}
      <WelcomeSection welcomeSectionProps={welcomeSectionProps} />

      {/* NEW: Featured Video Section */}
      {featuredVideo && (
        <FeaturedVideoSection
          featuredVideo={featuredVideo}
          sectionProps={featuredVideoSectionProps}
        />
      )}

      {/* Filter Section */}
      <MainFilterSection
        filterSectionProps={filterSectionProps}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        totalByLevel={totalByLevel}
        resources={resources}
        productTheme='actions'
      />

      {/* Cards Section */}
      <CardsSection filteredPaths={filteredPaths} />

      {/* Help Section */}
      <HelpSection helpSectionProps={helpSectionProps} />
    </>
  )
}

export default ActionsIndex
