import React from 'react'
import Hero1 from '../library/hero1-light-three-across.js'
/* import DocsNavigation from '../library/docsnavigation.js' */
import ProductProvider from '../library/productprovider.js'
import { heroData as baristaHeroData } from './data/herodata.js'
/* import { baristaDocsNavData } from './data/baristadocsdata.js' */
/* import Banner from '../library/banner.js' */

const BaristaIndex = () => {
  return (
    <ProductProvider product='barista'>
      <Hero1 heroData={baristaHeroData} />
    </ProductProvider>
  )
}

export default BaristaIndex
