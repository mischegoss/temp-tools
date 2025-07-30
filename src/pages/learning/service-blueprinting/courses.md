---
title: Service Blueprinting Catalog
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth } from '@site/src/contexts/AuthContext';
import Navigation from '@site/src/components/service-blueprinting/Navigation';
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot';
import { UserActivityProvider } from '@site/src/contexts/UserActivityContext';
import EnhancedFeatureCards from '@site/src/components/service-blueprinting/EnhancedFeatureCards';
import CompletionTracker from '@site/src/components/service-blueprinting/CompletionTracker';
import WelcomeSection from '@site/src/components/service-blueprinting/WelcomeSection';
import StylizedHeader from '@site/src/components/service-blueprinting/StylizedHeader';

<HideChatbot />

<BrowserOnly fallback={<div>Loading navigation...</div>}>
{() => <Navigation />}
</BrowserOnly>

<StylizedHeader title="Welcome to Service Blueprinting Essentials" />

<div className="blueprinting-container" style={{maxWidth: '2000px', width: '98%', margin: '0 auto', padding: '0 1rem'}}>
  <BrowserOnly fallback={<div>Loading welcome section...</div>}>
    {() => (
      <WelcomeSection 
        accessMessage="You have full access to all course modules and forms."
        guestTitle="Service Blueprinting"
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
          title: 'Module 1: Understand Your Automation "Why"',
          description: 'Discover the business goals driving your automation journey.',
          link: '/learning/service-blueprinting/modules/why',
          icon: '1️⃣'
        },
        {
          title: 'Module 2: Identify Automation Opportunities',
          description: 'Choose the right first process to automate.',
          link: '/learning/service-blueprinting/modules/automation',
          icon: '2️⃣'
        },
        {
          title: 'Module 3: Map Your Processes',
          description: 'Document each step of your workflows.',
          link: '/learning/service-blueprinting/modules/process',
          icon: '3️⃣'
        },
        {
          title: 'Module 4: Focus on People and Technology',
          description: 'Document your systems and technical experts.',
          link: '/learning/service-blueprinting/modules/technical',
          icon: '4️⃣'
        },
        {
          title: 'Module 5: Explore Orchestration',
          description: 'Connect automated tasks into seamless workflows.',
          link: '/learning/service-blueprinting/modules/orchestration',
          icon: '5️⃣'
        }
      ];

      // Don't render the complex components if user is not authenticated
      if (!user) {
        return (
          <div style={{marginBottom: '2rem'}}>
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'var(--brand-grey-100)',
              borderRadius: '8px',
              border: '2px solid var(--brand-blue-400)',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'
            }}>
              <h3 style={{color: 'var(--brand-blue)', marginBottom: '1rem'}}>
                Course Modules Available
              </h3>
              <p style={{color: 'var(--brand-grey-600)', marginBottom: '1rem'}}>
                Please log in to access interactive course modules and track your progress.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                {modules.map((module, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    backgroundColor: 'var(--brand-white)',
                    borderRadius: '6px',
                    border: '1px solid var(--brand-grey-300)',
                    textAlign: 'left'
                  }}>
                    <h4 style={{color: 'var(--brand-blue)', fontSize: '1rem', marginBottom: '0.5rem'}}>
                      {module.title}
                    </h4>
                    <p style={{color: 'var(--brand-grey-600)', fontSize: '0.9rem', margin: 0}}>
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // User is authenticated - wrap everything in UserActivityProvider
      return (
        <UserActivityProvider totalCards={modules.length} courseType="service-blueprinting">
          <div style={{marginBottom: '2rem'}}>
            <EnhancedFeatureCards
              features={modules}
              guestMessage="Please log in to access course modules."
              loggedInAccess={!!user}
            />

            <CompletionTracker totalCards={modules.length} />
          </div>
        </UserActivityProvider>
      );
    }}

  </BrowserOnly>
</div>
