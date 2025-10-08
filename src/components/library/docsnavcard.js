import React from 'react'
import Link from '@docusaurus/Link'

const DocsNavCard = ({
  title,
  description,
  link,
  icon: IconComponent,
  style = {},
}) => {
  const cardStyle = {
    background: 'var(--color-bg-card-dark)',
    borderRadius: '12px',
    padding: '30px 25px',
    transition: 'all 0.3s ease',
    border: `1px solid var(--color-border-dark)`,
    borderLeft: `4px solid var(--product-accent-color)`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    ...style,
  }

  const iconContainerStyle = {
    marginBottom: '20px',
  }

  const iconStyle = {
    width: '32px',
    height: '32px',
    color: 'var(--product-accent-color)',
  }

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--color-text-white)',
    marginBottom: '12px',
    fontFamily: 'var(--ifm-font-family-heading)',
  }

  const cardDescriptionStyle = {
    color: 'var(--color-text-light)',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontFamily: 'var(--ifm-font-family-base)',
    flexGrow: 1,
  }

  const learnMoreLinkStyle = {
    color: 'var(--product-accent-color)',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.2s ease',
    marginTop: 'auto',
  }

  const arrowStyle = {
    fontSize: '1.2rem',
  }

  // Default icon if none provided
  const DefaultIcon = () => (
    <svg
      style={iconStyle}
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

  return (
    <div style={cardStyle}>
      <div style={iconContainerStyle}>
        {IconComponent ? <IconComponent style={iconStyle} /> : <DefaultIcon />}
      </div>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={cardDescriptionStyle}>{description}</p>
      <Link to={link} style={learnMoreLinkStyle}>
        Learn More <span style={arrowStyle}>›</span>
      </Link>
    </div>
  )
}

export default DocsNavCard
