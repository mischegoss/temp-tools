import React from 'react'
import Hero1 from '../library/hero1-light-2-cards.js'
import ProductProvider from '../library/productprovider.js'
import { ritaheroData } from './data/herodata.js'
import DocsNavigation from '../library/docsnavigation.js'
import { ritagoDocsNavData } from './data/ritagodocsdata.js'
import Banner from '../library/banner-props.js'

const RitaGoIndex = () => {
  // Banner data defined directly here
  const bannerData = {
    showing: true,
    message: 'These Beta docs are still in development!',
    buttonText: 'Get info about RITA Go Beta',
    buttonLink: 'https://help.resolve.io/',
    boldText: 'RITA Go Early Access:',
  }

  return (
    <ProductProvider product='ritago'>
      <Banner bannerData={bannerData} />
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
