// src/hooks/useFormSubmission.js
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { useFirebase } from '../../../contexts/FirebaseContext';
import { getItem, setItem } from '../../../components/Forms/utils/BrowserStorage';

/**
 * A reusable hook for form submissions that works with both 
 * authenticated and anonymous users.
 * 
 * @returns {Object} Submission utilities and state
 */
const useFormSubmission = () => {
  const { user } = useAuth();
  const { db } = useFirebase();
  
  // Submit status state
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  /**
   * Generate a unique submission ID
   * @returns {String} Unique submission ID
   */
  const generateSubmissionId = () => {
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `submission-${timestamp}-${randomSuffix}`;
  };

  /**
   * Get formatted current date
   * @returns {String} Formatted date string
   */
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  /**
   * Save form data to browserStorage for future pre-filling
   * @param {Object} formMetadata Form metadata including email and companyName
   */
  const saveToLocalStorage = (formMetadata) => {
    try {
      if (formMetadata.email) {
        setItem('userEmail', formMetadata.email);
      }
      if (formMetadata.companyName) {
        setItem('companyName', formMetadata.companyName);
      }
    } catch (error) {
      console.error('Error updating browserStorage:', error);
    }
  };

  /**
   * Submit form data to Firestore
   * 
   * @param {String} collectionName Firestore collection name
   * @param {Object} formData The form data to submit
   * @param {Object} formMetadata Metadata like email and companyName
   * @param {Function} onSuccess Callback function on successful submission
   * @returns {Promise} Submission promise
   */
  const submitForm = async (collectionName, formData, formMetadata, onSuccess = null) => {
    // Validate required email
    if (!formMetadata.email) {
      setSubmitStatus({
        loading: false,
        error: "Email is required to submit the form",
        success: false
      });
      return false;
    }

    setSubmitStatus({ loading: true, error: null, success: false });

    try {
      // Generate a unique submission ID
      const submissionId = generateSubmissionId();
      const currentDate = getCurrentDate();
      
      // Prepare the document with standard metadata structure
      const documentData = {
        ...formData,
        metadata: {
          // Form specific metadata
          ...formMetadata,
          // Standard metadata fields
          submissionId,
          completedDate: currentDate,
          timestamp: new Date().toISOString(),
          // Authentication information
          userId: user ? user.uid : null,
          isAuthenticated: !!user
        }
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, collectionName), documentData);
      
      // Store form metadata in browserStorage for future use
      saveToLocalStorage(formMetadata);
      
      // Set success status
      setSubmitStatus({ loading: false, error: null, success: true });
      
      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(docRef.id, documentData);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting form:', error);
      
      setSubmitStatus({
        loading: false,
        error: "Failed to save form. Please try again.",
        success: false
      });
      
      return false;
    }
  };

  /**
   * Get initial form metadata based on user state
   * 
   * @returns {Object} Initial form metadata
   */
  const getInitialFormMetadata = () => {
    // For authenticated users, use their information
    if (user) {
      return {
        email: user.email || '',
        companyName: user.displayName || ''
      };
    }
    
    // For anonymous users, try to get from browserStorage
    try {
      return {
        email: getItem('userEmail', ''),
        companyName: getItem('companyName', '')
      };
    } catch (error) {
      console.error('Error accessing browserStorage:', error);
      return { email: '', companyName: '' };
    }
  };

  // Return the hook's utilities and state
  return {
    submitForm,
    submitStatus,
    getInitialFormMetadata,
    isAuthenticated: !!user,
    user
  };
};

export default useFormSubmission;
