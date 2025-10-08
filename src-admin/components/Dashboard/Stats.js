// src/components/Dashboard/Stats.js

import React, { useMemo } from 'react'

/**
 * Stats Component
 * Displays video library statistics
 *
 * Props:
 * - videos: Array of video objects
 */
const Stats = ({ videos = [] }) => {
  // Calculate statistics from videos array
  const stats = useMemo(() => {
    // Total videos
    const totalVideos = videos.length

    // Videos in learning paths
    const videosInPaths = videos.filter(
      v => v.learningPath?.isPartOfPath,
    ).length

    // Unique learning paths
    const uniquePaths = new Set(
      videos
        .filter(v => v.learningPath?.isPartOfPath)
        .map(v => v.learningPath.pathId),
    )
    const totalPaths = uniquePaths.size

    // Videos added this month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const addedThisMonth = videos.filter(v => {
      if (!v.createdAt) return false

      // Handle Firestore Timestamp objects
      let createdDate
      if (v.createdAt.toDate) {
        createdDate = v.createdAt.toDate()
      } else if (v.createdAt.seconds) {
        createdDate = new Date(v.createdAt.seconds * 1000)
      } else {
        createdDate = new Date(v.createdAt)
      }

      return createdDate >= firstDayOfMonth
    }).length

    return {
      totalVideos,
      videosInPaths,
      totalPaths,
      addedThisMonth,
    }
  }, [videos])

  return (
    <div style={styles.statsContainer}>
      {/* Total Videos */}
      <div style={styles.statCard}>
        <span style={styles.statNumber}>{stats.totalVideos}</span>
        <span style={styles.statLabel}>Total Videos</span>
      </div>

      {/* Learning Paths */}
      <div style={styles.statCard}>
        <span style={styles.statNumber}>{stats.totalPaths}</span>
        <span style={styles.statLabel}>Learning Paths</span>
      </div>

      {/* Videos in Paths */}
      <div style={styles.statCard}>
        <span style={styles.statNumber}>{stats.videosInPaths}</span>
        <span style={styles.statLabel}>In Learning Paths</span>
      </div>

      {/* Added This Month */}
      <div style={styles.statCard}>
        <span style={styles.statNumber}>{stats.addedThisMonth}</span>
        <span style={styles.statLabel}>Added This Month</span>
      </div>
    </div>
  )
}

// Styles
const styles = {
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    padding: '30px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statNumber: {
    display: 'block',
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2c5282',
    marginBottom: '8px',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500',
  },
}

export default Stats
