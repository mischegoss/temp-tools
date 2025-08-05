// Icon components - Updated with brand primary blue (#0050C7)
const DocumentationIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'
      fill='#0050C7'
      stroke='#0050C7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <polyline
      points='14,2 14,8 20,8'
      fill='white'
      stroke='#0050C7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <line
      x1='16'
      y1='13'
      x2='8'
      y2='13'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <line
      x1='16'
      y1='17'
      x2='8'
      y2='17'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <polyline
      points='10,9 9,9 8,9'
      stroke='white'
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
      d='M22 10v6M2 10l10-5 10 5-10 5z'
      fill='#0050C7'
      stroke='#0050C7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M6 12v5c3 3 9 3 12 0v-5'
      fill='none'
      stroke='#0050C7'
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
    <circle cx='12' cy='12' r='3' fill='#0050C7' />
    <path
      d='M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24 4.24m-8.48 0L7.5 5.5m12.73 12.73l-4.24-4.24m-8.48 0l4.24 4.24'
      stroke='#0050C7'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
)

const SupportIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
      fill='#0050C7'
      stroke='#0050C7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle cx='12' cy='8' r='1' fill='white' />
    <path d='M12 12v4' stroke='white' strokeWidth='2' strokeLinecap='round' />
  </svg>
)

export const homePageData = [
  {
    title: 'Documentation',
    description: 'Find product docs and guides',
    icon: <DocumentationIcon />,
    link: '#documentation',
  },
  {
    title: 'Learning Hub',
    description: 'Explore our training resources',
    icon: <LearningIcon />,
    link: 'https://training.resolve.io/',
  },
  {
    title: 'Automation Exchange',
    description: 'Discover workflows and activities',
    icon: <AutomationIcon />,
    link: 'https://exchange.resolve.io/#/login',
  },
  {
    title: 'Support',
    description: 'Get help with product issues',
    icon: <SupportIcon />,
    link: 'https://support.resolve.io/login/user',
  },
]
