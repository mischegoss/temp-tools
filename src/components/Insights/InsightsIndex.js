import React from 'react'
import Hero1 from '../library/hero1-light.js'
import DocsNavigation from '../library/docsnavigation.js'
import ProductProvider from '../library/productprovider.js'
import { insightsHeroData } from './data/herodata.js'
import { insightsDocsNavData } from './data/insightsdocsdata.js'

const InsightsIndex = () => {
  return (
    <ProductProvider product='insights'>
      <Hero1 heroData={insightsHeroData} />
      <DocsNavigation
        data={insightsDocsNavData}
        sectionTitle={insightsDocsNavData.sectionTitle}
        exploreButton={insightsDocsNavData.exploreButton}
        navItems={insightsDocsNavData.navItems}
      />
    </ProductProvider>
  )
}

export default InsightsIndex
