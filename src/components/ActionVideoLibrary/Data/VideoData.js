// @site/src/components/ActionVideoLibrary/Data/VideoData.js

export const videoLibrary = [
  // ==========================================
  // ACTIONS FEATURED VIDEO
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
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to navigate the workflow designer interface, build workflows using drag-and-drop activities, configure integrations with service instances, implement logic controls and decision-making, and test and document your automation workflows.',
    estimatedTime: '8-10 minutes',
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
    learningResources: [
      {
        title: 'Automation Essentials',
        description:
          'Learn the fundamentals of Resolve Actions and workflow automation design',
        link: '/learning/actions',
      },
    ],
    documentResources: [
      {
        title: 'Actions Documentation',
        description:
          'Complete reference for Actions features, activities, and best practices',
        link: 'https://help.resolve.io/actions/',
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
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to set up the enterprise IT automation platform, build comprehensive automation workflows using drag-and-drop building blocks, integrate with enterprise IT services for automated incident response, and leverage the Automation Exchange for pre-built templates and use cases.',
    estimatedTime: '5-7 minutes',
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
    learningResources: [
      {
        title: 'Actions Pro Training',
        description:
          'Advanced training on Resolve Actions Pro features and enterprise use cases',
        link: '/learning/pro',
      },
      ,
    ],
    documentResources: [
      {
        title: 'Pro Documentation',
        description:
          'Comprehensive documentation for Resolve Actions Pro features and integrations',
        link: 'https://help.resolve.io/pro/',
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
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to configure data-driven workflow tables for script execution, create scheduled automation policies with custom cadence options, integrate with password vault systems for secure credential management, build dynamic workflows for GitHub script execution, and implement comprehensive reporting and result management.',
    estimatedTime: '8-10 minutes',
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
    learningResources: [
      {
        title: 'Express Training Courses',
        description:
          'Essential training on building workflows and automations in Express',
        link: '/learning/express',
      },
    ],
    documentResources: [
      {
        title: 'Express Documentation',
        description:
          'Comprehensive reference for Express features, workflows, and best practices',
        type: 'PDF',
        link: 'https://help.resolve.io/express/',
      },
    ],
  },

  // ==========================================
  // INSIGHTS FEATURED VIDEO - VIMEO
  // ==========================================
  {
    id: 'insights-featured-video',
    title: 'Introduction to Insights',
    description:
      'Learn how to install and set up Resolve Insights on your virtual machines with step-by-step instructions for deployment and configuration.',
    videoUrl: 'https://vimeo.com/1111422908',
    videoId: '1111422908',
    vimeoHash: '4252a9dae6',
    duration: '2:15',
    level: 'integrations',
    category: 'Analytics',
    tags: ['insights', 'analytics', 'reporting'],
    publishDate: '2024-08-12',
    thumbnailUrl: null,
    product: 'insights',
    featured: true,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to prepare virtual machines for Insights installation, obtain and verify installation files from your Resolve representative, upload and extract installation files properly, configure installation settings according to your environment, execute the installation in the correct sequence, and begin using Insights for analytics and reporting.',
    estimatedTime: '5-7 minutes',
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
        title: 'Insights Training',
        description:
          'Comprehensive course on creating dashboards and analytics reports in Insights',
        link: '/learning/insights',
      },
    ],
    documentResources: [
      {
        title: 'Insights Documentation',
        description:
          'Complete reference for Insights features, installation, and best practices',

        link: 'https://help.resolve.io/insights/',
      },
    ],
  },

  // ==========================================
  // SLACK CONFIGURATION VIDEO - VIMEO
  // ==========================================
  {
    id: 'slack-bot-configuration-video',
    title: 'How to Configure Actions for Slack Activities',
    description:
      'Create a Slack bot and integrate your secret keys into Resolve Actions to use Slack activities or develop your own custom Slack integrations.',
    videoUrl: 'https://vimeo.com/1117874513',
    videoId: '1117874513',
    vimeoHash: 'c89516ad14',
    duration: '1:53',
    level: 'beginner',
    category: 'Actions',
    tags: ['slack', 'integrations', 'variables'],
    publishDate: '2025-09-11',
    thumbnailUrl: 'slack-configuration.png',
    product: 'actions',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to create a Slack bot for your workspace, obtain the necessary Slack Signing Secret and oAuth Bot Token, and configure global variables in Actions to enable Slack activities and integrations.',
    estimatedTime: '5-6 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Create a Slack Bot',
        content:
          'Open api.slack.com and create a bot for your workspace. Find and copy the Slack Signing Secret and the oAuth Bot Token.',
      },
      {
        step: 2,
        title: 'Add Global Variables',
        content:
          'In your Actions platform, navigate to Repository > General > Global Variables. Update the SlackBotToken and SlackSigningSecrete with the values from the Slack settings.',
      },
    ],

    documentResources: [
      {
        title: 'Actions Docs on Slack',
        description: 'Guide to using Slack with Actions',
        link: 'https://help.resolve.io/actions/category/slack',
      },
      {
        title: 'Configuring Slack Activities',
        description:
          'Guide for creating and configuring Slack bots for Actions',
        link: 'https://help.resolve.io/actions/Developing-Custom-Activities/Activity-Guides/Slack-Integration/configuring-the-slack-integration/',
      },
    ],
  },
]
