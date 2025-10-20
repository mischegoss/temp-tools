import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { styles } from '../styles/styles';

const TechnicalReadinessChecklist = ({ checkboxes, handleCheckboxChange }) => {
  return (
    <Card style={styles.card} className="section">
      <Card.Header style={styles.cardHeader}>
        <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>Technical Readiness Checklist for Automation</h2>
      </Card.Header>
      <Card.Body style={styles.cardBody}>
        <p style={{ marginBottom: '1.5rem' }}>Confirm the technical requirements for your automation project.</p>
        <div style={styles.radioGroup} className="radio-group">
          <Form.Check 
            type="checkbox"
            id="systemInventory"
            label="List all tools and systems that will be part of the automation"
            name="systemInventory"
            checked={checkboxes.systemInventory}
            onChange={handleCheckboxChange}
            style={{
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
            }}
          />
          <Form.Check 
            type="checkbox"
            id="connectionPoints"
            label="Confirm how systems will share information with each other"
            name="connectionPoints"
            checked={checkboxes.connectionPoints}
            onChange={handleCheckboxChange}
            style={{
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
            }}
          />
          <Form.Check 
            type="checkbox"
            id="accessPermissions"
            label="Ensure proper access is available for the automation to work in all systems"
            name="accessPermissions"
            checked={checkboxes.accessPermissions}
            onChange={handleCheckboxChange}
            style={{
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
            }}
          />
          <Form.Check 
            type="checkbox"
            id="teamExpertise"
            label="Identify who knows each system best and can help with questions"
            name="teamExpertise"
            checked={checkboxes.teamExpertise}
            onChange={handleCheckboxChange}
            style={{
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
            }}
          />
          <Form.Check 
            type="checkbox"
            id="informationFlow"
            label="Document how information moves between teams and systems"
            name="informationFlow"
            checked={checkboxes.informationFlow}
            onChange={handleCheckboxChange}
            style={{
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
            }}
          />
          <Form.Check 
            type="checkbox"
            id="technicalRequirements"
            label="Check that all systems meet the basic requirements needed for automation"
            name="technicalRequirements"
            checked={checkboxes.technicalRequirements}
            onChange={handleCheckboxChange}
            style={{
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default TechnicalReadinessChecklist;