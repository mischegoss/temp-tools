import React from 'react'
import Hero1 from '../library/hero1-light.js'
import DocsNavigation from '../library/docsnavigation.js'
import ProductProvider from '../library/productprovider.js'
import { proHeroData } from './data/herodata.js'
import { proDocsNavData } from './data/prodocsdata.js'

const ProIndex = () => {
  return (
    <ProductProvider product='pro'>
      <Hero1 heroData={proHeroData} />
      <DocsNavigation
        data={proDocsNavData}
        sectionTitle={proDocsNavData.sectionTitle}
        exploreButton={proDocsNavData.exploreButton}
        navItems={proDocsNavData.navItems}
      />
    </ProductProvider>
  )
}

export default ProIndex
