import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import PDFGenerator from '../utils/PDFGenerator';

/**
 * A simple component that can be added to the MiroExample component
 * to enable saving nodes to localStorage and exporting them as a PDF table
 * 
 * @param {Object} props
 * @param {Array} props.nodes - The nodes from ReactFlow
 * @param {Array} props.edges - The edges from ReactFlow (for step sequencing)
 */
const MiroTableExporter = ({ nodes, edges }) => {
  const [lastSaved, setLastSaved] = useState(null);
  const contentRef = useRef(null);
  
  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      try {
        localStorage.setItem('miroFlowNodes', JSON.stringify(nodes));
        localStorage.setItem('miroFlowEdges', JSON.stringify(edges || []));
        const saveTime = new Date().toLocaleTimeString();
        setLastSaved(saveTime);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [nodes, edges]);
  
  // Generate and download PDF with steps table
  const handleExportTable = async () => {
    try {
      await PDFGenerator.generatePDF(contentRef, 'process-steps.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  // Get all nodes except the first one (Start Process)
  const processSteps = nodes ? nodes.slice(1) : [];
  
  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <Button
          variant="primary"
          onClick={handleExportTable}
          style={{
            backgroundColor: '#0ec0c0', 
            borderColor: '#0ba8a8',
            color: 'white',
            fontWeight: 500
          }}
        >
          Export Steps Table
        </Button>
      </div>
      
      {/* Hidden div for PDF generation */}
      <div ref={contentRef} style={{ display: 'none' }}>
        <div className="title-section" style={{ textAlign: 'center', marginBottom: '2rem', padding: '20px' }}>
          <h1 style={{ fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Process Flow Steps</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <Card className="section">
          <Card.Header style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e9ecef', padding: '1.5rem' }}>
            <h2 style={{ color: '#2c3345', fontSize: '1.8rem', margin: 0, fontWeight: 600, lineHeight: 1.3 }}>
              Process Steps
            </h2>
          </Card.Header>
          <Card.Body style={{ padding: '1.5rem' }}>
            <Table bordered striped responsive>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>#</th>
                  <th style={{ width: '20%' }}>Type</th>
                  <th style={{ width: '30%' }}>Label</th>
                  <th style={{ width: '40%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {processSteps.map((node, index) => (
                  <tr key={node.id}>
                    <td>{index + 1}</td>
                    <td>{node.type === 'action' ? 'Action Step' : 'Decision Point'}</td>
                    <td>{node.data.label}</td>
                    <td>{node.data.description || 'No description provided'}</td>
                  </tr>
                ))}
                {processSteps.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      No process steps have been defined yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default MiroTableExporter;