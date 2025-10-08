import React, { useState, useRef, useEffect } from 'react';
import PDFGenerator from '../utils/PDFGenerator';
import { styles } from '../styles/styles';
import { PrintStyles } from '../styles/print-styles';
import TitleSection from '../utils/TitleSection';
import DownloadSection from '../utils/DownloadSection';
import ProcessDescription from '../process/ProcessDescription';
import ProcessTrigger from '../process/ProcessTrigger';
import DecisionPoints from '../process/DecisionPoints';
import SystemInteractions from '../process/SystemInteractions';
import PeopleInteractions from '../process/PeopleInteractions';
import DataIO from '../process/DataIO';
import useAutoResizeTextarea from '../utils/AutoResizeHook';
import useFormSubmission from '../utils/UseFormSubmission';
import useFormLoader from '../utils/FormLoader'; // Added import
import { useFirebase } from '@site/src/contexts/FirebaseContext'; // Added import

/**
 * ProcessWorksheet component - Contains the simplified process mapping worksheet
 * with a guided approach for documentation after visualization
 * 
 * @returns {JSX.Element} ProcessWorksheet component
 */
const ProcessWorksheet = () => {
  const contentRef = useRef(null);
  const { db } = useFirebase(); // Added Firebase reference
  
  // Use the form submission hook
  const { 
    submitForm, 
    submitStatus, 
    getInitialFormMetadata 
  } = useFormSubmission();
  
  // Use the form loader hook with the correct collection name
  const { formData: loadedFormData, isLoading: formLoading } = useFormLoader(db, 'ready-process');
  
  const [subtitle, setSubtitle] = useState(
    "Document your process details using this guided worksheet. Complete this after creating your process visualization."
  );
  
  // Initialize form metadata with values from the hook
  const [formMetadata, setFormMetadata] = useState(getInitialFormMetadata());
  
  // Form state tracking
  const [formState, setFormState] = useState({
    lastSubmittedState: null,
    hasChanges: false,
  });

  // Main form data structure with new, simplified flow
  const [formData, setFormData] = useState({
    // Process Descriptions
    processDescriptions: [{ id: 1, content: '' }],
    
    // Process Trigger
    processStart: '',
    trigger: '',
    otherTrigger: '',
    
    // Decision Points
    decisionPoints: [],
    
    // System Interactions
    systemInteractions: [
      { id: 1, step: '', system: '', userAction: '' }
    ],
    
    // People Interactions
    peopleInteractions: [
      { id: 1, step: '', people: '', purpose: '', method: '' }
    ],
    
    // Data I/O
    inputData: [
      { id: 1, information: '', source: '' }
    ],
    outputData: [
      { id: 1, information: '', destination: '' }
    ]
  });

  // Load form data when it becomes available
  useEffect(() => {
    if (loadedFormData) {
      console.log("Loading saved form data:", loadedFormData);
      
      // Update all form sections with loaded data
      const updatedFormData = { ...formData };
      
      // Update process descriptions if available
      if (loadedFormData.processDescriptions && loadedFormData.processDescriptions.length > 0) {
        updatedFormData.processDescriptions = loadedFormData.processDescriptions;
      }
      
      // Update process trigger fields if available
      if (loadedFormData.processStart) {
        updatedFormData.processStart = loadedFormData.processStart;
      }
      
      if (loadedFormData.trigger) {
        updatedFormData.trigger = loadedFormData.trigger;
      }
      
      if (loadedFormData.otherTrigger) {
        updatedFormData.otherTrigger = loadedFormData.otherTrigger;
      }
      
      // Update decision points if available
      if (loadedFormData.decisionPoints && loadedFormData.decisionPoints.length > 0) {
        updatedFormData.decisionPoints = loadedFormData.decisionPoints;
      }
      
      // Update system interactions if available
      if (loadedFormData.systemInteractions && loadedFormData.systemInteractions.length > 0) {
        updatedFormData.systemInteractions = loadedFormData.systemInteractions;
      }
      
      // Update people interactions if available
      if (loadedFormData.peopleInteractions && loadedFormData.peopleInteractions.length > 0) {
        updatedFormData.peopleInteractions = loadedFormData.peopleInteractions;
      }
      
      // Update input data if available
      if (loadedFormData.inputData && loadedFormData.inputData.length > 0) {
        updatedFormData.inputData = loadedFormData.inputData;
      }
      
      // Update output data if available
      if (loadedFormData.outputData && loadedFormData.outputData.length > 0) {
        updatedFormData.outputData = loadedFormData.outputData;
      }
      
      // Set the updated form data
      setFormData(updatedFormData);
      
      // Update subtitle with form information
      if (loadedFormData.metadata && loadedFormData.metadata.completedDate) {
        setSubtitle(`Created for ${loadedFormData.metadata.companyName || 'your company'} on ${loadedFormData.metadata.completedDate}`);
      }
      
      // Update metadata if available
      if (loadedFormData.metadata) {
        setFormMetadata(prevMetadata => ({
          ...prevMetadata,
          email: loadedFormData.metadata.email || prevMetadata.email,
          companyName: loadedFormData.metadata.companyName || prevMetadata.companyName
        }));
      }
      
      // Set lastSubmittedState to prevent duplicate submissions
      setFormState({
        lastSubmittedState: { ...updatedFormData },
        hasChanges: false
      });
    }
  }, [loadedFormData]);

  // Use the custom hook for auto-resizing textareas
  useAutoResizeTextarea([
    formData.processDescriptions, 
    formData.decisionPoints, 
    formData.systemInteractions,
    formData.peopleInteractions,
    formData.inputData,
    formData.outputData
  ]);

  // Handle adding additional process description cards
  const addProcessDescription = () => {
    const newId = formData.processDescriptions.length > 0 
      ? Math.max(...formData.processDescriptions.map(d => d.id)) + 1 
      : 1;
      
    setFormData(prev => ({
      ...prev,
      processDescriptions: [
        ...prev.processDescriptions,
        { id: newId, content: '' }
      ]
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle updating a process description
  const handleProcessDescriptionChange = (id, content) => {
    setFormData(prev => ({
      ...prev,
      processDescriptions: prev.processDescriptions.map(desc => 
        desc.id === id ? { ...desc, content } : desc
      )
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle removing a process description
  const removeProcessDescription = (id) => {
    // Don't remove if it's the only description
    if (formData.processDescriptions.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      processDescriptions: prev.processDescriptions.filter(desc => desc.id !== id)
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle process trigger changes
  const handleProcessTriggerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle adding a decision point
  const addDecisionPoint = () => {
    const newId = formData.decisionPoints.length > 0 
      ? Math.max(...formData.decisionPoints.map(d => d.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      decisionPoints: [
        ...prev.decisionPoints,
        { 
          id: newId, 
          question: '',
          yesPath: '',
          noPath: '',
          decisionMaker: ''
        }
      ]
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle updating a decision point
  const handleDecisionPointChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      decisionPoints: prev.decisionPoints.map(decision => 
        decision.id === id ? { ...decision, [field]: value } : decision
      )
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle removing a decision point
  const removeDecisionPoint = (id) => {
    setFormData(prev => ({
      ...prev,
      decisionPoints: prev.decisionPoints.filter(decision => decision.id !== id)
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle adding a system interaction
  const addSystemInteraction = () => {
    const newId = formData.systemInteractions.length > 0 
      ? Math.max(...formData.systemInteractions.map(i => i.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      systemInteractions: [
        ...prev.systemInteractions,
        { id: newId, step: '', system: '', userAction: '' }
      ]
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle updating a system interaction
  const handleSystemInteractionChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      systemInteractions: prev.systemInteractions.map(interaction => 
        interaction.id === id ? { ...interaction, [field]: value } : interaction
      )
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle removing a system interaction
  const removeSystemInteraction = (id) => {
    // Don't remove if it's the only interaction
    if (formData.systemInteractions.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      systemInteractions: prev.systemInteractions.filter(interaction => interaction.id !== id)
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle adding a people interaction
  const addPeopleInteraction = () => {
    const newId = formData.peopleInteractions.length > 0 
      ? Math.max(...formData.peopleInteractions.map(i => i.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      peopleInteractions: [
        ...prev.peopleInteractions,
        { id: newId, step: '', people: '', purpose: '', method: '' }
      ]
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle updating a people interaction
  const handlePeopleInteractionChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      peopleInteractions: prev.peopleInteractions.map(interaction => 
        interaction.id === id ? { ...interaction, [field]: value } : interaction
      )
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle removing a people interaction
  const removePeopleInteraction = (id) => {
    // Don't remove if it's the only interaction
    if (formData.peopleInteractions.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      peopleInteractions: prev.peopleInteractions.filter(interaction => interaction.id !== id)
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle adding an input data entry
  const addInputData = () => {
    const newId = formData.inputData.length > 0 
      ? Math.max(...formData.inputData.map(i => i.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      inputData: [
        ...prev.inputData,
        { id: newId, information: '', source: '' }
      ]
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle updating input data
  const handleInputDataChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      inputData: prev.inputData.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle removing input data
  const removeInputData = (id) => {
    // Don't remove if it's the only input
    if (formData.inputData.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      inputData: prev.inputData.filter(input => input.id !== id)
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle adding an output data entry
  const addOutputData = () => {
    const newId = formData.outputData.length > 0 
      ? Math.max(...formData.outputData.map(o => o.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      outputData: [
        ...prev.outputData,
        { id: newId, information: '', destination: '' }
      ]
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle updating output data
  const handleOutputDataChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      outputData: prev.outputData.map(output => 
        output.id === id ? { ...output, [field]: value } : output
      )
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle removing output data
  const removeOutputData = (id) => {
    // Don't remove if it's the only output
    if (formData.outputData.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      outputData: prev.outputData.filter(output => output.id !== id)
    }));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const handleFormMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormMetadata(prev => ({ ...prev, [name]: value }));
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
      
      // Prepare the current form state
      const currentFormState = { ...formData };
      
      // Check if form has significant changes before submitting
      const hasSignificantChanges = formState.hasChanges || !formState.lastSubmittedState;
      
      if (hasSignificantChanges) {
        // Use the submitForm function from the hook
        await submitForm(
          'ready-process',       // Collection name
          currentFormState,      // Form data
          formMetadata,          // Metadata (email, companyName)
          // Success callback
          async () => {
            // Update form state to track this submission
            setFormState({
              lastSubmittedState: currentFormState,
              hasChanges: false,
            });
            
            // Generate and download PDF after successful submission
            await PDFGenerator.generatePDF(contentRef, 'process-mapping-worksheet.pdf');
          }
        );
      } else {
        // Just generate PDF if no significant changes
        await PDFGenerator.generatePDF(contentRef, 'process-mapping-worksheet.pdf');
      }
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
        {/* Title Section */}
        <TitleSection title="Process Documentation Worksheet" subtitle={subtitle} />
        
        {/* Process Description with Process Map */}
        <ProcessDescription 
          descriptions={formData.processDescriptions}
          onAddDescription={addProcessDescription}
          onUpdateDescription={handleProcessDescriptionChange}
          onRemoveDescription={removeProcessDescription}
        />
        
        {/* Process Trigger Section */}
        <ProcessTrigger 
          triggerData={{
            processStart: formData.processStart,
            trigger: formData.trigger,
            otherTrigger: formData.otherTrigger
          }}
          onTriggerChange={handleProcessTriggerChange}
        />
        
        {/* Decision Points Section */}
        <DecisionPoints
          decisionPoints={formData.decisionPoints}
          onAddDecisionPoint={addDecisionPoint}
          onUpdateDecisionPoint={handleDecisionPointChange}
          onRemoveDecisionPoint={removeDecisionPoint}
        />
        
        {/* System Interactions Section */}
        <SystemInteractions
          systemInteractions={formData.systemInteractions}
          onAddSystemInteraction={addSystemInteraction}
          onUpdateSystemInteraction={handleSystemInteractionChange}
          onRemoveSystemInteraction={removeSystemInteraction}
        />
        
        {/* People Interactions Section */}
        <PeopleInteractions
          peopleInteractions={formData.peopleInteractions}
          onAddPeopleInteraction={addPeopleInteraction}
          onUpdatePeopleInteraction={handlePeopleInteractionChange}
          onRemovePeopleInteraction={removePeopleInteraction}
        />
        
        {/* Data Inputs and Outputs Section */}
        <DataIO 
          inputData={formData.inputData}
          outputData={formData.outputData}
          onAddInputData={addInputData}
          onUpdateInputData={handleInputDataChange}
          onRemoveInputData={removeInputData}
          onAddOutputData={addOutputData}
          onUpdateOutputData={handleOutputDataChange}
          onRemoveOutputData={removeOutputData}
        />
        
        {/* Download Section */}
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
  
export default ProcessWorksheet;