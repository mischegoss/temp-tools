// src/components/Forms/utils/DomainVerification.jsx
import React from 'react'
import { useAuth } from '@site/src/contexts/AuthContext'

const DomainVerification = ({
  allowedDomains = ['resolve.io'],
  children,
  fallbackMessage = "Access denied. You don't have permission to view this content.",
}) => {
  const { user } = useAuth()

  // Brand-compliant styling for message containers
  const messageContainerStyle = {
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    fontSize: '1.1rem',
    lineHeight: '1.6',
  }

  const loginPromptStyle = {
    ...messageContainerStyle,
    backgroundColor: 'var(--brand-secondary-white)',
    border: '2px solid var(--brand-blue-400)',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    color: 'var(--brand-black)',
  }

  const accessDeniedStyle = {
    ...messageContainerStyle,
    backgroundColor: 'var(--brand-secondary-white)',
    border: '2px solid var(--brand-orange)',
    boxShadow: '0 0 15px rgba(255, 153, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    color: 'var(--brand-black)',
  }

  if (!user) {
    return (
      <div style={loginPromptStyle}>
        <p
          style={{
            margin: 0,
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          }}
        >
          Please log in to view this content.
        </p>
      </div>
    )
  }

  const userDomain = user.email.split('@')[1]
  const hasAccess = allowedDomains.includes(userDomain)

  if (!hasAccess) {
    return (
      <div style={accessDeniedStyle}>
        <p
          style={{
            margin: 0,
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          }}
        >
          {fallbackMessage}
        </p>
      </div>
    )
  }

  return children
}

export default DomainVerification
