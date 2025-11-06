import React from 'react'

const RitaGoLanding = () => {
  const handleGetAccess = () => {
    window.location.href = 'https://resolve.io/rita-go-early-access'
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff', // Clean white background like marketing site
      fontFamily:
        'SeasonMix, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      background: '#ffffff',
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      background: '#ffffff', // White header like marketing site
      color: '#05070f', // Brand black text
      padding: 'clamp(40px, 8vw, 60px) clamp(20px, 4vw, 32px) 40px',
      textAlign: 'center',
      borderBottom: '1px solid #e2e3e4', // Subtle border
    },
    badge: {
      background: '#0066ff', // Brand blue-400
      color: '#ffffff',
      padding: '8px 20px',
      borderRadius: '24px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'inline-block',
      marginBottom: '24px',
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: '800',
      margin: '0 0 16px 0',
      color: '#05070f', // Brand black
      letterSpacing: '-0.025em',
    },
    subtitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
      fontWeight: '400',
      lineHeight: '1.5',
      margin: 0,
      color: '#0d1637', // Brand black-700
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    content: {
      padding: 'clamp(40px, 8vw, 60px) clamp(20px, 4vw, 32px)',
      flex: 1,
      background: '#ffffff',
    },
    description: {
      fontSize: '1.2rem',
      lineHeight: '1.7',
      color: '#0d1637', // Brand black-700
      textAlign: 'center',
      marginBottom: '50px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    featuresSection: {
      marginBottom: '60px',
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    featuresTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#05070f', // Brand black
      textAlign: 'center',
      marginBottom: '40px',
    },
    featureGrid: {
      display: 'grid',
      gap: '32px',
      marginBottom: '40px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    featureCard: {
      background: '#ffffff',
      border: '1px solid #e2e3e4', // Brand grey-200
      borderRadius: '8px', // Less rounded like marketing site
      padding: 'clamp(24px, 4vw, 32px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(5, 7, 15, 0.08)', // Subtle shadow
    },
    featureTitle: {
      color: '#0050c7', // Brand blue
      fontWeight: '700',
      fontSize: '1.2rem',
      marginBottom: '16px',
      lineHeight: '1.4',
    },
    featureDescription: {
      color: '#0d1637', // Brand black-700
      lineHeight: '1.6',
      fontSize: '1rem',
    },
    ctaSection: {
      background: '#05070f', // Dark section like marketing site footer
      padding: 'clamp(40px, 8vw, 60px) clamp(20px, 4vw, 32px)',
      textAlign: 'center',
      marginTop: 'auto',
    },
    ctaTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#ffffff', // White text on dark
      marginBottom: '16px',
    },
    ctaDescription: {
      color: '#cbd1da', // Brand grey-500 for secondary text on dark
      fontSize: '1.1rem',
      marginBottom: '32px',
      lineHeight: '1.6',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    button: {
      background: '#0066ff', // Brand blue-400 like marketing site
      color: '#ffffff',
      padding: '16px 32px',
      fontSize: '1.1rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px', // Less rounded like marketing site
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: 'none', // Clean look like marketing site
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>Documentation Coming Soon</div>
          <h1 style={styles.title}>RITA Go Documentation</h1>
          <p style={styles.subtitle}>
            The comprehensive RITA Go help documentation is currently being
            prepared. In the meantime, learn about RITA Go and join the early
            access waitlist.
          </p>
        </div>

        <div style={styles.content}>
          <p style={styles.description}>
            This section will contain the complete RITA Go documentation,
            including setup guides, troubleshooting, and best practices. While
            we're preparing the comprehensive help documentation, you can learn
            about RITA Go's capabilities below and sign up for early access.
          </p>

          <div style={styles.featuresSection}>
            <h3 style={styles.featuresTitle}>Documentation Preview</h3>

            <div
              style={{
                ...styles.featureGrid,
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              }}
            >
              <div
                style={{
                  ...styles.featureCard,
                  background: '#f6f6f6',
                  borderLeft: '4px solid #0050c7',
                }}
              >
                <h4 style={{ ...styles.featureTitle, color: '#0050c7' }}>
                  📖 Getting Started Guides
                </h4>
                <p style={styles.featureDescription}>
                  Step-by-step setup instructions, account configuration, and
                  your first RITA Go deployment.
                </p>
              </div>

              <div
                style={{
                  ...styles.featureCard,
                  background: '#f6f6f6',
                  borderLeft: '4px solid #0050c7',
                }}
              >
                <h4 style={{ ...styles.featureTitle, color: '#0050c7' }}>
                  ❓ Troubleshooting
                </h4>
                <p style={styles.featureDescription}>
                  Common issues, solutions, and debugging techniques to keep
                  RITA Go running smoothly.
                </p>
              </div>

              <div
                style={{
                  ...styles.featureCard,
                  background: '#f6f6f6',
                  borderLeft: '4px solid #0050c7',
                }}
              >
                <h4 style={{ ...styles.featureTitle, color: '#0050c7' }}>
                  💡 Best Practices
                </h4>
                <p style={styles.featureDescription}>
                  Expert tips, optimization strategies, and real-world use cases
                  from successful deployments.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.ctaSection}>
            <h3 style={styles.ctaTitle}>
              Ready to Transform Your Service Desk?
            </h3>
            <p style={styles.ctaDescription}>
              Sign up now and be first in line for the RITA Go free trial
              waitlist.
            </p>
            <button
              style={styles.button}
              onClick={handleGetAccess}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.background = '#0050c7' // Darker blue on hover
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.background = '#0066ff' // Original blue
              }}
            >
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RitaGoLanding
