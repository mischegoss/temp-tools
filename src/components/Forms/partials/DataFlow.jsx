import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';

/**
 * DataFlowSection component - Handles input and output data collection for process mapping
 * Each input and output will be rendered in its own card
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData The current form data containing inputData and outputData arrays
 * @param {Function} props.handleChange Function to handle changes to form inputs
 * @param {Function} props.addInputData Function to add a new input data entry
 * @param {Function} props.addOutputData Function to add a new output data entry
 * @param {Object} props.styles Styling object containing CSS styles
 * @returns {JSX.Element} DataFlowSection component
 */
const DataFlowSection = ({ 
  formData, 
  handleChange, 
  addInputData, 
  addOutputData, 
  styles 
}) => {
  return (
    <div>
      {/* Input Data Cards - Each input gets its own card */}
      {formData.inputData.map((input, index) => (
        <Card style={styles.card} className="section" key={`input-data-${index}`}>
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
              Input Data {index + 1}
            </h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            {index === 0 && (
              <p style={{ marginBottom: '1rem' }}>What information is needed to start or continue this process?</p>
            )}
            
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>1. What information is required?</Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={input.information}
                onChange={(e) => handleChange('inputData', index, 'information', e.target.value)}
                placeholder="Example: employee details, customer ID, service request"
                maxLength={200}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '80px'
                }}
              />
            </Form.Group>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>2. Where does this information come from?</Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={input.source}
                onChange={(e) => handleChange('inputData', index, 'source', e.target.value)}
                placeholder="Example: HR system, customer form, another team"
                maxLength={200}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '80px'
                }}
              />
            </Form.Group>
            
            {/* Add Button only on the last input card */}
            {index === formData.inputData.length - 1 && (
              <Button 
                variant="outline-primary" 
                onClick={addInputData} 
                style={styles.btnOutlinePrimary}
              >
                Add Another Input
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
      
      {/* Output Data Cards - Each output gets its own card */}
      {formData.outputData.map((output, index) => (
        <Card style={styles.card} className="section" key={`output-data-${index}`}>
          <Card.Header style={styles.cardHeader}>
            <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
              Output Data {index + 1}
            </h2>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            {index === 0 && (
              <p style={{ marginBottom: '1rem' }}>What information is created or changed by this process?</p>
            )}
            
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>1. What information is produced?</Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={output.information}
                onChange={(e) => handleChange('outputData', index, 'information', e.target.value)}
                placeholder="Example: new account details, approval status, updated records"
                maxLength={200}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '80px'
                }}
              />
            </Form.Group>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>2. Where does this information go?</Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={output.destination}
                onChange={(e) => handleChange('outputData', index, 'destination', e.target.value)}
                placeholder="Example: finance system, customer email, reporting dashboard"
                maxLength={200}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '80px'
                }}
              />
            </Form.Group>
            
            {/* Add Button only on the last output card */}
            {index === formData.outputData.length - 1 && (
              <Button 
                variant="outline-primary" 
                onClick={addOutputData} 
                style={styles.btnOutlinePrimary}
              >
                Add Another Output
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default DataFlowSection;