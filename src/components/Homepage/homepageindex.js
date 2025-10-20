// @site/src/components/Homepage/homepageindex.js

import React, { useState, useEffect } from 'react'
import Link from '@docusaurus/Link'
import { homePageData } from './data/homepagedata.js'
import { homePageStyles } from './styles/homepagestyles.js'

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsDesktop(width >= 1200)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get responsive styles
  const getContainerStyle = () => {
    return isMobile
      ? homePageStyles.containerStyleMobile
      : homePageStyles.containerStyle
  }

  const getMainTitleStyle = () => {
    return isMobile
      ? homePageStyles.mainTitleStyleMobile
      : homePageStyles.mainTitleStyle
  }

  const getSubtitleStyle = () => {
    return isMobile
      ? homePageStyles.subtitleStyleMobile
      : homePageStyles.subtitleStyle
  }

  const getHeaderContentStyle = () => {
    return isMobile
      ? homePageStyles.headerContentStyleMobile
      : homePageStyles.headerContentStyle
  }

  const getCardsGridStyle = () => {
    if (isMobile) {
      return homePageStyles.cardsGridStyleMobile
    } else if (isDesktop) {
      return homePageStyles.cardsGridStyleDesktop
    } else {
      return homePageStyles.cardsGridStyleMobile // Default to 2 columns for tablet
    }
  }

  const getCardStyle = index => {
    const baseStyle = isMobile
      ? homePageStyles.enhancedGlowCardStyleMobile
      : homePageStyles.enhancedGlowCardStyle

    // Apply hover style if this card is hovered
    if (hoveredCard === index) {
      return {
        ...baseStyle,
        ...homePageStyles.enhancedGlowCardHoverStyle,
      }
    }

    return baseStyle
  }

  return (
    <section style={homePageStyles.sectionStyle}>
      {/* Gradient overlays */}
      <div style={homePageStyles.gradientOverlayTopStyle} />
      <div style={homePageStyles.gradientOverlayBottomStyle} />

      {/* Main content */}
      <div style={getContainerStyle()}>
        <div style={getHeaderContentStyle()}>
          <h1 style={getMainTitleStyle()}>
            Welcome to the Resolve Learning Hub
          </h1>
          <p style={getSubtitleStyle()}>
            Your path to automation expertise starts here
          </p>
        </div>

        {/* Cards grid using CSS Grid */}
        <div style={getCardsGridStyle()}>
          {homePageData.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              style={getCardStyle(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={homePageStyles.iconContainerStyle}>{item.icon}</div>

              {/* Updated title section to handle two-line titles */}
              <h3 style={homePageStyles.cardTitleStyle}>
                {Array.isArray(item.title) ? (
                  <>
                    {item.title[0]}
                    <br />
                    {item.title[1]}
                  </>
                ) : (
                  item.title
                )}
              </h3>

              <p style={homePageStyles.cardDescriptionStyle}>
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
