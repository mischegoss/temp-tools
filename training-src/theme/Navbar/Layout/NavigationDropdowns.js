import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function NavigationDropdowns() {
  return (
    <>
      {/* Discover Platform Link */}
      <div className={`navbar__item ${styles.navbarItem}`}>
        <Link
          className={`navbar__link ${styles.navbarLink}`}
          to='/learning/discover'
        >
          Discover Platform
        </Link>
      </div>

      {/* Product Learning Dropdown */}
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
          Product Learning
        </a>
        <ul className={`dropdown__menu ${styles.dropdownMenu}`}>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/rita-go'
            >
              Rita Go
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/actions'
            >
              Platform
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/pro'
            >
              Pro
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/express'
            >
              Express
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/learning/insights'
            >
              Insights
            </Link>
          </li>
        </ul>
      </div>

      {/* Learning Hub Link */}
      <div className={`navbar__item ${styles.navbarItem}`}>
        <Link className={`navbar__link ${styles.navbarLink}`} to='/learning/'>
          Learning Hub
        </Link>
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
