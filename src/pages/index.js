import React from 'react'
import Layout from '@theme/Layout'
import HomePage from '../components/Homepage/homepageindex.js'
import VideoTemplate from '../components/library/videotemplate.js'
export default function DocsHomePage() {
  return (
    <Layout title='Documentation Homepage' description='Documentation Homepage'>
      <HomePage />
      <VideoTemplate />
    </Layout>
  )
}
