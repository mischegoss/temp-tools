import React from 'react'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'

export default function NavigationDropdowns() {
  return (
    <>
      {/* Documentation Dropdown */}
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
          Documentation
        </a>
        <ul className={`dropdown__menu ${styles.dropdownMenu}`}>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='/actions'
            >
              Actions
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='https://docs.resolve.io/pro'
            >
              Pro
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='https://docs.resolve.io/express'
            >
              Express
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='https://docs.resolve.io/insights'
            >
              Insights
            </Link>
          </li>
        </ul>
      </div>

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
          Training
        </a>
        <ul className={`dropdown__menu ${styles.dropdownMenu}`}>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='https://training.resolve.io/learning/discover'
            >
              Discover Resolve
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown__link ${styles.dropdownLink}`}
              to='https://training.resolve.io/learning'
            >
              Learning Hub
            </Link>
          </li>
        </ul>
      </div>

      {/* Support Link */}
      <Link
        className={`navbar__item navbar__link ${styles.navbarLink}`}
        to='https://support.resolve.io/'
      >
        Support
      </Link>

      {/* Automation Exchange Link */}
      <Link
        className={`navbar__item navbar__link ${styles.navbarLink}`}
        to='https://exchange.resolve.io/'
      >
        Automation Exchange
      </Link>
    </>
  )
}
