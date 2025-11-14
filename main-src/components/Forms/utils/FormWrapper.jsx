// src/components/Forms/utils/FormWrapper.js
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';


const FormWrapper = ({ children, formComponent: FormComponent, ...props }) => {
  const { user } = useAuth();
  
  // If a specific form component is provided, render it with props
  if (FormComponent) {
    return <FormComponent {...props} user={user} />;
  }
  
  // Otherwise, render children (typically a form component)
  // This allows for both usage patterns:
  // <FormWrapper formComponent={MyForm} otherProps={...} />
  // or
  // <FormWrapper><MyForm otherProps={...} /></FormWrapper>
  return (
    <>
      {React.Children.map(children, child => {
        // Clone the child element to pass the user prop
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { user });
        }
        return child;
      })}
    </>
  );
};

export default FormWrapper;