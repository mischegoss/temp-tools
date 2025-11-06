#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const https = require('https')
const http = require('http')
const { URL } = require('url')
const FormData = require('form-data')

class DocumentUploader {
  constructor(fastApiUrl = 'http://localhost:8000') {
    this.baseUrl = fastApiUrl.replace(/\/$/, '')
    this.uploadEndpoint = `${this.baseUrl}/api/v1/upload-documentation`
    this.statusEndpoint = `${this.baseUrl}/api/v1/status`
    this.healthEndpoint = `${this.baseUrl}/api/v1/health`
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const client = urlObj.protocol === 'https:' ? https : http

      const req = client.request(url, options, res => {
        let data = ''
        res.on('data', chunk => (data += chunk))
        res.on('end', () => {
          try {
            const jsonData = data ? JSON.parse(data) : {}
            resolve({
              status: res.statusCode,
              data: jsonData,
              headers: res.headers,
            })
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: data,
              headers: res.headers,
            })
          }
        })
      })

      req.on('error', reject)

      if (options.body) {
        if (options.body instanceof FormData) {
          options.body.pipe(req)
        } else {
          req.write(options.body)
          req.end()
        }
      } else {
        req.end()
      }
    })
  }

  async checkServerStatus() {
    try {
      console.log('Checking FastAPI server status...')

      const response = await this.makeRequest(this.healthEndpoint, {
        method: 'GET',
        timeout: 5000,
      })

      if (response.status === 200) {
        console.log('FastAPI server is running')
        return true
      } else {
        console.log(`Server responded with status ${response.status}`)
        return false
      }
    } catch (error) {
      console.log('Cannot connect to FastAPI server')
      console.log(`   Make sure server is running at: ${this.baseUrl}`)
      console.log(
        '   Start with: python -m uvicorn app.main:app --reload --port 8000',
      )
      console.log(`   Error: ${error.message}`)
      return false
    }
  }

  async validateJsonFile(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8')
      const data = JSON.parse(fileContent)

      // Check for required fields
      if (!data.chunks) {
        console.log(`JSON file missing 'chunks' array: ${filePath}`)
        return false
      }

      if (!Array.isArray(data.chunks)) {
        console.log(`'chunks' must be an array: ${filePath}`)
        return false
      }

      if (data.chunks.length === 0) {
        console.log(`No chunks found in file: ${filePath}`)
        return false
      }

      // Validate first chunk structure
      const firstChunk = data.chunks[0]
      const requiredFields = ['id', 'content', 'source_url', 'page_title']
      const missingFields = requiredFields.filter(
        field => !(field in firstChunk),
      )

      if (missingFields.length > 0) {
        console.log(
          `Chunks missing required fields [${missingFields.join(
            ', ',
          )}]: ${filePath}`,
        )
        return false
      }

      console.log(`Valid JSON file with ${data.chunks.length} chunks`)
      return true
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log(`Invalid JSON format: ${error.message}`)
      } else {
        console.log(`File validation error: ${error.message}`)
      }
      return false
    }
  }

  async uploadFile(filePath, sourceName) {
    console.log(`\nUploading: ${filePath}`)
    console.log(`   Source: ${sourceName}`)

    try {
      // Create form data
      const form = new FormData()
      const fileStream = await fs.readFile(filePath)

      form.append('file', fileStream, {
        filename: path.basename(filePath),
        contentType: 'application/json',
      })
      form.append('source', sourceName)

      // Make upload request
      const response = await this.makeRequest(this.uploadEndpoint, {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
        timeout: 300000, // 5 minutes
      })

      if (response.status === 200) {
        const result = response.data
        console.log('Upload successful!')
        console.log(`   Processed chunks: ${result.processed_chunks}`)
        console.log(`   New embeddings: ${result.new_embeddings}`)
        console.log(`   Updated embeddings: ${result.updated_embeddings}`)
        console.log(`   Upload type: ${result.upload_type || 'legacy'}`)
        if (result.enhanced_features) {
          console.log(
            `   Enhanced features: ${result.enhanced_features.length}`,
          )
        }
        console.log(
          `   Processing time: ${result.processing_time?.toFixed(2)}s`,
        )
        return true
      } else {
        console.log(`Upload failed with status ${response.status}`)
        const errorDetail =
          response.data?.detail || response.data || 'Unknown error'
        console.log(`   Error: ${errorDetail}`)
        return false
      }
    } catch (error) {
      if (error.code === 'TIMEOUT') {
        console.log('Upload timed out (file may be too large)')
      } else {
        console.log(`Upload error: ${error.message}`)
      }
      return false
    }
  }

  async getSystemStatus() {
    try {
      const response = await this.makeRequest(this.statusEndpoint, {
        method: 'GET',
        timeout: 10000,
      })

      if (response.status === 200) {
        const status = response.data
        console.log('\nSystem Status:')
        console.log(`   Ready for chat: ${status.ready}`)
        console.log(`   Total chunks: ${status.status?.total_chunks || 'N/A'}`)
        console.log(
          `   Sources: ${status.status?.sources?.join(', ') || 'None'}`,
        )
        console.log(
          `   Embedding model: ${status.status?.embedding_model || 'N/A'}`,
        )
      } else {
        console.log(`Status check failed: ${response.status}`)
      }
    } catch (error) {
      console.log(`Status check error: ${error.message}`)
    }
  }
}

