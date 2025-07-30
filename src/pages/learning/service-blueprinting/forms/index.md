---
title: Forms Library
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import Navigation from '@site/src/components/service-blueprinting/Navigation';
import HideChatbot from '@site/src/components/Forms/styles/hide-chatbot';
import StylizedHeader from '@site/src/components/service-blueprinting/StylizedHeader';

<HideChatbot />

<Navigation />

<StylizedHeader title="Welcome to the Forms Library" />

<style>
{`
  .forms-library-container {
    max-width: 2000px !important;
    width: 98% !important;
    padding: 0 1rem !important;
    margin-top: 2rem !important; /* Added spacing under header */
    font-family: 'SeasonMix', system-ui, -apple-system, sans-serif !important;
  }
  
  /* Force remove all gaps from top */
  .main-wrapper {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
  
  /* Target the StylizedHeader specifically */
  [class*="StylizedHeader"],
  [class*="stylizedHeader"],
  .hero-banner,
  .header-banner {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 1.5rem !important;
  }
  
  /* Remove Docusaurus default spacing */
  .theme-doc-markdown,
  .markdown {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
  
  /* Target any container that might have default margins */
  .container,
  .container-fluid {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
  
  /* Override any default page margins */
  article {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
`}
</style>

<div className="forms-library-container" style={{width: '98%', maxWidth: '2000px', margin: '2rem auto 0 auto', padding: '0 1rem', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>
  <BrowserOnly>
    {() => {
      const { useAuth } = require('@site/src/contexts/AuthContext');
      const WelcomeSection = require('@site/src/components/service-blueprinting/WelcomeSection').default;
      const FeatureCards = require('@site/src/components/Forms/utils/FeatureCards').default;
      const SavedFormsDisplay = require('@site/src/components/Forms/utils/SavedFormsDisplay').default;
      
      function FormsDisplay() {
        const { user } = useAuth();
        
        if (!user) {
          return (
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'var(--brand-grey-100)',
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
              border: '2px solid var(--brand-blue-400)',
              boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Please log in to view available forms.</p>
            </div>
          );
        }
        
        return (
          <div style={{width: '100%', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>
            <SavedFormsDisplay />
            
            <div style={{height: '4px', background: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', margin: '3rem 0'}}></div>
            
            <h2 style={{fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Available Form Templates</h2>
            <FeatureCards features={formsList} />
          </div>
        );
      }
      
      return (
        <>
          <WelcomeSection 
            accessMessage="You have full access to all forms in the library."
            guestTitle="Service Blueprinting Forms Library"
            guestMessage="Please login to access all forms."
          />
          
          <div style={{height: '4px', background: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', margin: '3rem 0'}}></div>
          
          <h1 style={{fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Available Forms</h1>
          
          <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>These forms help you document, assess, and prepare your business processes for automation. Each form corresponds to a module in the course and guides you through a specific aspect of the automation journey.</p>
          
          <FormsDisplay />
        </>
      );
    }}
  </BrowserOnly>

  <div style={{height: '4px', background: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', margin: '3rem 0'}}></div>

  <h1 style={{fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Form Highlights</h1>

  <div className="features-container" style={{padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', backgroundColor: 'var(--brand-grey-100)', border: '2px solid var(--brand-blue-400)', boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', width: '100%', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', position: 'relative', overflow: 'hidden'}}>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 10% 20%, rgba(0, 80, 199, 0.05) 0%, transparent 50%)',
      pointerEvents: 'none'
    }}></div>
    <div className="features-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', position: 'relative', zIndex: 2}}>
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'var(--brand-white)', borderRadius: '6px', boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', border: '2px solid var(--brand-blue)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', transition: 'all 0.3s ease-in-out'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: 'var(--brand-black)', marginBottom: '0.8rem', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Interactive Forms</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Engage with dynamic forms that respond to your inputs and help guide your documentation process step by step.</p>
      </div>
      
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'var(--brand-white)', borderRadius: '6px', boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', border: '2px solid var(--brand-blue)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', transition: 'all 0.3s ease-in-out'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: 'var(--brand-black)', marginBottom: '0.8rem', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Guided Assistance</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Clear instructions and helpful prompts throughout each form to ensure you capture all necessary information.</p>
      </div>
      
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'var(--brand-white)', borderRadius: '6px', boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', border: '2px solid var(--brand-blue)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', transition: 'all 0.3s ease-in-out'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: 'var(--brand-black)', marginBottom: '0.8rem', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Downloadable Resources</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Export your completed forms as PDFs to share with your team and stakeholders for collaborative planning.</p>
      </div>
      
      <div className="feature-card" style={{padding: '1.2rem', backgroundColor: 'var(--brand-white)', borderRadius: '6px', boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', border: '2px solid var(--brand-blue)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif', transition: 'all 0.3s ease-in-out'}}>
        <h4 style={{fontSize: '1.3rem', fontWeight: '600', color: 'var(--brand-black)', marginBottom: '0.8rem', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Access Your Saved Forms</h4>
        <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Your saved and downloaded forms are saved so you can access them at any time.</p>
      </div>
    </div>
  </div>

  <div style={{height: '4px', background: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', margin: '3rem 0'}}></div>

  <div style={{padding: '1.5rem', borderRadius: '8px', border: '2px solid var(--brand-blue-400)', backgroundColor: 'var(--brand-white)', boxShadow: '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>
    <p style={{fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--brand-black)', fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif'}}>Have questions? Contact <a href="mailto:training@resolve.io" style={{color: 'var(--brand-aqua)', fontWeight: 'bold', textDecoration: 'none'}}>training@resolve.io</a>.</p>
  </div>
    
  <div style={{display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1.5rem'}}>
    {/* Website Icon */}
    <a href="https://resolve.io" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand-aqua)', transition: 'transform 0.2s ease', display: 'inline-block'}} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    </a>
    
    {/* Twitter/X Icon */}
    <a href="https://twitter.com/ResolveSystems" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand-aqua)', transition: 'transform 0.2s ease', display: 'inline-block'}} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    </a>
    
    {/* LinkedIn Icon */}
    <a href="https://www.linkedin.com/company/resolve-systems/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand-aqua)', transition: 'transform 0.2s ease', display: 'inline-block'}} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    </a>
    
    {/* Blog Icon */}
    <a href="https://resolve.io/blog" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brand-aqua)', transition: 'transform 0.2s ease', display: 'inline-block'}} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    </a>
  </div>
  
  <div style={{height: '4px', background: 'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)', margin: '3rem 0'}}></div>
</div>

export const formsList = [
{
title: 'Understand Your Automation "Why"',
description: 'Document your business goals, current challenges, and what success looks like for your automation initiative.',
link: '/learning/service-blueprinting/forms/forms-library/why',
icon: '🎯'
},
{
title: 'Automation Potential Assessment',
description: 'Evaluate which processes are the best candidates for automation and calculate potential time and cost savings.',
link: '/learning/service-blueprinting/forms/forms-library/automation',
icon: '📊'
},
{
title: 'Process Documentation Worksheet',
description: 'Document each step of your process, including decision points, systems used, and data flows.',
link: '/learning/service-blueprinting/forms/forms-library/process',
icon: '📝'
},
{
title: 'Technical & People Readiness',
description: 'Inventory your systems, document connection points, and assess team readiness for automation.',
link: '/learning/service-blueprinting/forms/forms-library/technical',
icon: '💻'
},
{
title: 'Orchestration Potential',
description: 'Evaluate opportunities to connect multiple processes across teams for end-to-end automation.',
link: '/learning/service-blueprinting/forms/forms-library/orchestration',
icon: '🔄'
},
{
title: 'Automation Conversation Checklist',
description: 'Prepare for successful conversations with technical teams about your automation needs.',
link: '/learning/service-blueprinting/forms/forms-library/conversation',
icon: '🗣️'
}
];
