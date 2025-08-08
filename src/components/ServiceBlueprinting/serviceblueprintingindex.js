// ServiceBlueprinting Main Component
// Location: /src/components/ServiceBlueprinting/serviceblueprintingindex.js

import React from 'react'
import Link from '@docusaurus/Link'
// Import the service blueprinting learning paths data
import { learningPaths } from './data/LearningPathsServiceBlueprinting.js'

// Import ServiceBlueprinting-styled components and styles
import ServiceBlueprintingCards from './serviceblueprintingcards'
import {
  learningHubSectionStyle,
  containerStyle,
  headerStyle,
  sectionTitleStyle,
  subtitleStyle,
  accentLineStyle,
  helpSectionStyle,
  helpTitleStyle,
  helpDescriptionStyle,
  helpLinkStyle,
  categoryTitleStyle,
  cardsContainerStyle,
} from './styles/serviceblueprintingstyles.js'

/**
 * ServiceBlueprintingPage component - Creates a brand-compliant landing page for Service Blueprinting
 * Using LearningHub design system with headers at specific positions
 */
const ServiceBlueprintingPage = ({
  // Props with default values
  headerTitle = 'SERVICE BLUEPRINTING',
  headerLogoHeight = 50,
  // Welcome banner text - uses dark gradient background
  welcomeBannerProps = {
    textLines: [
      'Master the art of automation design.',
      'Learn to blueprint effective automation solutions from concept to implementation.',
    ],
  },
  // Main welcome section text
  welcomeSectionProps = {
    title: 'Service Blueprinting Essentials',
    content:
      "Transform your understanding of automation design with our comprehensive Service Blueprinting course. Whether you're new to automation or looking to formalize your approach, this learning path will equip you with the skills to design effective, scalable automation solutions that deliver real business value.",
  },
  // Course cards content - filtered to only Service Blueprinting courses
  resources = learningPaths,
  // Help section content
  helpSectionProps = {
    title: 'Need Help Getting Started?',
    description:
      'Have questions about which course is right for you? Our team is here to help you choose the perfect learning path.',
    email: 'training@resolve.io',
    additionalText: "and we'll get back to you within 24 hours.",
  },
}) => {
  return (
    <>
      {/* Welcome Section - LearningHub Style */}
      <section style={learningHubSectionStyle} className='learning-hub-section'>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={sectionTitleStyle}>{welcomeSectionProps.title}</h1>
            <p style={subtitleStyle}>{welcomeSectionProps.content}</p>
            <div style={accentLineStyle}></div>
          </div>

          {/* Cards with Headers at specific positions */}
          <div style={cardsContainerStyle}>
            {resources.map((resource, index) => (
              <div key={index} style={{ marginBottom: '50px' }}>
                {/* Service Blueprinting Header above first card */}
                {index === 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h2 style={categoryTitleStyle}>Learning Paths</h2>
                  </div>
                )}
                <ServiceBlueprintingCards
                  resources={[resource]}
                  hideSection={true}
                />
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div style={helpSectionStyle}>
            <h2 style={helpTitleStyle}>{helpSectionProps.title}</h2>
            <p style={helpDescriptionStyle}>
              {helpSectionProps.description}{' '}
              <Link
                to={`mailto:${helpSectionProps.email}`}
                style={helpLinkStyle}
              >
                {helpSectionProps.email}
              </Link>{' '}
              {helpSectionProps.additionalText}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * CONTENT UPDATE GUIDE:
 *
 * 1. Page Header Text: Look for headerTitle = "SERVICE BLUEPRINTING"
 * 2. Learning Hub Data: Import from learningPaths in LearningPathsServiceBlueprinting.js
 *    - Main title: welcomeSectionProps.title
 *    - Subtitle: welcomeSectionProps.content
 * 3. Course Cards: To modify course cards, update the LearningPathsServiceBlueprinting.js file
 * 4. Help Section: helpSectionProps
 *    - Title: title property
 *    - Description: description property
 *    - Email: email property
 *    - Additional text: additionalText property
 */

export default ServiceBlueprintingPage
