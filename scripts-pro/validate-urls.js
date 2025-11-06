/**
 * Live URL Validator
 * Tests generated URLs against docs.resolve.io to verify they work
 *
 * Usage:
 *   node validate-urls.js              # Test sample of URLs
 *   node validate-urls.js --all        # Test all URLs (slower)
 *   node validate-urls.js --product=pro # Test specific product only
 *   node validate-urls.js --sample=100  # Test specific number of URLs
 */

const https = require('https')
const fs = require('fs').promises
const path = require('path')

// Configuration
const LIVE_SITE_BASE = 'https://docs.resolve.io'
const DEFAULT_SAMPLE_SIZE = 20
const TIMEOUT_MS = 10000
const CONCURRENT_REQUESTS = 5 // Don't overwhelm the server

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  all: args.includes('--all'),
  product: args.find(arg => arg.startsWith('--product='))?.split('=')[1],
  sample:
    parseInt(args.find(arg => arg.startsWith('--sample='))?.split('=')[1]) ||
    DEFAULT_SAMPLE_SIZE,
}

async function validateUrls() {
  console.log('🔍 Loading enhanced title mappings...')

  // Load the generated mappings
  const mappingsPath = path.join(
    process.cwd(),
    'src/plugins/enhanced-title-mappings.json',
  )

  try {
    const mappingsData = await fs.readFile(mappingsPath, 'utf8')
    const mappings = JSON.parse(mappingsData)

    console.log(`✅ Loaded ${mappings._TOTAL_PAGES} pages from mappings`)

    // Extract URLs to test
    const urlsToTest = extractUrlsToTest(mappings, options)

    console.log(
      `🎯 Testing ${urlsToTest.length} URLs against ${LIVE_SITE_BASE}`,
    )
    console.log(
      `⚙️  Concurrent requests: ${CONCURRENT_REQUESTS}, Timeout: ${TIMEOUT_MS}ms`,
    )

    if (options.product) {
      console.log(`📁 Filtering for product: ${options.product}`)
    }

    console.log('\n' + '='.repeat(80))
    console.log('Starting URL validation...')
    console.log('='.repeat(80))

    // Test URLs in batches to avoid overwhelming the server
    const results = await testUrlsInBatches(urlsToTest, CONCURRENT_REQUESTS)

    // Generate report
    generateReport(results, urlsToTest.length)
  } catch (error) {
    console.error('❌ Failed to load mappings:', error.message)
    console.error('💡 Make sure to run "npm run scan-titles" first')
    process.exit(1)
  }
}

function extractUrlsToTest(mappings, options) {
  const allUrls = []

  // Extract all URLs from mappings
  Object.entries(mappings).forEach(([title, data]) => {
    if (title.startsWith('_')) return // Skip metadata

    // Filter by product if specified
    if (options.product && data.product !== options.product) return

    allUrls.push({
      title,
      url: data.url,
      product: data.product,
      filePath: data.filePath,
    })
  })

  // Shuffle and sample if not testing all
  if (!options.all) {
    shuffleArray(allUrls)
    return allUrls.slice(0, options.sample)
  }

  return allUrls
}

async function testUrlsInBatches(urls, batchSize) {
  const results = {
    success: [],
    failed: [],
    errors: [],
  }

  // Process URLs in batches
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)

    console.log(
      `\n📦 Testing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        urls.length / batchSize,
      )} (${batch.length} URLs)`,
    )

    // Test batch concurrently
    const batchPromises = batch.map(urlInfo => testSingleUrl(urlInfo))
    const batchResults = await Promise.allSettled(batchPromises)

    // Process batch results
    batchResults.forEach((result, index) => {
      const urlInfo = batch[index]

      if (result.status === 'fulfilled') {
        const testResult = result.value

        if (testResult.success) {
          results.success.push({ ...urlInfo, ...testResult })
          console.log(`  ✅ ${testResult.status} ${urlInfo.url}`)
        } else {
          results.failed.push({ ...urlInfo, ...testResult })
          console.log(`  ❌ ${testResult.status} ${urlInfo.url}`)
        }
      } else {
        results.errors.push({ ...urlInfo, error: result.reason.message })
        console.log(`  💥 ERROR ${urlInfo.url} - ${result.reason.message}`)
      }
    })

    // Show progress
    const totalTested = i + batch.length
    const successRate = ((results.success.length / totalTested) * 100).toFixed(
      1,
    )
    console.log(
      `  📊 Progress: ${totalTested}/${urls.length} (${successRate}% success)`,
    )

    // Brief pause between batches to be nice to the server
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

function testSingleUrl(urlInfo) {
  return new Promise(resolve => {
    const fullUrl = LIVE_SITE_BASE + urlInfo.url

    // Parse URL
    const urlObj = new URL(fullUrl)

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD', // Use HEAD to avoid downloading content
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'URL-Validator/1.0 (docs validation script)',
      },
    }

    const req = https.request(options, res => {
      const success = res.statusCode >= 200 && res.statusCode < 400

      resolve({
        success,
        status: res.statusCode,
        fullUrl,
        redirected: res.statusCode >= 300 && res.statusCode < 400,
        location: res.headers.location || null,
      })
    })

    req.on('error', error => {
      resolve({
        success: false,
        status: 'ERROR',
        fullUrl,
        error: error.message,
      })
    })

    req.on('timeout', () => {
      req.destroy()
      resolve({
        success: false,
        status: 'TIMEOUT',
        fullUrl,
        error: `Request timed out after ${TIMEOUT_MS}ms`,
      })
    })

    req.end()
  })
}

