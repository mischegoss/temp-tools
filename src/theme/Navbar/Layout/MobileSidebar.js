// MobileSidebar.js - Updated to work with state
import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function MobileSidebar({
  logoSrc,
  showRaniButton = false,
  onRaniClick,
  isOpen = false,
  onClose,
}) {
  return (
    <div
      className={`${styles.navbarSidebar} ${
        isOpen ? styles.navbarSidebarShow : ''
      }`}
    >
      <div className={styles.navbarSidebarBrand}>
        <Link to='/' className='navbar__brand'>
          <div className='navbar__logo'>
            <img
              src={logoSrc}
              alt='RESOLVE Logo'
              className='navbar__logo-img'
            />
          </div>
          <b className={styles.brandTitle}></b>
        </Link>

        {/* Close button */}
        <button
          className={styles.navbarSidebarClose}
          onClick={onClose}
          aria-label='Close navigation menu'
        >
          ×
        </button>
      </div>

      <div className={styles.navbarSidebarItems}>
        <div className='navbar-sidebar__item menu'>
          <ul className={styles.menuList}>
            <li className={styles.menuListItem}>
              <a
                className={`${styles.menuLink} ${styles.menuLinkSublist}`}
                role='button'
              >
                Documentation
              </a>
              <ul className={styles.menuList}>
                <li className={styles.menuListItem}>
                  <Link className={styles.menuLink} to='/docs/actions'>
                    Actions
                  </Link>
                </li>
                <li className={styles.menuListItem}>
                  <Link className={styles.menuLink} to='/docs/pro'>
                    Pro
                  </Link>
                </li>
                <li className={styles.menuListItem}>
                  <Link className={styles.menuLink} to='/docs/express'>
                    Express
                  </Link>
                </li>
                <li className={styles.menuListItem}>
                  <Link className={styles.menuLink} to='/docs/insights'>
                    Insights
                  </Link>
                </li>
              </ul>
            </li>

            <li className={styles.menuListItem}>
              <a
                className={`${styles.menuLink} ${styles.menuLinkSublist}`}
                role='button'
              >
                Learning
              </a>
              <ul className={styles.menuList}>
                <li className={styles.menuListItem}>
                  <Link
                    className={styles.menuLink}
                    to='/learning/discover-resolve'
                  >
                    Discover Resolve
                  </Link>
                </li>
                <li className={styles.menuListItem}>
                  <Link className={styles.menuLink} to='/learning/hub'>
                    Learning Hub
                  </Link>
                </li>
              </ul>
            </li>

            <li className={styles.menuListItem}>
              <Link className={styles.menuLink} to='/support'>
                Support
              </Link>
            </li>

            <li className={styles.menuListItem}>
              <Link className={styles.menuLink} to='/automation-exchange'>
                Automation Exchange
              </Link>
            </li>

            {showRaniButton && (
              <li className={styles.menuListItem}>
                <button
                  className={`${styles.menuLink} ${styles.menuLinkRani}`}
                  onClick={onRaniClick}
                >
                  Ask RANI
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
