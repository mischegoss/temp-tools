// FormControlWithPrintFallback.jsx
import React from 'react';
import { Form } from 'react-bootstrap';
import { styles } from '../styles/styles';

const FormControlWithPrintFallback = ({ value, placeholder, maxLength, ...props }) => (
  <div>
    <Form.Control
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      {...props}
    />
    {/* This hidden div contains the exact content and will be visible only in print view */}
    <div 
      className="form-control-text-content" 
      style={styles.formControlTextContent}
    >
      {value || ''}
    </div>
    {maxLength && (
      <small style={{ color: '#6b7280', display: 'block', marginTop: '0.25rem' }}>
        {value.length}/{maxLength} characters
      </small>
    )}
  </div>
);

export default FormControlWithPrintFallback;