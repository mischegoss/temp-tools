import { jsPDF } from 'jspdf';
import domToImage from 'dom-to-image';
import html2canvas from 'html2canvas';

/**
 * MiroPDFExporter with fixed title rendering and isolated sections
 */
class MiroPDFExporter {
  /**
   * Generate a PDF containing a title page and the Miro board
   * 
   * @param {React.RefObject} contentRef - Reference to the content DOM element
   * @param {String} filename - Name of the PDF file to save
   * @param {Object} options - Additional options including processName and creationDate
   * @returns {Promise} - Promise that resolves when PDF is generated
   */
  static async generateMiroPDF(contentRef, filename = 'process-flow-diagram.pdf', options = {}) {
    const content = contentRef.current;
    if (!content) {
      throw new Error('Content reference is not available');
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'p', // portrait
      unit: 'in',
      format: 'letter',
      compress: true,
      compressPdf: true,
      precision: 16 // Higher precision for better quality
    });
    
    try {
      // Find all elements
      const titleSection = content.querySelector('.title-section');
      const miroContainer = content.querySelector('.miro-board-container');
      const processTable = content.querySelector('.process-table-container');
      
      if (!miroContainer) {
        throw new Error('Miro board container not found');
      }
      
      // PDF dimensions reference
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // ***********************************************
      // SECTION 1: TITLE PAGE - SKIP CAPTURE, USE TEXT DIRECTLY
      // ***********************************************
      if (titleSection) {
        // Skip the html2canvas capture entirely and use text rendering
        // This ensures consistent formatting regardless of UI rendering
        
        // Properly format the title with spaces
        let title = "Process Flow Diagram";
        
        if (options.processName) {
          // Ensure there's a space between Process and Flow
          title = `Process Flow: ${options.processName}`;
        }
        
        // Format date consistently
        const subtitle = options.creationDate
          ? `Created on ${options.creationDate}`
          : `Created on ${new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}`;
        
        // Center the title vertically
        const centerY = pdfHeight / 2;
        
        // Add logo if available
        const logo = content.querySelector('.pdf-only-logo img');
        if (logo) {
          try {
            const logoCanvas = await html2canvas(logo, {
              scale: 2,
              backgroundColor: null
            });
            const logoData = logoCanvas.toDataURL('image/png');
            
            // Add logo at top of page
            const logoWidth = 2; // 2 inches wide
            const logoHeight = logoWidth * (logoCanvas.height / logoCanvas.width);
            const logoX = (pdfWidth - logoWidth) / 2;
            
            pdf.addImage(
              logoData,
              'PNG',
              logoX,
              centerY - 2.5,
              logoWidth,
              logoHeight
            );
          } catch (logoError) {
            console.error('Error adding logo:', logoError);
          }
        }
        
        // Add title text with proper spacing
        pdf.setFontSize(24);
        pdf.setTextColor(33, 33, 33);
        pdf.text(title, pdfWidth / 2, centerY - 0.5, { align: 'center' });
        
        // Add subtitle
        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.text(subtitle, pdfWidth / 2, centerY + 0.25, { align: 'center' });
        
        // Add new page for diagram
        pdf.addPage();
      }

      // ***********************************************
      // SECTION 2: DIAGRAM CAPTURE - ISOLATED
      // ***********************************************
      
      // Add title to diagram page with proper spacing
      const diagramMargins = 0.5;
      
      // Ensure there's a space between Process and Flow in diagram title
      let diagramTitle = "Process Flow Diagram";
      
      if (options.processName) {
        diagramTitle = `Process Flow: ${options.processName}`;
      }
      
      pdf.setFontSize(16);
      pdf.text(diagramTitle, pdfWidth / 2, diagramMargins, { align: 'center' });
      
      // Add delay to ensure the diagram is fully rendered
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple approach: capture the diagram with dom-to-image
      const dataUrl = await domToImage.toPng(miroContainer, {
        quality: 1.0,
        bgcolor: 'white',
        filter: (node) => {
          // Filter out UI controls
          return (!node.classList || 
                 (!node.classList.contains('react-flow__minimap') && 
                  !node.classList.contains('react-flow__controls') &&
                  !node.classList.contains('react-flow__attribution')));
        }
      });
      
      // Available width and height (accounting for margins and title)
      const availableWidth = pdfWidth - (2 * diagramMargins);
      const availableHeight = pdfHeight - (2 * diagramMargins) - 0.75; // Space for title
      
      // Add the image to fill most of the page
      pdf.addImage(
        dataUrl,
        'PNG',
        diagramMargins,
        diagramMargins + 0.75, // Position below title
        availableWidth,
        availableHeight
      );
      
      // ***********************************************
      // SECTION 3: PROCESS TABLE - ORIGINAL ISOLATED LOGIC
      // ***********************************************
      if (processTable) {
        // Add a new page for the table
        pdf.addPage();
        
        // Add title to table page with proper spacing
        const tableMargins = 0.5;
        
        // Ensure there's a space between Process and Flow in table title
        let tableTitle = "Process Flow Documentation";
        
        if (options.processName) {
          tableTitle = `Process Flow Documentation: ${options.processName}`;
        }
        
        pdf.setFontSize(16);
        pdf.text(tableTitle, pdfWidth / 2, tableMargins, { align: 'center' });
        
        try {
          // Make the table visible temporarily for capturing
          const originalDisplay = processTable.style.display;
          processTable.style.display = 'block';
          
          // Get device pixel ratio for higher quality rendering
          const pixelRatio = window.devicePixelRatio || 1;
          
          // Capture the table with html2canvas - original high quality settings
          const tableCanvas = await html2canvas(processTable, {
            scale: pixelRatio * 2, // Double the resolution for sharper output
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true
          });
          
          // Reset the display style
          processTable.style.display = originalDisplay;
          
          // Convert the canvas to a data URL with high quality
          const tableDataUrl = tableCanvas.toDataURL('image/png', 1.0);
          
          // Calculate dimensions for the table - original logic
          const tableAvailableWidth = pdfWidth - (2 * tableMargins);
          const tableAvailableHeight = pdfHeight - tableMargins - 0.5 - tableMargins;
          
          const tableAspectRatio = tableCanvas.height / tableCanvas.width;
          const tableImgWidth = tableAvailableWidth;
          const tableImgHeight = tableImgWidth * tableAspectRatio;
          
          // If table is too tall, constrain by height
          const finalTableHeight = Math.min(tableImgHeight, tableAvailableHeight);
          const finalTableWidth = finalTableHeight < tableImgHeight ? 
                                  finalTableHeight / tableAspectRatio : 
                                  tableImgWidth;
          
          // Center the table on the page
          const tableX = tableMargins + (tableAvailableWidth - finalTableWidth) / 2;
          
          // Add the table image
          pdf.addImage(
            tableDataUrl,
            'PNG',
            tableX,
            tableMargins + 0.5, // Position below title
            finalTableWidth,
            finalTableHeight
          );
        } catch (error) {
          console.error('Failed to add process table to PDF:', error);
          // Create error message on table page
          pdf.text("Error adding process table: " + error.message, 
                  pdfWidth / 2, pdfHeight / 2, { align: 'center' });
        }
      }
      
      // Save the PDF
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('Miro PDF Generation Error:', error);
      
      // Create a simple error PDF
      pdf.setFontSize(16);
      pdf.text('Error: ' + error.message, 4.25, 4, { align: 'center' });
      pdf.save(filename);
      throw error;
    }
  }
}

export default MiroPDFExporter;