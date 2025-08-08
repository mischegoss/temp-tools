import React, { useState, useEffect } from 'react'
import { useAuth } from '@site/src/contexts/AuthContext'
import { useFirebase } from '@site/src/contexts/FirebaseContext'

const SavedFormsDisplay = () => {
  const { user, loading } = useAuth()
  const { db } = useFirebase()
  const [savedForms, setSavedForms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    const fetchSavedForms = async () => {
      if (!db) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Get email from user object or localStorage
        const userEmail = user?.email || localStorage.getItem('userEmail')

        console.log('Searching for forms with email:', userEmail)

        if (!userEmail) {
          setSavedForms([])
          setIsLoading(false)
          return
        }

        // Import Firestore methods
        const { collection, getDocs } = await import('firebase/firestore')
        const collectionNames = [
          'automation-assessments',
          'automation-why',
          'conversation-checklists',
          'orchestration-assessments',
          'ready-process',
          'ready-technical',
        ]

        let allForms = []
        const emailLowerCase = userEmail.toLowerCase()

        // Process each collection
        for (const collectionName of collectionNames) {
          try {
            const collectionRef = collection(db, collectionName)
            const querySnapshot = await getDocs(collectionRef)

            // Process each document
            querySnapshot.docs.forEach(doc => {
              const docData = doc.data()
              const docEmail = docData?.metadata?.email

              if (docEmail && docEmail.toLowerCase() === emailLowerCase) {
                allForms.push({
                  id: doc.id,
                  collectionName,
                  formType: getFormTypeFromCollection(collectionName),
                  timestamp: docData.metadata?.timestamp || null,
                })
              }
            })
          } catch (collectionError) {
            console.error(
              `Error with collection ${collectionName}:`,
              collectionError,
            )
          }
        }

        // Sort by date (newest first)
        allForms.sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0)
          const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0)
          return dateB - dateA
        })

        console.log('Forms found:', allForms)
        setSavedForms(allForms)
      } catch (err) {
        console.error('Error fetching saved forms:', err)
        setError('Unable to load your saved forms. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch forms once auth is no longer loading
    if (!loading) {
      fetchSavedForms()
    }
  }, [user, db, loading])

  // Helper function to get user-friendly form type names
  const getFormTypeFromCollection = collectionName => {
    const formTypes = {
      'automation-assessments': 'Automation Potential Assessment',
      'automation-why': 'Understand Your Automation "Why"',
      'conversation-checklists': 'Automation Conversation Checklist',
      'orchestration-assessments': 'Orchestration Potential',
      'ready-process': 'Process Documentation Worksheet',
      'ready-technical': 'Technical & People Readiness',
    }

    return formTypes[collectionName] || 'Unknown Form Type'
  }

  // Function to format the date
  const formatDate = timestamp => {
    if (!timestamp) return 'Unknown date'

    try {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch (err) {
      return 'Unknown date'
    }
  }

  // Function to get the URL for a form
  const getFormUrl = collectionName => {
    if (!collectionName)
      return '/learning/service-blueprinting/forms/forms-library'

    const urlMap = {
      'automation-assessments':
        '/learning/service-blueprinting/forms/forms-library/automation',
      'automation-why':
        '/learning/service-blueprinting/forms/forms-library/why',
      'conversation-checklists':
        '/learning/service-blueprinting/forms/forms-library/conversation',
      'orchestration-assessments':
        '/learning/service-blueprinting/forms/forms-library/orchestration',
      'ready-process':
        '/learning/service-blueprinting/forms/forms-library/process',
      'ready-technical':
        '/learning/service-blueprinting/forms/forms-library/technical',
    }

    return (
      urlMap[collectionName] ||
      '/learning/service-blueprinting/forms/forms-library'
    )
  }

  // Handle button click to navigate to the form
  const handleOpenForm = formUrl => {
    window.location.href = formUrl
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

  // Style objects
  const styles = {
    container: {
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    loadingState: {
      padding: '1.5rem',
      backgroundColor: 'var(--brand-secondary-white)',
      borderRadius: '8px',
      textAlign: 'center',
      border: '2px solid var(--brand-grey-300)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black)',
      fontSize: '1.1rem',
    },
    errorState: {
      padding: '1.5rem',
      backgroundColor: 'var(--brand-secondary-white)',
      borderRadius: '8px',
      textAlign: 'center',
      border: '2px solid var(--brand-orange)',
      boxShadow:
        '0 0 15px rgba(255, 153, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black)',
      fontSize: '1.1rem',
    },
    emptyState: {
      padding: '1.5rem',
      backgroundColor: 'var(--brand-secondary-white)',
      borderRadius: '8px',
      textAlign: 'center',
      border: '2px solid var(--brand-grey-300)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black)',
      fontSize: '1.1rem',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    card: {
      padding: '1.5rem',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '8px',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
    },
    cardHovered: {
      transform: 'translateY(-5px)',
      boxShadow:
        '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)',
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    cardDate: {
      color: 'var(--brand-grey-600)',
      fontSize: '0.9rem',
      marginBottom: '1.5rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    button: {
      padding: '0.75rem 1.5rem',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      color: 'var(--brand-white)',
      border: '2px solid var(--brand-aqua)',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      boxShadow:
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
  }

  // Simple loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>Loading your saved forms...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>{error}</div>
      </div>
    )
  }

  // Empty state
  if (!Array.isArray(savedForms) || savedForms.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>You don't have any saved forms yet.</div>
      </div>
    )
  }

  // Render the forms with buttons instead of anchor links
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Saved Forms</h2>
      <div style={styles.grid}>
        {savedForms.map(form => {
          const formUrl = `${getFormUrl(form.collectionName)}?formId=${form.id}`
          const isHovered = hoveredCard === form.id

          return (
            <div
              key={form.id}
              style={{
                ...styles.card,
                ...(isHovered ? styles.cardHovered : {}),
              }}
              onMouseEnter={() => setHoveredCard(form.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={styles.cardTitle}>
                {form.formType || 'Unknown Form Type'}
              </h3>
              <p style={styles.cardDate}>
                Created: {formatDate(form.timestamp)}
              </p>
              <button
                onClick={() => handleOpenForm(formUrl)}
                style={styles.button}
                onMouseEnter={e => handleButtonHover(e, true)}
                onMouseLeave={e => handleButtonHover(e, false)}
              >
                Open Form
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SavedFormsDisplay
