import React, { useState, useMemo } from 'react'
import MainNavigation from '@site/src/components/MainLandingPages/MainNavigation'
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot'
import MainStylizedHeader from '@site/src/components/MainLandingPages/MainStylizedHeader'
import MainLandingPageCards from '@site/src/components/MainLandingPages/MainLandingPageCard2'
import MainWelcomeBanner from '@site/src/components/MainLandingPages/MainWelcomeBanner'
import MainWelcomeSection from '@site/src/components/MainLandingPages/MainWelcomeSection'
import MainFilterSection from '@site/src/components/MainLandingPages/MainFilterSection'
import MainNeedHelp from '@site/src/components/MainLandingPages/MainNeedHelp'
import { learningPaths } from '@site/src/components/Data/LearningPathsActions'

// Import the SVG directly inside the component
import ActionsLogo from '@site/static/img/Resolve-Actions-Light-3.svg'

/**
 * LandingPageActions component - Creates a brand-compliant landing page for Resolve Actions
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} LandingPageActions component
 */
const LandingPageActions = ({
  // Props with default values - updated to use brand colors
  headerTitle = 'RESOLVE ACTIONS',
  headerLogoHeight = 90,
  welcomeBannerProps = {
    title: 'New to Resolve Actions? Check out these courses.',
    buttons: [
      {
        text: 'Service Blueprinting',
        link: '/learning/service-blueprinting',
        icon: 'table',
      },
      {
        text: 'View All Courses',
        link: '/learning',
        icon: 'chevron-right',
      },
    ],
    showDismissButton: true,
    // Updated to use solid brand color - no gradient
    gradient: null, // Will use default aqua-800
    borderImage: null, // Will use default brand styling
  },
  welcomeSectionProps = {
    title: 'Welcome to Resolve Actions Learning',
    content:
      'Explore our specialized learning paths designed to help you master Resolve Actions. Our Learning Paths will quickly get you started in exploring our latest automation platform.',
  },
  filterSectionProps = {
    title: 'Explore Learning Paths',
    pathDescription:
      'Select a learning path by skill level or choose All Levels to browse all available learning paths.',
    connectToWelcome: true,
  },
  resources = learningPaths,
}) => {
  // Single state for active filter shared across components
  const [activeFilter, setActiveFilter] = useState('all')

  // Calculate how many resources match each level (as primary or secondary)
  const totalByLevel = useMemo(() => {
    const counts = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    }

    resources.forEach(path => {
      // Count primary levels
      if (path.primaryLevel?.toLowerCase() === 'beginner') counts.beginner++
      if (path.primaryLevel?.toLowerCase() === 'intermediate')
        counts.intermediate++
      if (path.primaryLevel?.toLowerCase() === 'advanced') counts.advanced++

      // Count secondary levels if they exist
      if (path.secondaryLevel?.toLowerCase() === 'beginner') counts.beginner++
      if (path.secondaryLevel?.toLowerCase() === 'intermediate')
        counts.intermediate++
      if (path.secondaryLevel?.toLowerCase() === 'advanced') counts.advanced++
    })

    return counts
  }, [resources])

  // Filter learning paths based on selected level
  const filteredPaths = useMemo(() => {
    if (activeFilter === 'all') return resources

    return resources.filter(
      path =>
        path.primaryLevel?.toLowerCase() === activeFilter ||
        path.secondaryLevel?.toLowerCase() === activeFilter,
    )
  }, [activeFilter, resources])

  return (
    <>
      <HideChatbot />
      <MainNavigation />

      <MainStylizedHeader
        title={headerTitle}
        logo={() => (
          <img
            src='/img/Resolve-Actions-Light.png'
            alt='Resolve Actions'
            style={{
              height: `${headerLogoHeight}px`,
              maxWidth: '100%',
              objectFit: 'contain',
              filter: 'brightness(1.1)', // Slight enhancement for brand consistency
              transition: 'all 0.3s ease',
              fontFamily: 'var(--ifm-font-family-base)',
            }}
          />
        )}
        logoHeight={headerLogoHeight}
      />

      {/* Welcome Banner - Updated to use solid aqua-800 background */}
      <MainWelcomeBanner
        title={welcomeBannerProps.title}
        buttons={welcomeBannerProps.buttons}
        showDismissButton={welcomeBannerProps.showDismissButton}
        gradient={welcomeBannerProps.gradient}
        borderImage={welcomeBannerProps.borderImage}
      />

      {/* Brand-compliant styling for proper centering and visual consistency */}
      <style>
        {`
        /* Apply brand font family globally to this page */
        body, html {
          font-family: var(--ifm-font-family-base) !important;
        }

        /* Main container - properly centered with brand consistency */
        .resources-container {
          width: 70vw !important;
          max-width: 1400px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          font-family: var(--ifm-font-family-base) !important;
        }

        /* Full width background sections with brand styling */
        .full-width-section {
          width: 100vw !important;
          position: relative !important;
          left: 50% !important;
          right: 50% !important;
          margin-left: -50vw !important;
          margin-right: -50vw !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          font-family: var(--ifm-font-family-base) !important;
        }

        /* Center content within sections with brand spacing */
        .content-wrapper {
          width: 70vw !important;
          max-width: 1400px !important;
          font-family: var(--ifm-font-family-base) !important;
        }

        /* Fix for MainLandingPageCards container with brand enhancements */
        .card-grid-container {
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
          font-family: var(--ifm-font-family-base) !important;
        }

        /* Override for cards grid with brand consistency */
        .enhanced-cards-grid {
          justify-content: center !important;
          font-family: var(--ifm-font-family-base) !important;
        }

        /* Make the welcome and filter visually appear as one unit with brand styling */
        .welcome-filter-container {
          width: 100% !important;
          font-family: var(--ifm-font-family-base) !important;
          position: relative;
        }

        /* Add subtle brand gradient overlay to page background using brand colors */
        .full-width-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 80, 199, 0.01) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        /* Brand-compliant text styling throughout the page */
        .resources-container h1,
        .resources-container h2,
        .resources-container h3,
        .resources-container h4,
        .resources-container h5,
        .resources-container h6 {
          font-family: var(--ifm-font-family-base) !important;
          color: var(--brand-black-700) !important;
        }

        .resources-container p,
        .resources-container span,
        .resources-container div {
          font-family: var(--ifm-font-family-base) !important;
          color: var(--brand-black) !important;
        }

        /* Brand-compliant link styling - Actions uses blue theme */
        .resources-container a {
          color: var(--brand-blue) !important;
          transition: color 0.3s ease !important;
        }

        .resources-container a:hover {
          color: var(--brand-blue-400) !important;
        }

        /* Smooth transitions for better user experience */
        .resources-container * {
          transition: all 0.3s ease-in-out;
        }

        /* Enhanced focus states for accessibility */
        .resources-container *:focus {
          outline: 2px solid var(--brand-blue-400) !important;
          outline-offset: 2px !important;
        }

        /* Brand-compliant scrollbar styling */
        .resources-container ::-webkit-scrollbar {
          width: 8px;
        }

        .resources-container ::-webkit-scrollbar-track {
          background: var(--brand-grey-100);
        }

        .resources-container ::-webkit-scrollbar-thumb {
          background: var(--brand-blue);
          border-radius: 4px;
        }

        .resources-container ::-webkit-scrollbar-thumb:hover {
          background: var(--brand-blue-400);
        }

        /* Actions-specific brand enhancement for logo */
        .actions-logo-container {
          filter: brightness(1.1);
          transition: all 0.3s ease;
          font-family: var(--ifm-font-family-base);
        }

        .actions-logo-container:hover {
          filter: brightness(1.2);
          transform: scale(1.02);
        }
      `}
      </style>

      {/* Welcome and Filter Sections visually connected */}
      <div className='full-width-section'>
        <div className='content-wrapper'>
          <div className='welcome-filter-container'>
            {/* Welcome Section - no bottom border/radius */}
            <MainWelcomeSection
              title={welcomeSectionProps.title}
              content={welcomeSectionProps.content}
            />

            {/* Filter Section - no top border/radius */}
            <MainFilterSection
              title={filterSectionProps.title}
              pathDescription={filterSectionProps.pathDescription}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              totalByLevel={totalByLevel}
              connectToWelcome={filterSectionProps.connectToWelcome}
            />
          </div>
        </div>
      </div>

      {/* Cards rendering section */}
      <div className='full-width-section'>
        <div className='content-wrapper'>
          <div className='card-grid-container'>
            <MainLandingPageCards resources={filteredPaths} />
          </div>
        </div>
      </div>

      {/* Help Section with full-width background */}
      <div className='full-width-section'>
        <div className='content-wrapper'>
          <MainNeedHelp />
        </div>
      </div>
    </>
  )
}

export default LandingPageActions
