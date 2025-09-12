// @site/src/components/ActionVideoLibrary/Data/VideoData.js

export const videoLibrary = [
  // ==========================================
  // ACTIONS FEATURED VIDEO (Current video)
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
    product: 'actions',
    featured: true,
    platform: 'youtube',
    template: 'instructional', // NEW: Template property
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
        title: 'Test, Document, and Manage Workflow Lifecycle',
        content:
          'Test workflows with input parameters to simulate external triggers like alerts or tickets. Add activity notes for team collaboration, create rich documentation with graphics, apply tags for organization, and use built-in version control to manage changes and rollbacks.',
      },
    ],
  },

  // ==========================================
  // PRO FEATURED VIDEO
  // ==========================================
  {
    id: 'pro-featured-video',
    title: 'Welcome to Resolve Actions Pro',
    description:
      'Get introduced to the enterprise-class IT automation and orchestration platform, including third-party integrations, the Automation Exchange, and flexible development approaches.',
    videoUrl: 'https://www.youtube.com/watch?v=bJL_c08aElQ',
    videoId: 'bJL_c08aElQ',
    duration: '2:25',
    level: 'automation-design',
    category: 'Enterprise Features',
    tags: ['pro', 'enterprise', 'advanced-features'],
    publishDate: '2024-08-15',
    thumbnailUrl: null,
    product: 'pro',
    featured: true,
    platform: 'youtube',
    template: 'instructional', // NEW: Template property
    tutorialSteps: [
      {
        step: 1,
        title: 'Set Up Enterprise IT Automation Platform',
        content:
          'Deploy Resolve Actions Pro in either cloud or on-premise environments to handle enterprise-class IT automation and orchestration. Configure the platform to intercept and process incidents from third-party tools like ServiceNow automatically.',
      },
      {
        step: 2,
        title: 'Build Comprehensive Automation Workflows',
        content:
          'Create automations using drag-and-drop building blocks to handle complex scenarios including server provisioning, user account management, network diagnostics, firewall rule configuration, and database operations. Leverage both simple and advanced automation capabilities.',
      },
      {
        step: 3,
        title: 'Integrate with Enterprise IT Services',
        content:
          'Connect Resolve Actions Pro with your existing IT infrastructure and services. Configure integrations to automatically trigger automations from service requests, incidents, or alerts, enabling hands-off auto-remediation within seconds.',
      },
      {
        step: 4,
        title: 'Leverage the Automation Exchange',
        content:
          'Access pre-built use cases, templates, and automations from the Automation Exchange to accelerate deployment. Download and customize proven automation patterns for common enterprise scenarios and use cases.',
      },
      {
        step: 5,
        title: 'Customize with Low-Code and Custom Code Approaches',
        content:
          'Build runbooks using Action tasks and workflow elements through low-code/no-code methods, or bring your own custom code to create specialized building blocks. Design automations that handle previously non-automatable scenarios using flexible development approaches.',
      },
    ],
  },

  // ==========================================
  // EXPRESS FEATURED VIDEO
  // ==========================================
  {
    id: 'express-featured-video',
    title: 'Resolve Actions Express - Scheduled Script Execution',
    description:
      'Learn to build data-driven workflow templates for automated script execution from GitHub repositories, including scheduling, credential management, and comprehensive reporting.',
    videoUrl: 'https://www.youtube.com/watch?v=6W9AdnRHlzk',
    videoId: '6W9AdnRHlzk',
    duration: '10:03',
    level: 'automation-design',
    category: 'Quick Start',
    tags: ['express', 'incident-resolution', 'workflows'],
    publishDate: '2024-08-10',
    thumbnailUrl: null,
    product: 'express',
    featured: true,
    platform: 'youtube',
    template: 'instructional', // NEW: Template property
    tutorialSteps: [
      {
        step: 1,
        title: 'Configure Data-Driven Workflow Tables',
        content:
          'Set up tables to define which scripts to execute and where they are located. Create a scripts table with columns for location (GitHub), script type (PowerShell, Python), file path, repository owner, and repository name. Build a hosts table listing target machines with comma-separated script IDs to control which scripts run on which hosts.',
      },
      {
        step: 2,
        title: 'Create Scheduled Automation Policies',
        content:
          'Navigate to the Policy Actions page and create new schedules using the plus sign. Configure schedule names, descriptions, and select target workflows. Set up execution logging to specific folders for easy filtering and review. Define cadence options including hourly, daily, weekly, or monthly intervals with custom time ranges.',
      },
      {
        step: 3,
        title: 'Integrate with Credential Management Systems',
        content:
          'Configure secure credential retrieval using built-in integrations with password vaults like Azure Key Vault, CyberArk, HashiCorp, or BeyondTrust. Set up service account authentication for remote host access during script execution, ensuring credentials are retrieved dynamically in real-time.',
      },
      {
        step: 4,
        title: 'Build Dynamic Script Execution Workflows',
        content:
          'Design workflows that loop through host tables, parse data, and execute child workflows with parameters. Configure GitHub integration to retrieve the most up-to-date scripts in real-time. Set up conditional branching for different script types (PowerShell vs Python) and implement remote code execution against target hosts.',
      },
      {
        step: 5,
        title: 'Implement Reporting and Result Management',
        content:
          'Configure automated reporting through email, spreadsheet generation, PDF creation, or database population. Set up execution logging with verbose results and script previews. Design comprehensive reports showing host execution summaries, script counts, types, sources, and detailed execution results for monitoring and compliance.',
      },
    ],
  },

  // ==========================================
  // INSIGHTS FEATURED VIDEO - VIMEO (Updated to Informational Template)
  // ==========================================
  {
    id: 'insights-featured-video',
    title: 'Introduction to Insights',
    description:
      'Learn how to install and set up Resolve Insights on your virtual machines with step-by-step instructions for deployment and configuration.',
    videoUrl: 'https://vimeo.com/1111422908',
    videoId: '1111422908',
    duration: '2:15',
    level: 'integrations',
    category: 'Analytics',
    tags: ['insights', 'analytics', 'reporting'],
    publishDate: '2024-08-12',
    thumbnailUrl: null,
    product: 'insights',
    featured: true,
    platform: 'vimeo',
    template: 'informational', // CHANGED: Now uses informational template
    // For informational template
    keyConcepts: [
      {
        icon: '📊',
        title: 'Real-Time Analytics Dashboard',
        content:
          'Insights provides comprehensive real-time dashboards that visualize your IT infrastructure performance, incident trends, and operational metrics. Monitor key performance indicators and identify bottlenecks across your entire technology stack.',
      },
      {
        icon: '🔍',
        title: 'Advanced Data Correlation',
        content:
          'Powerful correlation engines automatically identify patterns and relationships between different data sources, helping you understand root causes of issues and predict potential problems before they impact your business.',
      },
      {
        icon: '⚡',
        title: 'Automated Report Generation',
        content:
          'Generate scheduled and on-demand reports with customizable templates. Share insights with stakeholders through automated email delivery, dashboard exports, and integration with business intelligence tools.',
      },
      {
        icon: '🎯',
        title: 'Predictive Intelligence',
        content:
          'Machine learning algorithms analyze historical data to predict future trends, capacity needs, and potential failure points. Proactively address issues before they become critical incidents.',
      },
      {
        icon: '🔗',
        title: 'Multi-Source Data Integration',
        content:
          'Seamlessly integrate data from multiple sources including monitoring tools, ITSM platforms, cloud services, and custom applications. Create a unified view of your IT landscape for comprehensive analysis.',
      },
    ],
    // For instructional template (optional - converted from original tutorialSteps)
    tutorialSteps: [
      {
        step: 1,
        title: 'Prepare Virtual Machines for Installation',
        content:
          'Follow the prerequisite checklist to prepare your virtual machines for Insights installation. Ensure all system requirements are met and necessary dependencies are in place before proceeding with the installation process.',
      },
      {
        step: 2,
        title: 'Obtain Verified Installation Files',
        content:
          'Contact your Resolve representative to obtain the latest Insights installation file. All installation files are verified and digitally signed to ensure security and authenticity before deployment.',
      },
      {
        step: 3,
        title: 'Upload and Extract Installation Files',
        content:
          'Upload the installation file to each node in your deployment and extract the contents. Ensure proper file permissions and verify the integrity of extracted files on all target nodes.',
      },
      {
        step: 4,
        title: 'Configure Installation Settings',
        content:
          'Update the configuration file on each node according to the provided installation instructions. Customize settings based on your environment requirements and network topology.',
      },
      {
        step: 5,
        title: 'Execute Installation in Proper Sequence',
        content:
          'Run the installation file on each node following the specified order outlined in the installation guide. Monitor the installation progress and verify successful completion on each node.',
      },
      {
        step: 6,
        title: 'Begin Using Insights',
        content:
          'Once installation is complete across all nodes, start using Insights for analytics and reporting. Verify system functionality and begin configuring your analytics workflows and dashboards.',
      },
    ],
    learningResources: [
      {
        title: 'Insights Analytics Overview',
        description:
          'Complete guide to analytics capabilities and dashboard configuration',
        link: '/docs/insights/analytics-overview',
      },
      {
        title: 'Data Source Configuration',
        description: 'Learn how to connect and configure multiple data sources',
        link: '/docs/insights/data-sources',
      },
      {
        title: 'Report Builder Tutorial',
        description:
          'Step-by-step guide to creating custom reports and dashboards',
        link: '/docs/insights/report-builder',
      },
    ],
    documentResources: [
      {
        title: 'Analytics Quick Reference',
        description:
          'Quick reference guide for common analytics functions and formulas',
        type: 'PDF',
        link: '/downloads/insights-analytics-quick-ref.pdf',
      },
      {
        title: 'Dashboard Templates',
        description: 'Pre-built dashboard templates for common use cases',
        type: 'ZIP',
        link: '/downloads/insights-dashboard-templates.zip',
      },
      {
        title: 'Data Integration Guide',
        description: 'Comprehensive guide to integrating external data sources',
        type: 'PDF',
        link: '/downloads/insights-data-integration-guide.pdf',
      },
    ],
  },

  // ==========================================
  // EXAMPLE VIDEO WITH SIMPLE PREVIEW (Removed 'featured' template)
  // ==========================================
  {
    id: 'example-automation-concepts',
    title: 'Understanding IT Automation Concepts',
    description:
      'Explore the fundamental concepts of IT automation, including key terminology, architectural patterns, and best practices for modern automation platforms.',
    videoUrl: 'https://www.youtube.com/watch?v=example123',
    videoId: 'example123',
    duration: '8:30',
    level: 'integrations',
    category: 'Concepts',
    tags: ['concepts', 'automation', 'fundamentals'],
    publishDate: '2024-09-01',
    thumbnailUrl: null,
    thumbnailFileName: 'automation-concepts-thumb.jpg', // For gallery cards only
    product: 'actions',
    featured: false,
    platform: 'youtube',
    template: 'informational', // CHANGED: Now uses informational template for full page
    // For informational template
    keyConcepts: [
      {
        icon: '🔄',
        title: 'Workflow Orchestration',
        content:
          'The coordination and management of multiple automated tasks and processes. Orchestration ensures that complex multi-step operations execute in the correct sequence, handle dependencies, and manage error conditions effectively.',
      },
      {
        icon: '🔌',
        title: 'API-First Integration',
        content:
          'Modern automation platforms are built around APIs (Application Programming Interfaces) that enable seamless communication between different systems, tools, and services. This approach ensures flexibility and scalability.',
      },
      {
        icon: '⚡',
        title: 'Event-Driven Automation',
        content:
          'Automation that responds to specific triggers or events, such as alerts, incidents, or scheduled times. This reactive approach enables real-time responses to changing conditions in your IT environment.',
      },
    ],
    // For instructional template (not used for this informational video)
    tutorialSteps: null,
    learningObjectives: null,
    estimatedTime: null,
    learningResources: [
      {
        title: 'Automation Best Practices Guide',
        description:
          'Comprehensive guide to automation design patterns and best practices',
        link: '/docs/automation/best-practices',
      },
      {
        title: 'Integration Patterns Library',
        description:
          'Common patterns for integrating automation with enterprise systems',
        link: '/docs/automation/integration-patterns',
      },
    ],
    documentResources: [
      {
        title: 'Automation Glossary',
        description:
          'Comprehensive glossary of automation and orchestration terms',
        type: 'PDF',
        link: '/downloads/automation-glossary.pdf',
      },
    ],
  },

  // ==========================================
  // NEW INSTRUCTIONAL VIDEO EXAMPLE
  // ==========================================
  {
    id: 'workflow-troubleshooting-guide', 
    title: 'Troubleshooting Automation Workflows',
    description:
      'Learn systematic approaches to debugging and troubleshooting automation workflows, from identifying common issues to implementing robust error handling and monitoring.',
    videoUrl: 'https://www.youtube.com/watch?v=troubleshoot456',
    videoId: 'troubleshoot456',
    duration: '12:45',
    level: 'automation-design',
    category: 'Troubleshooting',
    tags: ['debugging', 'troubleshooting', 'error-handling', 'monitoring'],
    publishDate: '2024-09-15',
    thumbnailUrl: null,
    product: 'actions',
    featured: false,
    platform: 'youtube',
    template: 'instructional', // NEW: Instructional template example
    // For instructional template
    learningObjectives:
      'Master systematic debugging techniques and implement robust error handling strategies for automation workflows',
    estimatedTime: '15-20 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Identify Common Workflow Failure Patterns',
        content:
          'Learn to recognize the most common types of workflow failures including timeout errors, authentication failures, data format mismatches, and dependency issues. Use workflow execution logs and error messages to quickly identify the root cause of problems.',
      },
      {
        step: 2,
        title: 'Implement Comprehensive Logging and Monitoring',
        content:
          'Set up detailed logging at each workflow step to capture input parameters, output results, and execution timing. Configure monitoring alerts for failed executions, performance degradation, and resource utilization to proactively identify issues.',
      },
      {
        step: 3,
        title: 'Design Robust Error Handling Strategies',
        content:
          'Build error handling into your workflows using try-catch blocks, retry logic with exponential backoff, and graceful degradation patterns. Create fallback procedures for critical processes and implement circuit breaker patterns for external service calls.',
      },
      {
        step: 4,
        title: 'Use Testing and Validation Techniques',
        content:
          'Implement workflow testing using mock data, sandbox environments, and staged rollouts. Create validation checkpoints throughout your workflows to verify data integrity and process state before proceeding to subsequent steps.',
      },
      {
        step: 5,
        title: 'Establish Incident Response Procedures',
        content:
          'Create documented procedures for responding to workflow failures including escalation paths, rollback procedures, and communication protocols. Maintain runbooks for common issues and establish on-call procedures for critical automation processes.',
      },
      {
        step: 6,
        title: 'Optimize Performance and Prevent Future Issues',
        content:
          'Analyze workflow performance metrics to identify bottlenecks and optimization opportunities. Implement preventive measures based on historical failure patterns and establish regular health checks and maintenance procedures.',
      },
    ],
    // For informational template (not used for this instructional video)
    keyConcepts: null,
    learningResources: [
      {
        title: 'Workflow Debugging Guide',
        description: 'Comprehensive guide to debugging automation workflows',
        link: '/docs/troubleshooting/workflow-debugging',
      },
      {
        title: 'Error Handling Patterns',
        description: 'Common error handling patterns and best practices',
        link: '/docs/troubleshooting/error-handling',
      },
      {
        title: 'Monitoring and Alerting Setup',
        description:
          'How to set up effective monitoring for your automation workflows',
        link: '/docs/troubleshooting/monitoring',
      },
    ],
    documentResources: [
      {
        title: 'Troubleshooting Checklist',
        description:
          'Step-by-step checklist for systematic workflow troubleshooting',
        type: 'PDF',
        link: '/downloads/troubleshooting-checklist.pdf',
      },
      {
        title: 'Common Error Codes Reference',
        description:
          'Reference guide for common automation error codes and solutions',
        type: 'PDF',
        link: '/downloads/error-codes-reference.pdf',
      },
      {
        title: 'Performance Optimization Guide',
        description: 'Best practices for optimizing workflow performance',
        type: 'PDF',
        link: '/downloads/performance-optimization-guide.pdf',
      },
    ],
  },
]
