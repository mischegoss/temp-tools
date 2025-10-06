// src/components/Chatbot/MessageBubble.js
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Custom link renderer for markdown - handles all link types
const LinkRenderer = ({ href, children }) => {
  if (!href) return <span>{children}</span>

  const linkStyle = {
    color: '#17a2b8',
    textDecoration: 'none',
    fontWeight: '500',
  }

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      style={linkStyle}
      onMouseOver={e => (e.target.style.textDecoration = 'underline')}
      onMouseOut={e => (e.target.style.textDecoration = 'none')}
    >
      {children}
    </a>
  )
}

// Smart chunking function for long responses
const chunkMessage = text => {
  const CHUNK_SIZE = 600
  const MIN_CHUNK_SIZE = 300

  if (text.length <= CHUNK_SIZE) {
    return { chunks: [text], isChunked: false }
  }

  // Find natural break points
  const breakPoints = ['\n\n', '\n', '. ', '! ', '? ']

  for (const breakPoint of breakPoints) {
    const lastBreak = text.lastIndexOf(breakPoint, CHUNK_SIZE)
    if (lastBreak > MIN_CHUNK_SIZE) {
      const firstChunk = text.substring(0, lastBreak + breakPoint.length).trim()
      const remainingChunks = chunkMessage(
        text.substring(lastBreak + breakPoint.length).trim(),
      )

      return {
        chunks: [firstChunk, ...remainingChunks.chunks],
        isChunked: true,
      }
    }
  }

  // Hard break if no natural break found
  return {
    chunks: [
      text.substring(0, CHUNK_SIZE).trim(),
      ...chunkMessage(text.substring(CHUNK_SIZE).trim()).chunks,
    ],
    isChunked: true,
  }
}

// Extract and separate sources from message text
const extractAndSeparateSources = text => {
  // Match Sources section at the end of the message
  const sourcePattern = /(\n\s*\*\*Sources?:\*\*[\s\S]*?)$/i
  const match = text.match(sourcePattern)

  if (match) {
    const sourcesText = match[1].trim()
    const mainText = text.replace(sourcePattern, '').trim()

    return {
      mainText,
      sourcesText,
      hasSources: true,
    }
  }

  return {
    mainText: text,
    sourcesText: '',
    hasSources: false,
  }
}

// Convert plain URLs to clickable markdown links with readable titles
const makeUrlsClickable = text => {
  // Helper function to extract readable title from URL
  const extractTitleFromUrl = url => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/').filter(part => part)

      if (pathParts.length === 0) return url

      // Get the last meaningful part of the path
      let titlePart = pathParts[pathParts.length - 1]

      // If it's empty or generic, try the second-to-last part
      if (!titlePart || titlePart === 'index' || titlePart === 'home') {
        titlePart = pathParts[pathParts.length - 2] || pathParts[0] || 'Link'
      }

      // Convert to readable format
      return titlePart
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
        .trim()
    } catch (e) {
      // Fallback if URL parsing fails
      return url.split('/').pop()?.replace(/-/g, ' ') || 'Link'
    }
  }

  // Split text and process each part to avoid browser compatibility issues
  const parts = text.split(/(https?:\/\/[^\s\)\]]+)/g)

  return parts
    .map((part, index) => {
      if (part.match(/^https?:\/\//)) {
        // Check if this URL is already in a markdown link by looking at surrounding context
        const beforePart = parts[index - 1] || ''
        const afterPart = parts[index + 1] || ''

        // Skip if already in markdown link format
        if (beforePart.endsWith('](') || afterPart.startsWith(')')) {
          return part
        }

        // Extract readable title and create markdown link
        const title = extractTitleFromUrl(part)
        return `[${title}](${part})`
      }
      return part
    })
    .join('')
}

// Clean malformed content
const cleanMalformedContent = text => {
  return text
    .replace(/\*\*[^*]*\*\*\s*(?:\n\s*\*\s*)*$/gm, '') // Remove incomplete sections
    .trim()
}

