import React from 'react'
import Link from '@docusaurus/Link'

const CertificatePage = () => {
  // Feature card data
  const featureCards = [
    {
      title: 'Real-World Scenarios',
      description:
        'Applied examples that show how automation works in different business contexts.',
    },
    {
      title: 'Guided Forms',
      description:
        'Interactive worksheets that help you document and assess your processes.',
    },
    {
      title: 'AI Assistance',
      description:
        'Intelligent support to help answer questions and guide your automation journey.',
    },
    {
      title: 'Downloadable Resources',
      description: 'Take-home materials to reference and share with your team.',
    },
  ]

  // Social links
  const socialIcons = [
    {
      url: 'https://resolve.io',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10'></circle>
          <line x1='2' y1='12' x2='22' y2='12'></line>
          <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
        </svg>
      ),
    },
    {
      url: 'https://twitter.com/ResolveSystems',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
        </svg>
      ),
    },
    {
      url: 'https://www.linkedin.com/company/resolvesystems/',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
          <rect x='2' y='9' width='4' height='12'></rect>
          <circle cx='4' cy='4' r='2'></circle>
        </svg>
      ),
    },
    {
      url: 'https://resolve.io/blog',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
          <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
        </svg>
      ),
    },
  ]

  // Takeaways list
  const takeaways = [
    {
      title: 'Understand Your Automation "Why":',
      description:
        'Emphasizes the importance of identifying the business goals driving your automation journey and defining what success looks like for your organization.',
    },
    {
      title: 'Identify Automation Opportunities:',
      description:
        'Focuses on selecting the best initial process to automate. One that delivers quick wins and builds momentum for broader success.',
    },
    {
      title: 'Map Your Processes:',
      description:
        'A step-by-step exercise guiding you in documenting each step of your workflows, ensuring key details are captured for successful automation.',
    },
    {
      title: 'Focus on People and Technology:',
      description:
        'Highlights the need to document your systems, identify technical experts, and prepare your teams for the transition to automated workflows.',
    },
    {
      title: 'Explore Orchestration:',
      description:
        'The true power of automation lies in tying individual automated tasks into seamless end-to-end workflows, transforming how teams work together. This module emphasizes the importance of teamwork in successful automation.',
    },
    {
      title: 'Prepare for Automation Conversations:',
      description:
        'This equips you with the tools to gather important information and establish clear goals for productive discussions with technical teams.',
    },
  ]

  // Component styles using brand variables
  const styles = {
    pageContainer: {
      maxWidth: '1000px',
      width: '80%',
      margin: '0 auto',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    cardContainer: {
      padding: '1.5rem',
      borderRadius: '8px',
      border: '2px solid var(--brand-blue-400)',
      backgroundColor: 'var(--brand-white)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      transition: 'all 0.3s ease-in-out',
    },
    imageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1.5rem',
      marginLeft: '-1.5rem',
      marginRight: '-1.5rem',
      marginTop: '-1.5rem',
    },
    certificateImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    divider: {
      height: '4px',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      margin: '3rem 0',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    paragraph: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black)',
    },
    featuresContainer: {
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      backgroundColor: 'var(--brand-secondary-white)',
      border: '2px solid var(--brand-grey-300)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    featuresHeading: {
      fontSize: '1.6rem',
      marginBottom: '1.2rem',
      color: 'var(--brand-aqua)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
    },
    featureCard: {
      padding: '1.2rem',
      backgroundColor: 'var(--brand-white)',
      borderRadius: '6px',
      border: '2px solid var(--brand-blue)',
      boxShadow: '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
    },
    featureTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: 'var(--brand-black)',
      marginBottom: '0.8rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    featureDescription: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black-700)',
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1.5rem',
      gap: '1.5rem',
    },
    socialIcon: {
      color: 'var(--brand-aqua)',
      transition: 'color 0.3s ease',
    },
    ctaSection: {
      textAlign: 'center',
      margin: '2rem 0',
    },
    ctaButton: {
      display: 'inline-block',
      padding: '16px 32px',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-blue) 100%)',
      color: 'var(--brand-white)',
      textDecoration: 'none',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderRadius: '5px',
      border: '2px solid var(--brand-blue-400)',
      boxShadow:
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    takeawaysList: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      color: 'var(--brand-black)',
    },
  }

  // Improved resize handling with refs
  const featuresGridRef = React.useRef(null)

  React.useEffect(() => {
    const handleResize = () => {
      if (featuresGridRef.current) {
        if (window.innerWidth <= 768) {
          featuresGridRef.current.style.gridTemplateColumns = '1fr'
        } else {
          featuresGridRef.current.style.gridTemplateColumns = 'repeat(2, 1fr)'
        }
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call once to set initial size

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Add hover effects for feature cards and CTA button
  const handleFeatureCardHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.transform = 'translateY(-5px)'
      e.target.style.boxShadow =
        '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
    } else {
      e.target.style.transform = 'translateY(0)'
      e.target.style.boxShadow =
        '0 0 15px rgba(0, 80, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  }

  const handleCtaHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.transform = 'translateY(-2px)'
      e.target.style.boxShadow =
        '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
    } else {
      e.target.style.transform = 'translateY(0)'
      e.target.style.boxShadow =
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  }

  const handleSocialHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.color = 'var(--brand-blue-400)'
    } else {
      e.target.style.color = 'var(--brand-aqua)'
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Introduction Card */}
      <div style={styles.cardContainer}>
        <div style={styles.imageContainer}>
          <img
            src='https://tamar-resolve.github.io/certificate-sample/badge2.png'
            alt='Resolve Automation Certificate'
            style={styles.certificateImage}
          />
        </div>

        <p style={styles.paragraph}>
          I'm excited to share that I just wrapped up the Service Blueprinting
          Essentials course by Resolve Systems!
        </p>

        <p style={styles.paragraph}>
          Too often, automation projects stall because teams aren't sure where
          to start or how to align processes with business goals. This course
          changes that by breaking automation into clear, actionable steps,
          empowering you to take control of your automation projects.
        </p>

        <p style={styles.paragraph}>
          This course is designed to help business teams overcome common
          barriers to automation adoption and simplify automation conversations.
        </p>
      </div>

      <div style={styles.divider}></div>

      {/* Key Takeaways Section */}
      <h1 style={styles.heading}>Key Takeaways from the Course</h1>

      <div style={styles.cardContainer}>
        <ul style={styles.takeawaysList}>
          {takeaways.map((item, index) => (
            <li key={index}>
              <strong>{item.title}</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.divider}></div>

      {/* Course Features Section */}
      <h1 style={styles.heading}>Course Features</h1>

      <div style={styles.featuresContainer}>
        <h3 style={styles.featuresHeading}>What Makes This Course Special</h3>

        <div ref={featuresGridRef} style={styles.featuresGrid}>
          {featureCards.map((feature, index) => (
            <div
              key={index}
              style={styles.featureCard}
              onMouseEnter={e => handleFeatureCardHover(e, true)}
              onMouseLeave={e => handleFeatureCardHover(e, false)}
            >
              <h4 style={styles.featureTitle}>{feature.title}</h4>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Section */}
      <div style={styles.cardContainer}>
        <p style={styles.paragraph}>
          What's the biggest automation challenge your organization is facing?
          Let's discuss and learn from each other!
        </p>

        <p style={styles.paragraph}>
          #ResolveSystems #Automation #Orchestration #ServiceBlueprinting
          #Innovation #ITAutomation
        </p>

        <div style={styles.socialLinks}>
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              style={styles.socialIcon}
              onMouseEnter={e => handleSocialHover(e, true)}
              onMouseLeave={e => handleSocialHover(e, false)}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <Link
          to='/learning/service-blueprinting/'
          className='cta-button'
          style={styles.ctaButton}
          onMouseEnter={e => handleCtaHover(e, true)}
          onMouseLeave={e => handleCtaHover(e, false)}
        >
          Ready to get started?
        </Link>
      </div>

      <div style={styles.divider}></div>
    </div>
  )
}

export default CertificatePage
