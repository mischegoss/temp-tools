// src/utils/terminology.js
// Centralized terminology for user roles and system labels
// This allows easy future updates to branding and terminology

export const USER_ROLES = {
  // Public-facing labels (what users see)
  ADMIN_LABEL: 'Owner',
  USERS_LABEL: 'Users',
  BOTH_LABEL: 'Users & Owner',

  // Internal keys (for data structures, CSS classes, etc.)
  ADMIN_KEY: 'admin',
  USERS_KEY: 'users',

  // Filter display text
  ADMIN_CONTENT: 'Owner content',
  USERS_CONTENT: 'User content',
  ALL_CONTENT: 'All content',
}

export const FILTER_TERMINOLOGY = {
  HEADER_TEXT: 'Filter Results by User',
  ADMIN_ICON: '⚙️',
  USERS_ICON: '👤',
}

// Utility function to normalize admin/owner front matter
export const normalizeAdminKey = badges => {
  if (!badges || typeof badges !== 'object') return badges

  // If badges has 'owner' but no 'admin', copy owner to admin
  if (badges.owner && !badges.hasOwnProperty('admin')) {
    return { ...badges, admin: badges.owner }
  }

  // If badges has both, admin takes precedence for backward compatibility
  return badges
}

// Utility to get role badge configuration
export const getRoleBadgeConfig = (hasUsers, hasAdmin) => {
  if (hasUsers && hasAdmin) {
    return { label: USER_ROLES.BOTH_LABEL, type: 'both' }
  }
  if (hasAdmin && !hasUsers) {
    return { label: USER_ROLES.ADMIN_LABEL, type: 'admin' }
  }
  if (hasUsers && !hasAdmin) {
    return { label: USER_ROLES.USERS_LABEL, type: 'users' }
  }
  return null
}
