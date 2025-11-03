// HomepageNavbar.js - Fixed with NavigationDropdowns restored
import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import NavigationDropdowns from './NavigationDropdowns' // ADD THIS IMPORT
import MobileSidebar from './MobileSidebar'
import styles from './styles.module.css'

export default function HomepageNavbar(props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <nav
      className={`navbar navbar--fixed-top ${styles.navbarHomepageGradient}`}
    >
      <div className='navbar__inner'>
        <div className='navbar__brand'>
          <Link to='/' className='navbar__brand'>
            <div className='navbar__logo'>
              <img
                src='/img/Resolve-Logo-White-Teal-RGB.svg'
                alt='RESOLVE Logo'
                className='navbar__logo-img'
              />
            </div>
            <b className={styles.brandTitle}></b>
          </Link>
        </div>

        <div className='navbar__items'>
          <NavigationDropdowns /> {/* ADD THIS LINE */}
        </div>

        {/* Mobile menu toggle - NOW WITH CLICK HANDLER */}
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

      {/* Your custom mobile sidebar with state */}
      <MobileSidebar
        logoSrc='/img/Resolve-Logo-White-Teal-RGB.svg'
        showRaniButton={false}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </nav>
  )
}
