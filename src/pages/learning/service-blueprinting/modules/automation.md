---
title: Identify Your Automation Potential Module 
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import FormNavigation from '@site/src/components/service-blueprinting/Navigation';
import { useAuth } from '@site/src/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

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
  
  .form-nav-container {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1000;
    display: flex;
    gap: 10px;
  }
  
  .form-nav-link {
    padding: 8px 12px;
    background-color: #0ec0c0;
    color: white;
    border-radius: 4px;
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`}
</style>

<BrowserOnly fallback={<div style={{padding: '2rem', textAlign: 'center'}}>Loading automation module...</div>}>
  {() => <AutomationContent />}
</BrowserOnly>

export function AutomationContent() {
  return (
    <ProtectedRoute>
      <ModuleContent />
    </ProtectedRoute>
  );
}

export function ModuleContent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple handler to hide the loading spinner when iframe loads
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <>
      <FormNavigation />
      
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
              <p>Loading module content...</p>
            </div>
          </div>
        )}
        <iframe
          src="https://resolve-io.github.io/service-blueprinting-automation/#/"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            display: 'block'
          }}
          title="Automation Potential Assessment"
          frameBorder="0"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>
    </>
  );
}
