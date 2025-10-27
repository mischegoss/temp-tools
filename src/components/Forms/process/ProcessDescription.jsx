//src/components/Forms/process/ProcessDescription

import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * ProcessDescription component - Handles the collection of process description data
 * and process map reference information
 * 
 * @param {Object} props Component props
 * @param {Array} props.descriptions Array of description objects 
 * @param {Function} props.onAddDescription Function to add new description
 * @param {Function} props.onUpdateDescription Function to update description
 * @param {Function} props.onRemoveDescription Function to remove description
 * @returns {JSX.Element} ProcessDescription component
 */
const ProcessDescription = ({ 
  descriptions, 
  onAddDescription, 
  onUpdateDescription, 
  onRemoveDescription 
}) => {
  // Internal state for process map - not passed to parent component
  const [hasProcessMap, setHasProcessMap] = useState(false);
  const [processMapLink, setProcessMapLink] = useState('');

  return (
    <>
      {/* Process Description Header - Merged with Process Map */}
      <Card style={styles.card} className="section">
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.h2}>1. Process Description</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={{ marginBottom: '1.5rem' }}>
            Provide a high-level description of your process and its key details.
          </p>
          
          {/* Process Map Section styled to look like a nested card */}
          <div className="mb-4" style={{ border: '1px solid #e0e0e0', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ ...styles.cardHeader, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem' }}>
              <h3 style={styles.h3}>Your Process Map</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                A process map is a valuable tool for understanding your workflow. Even a simple sketch can help the automation team grasp the essential steps and decision points.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                You can use the provided tool or a visual diagramming tool like Miro to create your process map.
              </p>
              
              <Form.Group>
                <div className="mb-3 d-flex align-items-center">
                  <Form.Check 
                    type="checkbox"
                    id="has-process-map"
                    checked={hasProcessMap}
                    onChange={(e) => setHasProcessMap(e.target.checked)}
                    label="I have a process map or sketch available for reference"
                    className="mb-0"
                  />
                </div>
                
                {hasProcessMap && (
                  <div className="mb-3 mt-3">
                    <Form.Label style={styles.formLabel}>Where is your process map stored/located?</Form.Label>
                    <FormControlWithPrintFallback
                      as="textarea"
                      value={processMapLink}
                      onChange={(e) => setProcessMapLink(e.target.value)}
                      placeholder="URL or location (e.g., SharePoint link, file path, Google Drive URL)"
                      maxLength={200}
                      style={{
                        ...styles.formControl,
                        resize: 'vertical',
                        overflow: 'hidden',
                        minHeight: '80px'
                      }}
                    />
                    <Form.Text className="text-muted no-print">
                      Please provide a link or location description where your process map can be found. 
                      This helps connect this documentation to your visual process map.
                    </Form.Text>
                  </div>
                )}
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Individual Description Cards */}
      {descriptions.map((desc, index) => (
        <Card 
          key={`desc-${desc.id}`} 
          style={{...styles.card, marginTop: '1rem'}} 
          className="section"
        >
          <Card.Header style={styles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={styles.h3}>
                {index === 0 ? "Process Overview" : `Additional Details ${index}`}
              </h3>
              
              {descriptions.length > 1 && (
                <Button 
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveDescription(desc.id)}
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
                {index === 0 ? "Describe your process:" : "Additional details:"}
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={desc.content}
                onChange={(e) => onUpdateDescription(desc.id, e.target.value)}
                placeholder="Describe what the process does, who is involved, and how often it occurs..."
                maxLength={1000}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '150px'
                }}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      ))}
      
      {/* Add Description Button */}
      <div className="text-center mb-4 mt-3 no-print">
        <Button 
          variant="outline-primary" 
          onClick={onAddDescription}
          style={styles.btnOutlinePrimary}
        >
          Add More Description
        </Button>
      </div>
    </>
  );
};

export default ProcessDescription;
