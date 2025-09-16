// @site/src/components/ActionVideoLibrary/Data/VideoData.js

export const videoLibrary = [
  // ==========================================
  // INSTRUCTIONAL TEMPLATE EXAMPLE - ACTIONS FEATURED VIDEO
  // ==========================================
  {
    id: 'getting-started-actions',
    title: 'How to Get Started with Workflow Designer',
    description:
      'Master the visual workflow designer in Resolve Actions Express, from building workflows with drag-and-drop activities to implementing flow controls and testing your automations.',
    videoUrl: 'https://www.youtube.com/watch?v=WvqMUsNTBtY',
    videoId: 'WvqMUsNTBtY',
    duration: '7:15',
    level: 'automation-design',
    category: 'Platform Overview',
    tags: ['basics', 'getting-started', 'workflow'],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    thumbnail: 'sample.jpg', // NEW: Custom thumbnail (only one with custom thumbnail)
    product: 'actions',
    featured: true,
    platform: 'youtube',
    template: 'instructional',

    // Instructional template fields
    learningObjectives:
      'Learn to navigate the workflow designer interface, build workflows using drag-and-drop activities, configure integrations, implement logic controls, and test your automations effectively.',
    estimatedTime: '15-20 minutes to complete tutorial',
    tutorialSteps: [
      {
        step: 1,
        title: 'Navigate the Workflow Designer Interface',
        content:
          'Open the workflow designer inside Resolve Actions Express and familiarize yourself with the visual canvas. Use the zoom and map features to navigate through complex workflows and understand how visual activities serve as building blocks for your automation processes.',
      },
      {
        step: 2,
        title: 'Build Your Workflow with Pre-built Activities',
        content:
          'Drag and drop activities from the activity library onto your workflow canvas. Each activity produces output that passes downstream to the next step. Give activities custom names and organize them logically to create a clear automation flow.',
      },
      {
        step: 3,
        title: 'Configure Integrations and Connections',
        content:
          'Set up activity configurations by selecting service instances and leveraging autodiscovery features. For ITSM integrations like ServiceNow, choose from vanilla or custom tables, then select from automatically discovered standard and custom fields, including inherited enums and dropdown values.',
      },
      {
        step: 4,
        title: 'Implement Logic Controls and Decision Making',
        content:
          'Add if-else branches, while loops, and other flow controls to create intelligent automation. Build formulas to evaluate specific output types and direct workflow execution down multiple paths based on conditional logic and decision criteria.',
      },
      {
        step: 5,
        title: 'Test and Debug Your Workflow',
        content:
          'Use the step-by-step execution feature to test your workflow and verify outputs at each activity. Monitor execution paths, debug issues, and ensure your automation works correctly before deploying it to production environments.',
      },
    ],

    // Resources
    documentResources: [
      {
        title: 'Visual Workflow Designer Guide',
        link: '/docs/actions/workflow-designer',
        description: 'Complete guide to building workflows',
        type: 'Documentation',
      },
      {
        title: 'Actions Best Practices',
        link: '/docs/actions/best-practices',
        description: 'Tips for effective automation design',
        type: 'Guide',
      },
    ],
    learningResources: [
      {
        title: 'Actions Fundamentals Course',
        link: '/learning/actions',
        description: 'Complete learning path for Actions',
      },
    ],
  },

  // ==========================================
  // ADDITIONAL VIDEOS (All without custom thumbnails)
  // ==========================================
  {
    id: 'automation-best-practices',
    title: 'Automation Best Practices and Design Patterns',
    description:
      'Learn industry-standard best practices for designing scalable, maintainable automation workflows. Discover proven design patterns and common pitfalls to avoid.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    videoId: 'example2',
    duration: '12:30',
    level: 'intermediate',
    category: 'Best Practices',
    tags: ['best-practices', 'design-patterns', 'advanced'],
    publishDate: '2024-01-10',
    thumbnailUrl: null,
    thumbnail: null, // NEW: No custom thumbnail
    product: 'actions',
    featured: false,
    platform: 'youtube',
    template: 'informational',

    // Informational template fields
    keyConcepts: [
      {
        icon: '🏗️',
        title: 'Modular Design',
        content:
          'Build reusable workflow components that can be combined and scaled across different automation scenarios.',
      },
      {
        icon: '🔄',
        title: 'Error Handling',
        content:
          'Implement robust error handling patterns to ensure automation reliability and proper recovery mechanisms.',
      },
      {
        icon: '📊',
        title: 'Performance Optimization',
        content:
          'Design workflows with performance in mind, including parallel processing and resource management strategies.',
      },
    ],
  },

  {
    id: 'integration-fundamentals',
    title: 'Integration Fundamentals with ServiceNow',
    description:
      'Master the basics of integrating Resolve Actions with ServiceNow ITSM. Learn how to set up connections, handle authentication, and work with different table types.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    videoId: 'example3',
    duration: '15:45',
    level: 'beginner',
    category: 'Integrations',
    tags: ['servicenow', 'integration', 'itsm'],
    publishDate: '2024-01-05',
    thumbnailUrl: null,
    thumbnail: null, // NEW: No custom thumbnail
    product: 'actions',
    featured: false,
    platform: 'youtube',
    template: 'instructional',

    learningObjectives:
      'Understand ServiceNow integration capabilities, set up secure connections, and learn to work with both standard and custom tables effectively.',
    estimatedTime: '25-30 minutes to complete tutorial',
    tutorialSteps: [
      {
        step: 1,
        title: 'Set Up ServiceNow Connection',
        content:
          'Configure your ServiceNow instance connection with proper authentication and security settings.',
      },
      {
        step: 2,
        title: 'Explore Table Discovery',
        content:
          'Use autodiscovery features to identify available tables, fields, and their relationships.',
      },
      {
        step: 3,
        title: 'Work with Standard Tables',
        content:
          'Learn to interact with common ServiceNow tables like Incident, Problem, and Change Request.',
      },
      {
        step: 4,
        title: 'Handle Custom Tables',
        content:
          'Understand how to work with custom tables and fields specific to your ServiceNow implementation.',
      },
    ],
  },

  {
    id: 'troubleshooting-workflows',
    title: 'Troubleshooting Common Workflow Issues',
    description:
      'Learn how to identify, diagnose, and resolve common issues in automation workflows. Discover debugging techniques and monitoring strategies.',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    videoId: 'example4',
    duration: '18:20',
    level: 'intermediate',
    category: 'Troubleshooting',
    tags: ['troubleshooting', 'debugging', 'monitoring'],
    publishDate: '2023-12-28',
    thumbnailUrl: null,
    thumbnail: null, // NEW: No custom thumbnail
    product: 'actions',
    featured: false,
    platform: 'youtube',
    template: 'troubleshooting',

    // Troubleshooting template fields
    commonIssues: [
      {
        issue: 'Activity Timeout Errors',
        solution:
          'Increase timeout values and implement proper retry logic for long-running operations.',
        prevention:
          'Design workflows with appropriate timeouts and parallel processing where possible.',
      },
      {
        issue: 'Connection Failures',
        solution:
          'Verify network connectivity, authentication credentials, and service availability.',
        prevention:
          'Implement connection health checks and fallback mechanisms.',
      },
      {
        issue: 'Data Mapping Issues',
        solution:
          'Review field mappings and data types, ensure proper transformation logic.',
        prevention:
          'Use consistent data validation and transformation patterns.',
      },
    ],

    diagnosticSteps: [
      'Check workflow execution logs for error messages and stack traces',
      'Verify all connection configurations and credentials',
      'Test individual activities in isolation to identify problematic components',
      'Review data inputs and outputs at each workflow step',
      'Monitor system resources and performance metrics',
    ],
  },

  {
    id: 'advanced-formulas',
    title: 'Advanced Formula Building and Logic',
    description:
      'Deep dive into building complex formulas for workflow logic. Learn advanced techniques for data manipulation, conditional processing, and dynamic decision making.',
    videoUrl: 'https://vimeo.com/example5',
    videoId: 'example5',
    duration: '22:15',
    level: 'advanced',
    category: 'Advanced Topics',
    tags: ['formulas', 'logic', 'advanced', 'expressions'],
    publishDate: '2023-12-20',
    thumbnailUrl: null,
    thumbnail: null, // NEW: No custom thumbnail
    product: 'actions',
    featured: false,
    platform: 'vimeo',
    template: 'informational',

    keyConcepts: [
      {
        icon: '🧮',
        title: 'Complex Expressions',
        content:
          'Build sophisticated formulas using mathematical operations, string manipulation, and logical operators.',
      },
      {
        icon: '🔀',
        title: 'Conditional Logic',
        content:
          'Create dynamic decision trees with nested if-else statements and multiple evaluation criteria.',
      },
      {
        icon: '🔄',
        title: 'Data Transformation',
        content:
          'Transform and manipulate data between different formats and structures within your workflows.',
      },
    ],
  },

  {
    id: 'workflow-optimization',
    title: 'Workflow Performance Optimization',
    description:
      'Learn techniques to optimize workflow performance, reduce execution time, and improve resource utilization. Discover parallel processing and caching strategies.',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    videoId: 'example6',
    duration: '16:40',
    level: 'intermediate',
    category: 'Performance',
    tags: ['optimization', 'performance', 'parallel-processing'],
    publishDate: '2023-12-15',
    thumbnailUrl: null,
    thumbnail: null, // NEW: No custom thumbnail
    product: 'actions',
    featured: false,
    platform: 'youtube',
    template: 'informational',

    keyConcepts: [
      {
        icon: '⚡',
        title: 'Parallel Execution',
        content:
          'Design workflows to run multiple activities simultaneously, reducing overall execution time.',
      },
      {
        icon: '💾',
        title: 'Data Caching',
        content:
          'Implement caching strategies to avoid redundant API calls and improve workflow efficiency.',
      },
      {
        icon: '📈',
        title: 'Resource Management',
        content:
          'Monitor and optimize resource usage including memory, CPU, and network bandwidth.',
      },
    ],
  },
]
