// @site/src/components/LandingPageLibrary/styles/sharedStyles.js

/**
 * Shared Landing Page Styles
 * Used by Actions, Pro, Insights, and Express landing pages
 *
 * These styles are 100% identical across all products.
 * Product-specific colors are handled through the colorThemes system.
 */

// ============================================================================
// LAYOUT & STRUCTURE STYLES
// ============================================================================

// Main section and container styles
export const learningHubSectionStyle = {
  background: '#FFFFFF',
  padding: '80px 0',
  color: '#2D3748',
  width: '100%',
  margin: 0,
  position: 'relative',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
}

export const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px',
  width: '100%',
}

// Header section styles
export const headerStyle = {
  textAlign: 'center',
  marginBottom: '60px',
  paddingBottom: '40px',
}

export const sectionTitleStyle = {
  fontSize: '2.75rem',
  fontWeight: '600',
  color: '#2D3748',
  margin: '0 0 24px 0',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  lineHeight: '1.2',
}

export const subtitleStyle = {
  fontSize: '1.25rem',
  color: '#4A5568',
  fontWeight: '500',
  margin: '0 0 16px 0',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  lineHeight: '1.5',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
}

// ============================================================================
// FILTER SECTION STYLES
// ============================================================================

export const filterSectionStyle = {
  background: '#F7FAFC',
  padding: '40px 0',
  borderTop: '1px solid #E2E8F0',
  borderBottom: '1px solid #E2E8F0',
}

export const filterTitleStyle = {
  fontSize: '2rem',
  fontWeight: '600',
  color: '#2D3748',
  marginBottom: '16px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  textAlign: 'center',
  margin: '0 0 16px 0',
}

export const filterDescriptionStyle = {
  fontSize: '1.25rem',
  color: '#4A5568',
  fontWeight: '500',
  margin: '0 0 32px 0',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  lineHeight: '1.5',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center',
}

export const filterButtonsContainerStyle = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
}

// ============================================================================
// CARDS SECTION STYLES
// ============================================================================

export const cardsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
}

export const noResourcesStyle = {
  padding: '40px',
  backgroundColor: '#F7FAFC',
  borderRadius: '12px',
  textAlign: 'center',
  border: '1px solid #E2E8F0', // Default border - will be overridden by theme
}

export const noResourcesTextStyle = {
  fontSize: '1.25rem',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  color: '#4A5568',
  margin: '0',
}

// ============================================================================
// BUTTON BASE STYLES
// ============================================================================

export const buttonStyle = {
  background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)', // Default - will be overridden by theme
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '0.95rem',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontWeight: '500',
}

export const buttonHoverStyle = {
  background: 'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)', // Default - will be overridden by theme
}

export const disabledButtonStyle = {
  background: '#E2E8F0',
  color: '#718096',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '0.95rem',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  cursor: 'not-allowed',
  transition: 'all 0.3s ease',
  fontWeight: '500',
}

// ============================================================================
// HELP SECTION STYLES
// ============================================================================

export const helpSectionStyle = {
  background: '#F7FAFC',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  border: '1px solid #E2E8F0', // Default border - will be overridden by theme
  marginTop: '60px',
}

export const helpTitleStyle = {
  fontSize: '1.75rem',
  fontWeight: '600',
  color: '#2D3748',
  marginBottom: '16px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  margin: '0 0 16px 0',
}

export const helpDescriptionStyle = {
  color: '#4A5568',
  lineHeight: '1.6',
  marginBottom: '0',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  fontSize: '1rem',
  margin: '0',
}

// ============================================================================
// THEME-BASED STYLE GENERATORS
// ============================================================================

/**
 * Creates an accent line style with the specified color
 * @param {string} accentColor - The accent color for the line
 * @returns {Object} Style object for the accent line
 */
