import React, { useState } from 'react'

const ProspectNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHamburgerHovered, setIsHamburgerHovered] = useState(false)
  // Get the current path when component mounts
  const [currentPath, setCurrentPath] = useState('')

  // Set current path on component mount
  React.useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Handle link clicks to prevent reload if already on that page
  const handleLinkClick = (e, path) => {
    if (path === currentPath) {
      e.preventDefault() // Prevent default navigation behavior
    }
  }

  const navStyles = {
    container: {
      position: 'fixed',
      top: '20px', // Moved lower (was 10px)
      left: '40px', // Positioned on the LEFT side
      zIndex: 1000001,
      fontFamily:
        'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    },
    hamburger: {
      width: '70px', // Increased size (was 60px)
      height: '70px', // Increased size (was 60px)
      borderRadius: '8px', // Square with slightly rounded corners
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      border: '2px solid var(--brand-aqua)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      boxShadow:
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
    },
    hamburgerHover: {
      transform: 'translateY(-3px)',
      boxShadow:
        '0 0 25px rgba(0, 212, 255, 0.4), 0 6px 16px rgba(0, 212, 255, 0.3)',
      borderColor: 'var(--brand-blue-400)',
    },
    hamburgerIcon: {
      width: '40px', // Increased size (was 30px)
      height: '35px', // Increased size (was 21px)
      position: 'relative',
      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-in-out',
    },
    line: {
      display: 'block',
      position: 'absolute',
      height: '4px', // Increased thickness (was 3px)
      width: '100%',
      background: 'var(--brand-white)',
      borderRadius: '2px',
      opacity: '1',
      left: '0',
      transform: 'rotate(0deg)',
      transition: '.3s ease-in-out',
    },
    menuContainer: {
      position: 'absolute',
      top: '80px', // Adjusted for the new hamburger size
      left: '0', // Align menu to the left
      backgroundColor: 'var(--brand-white)',
      borderRadius: '8px',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 20px rgba(0, 102, 255, 0.3), 0 4px 12px rgba(0, 102, 255, 0.2)',
      padding: '15px', // Increased padding
      minWidth: '280px', // Slightly wider
      display: isOpen ? 'block' : 'none',
      opacity: isOpen ? '1' : '0',
      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    linkContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px', // Increased gap
    },
    link: {
      padding: '14px 20px', // Increased padding
      borderRadius: '6px',
      fontSize: '1.1rem',
      textDecoration: 'none',
      fontWeight: '500',
      color: 'var(--brand-black)',
      transition: 'all 0.3s ease-in-out',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      border: '1px solid transparent',
    },
    linkHover: {
      backgroundColor: 'var(--brand-grey-100)',
      borderColor: 'var(--brand-aqua)',
      transform: 'translateX(5px)',
      color: 'var(--brand-black-700)',
    },
    icon: {
      marginRight: '12px',
      width: '24px',
      height: '24px',
      display: 'inline-block',
      transition: 'all 0.3s ease',
    },
  }

  // Dynamic styles for hamburger icon lines
  const line1Style = {
    ...navStyles.line,
    top: isOpen ? '12px' : '0px', // Adjusted positioning
    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
  }

  const line2Style = {
    ...navStyles.line,
    top: '12px', // Adjusted positioning
    opacity: isOpen ? '0' : '1',
    width: isOpen ? '0%' : '100%',
    left: isOpen ? '50%' : '0',
  }

  const line3Style = {
    ...navStyles.line,
    top: isOpen ? '12px' : '24px', // Adjusted positioning
    transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
  }

  const handleLinkHover = (e, isHovering) => {
    const icon = e.currentTarget.querySelector('svg')
    if (isHovering) {
      e.currentTarget.style.backgroundColor = 'var(--brand-grey-100)'
      e.currentTarget.style.borderColor = 'var(--brand-aqua)'
      e.currentTarget.style.transform = 'translateX(5px)'
      e.currentTarget.style.color = 'var(--brand-black-700)'
      if (icon) {
        icon.style.stroke = 'var(--brand-blue-400)'
      }
    } else {
      e.currentTarget.style.backgroundColor = 'transparent'
      e.currentTarget.style.borderColor = 'transparent'
      e.currentTarget.style.transform = 'translateX(0)'
      e.currentTarget.style.color = 'var(--brand-black)'
      if (icon) {
        icon.style.stroke = 'var(--brand-aqua)'
      }
    }
  }

  return (
    <div style={navStyles.container}>
      <div
        style={{
          ...navStyles.hamburger,
          ...(isHamburgerHovered ? navStyles.hamburgerHover : {}),
        }}
        onClick={toggleMenu}
        onMouseEnter={() => setIsHamburgerHovered(true)}
        onMouseLeave={() => setIsHamburgerHovered(false)}
      >
        <div style={navStyles.hamburgerIcon}>
          <span style={line1Style}></span>
          <span style={line2Style}></span>
          <span style={line3Style}></span>
        </div>
      </div>

      <div style={navStyles.menuContainer}>
        <div style={navStyles.linkContainer}>
          <a
            href='/learning/discover'
            style={navStyles.link}
            onClick={e => handleLinkClick(e, '/learning/discover')}
            onMouseEnter={e => handleLinkHover(e, true)}
            onMouseLeave={e => handleLinkHover(e, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--brand-aqua)'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                style={{ transition: 'stroke 0.3s ease' }}
              >
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
                <polyline points='9 22 9 12 15 12 15 22'></polyline>
              </svg>
            </span>
            Home
          </a>
          <a
            href='/'
            style={navStyles.link}
            onClick={e => handleLinkClick(e, '/')}
            onMouseEnter={e => handleLinkHover(e, true)}
            onMouseLeave={e => handleLinkHover(e, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--brand-aqua)'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                style={{ transition: 'stroke 0.3s ease' }}
              >
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
                <polyline points='14 2 14 8 20 8'></polyline>
                <line x1='16' y1='13' x2='8' y2='13'></line>
                <line x1='16' y1='17' x2='8' y2='17'></line>
                <polyline points='10 9 9 9 8 9'></polyline>
              </svg>
            </span>
            Product Docs
          </a>
          <a
            href='/learning/contact-us'
            style={navStyles.link}
            onClick={e => handleLinkClick(e, '/learning/contact-us')}
            onMouseEnter={e => handleLinkHover(e, true)}
            onMouseLeave={e => handleLinkHover(e, false)}
          >
            <span style={navStyles.icon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--brand-aqua)'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                style={{ transition: 'stroke 0.3s ease' }}
              >
                <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                <polyline points='22,6 12,13 2,6'></polyline>
              </svg>
            </span>
            Contact Resolve
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProspectNavigation
