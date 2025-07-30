export const learningPaths = [
  {
    title: 'Service Blueprinting Learning Path',
    description:
      'A foundational learning path designed for anyone interested in the process of designing automations. Master the essential skills and concepts to prepare for automation, understand its core capabilities, and be prepared for automation discussions.',
    link: '/learning/service-blueprinting/courses',
    icon: '🔰',
    extendedDescription:
      'The Service Blueprinting learning path provides a comprehensive introduction to automation requirements gathering regardless of technical experience. This course provides examples, hands on exercises, downloadable forms, and a certificate of completion.',
    usageInstructions:
      'Upon completion of this course you will be equipped to have automation conversations throughout your organization',
    resourceType: 'module',
    primaryLevel: 'AUTOMATION DESIGN',
    secondaryLevel: '',
    primaryLevelDescription: 'Anyone new to Automation Design',
    prerequisites: '',
    skills: [],
    courses: [
      'Understand Your Automation "Why"',
      'Identify Automation Opportunities',
      'Map Your Processes',
      'Focus on People and Technology',
      'Explore Orchestration',
      'Prepare for Automation Conversations',
    ],
  },
  {
    title: 'Technical Blueprinting',
    description:
      'An intermediate learning path designed for all Resolve users. Master the essential skills needed to design effective technnical blueprints.',
    link: '',
    icon: '🔰',
    extendedDescription:
      'The Technical Learning learning path provides a understanding of the technical aspects of blueprinting.',
    usageInstructions: 'Recommended for all Automation Developers.',
    resourceType: 'module',
    primaryLevel: 'AUTOMATION DESIGN',
    secondaryLevel: '',
    primaryLevelDescription: '',
    prerequisites: '',
    skills: [],
    disabled: true,
    courses: ['Coming Soon'],
  },
  {
    title: 'Automation Essentials',
    description:
      'This learning path will guide you through a product overview using a real world example to create a new automation',
    link: '/learning/automation-essentials/courses',
    icon: '🔰', //Don't change this. It is not shown
    extendedDescription:
      'This learning path will provide you an overview of how to build effective, scalable automations. You’ll learn how to manage data flow with variables, apply control structures, handle errors, and translate requirements into real-world automation logic.',
    usageInstructions: 'Recommended for anyone new to Resolve Actions.',
    resourceType: 'module', //Don't change this
    primaryLevel: 'PRODUCT OVERVIEW', //This changes the bottom of the card
    secondaryLevel: '', //Leave blank if you don't want it shown
    primaryLevelDescription: 'Anyone new to Resolve Actions', //You can update this
    prerequisites: '', //This can be shown or leave blank if you don't want it shown
    skills: [''], //This has been disabled on the cards, if you want them, I have to add them back
    courses: [
      'Translate Business Requirements',
      'Create and Validate Integrations',
      'Create a Workflow',
      'Apply Logic to a Workflow',
      'Schedule and Trigger Automations',
      'Accelerate Development with the Automation Exchange',
    ],
  },
]
