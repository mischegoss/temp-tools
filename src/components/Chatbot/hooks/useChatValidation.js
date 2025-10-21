// src/components/Chatbot/hooks/useChatValidation.js
import { useCallback, useRef, useEffect } from 'react'

const useChatValidation = pageContext => {
  const conversationStateRef = useRef({
    lastBotQuestionTimestamp: null,
    lastBotQuestionType: null,
    expectingYesNoResponse: false,
  })

  // Track conversation state for context-aware validation
  const updateConversationState = useCallback(botMessage => {
    if (!botMessage) return

    const message = botMessage.toLowerCase()

    // Check if bot asked a yes/no question
    const isYesNoQuestion =
      message.includes('would you like') ||
      message.includes('do you want') ||
      message.includes('should i') ||
      message.includes('are you') ||
      message.includes('is this') ||
      message.includes('correct?') ||
      message.includes('right?') ||
      message.includes('okay?') ||
      message.includes('(yes/no)')

    conversationStateRef.current = {
      lastBotQuestionTimestamp: isYesNoQuestion
        ? Date.now()
        : conversationStateRef.current.lastBotQuestionTimestamp,
      lastBotQuestionType: isYesNoQuestion ? 'yes_no' : null,
      expectingYesNoResponse: isYesNoQuestion,
    }
  }, [])

  // Check if yes/no response is contextually appropriate
  const isYesNoResponseAppropriate = useCallback(() => {
    const state = conversationStateRef.current
    if (!state.expectingYesNoResponse) return false

    // Allow yes/no responses for 2 minutes after bot asks a yes/no question
    const timeSinceQuestion = Date.now() - (state.lastBotQuestionTimestamp || 0)
    return timeSinceQuestion < 120000 // 2 minutes
  }, [])

  // Detect greeting patterns
  const isGreeting = useCallback(input => {
    const trimmed = input.trim().toLowerCase()

    const greetingPatterns = [
      // Single word greetings
      /^(hi|hello|hey|yo|sup|hiya)$/,
      // Basic greetings with punctuation
      /^(hi|hello|hey|yo|sup|hiya)[!.]*$/,
      // Time-based greetings
      /^good\s+(morning|afternoon|evening|night)$/,
      // Casual greetings
      /^(what's\s+up|whats\s+up|how's\s+it\s+going|hows\s+it\s+going|how\s+are\s+you)$/,
      // With question marks
      /^(what's\s+up|whats\s+up|how's\s+it\s+going|hows\s+it\s+going|how\s+are\s+you)\?$/,
    ]

    return greetingPatterns.some(pattern => pattern.test(trimmed))
  }, [])

  // Detect yes/no responses
  const isYesNoResponse = useCallback(input => {
    const trimmed = input.trim().toLowerCase()

    const yesNoPatterns = [
      // Direct yes/no
      /^(yes|no|yeah|yep|nope|nah|sure|okay|ok|alright|maybe)$/,
      // With punctuation
      /^(yes|no|yeah|yep|nope|nah|sure|okay|ok|alright|maybe)[!.]*$/,
      // Polite versions
      /^(yes\s+please|no\s+thanks|yes\s+thank\s+you|no\s+thank\s+you)$/,
      // Casual variations
      /^(yup|nah|uh\s+huh|uh\s+oh|i\s+think\s+so|not\s+really)$/,
    ]

    return yesNoPatterns.some(pattern => pattern.test(trimmed))
  }, [])

  // Detect termination intent
  const isTerminationIntent = useCallback(input => {
    const trimmed = input.trim().toLowerCase()

    const terminationPatterns = [
      // Direct commands
      /^(stop|end|quit|exit|done|finished|close|cancel)$/,
      // Polite endings
      /^(that's\s+all|thats\s+all|no\s+more\s+questions|i'm\s+good|im\s+good|thanks\s+bye|thank\s+you\s+bye)$/,
      // Dismissive
      /^(never\s+mind|nevermind|forget\s+it|cancel\s+that)$/,
      // With punctuation
      /^(stop|end|quit|exit|done|finished|close|cancel)[!.]*$/,
    ]

    return terminationPatterns.some(pattern => pattern.test(trimmed))
  }, [])

  // Detect ambiguous short responses
  const isAmbiguousShortResponse = useCallback(input => {
    const trimmed = input.trim().toLowerCase()

    // Single ambiguous words
    const ambiguousWords = [
      'what',
      'where',
      'when',
      'why',
      'how',
      'that',
      'this',
      'it',
    ]
    if (ambiguousWords.includes(trimmed)) return true

    // Incomplete phrases (less than 10 characters and seems incomplete)
    if (trimmed.length < 10) {
      const incompletePatterns = [
        /^i\s+need/,
        /^can\s+you/,
        /^what\s+about/,
        /^how\s+do/,
        /^where\s+is/,
        /^when\s+can/,
      ]
      return incompletePatterns.some(pattern => pattern.test(trimmed))
    }

    return false
  }, [])

  // Enhanced fuzzy matching for typos
  const fuzzyMatch = useCallback((input, patterns) => {
    const trimmed = input.trim().toLowerCase()

    // Simple Levenshtein distance for single words
    const levenshteinDistance = (str1, str2) => {
      const matrix = []
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i]
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1]
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1,
            )
          }
        }
      }
      return matrix[str2.length][str1.length]
    }

    // Check against common typos
    const commonWords = ['hello', 'yes', 'no', 'stop', 'help', 'thanks', 'bye']
    for (const word of commonWords) {
      if (
        patterns.includes(word) &&
        levenshteinDistance(trimmed, word) <= 2 &&
        trimmed.length >= 3
      ) {
        return word
      }
    }

    return null
  }, [])

  // Main validation function - determines if input should be sent to API
  const shouldSendToAPI = useCallback(
    input => {
      if (!input || typeof input !== 'string') return false

      const trimmed = input.trim()
      if (trimmed.length === 0) return false

      // Check for various patterns that should NOT be sent to API

      // 1. Greetings
      if (isGreeting(input)) return false

      // 2. Yes/No responses (unless contextually appropriate)
      if (isYesNoResponse(input) && !isYesNoResponseAppropriate()) return false

      // 3. Termination intent
      if (isTerminationIntent(input)) return false

      // 4. Ambiguous short responses
      if (isAmbiguousShortResponse(input)) return false

      // 5. Check for typos of blocked patterns
      const blockedPatterns = ['hello', 'yes', 'no', 'stop', 'help', 'bye']
      const typoMatch = fuzzyMatch(input, blockedPatterns)
      if (typoMatch && !isYesNoResponseAppropriate()) return false

      // 6. Mixed intent detection - if it contains a greeting but also has substance, allow it
      const words = trimmed.toLowerCase().split(/\s+/)
      const hasGreeting = words.some(word =>
        ['hi', 'hello', 'hey'].includes(word),
      )
      const hasSubstance =
        words.length > 3 ||
        words.some(word =>
          [
            'help',
            'how',
            'what',
            'where',
            'when',
            'why',
            'can',
            'need',
            'want',
          ].includes(word),
        )

      if (hasGreeting && hasSubstance) return true

      // Everything else should be sent to API
      return true
    },
    [
      isGreeting,
      isYesNoResponse,
      isYesNoResponseAppropriate,
      isTerminationIntent,
      isAmbiguousShortResponse,
      fuzzyMatch,
    ],
  )

  // Generate appropriate local responses
  const getLocalResponse = useCallback(
    input => {
      if (!input || typeof input !== 'string') {
        return 'What is your question?'
      }

      const trimmed = input.trim().toLowerCase()

      // Handle greetings
      if (isGreeting(input)) {
        if (pageContext?.title) {
          return `Hi there! I see you're reading about ${pageContext.title}. What questions do you have about it?`
        }
        return 'Hi there! What can I help you with regarding Resolve Actions?'
      }

      // Handle yes/no responses without context
      if (isYesNoResponse(input) && !isYesNoResponseAppropriate()) {
        if (pageContext?.title) {
          return `I'd be happy to help, but I need more details. Could you tell me what specific question you have about ${pageContext.title}?`
        }
        return "I'd be happy to help, but I need more details. What would you like to know more about?"
      }

      // Handle termination intent
      if (isTerminationIntent(input)) {
        return 'It sounds like you want to end the session. If you have more questions, feel free to ask!'
      }

      // Handle ambiguous short responses
      if (isAmbiguousShortResponse(input)) {
        if (pageContext?.title) {
          return `Could you be more specific about what you'd like to know about ${pageContext.title}?`
        }
        return "Could you be more specific about what you'd like to know?"
      }

      // Check for typos and provide helpful response
      const typoMatch = fuzzyMatch(input, [
        'hello',
        'yes',
        'no',
        'stop',
        'help',
        'bye',
      ])
      if (typoMatch) {
        switch (typoMatch) {
          case 'hello':
            return pageContext?.title
              ? `Hi there! I see you're reading about ${pageContext.title}. What questions do you have about it?`
              : 'Hi there! What can I help you with regarding Resolve Actions?'
          case 'help':
            return pageContext?.title
              ? `I'd be happy to help with ${pageContext.title}. What specific question do you have?`
              : "I'd be happy to help! What specific question do you have about Resolve Actions?"
          case 'stop':
          case 'bye':
            return 'It sounds like you want to end the session. If you have more questions, feel free to ask!'
          default:
            return "I'm not sure what you meant. Could you rephrase your question?"
        }
      }

      // Default fallback
      return 'What is your question?'
    },
    [
      pageContext,
      isGreeting,
      isYesNoResponse,
      isYesNoResponseAppropriate,
      isTerminationIntent,
      isAmbiguousShortResponse,
      fuzzyMatch,
    ],
  )

  // Check if input looks like a valid question (for suggestions)
  const isValidQuestion = useCallback(input => {
    if (!input || typeof input !== 'string') return false

    const trimmed = input.trim().toLowerCase()

    // Must have some complexity (more than 3 characters)
    if (trimmed.length <= 3) return false

    // Question indicators
    const questionWords = [
      'how',
      'what',
      'where',
      'when',
      'why',
      'can',
      'should',
      'could',
      'would',
      'will',
      'do',
      'does',
      'is',
      'are',
      'am',
    ]

    const questionPhrases = [
      'tell me',
      'show me',
      'explain',
      'help me',
      'i need',
      'i want',
      "i'm trying",
      'how to',
      'help with',
    ]

    const problemWords = [
      'error',
      'problem',
      'issue',
      'trouble',
      'broken',
      'not working',
      'failed',
      "can't",
      "won't",
      "doesn't",
      'fix',
      'debug',
    ]

    // Check for question words at start
    const startsWithQuestion = questionWords.some(
      word => trimmed.startsWith(word + ' ') || trimmed.startsWith(word + "'"),
    )

    // Check for question phrases
    const containsQuestionPhrase = questionPhrases.some(phrase =>
      trimmed.includes(phrase),
    )

    // Check for problem indicators
    const containsProblemWord = problemWords.some(word =>
      trimmed.includes(word),
    )

    // Check for question marks
    const hasQuestionMark = input.includes('?')

    return (
      startsWithQuestion ||
      containsQuestionPhrase ||
      containsProblemWord ||
      hasQuestionMark
    )
  }, [])

  // Get contextual suggestions based on current page
  const getContextualSuggestions = useCallback(() => {
    if (!pageContext) return getDefaultSuggestions()

    const path = pageContext.path.toLowerCase()
    const title = pageContext.title ? pageContext.title.toLowerCase() : ''

    // Page-specific suggestions
    if (path.includes('slack') || title.includes('slack')) {
      return [
        'How do I set up the Slack connection?',
        'How do I test my Slack workflow?',
        'How do I troubleshoot Slack connection errors?',
      ]
    }

    if (
      path.includes('workflow') ||
      path.includes('building') ||
      title.includes('workflow')
    ) {
      return [
        'How do I create my first workflow?',
        'What activities should I use?',
        'How do I test my workflow?',
      ]
    }

    if (
      path.includes('troubleshoot') ||
      path.includes('support') ||
      title.includes('troubleshoot')
    ) {
      return [
        "My workflow isn't running",
        "I'm getting connection errors",
        'How do I debug activity failures?',
      ]
    }

    if (
      path.includes('getting-started') ||
      path.includes('intro') ||
      title.includes('getting started')
    ) {
      return [
        'How do I get started with Actions?',
        'What should I learn first?',
        'Where can I find examples?',
      ]
    }

    if (path.includes('integration') || title.includes('integration')) {
      return [
        'How do I set up integrations?',
        'What integrations are available?',
        'How do I test my connections?',
      ]
    }

    if (path.includes('hybrid') || title.includes('hybrid')) {
      return [
        'How do I set up hybrid components?',
        'What are the requirements for hybrid mode?',
        'How do I configure hybrid connections?',
      ]
    }

    return getDefaultSuggestions()
  }, [pageContext])

  const getDefaultSuggestions = () => [
    'How do I create a workflow?',
    'How do I set up integrations?',
    'How do I troubleshoot issues?',
  ]

  // Check if we should show suggestions instead of sending unclear question
  const shouldShowSuggestions = useCallback(input => {
    if (!input || typeof input !== 'string') return false

    const trimmed = input.trim().toLowerCase()

    // Very vague single words that might benefit from suggestions
    const vagueWords = [
      'setup',
      'configure',
      'install',
      'create',
      'build',
      'make',
      'fix',
      'error',
      'problem',
      'issue',
      'help',
      'workflow',
      'integration',
    ]

    // Single word that's too vague
    const isSingleVagueWord = vagueWords.includes(trimmed)

    // Very short incomplete phrases
    const isIncompletePhrase =
      trimmed.length < 15 &&
      (trimmed.includes("i can't") ||
        trimmed.includes('how do') ||
        trimmed.includes('what is') ||
        trimmed.includes('where is') ||
        trimmed.includes('when can') ||
        trimmed.includes('why does'))

    return isSingleVagueWord || isIncompletePhrase
  }, [])

  // Generate response with suggestions
  const getResponseWithSuggestions = useCallback(() => {
    const suggestions = getContextualSuggestions()

    let response = "I'd like to help! Here are some common questions"

    if (pageContext?.title) {
      response += ` about ${pageContext.title}:`
    } else {
      response += ' about Resolve Actions:'
    }

    response += '\n\n'

    suggestions.forEach((suggestion, index) => {
      response += `• ${suggestion}\n`
    })

    response += "\nOr tell me what you're trying to accomplish."

    return response
  }, [pageContext, getContextualSuggestions])

  // Main validation function that determines response strategy
  const validateAndGetResponse = useCallback(
    input => {
      // First check if it should be sent to API
      if (shouldSendToAPI(input)) {
        // Check if it's too vague and should get suggestions instead
        if (shouldShowSuggestions(input)) {
          return {
            shouldSendToAPI: false,
            response: getResponseWithSuggestions(),
            type: 'suggestions',
          }
        }

        // Valid question - send to API
        return {
          shouldSendToAPI: true,
          response: null,
          type: 'api',
        }
      }

      // Handle locally with smart responses
      return {
        shouldSendToAPI: false,
        response: getLocalResponse(input),
        type: 'local',
      }
    },
    [
      shouldSendToAPI,
      shouldShowSuggestions,
      getResponseWithSuggestions,
      getLocalResponse,
    ],
  )

  // Reset conversation state when needed
  const resetConversationState = useCallback(() => {
    conversationStateRef.current = {
      lastBotQuestionTimestamp: null,
      lastBotQuestionType: null,
      expectingYesNoResponse: false,
    }
  }, [])

  return {
    shouldSendToAPI,
    getLocalResponse,
    isValidQuestion,
    getContextualSuggestions,
    shouldShowSuggestions,
    getResponseWithSuggestions,
    validateAndGetResponse,
    updateConversationState,
    resetConversationState,

    // Expose individual detection methods for testing/debugging
    isGreeting,
    isYesNoResponse,
    isTerminationIntent,
    isAmbiguousShortResponse,
  }
}

export default useChatValidation
