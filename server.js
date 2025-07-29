const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested')
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
  })
})

// Proxy endpoint for Anthropic API
app.post('/api/claude', async (req, res) => {
  console.log('=== RECEIVED CLAUDE REQUEST ===')
  console.log('Request body:', JSON.stringify(req.body, null, 2))

  try {
    const { formData } = req.body

    if (!formData) {
      console.error('No formData in request body')
      return res.status(400).json({
        error: 'formData is required',
      })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment')
      return res.status(500).json({
        error: 'ANTHROPIC_API_KEY not configured on server',
      })
    }

    console.log('API Key found, length:', process.env.ANTHROPIC_API_KEY.length)

    // Create the system message
    const systemMessage = `You are an expert workflow automation consultant specializing in Active Directory activities. Your job is to recommend the best activities based on user requirements.

IMPORTANT INSTRUCTIONS:
- Analyze the user's goal, available information, action type, and output needs
- Recommend the TOP 3 most relevant activities from the provided database
- Explain WHY each activity matches their requirements
- Focus on practical, actionable recommendations
- Be concise but thorough in explanations`

    // Create user message
    const userMessage = `
USER REQUIREMENTS:
- Goal: ${formData.goal}
- System: ${formData.system}
- Available Information: ${formData.availableInfo}
- Action Type: ${formData.actionType}
- Output Needed: ${formData.finalOutput}

Please recommend the TOP 3 most suitable activities for this user's requirements and explain why each one is a good fit.`

    console.log('Calling Anthropic API...')

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Updated model name
        max_tokens: 1500,
        system: systemMessage,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    })

    console.log('Anthropic API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Anthropic API success, usage:', data.usage)

    res.json({
      success: true,
      recommendations: data.content[0].text,
      usage: data.usage,
      model: data.model,
    })
  } catch (error) {
    console.error('=== PROXY ERROR ===')
    console.error('Error:', error.message)

    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log('=================================')
  console.log(`✅ Proxy server running on port ${PORT}`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  console.log(`🤖 Claude API: http://localhost:${PORT}/api/claude`)
  console.log(
    `🔑 API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO'}`,
  )
  console.log('=================================')

  // Test the server immediately
  setTimeout(() => {
    console.log('\n🧪 Testing server...')
    fetch(`http://localhost:${PORT}/health`)
      .then(res => res.json())
      .then(data => console.log('✅ Self-test passed:', data))
      .catch(err => console.log('❌ Self-test failed:', err.message))
  }, 1000)
})
