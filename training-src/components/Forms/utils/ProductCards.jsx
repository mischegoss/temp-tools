// src/components/Forms/utils/ProductCards.jsx
import React, { useState } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Link from '@docusaurus/Link'

const ProductCards = ({ resources = [] }) => {
  // Check if resources is valid before rendering
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--brand-secondary-white)',
          borderRadius: '8px',
          textAlign: 'center',
          margin: '2rem 0',
          border: '2px solid var(--brand-grey-300)',
          boxShadow:
            '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
      >
        <p
          style={{
            margin: 0,
            color: 'var(--brand-black)',
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          }}
        >
          No resources to display. Please provide a valid array of resources.
        </p>
      </div>
    )
  }

  // State to track which cards have expanded details
  const [expandedCards, setExpandedCards] = useState({})

  // Toggle expanded details for a specific card
  const toggleCardDetails = resourceId => {
    setExpandedCards(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }))
  }

  // Simple icon components using unicode characters
  const CopyIcon = () => <span style={{ fontSize: '16px' }}>📋</span>
  const CheckIcon = () => <span style={{ fontSize: '16px' }}>✅</span>

  // Individual card component
  const ResourceCard = ({ resource, index }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isExpanded = expandedCards[index] || false

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    return (
      <div
        style={{
          ...styles.card,
          transform: isHovered ? 'translateY(-5px)' : 'none',
          boxShadow: isHovered
            ? '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
            : '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          borderColor: isHovered
            ? 'var(--brand-blue-400)'
            : 'var(--brand-blue-400)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!isExpanded ? (
          // Summary View with Single Column Layout
          <div style={styles.cardContent}>
            {/* Logo and Title Row - Full Width */}
            <div style={styles.headerRow}>
              <div style={styles.logoSection}>
                <div style={styles.logoBackground}>
                  <img
                    src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
                    alt='Resolve'
                    style={styles.logoImage}
                  />
                </div>
              </div>
              <div style={styles.titleSection}>
                <h3 style={styles.cardTitle}>{resource.title}</h3>
              </div>
            </div>

            {/* Single Column Content Layout */}
            <div style={styles.fullWidthRow}>
              <p style={styles.cardDescription}>{resource.description}</p>
            </div>

            {/* Button Footer - Centered */}
            <div style={styles.buttonFooter}>
              <Button
                variant='primary'
                style={styles.viewDetailsButton}
                onClick={() => toggleCardDetails(index)}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow =
                    '0 0 20px rgba(0, 212, 255, 0.3), 0 8px 24px rgba(0, 212, 255, 0.2)'
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow =
                    '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                View Details
              </Button>
              <Link to={resource.link}>
                <Button
                  variant='primary'
                  style={styles.viewModuleButton}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow =
                      '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow =
                      '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {resource.resourceType === 'catalog'
                    ? 'View Catalog'
                    : 'View Module'}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Expanded Details View
          <div style={styles.expandedCardContent}>
            {/* Header with Logo and Title */}
            <div style={styles.headerRow}>
              <div style={styles.logoSection}>
                <div style={styles.logoBackground}>
                  <img
                    src='https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj'
                    alt='Resolve'
                    style={styles.logoImage}
                  />
                </div>
              </div>
              <div style={styles.titleSection}>
                <h3 style={styles.cardTitle}>{resource.title}</h3>
              </div>
            </div>

            {/* Single Column Content in Expanded View */}
            <div style={styles.fullWidthRow}>
              <p style={styles.cardDescription}>{resource.description}</p>
            </div>

            {/* Additional Details - Full Width */}
            <div style={styles.expandedDetailsSection}>
              {/* Extended Description */}
              <div style={styles.detailRow}>
                <h5 style={styles.sectionHeader}>Course Description</h5>
                <div style={styles.contentBox}>
                  <p style={styles.contentText}>
                    {resource.extendedDescription}
                  </p>
                </div>
              </div>

              {/* Course List */}
              <div style={styles.detailRow}>
                <h5 style={styles.sectionHeader}>Available Courses</h5>
                <div style={styles.contentBox}>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.5rem',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      color: 'var(--brand-black)',
                    }}
                  >
                    {resource.courses &&
                      resource.courses.map((course, i) => (
                        <li key={i}>{course}</li>
                      ))}
                  </ul>
                  <p
                    style={{
                      marginTop: '0.75rem',
                      ...styles.contentText,
                    }}
                  >
                    {resource.usageInstructions}
                  </p>
                </div>
              </div>
            </div>

            {/* Button Footer - Centered */}
            <div style={styles.buttonFooter}>
              <Button
                variant='primary'
                style={styles.viewDetailsButton}
                onClick={() => toggleCardDetails(index)}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow =
                    '0 0 20px rgba(0, 212, 255, 0.3), 0 8px 24px rgba(0, 212, 255, 0.2)'
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow =
                    '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                Close Details
              </Button>
              <Link to={resource.link}>
                <Button
                  variant='primary'
                  style={styles.viewModuleButton}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow =
                      '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow =
                      '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {resource.resourceType === 'catalog'
                    ? 'View Catalog'
                    : 'View Module'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={styles.cardContainer}>
      {resources.map((resource, idx) => (
        <ResourceCard key={idx} resource={resource} index={idx} />
      ))}
    </div>
  )
}

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    margin: '2rem 0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  card: {
    width: '100%',
    padding: '0',
    borderRadius: '8px',
    border: '2px solid var(--brand-blue-400)',
    backgroundColor: 'var(--brand-white)',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
  },
  // Card content styles
  cardContent: {
    padding: '1.25rem 1.25rem 0 1.25rem',
    display: 'flex',
    flexDirection: 'column',
  },
  // Header row with logo and title
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.25rem',
    width: '100%',
  },
  logoSection: {
    marginRight: '1rem',
  },
  titleSection: {
    flex: 1,
  },
  // Full width row for description
  fullWidthRow: {
    width: '100%',
    marginBottom: '1.5rem',
  },
  logoBackground: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(0, 80, 199, 0.2)',
  },
  logoImage: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: '0',
    color: 'var(--brand-black)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  cardDescription: {
    color: 'var(--brand-black-700)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: '0',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  // Button footer for centered buttons with brand gradient background
  buttonFooter: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    paddingBottom: '1.25rem',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    marginLeft: '-1.25rem',
    marginRight: '-1.25rem',
    marginBottom: '-1px',
  },
  viewDetailsButton: {
    padding: '0.8rem 2rem',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
    border: '2px solid var(--brand-aqua)',
    color: 'var(--brand-white)',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
    minWidth: '180px',
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  viewModuleButton: {
    padding: '0.8rem 2rem',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    border: '2px solid var(--brand-blue-400)',
    color: 'var(--brand-white)',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
    minWidth: '180px',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },

  // Expanded card styles
  expandedCardContent: {
    padding: '1.25rem 1.25rem 0 1.25rem',
  },
  expandedDetailsSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid var(--brand-grey-200)',
    marginBottom: '1.5rem',
  },
  detailRow: {
    marginBottom: '1.25rem',
  },
  sectionHeader: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'var(--brand-black)',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
  },
  contentBox: {
    backgroundColor: 'var(--brand-secondary-white)',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    border: '2px solid var(--brand-grey-200)',
    boxShadow: '0 0 10px rgba(0, 102, 255, 0.05)',
  },
  contentText: {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    color: 'var(--brand-black)',
    margin: 0,
  },

  // Responsive adjustments
  '@media (max-width: 768px)': {
    buttonFooter: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
    viewDetailsButton: {
      width: '80%',
    },
    viewModuleButton: {
      width: '80%',
    },
  },
}

export default ProductCards
