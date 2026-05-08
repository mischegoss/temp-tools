// src/components/FeatureBadges/MDXBadges.js - UPDATED WITH OWNER TERMINOLOGY
import React, { useState, useEffect } from 'react'
import { useLocation } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'
import { normalizeAdminKey, getRoleBadgeConfig } from '../../utils/terminology'

function FeatureBadgesComponent() {
  const location = useLocation()
  const [badges, setBadges] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBadgeData = async () => {
      try {
        // FIXED: Use badgeData.json instead of filterableData.json
        const response = await fetch('/data/badgeData.json')
        if (response.ok) {
          const badgeData = await response.json()
          // FIXED: Direct lookup instead of array find
          const rawBadges = badgeData[location.pathname]

          if (rawBadges) {
            // UPDATED: Normalize admin/owner front matter before using
            const normalizedBadges = normalizeAdminKey(rawBadges)
            setBadges(normalizedBadges)
          } else {
            setBadges(null)
          }
        }
      } catch (error) {
        console.error('Failed to load badge data:', error)
        setBadges(null)
      } finally {
        setLoading(false)
      }
    }

    loadBadgeData()
  }, [location.pathname])

  if (loading || !badges) {
    return null
  }

  // UPDATED: Use centralized role badge configuration
  const getRoleBadges = () => {
    const roleConfig = getRoleBadgeConfig(badges.users, badges.admin)
    return roleConfig ? [roleConfig] : []
  }

  // Determine plan badges (unchanged)
  const getPlanBadges = () => {
    const planBadges = []
    if (badges.trial) planBadges.push({ label: 'Trial', type: 'trial' })
    if (badges.premium) planBadges.push({ label: 'Premium', type: 'premium' })
    if (badges.enterprise)
      planBadges.push({ label: 'Enterprise', type: 'enterprise' })
    return planBadges
  }

  const roleBadges = getRoleBadges()
  const planBadges = getPlanBadges()

  // Don't show anything if no badges
  if (roleBadges.length === 0 && planBadges.length === 0) {
    return null
  }

  // Determine if we need a divider (both sections present)
  const needsDivider = roleBadges.length > 0 && planBadges.length > 0

  return (
    <div className={styles.badgeBar}>
      <div className={styles.badgeBox}>
        {/* Who Section - Only show if role badges exist */}
        {roleBadges.length > 0 && (
          <div className={styles.badgeSection}>
            <span className={styles.badgeLabel}>Who:</span>
            <div className={styles.badgeList}>
              {roleBadges.map((badge, index) => (
                <span
                  key={`role-${index}`}
                  className={`${styles.badge} ${styles[badge.type]}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Plans Section - Only show if plan badges exist */}
        {planBadges.length > 0 && (
          <div
            className={`${styles.badgeSection} ${
              needsDivider ? styles.withDivider : ''
            }`}
          >
            <span className={styles.badgeLabel}>Plans:</span>
            <div className={styles.badgeList}>
              {planBadges.map((badge, index) => (
                <span
                  key={`plan-${index}`}
                  className={`${styles.badge} ${styles[badge.type]}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FeatureBadges() {
  return (
    <BrowserOnly fallback={null}>
      {() => <FeatureBadgesComponent />}
    </BrowserOnly>
  )
}
