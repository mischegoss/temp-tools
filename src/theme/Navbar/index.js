import React from 'react'
import NavbarLayout from '@theme/Navbar/Layout'
import NavbarContent from '@theme/Navbar/Content'
import CustomSearch from '@site/src/components/CustomSearch'

export default function Navbar() {
  return (
    <NavbarLayout>
      {/* Render existing navbar content */}
      <NavbarContent />

      {/* Add custom search to the right side */}
      <div
        className='navbar__item navbar__item--right'
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
          paddingRight: 'var(--ifm-navbar-padding-horizontal)',
        }}
      >
        <CustomSearch />
      </div>
    </NavbarLayout>
  )
}
