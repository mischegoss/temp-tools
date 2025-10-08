// src/components/Forms/utils/DownloadSection

import React from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import FormControlWithPrintFallback from './FormControlPDF'

const DownloadSection = ({
  formMetadata,
  handleFormMetadataChange,
  handleSubmit,
  submitStatus,
}) => {
  const styles = {
    card: {
      marginBottom: '2rem',
      borderRadius: '8px',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    cardHeader: {
      backgroundColor: 'var(--brand-secondary-white)',
      borderBottom: '2px solid var(--brand-grey-200)',
      padding: '1rem 1.5rem',
    },
    cardBody: {
      padding: '1.5rem',
      backgroundColor: 'var(--brand-white)',
    },
    formGroup: {
      marginBottom: '1.5rem',
      width: '100%',
    },
    formLabel: {
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: 'var(--brand-black-700)',
      fontSize: '1.1rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    formControl: {
      borderRadius: '4px',
      border: '2px solid var(--brand-grey-400)',
      fontSize: '1.1rem',
      padding: '12px',
      height: 'auto',
      minHeight: '50px',
      width: '100%',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      transition: 'all 0.3s ease-in-out',
    },
    textArea: {
      minHeight: '100px',
      resize: 'vertical',
    },
    submitButton: {
      padding: '12px 24px',
      fontSize: '1.1rem',
      fontWeight: '600',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      border: '2px solid var(--brand-aqua)',
      color: 'var(--brand-white)',
      width: '100%',
      marginTop: '1rem',
      transition: 'all 0.3s ease-in-out',
      borderRadius: '5px',
      boxShadow:
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    alert: {
      marginTop: '1rem',
      borderRadius: '4px',
      padding: '0.75rem 1.25rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    alertDanger: {
      backgroundColor: 'var(--brand-secondary-white)',
      borderColor: 'var(--brand-orange)',
      color: 'var(--brand-black)',
      border: '2px solid var(--brand-orange)',
      boxShadow:
        '0 0 15px rgba(255, 153, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    alertSuccess: {
      backgroundColor: 'var(--brand-secondary-white)',
      borderColor: 'var(--brand-green)',
      color: 'var(--brand-black)',
      border: '2px solid var(--brand-green)',
      boxShadow:
        '0 0 15px rgba(0, 176, 112, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    infoText: {
      fontSize: '0.9rem',
      color: 'var(--brand-aqua)',
      marginTop: '0.25rem',
      fontStyle: 'italic',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    noteText: {
      fontSize: '0.95rem',
      color: 'var(--brand-grey-600)',
      marginTop: '0.5rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    heading: {
      fontWeight: '600',
      fontSize: '1.4rem',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    description: {
      fontSize: '1.1rem',
      marginBottom: '1.5rem',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
  }

  // Check if email is pre-filled
  const hasPrefilledEmail = formMetadata.email

  // Basic email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    formMetadata.email || '',
  )

  // Handle form control focus effects
  const handleFormControlFocus = e => {
    e.target.style.borderColor = 'var(--brand-blue-400)'
    e.target.style.boxShadow = '0 0 10px rgba(0, 102, 255, 0.2)'
  }

  const handleFormControlBlur = e => {
    e.target.style.borderColor = 'var(--brand-grey-400)'
    e.target.style.boxShadow = 'none'
  }

  // Handle button hover effects
  const handleButtonHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.background =
        'linear-gradient(to bottom, var(--brand-black-700) 0%, var(--brand-aqua-600) 100%)'
      e.target.style.transform = 'translateY(-2px)'
      e.target.style.boxShadow =
        '0 0 20px rgba(0, 212, 255, 0.3), 0 8px 24px rgba(0, 212, 255, 0.2)'
    } else {
      e.target.style.background =
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)'
      e.target.style.transform = 'translateY(0)'
      e.target.style.boxShadow =
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  }

  return (
    <>
      <Card style={styles.card} className='no-print'>
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.heading}>Download Your Worksheet</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={styles.description}>
            {hasPrefilledEmail
              ? 'Please review your email before downloading the worksheet.'
              : 'Please provide your email to download the worksheet.'}
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Email Address</Form.Label>
              <FormControlWithPrintFallback
                type='email'
                name='email'
                value={formMetadata.email}
                onChange={handleFormMetadataChange}
                placeholder='Enter your email address'
                required
                style={{
                  ...styles.formControl,
                  backgroundColor: formMetadata.email
                    ? 'var(--brand-blue-100)'
                    : 'var(--brand-white)',
                }}
                onFocus={handleFormControlFocus}
                onBlur={handleFormControlBlur}
              />
              {hasPrefilledEmail && (
                <div style={styles.infoText}>Auto-filled from your account</div>
              )}
              <div style={styles.noteText}>
                Make sure to use the same email as you used to sign in.
              </div>
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              disabled={
                submitStatus.loading || !formMetadata.email || !isValidEmail
              }
              style={styles.submitButton}
              className='btn-lg'
              onMouseEnter={e => handleButtonHover(e, true)}
              onMouseLeave={e => handleButtonHover(e, false)}
            >
              {submitStatus.loading
                ? 'Preparing Download...'
                : 'Download Worksheet'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {submitStatus.error && (
        <div
          style={{ ...styles.alert, ...styles.alertDanger }}
          role='alert'
          className='no-print'
        >
          {submitStatus.error}
        </div>
      )}
      {submitStatus.success && (
        <div
          style={{ ...styles.alert, ...styles.alertSuccess }}
          role='alert'
          className='no-print'
        >
          Worksheet saved and downloaded successfully!
        </div>
      )}
    </>
  )
}

export default DownloadSection;
