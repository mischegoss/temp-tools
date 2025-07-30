import React from "react";
import { useLocation } from "@docusaurus/router";

const LinkedInShareButton = ({
  // The external URL you want to share
  shareUrl = "https://tamar-resolve.github.io/certificate-sample/",
  // Title for the shared content
  title = "I just completed a great course",
  // Description for the shared content
  description = "Just finished an amazing course! Learned so much, truly transformative. Highly recommend it!",
  // Optional image URL
  imageUrl = "https://tamar-resolve.github.io/certificate-sample/badge.png",
  // Image dimensions for better LinkedIn preview
  imageWidth = 1200,
  imageHeight = 628,
  // Button text
  buttonText = "Share on LinkedIn"
}) => {
  const location = useLocation();
  
  const handleShare = () => {
    // For LinkedIn to use the large image preview, we need to properly construct the URL
    // The key is to include all parameters with proper concatenation
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
    
    // Before opening the share dialog, ensure the meta tags are properly set
    // This is a hack but sometimes helps with LinkedIn scraping
    const metaRefresh = document.createElement('meta');
    metaRefresh.setAttribute('property', 'og:image:width');
    metaRefresh.setAttribute('content', imageWidth.toString());
    document.head.appendChild(metaRefresh);
    
    const metaHeight = document.createElement('meta');
    metaHeight.setAttribute('property', 'og:image:height');
    metaHeight.setAttribute('content', imageHeight.toString());
    document.head.appendChild(metaHeight);
    
    window.open(
      linkedInShareUrl,
      "linkedin-share-dialog",
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,directories=0,scrollbars=1`
    );
    
    // Clean up our dynamically added meta tags after a delay
    setTimeout(() => {
      document.head.removeChild(metaRefresh);
      document.head.removeChild(metaHeight);
    }, 5000);
  };

  return (
    <button onClick={handleShare} style={styles.button}>
      {buttonText}
    </button>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0077B5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  }
};

export default LinkedInShareButton;