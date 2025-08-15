// @site/src/components/Actions/ActionsWelcomeSection.js

import React from 'react'
import {
  learningHubSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  subtitleStyle,
  createAccentLineStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme
const actionsTheme = getColorTheme('actions')

// Create themed accent line
const accentLineStyle = createAccentLineStyle(actionsTheme.primary)

/**
 * ActionsWelcomeSection component - Welcome section for Actions landing page
 * Uses the exact same styling as the existing ActionsIndex welcome section
 */
const WelcomeSection = ({
  welcomeSectionProps = {
    title: 'Welcome to Resolve Actions Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Actions. Our Learning Paths will quickly get you started in exploring our latest automation platform.',
  },
}) => {
  // Modified section style with reduced spacing (matches ActionsIndex)
  const welcomeSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '80px 0 0px 0', // Eliminated bottom padding
  }

  return (
    <section style={welcomeSectionStyleReduced} className='welcome-section'>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
          <div style={accentLineStyle}></div>
          <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection
