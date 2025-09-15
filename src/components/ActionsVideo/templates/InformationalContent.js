// @site/src/components/ActionsVideo/templates/InformationalContent.js

import React from 'react'

/**
 * InformationalContent component - Template-specific content for informational videos
 * Displays key concepts as a vertical list - one card per line
 */
const InformationalContent = ({ videoData }) => {
  // Key concepts section styles
  const conceptsSection = {
    marginBottom: '48px',
  }

  const sectionTitle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: '32px',
    textAlign: 'center',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const conceptsContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  }

  const conceptCard = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  }

  const conceptHeader = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '16px',
  }

  const conceptIcon = {
    fontSize: '2.5rem',
    flexShrink: 0,
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0066FF',
    borderRadius: '50%',
    color: '#FFFFFF',
  }

  const conceptContent = {
    flex: 1,
  }

  const conceptTitle = {
    fontSize: '1.375rem',
    fontWeight: '600',
    color: '#1A202C',
    margin: '0 0 16px 0',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const conceptDescription = {
    color: '#2D3748',
    fontSize: '1.125rem',
    lineHeight: '1.7',
    margin: 0,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  return (
    <>
      {/* Key Concepts Section */}
      {videoData.keyConcepts && videoData.keyConcepts.length > 0 && (
        <div style={conceptsSection}>
          <h2 style={sectionTitle}>Key Concepts</h2>
          <div style={conceptsContainer}>
            {videoData.keyConcepts.map((concept, index) => (
              <div key={index} style={conceptCard}>
                <div style={conceptHeader}>
                  <div style={conceptIcon}>{concept.icon || '💡'}</div>
                  <div style={conceptContent}>
                    <h3 style={conceptTitle}>{concept.title}</h3>
                    <p style={conceptDescription}>
                      {typeof concept.content === 'string'
                        ? concept.content
                        : concept.description || ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default InformationalContent
