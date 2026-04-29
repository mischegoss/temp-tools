const { Storage } = require('@google-cloud/storage')
const fs = require('fs')
const path = require('path')

// Configuration
const BUCKET_NAME = 'express-chatbot-data'
const OUTPUT_DIR = './chat-reports'

// Initialize GCS
const storage = new Storage()
const bucket = storage.bucket(BUCKET_NAME)

async function generateReport(month = null) {
  try {
    // If no month specified, use current month
    if (!month) {
      const now = new Date()
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}`
    }

    console.log(`📊 Generating report for ${month}...`)

    // Download the JSONL file from GCS
    const fileName = `chat-logs/interactions-${month}.jsonl`
    const file = bucket.file(fileName)

    const [exists] = await file.exists()
    if (!exists) {
      console.error(`❌ No logs found for ${month}`)
      console.log(`   Looking for: gs://${BUCKET_NAME}/${fileName}`)
      return
    }

    const [contents] = await file.download()
    const lines = contents.toString().trim().split('\n')

    // Parse all interactions
    const interactions = lines.map(line => JSON.parse(line))

    console.log(`✅ Found ${interactions.length} interactions`)

    // Generate reports
    await generateHTMLReport(interactions, month)
    await generateMarkdownReport(interactions, month)
    await generateCSVReport(interactions, month)

    console.log(`\n✅ Reports generated in ${OUTPUT_DIR}/`)
    console.log(`   - HTML:     ${month}-report.html`)
    console.log(`   - Markdown: ${month}-report.md`)
    console.log(`   - CSV:      ${month}-report.csv`)
  } catch (error) {
    console.error('❌ Error generating report:', error)
  }
}

async function generateHTMLReport(interactions, month) {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Calculate statistics
  const stats = calculateStats(interactions)

  // Generate HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Chat Report - ${month}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
    }
    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
    }
    .interaction {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .interaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
    }
    .timestamp {
      font-size: 12px;
      color: #666;
    }
    .metadata {
      display: flex;
      gap: 15px;
      font-size: 12px;
    }
    .badge {
      background: #e0e7ff;
      color: #3730a3;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
    .prompt {
      margin-bottom: 15px;
    }
    .prompt strong {
      color: #059669;
    }
    .response {
      background: #f9fafb;
      padding: 15px;
      border-radius: 4px;
      border-left: 3px solid #2563eb;
    }
    .response strong {
      color: #2563eb;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 5px 0 0 0;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>💬 Chat Interaction Report</h1>
    <p>Period: ${month}</p>
  </div>

  <div class="stats">
    <div class="stat-card">
      <h3>Total Interactions</h3>
      <div class="value">${stats.total}</div>
    </div>
    <div class="stat-card">
      <h3>Avg Response Time</h3>
      <div class="value">${stats.avgResponseTime}ms</div>
    </div>
    <div class="stat-card">
      <h3>Avg Chunks Used</h3>
      <div class="value">${stats.avgChunks}</div>
    </div>
    <div class="stat-card">
      <h3>Zero Results</h3>
      <div class="value">${stats.zeroResults}</div>
    </div>
  </div>

  <h2>All Interactions</h2>
  ${interactions
    .map(
      (interaction, index) => `
    <div class="interaction">
      <div class="interaction-header">
        <div class="timestamp">${new Date(
          interaction.timestamp,
        ).toLocaleString()}</div>
        <div class="metadata">
          <span class="badge">${interaction.version || 'N/A'}</span>
          <span class="badge">${interaction.processing_time_ms || 0}ms</span>
          <span class="badge">${interaction.chunks_used || 0} chunks</span>
        </div>
      </div>
      
      <div class="prompt">
        <strong>User:</strong>
        <pre>${escapeHtml(interaction.prompt)}</pre>
      </div>
      
      <div class="response">
        <strong>RANI:</strong>
        <pre>${escapeHtml(interaction.response)}</pre>
      </div>
    </div>
  `,
    )
    .join('')}

</body>
</html>
  `

  const outputPath = path.join(OUTPUT_DIR, `${month}-report.html`)
  fs.writeFileSync(outputPath, html)
}

async function generateMarkdownReport(interactions, month) {
  const stats = calculateStats(interactions)

  let markdown = `# Chat Interaction Report - ${month}\n\n`
  markdown += `## Summary Statistics\n\n`
  markdown += `- **Total Interactions:** ${stats.total}\n`
  markdown += `- **Average Response Time:** ${stats.avgResponseTime}ms\n`
  markdown += `- **Average Chunks Used:** ${stats.avgChunks}\n`
  markdown += `- **Zero Results:** ${stats.zeroResults}\n\n`
  markdown += `## Interactions\n\n`

  interactions.forEach((interaction, index) => {
    markdown += `### Interaction ${index + 1}\n`
    markdown += `**Time:** ${new Date(
      interaction.timestamp,
    ).toLocaleString()}\n`
    markdown += `**Version:** ${interaction.version || 'N/A'}\n`
    markdown += `**Processing Time:** ${
      interaction.processing_time_ms || 0
    }ms\n`
    markdown += `**Chunks Used:** ${interaction.chunks_used || 0}\n\n`
    markdown += `**User Prompt:**\n\`\`\`\n${interaction.prompt}\n\`\`\`\n\n`
    markdown += `**RANI Response:**\n\`\`\`\n${interaction.response}\n\`\`\`\n\n`
    markdown += `---\n\n`
  })

  const outputPath = path.join(OUTPUT_DIR, `${month}-report.md`)
  fs.writeFileSync(outputPath, markdown)
}

async function generateCSVReport(interactions, month) {
  const csvLines = []

  // Header
  csvLines.push(
    [
      'Timestamp',
      'Prompt',
      'Response',
      'Version',
      'Processing Time (ms)',
      'Chunks Used',
      'Conversation ID',
      'Zero Results',
    ]
      .map(escapeCSV)
      .join(','),
  )

  // Data rows
  interactions.forEach(interaction => {
    csvLines.push(
      [
        interaction.timestamp,
        interaction.prompt,
        interaction.response.substring(0, 500), // Truncate long responses
        interaction.version || '',
        interaction.processing_time_ms || 0,
        interaction.chunks_used || 0,
        interaction.conversation_id || '',
        interaction.zero_results ? 'Yes' : 'No',
      ]
        .map(escapeCSV)
        .join(','),
    )
  })

  const outputPath = path.join(OUTPUT_DIR, `${month}-report.csv`)
  fs.writeFileSync(outputPath, csvLines.join('\n'))
}

function calculateStats(interactions) {
  const total = interactions.length
  const avgResponseTime = Math.round(
    interactions.reduce((sum, i) => sum + (i.processing_time_ms || 0), 0) /
      total,
  )
  const avgChunks =
    Math.round(
      (interactions.reduce((sum, i) => sum + (i.chunks_used || 0), 0) / total) *
        10,
    ) / 10
  const zeroResults = interactions.filter(i => i.zero_results).length

  return { total, avgResponseTime, avgChunks, zeroResults }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

function escapeCSV(field) {
  if (field === null || field === undefined) return ''
  const str = String(field)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// CLI Interface
const args = process.argv.slice(2)
const month = args[0] // Optional: YYYY-MM format

generateReport(month)
