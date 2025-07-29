// ActionsStyles.js - LearningHub Design System styles for Actions landing page

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

export const accentLineStyle = {
  width: '100px',
  height: '3px',
  background: '#008B8B',
  margin: '40px auto 0 auto',
}

// Filter section styles
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

// Filter button styles with brand colors
export const getFilterButtonStyle = filterType => {
  const gradients = {
    all: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
    beginner: 'linear-gradient(to bottom, #05070f 0%, #00b8de 100%)',
    intermediate: 'linear-gradient(to bottom, #05070f 0%, #0050c7 100%)',
    advanced: 'linear-gradient(to bottom, #05070f 0%, #0d1637 100%)',
  }

  const borderColors = {
    all: '#0d1637',
    beginner: '#00b8de',
    intermediate: '#0050c7',
    advanced: '#0d1637',
  }

  const shadowColors = {
    all: 'rgba(13, 22, 55, 0.2)',
    beginner: 'rgba(0, 184, 222, 0.2)',
    intermediate: 'rgba(0, 80, 199, 0.2)',
    advanced: 'rgba(13, 22, 55, 0.2)',
  }

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

export const getFilterHoverStyle = filterType => {
  const shadowColors = {
    all: 'rgba(13, 22, 55, 0.3)',
    beginner: 'rgba(0, 184, 222, 0.3)',
    intermediate: 'rgba(0, 80, 199, 0.3)',
    advanced: 'rgba(13, 22, 55, 0.3)',
  }

  return {
    boxShadow: `0 0 15px ${shadowColors[filterType]}, 0 4px 12px rgba(0, 0, 0, 0.2)`,
    transform: 'translateY(-2px)',
    borderColor: '#0066ff',
  }
}

export const getFilterActiveStyle = filterType => {
  const borderColors = {
    all: '#0d1637',
    beginner: '#00b8de',
    intermediate: '#0050c7',
    advanced: '#0d1637',
  }

  const activeGlowColors = {
    all: 'rgba(13, 22, 55, 0.4)',
    beginner: 'rgba(0, 184, 222, 0.4)',
    intermediate: 'rgba(0, 80, 199, 0.4)',
    advanced: 'rgba(13, 22, 55, 0.4)',
  }

  return {
    boxShadow: `0 0 0 3px #FFFFFF, 0 0 0 5px ${borderColors[filterType]}, 0 0 20px ${activeGlowColors[filterType]}`,
    transform: 'translateY(-3px)',
    borderColor: '#0066ff',
  }
}

// Cards styles
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
  border: '1px solid #008B8B',
}

export const noResourcesTextStyle = {
  fontSize: '1.25rem',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  color: '#4A5568',
  margin: '0',
}

// Button styles
export const buttonStyle = {
  background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)',
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
  background: 'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)',
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

// Level badge colors
export const getLevelBadgeColor = level => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return '#4A90E2' // Automation Design blue
    case 'intermediate':
      return '#1E3A8A' // Automation Development blue
    case 'advanced':
      return '#008B8B' // Teal for advanced
    default:
      return '#008B8B' // Default teal
  }
}

// Footer colors
export const getFooterColor = contentType => {
  switch (contentType) {
    case 'device discovery and management':
      return '#008B8B' // Teal
    case 'automation development':
      return '#1E3A8A' // Dark blue
    case 'automation design':
      return '#4A90E2' // Blue
    case 'product overview':
      return '#008B8B' // Teal
    default:
      return '#008B8B' // Default teal
  }
}

// Border colors
export const getBorderColor = level => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return '#4A90E2' // Blue
    case 'intermediate':
      return '#1E3A8A' // Dark blue
    case 'advanced':
      return '#008B8B' // Teal
    default:
      return '#008B8B' // Default teal
  }
}

// Help section styles
export const helpSectionStyle = {
  background: '#F7FAFC',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  border: '1px solid #008B8B',
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

export const helpLinkStyle = {
  color: '#008B8B',
  textDecoration: 'underline',
  transition: 'color 0.3s ease',
}
