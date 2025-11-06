// src/components/InsightsChatbot/insightsConfig.js
// Configuration for Insights product chatbot

export const INSIGHTS_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Insights',
  productDisplayName: 'Resolve Insights',

  // API configuration
  apiBaseUrl: 'https://insights-chatbot-api-716168339016.us-central1.run.app',

  // Version handling - Insights has different version patterns
  defaultVersion: '11-0',
  versionDetectionPattern: /\/insights\/([\d.-]+)/i,

  // API endpoints (relative to apiBaseUrl)
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/api/v1/status',
    health: '/health',
    upload: '/api/v1/upload-documentation',
  },

  // Visual styling - Teal theme matching the Insights card
  gradient: 'linear-gradient(135deg, #0f4a4a 0%, #17a2b8 100%)', // Dark teal to teal
  primaryColor: '#0f4a4a',
  secondaryColor: '#17a2b8',
  shadowColor: 'rgba(15, 74, 74, 0.4)',

  // UI customization
  icon: '💬', // Chat bubble icon
  buttonText: 'Insights Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Insights documentation. I can help you with analytics, reports, dependency mapping, and system monitoring!",
  placeholderText: 'Ask about Insights analytics, reports, or monitoring...',

  // Support and help
  supportUrl:
    'mailto:insights-support@company.com?subject=Insights Documentation Help',
  supportText: 'Insights Support',

  // Route detection
  routePatterns: ['/insights'],

  // Feature flags
  features: {
    thinking: true,
    typing: true,
    feedback: true,
    copyChat: true,
    supportTicket: true,
    messageChunking: true,
    sourceLinks: true,
  },

  // Insights-specific version mappings
  versionMappings: {
    9.4: '9-4',
    9.5: '9-5',
    '11.0': '11-0',
    '9-4': '9-4',
    '9-5': '9-5',
    '11-0': '11-0',
  },

  // Request timeouts and retries
  requestTimeout: 30000,
  maxRetries: 3,
  healthCheckInterval: 30000,
}

export default INSIGHTS_CHATBOT_CONFIG
