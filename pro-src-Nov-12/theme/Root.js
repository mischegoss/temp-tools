import React from 'react'
import CookieConsent from 'react-cookie-consent'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useLocation } from '@docusaurus/router'

// Import only the Pro chatbot manager (the only one with working API)
const ProChatbotManager = React.lazy(() =>
  import('../components/ProChatbot/ProChatbotManager').catch(() => ({
    default: () => null, // Graceful fallback if component not found
  })),
)

// TODO: Import these when their APIs are built
// const ExpressChatbotManager = React.lazy(() =>
//   import('../components/ExpressChatbot/ExpressChatbotManager').catch(() => ({
//     default: () => null,
//   })),
// )
// const InsightsChatbotManager = React.lazy(() =>
//   import('../components/InsightsChatbot/InsightsChatbotManager').catch(() => ({
//     default: () => null,
//   })),
// )

// Product detection function
const getProductChatbotType = () => {
  if (typeof window === 'undefined') return null

  const url = window.location.href
    .replace('http://', '')
    .replace('https://', '')
  const segments = url.split('/')

  if (segments.length > 1) {
    switch (segments[1]) {
      case 'pro':
        return 'pro' // ✅ Pro API is ready
      case 'express':
      case 'express-saas':
        return 'express' // 🚧 API will be built later
      case 'insights':
        return 'insights' // 🚧 API will be built later
      default:
        return null
    }
  }
  return null
}

// Chatbot component renderer
const ProductChatbotRenderer = ({ productType }) => {
  switch (productType) {
    case 'pro':
      // ✅ Pro chatbot with working API
      return <ProChatbotManager />

    case 'express':
      // 🚧 Express API not built yet - show placeholder or nothing
      console.log('📝 Express chatbot detected but API not ready yet')
      return null // TODO: Return <ExpressChatbotManager /> when API is ready

    case 'insights':
      // 🚧 Insights API not built yet - show placeholder or nothing
      console.log('📝 Insights chatbot detected but API not ready yet')
      return null // TODO: Return <InsightsChatbotManager /> when API is ready

    default:
      return null
  }
}

// Real chatbot display component
const RealChatbotDisplay = () => {
  const location = useLocation()
  const [productType, setProductType] = React.useState(null)

  React.useEffect(() => {
    const detected = getProductChatbotType()
    setProductType(detected)

    if (detected === 'pro') {
      console.log('🎯 Pro chatbot loaded for route:', location.pathname)
    } else if (detected === 'express') {
      console.log(
        '🚧 Express route detected but chatbot API not ready:',
        location.pathname,
      )
    } else if (detected === 'insights') {
      console.log(
        '🚧 Insights route detected but chatbot API not ready:',
        location.pathname,
      )
    } else {
      console.log('ℹ️ No chatbot needed for route:', location.pathname)
    }
  }, [location.pathname])

  if (!productType) {
    return null
  }

  return (
    <React.Suspense fallback={<div style={{ display: 'none' }} />}>
      <ProductChatbotRenderer productType={productType} />
    </React.Suspense>
  )
}

// Browser-only wrapper
const RealChatbotWrapper = () => {
  return (
    <BrowserOnly fallback={null}>{() => <RealChatbotDisplay />}</BrowserOnly>
  )
}

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

      {/* 
        Product chatbots:
        ✅ Pro: Working with API at https://pro-chatbot-api-146019630513.us-central1.run.app
        🚧 Express: API will be built later
        🚧 Insights: API will be built later
      */}
      <RealChatbotWrapper />
    </>
  )
}
