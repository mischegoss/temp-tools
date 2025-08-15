export const learningHubData = {
  title: 'Welcome to the Resolve Learning Hub',
  subtitle: "Ready to unlock your organization's automation potential?",
  description:
    'The Resolve Learning Hub offers practical courses designed to empower you with the skills and knowledge you need to streamline processes and boost automation. If you are new to Automation and looking for design guidance, or want to get hands on experience with one of our tools, the Learning Hub has a course for you.',

  categories: [
    {
      name: 'Automation Design',
      courses: [
        {
          title: 'Service Blueprinting Essentials',
          description:
            'Learn how to document, assess, and prepare your business processes for automation through service blueprinting.',
          available: true,
          link: '/learning/service-blueprinting/courses/',
        },
        {
          title: 'Technical Blueprinting',
          description:
            'Discover the detailed technical requirements of automation and how to implement automated workflows in your organization.',
          available: false,
          link: '/learning/technical-blueprinting',
        },
      ],
    },
    {
      name: 'Automation Development',
      courses: [
        {
          title: 'Resolve Actions Platform',
          description:
            'Our newest drag-and-drop, no-code IT process automation platform.',
          available: true,
          link: '/learning/actions',
        },
        {
          title: 'Resolve Actions Pro',
          description:
            'Tailor-made IT automation with powerful code-based features.',
          available: true,
          link: '/learning/pro',
        },
        {
          title: 'Resolve Actions Express',
          description:
            'Drag-and-drop, no-code IT automation with a large built-in library of automation actions.',
          available: true,
          link: '/learning/express',
        },
      ],
    },
    {
      name: 'Device Discovery and Management',
      courses: [
        {
          title: 'Resolve Insights',
          description: 'Our Discovery and Dependency Mapping (DDM) product.',
          available: true,
          link: '/learning/insights',
        },
      ],
    },
  ],

  helpSection: {
    title: 'Need Help Getting Started?',
    description:
      'Our training team is ready to assist you on your learning journey. Contact us at',
    email: 'training@resolve.io',
    additionalText:
      'or schedule a personalized onboarding session to discuss your specific training needs.',
  },
}
