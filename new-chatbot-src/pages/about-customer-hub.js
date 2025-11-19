import React, { useEffect } from 'react'

export default function CustomerHubRedirect() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://training.resolve.io/'
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h2>Welcome to the Customer Hub!</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        The new Customer Hub is your one-stop shop for all your product and
        support resources.
      </p>
      <p>You will be automatically redirected in a few seconds...</p>
      <p>
        Or{' '}
        <a href='https://training.resolve.io/' style={{ fontWeight: 'bold' }}>
          click here to go there now
        </a>
        .
      </p>
    </div>
  )
}
