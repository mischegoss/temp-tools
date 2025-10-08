import React from 'react';
import { Card, Form } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * A reusable component for displaying a single question card
 */
const QuestionCard = ({ title, label, value, onChange, placeholder, maxLength = 600 }) => (
  <Card style={styles.card} className="card section">
    <Card.Header style={styles.cardHeader} className="card-header">
      <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>{title}</h2>
    </Card.Header>
    <Card.Body style={styles.cardBody}>
      <Form.Group style={styles.formGroup}>
        <Form.Label style={styles.formLabel}>{label}</Form.Label>
        <FormControlWithPrintFallback
          as="textarea"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            ...styles.formControl,
            resize: 'vertical',
            overflow: 'hidden',
            minHeight: '80px'
          }}
        />
      </Form.Group>
    </Card.Body>
  </Card>
);

const BusinessGoals = ({ formData, handleFormChange }) => {
  return (
    <>
      {/* Current Challenges Card */}
      <QuestionCard
        title="Start With Your Current Pain Points"
        label="What current pain points are you trying to solve with automation?"
        value={formData.businessGoals.challenges}
        onChange={(e) => handleFormChange('businessGoals', 'challenges', e.target.value)}
        placeholder="What challenges are you trying to address?"
      />

      {/* Business Goals Card */}
      <QuestionCard
        title="Define Your Business Goals"
        label="What specific goals do you want to set to address these pain points?"
        value={formData.businessGoals.objectives}
        onChange={(e) => handleFormChange('businessGoals', 'objectives', e.target.value)}
        placeholder="What specific goals do you want to achieve?"
      />

      {/* Current Metrics Card */}
      <QuestionCard
        title="Measure Where You Are Right Now"
        label="What are your current metrics(i.e., Error Rates, Time Spent, etc)"
        value={formData.successMetrics.currentSLA}
        onChange={(e) => handleFormChange('successMetrics', 'currentSLA', e.target.value)}
        placeholder="What are your current metrics? It is okay to estimate."
      />

      {/* Target Metrics Card */}
      <QuestionCard
        title="Set Clear Targets for Success"
        label="Your Target Metrics"
        value={formData.successMetrics.targetSLA}
        onChange={(e) => handleFormChange('successMetrics', 'targetSLA', e.target.value)}
        placeholder="How much improvement do you expect? It is okay to estimate."
      />

      {/* Future State Card */}
      <QuestionCard
        title="Consider Your Future State (What Success Looks Like)"
        label="Describe how you want your processes to operate with automation. What is your ideal future state? (reduce processing time, eliminate duplicate entries)"
        value={formData.futureState.processEfficiency}
        onChange={(e) => handleFormChange('futureState', 'processEfficiency', e.target.value)}
        placeholder="What is your ideal future with automation? What are the benefits? What do you hope to achieve?"
      />
    </>
  );
};

export default BusinessGoals;