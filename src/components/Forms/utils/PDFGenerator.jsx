import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

class PDFGenerator {
  /**
   * Generate a PDF from the provided content reference
   * 
   * @param {React.RefObject} contentRef - Reference to the content DOM element
   * @param {String} filename - Name of the PDF file to save
   * @returns {Promise} - Promise that resolves when PDF is generated
   */
  static async generatePDF(contentRef, filename = 'process-mapping-worksheet.pdf') {
    const content = contentRef.current;
    if (!content) {
      throw new Error('Content reference is not available');
    }

    const titleSection = content.querySelector('.title-section');
    const sections = content.getElementsByClassName('section');
    const pdf = new jsPDF({
      orientation: 'p', // portrait
      unit: 'in',
      format: 'letter',
      compress: true,
      compressPdf: true,
      precision: 16 // Higher precision for better quality
    });
    
    try {
      // Before generating PDF, prepare content for printing
      this.prepareForPrinting(content);
      
      // Handle title page
      if (titleSection) {
        await this.addTitlePage(pdf, titleSection);
      }
      
      // Add content sections
      for (const section of Array.from(sections)) {
        // Handle normal section
        pdf.addPage();
        await this.addSectionWithFitting(pdf, section);
      }
      
      // After PDF is generated, reset the content
      this.resetAfterPrinting(content);
      
      // Save the PDF file
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      // Reset content even if there's an error
      this.resetAfterPrinting(content);
      throw error;
    }
  }

  /**
   * Prepare the content for printing
   * 
   * @param {Element} content - The content DOM element
   */
  static prepareForPrinting(content) {
    // Show text content elements
    const textContents = content.querySelectorAll('.form-control-text-content');
    textContents.forEach(el => {
      el.style.display = 'block';
    });

    // Hide all buttons
    const buttons = content.querySelectorAll('button, .btn, input[type="button"], input[type="submit"], input[type="reset"]');
    buttons.forEach(button => {
      // Store original display style for later restoration
      button.setAttribute('data-original-display', button.style.display);
      button.style.display = 'none';
    });

    // Hide any elements with no-print class
    const noPrintElements = content.querySelectorAll('.no-print');
    noPrintElements.forEach(element => {
      element.setAttribute('data-original-display', element.style.display);
      element.style.display = 'none';
    });

    // Hide character count elements
    const charCountElements = this.findCharacterCountElements(content);
    charCountElements.forEach(element => {
      element.setAttribute('data-original-display', element.style.display);
      element.style.display = 'none';
    });
  }

  /**
   * Find elements that appear to contain character count text
   * 
   * @param {Element} content - The content DOM element
   * @returns {Array} - Array of elements that likely contain character counts
   */
  static findCharacterCountElements(content) {
    // Method 1: Find by text content matching pattern (e.g., "0/300 characters")
    const allElements = Array.from(content.querySelectorAll('*'));
    const charCountElements = allElements.filter(el => {
      const text = el.textContent || '';
      return /^\d+\/\d+\s*(characters|chars)?$/.test(text.trim());
    });

    // Method 2: Find by class names commonly used for character counts
    const classNameElements = content.querySelectorAll(
      '.char-count, .character-count, .form-text, .text-muted, .form-text-counter'
    );
    
    // Combine the results
    return [...new Set([...charCountElements, ...Array.from(classNameElements)])];
  }

  /**
   * Reset the content after printing
   * 
   * @param {Element} content - The content DOM element
   */
  static resetAfterPrinting(content) {
    // Hide text content elements
    const textContents = content.querySelectorAll('.form-control-text-content');
    textContents.forEach(el => {
      el.style.display = 'none';
    });

    // Restore button visibility
    const buttons = content.querySelectorAll('button, .btn, input[type="button"], input[type="submit"], input[type="reset"]');
    buttons.forEach(button => {
      const originalDisplay = button.getAttribute('data-original-display');
      if (originalDisplay) {
        button.style.display = originalDisplay;
      } else {
        button.style.display = '';
      }
    });

    // Restore no-print elements
    const noPrintElements = content.querySelectorAll('.no-print');
    noPrintElements.forEach(element => {
      const originalDisplay = element.getAttribute('data-original-display');
      if (originalDisplay) {
        element.style.display = originalDisplay;
      } else {
        element.style.display = '';
      }
    });

    // Restore character count elements
    const charCountElements = this.findCharacterCountElements(content);
    charCountElements.forEach(element => {
      const originalDisplay = element.getAttribute('data-original-display');
      if (originalDisplay) {
        element.style.display = originalDisplay;
      } else {
        element.style.display = '';
      }
    });
  }

