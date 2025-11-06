const heroStyles = {
  // Section styling with brand compliance
  heroSectionStyle: {
    background: 'var(--brand-white)',
    padding: '100px 0 120px 0', // Brand guideline spacing
    minHeight: '70vh', // Brand guideline height
    width: '100%',
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Brand overlay effect
  overlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.02) 0%, transparent 50%)',
    pointerEvents: 'none',
  },

  // Container with brand proportions
  containerStyle: {
    maxWidth: '1440px', // Brand guideline max width
    margin: '0 auto',
    padding: '0 60px', // Brand guideline padding
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },

  // Hero content area
  heroContentStyle: {
    textAlign: 'center',
    marginBottom: '48px',
  },

  // Main title with brand typography
  heroTitleStyle: {
    fontSize: '3.5rem',
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '24px',
    lineHeight: '1.2',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Subtitle with brand typography
  heroSubtitleStyle: {
    fontSize: '1.25rem',
    color: 'var(--brand-grey-600)',
    maxWidth: '800px',
    margin: '0 auto 48px auto',
    lineHeight: '1.6',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Base card styling with split layout
  baseCardStyle: {
    backgroundColor: 'var(--brand-white)',
    border: 'var(--product-stroke-outline)', // Uses ProductProvider theming
    borderRadius: '12px',
    padding: '0', // Remove padding since we'll add it to sections
    transition: 'all 0.3s ease-in-out',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      '0 0 15px var(--product-accent-shadow), 0 2px 8px rgba(5, 7, 15, 0.1)',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    cursor: 'pointer',
  },

  // Gradient header section for cards
  cardHeaderStyle: {
    background: 'var(--product-gradient)', // Uses ProductProvider gradient
    padding: '32px 24px 28px 24px',
    position: 'relative',
    minHeight: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // White content section for cards
  cardContentStyle: {
    backgroundColor: 'var(--brand-white)',
    padding: '20px 24px 24px 24px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  // Card hover state following brand guidelines
  cardHoverStyle: {
    transform: 'translateY(-5px)',
    boxShadow:
      '0 0 20px var(--product-accent-shadow-hover), 0 8px 24px var(--product-accent-shadow)',
  },

  // Icon container in gradient section
  iconContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // Icon styling with much bigger colored circular background
  iconStyle: {
    width: '56px',
    height: '56px',
    color: 'var(--brand-white)', // White icon on colored background
    backgroundColor: 'var(--product-accent-color)', // Colored circular background
    borderRadius: '50%',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow:
      '0 6px 20px rgba(255, 255, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
  },

  // Card title with brand typography (in white section)
  cardTitleStyle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '12px',
    marginTop: '0',
    lineHeight: '1.4',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Card description with brand typography (in white section)
  cardDescriptionStyle: {
    fontSize: '1rem',
    color: 'var(--brand-grey-600)',
    lineHeight: '1.6',
    marginBottom: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    flexGrow: 1,
  },

  // Clickable description styling with dark secondary hover
  clickableDescriptionStyle: {
    fontSize: '1rem',
    color: 'var(--brand-grey-600)',
    lineHeight: '1.6',
    marginBottom: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    flexGrow: 1,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },

  // Links container (in white section)
  cardLinksStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '16px',
  },

  // Individual link styling with dark secondary colors
  cardLinkStyle: {
    color: 'var(--product-dark-secondary)', // Uses dark secondary color for each product
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    display: 'inline-block',
    marginRight: '16px',
    marginBottom: '8px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Responsive breakpoints following brand guidelines
  '@media (max-width: 768px)': {
    heroTitleStyle: {
      fontSize: '2.5rem',
    },
    heroSubtitleStyle: {
      fontSize: '1.1rem',
    },
    containerStyle: {
      padding: '0 24px',
    },
    heroSectionStyle: {
      padding: '60px 0 80px 0',
    },
  },

  '@media (max-width: 480px)': {
    heroTitleStyle: {
      fontSize: '2rem',
    },
    heroSubtitleStyle: {
      fontSize: '1rem',
    },
    baseCardStyle: {
      padding: '20px',
    },
    containerStyle: {
      padding: '0 16px',
    },
  },
}

export default heroStyles
