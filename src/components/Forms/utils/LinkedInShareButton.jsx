import React from 'react';

const LinkedInShareButton = ({
  // Name to be shared in the title
  name = '',
  // The external URL you want to share
  shareUrl = "https://docs.resolve.io/learning/resources/service-blueprinting/certificate/certificate/",
  // Button text (can be string or JSX)
  buttonText = "Share on LinkedIn",
  // Styling - accepts custom styles
  style = {}
}) => {
  // Create personalized title with the name if provided
  const title = name ? 
    `${name} just completed the Service Blueprinting Essentials course at Resolve!` : 
    "Service Blueprinting Essentials Certification";
  
  // Create personalized description
  const description = name ? 
    `${name} has completed the Service Blueprinting Essentials course and earned a certificate of achievement.` :
    "Learn how to map and automate your processes with this comprehensive course.";
  
  const handleShare = () => {
    // Construct LinkedIn share URL with encoded parameters
    const linkedInShareUrl = `https://www.linkedin.com/shareArticle?` + 
      `mini=true&` + 
      `url=${encodeURIComponent(shareUrl)}&` + 
      `title=${encodeURIComponent(title)}&` + 
      `summary=${encodeURIComponent(description)}&` + 
      `source=${encodeURIComponent(window.location.origin)}`;
    
    // Open LinkedIn sharing dialog
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      linkedInShareUrl,
      "linkedin-share-dialog",
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,directories=0,scrollbars=1`
    );
  };

  // Default button styles
  const defaultStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0077B5', // LinkedIn blue
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'inline-block'
  };

  // Merge default styles with any custom styles passed in
  const buttonStyle = { ...defaultStyle, ...style };

  return (
    <button 
      onClick={handleShare} 
      style={buttonStyle}
    >
      {typeof buttonText === 'string' ? buttonText : buttonText}
    </button>
  );
};

export default LinkedInShareButton;