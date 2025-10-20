---
title: Explore Orchestration Form
---

import Orchestration from '@site/src/components/Forms/main/Orchestration';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import Navigation from '@site/src/components/service-blueprinting/Navigation';
import BrowserOnly from '@docusaurus/BrowserOnly';

<>
<Navigation />

<BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading page...</div>}>
  {() => (
    <ProtectedRoute>
      <div 
        className="container" 
        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}
      >
        <Orchestration />
      </div>
    </ProtectedRoute>
  )}
</BrowserOnly>
</>