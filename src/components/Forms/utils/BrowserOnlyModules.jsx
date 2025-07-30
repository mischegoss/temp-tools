import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { UserActivityProvider } from '@site/src/contexts/UserActivityContext'
import EnhancedFeatureCards from '@site/src/components/Forms/utils/EnhancedFeatureCards'
import CompletionTracker from '@site/src/components/Forms/utils/CompletionTracker'
import { useAuth } from '@site/src/contexts/AuthContext'
import WelcomeSection from '@site/src/components/Forms/utils/WelcomeSection'

// Browser-safe module display component
export function ModulesDisplay({ courseModules }) {
  return (
    <BrowserOnly
      fallback={
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--brand-secondary-white)',
            borderRadius: '8px',
            textAlign: 'center',
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            color: 'var(--brand-black)',
            border: '2px solid var(--brand-grey-300)',
            boxShadow:
              '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          Loading modules...
        </div>
      }
    >
      {() => <ModulesDisplayInternal courseModules={courseModules} />}
    </BrowserOnly>
  )
}

// Internal component that uses browser APIs
function ModulesDisplayInternal({ courseModules }) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--brand-secondary-white)',
          borderRadius: '8px',
          textAlign: 'center',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          color: 'var(--brand-black)',
          border: '2px solid var(--brand-orange)',
          boxShadow:
            '0 0 15px rgba(255, 153, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '1.1rem',
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
          }}
        >
          Please log in to view course modules.
        </p>
      </div>
    )
  }

  return (
    <UserActivityProvider totalCards={courseModules.length}>
      <div
        className='modules-display'
        style={{
          width: '100%',
          fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
        }}
      >
        <EnhancedFeatureCards features={courseModules} />
        <CompletionTracker totalCards={courseModules.length} />
      </div>
    </UserActivityProvider>
  )
}

// Browser-safe welcome section component
export function BrowserSafeWelcomeSection({
  accessMessage,
  guestTitle,
  guestMessage,
}) {
  return (
    <BrowserOnly
      fallback={
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--brand-secondary-white)',
            borderRadius: '8px',
            textAlign: 'center',
            fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
            color: 'var(--brand-black)',
            border: '2px solid var(--brand-grey-300)',
            boxShadow:
              '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          Loading welcome information...
        </div>
      }
    >
      {() => (
        <WelcomeSection
          accessMessage={accessMessage}
          guestTitle={guestTitle}
          guestMessage={guestMessage}
        />
      )}
    </BrowserOnly>
  )
}
