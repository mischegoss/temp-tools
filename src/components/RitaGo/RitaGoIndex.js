import React from 'react'
import Hero1 from '../library/hero1-light-2-cards.js'
import ProductProvider from '../library/productprovider.js'
import { ritaheroData } from './data/herodata.js'
import DocsNavigation from '../library/docsnavigation.js'
import { ritagoDocsNavData } from './data/ritagodocsdata.js'

const RitaGoIndex = () => {
  return (
    <ProductProvider product='ritago'>
      <Hero1 heroData={ritaheroData} />
      <DocsNavigation
        data={ritagoDocsNavData}
        sectionTitle={ritagoDocsNavData.sectionTitle}
        exploreButton={ritagoDocsNavData.exploreButton}
        navItems={ritagoDocsNavData.navItems}
      />
    </ProductProvider>
  )
}

export default RitaGoIndex
