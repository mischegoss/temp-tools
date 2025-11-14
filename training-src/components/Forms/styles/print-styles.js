// src/components/Forms/styles/print-styles
import React from 'react';

export const PrintStyles = () => (
    <style>
      {`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
  
          .title-section {
            page-break-after: always;
            break-after: always;
            min-height: 50vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
          }
  
          .pdf-only-logo {
            /* No special print styling needed, logo will be visible in both UI and PDF */
          }
  
          .section {
            page-break-inside: auto;
            break-inside: auto;
          }
  
          .section {
            page-break-before: always;
            break-before: always;
          }
  
          .card-header {
            page-break-after: avoid;
            break-after: avoid;
          }
  
          .form-group {
            page-break-inside: avoid;
            break-inside: avoid;
          }
  
          /* Fix for text truncation in PDF */
          textarea, .form-control {
            overflow: visible !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            height: auto !important;
            min-height: unset !important;
          }
          
          /* Display entered text content without overflow constraints */
          .form-control-text-content {
            display: block !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            width: 100% !important;
            padding: 0.75rem 1rem !important;
            font-size: 0.95rem !important;
            color: #1f2937 !important;
            height: auto !important;
            min-height: unset !important;
          }
  
          input::placeholder,
          textarea::placeholder {
            opacity: 0 !important;
          }
  
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
  
          .no-print {
            display: none !important;
          }
  
          /* Keep form labels with their first option */
          .form-label {
            page-break-after: avoid;
            break-after: avoid;
          }
  
          /* Allow radio groups to break across pages naturally */
          .radio-group {
            page-break-inside: auto;
            break-inside: auto;
          }
  
          /* Keep individual radio options together */
          .form-check {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 0.5rem;
          }

          /* Hide all buttons when printing */
          button,
          .btn,
          button.btn,
          .btn-primary,
          .btn-secondary,
          .btn-success,
          .btn-danger,
          .btn-warning,
          .btn-info,
          .btn-light,
          .btn-dark,
          .btn-outline-primary,
          .btn-outline-secondary,
          .btn-outline-success,
          .btn-outline-danger,
          .btn-outline-warning,
          .btn-outline-info,
          .btn-outline-light,
          .btn-outline-dark,
          .btn-lg,
          .btn-sm {
            display: none !important;
          }
          
          /* Target React-Bootstrap Button components */
          [class*="btn-"],
          [class^="btn-"] {
            display: none !important;
          }
          
          /* Make sure any input group add-ons are still visible */
          .input-group-text {
            display: inline-block !important;
            border: 1px solid #ccc !important;
            background: #f8f9fa !important;
          }
        
           /* React Flow specific print styles */
          .react-flow {
            width: 100% !important;
            height: auto !important;
            min-height: 500px !important;
          }

          .react-flow__renderer {
            width: 100% !important;
            height: auto !important;
          }

          .react-flow__edge {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            stroke: #000 !important;
            stroke-width: 2px !important;
          }

          .react-flow__node {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            border: 1px solid #000 !important;
          }

          .react-flow__handle {
            display: none !important;
          }

          .react-flow__controls,
          .react-flow__attribution {
            display: none !important;
          }
        }
      `}
    </style>
  );

export default PrintStyles;
  