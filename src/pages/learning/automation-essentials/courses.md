---
title: Automation Essentials Catalog
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth } from '@site/src/contexts/AuthContext';
import ProspectNavigation from '@site/src/components/automation-essentials/ProspectNavigation';
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot';
import { UserActivityProvider } from '@site/src/contexts/UserActivityContext';
import EnhancedFeatureCards from '@site/src/components/service-blueprinting/EnhancedFeatureCards';
import CompletionTracker from '@site/src/components/automation-essentials/CompletionTracker';
import WelcomeSection from '@site/src/components/service-blueprinting/WelcomeSection';
import StylizedHeader from '@site/src/components/service-blueprinting/StylizedHeader';

<HideChatbot />

<BrowserOnly fallback={<div>Loading navigation...</div>}>
  {() => <ProspectNavigation />}
</BrowserOnly>

<StylizedHeader title="Welcome to Automation Essentials" />

<div className="blueprinting-container" style={{maxWidth: '2000px', width: '98%', margin: '0 auto', padding: '0 1rem'}}>
  <BrowserOnly fallback={<div>Loading welcome section...</div>}>
    {() => (
      <WelcomeSection 
        accessMessage="You have full access to all course modules and forms."
        guestTitle="Automation Essentials"
        guestMessage="Please login to access all course modules."
      />
    )}
  </BrowserOnly>

  <div style={{height: '4px', backgroundColor: '#008080', margin: '3rem 0'}}></div>
  
  <h1 style={{fontSize: '2rem', marginBottom: '1.5rem', color: '#333'}}>Course Modules</h1>
  
  <BrowserOnly>
    {() => {
      const { user } = useAuth();
      const modules = [
        {
          title: 'Module 1: Translate Business Requirements',
          description: 'Learn to identify business goals and pain points and understand how automation drives value',
          link: '/learning/automation-essentials/modules/business-requirements',
          icon: '1️⃣'
        },
        {
          title: 'Module 2: Create and Validate Integrations',
          description: 'Connect different systems for seamless data exchange in your automation process',
          link: '/learning/automation-essentials/modules/integrations',
          icon: '2️⃣'
        },
        {
          title: 'Module 3: Create a Workflow',
          description: 'Use integrations and translate business requirements into an actionable plan',
          link: '/learning/automation-essentials/modules/workflow',
          icon: '3️⃣'
        },
        {
          title: 'Module 4: Apply Logic to Your Workflow',
          description: 'Incorporate logic into your workflow designs',
          link: '/learning/automation-essentials/modules/logic',
          icon: '4️⃣'
        },
        {
          title: 'Module 5: Schedule and Trigger Automations',
          description: 'Run tasks automatically at specific times or in response to events',
          link: '/learning/automation-essentials/modules/schedule',
          icon: '5️⃣'
        },
      
      ];
      
      if (!user) {
        return (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-color-emphasis-100)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p>Please log in to view course modules.</p>
          </div>
        );
      }
      
      return (
        <UserActivityProvider totalCards={modules.length} courseType="automation-essentials">
          <div className="modules-display" style={{width: '100%'}}>
            <EnhancedFeatureCards features={modules} />
            <CompletionTracker totalCards={modules.length} />
          </div>
        </UserActivityProvider>
      );
    }}
  </BrowserOnly>

  <div style={{height: '4px', backgroundColor: '#008080', margin: '3rem 0'}}></div>

  <h1 style={{fontSize: '2rem', marginBottom: '1.5rem', color: '#333'}}>Course Features</h1>

  <div className="features-container" style={{padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', width: '100%'}}>
    <div className="features-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #003366'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '0.8rem'}}>Practical Examples</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>Easy-to-understand examples showing how automation works in everyday business using Resolve Actions – perfect for beginners.</p>
      </div>
      
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #003366'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '0.8rem'}}>Guided Learning</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>Videos and interactive quizzes to check your understanding.</p>
      </div>
      
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #003366'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '0.8rem'}}>AI Help</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>Get instant support and answers from our AI assistant throughout your automation learning journey.</p>
      </div>
      
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #003366'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '0.8rem'}}>Automation Basics: Clearly Explained</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>Key automation terms clearly explained to help you confidently take your first steps.</p>
      </div>
    </div>
  </div>

  <div style={{height: '4px', backgroundColor: '#008080', margin: '3rem 0'}}></div>

 <div style={{padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
    <p style={{fontSize: '1.2rem', lineHeight: '1.8'}}>Need Help? Contact <a href="mailto:training@resolve.io">training@resolve.io</a>.</p>
    
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1.5rem'}}>
      <a href="https://resolve.io" target="_blank" rel="noopener noreferrer" style={{color: '#008080', transition: 'transform 0.2s ease', display: 'inline-block'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </a>
      
      <a href="https://twitter.com/ResolveSystems" target="_blank" rel="noopener noreferrer" style={{color: '#008080', transition: 'transform 0.2s ease', display: 'inline-block'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      </a>
      
      <a href="https://www.linkedin.com/company/resolve-systems/" target="_blank" rel="noopener noreferrer" style={{color: '#008080', transition: 'transform 0.2s ease', display: 'inline-block'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>
      
      <a href="https://resolve.io/blog" target="_blank" rel="noopener noreferrer" style={{color: '#008080', transition: 'transform 0.2s ease', display: 'inline-block'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </a>
    </div>
  </div>
  
  <div style={{height: '4px', backgroundColor: '#008080', margin: '3rem 0'}}></div>
</div>
