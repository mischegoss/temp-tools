// @site/src/components/ActionsVideo/templates/InstructionalContent.js

import React from 'react'

/**
 * InstructionalContent component - Template-specific content for instructional videos
 * Handles learning objectives, estimated time, and tutorial steps
 */
const InstructionalContent = ({ videoData }) => {
  // Learning section styles - stack vertically
  const learningSection = {
    background: '#FFFFFF',
    padding: '32px',
    borderRadius: '12px',
    marginBottom: '48px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  }

  const learningItem = {
    marginBottom: '32px',
  }

  const learningTitle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: '16px',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const learningContent = {
    color: '#2D3748',
    fontSize: '1.125rem',
    lineHeight: '1.7',
    margin: 0,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  // Tutorial steps styles - matching key concepts layout
  const stepsSection = {
    marginBottom: '48px',
  }

  const stepsSectionTitle = {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: '32px',
    textAlign: 'center',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const stepsContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  }

  const stepCard = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  }

  const stepHeader = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '16px',
  }

  const stepNumber = {
    fontSize: '1.25rem',
    fontWeight: '700',
    flexShrink: 0,
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0066FF',
    borderRadius: '50%',
    color: '#FFFFFF',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const stepContent = {
    flex: 1,
  }

  const stepTitleStyle = {
    fontSize: '1.375rem',
    fontWeight: '600',
    color: '#1A202C',
    margin: '0 0 16px 0',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const stepContentStyle = {
    color: '#2D3748',
    fontSize: '1.125rem',
    lineHeight: '1.7',
    margin: 0,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  return (
    <>
      {/* Learning Objectives & Estimated Time - Stacked */}
      <div style={learningSection}>
        <div style={learningItem}>
          <h3 style={learningTitle}>What You Will Learn</h3>
          <p style={learningContent}>
            {videoData.learningObjectives ||
              'Master the concepts and techniques covered in this video tutorial.'}
          </p>
        </div>

        <div style={learningItem}>
          <h3 style={learningTitle}>Estimated Time</h3>
          <p style={learningContent}>
            {videoData.estimatedTime ||
              'Complete this tutorial at your own pace.'}
          </p>
        </div>
      </div>

      {/* Tutorial Steps - Matching Key Concepts Layout */}
      {videoData.tutorialSteps && videoData.tutorialSteps.length > 0 && (
        <div style={stepsSection}>
          <h2 style={stepsSectionTitle}>Tutorial Steps</h2>
          <div style={stepsContainer}>
            {videoData.tutorialSteps.map((step, index) => (
              <div key={index} style={stepCard}>
                <div style={stepHeader}>
                  <div style={stepNumber}>{step.step}</div>
                  <div style={stepContent}>
                    <h3 style={stepTitleStyle}>{step.title}</h3>
                    <p style={stepContentStyle}>{step.content}</p>
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

export default InstructionalContent
