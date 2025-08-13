// src/components/Pro/data/prodocsdata.js
// Fixed data structure to match Actions format

export const proDocsNavData = {
  sectionTitle: 'Documentation quick navigation',
  exploreButton: {
    to: '/pro',
    text: 'Explore Docs',
  },
  navItems: [
    {
      title: 'Standard Installation and Upgrade',
      description: 'Install or upgrade standard Actions Pro',
      link: 'https://docs.resolve.io/pro/Standard%20Installation%20and%20Upgrade',
    },
    {
      title: 'Dockerized Installation and Upgrade',
      description: 'Install or upgrade Dockerized Pro',
      link: 'https://docs.resolve.io/pro/Dockerized%20Installation%20and%20Upgrade',
    },
    {
      title: 'Development Guides',
      description: 'Build ActionTasks and Automations',
      link: 'https://docs.resolve.io/pro/development-guides',
    },
    {
      title: 'Platform Administration',
      description: 'Configure and customize Actions Pro',
      link: 'https://docs.resolve.io/pro/platform-administration',
    },
    {
      title: 'Gateways',
      description: 'Connect Actions Pro to external systems',
      link: 'https://docs.resolve.io/pro/gateways',
    },
    {
      title: 'Security',
      description: 'Strengthen security of your Actions Pro deployment',
      link: 'https://docs.resolve.io/pro/security',
    },
  ],
}
