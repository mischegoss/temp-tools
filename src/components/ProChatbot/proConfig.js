// src/components/ProChatbot/proConfig.js
// FIXED: Updated supportUrl to point to support portal

export const PRO_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Pro',
  productDisplayName: 'Resolve Pro',

  // API configuration
  apiBaseUrl: 'https://pro-chatbot-api-146019630513.us-central1.run.app',

  // Version handling - Pro uses hyphenated versions
  defaultVersion: '8-0',
  versionDetectionPattern: /\/pro\/([\d.-]+)/i,

  // API endpoints (relative to apiBaseUrl)
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/status',
    health: '/health',
    warmup: '/warmup',
    upload: '/api/v1/upload-documentation',
    testConnection: '/api/v1/test-connection',
  },

  // GREEN colors matching screenshot
  gradient: 'linear-gradient(135deg, #2d5a3d 0%, #1e3a28 100%)',
  primaryColor: '#2d5a3d',
  secondaryColor: '#1e3a28',
  shadowColor: 'rgba(45, 90, 61, 0.4)',

  // UI customization
  icon: '',
  buttonText: 'Pro Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Pro documentation. I can help you with workflows, automation, configuration, and troubleshooting!",
  placeholderText: 'Ask about Pro',

  // FIXED: Support portal URL (not used anymore but kept for consistency)
  supportUrl: 'https://support.resolve.io/',
  supportText: 'Pro Support',

  // Route detection
  routePatterns: ['/pro'],

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

  // Pro-specific version mappings
  versionMappings: {
    '8.0': '8-0',
    7.9: '7-9',
    7.8: '7-8',
    7.7: '7-7',
    7.6: '7-6',
    7.5: '7-5',
    '8-0': '8-0',
    '7-9': '7-9',
    '7-8': '7-8',
    '7-7': '7-7',
    '7-6': '7-6',
    '7-5': '7-5',
  },

  // Available versions for selection
  availableVersions: [
    { value: '8-0', label: 'Pro 8.0 (Current)' },
    { value: '7-9', label: 'Pro 7.9' },
    { value: '7-8', label: 'Pro 7.8' },
    { value: '7-7', label: 'Pro 7.7' },
    { value: '7-6', label: 'Pro 7.6' },
    { value: '7-5', label: 'Pro 7.5' },
    { value: 'general', label: 'General (All Versions)' },
  ],

  // Request timeouts and retries
  requestTimeout: 30000,
  maxRetries: 3,
  healthCheckInterval: 30000,

  // Pro-specific API settings
  apiSettings: {
    maxResults: 5,
    similarityThreshold: 0.3,
    maxConversationHistory: 10,
    chunkSize: 800,
  },
}

export default PRO_CHATBOT_CONFIG
