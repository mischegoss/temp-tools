import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import FormControlWithPrintFallback from '../utils/FormControlPDF';
import { styles } from '../styles/styles';

const TeamKnowledge = ({ 
  teams, 
  handleTeamChange, 
  addTeam 
}) => {
  return (
    <>
      {teams.map((team, index) => (
        <React.Fragment key={`team-fragment-${team.id}`}>
          {/* First card - Team Name */}
          <Card style={styles.card} className="section" key={`team-${team.id}`}>
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
                {index === 0 ? "Assess Your Technical Readiness" : `Team #${team.id} Knowledge Requirements`}
              </h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              {index === 0 && (
                <p style={{ marginBottom: '1.5rem' }}>
                  What will change about how each team does their job with automation? What information will they need to know to be succcessful?
                </p>
              )}
              
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>1. Team Name</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={team.name}
                  onChange={(e) => handleTeamChange(team.id, 'name', e.target.value)}
                  placeholder="Ex: Help Desk Team"
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
          
          {/* Available Training Card (formerly third card) */}
          <Card style={styles.card} className="section" key={`team-training-${team.id}`}>
            <Card.Header style={styles.cardHeader}>
              <h2 style={{ ...styles.h2, fontSize: '1.4rem' }}>
                Available Training {team.id > 1 ? `for Team #${team.id}` : ''}
              </h2>
            </Card.Header>
            <Card.Body style={styles.cardBody}>
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.formLabel}>2. What training is available to help the team feel prepared to automate their processes?</Form.Label>
                <FormControlWithPrintFallback
                  as="textarea"
                  value={team.availableTraining}
                  onChange={(e) => handleTeamChange(team.id, 'availableTraining', e.target.value)}
                  placeholder="Ex: Online courses for the new system, in-person workflow training, knowledge base articles"
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
      
      {/* Add Team Button - Outside of any card */}
      <div className="text-center mb-5 mt-4 no-print">
        <Button 
          variant="outline-primary" 
          onClick={addTeam} 
          style={{...styles.btnOutlinePrimary, margin: '1rem', padding: '0.5rem 1.5rem'}}
        >
          Add Another Team
        </Button>
      </div>
    </>
  );
};

export default TeamKnowledge;
