import React, { useState, useRef, useEffect } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { PrintStyles } from "../styles/print-styles";
import FormControlWithPrintFallback from "../utils/FormControlPDF";
import TitleSection from "../utils/TitleSection";
import DownloadSection from "../utils/DownloadSection";
import PDFGenerator from "../utils/PDFGenerator";
import { styles as sharedStyles } from "../styles/styles";
import AssessmentRating from "../utils/AssessmentRating";
import useFormSubmission from "../utils/UseFormSubmission";
import useFormLoader from "../utils/FormLoader"; // Import the custom hook
import { useFirebase } from "@site/src/contexts/FirebaseContext";

// Merge shared styles with component-specific styles
const styles = {
  ...sharedStyles, // Import all shared styles
  
  // Specific styles for the Automation component
  criteriaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    padding: '0 1rem'
  },
  resultsContainer: {
    marginTop: '2.5rem'
  },
  resultsBox: {
    backgroundColor: '#f9fafb',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #e9ecef',
    margin: '0 1rem'
  },
  resultItem: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e9ecef'
  },
  resultItemLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none'
  },
  resultValue: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#2563eb',
    marginBottom: '0.75rem'
  },
  resultDetail: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: 1.6,
    marginTop: '0.75rem'
  },
  scoreDisplay: {
    maxWidth: '500px',
    margin: '0 auto'
  },
  scoreValue: {
    fontSize: '3rem',
    fontWeight: 800,
    color: '#2563eb',
    lineHeight: 1.2
  },
  helpText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  feedbackCard: {
    backgroundColor: '#f0f9ff',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #bae6fd',
    margin: '0 1rem',
    textAlign: 'center'
  },
  feedbackTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0369a1',
    marginBottom: '1rem'
  },
  feedbackText: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem'
  },
  feedbackButton: {
    backgroundColor: '#0284c7',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Automation = () => {
  const contentRef = useRef(null);
  const { db } = useFirebase();
  
  // Use the form submission hook for handling form submissions
  const { 
    submitForm, 
    submitStatus,
    getInitialFormMetadata,
    isAuthenticated,
    user 
  } = useFormSubmission();
  
  // Use the form loader hook
  const { formData, isLoading: formLoading } = useFormLoader(db, 'automation-assessments');
  
  const [subtitle, setSubtitle] = useState(
    "Use this guide to gauge a processes automation potential. The form is in two parts. First, you'll determine if your process is a suitable candidate for automation. Then, you'll explore the potential ROI you could achieve through implementation."
  );

  // Initialize form metadata with values from the hook
  const [formMetadata, setFormMetadata] = useState(getInitialFormMetadata());
  
  const [emailError, setEmailError] = useState("");
  const [formState, setFormState] = useState({
    lastSubmittedState: null,
    hasChanges: false,
  });

  const [scores, setScores] = useState({
    frequency: 0,
    consistency: 0,
    volume: 0,
    timeInvestment: 0,
    bottleneck: 0,
  });

  const [inputs, setInputs] = useState({
    timePerProcess: "",
    monthlyOccurrences: "",
    monthlyErrors: "",
    laborCost: "",
  });

  const [showROISection, setShowROISection] = useState(false);

  // Load form data when it becomes available
  useEffect(() => {
    if (formData) {
      console.log("Loading saved form data:", formData);
      
      // Update scores if available
      if (formData.scores) {
        setScores(formData.scores);
      }
      
      // Update inputs if available
      if (formData.inputs) {
        setInputs(formData.inputs);
      }
      
      // Show ROI section if it was previously completed
      if (formData.results) {
        setShowROISection(true);
      }
      
      // Update subtitle with form information
      if (formData.metadata && formData.metadata.completedDate) {
        setSubtitle(`Automation Assessment created on ${formData.metadata.completedDate}`);
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
          scores: formData.scores || {},
          inputs: formData.inputs || {},
          results: formData.results || null,
          totalScore: formData.totalScore || 0
        },
        hasChanges: false
      });
    }
  }, [formData]);

  const handleFormMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormMetadata((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError(
        !emailRegex.test(value) ? "Please enter a valid email" : ""
      );
    }
  };

  const handleScoreChange = (metric, value) => {
    setScores((prev) => {
      const newScores = { ...prev, [metric]: parseInt(value) };
      setFormState((prev) => ({
        ...prev,
        hasChanges: true,
      }));
      return newScores;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      const newInputs = {
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      };
      setFormState((prev) => ({
        ...prev,
        hasChanges: true,
      }));
      return newInputs;
    });
  };

  const handleShowROI = () => {
    setShowROISection(true);
  };

  const calculateScore = () => {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    return (total / (Object.keys(scores).length * 5)) * 100;
  };

  const calculateResults = () => {
    const timeReduction = {
      HIGHLY_VARIABLE: 0,
      GENERALLY_VARIABLE: 0.2,
      HIGH: 0.9,
      MEDIUM: 0.7,
      LOW: 0.4,
    };

    let reduction;
    if (scores.consistency === 1) {
      reduction = timeReduction.HIGHLY_VARIABLE;
    } else if (scores.consistency === 2) {
      reduction = timeReduction.GENERALLY_VARIABLE;
    } else if (scores.consistency >= 4) {
      reduction = timeReduction.HIGH;
    } else if (scores.consistency === 3) {
      reduction = timeReduction.MEDIUM;
    } else {
      reduction = timeReduction.LOW;
    }

    const totalMonthlyOccurrences =
      (parseFloat(inputs.monthlyOccurrences) || 0) +
      (parseFloat(inputs.monthlyErrors) || 0);
    const currentMonthlyTime =
      totalMonthlyOccurrences * (parseFloat(inputs.timePerProcess) || 0);
    const automatedMonthlyTime = currentMonthlyTime * (1 - reduction);
    const timeSaved = currentMonthlyTime - automatedMonthlyTime;

    const currentCost =
      (currentMonthlyTime / 60) * (parseFloat(inputs.laborCost) || 0);
    const automatedCost =
      (automatedMonthlyTime / 60) * (parseFloat(inputs.laborCost) || 0);
    const costSaved = currentCost - automatedCost;

    const errorReduction =
      scores.consistency >= 4 && scores.bottleneck >= 3
        ? "High"
        : scores.consistency >= 3 && scores.bottleneck >= 2
        ? "Moderate"
        : scores.bottleneck >= 1
        ? "Some"
        : "Needs Assessment";

    return {
      timeSaved,
      costSaved,
      errorReduction,
      automationImpact: reduction * 100,
      isNotSuitable: scores.consistency === 1,
    };
  };

  const hasSignificantChanges = (oldState, newState) => {
    if (!oldState) return true;

    const scoreDiff = Object.keys(scores).some(
      (key) => Math.abs(oldState.scores[key] - newState.scores[key]) > 1
    );

    const inputDiff = Object.keys(inputs).some((key) => {
      const oldVal = parseFloat(oldState.inputs[key]) || 0;
      const newVal = parseFloat(newState.inputs[key]) || 0;
      return Math.abs(oldVal - newVal) > oldVal * 0.2;
    });

    return scoreDiff || inputDiff;
  };

  // Modified handleSubmit function that uses the useFormSubmission hook
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(formMetadata.email)) return;

    try {
      // Update the subtitle with form type and date
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      setSubtitle(`Automation Assessment created on ${currentDate}`);

      // Wait a brief moment for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      const currentState = {
        scores,
        inputs,
        results: calculateResults(),
        totalScore: calculateScore(),
      };

      if (hasSignificantChanges(formState.lastSubmittedState, currentState)) {
        // Use the submitForm function from the hook
        await submitForm(
          'automation-assessments',  // Collection name
          currentState,              // Form data
          formMetadata,              // Metadata (email, companyName)
          // Success callback
          () => {
            // Update form state to track this submission
            setFormState({
              lastSubmittedState: currentState,
              hasChanges: false,
            });
          }
        );
      }

      // Generate and download PDF
      await PDFGenerator.generatePDF(contentRef, 'automation-assessment.pdf');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const criteria = [
    {
      key: "frequency",
      label: "How frequently is this task performed?",
      options: [
        { value: "1", label: "1 - Monthly or less frequently" },
        { value: "2", label: "2 - Weekly to few times per week" },
        { value: "3", label: "3 - Daily to few times per day" },
        { value: "4", label: "4 - Several times per day (5-10 times)" },
        { value: "5", label: "5 - Many times per day (>10 times)" },
      ],
    },
    {
      key: "consistency",
      label: "How consistent are the steps?",
      options: [
        { value: "1", label: "1 - Highly variable steps, no standard pattern" },
        {
          value: "2",
          label: "2 - Generally variable with some recurring elements",
        },
        {
          value: "3",
          label: "3 - Mix of standard steps and variable elements",
        },
        { value: "4", label: "4 - Mostly standardized with few variations" },
        {
          value: "5",
          label: "5 - Completely standardized, identical steps each time",
        },
      ],
    },
    {
      key: "volume",
      label: "How many times is the task completed each month (the volume)?",
      options: [
        { value: "1", label: "1 - Very low (1-10 per month)" },
        { value: "2", label: "2 - Low (11-50 per month)" },
        { value: "3", label: "3 - Medium (51-200 per month)" },
        { value: "4", label: "4 - High (201-500 per month)" },
        { value: "5", label: "5 - Very high (500+ per month)" },
      ],
    },
    {
      key: "timeInvestment",
      label: "How time consuming is it to do the task manually?",
      options: [
        { value: "1", label: "1 - Very quick (< 1 minute)" },
        { value: "2", label: "2 - Quick (1-5 minutes)" },
        { value: "3", label: "3 - Moderate (5-15 minutes)" },
        { value: "4", label: "4 - Time-consuming (15-30 minutes)" },
        { value: "5", label: "5 - Very time-consuming (>30 minutes)" },
      ],
    },
    {
      key: "bottleneck",
      label: "How often do errors occur when completing the process?",
      options: [
        { value: "1", label: "1 - Rarely or never (< 1% of the time)" },
        { value: "2", label: "2 - Occasionally (1-5% of the time)" },
        { value: "3", label: "3 - Sometimes (5-10% of the time)" },
        { value: "4", label: "4 - Frequently (10-20% of the time)" },
        { value: "5", label: "5 - Very frequently (>20% of the time)" },
      ],
    },
  ];

  const results =
    inputs.timePerProcess &&
    inputs.monthlyOccurrences &&
    inputs.monthlyErrors &&
    inputs.laborCost
      ? calculateResults()
      : null;
      
  const areInitialQuestionsAnswered = 
    scores.frequency > 0 && 
    scores.consistency > 0 && 
    scores.volume > 0 && 
    scores.timeInvestment > 0 && 
    scores.bottleneck > 0;
    
  const isAutomationSuitable = scores.consistency >= 2;

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
        {/* Title Section using the TitleSection component */}
         <TitleSection title="Identify Automation Potential" subtitle={subtitle} />

        {/* Process Frequency Section */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: "1.4rem" }}>
              How often is this process performed? 
            </h2>
          </Card.Header>
          <Card.Body style={styles.cardBody} className="section-content">
            <p style={{ marginBottom: "1.5rem" }}>
              Let's start with an overview of your process. Use your best
              estimate.
            </p>
            <div style={styles.criteriaGrid}>
              {[criteria[0], criteria[2]].map(({ key, label, options }) => (
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
                        checked={scores[key] === parseInt(option.value)}
                        onChange={(e) => handleScoreChange(key, e.target.value)}
                        style={{
                          marginBottom: "0.5rem",
                          fontSize: "0.95rem",
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Process Consistency Card */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: "1.4rem" }}>
              How consistent are the steps? 
            </h2>
          </Card.Header>
          <Card.Body style={styles.cardBody} className="section-content">
            <div style={styles.criteriaGrid}>
              {[criteria[1]].map(({ key, label, options }) => (
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
                        checked={scores[key] === parseInt(option.value)}
                        onChange={(e) => handleScoreChange(key, e.target.value)}
                        style={{
                          marginBottom: "0.5rem",
                          fontSize: "0.95rem",
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Time Investment Section */}
        <Card style={styles.card} className="section">
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: "1.4rem" }}>
              How long does it take? How often do mistakes happen?
            </h2>
          </Card.Header>
          <Card.Body style={styles.cardBody} className="section-content">
            <div style={styles.criteriaGrid}>
              {criteria.slice(3).map(({ key, label, options }) => (
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
                        checked={scores[key] === parseInt(option.value)}
                        onChange={(e) => handleScoreChange(key, e.target.value)}
                        style={{
                          marginBottom: "0.5rem",
                          fontSize: "0.95rem",
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Quick Feedback Card - Shows after all questions are answered */}
        {areInitialQuestionsAnswered && (
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Initial Automation Assessment</h2>
            </Card.Header>
            <Card.Body style={styles.cardBody} className="section-content">
              <div style={styles.feedbackCard}>
                <h3 style={styles.feedbackTitle}>
                  {isAutomationSuitable
                    ? "Your process appears suitable for automation!"
                    : "Your process may need adjustments before automation"}
                </h3>
                <p style={styles.feedbackText}>
                  {isAutomationSuitable
                    ? "Based on your answers, this process has good potential for automation. Processes with consistent steps tend to be excellent candidates."
                    : "Your process has highly variable steps, which can make automation challenging. Consider standardizing some aspects of the process first."}
                </p>
                {!showROISection && (
                  <Button 
                    style={styles.feedbackButton}
                    onClick={handleShowROI}
                  >
                    Calculate Potential ROI
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* ROI Section - Part 1: Inputs */}
        {(showROISection || formState.lastSubmittedState) && (
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>What is my Potential ROI?</h2>
            </Card.Header>
            <Card.Body style={styles.cardBody} className="section-content">
              <p style={{ marginBottom: "1.5rem" }}>
                Now, let's get more specific so we can calculate your estimated
                Return on Investment (ROI). Don't worry, estimates are fine!
              </p>
              <div style={styles.criteriaGrid}>
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.formLabel}>
                      How long does it take to complete the process one time? 
                    </Form.Label>
                    <InputGroup>
                      <FormControlWithPrintFallback
                        type="number"
                        name="timePerProcess"
                        value={inputs.timePerProcess}
                        onChange={handleInputChange}
                        min="0"
                        style={styles.formControl}
                        aria-describedby="timePerProcessHelpText"
                      />
                      <InputGroup.Text>minutes</InputGroup.Text>
                    </InputGroup>
                    <Form.Text id="timePerProcessHelpText" style={styles.helpText}>
                      What is the average time it takes to complete the process one time? 
                    </Form.Text>
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.formLabel}>
                      How many times, on average, is this task completed in a month?
                    </Form.Label>
                    <InputGroup>
                      <FormControlWithPrintFallback
                        type="number"
                        name="monthlyOccurrences"
                        value={inputs.monthlyOccurrences}
                        onChange={handleInputChange}
                        min="0"
                        style={styles.formControl}
                        aria-describedby="monthlyOccurrencesHelpText"
                      />
                      <InputGroup.Text>per month</InputGroup.Text>
                    </InputGroup>
                    <Form.Text id="monthlyOccurrencesHelpText" style={styles.helpText}>
                      How many times this process is successfully completed each month
                    </Form.Text>
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.formLabel}>
                      Error frequency
                    </Form.Label>
                    <InputGroup>
                      <FormControlWithPrintFallback
                        type="number"
                        name="monthlyErrors"
                        value={inputs.monthlyErrors}
                        onChange={handleInputChange}
                        min="0"
                        style={styles.formControl}
                        aria-describedby="monthlyErrorsHelpText"
                      />
                      <InputGroup.Text>errors per month</InputGroup.Text>
                    </InputGroup>
                    <Form.Text id="monthlyErrorsHelpText" style={styles.helpText}>
                      How many times in that month do errors occur, on average? 
                    </Form.Text>
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.formLabel}>
                      What are the total labor costs, per hour, to complete the process? 
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <FormControlWithPrintFallback
                        type="number"
                        name="laborCost"
                        value={inputs.laborCost}
                        onChange={handleInputChange}
                        min="0"
                        style={styles.formControl}
                        aria-describedby="laborCostHelpText"
                      />
                      <InputGroup.Text>per hour</InputGroup.Text>
                    </InputGroup>
                    <Form.Text id="laborCostHelpText" style={styles.helpText}>
                      This is the total hourly cost of employees who perform this process (For example, if it takes 2 employees 1 hour and they each make $25, it would be $50)
                    </Form.Text>
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* ROI Section - Part 2: Results */}
        {(showROISection || formState.lastSubmittedState) && inputs.timePerProcess && inputs.monthlyOccurrences && inputs.monthlyErrors && inputs.laborCost && (
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Estimated Process Improvements</h2>
            </Card.Header>
            <Card.Body style={styles.cardBody} className="section-content">
              <div style={styles.resultsBox}>
                <div style={styles.resultItem}>
                  <label style={styles.formLabel}>
                    This is Your Estimated Monthly Time Savings:
                  </label>
                  <span style={styles.resultValue}>
                    {results ? Math.round(results.timeSaved) : "-"} minutes per month
                  </span>
                  {results && (
                    <small style={styles.resultDetail}>
                      Based on potential{" "}
                      {Math.round(results.automationImpact)}% reduction in
                      process time. This time is an estimate based on past
                      successes and will vary based on the specifics of your
                      actual process and automation needs.
                    </small>
                  )}
                </div>

                <div style={styles.resultItem}>
                  <label style={styles.formLabel}>
                    This is Your Estimated Monthly Labor Cost Savings:
                  </label>
                  <span style={styles.resultValue}>
                    {results
                      ? `$${Math.round(results.costSaved)} per month`
                      : "-"}
                  </span>
                </div>

                <div style={{ ...styles.resultItem, ...styles.resultItemLast }}>
                  <label style={styles.formLabel}>
                    This is Your Error Reduction Potential:
                  </label>
                  <span style={styles.resultValue}>
                    {results
                      ? results.errorReduction === "High"
                        ? "High potential for error reduction"
                        : results.errorReduction === "Moderate"
                        ? "Moderate potential for error reduction"
                        : results.errorReduction === "Some"
                        ? "Some potential for error reduction"
                        : "Error reduction potential needs assessment"
                      : "-"}
                  </span>
                  {results && (
                    <small style={styles.resultDetail}>
                      {results.errorReduction === "High"
                        ? "Process standardization through automation can significantly reduce errors. Exact results will vary by your specific process and automation needs."
                        : results.errorReduction === "Moderate"
                        ? "Automation can help standardize key process elements. Exact results will vary by your specific process and automation needs."
                        : results.errorReduction === "Some"
                        ? "Automation greatly reduces error rates. Exact results will vary by your specific process and automation needs."
                        : "Complete the assessment to evaluate error reduction potential"}
                    </small>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

      {/* Score Section */}
      {(showROISection || formState.lastSubmittedState) && (
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Total Automation Potential Score</h2>
            </Card.Header>
            <Card.Body style={styles.cardBody} className="section-content">
              <div style={styles.scoreDisplay}>
                <AssessmentRating
                  score={calculateScore()}
                  ratingTitle={
                    calculateScore() === 0
                      ? "Select scores to begin assessment"
                      : results && results.isNotSuitable
                      ? "Process may not be suitable for automation due to high variability"
                      : calculateScore() >= 80
                      ? "Excellent candidate for automation"
                      : calculateScore() >= 60
                      ? "Good candidate for automation"
                      : calculateScore() >= 40
                      ? "Potential candidate with modifications"
                      : "Needs more analysis"
                  }
                  styles={styles}
                />
              </div>
            </Card.Body>
          </Card>
        )}

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

export default Automation;