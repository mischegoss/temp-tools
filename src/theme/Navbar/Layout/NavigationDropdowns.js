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
            <a
              className={`dropdown__link ${styles.dropdownLink}`}
              href='https://docs.resolve.io/actions'
              target='_blank'
              rel='noopener noreferrer'
            >
              Actions
            </a>
          </li>
          <li>
            <a
              className={`dropdown__link ${styles.dropdownLink}`}
              href='https://docs.resolve.io/pro/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Pro
            </a>
          </li>
          <li>
            <a
              className={`dropdown__link ${styles.dropdownLink}`}
              href='https://docs.resolve.io/express/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Express
            </a>
          </li>
          <li>
            <a
              className={`dropdown__link ${styles.dropdownLink}`}
              href='https://docs.resolve.io/insights/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Insights
            </a>
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

      {/* Support Link */}
      <a
        className={`navbar__item navbar__link ${styles.navbarLink}`}
        href='https://support.resolve.io/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Support
      </a>

      {/* Automation Exchange Link */}
      <a
        className={`navbar__item navbar__link ${styles.navbarLink}`}
        href='https://exchange.resolve.io/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Automation Exchange
      </a>
    </>
  )
}
