// @site/src/components/Pro/ProIndexNoFilter.js

import React, { useMemo } from 'react'
import { learningPaths } from '@site/src/components/LandingPageLibrary/Data/LearningPathsPro.js'
import { videoLibrary } from '@site/src/components/ActionVideoLibrary/Data/VideoData.js'

// Import the shared modular components (excluding filter) + hydration-safe cards
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
import FeaturedVideoSectionVideoGallery from '../LandingPageLibrary/FeaturedVideoSectionVideoGallery.js'
import HydrationSafeCards from '../LandingPageLibrary/HydrationSafeCards.js'
import HelpSection from '../LandingPageLibrary/HelpSection.js'

/**
 * ProIndexNoFilter component - Pro landing page WITHOUT filtering functionality
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
const ProIndexNoFilter = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Resolve Pro Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Pro. Get started with advanced workflow management and enterprise-grade solutions.',
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
  // Pro product colors (referencing custom.css values)
  const productColors = {
    accent: 'var(--brand-green)', // Pro brand color from custom.css
  }

  // Get featured video (memoized for performance)
  const featuredVideo = useMemo(() => {
    if (!videoResources || videoResources.length === 0) return null

    // Look for Pro featured video
    const proFeatured = videoResources.find(
      v => v.product === 'pro' && v.featured === true,
    )
    return proFeatured || videoResources[0] // fallback
  }, [videoResources])

  // All learning paths (no filtering applied)
  const allPaths = useMemo(() => {
    return resources || []
  }, [resources])

  return (
    <>
      {/* Welcome Section with product colors */}
      <WelcomeSection
        welcomeSectionProps={welcomeSectionProps}
        productColors={productColors}
      />

      {/* Featured Video Section with product colors */}
      {featuredVideo && (
        <FeaturedVideoSectionVideoGallery
          featuredVideo={featuredVideo}
          sectionProps={featuredVideoSectionProps}
          productColors={productColors}
        />
      )}

      {/* Hydration-Safe Cards Section - NO FILTER, shows all paths */}
      <HydrationSafeCards
        resources={allPaths}
        productInfo={{ product: 'pro' }}
      />

      {/* Help Section with product colors */}
      <HelpSection
        helpSectionProps={helpSectionProps}
        productColors={productColors}
      />
    </>
  )
}

export default ProIndexNoFilter
