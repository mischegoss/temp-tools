//src/components/Forms/process/DecisionPoints

import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

/**
 * DecisionPoints component - Handles the collection of decision points in the process
 * 
 * @param {Object} props Component props
 * @param {Array} props.decisionPoints Array of decision point objects
 * @param {Function} props.onAddDecisionPoint Function to add a new decision point
 * @param {Function} props.onUpdateDecisionPoint Function to update a decision point
 * @param {Function} props.onRemoveDecisionPoint Function to remove a decision point
 * @returns {JSX.Element} DecisionPoints component
 */
const DecisionPoints = ({ 
  decisionPoints, 
  onAddDecisionPoint, 
  onUpdateDecisionPoint, 
  onRemoveDecisionPoint 
}) => {
  // Handle decision point field changes
  const handleDecisionPointChange = (id, field, value) => {
    onUpdateDecisionPoint(id, field, value);
  };

  return (
    <>
      {/* Decision Points Section - Main Card */}
      <Card style={styles.card} className="section">
        <Card.Header style={styles.cardHeader}>
          <h2 style={styles.h2}>3. Decision Points: Where Does Your Process Branch?</h2>
        </Card.Header>
        <Card.Body style={styles.cardBody}>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Definition:</strong> Decision points are questions where your process follows different paths based on the answer. Look for places where someone must check conditions and choose between different next steps.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Tip:</strong> Frame decisions as yes/no questions whenever possible, and don't worry about capturing every nuance now—focus on the main branches!
          </p>
          
          {decisionPoints.length === 0 ? (
            <div className="text-center my-3 p-3" style={{ backgroundColor: '#e9ecef', borderRadius: '5px' }}>
              <p style={{ marginBottom: '0' }}>No decision points added yet.</p>
            </div>
          ) : (
            // First Decision Point embedded within the section card
            <div className="mt-4" style={{ border: '1px solid #e0e0e0', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{ ...styles.cardHeader, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 style={styles.h3}>
                    Decision Point 1
                  </h3>
                  
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemoveDecisionPoint(decisionPoints[0].id)}
                    className="no-print"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.formLabel}>
                    Decision Question:
                  </Form.Label>
                  <FormControlWithPrintFallback
                    as="textarea"
                    value={decisionPoints[0].question}
                    onChange={(e) => handleDecisionPointChange(decisionPoints[0].id, 'question', e.target.value)}
                    placeholder="Example: Is the information complete? (Frame as a yes/no question)"
                    maxLength={300}
                    style={{
                      ...styles.formControl,
                      resize: 'vertical',
                      overflow: 'hidden',
                      minHeight: '80px'
                    }}
                  />
                </Form.Group>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div style={{ 
                      border: '1px solid #d1e7dd', 
                      backgroundColor: '#f0f9f0', 
                      borderRadius: '0.3rem',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <Form.Group>
                        <Form.Label style={styles.formLabel}>If YES:</Form.Label>
                        <FormControlWithPrintFallback
                          as="textarea"
                          value={decisionPoints[0].yesPath}
                          onChange={(e) => handleDecisionPointChange(decisionPoints[0].id, 'yesPath', e.target.value)}
                          placeholder="Example: Create the account (What happens in the YES path?)"
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
                  <div className="col-md-6">
                    <div style={{ 
                      border: '1px solid #f8d7da', 
                      backgroundColor: '#fff8f8', 
                      borderRadius: '0.3rem',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <Form.Group>
                        <Form.Label style={styles.formLabel}>If NO:</Form.Label>
                        <FormControlWithPrintFallback
                          as="textarea"
                          value={decisionPoints[0].noPath}
                          onChange={(e) => handleDecisionPointChange(decisionPoints[0].id, 'noPath', e.target.value)}
                          placeholder="Example: Request more information (What happens in the NO path?)"
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
                </div>
                
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.formLabel}>
                    Who makes this decision?
                  </Form.Label>
                  <FormControlWithPrintFallback
                    as="textarea"
                    value={decisionPoints[0].decisionMaker || ''}
                    onChange={(e) => handleDecisionPointChange(decisionPoints[0].id, 'decisionMaker', e.target.value)}
                    placeholder="Example: Support team member, Department Manager, Automated system"
                    maxLength={200}
                    style={{
                      ...styles.formControl,
                      resize: 'vertical',
                      overflow: 'hidden',
                      minHeight: '60px'
                    }}
                  />
                </Form.Group>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Additional Decision Points */}
      {decisionPoints.slice(1).map((decision, index) => (
        <Card 
          key={`decision-${decision.id}`} 
          style={styles.card} 
          className="section decision-point-section"
        >
          <Card.Header style={styles.cardHeader}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={styles.h3}>
                Decision Point {index + 2} {/* +2 because we're starting from the second item (index 1) */}
              </h3>
              
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onRemoveDecisionPoint(decision.id)}
                className="no-print"
              >
                Remove
              </Button>
            </div>
          </Card.Header>
          <Card.Body style={styles.cardBody}>
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>
                Decision Question:
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={decision.question}
                onChange={(e) => handleDecisionPointChange(decision.id, 'question', e.target.value)}
                placeholder="Example: Is the information complete? (Frame as a yes/no question)"
                maxLength={300}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '80px'
                }}
              />
            </Form.Group>
            
            <div className="row mt-4">
              <div className="col-md-6">
                <div style={{ 
                  border: '1px solid #d1e7dd', 
                  backgroundColor: '#f0f9f0', 
                  borderRadius: '0.3rem',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <Form.Group>
                    <Form.Label style={styles.formLabel}>If YES:</Form.Label>
                    <FormControlWithPrintFallback
                      as="textarea"
                      value={decision.yesPath}
                      onChange={(e) => handleDecisionPointChange(decision.id, 'yesPath', e.target.value)}
                      placeholder="Example: Create the account (What happens in the YES path?)"
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
              <div className="col-md-6">
                <div style={{ 
                  border: '1px solid #f8d7da', 
                  backgroundColor: '#fff8f8', 
                  borderRadius: '0.3rem',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <Form.Group>
                    <Form.Label style={styles.formLabel}>If NO:</Form.Label>
                    <FormControlWithPrintFallback
                      as="textarea"
                      value={decision.noPath}
                      onChange={(e) => handleDecisionPointChange(decision.id, 'noPath', e.target.value)}
                      placeholder="Example: Request more information (What happens in the NO path?)"
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
            </div>
            
            <Form.Group style={styles.formGroup}>
              <Form.Label style={styles.formLabel}>
                Who makes this decision?
              </Form.Label>
              <FormControlWithPrintFallback
                as="textarea"
                value={decision.decisionMaker || ''}
                onChange={(e) => handleDecisionPointChange(decision.id, 'decisionMaker', e.target.value)}
                placeholder="Example: Support team member, Department Manager, Automated system"
                maxLength={200}
                style={{
                  ...styles.formControl,
                  resize: 'vertical',
                  overflow: 'hidden',
                  minHeight: '60px'
                }}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      ))}
      
      {/* Add Decision Point Button */}
      <div className="text-center mb-4 mt-3 no-print">
        <Button 
          variant="outline-primary" 
          onClick={onAddDecisionPoint}
          style={styles.btnOutlinePrimary}
        >
          Add Decision Point
        </Button>
      </div>
    </>
  );
};

export default DecisionPoints;