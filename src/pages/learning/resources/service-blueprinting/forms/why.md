---
title: Understand Your Automation Why Form
---

import Why from '@site/src/components/Forms/main/Why';
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot';
import BrowserOnly from '@docusaurus/BrowserOnly';

<>

<HideChatbot />

<BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading automation assessment form...</div>}>
  {() => (
    <div 
      className="container" 
      style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}
    >
      <Why />
    </div>
  )}
</BrowserOnly>
</>