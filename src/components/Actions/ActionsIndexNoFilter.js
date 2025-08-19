// @site/src/components/Actions/ActionsIndexNoFilter.js

import React, { useMemo } from 'react'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsActions.js'
import { videoLibrary } from '@site/src/components/ActionVideoLibrary/Data/VideoData.js'

// Import the shared modular components (excluding filter) + hydration-safe cards
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
import FeaturedVideoSectionVideoGallery from '../LandingPageLibrary/FeaturedVideoSectionVideoGallery.js'
import HydrationSafeCards from '../LandingPageLibrary/HydrationSafeCards.js'
import HelpSection from '../LandingPageLibrary/HelpSection.js'

/**
 * ActionsIndexNoFilter component - Actions landing page WITHOUT filtering functionality
 *
 * This component removes all filter-related functionality and hydration issues:
 * - No useState for activeFilter (eliminates hydration mismatch)
 * - No filter UI section
 * - Uses HydrationSafeCards (eliminates button issues)
 * - Cards always show ALL learning paths
 * - Simplified structure prevents bubbling issues
 *
 * Structure:
 * 1. Welcome Section
 * 2. Featured Video Section
 * 3. Hydration-Safe Cards Section (NO FILTER - shows all paths)
 * 4. Help Section
 */
const ActionsIndexNoFilter = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Actions Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Actions. Our Learning Paths will quickly get you started in exploring our latest automation platform.',
  },

  // Featured video section props
  featuredVideoSectionProps = {
    label: 'Featured Learning Video',
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
  // Get featured video (memoized for performance)
  const featuredVideo = useMemo(() => {
    if (!videoResources || videoResources.length === 0) return null

    // Look for Actions featured video
    const actionsFeatured = videoResources.find(
      v => v.product === 'actions' && v.featured === true,
    )
    return actionsFeatured || videoResources[0] // fallback
  }, [videoResources])

  // All learning paths (no filtering applied)
  const allPaths = useMemo(() => {
    return resources || []
  }, [resources])

  return (
    <>
      {/* Welcome Section */}
      <WelcomeSection welcomeSectionProps={welcomeSectionProps} />

      {/* Featured Video Section */}
      {featuredVideo && (
        <FeaturedVideoSectionVideoGallery
          featuredVideo={featuredVideo}
          sectionProps={featuredVideoSectionProps}
        />
      )}

      {/* Hydration-Safe Cards Section - NO FILTER, shows all paths */}
      <HydrationSafeCards
        resources={allPaths}
        productInfo={{ product: 'actions' }}
      />

      {/* Help Section */}
      <HelpSection helpSectionProps={helpSectionProps} />
    </>
  )
}

export default ActionsIndexNoFilter
