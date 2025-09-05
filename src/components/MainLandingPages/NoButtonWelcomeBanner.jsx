import React, { useState } from 'react'

const NoButtonWelcomeBanner = ({
  textLines = ['New to Resolve Pro? Check out these courses.'],
  showDismissButton = true,
  gradient = null, // Will use brand default
  borderImage = null, // Will use brand default
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissHovered, setIsDismissHovered] = useState(false)

  const dismissBanner = () => setIsVisible(false)

  if (!isVisible) return null

  // Calculate the banner height - made even narrower
  const bannerHeight = 35

  // Dark blue to black gradient background
  const brandBackground =
    gradient ||
    'linear-gradient(to bottom, var(--brand-black-700) 0%, var(--brand-black) 100%)'

  return (
    <>
      <div
        className='new-courses-section'
        style={{
          background: brandBackground,
          padding: '0.2rem 0', // Even more reduced padding
          position: 'fixed',
          top: '100px',
          left: 0,
          right: 0,
          overflow: 'hidden',
          width: '100%',
          zIndex: 999,
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)', // Darker shadow for dark background
          borderBottom: '2px solid var(--brand-black)',
          borderTop: '2px solid var(--brand-white)',
          borderLeft: 'none',
          borderRight: 'none',
          fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
        }}
      >
        {showDismissButton && (
          <button
            onClick={dismissBanner}
            onMouseEnter={() => setIsDismissHovered(true)}
            onMouseLeave={() => setIsDismissHovered(false)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '15px', // Moved closer to edge
              transform: 'translateY(-50%)',
              background: isDismissHovered
                ? 'var(--brand-blue-400)' // Professional blue hover
                : 'var(--brand-black)',
              color: 'var(--brand-white)',
              border: `2px solid ${
                isDismissHovered
                  ? 'var(--brand-blue-400)'
                  : 'var(--brand-black)'
              }`,
              borderRadius: '50%',
              width: '24px', // Even smaller button
              height: '24px',
              fontSize: '.5rem', // Smaller font
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isDismissHovered
                ? '0 0 10px rgba(0, 80, 199, 0.3), 0 2px 6px rgba(0, 80, 199, 0.2)'
                : '0 0 6px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)',
              zIndex: 5,
              transition: 'all 0.3s ease-in-out',
              fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
            }}
            aria-label='Dismiss notification'
          >
            ×
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.3rem 1rem', // Even more reduced padding
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginRight: showDismissButton ? '1.8rem' : '0', // Match MainWelcomeBanner proportions
            }}
          >
            <div
              style={{
                fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                color: 'var(--brand-white)',
                margin: 0,
                fontSize: '1rem', // Exact same as MainWelcomeBanner
                letterSpacing: '0.3px', // Exact same as MainWelcomeBanner
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem', // Reduced gap
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {textLines.map((line, index) => (
                <h2
                  key={index}
                  style={{ margin: 0, color: 'var(--brand-white)' }}
                >
                  {line}
                </h2>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add spacer to prevent content from being hidden behind fixed banner */}
      <div
        style={{
          width: '100%',
          height: `${bannerHeight}px`,
          margin: 0,
        }}
      />
    </>
  )
}

export default NoButtonWelcomeBanner
