// @site/src/components/MainLandingPages/MainStylizedHeader.jsx

import React from 'react'

/**
 * MainStylizedHeader component - Creates a full-width brand-compliant banner header
 * with centered title or SVG logo
 * Enhanced with brand gradient background and overlay effects
 *
 * @param {Object} props Component props
 * @param {string} props.title The main title text (optional if logo is provided)
 * @param {React.ComponentType} props.logo SVG component to display in the header
 * @param {number} props.logoHeight Height for the logo (default: 50)
 * @returns {JSX.Element} MainStylizedHeader component
 */
const MainStylizedHeader = ({
  title = '',
  logo: Logo = null,
  logoHeight = 50,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Base styles for the fixed, full-width header with brand gradient
  const baseStyles = {
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-black-700) 30%, var(--brand-blue) 70%, var(--brand-blue-400) 100%)',
    color: 'var(--brand-white)',
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    boxShadow: '0 0 20px rgba(0, 80, 199, 0.3), 0 2px 10px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease-in-out',
    fontFamily:
      'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    overflow: 'hidden',
  }

  const spacerHeight = baseStyles.height

  // SVG logo styles
  const logoStyle = {
    height: `${logoHeight}px`,
    maxWidth: '80%',
    fill: 'var(--brand-white)',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  }

  return (
    <>
      <header
        style={baseStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top left gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
          }}
        ></div>

        {/* Bottom right gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at 90% 80%, rgba(0, 212, 255, 0.03) 0%, transparent 30%)',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
          }}
        ></div>

        {/* Additional brand accent overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background:
              'linear-gradient(to right, var(--brand-aqua), var(--brand-blue-400), var(--brand-aqua))',
            opacity: 0.8,
          }}
        ></div>

        <div
          style={{
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
            transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {Logo ? (
            // If Logo is provided, render the SVG component
            <Logo style={logoStyle} role='img' />
          ) : (
            // Otherwise, display the title text
            <h1
              style={{
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                fontSize: '2rem',
                margin: 0,
                marginBottom: '0.5rem',
                color: 'var(--brand-white)',
                textAlign: 'center',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              {title}
            </h1>
          )}
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

export default MainStylizedHeader
