import React from 'react'

const DefaultDocIcon = ({ style = {} }) => {
  const defaultStyle = {
    width: '32px',
    height: '32px',
    color: 'var(--product-accent-color)',
    ...style,
  }

  return (
    <svg
      style={defaultStyle}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default DefaultDocIcon
