import React from 'react';

const TitleSection = ({ title, subtitle }) => {
  const styles = {
    titleSection: {
      textAlign: 'center',
      marginBottom: '2rem',
      padding: '20px',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    logoContainer: {
      width: '180px',
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    logo: {
      maxWidth: '100%',
      maxHeight: '100%',
      width: 'auto',
      height: 'auto',
      objectFit: 'contain'
    },
    h2: {
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#333'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '1rem'
    },
    dateText: {
      fontSize: '0.9rem',
      color: '#777',
      marginTop: '1rem',
      display: 'none'
    }
  };

  // Format the current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="title-section" style={styles.titleSection} data-pdf-section="title">
      {/* Resolve Logo container with fixed dimensions, but logo maintains proportions */}
      <div className="pdf-only-logo-container" style={styles.logoContainer}>
        <img 
          src="/img/resolve-RGB-transparent.png" 
          alt="Resolve Logo" 
          className="pdf-only-logo" 
          style={styles.logo} 
          loading="eager" 
          data-pdf-image="logo" 
          data-pdf-width="180" 
          data-pdf-height="60" 
        />
      </div>
      <h1 style={styles.h2}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
      <p className="pdf-only-date" style={{...styles.dateText, '@media print': {display: 'block'}}}>
        Created on {formattedDate}
      </p>
    </div>
  );
};

// Default props to ensure backward compatibility
TitleSection.defaultProps = {
  title: "Service Blueprinting Worksheet",
  subtitle: ""
};

export default TitleSection;
