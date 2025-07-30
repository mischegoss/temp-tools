import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Alert } from 'react-bootstrap';

const OrchestrationImpactAnalysis = () => {
  const [currentMetrics, setCurrentMetrics] = useState({
    teamsInvolved: '',
    waitingDays: '',
    monthlyVolume: ''
  });

  const [scores, setScores] = useState({
    processConnectivity: 0,
    timeImpact: 0,
    scalabilityPotential: 0,
    total: 0
  });

  const calculateScores = () => {
    if (!Object.values(currentMetrics).every(val => val !== '')) {
      return null;
    }

    // Process Connectivity (based on teams involved)
    const connectivityScore = currentMetrics.teamsInvolved > 4 ? 5 :
      currentMetrics.teamsInvolved > 3 ? 4 :
      currentMetrics.teamsInvolved > 2 ? 3 :
      currentMetrics.teamsInvolved > 1 ? 2 : 1;

    // Time Impact (based on waiting days)
    const timeScore = currentMetrics.waitingDays > 5 ? 5 :
      currentMetrics.waitingDays > 3 ? 4 :
      currentMetrics.waitingDays > 2 ? 3 :
      currentMetrics.waitingDays > 1 ? 2 : 1;

    // Scalability (based on volume)
    const volumeScore = currentMetrics.monthlyVolume > 100 ? 5 :
      currentMetrics.monthlyVolume > 50 ? 4 :
      currentMetrics.monthlyVolume > 25 ? 3 :
      currentMetrics.monthlyVolume > 10 ? 2 : 1;

    return {
      processConnectivity: connectivityScore,
      timeImpact: timeScore,
      scalabilityPotential: volumeScore,
      total: connectivityScore + timeScore + volumeScore
    };
  };

  const handleMetricChange = (metric, value) => {
    setCurrentMetrics(prev => ({
      ...prev,
      [metric]: value
    }));
  };

  useEffect(() => {
    const newScores = calculateScores();
    if (newScores) {
      setScores(newScores);
    }
  }, [currentMetrics]);

  const getOrchestrationRecommendation = (totalScore) => {
    if (totalScore >= 12) return "Strong orchestration opportunity - Multiple teams with significant waiting time suggest high potential for process connection benefits.";
    if (totalScore >= 9) return "Good orchestration candidate - Consider connecting key team processes to reduce waiting time and improve coordination.";
    if (totalScore >= 6) return "Potential opportunity - Start by identifying and automating critical handoff points between teams.";
    return "Review process connections - Look for more opportunities to connect team workflows before pursuing orchestration.";
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h2>7. Orchestration Assessment</h2>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12}>
            <h3 className="mb-3">Current Process</h3>
            <Form.Group className="mb-3">
              <Form.Label>Number of Teams Involved</Form.Label>
              <Form.Control
                type="number"
                value={currentMetrics.teamsInvolved}
                placeholder="Ex: 4 (like HR, IT, Security, Facilities)"
                onChange={(e) => handleMetricChange('teamsInvolved', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Process Duration (days)</Form.Label>
              <Form.Control
                type="number"
                value={currentMetrics.waitingDays}
                placeholder="Ex: 5 (total days from start to finish)"
                onChange={(e) => handleMetricChange('waitingDays', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monthly Volume</Form.Label>
              <Form.Control
                type="number"
                value={currentMetrics.monthlyVolume}
                placeholder="Ex: 50 requests per month"
                onChange={(e) => handleMetricChange('monthlyVolume', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {scores.total > 0 && (
          <Alert variant="info" className="mt-4">
            <h4 className="mb-3">Orchestration Assessment Scores</h4>
            <Row>
              <Col md={6}>
                <ul className="list-unstyled mb-3">
                  <li>Process Connectivity: {scores.processConnectivity}/5</li>
                  <li>Time Impact Potential: {scores.timeImpact}/5</li>
                  <li>Scalability Potential: {scores.scalabilityPotential}/5</li>
                </ul>
              </Col>
              <Col md={6}>
                <div>
                  <strong>Overall Score: {scores.total}/15</strong>
                  <p className="mt-2 mb-0">{getOrchestrationRecommendation(scores.total)}</p>
                </div>
              </Col>
            </Row>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrchestrationImpactAnalysis;