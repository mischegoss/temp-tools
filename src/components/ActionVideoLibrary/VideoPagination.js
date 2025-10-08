// @site/src/components/ActionVideoLibrary/VideoPagination.js

import React from 'react'

/**
 * VideoPagination component - Pagination controls for video gallery
 * Styled to match the Actions theme
 */
const VideoPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render if only one page or no pages
  if (totalPages <= 1) {
    return null
  }

  // Container styles
  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '40px',
    fontFamily: 'var(--ifm-font-family-base)',
  }

  // Button base styles
  const baseButtonStyle = {
    padding: '8px 16px',
    border: '1px solid var(--brand-grey-200)',
    background: 'var(--brand-white)',
    color: 'var(--brand-grey-600)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--ifm-font-family-base)',
    outline: 'none',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40px',
  }

  // Active button styles
  const activeButtonStyle = {
    ...baseButtonStyle,
    background: 'var(--brand-blue)',
    color: 'var(--brand-white)',
    borderColor: 'var(--brand-blue)',
  }

  // Disabled button styles
  const disabledButtonStyle = {
    ...baseButtonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  }

  // Hover styles
  const getHoverStyle = isActive => ({
    ...baseButtonStyle,
    ...(isActive
      ? activeButtonStyle
      : {
          background: 'var(--brand-blue)',
          color: 'var(--brand-white)',
          borderColor: 'var(--brand-blue)',
        }),
  })

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages = []
    const showPages = 5 // Maximum number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show subset with current page in center when possible
      let start = Math.max(1, currentPage - Math.floor(showPages / 2))
      let end = start + showPages - 1

      if (end > totalPages) {
        end = totalPages
        start = Math.max(1, end - showPages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = page => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div style={paginationStyle}>
      {/* Previous Button */}
      <button
        style={currentPage === 1 ? disabledButtonStyle : baseButtonStyle}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        onMouseEnter={e => {
          if (currentPage !== 1) {
            Object.assign(e.target.style, getHoverStyle(false))
          }
        }}
        onMouseLeave={e => {
          if (currentPage !== 1) {
            Object.assign(e.target.style, baseButtonStyle)
          }
        }}
      >
        ‹ Previous
      </button>

      {/* Page Numbers */}
      {visiblePages.map(page => (
        <button
          key={page}
          style={page === currentPage ? activeButtonStyle : baseButtonStyle}
          onClick={() => handlePageClick(page)}
          onMouseEnter={e => {
            Object.assign(e.target.style, getHoverStyle(page === currentPage))
          }}
          onMouseLeave={e => {
            Object.assign(
              e.target.style,
              page === currentPage ? activeButtonStyle : baseButtonStyle,
            )
          }}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        style={
          currentPage === totalPages ? disabledButtonStyle : baseButtonStyle
        }
        onClick={handleNext}
        disabled={currentPage === totalPages}
        onMouseEnter={e => {
          if (currentPage !== totalPages) {
            Object.assign(e.target.style, getHoverStyle(false))
          }
        }}
        onMouseLeave={e => {
          if (currentPage !== totalPages) {
            Object.assign(e.target.style, baseButtonStyle)
          }
        }}
      >
        Next ›
      </button>
    </div>
  )
}

export default VideoPagination
