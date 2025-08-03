// HomepageNavbar.js - Fixed with clickable logo and improved dropdowns
import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import NavigationDropdowns from './NavigationDropdowns'
import MobileSidebar from './MobileSidebar'
import styles from './styles.module.css'

export default function HomepageNavbar(props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <nav
      className={`navbar navbar--fixed-top ${styles.navbarHomepageGradient}`}
    >
      <div className='navbar__inner'>
        {/* Fixed Logo - Removed nested Link structure */}
        <Link to='/' className={`navbar__brand ${styles.navbarBrand}`}>
          <div className='navbar__logo'>
            <img
              src='/img/Resolve-Logo-White-Teal-RGB.svg'
              alt='RESOLVE Logo'
              className='navbar__logo-img'
            />
          </div>
          <b className={styles.brandTitle}></b>
        </Link>

        <div className='navbar__items'>
          <NavigationDropdowns />
        </div>

        {/* Mobile menu toggle */}
        <div
          className={styles.navbarToggle}
          role='button'
          tabIndex={0}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsMobileSidebarOpen(!isMobileSidebarOpen)
            }
          }}
        >
          <svg
            width='30'
            height='30'
            viewBox='0 0 30 30'
            role='img'
            focusable='false'
          >
            <title>Menu</title>
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeMiterlimit='10'
              strokeWidth='2'
              d='m4 7h22M4 15h22M4 23h22'
            />
          </svg>
        </div>
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar
        logoSrc='/img/Resolve-Logo-White-Teal-RGB.svg'
        showRaniButton={false}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </nav>
  )
}
