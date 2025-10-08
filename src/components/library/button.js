import React from 'react'
import Link from '@docusaurus/Link'

const Button = ({
  children,
  to,
  variant = 'primary',
  size = 'medium',
  style = {},
  ...props
}) => {
  const baseButtonStyle = {
    padding:
      size === 'large'
        ? '16px 32px'
        : size === 'small'
        ? '8px 16px'
        : '12px 24px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    fontFamily: 'var(--ifm-font-family-base)',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
    ...style,
  }

  const variantStyles = {
    primary: {
      background: '#008a9e', // CHANGED: Darker teal to match homepage gradient
      color: 'var(--color-text-white)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--brand-aqua)',
      border: '2px solid var(--ifm-color-primary)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--brand-aqua)',
      border: '1px solid var(--color-border-light)',
    },
  }

  const buttonStyle = {
    ...baseButtonStyle,
    ...variantStyles[variant],
  }

  if (to) {
    return (
      <Link to={to} style={buttonStyle} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button style={buttonStyle} {...props}>
      {children}
    </button>
  )
}

export default Button
