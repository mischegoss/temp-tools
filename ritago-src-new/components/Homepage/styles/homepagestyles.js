export const homePageStyles = {
  // Main section container - Using darker professional gradient
  sectionStyle: {
    background:
      'linear-gradient(to bottom, #000511 0%, #001024 40%, #001845 80%, var(--brand-blue) 100%)',
    padding: '100px 0 120px 0',
    minHeight: '70vh',
    width: '100%',
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Container for content - Following container proportions
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

  // Main title styling - Following large heading scale
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

  // Subtitle styling - Following description text scale with enhanced visibility
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

  // Individual card styling - Enhanced double border effect matching the image
  cardStyle: {
    background: 'var(--brand-white)',
    borderRadius: '16px',
    padding: '48px 36px',
    transition: 'all 0.3s ease-in-out',
    // Double border effect: outer glow + inner border
    border: '2px solid var(--brand-blue-400)',
    boxShadow: `
      0 0 0 1px var(--brand-blue-400),
      0 0 20px rgba(0, 102, 255, 0.4),
      0 0 40px rgba(0, 102, 255, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.1)
    `,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    position: 'relative',
    // Add subtle glow animation
    animation: 'borderGlow 2s ease-in-out infinite alternate',
  },

  // Mobile version of card
  cardStyleMobile: {
    background: 'var(--brand-white)',
    borderRadius: '16px',
    padding: '32px 24px',
    transition: 'all 0.3s ease-in-out',
    // Double border effect: outer glow + inner border
    border: '2px solid var(--brand-blue-400)',
    boxShadow: `
      0 0 0 1px var(--brand-blue-400),
      0 0 20px rgba(0, 102, 255, 0.4),
      0 0 40px rgba(0, 102, 255, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.1)
    `,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    position: 'relative',
    // Add subtle glow animation
    animation: 'borderGlow 2s ease-in-out infinite alternate',
  },

  // Icon container
  iconContainerStyle: {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card title styling - UPDATED with larger font size
  cardTitleStyle: {
    fontSize: '1.5rem', // Increased from 1.125rem to 1.5rem (24px)
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '16px', // Increased from 12px to 16px for better spacing
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    margin: '0 0 16px 0',
    lineHeight: '1.3', // Added for better readability
  },

  // Card description styling - Already at 1.25rem (20px)
  cardDescriptionStyle: {
    fontSize: '1.25rem', // Already updated to 1.25rem (20px)
    color: 'var(--brand-grey-600)',
    fontWeight: '500',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Grid item responsive sizing - Better proportions for laptop
  gridItemSize: {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    xl: 3,
  },

  // Enhanced hover effects - Intensified double border with stronger glow
  cardHoverStyle: {
    transform: 'translateY(-5px)',
    boxShadow: `
      0 0 0 1px var(--brand-blue-400),
      0 0 30px rgba(0, 102, 255, 0.6),
      0 0 60px rgba(0, 102, 255, 0.3),
      0 8px 24px rgba(0, 102, 255, 0.2)
    `,
    borderColor: 'var(--brand-blue-400)',
    transition: 'all 0.3s ease-in-out',
    // Pause animation on hover for stronger effect
    animationPlayState: 'paused',
  },

  // Active/Click effects - Following brand active pattern
  cardActiveStyle: {
    transform: 'translateY(-2px)',
    transition: 'all 0.1s ease',
  },

  // Gradient overlays - Following brand overlay patterns
  gradientOverlayTopStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
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
      'radial-gradient(circle at 90% 80%, rgba(0, 102, 255, 0.03) 0%, transparent 30%)',
    pointerEvents: 'none',
    zIndex: 1,
  },

  // Responsive styles for different screen sizes
  responsive: {
    // Mobile specific adjustments
    mobile: {
      headerContentStyleMobile: {
        textAlign: 'center',
        marginBottom: '60px',
      },
    },

    // 1200px and up
    large: {
      containerStyleLarge: {
        maxWidth: '1440px',
        padding: '0 80px',
      },
      mainTitleStyleLarge: {
        fontSize: '4.25rem',
        fontWeight: '600',
        color: 'var(--brand-white)',
        marginBottom: '24px',
        fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
        lineHeight: '1.2',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      cardStyleLarge: {
        background: 'var(--brand-white)',
        borderRadius: '16px',
        padding: '56px 42px',
        transition: 'all 0.3s ease-in-out',
        // Enhanced double border effect for larger screens
        border: '2px solid var(--brand-blue-400)',
        boxShadow: `
          0 0 0 1px var(--brand-blue-400),
          0 0 25px rgba(0, 102, 255, 0.4),
          0 0 50px rgba(0, 102, 255, 0.2),
          0 4px 16px rgba(0, 0, 0, 0.1)
        `,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
        position: 'relative',
        animation: 'borderGlow 2s ease-in-out infinite alternate',
      },
    },

    // 1440px and up
    extraLarge: {
      containerStyleExtraLarge: {
        maxWidth: '1600px',
        padding: '0 100px',
      },
      sectionStyleExtraLarge: {
        background:
          'linear-gradient(to bottom, #000511 0%, #001024 40%, #001845 80%, var(--brand-blue) 100%)',
        minHeight: '75vh',
        padding: '120px 0 140px 0',
        width: '100%',
        margin: 0,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
      },
      mainTitleStyleExtraLarge: {
        fontSize: '4.5rem',
        fontWeight: '600',
        color: 'var(--brand-white)',
        marginBottom: '24px',
        fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
        lineHeight: '1.2',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      },
    },
  },
}
