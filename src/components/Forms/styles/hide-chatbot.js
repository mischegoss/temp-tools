// src/components/Forms/styles/hide-chatbot

import React from 'react';

export const HideChatbot = () => (
  <style>
    {`
      /* Higher specificity selector targeting button */
      html > body > button#ainiro_chat_btn,
      html > body > button.ainiro,
      html > body > div.ainiro {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        cursor: none !important;
        position: absolute !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        -webkit-transform: scale(0) !important;
        transform: scale(0) !important;
        z-index: -9999 !important;
      }

      /* Block all animations */
      html > body > button#ainiro_chat_btn,
      html > body > button.ainiro,
      html > body > div.ainiro,
      html > body > button#ainiro_chat_btn *,
      html > body > button.ainiro *,
      html > body > div.ainiro * {
        animation: none !important;
        transition: none !important;
        -webkit-animation: none !important;
        -moz-animation: none !important;
        -o-animation: none !important;
      }
    `}
  </style>
);

export default HideChatbot;