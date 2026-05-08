// src/utils/simpleChatbot.js

const simpleChatbot = {
  // Click the hidden chatbot button (simplest approach)
  clickOriginalButton() {
    const originalButton = document.querySelector('button.ainiro')
    if (originalButton) {
      originalButton.click()
      console.log('✅ Clicked original chatbot button')
      return true
    } else {
      console.log('❌ Original chatbot button not found')
      return false
    }
  },

  // Fallback: Show the chatbot interface directly
  show() {
    const chatContainer = document.querySelector('div.ainiro')
    if (chatContainer) {
      chatContainer.classList.add('show_ainiro_chatbot')
      console.log('✅ Chatbot shown')
      return true
    } else {
      console.log('❌ Chatbot container not found')
      return false
    }
  },

  // Combined approach: try clicking button first, fallback to direct show
  open() {
    // First try clicking the original button (best approach)
    if (this.clickOriginalButton()) {
      return true
    }

    // Fallback to direct show if button not found
    console.log('🔄 Trying fallback method...')
    return this.show()
  },

  // Hide the chatbot interface
  hide() {
    const chatContainer = document.querySelector('div.ainiro')
    if (chatContainer) {
      chatContainer.classList.remove('show_ainiro_chatbot')
      console.log('✅ Chatbot hidden')
      return true
    }
    return false
  },

  // Check if chatbot is currently visible
  isVisible() {
    const chatContainer = document.querySelector('div.ainiro')
    return (
      chatContainer && chatContainer.classList.contains('show_ainiro_chatbot')
    )
  },
}

export default simpleChatbot
