import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '好賣+ 知識庫',
  tagline: '平台架構、帳務金流、營運 SOP 一站掌握',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://stella572322.github.io',
  baseUrl: '/famistore-doc/',

  organizationName: 'stella572322',
  projectName: 'famistore-doc',

  onBrokenLinks: 'throw',

  // 內部知識庫：要求搜尋引擎不要收錄（同時停用 sitemap）。
  noIndex: true,

  customFields: {
    // 進站密碼見 src/theme/Root.tsx。正式建置時，伺服器端只輸出密碼視窗，HTML 不含內容，
    // 因此壞連結檢查改由 `npm run check-links`（設定此旗標、輸出到另一個資料夾、不部署）負責。
    linkCheckBuild: process.env.KB_LINK_CHECK === '1',
  },

  markdown: {
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '好賣+ 知識庫',
      logo: {
        alt: '好賣+ Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文件',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `好賣+ 知識庫 · Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
