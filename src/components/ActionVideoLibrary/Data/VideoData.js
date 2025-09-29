// @site/src/components/ActionVideoLibrary/Data/VideoData.js

export const videoLibrary = [
  // ==========================================
  // ACTIONS FEATURED VIDEO (Platform)
  // ==========================================
  {
    id: 'getting-started-actions',
    title: 'How to Get Started with Workflow Designer',
    description:
      'Master the visual workflow designer in Resolve Actions Express, from building workflows with drag-and-drop activities to implementing flow controls and testing your automations.',
    videoUrl: 'https://www.youtube.com/watch?v=WvqMUsNTBtY',
    videoId: 'WvqMUsNTBtY',
    duration: '7:15',
    level: 'step-by-step',
    category: 'Platform Overview',
    section: 'Getting Started',
    sectionOrder: 4,
    tags: ['basics', 'getting-started', 'workflow'],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
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
  // PRO FEATURED VIDEO (Automation Design)
  // ==========================================
  {
    id: 'pro-featured-video',
    title: 'Welcome to Resolve Actions Pro',
    description:
      'Get introduced to the enterprise-class IT automation and orchestration platform, including third-party integrations, the Automation Exchange, and flexible development approaches.',
    videoUrl: 'https://www.youtube.com/watch?v=bJL_c08aElQ',
    videoId: 'bJL_c08aElQ',
    duration: '2:25',
    level: 'quick-start',
    category: 'Enterprise Features',
    section: 'Automation Design',
    sectionOrder: 4,
    tags: ['pro', 'enterprise', 'advanced-features'],
    publishDate: '2024-08-15',
    thumbnailUrl: null,
    product: 'pro',
    productCategory: 'automation-design',
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
  // EXPRESS FEATURED VIDEO (Automation Design)
  // ==========================================
  {
    id: 'express-featured-video',
    title: 'Resolve Actions Express - Scheduled Script Execution',
    description:
      'Learn to build data-driven workflow templates for automated script execution from GitHub repositories, including scheduling, credential management, and comprehensive reporting.',
    videoUrl: 'https://www.youtube.com/watch?v=6W9AdnRHlzk',
    videoId: '6W9AdnRHlzk',
    duration: '10:03',
    level: 'deep-dive',
    category: 'Quick Start',
    section: 'Automation Design',
    sectionOrder: 4,
    tags: ['express', 'incident-resolution', 'workflows'],
    publishDate: '2024-08-10',
    thumbnailUrl: null,
    product: 'express',
    productCategory: 'automation-design',
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
  // INSIGHTS FEATURED VIDEO (Device Discovery)
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
    level: 'quick-start',
    category: 'Analytics',
    section: 'Integrations',
    sectionOrder: 2,
    tags: ['insights', 'analytics', 'reporting'],
    publishDate: '2024-08-12',
    thumbnailUrl: null,
    product: 'insights',
    productCategory: 'device-discovery',
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
  // SLACK CONFIGURATION VIDEO (Platform)
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
    level: 'quick-start',
    category: 'Actions',
    section: 'Getting Started',
    sectionOrder: 1,
    tags: ['slack', 'integrations', 'variables'],
    publishDate: '2025-09-11',
    thumbnailUrl: 'slack-configuration.png',
    product: 'actions',
    productCategory: 'platform',
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

  {
    id: 'create-new-integration',
    title: 'Create a New Integration',
    description:
      'Learn how to create your first integration in Resolve Actions, from navigating the configuration section to setting up Office 365 email connections with OAuth authentication and testing your connection parameters.',
    videoUrl: 'https://player.vimeo.com/video/1107855773',
    videoId: '1107855773',
    vimeoHash: '35842daa82',
    duration: '4:17',
    level: 'step-by-step',
    category: 'Platform Overview',
    section: 'Getting Started',
    sectionOrder: 2,
    tags: [
      'integrations',
      'office-365',
      'oauth',
      'email',
      'configuration',
      'basics',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: true,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to navigate to the integrations section in Resolve Actions, create a new integration with proper naming and configuration, select the appropriate integration type from the available options, configure OAuth connection parameters for Office 365 email, and test and validate your integration connection successfully.',
    estimatedTime: '5-6 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Navigate to Integrations Section',
        content:
          'Log into Resolve Actions and navigate to the top left menu. Access the Configuration section and select Modules to view your current integrations. Click the plus icon on the far right to create a new integration.',
      },
      {
        step: 2,
        title: 'Configure Integration Details',
        content:
          'Provide a descriptive name for your integration (e.g., "Office 365 Mail Monitor") and add a clear description of its purpose, such as "monitors mailbox for new emails." This helps with organization and future reference.',
      },
      {
        step: 3,
        title: 'Select Integration Type',
        content:
          'Browse through the extensive list of available integration types or use the search functionality to quickly find what you need. Select the appropriate type (e.g., Email Office 365) that matches your integration requirements.',
      },
      {
        step: 4,
        title: 'Save and Configure Connection Parameters',
        content:
          'Save your integration first to enable the connection parameters section. Once saved, you can configure the OAuth connection settings and input the required parameters like client ID, secret key, and other authentication details provided by your IT department.',
      },
      {
        step: 5,
        title: 'Test and Validate Connection',
        content:
          'Use the test connection button to validate your configuration. If the test fails, review and correct any incorrect parameters (such as secret keys). A successful connection will show a green checkbox, confirming your integration is properly configured and ready to use.',
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

  {
    id: 'add-while-control',
    title: 'Add a While Control',
    description:
      'Learn how to add while controls to your Resolve Actions workflows to create loops that repeat activities based on dynamic conditions, including setting counters with variables and implementing conditional logic.',
    videoUrl: 'https://player.vimeo.com/video/1107857412',
    videoId: '1107857412',
    vimeoHash: '4317058fc5',
    duration: '1:53',
    level: 'quick-start',
    category: 'Workflow Design',
    section: 'Flow Controls',
    sectionOrder: 3,
    tags: [
      'while-control',
      'loops',
      'flow-control',
      'variables',
      'conditional-logic',
      'workflow-design',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to add while controls to workflows using the plus sign or drag-and-drop methods, configure descriptive names for loop controls, set up counter conditions using static numbers or dynamic variables, use activity results as loop counters for flexible automation, and implement while controls that repeat based on table row counts or other dynamic data.',
    estimatedTime: '3-4 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Add While Control to Workflow',
        content:
          'Click the plus sign below the last activity in your workflow, then type "while" in the search box and select the while control from the dropdown. Alternatively, you can drag and drop the while control from the left menu directly onto your workflow canvas.',
      },
      {
        step: 2,
        title: 'Rename Control with Descriptive Name',
        content:
          'Give your while control a descriptive name that explains its purpose, such as "While Current Date Cert Date" to indicate it will loop through security certificate expiration comparisons. This helps with workflow documentation and team understanding.',
      },
      {
        step: 3,
        title: 'Configure Counter Settings',
        content:
          'Access the while control settings to configure the counter condition. The while control will continue running as long as the counter is greater than zero. You can enter a static number (e.g., "3" to loop three times) or use dynamic variables for more flexible automation.',
      },
      {
        step: 4,
        title: 'Use Variables for Dynamic Loop Counting',
        content:
          'Instead of hardcoding numbers, use variables from previous activities to make your while control more flexible. Navigate to Activity Results and select the variable that contains your desired loop count, such as a row count from a table query.',
      },
      {
        step: 5,
        title: 'Implement and Save Loop Configuration',
        content:
          'Paste the selected variable into the counter field to dynamically set how many times the loop will repeat based on real data, such as the number of rows in a table. Save your configuration to complete the while control setup and enable dynamic looping behavior.',
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

  {
    id: 'if-else-controls',
    title: 'If-Else Controls',
    description:
      'Learn how to implement conditional logic in your Resolve Actions workflows using if-else controls to make decisions based on activity results, create multiple execution paths, and build intelligent automation that responds to real-time data.',
    videoUrl: 'https://player.vimeo.com/video/1107857354',
    videoId: '1107857354',
    vimeoHash: '1acb8b9352',
    duration: '2:38',
    level: 'quick-start',
    category: 'Workflow Design',
    section: 'Flow Controls',
    sectionOrder: 4,
    tags: [
      'if-else',
      'conditional-logic',
      'branching',
      'decision-making',
      'flow-control',
      'workflow-design',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to understand how if-else controls enable decision-making in workflows, use activity results to trigger conditional branches, configure if branches with specific conditions and else branches as default paths, implement multiple if branches with fallback logic, and create intelligent automation that responds to real-time data like server ping results and system status checks.',
    estimatedTime: '4-5 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Understand Activity Results for Decision Making',
        content:
          'Learn how activity results serve as the foundation for conditional logic. For example, a ping activity sends packets to check server status and returns either "success" if the server responds or "failure" if it doesn\'t respond, providing the data needed for if-else decisions.',
      },
      {
        step: 2,
        title: 'Add If-Else Control to Interpret Results',
        content:
          'Place an if-else control after activities that generate results you want to evaluate. The if-else control interprets these activity results and determines which branch of your workflow should execute next based on the conditions you configure.',
      },
      {
        step: 3,
        title: 'Configure If Branch with Specific Conditions',
        content:
          'Set up the IF branch to execute only when specified conditions are met through branch settings configuration. For example, if a server ping fails, the IF branch could trigger an email alert to the IT team about the server issue.',
      },
      {
        step: 4,
        title: 'Set Up Else Branch as Default Path',
        content:
          "Configure the ELSE branch as the default execution path when IF branch conditions are not met. The else branch typically doesn't require specific condition settings and serves as the fallback option, which can be empty if no action is needed.",
      },
      {
        step: 5,
        title: 'Implement Multiple Branches and Complex Logic',
        content:
          'Create workflows with multiple IF branches for complex decision trees. Only when none of the IF branches can be activated does the ELSE branch execute, allowing for sophisticated automation that handles various scenarios and conditions based on real-time workflow data.',
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

  {
    id: 'create-new-workflow',
    title: 'Create a New Workflow',
    description:
      'Learn how to create your first workflow in Resolve Actions, from accessing the workflow designer to setting up proper naming conventions, folders, descriptions, and tags for effective workflow organization and management.',
    videoUrl: 'https://player.vimeo.com/video/1107856598',
    videoId: '1107856598',
    vimeoHash: '14cd11b045',
    duration: '2:37',
    level: 'quick-start',
    category: 'Platform Overview',
    section: 'Building Your Workflow',
    sectionOrder: 1,
    tags: [
      'workflow-creation',
      'workflow-designer',
      'naming-convention',
      'folders',
      'tags',
      'basics',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to access the workflow designer from the Actions live dashboard, establish proper naming conventions for workflow organization, configure workflow folders and descriptions for long-term management, apply tags effectively using both default and custom options, and create your first workflow ready for development on the designer canvas.',
    estimatedTime: '4-5 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Access the Workflow Designer',
        content:
          'From the Resolve Actions live dashboard, click the menu in the top left corner and navigate to the Builders section. Select "Workflow Designer" to access the visual workflow creation interface where you\'ll see the welcome screen for first-time users.',
      },
      {
        step: 2,
        title: 'Establish Naming Conventions',
        content:
          'Create a clear workflow name following organizational naming conventions to ensure consistency across multiple workflows. Good naming practices help with long-term workflow management, making it easier for team members to find and understand what each workflow accomplishes.',
      },
      {
        step: 3,
        title: 'Configure Folders and Organization',
        content:
          'Select or create appropriate folders to organize your workflows effectively. Use the default workflows folder initially, but plan for custom folder structures as your automation library grows. Proper foldering helps with workflow categorization and team access management.',
      },
      {
        step: 4,
        title: 'Add Detailed Descriptions',
        content:
          'Provide verbose, detailed descriptions that explain exactly what the workflow does, its purpose, and key functionality. These descriptions become invaluable for future reference, helping you and your team remember workflow purposes and making maintenance easier over time.',
      },
      {
        step: 5,
        title: 'Apply Tags for Categorization',
        content:
          'Use both default and custom tags to categorize workflows effectively. Review available default tags before creating new ones to maintain consistency. Tags like "email" and "exchange" help with workflow discovery and filtering, supporting organizational tagging conventions.',
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

  {
    id: 'apply-workflow-variables',
    title: 'Apply Workflow Variables',
    description:
      'Master the use of variables in Resolve Actions workflows to pass data between activities, capture integration data, connect parent and child workflows, and create dynamic automations that respond to changing data rather than static values.',
    videoUrl: 'https://player.vimeo.com/video/1107856718',
    videoId: '1107856718',
    vimeoHash: '165b9cfa52',
    duration: '4:54',
    level: 'step-by-step',
    category: 'Workflow Design',
    section: 'Variables and Data',
    sectionOrder: 5,
    tags: [
      'variables',
      'data-flow',
      'workflow-activities',
      'integration-data',
      'dynamic-automation',
      'variable-manager',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to understand the importance of variables for dynamic workflow design, access and use the variable menu through the percent (%) operator, differentiate between activity variables, global variables, and module variables, utilize the Variable Manager for easy variable browsing and copying, and create flexible workflows that adapt to changing data instead of using hardcoded static values.',
    estimatedTime: '6-7 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Understand Variable Importance in Workflows',
        content:
          'Learn how variables enable dynamic workflow design by allowing data to pass between activities, capturing data from integrations, connecting parent and child workflows, and manipulating system values. Variables transform static workflows into flexible, responsive automations.',
      },
      {
        step: 2,
        title: 'Access Variables Using the Percent Operator',
        content:
          'In any activity field (like email "To" field), type the percent symbol (%) to open the variable menu. This menu provides access to activities (other workflow activities), global variables (system-wide values), and modules (integration-specific variables).',
      },
      {
        step: 3,
        title: 'Navigate Variable Categories and Sources',
        content:
          'Explore the three main variable categories: Activities (variables from other workflow activities like LDAP queries), Global (system-wide variables available across all workflows), and Modules (integration-specific variables from connected systems and services).',
      },
      {
        step: 4,
        title: 'Use the Variable Manager for Easy Access',
        content:
          'Utilize the Variable Manager panel on the left side of the workflow designer to browse available variables without memorizing names. Click any variable to copy it, then paste directly into activity fields using right-click paste or keyboard shortcuts.',
      },
      {
        step: 5,
        title: 'Create Dynamic Workflows with Variable Data',
        content:
          'Replace static values with variables to create responsive workflows. For example, use email source variables to reply to original senders, or combine static text with dynamic variables (like "RE: %Global.Subject%") to create contextual responses that adapt to incoming data.',
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

  {
    id: 'configure-workflow-activities',
    title: 'Configure Workflow Activities',
    description:
      'Learn how to access and configure activity settings in Resolve Actions workflows, understanding how different activities require specific parameters and how to use these configurations to define workflow requirements and integration needs.',
    videoUrl: 'https://player.vimeo.com/video/1107856706',
    videoId: '1107856706',
    vimeoHash: '11744c3869',
    duration: '2:21',
    level: 'quick-start',
    category: 'Support and Troubleshooting',
    section: 'Activity Configuration',
    sectionOrder: 6,
    tags: [
      'activity-configuration',
      'settings',
      'third-party-integration',
      'workflow-requirements',
      'parameters',
      'ldap',
      'email',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to access activity settings through the settings icon in the top right corner, understand that each activity has unique configuration requirements, explore activity configurations to identify required information from third-party systems, use activity settings to define workflow requirements before full implementation, and navigate between settings, errors, help, and notes sections for comprehensive activity management.',
    estimatedTime: '4-5 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Access Activity Configuration Settings',
        content:
          'Select any activity in your workflow and click the settings icon near the top right corner (same location used for renaming activities). This opens the activity configuration panel with tabs for Settings, Errors, Help, and Notes.',
      },
      {
        step: 2,
        title: 'Understand Activity-Specific Settings',
        content:
          'Recognize that every activity has different configuration requirements. For example, AD Query activities need hostname, username, password, and query parameters, while Send Email activities require module selection, recipient addresses, subject, and body content.',
      },
      {
        step: 3,
        title: 'Identify Third-Party System Requirements',
        content:
          'Use activity settings to determine what information you need from integrated third-party systems and what data you need to pass to those systems. This helps you understand integration requirements before full workflow implementation.',
      },
      {
        step: 4,
        title: 'Define Workflow Requirements Early',
        content:
          'Add activities to your workflow canvas and review their settings to help define your overall workflow requirements. This approach ensures you gather all necessary information and credentials before building out the complete automation.',
      },
      {
        step: 5,
        title: 'Prepare for Advanced Configuration',
        content:
          'Familiarize yourself with the different configuration sections available for each activity. Understanding settings, error handling, help resources, and notes capabilities prepares you for more detailed activity configuration and workflow documentation.',
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

  {
    id: 'schedule-workflow',
    title: 'Schedule a Workflow',
    description:
      'Learn how to create and configure schedules in Resolve Actions to run workflows at consistent intervals, including setting up recurrence patterns, linking workflows, and managing schedule activation for automated workflow execution.',
    videoUrl: 'https://player.vimeo.com/video/1107864350',
    videoId: '1107864350',
    vimeoHash: '89fc1bc415',
    duration: '1:57',
    level: 'quick-start',
    category: 'Scheduling and Triggers',
    section: 'Automation Management',
    sectionOrder: 7,
    tags: [
      'scheduling',
      'triggers',
      'repository',
      'recurrence-pattern',
      'workflow-automation',
      'time-based',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to access the Schedules and Triggers interface through the Repository menu, create new schedules with descriptive names and purposes, link schedules to specific workflows for automated execution, configure recurrence patterns for hourly, daily, weekly, or one-time execution, and manage schedule activation settings to control when automated workflows run.',
    estimatedTime: '3-4 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Access Schedules and Triggers Interface',
        content:
          'Navigate to the main menu and locate the Repository section. Click on "Schedules and Triggers" to open the scheduling interface where you can manage all your automated workflow executions and time-based triggers.',
      },
      {
        step: 2,
        title: 'Create a New Schedule Entry',
        content:
          'Click the plus sign on the far right of the Schedules section to open the schedule dialogue box. This starts the process of creating a new automated schedule that will run your workflows at specified intervals.',
      },
      {
        step: 3,
        title: 'Configure Schedule Properties and Description',
        content:
          'Give your schedule a descriptive name and add a detailed description to make it easy to find and understand its purpose. Good naming and documentation practices are essential for managing multiple schedules and ensuring team understanding.',
      },
      {
        step: 4,
        title: 'Link Schedule to Target Workflow',
        content:
          'Use the workflow dropdown to select and link the specific workflow that will run at your scheduled intervals. Each schedule must be connected to a workflow that contains the automation logic you want to execute automatically.',
      },
      {
        step: 5,
        title: 'Set Recurrence Pattern and Activation',
        content:
          'Configure the recurrence pattern (hourly, daily, weekly, or once) and set specific timing options that appear based on your selection. Use the Enable checkbox to control schedule activation - uncheck it during development to prevent premature execution, then enable it when ready for production use.',
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

  {
    id: 'understand-trigger-conditions',
    title: 'Understand Trigger Conditions',
    description:
      'Learn how trigger conditions work in Resolve Actions to automatically run workflows in response to real-time events, including configuring multiple conditions, using global variables, and setting up conditional logic for event-driven automation.',
    videoUrl: 'https://player.vimeo.com/video/1107864390',
    videoId: '1107864390',
    vimeoHash: 'f560e177d5',
    duration: '2:43',
    level: 'quick-start',
    category: 'Scheduling and Triggers',
    section: 'Event-Driven Automation',
    sectionOrder: 8,
    tags: [
      'trigger-conditions',
      'event-driven',
      'real-time',
      'global-variables',
      'conditional-logic',
      'workflow-automation',
    ],
    publishDate: '2024-01-15',
    thumbnailUrl: null,
    product: 'actions',
    productCategory: 'platform',
    featured: false,
    platform: 'vimeo',
    template: 'instructional',
    learningObjectives:
      'After completing this tutorial, you will be able to understand how trigger conditions enable event-driven workflow automation, configure single and multiple conditions for complex trigger scenarios, use global variables in conditional logic for dynamic trigger evaluation, set up conditions with operators like "contains" to evaluate event data, and create near real-time automation responses based on specific event criteria.',
    estimatedTime: '4-5 minutes',
    tutorialSteps: [
      {
        step: 1,
        title: 'Understand Trigger Condition Fundamentals',
        content:
          'Learn that trigger conditions set rules for when workflows should run based on specific events in near real-time. Each trigger must have at least one condition, but complex triggers can have multiple conditions with logic to specify whether all conditions must be true or just one.',
      },
      {
        step: 2,
        title: 'Access and Review Existing Triggers',
        content:
          'Navigate to the Repository menu and click on Schedules and Triggers to view existing triggers. Click on a trigger name to open the trigger dialogue box and examine how conditions are structured and configured.',
      },
      {
        step: 3,
        title: 'Examine Trigger Condition Structure',
        content:
          "Locate the conditions section within the trigger dialogue box and click on a condition name, then click the pencil icon to edit and view the condition's logic. This reveals how conditions are built using objects, operators, and values.",
      },
      {
        step: 4,
        title: 'Configure Conditional Logic with Global Variables',
        content:
          'Learn how conditions use global variables (like email subject lines) as objects for evaluation. Set up operators like "contains" and specify values (like the word "testing") to create meaningful conditional logic that responds to real-world events.',
      },
      {
        step: 5,
        title: 'Implement Event-Driven Workflow Execution',
        content:
          'Create trigger conditions that ask specific questions (like "Does the subject of an email contain the word testing?") and execute workflows when conditions are met. Use this logic to build near real-time automation that responds automatically to events based on your defined criteria.',
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
]
