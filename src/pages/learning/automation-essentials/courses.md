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
        }
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
    <p style={{fontSize: '1.2rem', lineHeight: '1.8'}}>
      Need Help? <a href="mailto:training@resolve.io" style={{color: '#0066cc', textDecoration: 'underline'}}>Contact our training team</a> for personalized support and guidance throughout your automation learning journey.
    </p>
  </div>
</div>