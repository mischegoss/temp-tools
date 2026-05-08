#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// ============================================
// CONFIGURATION - Change this if branding changes
// ============================================
const OLD_BRAND_NAME = 'Rita Go' // What to replace
const NEW_BRAND_NAME = 'RITA Go' // What to replace it with

// ============================================
// Auto-generated replacements based on brand names above
// ============================================
function createVisibleTextReplacements(oldName, newName) {
  // Helper function to escape regex special characters
  const escapeRegex = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const escapedOldName = escapeRegex(oldName)
  const escapedNewName = escapeRegex(newName)

  return [
    // Hero data - titles and descriptions
    {
      pattern: new RegExp(`title: '${escapedOldName}',`, 'g'),
      replacement: `title: '${newName}',`,
    },
    {
      pattern: new RegExp(
        `title: 'Get Started with ${escapedOldName} Docs',`,
        'g',
      ),
      replacement: `title: 'Get Started with ${newName} Docs',`,
    },
    {
      pattern: new RegExp(
        `title: 'Explore ${escapedOldName} Video Library',`,
        'g',
      ),
      replacement: `title: 'Explore ${newName} Video Library',`,
    },
    {
      pattern: new RegExp(
        `title: 'Get Early Access to ${escapedOldName}',`,
        'g',
      ),
      replacement: `title: 'Get Early Access to ${newName}',`,
    },
    {
      pattern: new RegExp(`text: 'Explore ${escapedOldName} Docs',`, 'g'),
      replacement: `text: 'Explore ${newName} Docs',`,
    },
    {
      pattern: new RegExp(
        `description: 'Explore ${escapedOldName} features and capabilities',`,
        'g',
      ),
      replacement: `description: 'Explore ${newName} features and capabilities',`,
    },

    // Layout titles and descriptions
    {
      pattern: new RegExp(
        `<Layout title='${escapedOldName} Documentation'`,
        'g',
      ),
      replacement: `<Layout title='${newName} Documentation'`,
    },
    {
      pattern: new RegExp(
        `description='${escapedOldName} Documentation'>`,
        'g',
      ),
      replacement: `description='${newName} Documentation'>`,
    },

    // Page content - visible text in strings (more comprehensive patterns)
    {
      pattern: new RegExp(
        `The comprehensive ${escapedNewName} help documentation is currently being prepared\\. In the meantime, learn about ${escapedOldName} and join the early access waitlist\\.`,
        'g',
      ),
      replacement: `The comprehensive ${newName} help documentation is currently being prepared. In the meantime, learn about ${newName} and join the early access waitlist.`,
    },
    {
      pattern: new RegExp(
        `This section will contain the complete ${escapedOldName} documentation`,
        'g',
      ),
      replacement: `This section will contain the complete ${newName} documentation`,
    },
    {
      pattern: new RegExp(
        `you can learn about ${escapedOldName}'s capabilities`,
        'g',
      ),
      replacement: `you can learn about ${newName}'s capabilities`,
    },
    {
      pattern: new RegExp(`your first ${escapedOldName} deployment`, 'g'),
      replacement: `your first ${newName} deployment`,
    },
    {
      pattern: new RegExp(`keep ${escapedOldName} running smoothly`, 'g'),
      replacement: `keep ${newName} running smoothly`,
    },

    // Search component mock data - comprehensive patterns
    {
      pattern: new RegExp(
        `title: 'Getting Started with ${escapedOldName}',`,
        'g',
      ),
      replacement: `title: 'Getting Started with ${newName}',`,
    },
    {
      pattern: new RegExp(
        `breadcrumbs: '${escapedOldName} > Getting Started',`,
        'g',
      ),
      replacement: `breadcrumbs: '${newName} > Getting Started',`,
    },
    {
      pattern: new RegExp(
        `breadcrumbs: '${escapedOldName} > Knowledge Base',`,
        'g',
      ),
      replacement: `breadcrumbs: '${newName} > Knowledge Base',`,
    },
    {
      pattern: new RegExp(
        `breadcrumbs: '${escapedOldName} > User Management',`,
        'g',
      ),
      replacement: `breadcrumbs: '${newName} > User Management',`,
    },
    {
      pattern: new RegExp(
        `Learn the basics of ${escapedOldName} and how to get started`,
        'g',
      ),
      replacement: `Learn the basics of ${newName} and how to get started`,
    },
    {
      pattern: new RegExp(
        `Learn the basics of ${escapedOldName} and how to get started\\.\\.\\.`,
        'g',
      ),
      replacement: `Learn the basics of ${newName} and how to get started...`,
    },
    {
      pattern: new RegExp(
        `placeholder='Search ${escapedOldName}\\.\\.\\.'`,
        'g',
      ),
      replacement: `placeholder='Search ${newName}...'`,
    },

    // Additional page content patterns
    {
      pattern: new RegExp(`learn about ${escapedOldName} and join`, 'g'),
      replacement: `learn about ${newName} and join`,
    },
    {
      pattern: new RegExp(
        `about ${escapedOldName} and join the early access`,
        'g',
      ),
      replacement: `about ${newName} and join the early access`,
    },
    {
      pattern: new RegExp(
        `preparing the comprehensive help documentation, you can learn about ${escapedOldName}'s`,
        'g',
      ),
      replacement: `preparing the comprehensive help documentation, you can learn about ${newName}'s`,
    },

    // Generic patterns for visible text (more specific to avoid false positives)
    {
      pattern: new RegExp(`'${escapedOldName}'`, 'g'),
      replacement: `'${newName}'`,
    },
    {
      pattern: new RegExp(`"${escapedOldName}"`, 'g'),
      replacement: `"${newName}"`,
    },

    // CSS comment patterns (keep these visible comments updated too)
    {
      pattern: new RegExp(`${escapedOldName} Search Component`, 'g'),
      replacement: `${newName} Search Component`,
    },
    {
      pattern: new RegExp(`using ${escapedOldName} colors`, 'g'),
      replacement: `using ${newName} colors`,
    },
    {
      pattern: new RegExp(`\\* ${escapedOldName} Search Component`, 'g'),
      replacement: `* ${newName} Search Component`,
    },
  ]
}