export const createAccentLineStyle = (accentColor = '#008B8B') => ({
  width: '100px',
  height: '3px',
  background: accentColor,
  margin: '40px auto 24px auto', // ✅ Added 24px bottom margin
})

/**
 * Creates a help link style with the specified color
 * @param {string} linkColor - The color for the help link
 * @returns {Object} Style object for the help link
 */
export const createHelpLinkStyle = (linkColor = '#008B8B') => ({
  color: linkColor,
  textDecoration: 'underline',
  transition: 'color 0.3s ease',
})

/**
 * Creates a no resources style with themed border
 * @param {string} borderColor - The border color for the no resources container
 * @returns {Object} Style object for no resources container
 */
export const createNoResourcesStyle = (borderColor = '#008B8B') => ({
  ...noResourcesStyle,
  border: `1px solid ${borderColor}`,
})

/**
 * Creates a help section style with themed border
 * @param {string} borderColor - The border color for the help section
 * @returns {Object} Style object for help section
 */
export const createHelpSectionStyle = (borderColor = '#008B8B') => ({
  ...helpSectionStyle,
  border: `1px solid ${borderColor}`,
})

// ============================================================================
// FILTER BUTTON STYLE GENERATORS
// ============================================================================

/**
 * Base filter button style generator
 * @param {string} filterType - The filter type ('all', 'beginner', 'intermediate', 'advanced')
 * @param {Object} colorTheme - Color theme object with gradient/border/shadow colors
 * @returns {Object} Style object for filter button
 */
export const createFilterButtonStyle = (filterType, colorTheme) => {
  const { gradients, borderColors, shadowColors } = colorTheme

  return {
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    background: gradients[filterType],
    color: '#FFFFFF',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: borderColors[filterType],
    transition: 'all 0.3s ease',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    boxShadow: `0 0 10px ${shadowColors[filterType]}, 0 2px 8px rgba(0, 0, 0, 0.1)`,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  }
}

/**
 * Filter button hover style generator
 * @param {string} filterType - The filter type
 * @param {Object} colorTheme - Color theme object
 * @returns {Object} Hover style object
 */
export const createFilterHoverStyle = (filterType, colorTheme) => {
  const { shadowColors } = colorTheme

  return {
    boxShadow: `0 0 15px ${shadowColors[filterType]}, 0 4px 12px rgba(0, 0, 0, 0.2)`,
    transform: 'translateY(-2px)',
    borderColor: '#0066ff',
  }
}

/**
 * Filter button active style generator
 * @param {string} filterType - The filter type
 * @param {Object} colorTheme - Color theme object
 * @returns {Object} Active style object
 */
export const createFilterActiveStyle = (filterType, colorTheme) => {
  const { borderColors, activeGlowColors } = colorTheme

  return {
    boxShadow: `0 0 0 3px #FFFFFF, 0 0 0 5px ${borderColors[filterType]}, 0 0 20px ${activeGlowColors[filterType]}`,
    transform: 'translateY(-3px)',
    borderColor: '#0066ff',
  }
}

// ============================================================================
// CARD STYLING GENERATORS
// ============================================================================

/**
 * Level badge color generator
 * @param {string} level - The level ('beginner', 'intermediate', 'advanced')
 * @param {Object} cardColors - Card color theme object
 * @returns {string} Color for the level badge
 */
export const createLevelBadgeColor = (level, cardColors) => {
  const levelColorMap = {
    beginner: cardColors.beginner || '#4A90E2',
    intermediate: cardColors.intermediate || '#1E3A8A',
    advanced: cardColors.advanced || '#008B8B',
  }

  return levelColorMap[level?.toLowerCase()] || cardColors.default || '#008B8B'
}

/**
 * Footer color generator based on content type
 * @param {string} contentType - The content type
 * @param {Object} cardColors - Card color theme object
 * @returns {string} Color for the footer
 */
