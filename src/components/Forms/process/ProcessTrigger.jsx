//src/components/Forms/process/ProcessTrigger

import React from 'react';
import { Card, Form } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * ProcessTrigger component - Handles the collection of process trigger information
 * 
 * @param {Object} props Component props
 * @param {Object} props.triggerData Object containing process trigger data
 * @param {Function} props.onTriggerChange Function to update trigger data
 * @returns {JSX.Element} ProcessTrigger component
 */
const ProcessTrigger = ({ triggerData, onTriggerChange }) => {
  // Handle process trigger changes
  const handleProcessTriggerChange = (field, value) => {
    onTriggerChange(field, value);
  };

  return (
    <Card style={styles.card} className="section">
      <Card.Header style={styles.cardHeader}>
        <h2 style={styles.h2}>2. Process Trigger</h2>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>Definition:</strong> A trigger is the specific event that initiates your process. Look for the very first action that occurs - ask yourself, "What needs to happen before anyone on my team takes action?"
        </p>
        
        <Form.Group style={styles.formGroup}>
          <Form.Label style={styles.formLabel}>
            What starts your process?
          </Form.Label>
          <FormControlWithPrintFallback
            as="textarea"
            value={triggerData.processStart}
            onChange={(e) => handleProcessTriggerChange('processStart', e.target.value)}
            placeholder="Example: Help desk ticket from HR triggered our email creation process..."
            maxLength={200}
            style={{
              ...styles.formControl,
              resize: 'vertical',
              overflow: 'hidden',
              minHeight: '100px'
            }}
          />
        </Form.Group>

        <Form.Group style={styles.formGroup}>
          <Form.Label style={styles.formLabel}>
            Trigger type:
          </Form.Label>
          <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
            Common examples: Help desk ticket arrival, form submission, scheduled time, customer request, system alert
          </p>
          <div style={styles.radioGroup} className="radio-group">
            {['Help desk ticket', 'Form submission', 'Scheduled time', 'Customer request',
              'System alert/notification', 'External event', 'Other'].map((option) => (
              <Form.Check
                key={`trigger-${option}`}
                type="radio"
                name="trigger"
                id={`trigger-${option}`}
                label={option}
                value={option}
                checked={triggerData.trigger === option}
                onChange={(e) => handleProcessTriggerChange('trigger', e.target.value)}
                className="mb-2"
              />
            ))}
          </div>
          
          {triggerData.trigger === 'Other' && (
            <FormControlWithPrintFallback
              as="textarea"
              value={triggerData.otherTrigger}
              onChange={(e) => handleProcessTriggerChange('otherTrigger', e.target.value)}
              placeholder="Please describe the trigger type"
              maxLength={200}
              className="mt-3"
              style={{
                ...styles.formControl,
                resize: 'vertical',
                overflow: 'hidden',
                minHeight: '80px'
              }}
            />
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default ProcessTrigger;