// @site/src/components/RitaGo/RitaGoIndexNoFilter.js

import React, { useMemo } from 'react'
import { useVideoLibrary } from '@site/src/components/ActionVideoLibrary/Data/VideoData.js'
import Link from '@docusaurus/Link'

// Import the shared modular components (excluding filter) + hydration-safe cards
import WelcomeSection from '../LandingPageLibrary/WelcomeSection.js'
import FeaturedVideoSectionVideoGallery from '../LandingPageLibrary/FeaturedVideoSectionVideoGallery.js'
import {
  learningHubSectionStyle,
  containerStyle,
  helpTitleStyle,
  helpDescriptionStyle,
} from '@site/src/components/LandingPageLibrary/sharedStyles.js'

/**
 * RitaGoIndexNoFilter component - Rita Go landing page WITHOUT filtering functionality
 *
 * This component removes all filter-related functionality and hydration issues:
 * - No useState for activeFilter (eliminates hydration mismatch)
 * - No filter UI section
 * - Custom Rita Go Documentation card (not using HydrationSafeCards)
 * - Custom video gallery header
 * - Simplified structure prevents bubbling issues
 * - Dark blue-black theme (#1a1f36) with bright blue accents (#0066FF)
 * - Light blue-gray card backgrounds (#f8fafc) for better integration
 * - Blue-tinted text colors for cohesion with reference page
 *
 * Structure:
 * 1. Welcome Section
 * 2. Featured Video Section with Custom Header
 * 3. Rita Go Documentation Card (directly coded)
 * 4. Enhanced Help Section with Button
 *
 * VIDEO GALLERY INTEGRATION SUGGESTIONS:
 * To better integrate the video gallery with Rita Go branding:
 *
 * 1. Override button colors in FeaturedVideoSectionVideoGallery:
 *    - Pass ritaGoColors as productColors prop
 *    - Update button gradient to use dark blue-black with bright blue accents
 *
 * 2. Add dark blue-black border to video gallery container (✅ IMPLEMENTED):
 *    - Wrapped gallery in styled container with border and light blue-gray background
 *    - Added subtle box-shadow with dark blue-black tint
 *
 * 3. Style video cards to match Rita Go theme:
 *    - Override video card hover effects to use bright blue accents
 *    - Update play button and progress indicators to bright blue (#0066FF)
 *
 * 4. Modify gallery button styling:
 *    - Change "View Full Video Gallery" button to use Rita Go colors
 *    - Add bright blue hover state and border
 */
