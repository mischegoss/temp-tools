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
          // Name Input Section
          <div
            style={{
              backgroundColor: 'var(--brand-white)',
              borderRadius: '12px',
              border: '2px solid var(--brand-blue-400)',
              boxShadow:
                '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              padding: '30px',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                color: 'var(--brand-black-700)',
                marginBottom: '25px',
                fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                fontSize: '1.8rem',
                fontWeight: '600',
              }}
            >
              Generate Your Certificate
            </h2>
            <div style={{ textAlign: 'center' }}>
              <label
                htmlFor='recipientName'
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: '500',
                  color: 'var(--brand-black-700)',
                  fontSize: '1.1rem',
                }}
              >
                Enter your full name as it should appear on the certificate:
              </label>
              <input
                id='recipientName'
                type='text'
                value={name}
                onChange={handleNameChange}
                placeholder='e.g., John Smith'
                style={{
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid var(--brand-grey-300)',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  backgroundColor: 'var(--brand-white)',
                  color: 'var(--brand-black)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
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
              {/* Certificate Content */}
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

                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'var(--brand-black-700)',
                    margin: '20px 0',
                    padding: '10px 0',
                    borderBottom: '2px solid var(--brand-aqua)',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                  }}
                >
                  {name}
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
                  has successfully completed
                </p>

                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--brand-black-700)',
                    margin: '20px 0',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                  }}
                >
                  Automation Essentials
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    margin: '30px 0',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    color: 'var(--brand-black)',
                  }}
                >
                  Course completed on {currentDate}
                </p>

                {/* Footer with logo and seal */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--brand-grey-300)',
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                  }}
                >
                  <div style={{ textAlign: 'left', width: '40%' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontFamily:
                          'SeasonMix, system-ui, -apple-system, sans-serif',
                        color: 'var(--brand-black)',
                      }}
                    >
                      Issued by Resolve
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', width: '20%' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-aqua)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        color: 'var(--brand-white)',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </div>
                  </div>

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
                  opacity: isGenerating ? 0.5 : 1,
                  fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
                  textDecoration: 'underline',
                }}
              >
                Edit Name
              </button>
            </div>

            {/* Download and Share Section */}
            <div className='no-print' style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  maxWidth: '500px',
                  margin: '0 auto',
                }}
              >
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  style={{
                    padding: '15px 25px',
                    fontSize: '18px',
                    width: '100%',
                    maxWidth: '350px',
                    backgroundColor: 'var(--brand-aqua)',
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

                {/* LinkedIn Share Button - ONLY UPDATED THE MESSAGE */}
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
