export const homePageStyles = {
  // Main section container - Using dark aqua gradient
  sectionStyle: {
    background:
      'linear-gradient(to bottom, #051414 0%, #02636f 40%, #00b8de 80%, var(--brand-aqua) 100%)',
    padding: '100px 0 120px 0',
    minHeight: '70vh',
    width: '100%',
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Container for content
  containerStyle: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 60px',
    width: '100%',
    position: 'relative',
    zIndex: 2,
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Mobile version of container
  containerStyleMobile: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 20px',
    width: '100%',
    position: 'relative',
    zIndex: 2,
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Header content area
  headerContentStyle: {
    textAlign: 'center',
    marginBottom: '80px',
  },

  // Mobile header content
  headerContentStyleMobile: {
    textAlign: 'center',
    marginBottom: '60px',
  },

  // Main title styling
  mainTitleStyle: {
    fontSize: '4rem',
    fontWeight: '600',
    color: 'var(--brand-white)',
    marginBottom: '24px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    lineHeight: '1.2',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // Mobile version of main title
  mainTitleStyleMobile: {
    fontSize: '2.75rem',
    fontWeight: '600',
    color: 'var(--brand-white)',
    marginBottom: '24px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    lineHeight: '1.2',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // Subtitle styling
  subtitleStyle: {
    fontSize: '1.3rem',
    color: 'var(--brand-white)',
    fontWeight: '500',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },

  // Mobile version of subtitle
  subtitleStyleMobile: {
    fontSize: '1.2rem',
    color: 'var(--brand-white)',
    fontWeight: '500',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },

  // Cards grid container - CSS Grid approach for guaranteed layout
  cardsGridStyle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns on smaller screens
    gap: '32px',
    width: '100%',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns on larger screens
    },
  },

  // Mobile cards grid
  cardsGridStyleMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Always 2 columns on mobile
    gap: '24px',
    width: '100%',
  },

  // Desktop cards grid
  cardsGridStyleDesktop: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // Always 4 columns on desktop
    gap: '32px',
    width: '100%',
  },

  // Enhanced glow card style with triple border
  enhancedGlowCardStyle: {
    background: 'var(--brand-white)',
    borderRadius: '16px',
    padding: '48px 36px',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    position: 'relative',
    textDecoration: 'none',
    // Triple border: dark outer, white gap, aqua inner
    boxShadow: `
      0 0 0 2px var(--brand-aqua),
      0 0 0 4px #FFFFFF,
      0 0 0 6px #051414,
      0 0 8px rgba(0, 184, 222, 0.08),
      0 0 16px rgba(0, 184, 222, 0.04),
      0 6px 25px rgba(0, 0, 0, 0.2)
    `,
    filter: 'drop-shadow(0 0 2px rgba(0, 184, 222, 0.05))',
  },

  // Enhanced glow card hover style
  enhancedGlowCardHoverStyle: {
    boxShadow: `
      0 0 0 2px var(--brand-aqua),
      0 0 0 4px #FFFFFF,
      0 0 0 6px #051414,
      0 0 12px rgba(0, 184, 222, 0.12),
      0 0 24px rgba(0, 184, 222, 0.08),
      0 10px 30px rgba(0, 184, 222, 0.06)
    `,
    filter: 'drop-shadow(0 0 4px rgba(0, 184, 222, 0.08))',
    transform: 'translateY(-8px)',
    transition: 'all 0.3s ease',
  },

  // Mobile version of enhanced glow card
  enhancedGlowCardStyleMobile: {
    background: 'var(--brand-white)',
    borderRadius: '16px',
    padding: '32px 24px',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    position: 'relative',
    textDecoration: 'none',
    // Triple border: dark outer, white gap, aqua inner
    boxShadow: `
      0 0 0 2px var(--brand-aqua),
      0 0 0 4px #FFFFFF,
      0 0 0 6px #051414,
      0 0 8px rgba(0, 184, 222, 0.08),
      0 0 16px rgba(0, 184, 222, 0.04),
      0 6px 25px rgba(0, 0, 0, 0.2)
    `,
    filter: 'drop-shadow(0 0 2px rgba(0, 184, 222, 0.05))',
  },

  // Icon container
  iconContainerStyle: {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card title styling
  cardTitleStyle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '16px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    margin: '0 0 16px 0',
    lineHeight: '1.3',
  },

  // Card description styling
  cardDescriptionStyle: {
    fontSize: '1.25rem',
    color: 'var(--brand-grey-600)',
    fontWeight: '500',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Gradient overlays
  gradientOverlayTopStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 10% 20%, rgba(0, 184, 222, 0.05) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 1,
  },

  gradientOverlayBottomStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 90% 80%, rgba(0, 184, 222, 0.03) 0%, transparent 30%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
}
