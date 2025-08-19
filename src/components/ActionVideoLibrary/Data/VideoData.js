// @site/src/components/ActionVideoLibrary/Data/VideoData.js

export const videoLibrary = [
  // ==========================================
  // ACTIONS FEATURED VIDEO (Current video)
  // ==========================================
  {
    id: 'getting-started-actions',
    title: 'Getting Started with Actions Platform',
    description:
      'Learn the fundamentals of Resolve Actions and create your first automation workflow.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '15:32',
    level: 'automation-design', // FIXED: Changed from 'Automation Design' to 'automation-design'
    category: 'Platform Overview',
    tags: ['basics', 'getting-started', 'workflow'],
    publishDate: '2024-01-15',
    thumbnailUrl: null, // Will use YouTube auto-generated thumbnail
    product: 'actions', // NEW: Product assignment
    featured: true, // NEW: Featured video for Actions
    tutorialSteps: [
      {
        step: 1,
        title: 'Access the Actions Platform',
        content:
          "Navigate to your Resolve Actions dashboard. If you don't have access yet, contact your system administrator to get the necessary permissions and login credentials.",
      },
      {
        step: 2,
        title: 'Create Your First Project',
        content:
          'Click on "New Project" in the top navigation. Give your project a descriptive name like "My First Automation" and select the appropriate workspace for your organization.',
      },
      {
        step: 3,
        title: 'Design Your Workflow',
        content:
          'Use the drag-and-drop interface to add action blocks to your workflow canvas. Start with a trigger event, then add the actions you want to automate. Connect the blocks by dragging lines between them.',
      },
      {
        step: 4,
        title: 'Configure Action Parameters',
        content:
          'Click on each action block to configure its settings. Fill in the required parameters such as connection details, input values, and output mappings. Use the test feature to validate your configuration.',
      },
      {
        step: 5,
        title: 'Test and Deploy',
        content:
          'Run a test execution of your workflow to ensure it works as expected. Review the execution logs and make any necessary adjustments. Once satisfied, deploy your workflow to production.',
      },
    ],
  },

  // ==========================================
  // PRO FEATURED VIDEO (New)
  // ==========================================
  {
    id: 'pro-featured-video',
    title: 'Resolve Pro Advanced Features',
    description:
      'Discover the advanced capabilities of Resolve Pro for enterprise workflow management and automation.',
    videoUrl: 'https://www.youtube.com/watch?v=bJL_c08aElQ',
    videoId: 'bJL_c08aElQ', // Extracted from your Pro iframe URL
    duration: '18:45',
    level: 'automation-design', // FIXED: Changed from 'Automation Design' to 'automation-design'
    category: 'Enterprise Features',
    tags: ['pro', 'enterprise', 'advanced-features'],
    publishDate: '2024-08-15',
    thumbnailUrl: null,
    product: 'pro', // NEW: Product assignment
    featured: true, // NEW: Featured video for Pro
  },

  // ==========================================
  // EXPRESS FEATURED VIDEO (Updated)
  // ==========================================
  {
    id: 'express-featured-video',
    title: 'Express Quick Start Guide',
    description:
      'Get started with Resolve Express for rapid incident resolution and streamlined workflows.',
    videoUrl: 'https://www.youtube.com/watch?v=6W9AdnRHlzk',
    videoId: '6W9AdnRHlzk', // NEW: Updated Express video ID
    duration: '12:30',
    level: 'automation-design', // FIXED: Changed from 'Authomation Design' to 'automation-design' (also fixed typo)
    category: 'Quick Start',
    tags: ['express', 'incident-resolution', 'workflows'],
    publishDate: '2024-08-10',
    thumbnailUrl: null,
    product: 'express', // NEW: Product assignment
    featured: true, // NEW: Featured video for Express
  },

  // ==========================================
  // INSIGHTS FEATURED VIDEO (New)
  // ==========================================
  {
    id: 'insights-featured-video',
    title: 'Resolve Insights Analytics Deep Dive',
    description:
      'Master advanced analytics and reporting capabilities in Resolve Insights for comprehensive data analysis.',
    videoUrl: 'https://www.youtube.com/watch?v=vkhMGGa5h80',
    videoId: 'vkhMGGa5h80', // Extracted from your Insights URL
    duration: '22:15',
    level: 'integrations', // FIXED: Changed from 'Device Discovery' to 'integrations' (assuming this fits better)
    category: 'Analytics',
    tags: ['insights', 'analytics', 'reporting'],
    publishDate: '2024-08-12',
    thumbnailUrl: null,
    product: 'insights', // NEW: Product assignment
    featured: true, // NEW: Featured video for Insights
  },

  // ==========================================
  // EXISTING ACTIONS VIDEOS (Updated with product field)
  // ==========================================
  {
    id: 'building-complex-workflows',
    title: 'Building Complex Workflows',
    description:
      'Advanced techniques for creating sophisticated automation workflows with conditional logic.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '22:48',
    level: 'automation-design', // FIXED: Changed from 'Automation Design' to 'automation-design'
    category: 'Workflow Development',
    tags: ['workflows', 'conditional-logic', 'advanced'],
    publishDate: '2024-02-10',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured (Actions already has featured video)
    tutorialSteps: [
      {
        step: 1,
        title: 'Plan Your Complex Workflow',
        content:
          'Before building, map out your workflow on paper or a flowchart tool. Identify decision points, parallel processing opportunities, and error handling requirements.',
      },
      {
        step: 2,
        title: 'Implement Conditional Logic',
        content:
          'Use conditional blocks to create decision points in your workflow. Configure if-then-else logic based on data values, API responses, or user inputs to create dynamic automation paths.',
      },
      {
        step: 3,
        title: 'Handle Parallel Processing',
        content:
          'Set up parallel execution branches when you need to perform multiple actions simultaneously. Use synchronization points to wait for all parallel branches to complete before proceeding.',
      },
      {
        step: 4,
        title: 'Implement Error Handling',
        content:
          'Add try-catch blocks and error handling logic to make your workflows resilient. Define fallback actions, retry mechanisms, and notification systems for when things go wrong.',
      },
      {
        step: 5,
        title: 'Test Complex Scenarios',
        content:
          'Thoroughly test your workflow with various input scenarios, including edge cases and error conditions. Use the debugging tools to step through execution and verify each decision point.',
      },
    ],
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration Features',
    description:
      'Learn how to work effectively with your team using Actions collaborative features.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '18:25',
    level: 'rita', // FIXED: Changed from 'RITA' to 'rita'
    category: 'Collaboration',
    tags: ['team', 'collaboration', 'sharing'],
    publishDate: '2024-03-18',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured
    tutorialSteps: [
      {
        step: 1,
        title: 'Set Up Team Workspaces',
        content:
          'Create shared workspaces for your team projects. Configure access permissions and role-based security to ensure team members have appropriate access levels.',
      },
      {
        step: 2,
        title: 'Share Workflows and Templates',
        content:
          'Learn how to share workflows with team members and create reusable templates. Set up approval processes for workflow changes and establish version control practices.',
      },
      {
        step: 3,
        title: 'Implement Review Processes',
        content:
          'Establish code review and workflow review processes within your team. Use commenting and annotation features to provide feedback and track changes.',
      },
      {
        step: 4,
        title: 'Monitor Team Activity',
        content:
          'Use the team dashboard to monitor workflow executions, track performance metrics, and identify collaboration opportunities. Set up team notifications and alerts.',
      },
      {
        step: 5,
        title: 'Knowledge Sharing and Documentation',
        content:
          'Create comprehensive documentation for your workflows using the built-in documentation tools. Set up team wikis, maintain workflow catalogs, and establish standards for naming conventions and code comments to ensure knowledge transfer.',
      },
    ],
  },
  {
    id: 'deployment-strategies',
    title: 'Deployment Strategies',
    description:
      'Best practices for deploying automation workflows to production environments.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '26:38',
    level: 'integrations', // FIXED: Changed from 'Integrations' to 'integrations'
    category: 'Deployment',
    tags: ['deployment', 'production', 'strategies'],
    publishDate: '2024-07-25',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured
  },
  {
    id: 'api-integrations-guide',
    title: 'API Integrations Deep Dive',
    description:
      'Master API integrations and data transformations in your automation workflows.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '31:15',
    level: 'integrations', // FIXED: Changed from 'Integrations' to 'integrations'
    category: 'API Development',
    tags: ['api', 'integrations', 'data-transformation'],
    publishDate: '2024-04-12',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured
  },
  {
    id: 'jarvis-ai-automation',
    title: 'AI-Powered Automation with Jarvis',
    description:
      'Leverage Jarvis AI capabilities to create intelligent, self-adapting automation workflows.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '24:50',
    level: 'jarvis', // FIXED: Changed from 'Jarvis' to 'jarvis'
    category: 'AI Automation',
    tags: ['ai', 'jarvis', 'machine-learning', 'intelligent-automation'],
    publishDate: '2024-05-30',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured
  },
  {
    id: 'workflow-optimization',
    title: 'Workflow Performance Optimization',
    description:
      'Techniques for optimizing workflow performance and reducing execution time.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '19:33',
    level: 'workflows', // FIXED: Changed from 'Automation Development' to 'workflows'
    category: 'Performance',
    tags: ['optimization', 'performance', 'efficiency'],
    publishDate: '2024-06-14',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured
  },
  {
    id: 'automation-design-patterns',
    title: 'Automation Design Patterns',
    description:
      'Learn proven design patterns and best practices for scalable automation solutions.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '28:42',
    level: 'automation-design', // FIXED: Changed from 'Automation Design' to 'automation-design'
    category: 'Design Patterns',
    tags: ['design-patterns', 'architecture', 'scalability'],
    publishDate: '2024-08-08',
    thumbnailUrl: null,
    product: 'actions', // NEW: Product assignment
    featured: false, // NEW: Not featured
  },
]
