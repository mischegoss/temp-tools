import React from 'react'
import ProspectNavigation from '@site/src/components/automation-essentials/ProspectNavigation'
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot'
import MainStylizedHeader from '@site/src/components/MainLandingPages/MainStylizedHeader'
import MainLandingPageCards from '@site/src/components/MainLandingPages/MainLandingPageCards'
import NoButtonWelcomeBanner from '@site/src/components/MainLandingPages/NoButtonWelcomeBanner'
import ProspectWelcomeSection from '@site/src/components/MainLandingPages/ProspectWelcome'
import ProspectNeedHelp from '@site/src/components/MainLandingPages/ProspectNeedHelp'
// CONTENT UPDATE POINT 1: Import the learning paths data
// To change available courses, update the data in this file
import { learningPaths } from '@site/src/components/Data/LearningPathsProspects'

//Image directly imported below
// Using require for the image to avoid bundler issues

/**
 * ProspectPage component - Creates a brand-compliant landing page for prospects
 *
 * EDITING GUIDE:
 * This file contains all the text content for the Prospect Page.
 * Look for "CONTENT UPDATE POINT" comments to find each editable section.
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} ProspectPage component
 */
const ProspectPage = ({
  // Props with default values
  // CONTENT UPDATE POINT 2: Page title in the header
  headerTitle = 'PROSPECT PAGE',
  headerLogoHeight = 50,
  // CONTENT UPDATE POINT 3: Welcome banner text - now uses dark gradient background
  welcomeBannerProps = {
    textLines: [
      'Ready to learn the fundamentals of automation?',
      'From design to development, these courses will get you started.',
    ],
    // Uses default dark gradient background
  },
  // CONTENT UPDATE POINT 4: Main welcome section text
  welcomeSectionProps = {
    title: 'Get Started with Automation the Right Way',
    content:
      "Whether you're just exploring automation or already planning your first workflow, this training series will set you up for success. Our beginner-friendly courses are designed to guide you from concept to implementation — no technical background required to get started.",
  },
  // CONTENT UPDATE POINT 5: Course cards content
  // The actual course cards data comes from learningPaths import above
  resources = learningPaths,
}) => {
  return (
    <>
      <HideChatbot />
      <ProspectNavigation />

      {/* Header with the logo 
          CONTENT UPDATE POINT 6: Logo image path */}
      <MainStylizedHeader
        title={headerTitle}
        logo={() => (
          <img
            src='/img/resolve-RGB-inverted-transparent.png'
            alt='Resolve'
            style={{
              height: `${headerLogoHeight}px`,
              maxWidth: '100%',
              objectFit: 'contain',
              filter: 'brightness(1.1)',
              transition: 'all 0.3s ease',
            }}
          />
        )}
        logoHeight={headerLogoHeight}
      />

      {/* Welcome Banner - Uses dark gradient background with narrow styling */}
      <NoButtonWelcomeBanner
        textLines={welcomeBannerProps.textLines}
        showDismissButton={welcomeBannerProps.showDismissButton}
        // Uses default dark gradient background
      />

      {/* Brand-compliant CSS Styling for proper centering and visual consistency */}
      <style>
        {`
        /* Apply brand font family globally to this page */
        body, html {
          font-family: 'SeasonMix', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif !important;
        }

        /* Main container - properly centered with brand consistency */
        .resources-container {
          width: 70vw !important;
          max-width: 1400px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
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
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
        }

        /* Center content within sections with brand spacing */
        .content-wrapper {
          width: 70vw !important;
          max-width: 1400px !important;
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
        }

        /* Fix for MainLandingPageCards container with brand enhancements */
        .card-grid-container {
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
        }

        /* Override for cards grid with brand consistency */
        .enhanced-cards-grid {
          justify-content: center !important;
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
        }

        /* Professional blue gradient overlay to page background */
        .full-width-section::before {
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
        .resources-container h1,
        .resources-container h2,
        .resources-container h3,
        .resources-container h4,
        .resources-container h5,
        .resources-container h6 {
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
          color: var(--brand-black-700) !important;
        }

        .resources-container p,
        .resources-container span,
        .resources-container div {
          font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
          color: var(--brand-black) !important;
        }

        /* Professional blue link styling */
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

        /* Professional blue scrollbar styling */
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

        /* Prospect-specific brand enhancement for logo */
        .prospect-logo-container {
          filter: brightness(1.1);
          transition: all 0.3s ease;
        }

        .prospect-logo-container:hover {
          filter: brightness(1.2);
          transform: scale(1.02);
        }

        /* Ensure banner uses correct font sizing - prevent any overrides */
        .new-courses-section h2 {
          font-size: 1rem !important;
          letter-spacing: 0.3px !important;
        }

        /* Ensure banner container doesn't override sizing */
        .new-courses-section {
          font-size: 1rem !important;
        }
      `}
      </style>

      {/* Welcome Section - Uses welcomeSectionProps values from above */}
      <div className='full-width-section'>
        <div className='content-wrapper'>
          <ProspectWelcomeSection
            title={welcomeSectionProps.title}
            content={welcomeSectionProps.content}
          />
        </div>
      </div>

      {/* Cards rendering section - Content comes from learningPaths import */}
      <div className='full-width-section'>
        <div className='content-wrapper'>
          <div className='card-grid-container'>
            <MainLandingPageCards resources={resources} />
          </div>
        </div>
      </div>

      {/* Help Section - The text for this section is in the ProspectNeedHelp component 
          CONTENT UPDATE POINT 7: To modify the help section text, update the ProspectNeedHelp component */}
      <div className='full-width-section'>
        <div className='content-wrapper'>
          <ProspectNeedHelp />
        </div>
      </div>
    </>
  )
}

/**
 * CONTENT UPDATE GUIDE:
 *
 * 1. Page Header Text: Look for headerTitle = "PROSPECT PAGE"
 * 2. Welcome Banner: Look for welcomeBannerProps
 *    - Banner text: textLines property
 *    - Now uses dark gradient background by default
 * 3. Main Welcome Section: Look for welcomeSectionProps
 *    - Main title: title property
 *    - Description text: content property
 * 4. Course Cards: Import from learningPaths in LearningPathsProspects.js
 *    - To modify course cards, update the LearningPathsProspects.js file
 * 5. Help Section: The text is in the ProspectNeedHelp component
 *    - Update ProspectNeedHelp.js to change this content
 */

export default ProspectPage
