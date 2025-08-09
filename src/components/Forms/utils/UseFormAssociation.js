// Triple-layer protected form association hook
// src/components/Forms/utils/UseFormAssociation.js
import { useEffect, useState } from 'react'
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore'
import { getItem } from './BrowserStorage'

/**
 * A custom hook that links form submissions with a user account
 * It runs when a user logs in, finds submissions with matching emails (case-insensitive),
 * and updates them to link to the user's account
 *
 * PERFORMANCE OPTIMIZED with triple-layer protection:
 * - Only runs on protected pages (via AuthContext conditional)
 * - Only runs once per component lifecycle (hasProcessed state)
 * - Only runs once per browser session (sessionStorage)
 */
const useFormAssociation = (db, user) => {
  // OPTION 2: Component lifecycle protection - only run once per mount
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    // TRIPLE CHECK: user exists, hasn't processed, and has email
    if (!user || !user.email || !db || hasProcessed) return

    // OPTION 3: Session storage protection - only run once per browser session
    const hasProcessedKey = `form-association-${user.uid}`
    const hasProcessedSession = sessionStorage.getItem(hasProcessedKey)

    if (hasProcessedSession) {
      console.log(
        'Form association already completed this session for user:',
        user.email,
      )
      setHasProcessed(true)
      return
    }

    const associateFormsWithUser = async () => {
      try {
        console.log('Starting form association for user:', user.email)

        // Set processed flag BEFORE async operations to prevent race conditions
        setHasProcessed(true)
        sessionStorage.setItem(hasProcessedKey, 'true')

        // Get userEmail from either the user object or browserStorage
        const userEmail = user.email || getItem('userEmail', null)

        if (!userEmail) {
          console.log('No email found for form association')
          return
        }

        // Convert user email to lowercase for case-insensitive comparison
        const normalizedUserEmail = userEmail.toLowerCase()

        console.log('Using email for form association:', userEmail)

        // Collections to check (expand this array to include all form types)
        const formCollections = [
          'automation-assessments',
          'automation-why',
          'conversation-checklists',
          'orchestration-assessments',
          'ready-process',
          'ready-technical',
          // Add other form collection names here as needed
        ]

        let totalAssociated = 0

        // Process each collection
        for (const collectionName of formCollections) {
          try {
            console.log(`Checking collection: ${collectionName}`)

            // Get all submissions that might match
            // We'll query just the collection and filter in memory for case-insensitive matching
            const submissionsQuery = query(collection(db, collectionName))

            const querySnapshot = await getDocs(submissionsQuery)

            let associatedCount = 0

            // Filter and update matching documents
            for (const document of querySnapshot.docs) {
              const data = document.data()

              // Check if the document has the expected structure
              if (!data.metadata || !data.metadata.email) {
                continue
              }

              // Skip if already associated with this user
              if (data.metadata.userId === user.uid) {
                continue
              }

              // Case-insensitive email comparison
              const docEmail = data.metadata.email.toLowerCase()

              if (docEmail === normalizedUserEmail) {
                console.log(
                  `Found matching submission ${document.id} with email ${data.metadata.email}`,
                )

                // Get the document reference
                const docRef = doc(db, collectionName, document.id)

                // Update the document to include the user ID
                await updateDoc(docRef, {
                  'metadata.userId': user.uid,
                  'metadata.associatedAt': new Date().toISOString(),
                })

                associatedCount++
                totalAssociated++
              }
            }

            if (associatedCount > 0) {
              console.log(
                `Associated ${associatedCount} documents in ${collectionName}`,
              )
            }
          } catch (collectionError) {
            console.error(
              `Error processing collection ${collectionName}:`,
              collectionError,
            )
            // Continue with other collections even if one fails
          }
        }

        console.log(
          `Form association completed. Total documents associated: ${totalAssociated}`,
        )
      } catch (error) {
        console.error('Error associating forms with user:', error)

        // Reset flags on error to allow retry
        setHasProcessed(false)
        sessionStorage.removeItem(hasProcessedKey)
      }
    }

    // Run the association process with a small delay to ensure browser storage is populated
    const timeoutId = setTimeout(() => {
      associateFormsWithUser()
    }, 500) // Reduced timeout since we have better protection now

    // Clean up timeout on unmount
    return () => clearTimeout(timeoutId)
  }, [db, user, hasProcessed])
}

export default useFormAssociation