const RitaGoIndexNoFilter = ({
  // Welcome section props
  welcomeSectionProps = {
    title: 'Welcome to Rita Go Learning',
    content:
      'Explore our AI-powered automation assistant designed for intelligent workflow management. Rita Go combines the power of artificial intelligence with intuitive automation to streamline your processes.',
  },

  // Featured video section props
  featuredVideoSectionProps = {
    label: 'Featured Learning Video',
    buttonText: 'View Full Video Gallery →',
    buttonLink: '/learning/video-gallery',
  },

  // Help section props
  helpSectionProps = {
    title: 'Get Early Access to Rita Go',
    description:
      'This fall, Resolve will launch RITA Go, a trial version of RITA, our AI-powered resolution agent that supercharges IT service delivery.',
    buttonText: 'Get early access to Rita Go →',
    buttonLink: 'mailto:training@resolve.io',
  },

  // Data sources
  videoResources, // CHANGED: Now comes from Firebase, not static
}) => {
  // CHANGED: Get real-time video data from Firebase
  const {
    videos: videoLibrary,
    loading: videosLoading,
    error: videosError,
  } = useVideoLibrary()

  // Use Firebase data if available, otherwise use passed videoResources
  const activeVideoResources =
    videoLibrary.length > 0 ? videoLibrary : videoResources || []

  // Get featured video (memoized for performance)
  const featuredVideo = useMemo(() => {
    if (!activeVideoResources || activeVideoResources.length === 0) return null

    // Look for Rita Go featured video
    const ritaGoFeatured = activeVideoResources.find(
      v => v.product === 'rita-go' && v.featured === true,
    )
    return ritaGoFeatured || activeVideoResources[0] // fallback
  }, [activeVideoResources])

  // Dark blue-black color theme with bright blue accents
  const ritaGoColors = {
    primary: '#1a1f36', // Dark blue-black
    secondary: '#2d3748', // Slightly lighter blue-gray for gradient
    accent: '#1a1f36',
    brightBlue: '#0066FF', // Bright blue accent from reference page
    cardBackground: '#f8fafc', // Light blue-gray card background
    textPrimary: '#334155', // Blue-tinted dark text
    textSecondary: '#475569', // Blue-tinted medium text
  }

  // Rita Go Documentation learning path data
  const ritaGoLearningPath = {
    title: 'Rita Go Documentation',
    description: 'Explore Rita Go key features for Users and Owners',
    link: '/rita-go/',
    icon: '🤖',
    extendedDescription:
      'Comprehensive documentation covering all Rita Go features, from basic setup to advanced AI-powered automation workflows.',
    usageInstructions: 'Recommended for all Rita Go users.',
    resourceType: 'documentation',
    primaryLevel: 'ALL LEVELS',
    secondaryLevel: '',
    primaryLevelDescription: '',
    prerequisites: '',
    skills: [],
    courses: [
      'Getting Started with Rita Go',
      'AI-Powered Automation',
      'Workflow Management',
      'Integration Setup',
      'Best Practices',
      'Troubleshooting',
    ],
  }

  // Custom Video Gallery Header Component
  const VideoGalleryHeader = () => (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '10px 0',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: ritaGoColors.textPrimary, // Blue-tinted dark text
          margin: '0',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          lineHeight: '1.2',
        }}
      >
        Rita Go Video Tutorials and Learning
      </h2>
      <div
        style={{
          width: '60px',
          height: '3px',
          background: `linear-gradient(135deg, ${ritaGoColors.primary} 0%, ${ritaGoColors.brightBlue} 100%)`, // Gradient underline with bright blue
          margin: '20px auto 0 auto',
        }}
      />
    </div>
  )

  // Documentation Header Component
  const DocumentationHeader = () => (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '10px 0',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: ritaGoColors.textPrimary, // Blue-tinted dark text
          margin: '0',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          lineHeight: '1.2',
        }}
      >
        Documentation
      </h2>
      <div
        style={{
          width: '60px',
          height: '3px',
          background: `linear-gradient(135deg, ${ritaGoColors.primary} 0%, ${ritaGoColors.brightBlue} 100%)`, // Gradient underline with bright blue
          margin: '20px auto 0 auto',
        }}
      />
    </div>
  )

  // Get Rita Go Trial Header Component
  const TrialHeader = () => (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '10px 0',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: ritaGoColors.textPrimary, // Blue-tinted dark text
          margin: '0',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          lineHeight: '1.2',
        }}
      >
        Get Rita Go Trial
      </h2>
      <div
        style={{
          width: '60px',
          height: '3px',
          background: `linear-gradient(135deg, ${ritaGoColors.primary} 0%, ${ritaGoColors.brightBlue} 100%)`, // Gradient underline with bright blue
          margin: '20px auto 0 auto',
        }}
      />
    </div>
  )

  // Custom Rita Go Documentation Card Component
  const RitaGoDocumentationCard = () => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isButtonHovered, setIsButtonHovered] = React.useState(false)

    const cardStyle = {
      background: ritaGoColors.cardBackground, // Light blue-gray background
      borderRadius: '12px',
      transition: 'all 0.15s ease',
      border: `2px solid ${ritaGoColors.primary}`,
      borderLeft: `6px solid ${ritaGoColors.primary}`,
      overflow: 'hidden',
      boxShadow: isHovered
        ? `0 8px 24px rgba(26, 31, 54, 0.15)`
        : `0 4px 12px rgba(26, 31, 54, 0.1)`,
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      marginBottom: '30px',
      position: 'relative',
      cursor: 'pointer',
    }

    const contentStyle = {
      padding: '32px',
      textAlign: 'center',
    }

    const titleStyle = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: ritaGoColors.textPrimary, // Blue-tinted dark text
      margin: '0 0 8px 0',
      textAlign: 'center',
    }

    const descriptionStyle = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: ritaGoColors.textSecondary, // Blue-tinted medium text
      fontSize: '1rem',
      lineHeight: '1.6',
      margin: '0 0 24px 0',
      textAlign: 'center',
    }

    const buttonStyle = {
      background: isButtonHovered
        ? `linear-gradient(135deg, ${ritaGoColors.brightBlue} 0%, ${ritaGoColors.primary} 100%)` // Bright blue on hover
        : `linear-gradient(135deg, ${ritaGoColors.primary} 0%, ${ritaGoColors.secondary} 100%)`,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '0.95rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: '1.2',
      transition: 'all 0.2s ease',
      transform: isButtonHovered ? 'translateY(-1px)' : 'translateY(0)',
      boxShadow: isButtonHovered
        ? '0 4px 12px rgba(0, 102, 255, 0.3)' // Bright blue shadow on hover
        : '0 2px 6px rgba(26, 31, 54, 0.2)',
    }

    const footerStyle = {
      backgroundColor: ritaGoColors.primary,
      color: '#FFFFFF',
      padding: '16px 32px',
      fontSize: '0.875rem',
      fontWeight: '500',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }

    return (
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={contentStyle}>
          <h3 style={titleStyle}>{ritaGoLearningPath.title}</h3>
          <p style={descriptionStyle}>{ritaGoLearningPath.description}</p>
          <Link
            to={ritaGoLearningPath.link}
            style={buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Get Started
          </Link>
        </div>
        <div style={footerStyle}>
          <span>🤖</span>
          <span>Documentation</span>
        </div>
      </div>
    )
  }

  // Enhanced Help Section Component with Button
  const EnhancedHelpSection = () => {
    const [isButtonHovered, setIsButtonHovered] = React.useState(false)

    const helpSectionStyle = {
      background: ritaGoColors.cardBackground, // Light blue-gray background
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      border: `2px solid ${ritaGoColors.primary}`,
      borderLeft: `6px solid ${ritaGoColors.primary}`,
      boxShadow: `0 4px 12px rgba(26, 31, 54, 0.1)`,
      marginBottom: '30px',
    }

    const helpTitleStyleLocal = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: ritaGoColors.textPrimary, // Blue-tinted dark text
      margin: '0 0 16px 0',
      textAlign: 'center',
    }

    const helpDescriptionStyleLocal = {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: ritaGoColors.textSecondary, // Blue-tinted medium text
      fontSize: '1rem',
      lineHeight: '1.6',
      margin: '0 0 24px 0',
      textAlign: 'center',
    }

    const helpButtonStyle = {
      background: isButtonHovered
        ? `linear-gradient(135deg, ${ritaGoColors.brightBlue} 0%, ${ritaGoColors.primary} 100%)` // Bright blue on hover
        : `linear-gradient(135deg, ${ritaGoColors.primary} 0%, ${ritaGoColors.secondary} 100%)`,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '0.95rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: '1.2',
      transition: 'all 0.2s ease',
      marginTop: '0px',
      transform: isButtonHovered ? 'translateY(-1px)' : 'translateY(0)',
      boxShadow: isButtonHovered
        ? '0 4px 12px rgba(0, 102, 255, 0.3)' // Bright blue shadow on hover
        : '0 2px 6px rgba(26, 31, 54, 0.2)',
    }

    // Modified section style with reduced spacing
    const helpSectionStyleReduced = {
      ...learningHubSectionStyle,
      padding: '40px 0 80px 0', // Reduced spacing to match other sections
    }

    return (
      <section style={helpSectionStyleReduced} className='help-section'>
        <div style={containerStyle}>
          <TrialHeader />
          <div style={helpSectionStyle}>
            <h3 style={helpTitleStyleLocal}>{helpSectionProps.title}</h3>
            <p style={helpDescriptionStyleLocal}>
              {helpSectionProps.description}
            </p>
            <Link
              to={helpSectionProps.buttonLink}
              style={helpButtonStyle}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {helpSectionProps.buttonText}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Welcome Section */}
      <WelcomeSection
        welcomeSectionProps={welcomeSectionProps}
        productColors={ritaGoColors}
        style={{ padding: '60px 0 40px 0' }} // Reduced bottom padding
      />

      {/* Featured Video Section with Custom Header */}
      {featuredVideo && (
        <section style={{ ...learningHubSectionStyle, padding: '40px 0' }}>
          <div style={containerStyle}>
            <VideoGalleryHeader />
            <div
              style={{
                border: `2px solid ${ritaGoColors.primary}`,
                borderRadius: '12px',
                padding: '20px',
                background: ritaGoColors.cardBackground, // Light blue-gray background
                boxShadow: `0 4px 12px rgba(26, 31, 54, 0.1)`,
              }}
            >
              <FeaturedVideoSectionVideoGallery
                featuredVideo={featuredVideo}
                videoGallery={activeVideoResources}
                sectionProps={{
                  ...featuredVideoSectionProps,
                  productColors: ritaGoColors, // Pass Rita Go colors to the gallery
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Rita Go Documentation Card Section */}
      <section style={{ ...learningHubSectionStyle, padding: '40px 0' }}>
        <div style={containerStyle}>
          <DocumentationHeader />
          <RitaGoDocumentationCard />
        </div>
      </section>

      {/* Enhanced Help Section */}
      <EnhancedHelpSection />
    </>
  )
}

export default RitaGoIndexNoFilter