  /**
   * Add the title page to the PDF
   * 
   * @param {jsPDF} pdf - The jsPDF instance
   * @param {Element} titleSection - The title section DOM element
   * @returns {Promise} - Promise that resolves when title page is added
   */
  static async addTitlePage(pdf, titleSection) {
    const titleCanvas = await html2canvas(titleSection, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: titleSection.scrollWidth,
      windowHeight: titleSection.scrollHeight
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margins = 0.5;
    const usableWidth = pdfWidth - (2 * margins);
    
    // Calculate dimensions while maintaining aspect ratio
    const titleAspectRatio = titleCanvas.height / titleCanvas.width;
    const titleImgHeight = Math.min(usableWidth * titleAspectRatio, pdfHeight - 2 * margins);
    const titleY = (pdfHeight - titleImgHeight) / 2;
    
    const titleImgData = titleCanvas.toDataURL('image/png');
    pdf.addImage(
      titleImgData,
      'PNG',
      margins,
      titleY,
      usableWidth,
      titleImgHeight
    );
  }

  /**
   * Add a section to the PDF with adaptive scaling if needed to fit on a page
   * 
   * @param {jsPDF} pdf - The jsPDF instance
   * @param {Element} section - The section DOM element
   * @returns {Promise} - Promise that resolves when section is added
   */
  static async addSectionWithFitting(pdf, section) {
    const canvas = await html2canvas(section, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (document) => {
        // Ensure all text is visible in the cloned document
        const clonedTextContents = document.querySelectorAll('.form-control-text-content');
        clonedTextContents.forEach(el => {
          el.style.display = 'block';
        });
        
        // Hide the actual form controls in the clone to avoid duplication
        const formControls = document.querySelectorAll('.form-control');
        formControls.forEach(el => {
          el.style.display = 'none';
        });

        // Hide all buttons in the clone
        const buttons = document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"], input[type="reset"]');
        buttons.forEach(button => {
          button.style.display = 'none';
        });

        // Hide any elements with no-print class
        const noPrintElements = document.querySelectorAll('.no-print');
        noPrintElements.forEach(element => {
          element.style.display = 'none';
        });

        // Hide character count elements
        const allElements = Array.from(document.querySelectorAll('*'));
        const charCountElements = allElements.filter(el => {
          const text = el.textContent || '';
          return /^\d+\/\d+\s*(characters|chars)?$/.test(text.trim());
        });
        
        charCountElements.forEach(element => {
          element.style.display = 'none';
        });

        // Also hide elements with classes commonly used for character counts
        const classCharCountElements = document.querySelectorAll(
          '.char-count, .character-count, .form-text, .text-muted, .form-text-counter'
        );
        classCharCountElements.forEach(element => {
          element.style.display = 'none';
        });

        // Hide placeholders
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.setAttribute('placeholder', '');
        });
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margins = 0.5;
    const usableWidth = pdfWidth - (2 * margins);
    const usableHeight = pdfHeight - (2 * margins);
    
    // Calculate natural dimensions
    const aspectRatio = canvas.height / canvas.width;
    const naturalHeight = usableWidth * aspectRatio;
    
    // Determine if scaling is needed (only scale down, never up)
    if (naturalHeight > usableHeight) {
      // Calculate scale factor to fit height
      const scaleFactor = usableHeight / naturalHeight;
      
      // Apply scaling to width and height
      const scaledWidth = usableWidth * scaleFactor;
      const scaledHeight = usableHeight;
      
      // Center the scaled image horizontally
      const xOffset = margins + (usableWidth - scaledWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, margins, scaledWidth, scaledHeight);
      
      console.log(`Section scaled down to ${(scaleFactor * 100).toFixed(1)}% to fit page`);
    } else {
      // No scaling needed, use natural dimensions
      pdf.addImage(imgData, 'PNG', margins, margins, usableWidth, naturalHeight);
    }
  }

  /**
   * Legacy method for backward compatibility
   * @param {jsPDF} pdf - The jsPDF instance
   * @param {Element} section - The section DOM element
   * @returns {Promise} - Promise that resolves when section is added
   */
  static addSection(pdf, section) {
    return this.addSectionWithFitting(pdf, section);
  }
}

export default PDFGenerator;