export const createFooterColor = (contentType, cardColors) => {
  const contentColorMap = {
    'device discovery and management': cardColors.deviceDiscovery || '#008B8B',
    'automation development': cardColors.automationDev || '#1E3A8A',
    'automation design': cardColors.automationDesign || '#4A90E2',
    'product overview': cardColors.productOverview || '#008B8B',
  }

  return contentColorMap[contentType] || cardColors.default || '#008B8B'
}

/**
 * Border color generator based on level
 * @param {string} level - The level
 * @param {Object} cardColors - Card color theme object
 * @returns {string} Border color
 */
export const createBorderColor = (level, cardColors) => {
  const borderColorMap = {
    beginner: cardColors.beginner || '#4A90E2',
    intermediate: cardColors.intermediate || '#1E3A8A',
    advanced: cardColors.advanced || '#008B8B',
  }

  return borderColorMap[level?.toLowerCase()] || cardColors.default || '#008B8B'
}

// ============================================================================
// COMPATIBILITY EXPORTS FOR EXISTING COMPONENTS
// ============================================================================

/**
 * These exports provide backward compatibility for existing components
 * that expect the old function names. These will be removed in a future refactor.
 */

// Default theme for compatibility (Actions theme)
const defaultFilterColors = {
  gradients: {
    all: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
    beginner: 'linear-gradient(to bottom, #05070f 0%, #00b8de 100%)',
    intermediate: 'linear-gradient(to bottom, #05070f 0%, #0050c7 100%)',
    advanced: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
  },
  borderColors: {
    all: '#0d1637',
    beginner: '#00b8de',
    intermediate: '#0050c7',
    advanced: '#0d1637',
  },
  shadowColors: {
    all: 'rgba(13, 22, 55, 0.2)',
    beginner: 'rgba(0, 184, 222, 0.2)',
    intermediate: 'rgba(0, 80, 199, 0.2)',
    advanced: 'rgba(13, 22, 55, 0.2)',
  },
  activeGlowColors: {
    all: 'rgba(13, 22, 55, 0.4)',
    beginner: 'rgba(0, 184, 222, 0.4)',
    intermediate: 'rgba(0, 80, 199, 0.4)',
    advanced: 'rgba(13, 22, 55, 0.4)',
  },
}

const defaultCardColors = {
  beginner: '#4A90E2',
  intermediate: '#1E3A8A',
  advanced: '#008B8B',
  default: '#008B8B',
  deviceDiscovery: '#008B8B',
  automationDev: '#1E3A8A',
  automationDesign: '#4A90E2',
  productOverview: '#008B8B',
}

// Compatibility function exports
export const getFilterButtonStyle = filterType =>
  createFilterButtonStyle(filterType, defaultFilterColors)

export const getFilterHoverStyle = filterType =>
  createFilterHoverStyle(filterType, defaultFilterColors)

export const getFilterActiveStyle = filterType =>
  createFilterActiveStyle(filterType, defaultFilterColors)

export const getLevelBadgeColor = level =>
  createLevelBadgeColor(level, defaultCardColors)

export const getFooterColor = contentType =>
  createFooterColor(contentType, defaultCardColors)

export const getBorderColor = level =>
  createBorderColor(level, defaultCardColors)

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
// How to use in product-specific style files:

import { 
  learningHubSectionStyle,
  containerStyle,
  createAccentLineStyle,
  createFilterButtonStyle,
  createHelpLinkStyle
} from '@site/src/components/LandingPageLibrary/styles/sharedStyles'

import { actionColorTheme } from '@site/src/components/LandingPageLibrary/styles/colorThemes'

// Use shared styles directly
export { learningHubSectionStyle, containerStyle }

// Create themed styles
export const accentLineStyle = createAccentLineStyle(actionColorTheme.primary)
export const helpLinkStyle = createHelpLinkStyle(actionColorTheme.primary)
export const getFilterButtonStyle = (filterType) => 
  createFilterButtonStyle(filterType, actionColorTheme.filterColors)

*/
