const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Configuration
const FILE_PATTERNS = ['**/*.{md,mdx}']
const IGNORE_PATTERNS = [
  'node_modules/**',
  'build/**',
  '.docusaurus/**',
  'static/**',
]
const VAR_PATTERN = /VAR::([A-Z_]+)/g

// Current variable definitions (if you have them)
const CURRENT_REPLACEMENTS = {
  // Add your current variables here to see which are undefined
  // 'PRODUCT': 'Resolve Actions',
  // 'COMPANY': 'Your Company',
  // etc.
}

async function discoverVariables() {
  console.log('🔍 Discovering variable usage across codebase...\n')
  const startTime = Date.now()

  // Find all files
  const allFiles = glob.sync(FILE_PATTERNS[0], { ignore: IGNORE_PATTERNS })
  console.log(`📁 Scanning ${allFiles.length} files...`)

  // Data collection
  const variableStats = new Map() // variable -> { count, files: [file paths], contexts: [] }
  const fileStats = new Map() // file -> { variables: [vars], content: snippet }
  const contexts = new Map() // variable -> [surrounding text contexts]
  const locations = new Map() // variable -> [{ file, line, column, context }]

  let totalFiles = 0
  let filesWithVariables = 0
  let totalVariableOccurrences = 0

  // Process each file
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      totalFiles++

      // Quick check
      if (!content.includes('VAR::')) {
        continue
      }

      filesWithVariables++
      const lines = content.split('\n')
      const fileVariables = new Set()

      // Find all variables with context
      let match
      const globalRegex = new RegExp(VAR_PATTERN.source, 'g')

      while ((match = globalRegex.exec(content)) !== null) {
        const varName = match[1]
        const matchIndex = match.index
        totalVariableOccurrences++

        // Track variable
        fileVariables.add(varName)

        // Update variable stats
        if (!variableStats.has(varName)) {
          variableStats.set(varName, {
            count: 0,
            files: new Set(),
            contexts: [],
            locations: [],
          })
        }

        const varStat = variableStats.get(varName)
        varStat.count++
        varStat.files.add(filePath)

        // Get context around the variable (50 chars before/after)
        const contextStart = Math.max(0, matchIndex - 50)
        const contextEnd = Math.min(
          content.length,
          matchIndex + match[0].length + 50,
        )
        const context = content
          .substring(contextStart, contextEnd)
          .replace(/\n/g, ' ')
        varStat.contexts.push(context)

        // Get line/column info
        const beforeMatch = content.substring(0, matchIndex)
        const lineNumber = beforeMatch.split('\n').length
        const columnNumber = beforeMatch.split('\n').pop().length + 1

        varStat.locations.push({
          file: filePath,
          line: lineNumber,
          column: columnNumber,
          context: context.trim(),
        })
      }

      // Track file stats
      if (fileVariables.size > 0) {
        fileStats.set(filePath, {
          variables: Array.from(fileVariables),
          variableCount: fileVariables.size,
          content: content.substring(0, 200) + '...', // First 200 chars
        })
      }
    } catch (error) {
      console.warn(`⚠️ Error reading ${filePath}: ${error.message}`)
    }
  }

  const processingTime = Date.now() - startTime

  // Generate comprehensive report
  generateReport({
    totalFiles,
    filesWithVariables,
    totalVariableOccurrences,
    variableStats,
    fileStats,
    processingTime,
    allFiles,
  })
}

