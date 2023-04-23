import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'

//每页的文章数量
const pageSize = 8

export default defineConfig({
    title: '谈小龙',
    base: '/',
    cacheDir: './node_modules/vitepress_cache',
    description: 'vitepress,blog,blog-theme',
    ignoreDeadLinks: true,
    themeConfig: {
        posts: await getPosts(pageSize),
        website: 'https://github.com/ggggxiaolong', //copyright link
        // 评论的仓库地址
        comment: {
            repo: 'ggggxiaolong/ggggxiaolong.github.io',
            themes: 'github-light',
            issueTerm: 'pathname'
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Archives', link: '/pages/archives' },
            { text: 'Tags', link: '/pages/tags' },
            { text: 'About', link: '/pages/about' },
            { text: 'Demo', link: '/pages/demo' }
            // { text: 'Three.js', link: '/pages/threejs_journey' }
            // { text: 'Airene', link: 'http://airene.net' }  -- External link test
        ],

        //outline:[2,3],
        outlineTitle: '文章摘要',
        socialLinks: [{ icon: 'github', link: 'https://github.com/ggggxiaolong' }]
    },
    srcExclude: ['README.md'], // exclude the README.md , needn't to compiler

    vite: {
        //build: { minify: false }
        server: { port: 5000 }
    },
    head: [
        ["link", { rel: "icon", href: "/icons/favicon.ico" }],
        [
            "meta",
            {
              name: "viewport",
              content: "width=device-width,initial-scale=1,user-scalable=no",
            },
          ]
    ]
    /*
      optimizeDeps: {
          keepNames: true
      }
      */
})
