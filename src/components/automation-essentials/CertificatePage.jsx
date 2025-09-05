import React from 'react'
import Link from '@docusaurus/Link'

const CertificatePage = () => {
  // Feature card data
  const featureCards = [
    {
      title: 'Practical Examples',
      description:
        'Easy-to-understand examples showing how automation works in everyday business using Resolve Actions – perfect for beginners.',
    },
    {
      title: 'Guided Learning',
      description:
        'Videos and interactive quizzes make understanding and documenting your processes simple and fun.',
    },
    {
      title: 'AI Help',
      description:
        'Instant support and answers from our AI assistant throughout your automation learning journey.',
    },
    {
      title: 'Automation Basics: Clearly Explained',
      description:
        'Key automation terms clearly explained to help you confidently take your first steps.',
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
      title: 'Translate Business Requirements',
      description:
        "Learn to identify business goals and pain points, understand how automation drives value, and describe the automation development process to create an actionable plan for your organization's automation journey.",
    },
    {
      title: 'Create a Workflow',
      description:
        'Understand the critical first step of translating business requirements into an actionable plan, ensuring alignment across teams on the aims and value of automation for your organization.',
    },
    {
      title: 'Create and Validate Integrations',
      description:
        'Discover how to set up, navigate, create, validate, and monitor integrations within Resolve Actions to connect different systems for seamless data exchange in your automation process.',
    },
    {
      title: 'Apply Logic to a Workflow',
      description:
        'Master incorporating logic into your workflow designs using While Controls and conditional logic, leveraging integration data, and testing to build efficient and adaptable automations.',
    },
    {
      title: 'Schedule and Trigger Automations',
      description:
        'Explore the importance of schedules and triggers in Resolve Actions and learn to configure and implement them to run tasks automatically at specific times or in response to events.',
    },
  ]

  // Component styles
  const styles = {
    pageContainer: {
      maxWidth: '1000px',
      width: '80%',
      margin: '0 auto',
      fontFamily:
        'SeasonMix, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
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
      position: 'relative',
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
      borderTopLeftRadius: '6px',
      borderTopRightRadius: '6px',
    },
    divider: {
      height: '4px',
      background:
        'linear-gradient(to right, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      margin: '3rem 0',
      borderRadius: '2px',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: 'var(--brand-black-700)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: '600',
    },
    paragraph: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    featuresContainer: {
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      backgroundColor: 'var(--brand-grey-100)',
      border: '2px solid var(--brand-grey-300)',
      boxShadow:
        '0 0 10px rgba(0, 102, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05)',
      position: 'relative',
    },
    featuresHeading: {
      fontSize: '1.6rem',
      marginBottom: '1.2rem',
      color: 'var(--brand-aqua)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
      fontWeight: '600',
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
      border: '2px solid var(--brand-black-700)',
      boxShadow: '0 0 15px rgba(13, 22, 55, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
    },
    featureTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: 'var(--brand-black-700)',
      marginBottom: '0.8rem',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    featureDescription: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1.5rem',
      gap: '1.5rem',
    },
    socialIcon: {
      color: 'var(--brand-aqua)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    ctaSection: {
      textAlign: 'center',
      margin: '2rem 0',
    },
    ctaButton: {
      display: 'inline-block',
      padding: '16px 32px',
      background:
        'linear-gradient(to bottom, var(--brand-black) 0%, var(--brand-aqua) 100%)',
      color: 'var(--brand-white)',
      textDecoration: 'none',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderRadius: '5px',
      border: '2px solid var(--brand-aqua)',
      boxShadow:
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
    },
    takeawaysList: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      color: 'var(--brand-black)',
      fontFamily: 'SeasonMix, system-ui, -apple-system, sans-serif',
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

  // Hover effect handlers
  const handleCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-5px)'
      e.currentTarget.style.boxShadow =
        '0 0 20px rgba(0, 102, 255, 0.3), 0 8px 24px rgba(0, 102, 255, 0.2)'
    } else {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow =
        '0 0 15px rgba(0, 102, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  }

  const handleFeatureCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.boxShadow =
        '0 0 20px rgba(13, 22, 55, 0.3), 0 6px 16px rgba(13, 22, 55, 0.2)'
      e.currentTarget.style.borderColor = 'var(--brand-blue-400)'
    } else {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow =
        '0 0 15px rgba(13, 22, 55, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.borderColor = 'var(--brand-black-700)'
    }
  }

  const handleSocialIconHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.color = 'var(--brand-blue-400)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    } else {
      e.currentTarget.style.color = 'var(--brand-aqua)'
      e.currentTarget.style.transform = 'translateY(0)'
    }
  }

  const handleCtaHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.boxShadow =
        '0 0 25px rgba(0, 212, 255, 0.4), 0 8px 24px rgba(0, 212, 255, 0.3)'
    } else {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow =
        '0 0 15px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Introduction Card */}
      <div
        style={styles.cardContainer}
        onMouseEnter={e => handleCardHover(e, true)}
        onMouseLeave={e => handleCardHover(e, false)}
      >
        <div style={styles.imageContainer}>
          <img
            src='https://tamar-resolve.github.io/certificate-sample/automation-essentials-badge.png'
            alt='Resolve Automation Certificate'
            style={styles.certificateImage}
          />
        </div>

        <p style={styles.paragraph}>
          I'm excited to share that I just wrapped up the Automation Essentials
          course by Resolve Systems!
        </p>

        <p style={styles.paragraph}>
          Automation projects can seem daunting, but Automation Essentials
          simplifies the fundamentals, offering a clear pathway to translate
          your business requirements into basic, yet impactful, automation plans
          right from the start.
        </p>

        <p style={styles.paragraph}>
          This course provides business teams with the essential building blocks
          of automation, making it easier to understand and begin exploring how
          automation can streamline their workflows.
        </p>
      </div>

      <div style={styles.divider}></div>

      {/* Key Takeaways Section */}
      <h1 style={styles.heading}>Key Takeaways from the Course</h1>

      <div
        style={styles.cardContainer}
        onMouseEnter={e => handleCardHover(e, true)}
        onMouseLeave={e => handleCardHover(e, false)}
      >
        <ul style={styles.takeawaysList}>
          {takeaways.map((item, index) => (
            <li key={index}>
              <strong style={{ color: 'var(--brand-black-700)' }}>
                {item.title}:
              </strong>{' '}
              {item.description}
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
      <div
        style={styles.cardContainer}
        onMouseEnter={e => handleCardHover(e, true)}
        onMouseLeave={e => handleCardHover(e, false)}
      >
        <p style={styles.paragraph}>
          What's the biggest automation challenge your organization is facing?
          Let's discuss and learn from each other!
        </p>

        <p style={styles.paragraph}>
          #ResolveSystems #Automation #Orchestration #Innovation #ITAutomation
        </p>

        <div style={styles.socialLinks}>
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              style={styles.socialIcon}
              onMouseEnter={e => handleSocialIconHover(e, true)}
              onMouseLeave={e => handleSocialIconHover(e, false)}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <Link
          to='/learning/automation-essentials/'
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
