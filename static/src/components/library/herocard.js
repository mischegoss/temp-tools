import React from 'react'
import Link from '@docusaurus/Link'

const HeroCard = ({ title, description, links, style = {} }) => {
  const cardStyle = {
    background: 'var(--color-bg-card-light)',
    borderRadius: '12px',
    padding: '30px 25px',
    boxShadow: `0 4px 20px var(--product-accent-shadow)`,
    transition: 'all 0.3s ease',
    border: `1px solid var(--color-border-light)`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    aspectRatio: '1',
    ...style,
  }

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '15px',
    fontFamily: 'var(--ifm-font-family-heading)',
  }

  const cardDescriptionStyle = {
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: 'var(--ifm-font-family-base)',
    flexGrow: 1,
  }

  const cardLinksStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '15px',
  }

  const cardLinkStyle = {
    color: 'var(--ifm-color-primary)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  }

  return (
    <div style={cardStyle}>
      <h3 style={cardTitleStyle}>{title}</h3>
      {description && <p style={cardDescriptionStyle}>{description}</p>}
      {links && (
        <div style={cardLinksStyle}>
          {links.map((link, index) => (
            <Link key={index} to={link.to} style={cardLinkStyle}>
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroCard
