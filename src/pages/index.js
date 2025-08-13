import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'

// Inline styles for easy removal - Resolve branding
const comingSoonStyles = {
  heroBanner: {
    padding: '6rem 0 4rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: '800',
    color: 'white',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    fontFamily:
      '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#94a3b8',
    marginBottom: '3rem',
    lineHeight: '1.5',
    fontFamily:
      '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '400',
  },
  docsLink: {
    display: 'inline-block',
    padding: '16px 32px',
    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  docsLinkHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
  },
  comingSoonBadge: {
    display: 'inline-block',
    padding: '10px 20px',
    background: 'rgba(79, 70, 229, 0.15)',
    border: '1px solid rgba(79, 70, 229, 0.25)',
    borderRadius: '25px',
    color: '#94a3b8',
    fontSize: '0.875rem',
    marginBottom: '2.5rem',
    backdropFilter: 'blur(10px)',
    fontWeight: '500',
    letterSpacing: '0.025em',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    opacity: 0.3,
    pointerEvents: 'none',
  },
}

function ComingSoonHeader() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <header style={comingSoonStyles.heroBanner}>
      <div style={comingSoonStyles.gridOverlay}></div>
      <div className='container'>
        <div style={comingSoonStyles.heroContent}>
          <div style={comingSoonStyles.comingSoonBadge}>Coming Soon</div>

          <Heading as='h1' style={comingSoonStyles.title}>
            Future Home of
            <br />
            help.resolve.io
          </Heading>

          <p style={comingSoonStyles.subtitle}>
            Something amazing is coming your way.
          </p>

          <a
            href='https://docs.resolve.io'
            target='_blank'
            rel='noopener noreferrer'
            style={comingSoonStyles.docsLink}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 10px 25px rgba(79, 70, 229, 0.3)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            For current information, go to docs.resolve.io →
          </a>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout
      title='Future Home of help.resolve.io'
      description='Advanced IT automation training platform coming soon.'
      noFooter={true}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .navbar {
          display: none !important;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
      <ComingSoonHeader />
    </Layout>
  )
}
