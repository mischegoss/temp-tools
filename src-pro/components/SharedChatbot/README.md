# Shared Chatbot Components

This folder contains the shared UI components for all product chatbots (Pro, Express, Insights). These components are copied and adapted from the working Actions chatbot.

## Structure

```
SharedChatbot/
├── index.js                    # Main exports
├── FixedChatbotWidget.js      # Main widget wrapper (fixed bottom-right)
├── ChatWindow.js              # Full chat interface container
├── ChatHeader.js              # Header with product branding
├── MessageList.js             # Message display with animations
├── MessageBubble.js           # Individual message bubbles
├── ChatInput.js               # Input field with send button
├── ChatbotButton.js           # Circular button for closed state
├── services/
│   └── baseChatbotService.js  # Base API service class
└── hooks/
    └── useSharedChatbot.js    # Main chatbot logic hook
```

## Key Differences from Actions Chatbot

### 1. **Fixed Widget vs Modal**

- Actions: Modal overlay triggered by GlobalChatbotManager
- Pro/Express/Insights: Fixed bottom-right widget that opens/closes

### 2. **Product Configuration**

- Each product passes a `productConfig` object with:
  - `productName`: "Pro", "Express", "Insights"
  - `gradient`: Product-specific color gradient
  - `primaryColor`: Main brand color
  - `shadowColor`: Box shadow color
  - `icon`: Product-specific emoji/icon
  - `supportUrl`: Product support link

### 3. **API Service**

- Each product extends `BaseChatbotService` with their own API endpoint
- Products use distinct backend APIs for complete data isolation

## Usage Pattern

```javascript
// Product-specific manager (e.g., ProChatbotManager.js)
import {
  FixedChatbotWidget,
  BaseChatbotService,
  useSharedChatbot,
} from '../SharedChatbot'

const productConfig = {
  productName: 'Pro',
  gradient: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
  primaryColor: '#17a2b8',
  shadowColor: 'rgba(23, 162, 184, 0.4)',
  icon: '💼',
  supportUrl: 'mailto:pro-support@company.com',
}

const apiService = new ProChatbotService() // Extends BaseChatbotService

function ProChatbotManager() {
  return (
    <FixedChatbotWidget productConfig={productConfig} apiService={apiService} />
  )
}
```

## Components Overview

### **FixedChatbotWidget**

- Main wrapper component
- Handles open/close state
- Positions widget in bottom-right corner
- Mobile responsive (full-screen on small devices)

### **ChatbotButton**

- 60px circular button for closed state
- Product-specific colors and icons
- Status indicator (online/offline/loading)
- Hover animations

### **ChatWindow**

- Full chat interface (380px × 600px)
- Contains header, messages, and input
- Scroll management
- Always uses compact mode for fixed widget

### **ChatHeader**

- Product-specific branding
- Clear chat and close buttons
- Message count indicator
- Compact design for fixed widget

### **MessageList & MessageBubble**

- Message display with thinking/typing animations
- Markdown rendering with links
- Message chunking for long responses
- Feedback buttons (thumbs up/down)

### **ChatInput**

- Text input with product-specific styling
- Send button with state indicators
- Support ticket and copy chat buttons
- Status indicator

### **BaseChatbotService**

- HTTP request handling with retries
- Server wake-up for Cloud Run
- Error handling and fallbacks
- Health checks and status monitoring

### **useSharedChatbot**

- Complete chat state management
- Message sending and receiving
- Server status handling
- UI state (thinking, typing, loading)
- Conversation history optimization

## Next Steps (Day 2)

1. Create product-specific managers:

   - `ProChatbotManager.js`
   - `ExpressChatbotManager.js`
   - `InsightsChatbotManager.js`

2. Create product-specific services:

   - `proChatbotService.js`
   - `expressChatbotService.js`
   - `insightsChatbotService.js`

3. Create product-specific configs:

   - `proConfig.js`
   - `expressConfig.js`
   - `insightsConfig.js`

4. Add route detection and integration to Layout

## Design Philosophy

- **Shared UI**: Consistent experience across all products
- **Product Isolation**: Separate APIs and configurations
- **Fixed Positioning**: Always accessible, non-intrusive
- **Mobile Responsive**: Works on all device sizes
- **Proven Architecture**: Based on working Actions chatbot
