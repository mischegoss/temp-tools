import React, { useRef, useState, useEffect } from 'react';

// Import reusable components
import PDFGenerator from '../utils/PDFGenerator';
import TitleSection from '../utils/TitleSection';
import DownloadSection from '../utils/DownloadSection';
import { PrintStyles } from '../styles/print-styles';
import { styles } from '../styles/styles';
import useAutoResizeTextarea from '../utils/AutoResizeHook';
import BusinessGoalsForm from '../partials/BusinessGoals';
import useFormSubmission from '../utils/UseFormSubmission';
import useFormLoader from '../utils/FormLoader'; // Import the form loader hook
import { useFirebase } from "@site/src/contexts/FirebaseContext";

const Why = () => {
  const contentRef = useRef();
  const { db } = useFirebase(); // Get database reference
  
  // Use the form submission hook
  const { 
    submitForm, 
    submitStatus, 
    getInitialFormMetadata,
    isAuthenticated,
    user 
  } = useFormSubmission();
  
  const [subtitle, setSubtitle] = useState("Use this guide to help document your business needs and discover your automation 'why' ");
  
  // Initialize form metadata with values from the hook
  const [formMetadata, setFormMetadata] = useState(getInitialFormMetadata());

  const [formData, setFormData] = useState({
    businessGoals: {
      challenges: '',
      objectives: ''
    },
    successMetrics: {
      currentSLA: '',
      targetSLA: ''
    },
    futureState: {
      customerExperience: '',
      processEfficiency: ''
    }
  });
  
  // Use the form loader hook to load saved data
  const { formData: savedFormData, isLoading: formLoading } = useFormLoader(db, 'automation-why');
  
  // Load form data when it becomes available
  useEffect(() => {
    if (savedFormData) {
      console.log("Loading saved form data:", savedFormData);
      
      // Update form data if available
      if (savedFormData.businessGoals || savedFormData.successMetrics || savedFormData.futureState) {
        setFormData({
          businessGoals: savedFormData.businessGoals || formData.businessGoals,
          successMetrics: savedFormData.successMetrics || formData.successMetrics,
          futureState: savedFormData.futureState || formData.futureState
        });
      }
      
      // Update subtitle with form information
      if (savedFormData.metadata && savedFormData.metadata.completedDate) {
        setSubtitle(`Created for ${savedFormData.metadata.companyName || 'your company'} on ${savedFormData.metadata.completedDate}`);
      }
      
      // Update metadata if available
      if (savedFormData.metadata) {
        setFormMetadata(prevMetadata => ({
          ...prevMetadata,
          email: savedFormData.metadata.email || prevMetadata.email,
          companyName: savedFormData.metadata.companyName || prevMetadata.companyName
        }));
      }
    }
  }, [savedFormData]);

  // Use the auto-resize textarea hook
  useAutoResizeTextarea([formData]);

  const handleFormChange = (section, subsection, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: value
      }
    }));
  };

  const handleFormMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Updated submit handler using the useFormSubmission hook
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update the subtitle with company name and date
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      setSubtitle(`Created for ${formMetadata.companyName || 'your company'} on ${currentDate}`);

      // Wait a brief moment for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use the submitForm function from the hook
      await submitForm(
        'automation-why',         // Collection name
        formData,                 // Form data
        formMetadata,             // Metadata (email, companyName)
        // Success callback
        async () => {
          // Generate and download PDF after successful submission
          await PDFGenerator.generatePDF(contentRef, 'understand-automation-why.pdf');
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Show loading state while form data is being fetched
  if (formLoading) {
    return (
      <div style={styles.wrapper}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Loading your form data...</h2>
          <p>Please wait while we retrieve your saved form.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <PrintStyles />
      <div ref={contentRef} style={styles.container} className="container-print">
        {/* Using TitleSection component with custom title */}
        <TitleSection title="Understand Your Automation 'Why'" subtitle={subtitle} />

        {/* Using shared form component */}
        <BusinessGoalsForm formData={formData} handleFormChange={handleFormChange} />

        {/* Use DownloadSection component */}
        <DownloadSection 
          formMetadata={formMetadata} 
          handleFormMetadataChange={handleFormMetadataChange} 
          handleSubmit={handleSubmit} 
          submitStatus={submitStatus} 
        />
      </div>
    </div>
  );
};

export default Why;
