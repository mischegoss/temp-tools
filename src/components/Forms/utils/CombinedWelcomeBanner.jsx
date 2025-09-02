import React, { useState } from 'react'
import { Link } from 'react-router-dom' // Import Link if using React Router

const CombinedWelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  const dismissBanner = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  const buttonStyle = {
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    color: 'var(--brand-white)',
    padding: '0.6rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '500',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    border: '2px solid var(--brand-blue-400)',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    textDecoration: 'none',
  }

  const buttonHoverStyle = {
    background:
      'linear-gradient(to bottom, var(--brand-black-700) 0%, var(--brand-blue-400) 100%)',
    boxShadow:
      '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)',
    transform: 'translateY(-2px)',
  }

  const dismissButtonStyle = {
    position: 'absolute',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-black-700) 100%)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-grey-400)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    zIndex: 5,
    transition: 'all 0.3s ease-in-out',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  }

  const dismissButtonHoverStyle = {
    background:
      'linear-gradient(to bottom, var(--brand-black-700) 0%, var(--brand-grey-600) 100%)',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
    borderColor: 'var(--brand-grey-200)',
  }

  return (
    <div
      className='new-courses-section'
      style={{
        background:
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
        padding: '1rem 0',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-90px',
        boxShadow:
          '0 0 20px rgba(0, 212, 255, 0.3), 0 4px 16px rgba(0, 212, 255, 0.2)',
        borderBottom: '3px solid var(--brand-blue-400)',
      }}
    >
      <button
        onClick={dismissBanner}
        style={dismissButtonStyle}
        onMouseOver={e => {
          Object.assign(e.currentTarget.style, dismissButtonHoverStyle)
        }}
        onMouseOut={e => {
          Object.assign(e.currentTarget.style, dismissButtonStyle)
        }}
        aria-label='Dismiss notification'
      >
        ×
      </button>

      {/* Brand-compliant overlay effects */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 102, 255, 0.25) 0%, rgba(0, 102, 255, 0.1) 40%, rgba(0, 102, 255, 0) 70%)',
        }}
      ></div>

      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(5, 7, 15, 0.2) 20%, rgba(5, 7, 15, 0.08) 40%, rgba(5, 7, 15, 0) 70%)',
        }}
      ></div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: 'left',
            marginRight: '1.5rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              color: 'var(--brand-white)',
              margin: 0,
              marginBottom: '0.3rem',
              fontSize: '1.7rem',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            New to Resolve Pro? Check out these courses.
          </h2>

          <p
            style={{
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              color: 'var(--brand-white)',
              margin: 0,
              fontSize: '1.3rem',
              lineHeight: '1.4',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          ></p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginRight: '2.5rem',
          }}
        >
          {/* Course Button 1 with Link */}
          <Link
            to='/service-blueprinting'
            style={{ ...buttonStyle }}
            onMouseOver={e =>
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseOut={e => {
              Object.assign(e.currentTarget.style, buttonStyle)
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              style={{ marginRight: '0.6rem' }}
            >
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
              <line x1='3' y1='9' x2='21' y2='9'></line>
              <line x1='9' y1='21' x2='9' y2='9'></line>
            </svg>
            Service Blueprinting
          </Link>

          {/* Course Button 2 with Link */}
          <Link
            to='/learning'
            style={{ ...buttonStyle }}
            onMouseOver={e =>
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseOut={e => {
              Object.assign(e.currentTarget.style, buttonStyle)
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              style={{ marginRight: '0.6rem' }}
            >
              <path d='M9 18l6-6-6-6'></path>
            </svg>
            View All Courses
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CombinedWelcomeBanner
