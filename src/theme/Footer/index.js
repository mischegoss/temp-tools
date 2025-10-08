import React from 'react'
import OriginalFooter from '@theme-original/Footer'
import { useLocation } from '@docusaurus/router'

export default function Footer(props) {
  const location = useLocation()
  const pathname = location.pathname

  // Hide footer on module pages for both learning paths
  if (
    pathname.startsWith('/learning/automation-essentials/modules/') ||
    pathname.startsWith('/learning/service-blueprinting/modules/')
  ) {
    return null
  }

  // Render the original footer for all other pages
  return <OriginalFooter {...props} />
}
