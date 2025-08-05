import React from 'react'
import Hero1 from '../library/hero1-light.js'
import DocsNavigation from '../library/docsnavigation.js'
import ProductProvider from '../library/productprovider.js'
import { expressHeroData } from './data/herodata.js'
import { expressDocsNavData } from './data/expressdocsdata.js'

const ExpressIndex = () => {
  return (
    <ProductProvider product='express'>
      <Hero1 heroData={expressHeroData} />
      <DocsNavigation
        data={expressDocsNavData}
        sectionTitle={expressDocsNavData.sectionTitle}
        exploreButton={expressDocsNavData.exploreButton}
        navItems={expressDocsNavData.navItems}
      />
    </ProductProvider>
  )
}

export default ExpressIndex
