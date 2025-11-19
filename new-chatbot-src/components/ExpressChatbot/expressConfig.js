// src/components/ExpressChatbot/expressConfig.js
// FIXED: Updated supportUrl to point to support portal

export const EXPRESS_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Express',
  productDisplayName: 'Resolve Express',

  // API configuration (will be built later)
  apiBaseUrl: 'https://express-chatbot-api-placeholder.run.app',

  // Version handling - Express uses hyphenated versions
  defaultVersion: 'on-premise-2-5',
  versionDetectionPattern: /\/express\/([\w.-]+)/i,

  // API endpoints (relative to apiBaseUrl)
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/status',
    health: '/health',
    warmup: '/warmup',
  },

  // PURPLE colors matching screenshot
  gradient: 'linear-gradient(135deg, #4a1a5c 0%, #2d1035 100%)',
  primaryColor: '#4a1a5c',
  secondaryColor: '#2d1035',
  shadowColor: 'rgba(74, 26, 92, 0.4)',

  // UI customization
  icon: '⚡',
  buttonText: 'Express Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Express documentation. I can help you with no-code automation and built-in actions!",
  placeholderText: 'Ask about Express',

  // FIXED: Support portal URL (not used anymore but kept for consistency)
  supportUrl: 'https://support.resolve.io/',
  supportText: 'Express Support',

  // Route detection
  routePatterns: ['/express'],

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

  // Express-specific version mappings
  versionMappings: {
    'on-premise-2.5': 'on-premise-2-5',
    'on-premise-2.4': 'on-premise-2-4',
    'on-premise-2.3': 'on-premise-2-3',
    'on-premise-2-5': 'on-premise-2-5',
    'on-premise-2-4': 'on-premise-2-4',
    'on-premise-2-3': 'on-premise-2-3',
  },

  // Available versions for selection
  availableVersions: [
    { value: 'on-premise-2-5', label: 'Express 2.5 (Current)' },
    { value: 'on-premise-2-4', label: 'Express 2.4' },
    { value: 'on-premise-2-3', label: 'Express 2.3' },
    { value: 'general', label: 'General (All Versions)' },
  ],

  // Request timeouts and retries
  requestTimeout: 30000,
  maxRetries: 3,
  healthCheckInterval: 30000,

  // Express-specific API settings
  apiSettings: {
    maxResults: 5,
    similarityThreshold: 0.3,
    maxConversationHistory: 10,
    chunkSize: 800,
  },
}

export default EXPRESS_CHATBOT_CONFIG
