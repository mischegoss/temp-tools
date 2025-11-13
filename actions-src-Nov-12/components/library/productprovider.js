import React, { useEffect } from 'react'

const ProductProvider = ({ product, children, className = '', style = {} }) => {
  useEffect(() => {
    // Set CSS custom properties on the document root using brand palette
    const root = document.documentElement

    switch (product) {
      case 'actions':
        // Actions - Blue theme
        root.style.setProperty('--product-accent-color', 'var(--brand-blue)')
        root.style.setProperty(
          '--product-accent-color-400',
          'var(--brand-blue-400)',
        )
        root.style.setProperty(
          '--product-accent-shadow',
          'rgba(0, 80, 199, 0.2)',
        )
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(0, 80, 199, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(0, 80, 199, 0.4)',
        )
        root.style.setProperty(
          '--product-gradient',
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
        )
        root.style.setProperty(
          '--product-stroke-outline',
          '2px solid var(--brand-blue)',
        )
        root.style.setProperty(
          '--product-secondary-color',
          'var(--brand-blue-400)',
        )
        break

      case 'pro':
        // Pro - Green theme
        root.style.setProperty('--product-accent-color', 'var(--brand-green)')
        root.style.setProperty(
          '--product-accent-color-400',
          'var(--brand-green)',
        )
        root.style.setProperty(
          '--product-accent-shadow',
          'rgba(0, 176, 112, 0.2)',
        )
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(0, 176, 112, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(0, 176, 112, 0.4)',
        )
        root.style.setProperty(
          '--product-gradient',
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-green) 100%)',
        )
        root.style.setProperty(
          '--product-stroke-outline',
          '2px solid var(--brand-green)',
        )
        root.style.setProperty(
          '--product-secondary-color',
          'var(--brand-green)',
        )
        break

      case 'insights':
        // Insights - Aqua theme
        root.style.setProperty('--product-accent-color', 'var(--brand-aqua)')
        root.style.setProperty(
          '--product-accent-color-400',
          'var(--brand-aqua)',
        )
        root.style.setProperty(
          '--product-accent-shadow',
          'rgba(0, 212, 255, 0.2)',
        )
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(0, 212, 255, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(0, 212, 255, 0.4)',
        )
        root.style.setProperty(
          '--product-gradient',
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
        )
        root.style.setProperty(
          '--product-stroke-outline',
          '2px solid var(--brand-aqua)',
        )
        root.style.setProperty(
          '--product-secondary-color',
          'var(--brand-aqua-600)',
        )
        break

      case 'express':
        // Express - Purple theme
        root.style.setProperty('--product-accent-color', 'var(--brand-purple)')
        root.style.setProperty(
          '--product-accent-color-400',
          'var(--brand-purple)',
        )
        root.style.setProperty(
          '--product-accent-shadow',
          'rgba(143, 74, 255, 0.2)',
        )
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(143, 74, 255, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(143, 74, 255, 0.4)',
        )
        root.style.setProperty(
          '--product-gradient',
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-purple) 100%)',
        )
        root.style.setProperty(
          '--product-stroke-outline',
          '2px solid var(--brand-purple)',
        )
        root.style.setProperty(
          '--product-secondary-color',
          'var(--brand-purple)',
        )
        break

      default:
        // Default to actions (Blue)
        root.style.setProperty('--product-accent-color', 'var(--brand-blue)')
        root.style.setProperty(
          '--product-accent-color-400',
          'var(--brand-blue-400)',
        )
        root.style.setProperty(
          '--product-accent-shadow',
          'rgba(0, 80, 199, 0.2)',
        )
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(0, 80, 199, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(0, 80, 199, 0.4)',
        )
        root.style.setProperty(
          '--product-gradient',
          'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
        )
        root.style.setProperty(
          '--product-stroke-outline',
          '2px solid var(--brand-blue)',
        )
        root.style.setProperty(
          '--product-secondary-color',
          'var(--brand-blue-400)',
        )
    }

    // Set universal brand styling
    root.style.setProperty(
      '--brand-font-family',
      "'SeasonMix', system-ui, -apple-system, sans-serif",
    )

    // Cleanup function to reset to default when component unmounts
    return () => {
      root.style.setProperty('--product-accent-color', 'var(--brand-blue)')
      root.style.setProperty(
        '--product-accent-color-400',
        'var(--brand-blue-400)',
      )
      root.style.setProperty('--product-accent-shadow', 'rgba(0, 80, 199, 0.2)')
      root.style.setProperty(
        '--product-accent-shadow-hover',
        'rgba(0, 80, 199, 0.3)',
      )
      root.style.setProperty(
        '--product-accent-shadow-active',
        'rgba(0, 80, 199, 0.4)',
      )
      root.style.setProperty(
        '--product-gradient',
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      )
      root.style.setProperty(
        '--product-stroke-outline',
        '2px solid var(--brand-blue)',
      )
      root.style.setProperty(
        '--product-secondary-color',
        'var(--brand-blue-400)',
      )
    }
  }, [product])

  const containerStyle = {
    fontFamily: "'SeasonMix', system-ui, -apple-system, sans-serif",
    ...style,
  }

  return (
    <div
      className={`product-provider product-${product} brand-font ${className}`}
      style={containerStyle}
    >
      {children}
    </div>
  )
}

export default ProductProvider
