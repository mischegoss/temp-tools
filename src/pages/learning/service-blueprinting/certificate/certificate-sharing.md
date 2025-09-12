---
title: Achievement Unlocked - Service Blueprinting Essentials with Resolve!
description: You have successfully completed the Service Blueprinting Essentials with Resolve course. Here's your certificate!
image: https://tamar-resolve.github.io/certificate-sample/resolve-card.jpg
hide_table_of_contents: true
head:
  - name: og:title
    content: I just learned about Automation with Resolve!
  - name: og:description
    content: Check out what I learned about automation and how it can transform your workflow efficiency.
  - name: og:url
    content: https://tamar-resolve.github.io/certificate-sample/
  - name: og:type
    content: article
  - name: og:site_name
    content: Resolve Learning
  - name: og:image
    content: https://tamar-resolve.github.io/certificate-sample/resolve-card.jpg
  - name: og:image:width
    content: 1200
  - name: og:image:height
    content: 628
  - name: og:image:alt
    content: Resolve Automation Certificate
  - name: twitter:card
    content: summary_large_image
  - name: twitter:title
    content: I just learned about Automation with Resolve!
  - name: twitter:description
    content: Check out what I learned about automation and how it can transform your workflow efficiency.
  - name: twitter:image
    content: https://tamar-resolve.github.io/certificate-sample/resolve-card.jpg
  - httpEquiv: Cache-Control
    content: no-cache, no-store, must-revalidate
  - httpEquiv: Pragma
    content: no-cache
  - httpEquiv: Expires
    content: 0
---

import CertificateGenerator from '@site/src/components/service-blueprinting/CertificateGenerator';
import StylizedHeader from '@site/src/components/service-blueprinting/StylizedHeader';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import BrowserOnly from '@docusaurus/BrowserOnly';

<style>
{`
  .certificate-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }

  .certificate-container h1 {
    color: #1a2e5c;
    margin-bottom: 1.5rem;
  }

  .certificate-container p {
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .form-divider {
    margin: 1.5rem 0;
    border-bottom: 2px solid #0ec0c0;
  }

  .input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid var(--ifm-color-emphasis-300);
    border-radius: 4px;
    font-size: 1rem;
  }

  .input:focus {
    outline: none;
    border-color: #0ec0c0;
    box-shadow: 0 0 0 2px rgba(14, 192, 192, 0.25);
  }

  .button--block {
    display: block;
    width: 100%;
    background-color: #0ec0c0;
  }
  
  .button--block:hover {
    background-color: #0ba8a8;
  }
`}
</style>

<ProtectedRoute>
  <BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading certificate...</div>}>
  {() => {
    return (
      <div>
        <StylizedHeader title="Achievement Unlocked!" />
        <div className="certificate-container">
          <h1>🎉 Congrats! You Unlocked an Achievement 🎉</h1>
          <p>You have successfully completed the Service Blueprinting Essentials course. Here's your certificate:</p>
          <div className="form-divider"></div>
          <CertificateGenerator />
        </div>
      </div>
    );
  }}
  </BrowserOnly>
</ProtectedRoute>