function generateReport(results, totalTested) {
  console.log('\n' + '='.repeat(80))
  console.log('🎯 VALIDATION REPORT')
  console.log('='.repeat(80))

  const successCount = results.success.length
  const failedCount = results.failed.length
  const errorCount = results.errors.length
  const successRate = ((successCount / totalTested) * 100).toFixed(1)

  console.log(`📊 Overall Results:`)
  console.log(
    `   ✅ Successful: ${successCount}/${totalTested} (${successRate}%)`,
  )
  console.log(`   ❌ Failed: ${failedCount}/${totalTested}`)
  console.log(`   💥 Errors: ${errorCount}/${totalTested}`)

  // Success rate by product
  if (successCount > 0) {
    console.log(`\n📈 Success Rate by Product:`)
    const productStats = {}

    // Combine all results arrays using concat instead of spread operator
    const allResults = results.success
      .concat(results.failed)
      .concat(results.errors)
    allResults.forEach(result => {
      if (!productStats[result.product]) {
        productStats[result.product] = { success: 0, total: 0 }
      }
      productStats[result.product].total++
      if (results.success.includes(result)) {
        productStats[result.product].success++
      }
    })

    Object.entries(productStats).forEach(([product, stats]) => {
      const rate = ((stats.success / stats.total) * 100).toFixed(1)
      console.log(`   ${product}: ${stats.success}/${stats.total} (${rate}%)`)
    })
  }

  // Show failed URLs for debugging
  if (failedCount > 0) {
    console.log(`\n❌ Failed URLs (first 10):`)
    results.failed.slice(0, 10).forEach(result => {
      console.log(`   ${result.status} ${result.fullUrl}`)
      console.log(`      Title: "${result.title}"`)
      console.log(`      File: ${result.filePath}`)
    })

    if (failedCount > 10) {
      console.log(`   ... and ${failedCount - 10} more`)
    }
  }

  // Show errors for debugging
  if (errorCount > 0) {
    console.log(`\n💥 Errors (first 5):`)
    results.errors.slice(0, 5).forEach(result => {
      console.log(`   ${result.fullUrl}`)
      console.log(`      Error: ${result.error}`)
      console.log(`      File: ${result.filePath}`)
    })

    if (errorCount > 5) {
      console.log(`   ... and ${errorCount - 5} more`)
    }
  }

  // Recommendations
  console.log(`\n💡 Recommendations:`)
  if (successRate < 70) {
    console.log(`   🔧 Low success rate suggests URL generation issues`)
    console.log(`   🔍 Check the generatePageUrl() function in scan-titles.js`)
    console.log(
      `   📋 Verify the validation rules are being followed correctly`,
    )
  } else if (successRate < 90) {
    console.log(`   ⚠️  Some URLs failing - check failed URLs above`)
    console.log(`   🔍 May be specific edge cases or missing files`)
  } else {
    console.log(`   🎉 Excellent success rate! URL generation is working well`)
    console.log(`   ✨ Consider testing more URLs with --sample=100 or --all`)
  }

  if (failedCount > 0) {
    console.log(`   📝 Failed URLs might be:`)
    console.log(`      - Files that exist in repo but not deployed`)
    console.log(`      - Draft pages or versioned content`)
    console.log(`      - URL transformation edge cases`)
  }

  console.log(`\n🚀 To test more URLs:`)
  console.log(`   node validate-urls.js --sample=100`)
  console.log(`   node validate-urls.js --all`)
  console.log(`   node validate-urls.js --product=pro`)

  console.log('\n' + '='.repeat(80))

  // Exit with error code if success rate is too low
  if (successRate < 50) {
    console.error('❌ Success rate too low - likely URL generation issues')
    process.exit(1)
  }
}

// Utility function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

// Show usage if help requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🔍 Live URL Validator
Tests generated URLs against docs.resolve.io

Usage:
  node validate-urls.js                    # Test ${DEFAULT_SAMPLE_SIZE} random URLs
  node validate-urls.js --all              # Test all URLs (slow!)
  node validate-urls.js --sample=50        # Test 50 random URLs
  node validate-urls.js --product=pro      # Test only Pro product URLs
  node validate-urls.js --product=actions  # Test only Actions product URLs

Options:
  --all              Test all URLs instead of sampling
  --sample=N         Test N random URLs (default: ${DEFAULT_SAMPLE_SIZE})
  --product=NAME     Test only URLs from specific product
  --help, -h         Show this help

Examples:
  node validate-urls.js --sample=100 --product=express
  node validate-urls.js --all
`)
  process.exit(0)
}

// Run the validator
if (require.main === module) {
  validateUrls().catch(error => {
    console.error('💥 Validation failed:', error.message)
    process.exit(1)
  })
}

module.exports = { validateUrls }
