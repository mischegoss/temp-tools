// RitaGoNavbar.js - Based on ActionsNavbar but for Rita Go
import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import NavigationDropdowns from './NavigationDropdowns'
import RitaGoSearch from '../../../components/RitaGoSearch/index.js'
import MobileSidebar from './MobileSidebar' // Your custom component
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import styles from './styles.module.css'

export default function RitaGoNavbar(props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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
            .navbar__items--right .rita-go-search {
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
            .navbar__items--right .rita-go-search {
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
            .navbar__items--right .rita-go-search {
              max-width: 260px !important;
              width: 260px !important;
            }
          }
          
          /* Mobile (767px and below) - search typically hidden on mobile anyway */
          @media (max-width: 767px) {
            .navbar__items--right .rita-go-search {
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

          <div className='navbar__items navbar__items--center'>
            <NavigationDropdowns />
          </div>

          <div className='navbar__items navbar__items--right'>
            {/* Rita Go Search Component */}
            <RitaGoSearch />

            {/* Mobile toggle button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className={styles.navbarToggle}
              style={{
                display: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'background 0.2s ease',
                fontSize: '1.125rem',
                border: 'none',
                background: 'none',
              }}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile sidebar */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </nav>

      {/* Mobile responsive styles */}
      <style>
        {`
          @media (max-width: 996px) {
            .navbar__items--center {
              display: none !important;
            }
            
            .navbar__items--right .rita-go-search {
              display: none !important;
            }
            
            .${styles.navbarToggle} {
              display: block !important;
            }
          }
        `}
      </style>
    </>
  )
}
