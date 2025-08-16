---
title: Understand Your Automation Why Form
---

import Why from '@site/src/components/Forms/main/Why';
import ProtectedRoute from '@site/src/components/service-blueprinting/login/ProtectedRoute';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Navigation from '@site/src/components/service-blueprinting/Navigation';

<>
<Navigation />

<BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading automation goals form...</div>}>
  {() => (
    <ProtectedRoute>
      <div 
        className="container" 
        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}
      >
        <Why />
      </div>
    </ProtectedRoute>
  )}
</BrowserOnly>
</>
