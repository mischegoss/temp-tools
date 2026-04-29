// src/components/SharedChatbot/index.js
// Main export file for shared chatbot components

// Import components first for re-exports
import FixedChatbotWidget from './FixedChatbotWidget'
import useSharedChatbot from './hooks/useSharedChatbot'
import BaseChatbotService from './services/baseChatbotService'

// Core components
export { default as FixedChatbotWidget } from './FixedChatbotWidget'
export { default as ChatWindow } from './ChatWindow'
export { default as ChatHeader } from './ChatHeader'
export { default as MessageList } from './MessageList'
export { default as MessageBubble } from './MessageBubble'
export { default as ChatInput } from './ChatInput'
export { default as ChatbotButton } from './ChatbotButton'

// Services
export { default as BaseChatbotService } from './services/baseChatbotService'

// Hooks
export { default as useSharedChatbot } from './hooks/useSharedChatbot'

// Re-export for convenience with aliases
export {
  FixedChatbotWidget as SharedChatbotWidget,
  useSharedChatbot as useChatbot,
  BaseChatbotService as ChatbotService,
}
