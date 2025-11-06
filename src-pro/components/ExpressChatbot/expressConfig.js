// src/components/ExpressChatbot/expressConfig.js
// Configuration for Express product chatbot

export const EXPRESS_CHATBOT_CONFIG = {
  // Product identification
  productName: 'Express',
  productDisplayName: 'Resolve Express',

  // API configuration
  apiBaseUrl: 'https://express-chatbot-api-716168339016.us-central1.run.app',

  // Version handling - Express has complex version patterns
  defaultVersion: 'on-premise-2-5',
  versionDetectionPattern:
    /\/express\/(On-Premise%20[\d.]+|on-premise-[\d-]+)/i,

  // API endpoints (relative to apiBaseUrl)
  endpoints: {
    chat: '/api/v1/chat',
    search: '/api/v1/search',
    status: '/api/v1/status',
    health: '/health',
    upload: '/api/v1/upload-documentation',
  },

  // Visual styling - Purple theme matching the Express card
  gradient: 'linear-gradient(135deg, #2d1b4e 0%, #663399 100%)', // Dark purple to medium purple
  primaryColor: '#2d1b4e',
  secondaryColor: '#663399',
  shadowColor: 'rgba(45, 27, 78, 0.4)',

  // UI customization
  icon: '💬', // Chat bubble icon
  buttonText: 'Express Assistant',
  welcomeMessage:
    "👋 Hi! I'm RANI, your AI assistant for Express documentation. I can help you with automation, workflows, activities, and troubleshooting!",
  placeholderText: 'Ask about Express automation, activities, or setup...',

  // Support and help
  supportUrl:
    'mailto:express-support@company.com?subject=Express Documentation Help',
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
  },

  // Express-specific version mappings
  versionMappings: {
    'On-Premise 2.1': 'on-premise-2-1',
    'On-Premise 2.4': 'on-premise-2-4',
    'On-Premise 2.5': 'on-premise-2-5',
    'on-premise-2-1': 'on-premise-2-1',
    'on-premise-2-4': 'on-premise-2-4',
    'on-premise-2-5': 'on-premise-2-5',
  },

  // Request timeouts and retries
  requestTimeout: 30000,
  maxRetries: 3,
  healthCheckInterval: 30000,
}

export default EXPRESS_CHATBOT_CONFIG
