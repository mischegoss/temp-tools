import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

const SystemConnections = ({ 
  connections, 
  handleConnectionChange, 
  addConnection 
}) => {
  return (
    <>
      {connections.map((connection, index) => (
        <React.Fragment key={`connection-fragment-${connection.id}`}>
          {/* First card with systems and information */}
          <Card style={styles.card} className="section" key={`connection-${connection.id}`}>
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
                {index === 0 ? "Identify Integrations: Key Connection Points" : `Connection Point #${connection.id}`}
              </h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              {index === 0 && (
                <p style={{ marginBottom: '1.5rem' }}>
                  Document how different systems in your process share information with each other.
                </p>
              )}
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>1. Which systems need to work together to complete a step in the process?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={connection.systemsInvolved}
                  onChange={(e) => handleConnectionChange(connection.id, 'systemsInvolved', e.target.value)}
                  placeholder="Ex: HR System and Email System"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={300}
                />
              </Form.Group>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>2. What information needs to move between these systems for the step to be complete?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={connection.information}
                  onChange={(e) => handleConnectionChange(connection.id, 'information', e.target.value)}
                  placeholder="Ex: Employee contact details and access level information"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={300}
                />
              </Form.Group>
            </Card.Body>
          </Card>
          
          {/* Second card with current method */}
          <Card style={styles.card} className="section" key={`connection-method-${connection.id}`}>
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
                Current Connection Method {connection.id > 1 ? `#${connection.id}` : ''}
              </h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>3. How is this connection currently made?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={connection.currentMethod}
                  onChange={(e) => handleConnectionChange(connection.id, 'currentMethod', e.target.value)}
                  placeholder="Ex: Help desk staff manually enter information from the HR system into the email system"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={600}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </React.Fragment>
      ))}
      
      {/* Add Connection Button - Outside of any card */}
      <div className="text-center mb-5 mt-4 no-print">
        <Button 
          variant="outline-primary" 
          onClick={addConnection} 
          style={{...styles.btnOutlinePrimary, margin: '1rem', padding: '0.5rem 1.5rem'}}
        >
          Add Another Connection Point
        </Button>
      </div>
    </>
  );
};

export default SystemConnections;