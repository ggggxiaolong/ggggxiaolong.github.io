const { description } = require("../../package");

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "MrTan",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: "谈小龙的部落阁",

  head: [
    ["link", { rel: "icon", href: "/icons/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  theme: "reco",
  themeConfig: {
    sidebar: 'auto',
    type: "blog",
    lastUpdated: true,
    nav: [
      { text: 'About', link: '/about/', icon: 'reco-account'},
      { text: 'GitHub', link: 'https://github.com/ggggxiaolong', icon: 'reco-github' }
    ],
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "Category", // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "Tag", // 默认文案 “标签”
      },
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    // "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    // "@vuepress/blog",
  ],
};
