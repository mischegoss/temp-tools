// src/components/SharedChatbot/ChatbotButton.js
// FIXED: Added modern glass effect to button

import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

const ChatbotButtonComponent = ({
  productConfig,
  onClick,
  size = 'large',
  className = '',
  style = {},
  ...props
}) => {
  const sizeStyles = {
    small: {
      width: '60px',
      height: '60px',
      fontSize: '14px',
      gap: '6px',
    },
    medium: {
      width: '120px',
      height: '48px',
      fontSize: '14px',
      gap: '8px',
    },
    large: {
      width: '240px',
      height: '96px',
      fontSize: '18px',
      gap: '12px',
    },
  }

  // FIXED: Modern glass effect with product colors
  const baseStyles = {
    // Semi-transparent background with product color
    background: `linear-gradient(135deg, 
      ${
        productConfig?.primaryColor
          ? `${productConfig.primaryColor}CC`
          : 'rgba(23, 162, 184, 0.8)'
      }, 
      ${
        productConfig?.secondaryColor
          ? `${productConfig.secondaryColor}CC`
          : 'rgba(32, 201, 151, 0.8)'
      }
    )`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)', // Safari support
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius:
      size === 'large' ? '48px' : size === 'medium' ? '24px' : '30px',
    cursor: 'pointer',
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    fontWeight: '600',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: `
      0 8px 24px ${productConfig?.shadowColor || 'rgba(23, 162, 184, 0.4)'}, 
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    ...sizeStyles[size],
    ...style,
  }

  const renderContent = () => {
    if (size === 'small') {
      return <span>💬</span>
    }

    return (
      <>
        <span style={{ fontSize: size === 'large' ? '24px' : '18px' }}>💬</span>
        <span>RANI</span>
      </>
    )
  }

  const cssString = `
    .chatbot-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 12px 32px ${productConfig?.shadowColor || 'rgba(23, 162, 184, 0.6)'}, 
        0 0 0 1px rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      background: linear-gradient(135deg, 
        ${
          productConfig?.primaryColor
            ? `${productConfig.primaryColor}E6`
            : 'rgba(23, 162, 184, 0.9)'
        }, 
        ${
          productConfig?.secondaryColor
            ? `${productConfig.secondaryColor}E6`
            : 'rgba(32, 201, 151, 0.9)'
        }
      );
    }

    .chatbot-button:active {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 
        0 6px 16px ${productConfig?.shadowColor || 'rgba(23, 162, 184, 0.5)'}, 
        0 0 0 1px rgba(255, 255, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .chatbot-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.05) 50%, 
        rgba(255, 255, 255, 0) 100%
      );
      border-radius: inherit;
      pointer-events: none;
    }
  `

  return (
    <>
      <style>{cssString}</style>
      <button
        onClick={onClick}
        className={`chatbot-button ${className}`}
        style={baseStyles}
        title='Open RANI Assistant'
        aria-label='Open RANI Assistant'
        {...props}
      >
        {renderContent()}
      </button>
    </>
  )
}

export default function ChatbotButton(props) {
  return (
    <BrowserOnly
      fallback={
        <button
          disabled
          className={`chatbot-button ${props.className || ''}`}
          style={{
            background: 'rgba(108, 117, 125, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '48px',
            cursor: 'not-allowed',
            opacity: 0.6,
            width: '240px',
            height: '96px',
            fontSize: '18px',
            gap: '12px',
            fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            ...props.style,
          }}
          title='RANI Assistant loading...'
          aria-label='RANI Assistant loading...'
        >
          💬 <span>RANI</span>
        </button>
      }
    >
      {() => <ChatbotButtonComponent {...props} />}
    </BrowserOnly>
  )
}
