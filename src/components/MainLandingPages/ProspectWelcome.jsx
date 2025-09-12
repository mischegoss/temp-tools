import React from 'react'

/**
 * ProspectWelcomeSection component - Creates a visually distinct welcome section with full border
 *
 * @param {Object} props Component props
 * @param {string} props.title The section title
 * @param {string} props.content The welcome message content
 * @param {Object} props.style Additional style properties to apply (optional)
 * @returns {JSX.Element} ProspectWelcomeSection component
 */
const ProspectWelcomeSection = ({
  title = 'Welcome to Resolve Pro Learning',
  content = "Explore our specialized learning paths designed to help you master Resolve Pro. Whether you're just getting started, managing the platform, or developing custom solutions, we have the perfect learning path for you.",
  style = {},
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Base styles for the welcome section with complete border and increased bottom margin
  const baseStyles = {
    backgroundColor: 'var(--brand-grey-100)',
    padding: '3.5rem 2.5rem 2.5rem 2.5rem',
    margin: '5rem 0 3rem 0', // Increased top margin from 2rem to 5rem
    position: 'relative',
    borderRadius: '8px', // Full border radius (all corners)
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid var(--brand-black-700)', // Complete border all the way around
    boxShadow: '0 0 15px rgba(13, 22, 55, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    fontFamily:
      'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    overflow: 'hidden',
  }

  const hoverStyles = {
    transform: 'translateY(-5px)',
    boxShadow:
      '0 0 20px rgba(13, 22, 55, 0.3), 0 8px 24px rgba(13, 22, 55, 0.2)',
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
      className='prospect-welcome-section'
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
          borderRadius: '8px',
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
            margin: '0 0 1.5rem 0',
            textAlign: 'center',
            width: '100%',
            maxWidth: '900px',
            transition: 'color 0.3s ease',
          }}
        >
          {content}
        </p>

        {/* Divider under paragraph - using brand gradient */}
        <div
          style={{
            width: '100px',
            height: '3px',
            background:
              'linear-gradient(to right, rgba(0, 212, 255, 0.3), var(--brand-aqua), rgba(0, 212, 255, 0.3))',
            borderRadius: '1.5px',
            margin: '0 0 1rem 0', // Slightly increased bottom margin for divider
            transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
        ></div>
      </div>
    </section>
  )
}

export default ProspectWelcomeSection
