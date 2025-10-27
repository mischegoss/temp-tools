import React, { useState } from 'react'

const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHamburgerHovered, setIsHamburgerHovered] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navStyles = {
    container: {
      position: 'fixed',
      top: '15px',
      left: '40px',
      zIndex: 1000001,
      fontFamily:
        'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    },
    hamburger: {
      width: '70px',
      height: '70px',
      borderRadius: '8px',
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
      width: '35px',
      height: '25px',
      position: 'relative',
      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-in-out',
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
      transition: '.3s ease-in-out',
    },
    menuContainer: {
      position: 'absolute',
      top: '80px',
      left: '0',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '8px',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 20px rgba(0, 102, 255, 0.3), 0 4px 12px rgba(0, 102, 255, 0.2)',
      padding: '15px',
      minWidth: '280px',
      display: isOpen ? 'block' : 'none',
      opacity: isOpen ? '1' : '0',
      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    linkContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    link: {
      padding: '14px 20px',
      borderRadius: '6px',
      fontSize: '1.1rem',
      textDecoration: 'none',
      fontWeight: '500',
      color: 'var(--brand-black)',
      transition: 'all 0.3s ease-in-out',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      border: '1px solid transparent',
    },
    icon: {
      marginRight: '12px',
      width: '24px',
      height: '24px',
      display: 'inline-block',
      transition: 'all 0.3s ease',
    },
    externalLinkIcon: {
      marginLeft: '8px',
      width: '16px',
      height: '16px',
      display: 'inline-block',
      transition: 'all 0.3s ease',
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

  const handleLinkHover = (e, isHovering) => {
    const mainIcon = e.currentTarget.querySelector('svg')
    const externalIcon = e.currentTarget.querySelector('span:last-child svg')

    if (isHovering) {
      e.currentTarget.style.backgroundColor = 'var(--brand-grey-100)'
      e.currentTarget.style.borderColor = 'var(--brand-aqua)'
      e.currentTarget.style.transform = 'translateX(5px)'
      e.currentTarget.style.color = 'var(--brand-black-700)'
      if (mainIcon) {
        mainIcon.style.stroke = 'var(--brand-blue-400)'
      }
      if (externalIcon) {
        externalIcon.style.stroke = 'var(--brand-blue-400)'
      }
    } else {
      e.currentTarget.style.backgroundColor = 'transparent'
      e.currentTarget.style.borderColor = 'transparent'
      e.currentTarget.style.transform = 'translateX(0)'
      e.currentTarget.style.color = 'var(--brand-black)'
      if (mainIcon) {
        mainIcon.style.stroke = 'var(--brand-aqua)'
      }
      if (externalIcon) {
        externalIcon.style.stroke = 'var(--brand-aqua)'
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
            href='/learning'
            style={navStyles.link}
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
                <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path>
                <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path>
              </svg>
            </span>
            Learning Hub
          </a>
          <a
            href='/'
            style={navStyles.link}
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
            Product Docs
          </a>
          <a
            href='https://support.resolve.io/'
            target='_blank'
            rel='noopener noreferrer'
            style={navStyles.link}
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
                <circle cx='12' cy='12' r='10'></circle>
                <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
                <line x1='12' y1='17' x2='12.01' y2='17'></line>
              </svg>
            </span>
            Support
            <span style={navStyles.externalLinkIcon}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--brand-aqua)'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                style={{ transition: 'stroke 0.3s ease' }}
              >
                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                <polyline points='15 3 21 3 21 9'></polyline>
                <line x1='10' y1='14' x2='21' y2='3'></line>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default MainNavigation
