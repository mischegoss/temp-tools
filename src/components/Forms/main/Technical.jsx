import React, { useState, useRef, useEffect } from 'react';

// Import existing components
import useAutoResizeTextarea from '../utils/AutoResizeHook';
import PDFGenerator from '../utils/PDFGenerator';
import { PrintStyles } from '../styles/print-styles';
import TitleSection from '../utils/TitleSection';
import DownloadSection from '../utils/DownloadSection';
import { styles } from '../styles/styles';

// Import modular components
import SystemDocumentation from '../partials/SystemDocumentation';
import SystemConnections from '../partials/SystemConnections';
import TeamKnowledge from '../partials/TeamKnowledge';
import TechnicalReadinessChecklist from '../partials/TechnicalChecklist';

// Import form hooks
import useFormSubmission from '../utils/UseFormSubmission';
import useFormLoader from '../utils/FormLoader'; // Added import
import { useFirebase } from '@site/src/contexts/FirebaseContext'; // Added import

const Technical = () => {
  // Use the auto-resize textarea hook
  useAutoResizeTextarea();
  
  const { db } = useFirebase(); // Added Firebase reference
  
  // Use the form submission hook
  const { 
    submitForm, 
    submitStatus, 
    getInitialFormMetadata 
  } = useFormSubmission();
  
  // Use the form loader hook with the correct collection name
  const { formData: loadedFormData, isLoading: formLoading } = useFormLoader(db, 'ready-technical');
  
  const contentRef = useRef();
  const [subtitle, setSubtitle] = useState(
    "Assess your technical systems and team readiness for automation using this guide. Even if you're unsure about some areas, capture what you can. Each piece of information helps us build a strong foundation for successful automation."
  );
  
  // Initialize form metadata with values from the hook
  const [formMetadata, setFormMetadata] = useState(getInitialFormMetadata());
  
  // Form state tracking
  const [formState, setFormState] = useState({
    lastSubmittedState: null,
    hasChanges: false,
  });

  // State for systems documentation
  const [systems, setSystems] = useState([
    {
      id: 1,
      details: {
        name: '',
        function: '',
        step: '',
        departments: ''
      },
      experts: {
        mainContact: '',
        technicalExpert: '',
        maintenanceHandler: '',
        adminAccess: ''
      }
    }
  ]);

  // State for system connections
  const [connections, setConnections] = useState([
    {
      id: 1,
      systemsInvolved: '',
      information: '',
      currentMethod: ''
    }
  ]);

  // State for team needs
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: '',
      knowledgeNeeded: '',
      availableTraining: ''
    }
  ]);

  // State for technical readiness checklist
  const [checkboxes, setCheckboxes] = useState({
    systemInventory: false,
    connectionPoints: false,
    accessPermissions: false,
    teamExpertise: false,
    informationFlow: false,
    technicalRequirements: false
  });
  
  // Load form data when it becomes available
  useEffect(() => {
    if (loadedFormData) {
      console.log("Loading saved form data:", loadedFormData);
      
      // Update systems if available
      if (loadedFormData.systems && loadedFormData.systems.length > 0) {
        setSystems(loadedFormData.systems);
      }
      
      // Update connections if available
      if (loadedFormData.connections && loadedFormData.connections.length > 0) {
        setConnections(loadedFormData.connections);
      }
      
      // Update teams if available
      if (loadedFormData.teams && loadedFormData.teams.length > 0) {
        setTeams(loadedFormData.teams);
      }
      
      // Update checkboxes if available
      if (loadedFormData.checkboxes) {
        setCheckboxes(loadedFormData.checkboxes);
      }
      
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
        lastSubmittedState: {
          systems: loadedFormData.systems || [],
          connections: loadedFormData.connections || [],
          teams: loadedFormData.teams || [],
          checkboxes: loadedFormData.checkboxes || {}
        },
        hasChanges: false
      });
    }
  }, [loadedFormData]);

  const handleFormMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    setCheckboxes({
      ...checkboxes,
      [event.target.name]: event.target.checked
    });
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const handleSystemDetailsChange = (systemId, field, value) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, details: { ...system.details, [field]: value } } 
        : system
    ));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const handleSystemExpertChange = (systemId, field, value) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, experts: { ...system.experts, [field]: value } } 
        : system
    ));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const handleConnectionChange = (connectionId, field, value) => {
    setConnections(prev => prev.map(connection => 
      connection.id === connectionId 
        ? { ...connection, [field]: value } 
        : connection
    ));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const handleTeamChange = (teamId, field, value) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, [field]: value } 
        : team
    ));
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const addSystem = () => {
    const newId = Math.max(...systems.map(s => s.id)) + 1;
    setSystems(prev => [
      ...prev,
      {
        id: newId,
        details: {
          name: '',
          function: '',
          step: '',
          departments: ''
        },
        experts: {
          mainContact: '',
          technicalExpert: '',
          maintenanceHandler: '',
          adminAccess: ''
        }
      }
    ]);
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const addConnection = () => {
    const newId = Math.max(...connections.map(c => c.id)) + 1;
    setConnections(prev => [
      ...prev,
      {
        id: newId,
        systemsInvolved: '',
        information: '',
        currentMethod: ''
      }
    ]);
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const addTeam = () => {
    const newId = Math.max(...teams.map(t => t.id)) + 1;
    setTeams(prev => [
      ...prev,
      {
        id: newId,
        name: '',
        knowledgeNeeded: '',
        availableTraining: ''
      }
    ]);
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
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
      
      // Prepare the current form state
      const currentFormState = {
        systems,
        connections,
        teams,
        checkboxes
      };
      
      // Check if form has significant changes before submitting
      const hasSignificantChanges = formState.hasChanges || !formState.lastSubmittedState;
      
      if (hasSignificantChanges) {
        // Use the submitForm function from the hook
        await submitForm(
          'ready-technical',      // Collection name
          currentFormState,       // Form data
          formMetadata,           // Metadata (email, companyName)
          // Success callback
          async () => {
            // Update form state to track this submission
            setFormState({
              lastSubmittedState: currentFormState,
              hasChanges: false,
            });
            
            // Generate and download PDF after successful submission
            await PDFGenerator.generatePDF(contentRef, 'technical-assessment.pdf');
          }
        );
      } else {
        // Just generate PDF if no significant changes
        await PDFGenerator.generatePDF(contentRef, 'technical-assessment.pdf');
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
        <TitleSection title="Technical and People Readiness" subtitle={subtitle} />
  
        {/* System Documentation Section - Using the new component */}
        <SystemDocumentation 
          systems={systems}
          handleSystemDetailsChange={handleSystemDetailsChange}
          handleSystemExpertChange={handleSystemExpertChange}
          addSystem={addSystem}
        />
  
        {/* How Systems Connect Section - Using the new component */}
        <SystemConnections 
          connections={connections}
          handleConnectionChange={handleConnectionChange}
          addConnection={addConnection}
        />
  
        {/* Team Knowledge Section - Using the new component */}
        <TeamKnowledge 
          teams={teams}
          handleTeamChange={handleTeamChange}
          addTeam={addTeam}
        />
  
        {/* Technical Readiness Checklist Section - Using the new component */}
        <TechnicalReadinessChecklist 
          checkboxes={checkboxes}
          handleCheckboxChange={handleCheckboxChange}
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

export default Technical;