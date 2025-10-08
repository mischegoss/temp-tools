import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { PrintStyles } from '../styles/print-styles';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import TitleSection from '../utils/TitleSection';
import DownloadSection from '../utils/DownloadSection';
import PDFGenerator from '../utils/PDFGenerator';
import AssessmentRating from '../utils/AssessmentRating';
import { styles } from '../styles/styles';
import useFormSubmission from '../utils/UseFormSubmission';
import useFormLoader from '../utils/FormLoader'; // Added import
import { useFirebase } from '@site/src/contexts/FirebaseContext'; // Added import

const OrchestrationImpactAnalysis = () => {
  const contentRef = useRef(null);
  const { db } = useFirebase(); // Added Firebase reference
  
  // Use the form submission hook
  const { 
    submitForm, 
    submitStatus, 
    getInitialFormMetadata 
  } = useFormSubmission();
  
  // Use the form loader hook with the correct collection name
  const { formData, isLoading: formLoading } = useFormLoader(db, 'orchestration-assessments');
  
  const [subtitle, setSubtitle] = useState(
    "Assess process orchestration potential across teams and systems"
  );

  // Initialize form metadata with values from the hook
  const [formMetadata, setFormMetadata] = useState(getInitialFormMetadata());

  // Form state tracking
  const [formState, setFormState] = useState({
    lastSubmittedState: null,
    hasChanges: false,
  });

  const [currentMetrics, setCurrentMetrics] = useState({
    teamsInvolved: '',
    waitingDays: '',
    monthlyVolume: ''
  });

  const [processScores, setProcessScores] = useState({
    processConnectivity: 0,
    timeImpact: 0,
    scalabilityPotential: 0,
    total: 0
  });

  const [criteriaScores, setCriteriaScores] = useState({
    processComplexity: 0,
    dataExchange: 0,
    approvalSteps: 0,
    systemConnections: 0,
    manualEffort: 0,
    waitTime: 0
  });

  // Load form data when it becomes available
  useEffect(() => {
    if (formData) {
      console.log("Loading saved form data:", formData);
      
      // Update current metrics if available
      if (formData.currentMetrics) {
        setCurrentMetrics(formData.currentMetrics);
        // Recalculate process scores based on loaded metrics
        calculateProcessScores(formData.currentMetrics);
      }
      
      // Update process scores if available
      if (formData.processScores) {
        setProcessScores(formData.processScores);
      }
      
      // Update criteria scores if available
      if (formData.criteriaScores) {
        setCriteriaScores(formData.criteriaScores);
      }
      
      // Update subtitle with form information
      if (formData.metadata && formData.metadata.completedDate) {
        setSubtitle(`Created for ${formData.metadata.companyName || 'your company'} on ${formData.metadata.completedDate}`);
      }
      
      // Update metadata if available
      if (formData.metadata) {
        setFormMetadata(prevMetadata => ({
          ...prevMetadata,
          email: formData.metadata.email || prevMetadata.email,
          companyName: formData.metadata.companyName || prevMetadata.companyName
        }));
      }
      
      // Set lastSubmittedState to prevent duplicate submissions
      setFormState({
        lastSubmittedState: {
          currentMetrics: formData.currentMetrics || {},
          processScores: formData.processScores || {},
          criteriaScores: formData.criteriaScores || {},
          totalScore: formData.totalScore || 0,
          recommendation: formData.recommendation || {}
        },
        hasChanges: false
      });
    }
  }, [formData]);

  const handleMetricChange = (metric, value) => {
    const updatedMetrics = {
      ...currentMetrics,
      [metric]: value
    };
    
    setCurrentMetrics(updatedMetrics);
    calculateProcessScores(updatedMetrics);
    
    // Mark form as having changes
    setFormState(prev => ({
      ...prev,
      hasChanges: true
    }));
  };

  const handleCriteriaScoreChange = (criterion, value) => {
    setCriteriaScores(prev => ({
      ...prev,
      [criterion]: parseInt(value)
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

  // --- IMPROVED ALGORITHM - START ---
  
  // Enhanced Process Metrics Scoring
  const calculateProcessScores = (metrics = currentMetrics) => {
    if (!Object.values(metrics).every(val => val !== '')) {
      return;
    }

    const teamsInvolved = parseFloat(metrics.teamsInvolved) || 0;
    const waitingDays = parseFloat(metrics.waitingDays) || 0;
    const monthlyVolume = parseFloat(metrics.monthlyVolume) || 0;

    // Cross-team Connectivity score - based on teams involved
    // Enhanced to give more weight to 3+ teams since Red Hat emphasizes cross-team value
    const connectivityScore = teamsInvolved >= 5 ? 8 : 
                             teamsInvolved >= 4 ? 6 :
                             teamsInvolved >= 3 ? 5 :
                             teamsInvolved >= 2 ? 3 : 1;

    // Time Impact score - based on waiting days
    // Aligned with Red Hat's focus on reducing wait times between teams
    const timeScore = waitingDays >= 7 ? 5 :
                     waitingDays >= 5 ? 4 :
                     waitingDays >= 3 ? 3 :
                     waitingDays >= 1 ? 2 : 1;

    // Scalability Potential score - based on monthly volume
    // Higher volumes justify greater investment in orchestration
    const volumeScore = monthlyVolume >= 100 ? 5 :
                       monthlyVolume >= 50 ? 4 :
                       monthlyVolume >= 25 ? 3 :
                       monthlyVolume >= 10 ? 2 : 1;

    // Calculate total workflow score with the new connectivity scoring
    const totalWorkflowScore = connectivityScore + timeScore + volumeScore;

    setProcessScores({
      processConnectivity: connectivityScore,
      timeImpact: timeScore,
      scalabilityPotential: volumeScore,
      total: totalWorkflowScore
    });
  };

  // Adjusted Weighting to Prioritize Cross-Team Interactions
  const calculateTotalScore = () => {
    // Calculate from criteria scores
    const criteriaTotal = Object.values(criteriaScores).reduce((sum, score) => sum + score, 0);
    
    // Apply new weights that emphasize team count and waiting time
    const criteriaWeight = 0.4;   // Reduce from 0.5
    const teamsWeight = 0.25;     // Add specific weight for team count
    const waitTimeWeight = 0.25;  // Add specific weight for wait times - increased weight due to added wait time question
    const volumeWeight = 0.1;     // Slightly reduce volume importance
    
    // Maximum possible scores
    const maxCriteriaScore = 30; // 6 criteria with max 5 points each (including new wait time question)
    
    // Calculate weighted scores for each component
    const weightedCriteriaScore = (criteriaTotal / maxCriteriaScore) * criteriaWeight * 100;
    
    // Get normalized scores for each process metric (0-1 scale)
    const teamsNormalized = processScores.processConnectivity / 8; // New max is 8
    const waitTimeNormalized = processScores.timeImpact / 5;
    const volumeNormalized = processScores.scalabilityPotential / 5;
    
    // Calculate weighted process metrics
    const weightedTeamsScore = teamsNormalized * teamsWeight * 100;
    const weightedWaitTimeScore = waitTimeNormalized * waitTimeWeight * 100;
    const weightedVolumeScore = volumeNormalized * volumeWeight * 100;
    
    // Calculate final score
    return Math.round(
      weightedCriteriaScore + 
      weightedTeamsScore + 
      weightedWaitTimeScore + 
      weightedVolumeScore
    );
  };

  // Added Business Impact Calculation
  const calculateTimeSavings = () => {
    if (!currentMetrics.waitingDays || !currentMetrics.monthlyVolume) {
      return "N/A";
    }
    
    const waitingDays = parseFloat(currentMetrics.waitingDays);
    const monthlyVolume = parseFloat(currentMetrics.monthlyVolume);
    const totalScore = calculateTotalScore();
    
    // Calculate potential time reduction based on score
    // Higher scores indicate greater potential for time savings
    let reductionPercentage = 0;
    if (totalScore >= 75) reductionPercentage = 0.7;      // 70% reduction for high priority
    else if (totalScore >= 55) reductionPercentage = 0.5; // 50% reduction for strong candidates
    else if (totalScore >= 35) reductionPercentage = 0.3; // 30% reduction for good opportunities
    else reductionPercentage = 0.15;                      // 15% reduction for starter candidates
    
    // Calculate monthly time saving
    const monthlySavingDays = waitingDays * monthlyVolume * reductionPercentage;
    const annualSavingDays = monthlySavingDays * 12;
    
    return `${Math.round(annualSavingDays)} working days per year`;
  };

  // Revised Recommendation Thresholds
  const getOrchestrationRecommendation = () => {
    const totalScore = calculateTotalScore();
    
    if (totalScore >= 75) {
      return {
        rating: "Strategic Orchestration Priority",
        detail: "This cross-team workflow is an excellent candidate for end-to-end orchestration with significant potential ROI. The combination of complex dependencies, substantial waiting times, and high business impact align perfectly with Red Hat's orchestration strategy."
      };
    } else if (totalScore >= 55) {
      return {
        rating: "High-Value Orchestration Opportunity",
        detail: "This workflow shows strong orchestration potential with clear operational benefits. With multiple teams involved and meaningful coordination challenges, orchestrating these connected processes will deliver tangible business value."
      };
    } else if (totalScore >= 35) {
      return {
        rating: "Targeted Orchestration Candidate",
        detail: "This workflow has specific areas that would benefit from orchestration. Focus on the highest-friction handoffs and decision points for initial orchestration efforts."
      };
    } else {
      return {
        rating: "Process Improvement Opportunity",
        detail: "While full orchestration may not be the immediate priority, process standardization and targeted automation of specific steps would deliver improvements."
      };
    }
  };
  
  // --- IMPROVED ALGORITHM - END ---

  // Modified handleSubmit function to track form state
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
      
      // Prepare form data
      const currentFormState = {
        currentMetrics,
        processScores,
        criteriaScores,
        totalScore: calculateTotalScore(),
        recommendation: getOrchestrationRecommendation(),
        potentialTimeSavings: calculateTimeSavings()
      };
      
      // Check if form has significant changes before submitting
      const hasSignificantChanges = !formState.lastSubmittedState || 
        JSON.stringify(formState.lastSubmittedState) !== JSON.stringify(currentFormState);
      
      if (hasSignificantChanges) {
        // Use the submitForm function from the hook
        await submitForm(
          'orchestration-assessments',   // Collection name
          currentFormState,              // Form data
          formMetadata,                  // Metadata (email, companyName)
          // Success callback
          async () => {
            // Update form state to track this submission
            setFormState({
              lastSubmittedState: currentFormState,
              hasChanges: false,
            });
            
            // Generate and download PDF after successful submission
            await PDFGenerator.generatePDF(contentRef, 'orchestration-assessment.pdf');
          }
        );
      } else {
        // Just generate PDF if no significant changes
        await PDFGenerator.generatePDF(contentRef, 'orchestration-assessment.pdf');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Criteria for radio button selection - UNCHANGED FROM ORIGINAL except added Wait Time
  const criteria = [
    {
      key: "processComplexity",
      label: "How complex is the current series of tasks?",
      options: [
        { value: "1", label: "1 - Very simple, linear series of tasks with few team handoffs" },
        { value: "2", label: "2 - Basic series of tasks with minimal interaction across departments" },
        { value: "3", label: "3 - Moderate complexity with several cross-team decision points" },
        { value: "4", label: "4 - Complex with multiple parallel paths across departments" },
        { value: "5", label: "5 - Highly complex with many multiple decisions and team dependencies" }
      ]
    },
    {
      key: "dataExchange",
      label: "How much data exchange occurs between teams/systems?",
      options: [
        { value: "1", label: "1 - Minimal data exchange" },
        { value: "2", label: "2 - Limited data sharing between few systems" },
        { value: "3", label: "3 - Moderate data sharing needs" },
        { value: "4", label: "4 - Significant data sharing requirements" },
        { value: "5", label: "5 - Extensive data exchange across systems" }
      ]
    },
    {
      key: "approvalSteps",
      label: "How many approval steps are required across teams?",
      options: [
        { value: "1", label: "1 - Minimal approval steps" },
        { value: "2", label: "2 - Limited approval steps" },
        { value: "3", label: "3 - Moderate approval steps" },
        { value: "4", label: "4 - Significant approval steps" },
        { value: "5", label: "5 - Extensive approval steps" }
      ]
    },
    {
      key: "systemConnections",
      label: "How many different systems need to be connected?",
      options: [
        { value: "1", label: "1 - 1-2 systems" },
        { value: "2", label: "2 - 2-3 systems" },
        { value: "3", label: "3 - 4-5 systems" },
        { value: "4", label: "4 - 5-10 systems" },
        { value: "5", label: "5 - 11 or more systems" }
      ]
    },
    {
      key: "manualEffort",
      label: "How much manual effort is currently spent on coordination?",
      options: [
        { value: "1", label: "1 - Minimal (< 1 hour per week)" },
        { value: "2", label: "2 - Low (1-4 hours per week)" },
        { value: "3", label: "3 - Moderate (4-8 hours per week)" },
        { value: "4", label: "4 - High (8-16 hours per week)" },
        { value: "5", label: "5 - Very high (16+ hours per week)" }
      ]
    },
    {
      key: "waitTime",
      label: "How much time is spent waiting between handoffs?",
      options: [
        { value: "1", label: "1 - Minimal waiting (< 2 hours)" },
        { value: "2", label: "2 - Short delays (2-8 hours)" },
        { value: "3", label: "3 - Moderate waiting (8-24 hours)" },
        { value: "4", label: "4 - Significant waiting (1-3 days)" },
        { value: "5", label: "5 - Extensive waiting periods (3+ days)" }
      ]
    }
  ];

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

  const recommendation = getOrchestrationRecommendation();
  const totalScore = calculateTotalScore();
  const potentialTimeSavings = calculateTimeSavings();
  
  return (
    <div style={styles.wrapper}>
      <PrintStyles />
      <div ref={contentRef} style={styles.container} className="container-print">
        {/* Title Section using the TitleSection component */}
        <TitleSection title="Orchestration Potential" subtitle={subtitle} />
  
        {/* Cross-Team Workflow Metrics Section */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Gather Current Workflow Metrics</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ marginBottom: '1.5rem' }}>
              Complete the information below to assess the potential for orchestrating this series of connected tasks across teams.
            </p>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>Number of Teams Involved</Form.Label>
              <InputGroup>
                <FormControlWithPrintFallback
                  type="number"
                  value={currentMetrics.teamsInvolved}
                  onChange={(e) => handleMetricChange('teamsInvolved', e.target.value)}
                  placeholder="Ex: 4"
                  style={styles.formControl}
                  aria-describedby="teamsInvolvedHelpText"
                />
                <InputGroup.Text>teams</InputGroup.Text>
              </InputGroup>
              <Form.Text id="teamsInvolvedHelpText" style={styles.helpText}>
                Total number of different teams that participate (e.g., HR, IT, Security, Facilities) in this end-to-end workflow
              </Form.Text>
            </Form.Group>
  
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>How long does it take to complete that entire series of tasks from start to finish?</Form.Label>
              <InputGroup>
                <FormControlWithPrintFallback
                  type="number"
                  value={currentMetrics.waitingDays}
                  onChange={(e) => handleMetricChange('waitingDays', e.target.value)}
                  placeholder="Ex: 5"
                  style={styles.formControl}
                  aria-describedby="waitingDaysHelpText"
                />
                <InputGroup.Text>business days</InputGroup.Text>
              </InputGroup>
              <Form.Text id="waitingDaysHelpText" style={styles.helpText}>
                Average total time from when the first team starts to when the last team completes their task, including handoff delays
              </Form.Text>
            </Form.Group>
  
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>How many times a month are the series of tasks completed each month?</Form.Label>
              <InputGroup>
                <FormControlWithPrintFallback
                  type="number"
                  value={currentMetrics.monthlyVolume}
                  onChange={(e) => handleMetricChange('monthlyVolume', e.target.value)}
                  placeholder="Ex: 50"
                  style={styles.formControl}
                  aria-describedby="monthlyVolumeHelpText"
                />
                <InputGroup.Text>instances per month</InputGroup.Text>
              </InputGroup>
              <Form.Text id="monthlyVolumeHelpText" style={styles.helpText}>
                How many times this entire sequence of cross-team tasks is performed from start to finish in a month
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
  
        {/* Orchestration Criteria Section 1 */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Consider Current Complexity</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ marginBottom: '1.5rem' }}>
              Rate these dimensions to determine how suitable these tasks are for end-to-end orchestration.
            </p>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {criteria.slice(0, 2).map(({ key, label, options }) => (
                <Form.Group key={key} style={styles.formGroup}>
                  <Form.Label style={styles.formLabel}>{label}</Form.Label>
                  <div style={styles.radioGroup} className="radio-group">
                    {options.map((option) => (
                      <Form.Check
                        key={`${key}-${option.value}`}
                        type="radio"
                        id={`${key}-${option.value}`}
                        name={key}
                        label={option.label}
                        value={option.value}
                        checked={criteriaScores[key] === parseInt(option.value)}
                        onChange={(e) => handleCriteriaScoreChange(key, e.target.value)}
                        style={{
                          marginBottom: '0.5rem',
                          fontSize: '0.95rem',
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>
  
        {/* Orchestration Criteria Section 2 */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Approval and Systems Assessment</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ marginBottom: '1.5rem' }}>
              Evaluate your cross-team approval needs and system connections.
            </p>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {criteria.slice(2, 4).map(({ key, label, options }) => (
                <Form.Group key={key} style={styles.formGroup}>
                  <Form.Label style={styles.formLabel}>{label}</Form.Label>
                  <div style={styles.radioGroup} className="radio-group">
                    {options.map((option) => (
                      <Form.Check
                        key={`${key}-${option.value}`}
                        type="radio"
                        id={`${key}-${option.value}`}
                        name={key}
                        label={option.label}
                        value={option.value}
                        checked={criteriaScores[key] === parseInt(option.value)}
                        onChange={(e) => handleCriteriaScoreChange(key, e.target.value)}
                        style={{
                          marginBottom: '0.5rem',
                          fontSize: '0.95rem',
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>
  
        {/* Orchestration Criteria Section 3 */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Wait Time and Manual Effort Assessment</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <p style={{ marginBottom: '1.5rem' }}>
              Evaluate the waiting and manual effort involved in coordinating these cross-team activities.
            </p>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {criteria.slice(4).map(({ key, label, options }) => (
                <Form.Group key={key} style={styles.formGroup}>
                  <Form.Label style={styles.formLabel}>{label}</Form.Label>
                  <div style={styles.radioGroup} className="radio-group">
                    {options.map((option) => (
                      <Form.Check
                        key={`${key}-${option.value}`}
                        type="radio"
                        id={`${key}-${option.value}`}
                        name={key}
                        label={option.label}
                        value={option.value}
                        checked={criteriaScores[key] === parseInt(option.value)}
                        onChange={(e) => handleCriteriaScoreChange(key, e.target.value)}
                        style={{
                          marginBottom: '0.5rem',
                          fontSize: '0.95rem',
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>
      
        {/* Results Section */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Orchestration Assessment Results</h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            {processScores.total > 0 ? (
              <AssessmentRating
                score={totalScore}
                ratingTitle={recommendation.rating}
                ratingDescription={recommendation.detail}
                styles={styles}
                additionalContent={
                  <div style={styles.resultsContainer}>
                    <label style={styles.formLabel}>
                      Estimated Time Savings with End-to-End Orchestration:
                    </label>
                    <span style={styles.resultValue}>
                      {potentialTimeSavings}
                    </span>
                    <small style={styles.resultDetail}>
                      Based on your multi-team workflow volume and complexity, this is an estimate of potential annual time savings with orchestration.
                    </small>
                  </div>
                }
              />
            ) : (
              <Alert variant="info">
                Complete all fields in both sections to see your orchestration assessment results.
              </Alert>
            )}
          </Card.Body>
        </Card>
  
        {/* Download Section using the DownloadSection component */}
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

export default OrchestrationImpactAnalysis;