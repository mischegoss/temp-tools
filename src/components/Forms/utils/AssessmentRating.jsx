import React from 'react'

/**
 * A reusable component for displaying assessment ratings and scores
 *
 * @param {Object} props
 * @param {number} props.score - The score value as a percentage (0-100)
 * @param {string} props.ratingTitle - The title of the rating
 * @param {string} props.ratingDescription - The detailed description of the rating
 * @param {Object} props.styles - The styles object
 * @param {boolean} props.showStars - Whether to show star rating (default: true)
 * @param {Object} props.additionalContent - Any additional content to display
 */
const AssessmentRating = ({
  score,
  ratingTitle,
  ratingDescription,
  styles,
  showStars = true,
  additionalContent = null,
}) => {
  // Generate star rating based on score
  const getStarRating = score => {
    if (score === 0) return '☆☆☆☆☆'
    if (score >= 80) return '★★★★★'
    if (score >= 60) return '★★★★☆'
    if (score >= 40) return '★★★☆☆'
    return '★★☆☆☆'
  }

  // Brand-compliant inline styles
  const brandStyles = {
    ratingTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black)',
    },
    ratingDescription: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black-700)',
      lineHeight: '1.6',
    },
  }

  return (
    <div style={styles.scoreDisplay}>
      <div style={styles.scoreValue}>{score.toFixed(1)}%</div>

      {showStars && <div style={styles.starRating}>{getStarRating(score)}</div>}

      {ratingTitle && <p style={brandStyles.ratingTitle}>{ratingTitle}</p>}

      {ratingDescription && (
        <p style={brandStyles.ratingDescription}>{ratingDescription}</p>
      )}

      {additionalContent}
    </div>
  )
}

export default AssessmentRating
