// @ts-check
import { themes as prismThemes } from 'prism-react-renderer'

// Import the variable injector plugin
const variableInjector = require('./src/plugins/variable-injector')
const autoNavPlugin = require('./src/plugins/auto-nav-plugin') // Update this path to match your actual file location

// Match the working configuration approach - no marked library
const scriptsConfig = [
  // Load the chatbot script with defer (like the working config)
  {
    src: 'https://resolve-team.us.ainiro.io/magic/system/openai/include-chatbot.js?rtl=false&clear_button=true&follow_up=true&copyButton=true&new_tab=false&code=false&references=false&position=right&type=actions&header=Ask%20about%20Actions&popup=&button=Ask%20RANI&placeholder=Ask%20me%20about%20Actions&color=%23fefefe&start=%237892e5&end=%23142660&link=%23fe8464&theme=custom',
    defer: true,
    onload: `(function(script) {
      document.addEventListener('DOMContentLoaded', function() {
        script.setAttribute('data-loaded', 'true');
      });
    })(this)`,
  },
]

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Resolve Customer Resource Hub',
  tagline: 'Resolve Help Center and Documentation',
  favicon: 'img/favicon.ico',
  url: 'https://help.resolve.io',
  baseUrl: '/',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Use the simple scripts array
  scripts: scriptsConfig,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    // Rita Go documentation plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ritago',
        path: 'docs-rita-go-current',
        routeBasePath: 'rita-go',
        sidebarPath: require.resolve('./sidebars.ritago.js'),
        beforeDefaultRemarkPlugins: [
          // Add your replaceActionsUrlsPlugin if needed
          [
            variableInjector,
            {
              replacements: {
                COMPANY: 'Resolve',
                PRODUCT: 'Rita Go',
                PRODUCT_FULL: 'Resolve Actions',
                CURRENT_YEAR: new Date().getFullYear(),
                EXCHANGE: 'Resolve Automation Exchange',
              },
            },
          ],
        ],
        versions: {
          current: {
            label: 'latest',
            path: '',
            banner: 'none',
          },
        },
      },
    ],

    // Try a different Lunr search plugin approach
    // [
    //   require.resolve('docusaurus-lunr-search'),
    //   {
    //     languages: ['en'],
    //     indexBaseUrl: true,
    //   }
    // ],
  ],

  // Temporarily disable search plugin due to compatibility issues
  // themes: [
  //   [
  //     require.resolve("@easyops-cn/docusaurus-search-local"),
  //     {
  //       indexDocs: true,
  //       indexBlog: false,
  //       indexPages: false,
  //       language: ["en"],
  //       hashed: true,
  //       docsRouteBasePath: ["rita-go"],
  //       docsPluginIdForPreferredVersion: "ritago",
  //       searchContextByPaths: ["rita-go"],
  //       searchBarPosition: "none",
  //     },
  //   ],
  // ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/resolve-social-card.png',
      navbar: {
        title: 'Welcome to the Customer Resource Hub',
        logo: {
          alt: 'Resolve Logo',
          src: '/img/Resolve-Logo-Full-Color-RGB.svg',
        },
        items: [
          // Rita Go navigation
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Rita Go',
            docsPluginId: 'ritago',
          },

          // Manually add search if it's not appearing automatically
          {
            type: 'search',
            position: 'right',
          },

          // GitHub link
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Navigation',
            items: [
              {
                label: 'Home',
                to: '/',
              },
              {
                label: 'New to Resolve? Get Started',
                href: 'https://training.resolve.io/learning/discover',
              },
              {
                label: 'Training',
                href: 'https://training.resolve.io/learning',
              },
              {
                label: 'Support',
                href: 'https://support.resolve.io/',
              },
              {
                label: 'Automation Exchange',
                href: 'https://exchange.resolve.io/#/login',
              },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'Blog',
                href: 'https://resolve.io/blog',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/resolvesystems/',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/channel/UCAjU3_xvJteOHfiV_WU46XA',
              },
              {
                label: 'Contact Us',
                href: 'https://resolve.io/contact-us',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Privacy Policy',
                href: 'https://resolve.io/privacy-policy',
              },
              {
                label: 'Terms of Use',
                href: 'https://resolve.io/website-terms-of-use',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Resolve Systems. All rights reserved worldwide`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
}

export default config
