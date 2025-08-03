import React, { useState, useRef } from 'react'
import { PrintStyles } from '../Forms/styles/print-styles'
import PDFGenerator from '../Forms/utils/PDFGenerator'

const CertificateGenerator = () => {
  const [name, setName] = useState('')
  const [showCertificate, setShowCertificate] = useState(false)
  const certificateRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const handleGenerateCertificate = () => {
    if (!name.trim()) {
      alert('Please enter your name before generating the certificate')
      return
    }
    setShowCertificate(true)
    // The certificate is generated, so we can show the LinkedIn button
    setPdfGenerated(true)
  }

  const handleDownload = async () => {
    if (!name.trim()) {
      alert('Please enter your name before downloading the certificate')
      return
    }

    setIsGenerating(true)
    try {
      await PDFGenerator.generatePDF(
        certificateRef,
        `automation-essentials-certificate-${name.replace(/\s+/g, '-')}.pdf`,
      )
      setPdfGenerated(true) // Mark that PDF has been successfully generated
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate certificate. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setShowCertificate(false)
    setPdfGenerated(false) // Reset PDF generation status when going back to edit
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <PrintStyles />

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '20px auto',
          fontFamily:
            'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
        }}
      >
        {!showCertificate ? (
          <div
            className='card no-print'
            style={{
              backgroundColor: 'var(--brand-white)',
              borderRadius: '8px',
              border: '2px solid var(--brand-blue-400)',
              boxShadow:
                '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              padding: '30px',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <label
                htmlFor='certificate-name'
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  color: 'var(--brand-black)',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                }}
              >
                Enter your name as you'd like it to appear on the certificate:
              </label>
              <input
                id='certificate-name'
                type='text'
                value={name}
                onChange={handleNameChange}
                placeholder='Your Full Name'
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid var(--brand-grey-400)',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e =>
                  (e.target.style.borderColor = 'var(--brand-blue-400)')
                }
                onBlur={e =>
                  (e.target.style.borderColor = 'var(--brand-grey-400)')
                }
              />
              <button
                onClick={handleGenerateCertificate}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  background:
                    'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
                  color: 'var(--brand-white)',
                  border: '2px solid var(--brand-aqua)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  boxShadow:
                    '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow =
                    '0 0 20px rgba(0, 212, 255, 0.3), 0 4px 12px rgba(0, 212, 255, 0.2)'
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow =
                    '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                Generate Certificate
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Certificate Card - Wrapped in section class for PDFGenerator */}
            <div
              className='section'
              ref={certificateRef}
              style={{
                marginBottom: '5px',
                backgroundColor: 'var(--brand-white)',
                width: '100%',
                padding: '20px',
                boxSizing: 'border-box',
              }}
            >
              <div
                className='title-section'
                style={{
                  width: '100%',
                  padding: '40px 20px',
                  backgroundColor: 'var(--brand-white)',
                  textAlign: 'center',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  color: 'var(--brand-black)',
                  boxSizing: 'border-box',
                  position: 'relative',
                  minHeight: '500px',
                  border: '8px solid var(--brand-blue-400)',
                  borderRadius: '2px',
                  margin: '0 auto',
                  boxShadow:
                    '0 0 20px rgba(0, 102, 255, 0.3), 0 2px 10px rgba(0, 0, 0, 0.15)',
                }}
                data-pdf-section='title'
              >
                <div style={{ marginBottom: '20px' }}>
                  <h2
                    style={{
                      color: 'var(--brand-black-700)',
                      fontSize: '28px',
                      margin: '0 0 10px 0',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Certificate of Completion
                  </h2>
                  <div
                    style={{
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'var(--brand-aqua)',
                      margin: '0 auto',
                    }}
                  ></div>
                </div>

                <p
                  style={{
                    fontSize: '16px',
                    margin: '20px 0',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: 'var(--brand-black)',
                  }}
                >
                  This certifies that
                </p>

                <h2
                  style={{
                    fontSize: '28px',
                    color: 'var(--brand-black-700)',
                    margin: '20px 0',
                    fontStyle: 'italic',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {name}
                </h2>

                <p
                  style={{
                    fontSize: '16px',
                    margin: '20px 0',
                    lineHeight: '1.6',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: 'var(--brand-black)',
                  }}
                >
                  has successfully completed the course
                  <br />
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'var(--brand-black-700)',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Automation Essentials
                  </span>
                </p>

                <p
                  style={{
                    fontSize: '14px',
                    margin: '30px 0 20px',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: 'var(--brand-grey-600)',
                  }}
                >
                  Issued on {currentDate}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                  }}
                >
                  <div style={{ textAlign: 'center', width: '40%' }}>
                    <div className='pdf-only-logo-container'>
                      <img
                        src='/img/resolve-RGB-transparent.png'
                        alt='Resolve Logo'
                        className='pdf-only-logo'
                        style={{
                          width: '100px',
                          height: 'auto',
                          marginBottom: '10px',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        borderTop: '2px solid var(--brand-aqua)',
                        paddingTop: '10px',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          fontFamily:
                            'SeasonMix, system-ui, -apple-system, sans-serif',
                          color: 'var(--brand-black)',
                        }}
                      >
                        Resolve Official Seal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Name button - Small button directly under certificate */}
            <div
              className='no-print'
              style={{ textAlign: 'center', marginBottom: '15px' }}
            >
              <button
                onClick={handleReset}
                disabled={isGenerating}
                style={{
                  padding: '5px 10px',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  color: 'var(--brand-grey-600)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1,
                  textDecoration: 'underline',
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e =>
                  (e.target.style.color = 'var(--brand-blue-400)')
                }
                onMouseLeave={e =>
                  (e.target.style.color = 'var(--brand-grey-600)')
                }
              >
                Edit your name
              </button>
            </div>

            <div
              className='card no-print'
              style={{
                backgroundColor: 'var(--brand-grey-100)',
                borderRadius: '8px',
                border: '2px solid var(--brand-grey-300)',
                boxShadow:
                  '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                {/* Download Button - Large and prominent with download emoji */}
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  style={{
                    padding: '15px 25px',
                    fontSize: '18px',
                    width: '100%',
                    maxWidth: '350px',
                    background:
                      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
                    color: 'var(--brand-white)',
                    border: '2px solid var(--brand-aqua)',
                    borderRadius: '8px',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    opacity: isGenerating ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease-in-out',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    boxShadow:
                      '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={e => {
                    if (!isGenerating) {
                      e.target.style.transform = 'translateY(-3px)'
                      e.target.style.boxShadow =
                        '0 0 25px rgba(0, 212, 255, 0.4), 0 6px 16px rgba(0, 212, 255, 0.3)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isGenerating) {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow =
                        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <span style={{ fontSize: '24px' }}>⬇️</span>
                  <span>
                    {isGenerating
                      ? 'Generating PDF...'
                      : 'Download Certificate'}
                  </span>
                </button>

                {/* LinkedIn Share Button - Only show if certificate has been generated */}
                {pdfGenerated && (
                  <button
                    onClick={() => {
                      const shareText = `🎉 I just completed the Automation Essentials course!\n\nLearned essential automation concepts and best practices. Ready to streamline processes!\n\n#AutomationEssentials #ProcessImprovement #ProfessionalDevelopment`

                      const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                        shareText,
                      )}`

                      window.open(
                        linkedInUrl,
                        'linkedin-share-dialog',
                        'width=600,height=600',
                      )
                    }}
                    style={{
                      padding: '15px 25px',
                      fontSize: '18px',
                      width: '100%',
                      maxWidth: '350px',
                      backgroundColor: '#0077B5', // LinkedIn blue - kept as brand requirement
                      color: 'var(--brand-white)',
                      border: '2px solid #0077B5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease-in-out',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      boxShadow:
                        '0 0 15px rgba(0, 119, 181, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.backgroundColor = '#005885'
                      e.target.style.borderColor = '#005885'
                      e.target.style.transform = 'translateY(-3px)'
                      e.target.style.boxShadow =
                        '0 0 20px rgba(0, 119, 181, 0.3), 0 6px 16px rgba(0, 119, 181, 0.2)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.backgroundColor = '#0077B5'
                      e.target.style.borderColor = '#0077B5'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow =
                        '0 0 15px rgba(0, 119, 181, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='white'
                    >
                      <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                    </svg>
                    <span>Share on LinkedIn</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CertificateGenerator
