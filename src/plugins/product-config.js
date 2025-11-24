/**
 * Shared Product Configuration
 *
 * SINGLE SOURCE OF TRUTH for current versions across all plugins and scripts.
 *
 * When updating versions:
 * 1. Update BOTH formats below (they must stay in sync)
 * 2. Normalized format: dots become dashes (11.1 → 11-1), spaces become dashes (On-Premise 2.5 → on-premise-2-5)
 * 3. Dot format: keep original version numbers (11.1, 8.0, On-Premise 2.5)
 *
 * Used by:
 * - scripts/mapping-generator.js (uses normalized format)
 * - src/plugins/replace-insights-urls.js (uses dot format)
 * - src/plugins/replace-pro-urls.js (uses dot format)
 * - src/plugins/replace-express-urls.js (uses dot format)
 */

const CURRENT_VERSIONS = {
  // For mapping generator (normalized format with dashes)
  // Used in: scripts/mapping-generator.js
  normalized: {
    actions: 'latest', // Actions only has one version
    insights: '11-1', // Current Insights version (normalized: 11.1 → 11-1)
    express: 'on-premise-2-5', // Current Express version (normalized: On-Premise 2.5 → on-premise-2-5)
    pro: '8-0', // Current Pro version (normalized: 8.0 → 8-0)
  },

  // For individual plugins (dot format)
  // Used in: replace-insights-urls.js, replace-pro-urls.js, replace-express-urls.js
  dotFormat: {
    insights: '11.1', // Current Insights version (dot format)
    pro: '8.0', // Current Pro version (dot format)
    express: 'On-Premise 2.5', // Current Express version (dot format)
    // Note: actions plugin doesn't use current version constants
  },
}

module.exports = {
  CURRENT_VERSIONS,
}
