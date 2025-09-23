import React, { useState } from 'react'

const FormNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navStyles = {
    container: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      position: 'fixed',
      top: '25px',
      left: '25px',
      zIndex: 1000001,
    },
    hamburger: {
      width: '70px',
      height: '70px',
      borderRadius: '12px',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', // Brand aqua gradient
      border: '2px solid var(--brand-aqua)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      boxShadow:
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', // Brand aqua shadow
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
    },
    hamburgerHover: {
      transform: 'translateY(-2px)',
      boxShadow:
        '0 0 20px rgba(0, 212, 255, 0.4), 0 4px 16px rgba(0, 212, 255, 0.3)', // Enhanced aqua shadow
    },
    hamburgerIcon: {
      width: '40px',
      height: '35px',
      position: 'relative',
      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 2,
    },
    line: {
      display: 'block',
      position: 'absolute',
      height: '4px',
      width: '100%',
      background: 'var(--brand-white)',
      borderRadius: '2px',
      opacity: '1',
      left: '0',
      transform: 'rotate(0deg)',
      transition: '.25s ease-in-out',
    },
    menuContainer: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      position: 'absolute',
      top: '80px',
      left: '0',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '12px',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', // Brand blue shadow
      padding: '15px',
      minWidth: '280px',
      display: isOpen ? 'block' : 'none',
      opacity: isOpen ? '1' : '0',
      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      overflow: 'hidden',
      position: 'relative',
    },
    linkContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
      zIndex: 2,
    },
    link: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      padding: '14px 20px',
      borderRadius: '8px',
      fontSize: '1.1rem',
      textDecoration: 'none',
      fontWeight: '500',
      color: 'var(--brand-black)',
      transition: 'all 0.3s ease-in-out',
      border: '1px solid transparent',
      display: 'flex',
      alignItems: 'center',
    },
    linkHover: {
      backgroundColor: 'var(--brand-blue-100)',
      borderColor: 'var(--brand-blue-400)',
      transform: 'translateX(5px)',
      color: 'var(--brand-blue)',
      boxShadow:
        '0 0 10px rgba(0, 102, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    icon: {
      marginRight: '12px',
      width: '24px',
      height: '24px',
      display: 'inline-block',
      transition: 'all 0.3s ease',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)', // Brand blue overlay
      pointerEvents: 'none',
      borderRadius: '12px',
      zIndex: 1,
    },
  }

  // Dynamic styles for hamburger icon lines
  const line1Style = {
    ...navStyles.line,
    top: isOpen ? '12px' : '0px',
    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
  }

  const line2Style = {
    ...navStyles.line,
    top: '12px',
    opacity: isOpen ? '0' : '1',
    width: isOpen ? '0%' : '100%',
    left: isOpen ? '50%' : '0',
  }

  const line3Style = {
    ...navStyles.line,
    top: isOpen ? '12px' : '24px',
    transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
  }

  const [hamburgerHovered, setHamburgerHovered] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  const handleHamburgerHover = isHovering => {
    setHamburgerHovered(isHovering)
  }

  const handleLinkHover = (linkIndex, isHovering) => {
    setHoveredLink(isHovering ? linkIndex : null)
  }

  const getHamburgerStyle = () => {
    return {
      ...navStyles.hamburger,
      ...(hamburgerHovered ? navStyles.hamburgerHover : {}),
    }
  }

  const getLinkStyle = index => {
    return {
      ...navStyles.link,
      ...(hoveredLink === index ? navStyles.linkHover : {}),
    }
  }

  const getIconColor = index => {
    return hoveredLink === index ? 'var(--brand-blue)' : 'var(--brand-aqua)'
  }

  return (
    <div style={navStyles.container}>
      <div
        style={getHamburgerStyle()}
        onClick={toggleMenu}
        onMouseEnter={() => handleHamburgerHover(true)}
        onMouseLeave={() => handleHamburgerHover(false)}
      >
        <div style={navStyles.hamburgerIcon}>
          <span style={line1Style}></span>
          <span style={line2Style}></span>
          <span style={line3Style}></span>
        </div>
      </div>

      <div style={navStyles.menuContainer}>
        {/* Gradient overlay */}
        <div style={navStyles.gradientOverlay} />

        <div style={navStyles.linkContainer}>
          <a
            href='/learning/service-blueprinting/courses/'
            style={getLinkStyle(0)}
            onMouseEnter={() => handleLinkHover(0, true)}
            onMouseLeave={() => handleLinkHover(0, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke={getIconColor(0)}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
                <polyline points='9 22 9 12 15 12 15 22'></polyline>
              </svg>
            </span>
            All Courses
          </a>
          <a
            href='/learning/service-blueprinting/forms'
            style={getLinkStyle(1)}
            onMouseEnter={() => handleLinkHover(1, true)}
            onMouseLeave={() => handleLinkHover(1, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke={getIconColor(1)}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
                <polyline points='14 2 14 8 20 8'></polyline>
                <line x1='16' y1='13' x2='8' y2='13'></line>
                <line x1='16' y1='17' x2='8' y2='17'></line>
                <polyline points='10 9 9 9 8 9'></polyline>
              </svg>
            </span>
            Course Forms
          </a>
          <a
            href='/learning/discover'
            style={getLinkStyle(2)}
            onMouseEnter={() => handleLinkHover(2, true)}
            onMouseLeave={() => handleLinkHover(2, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke={getIconColor(2)}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <circle cx='12' cy='12' r='4'></circle>
                <line x1='21.17' y1='8' x2='12' y2='8'></line>
                <line x1='3.95' y1='6.06' x2='8.54' y2='14'></line>
                <line x1='10.88' y1='21.94' x2='15.46' y2='14'></line>
              </svg>
            </span>
            Discover Resolve
          </a>
          <a
            href='/learning/'
            style={getLinkStyle(3)}
            onMouseEnter={() => handleLinkHover(3, true)}
            onMouseLeave={() => handleLinkHover(3, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke={getIconColor(3)}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path>
                <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path>
              </svg>
            </span>
            Learning Hub
          </a>
          <a
            href='/'
            style={getLinkStyle(4)}
            onMouseEnter={() => handleLinkHover(4, true)}
            onMouseLeave={() => handleLinkHover(4, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke={getIconColor(4)}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <line x1='12' y1='8' x2='12' y2='16'></line>
                <line x1='8' y1='12' x2='16' y2='12'></line>
              </svg>
            </span>
            Product Docs
          </a>
        </div>
      </div>
    </div>
  )
}

export default FormNavigation
