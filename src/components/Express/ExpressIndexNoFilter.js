// @site/src/components/Express/ExpressIndexNoFilter.js

import React, { useMemo } from 'react'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsExpress.js'
import { useVideoLibrary } from '@site/src/components/ActionVideoLibrary/Data/VideoData.js'

// Import the shared modular components (excluding filter) + hydration-safe cards
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
import FeaturedVideoSectionVideoGallery from '../LandingPageLibrary/FeaturedVideoSectionVideoGallery.js'
import HydrationSafeCards from '../LandingPageLibrary/HydrationSafeCards.js'
import HelpSection from '../LandingPageLibrary/HelpSection.js'

/**
 * ExpressIndexNoFilter component - Express landing page WITHOUT filtering functionality
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
const ExpressIndexNoFilter = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Express Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Express. Get started with rapid incident resolution and streamlined workflows.',
  },

  // Featured video section props
  featuredVideoSectionProps = {
    label: 'Featured Learning Video',
    buttonText: 'View Full Video Gallery →',
    buttonLink: '/learning/video-gallery',
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
  videoResources, // CHANGED: Now comes from Firebase, not static
}) => {
  // CHANGED: Get real-time video data from Firebase
  const {
    videos: videoLibrary,
    loading: videosLoading,
    error: videosError,
  } = useVideoLibrary()

  // Use Firebase data if available, otherwise use passed videoResources
  const activeVideoResources =
    videoLibrary.length > 0 ? videoLibrary : videoResources || []

  // Get featured video (memoized for performance)
  const featuredVideo = useMemo(() => {
    if (!activeVideoResources || activeVideoResources.length === 0) return null

    // Look for Express featured video
    const expressFeatured = activeVideoResources.find(
      v => v.product === 'express' && v.featured === true,
    )
    return expressFeatured || activeVideoResources[0] // fallback
  }, [activeVideoResources])

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
          videoGallery={activeVideoResources}
          sectionProps={featuredVideoSectionProps}
        />
      )}

      {/* Hydration-Safe Cards Section - NO FILTER, shows all paths */}
      <HydrationSafeCards
        resources={allPaths}
        productInfo={{ product: 'express' }}
      />

      {/* Help Section */}
      <HelpSection helpSectionProps={helpSectionProps} />
    </>
  )
}

export default ExpressIndexNoFilter
