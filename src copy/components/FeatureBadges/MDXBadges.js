// src/components/FeatureBadges/MDXBadges.js
import React, { useState, useEffect } from 'react'
import { useLocation } from '@docusaurus/router'
import BrowserOnly from '@docusaurus/BrowserOnly'

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

  if (roleBadges.length === 0 && planBadges.length === 0) {
    return null
  }

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    lineHeight: '1.2',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    whiteSpace: 'nowrap',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
  }

  const roleStyles = {
    users: { backgroundColor: '#3b82f6', color: 'white' },
    admin: { backgroundColor: '#7c3aed', color: 'white' },
    both: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
      color: 'white',
    },
  }

  const planStyles = {
    trial: { backgroundColor: '#ea580c', color: 'white' },
    premium: { backgroundColor: '#059669', color: 'white' },
    enterprise: { backgroundColor: '#1f2937', color: 'white' },
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        alignItems: 'center',
      }}
    >
      {roleBadges.map((badge, index) => (
        <span key={index} style={{ ...badgeStyle, ...roleStyles[badge.type] }}>
          {badge.label}
        </span>
      ))}
      {planBadges.map((badge, index) => (
        <span key={index} style={{ ...badgeStyle, ...planStyles[badge.type] }}>
          {badge.label}
        </span>
      ))}
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
