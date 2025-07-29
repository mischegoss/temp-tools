// Icon components - Updated with consistent style and brand aqua color
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
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <polyline
      points='14,2 14,8 20,8'
      fill='white'
      stroke='#00b8de'
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
      d='M12 2l10 6-10 6L2 8l10-6z'
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M2 17l10 5 10-5'
      fill='none'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M6 12v7c0 1 2 2 6 2s6-1 6-2v-7'
      fill='none'
      stroke='#00b8de'
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
    <circle
      cx='12'
      cy='12'
      r='3'
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
    />
    <path
      d='M12 1v6m0 10v6m11-7h-6m-10 0H1'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M20.49 20.49L16.24 16.24m-8.48 0L3.51 20.49M20.49 3.51L16.24 7.76m-8.48 0L3.51 3.51'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
)

const DeviceIcon = () => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect
      x='2'
      y='4'
      width='20'
      height='16'
      rx='2'
      fill='#00b8de'
      stroke='#00b8de'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle cx='7' cy='10' r='1' fill='white' />
    <circle cx='12' cy='10' r='1' fill='white' />
    <circle cx='17' cy='10' r='1' fill='white' />
    <line
      x1='6'
      y1='14'
      x2='18'
      y2='14'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <line
      x1='9'
      y1='17'
      x2='15'
      y2='17'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
)

export const homePageData = [
  {
    title: 'Discover Resolve',
    description: 'New to Resolve? Start here.',
    icon: <DocumentationIcon />,
    href: '/learning/discover',
  },
  {
    title: 'Automation Design',
    description: 'Master service blueprints',
    icon: <LearningIcon />,
    href: '/learning/',
  },
  {
    title: 'Automation Development',
    description: 'Build powerful automations',
    icon: <AutomationIcon />,
    link: 'https://exchange.resolve.io/#/login',
  },
  {
    title: 'Device Discovery and Management',
    description: 'Discover and manage devices',
    icon: <DeviceIcon />,
    link: 'https://support.resolve.io/login/user',
  },
]
