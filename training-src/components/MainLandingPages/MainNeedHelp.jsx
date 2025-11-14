import React from 'react'

/**
 * MainNeedHelp component - Creates a static help section matching the Welcome Section
 * @returns {JSX.Element} MainNeedHelp component
 */
const MainNeedHelp = ({ style = {} }) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isButtonHovered, setIsButtonHovered] = React.useState(false)

  // Base styles for the help section - matching welcome section
  const baseStyles = {
    backgroundColor: 'var(--brand-grey-100)',
    padding: '3.5rem 2.5rem',
    margin: '3.5rem 0 2rem 0',
    position: 'relative',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid var(--brand-black-700)',
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
      className='main-need-help-section'
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
        <h3
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '1.8rem',
            color: 'var(--brand-black-700)',
            margin: '0 0 1.5rem 0',
            position: 'relative',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%',
            transition: 'color 0.3s ease',
          }}
        >
          Need Help Getting Started?
        </h3>

        <p
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontSize: '1.2rem', // Matching welcome section
            lineHeight: '1.7',
            color: 'var(--brand-black)', // Matching welcome section
            margin: '0 0 1.5rem 0',
            textAlign: 'center',
            width: '100%',
            maxWidth: '900px',
            transition: 'color 0.3s ease',
          }}
        >
          Our training team is ready to assist you on your learning journey.
          Contact us at{' '}
          <a
            href='mailto:training@resolve.io'
            style={{
              color: 'var(--brand-aqua)',
              textDecoration: 'underline',
              transition: 'color 0.3s ease',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--brand-blue-400)')}
            onMouseLeave={e => (e.target.style.color = 'var(--brand-aqua)')}
          >
            training@resolve.io
          </a>{' '}
          or schedule a personalized onboarding session to discuss your specific
          training needs.
        </p>

        {/* Divider under paragraph - using brand gradient */}
        <div
          style={{
            width: '100px',
            height: '3px',
            background:
              'linear-gradient(to right, rgba(0, 212, 255, 0.3), var(--brand-aqua), rgba(0, 212, 255, 0.3))',
            borderRadius: '1.5px',
            margin: '0 0 2rem 0',
            transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
        ></div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <a
            href='/learning'
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background:
                'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
              color: 'var(--brand-white)',
              borderRadius: '6px',
              fontWeight: '500',
              textDecoration: 'none',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              fontSize: '1.1rem',
              boxShadow: isButtonHovered
                ? '0 0 25px rgba(0, 212, 255, 0.4), 0 6px 16px rgba(0, 212, 255, 0.3)'
                : '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
              border: `2px solid ${
                isButtonHovered ? 'var(--brand-blue-400)' : 'var(--brand-aqua)'
              }`,
              transform: isButtonHovered ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            Browse All Courses
          </a>
        </div>
      </div>
    </section>
  )
}

export default MainNeedHelp
