// src/theme/Layout/index.js - REMOVED FEATURE BADGES
import React from 'react'
import Layout from '@theme-original/Layout'
import GlobalChatbotManager from '@site/src/components/Chatbot/GlobalChatbotManager'

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <GlobalChatbotManager />
    </>
  )
}
