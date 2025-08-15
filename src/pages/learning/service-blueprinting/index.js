// Service Blueprinting Landing Page
// Location: /src/pages/learning/service-blueprinting/index.js

import React from 'react'
import Layout from '@theme/Layout'
import ServiceBlueprintingPage from '../../../components/ServiceBlueprinting/serviceblueprintingindex'

export default function ServiceBlueprintingHomePage() {
  return (
    <Layout
      title='Service Blueprinting Learning Hub'
      description='Master automation design with our comprehensive Service Blueprinting learning path. Learn to create effective automation blueprints from concept to implementation.'
    >
      <ServiceBlueprintingPage />
    </Layout>
  )
}
