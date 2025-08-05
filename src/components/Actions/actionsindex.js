import React from 'react'
import Hero1 from '../library/hero1-light.js'
import DocsNavigation from '../library/docsnavigation.js'
import ProductProvider from '../library/productprovider.js'
import { heroData as actionsHeroData } from './data/herodata.js'
import { actionsDocsNavData } from './data/actionsdocsdata.js'
import Banner from '../library/banner.js'

const ActionsIndex = () => {
  return (
    <ProductProvider product='actions'>
      <Banner />
      <Hero1 heroData={actionsHeroData} />
      <DocsNavigation
        data={actionsDocsNavData}
        sectionTitle={actionsDocsNavData.sectionTitle}
        exploreButton={actionsDocsNavData.exploreButton}
        navItems={actionsDocsNavData.navItems}
      />
    </ProductProvider>
  )
}

export default ActionsIndex
