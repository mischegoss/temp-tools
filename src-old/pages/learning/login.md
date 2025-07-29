---
title: Login
description: Log in to access the Learning Hub
hide_table_of_contents: true
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import LoginComponent from '@site/src/components/service-blueprinting/login/LoginComponent';
import StylizedHeader from '@site/src/components/service-blueprinting/StylizedHeader';
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot';

<style>
{`
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
  
  /* Update existing color variables if needed */
  :root {
    --ifm-color-primary: #0ec0c0;
    --ifm-color-primary-dark: #0ba8a8;
  }
`}
</style>
<HideChatbot/>
<StylizedHeader title="Ready to Begin? Sign In Here" />

<BrowserOnly fallback={<div>Loading login component...</div>}>
  {() => <LoginComponent />}
</BrowserOnly>


