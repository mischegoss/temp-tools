// src/components/DocsProducts/DocsProducts.js

import React from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import docsProductsStyles from './styles/docsproductstyles.js'
import { docsProductsData } from './data/docsproductsdata.js'

const DocsProducts = ({ data = docsProductsData }) => {
  const {
    title = 'Product Documentation',
    subtitle = 'Choose your Resolve platform to access comprehensive guides and references',
    products = [],
  } = data

  // Get gradient style based on product ID
  const getGradientStyle = productId => {
    const gradientMap = {
      actions: docsProductsStyles.gradientActions,
      ritago: docsProductsStyles.gradientRitago,
      express: docsProductsStyles.gradientExpress,
      pro: docsProductsStyles.gradientPro,
      insights: docsProductsStyles.gradientInsights,
    }
    return gradientMap[productId] || docsProductsStyles.gradientActions
  }

  // Get card style based on position (all cards same now)
  const getCardStyle = () => {
    return docsProductsStyles.productCardStyle
  }

  // Handle card hover effects
  const handleCardMouseEnter = e => {
    Object.assign(
      e.currentTarget.style,
      docsProductsStyles.productCardHoverStyle,
    )
  }

  const handleCardMouseLeave = e => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow =
      docsProductsStyles.productCardStyle.boxShadow
    e.currentTarget.style.borderColor = 'transparent'
  }

  return (
    <>
      {/* Responsive CSS for 5-column layout */}
      <style>{`
        .products-responsive-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          justify-content: center;
        }
        
        .product-wrapper {
          flex: 0 1 calc(20% - 16px);
          min-width: 200px;
          max-width: 240px;
        }
        
        /* Tablet: 2-2-1 layout */
        @media (max-width: 1024px) and (min-width: 769px) {
          .product-wrapper {
            flex: 0 1 calc(50% - 10px);
            max-width: 320px;
          }
          .product-wrapper:nth-child(5) {
            flex: 0 1 calc(50% - 10px);
            max-width: 320px;
            margin: 0 auto;
          }
        }
        
        /* Mobile: 1 column */
        @media (max-width: 768px) {
          .products-responsive-grid {
            gap: 16px;
          }
          .product-wrapper {
            flex: 1 1 100%;
            max-width: 420px;
            min-width: unset;
          }
        }
      `}</style>

      <section
        id='documentation'
        style={{
          ...docsProductsStyles.sectionStyle,
          backgroundColor: 'var(--brand-neutral-200)',
        }}
        className='brand-font'
      >
        <div style={docsProductsStyles.containerStyle}>
          {/* Header */}
          <div style={docsProductsStyles.headerContentStyle}>
            <h2 style={docsProductsStyles.titleStyle}>{title}</h2>
            <p style={docsProductsStyles.subtitleStyle}>{subtitle}</p>
          </div>

          {/* Products Grid */}
          <div
            style={docsProductsStyles.productsContainer}
            className='products-responsive-grid'
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                style={docsProductsStyles.productWrapper}
                className='product-wrapper'
              >
                <Link to={product.link} style={{ textDecoration: 'none' }}>
                  <Box
                    style={{
                      ...getCardStyle(),
                      ...getGradientStyle(product.id),
                    }}
                    className='brand-hover'
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <h3 style={docsProductsStyles.productTitleStyle}>
                      {product.title}
                    </h3>
                    <p style={docsProductsStyles.productDescriptionStyle}>
                      {product.description}
                    </p>
                  </Box>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default DocsProducts