const VISIBLE_TEXT_REPLACEMENTS = createVisibleTextReplacements(
  OLD_BRAND_NAME,
  NEW_BRAND_NAME,
)

// Files to target (only files that contain visible text)
const TARGET_FILES = [
  'components/RitaGo/data/herodata.js',
  'components/RitaGo/data/ritagodocsdata.js',
  'pages/rita-go/beta2025.js',
  'pages/rita-go/index.js',
  'components/RitaGoSearch/index.js',
]

function replaceInFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      return false
    }

    let content = fs.readFileSync(filePath, 'utf8')
    let changed = false
    let changeCount = 0

    // Apply each replacement pattern
    VISIBLE_TEXT_REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const beforeLength = content.length
      content = content.replace(pattern, replacement)
      if (content.length !== beforeLength || pattern.test(content)) {
        const matches = (content.match(pattern) || []).length
        if (matches > 0) {
          changeCount += matches
          changed = true
        }
      }
    })

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Updated ${filePath} (${changeCount} replacements)`)
      return true
    } else {
      console.log(`➖ No changes needed in ${filePath}`)
      return false
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    return false
  }
}

function main() {
  console.log(
    `🚀 Starting ${OLD_BRAND_NAME} → ${NEW_BRAND_NAME} text replacement...\n`,
  )

  // Change to the src directory
  const srcDir = './src'
  if (!fs.existsSync(srcDir)) {
    console.error(
      '❌ src directory not found! Please run this script from the project root.',
    )
    process.exit(1)
  }

  let totalFiles = 0
  let changedFiles = 0

  TARGET_FILES.forEach(relativeFilePath => {
    totalFiles++
    const fullPath = path.join(srcDir, relativeFilePath)

    console.log(`🔍 Processing: ${relativeFilePath}`)

    if (replaceInFile(fullPath)) {
      changedFiles++
    }
  })

  console.log('\n📊 Summary:')
  console.log(`   Files processed: ${totalFiles}`)
  console.log(`   Files changed: ${changedFiles}`)
  console.log(`   Files unchanged: ${totalFiles - changedFiles}`)

  if (changedFiles > 0) {
    console.log(
      `\n✨ All visible "${OLD_BRAND_NAME}" text has been updated to "${NEW_BRAND_NAME}"!`,
    )
    console.log(
      '🔧 Note: CSS class names and internal code references were left unchanged.',
    )
  } else {
    console.log(
      `\n✨ All files already have the correct "${NEW_BRAND_NAME}" text formatting.`,
    )
  }
}

main()
