// variable-injector.js - ESM version for Docusaurus 3.7+
import { visit } from 'unist-util-visit'

const plugin = (options = {}) => {
  // Validate options
  if (!options.replacements || typeof options.replacements !== 'object') {
    throw new Error('Variable injector plugin requires a replacements object')
  }

  // Create a regex pattern once, rather than on each node
  const variablePattern = /VAR::([A-Z_]+)/g

  // Create a replacements cache
  const cache = new Map()

  const transformer = ast => {
    visit(ast, 'text', node => {
      if (typeof node.value !== 'string') return

      node.value = node.value.replace(variablePattern, (match, varName) => {
        // Check cache first
        if (cache.has(varName)) {
          return cache.get(varName)
        }

        const replacement = options.replacements[varName]
        const result = replacement !== undefined ? replacement : match
        cache.set(varName, result)
        return result
      })
    })
  }
  return transformer
}

export default plugin
