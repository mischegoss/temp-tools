import { useEffect, useState } from 'react'

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
    display: inline-block;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #2a9d8f;
    background: rgba(42, 157, 143, 0.08);
    border: 1px solid rgba(42, 157, 143, 0.25);
    border-radius: 20px;
    padding: 5px 14px;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp 0.5s ease forwards 0.1s;
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
    color: #2a9d8f;
  }

  .subheading {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 1.15rem;
    font-weight: 300;
    color: #4a5568;
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 36px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.35s;
  }

  .divider {
    width: 60px;
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

  .card-title {
    font-family: 'Lora', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: #1a2e3b;
    margin-bottom: 10px;
  }

  .card-body {
    font-size: 1.15rem;
    color: #4a5568;
    line-height: 1.7;
  }

  .pulse-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2a9d8f;
    margin-right: 8px;
    vertical-align: middle;
    animation: pulse 2s ease-in-out infinite;
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

export default function ComingSoon() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const id = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'))
    }, 600)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <style>{styles}</style>
      <div className='page'>
        <div className='container'>
          <div className='badge'>
            <span className='pulse-dot' />
            In Progress
          </div>

          <h1 className='heading'>
            Coming Soon:
            <br />
            <span>RITA Agent Builder</span> Help Docs
          </h1>

          <p className='subheading'>Check back for updates{dots}</p>

          <div className='divider' />

          <div className='card'>
            <div className='card-label'>What to expect</div>
            <div className='card-title'>Agent Builder Documentation</div>
            <p className='card-body'>
              Guides, reference materials, and practical examples to help you
              assign workflows, create bots, and get the most from Agent
              Builder.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
