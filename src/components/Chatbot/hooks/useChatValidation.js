// src/components/Chatbot/hooks/useChatValidation.js
import { useCallback } from 'react'

const useChatValidation = pageContext => {
  // Determine if input should be sent to API or handled locally
  const shouldSendToAPI = useCallback(input => {
    if (!input || typeof input !== 'string') return false

    const trimmed = input.trim().toLowerCase()

    // Block pure acknowledgments
    const pureAcknowledgments = [
      'yes',
      'no',
      'ok',
      'sure',
      'yeah',
      'nah',
      'yep',
      'nope',
    ]

    // Block help-only requests
    const helpOnlyRequests = ['help', 'hi', 'hello', 'hey', 'hiya']

    // Block exit commands
    const exitCommands = [
      'exit',
      'quit',
      'stop',
      'close',
      'done',
      'bye',
      'goodbye',
      'end',
      'finish',
    ]

    // Block empty or whitespace-only
    if (trimmed.length === 0) return false

    // Block if it matches any blocked patterns
    if (
      pureAcknowledgments.includes(trimmed) ||
      helpOnlyRequests.includes(trimmed) ||
      exitCommands.includes(trimmed)
    ) {
      return false
    }

    // Send everything else to API
    return true
  }, [])

  // Generate local response for blocked inputs
  const getLocalResponse = useCallback(
    input => {
      if (!input || typeof input !== 'string') {
        return 'What is your question?'
      }

      const trimmed = input.trim().toLowerCase()

      // Handle exit commands
      if (
        ['exit', 'quit', 'stop', 'close', 'done', 'end', 'finish'].includes(
          trimmed,
        )
      ) {
        return 'Thanks for chatting! Feel free to reach out anytime you need help with Resolve Actions.'
      }

      // Handle polite goodbyes
      if (['bye', 'goodbye'].includes(trimmed)) {
        return "Goodbye! I'm here whenever you need help with Resolve Actions."
      }

      // Handle acknowledgments
      if (
        ['yes', 'no', 'ok', 'sure', 'yeah', 'nah', 'yep', 'nope'].includes(
          trimmed,
        )
      ) {
        return 'What is your question?'
      }

      // Handle help requests with context
      if (['help', 'hi', 'hello', 'hey', 'hiya'].includes(trimmed)) {
        if (pageContext?.title) {
          return `Hi! What can I help you with regarding ${pageContext.title}?`
        }
        return 'Hi! What can I help you with regarding Resolve Actions?'
      }

      // Default fallback
      return 'What is your question?'
    },
    [pageContext],
  )

  // Check if input looks like a valid question
  const isValidQuestion = useCallback(input => {
    if (!input || typeof input !== 'string') return false

    const trimmed = input.trim().toLowerCase()

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

    // Must have some complexity (more than 3 characters)
    const hasComplexity = trimmed.length > 3

    return (
      hasComplexity &&
      (startsWithQuestion ||
        containsQuestionPhrase ||
        containsProblemWord ||
        hasQuestionMark)
    )
  }, [])

  // Get contextual suggestions for unclear questions
  const getContextualSuggestions = useCallback(() => {
    if (!pageContext) return []

    const path = pageContext.path.toLowerCase()

    // Suggestions based on current page
    if (path.includes('slack')) {
      return [
        'How do I set up the Slack connection?',
        'How do I test my Slack workflow?',
        'How do I troubleshoot connection errors?',
      ]
    }

    if (path.includes('workflow') || path.includes('building')) {
      return [
        'How do I create my first workflow?',
        'What activities should I use?',
        'How do I test my workflow?',
      ]
    }

    if (path.includes('troubleshoot') || path.includes('support')) {
      return [
        "My workflow isn't running",
        "I'm getting connection errors",
        'How do I debug activity failures?',
      ]
    }

    if (path.includes('getting-started') || path.includes('intro')) {
      return [
        'How do I get started with Actions?',
        'What should I learn first?',
        'Where can I find examples?',
      ]
    }

    if (path.includes('integration')) {
      return [
        'How do I set up integrations?',
        'What integrations are available?',
        'How do I test my connections?',
      ]
    }

    // Default suggestions for Actions
    return [
      'How do I create a workflow?',
      'How do I set up integrations?',
      'How do I troubleshoot issues?',
    ]
  }, [pageContext])

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
    ]

    // Single word that's too vague
    const isSingleVagueWord = vagueWords.includes(trimmed)

    // Very short incomplete phrases
    const isIncompletePhrase =
      trimmed.length < 10 &&
      (trimmed.includes("i can't") ||
        trimmed.includes('how do') ||
        trimmed.includes('what is') ||
        trimmed.includes('where'))

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

      // Handle locally with standard responses
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

  return {
    shouldSendToAPI,
    getLocalResponse,
    isValidQuestion,
    getContextualSuggestions,
    shouldShowSuggestions,
    getResponseWithSuggestions,
    validateAndGetResponse,
  }
}

export default useChatValidation
