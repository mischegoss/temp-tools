// @site/src/components/LandingPageLibrary/WelcomeSection.js

import React from 'react'
import {
  learningHubSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  subtitleStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * WelcomeSection component - Welcome section with product-specific colors
 * Uses product colors for the accent line to match brand identity
 */
const WelcomeSection = ({
  welcomeSectionProps = {
    title: 'Welcome to Resolve Actions Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Actions. Our Learning Paths will quickly get you started in exploring our latest automation platform.',
  },
  productColors = {
    accent: 'var(--brand-blue)', // Default to Actions blue
  },
}) => {
  // Create accent line with product-specific color
  const accentLineStyle = {
    width: '100px',
    height: '3px',
    background: productColors.accent,
    margin: '40px auto 24px auto', // Fixed spacing between line and paragraph
  }

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
