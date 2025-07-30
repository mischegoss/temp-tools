// src/components/Forms/utils/AutoResizeHook

import { useEffect } from 'react';

/**
 * Custom hook that automatically resizes textareas to fit their content
 * @param {Array|Object} dependencies - Dependencies that should trigger a resize when changed
 * @returns {void}
 */
const useAutoResizeTextarea = (dependencies = []) => {
  useEffect(() => {
    // Find all textarea elements in the component
    const textareas = document.querySelectorAll('textarea');
    
    const adjustHeight = (element) => {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    };
    
    // Add resize listeners to each textarea
    textareas.forEach(textarea => {
      textarea.addEventListener('input', () => adjustHeight(textarea));
      
      // Initialize heights when component mounts or dependencies change
      adjustHeight(textarea);
    });
    
    // Clean up event listeners when component unmounts or dependencies change
    return () => {
      textareas.forEach(textarea => {
        textarea.removeEventListener('input', () => adjustHeight(textarea));
      });
    };
  }, Array.isArray(dependencies) ? dependencies : [dependencies]);
};

export default useAutoResizeTextarea;