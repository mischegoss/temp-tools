import React from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import heroStyles from '../library/styles/herostyles1-light.js'
import { heroData as defaultHeroData } from '../Actions/data/herodata.js'

const Hero1 = ({ heroData = defaultHeroData }) => {
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

  // Generate default links based on card titles
  const generateLink = (card, index) => {
    if (card.link) return card.link

    // Default link generation based on title
    const defaultLinks = {
      'Get Started with Actions Platform': '/getting-started',
      'Building Your First Workflow': '/building-workflow',
      "What's New": '/whats-new',
      'Getting Support': '/support',
    }

    return (
      defaultLinks[card.title] ||
      `/${card.title.toLowerCase().replace(/\s+/g, '-')}`
    )
  }

  // Handler for card hover effects
  const handleCardMouseEnter = e => {
    Object.assign(e.currentTarget.style, heroStyles.lightCardHoverStyle)
  }

  const handleCardMouseLeave = e => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = heroStyles.lightCardStyle.boxShadow
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

        <Grid
          container
          spacing={3}
          justifyContent='center'
          maxWidth='900px'
          margin='0 auto'
        >
          {cards.map((card, index) => (
            <Grid
              key={index}
              size={{
                xs: 10, // Single card on mobile (83% width)
                sm: 6, // 2 cards per row on tablet (50% width each)
                lg: 4, // 3 cards per row on desktop (33% width each)
              }}
            >
              {card.comingSoon ? (
                // Disabled card (no link)
                <Box style={heroStyles.lightCardStyle} className='brand-hover'>
                  {/* Coming Soon Banner */}
                  <div style={heroStyles.comingSoonBannerStyle}>
                    Coming Soon
                  </div>

                  {/* Overlay */}
                  <div style={heroStyles.disabledCardOverlayStyle}></div>

                  <div style={heroStyles.iconContainerStyle}>
                    <div style={heroStyles.lightIconStyle}>
                      {iconMap[index]}
                    </div>
                  </div>
                  <h3 style={heroStyles.lightCardTitleStyle}>{card.title}</h3>
                </Box>
              ) : (
                // Normal clickable card
                <Link
                  to={generateLink(card, index)}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    style={heroStyles.lightCardStyle}
                    className='brand-hover'
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <div style={heroStyles.iconContainerStyle}>
                      <div style={heroStyles.lightIconStyle}>
                        {iconMap[index]}
                      </div>
                    </div>
                    <h3 style={heroStyles.lightCardTitleStyle}>{card.title}</h3>
                  </Box>
                </Link>
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default Hero1
