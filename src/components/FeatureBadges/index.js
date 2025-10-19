// src/components/FeatureBadges/index.js - PURE DISPLAY COMPONENT
import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

function FeatureBadgesComponent({
  users = false,
  admin = false,
  trial = false,
  premium = false,
  enterprise = false,
}) {
  // Don't render if no badges to show
  if (!users && !admin && !trial && !premium && !enterprise) {
    return null
  }

  // Determine user role badges
  const getRoleBadges = () => {
    if (users && admin) return [{ label: 'Users & Admin', type: 'both' }]
    if (admin && !users) return [{ label: 'Admin', type: 'admin' }]
    if (users && !admin) return [{ label: 'Users', type: 'users' }]
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
    <div className={styles.badgeBar}>
      <div className={styles.badgeContainer}>
        {roleBadges.map((badge, index) => (
          <span key={index} className={`${styles.badge} ${styles[badge.type]}`}>
            {badge.label}
          </span>
        ))}
        {planBadges.map((badge, index) => (
          <span key={index} className={`${styles.badge} ${styles[badge.type]}`}>
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FeatureBadges(props) {
  return (
    <BrowserOnly fallback={null}>
      {() => <FeatureBadgesComponent {...props} />}
    </BrowserOnly>
  )
}
