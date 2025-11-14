import React from 'react'
import Link from '@docusaurus/Link'

const SimpleFeatureCard = ({
  title,
  description,
  link,
  icon,
  disabled,
  featureType = 'Feature',
  logo: Logo = null,
  logoHeight = 60,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const getFooterColor = (type, disabled) => {
    if (disabled) {
      return 'var(--brand-grey-600)'
    }

    switch (type.toLowerCase()) {
      case 'automation design':
        return 'var(--brand-blue)' // Professional blue
      case 'automation development':
        return 'var(--brand-black-700)' // Darker blue
      case 'device discovery':
      case 'device discovery and management':
        return 'var(--brand-aqua-600)' // Darker aqua secondary
      default:
        return 'var(--brand-blue)' // Professional blue default
    }
  }

  // Enhanced logo style with brand effects
  const logoStyle = {
    height: `${logoHeight}px`,
    maxWidth: '100%',
    objectFit: 'contain',
    filter: 'brightness(1.05)',
    transition: 'all 0.3s ease',
  }

  return (
    <Link
      to={link}
      style={{
        textDecoration: 'none !important',
        color: 'inherit',
        width: '100%',
        display: 'block',
      }}
      onClick={e => disabled && e.preventDefault()}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '8px',
          backgroundColor: 'var(--brand-white)',
          border: `2px solid ${
            disabled ? 'var(--brand-grey-400)' : 'var(--brand-blue)' // Professional blue border
          }`,
          boxShadow: disabled
            ? '0 0 10px rgba(135, 146, 163, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
            : isHovered
            ? '0 0 20px rgba(0, 80, 199, 0.3), 0 8px 24px rgba(0, 80, 199, 0.2)' // Professional blue shadow
            : '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', // Professional blue shadow
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden',
          position: 'relative',
          transform:
            isHovered && !disabled ? 'translateY(-5px)' : 'translateY(0)',
          opacity: disabled ? 0.7 : 1,
          minHeight: '300px',
          height: 'auto',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingBottom: '40px',
          fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
        }}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => !disabled && setIsHovered(false)}
      >
        {/* Logo section - enhanced with brand styling */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 2rem',
            width: '180px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {Logo ? (
            // Handle all possible logo formats
            typeof Logo === 'string' ? (
              // String path
              <img
                src={Logo}
                alt={title}
                style={{
                  ...logoStyle,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            ) : Logo.default ? (
              // Required image with default property
              <img
                src={Logo.default}
                alt={title}
                style={{
                  ...logoStyle,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            ) : typeof Logo === 'function' ? (
              // React component
              <div
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Logo style={logoStyle} role='img' />
              </div>
            ) : (
              // Direct required image or other object
              <img
                src={Logo}
                alt={title}
                style={{
                  ...logoStyle,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            )
          ) : icon ? (
            <img
              src={icon}
              alt={title}
              style={{
                width: '55px',
                height: '55px',
                objectFit: 'contain',
                filter: 'brightness(1.05)',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='55'
              height='55'
              fill='var(--brand-black-700)'
              style={{
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <path d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.9 15.1c-.6 0-1.2-.2-1.6-.7l-2.8-2.8 1.4-1.4 1.9 1.9L15 7.8l1.4 1.4-4.1 7.3c-.4.5-.9.6-1.2.6z' />
            </svg>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            padding: '1.5rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h3
            style={{
              fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
              fontWeight: 600,
              fontSize: '2rem',
              color: disabled
                ? 'var(--brand-grey-600)'
                : 'var(--brand-black-700)',
              margin: '0 0 0.75rem 0',
              transition: 'color 0.3s ease',
            }}
          >
            {title}
          </h3>

          <p
            style={{
              color: disabled ? 'var(--brand-grey-600)' : 'var(--brand-black)',
              fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
              fontSize: '1.2rem',
              lineHeight: '1.5',
              margin: 0,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.3s ease',
            }}
          >
            {description}
          </p>
        </div>

        {/* Button - using consistent professional blue */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 2.5rem',
            width: '220px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: '12px 28px',
              background: disabled
                ? 'var(--brand-grey-500)'
                : isHovered
                ? 'var(--brand-blue-400)' // Professional blue hover
                : 'var(--brand-blue)', // Professional blue
              color: '#FFFFFF !important',
              borderRadius: '6px',
              fontWeight: '500',
              fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
              fontSize: '1.1rem',
              transition: 'all 0.3s ease-in-out',
              boxShadow: disabled
                ? '0 2px 4px rgba(135, 146, 163, 0.3)'
                : isHovered
                ? '0 0 15px rgba(0, 80, 199, 0.3), 0 4px 12px rgba(0, 80, 199, 0.2)' // Professional blue shadow
                : '0 0 10px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', // Professional blue shadow
              whiteSpace: 'nowrap',
              cursor: disabled ? 'default' : 'pointer',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${
                disabled
                  ? 'var(--brand-grey-400)'
                  : isHovered
                  ? 'var(--brand-blue-400)'
                  : 'var(--brand-blue)'
              }`,
              transform:
                isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span style={{ color: '#FFFFFF !important' }}>
              {disabled ? 'Coming Soon' : 'View Catalog'}
            </span>
          </div>
        </div>

        {/* Footer Bar with professional brand colors */}
        <div
          style={{
            height: '40px',
            background: getFooterColor(featureType, disabled),
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.7 : 1,
          }}
        >
          <span
            style={{
              color: '#FFFFFF !important',
              fontSize: '1.05rem',
              fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              fontWeight: '500',
            }}
          >
            {disabled ? 'Coming Soon' : featureType}
          </span>
        </div>
      </div>
    </Link>
  )
}

const SimpleFeatureCards = ({ features }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '2rem 0',
        width: '100%',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
      }}
    >
      {features.map((feature, idx) => (
        <SimpleFeatureCard
          key={idx}
          title={feature.title}
          description={feature.description}
          link={feature.link}
          icon={feature.icon}
          logo={feature.logo}
          logoHeight={feature.logoHeight || 60}
          disabled={feature.disabled}
          featureType={feature.featureType || 'Feature'}
        />
      ))}
    </div>
  )
}

export default SimpleFeatureCards
