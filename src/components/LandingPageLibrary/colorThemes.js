// @site/src/components/LandingPageLibrary/styles/colorThemes.js

/**
 * Color Themes for Landing Page Library
 * Defines product-specific color schemes for Actions, Pro, Insights, and Express
 *
 * Each theme contains:
 * - Primary/secondary colors
 * - Filter button colors (gradients, borders, shadows)
 * - Card colors (badges, footers, borders)
 * - Button gradients
 */

// ============================================================================
// ACTIONS COLOR THEME (Blue)
// ============================================================================

export const actionsColorTheme = {
  // Primary colors
  primary: '#0066FF', // Brand blue
  secondary: '#00B8DE', // Light blue
  accent: '#008B8B', // Teal accent

  // Filter button colors
  filterColors: {
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
  },

  // Card colors
  cardColors: {
    beginner: '#4A90E2', // Automation Design blue
    intermediate: '#1E3A8A', // Automation Development blue
    advanced: '#008B8B', // Teal for advanced
    default: '#008B8B', // Default teal
    deviceDiscovery: '#008B8B', // Teal
    automationDev: '#1E3A8A', // Dark blue
    automationDesign: '#4A90E2', // Blue
    productOverview: '#008B8B', // Teal
  },

  // Button gradients
  buttonGradients: {
    primary: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
    hover: 'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)',
  },
}

// ============================================================================
// PRO COLOR THEME (Green)
// ============================================================================

export const proColorTheme = {
  // Primary colors
  primary: '#00A86B', // Brand green
  secondary: '#00D084', // Light green
  accent: '#008B8B', // Teal accent

  // Filter button colors
  filterColors: {
    gradients: {
      all: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
      beginner: 'linear-gradient(to bottom, #05070f 0%, #00D084 100%)',
      intermediate: 'linear-gradient(to bottom, #05070f 0%, #00A86B 100%)',
      advanced: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
    },
    borderColors: {
      all: '#0d1637',
      beginner: '#00D084',
      intermediate: '#00A86B',
      advanced: '#0d1637',
    },
    shadowColors: {
      all: 'rgba(13, 22, 55, 0.2)',
      beginner: 'rgba(0, 208, 132, 0.2)',
      intermediate: 'rgba(0, 168, 107, 0.2)',
      advanced: 'rgba(13, 22, 55, 0.2)',
    },
    activeGlowColors: {
      all: 'rgba(13, 22, 55, 0.4)',
      beginner: 'rgba(0, 208, 132, 0.4)',
      intermediate: 'rgba(0, 168, 107, 0.4)',
      advanced: 'rgba(13, 22, 55, 0.4)',
    },
  },

  // Card colors
  cardColors: {
    beginner: '#4AE290', // Light green
    intermediate: '#00A86B', // Brand green
    advanced: '#008B8B', // Teal for advanced
    default: '#008B8B', // Default teal
    deviceDiscovery: '#008B8B', // Teal
    automationDev: '#00A86B', // Brand green
    automationDesign: '#4AE290', // Light green
    productOverview: '#008B8B', // Teal
  },

  // Button gradients
  buttonGradients: {
    primary: 'linear-gradient(135deg, #00A86B 0%, #00D084 100%)',
    hover: 'linear-gradient(135deg, #008B57 0%, #00B370 100%)',
  },
}

// ============================================================================
// INSIGHTS COLOR THEME (Teal)
// ============================================================================

export const insightsColorTheme = {
  // Primary colors
  primary: '#008B8B', // Brand teal
  secondary: '#20B2AA', // Light teal
  accent: '#008B8B', // Teal accent

  // Filter button colors
  filterColors: {
    gradients: {
      all: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
      beginner: 'linear-gradient(to bottom, #05070f 0%, #20B2AA 100%)',
      intermediate: 'linear-gradient(to bottom, #05070f 0%, #008B8B 100%)',
      advanced: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
    },
    borderColors: {
      all: '#0d1637',
      beginner: '#20B2AA',
      intermediate: '#008B8B',
      advanced: '#0d1637',
    },
    shadowColors: {
      all: 'rgba(13, 22, 55, 0.2)',
      beginner: 'rgba(32, 178, 170, 0.2)',
      intermediate: 'rgba(0, 139, 139, 0.2)',
      advanced: 'rgba(13, 22, 55, 0.2)',
    },
    activeGlowColors: {
      all: 'rgba(13, 22, 55, 0.4)',
      beginner: 'rgba(32, 178, 170, 0.4)',
      intermediate: 'rgba(0, 139, 139, 0.4)',
      advanced: 'rgba(13, 22, 55, 0.4)',
    },
  },

  // Card colors
  cardColors: {
    beginner: '#20B2AA', // Light teal
    intermediate: '#008B8B', // Brand teal
    advanced: '#006666', // Dark teal
    default: '#008B8B', // Default teal
    deviceDiscovery: '#008B8B', // Brand teal
    automationDev: '#006666', // Dark teal
    automationDesign: '#20B2AA', // Light teal
    productOverview: '#008B8B', // Brand teal
  },

  // Button gradients
  buttonGradients: {
    primary: 'linear-gradient(135deg, #008B8B 0%, #20B2AA 100%)',
    hover: 'linear-gradient(135deg, #006666 0%, #1A9999 100%)',
  },
}

