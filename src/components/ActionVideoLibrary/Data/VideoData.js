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
    thumbnailUrl: null, // Will use YouTube auto-generated thumbnail
    product: 'actions',
    featured: true,
    platform: 'youtube',
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
  // INSIGHTS FEATURED VIDEO - VIMEO
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
  },
]
