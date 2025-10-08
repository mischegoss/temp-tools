import React from 'react'

const Navigation = () => {
  const iconStyles = {
    container: {
      position: 'fixed',
      top: '40px',
      left: '40px',
      zIndex: 1000001,
      fontFamily:
        'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
    },
    button: {
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
    buttonHover: {
      transform: 'translateY(-3px)',
      boxShadow:
        '0 0 25px rgba(0, 212, 255, 0.4), 0 6px 16px rgba(0, 212, 255, 0.3)',
      borderColor: 'var(--brand-blue-400)',
    },
    icon: {
      width: '40px',
      height: '40px',
      color: 'var(--brand-white)',
      transition: 'all 0.3s ease',
    },
  }

  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div style={iconStyles.container}>
      <a
        href='/learning/automation-essentials/courses'
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            ...iconStyles.button,
            ...(isHovered ? iconStyles.buttonHover : {}),
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='40'
            height='40'
            viewBox='0 0 24 24'
            fill='none'
            stroke='var(--brand-white)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={iconStyles.icon}
          >
            <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
            <polyline points='9 22 9 12 15 12 15 22'></polyline>
          </svg>
        </div>
      </a>
    </div>
  )
}

export default Navigation
