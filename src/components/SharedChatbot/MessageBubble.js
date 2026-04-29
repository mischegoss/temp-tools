// src/components/SharedChatbot/MessageBubble.js
// Message bubble component adapted from Actions chatbot for shared use

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks' // ✅ ADDED - for proper line breaks

// Link renderer for external links

const LinkRenderer = ({ href, children }) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      style={{ color: '#17a2b8', textDecoration: 'none', fontWeight: '500' }}
    >
      {children}
    </a>
  )
}

// Utility functions

// ✅ FIXED - Smart URL conversion that respects existing markdown links
const makeUrlsClickable = text => {
  // Skip if text already contains markdown links
  if (/\[.+?\]\(https?:\/\/.+?\)/.test(text)) {
    return text
  }

  // Only convert plain URLs that aren't already in markdown links
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, '[$1]($1)')
}

const extractAndSeparateSources = text => {
  const sourcesSectionRegex =
    /\n\n(?:\*\*Sources?\*\*|## Sources?|### Sources?):?\s*\n([\s\S]*?)(?:\n\n|$)/i
  const match = text.match(sourcesSectionRegex)

  if (match) {
    const mainText = text.replace(sourcesSectionRegex, '').trim()
    const sourcesText = `**Sources:**\n${match[1].trim()}`
    return { mainText, sourcesText, hasSources: true }
  }

  return { mainText: text, sourcesText: '', hasSources: false }
}

// ✅ FIXED - Markdown-aware chunking that respects headers and lists
const chunkMessage = text => {
  const MAX_CHUNK_LENGTH = 800
  if (text.length <= MAX_CHUNK_LENGTH) {
    return { chunks: [text], isChunked: false }
  }

  // Split by paragraphs first to respect markdown structure
  const paragraphs = text.split(/\n\n+/)
  const chunks = []
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    const potentialChunk =
      currentChunk + (currentChunk ? '\n\n' : '') + paragraph

    // Check if adding this paragraph would exceed limit
    if (potentialChunk.length > MAX_CHUNK_LENGTH && currentChunk) {
      // Don't break if current chunk ends with a header (ends with : or #)
      // or if next paragraph starts with a list item (1. or -)
      const endsWithHeader = /[:*#]\s*$/.test(currentChunk.trim())
      const startsWithList = /^(\d+\.|[-*])\s/.test(paragraph.trim())

      if (endsWithHeader || startsWithList) {
        // Keep them together even if it exceeds limit slightly
        currentChunk = potentialChunk
      } else {
        // Safe to chunk here
        chunks.push(currentChunk.trim())
        currentChunk = paragraph
      }
    } else {
      currentChunk = potentialChunk
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim())
  return { chunks, isChunked: chunks.length > 1 }
}

const cleanMalformedContent = text => {
  return text
    .replace(/\n\s*\*\s*$/gm, '')
    .replace(/(\n\s*\*\s*)*$/gm, '')
    .trim()
}

const MessageBubble = ({
  message,
  feedback,
  onFeedback,
  onRetry,
  productConfig,
}) => {
  const [showFullMessage, setShowFullMessage] = useState(false)

  const isBot = message.sender === 'bot'
  const isError = message.isError || false
  const isInitialMessage = message.id === 1

  const styles = {
    message: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
    },
    messageBubble: {
      padding: '14px 18px',
      borderRadius: '18px',
      fontSize: '14px',
      lineHeight: 1.5,
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    botMessage: {
      background: 'white',
      color: '#2e3440',
      borderBottomLeftRadius: '6px',
      marginRight: 'auto',
      maxWidth: '90%',
    },
    userMessage: {
      background:
        productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      borderBottomRightRadius: '6px',
      marginLeft: 'auto',
      maxWidth: '85%',
    },
    errorMessage: {
      background: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
      borderBottomLeftRadius: '6px',
      marginRight: 'auto',
      maxWidth: '90%',
    },
    sourcesSection: {
      marginTop: '16px',
      paddingTop: '12px',
      borderTop: '1px solid #e9ecef',
      fontSize: '13px',
      color: '#6c757d',
    },
    retryButton: {
      background: 'none',
      border: 'none',
      color: '#dc3545',
      fontSize: '10px',
      cursor: 'pointer',
      position: 'absolute',
      bottom: '-18px',
      right: '8px',
      textDecoration: 'underline',
    },
    feedbackSection: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      fontSize: '11px',
      color: '#6c757d',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    feedbackButtons: {
      display: 'flex',
      gap: '8px',
    },
    feedbackButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '4px',
      borderRadius: '4px',
      transition: 'background 0.2s',
    },
    chunkingButtons: {
      textAlign: 'center',
      marginTop: '12px',
    },
    chunkingButton: {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      border: '1px solid #dee2e6',
      color: productConfig?.primaryColor || '#17a2b8',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
  }

  const cssString = `
    .message-bubble p {
      margin: 8px 0 !important;
    }
    
    .message-bubble ul, .message-bubble ol {
      margin: 8px 0 16px 0 !important;
      padding-left: 20px !important;
    }
    
    .message-bubble li {
      margin-bottom: 6px !important;
    }
    
    .message-bubble h1, .message-bubble h2, .message-bubble h3, .message-bubble h4 {
      font-size: 15px !important;
      font-weight: 600 !important;
      color: #2c3e50 !important;
      margin: 16px 0 8px 0 !important;
    }
    
    .message-bubble h1:first-child, 
    .message-bubble h2:first-child, 
    .message-bubble h3:first-child, 
    .message-bubble h4:first-child {
      margin-top: 0 !important;
    }
    
    .message-bubble a {
      color: ${productConfig?.primaryColor || '#17a2b8'} !important;
      text-decoration: none !important;
      font-weight: 500 !important;
    }
    
    .message-bubble a:hover {
      text-decoration: underline !important;
    }
    
    .message-bubble code {
      background: #f8f9fa !important;
      padding: 2px 4px !important;
      border-radius: 3px !important;
      font-size: 13px !important;
    }
    
    .sources-section {
      color: #6c757d !important;
      font-size: 13px !important;
    }
    
    .sources-section strong {
      color: #495057 !important;
    }
    
    .sources-section a {
      color: ${productConfig?.primaryColor || '#17a2b8'} !important;
      font-weight: 500 !important;
    }

    .chunking-button:hover {
      background: ${
        productConfig?.gradient ||
        'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)'
      };
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${
        productConfig?.shadowColor || 'rgba(23, 162, 184, 0.3)'
      };
    }

    .feedback-button:hover {
      background: rgba(108, 117, 125, 0.1);
    }
  `

  // Determine message style
  let messageStyle = { ...styles.messageBubble }
  if (isBot && isError) {
    messageStyle = { ...messageStyle, ...styles.errorMessage }
  } else if (isBot) {
    messageStyle = { ...messageStyle, ...styles.botMessage }
  } else {
    messageStyle = { ...messageStyle, ...styles.userMessage }
  }

  // Process message for bot responses
  const processedMessage = isBot
    ? (() => {
        const cleanedText = cleanMalformedContent(message.text)
        const { mainText, sourcesText, hasSources } =
          extractAndSeparateSources(cleanedText)
        const mainTextWithLinks = makeUrlsClickable(mainText)
        const sourcesWithLinks = hasSources
          ? makeUrlsClickable(sourcesText)
          : ''
        const chunkedContent = chunkMessage(mainTextWithLinks)

        return {
          mainText: mainTextWithLinks,
          sourcesText: sourcesWithLinks,
          hasSources,
          ...chunkedContent,
          displayText: showFullMessage
            ? mainTextWithLinks
            : chunkedContent.chunks[0] || mainTextWithLinks,
        }
      })()
    : { displayText: message.text, isChunked: false, hasSources: false }

  // Render main message content
  const renderMessageContent = () => {
    if (isBot) {
      return (
        <div className='message-bubble'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{ a: LinkRenderer }}
          >
            {processedMessage.displayText}
          </ReactMarkdown>
        </div>
      )
    }
    return <span>{processedMessage.displayText}</span>
  }

  // Render sources section
  const renderSourcesSection = () => {
    if (
      !isBot ||
      !processedMessage.hasSources ||
      !processedMessage.sourcesText
    ) {
      return null
    }

    return (
      <div style={styles.sourcesSection} className='sources-section'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{ a: LinkRenderer }}
        >
          {processedMessage.sourcesText}
        </ReactMarkdown>
      </div>
    )
  }

  // Render continue reading button
  const renderContinueButton = () => {
    if (!isBot || !processedMessage.isChunked) return null

    const needsButton = !showFullMessage && processedMessage.chunks.length > 1

    if (!needsButton) return null

    return (
      <div style={styles.chunkingButtons}>
        <button
          onClick={() => setShowFullMessage(!showFullMessage)}
          style={styles.chunkingButton}
          className='chunking-button'
        >
          {showFullMessage ? 'Show Less' : 'Continue Reading'}
          <span style={{ marginLeft: '4px' }}>
            {showFullMessage ? '↑' : '↓'}
          </span>
        </button>
      </div>
    )
  }

  // Render feedback section
  const renderFeedbackSection = () => {
    if (!isBot || isInitialMessage || isError) return null

    return (
      <div style={styles.feedbackSection}>
        {!feedback ? (
          <>
            <span>Was this helpful?</span>
            <div style={styles.feedbackButtons}>
              <button
                onClick={() => onFeedback?.('positive')}
                style={styles.feedbackButton}
                className='feedback-button'
                title='Helpful'
              >
                👍
              </button>
              <button
                onClick={() => onFeedback?.('negative')}
                style={styles.feedbackButton}
                className='feedback-button'
                title='Not helpful'
              >
                👎
              </button>
            </div>
          </>
        ) : (
          <span>
            Thank you for your feedback! {feedback === 'positive' ? '👍' : '👎'}
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.message}>
        <div style={messageStyle}>
          {renderMessageContent()}
          {renderSourcesSection()}
          {renderContinueButton()}
          {renderFeedbackSection()}
          {isError && onRetry && (
            <button onClick={onRetry} style={styles.retryButton}>
              Retry
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default MessageBubble
