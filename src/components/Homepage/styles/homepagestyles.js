// @site/src/components/Homepage/styles/homepagestyles.js

const homePageStyles = {
  // Main section container - Updated gradient: darker longer, less pure teal
  sectionStyle: {
    background:
      'linear-gradient(to bottom, #051414 0%, #02636f 60%, #008a9e 85%, #00a8c0 100%)',
    padding: '100px 0 120px 0',
    minHeight: '70vh',
    width: '100%',
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Container for content (ORIGINAL)
  containerStyle: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 60px',
    width: '100%',
    position: 'relative',
    zIndex: 2,
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Mobile version of container (ORIGINAL)
  containerStyleMobile: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 20px',
    width: '100%',
    position: 'relative',
    zIndex: 2,
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Header content area (ORIGINAL)
  headerContentStyle: {
    textAlign: 'center',
    marginBottom: '80px',
  },

  // Mobile header content (ORIGINAL)
  headerContentStyleMobile: {
    textAlign: 'center',
    marginBottom: '60px',
  },

  // Main title styling (ORIGINAL)
  mainTitleStyle: {
    fontSize: '4rem',
    fontWeight: '600',
    color: 'var(--brand-white)',
    marginBottom: '24px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    lineHeight: '1.2',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // Mobile version of main title (ORIGINAL)
  mainTitleStyleMobile: {
    fontSize: '2.75rem',
    fontWeight: '600',
    color: 'var(--brand-white)',
    marginBottom: '24px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    lineHeight: '1.2',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // Subtitle styling (ORIGINAL)
  subtitleStyle: {
    fontSize: '1.3rem',
    color: 'var(--brand-white)',
    fontWeight: '500',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },

  // Mobile version of subtitle (ORIGINAL)
  subtitleStyleMobile: {
    fontSize: '1.2rem',
    color: 'var(--brand-white)',
    fontWeight: '500',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },

  // Cards grid container - REVERTED to original 4-card layout
  cardsGridStyle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns on smaller screens
    gap: '32px',
    width: '100%',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns on larger screens
    },
  },

  // Mobile cards grid - REVERTED to original 2-column
  cardsGridStyleMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Always 2 columns on mobile
    gap: '24px',
    width: '100%',
  },

  // Desktop cards grid - REVERTED to original 4-column
  cardsGridStyleDesktop: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // Always 4 columns on desktop
    gap: '32px',
    width: '100%',
  },

  // Enhanced glow card style (ORIGINAL)
  enhancedGlowCardStyle: {
    background: 'var(--brand-white)',
    borderRadius: '20px',
    padding: '40px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '320px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
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

  // Mobile enhanced glow card style (ORIGINAL)
  enhancedGlowCardStyleMobile: {
    background: 'var(--brand-white)',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '280px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
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

  // Enhanced hover effect (ORIGINAL)
  enhancedGlowCardHoverStyle: {
    transform: 'translateY(-8px) scale(1.02)',
    // Enhanced triple border: dark outer, white gap, aqua inner
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

  // Icon container (ORIGINAL)
  iconContainerStyle: {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card title styling (ORIGINAL)
  cardTitleStyle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '16px',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    margin: '0 0 16px 0',
    lineHeight: '1.3',
  },

  // Card description styling (ORIGINAL)
  cardDescriptionStyle: {
    fontSize: '1.25rem',
    color: 'var(--brand-grey-600)',
    fontWeight: '500',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Gradient overlays (ORIGINAL)
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

export { homePageStyles }
