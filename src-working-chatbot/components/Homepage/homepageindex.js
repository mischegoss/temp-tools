import React, { useState, useEffect } from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import { homePageData } from './data/homepagedata.js'
import { homePageStyles } from './styles/homepagestyles.js'

// Simple static triple border with MUCH more subtle glow
const addStaticTripleBorder = () => {
  const styleId = 'static-triple-border'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* Static triple border with subtle glow */
      .enhanced-glow-card,
      [class*="enhanced-glow-card"],
      .homepage-container .enhanced-glow-card,
      .homepage-container [class*="MuiBox"],
      .homepage-section [class*="enhanced-glow-card"],
      div[class*="enhanced-glow-card"] {
        /* Triple border: dark outer, white gap, blue inner */
        box-shadow: 
          0 0 0 2px #0066FF,        /* Inner blue border */
          0 0 0 4px #FFFFFF,        /* White gap */
          0 0 0 6px #0D1637,        /* Dark blue-black outer border */
          0 0 8px rgba(0, 102, 255, 0.08),
          0 0 16px rgba(0, 102, 255, 0.04),
          0 6px 25px rgba(0, 0, 0, 0.2) !important;
        filter: drop-shadow(0 0 2px rgba(0, 102, 255, 0.05)) !important;
        transition: all 0.3s ease !important;
      }

      /* Enhanced hover effect - still subtle */
      .enhanced-glow-card:hover,
      [class*="enhanced-glow-card"]:hover {
        box-shadow: 
          0 0 0 2px #0066FF,        /* Inner blue border */
          0 0 0 4px #FFFFFF,        /* White gap */
          0 0 0 6px #0D1637,        /* Dark blue-black outer border */
          0 0 12px rgba(0, 102, 255, 0.12),
          0 0 24px rgba(0, 102, 255, 0.08),
          0 10px 30px rgba(0, 102, 255, 0.06) !important;
        filter: drop-shadow(0 0 4px rgba(0, 102, 255, 0.08)) !important;
        transform: translateY(-8px) !important;
        transition: all 0.3s ease !important;
      }
    `
    document.head.appendChild(style)
  }
}

// Single card with CSS-based triple border - MUCH more subtle
const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '48px 36px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

  // Triple border effect with subtle glow
  boxShadow: `
    0 0 0 4px #0066FF,
    0 0 0 6px #FFFFFF,
    0 0 0 8px #0066FF,
    0 0 12px rgba(0, 102, 255, 0.1),
    0 0 24px rgba(0, 102, 255, 0.06),
    0 0 36px rgba(0, 102, 255, 0.04),
    0 6px 25px rgba(0, 0, 0, 0.2)
  `,

  // Subtle glow using filter
  filter: 'drop-shadow(0 0 6px rgba(0, 102, 255, 0.08))',
}

// Individual card component with larger fonts
const ResourceCard = ({ title, description, icon, link, index = 0 }) => {
  // Enhanced styles with larger fonts
  const enhancedCardTitleStyle = {
    ...homePageStyles.cardTitleStyle,
    fontSize: '1.5rem', // Increased from 1.125rem
    marginBottom: '16px', // Increased spacing
    lineHeight: '1.3',
  }

  const enhancedCardDescriptionStyle = {
    ...homePageStyles.cardDescriptionStyle,
    fontSize: '1.125rem', // Increased from 1rem
  }

  return (
    <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        style={cardStyle}
        className={`enhanced-glow-card enhanced-glow-card-${index}`}
      >
        <div style={homePageStyles.iconContainerStyle}>{icon}</div>
        <h3 style={enhancedCardTitleStyle}>{title}</h3>
        <p style={enhancedCardDescriptionStyle}>{description}</p>
      </Box>
    </Link>
  )
}

// Main component
const HomePage = () => {
  useEffect(() => {
    addStaticTripleBorder()
  }, [])

  return (
    <section style={homePageStyles.sectionStyle} className='homepage-section'>
      {/* Brand gradient overlay for extra depth */}
      <div style={homePageStyles.gradientOverlayTopStyle} />

      <div style={homePageStyles.containerStyle} className='homepage-container'>
        <div style={homePageStyles.headerContentStyle}>
          <h2 style={homePageStyles.mainTitleStyle} className='homepage-title'>
            Customer Resource Hub
          </h2>
          <p style={homePageStyles.subtitleStyle}>How can we help?</p>
        </div>

        <Grid container spacing={4}>
          {homePageData.map((item, index) => (
            <Grid key={index} size={homePageStyles.gridItemSize}>
              <ResourceCard {...item} index={index} />
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Bottom right overlay for additional brand styling */}
      <div style={homePageStyles.gradientOverlayBottomStyle} />
    </section>
  )
}

export default HomePage
