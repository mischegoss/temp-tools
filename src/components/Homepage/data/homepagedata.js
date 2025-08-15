// @site/src/components/Homepage/data/homepagedata.js

import React from 'react'

const DocumentationIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <polyline
      points='14,2 14,8 20,8'
      fill='none'
      stroke='#ffffff'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <line
      x1='16'
      y1='13'
      x2='8'
      y2='13'
      stroke='#ffffff'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <line
      x1='16'
      y1='17'
      x2='8'
      y2='17'
      stroke='#ffffff'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <polyline
      points='10,9 9,9 8,9'
      fill='none'
      stroke='#ffffff'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const LearningIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <polyline
      points='9,22 9,12 15,12 15,22'
      fill='none'
      stroke='#ffffff'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const AutomationIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle cx='12' cy='12' r='3' fill='#00b8de' stroke='#00b8de' />
    <path
      d='m12 1 3 6 6-3-3 6 6 3-6 3 3 6-6-3-3 6-3-6-6 3 3-6-6-3 6-3-3-6 6 3z'
      fill='none'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M20.49 20.49L16.24 16.24m-8.48 0L3.51 20.49M20.49 3.51L16.24 7.76m-8.48 0L3.51 3.51'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
)

const LearningHubIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 2L2 7l10 5 10-5-10-5z'
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='m2 17 10 5 10-5'
      fill='none'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='m2 12 10 5 10-5'
      fill='none'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export const homePageData = [
  {
    title: 'Discover Resolve',
    description: 'New to Resolve? Start here.',
    icon: <DocumentationIcon />,
    link: '/learning/',
  },
  {
    title: 'Automation Design',
    description: 'Master service blueprints',
    icon: <LearningIcon />,
    link: '/learning/service-blueprinting/',
  },
  {
    title: 'Automation Development',
    description: 'Build powerful automations',
    icon: <AutomationIcon />,
    link: '/learning/actions/',
  },
  {
    title: 'Learning Hub',
    description: 'All product training',
    icon: <LearningHubIcon />,
    link: '/learning/discover/',
  },
]
