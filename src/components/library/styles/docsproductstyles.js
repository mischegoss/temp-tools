// src/components/DocsProducts/styles/docsProductsStyles.js

const docsProductsStyles = {
  // Section styling with seamless gradient from homepage
  sectionStyle: {
    background:
      'linear-gradient(to bottom, #00b8de 0%, #33dbff 30%, #b3f0ff 70%, #ffffff 100%)',
    padding: '80px 0 100px 0',
    minHeight: '60vh',
    width: '100%',
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Container with brand proportions
  containerStyle: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 60px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },

  // Header content area
  headerContentStyle: {
    textAlign: 'center',
    marginBottom: '48px',
  },

  // Main title with brand typography - VERY DARK BLUE TEXT
  titleStyle: {
    fontSize: '2.8rem',
    fontWeight: '600',
    color: '#0d1637', // Very dark blue
    marginBottom: '16px',
    lineHeight: '1.2',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)', // Light shadow for contrast
  },

  // Subtitle with brand typography - VERY DARK BLUE TEXT
  subtitleStyle: {
    fontSize: '1.2rem',
    color: '#0d1637', // Very dark blue
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)', // Light shadow for contrast
  },

  // Product card with dark gradient background
  productCardStyle: {
    borderRadius: '16px',
    padding: '32px 24px',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    aspectRatio: '1.1/1', // Square-ish for clean layout
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(5, 7, 15, 0.15)',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    cursor: 'pointer',
    minHeight: '260px',
    textDecoration: 'none',
    color: 'inherit',
    textAlign: 'center',
  },

  // Product card hover state
  productCardHoverStyle: {
    transform: 'translateY(-6px)',
    boxShadow:
      '0 16px 32px rgba(5, 7, 15, 0.25), 0 0 20px rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Product title styling
  productTitleStyle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: 'var(--brand-white)',
    marginBottom: '16px',
    lineHeight: '1.3',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },

  // Product description styling
  productDescriptionStyle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.5',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },

  // Specific gradient backgrounds - much darker from top to bottom
  gradientActions: {
    background:
      'linear-gradient(to bottom, #000511 0%, #001024 30%, #001845 70%, #002b6e 100%)',
  },

  gradientExpress: {
    background:
      'linear-gradient(to bottom, #0f0519 0%, #1a0829 30%, #2d0a4f 70%, #4a1a7a 100%)',
  },

  gradientPro: {
    background:
      'linear-gradient(to bottom, #001a0f 0%, #002819 30%, #003d2b 70%, #005c42 100%)',
  },

  gradientInsights: {
    background:
      'linear-gradient(to bottom, #001a1f 0%, #002a33 30%, #004454 70%, #006b7a 100%)',
  },

  // Grid layout - Original MUI Grid approach
  gridStyle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  // Responsive breakpoints
  '@media (max-width: 768px)': {
    titleStyle: {
      fontSize: '2.2rem',
      color: '#0d1637', // Very dark blue on mobile
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
    },
    subtitleStyle: {
      fontSize: '1.1rem',
      color: '#0d1637', // Very dark blue on mobile
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
    },
    containerStyle: {
      padding: '0 24px',
    },
    sectionStyle: {
      background:
        'linear-gradient(to bottom, #00b8de 0%, #33dbff 30%, #b3f0ff 70%, #ffffff 100%)',
      padding: '60px 0 80px 0',
    },
    productCardStyle: {
      minHeight: '240px',
      padding: '28px 20px',
      aspectRatio: '1/1', // More square on tablet
    },
    gridStyle: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
  },

  '@media (max-width: 480px)': {
    titleStyle: {
      fontSize: '1.8rem',
      color: '#0d1637', // Very dark blue on mobile
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
    },
    subtitleStyle: {
      fontSize: '1rem',
      color: '#0d1637', // Very dark blue on mobile
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
    },
    productCardStyle: {
      minHeight: '220px',
      padding: '24px 16px',
      aspectRatio: '1/1', // Square on mobile
    },
    productTitleStyle: {
      fontSize: '1.2rem',
    },
    productDescriptionStyle: {
      fontSize: '0.9rem',
    },
    containerStyle: {
      padding: '0 16px',
    },
    gridStyle: {
      gridTemplateColumns: '1fr',
      gap: '16px',
    },
  },
}

export default docsProductsStyles
