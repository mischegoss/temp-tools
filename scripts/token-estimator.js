/**
 * Enhanced token estimation using js-tiktoken for accurate chunking
 * Save this file as: scripts/token-estimator.js
 */

const { encoding_for_model, get_encoding } = require('js-tiktoken')

class TokenEstimator {
  constructor(modelName = 'text-embedding-3-small') {
    try {
      // Use the specific model's encoding if available
      this.encoder = encoding_for_model(modelName)
    } catch (error) {
      // Fallback to cl100k_base which works for most modern models
      console.warn(`Model ${modelName} not found, using cl100k_base encoding`)
      this.encoder = get_encoding('cl100k_base')
    }
  }

  /**
   * Get accurate token count for text
   */
  countTokens(text) {
    if (!text || typeof text !== 'string') return 0

    try {
      const tokens = this.encoder.encode(text)
      return tokens.length
    } catch (error) {
      console.error('Error counting tokens:', error)
      // Fallback to character-based estimation
      return Math.ceil(text.length / 4)
    }
  }

  /**
   * Truncate text to exact token limit
   */
  truncateToTokens(text, maxTokens) {
    if (!text || maxTokens <= 0) return ''

    try {
      const tokens = this.encoder.encode(text)

      if (tokens.length <= maxTokens) {
        return text
      }

      // Truncate tokens and decode back to text
      const truncatedTokens = tokens.slice(0, maxTokens)
      let truncatedText = this.encoder.decode(truncatedTokens)

      // Try to end at a sentence boundary for better chunking
      const lastSentence = truncatedText.lastIndexOf('.')
      const lastParagraph = truncatedText.lastIndexOf('\n\n')

      // If we can find a good break point near the end, use it
      const minAcceptableLength = Math.floor(truncatedText.length * 0.8)

      if (lastSentence > minAcceptableLength) {
        return truncatedText.slice(0, lastSentence + 1)
      } else if (lastParagraph > minAcceptableLength) {
        return truncatedText.slice(0, lastParagraph)
      }

      return truncatedText + '...'
    } catch (error) {
      console.error('Error truncating text:', error)
      // Fallback to character-based truncation
      const maxChars = maxTokens * 4
      return text.length <= maxChars ? text : text.slice(0, maxChars) + '...'
    }
  }

  /**
   * Check if text fits within token limit
   */
  fitsTokenLimit(text, maxTokens) {
    return this.countTokens(text) <= maxTokens
  }

  /**
   * Split text into chunks that respect token limits
   */
  splitIntoChunks(text, maxTokensPerChunk, overlapTokens = 50) {
    const chunks = []

    if (this.countTokens(text) <= maxTokensPerChunk) {
      return [text]
    }

    // Split by paragraphs first
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
    let currentChunk = ''

    for (const paragraph of paragraphs) {
      const paragraphTokens = this.countTokens(paragraph)

      // If single paragraph is too large, split it further
      if (paragraphTokens > maxTokensPerChunk) {
        // Save current chunk if it has content
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim())
        }

        // Split the large paragraph by sentences
        const sentenceChunks = this.splitLargeParagraph(
          paragraph,
          maxTokensPerChunk,
          overlapTokens,
        )
        chunks.push(...sentenceChunks)
        currentChunk = ''
        continue
      }

      const potentialChunk =
        currentChunk + (currentChunk ? '\n\n' : '') + paragraph
      const potentialTokens = this.countTokens(potentialChunk)

      if (potentialTokens <= maxTokensPerChunk) {
        currentChunk = potentialChunk
      } else {
        // Current chunk is full, save it
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim())
        }

        // Start new chunk with current paragraph
        currentChunk = paragraph
      }
    }

    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }

    // Add overlap between chunks if specified
    if (overlapTokens > 0 && chunks.length > 1) {
      return this.addOverlapToChunks(chunks, overlapTokens)
    }

    return chunks
  }

  /**
   * Split a large paragraph by sentences
   */
  splitLargeParagraph(paragraph, maxTokens, overlapTokens) {
    const sentences = paragraph
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0)
    const chunks = []
    let currentChunk = ''

    for (const sentence of sentences) {
      const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence

      if (this.countTokens(potentialChunk) <= maxTokens) {
        currentChunk = potentialChunk
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim())
        }

        // If single sentence is too long, truncate it
        if (this.countTokens(sentence) > maxTokens) {
          currentChunk = this.truncateToTokens(sentence, maxTokens)
        } else {
          currentChunk = sentence
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  /**
   * Add overlap between chunks for better context
   */
  addOverlapToChunks(chunks, overlapTokens) {
    if (chunks.length <= 1 || overlapTokens <= 0) return chunks

    const overlappedChunks = [chunks[0]] // First chunk stays the same

    for (let i = 1; i < chunks.length; i++) {
      const previousChunk = chunks[i - 1]
      const currentChunk = chunks[i]

      // Get overlap from end of previous chunk
      const previousTokens = this.encoder.encode(previousChunk)
      const overlapStart = Math.max(0, previousTokens.length - overlapTokens)
      const overlapTokensSlice = previousTokens.slice(overlapStart)
      const overlapText = this.encoder.decode(overlapTokensSlice)

      // Combine overlap with current chunk
      const combinedChunk = overlapText + '\n\n' + currentChunk
      overlappedChunks.push(combinedChunk)
    }

    return overlappedChunks
  }

  /**
   * Get token usage statistics for a set of texts
   */
  getTokenStats(texts) {
    const tokenCounts = texts.map(text => this.countTokens(text))
    const totalTokens = tokenCounts.reduce((sum, count) => sum + count, 0)

    return {
      totalTexts: texts.length,
      totalTokens,
      averageTokens: Math.round(totalTokens / texts.length),
      minTokens: Math.min(...tokenCounts),
      maxTokens: Math.max(...tokenCounts),
      tokenCounts,
    }
  }

  /**
   * Clean up encoder resources
   */
  cleanup() {
    if (this.encoder && typeof this.encoder.free === 'function') {
      this.encoder.free()
    }
  }
}

module.exports = { TokenEstimator }
