import React from 'react'
import Layout from '@theme/Layout'
import HomePage from '../components/Homepage/homepageindex.js'
import VideoTemplate from '../components/library/videotemplate.js'
import DocsProducts from '../components/library/docsproducts.js'
export default function DocsHomePage() {
  return (
    <Layout title='Documentation Homepage' description='Documentation Homeoage'>
      <HomePage />
      <VideoTemplate />
      <DocsProducts />
    </Layout>
  )
}
