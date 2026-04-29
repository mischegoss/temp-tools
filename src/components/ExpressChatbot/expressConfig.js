// src/components/ExpressChatbot/expressConfig.js
// FIXED: Updated versions to match backend (2.5, 2.4, 2.1 - no 2.3 or 2.2)

export const EXPRESS_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Express',
  productDisplayName: 'Resolve Express',

  // API configuration
  apiBaseUrl: 'https://express-chatbot-api-1080349826988.us-central1.run.app',

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

  // Support portal URL
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

  // FIXED: Express-specific version mappings (matching backend config)
  versionMappings: {
    // Dot notation
    'on-premise-2.5': 'on-premise-2-5',
    'on-premise-2.4': 'on-premise-2-4',
    'on-premise-2.1': 'on-premise-2-1',
    // Hyphenated (already normalized)
    'on-premise-2-5': 'on-premise-2-5',
    'on-premise-2-4': 'on-premise-2-4',
    'on-premise-2-1': 'on-premise-2-1',
    // Shorthand
    2.5: 'on-premise-2-5',
    2.4: 'on-premise-2-4',
    2.1: 'on-premise-2-1',
    '2-5': 'on-premise-2-5',
    '2-4': 'on-premise-2-4',
    '2-1': 'on-premise-2-1',
  },

  // FIXED: Available versions for selection (matching backend)
  availableVersions: [
    { value: 'on-premise-2-5', label: 'Express 2.5 (Current)' },
    { value: 'on-premise-2-4', label: 'Express 2.4' },
    { value: 'on-premise-2-1', label: 'Express 2.1' },
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
