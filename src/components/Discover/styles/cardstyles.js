// DiscoverCards Styles - LearningHub Design System with Original Working Colors
// Complete styles for the DiscoverCards component

// Section and container styles
export const learningHubSectionStyle = {
  background: '#FFFFFF',
  padding: '80px 0',
  color: '#2D3748',
  width: '100%',
  margin: 0,
  position: 'relative',
}

export const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px',
  width: '100%',
}

export const cardsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
}

// No resources styles
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

// Original working button styles with LearningHub colors
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

// Level badge colors - LearningHub palette
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

// Footer colors - LearningHub categories
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

// Border colors - LearningHub palette
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
