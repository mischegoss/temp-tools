// src/components/Forms/utils/SalesResourceCard.jsx
import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from '@docusaurus/Link';

const SalesResourceCard = ({ resources = [] }) => {
  // Check if resources is valid before rendering
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    return (
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        textAlign: 'center',
        margin: '2rem 0'
      }}>
        <p>No resources to display. Please provide a valid array of resources.</p>
      </div>
    );
  }

  // Copy state for URLs
  const [copiedURLs, setCopiedURLs] = useState({});
  
  // State to track which cards have expanded details
  const [expandedCards, setExpandedCards] = useState({});
  
  // Copy to clipboard function
  const copyToClipboard = (text, resourceId) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show success indicator
        setCopiedURLs(prev => ({
          ...prev,
          [resourceId]: true
        }));
        
        // Reset after 2 seconds
        setTimeout(() => {
          setCopiedURLs(prev => ({
            ...prev,
            [resourceId]: false
          }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  // Toggle expanded details for a specific card
  const toggleCardDetails = (resourceId) => {
    setExpandedCards(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId]
    }));
  };
  
  // Simple icon components using unicode characters
  const CopyIcon = () => <span style={{ fontSize: '16px' }}>📋</span>;
  const CheckIcon = () => <span style={{ fontSize: '16px' }}>✅</span>;

  // Individual card component
  const ResourceCard = ({ resource, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = expandedCards[index] || false;
    
    return (
      <div 
        style={{
          ...styles.card,
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          borderColor: isHovered ? '#0ec0c0' : '#1a2e5c',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isExpanded ? (
          // Summary View with Two Column Layout
          <div style={styles.cardContent}>
            {/* Logo and Title Row - Full Width */}
            <div style={styles.headerRow}>
              <div style={styles.logoSection}>
                <div style={styles.logoBackground}>
                  <img 
                    src="https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj" 
                    alt="Resolve"
                    style={styles.logoImage}
                  />
                </div>
              </div>
              <div style={styles.titleSection}>
                <h3 style={styles.cardTitle}>{resource.title}</h3>
              </div>
            </div>
            
            {/* Two Column Content Layout */}
            <div style={styles.twoColumnRow}>
              {/* Left Column - Description */}
              <div style={styles.leftColumn}>
                <p style={styles.cardDescription}>{resource.description}</p>
              </div>
              
              {/* Right Column - URL */}
              <div style={styles.rightColumn}>
                {/* URL Container */}
                <div style={styles.urlContainer}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={styles.urlLabel}>URL:</span>
                      <span style={styles.urlText}>{resource.publicUrl}</span>
                    </div>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`url-tooltip-${index}`}>
                          {copiedURLs[index] ? 'Copied!' : 'Copy to clipboard'}
                        </Tooltip>
                      }
                    >
                      <Button 
                        variant="light" 
                        size="sm" 
                        style={styles.copyButton}
                        onClick={() => copyToClipboard(resource.publicUrl, index)}
                      >
                        {copiedURLs[index] ? <CheckIcon /> : <CopyIcon />}
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Button Footer - Centered */}
            <div style={styles.buttonFooter}>
              <Button 
                variant="primary"
                style={{
                  ...styles.viewDetailsButton,
                  backgroundColor: '#0ec0c0',
                  borderColor: '#0ec0c0',
                }}
                onClick={() => toggleCardDetails(index)}
              >
                View Details
              </Button>
              <Link to={resource.link}>
                <Button 
                  variant="primary" 
                  style={{
                    ...styles.viewModuleButton,
                    backgroundColor: '#0ec0c0',
                    borderColor: '#0ec0c0',
                  }}
                >
                  {resource.resourceType === 'form' ? 'View Form' : 'View Module'}
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
                    src="https://images.crunchbase.com/image/upload/c_pad,h_160,w_160,f_auto,b_white,q_auto:eco,dpr_2/nlbcou3gjlhfw12ae4aj" 
                    alt="Resolve"
                    style={styles.logoImage}
                  />
                </div>
              </div>
              <div style={styles.titleSection}>
                <h3 style={styles.cardTitle}>{resource.title}</h3>
              </div>
            </div>
            
            {/* Two Column Content in Expanded View */}
            <div style={styles.twoColumnRow}>
              {/* Left Column - Description */}
              <div style={styles.leftColumn}>
                <p style={styles.cardDescription}>{resource.description}</p>
              </div>
              
              {/* Right Column - URL */}
              <div style={styles.rightColumn}>
                {/* URL Container */}
                <div style={styles.urlContainer}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={styles.urlLabel}>URL:</span>
                      <span style={styles.urlText}>{resource.publicUrl}</span>
                    </div>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`url-tooltip-expanded-${index}`}>
                          {copiedURLs[index] ? 'Copied!' : 'Copy to clipboard'}
                        </Tooltip>
                      }
                    >
                      <Button 
                        variant="light" 
                        size="sm" 
                        style={styles.copyButton}
                        onClick={() => copyToClipboard(resource.publicUrl, index)}
                      >
                        {copiedURLs[index] ? <CheckIcon /> : <CopyIcon />}
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Details - Full Width */}
            <div style={styles.expandedDetailsSection}>
              {/* Extended Description */}
              <div style={styles.detailRow}>
                <h5 style={styles.sectionHeader}>Customer-Facing Description</h5>
                <div style={styles.contentBox}>
                  <p>{resource.extendedDescription}</p>
                </div>
              </div>
              
              {/* Usage Instructions */}
              <div style={styles.detailRow}>
                <h5 style={styles.sectionHeader}>How to Use This Module</h5>
                <div style={styles.contentBox}>
                  <p>{resource.usageInstructions}</p>
                </div>
              </div>
            </div>
            
            {/* Button Footer - Centered */}
            <div style={styles.buttonFooter}>
              <Button 
                variant="primary"
                style={{
                  ...styles.viewDetailsButton,
                  backgroundColor: '#0ec0c0',
                  borderColor: '#0ec0c0',
                }}
                onClick={() => toggleCardDetails(index)}
              >
                Close Details
              </Button>
              <Link to={resource.link}>
                <Button 
                  variant="primary" 
                  style={{
                    ...styles.viewModuleButton,
                    backgroundColor: '#0ec0c0',
                    borderColor: '#0ec0c0',
                  }}
                >
                  {resource.resourceType === 'form' ? 'View Form' : 'View Module'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.cardContainer}>
      {resources.map((resource, idx) => (
        <ResourceCard key={idx} resource={resource} index={idx} />
      ))}
    </div>
  );
};

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    margin: '2rem 0',
  },
  card: {
    width: '100%',
    padding: '0',
    borderRadius: '8px',
    border: '1px solid #1a2e5c', // Navy blue border
    backgroundColor: 'var(--ifm-card-background-color)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
  },
  // Card content styles
  cardContent: {
    padding: '1.25rem 1.25rem 0 1.25rem', // Remove bottom padding as the footer now extends to the edge
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
  // Two column layout
  twoColumnRow: {
    display: 'flex',
    flexWrap: 'nowrap', // Prevent wrapping to ensure columns stay side by side
    gap: '1.5rem',
    width: '100%',
    marginBottom: '1.5rem', // Add space before the button footer
  },
  leftColumn: {
    flex: '1 1 60%', // Takes up 60% of the width
    minWidth: '0', // Prevents flex item from overflowing
  },
  rightColumn: {
    flex: '0 0 300px', // Fixed width of 300px, doesn't grow or shrink
    display: 'flex',
    flexDirection: 'column',
  },
  logoBackground: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: '#1a2e5c', // Dark navy blue background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
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
    color: '#1a2e5c', // Dark navy blue from the Resolve branding
  },
  cardDescription: {
    color: '#4a5568',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: '0',
    height: '100%',
  },
  urlContainer: {
    fontSize: '0.85rem',
    backgroundColor: '#f8f9fa',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
  },
  urlLabel: {
    fontWeight: 600,
    marginRight: '0.5rem',
    color: '#1a2e5c',
  },
  urlText: {
    color: '#4a5568',
    wordBreak: 'break-all',
  },
  // New button footer for centered buttons with navy blue background
  buttonFooter: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem', // Increased space between buttons
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    paddingBottom: '1.25rem',
    backgroundColor: '#1a2e5c', // Navy blue background
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    marginLeft: '-1.25rem',
    marginRight: '-1.25rem',
    marginBottom: '-1px', // Prevent gap at the bottom of the card
  },
  viewDetailsButton: {
    padding: '0.8rem 2rem',
    backgroundColor: '#0ec0c0',
    borderColor: '#0ec0c0',
    color: 'white',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    minWidth: '180px',
  },
  viewModuleButton: {
    padding: '0.8rem 2rem',
    backgroundColor: '#0ec0c0',
    borderColor: '#0ec0c0',
    color: 'white',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    minWidth: '180px',
  },
  copyButton: {
    marginLeft: '0.5rem',
    padding: '0.25rem 0.5rem',
  },
  
  // Expanded card styles
  expandedCardContent: {
    padding: '1.25rem 1.25rem 0 1.25rem', // Remove bottom padding as the footer now extends to the edge
  },
  expandedDetailsSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e9ecef',
    marginBottom: '1.5rem', // Add space before the button footer
  },
  detailRow: {
    marginBottom: '1.25rem',
  },
  sectionHeader: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#1a2e5c',
  },
  contentBox: {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    border: '1px solid #e9ecef',
  },
  backButton: {
    padding: '0.8rem 2rem',
    borderRadius: '6px',
    borderColor: '#ffffff',
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  
  // Responsive adjustments
  '@media (max-width: 768px)': {
    twoColumnRow: {
      flexDirection: 'column', // Stack columns vertically on mobile
      flexWrap: 'nowrap',
    },
    leftColumn: {
      flex: '1 1 auto',
      marginBottom: '1rem',
      width: '100%',
    },
    rightColumn: {
      flex: '1 1 auto',
      width: '100%',
    },
    buttonFooter: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem', // Reduced gap for vertical stacking
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
    viewDetailsButton: {
      width: '80%',
    },
    viewModuleButton: {
      width: '80%',
    },
    backButton: {
      width: '80%',
    }
  }
};

export default SalesResourceCard;