// ============================================================================
// EXPRESS COLOR THEME (Purple)
// ============================================================================

export const expressColorTheme = {
  // Primary colors
  primary: '#6B46C1', // Brand purple
  secondary: '#8B5CF6', // Light purple
  accent: '#008B8B', // Teal accent

  // Filter button colors
  filterColors: {
    gradients: {
      all: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
      beginner: 'linear-gradient(to bottom, #05070f 0%, #8B5CF6 100%)',
      intermediate: 'linear-gradient(to bottom, #05070f 0%, #6B46C1 100%)',
      advanced: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
    },
    borderColors: {
      all: '#0d1637',
      beginner: '#8B5CF6',
      intermediate: '#6B46C1',
      advanced: '#0d1637',
    },
    shadowColors: {
      all: 'rgba(13, 22, 55, 0.2)',
      beginner: 'rgba(139, 92, 246, 0.2)',
      intermediate: 'rgba(107, 70, 193, 0.2)',
      advanced: 'rgba(13, 22, 55, 0.2)',
    },
    activeGlowColors: {
      all: 'rgba(13, 22, 55, 0.4)',
      beginner: 'rgba(139, 92, 246, 0.4)',
      intermediate: 'rgba(107, 70, 193, 0.4)',
      advanced: 'rgba(13, 22, 55, 0.4)',
    },
  },

  // Card colors
  cardColors: {
    beginner: '#8B5CF6', // Light purple
    intermediate: '#6B46C1', // Brand purple
    advanced: '#553C9A', // Dark purple
    default: '#008B8B', // Default teal
    deviceDiscovery: '#008B8B', // Teal
    automationDev: '#6B46C1', // Brand purple
    automationDesign: '#8B5CF6', // Light purple
    productOverview: '#008B8B', // Teal
  },

  // Button gradients
  buttonGradients: {
    primary: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
    hover: 'linear-gradient(135deg, #553C9A 0%, #7C3AED 100%)',
  },
}

// ============================================================================
// THEME SELECTOR
// ============================================================================

/**
 * Get color theme by product name
 * @param {string} product - Product name ('actions', 'pro', 'insights', 'express')
 * @returns {Object} Color theme object
 */
export const getColorTheme = product => {
  const themes = {
    actions: actionsColorTheme,
    pro: proColorTheme,
    insights: insightsColorTheme,
    express: expressColorTheme,
  }

  return themes[product?.toLowerCase()] || actionsColorTheme
}

/**
 * Get all available themes
 * @returns {Object} Object containing all themes
 */
export const getAllThemes = () => ({
  actions: actionsColorTheme,
  pro: proColorTheme,
  insights: insightsColorTheme,
  express: expressColorTheme,
})

// ============================================================================
// CSS VARIABLE GENERATORS
// ============================================================================

/**
 * Generate CSS custom properties for a theme
 * Useful for CSS-in-JS or dynamic styling
 * @param {Object} theme - Color theme object
 * @returns {Object} CSS custom properties object
 */
export const generateCSSVariables = theme => ({
  '--theme-primary': theme.primary,
  '--theme-secondary': theme.secondary,
  '--theme-accent': theme.accent,
  '--theme-button-primary': theme.buttonGradients.primary,
  '--theme-button-hover': theme.buttonGradients.hover,
  '--theme-badge-beginner': theme.cardColors.beginner,
  '--theme-badge-intermediate': theme.cardColors.intermediate,
  '--theme-badge-advanced': theme.cardColors.advanced,
  '--theme-default': theme.cardColors.default,
})

/**
 * Generate CSS variables string for injection
 * @param {Object} theme - Color theme object
 * @returns {string} CSS variables as string
 */
export const generateCSSVariablesString = theme => {
  const variables = generateCSSVariables(theme)
  return Object.entries(variables)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n  ')
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Get theme and use in styles
import { getColorTheme, actionsColorTheme } from './colorThemes'
import { createAccentLineStyle, createFilterButtonStyle } from './sharedStyles'

const theme = getColorTheme('actions')
export const accentLineStyle = createAccentLineStyle(theme.primary)
export const getFilterButtonStyle = (filterType) => 
  createFilterButtonStyle(filterType, theme.filterColors)

// Example 2: Direct theme usage
import { actionsColorTheme } from './colorThemes'
import { createHelpLinkStyle } from './sharedStyles'

export const helpLinkStyle = createHelpLinkStyle(actionsColorTheme.primary)

// Example 3: CSS Variables (for CSS-in-JS)
import { generateCSSVariables, insightsColorTheme } from './colorThemes'

const cssVars = generateCSSVariables(insightsColorTheme)
// Use with styled-components, emotion, etc.

// Example 4: Multiple themes
import { getAllThemes } from './colorThemes'

const allThemes = getAllThemes()
// Use for theme switching, comparisons, etc.
*/
