//src/components/Forms/process/PeopleInteractions

import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * PeopleInteractions component - Handles the collection of people/department interactions in the process
 * 
 * @param {Object} props Component props
 * @param {Array} props.peopleInteractions Array of people interaction objects
 * @param {Function} props.onAddPeopleInteraction Function to add a new people interaction
 * @param {Function} props.onUpdatePeopleInteraction Function to update a people interaction
 * @param {Function} props.onRemovePeopleInteraction Function to remove a people interaction
 * @returns {JSX.Element} PeopleInteractions component
 */
const PeopleInteractions = ({ 
  peopleInteractions, 
  onAddPeopleInteraction, 
  onUpdatePeopleInteraction, 
  onRemovePeopleInteraction 
}) => {
  // Handle people interaction field changes
  const handlePeopleInteractionChange = (id, field, value) => {
    onUpdatePeopleInteraction(id, field, value);
  };

  return (
    <>
      {/* People Interactions Section - Main Card */}
      <Card style={styles.card} className="section">
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.h2}>5. People Interactions: Who's Involved and When?</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={{ marginBottom: '1.5rem' }}>
            Document points where your process requires communication or handoffs between people or departments.
            Look for approval requests, information handoffs, notifications, and collaboration points.
          </p>
          
          {/* First People Interaction embedded within the section card */}
          <div className="mt-4" style={{ border: '1px solid #e0e0e0', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ ...styles.cardHeader, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={styles.h3}>
                  People Interaction 1
                </h3>
                
                {peopleInteractions.length > 1 && (
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemovePeopleInteraction(peopleInteractions[0].id)}
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
                  At which step is a handoff or communication needed?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={peopleInteractions[0].step}
                  onChange={(e) => handlePeopleInteractionChange(peopleInteractions[0].id, 'step', e.target.value)}
                  placeholder="Example: After customer account is created"
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
                  Who is involved in this interaction?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={peopleInteractions[0].people}
                  onChange={(e) => handlePeopleInteractionChange(peopleInteractions[0].id, 'people', e.target.value)}
                  placeholder="Example: Customer Service Rep → Department Manager"
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
                  What happens during this interaction?
                </Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={peopleInteractions[0].purpose}
                  onChange={(e) => handlePeopleInteractionChange(peopleInteractions[0].id, 'purpose', e.target.value)}
                  placeholder="Example: Manager needs to approve accounts with credit limits over $5000"
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
      
      {/* Additional People Interactions */}
      {peopleInteractions.slice(1).map((interaction, index) => (
        <Card 
          key={`people-interaction-${interaction.id}`} 
          style={styles.card}
          className="section"
        >
          <Card.Header style={styles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={styles.h3}>
                People Interaction {index + 2} {/* +2 because we're starting from the second item (index 1) */}
              </h3>
              
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onRemovePeopleInteraction(interaction.id)}
                className="no-print"
              >
                Remove
              </Button>
            </div>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>
                At which step is a handoff or communication needed?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={interaction.step}
                onChange={(e) => handlePeopleInteractionChange(interaction.id, 'step', e.target.value)}
                placeholder="Example: After customer account is created"
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
                Who is involved in this interaction?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={interaction.people}
                onChange={(e) => handlePeopleInteractionChange(interaction.id, 'people', e.target.value)}
                placeholder="Example: Customer Service Rep → Department Manager"
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
                What happens during this interaction?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={interaction.purpose}
                onChange={(e) => handlePeopleInteractionChange(interaction.id, 'purpose', e.target.value)}
                placeholder="Example: Manager needs to approve accounts with credit limits over $5000"
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
      
      {/* Add People Interaction Button */}
      <div className="text-center mb-4 mt-3 no-print">
        <Button 
          variant="outline-primary" 
          onClick={onAddPeopleInteraction}
          style={styles.btnOutlinePrimary}
        >
          Add People Interaction
        </Button>
      </div>
    </>
  );
};

export default PeopleInteractions;
