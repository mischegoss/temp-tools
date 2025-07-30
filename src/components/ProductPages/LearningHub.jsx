import React from 'react'
import MainNavigation from '@site/src/components/MainLandingPages/MainNavigation'
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot'
import MainStylizedHeader from '@site/src/components/MainLandingPages/MainStylizedHeader'
import SimpleFeatureCards from '@site/src/components/Forms/utils/SimpleFeatureCards'
import HomeNeedHelp from '@site/src/components/MainLandingPages/HomeNeedHelp'
import HomeWelcome from '@site/src/components/MainLandingPages/HomeWelcome'
import MainWelcomeBanner from '@site/src/components/MainLandingPages/MainWelcomeBanner'
// Import SVG logos directly
import ActionsLogo from '@site/static/img/Resolve-Actions.svg'
import ProLogo from '@site/static/img/Resolve-Actions-Pro-Dark.svg'
import ExpressLogo from '@site/static/img/Resolve-Actions-Express-Dark.svg'
import InsightsLogo from '@site/static/img/Resolve-Insights-Dark.svg'

const LearningHub = () => {
  // Automation Design courses using direct PNG paths for default images
  const designCourses = [
    {
      title: 'Service Blueprinting Essentials',
      description:
        'Learn how to document, assess, and prepare your business processes for automation through service blueprinting techniques.',
      link: '/learning/service-blueprinting',
      logo: '/img/resolve-RGB-transparent.png', // Direct path to PNG
      logoHeight: 60,
      featureType: 'Automation Design',
    },
    {
      title: 'Technical Blueprinting',
      description:
        'Discover the detailed technical requirements of automation and how to implement automated workflows in your organization.',
      link: '#',
      logo: '/img/resolve-RGB-transparent.png', // Direct path to PNG
      logoHeight: 60,
      featureType: 'Automation Design',
      disabled: true,
    },
  ]

  // Automation Development courses using imported SVG components
  const developmentCourses = [
    {
      title: 'Resolve Actions Platform',
      description:
        'Our newest drag-and-drop, no-code IT process automation platform.',
      link: '/learning/actions',
      logo: ActionsLogo,
      logoHeight: 60,
      featureType: 'Automation Development',
    },
    {
      title: 'Resolve Actions Pro',
      description:
        'Tailor-made IT automation with powerful code-based features.',
      link: '/learning/pro',
      logo: ProLogo,
      logoHeight: 60,
      featureType: 'Automation Development',
    },
    {
      title: 'Resolve Actions Express',
      description:
        'Drag-and-drop, no-code IT automation with a large built-in library of automation actions.',
      link: '/learning/express',
      logo: ExpressLogo,
      logoHeight: 60,
      featureType: 'Automation Development',
    },
  ]

  // Device Discovery courses
  const discoveryCourses = [
    {
      title: 'Resolve Insights',
      description: 'Our Discovery and Dependency Mapping (DDM) product.',
      link: '/learning/insights',
      logo: InsightsLogo,
      logoHeight: 60,
      featureType: 'Device Discovery and Management',
    },
  ]

  return (
    <>
      <HideChatbot />
      <MainNavigation />

      {/* Header with the Resolve logo */}
      <MainStylizedHeader
        logo={() => (
          <img
            src='/img/resolve-RGB-inverted-transparent.png'
            alt='Resolve'
            style={{
              height: '60px',
              maxWidth: '100%',
              objectFit: 'contain',
              filter: 'brightness(1.1)',
              transition: 'all 0.3s ease',
            }}
          />
        )}
        logoHeight={60}
      />

      {/* Add the MainWelcomeBanner component - now uses professional dark gradient background */}
      <MainWelcomeBanner
        title='New to Resolve? Start Here.'
        buttons={[
          {
            text: 'Discover Resolve',
            link: '/learning/discover',
            icon: 'chevron-right',
          },
        ]}
        showDismissButton={true}
      />

      {/* Brand-compliant styling for proper centering and visual consistency */}
      <style>
        {`
        /* Apply brand font family globally to this page */
        body, html {
          font-family: 'SeasonMix', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif !important;
        }

        /* Learning Hub container with brand consistency */
        .learning-hub-container {
          max-width: 2500px !important;
          width: 99% !important;
          padding: 0 0.5rem !important;
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
          position: relative;
        }

        /* Professional blue gradient overlay to page background */
        .learning-hub-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        /* Brand-compliant text styling throughout the page */
        .learning-hub-container h1,
        .learning-hub-container h2,
        .learning-hub-container h3,
        .learning-hub-container h4,
        .learning-hub-container h5,
        .learning-hub-container h6 {
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
          color: var(--brand-black-700) !important;
        }

        .learning-hub-container p,
        .learning-hub-container span,
        .learning-hub-container div {
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
          color: var(--brand-black) !important;
        }

        /* Override for button text - ensure it's white */
        .learning-hub-container div[style*="background"][style*="brand-blue"] span,
        .learning-hub-container div[style*="background"][style*="brand-grey"] span {
          color: #FFFFFF !important;
        }

        /* Professional blue link styling */
        .learning-hub-container a {
          color: var(--brand-blue) !important;
          transition: color 0.3s ease !important;
        }

        .learning-hub-container a:hover {
          color: var(--brand-blue-400) !important;
        }

        /* Smooth transitions for better user experience */
        .learning-hub-container * {
          transition: all 0.3s ease-in-out;
        }

        /* Enhanced focus states for accessibility */
        .learning-hub-container *:focus {
          outline: 2px solid var(--brand-blue-400) !important;
          outline-offset: 2px !important;
        }

        /* Professional blue scrollbar styling */
        .learning-hub-container ::-webkit-scrollbar {
          width: 8px;
        }

        .learning-hub-container ::-webkit-scrollbar-track {
          background: var(--brand-grey-100);
        }

        .learning-hub-container ::-webkit-scrollbar-thumb {
          background: var(--brand-blue);
          border-radius: 4px;
        }

        .learning-hub-container ::-webkit-scrollbar-thumb:hover {
          background: var(--brand-blue-400);
        }

        /* Professional blue brand divider styling */
        .brand-divider {
          height: 4px;
          background: linear-gradient(to right, var(--brand-black) 0%, var(--brand-blue) 50%, var(--brand-black) 100%);
          margin: 3rem 0;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 80, 199, 0.2);
        }

        /* Enhanced card containers */
        .learning-landing-cards {
          margin-bottom: 1rem;
        }

        /* Logo enhancement for PNG images */
        .learning-hub-container img[src*=".png"] {
          filter: brightness(1.05);
          transition: all 0.3s ease;
        }

        .learning-hub-container img[src*=".png"]:hover {
          filter: brightness(1.1);
          transform: scale(1.02);
        }
      `}
      </style>

      <div
        className='learning-hub-container'
        style={{
          width: '99%',
          maxWidth: '2500px',
          margin: '0 auto',
          padding: '0 0.5rem',
        }}
      >
        <HomeWelcome />

        <div className='brand-divider'></div>

        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: 'var(--brand-black-700)',
            fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
          }}
        >
          Automation Design
        </h1>

        <div className='learning-landing-cards'>
          <SimpleFeatureCards features={designCourses} />
        </div>

        <div className='brand-divider'></div>

        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: 'var(--brand-black-700)',
            fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
          }}
        >
          Automation Development
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '1.5rem',
            color: 'var(--brand-black)',
            fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
          }}
        >
          Select your product to view our full catalog of available courses and
          learning paths.
        </p>

        <div className='learning-landing-cards'>
          <SimpleFeatureCards features={developmentCourses} />
        </div>

        <div className='brand-divider'></div>

        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: 'var(--brand-black-700)',
            fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
          }}
        >
          Device Discovery and Management
        </h1>

        <div className='learning-landing-cards'>
          <SimpleFeatureCards features={discoveryCourses} />
        </div>

        <div className='brand-divider'></div>

        <HomeNeedHelp />
      </div>
    </>
  )
}

export default LearningHub
