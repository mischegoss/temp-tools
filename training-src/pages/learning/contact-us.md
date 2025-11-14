---
title: Resolve.io Contact Page
---

import { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot';

<style>
{`
  .loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9fafb;
    z-index: 10;
  }

  .loading-message {
    text-align: center;
  }
`}
</style>

<BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Loading contact page...</div>}>
  {() => <ResolveContactPage />}
</BrowserOnly>

export function ResolveContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple handler to hide the loading spinner when iframe loads
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <> 
      <HideChatbot />   
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          padding: 0,
          margin: 0,
          overflow: 'hidden'
        }}
      >
        {isLoading && (
          <div className="loading-container">
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Loading contact page...</p>
            </div>
          </div>
        )}
        <iframe
          src="https://resolve.io/contact-us"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            display: 'block'
          }}
          title="Resolve.io Contact Page"
          frameBorder="0"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>
    </>
  );
}
