import { useEffect } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  updateDoc, 
  doc,
  where
} from 'firebase/firestore';
import { getItem } from './BrowserStorage';

/**
 * A custom hook that links form submissions with a user account
 * It runs when a user logs in, finds submissions with matching emails (case-insensitive),
 * and updates them to link to the user's account
 */
const useFormAssociation = (db, user) => {
  useEffect(() => {
    // Only run if we have a logged-in user
    if (!user || !user.email || !db) return;

    const associateFormsWithUser = async () => {
      try {
        console.log('Checking for submissions to associate with user:', user.email);
        
        // Get userEmail from either the user object or browserStorage
        const userEmail = user.email || getItem('userEmail', null);
        
        if (!userEmail) {
          console.log('No email found for form association');
          return;
        }
        
        // Convert user email to lowercase for case-insensitive comparison
        const normalizedUserEmail = userEmail.toLowerCase();
        
        console.log('Using email for form association:', userEmail);
        
        // Collections to check (expand this array to include all form types)
        const formCollections = [
          'automation-assessments',
          // Add other form collection names here as needed
        ];
        
        // Process each collection
        for (const collectionName of formCollections) {
          // Get all submissions that might match
          // We'll query just the collection and filter in memory for case-insensitive matching
          const submissionsQuery = query(
            collection(db, collectionName)
          );
          
          const querySnapshot = await getDocs(submissionsQuery);
          
          let associatedCount = 0;
          
          // Filter and update matching documents
          for (const document of querySnapshot.docs) {
            const data = document.data();
            
            // Check if the document has the expected structure
            if (!data.metadata || !data.metadata.email) {
              continue;
            }
            
            // Case-insensitive email comparison
            const docEmail = data.metadata.email.toLowerCase();
            
            if (docEmail === normalizedUserEmail) {
              console.log(`Found matching submission ${document.id} with email ${data.metadata.email}`);
              
              // Get the document reference
              const docRef = doc(db, collectionName, document.id);
              
              // Update the document to include the user ID
              await updateDoc(docRef, {
                'metadata.userId': user.uid,
                'metadata.associatedAt': new Date().toISOString()
              });
              
              associatedCount++;
            }
          }
          
          console.log(`Associated ${associatedCount} documents in ${collectionName}`);
        }
      } catch (error) {
        console.error('Error associating forms with user:', error);
      }
    };

    // Run the association process
    // Small delay to ensure browser storage is populated first
    const timeoutId = setTimeout(() => {
      associateFormsWithUser();
    }, 1000); // Increased timeout for better reliability
    
    // Clean up timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [db, user]);
};

export default useFormAssociation;