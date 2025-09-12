import React from 'react'

/**
 * StylizedHeader component - Creates a full-width branded banner header
 * with centered title
 * Enhanced with brand gradient background and interactive effects
 * Height increased by 20%
 *
 * @param {Object} props Component props
 * @param {string} props.title The main title text
 * @returns {JSX.Element} StylizedHeader component
 */
const StylizedHeader = ({ title = '' }) => {
  // Brand-compliant styles for the fixed, full-width header with gradient
  const baseStyles = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    width: '100vw',
    position: 'fixed',
    top: '0', // Changed from '' to '0'
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)', // Brand blue gradient
    color: 'var(--brand-white)',
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '108px',
    boxShadow:
      '0 0 20px rgba(0, 102, 255, 0.3), 0 2px 10px rgba(0, 0, 0, 0.15)', // Brand shadow
    // Removed duplicate position: 'relative' line
    overflow: 'hidden',
  }

  const spacerHeight = baseStyles.height

  const topOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)', // Brand blue overlay
    pointerEvents: 'none',
  }

  const bottomOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 90% 80%, rgba(0, 102, 255, 0.03) 0%, transparent 30%)', // Brand blue accent
    pointerEvents: 'none',
  }

  const contentContainerStyle = {
    width: '100%',
    maxWidth: '1200px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '120px',
    paddingRight: '120px',
    zIndex: 2,
  }

  const titleStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    fontWeight: '600',
    fontSize: '2.2rem',
    margin: 0,
    marginBottom: '0.5rem',
    color: 'var(--brand-white)',
    textAlign: 'center',
    letterSpacing: '0.5px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)', // Enhanced text shadow for readability
    position: 'relative',
    zIndex: 3,
  }

  return (
    <>
      <header style={baseStyles}>
        {/* Brand gradient overlays */}
        <div style={topOverlayStyle}></div>
        <div style={bottomOverlayStyle}></div>

        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>{title}</h1>
        </div>
      </header>

      <div
        style={{
          width: '100%',
          height: spacerHeight,
          margin: 0,
        }}
      />
    </>
  )
}

export default StylizedHeader
