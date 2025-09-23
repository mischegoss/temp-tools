import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

const SystemDocumentation = ({ 
  systems, 
  handleSystemDetailsChange, 
  handleSystemExpertChange, 
  addSystem 
}) => {
  return (
    <>
      {systems.map((system, index) => (
        <React.Fragment key={`system-${system.id}`}>
          {/* System Details Card - PART 1 */}
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
                {index === 0 ? "Document Your Technical Systems" : `System #${system.id}`}
              </h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              {index === 0 && <p style={{ marginBottom: '1.5rem' }}>Document each system involved in your automation process.</p>}
              
              <h3 style={{ ...styles.h2, fontSize: '1.2rem', marginBottom: '1rem' }}>Basic System Information</h3>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>1. What is the name of the system involved in your process?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.details.name}
                  onChange={(e) => handleSystemDetailsChange(system.id, 'name', e.target.value)}
                  placeholder="Ex: Service Desk System"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={200}
                />
              </Form.Group>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>2. What function does this system serve?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.details.function}
                  onChange={(e) => handleSystemDetailsChange(system.id, 'function', e.target.value)}
                  placeholder="Ex: Manages customer support tickets and tracks issue resolution"
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

          {/* System Details Card - PART 2 */}
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
                How the System Integrates Into the Process
              </h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>1. At what step in the process does this system come into play, and what specific task does it perform?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.details.step}
                  onChange={(e) => handleSystemDetailsChange(system.id, 'step', e.target.value)}
                  placeholder="Ex: Step 2 - System receives password reset request and creates a ticket"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={200}
                />
              </Form.Group>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>2. Which departments or teams interact with this system as part of their work?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.details.departments}
                  onChange={(e) => handleSystemDetailsChange(system.id, 'departments', e.target.value)}
                  placeholder="Ex: Help Desk Team, IT Support, System Administrators"
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
          
          {/* Who Knows the System Card - PART 1 */}
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Your Technical Experts</h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              <h3 style={{ ...styles.h2, fontSize: '1.2rem', marginBottom: '1rem' }}>Primary Contacts</h3>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>1. Who is the main person to talk to about this system?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.experts.mainContact}
                  onChange={(e) => handleSystemExpertChange(system.id, 'mainContact', e.target.value)}
                  placeholder="Ex: Jane Smith, Help Desk Manager"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={200}
                />
              </Form.Group>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>2. Who is the technical expert in this system?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.experts.technicalExpert}
                  onChange={(e) => handleSystemExpertChange(system.id, 'technicalExpert', e.target.value)}
                  placeholder="Ex: John Doe, Systems Administrator"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={200}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Who Knows the System Card - PART 2 */}
          <Card style={styles.card} className="section">
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Who Has System Access?</h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              <h3 style={{ ...styles.h2, fontSize: '1.2rem', marginBottom: '1rem' }}>System Access & Maintenance</h3>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>1. Who handles regular maintenance for this system?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.experts.maintenanceHandler}
                  onChange={(e) => handleSystemExpertChange(system.id, 'maintenanceHandler', e.target.value)}
                  placeholder="Ex: IT Support Team"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={200}
                />
              </Form.Group>
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>2. Do you have the necessary administrator access or credentials for this system, or know who does?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={system.experts.adminAccess}
                  onChange={(e) => handleSystemExpertChange(system.id, 'adminAccess', e.target.value)}
                  placeholder="Ex: Yes, our IT Director has admin access"
                  style={{
                    ...styles.formControl,
                    resize: 'vertical',
                    overflow: 'hidden',
                    minHeight: '80px'
                  }}
                  maxLength={200}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </React.Fragment>
      ))}
      
      {/* Add System Button */}
      <div className="text-center mb-5 mt-4 no-print">
        <Button 
          variant="outline-primary" 
          onClick={addSystem} 
          style={{...styles.btnOutlinePrimary, margin: '1rem', padding: '0.5rem 1.5rem'}}
        >
          Add Another System
        </Button>
      </div>
    </>
  );
};

export default SystemDocumentation;