function generateReport(data) {
  const {
    totalFiles,
    filesWithVariables,
    totalVariableOccurrences,
    variableStats,
    fileStats,
    processingTime,
    allFiles,
  } = data

  console.log('\n' + '='.repeat(60))
  console.log('📊 VARIABLE DISCOVERY REPORT')
  console.log('='.repeat(60))

  // Overview
  console.log('\n📈 OVERVIEW:')
  console.log(`   Total files scanned: ${totalFiles.toLocaleString()}`)
  console.log(`   Files with variables: ${filesWithVariables.toLocaleString()}`)
  console.log(
    `   Total variable occurrences: ${totalVariableOccurrences.toLocaleString()}`,
  )
  console.log(`   Unique variables found: ${variableStats.size}`)
  console.log(`   Processing time: ${processingTime}ms`)
  console.log(
    `   Impact: ${((filesWithVariables / totalFiles) * 100).toFixed(
      1,
    )}% of files use variables`,
  )

  // Most used variables
  console.log('\n🔥 MOST USED VARIABLES:')
  const sortedVars = Array.from(variableStats.entries()).sort(
    (a, b) => b[1].count - a[1].count,
  )

  sortedVars.slice(0, 10).forEach(([varName, stats], index) => {
    const isDefined = CURRENT_REPLACEMENTS.hasOwnProperty(varName)
    const status = isDefined ? '✅' : '❌'
    console.log(`   ${index + 1}. ${status} VAR::${varName}`)
    console.log(
      `      └─ ${stats.count} occurrences in ${stats.files.size} files`,
    )
  })

  // Files with most variables
  console.log('\n📄 FILES WITH MOST VARIABLES:')
  const sortedFiles = Array.from(fileStats.entries()).sort(
    (a, b) => b[1].variableCount - a[1].variableCount,
  )

  sortedFiles.slice(0, 10).forEach(([filePath, stats], index) => {
    console.log(`   ${index + 1}. ${filePath}`)
    console.log(
      `      └─ ${
        stats.variableCount
      } different variables: ${stats.variables.join(', ')}`,
    )
  })

  // Variable usage patterns
  console.log('\n🎯 VARIABLE USAGE PATTERNS:')
  sortedVars.slice(0, 5).forEach(([varName, stats]) => {
    console.log(`\n   VAR::${varName} (${stats.count} times):`)

    // Show unique contexts (max 3)
    const uniqueContexts = [...new Set(stats.contexts.map(c => c.trim()))]
    uniqueContexts.slice(0, 3).forEach(context => {
      const truncated =
        context.length > 80 ? context.substring(0, 77) + '...' : context
      console.log(`      "...${truncated}..."`)
    })

    if (uniqueContexts.length > 3) {
      console.log(`      ... and ${uniqueContexts.length - 3} more contexts`)
    }
  })

  // Undefined variables
  const undefinedVars = sortedVars.filter(
    ([varName]) => !CURRENT_REPLACEMENTS.hasOwnProperty(varName),
  )
  if (undefinedVars.length > 0) {
    console.log('\n❌ UNDEFINED VARIABLES (need replacement values):')
    undefinedVars.forEach(([varName, stats]) => {
      console.log(
        `   VAR::${varName} - ${stats.count} occurrences in ${stats.files.size} files`,
      )
    })
  }

  // Potential issues
  console.log('\n⚠️ POTENTIAL ISSUES:')

  // Variables used only once (might be typos)
  const singleUseVars = sortedVars.filter(([, stats]) => stats.count === 1)
  if (singleUseVars.length > 0) {
    console.log(
      `   Single-use variables (possible typos): ${singleUseVars.length}`,
    )
    singleUseVars.slice(0, 5).forEach(([varName, stats]) => {
      const location = stats.locations[0]
      console.log(`      VAR::${varName} in ${location.file}:${location.line}`)
    })
  }

  // Variables with suspicious patterns
  const suspiciousVars = sortedVars.filter(
    ([varName]) =>
      varName.includes('TEST') ||
      varName.includes('TODO') ||
      varName.includes('TEMP'),
  )
  if (suspiciousVars.length > 0) {
    console.log(
      `   Suspicious variables (TEST/TODO/TEMP): ${suspiciousVars.length}`,
    )
    suspiciousVars.forEach(([varName, stats]) => {
      console.log(`      VAR::${varName} - ${stats.count} occurrences`)
    })
  }

  // Performance impact analysis
  console.log('\n⚡ PERFORMANCE IMPACT ANALYSIS:')
  console.log(
    `   Files requiring processing: ${filesWithVariables} (${(
      (filesWithVariables / totalFiles) *
      100
    ).toFixed(1)}%)`,
  )
  console.log(
    `   Average variables per affected file: ${(
      totalVariableOccurrences / filesWithVariables
    ).toFixed(1)}`,
  )
  console.log(
    `   Estimated regex operations per build: ${totalVariableOccurrences.toLocaleString()}`,
  )

  const estimatedSavings = Math.round((filesWithVariables / totalFiles) * 100)
  console.log(
    `   Potential build time savings with optimization: ~${estimatedSavings}%`,
  )

  // Save detailed report
  saveDetailedReport(data)

  // Generate configuration template
  generateConfigTemplate(sortedVars)

  console.log(
    '\n✅ Discovery complete! Check the generated files for detailed analysis.',
  )
}

function saveDetailedReport(data) {
  const { variableStats, fileStats } = data

  const detailedReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: data.totalFiles,
      filesWithVariables: data.filesWithVariables,
      totalVariableOccurrences: data.totalVariableOccurrences,
      uniqueVariables: variableStats.size,
      processingTimeMs: data.processingTime,
    },
    variables: Object.fromEntries(
      Array.from(variableStats.entries()).map(([varName, stats]) => [
        varName,
        {
          count: stats.count,
          files: Array.from(stats.files),
          locations: stats.locations,
          sampleContexts: stats.contexts.slice(0, 5), // First 5 contexts
        },
      ]),
    ),
    fileStats: Object.fromEntries(fileStats.entries()),
  }

  fs.writeFileSync(
    'variable-discovery-report.json',
    JSON.stringify(detailedReport, null, 2),
  )
  console.log('\n💾 Detailed report saved to: variable-discovery-report.json')
}

function generateConfigTemplate(sortedVars) {
  const configTemplate = {
    '// GENERATED VARIABLE CONFIGURATION TEMPLATE':
      'Fill in the replacement values',
    '// Auto-generated from variable discovery': new Date().toISOString(),
    variables: {},
  }

  sortedVars.forEach(([varName, stats]) => {
    configTemplate.variables[varName] = {
      value: `TODO: Define replacement for ${varName}`,
      usage: {
        count: stats.count,
        files: stats.files.size,
        priority:
          stats.count > 10 ? 'HIGH' : stats.count > 3 ? 'MEDIUM' : 'LOW',
      },
    }
  })

  fs.writeFileSync(
    'variable-config-template.json',
    JSON.stringify(configTemplate, null, 2),
  )
  console.log('📋 Config template saved to: variable-config-template.json')
}

// Run the discovery
if (require.main === module) {
  discoverVariables().catch(console.error)
}

module.exports = { discoverVariables }
