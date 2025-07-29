import React from 'react'

/**
 * MainWelcomeSection component - Creates a visually integrated welcome section
 * Updated with brand-compliant styling and reduced bottom spacing
 *
 * @param {Object} props Component props
 * @param {string} props.title The section title
 * @param {string} props.content The welcome message content
 * @param {Object} props.style Additional style properties to apply (optional)
 * @returns {JSX.Element} MainWelcomeSection component
 */
const MainWelcomeSection = ({
  title = 'Welcome to Resolve Pro Learning',
  content = "Explore our specialized learning paths designed to help you master Resolve Pro. Whether you're just getting started, managing the platform, or developing custom solutions, we have the perfect learning path for you.",
  style = {},
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Base styles for the welcome section with matching card styling
  const baseStyles = {
    backgroundColor: 'var(--brand-grey-100)',
    padding: '3.5rem 2.5rem 2rem 2.5rem', // Reduced bottom padding
    margin: '2rem 0 0 0', // No bottom margin as FilterSection will connect to it
    position: 'relative',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid var(--brand-black-700)', // Thicker border matching cards
    borderBottom: 'none', // No bottom border as FilterSection will connect
    boxShadow: '0 0 15px rgba(13, 22, 55, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    fontFamily:
      'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    overflow: 'hidden',
  }

  const hoverStyles = {
    transform: 'translateY(-3px)',
    boxShadow:
      '0 0 20px rgba(13, 22, 55, 0.3), 0 6px 16px rgba(13, 22, 55, 0.2)',
    borderColor: 'var(--brand-blue-400)',
  }

  // Merge provided style overrides with base styles
  const mergedStyles = {
    ...baseStyles,
    ...style,
    ...(isHovered ? hoverStyles : {}),
  }

  return (
    <section
      className='main-welcome-section'
      style={mergedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay effect */}
      <div
        style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 10% 20%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          borderRadius: '8px 8px 0 0',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      ></div>

      {/* Content container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '2.2rem',
            color: 'var(--brand-black-700)',
            margin: '0 0 1.8rem 0',
            position: 'relative',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%',
            transition: 'color 0.3s ease',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontSize: '1.2rem', // Matching card description size
            lineHeight: '1.7',
            color: 'var(--brand-black)', // Darker color matching cards
            margin: '0 0 1.5rem 0', // Reduced bottom margin
            textAlign: 'center',
            width: '100%',
            maxWidth: '900px',
            transition: 'color 0.3s ease',
          }}
        >
          {content}
        </p>

        {/* Divider moved under paragraph with minimal bottom margin - using brand gradient */}
        <div
          style={{
            width: '100px',
            height: '3px',
            background:
              'linear-gradient(to right, rgba(0, 212, 255, 0.3), var(--brand-aqua), rgba(0, 212, 255, 0.3))',
            borderRadius: '1.5px',
            margin: '0 0 0.5rem 0', // Reduced bottom margin
            transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
        ></div>
      </div>
    </section>
  )
}

export default MainWelcomeSection
