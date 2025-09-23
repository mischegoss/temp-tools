---
title: People and Technology Form
---

import Technical from '@site/src/components/Forms/main/Technical';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Navigation from '@site/src/components/service-blueprinting/Navigation';

<>
<Navigation />

<BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading technical assessment form...</div>}>
  {() => (
    <ProtectedRoute>
      <div 
        className="container" 
        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}
      >
        <Technical />
      </div>
    </ProtectedRoute>
  )}
</BrowserOnly>
</>