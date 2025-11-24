import React, { useEffect, useState } from 'react'
import NotFound from '@theme-original/NotFound'
import Layout from '@theme/Layout'
import { PageMetadata } from '@docusaurus/theme-common'
import { useLocation } from '@docusaurus/router'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

export default function NotFoundWrapper(props) {
  const location = useLocation()
  const [countdown, setCountdown] = useState(2)
  const [isClient, setIsClient] = useState(false)

  // Only determine if it's an actions page on the client-side
  const isActionsPage =
    ExecutionEnvironment.canUseDOM && isClient
      ? location.pathname.startsWith('/actions')
      : false

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run on client-side and for actions pages
    if (!ExecutionEnvironment.canUseDOM || !isClient || !isActionsPage) {
      return
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      // Redirect to help site, preserving the path
      const helpUrl = `https://help.resolve.io${location.pathname}`
      window.location.replace(helpUrl)
    }
  }, [isActionsPage, countdown, location.pathname, isClient])

  // During SSR or before client hydration, show standard 404
  if (!isClient) {
    return <NotFound {...props} />
  }

  // If it's an Actions page (client-side only), show our custom redirect message
  if (isActionsPage) {
    const helpUrl = `https://help.resolve.io${location.pathname}`

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
                        Looking for: <code>{location.pathname}</code>
                      </p>
                    </div>
                  </div>

                  <div className='margin-vert--lg'>
                    <a
                      href={helpUrl}
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

  // For all other 404s, use the original NotFound component
  return <NotFound {...props} />
}
