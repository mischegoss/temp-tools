import React from 'react'

const RitaGoLanding = () => {
  const handleGetAccess = () => {
    window.location.href = 'https://resolve.io/rita-go-early-access'
  }

  const handleBetaDocs = () => {
    window.location.href = '/rita-go/beta2025'
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
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
      background: '#ffffff',
      color: '#05070f',
      padding:
        'clamp(60px, 8vw, 80px) clamp(32px, 4vw, 48px) clamp(50px, 6vw, 60px)',
      textAlign: 'center',
      borderBottom: '1px solid #e2e3e4',
    },
    badge: {
      background: '#0066ff',
      color: '#ffffff',
      padding: '12px 28px',
      borderRadius: '24px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'inline-block',
      marginBottom: '28px',
      letterSpacing: '0.025em',
    },
    title: {
      fontSize: 'clamp(2.75rem, 5vw, 4rem)',
      fontWeight: '800',
      margin: '0 0 20px 0',
      color: '#05070f',
      letterSpacing: '-0.025em',
      lineHeight: '1.1',
    },
    subtitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      fontWeight: '400',
      lineHeight: '1.5',
      margin: 0,
      color: '#0d1637',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    content: {
      padding: 'clamp(60px, 8vw, 80px) clamp(32px, 4vw, 48px)',
      flex: 1,
      background: '#ffffff',
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%',
    },
    description: {
      fontSize: '1.25rem',
      lineHeight: '1.7',
      color: '#0d1637',
      textAlign: 'center',
      marginBottom: '60px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    featuresSection: {
      marginBottom: '0',
    },
    featuresTitle: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#05070f',
      textAlign: 'center',
      marginBottom: '40px',
      letterSpacing: '-0.015em',
    },
    previewCard: {
      background: '#ffffff',
      border: '2px solid #e2e3e4',
      borderRadius: '16px',
      padding: 'clamp(40px, 5vw, 56px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(5, 7, 15, 0.08)',
      textAlign: 'center',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    previewCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(5, 7, 15, 0.12)',
      borderColor: '#0050c7',
    },
    previewTitle: {
      color: '#0050c7',
      fontWeight: '700',
      fontSize: '1.6rem',
      marginBottom: '16px',
      lineHeight: '1.3',
    },
    previewDescription: {
      color: '#0d1637',
      lineHeight: '1.6',
      fontSize: '1.125rem',
      marginBottom: '28px',
      maxWidth: '600px',
      margin: '0 auto 28px auto',
    },
    betaButton: {
      background: '#0050c7',
      color: '#ffffff',
      padding: '18px 36px',
      fontSize: '1.1rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-block',
      letterSpacing: '0.025em',
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #05070f 0%, #0d1637 100%)',
      padding: 'clamp(60px, 8vw, 80px) clamp(32px, 4vw, 48px)',
      textAlign: 'center',
      marginTop: 'auto',
    },
    ctaTitle: {
      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
      lineHeight: '1.2',
      letterSpacing: '-0.015em',
    },
    ctaDescription: {
      color: '#cbd1da',
      fontSize: '1.2rem',
      marginBottom: '36px',
      lineHeight: '1.6',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    ctaButton: {
      background: '#0066ff',
      color: '#ffffff',
      padding: '18px 36px',
      fontSize: '1.125rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 4px 16px rgba(0, 102, 255, 0.3)',
      letterSpacing: '0.025em',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>Beta Docs Now Available</div>
          <h1 style={styles.title}>RITA Go Documentation</h1>
          <p style={styles.subtitle}>
            The comprehensive RITA Go help documentation is currently being
            prepared. In the meantime, preview the RITA Go Beta docs and sign up
            for early access to RITA Go below.
          </p>
        </div>

        <div style={styles.content}>
          <div style={styles.featuresSection}>
            <h3 style={styles.featuresTitle}>Preview Beta Docs</h3>

            <div
              style={styles.previewCard}
              onClick={handleBetaDocs}
              onMouseEnter={e => {
                Object.assign(e.currentTarget.style, styles.previewCardHover)
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(5, 7, 15, 0.08)'
                e.currentTarget.style.borderColor = '#e2e3e4'
              }}
            >
              <h4 style={styles.previewTitle}>📚 RITA Go Beta Documentation</h4>
              <p style={styles.previewDescription}>
                Check out the better docs here - explore the latest RITA Go
                features, setup guides, and comprehensive documentation for the
                beta release.
              </p>
              <button
                style={styles.betaButton}
                onMouseEnter={e => {
                  e.target.style.background = '#003d9a'
                  e.target.style.transform = 'translateY(-1px)'
                  e.stopPropagation()
                }}
                onMouseLeave={e => {
                  e.target.style.background = '#0050c7'
                  e.target.style.transform = 'translateY(0)'
                  e.stopPropagation()
                }}
              >
                View Beta Docs →
              </button>
            </div>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Ready to Transform Your Service Desk?</h3>
          <p style={styles.ctaDescription}>
            Sign up now and be first in line for the RITA Go free trial
            waitlist.
          </p>
          <button
            style={styles.ctaButton}
            onClick={handleGetAccess}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.background = '#0050c7'
              e.target.style.boxShadow = '0 6px 24px rgba(0, 102, 255, 0.4)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.background = '#0066ff'
              e.target.style.boxShadow = '0 4px 16px rgba(0, 102, 255, 0.3)'
            }}
          >
            Get Early Access
          </button>
        </div>
      </div>
    </div>
  )
}

export default RitaGoLanding
