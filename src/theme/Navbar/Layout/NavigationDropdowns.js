import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function NavigationDropdowns() {
  return (
    <>
      {/* Learning Dropdown */}
      <div
        className={`navbar__item dropdown dropdown--hoverable ${styles.dropdown}`}
      >
        <a
          href='#'
          aria-haspopup='true'
          aria-expanded='false'
          role='button'
          className={`navbar__link ${styles.navbarLink}`}
        >
          Learning
        </a>
        <ul className={`dropdown__menu ${styles.dropdownMenu}`}>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/discover/'
            >
              Discover Resolve
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/'
            >
              Learning Hub
            </Link>
          </li>
        </ul>
      </div>

      {/* Customer Hub Link */}
      <div className={`navbar__item ${styles.navbarItem}`}>
        <a
          href='https://help.resolve.io'
          className={`navbar__link ${styles.navbarLink}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Customer Hub
        </a>
      </div>
    </>
  )
}
