import React from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import heroStyles from '../library/styles/herostyles1.js'
import { heroData as defaultHeroData } from '../Actions/data/herodata.js'

const Hero = ({ heroData = defaultHeroData }) => {
  // Provide default values if heroData is not passed
  const {
    title = 'Resolve Actions',
    subtitle = 'Intelligent IT Process Automation platform to help you unleash innovation',
    cards = [],
  } = heroData

  // Icon mapping for the cards
  const iconMap = {
    // Get Started with Actions Platform
    0: (
      <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    // Building Your First Workflow
    1: (
      <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <polyline
          points='7.5,4.21 12,6.81 16.5,4.21'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <polyline
          points='7.5,19.79 7.5,14.6 3,12'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <polyline
          points='21,12 16.5,14.6 16.5,19.79'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <polyline
          points='12,22.81 12,17'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    // What's New
    2: (
      <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13.73 21a2 2 0 01-3.46 0'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    // Getting Support
    3: (
      <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M9 12l2 2 4-4'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M21 12c.552 0 1-.448 1-1V8a2 2 0 00-2-2H4a2 2 0 00-2 2v3c0 .552.448 1 1 1h1v7a2 2 0 002 2h12a2 2 0 002-2v-7h1z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  }

  // Handler for card hover effects
  const handleCardMouseEnter = e => {
    Object.assign(e.currentTarget.style, heroStyles.cardHoverStyle)
  }

  const handleCardMouseLeave = e => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = heroStyles.baseCardStyle.boxShadow
  }

  // Handler for link hover effects (using dark secondary)
  const handleLinkMouseEnter = e => {
    e.target.style.color = 'var(--product-accent-color)'
  }

  const handleLinkMouseLeave = e => {
    e.target.style.color = 'var(--product-dark-secondary)'
  }

  // Handler for clickable description hover (using dark secondary)
  const handleDescriptionMouseEnter = e => {
    e.target.style.color = 'var(--product-dark-secondary)'
  }

  const handleDescriptionMouseLeave = e => {
    e.target.style.color = 'var(--brand-grey-600)'
  }

  return (
    <section style={heroStyles.heroSectionStyle} className='brand-font'>
      {/* Brand overlay */}
      <div style={heroStyles.overlayStyle}></div>

      <div style={heroStyles.containerStyle}>
        <div style={heroStyles.heroContentStyle}>
          <h1 style={heroStyles.heroTitleStyle}>{title}</h1>
          <p style={heroStyles.heroSubtitleStyle}>{subtitle}</p>
        </div>

        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid
              key={index}
              size={{
                xs: 12, // 1 column on mobile
                sm: 6, // 2 columns on tablet
                lg: 3, // 4 columns on desktop
              }}
            >
              <Box
                style={heroStyles.baseCardStyle}
                className='brand-hover'
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* Gradient Header Section with Icon */}
                <div style={heroStyles.cardHeaderStyle}>
                  <div style={heroStyles.iconContainerStyle}>
                    <div style={heroStyles.iconStyle}>{iconMap[index]}</div>
                  </div>
                </div>

                {/* White Content Section with Text */}
                <div style={heroStyles.cardContentStyle}>
                  <h3 style={heroStyles.cardTitleStyle}>{card.title}</h3>

                  {/* Handle single link (clickable description) */}
                  {card.description && card.link && (
                    <Link to={card.link} style={{ textDecoration: 'none' }}>
                      <p
                        style={heroStyles.clickableDescriptionStyle}
                        onMouseEnter={handleDescriptionMouseEnter}
                        onMouseLeave={handleDescriptionMouseLeave}
                      >
                        {card.description}
                      </p>
                    </Link>
                  )}

                  {/* Handle description without link */}
                  {card.description && !card.link && (
                    <p style={heroStyles.cardDescriptionStyle}>
                      {card.description}
                    </p>
                  )}

                  {/* Handle multiple links */}
                  {card.links && (
                    <div style={heroStyles.cardLinksStyle}>
                      {card.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          to={link.to}
                          style={heroStyles.cardLinkStyle}
                          onMouseEnter={handleLinkMouseEnter}
                          onMouseLeave={handleLinkMouseLeave}
                        >
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default Hero
