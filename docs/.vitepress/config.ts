import { defineConfig } from 'vitepress'
import pkg from '../../package.json'

export default defineConfig({ 
  title: 'AutoDrawing',
  lang: 'zh-CN',
  description: '基于zrender的自动json画图工具',
  head: [
    ['meta', { name: 'author', content: 'xiaofei' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'auto-drawing, vitejs, vite'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ],
    ['meta', { name: 'keywords', content: 'auto-drawing docs' }],
    ['link', { rel: 'icon', href: '/logo.png' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/monokai-sublime.min.css'
      }
    ],

    ['script', { src: '/hmt.js' }],
    ['script', { src: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/highlight.min.js' }]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outlineTitle: '本页导航',
    lastUpdatedText: '上次更新时间',
    socialLinks: [{ icon: 'github', link: 'https://github.com/l-x-f/auto-drawing' }],
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    nav: [
      {
        text: '指南',
        link: '/guide/'
      },
      {
        text: 'JSON画图',
        link: '/guide/json'
      },
      {
        text: '示例',
        link: '/example/example'
      },
      {
        text: 'Api',
        link: '/guide/api/'
      },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: '历史版本',
            link: 'https://github.com/l-x-f/auto-drawing/releases'
          },
          {
            text: '更新日志',
            link: 'https://github.com/l-x-f/auto-drawing/blob/main/CHANGELOG.md'
          }
        ]
      },
      {
        text: '友情链接',
        items: [
          {
            text: 'ZRender',
            link: 'https://ecomfe.github.io/zrender-doc/public/'
          },
          {
            text: '博客',
            link: 'https://l-x-f.github.io/'
          }
        ]
      }
    ],
    sidebar: {
      '/guide/api/': [
        {
          text: 'api',
          items: [
            {
              text: '基本api',
              link: '/guide/api/'
            },
            {
              text: '绘图api',
              link: '/guide/api/drawing'
            },
            {
              text: '工具 utils',
              link: '/guide/api/utils'
            }
          ]
        }
      ]
    },
    footer: {
      message: 'MIT Licensed.',
      copyright: 'Copyright © 2021-present xiaofei'
    }
  },
  markdown: {
    lineNumbers: true
  }
})
