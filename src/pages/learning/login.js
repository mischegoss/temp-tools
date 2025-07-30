// Enhanced version with error boundary
// File: src/pages/learning/login.js

import React from 'react'
import Layout from '@theme/Layout'
import { AuthProvider } from '@site/src/contexts/AuthContext'
import { FirebaseProvider } from '@site/src/contexts/FirebaseContext'
import LoginComponent from '@site/src/components/service-blueprinting/login/LoginComponent'
import BrowserOnly from '@docusaurus/BrowserOnly'
import ErrorBoundary from '@docusaurus/ErrorBoundary'

export default function LoginPage() {
  return (
    <Layout
      title='Login'
      description='Login to access Resolve learning content'
    >
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => (
          <ErrorBoundary
            fallback={({ error, tryAgain }) => (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                }}
              >
                <h2>Something went wrong</h2>
                <p>There was an error loading the login page.</p>
                <button onClick={tryAgain}>Try again</button>
                <details style={{ marginTop: '1rem' }}>
                  <summary>Error details</summary>
                  <pre>{error.message}</pre>
                </details>
              </div>
            )}
          >
            <FirebaseProvider>
              <AuthProvider skipAuthCheck={false}>
                <LoginComponent />
              </AuthProvider>
            </FirebaseProvider>
          </ErrorBoundary>
        )}
      </BrowserOnly>
    </Layout>
  )
}
