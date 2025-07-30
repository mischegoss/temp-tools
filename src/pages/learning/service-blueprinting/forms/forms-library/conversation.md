---
title: Prepare for Automation Conversations Form
---

import Conversation from '@site/src/components/Forms/main/Conversation';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import Navigation from '@site/src/components/service-blueprinting/Navigation';

<>
<Navigation />
  <BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading automation assessment form...</div>}>
    {() => (
      <ProtectedRoute>
        <div 
          className="container" 
          style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}
        >
          <Conversation />
        </div>
      </ProtectedRoute>
    )}
  </BrowserOnly>
</>