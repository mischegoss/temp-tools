// src/components/DocsProducts/DocsProducts.js

import React from 'react'
import Link from '@docusaurus/Link'
import { Grid, Box } from '@mui/material'
import docsProductsStyles from './styles/docsproductstyles.js'
import { docsProductsData } from './data/docsproductsdata.js'

const DocsProducts = ({ data = docsProductsData }) => {
  const {
    title = 'Or Explore our Trainings By Product',
    subtitle = 'Choose your Resolve platform to access product-specific training.',
    products = [],
  } = data

  // Get gradient style based on product ID
  const getGradientStyle = productId => {
    const gradientMap = {
      actions: docsProductsStyles.gradientActions,
      express: docsProductsStyles.gradientExpress,
      pro: docsProductsStyles.gradientPro,
      insights: docsProductsStyles.gradientInsights,
    }
    return gradientMap[productId] || docsProductsStyles.gradientActions
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
    <section
      id='documentation'
      style={docsProductsStyles.sectionStyle}
      className='brand-font'
    >
      <div style={docsProductsStyles.containerStyle}>
        {/* Header */}
        <div style={docsProductsStyles.headerContentStyle}>
          <h2 style={docsProductsStyles.titleStyle}>{title}</h2>
          <p style={docsProductsStyles.subtitleStyle}>{subtitle}</p>
        </div>

        {/* Products Grid */}
        <Grid container spacing={3} style={docsProductsStyles.gridStyle}>
          {products.map((product, index) => (
            <Grid
              key={product.id}
              size={{
                xs: 12, // 1 column on mobile
                sm: 6, // 2 columns on tablet
                lg: 3, // 4 columns on desktop
              }}
            >
              <Link to={product.link} style={{ textDecoration: 'none' }}>
                <Box
                  style={{
                    ...docsProductsStyles.productCardStyle,
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
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default DocsProducts
