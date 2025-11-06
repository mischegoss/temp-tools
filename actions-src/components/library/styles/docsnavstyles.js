export const docsSectionStyle = {
  background: 'var(--color-bg-footer)', // Same as footer background (--brand-black-700)
  borderTop: '1px solid var(--product-accent-color)', // Thin top border with product accent
  borderBottom: '1px solid var(--product-accent-color)', // Thin bottom border with product accent
  padding: '80px 0',
  color: 'var(--brand-white)', // Using brand white
  width: '100%',
  margin: 0,
  position: 'relative', // For the gradient border pseudo-element
}

export const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px',
  width: '100%',
}

export const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '50px',
}

export const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: '600',
  color: 'var(--brand-white)', // Using brand white
  margin: '0',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', // Using brand font
}

export const exploreButtonStyle = {
  background: 'var(--brand-blue)', // Using brand blue
  color: 'var(--brand-white)', // Using brand white
  padding: '12px 24px',
  borderRadius: '50px', // More oval/pill shape
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', // Using brand font
  border: 'none',
}

export const baseNavCardStyle = {
  background: '#0A0F1C', // Black-blue color for softer appearance
  borderRadius: '12px',
  padding: '30px 25px',
  transition: 'all 0.3s ease',
  border: '1px solid var(--product-accent-color)', // Thin border with product accent color
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

export const iconContainerStyle = {
  marginBottom: '20px',
}

export const iconStyle = {
  width: '32px',
  height: '32px',
}

export const cardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: 'var(--brand-white)', // Using brand white
  marginBottom: '12px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', // Using brand font
}

export const cardDescriptionStyle = {
  color: 'var(--brand-grey-500)', // Using brand grey-500 for description text
  lineHeight: '1.6',
  marginBottom: '20px',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', // Using brand font
  flexGrow: 1,
}

export const learnMoreLinkStyle = {
  color: 'var(--brand-white)', // Using brand white
  textDecoration: 'none',
  fontWeight: '500',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'color 0.2s ease',
  marginTop: 'auto',
  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', // Using brand font
}

export const arrowStyle = {
  fontSize: '1.2rem',
}

export const gradientBorderCSS = `
    .docs-navigation-section::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(180deg, 
        var(--color-bg-footer) 0%, 
        var(--brand-black-700) 25%, 
        var(--brand-black-700) 50%, 
        var(--brand-black-700) 100%
      );
      z-index: 1;
    }
  `
