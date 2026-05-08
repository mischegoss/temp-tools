import { useEffect, useState } from 'react'

const REDIRECT_URL =
  'https://resolve.io/capabilities/agentic-service-desk-automation'
const COUNTDOWN_SECONDS = 3

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #ffffff;
    font-family: 'Source Sans 3', sans-serif;
  }

  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    background: #ffffff;
  }

  .container {
    max-width: 760px;
    width: 100%;
    text-align: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #0f6e56;
    background: #e1f5ee;
    border: 1px solid #9fe1cb;
    border-radius: 20px;
    padding: 5px 14px;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp 0.5s ease forwards 0.1s;
  }

  .pulse-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #1d9e75;
    animation: pulse 2s ease-in-out infinite;
  }

  .heading {
    font-family: 'Lora', serif;
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 600;
    color: #1a2e3b;
    line-height: 1.2;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.2s;
  }

  .heading span {
    color: #0f6e56;
  }

  .subheading {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 1.35rem;
    font-weight: 300;
    color: #4a5568;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 36px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.35s;
  }

  .divider {
    width: 56px;
    height: 3px;
    background: #2a9d8f;
    margin: 0 auto 40px;
    border-radius: 2px;
    opacity: 0;
    animation: fadeUp 0.5s ease forwards 0.5s;
  }

  .card {
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 32px 36px;
    text-align: left;
    background: #fafcfc;
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.6s;
  }

  .card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #718096;
    margin-bottom: 10px;
  }

  .card-body {
    font-size: 1.25rem;
    color: #4a5568;
    line-height: 1.75;
  }

  .redirect-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.75s;
    flex-wrap: wrap;
  }

  .redirect-note {
    font-size: 1rem;
    color: #718096;
  }

  .redirect-link {
    display: inline-block;
    background: #1d9e75;
    color: #ffffff;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    padding: 11px 26px;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .redirect-link:hover {
    background: #0f6e56;
    color: #ffffff;
  }

  .redirect-link:active {
    background: #085041;
    color: #ffffff;
    transform: scale(0.98);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

export default function RitaRedirect() {
  const [count, setCount] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    if (count <= 0) {
      window.location.href = REDIRECT_URL
      return
    }
    const id = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [count])

  return (
    <>
      <style>{styles}</style>
      <div className='page'>
        <div className='container'>
          <div className='badge'>
            <span className='pulse-dot' />
            Redirecting in {count}…
          </div>

          <h1 className='heading'>
            Meet <span>RITA</span>
          </h1>

          <p className='subheading'>
            Your AI-powered IT service desk, built for resolution at scale.
          </p>

          <div className='divider' />

          <div className='card'>
            <div className='card-label'>About RITA</div>
            <p className='card-body'>
              Routine questions and requests like password resets, access
              changes, and VPN issues are overwhelming your teams, delaying
              resolution, and draining IT budgets. The result? Longer wait
              times, lower employee satisfaction, and rising operational costs.
              <br />
              <br />
              RITA changes that by answering questions and resolving routine
              requests instantly, reducing ticket volume and ITSM spend,
              improving resolution rates, and elevating the employee experience.
            </p>
          </div>

          <div className='redirect-row'>
            <span className='redirect-note'>
              Taking you to resolve.io in {count} second{count !== 1 ? 's' : ''}
              …
            </span>
            <a className='redirect-link' href={REDIRECT_URL}>
              Go now →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
