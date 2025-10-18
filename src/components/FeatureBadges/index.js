// src/components/FeatureBadges/index.js - REVISED FOR CLEAN BAR APPROACH
import React, { useEffect, useState } from 'react'
import { useLocation } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

function FeatureBadgesComponent({
  users = false,
  admin = false,
  trial = false,
  premium = false,
  enterprise = false,
}) {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)

  // Register this page's badge data with global state
  useEffect(() => {
    const pageData = {
      url: location.pathname,
      users,
      admin,
      trial,
      premium,
      enterprise,
      timestamp: Date.now(),
    }

    // Initialize global state if it doesn't exist
    if (!window.globalFilterState) {
      window.globalFilterState = {
        filters: { role: 'all', plans: [] },
        setFilters: null,
        pagesBadgeData: new Map(),
        updatePageBadges: null,
        filterChangeCallbacks: new Set(),
      }
    }

    // Register this page's badge data
    window.globalFilterState.pagesBadgeData.set(location.pathname, pageData)

    // Listen for filter changes
    const checkVisibility = () => {
      if (!window.globalFilterState?.filters) return

      const { role, plans } = window.globalFilterState.filters
      let shouldShow = true

      // Role filtering
      if (role === 'users' && !users) shouldShow = false
      if (role === 'admin' && !admin) shouldShow = false
      // 'all' role should show everything

      // Plan filtering (if any plans are selected, page must match at least one)
      if (plans.length > 0) {
        const hasMatchingPlan = plans.some(plan => {
          if (plan === 'trial' && trial) return true
          if (plan === 'premium' && premium) return true
          if (plan === 'enterprise' && enterprise) return true
          return false
        })
        if (!hasMatchingPlan) shouldShow = false
      }

      setIsVisible(shouldShow)
    }

    // Register callback for filter changes
    window.globalFilterState.filterChangeCallbacks.add(checkVisibility)

    // Check initial visibility
    checkVisibility()

    // Cleanup on unmount
    return () => {
      window.globalFilterState?.pagesBadgeData.delete(location.pathname)
      window.globalFilterState?.filterChangeCallbacks.delete(checkVisibility)
    }
  }, [location.pathname, users, admin, trial, premium, enterprise])

  // Don't render if no badges to show or filtered out
  if (!isVisible || (!users && !admin && !trial && !premium && !enterprise)) {
    return null
  }

  // Determine user role badges
  const getRoleBadges = () => {
    if (users && admin) return [{ label: 'Users & Admin', type: 'both' }]
    if (admin && !users) return [{ label: 'Admin Only', type: 'admin' }]
    if (users && !admin) return [{ label: 'Users Only', type: 'users' }]
    return []
  }

  // Determine plan badges
  const getPlanBadges = () => {
    const badges = []
    if (trial) badges.push({ label: 'Trial', type: 'trial' })
    if (premium) badges.push({ label: 'Premium', type: 'premium' })
    if (enterprise) badges.push({ label: 'Enterprise', type: 'enterprise' })
    return badges
  }

  const roleBadges = getRoleBadges()
  const planBadges = getPlanBadges()

  return (
    <div className={styles.availabilityBar}>
      <div className={styles.availabilityBadges}>
        {/* Role Badges */}
        {roleBadges.map((badge, index) => (
          <span
            key={`role-${index}`}
            className={`${styles.availabilityBadge} ${styles[badge.type]}`}
          >
            {badge.label}
          </span>
        ))}

        {/* Plan Badges */}
        {planBadges.map((badge, index) => (
          <span
            key={`plan-${index}`}
            className={`${styles.availabilityBadge} ${styles[badge.type]}`}
          >
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// Wrap in BrowserOnly to ensure it only renders in browser
export default function FeatureBadges(props) {
  return (
    <BrowserOnly>{() => <FeatureBadgesComponent {...props} />}</BrowserOnly>
  )
}