const MessageBubble = ({ message, feedback, onFeedback, onRetry }) => {
  const [showFullMessage, setShowFullMessage] = useState(false)

  const isBot = message.sender === 'bot'
  const isError = message.isError || false
  const isInitialMessage = message.id === 1
  const isRetrieving = message.isRetrieving || false

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
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
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
    retrievingMessage: {
      background: '#f8f9fa',
      color: '#6c757d',
      borderBottomLeftRadius: '6px',
      marginRight: 'auto',
      maxWidth: '90%',
      border: '1px solid #e9ecef',
      fontStyle: 'italic',
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
      fontSize: '12px',
    },
    feedbackButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#6c757d',
    },
    feedbackButton: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '4px 6px',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'background 0.2s',
    },
    feedbackThanks: {
      color: '#28a745',
      fontSize: '12px',
      fontStyle: 'italic',
    },
    chunkingButtons: {
      marginTop: '16px',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    chunkingButton: {
      background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '8px 14px',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s ease',
    },
  }

  // Clean CSS for proper markdown rendering
  const cssString = `
    .feedback-button:hover {
      background: rgba(108, 117, 125, 0.1) !important;
    }
    
    .feedback-button-up:hover {
      background: rgba(40, 167, 69, 0.1) !important;
    }
    
    .feedback-button-down:hover {
      background: rgba(220, 53, 69, 0.1) !important;
    }
    
    .chunking-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(23, 162, 184, 0.3);
    }
    
    /* Clean markdown styling */
    .message-bubble p {
      margin: 0 0 12px 0 !important;
    }
    
    .message-bubble p:last-child {
      margin-bottom: 0 !important;
    }
    
    .message-bubble strong {
      font-weight: 600 !important;
      color: #2c3e50 !important;
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
    
    /* Ensure links are visible */
    .message-bubble a {
      color: #17a2b8 !important;
      text-decoration: none !important;
      font-weight: 500 !important;
    }
    
    .message-bubble a:hover {
      text-decoration: underline !important;
    }
    
    /* Code formatting */
    .message-bubble code {
      background: #f8f9fa !important;
      padding: 2px 4px !important;
      border-radius: 3px !important;
      font-size: 13px !important;
    }
    
    /* Sources section styling */
    .sources-section {
      color: #6c757d !important;
      font-size: 13px !important;
    }
    
    .sources-section strong {
      color: #495057 !important;
    }
    
    .sources-section a {
      color: #17a2b8 !important;
      font-weight: 500 !important;
    }
  `

  // Determine message style
  let messageStyle = { ...styles.messageBubble }
  if (isBot && isRetrieving) {
    messageStyle = { ...messageStyle, ...styles.retrievingMessage }
  } else if (isBot && isError) {
    messageStyle = { ...messageStyle, ...styles.errorMessage }
  } else if (isBot) {
    messageStyle = { ...messageStyle, ...styles.botMessage }
  } else {
    messageStyle = { ...messageStyle, ...styles.userMessage }
  }

  // Process message for bot responses
  const processedMessage = isBot
    ? (() => {
        // Clean the message first
        const cleanedText = cleanMalformedContent(message.text)

        // Separate sources from main content
        const { mainText, sourcesText, hasSources } =
          extractAndSeparateSources(cleanedText)

        // Make URLs clickable in both main text and sources
        const mainTextWithLinks = makeUrlsClickable(mainText)
        const sourcesWithLinks = hasSources
          ? makeUrlsClickable(sourcesText)
          : ''

        // Chunk the main content (not the sources)
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
            remarkPlugins={[remarkGfm]}
            components={{
              a: LinkRenderer,
            }}
          >
            {processedMessage.displayText}
          </ReactMarkdown>
        </div>
      )
    }

    return <span>{processedMessage.displayText}</span>
  }

  // Render sources section separately
  const renderSourcesSection = () => {
    if (
      !isBot ||
      !processedMessage.hasSources ||
      !processedMessage.sourcesText ||
      isRetrieving
    ) {
      return null
    }

    return (
      <div style={styles.sourcesSection} className='sources-section'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: LinkRenderer,
          }}
        >
          {processedMessage.sourcesText}
        </ReactMarkdown>
      </div>
    )
  }

  // Render continue reading button
  const renderContinueButton = () => {
    if (!isBot || !processedMessage.isChunked || isRetrieving) return null

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
    if (!isBot || isInitialMessage || isError || isRetrieving) return null

    return (
      <div style={styles.feedbackSection}>
        {!feedback ? (
          <div style={styles.feedbackButtons}>
            <span>Was this helpful?</span>
            <button
              onClick={() => onFeedback('up')}
              style={styles.feedbackButton}
              className='feedback-button feedback-button-up'
              title='This was helpful'
            >
              👍
            </button>
            <button
              onClick={() => onFeedback('down')}
              style={styles.feedbackButton}
              className='feedback-button feedback-button-down'
              title='This was not helpful'
            >
              👎
            </button>
          </div>
        ) : (
          <div style={styles.feedbackThanks}>Thanks for your feedback!</div>
        )}
      </div>
    )
  }

  return (
    <>
      <style>{cssString}</style>
      <div style={styles.message}>
        <div style={messageStyle}>
          {/* Main message content */}
          {renderMessageContent()}

          {/* Continue reading button */}
          {renderContinueButton()}

          {/* Sources section (separate from main content) */}
          {renderSourcesSection()}

          {/* Retry button for failed messages */}
          {message.status === 'failed' && (
            <button
              style={styles.retryButton}
              onClick={onRetry}
              title='Retry message'
            >
              Retry
            </button>
          )}

          {/* Feedback section */}
          {renderFeedbackSection()}
        </div>
      </div>
    </>
  )
}

export default MessageBubble
