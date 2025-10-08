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
        `service-blueprinting-certificate-${name.replace(/\s+/g, '-')}.pdf`,
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

  // Brand Styles
  const containerStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    width: '100%',
    maxWidth: '1200px',
    margin: '20px auto',
  }

  const inputCardStyle = {
    backgroundColor: 'var(--brand-white)',
    borderRadius: '12px',
    border: '2px solid var(--brand-blue-400)',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    padding: '30px',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  }

  const inputStyle = {
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
  }

  const inputFocusHandler = (e, isFocus) => {
    if (isFocus) {
      e.target.style.borderColor = 'var(--brand-blue-400)'
      e.target.style.boxShadow = '0 0 10px rgba(0, 102, 255, 0.2)'
    } else {
      e.target.style.borderColor = 'var(--brand-grey-300)'
      e.target.style.boxShadow = 'none'
    }
  }

  const primaryButtonStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    padding: '15px 25px',
    fontSize: '18px',
    background:
      'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
    color: 'var(--brand-white)',
    border: '2px solid var(--brand-blue-400)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    fontWeight: '600',
    outline: 'none',
  }

  const certificateStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    marginBottom: '5px',
    backgroundColor: 'var(--brand-white)',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  }

  const certificateInnerStyle = {
    width: '100%',
    padding: '40px 20px',
    backgroundColor: 'var(--brand-white)',
    textAlign: 'center',
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    color: 'var(--brand-black)',
    boxSizing: 'border-box',
    position: 'relative',
    minHeight: '500px',
    border: '10px solid var(--brand-blue)',
    borderRadius: '8px',
    margin: '0 auto',
  }

  const actionsCardStyle = {
    backgroundColor: 'var(--brand-secondary-white)',
    borderRadius: '12px',
    border: '2px solid var(--brand-blue-400)',
    boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
  }

  const downloadButtonStyle = {
    ...primaryButtonStyle,
    width: '100%',
    maxWidth: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  }

  const linkedinButtonStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    padding: '15px 25px',
    fontSize: '18px',
    width: '100%',
    maxWidth: '350px',
    backgroundColor: '#0077B5', // Keep LinkedIn brand color
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease-in-out',
    fontWeight: '600',
    outline: 'none',
  }

  const editButtonStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    padding: '5px 10px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: 'var(--brand-grey-600)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.3s ease',
  }

  const labelStyle = {
    fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'var(--brand-black)',
    fontSize: '16px',
  }

  const buttonHoverHandler = (e, isHover, buttonType = 'primary') => {
    if (buttonType === 'primary') {
      if (isHover) {
        e.target.style.transform = 'translateY(-2px)'
        e.target.style.boxShadow =
          '0 0 20px rgba(0, 102, 255, 0.4), 0 4px 16px rgba(0, 102, 255, 0.3)'
      } else {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = 'none'
      }
    } else if (buttonType === 'linkedin') {
      e.target.style.backgroundColor = isHover ? '#005885' : '#0077B5'
    } else if (buttonType === 'edit') {
      e.target.style.color = isHover
        ? 'var(--brand-blue)'
        : 'var(--brand-grey-600)'
    }
  }

  return (
    <>
      <PrintStyles />

      <div style={containerStyle}>
        {!showCertificate ? (
          <div
            className='card no-print'
            style={inputCardStyle}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow =
                '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow =
                '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none',
                borderRadius: '12px',
              }}
            />

            <div
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <label htmlFor='certificate-name' style={labelStyle}>
                Enter your name as you'd like it to appear on the certificate:
              </label>
              <input
                id='certificate-name'
                type='text'
                value={name}
                onChange={handleNameChange}
                placeholder='Your Full Name'
                style={inputStyle}
                onFocus={e => inputFocusHandler(e, true)}
                onBlur={e => inputFocusHandler(e, false)}
              />
              <button
                onClick={handleGenerateCertificate}
                style={primaryButtonStyle}
                onMouseEnter={e => buttonHoverHandler(e, true, 'primary')}
                onMouseLeave={e => buttonHoverHandler(e, false, 'primary')}
                onMouseDown={e =>
                  (e.target.style.transform = 'translateY(-1px)')
                }
                onMouseUp={e => (e.target.style.transform = 'translateY(-2px)')}
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
              style={certificateStyle}
            >
              <div
                className='title-section'
                style={certificateInnerStyle}
                data-pdf-section='title'
              >
                <div style={{ marginBottom: '20px' }}>
                  <h2
                    style={{
                      color: 'var(--brand-blue)',
                      fontSize: '28px',
                      margin: '0 0 10px 0',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                      fontWeight: '600',
                    }}
                  >
                    Certificate of Completion
                  </h2>
                  <div
                    style={{
                      width: '100%',
                      height: '2px',
                      background: 'var(--brand-aqua)',
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
                    color: 'var(--brand-blue)',
                    margin: '20px 0',
                    fontStyle: 'italic',
                    fontFamily:
                      'SeasonMix, system-ui, -apple-system, sans-serif',
                    fontWeight: '600',
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
                      color: 'var(--brand-blue)',
                      fontFamily:
                        'SeasonMix, system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Service Blueprinting Essentials
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
                  ...editButtonStyle,
                  opacity: isGenerating ? 0.7 : 1,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e =>
                  !isGenerating && buttonHoverHandler(e, true, 'edit')
                }
                onMouseLeave={e => buttonHoverHandler(e, false, 'edit')}
              >
                Edit your name
              </button>
            </div>

            <div className='card no-print' style={actionsCardStyle}>
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
                    ...downloadButtonStyle,
                    opacity: isGenerating ? 0.7 : 1,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e =>
                    !isGenerating && buttonHoverHandler(e, true, 'primary')
                  }
                  onMouseLeave={e => buttonHoverHandler(e, false, 'primary')}
                  onMouseDown={e =>
                    !isGenerating &&
                    (e.target.style.transform = 'translateY(-1px)')
                  }
                  onMouseUp={e =>
                    !isGenerating &&
                    (e.target.style.transform = 'translateY(-2px)')
                  }
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
                      const shareText = `🎉 I just completed the Service Blueprinting Essentials course!\n\nLearned how to map and automate business processes effectively. Excited to apply these new skills!\n\n#ServiceBlueprinting #ProcessAutomation #ProfessionalDevelopment`

                      const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                        shareText,
                      )}`

                      window.open(
                        linkedInUrl,
                        'linkedin-share-dialog',
                        'width=600,height=600',
                      )
                    }}
                    style={linkedinButtonStyle}
                    onMouseEnter={e => buttonHoverHandler(e, true, 'linkedin')}
                    onMouseLeave={e => buttonHoverHandler(e, false, 'linkedin')}
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
