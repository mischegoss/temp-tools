import { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

/**
 * A custom hook that loads a form from Firestore based on URL query parameters
 * 
 * @param {Object} db - Firestore database instance
 * @param {String} collectionName - Collection name to search for the form
 * @returns {Object} The form data, loading state, and error information
 */
const useFormLoader = (db, collectionName) => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Parse query parameters from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const formId = queryParams.get('formId');
  
  useEffect(() => {
    // Track mounted state to prevent updates after unmount
    let isMounted = true;
    
    const loadForm = async () => {
      // If no formId is provided or no db instance, don't attempt to load
      if (!formId || !db) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
      
      try {
        // Import Firestore methods
        const { doc, getDoc } = await import('firebase/firestore');
        
        console.log(`Looking for form ${formId} in collection ${collectionName}`);
        const docRef = doc(db, collectionName, formId);
        const docSnapshot = await getDoc(docRef);
        
        if (docSnapshot.exists()) {
          console.log(`Form found in ${collectionName}`);
          const rawData = docSnapshot.data();
          console.log('Raw form data structure:', rawData);
          
          // Extract form data based on the structure observed in Firebase
          // Check for different possible data structures
          let processedData = {
            id: formId,
            collectionName: collectionName
          };
          
          // Handle nested formData if it exists
          if (rawData.formData) {
            processedData = {
              ...processedData,
              ...rawData.formData
            };
          }
          
          // Copy top-level fields that might be needed
          if (rawData.metadata) {
            processedData.metadata = rawData.metadata;
          }
          
          // For the "Why" form specifically, handle business goals and other fields
          if (collectionName === 'automation-why') {
            processedData.businessGoals = rawData.businessGoals || {};
            processedData.futureState = rawData.futureState || {};
            processedData.successMetrics = rawData.successMetrics || {};
          }
          
          // For the automation assessments
          if (collectionName === 'automation-assessments') {
            processedData.scores = rawData.scores || {};
            processedData.inputs = rawData.inputs || {};
            processedData.results = rawData.results || null;
            processedData.totalScore = rawData.totalScore || 0;
          }
          
          // For conversation checklists
          if (collectionName === 'conversation-checklists') {
            processedData.businessContext = rawData.businessContext || {};
            processedData.processData = rawData.processData || {};
            processedData.connectionPoints = rawData.connectionPoints || {};
            processedData.conversationPrep = rawData.conversationPrep || {};
          }
          
          // For orchestration assessments
          if (collectionName === 'orchestration-assessments') {
            processedData.currentMetrics = rawData.currentMetrics || {};
            processedData.processScores = rawData.processScores || {};
            processedData.criteriaScores = rawData.criteriaScores || {};
            processedData.totalScore = rawData.totalScore || 0;
            processedData.recommendation = rawData.recommendation || {};
            processedData.potentialTimeSavings = rawData.potentialTimeSavings || '';
          }
          
          // For process documentation worksheets
          if (collectionName === 'ready-process') {
            processedData.processDescriptions = rawData.processDescriptions || [];
            processedData.processStart = rawData.processStart || '';
            processedData.trigger = rawData.trigger || '';
            processedData.otherTrigger = rawData.otherTrigger || '';
            processedData.decisionPoints = rawData.decisionPoints || [];
            processedData.systemInteractions = rawData.systemInteractions || [];
            processedData.peopleInteractions = rawData.peopleInteractions || [];
            processedData.inputData = rawData.inputData || [];
            processedData.outputData = rawData.outputData || [];
          }
          
          // For technical readiness assessment
          if (collectionName === 'ready-technical') {
            processedData.systems = rawData.systems || [];
            processedData.connections = rawData.connections || [];
            processedData.teams = rawData.teams || [];
            processedData.checkboxes = rawData.checkboxes || {};
          }
          
          console.log('Processed form data:', processedData);
          
          if (isMounted) {
            setFormData(processedData);
          }
        } else {
          console.log(`Form not found in collection ${collectionName}`);
          
          if (isMounted) {
            setError('The requested form could not be found.');
          }
        }
      } catch (err) {
        console.error('Error loading form:', err);
        
        if (isMounted) {
          setError('Failed to load the form. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadForm();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [db, formId, collectionName]);
  
  return { formData, isLoading, error, formId };
};

export default useFormLoader;