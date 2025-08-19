// @site/src/components/Discover/discoverindex.js

import React from 'react'
import Link from '@docusaurus/Link'
// CONTENT UPDATE POINT 1: Import the learning paths data
// To change available courses, update the data in this file
import { learningPaths } from './data/LearningPathsDiscover.js'

// Import our LearningHub-styled components and styles - UPDATED to use HydrationSafeCards
import HydrationSafeCards from '../LandingPageLibrary/HydrationSafeCards.js' // CHANGED from DiscoverCards
import {
  learningHubSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  subtitleStyle,
  accentLineStyle,
  helpSectionStyle,
  helpTitleStyle,
  helpDescriptionStyle,
  helpLinkStyle,
  categoryTitleStyle,
  cardsContainerStyle,
} from './styles/discoverstyles.js'

/**
 * DiscoverPage component - Creates a brand-compliant landing page for discovery
 * Now using HydrationSafeCards for consistent functionality across all pages
 */
const DiscoverPage = ({
  // Props with default values
  // CONTENT UPDATE POINT 2: Page title in the header
  headerTitle = 'DISCOVER PAGE',
  headerLogoHeight = 50,
  // CONTENT UPDATE POINT 3: Welcome banner text - now uses dark gradient background
  welcomeBannerProps = {
    textLines: [
      'Ready to learn the fundamentals of automation?',
      'From design to development, these courses will get you started.',
    ],
  },
  // CONTENT UPDATE POINT 4: Main welcome section text
  welcomeSectionProps = {
    title: 'Get Started with Automation the Right Way',
    content:
      "Whether you're just exploring automation or already planning your first workflow, this training series will set you up for success. Our beginner-friendly courses are designed to guide you from concept to implementation — no technical background required to get started.",
  },
  // CONTENT UPDATE POINT 5: Course cards content (flat array)
  // The actual course cards data comes from learningPaths import above
  // Expected format: Array of course objects with title, description, link, etc.
  resources = learningPaths,
  // CONTENT UPDATE POINT 6: Help section content
  helpSectionProps = {
    title: 'Need Help Getting Started?',
    description:
      'Have questions about which course is right for you? Our team is here to help you choose the perfect learning path.',
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
}) => {
  // Product info for discover page - mixed content gets general category
  const productInfo = {
    product: 'discover', // Custom product type for discover page
  }

  return (
    <>
      {/* Header Section - LearningHub Style */}
      <section style={learningHubSectionStyle} className='learning-hub-section'>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
            <div style={accentLineStyle}></div>
          </div>

          {/* Learning Paths Section */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={categoryTitleStyle}>Learning Paths</h2>

            {/* UPDATED: Use HydrationSafeCards instead of DiscoverCards */}
            <HydrationSafeCards
              resources={resources}
              productInfo={productInfo}
            />
          </div>

          {/* Help Section */}
          <div style={helpSectionStyle}>
            <h3 style={helpTitleStyle}>{helpSectionProps.title}</h3>
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

/**
 * CONTENT UPDATE GUIDE:
 *
 * 1. Page Header Text: Look for headerTitle = "DISCOVER PAGE"
 * 2. Learning Hub Data: Import from learningPaths in LearningPathsDiscover.js
 *    - Main title: welcomeSectionProps.title
 *    - Subtitle: welcomeSectionProps.content
 *    - Description: welcomeSectionProps.description
 * 3. Categories: learningPaths array - mixed content from different categories
 * 4. Course Cards: To modify course cards, update the LearningPathsDiscover.js file
 * 5. Help Section: helpSectionProps
 *    - Title: title property
 *    - Description: description property
 *    - Email: email property
 *    - Additional text: additionalText property
 *
 * CHANGES MADE:
 * - Replaced DiscoverCards with HydrationSafeCards
 * - Added productInfo for consistent footer handling
 * - Simplified structure while maintaining exact same layout
 * - Removed CSS injection complexity
 * - No more React Bootstrap dependencies
 */

export default DiscoverPage
