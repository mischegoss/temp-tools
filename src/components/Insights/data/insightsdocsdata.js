// src/components/Insights/data/insightsdocsdata.js
// Fixed data structure to match Actions format

export const insightsDocsNavData = {
  sectionTitle: 'Documentation quick navigation',
  exploreButton: {
    to: 'https://docs.resolve.io/insights/category/getting-started',
    text: 'Explore Docs',
  },
  navItems: [
    {
      title: 'Installation',
      description: 'Install and upgrade Insights.',
      link: 'https://docs.resolve.io/insights/category/installation-and-upgrade',
    },
    {
      title: 'Getting Started',
      description: 'Steps to using your instance of Insights',
      link: 'https://docs.resolve.io/insights/category/getting-started',
    },
    {
      title: 'Administration',
      description: 'Configure your administration settings',
      link: 'https://docs.resolve.io/insights/category/administration',
    },
    {
      title: 'Discovery and Dependency Mapping',
      description: 'Identify devices that exist in your network',
      link: 'https://docs.resolve.io/insights/category/discovery-and-dependency-mapping',
    },
    {
      title: 'CMDB',
      description: 'Synchronize your Resolve Insights inventory to a CMDB',
      link: 'https://docs.resolve.io/insights/category/cmdb',
    },
    {
      title: 'API Reference',
      description: 'Ingest operational data and consume correlated output ',
      link: 'https://docs.resolve.io/insights/category/api-reference',
    },
  ],
}
