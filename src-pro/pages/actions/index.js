import React, { useEffect, useState } from 'react'
import Layout from '@theme/Layout'
import { PageMetadata } from '@docusaurus/theme-common'

export default function ActionsRedirect() {
  const [countdown, setCountdown] = useState(2)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      window.location.href = 'https://help.resolve.io/actions/'
    }
  }, [countdown])

  return (
    <>
      <PageMetadata
        title='Actions Documentation Moved'
        description='Resolve Actions documentation has moved to our Customer Hub'
      />
      <Layout>
        <main className='container margin-vert--xl'>
          <div className='row'>
            <div className='col col--6 col--offset-3'>
              <div className='text--center'>
                <h1 className='hero__title'>
                  🚀 Looking for Actions Documentation?
                </h1>
                <p className='hero__subtitle'>
                  Great news! The Actions documentation has moved to our new{' '}
                  <strong>Customer Hub</strong> for a better experience.
                </p>

                <div className='card margin-vert--lg'>
                  <div className='card__body'>
                    <p>
                      <strong>
                        You'll be automatically redirected in {countdown}{' '}
                        seconds...
                      </strong>
                    </p>
                    <p>
                      Looking for: <code>/actions</code>
                    </p>
                  </div>
                </div>

                <div className='margin-vert--lg'>
                  <a
                    href='https://help.resolve.io/actions/'
                    className='button button--primary button--lg margin-horiz--sm'
                  >
                    Take me there now →
                  </a>
                  <a
                    href='https://help.resolve.io/actions/'
                    className='button button--secondary button--lg margin-horiz--sm'
                  >
                    Browse all Actions docs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  )
}
