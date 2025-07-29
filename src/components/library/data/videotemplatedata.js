const VideoTemplateData = {
  default: {
    tag: 'AUTOMATION',
    heading: 'Orchestrate Your Automation Workflows',
    description:
      'Seamlessly coordinate tasks, systems, and data with intelligent workflow orchestration that eliminates silos, minimizes manual intervention, and drives efficiency across your entire organization.',
    expandable1: {
      title: 'Workflow Orchestration',
      content:
        'Automate repetitive processes and connect your favorite tools to create seamless workflows. Set up triggers, actions, and conditions to handle routine tasks automatically.',
    },
    expandable2: {
      title: 'Smart Integrations',
      content:
        'Connect over 500+ applications and services with pre-built integrations. From CRM systems to communication tools, create a unified ecosystem that works together.',
    },
    button: {
      text: 'Learn More',
      link: '/trial',
      variant: 'primary',
    },
    videoUrl: 'https://player.vimeo.com/video/1092572502',
  },

  singleExpandable: {
    tag: 'EFFICIENCY',
    heading: 'Maximize Team Productivity',
    description:
      'Discover how automation can help your team focus on high-value work while handling routine tasks automatically.',
    expandable1: {
      title: 'Time Savings',
      content:
        'Reduce manual work by up to 80% with intelligent automation that learns from your patterns and optimizes processes over time.',
    },
    expandable2: null, // This won't show
    button: {
      text: 'Learn More',
      link: '/solutions',
      variant: 'secondary',
    },
    videoUrl: 'https://vimeo.com/76979871',
  },

  advanced: {
    tag: 'INNOVATION',
    heading: 'Next-Generation Automation Platform',
    description:
      'Experience the future of business automation with AI-powered tools that adapt to your unique requirements.',
    expandable1: {
      title: 'AI-Powered Workflows',
      content:
        'Leverage machine learning to create intelligent workflows that adapt and improve automatically based on your business patterns and outcomes.',
    },
    expandable2: {
      title: 'Advanced Analytics',
      content:
        'Get real-time insights into your automation performance with detailed analytics, reporting, and optimization recommendations.',
    },
    button: {
      text: 'Get Started',
      link: '/signup',
      variant: 'outline',
    },
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
}

export default VideoTemplateData
