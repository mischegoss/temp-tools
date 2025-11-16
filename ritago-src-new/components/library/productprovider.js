// src/components/library/productprovider.js
import React, { useEffect } from 'react'

const ProductProvider = ({ product, children }) => {
  useEffect(() => {
    const root = document.documentElement

    switch (product) {
      case 'pro':
        // Actions Pro - Green theme
        root.style.setProperty('--product-accent-color', 'var(--brand-green)')
        root.style.setProperty(
          '--product-accent-color-400',
          'var(--brand-green)',
        )
        root.style.setProperty(
          '--product-accent-shadow',
          'rgba(54, 158, 54, 0.2)',
        )
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(54, 158, 54, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(54, 158, 54, 0.4)',
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

      case 'ritago':
        // Rita Go - Blue-Black theme (UPDATED from burnt orange)
        root.style.setProperty('--product-accent-color', '#040720')
        root.style.setProperty('--product-accent-color-400', '#050A30')
        root.style.setProperty('--product-accent-shadow', 'rgba(4, 7, 32, 0.2)')
        root.style.setProperty(
          '--product-accent-shadow-hover',
          'rgba(4, 7, 32, 0.3)',
        )
        root.style.setProperty(
          '--product-accent-shadow-active',
          'rgba(4, 7, 32, 0.4)',
        )
        root.style.setProperty(
          '--product-gradient',
          'linear-gradient(to bottom, var(--brand-black) 0%, #040720 100%)',
        )
        root.style.setProperty('--product-stroke-outline', '2px solid #040720')
        root.style.setProperty('--product-secondary-color', '#050A30')
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

      case 'insights':
        // Rita Go - Aqua theme (swapped from insights)
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
        break
    }
  }, [product])

  return <>{children}</>
}

export default ProductProvider
