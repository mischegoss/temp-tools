// src/components/FeatureBadges/MDXBadges.js - FINAL VERSION WITH GREY CONTAINER AND DIVIDER
import React, { useState, useEffect } from 'react'
import { useLocation } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

function FeatureBadgesComponent() {
  const location = useLocation()
  const [badges, setBadges] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBadgeData = async () => {
      try {
        const response = await fetch('/data/filterableData.json')
        if (response.ok) {
          const filterableData = await response.json()
          const currentPage = filterableData.find(
            page => page.url === location.pathname,
          )

          if (currentPage && currentPage.badges) {
            setBadges(currentPage.badges)
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

  // Determine user role badges
  const getRoleBadges = () => {
    if (badges.users && badges.admin)
      return [{ label: 'Users & Admin', type: 'both' }]
    if (badges.admin && !badges.users)
      return [{ label: 'Admin', type: 'admin' }]
    if (badges.users && !badges.admin)
      return [{ label: 'Users', type: 'users' }]
    return []
  }

  // Determine plan badges
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
