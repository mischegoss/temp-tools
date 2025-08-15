// @site/src/components/Actions/Data/VideoLibraryData.js

export const videoLibrary = [
  {
    id: 'getting-started-actions',
    title: 'Getting Started with Actions Platform',
    description:
      'Learn the fundamentals of Resolve Actions and create your first automation workflow.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '15:32',
    level: 'BEGINNER',
    category: 'Platform Overview',
    tags: ['basics', 'getting-started', 'workflow'],
    publishDate: '2024-01-15',
    thumbnailUrl: null, // Will use YouTube auto-generated thumbnail
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
  {
    id: 'building-complex-workflows',
    title: 'Building Complex Workflows',
    description:
      'Advanced techniques for creating sophisticated automation workflows with conditional logic.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '22:48',
    level: 'INTERMEDIATE',
    category: 'Workflow Development',
    tags: ['workflows', 'conditional-logic', 'advanced'],
    publishDate: '2024-02-10',
    thumbnailUrl: null,
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
          'Add conditional branches using If/Else blocks. Configure the conditions based on data values, API responses, or user inputs. Test each branch thoroughly.',
      },
      {
        step: 3,
        title: 'Use Loops and Iterations',
        content:
          'Implement For Each loops to process arrays of data. Set up While loops for conditional iterations. Always include exit conditions to prevent infinite loops.',
      },
      {
        step: 4,
        title: 'Handle Parallel Processing',
        content:
          'Use parallel execution blocks when tasks can run simultaneously. This improves performance but requires careful synchronization of results.',
      },
      {
        step: 5,
        title: 'Implement Error Handling',
        content:
          'Add Try/Catch blocks around potentially failing operations. Configure retry logic, timeout settings, and fallback procedures for robust workflow execution.',
      },
    ],
  },
  {
    id: 'integration-best-practices',
    title: 'Integration Best Practices',
    description:
      'Master the art of connecting Actions with external systems and APIs.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '18:15',
    level: 'BEGINNER',
    category: 'Integrations',
    tags: ['integrations', 'apis', 'connections'],
    publishDate: '2024-03-05',
    thumbnailUrl: null,
    tutorialSteps: [
      {
        step: 1,
        title: 'Understand API Documentation',
        content:
          "Before creating integrations, thoroughly read the target system's API documentation. Note authentication methods, rate limits, data formats, and available endpoints.",
      },
      {
        step: 2,
        title: 'Set Up Authentication',
        content:
          "Configure the appropriate authentication method (API keys, OAuth, basic auth). Store credentials securely using the platform's credential management system.",
      },
      {
        step: 3,
        title: 'Create Connection Templates',
        content:
          'Build reusable connection templates for frequently used systems. Include proper error handling, timeout settings, and retry mechanisms in your templates.',
      },
      {
        step: 4,
        title: 'Test API Endpoints',
        content:
          'Use the built-in API testing tools to verify connectivity and data formats. Test both success and failure scenarios to ensure robust integration.',
      },
      {
        step: 5,
        title: 'Implement Data Mapping',
        content:
          'Map data between your workflow and the external system. Use transformation functions to convert data formats and handle missing or null values appropriately.',
      },
    ],
  },
  {
    id: 'error-handling-debugging',
    title: 'Error Handling and Debugging',
    description:
      'Learn how to troubleshoot workflows and implement robust error handling strategies.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '20:07',
    level: 'INTERMEDIATE',
    category: 'Troubleshooting',
    tags: ['debugging', 'error-handling', 'troubleshooting'],
    publishDate: '2024-03-20',
    thumbnailUrl: null,
    tutorialSteps: [
      {
        step: 1,
        title: 'Understanding Common Error Types',
        content:
          'Familiarize yourself with the most common error types in Actions: connection timeouts, authentication failures, data mapping errors, and API rate limits. Each error type has specific indicators in the execution logs that help identify the root cause.',
      },
      {
        step: 2,
        title: 'Setting Up Error Monitoring',
        content:
          'Configure workflow monitoring by adding logging actions at key points in your workflow. Set up email notifications for critical failures and create dashboards to track error patterns over time.',
      },
      {
        step: 3,
        title: 'Implementing Try-Catch Blocks',
        content:
          'Wrap potentially failing actions in Try-Catch blocks. In the Try section, place your main workflow logic. In the Catch section, define how to handle specific error scenarios - whether to retry, skip, or escalate the error.',
      },
      {
        step: 4,
        title: 'Creating Retry Logic',
        content:
          'Implement exponential backoff retry strategies for transient failures. Configure maximum retry attempts and delay intervals. Use conditional logic to determine which errors should trigger retries versus immediate failure.',
      },
      {
        step: 5,
        title: 'Building Fallback Procedures',
        content:
          'Design alternative execution paths for when primary actions fail. This might include using backup APIs, queuing items for manual processing, or switching to degraded functionality modes.',
      },
      {
        step: 6,
        title: 'Advanced Debugging Techniques',
        content:
          'Use variable inspection tools to examine data state at each workflow step. Implement conditional breakpoints and step-through debugging for complex workflows. Create test scenarios that reproduce specific error conditions.',
      },
    ],
  },
  {
    id: 'automation-design-patterns',
    title: 'Automation Design Patterns',
    description:
      'Explore proven design patterns and architectural approaches for scalable automations.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '28:33',
    level: 'ADVANCED',
    category: 'Architecture',
    tags: ['design-patterns', 'architecture', 'scalability'],
    publishDate: '2024-04-12',
    thumbnailUrl: null,
    tutorialSteps: [
      {
        step: 1,
        title: 'The Modular Workflow Pattern',
        content:
          'Break complex automations into smaller, reusable workflow modules. Each module should have a single responsibility and well-defined inputs/outputs. This approach improves maintainability and enables code reuse across different automations.',
      },
      {
        step: 2,
        title: 'Event-Driven Architecture',
        content:
          'Design workflows that respond to events rather than running on fixed schedules. Set up event listeners for system changes, file uploads, database updates, or API webhooks. This creates more responsive and efficient automations.',
      },
      {
        step: 3,
        title: 'State Machine Patterns',
        content:
          'Implement workflows as state machines for complex business processes. Define clear states (pending, processing, approved, rejected) and valid transitions between states. This ensures data consistency and provides clear audit trails.',
      },
      {
        step: 4,
        title: 'Pipeline Processing Pattern',
        content:
          'Create data processing pipelines that transform data through multiple stages. Each stage validates, enriches, or filters the data before passing it to the next stage. Include quality gates and validation checkpoints throughout the pipeline.',
      },
      {
        step: 5,
        title: 'Circuit Breaker Pattern',
        content:
          'Implement circuit breakers to prevent cascading failures when external services are unavailable. Configure failure thresholds and automatic recovery mechanisms. This protects your workflows from being overwhelmed by failing dependencies.',
      },
      {
        step: 6,
        title: 'Saga Pattern for Long-Running Processes',
        content:
          'For workflows that span multiple systems and may take hours or days to complete, implement the Saga pattern. Break the process into compensatable transactions with rollback capabilities if any step fails.',
      },
      {
        step: 7,
        title: 'Performance Optimization Patterns',
        content:
          'Apply optimization patterns like parallel processing for independent operations, batch processing for bulk operations, and caching for frequently accessed data. Monitor execution times and optimize bottlenecks systematically.',
      },
    ],
  },
  {
    id: 'platform-overview-demo',
    title: 'Platform Overview Demo',
    description:
      'A comprehensive walkthrough of the Actions platform features and capabilities.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '12:45',
    level: 'BEGINNER',
    category: 'Platform Overview',
    tags: ['overview', 'demo', 'features'],
    publishDate: '2024-01-08',
    thumbnailUrl: null,
    tutorialSteps: [
      {
        step: 1,
        title: 'Navigate the Dashboard',
        content:
          'Start by exploring the main dashboard. Locate the key navigation areas: Projects panel on the left, main workspace in the center, and properties panel on the right. Familiarize yourself with the toolbar and menu options.',
      },
      {
        step: 2,
        title: 'Explore the Action Library',
        content:
          'Open the Action Library from the left panel. Browse through different categories like Connectors, Logic, Data Transformation, and Utilities. Use the search function to find specific actions quickly. Notice how actions are organized by system and function type.',
      },
      {
        step: 3,
        title: 'Understanding the Workflow Canvas',
        content:
          'Learn how to use the central workflow canvas. Practice dragging actions from the library onto the canvas. Understand how to connect actions using flow lines and how to arrange your workflow for optimal readability.',
      },
      {
        step: 4,
        title: 'Configure Action Properties',
        content:
          'Click on any action block to open the properties panel. See how each action has different configuration options. Practice setting up a simple HTTP request action by configuring the URL, method, and headers.',
      },
      {
        step: 5,
        title: 'Test and Debug Features',
        content:
          'Discover the testing capabilities built into the platform. Learn how to run individual actions in test mode, view execution results, and use the debugger to step through workflow execution. Practice using breakpoints and variable inspection.',
      },
    ],
  },
  {
    id: 'workflow-optimization',
    title: 'Workflow Optimization Techniques',
    description:
      'Learn advanced techniques to optimize your automation workflows for better performance.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '19:42',
    level: 'INTERMEDIATE',
    category: 'Optimization',
    tags: ['optimization', 'performance', 'efficiency'],
    publishDate: '2024-04-25',
    thumbnailUrl: null,
    tutorialSteps: [
      {
        step: 1,
        title: 'Performance Profiling and Metrics',
        content:
          'Set up comprehensive monitoring for your workflows. Track execution time, memory usage, API call frequency, and error rates. Use the built-in analytics dashboard to identify performance bottlenecks and establish baseline metrics for optimization efforts.',
      },
      {
        step: 2,
        title: 'Parallel Processing Implementation',
        content:
          'Identify operations that can run simultaneously and implement parallel execution branches. Use the Parallel Gateway action to split workflow execution and the Converging Gateway to synchronize results. This dramatically reduces total execution time for independent operations.',
      },
      {
        step: 3,
        title: 'Efficient Data Handling',
        content:
          'Optimize data processing by minimizing data transformations and reducing payload sizes. Use streaming for large datasets instead of loading everything into memory. Implement data filtering early in the workflow to reduce processing overhead downstream.',
      },
      {
        step: 4,
        title: 'Caching Strategies',
        content:
          'Implement intelligent caching for frequently accessed data. Set up temporary storage for API responses, database queries, and computed values. Configure appropriate cache expiration times based on data volatility and business requirements.',
      },
      {
        step: 5,
        title: 'Batch Processing Optimization',
        content:
          'Group similar operations into batches to reduce API overhead. Instead of making individual API calls for each record, accumulate records and process them in bulk. Configure optimal batch sizes based on API limits and memory constraints.',
      },
    ],
  },
  {
    id: 'security-best-practices',
    title: 'Security Best Practices',
    description:
      'Essential security considerations when building and deploying automation workflows.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '16:28',
    level: 'ADVANCED',
    category: 'Security',
    tags: ['security', 'best-practices', 'deployment'],
    publishDate: '2024-05-15',
    thumbnailUrl: null,
  },
  {
    id: 'monitoring-analytics',
    title: 'Monitoring and Analytics',
    description:
      'Set up monitoring and analytics to track the performance of your automation workflows.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '24:16',
    level: 'INTERMEDIATE',
    category: 'Monitoring',
    tags: ['monitoring', 'analytics', 'performance'],
    publishDate: '2024-06-01',
    thumbnailUrl: null,
  },
  {
    id: 'advanced-scripting',
    title: 'Advanced Scripting Techniques',
    description:
      'Master advanced scripting capabilities within the Actions platform for custom solutions.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '31:22',
    level: 'ADVANCED',
    category: 'Scripting',
    tags: ['scripting', 'custom-solutions', 'advanced'],
    publishDate: '2024-06-20',
    thumbnailUrl: null,
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration Features',
    description:
      'Learn how to effectively collaborate with your team using Actions platform features.',
    videoUrl: 'https://www.youtube.com/watch?v=Kb2JXreU4B8',
    videoId: 'Kb2JXreU4B8',
    duration: '14:55',
    level: 'BEGINNER',
    category: 'Collaboration',
    tags: ['collaboration', 'teamwork', 'sharing'],
    publishDate: '2024-07-10',
    thumbnailUrl: null,
    tutorialSteps: [
      {
        step: 1,
        title: 'Setting Up Team Workspaces',
        content:
          "Create dedicated workspaces for different teams or projects. Configure workspace permissions to control who can view, edit, or execute workflows. Set up folder structures that reflect your team's organizational needs and naming conventions.",
      },
      {
        step: 2,
        title: 'Version Control and Branching',
        content:
          'Learn how to use the built-in version control system. Create branches for experimental features, merge changes back to main, and handle conflicts when multiple team members edit the same workflow. Practice creating tags for production releases.',
      },
      {
        step: 3,
        title: 'Collaborative Editing Features',
        content:
          'Use real-time collaboration features to work on workflows simultaneously with team members. See live cursors and changes from other editors. Practice using comments and annotations to communicate design decisions and provide feedback on workflow implementations.',
      },
      {
        step: 4,
        title: 'Code Review and Approval Workflows',
        content:
          'Set up approval processes for workflow deployments. Configure review requirements, assign reviewers based on workflow complexity or business impact, and use the built-in diff viewer to understand changes before approval.',
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
    level: 'ADVANCED',
    category: 'Deployment',
    tags: ['deployment', 'production', 'strategies'],
    publishDate: '2024-07-25',
    thumbnailUrl: null,
  },
]
