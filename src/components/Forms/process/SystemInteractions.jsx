// src/components/Forms/process/SystemInteractions

import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * SystemInteractions component - Handles the collection of system interaction information
 * 
 * @param {Object} props Component props
 * @param {Array} props.systemInteractions Array of system interaction objects
 * @param {Function} props.onAddSystemInteraction Function to add new system interaction
 * @param {Function} props.onUpdateSystemInteraction Function to update system interaction
 * @param {Function} props.onRemoveSystemInteraction Function to remove system interaction
 * @returns {JSX.Element} SystemInteractions component
 */
const SystemInteractions = ({ 
  systemInteractions, 
  onAddSystemInteraction, 
  onUpdateSystemInteraction, 
  onRemoveSystemInteraction 
}) => {
  // Handle system interaction field changes
  const handleSystemInteractionChange = (id, field, value) => {
    onUpdateSystemInteraction(id, field, value);
  };

  return (
    <>
      {/* System Interactions Section - Merged with first System Interaction if available */}
      <Card style={styles.card} className="section">
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.h2}>4. System Interactions: When Do You Use Tools?</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Definition:</strong> Points where your process requires interaction with software or digital systems. Note whenever someone logs into a system or accesses digital tools to complete a step.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Examples:</strong> Entering data in CRM, checking records in a database, generating reports, sending automated emails
          </p>
          
          {/* First System Interaction embedded within the section card */}
          <div className="mt-4" style={{ border: '1px solid #e0e0e0', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ ...styles.cardHeader, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={styles.h3}>
                  System Interaction 1
                </h3>
                
                {systemInteractions.length > 1 && (
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemoveSystemInteraction(systemInteractions[0].id)}
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
                  Which step uses a system/tool?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={systemInteractions[0].step}
                  onChange={(e) => handleSystemInteractionChange(systemInteractions[0].id, 'step', e.target.value)}
                  placeholder="Example: Managing incoming requests, creating new accounts"
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
                  Which system or tool?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={systemInteractions[0].system}
                  onChange={(e) => handleSystemInteractionChange(systemInteractions[0].id, 'system', e.target.value)}
                  placeholder="Example: Ticketing system, Email system, CRM, Database"
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
                  How is the system used?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={systemInteractions[0].userAction}
                  onChange={(e) => handleSystemInteractionChange(systemInteractions[0].id, 'userAction', e.target.value)}
                  placeholder="Example: User logs in to track tickets and update status as they progress"
                  maxLength={400}
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '100px'
                  }}
                />
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Additional System Interactions (if any) */}
      {systemInteractions.slice(1).map((interaction, index) => (
        <Card 
          key={`system-interaction-${interaction.id}`} 
          style={styles.card}
          className="section"
        >
          <Card.Header style={styles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={styles.h3}>
                System Interaction {index + 2} {/* +2 because we're starting from the second item (index 1) */}
              </h3>
              
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onRemoveSystemInteraction(interaction.id)}
                className="no-print"
              >
                Remove
              </Button>
            </div>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>
                Which step uses a system/tool?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={interaction.step}
                onChange={(e) => handleSystemInteractionChange(interaction.id, 'step', e.target.value)}
                placeholder="Example: Managing incoming requests, creating new accounts"
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
                Which system or tool?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={interaction.system}
                onChange={(e) => handleSystemInteractionChange(interaction.id, 'system', e.target.value)}
                placeholder="Example: Ticketing system, Email system, CRM, Database"
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
                How is the system used?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={interaction.userAction}
                onChange={(e) => handleSystemInteractionChange(interaction.id, 'userAction', e.target.value)}
                placeholder="Example: User logs in to track tickets and update status as they progress"
                maxLength={400}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '100px'
                }}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      ))}
      
      {/* Add System Interaction Button */}
      <div className="text-center mb-4 mt-3 no-print">
        <Button 
          variant="outline-primary" 
          onClick={onAddSystemInteraction}
          style={styles.btnOutlinePrimary}
        >
          Add System Interaction
        </Button>
      </div>
    </>
  );
};

export default SystemInteractions;