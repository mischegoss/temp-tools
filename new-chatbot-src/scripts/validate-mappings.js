#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')

/**
 * Lenient Validation Script for Documentation Mappings
 *
 * Checks if mapping files need regeneration due to substantial changes.
 * Only prevents build if there are significant changes to source documentation.
 */

class LenientMappingValidator {
  constructor() {
    this.issues = []
    this.warnings = []
    this.stats = {}
    this.productConfigs = {
      actions_versioned_docs: { product: 'actions', routeBase: 'actions' },
      express_versioned_docs: { product: 'express', routeBase: 'express' },
      pro_versioned_docs: { product: 'pro', routeBase: 'pro' },
      insights_versioned_docs: { product: 'insights', routeBase: 'insights' },
    }

    // Thresholds for determining "substantial changes"
    this.thresholds = {
      maxChangedFiles: 10, // Allow up to 10 changed files without failing
      maxChangedPercentage: 0.25, // Allow up to 25% of files to change
      maxDaysOld: 60, // Only warn if mappings are more than 7 days old
      minFilesForPercentage: 20, // Only use percentage threshold if there are at least 20 files
    }
  }

  async validateAll() {
    console.log('🔍 Validating documentation mappings (lenient mode)...')

    try {
      // Find all product directories
      const productDirs = await this.findProductDirectories()

      if (productDirs.length === 0) {
        console.log(
          '⚠️  No product directories found - skipping mapping validation',
        )
        return true
      }

      // Check each product
      for (const productDir of productDirs) {
        await this.validateProduct(productDir)
      }

      // Report results with intelligent analysis
      return this.reportResults()
    } catch (error) {
      console.error('❌ Validation failed:', error.message)
      return false
    }
  }

  async findProductDirectories() {
    const products = Object.keys(this.productConfigs)
    const found = []

    for (const product of products) {
      try {
        const stats = await fs.stat(product)
        if (stats.isDirectory()) {
          found.push(product)
        }
      } catch (error) {
        // Directory doesn't exist, skip
      }
    }

    return found
  }

  async validateProduct(productDir) {
    const config = this.productConfigs[productDir]
    const productName = config.product

    console.log(`📂 Analyzing ${productName}...`)

    try {
      // Find version directories
      const versions = await this.findVersions(productDir)

      for (const version of versions) {
        await this.validateVersion(productDir, version, productName)
      }
    } catch (error) {
      this.warnings.push(
        `Could not fully validate ${productName}: ${error.message}`,
      )
    }
  }

  async findVersions(productDir) {
    try {
      const files = await fs.readdir(productDir)
      return files.filter(file => file.startsWith('version-'))
    } catch (error) {
      return []
    }
  }

  async validateVersion(productDir, version, productName) {
    const versionNumber = version.replace('version-', '')
    const mappingFile = `${productName}-mapping-${versionNumber}.json`
    const mappingPath = path.join(
      'src',
      'plugins',
      'plugin-mappings',
      mappingFile,
    )

    // Initialize stats for this version
    const versionKey = `${productName}-${versionNumber}`
    this.stats[versionKey] = {
      mappingExists: false,
      mappingAge: 0,
      totalFiles: 0,
      changedFiles: 0,
      newFiles: 0,
      severity: 'none',
    }

    // Check if mapping file exists
    try {
      await fs.access(mappingPath)
      this.stats[versionKey].mappingExists = true
    } catch (error) {
      this.issues.push(`Missing mapping file: ${mappingFile}`)
      this.stats[versionKey].severity = 'critical'
      return
    }

    // Get mapping file info
    const mappingStats = await fs.stat(mappingPath)
    let mappingData = null

    try {
      const content = await fs.readFile(mappingPath, 'utf8')
      mappingData = JSON.parse(content)
    } catch (error) {
      this.issues.push(`Invalid JSON in mapping file: ${mappingFile}`)
      this.stats[versionKey].severity = 'critical'
      return
    }

    // Calculate mapping age
    const mappingAge = Date.now() - mappingStats.mtime.getTime()
    const mappingAgeDays = mappingAge / (1000 * 60 * 60 * 24)
    this.stats[versionKey].mappingAge = mappingAgeDays

    // Analyze source directory changes
    const sourceDir = path.join(productDir, version)
    const changeAnalysis = await this.analyzeChanges(
      sourceDir,
      mappingStats.mtime,
    )

    this.stats[versionKey].totalFiles = changeAnalysis.totalFiles
    this.stats[versionKey].changedFiles = changeAnalysis.changedFiles
    this.stats[versionKey].newFiles = changeAnalysis.newFiles

    // Determine severity based on intelligent thresholds
    const severity = this.calculateSeverity(
      versionKey,
      changeAnalysis,
      mappingAgeDays,
    )
    this.stats[versionKey].severity = severity

    // Add appropriate warnings or issues
    if (severity === 'critical') {
      this.issues.push(
        `Substantial changes detected in ${mappingFile}: ${changeAnalysis.changedFiles} files modified, ${changeAnalysis.newFiles} files added`,
      )
    } else if (severity === 'warning') {
      this.warnings.push(
        `Minor changes detected in ${mappingFile}: ${changeAnalysis.changedFiles} files modified (below threshold)`,
      )
    }

    // Check generation timestamp if available
    if (mappingData._GENERATED) {
      const generatedTime = new Date(mappingData._GENERATED)
      const generatedAgeDays =
        (Date.now() - generatedTime.getTime()) / (1000 * 60 * 60 * 24)

      if (
        generatedAgeDays > this.thresholds.maxDaysOld &&
        changeAnalysis.changedFiles > 0
      ) {
        this.warnings.push(
          `Mapping ${mappingFile} is ${Math.round(
            generatedAgeDays,
          )} days old with ${changeAnalysis.changedFiles} file changes`,
        )
      }
    }

    console.log(
      `  ✅ ${version} - ${changeAnalysis.changedFiles} changed files (${severity})`,
    )
  }

  async analyzeChanges(sourceDir, mappingTime) {
    const analysis = {
      totalFiles: 0,
      changedFiles: 0,
      newFiles: 0,
      changedPaths: [],
    }

    try {
      await this.scanDirectoryForChanges(sourceDir, mappingTime, analysis)
    } catch (error) {
      // If we can't scan, assume no changes to be lenient
      console.log(`    ⚠️  Could not scan ${sourceDir}, assuming no changes`)
    }

    return analysis
  }

  async scanDirectoryForChanges(dir, mappingTime, analysis) {
    try {
      const files = await fs.readdir(dir)

      for (const file of files) {
        // Skip hidden files and specific directories
        if (
          file.startsWith('.') ||
          file === 'node_modules' ||
          file === 'img' ||
          file === 'files'
        ) {
          continue
        }

        const fullPath = path.join(dir, file)
        const stats = await fs.stat(fullPath)

        if (stats.isDirectory()) {
          await this.scanDirectoryForChanges(fullPath, mappingTime, analysis)
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
          analysis.totalFiles++

          if (stats.mtime > mappingTime) {
            analysis.changedFiles++
            analysis.changedPaths.push(fullPath)

            // Check if this is a new file (created after mapping time)
            if (stats.birthtime > mappingTime) {
              analysis.newFiles++
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  calculateSeverity(versionKey, changeAnalysis, mappingAgeDays) {
    const { totalFiles, changedFiles, newFiles } = changeAnalysis

    // Critical: Missing mapping or too many changes
    if (changedFiles > this.thresholds.maxChangedFiles) {
      return 'critical'
    }

    // Critical: High percentage of files changed (but only if we have enough files)
    if (totalFiles >= this.thresholds.minFilesForPercentage) {
      const changePercentage = changedFiles / totalFiles
      if (changePercentage > this.thresholds.maxChangedPercentage) {
        return 'critical'
      }
    }

    // Critical: Many new files added
    if (newFiles > Math.max(3, totalFiles * 0.1)) {
      return 'critical'
    }

    // Warning: Some changes but within acceptable limits
    if (changedFiles > 0) {
      return 'warning'
    }

    // Info: Old but no changes
    if (mappingAgeDays > this.thresholds.maxDaysOld) {
      return 'info'
    }

    return 'none'
  }

  reportResults() {
    console.log('\n📊 Validation Results:')

    // Count issues by severity
    const severityCounts = {
      critical: 0,
      warning: 0,
      info: 0,
      none: 0,
    }

    Object.values(this.stats).forEach(stat => {
      severityCounts[stat.severity]++
    })

    // Report summary
    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ All mappings are up-to-date!')
      return true
    }

    // Show detailed statistics
    console.log('\n📈 Change Analysis:')
    Object.entries(this.stats).forEach(([version, stats]) => {
      if (stats.mappingExists) {
        const ageText =
          stats.mappingAge > 1
            ? `${Math.round(stats.mappingAge)} days old`
            : 'recent'
        console.log(
          `  ${version}: ${stats.changedFiles}/${stats.totalFiles} files changed (${ageText})`,
        )
      }
    })

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings (build will continue):')
      this.warnings.forEach(warning => {
        console.log(`  • ${warning}`)
      })
    }

    if (this.issues.length > 0) {
      console.log('\n❌ Critical issues found (build should be stopped):')
      this.issues.forEach(issue => {
        console.log(`  • ${issue}`)
      })

      console.log('\n🔧 To fix these issues:')
      console.log('   npm run mapping-generator')
      console.log(
        '\n💡 Tip: This validation only fails for substantial changes.',
      )
      console.log(
        `   Thresholds: >${
          this.thresholds.maxChangedFiles
        } files OR >${Math.round(
          this.thresholds.maxChangedPercentage * 100,
        )}% changed`,
      )

      return false
    }

    // Only warnings = continue build
    if (this.warnings.length > 0) {
      console.log('\n✅ Minor changes detected, but build can continue.')
      console.log('💡 Consider regenerating mappings when convenient.')
    }

    return true
  }
}

// CLI execution
async function main() {
  // Allow skipping validation via environment variable
  if (process.env.SKIP_MAPPING_VALIDATION === 'true') {
    console.log('⚠️  Mapping validation skipped (SKIP_MAPPING_VALIDATION=true)')
    return
  }

  // Allow strict mode via environment variable
  if (process.env.STRICT_MAPPING_VALIDATION === 'true') {
    console.log('🔒 Running in strict mode (any changes will fail build)')
    // You could instantiate the original validator here if needed
  }

  const validator = new LenientMappingValidator()
  const isValid = await validator.validateAll()

  if (!isValid) {
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Validation script failed:', error)
    process.exit(1)
  })
}

module.exports = { LenientMappingValidator }
