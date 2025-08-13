import React from 'react'
import CookieConsent from 'react-cookie-consent'

export default function Root({ children }) {
  return (
    <>
      <CookieConsent
        location='top'
        overlay='true'
        buttonText="I don't mind"
        enableDeclineButton
        declineButtonText='Opt me out'
        style={{
          background: '#4b5563',
        }}
        buttonStyle={{
          background: '#16a34a',
          color: 'black',
          fontSize: '13px',
          borderRadius: '2px',
        }}
        declineButtonStyle={{
          background: '#86efac',
          color: 'black',
          fontSize: '13px',
          borderRadius: '2px',
        }}
        setDeclineCookie
      >
        This website uses cookies for analytics purposes.
      </CookieConsent>
      {children}
    </>
  )
}
