import React from 'react'
import NavbarLayout from '@theme/Navbar/Layout'
import NavbarContent from '@theme/Navbar/Content'
import { useLocation } from '@docusaurus/router'

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname

  // Hide navbar on module pages and forms library
  if (
    pathname.startsWith('/learning/automation-essentials/modules/') ||
    pathname.startsWith('/learning/service-blueprinting/modules/') ||
    pathname.startsWith('/learning/service-blueprinting/forms/forms-library/')
  ) {
    return null
  }

  // For all other pages, render the normal navbar
  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  )
}
