// @site/src/components/ActionsVideo/templates/SummaryContent.js

import React from 'react'

/**
 * SummaryContent component - Template-specific content for summary videos
 * Displays only a summary paragraph with header - minimal content focused on overview
 */
const SummaryContent = ({ videoData }) => {
  // Summary section styles
  const summarySection = {
    marginBottom: '48px',
  }

  const summaryTitle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: '32px',
    textAlign: 'center',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const summaryCard = {
    background: '#FFFFFF',
    padding: '48px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    maxWidth: '900px',
    margin: '0 auto',
  }

  const summaryContent = {
    color: '#2D3748',
    fontSize: '1.25rem',
    lineHeight: '1.8',
    margin: 0,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textAlign: 'left',
  }

  return (
    <div style={summarySection}>
      <h2 style={summaryTitle}>Summary</h2>
      <div style={summaryCard}>
        <p style={summaryContent}>
          {videoData.summary ||
            'This video provides an overview of key concepts and insights to help you understand the fundamentals of the topic.'}
        </p>
      </div>
    </div>
  )
}

export default SummaryContent
