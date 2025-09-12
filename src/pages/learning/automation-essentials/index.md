
---
title: Automation Essentials
---

import {Redirect} from '@docusaurus/router';
import {useEffect} from 'react';

export default function RedirectPage() {
  const redirectUrl = "/learning/automation-essentials/courses";
  
  useEffect(() => {
    // This message will show in the console
    console.log(`Redirecting to ${redirectUrl}...`);
  }, []);
  
  return (
    <>
      <p>You will be redirected to <a href={redirectUrl}>{redirectUrl}</a>.</p>
      <p>If you are not automatically redirected, <a href={redirectUrl}>click here</a>.</p>
      <Redirect to={redirectUrl} />
    </>
  );
}