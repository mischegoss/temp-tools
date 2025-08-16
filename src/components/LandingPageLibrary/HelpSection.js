// @site/src/components/Actions/ActionsHelpSection.js

import React from 'react'
import Link from '@docusaurus/Link'
import {
  learningHubSectionStyle,
  containerStyle,
  createHelpSectionStyle,
  helpTitleStyle,
  helpDescriptionStyle,
  createHelpLinkStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme
const actionsTheme = getColorTheme('actions')

// Create themed styles
const helpSectionStyle = createHelpSectionStyle(actionsTheme.primary)
const helpLinkStyle = createHelpLinkStyle(actionsTheme.primary)

/**
 * ActionsHelpSection component - Help section for Actions landing page
 * Uses the exact same styling and structure as the existing ActionsIndex help section
 */
const HelpSection = ({
  helpSectionProps = {
    title: 'Need Help Getting Started?',
    description:
      'Have questions about which course is right for you? Our team is here to help you choose the perfect learning path.',
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
}) => {
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
