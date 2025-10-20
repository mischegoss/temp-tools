import React from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import {
  docsSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  exploreButtonStyle,
  baseNavCardStyle,
  iconContainerStyle,
  iconStyle,
  cardTitleStyle,
  cardDescriptionStyle,
  learnMoreLinkStyle,
  arrowStyle,
  gradientBorderCSS,
} from '../library/styles/docsnavstyles.js'

const DocumentationNavigation = ({ data }) => {
  // Dynamic styles that respond to ProductProvider changes
  const navCardStyle = {
    ...baseNavCardStyle,
    borderLeft: '4px solid var(--product-accent-color)', // This will respond to ProductProvider
  }

  const dynamicIconStyle = {
    ...iconStyle,
    color: 'var(--product-accent-color)', // This will respond to ProductProvider
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: gradientBorderCSS }} />
      <section style={docsSectionStyle} className='docs-navigation-section'>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h2 style={sectionTitleStyle}>{data.sectionTitle}</h2>
            <Link to={data.exploreLink} style={exploreButtonStyle}>
              {data.exploreText}
            </Link>
          </div>

          <Grid container spacing={3}>
            {data.navItems.map((item, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12, // 1 column on mobile
                  sm: 6, // 2 columns on tablet and up
                  md: 6, // 2 columns on medium screens
                  lg: 6, // 2 columns on desktop
                }}
              >
                <Box style={navCardStyle}>
                  <div style={iconContainerStyle}>
                    <svg
                      style={dynamicIconStyle}
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  <p style={cardDescriptionStyle}>{item.description}</p>
                  <Link to={item.link} style={learnMoreLinkStyle}>
                    Learn More <span style={arrowStyle}>›</span>
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>
    </>
  )
}

export default DocumentationNavigation
