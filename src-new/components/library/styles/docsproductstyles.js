// src/components/DocsProducts/styles/docsProductsStyles.js

const docsProductsStyles = {
  // Section styling with brand compliance
  sectionStyle: {
    background: 'var(--brand-grey-100)',
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

  // Main title with brand typography
  titleStyle: {
    fontSize: '2.8rem',
    fontWeight: '600',
    color: 'var(--brand-black)',
    marginBottom: '16px',
    lineHeight: '1.2',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Subtitle with brand typography
  subtitleStyle: {
    fontSize: '1.2rem',
    color: 'var(--brand-grey-600)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
    textAlign: 'center',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Regular product card with dark gradient background
  productCardStyle: {
    borderRadius: '16px',
    padding: '28px 24px',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    minHeight: '200px',
    maxHeight: '240px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'var(--brand-white)',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Featured product card (slightly larger for first 2 products)
  featuredCardStyle: {
    padding: '32px 28px',
    minHeight: '220px',
    maxHeight: '260px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
  },

  // Product title styling
  productTitleStyle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: 'var(--brand-white)',
    marginBottom: '12px',
    lineHeight: '1.3',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  },

  // Product description styling
  productDescriptionStyle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.5',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    margin: 0,
  },

  // Hover effects
  productCardHoverStyle: {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },

  // Product-specific gradients
  gradientActions: {
    background:
      'linear-gradient(to bottom, #001433 0%, #002459 30%, #003d8f 70%, #0050c7 100%)',
  },

  gradientRitago: {
    background:
      'linear-gradient(to bottom, #2D1B0F 0%, #4A2E1A 30%, #6B3F1E 70%, #B8460E 100%)',
  },

  gradientExpress: {
    background:
      'linear-gradient(to bottom, #1a0033 0%, #2d0059 30%, #4a008f 70%, #6600c7 100%)',
  },

  gradientPro: {
    background:
      'linear-gradient(to bottom, #001a0f 0%, #002819 30%, #003d2b 70%, #005c42 100%)',
  },

  gradientInsights: {
    background:
      'linear-gradient(to bottom, #001a1f 0%, #002a33 30%, #004454 70%, #006b7a 100%)',
  },

  // Grid layout
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
    },
    subtitleStyle: {
      fontSize: '1.1rem',
    },
    containerStyle: {
      padding: '0 24px',
    },
    sectionStyle: {
      padding: '60px 0 80px 0',
    },
    productCardStyle: {
      minHeight: '180px',
      maxHeight: '220px',
      padding: '24px 20px',
    },
    featuredCardStyle: {
      minHeight: '190px',
      maxHeight: '230px',
      padding: '28px 24px',
    },
    gridStyle: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
  },

  '@media (max-width: 480px)': {
    titleStyle: {
      fontSize: '1.8rem',
    },
    subtitleStyle: {
      fontSize: '1rem',
    },
    productCardStyle: {
      minHeight: '160px',
      maxHeight: '200px',
      padding: '20px 16px',
    },
    featuredCardStyle: {
      minHeight: '170px',
      maxHeight: '210px',
      padding: '24px 20px',
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
