export const learningHubSectionStyle = {
  background: '#FFFFFF', // Light background instead of dark
  padding: '80px 0',
  color: '#2D3748', // Dark text on light background
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

export const categoryTitleStyle = {
  fontSize: '2rem',
  fontWeight: '600',
  color: '#2D3748',
  marginBottom: '30px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
}

export const courseCardStyle = {
  background: '#FFFFFF',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  border: '2px solid #008B8B', // Teal border
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 139, 139, 0.1)', // Subtle teal shadow
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 139, 139, 0.15)',
  },
}

export const courseContentStyle = {
  padding: '30px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  flexGrow: 1,
}

export const courseInfoStyle = {
  flexGrow: 1,
  minWidth: 0, // Allows text to wrap properly
}

export const courseTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#2D3748',
  marginBottom: '8px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  margin: '0 0 8px 0',
}

export const courseDescriptionStyle = {
  color: '#4A5568',
  lineHeight: '1.6',
  margin: '0',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  fontSize: '1rem',
}

export const buttonContainerStyle = {
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
}

export const viewCatalogButtonStyle = {
  background: 'linear-gradient(135deg, #0066FF 0%, #00B8DE 100%)', // Blue to aqua gradient
  color: '#FFFFFF',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
  ':hover': {
    background: 'linear-gradient(135deg, #0052CC 0%, #0099B8 100%)',
    transform: 'translateY(-1px)',
  },
}

export const comingSoonButtonStyle = {
  background: '#E2E8F0',
  color: '#718096',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '500',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  border: 'none',
  cursor: 'not-allowed',
  fontSize: '0.95rem',
}

export const categoryBarStyle = {
  padding: '12px 20px',
  color: '#FFFFFF',
  fontSize: '0.9rem',
  fontWeight: '500',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  textAlign: 'center',
}
