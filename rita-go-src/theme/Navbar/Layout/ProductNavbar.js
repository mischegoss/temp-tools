// ProductsNavbar.js - Renamed from Actions, removed CustomSearch
import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import NavigationDropdowns from './NavigationDropdowns'
import MobileSidebar from './MobileSidebar' // Your custom component
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import styles from './styles.module.css'

export default function ProductsNavbar(props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleMobileRaniClick = () => {
    // Only run in browser environment
    if (ExecutionEnvironment.canUseDOM) {
      const chatbotBtn = document.querySelector('.chatbot-button')
      if (chatbotBtn) {
        chatbotBtn.click()
      }
    }
  }

  return (
    <>
      {/* Add CSS to allow wider search with responsive behavior */}
      <style>
        {`
          /* Desktop - full width (1200px and up) */
          @media (min-width: 1200px) {
            .navbar__items--right {
              flex: 0 0 auto !important;
              min-width: 400px !important;
            }
            .navbar__items--right .custom-search {
              max-width: 373px !important;
              width: 373px !important;
            }
          }
          
          /* Large tablets/small laptops (996px to 1199px) */
          @media (min-width: 996px) and (max-width: 1199px) {
            .navbar__items--right {
              flex: 0 0 auto !important;
              min-width: 320px !important;
            }
            .navbar__items--right .custom-search {
              max-width: 300px !important;
              width: 300px !important;
            }
          }
          
          /* Tablets (768px to 995px) */
          @media (min-width: 768px) and (max-width: 995px) {
            .navbar__items--right {
              flex: 0 0 auto !important;
              min-width: 280px !important;
            }
            .navbar__items--right .custom-search {
              max-width: 260px !important;
              width: 260px !important;
            }
          }
          
          /* Mobile (767px and below) - search typically hidden on mobile anyway */
          @media (max-width: 767px) {
            .navbar__items--right .custom-search {
              max-width: 200px !important;
              width: 200px !important;
            }
          }
        `}
      </style>

      <nav className={`navbar navbar--fixed-top ${styles.navbarActions}`}>
        <div className='navbar__inner'>
          <div className='navbar__brand'>
            <Link to='/' className='navbar__brand'>
              <div className='navbar__logo'>
                <img
                  src='/img/Resolve-Logo-Full-Color-RGB.svg'
                  alt='RESOLVE Logo'
                  className='navbar__logo-img'
                />
              </div>
              <b className={styles.brandTitle}></b>
            </Link>
          </div>

          <div className='navbar__items'>
            <NavigationDropdowns />
          </div>

          {/* Right side items */}
          <div className='navbar__items navbar__items--right'></div>

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
              style={{ color: 'var(--color-text-primary)' }}
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
          onRaniClick={handleMobileRaniClick}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </nav>
    </>
  )
}
