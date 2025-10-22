import React from 'react'
import Link from '@docusaurus/Link'
import { bannerData } from '../Actions/data/bannerdata.js' // Import banner configuration

const Banner = () => {
  // If banner is set to not show, don't render anything
  if (!bannerData.showing) {
    return null
  }
  const bannerStyle = {
    background: 'var(--color-bg-footer)', // Same as docs navigation (--brand-black-700)
    padding: '16px 0',
    borderBottom: '1px solid var(--product-accent-color)', // Subtle bottom border
    width: '100%',
    position: 'relative',
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px', // Reduced padding to push content closer to edges
    display: 'flex',
    justifyContent: 'space-between', // Text left, button right like docs nav
    alignItems: 'center',
    gap: '30px', // Increased gap for more separation
    flexWrap: 'wrap', // Allow wrapping on mobile
  }

  const textStyle = {
    color: 'var(--brand-white)',
    fontSize: '1.5rem', // Bigger text
    fontWeight: '600', // Bolder
    margin: '0',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    textAlign: 'left', // Left-aligned
  }

  const buttonStyle = {
    background: 'var(--brand-blue)', // Same blue as docs nav button
    color: 'var(--brand-white)',
    padding: '12px 24px',
    borderRadius: '50px', // Pill shape like docs nav
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    border: 'none',
    whiteSpace: 'nowrap', // Prevent button text from wrapping
  }

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.background = 'var(--brand-blue-400)' // Lighter blue on hover
      e.target.style.transform = 'translateY(-1px)'
    } else {
      e.target.style.background = 'var(--brand-blue)'
      e.target.style.transform = 'translateY(0)'
    }
  }

  return (
    <div style={bannerStyle} className='banner-component'>
      <div style={containerStyle}>
        <p style={textStyle}>
          {bannerData.boldText ? (
            <>
              <strong>{bannerData.boldText}</strong>{' '}
              {bannerData.message.replace(bannerData.boldText, '').trim()}
            </>
          ) : (
            bannerData.message
          )}
        </p>
        <Link
          to={bannerData.buttonLink}
          style={buttonStyle}
          onMouseEnter={e => handleButtonHover(e, true)}
          onMouseLeave={e => handleButtonHover(e, false)}
        >
          {bannerData.buttonText}
        </Link>
      </div>
    </div>
  )
}

export default Banner
