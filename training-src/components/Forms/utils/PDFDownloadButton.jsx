import React from 'react';
import { Button } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PDFDownloadButton = ({ contentRef, fileName = 'document.pdf', children }) => {
  const generatePDF = async () => {
    const content = contentRef.current;
    
    // Store all input elements with placeholders
    const inputs = content.querySelectorAll('input[placeholder], textarea[placeholder]');
    const placeholderData = new Map();
    
    try {
      // Remove placeholders before capture
      inputs.forEach(input => {
        if (input.placeholder) {
          placeholderData.set(input, input.placeholder);
          input.placeholder = '';
        }
      });

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Restore placeholders
      inputs.forEach(input => {
        const placeholder = placeholderData.get(input);
        if (placeholder) {
          input.placeholder = placeholder;
        }
      });
    }
  };

  const downloadButtonStyle = {
    position: 'sticky',
    bottom: '20px',
    width: '100%',
    zIndex: 1000,
    marginTop: '2rem',
    marginBottom: '2rem'
  };

  return (
    <div style={downloadButtonStyle}>
      <Button 
        variant="primary" 
        size="lg"
        onClick={generatePDF}
        className="w-100"
      >
        {children || 'Download PDF'}
      </Button>
    </div>
  );
};

export default PDFDownloadButton;