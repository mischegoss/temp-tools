// src/components/ProChatbot/proConfig.js
// Configuration for Pro product chatbot - UPDATED to match Pro-API

export const PRO_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Pro',
  productDisplayName: 'Resolve Pro',

  // API configuration - FIXED to match the provided Pro-API URL
  apiBaseUrl: 'https://pro-chatbot-api-146019630513.us-central1.run.app',

  // Version handling - Pro uses hyphenated versions
  defaultVersion: '8-0',
  versionDetectionPattern: /\/pro\/([\d.-]+)/i,

  // API endpoints (relative to apiBaseUrl) - FIXED to match Pro-API routes
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/status',
    health: '/health',
    warmup: '/warmup',
    upload: '/api/v1/upload-documentation',
    testConnection: '/api/v1/test-connection',
  },

  // Visual styling - Blue-green theme matching the Pro card
  gradient: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)', // Teal gradient
  primaryColor: '#17a2b8',
  secondaryColor: '#20c997',
  shadowColor: 'rgba(23, 162, 184, 0.4)',

  // UI customization
  icon: '💼', // Professional briefcase icon
  buttonText: 'Pro Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Pro documentation. I can help you with workflows, automation, configuration, and troubleshooting!",
  placeholderText: 'Ask about Pro workflows, configuration, or features...',

  // Support and help
  supportUrl: 'mailto:pro-support@company.com?subject=Pro Documentation Help',
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
    versionSelection: true, // Pro-specific: version switching
  },

  // Pro-specific version mappings - URL format to API format
  versionMappings: {
    '8.0': '8-0',
    7.9: '7-9',
    7.8: '7-8',
    7.7: '7-7',
    7.6: '7-6',
    7.5: '7-5',
    // Also handle hyphenated versions
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
