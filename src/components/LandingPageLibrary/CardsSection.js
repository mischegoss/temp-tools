// @site/src/components/Actions/ActionsCardsSection.js

import React from 'react'
import LandingPageCards from '@site/src/components/LandingPageLibrary/landingpagecards.js'
import {
  learningHubSectionStyle,
  containerStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'
import { getColorTheme } from '@site/src/components/LandingPageLibrary/colorThemes.js'

// Get Actions color theme
const actionsTheme = getColorTheme('actions')

/**
 * ActionsCardsSection component - Cards section for Actions landing page
 * Uses the exact same styling and structure as the existing ActionsIndex cards section
 */
const CardsSection = ({ filteredPaths = [] }) => {
  // Modified section style with reduced spacing (matches ActionsIndex)
  const cardsSectionStyleReduced = {
    ...learningHubSectionStyle,
    padding: '40px 0 20px 0', // Reduced spacing above and below cards
  }

  return (
    <section style={cardsSectionStyleReduced} className='cards-section'>
      <div style={containerStyle}>
        <LandingPageCards
          resources={filteredPaths}
          hideSection={true}
          colorTheme={actionsTheme}
        />
      </div>
    </section>
  )
}

export default CardsSection
