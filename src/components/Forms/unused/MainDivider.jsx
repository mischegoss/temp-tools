import React from 'react';

/**
 * MainDivider component - Creates a centered teal-to-blue gradient line
 * matching the style of section header underlines
 * 
 * @param {Object} props Component props
 * @param {Object} props.style Additional style properties to apply (optional)
 * @returns {JSX.Element} MainDivider component
 */
const MainDivider = ({ style = {} }) => {
  // Base styles for the divider
  const baseStyles = {
    width: '80px', // Matches the width of the section header underlines
    height: '3px', // Matches the height of the section header underlines
    margin: '2.5rem auto', // Centers the divider with spacing above and below
    background: 'linear-gradient(to right, rgba(14, 190, 190, 0.3), #0ebebe, rgba(14, 190, 190, 0.3))',
    borderRadius: '1.5px', // Subtle rounded corners
  };
  
  // Merge provided style overrides with base styles
  const mergedStyles = { ...baseStyles, ...style };
  
  return (
    <div className="main-divider" style={mergedStyles}></div>
  );
};

export default MainDivider;
