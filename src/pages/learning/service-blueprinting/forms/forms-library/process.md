---
title: Map Your Processes Form
---

import ProcessMapping from '@site/src/components/Forms/main/ProcessMapping';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Navigation from '@site/src/components/service-blueprinting/Navigation';

<>
<Navigation />

<BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading process mapping form...</div>}>
  {() => (
    <ProtectedRoute>
      <div 
        className="container" 
        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}
      >
        <ProcessMapping />
      </div>
    </ProtectedRoute>
  )}
</BrowserOnly>
</>



