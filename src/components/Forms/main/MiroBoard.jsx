import React, { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import MiroExample from '../partials/MiroExample';
import MiroPDFExporter from '../utils/MiroPDFGenerator';
import { PrintStyles } from '../styles/print-styles';
import { styles } from '../styles/styles';
import TitleSection from '../utils/TitleSection';
import FormControlWithPrintFallback from '../utils/FormControlPDF';

/**
 * MiroBoard component - Standalone component for the visual process flow diagram
 * 
 * @returns {JSX.Element} MiroBoard component with download functionality
 */
const MiroBoard = () => {
  const [processName, setProcessName] = useState('');
  const [subtitle, setSubtitle] = useState(
    "Use this tool to start sketching out your workflow."
  );
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  const contentRef = useRef(null);

  const handleDownload = async () => {
    setSubmitStatus({ loading: true, error: null, success: false });
    
    try {
      // Update the subtitle with date but preserve instructions
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      // For the PDF, we only want to show the creation date, not the instructions
      const pdfSubtitle = `Created on ${currentDate}`;
      setSubtitle(pdfSubtitle);

      // Wait a brief moment for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use the MiroPDFExporter utility to generate PDF of just the Miro board
      const filename = processName 
        ? `process-flow-${processName.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : 'process-flow-diagram.pdf';
        
      // Include processName in options to customize title page
      const options = {
        processName: processName,
        creationDate: currentDate
      };
        
      await MiroPDFExporter.generateMiroPDF(contentRef, filename, options);
      
      // Reset the subtitle to the instructions after PDF generation
      setSubtitle("Use this diagram tool to map your process flow. Click and drag between nodes to create connections.");
      
      setSubmitStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        error: 'Failed to download diagram. Please try again.', 
        success: false 
      });
      console.error('Error:', error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <PrintStyles />
      <div ref={contentRef} style={styles.container} className="container-print">
        {/* Title Section */}
        <TitleSection title={processName ? `Process Flow: ${processName}` : "Process Flow Diagram"} subtitle={subtitle} />
        
        {/* Process Flow Diagram */}
        <div className="section">
          <MiroExample />
        </div>
      </div>
      
      {/* Process name input and download button in a card */}
      <div className="no-print" style={{ marginBottom: '2rem', maxWidth: '800px', margin: '1.5rem auto' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px 30px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#333', 
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #eaeaea',
            backgroundColor: '#f9f9f9',
            margin: '-24px -30px 24px -30px',
            padding: '24px 30px'
          }}>
            Download Your Diagram
          </h2>
          
          {/* Important note about download visibility */}
          <div style={{ 
            margin: '0 0 24px 0', 
            padding: '12px 16px',
            backgroundColor: '#fff4e5',
            border: '1px solid #ffb74d',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#e65100' }}>
              Important Note:
            </div>
            <div style={{ color: '#333' }}>
              The downloaded PDF will only capture elements currently visible on the canvas. 
              Use the zoom controls in the diagram editor to adjust what will be included in your PDF.
            </div>
          </div>
          
          <Form.Group style={{ marginBottom: '24px' }}>
            <Form.Label style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '8px', display: 'block', color: '#444' }}>
              Process Name
            </Form.Label>
            <FormControlWithPrintFallback
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="Enter the name of your process"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              maxLength={200}
            />
            <Form.Text style={{ display: 'block', marginTop: '8px', color: '#666', fontSize: '0.9rem' }}>
              This name will appear in the title of your diagram and PDF
            </Form.Text>
          </Form.Group>
          
          {/* Download button */}
          <div style={{ marginTop: '24px' }}>
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={submitStatus.loading}
              style={{
                backgroundColor: '#0ec0c0',
                borderColor: '#0ec0c0',
                padding: '12px 24px',
                fontWeight: '600',
                fontSize: '1rem',
                width: '100%',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                color: '#ffffff'
              }}
            >
              {submitStatus.loading ? "Preparing Download..." : "Download Diagram"}
            </Button>
            
            {submitStatus.error && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px 16px', 
                backgroundColor: '#f8d7da', 
                borderColor: '#f5c6cb', 
                color: '#721c24', 
                borderRadius: '4px' 
              }} role="alert">
                {submitStatus.error}
              </div>
            )}
            
            {submitStatus.success && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px 16px', 
                backgroundColor: '#d4edda', 
                borderColor: '#c3e6cb', 
                color: '#155724', 
                borderRadius: '4px' 
              }} role="alert">
                Diagram downloaded successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiroBoard;