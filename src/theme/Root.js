import React, { useEffect } from 'react'
import CookieConsent from 'react-cookie-consent'
import { useLocation } from '@docusaurus/router'
import { FirebaseProvider } from '../contexts/FirebaseContext'
import { AuthProvider } from '../contexts/AuthContext'

export default function Root({ children }) {
  let location = useLocation()

  // Check if current path should have header hidden
  // ALWAYS hide on /learning/ paths but NEVER on paths containing /pro/, /express/, /actions/, or /insights/
  const shouldHideHeader =
    location.pathname.startsWith('/learning/') &&
    !location.pathname.includes('/pro/') &&
    !location.pathname.includes('/express/') &&
    !location.pathname.includes('/actions/') &&
    !location.pathname.includes('/insights/')

  // Check if current path requires authentication checks
  const isLearningPath = location.pathname.startsWith('/learning/')

  // Dynamically add/remove style to hide navbar and footer when needed
  useEffect(() => {
    if (shouldHideHeader) {
      const style = document.createElement('style')
      style.id = 'hide-navbar-footer-style'
      style.textContent = `
       .navbar {
         display: none !important;
       }
       .footer {
         display: none !important;
         visibility: hidden !important;
         height: 0 !important;
         overflow: hidden !important;
         padding: 0 !important;
         margin: 0 !important;
         min-height: 0 !important;
       }
     `

      // Only append the style if it doesn't already exist
      if (!document.getElementById('hide-navbar-footer-style')) {
        document.head.appendChild(style)
      }

      return () => {
        // Clean up style on unmount or route change
        const existingStyle = document.getElementById(
          'hide-navbar-footer-style',
        )
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    } else {
      // Explicitly ensure the navbar and footer are shown when shouldHideHeader is false
      const existingStyle = document.getElementById('hide-navbar-footer-style')
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [shouldHideHeader])

  // Disable dark mode for learning paths without using useColorMode hook
  useEffect(() => {
    // Only apply to learning paths using the same shouldHideHeader logic
    if (shouldHideHeader) {
      // Add style to force light mode and hide the theme toggle
      const styleElement = document.createElement('style')
      styleElement.id = 'disable-dark-mode-styles'
      styleElement.textContent = `
       /* Disable dark mode toggle on learning paths */
       .toggle_node_modules-\\@docusaurus-theme-classic-lib-theme-ColorModeToggle-styles-module {
         display: none !important;
       }
       
       /* Force light mode styles for learning paths */
       html[data-theme='dark'] {
         --ifm-background-color: var(--ifm-background-color-light, #ffffff) !important;
         --ifm-background-surface-color: var(--ifm-background-surface-color-light, #f2f6fa) !important;
         --ifm-color-primary: var(--ifm-color-primary-light, #2e8555) !important;
         --ifm-font-color-base: var(--ifm-font-color-base-light, #1c1e21) !important;
         --ifm-heading-color: var(--ifm-heading-color-light, #000000) !important;
         --ifm-navbar-background-color: var(--ifm-navbar-background-color-light, #ffffff) !important;
         --ifm-footer-background-color: var(--ifm-footer-background-color-light, #ffffff) !important;
         --ifm-menu-color: var(--ifm-menu-color-light, #1c1e21) !important;
         --ifm-link-color: var(--ifm-link-color-light, #2e8555) !important;
         --ifm-blockquote-color: var(--ifm-blockquote-color-light, #6a737d) !important;
         --ifm-code-background: var(--ifm-code-background-light, #f6f8fa) !important;
         --ifm-pre-background: var(--ifm-pre-background-light, #f6f8fa) !important;
         --ifm-table-border-color: var(--ifm-table-border-color-light, #dfe2e5) !important;
         --ifm-toc-border-color: var(--ifm-toc-border-color-light, #dfe2e5) !important;
         color-scheme: light !important;
       }
       
       /* Force data-theme attribute to be 'light' for learning paths */
       html[data-theme='dark'] {
         data-theme: light !important;
       }
     `

      // Only append the style if it doesn't already exist
      if (!document.getElementById('disable-dark-mode-styles')) {
        document.head.appendChild(styleElement)
      }

      // Set the data-theme attribute directly for immediate effect
      document.documentElement.setAttribute('data-theme', 'light')

      // Add a small script to intercept any attempts to change the theme
      const scriptElement = document.createElement('script')
      scriptElement.id = 'prevent-dark-mode-script'
      scriptElement.textContent = `
       (function() {
         // Store the original setAttribute function
         const originalSetAttribute = Element.prototype.setAttribute;
         
         // Override setAttribute for the html element only for data-theme attribute
         Element.prototype.setAttribute = function(name, value) {
           // If this is the html element and we're trying to set data-theme to dark
           // on a learning page, force it to be light instead
           if (this === document.documentElement && 
               name === 'data-theme' && 
               value === 'dark' &&
               ${JSON.stringify(shouldHideHeader)}) {
             // Call the original with 'light' instead
             return originalSetAttribute.call(this, name, 'light');
           }
           
           // Otherwise, proceed normally
           return originalSetAttribute.call(this, name, value);
         };
       })();
     `

      // Only append the script if it doesn't already exist
      if (!document.getElementById('prevent-dark-mode-script')) {
        document.head.appendChild(scriptElement)
      }

      return () => {
        // Clean up all elements on unmount or route change
        const styleToRemove = document.getElementById(
          'disable-dark-mode-styles',
        )
        if (styleToRemove) {
          document.head.removeChild(styleToRemove)
        }

        const scriptToRemove = document.getElementById(
          'prevent-dark-mode-script',
        )
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove)
        }

        // Restore the previously saved theme if available
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
          document.documentElement.setAttribute('data-theme', savedTheme)
        }
      }
    } else {
      // Remove all our additions when not on a learning path
      const styleToRemove = document.getElementById('disable-dark-mode-styles')
      if (styleToRemove) {
        document.head.removeChild(styleToRemove)
      }

      const scriptToRemove = document.getElementById('prevent-dark-mode-script')
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove)
      }
    }
  }, [shouldHideHeader])

  return (
    <FirebaseProvider>
      <AuthProvider skipAuthCheck={!isLearningPath}>
        {!shouldHideHeader && (
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
        )}
        {children}
      </AuthProvider>
    </FirebaseProvider>
  )
}
