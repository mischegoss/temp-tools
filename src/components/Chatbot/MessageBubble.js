// src/components/Chatbot/MessageBubble.js
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Custom link renderer for markdown
const LinkRenderer = ({ href, children }) => {
  if (href && href.startsWith('/')) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        style={{ color: '#17a2b8', textDecoration: 'none' }}
        onMouseOver={e => (e.target.style.textDecoration = 'underline')}
        onMouseOut={e => (e.target.style.textDecoration = 'none')}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      style={{ color: '#17a2b8', textDecoration: 'none' }}
      onMouseOver={e => (e.target.style.textDecoration = 'underline')}
      onMouseOut={e => (e.target.style.textDecoration = 'none')}
    >
      {children}
    </a>
  )
}

// Smart chunking function for long responses
const chunkMessage = text => {
  const CHUNK_SIZE = 400 // Characters
  const MIN_CHUNK_SIZE = 200 // Minimum characters to warrant chunking

  if (text.length <= CHUNK_SIZE) {
    return { chunks: [text], isChunked: false }
  }

  // Try to find natural break points
  const breakPoints = ['\n\n', '**', '\n', '. ', '! ', '? ', '; ', ', ']

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

  // If no good break point found, hard break at CHUNK_SIZE
  return {
    chunks: [
      text.substring(0, CHUNK_SIZE).trim(),
      ...chunkMessage(text.substring(CHUNK_SIZE).trim()).chunks,
    ],
    isChunked: true,
  }
}

// Extract sources from message text
const extractSources = text => {
  const sourcePattern =
    /(?:Sources?|References?):\s*((?:https?:\/\/[^\s]+(?:\s*[^\n]*)?(?:\n|$))*)/i
  const match = text.match(sourcePattern)

  if (match) {
    const sourcesText = match[1]
    const urls = sourcesText.match(/https?:\/\/[^\s]+/g) || []
    return {
      hasSources: true,
      sourcesText: match[0],
      urls,
    }
  }

  // Also check for inline links
  const inlineUrls = text.match(/https?:\/\/[^\s]+/g) || []
  return {
    hasSources: inlineUrls.length > 0,
    sourcesText: '',
    urls: inlineUrls,
  }
}

const MessageBubble = ({ message, feedback, onFeedback, onRetry }) => {
  const [showFullMessage, setShowFullMessage] = useState(false)
  const [showSources, setShowSources] = useState(false)

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
    // Smart chunking buttons
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
    sourcesButton: {
      background: '#f8f9fa',
      color: '#495057',
      border: '1px solid #dee2e6',
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
    sourcesSection: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      fontSize: '12px',
    },
    sourcesList: {
      listStyle: 'none',
      padding: 0,
      margin: '8px 0 0 0',
    },
    sourceItem: {
      marginBottom: '4px',
    },
    sourceLink: {
      color: '#17a2b8',
      textDecoration: 'none',
      fontSize: '11px',
      wordBreak: 'break-word',
    },
  }

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
    
    .sources-button:hover {
      background: #e9ecef !important;
      transform: translateY(-1px);
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

  // Process message for chunking and sources (bot messages only)
  const processedMessage = isBot
    ? (() => {
        const sources = extractSources(message.text)
        const textWithoutSources =
          sources.hasSources && sources.sourcesText
            ? message.text.replace(sources.sourcesText, '').trim()
            : message.text

        const chunking = chunkMessage(textWithoutSources)

        return {
          ...chunking,
          ...sources,
          textWithoutSources,
        }
      })()
    : null

  // Render message content with markdown for bot messages
  const renderMessageContent = () => {
    if (isBot && processedMessage) {
      // Determine what content to show
      let contentToShow = processedMessage.textWithoutSources

      if (processedMessage.isChunked && !showFullMessage) {
        contentToShow = processedMessage.chunks[0]
      }

      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: LinkRenderer,
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: '16px',
                  margin: '12px 0 8px 0',
                  fontWeight: '600',
                  color: '#2e3440',
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  fontSize: '15px',
                  margin: '10px 0 6px 0',
                  fontWeight: '600',
                  color: '#2e3440',
                }}
              >
                {children}
              </h3>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: '600', color: '#1a1a1a' }}>
                {children}
              </strong>
            ),
            p: ({ children }) => (
              <p style={{ margin: '8px 0', lineHeight: '1.5' }}>{children}</p>
            ),
          }}
        >
          {contentToShow}
        </ReactMarkdown>
      )
    }

    // User messages as plain text
    return <div style={{ whiteSpace: 'pre-line' }}>{message.text}</div>
  }

  // Render chunking buttons for long bot messages
  const renderChunkingButtons = () => {
    if (!isBot || isError || isInitialMessage || !processedMessage) return null

    const needsChunkingButton = processedMessage.isChunked && !showFullMessage
    const needsSourcesButton = processedMessage.hasSources

    if (!needsChunkingButton && !needsSourcesButton) return null

    return (
      <div style={styles.chunkingButtons}>
        {needsChunkingButton && (
          <button
            onClick={() => setShowFullMessage(true)}
            style={styles.chunkingButton}
            className='chunking-button'
          >
            Would you like to know more?
          </button>
        )}
        {needsSourcesButton && (
          <button
            onClick={() => setShowSources(!showSources)}
            style={styles.sourcesButton}
            className='sources-button'
          >
            {showSources ? 'Hide Sources' : 'Review Sources'}
          </button>
        )}
      </div>
    )
  }

  // Render sources section
  const renderSourcesSection = () => {
    if (!showSources || !processedMessage?.hasSources) return null

    return (
      <div style={styles.sourcesSection}>
        <strong style={{ color: '#495057' }}>Sources:</strong>
        <ul style={styles.sourcesList}>
          {processedMessage.urls.map((url, index) => (
            <li key={index} style={styles.sourceItem}>
              <a
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                style={styles.sourceLink}
                onMouseOver={e => (e.target.style.textDecoration = 'underline')}
                onMouseOut={e => (e.target.style.textDecoration = 'none')}
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Render feedback section for bot messages (except initial greeting)
  const renderFeedbackSection = () => {
    if (!isBot || isInitialMessage || isError) return null

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
          {renderMessageContent()}

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

          {/* Chunking buttons */}
          {renderChunkingButtons()}

          {/* Sources section */}
          {renderSourcesSection()}

          {/* Feedback section */}
          {renderFeedbackSection()}
        </div>
      </div>
    </>
  )
}

export default MessageBubble
