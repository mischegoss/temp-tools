import React from 'react'

/**
 * LogoHeader component - Creates a full-width navy blue banner header
 * with a logo on the right side instead of a title
 * Enhanced with a gradient background for improved visual depth
 *
 * @param {Object} props Component props
 * @param {string} props.logoSrc Source URL for the logo image
 * @param {string} props.logoAlt Alt text for the logo image
 * @param {number} props.logoWidth Width of the logo in pixels
 * @param {number} props.logoHeight Height of the logo in pixels
 * @param {Object} props.style Additional style properties to apply (optional)
 * @returns {JSX.Element} LogoHeader component
 */
const LogoHeader = ({
  logoAlt = 'Resolve Logo',
  logoWidth = 160,
  logoHeight = 60,
  style = {},
}) => {
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
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    color: 'var(--brand-white)',
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90px',
    boxShadow:
      '0 0 20px rgba(0, 102, 255, 0.3), 0 2px 10px rgba(0, 0, 0, 0.15)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    ...style,
  }

  const spacerHeight = baseStyles.height

  return (
    <>
      <header style={baseStyles}>
        {/* Brand-compliant gradient overlays for depth */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at 10% 20%, rgba(0, 102, 255, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        ></div>

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
          }}
        ></div>

        {/* Content container */}
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: '0 2rem',
            zIndex: 2,
          }}
        >
          {/* Left side - can be empty or contain other elements in the future */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {/* If you want to add something on the left side in the future */}
          </div>

          {/* Right side - logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              marginRight: '20px',
            }}
          >
            <img
              src='https://resolve.io/wp-content/uploads/2023/05/Resolve-Logo-Reversed-Color-RGB_200.png'
              alt={logoAlt}
              style={{
                height: logoHeight,
                width: logoWidth,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
            />
          </div>
        </div>
      </header>

      {/* Spacer element to prevent content from being hidden under fixed header */}
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

export default LogoHeader
