// @site/src/components/ServiceBlueprinting/serviceblueprintingindex.js

import React, { useMemo } from 'react'
import { learningPaths } from './data/LearningPathsServiceBlueprinting.js'

// Import the shared modular components (excluding filter and video) + hydration-safe cards
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
import HydrationSafeCards from '../LandingPageLibrary/HydrationSafeCards.js'
import HelpSection from '../LandingPageLibrary/HelpSection.js'

/**
 * ServiceBlueprintingIndex component - Service Blueprinting landing page WITHOUT filtering functionality
 *
 * This component follows ActionsIndexNoFilter structure exactly EXCEPT:
 * - NO video section (as requested)
 * - Uses service-blueprinting product info for correct footer colors
 * - Uses ServiceBlueprinting-specific content
 *
 * Structure:
 * 1. Welcome Section
 * 2. Hydration-Safe Cards Section (NO FILTER - shows all paths)
 * 3. Help Section
 */
const ServiceBlueprintingIndex = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Service Blueprinting Learning',
    content:
      "Explore our specialized learning paths designed to help you master automation design. Whether you're new to automation or looking to formalize your approach, this learning path will equip you with the skills to design effective, scalable automation solutions that deliver real business value.",
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
}) => {
  // Service Blueprinting product info (for correct footer colors)
  const productInfo = {
    product: 'service-blueprinting', // This will give us Automation Design footer
  }

  // All learning paths (no filtering applied)
  const allPaths = useMemo(() => {
    return resources || []
  }, [resources])

  return (
    <>
      {/* Welcome Section */}
      <WelcomeSection
        welcomeSectionProps={welcomeSectionProps}
        productColors={{ accent: '#4A90E2' }} // Automation Design blue
      />

      {/* Hydration-Safe Cards Section - NO FILTER, shows all paths */}
      <HydrationSafeCards resources={allPaths} productInfo={productInfo} />

      {/* Help Section */}
      <HelpSection
        helpSectionProps={helpSectionProps}
        productColors={{ accent: '#4A90E2' }} // Automation Design blue
      />
    </>
  )
}

export default ServiceBlueprintingIndex
