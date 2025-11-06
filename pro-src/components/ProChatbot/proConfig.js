// src/components/ProChatbot/proConfig.js
// Configuration for Pro product chatbot with advanced version detection

export const PRO_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Pro',
  productDisplayName: 'Resolve Pro',

  // API configuration
  apiBaseUrl: 'https://pro-chatbot-api-716168339016.us-central1.run.app',

  // Version handling - Pro has specific version patterns
  defaultVersion: '8-0', // Current version appears as /pro/ (no version in URL)
  versionDetectionPattern: /\/pro\/(\d+\.\d+)/i, // Only match explicit versions like /pro/7.9/

  // Available versions for selection - ONLY 3 supported versions
  availableVersions: [
    { value: '7-8', label: '7.8', displayName: 'Pro 7.8' },
    { value: '7-9', label: '7.9', displayName: 'Pro 7.9' },
    { value: '8-0', label: '8.0', displayName: 'Pro 8.0 (Latest)' },
    { value: 'general', label: 'General', displayName: 'General (Pro 8.0)' },
  ],

  // API endpoints (relative to apiBaseUrl)
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/api/v1/status',
    health: '/health',
    upload: '/api/v1/upload-documentation',
  },

  // Visual styling - Green theme matching the Pro card
  gradient: 'linear-gradient(135deg, #0f4f3c 0%, #16a085 100%)', // Dark green to teal
  primaryColor: '#0f4f3c',
  secondaryColor: '#16a085',
  shadowColor: 'rgba(15, 79, 60, 0.4)',

  // UI customization
  icon: '💬', // Chat bubble icon
  buttonText: 'Pro Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Pro documentation. I can help you with workflows, configurations, integrations, and more!",
  placeholderText: 'Ask about Pro workflows, activities, or configurations...',

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
    versionSelection: true, // Enable version selection feature
  },

  // Pro-specific version mappings - ONLY supported versions
  versionMappings: {
    7.8: '7-8',
    7.9: '7-9',
    8.0: '8-0',
    7.8: '7-8',
    7.9: '7-9',
    '8.0': '8-0',
    '7-8': '7-8',
    '7-9': '7-9',
    '8-0': '8-0',
    general: '8-0', // General = current version (8.0) ONLY
    latest: '8-0',
  },

  // Request timeouts and retries
  requestTimeout: 30000,
  maxRetries: 3,
  healthCheckInterval: 30000,
}

export default PRO_CHATBOT_CONFIG
