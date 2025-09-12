import React from 'react'
import Link from '@docusaurus/Link'
import { learningPaths } from '@site/src/components/Data/LearningPathsServiceBlueprinting'

// Import discover page components and styles to match exactly
import DiscoverCards from '@site/src/components/Discover/discovercards'
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
} from '@site/src/components/Discover/styles/discoverstyles.js'

/**
 * ServiceBlueprintingPage component - Public page matching discover page structure
 * No authentication required - completely open to public
 */
const ServiceBlueprintingPage = () => {
  return (
    <div>
      {/* Main content section matching discover page exactly */}
      <section style={learningHubSectionStyle}>
        <div style={containerStyle}>
          {/* Header section */}
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>Service Blueprinting Learning</h1>
            <p style={subtitleStyle}>
              Master the fundamentals of service blueprinting and automation
              design. Learn how to document, assess, and prepare your business
              processes for automation through proven blueprinting techniques.
            </p>
            <div style={accentLineStyle}></div>
          </div>

          {/* Learning paths section */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={categoryTitleStyle}>Learning Paths</h2>
            <DiscoverCards resources={learningPaths} hideSection={true} />
          </div>

          {/* Help section matching discover page */}
          <div style={helpSectionStyle}>
            <h3 style={helpTitleStyle}>Need Help Getting Started?</h3>
            <p style={helpDescriptionStyle}>
              Have questions about service blueprinting or which learning path
              is right for you? Our team is here to help you choose the perfect
              starting point. Email us at{' '}
              <Link to='mailto:training@resolve.io' style={helpLinkStyle}>
                training@resolve.io
              </Link>{' '}
              and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceBlueprintingPage
