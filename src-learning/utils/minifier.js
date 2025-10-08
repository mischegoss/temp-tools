#!/usr/bin/env node

/**
 * Simple JSON Minifier using Node.js built-ins
 * Zero dependencies, maximum reliability for Node 18+
 * Used by mapping generators for protection against manual editing
 */

const fs = require('fs').promises
const path = require('path')

class JsonMinifier {
  constructor(options = {}) {
    this.createBackups = options.createBackups !== false // Default to true
    this.verbose = options.verbose || false
    this.stats = {
      filesProcessed: 0,
      originalSize: 0,
      minifiedSize: 0,
    }
  }

  /**
   * Add protection headers to discourage manual editing
   */
  addProtectionHeaders(data) {
    return {
      _WARNING: '🚨 MINIFIED AUTO-GENERATED FILE - DO NOT EDIT MANUALLY! 🚨',
      _MINIFIED: new Date().toISOString(),
      _REGENERATE:
        'Run mapping generator scripts to regenerate readable version',
      _HUMAN_READABLE: 'Readable backups stored in backup/ directory',
      ...data,
    }
  }

  /**
   * Minify JSON data (object or string)
   */
  minifyJsonData(data) {
    let parsedData

    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data)
      } catch (error) {
        throw new Error(`Invalid JSON string: ${error.message}`)
      }
    } else if (typeof data === 'object' && data !== null) {
      parsedData = data
    } else {
      throw new Error('Data must be a JSON string or object')
    }

    // Add protection headers
    const protectedData = this.addProtectionHeaders(parsedData)

    // Minify using built-in JSON.stringify (no spaces, no indentation)
    return JSON.stringify(protectedData)
  }

  /**
   * Minify a JSON file in place
   */
  async minifyFile(filePath) {
    if (this.verbose) {
      console.log(`🔧 Minifying: ${path.basename(filePath)}`)
    }

    try {
      // Read original file
      const originalContent = await fs.readFile(filePath, 'utf8')
      const originalSize = Buffer.byteLength(originalContent, 'utf8')

      // Create backup if enabled
      if (this.createBackups) {
        await this.createBackup(filePath, originalContent)
      }

      // Minify the content
      const minifiedContent = this.minifyJsonData(originalContent)
      const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8')

      // Write minified version
      await fs.writeFile(filePath, minifiedContent, 'utf8')

      // Update stats
      this.updateStats(originalSize, minifiedSize)

      if (this.verbose) {
        const savedPercent = (
          ((originalSize - minifiedSize) / originalSize) *
          100
        ).toFixed(1)
        console.log(
          `  ✅ ${this.formatBytes(originalSize)} → ${this.formatBytes(
            minifiedSize,
          )} (-${savedPercent}%)`,
        )
      }

      return {
        originalSize,
        minifiedSize,
        savedBytes: originalSize - minifiedSize,
      }
    } catch (error) {
      console.error(`❌ Error minifying ${filePath}: ${error.message}`)
      throw error
    }
  }

  /**
   * Create human-readable backup
   */
  async createBackup(filePath, content) {
    const backupDir = path.join(path.dirname(filePath), 'backup')
    await fs.mkdir(backupDir, { recursive: true })

    const fileName = path.basename(filePath)
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, '-')
    const backupFileName = `${fileName}.readable.${timestamp}.json`
    const backupPath = path.join(backupDir, backupFileName)

    // Parse and reformat for readability
    try {
      const data = JSON.parse(content)
      const readableContent = JSON.stringify(data, null, 2)
      await fs.writeFile(backupPath, readableContent, 'utf8')

      if (this.verbose) {
        console.log(`  📋 Backup: backup/${backupFileName}`)
      }
    } catch (error) {
      // If parsing fails, just copy the original content
      await fs.writeFile(backupPath, content, 'utf8')
    }
  }

  /**
   * Update statistics
   */
  updateStats(originalSize, minifiedSize) {
    this.stats.filesProcessed++
    this.stats.originalSize += originalSize
    this.stats.minifiedSize += minifiedSize
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    const saved = this.stats.originalSize - this.stats.minifiedSize
    const savedPercent =
      this.stats.originalSize > 0
        ? ((saved / this.stats.originalSize) * 100).toFixed(1)
        : '0'

    return {
      filesProcessed: this.stats.filesProcessed,
      originalSize: this.stats.originalSize,
      minifiedSize: this.stats.minifiedSize,
      savedBytes: saved,
      savedPercent: savedPercent,
    }
  }

  /**
   * Print summary statistics
   */
  printSummary() {
    const summary = this.getSummary()

    console.log('\n📊 Minification Summary:')
    console.log(`  Files processed: ${summary.filesProcessed}`)
    console.log(`  Original size: ${this.formatBytes(summary.originalSize)}`)
    console.log(`  Minified size: ${this.formatBytes(summary.minifiedSize)}`)
    console.log(
      `  Space saved: ${this.formatBytes(summary.savedBytes)} (${
        summary.savedPercent
      }%)`,
    )
    console.log(`  🛡️  Files are now protected from casual editing`)
    if (this.createBackups) {
      console.log(`  📋 Readable backups stored in backup/ directories`)
    }
  }

  /**
   * Format bytes for display
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      filesProcessed: 0,
      originalSize: 0,
      minifiedSize: 0,
    }
  }
}

module.exports = { JsonMinifier }
