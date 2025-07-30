import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const MainWelcomeBanner = ({
  title = 'New to Resolve Pro? Check out these courses.',
  buttons = [
    {
      text: 'Service Blueprinting',
      link: '/learning/service-blueprinting/',
      icon: 'table',
    },
    {
      text: 'View All Courses',
      link: '/learning',
      icon: 'chevron-right',
    },
  ],
  showDismissButton = true,
  gradient = null, // No gradients - using solid brand colors
  borderImage = null, // No border images - using solid brand colors
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [isDismissHovered, setIsDismissHovered] = useState(false)

  const dismissBanner = () => setIsVisible(false)

  if (!isVisible) return null

  const buttonStyle = {
    background: 'var(--brand-blue)', // Professional blue to match other buttons
    color: 'var(--brand-white)',
    padding: '0.4rem 1rem', // Reduced padding
    borderRadius: '6px', // Slightly smaller radius
    fontWeight: '500',
    fontFamily: 'var(--ifm-font-family-base)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem', // Smaller font
    border: '2px solid var(--brand-blue)',
    cursor: 'pointer',
    boxShadow: '0 0 8px rgba(0, 80, 199, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    textDecoration: 'none',
  }

  const buttonHoverStyle = {
    background: 'var(--brand-blue-400)',
    boxShadow:
      '0 0 10px rgba(0, 80, 199, 0.3), 0 3px 8px rgba(0, 80, 199, 0.2)',
    borderColor: 'var(--brand-blue-400)',
    transform: 'translateY(-2px)',
  }

  const renderIcon = iconName => {
    switch (iconName) {
      case 'table':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16' // Smaller icons
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{ marginRight: '0.5rem' }} // Reduced margin
          >
            <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
            <line x1='3' y1='9' x2='21' y2='9'></line>
            <line x1='9' y1='21' x2='9' y2='9'></line>
          </svg>
        )
      case 'chevron-right':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16' // Smaller icons
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{ marginRight: '0.5rem' }} // Reduced margin
          >
            <path d='M9 18l6-6-6-6'></path>
          </svg>
        )
      default:
        return null
    }
  }

  // Calculate the banner height - made much narrower
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
          padding: '0.2rem 0', // Much reduced padding
          position: 'fixed',
          top: '100px',
          left: 0,
          right: 0,
          overflow: 'hidden',
          width: '100%',
          zIndex: 999,
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)', // Dark shadow for dark background
          borderBottom: '2px solid var(--brand-black)',
          borderTop: '2px solid var(--brand-white)',
          borderLeft: 'none',
          borderRight: 'none',
          fontFamily: 'var(--ifm-font-family-base)',
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
                ? 'var(--brand-blue-400)'
                : 'var(--brand-black)',
              color: 'var(--brand-white)',
              border: `2px solid ${
                isDismissHovered
                  ? 'var(--brand-blue-400)'
                  : 'var(--brand-black)'
              }`,
              borderRadius: '50%',
              width: '24px', // Much smaller button
              height: '24px',
              fontSize: '1rem', // Smaller font
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isDismissHovered
                ? '0 0 8px rgba(0, 80, 199, 0.3), 0 2px 6px rgba(0, 80, 199, 0.2)'
                : '0 0 6px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)',
              zIndex: 5,
              transition: 'all 0.3s ease-in-out',
              fontFamily: 'var(--ifm-font-family-base)',
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
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.3rem 1rem', // Much reduced padding
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: 'left',
              marginRight: '1rem', // Reduced margin
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--ifm-font-family-base)',
                fontWeight: 600,
                color: 'var(--brand-white)',
                margin: 0,
                fontSize: '1rem', // Much smaller font
                letterSpacing: '0.3px', // Reduced letter spacing
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {title}
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.7rem', // Reduced gap
              marginRight: showDismissButton ? '1.8rem' : '0', // Reduced margin
            }}
          >
            {buttons.map((button, index) => (
              <Link
                key={index}
                to={button.link}
                style={{
                  ...buttonStyle,
                  ...(hoveredButton === index ? buttonHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredButton(index)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {renderIcon(button.icon)}
                <span style={{ color: 'var(--brand-white)' }}>
                  {button.text}
                </span>
              </Link>
            ))}
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

export default MainWelcomeBanner
