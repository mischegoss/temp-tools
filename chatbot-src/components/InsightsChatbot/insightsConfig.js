// src/components/InsightsChatbot/insightsConfig.js
// FIXED: Updated supportUrl to point to support portal

export const INSIGHTS_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Insights',
  productDisplayName: 'Resolve Insights',

  // API configuration (will be built later)
  apiBaseUrl: 'https://insights-chatbot-api-placeholder.run.app',

  // Version handling - Insights uses hyphenated versions
  defaultVersion: '11-0',
  versionDetectionPattern: /\/insights\/([\d.-]+)/i,

  // API endpoints (relative to apiBaseUrl)
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/status',
    health: '/health',
    warmup: '/warmup',
  },

  // TEAL colors matching screenshot
  gradient: 'linear-gradient(135deg, #1a5c5c 0%, #0f3535 100%)',
  primaryColor: '#1a5c5c',
  secondaryColor: '#0f3535',
  shadowColor: 'rgba(26, 92, 92, 0.4)',

  // UI customization
  icon: '🔍',
  buttonText: 'Insights Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Insights documentation. I can help you with discovery and dependency mapping!",
  placeholderText: 'Ask about Insights',

  // FIXED: Support portal URL (not used anymore but kept for consistency)
  supportUrl: 'https://support.resolve.io/',
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
    versionSelection: true,
  },

  // Insights-specific version mappings
  versionMappings: {
    '11.0': '11-0',
    10.9: '10-9',
    10.8: '10-8',
    '11-0': '11-0',
    '10-9': '10-9',
    '10-8': '10-8',
  },

  // Available versions for selection
  availableVersions: [
    { value: '11-0', label: 'Insights 11.0 (Current)' },
    { value: '10-9', label: 'Insights 10.9' },
    { value: '10-8', label: 'Insights 10.8' },
    { value: 'general', label: 'General (All Versions)' },
  ],

  // Request timeouts and retries
  requestTimeout: 30000,
  maxRetries: 3,
  healthCheckInterval: 30000,

  // Insights-specific API settings
  apiSettings: {
    maxResults: 5,
    similarityThreshold: 0.3,
    maxConversationHistory: 10,
    chunkSize: 800,
  },
}

export default INSIGHTS_CHATBOT_CONFIG
