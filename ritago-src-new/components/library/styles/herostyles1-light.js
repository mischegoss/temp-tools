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

  // Base card styling with brand compliance (ORIGINAL LIGHT CARDS)
  baseCardStyle: {
    backgroundColor: 'var(--brand-white)',
    border: 'var(--product-stroke-outline)', // Uses ProductProvider theming
    borderRadius: '8px',
    padding: '24px',
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

  // NEW: Dark card styling (square cards with thick border)
  darkCardStyle: {
    background: 'var(--color-bg-footer)', // Match docs-navigation section background (--brand-black-700)
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    border: '3px solid var(--product-accent-color)', // Thick border
    aspectRatio: '1', // Makes cards perfectly square
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    cursor: 'pointer',
    minHeight: '200px', // Ensure minimum size for mobile
  },

  // NEW: Light card styling (square cards with thick border - WHITE VERSION)
  lightCardStyle: {
    background: 'var(--brand-white)', // White background
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
    border: '3px solid var(--product-accent-color)', // Thick border
    aspectRatio: '1', // Makes cards perfectly square
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    cursor: 'pointer',
    minHeight: '200px', // Ensure minimum size for mobile
  },

  // Card hover state following brand guidelines (ORIGINAL)
  cardHoverStyle: {
    transform: 'translateY(-5px)',
    boxShadow:
      '0 0 20px var(--product-accent-shadow-hover), 0 8px 24px var(--product-accent-shadow)',
  },

  // NEW: Dark card hover state
  darkCardHoverStyle: {
    transform: 'translateY(-5px)',
    boxShadow:
      '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px var(--product-accent-shadow)',
  },

  // NEW: Light card hover state
  lightCardHoverStyle: {
    transform: 'translateY(-5px)',
    boxShadow:
      '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 20px var(--product-accent-shadow)',
  },

  // Icon container
  iconContainerStyle: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center icons for square cards
  },

  // Icon styling with product theming (ORIGINAL)
  iconStyle: {
    width: '32px',
    height: '32px',
    color: 'var(--product-accent-color)', // Uses ProductProvider theming
  },

  // NEW: Dark card icon styling
  darkIconStyle: {
    width: '32px',
    height: '32px',
    color: 'var(--product-accent-color)', // Keep accent color for icons
  },

  // NEW: Light card icon styling
  lightIconStyle: {
    width: '32px',
    height: '32px',
    color: 'var(--product-accent-color)', // Keep accent color for icons
  },

  // Card title with brand typography (ORIGINAL)
  cardTitleStyle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '12px',
    lineHeight: '1.4',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // NEW: Dark card title styling
  darkCardTitleStyle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--brand-white)', // White text for dark cards
    lineHeight: '1.4',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    margin: 0,
    textAlign: 'center', // Center text for square cards
  },

  // NEW: Light card title styling
  lightCardTitleStyle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--brand-black)', // Black text for light cards
    lineHeight: '1.4',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    margin: 0,
    textAlign: 'center', // Center text for square cards
  },

  // Card content area with proper flexbox behavior
  cardContentStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    width: '100%',
    textAlign: 'left', // Left-align card content for better readability
  },

  // Card description with brand typography
  cardDescriptionStyle: {
    fontSize: '1rem',
    color: 'var(--brand-grey-600)',
    lineHeight: '1.6',
    marginBottom: '16px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    flexGrow: 1,
  },

  // Clickable description styling
  clickableDescriptionStyle: {
    fontSize: '1rem',
    color: 'var(--brand-grey-600)',
    lineHeight: '1.6',
    marginBottom: '16px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    flexGrow: 1,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },

  // Links container
  cardLinksStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '15px',
  },

  // Individual link styling with brand compliance
  cardLinkStyle: {
    color: 'var(--product-accent-color)', // Uses ProductProvider theming
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    display: 'inline-block',
    marginRight: '16px',
    marginBottom: '8px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Coming Soon Banner Styles
  comingSoonBannerStyle: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    zIndex: 2,
    minWidth: '85px',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    background: 'var(--brand-blue)', // Same blue as banner button
    boxShadow: '0 3px 12px rgba(0, 80, 199, 0.4)', // Blue shadow
  },

  // Disabled Card Overlay
  disabledCardOverlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '9px',
    pointerEvents: 'none',
    zIndex: 1,
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
    darkCardStyle: {
      padding: '20px',
      minHeight: '180px', // Smaller minimum height for mobile
    },
    lightCardStyle: {
      padding: '20px',
      minHeight: '180px', // Smaller minimum height for mobile
    },
    containerStyle: {
      padding: '0 16px',
    },
  },
}

export default heroStyles
