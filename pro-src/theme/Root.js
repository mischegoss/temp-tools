import React from 'react'
import CookieConsent from 'react-cookie-consent'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useLocation } from '@docusaurus/router'

// Import the actual chatbot components
const FixedChatbotWidget = React.lazy(() =>
  import('../components/SharedChatbot/FixedChatbotWidget'),
)

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
        return 'pro'
      case 'express':
        return 'express'
      case 'insights':
        return 'insights'
      case 'express-saas':
        return 'express' // Map express-saas to express
      default:
        return null
    }
  }
  return null
}

// Product configurations (matching the real configs)
const getProductConfig = productType => {
  const configs = {
    pro: {
      apiBaseUrl: 'https://pro-chatbot-api-716168339016.us-central1.run.app',
      productName: 'Pro',
      gradient: 'linear-gradient(135deg, #0f4f3c 0%, #16a085 100%)',
      primaryColor: '#0f4f3c',
      secondaryColor: '#16a085',
      shadowColor: 'rgba(15, 79, 60, 0.4)',
      icon: '💬',
      defaultVersion: '8-0',
      welcomeMessage:
        "Hi! I'm RANI, your AI assistant for Pro documentation. I can help you with workflows, configurations, integrations, and more!",
      placeholderText:
        'Ask about Pro workflows, activities, or configurations...',
      supportEmail: 'pro-support@resolve.io',
    },
    express: {
      apiBaseUrl:
        'https://express-chatbot-api-716168339016.us-central1.run.app',
      productName: 'Express',
      gradient: 'linear-gradient(135deg, #2d1b4e 0%, #663399 100%)',
      primaryColor: '#2d1b4e',
      secondaryColor: '#663399',
      shadowColor: 'rgba(45, 27, 78, 0.4)',
      icon: '💬',
      defaultVersion: 'on-premise-2-5',
      welcomeMessage:
        "Hi! I'm RANI, your AI assistant for Express documentation. I can help you with automation, workflows, activities, and troubleshooting!",
      placeholderText: 'Ask about Express automation, activities, or setup...',
      supportEmail: 'express-support@resolve.io',
    },
    insights: {
      apiBaseUrl:
        'https://insights-chatbot-api-716168339016.us-central1.run.app',
      productName: 'Insights',
      gradient: 'linear-gradient(135deg, #0f4a4a 0%, #17a2b8 100%)',
      primaryColor: '#0f4a4a',
      secondaryColor: '#17a2b8',
      shadowColor: 'rgba(15, 74, 74, 0.4)',
      icon: '💬',
      defaultVersion: '11-0',
      welcomeMessage:
        "Hi! I'm RANI, your AI assistant for Insights documentation. I can help you with analytics, reports, dependency mapping, and system monitoring!",
      placeholderText:
        'Ask about Insights analytics, reports, or monitoring...',
      supportEmail: 'insights-support@resolve.io',
    },
  }
  return configs[productType]
}

// Mock API service for preview (no real API calls)
const createMockApiService = config => ({
  sendMessage: async message => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Return mock response
    return {
      response: `This is the actual ${config.productName} chatbot interface! In the full version, I would search through the ${config.productName} documentation to answer: "${message}"\n\nThe real API endpoint: ${config.apiBaseUrl}\n\nThis uses the real chatbot components with drag-resize functionality - try dragging the header or resizing the edges!`,
      sources: [
        {
          title: `${config.productName} Documentation`,
          url: '#',
          snippet: 'This would be a real documentation snippet...',
        },
      ],
    }
  },

  checkServerStatus: async () => {
    return { status: 'ready', message: 'Mock server ready' }
  },
})

// Real chatbot display component
const RealChatbotDisplay = () => {
  const location = useLocation()
  const [productType, setProductType] = React.useState(null)

  React.useEffect(() => {
    const detected = getProductChatbotType()
    setProductType(detected)

    if (detected) {
      console.log(
        '🎯 Real chatbot detected:',
        detected,
        'for route:',
        location.pathname,
      )
    } else {
      console.log('ℹ️ No chatbot needed for route:', location.pathname)
    }
  }, [location.pathname])

  if (!productType) {
    return null
  }

  const productConfig = getProductConfig(productType)
  if (!productConfig) {
    console.warn('⚠️ No config found for product:', productType)
    return null
  }

  const mockApiService = createMockApiService(productConfig)

  return (
    <React.Suspense fallback={<div style={{ display: 'none' }} />}>
      <FixedChatbotWidget
        productConfig={productConfig}
        apiService={mockApiService}
        onChatStateChange={state => {
          console.log('🔄 Chat state changed:', state)
        }}
      />
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

      {/* Real product chatbots */}
      <RealChatbotWrapper />
    </>
  )
}
