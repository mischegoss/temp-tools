// src/components/Forms/DataIO

import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * DataIO component - Handles the collection of data inputs and outputs in the process
 * 
 * @param {Object} props Component props
 * @param {Array} props.inputData Array of input data objects
 * @param {Array} props.outputData Array of output data objects
 * @param {Function} props.onAddInputData Function to add new input data
 * @param {Function} props.onUpdateInputData Function to update input data
 * @param {Function} props.onRemoveInputData Function to remove input data
 * @param {Function} props.onAddOutputData Function to add new output data
 * @param {Function} props.onUpdateOutputData Function to update output data
 * @param {Function} props.onRemoveOutputData Function to remove output data
 * @returns {JSX.Element} DataIO component
 */
const DataIO = ({ 
  inputData, 
  outputData,
  onAddInputData, 
  onUpdateInputData, 
  onRemoveInputData,
  onAddOutputData,
  onUpdateOutputData,
  onRemoveOutputData
}) => {
  // Handle input data field changes
  const handleInputDataChange = (id, field, value) => {
    onUpdateInputData(id, field, value);
  };

  // Handle output data field changes
  const handleOutputDataChange = (id, field, value) => {
    onUpdateOutputData(id, field, value);
  };

  return (
    <>
      {/* Data Inputs Section */}
      <Card style={styles.card} className="section">
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.h2}>6. Data Flows: How Does Information Move?</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Definition:</strong> The movement of information into, through, and out of your process. For each step, ask "What information is needed here?" and "What information is created or changed?"
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Examples:</strong> Customer details flowing from forms to databases, employee information moving between departments
          </p>
          
          {/* First Input Data embedded within the section card */}
          <div className="mt-4" style={{ border: '1px solid #e0e0e0', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ ...styles.cardHeader, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={styles.h3}>
                  Input Data 1
                </h3>
                
                {inputData.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemoveInputData(inputData[0].id)}
                    className="no-print"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>
                  What information is required?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={inputData[0].information}
                  onChange={(e) => handleInputDataChange(inputData[0].id, 'information', e.target.value)}
                  placeholder="Example: Employee name, job title, department, manager"
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
                <Form.Label style={styles.formLabel}>
                  Where does this information come from?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={inputData[0].source}
                  onChange={(e) => handleInputDataChange(inputData[0].id, 'source', e.target.value)}
                  placeholder="Example: HR system, help desk ticket"
                  maxLength={200}
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                />
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Additional Input Data */}
      {inputData.slice(1).map((input, index) => (
        <Card 
          key={`input-data-${input.id}`} 
          style={styles.card}
          className="section"
        >
          <Card.Header style={styles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={styles.h3}>
                Input Data {index + 2} {/* +2 because we're starting from the second item (index 1) */}
              </h3>
              
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onRemoveInputData(input.id)}
                className="no-print"
              >
                Remove
              </Button>
            </div>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>
                What information is required?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={input.information}
                onChange={(e) => handleInputDataChange(input.id, 'information', e.target.value)}
                placeholder="Example: Employee name, job title, department, manager"
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
              <Form.Label style={styles.formLabel}>
                Where does this information come from?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={input.source}
                onChange={(e) => handleInputDataChange(input.id, 'source', e.target.value)}
                placeholder="Example: HR system, help desk ticket"
                maxLength={200}
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
      ))}
      
      {/* Add Input Data Button */}
      <div className="text-center mb-4 mt-3 no-print">
        <Button 
          variant="outline-primary" 
          onClick={onAddInputData}
          style={styles.btnOutlinePrimary}
        >
          Add Input Data
        </Button>
      </div>
      
      {/* Data Outputs Section */}
      <Card style={styles.card} className="section">
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.h2}>7. Output Data</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={{ marginBottom: '1.5rem' }}>
            What information is created or changed by this process?
          </p>
          
          {/* First Output Data embedded within the section card */}
          <div className="mt-4" style={{ border: '1px solid #e0e0e0', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ ...styles.cardHeader, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={styles.h3}>
                  Output Data 1
                </h3>
                
                {outputData.length > 1 && (
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemoveOutputData(outputData[0].id)}
                    className="no-print"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>
                  What information is produced?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={outputData[0].information}
                  onChange={(e) => handleOutputDataChange(outputData[0].id, 'information', e.target.value)}
                  placeholder="Example: Email account details, system credentials"
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
                <Form.Label style={styles.formLabel}>
                  Where does this information go?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={outputData[0].destination}
                  onChange={(e) => handleOutputDataChange(outputData[0].id, 'destination', e.target.value)}
                  placeholder="Example: Back to HR with new account details"
                  maxLength={200}
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                />
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Additional Output Data */}
      {outputData.slice(1).map((output, index) => (
        <Card 
          key={`output-data-${output.id}`} 
          style={styles.card}
          className="section"
        >
          <Card.Header style={styles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={styles.h3}>
                Output Data {index + 2} {/* +2 because we're starting from the second item (index 1) */}
              </h3>
              {outputData.length > 1 && (
                <Button 
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveOutputData(output.id)}
                  className="no-print"
                >
                  Remove
                </Button>
              )}
            </div>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>
                What information is produced?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={output.information}
                onChange={(e) => handleOutputDataChange(output.id, 'information', e.target.value)}
                placeholder="Example: Email account details, system credentials"
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
              <Form.Label style={styles.formLabel}>
                Where does this information go?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={output.destination}
                onChange={(e) => handleOutputDataChange(output.id, 'destination', e.target.value)}
                placeholder="Example: Back to HR with new account details"
                maxLength={200}
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
      ))}
      
      {/* Add Output Data Button */}
      <div className="text-center mb-4 mt-3 no-print">
        <Button 
          variant="outline-primary" 
          onClick={onAddOutputData}
          style={styles.btnOutlinePrimary}
        >
          Add Output Data
        </Button>
      </div>
    </>
  );
};

export default DataIO;