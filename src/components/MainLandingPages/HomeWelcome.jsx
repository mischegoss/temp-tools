import React from 'react'

/**
 * HomeWelcome component - Creates a welcome section with divider
 * No visible background or card styling
 *
 * @param {Object} props Component props
 * @param {string} props.title Main title text
 * @param {string} props.subtitle Subtitle text
 * @param {string} props.content Main content text
 * @param {Object} props.style Additional style properties to apply (optional)
 * @returns {JSX.Element} HomeWelcome component
 */
const HomeWelcome = ({
  title = 'Welcome to the Resolve Learning Hub',
  subtitle = "Ready to unlock your organization's automation potential?",
  content = 'The Resolve Learning Hub offers practical courses designed to empower you with the skills and knowledge you need to streamline processes and boost automation. If you are new to Automation and looking for design guidance, or want to get hands on experience with one of our tools, the Learning Hub has a course for you.',
  style = {},
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  // Base styles for the content section
  const baseStyles = {
    padding: '1.5rem',
    marginBottom: '2rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '4rem', // Added margin at the top to create spacing
    fontFamily:
      'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
  }

  // Merge provided style overrides with base styles
  const mergedStyles = { ...baseStyles, ...style }

  return (
    <div
      className='main-welcome-content'
      style={mergedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay effect */}
      <div
        style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.02) 0%, transparent 30%)',
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
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <h1
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '2.4rem',
            color: 'var(--brand-black-700)',
            margin: '0 0 0.5rem 0', // Reduced bottom margin to accommodate divider
            position: 'relative',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%',
            transition: 'color 0.3s ease',
          }}
        >
          {title}
        </h1>

        {/* Divider moved under the first line - using brand gradient */}
        <div
          style={{
            width: '100px',
            height: '3px',
            background:
              'linear-gradient(to right, rgba(0, 212, 255, 0.3), var(--brand-aqua), rgba(0, 212, 255, 0.3))',
            borderRadius: '1.5px',
            margin: '0 0 1.5rem 0', // Added bottom margin for spacing
            transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
        ></div>

        <h2
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '1.6rem',
            color: 'var(--brand-black-700)',
            margin: '0 0 1rem 0',
            position: 'relative',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%',
            transition: 'color 0.3s ease',
          }}
        >
          {subtitle}
        </h2>

        <p
          style={{
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            fontSize: '1.4rem',
            lineHeight: '1.6',
            color: 'var(--brand-black)',
            margin: '0',
            textAlign: 'center',
            width: '100%',
            maxWidth: '900px',
            transition: 'color 0.3s ease',
          }}
        >
          {content}
        </p>
      </div>
    </div>
  )
}

export default HomeWelcome;
