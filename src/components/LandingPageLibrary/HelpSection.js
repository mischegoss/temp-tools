// @site/src/components/LandingPageLibrary/HelpSection.js

import React from 'react'
import Link from '@docusaurus/Link'
import {
  learningHubSectionStyle,
  containerStyle,
  helpTitleStyle,
  helpDescriptionStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * HelpSection component - Help section with product-specific colors
 * Uses product colors for the frame border to match brand identity
 */
const HelpSection = ({
  helpSectionProps = {
    title: 'Need Help Getting Started?',
    description:
      'Have questions about which course is right for you? Our team is here to help you choose the perfect learning path.',
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
  productColors = {
    accent: 'var(--brand-blue)', // Default to Actions blue
  },
}) => {
  // Create help section frame with product-specific border color
  const helpSectionStyle = {
    background: '#F7FAFC',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    border: `1px solid ${productColors.accent}`, // Product-specific border color
  }

  // Create help link with product-specific color
  const helpLinkStyle = {
    color: productColors.accent, // Product-specific link color
    textDecoration: 'underline',
    transition: 'color 0.3s ease',
  }

  // Modified section style with reduced spacing (matches ActionsIndex)
  const helpSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '20px 0 80px 0', // Reduced top padding
  }

  return (
    <section style={helpSectionStyleReduced} className='help-section'>
      <div style={containerStyle}>
        <div style={helpSectionStyle}>
          <h2 style={helpTitleStyle}>{helpSectionProps.title}</h2>
          <p style={helpDescriptionStyle}>
            {helpSectionProps.description}{' '}
            <Link to={`mailto:${helpSectionProps.email}`} style={helpLinkStyle}>
              {helpSectionProps.email}
            </Link>{' '}
            {helpSectionProps.additionalText}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HelpSection
