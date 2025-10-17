import React from 'react'
import OriginalNavbar from '@theme-original/Navbar'
import HomepageNavbar from '../Navbar/Layout/HomepageNavbar'
import ActionsNavbar from '../Navbar/Layout/ActionsNavbar'
import ProductsNavbar from '../Navbar/Layout/ProductNavbar'
import { useLocation } from '@docusaurus/router'

export default function Navbar(props) {
  const location = useLocation()
  const pathname = location.pathname

  // Check for specific paths
  if (pathname === '/') {
    return <HomepageNavbar {...props} />
  } else if (pathname.startsWith('/actions')) {
    return <ActionsNavbar {...props} />
  }

  // Default navbar for all other pages
  return <ProductsNavbar {...props} />
}
