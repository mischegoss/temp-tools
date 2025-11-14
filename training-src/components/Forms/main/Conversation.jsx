import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import PDFGenerator from '../utils/PDFGenerator';
import { PrintStyles } from '../styles/print-styles';
import TitleSection from '../utils/TitleSection';
import DownloadSection from '../utils/DownloadSection';
import useAutoResizeTextarea from '../utils/AutoResizeHook';
import { styles } from '../styles/styles';
import useFormSubmission from '../utils/UseFormSubmission';
import useFormLoader from '../utils/FormLoader'; // Added import for form loader
import { useFirebase } from '@site/src/contexts/FirebaseContext'; // Added import for Firebase context

const ConversationChecklist = () => {
  const contentRef = useRef(null);
  const { db } = useFirebase();
  
  // Use the form submission hook
  const { 
    submitForm, 
    submitStatus, 
    getInitialFormMetadata,
    isAuthenticated,
    user
  } = useFormSubmission();
  
  // Added form loader hook
  const { formData, isLoading: formLoading } = useFormLoader(db, 'conversation-checklists');
  
  // Add state for forcing re-render
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const [subtitle, setSubtitle] = useState(
    "Use this checklist to prepare for productive automation conversations"
  );
  
  // Initialize form metadata with values from the hook
  const [formMetadata, setFormMetadata] = useState(getInitialFormMetadata());

  // Business Context state
  const [businessContext, setBusinessContext] = useState({
    documentedChallenges: false,
    definedSuccess: false,
    baselineMetrics: false,
    targetImprovements: false
  });

  // Process state - using a single object for all process sections
  const [processData, setProcessData] = useState({
    // Process Understanding
    understanding: {
      hasProcessMap: false,
      identifiedTeams: false,
      identifiedBottlenecks: false
    },
    // Process Characteristics
    characteristics: {
      consistentSteps: false,
      duplicateInformation: false,
      crossTeamWork: false,
      wideImpact: false
    },
    // Information Flow
    informationFlow: {
      knowsStartInfo: false,
      knowsInfoSource: false,
      understandsChanges: false,
      knowsDestination: false
    },
    // Systems Involved
    systemsInvolved: {
      listedSystems: false,
      understandsSystemRoles: false,
      knowsSystemSteps: false,
      identifiedUsers: false
    },
    // System Experts
    systemExperts: {
      knowsDayToDay: false,
      knowsTechnicalDetails: false,
      knowsMaintainers: false,
      knowsAdminAccess: false
    }
  });

  // Connection Points state
  const [connectionPoints, setConnectionPoints] = useState({
    understandsSharing: false,
    verifiedAccess: false,
    canExplainFlow: false,
    confirmedSupport: false
  });

  // Conversation Preparation state
  const [conversationPrep, setConversationPrep] = useState({
    gatheredMaterials: false,
    scheduledTime: false,
    preparedQuestions: false,
    readyForChallenges: false
  });

  // Added state to track form changes
  const [formState, setFormState] = useState({
    lastSubmittedState: null,
    hasChanges: false
  });

  // Use auto-resize for textareas if needed
  useAutoResizeTextarea([businessContext, processData, connectionPoints, conversationPrep]);

  // Modified useEffect to directly set state values
  useEffect(() => {
    if (formData) {
      console.log("Loading saved form data:", formData);
      
      // Directly set state values instead of using functional updates
      if (formData.businessContext) {
        console.log("Setting businessContext with:", formData.businessContext);
        setBusinessContext(formData.businessContext);
      }
      
      if (formData.processData) {
        console.log("Setting processData with:", formData.processData);
        // Ensure we merge with defaults for any missing sections
        const updatedProcessData = { ...processData };
        
        // Merge each section
        Object.keys(formData.processData).forEach(section => {
          if (updatedProcessData[section]) {
            updatedProcessData[section] = {
              ...updatedProcessData[section],
              ...formData.processData[section]
            };
          }
        });
        
        console.log("New processData will be:", updatedProcessData);
        setProcessData(updatedProcessData);
      }
      
      if (formData.connectionPoints) {
        console.log("Setting connectionPoints with:", formData.connectionPoints);
        setConnectionPoints(formData.connectionPoints);
      }
      
      if (formData.conversationPrep) {
        console.log("Setting conversationPrep with:", formData.conversationPrep);
        setConversationPrep(formData.conversationPrep);
      }
      
      // Update subtitle and form metadata
      if (formData.metadata && formData.metadata.completedDate) {
        setSubtitle(`Conversation Checklist created on ${formData.metadata.completedDate}`);
      }
      
      if (formData.metadata) {
        setFormMetadata({
          email: formData.metadata.email || '',
          companyName: formData.metadata.companyName || ''
        });
      }
      
      // Set lastSubmittedState to prevent duplicate submissions
      setFormState({
        lastSubmittedState: {
          businessContext: formData.businessContext || {},
          processData: formData.processData || {},
          connectionPoints: formData.connectionPoints || {},
          conversationPrep: formData.conversationPrep || {}
        },
        hasChanges: false
      });
      
      // Force re-render after a delay
      setTimeout(() => {
        console.log("Forcing re-render to ensure state updates are reflected in UI");
        setForceUpdate(prev => prev + 1);
      }, 300);  // Increased delay to ensure state updates complete
    }
  }, [formData]);

  // Add useEffect to detect the force update
  useEffect(() => {
    if (forceUpdate > 0) {
      console.log("Re-render triggered by forceUpdate:", forceUpdate);
      console.log("Current state after forced re-render:", {
        businessContext,
        processData,
        connectionPoints,
        conversationPrep
      });
    }
  }, [forceUpdate, businessContext, processData, connectionPoints, conversationPrep]);

  // Handle Business Context changes
  const handleBusinessContextChange = (field) => {
    setBusinessContext(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      console.log(`Business context ${field} changed to:`, !prev[field]);
      console.log("New businessContext state:", newState);
      return newState;
    });
    // Added tracking of changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle Process section changes - generic handler for all process sections
  const handleProcessChange = (section, field) => {
    setProcessData(prev => {
      const newValue = !prev[section][field];
      console.log(`Process ${section}.${field} changed to:`, newValue);
      
      const newState = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newValue
        }
      };
      console.log(`New ${section} state:`, newState[section]);
      return newState;
    });
    // Added tracking of changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle Connection Points changes
  const handleConnectionPointsChange = (field) => {
    setConnectionPoints(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      console.log(`Connection point ${field} changed to:`, !prev[field]);
      console.log("New connectionPoints state:", newState);
      return newState;
    });
    // Added tracking of changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Handle Conversation Preparation changes
  const handleConversationPrepChange = (field) => {
    setConversationPrep(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      console.log(`Conversation prep ${field} changed to:`, !prev[field]);
      console.log("New conversationPrep state:", newState);
      return newState;
    });
    // Added tracking of changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  // Form Metadata handler for download section
  const handleFormMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormMetadata(prev => {
      const newState = { ...prev, [name]: value };
      console.log(`Form metadata ${name} changed to:`, value);
      return newState;
    });
  };

  // SIMPLIFIED submit handler that avoids complex comparisons
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Prepare form data
      const currentState = {
        businessContext,
        processData,
        connectionPoints,
        conversationPrep
      };

      console.log("Submitting form with data:", currentState);

      // For simplicity, always generate the PDF
      await PDFGenerator.generatePDF(contentRef, 'automation-conversation-checklist.pdf');
      
      // Only submit data if there are changes or it's a first submission
      if (formState.hasChanges || !formState.lastSubmittedState) {
        console.log("Form has changes, submitting to Firebase");
        // Use the submitForm function from the hook
        await submitForm(
          'conversation-checklists',  // Collection name
          currentState,              // Form data
          formMetadata,               // Metadata (email, companyName)
          // Success callback
          () => {
            console.log("Form submitted successfully");
            // Update form state to track this submission
            setFormState({
              lastSubmittedState: currentState,
              hasChanges: false
            });
          }
        );
      } else {
        console.log("No changes detected, skipping submission");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Helper function to render a checklist item
  const renderChecklistItem = (checked, onChange, label) => {
    console.log(`Rendering checkbox with checked=${checked}, label=${label}`);
    return (
      <Form.Check 
        type="checkbox"
        checked={checked}
        onChange={onChange}
        label={label}
        style={{
          marginBottom: '0.75rem',
          fontSize: '0.95rem',
        }}
      />
    );
  };

  // Added debugging
  console.log("Current form states:", {
    businessContext,
    processData,
    connectionPoints,
    conversationPrep,
    forceUpdate  // Added to track force updates
  });

  // Added loading state display
  if (formLoading) {
    return (
      <div style={styles.wrapper}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Loading your checklist...</h2>
          <p>Please wait while we retrieve your saved checklist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <PrintStyles />
      <div ref={contentRef} style={styles.container} className="container-print">
        {/* Title Section - Fixed by adding the title prop */}
        <TitleSection title="Automation Conversation Checklist" subtitle={subtitle} />
        
        {/* Instructions */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Automation Conversation Readinesss Checklist</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <Alert variant="info" style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>Instructions:</strong></p>
              <p>Use this checklist to prepare for productive conversations about your automation needs. The checklist covers your business context and helps you assess all your processes for automation potential.</p>
              <p>You can print this checklist for offline completion, or fill it out online and download the completed checklist for reference during your conversations.</p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Business Context Section */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Business Context (Your "Why")</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Helping technical teams understand what you're trying to achieve
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                businessContext.documentedChallenges,
                () => handleBusinessContextChange('documentedChallenges'),
                "I've documented the business challenges we're facing"
              )}
              
              {renderChecklistItem(
                businessContext.definedSuccess,
                () => handleBusinessContextChange('definedSuccess'),
                "I've defined what success looks like with clear goals"
              )}
              
              {renderChecklistItem(
                businessContext.baselineMetrics,
                () => handleBusinessContextChange('baselineMetrics'),
                "I have baseline metrics that show our current performance"
              )}
              
              {renderChecklistItem(
                businessContext.targetImprovements,
                () => handleBusinessContextChange('targetImprovements'),
                "I've set target improvements we want to achieve"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Need help with this section?</strong> Check out Module 1: Understanding Your Automation Why to clarify your business objectives.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Process Understanding */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Process Understanding</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Helping technical teams visualize how your work flows today
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                processData.understanding.hasProcessMap,
                () => handleProcessChange('understanding', 'hasProcessMap'),
                "I have process maps or can describe all the steps involved in our processes"
              )}
              
              {renderChecklistItem(
                processData.understanding.identifiedTeams,
                () => handleProcessChange('understanding', 'identifiedTeams'),
                "I've identified all teams/departments that participate in our processes"
              )}
              
              {renderChecklistItem(
                processData.understanding.identifiedBottlenecks,
                () => handleProcessChange('understanding', 'identifiedBottlenecks'),
                "I can point out where our processes get stuck or become inefficient"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Need more clarity here?</strong> Check out Module 3: Map Your Processes for guidance on documenting your workflows.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Process Characteristics */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Process Characteristics</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Are your processes good fits for automation?
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                processData.characteristics.consistentSteps,
                () => handleProcessChange('characteristics', 'consistentSteps'),
                "Our processes follow reasonably consistent steps"
              )}
              
              {renderChecklistItem(
                processData.characteristics.duplicateInformation,
                () => handleProcessChange('characteristics', 'duplicateInformation'),
                "We currently duplicate information across systems"
              )}
              
              {renderChecklistItem(
                processData.characteristics.crossTeamWork,
                () => handleProcessChange('characteristics', 'crossTeamWork'),
                "Work passes between different teams or departments"
              )}
              
              {renderChecklistItem(
                processData.characteristics.wideImpact,
                () => handleProcessChange('characteristics', 'wideImpact'),
                "Delays or errors affect multiple teams"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Not sure if your processes are automation-friendly?</strong> Check out Module 2: Start Small to Think Big for selection criteria.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Information Flow */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Information Flow</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Helping technical teams understand data needs
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                processData.informationFlow.knowsStartInfo,
                () => handleProcessChange('informationFlow', 'knowsStartInfo'),
                "I know what information is needed to start our processes"
              )}
              
              {renderChecklistItem(
                processData.informationFlow.knowsInfoSource,
                () => handleProcessChange('informationFlow', 'knowsInfoSource'),
                "I can identify where this information comes from"
              )}
              
              {renderChecklistItem(
                processData.informationFlow.understandsChanges,
                () => handleProcessChange('informationFlow', 'understandsChanges'),
                "I understand what information our processes create or change"
              )}
              
              {renderChecklistItem(
                processData.informationFlow.knowsDestination,
                () => handleProcessChange('informationFlow', 'knowsDestination'),
                "I know where this information needs to go afterward"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Not sure about information flows?</strong> Check out Module 3: Map Your Processes for data mapping tools.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Systems Involved */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Systems Involved</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Helping technical teams understand your technology landscape
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                processData.systemsInvolved.listedSystems,
                () => handleProcessChange('systemsInvolved', 'listedSystems'),
                "I've listed all systems our processes touch"
              )}
              
              {renderChecklistItem(
                processData.systemsInvolved.understandsSystemRoles,
                () => handleProcessChange('systemsInvolved', 'understandsSystemRoles'),
                "I understand what each system does in our processes"
              )}
              
              {renderChecklistItem(
                processData.systemsInvolved.knowsSystemSteps,
                () => handleProcessChange('systemsInvolved', 'knowsSystemSteps'),
                "I know which steps use which systems"
              )}
              
              {renderChecklistItem(
                processData.systemsInvolved.identifiedUsers,
                () => handleProcessChange('systemsInvolved', 'identifiedUsers'),
                "I can identify who uses each system"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Need to document your systems better?</strong> Check out Module 4: Focus on People and Technology.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* System Experts */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>System Experts</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Who knows your systems best?
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                processData.systemExperts.knowsDayToDay,
                () => handleProcessChange('systemExperts', 'knowsDayToDay'),
                "I know who manages each system day-to-day"
              )}
              
              {renderChecklistItem(
                processData.systemExperts.knowsTechnicalDetails,
                () => handleProcessChange('systemExperts', 'knowsTechnicalDetails'),
                "I know who understands the technical details"
              )}
              
              {renderChecklistItem(
                processData.systemExperts.knowsMaintainers,
                () => handleProcessChange('systemExperts', 'knowsMaintainers'),
                "I know who maintains each system"
              )}
              
              {renderChecklistItem(
                processData.systemExperts.knowsAdminAccess,
                () => handleProcessChange('systemExperts', 'knowsAdminAccess'),
                "I know who has administrator access"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Need help identifying system experts?</strong> Check out Module 4: Focus on People and Technology.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Connection Points */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Connection Points</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Helping technical teams see how everything fits together
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                connectionPoints.understandsSharing,
                () => handleConnectionPointsChange('understandsSharing'),
                "I understand how systems will need to share information"
              )}
              
              {renderChecklistItem(
                connectionPoints.verifiedAccess,
                () => handleConnectionPointsChange('verifiedAccess'),
                "I've verified we have (or can get) proper system access"
              )}
              
              {renderChecklistItem(
                connectionPoints.canExplainFlow,
                () => handleConnectionPointsChange('canExplainFlow'),
                "I can explain how information moves between teams"
              )}
              
              {renderChecklistItem(
                connectionPoints.confirmedSupport,
                () => handleConnectionPointsChange('confirmedSupport'),
                "I've confirmed our systems can support automation"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Not sure about how things connect?</strong> Check out Module 5: Think Bigger with Orchestration.
              </p>
            </Alert>
          </Card.Body>
        </Card>
        
        {/* Conversation Preparation */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Conversation Preparation</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              Getting ready for productive discussions
            </p>
            
            <div style={styles.radioGroup} className="radio-group">
              {renderChecklistItem(
                conversationPrep.gatheredMaterials,
                () => handleConversationPrepChange('gatheredMaterials'),
                "I've gathered materials from previous modules"
              )}
              
              {renderChecklistItem(
                conversationPrep.scheduledTime,
                () => handleConversationPrepChange('scheduledTime'),
                "I've scheduled time with technical stakeholders"
              )}
              
              {renderChecklistItem(
                conversationPrep.preparedQuestions,
                () => handleConversationPrepChange('preparedQuestions'),
                "I've prepared questions I'd like to ask"
              )}
              
              {renderChecklistItem(
                conversationPrep.readyForChallenges,
                () => handleConversationPrepChange('readyForChallenges'),
                "I'm ready to discuss potential challenges"
              )}
            </div>
            
            <Alert variant="light" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💡</span>
                <strong>Want to prepare better for technical conversations?</strong> Check out Module 6: Prepare for Automation Conversations.
              </p>
            </Alert>
          </Card.Body>
        </Card>

        {/* Download Section - using DownloadSection component */}
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

export default ConversationChecklist;