async function findJsonFiles(directory) {
  // Only look for the chunks file - that's all FastAPI needs
  const potentialFiles = [
    path.join(directory, 'static', 'data', 'documentation-chunks.json'),
    path.join(directory, 'documentation-chunks.json'), // If in root
  ]

  const foundFiles = []
  for (const filePath of potentialFiles) {
    try {
      await fs.access(filePath)
      foundFiles.push(filePath)
    } catch (error) {
      // File doesn't exist, continue
    }
  }

  return foundFiles
}

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    url: 'https://actions-chatbot-api-716168339016.us-central1.run.app',
    file: null,
    source: 'actions-docs',
    help: false,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-h':
      case '--help':
        options.help = true
        break
      case '--url':
        if (i + 1 < args.length) {
          options.url = args[++i]
        }
        break
      case '--file':
        if (i + 1 < args.length) {
          options.file = args[++i]
        }
        break
      case '--source':
        if (i + 1 < args.length) {
          options.source = args[++i]
        }
        break
    }
  }

  return options
}

function showHelp() {
  console.log(`
=== Documentation Upload Script ===

Upload documentation chunks to FastAPI backend for AI chat.

Usage: node upload-docs.js [OPTIONS]

Options:
  -h, --help          Show this help
  --url URL          FastAPI server URL (default: http://localhost:8000)
  --file FILE        Specific chunks file to upload
  --source SOURCE    Source name for the upload (default: actions-docs)

Examples:
  node upload-docs.js
  node upload-docs.js --url https://your-cloud-run-url.app
  node upload-docs.js --file static/data/documentation-chunks.json
  node upload-docs.js --file my-chunks.json --source support-docs

Note: This script only uploads documentation-chunks.json files (contains 'chunks' array).
The enhanced-title-mappings files are not needed by the FastAPI chat system.
    `)
}

async function main() {
  console.log('=== Documentation Upload Script ===')

  const options = parseArgs()

  if (options.help) {
    showHelp()
    return
  }

  // Initialize uploader
  const uploader = new DocumentUploader(options.url)

  // Check server status
  const serverReady = await uploader.checkServerStatus()
  if (!serverReady) {
    process.exit(1)
  }

  // Find files to upload
  let filesToUpload
  if (options.file) {
    try {
      await fs.access(options.file)
      filesToUpload = [options.file]
    } catch (error) {
      console.log(`File not found: ${options.file}`)
      process.exit(1)
    }
  } else {
    const currentDir = process.cwd()
    filesToUpload = await findJsonFiles(currentDir)

    if (filesToUpload.length === 0) {
      console.log('No documentation chunks file found')
      console.log('   Expected location: static/data/documentation-chunks.json')
      console.log("   Make sure you're running from your Node.js repo root")
      console.log('   Or use --file to specify a specific file')
      process.exit(1)
    }
  }

  console.log(`\nFound ${filesToUpload.length} file(s) to upload:`)
  filesToUpload.forEach(file => console.log(`   - ${file}`))

  // Validate and upload each file
  let successCount = 0
  for (const filePath of filesToUpload) {
    console.log('\n' + '='.repeat(50))

    // Validate file
    const isValid = await uploader.validateJsonFile(filePath)
    if (!isValid) {
      continue
    }

    // Upload file with provided source name
    const uploadSuccess = await uploader.uploadFile(filePath, options.source)
    if (uploadSuccess) {
      successCount++
    }

    // Small delay between uploads
    if (filesToUpload.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Final status
  console.log('\n' + '='.repeat(50))
  console.log('Upload Summary:')
  console.log(`   Files processed: ${filesToUpload.length}`)
  console.log(`   Successful uploads: ${successCount}`)
  console.log(`   Failed uploads: ${filesToUpload.length - successCount}`)

  if (successCount > 0) {
    await uploader.getSystemStatus()
    console.log(`\nUpload complete! Your FastAPI backend is ready for chat.`)
    console.log(`   Test the chat API at: ${options.url}/docs`)
  } else {
    console.log('\nNo files were uploaded successfully.')
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error.message)
    process.exit(1)
  })
}

module.exports = { DocumentUploader }
