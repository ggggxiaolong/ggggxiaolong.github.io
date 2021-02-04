## 基于VuePress部署自己的个人博客
@Date 2021-02-04

使用到的工具
* [VuePress](https://vuepress.vuejs.org/guide/getting-started.html)
* [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/views/1.x/installUse.html)

### 创建项目
```shell
yarn create vuepress-site [optionalDirectoryName]
```
> [optionalDirectoryName] 提换成你的项目名

此时你的项目路径应该是这样的

```
--doc
	--.gitignore
	--package.json
	--src
		--index.md
		--.vuepress
			--componnet
			--styles
			--config.js
			--enhanceApp.js
		...其他
```



进入到项目路径下的 `doc` 下面,安装 `vuepress-theme-reco`

```shell
yarn add vuepress-theme-reco
```

修改 `gitignore` 文件, 添加 `/src/.vuepress/dist`

```
# .gitignore

pids
logs
node_modules
npm-debug.log
coverage/
run
dist
.DS_Store
.nyc_output
.basement
config.local.js
basement_dist
/src/.vuepress/dist
```

修改 `/src/.vuepress/config.js` 修改成你自己的描述

```javascript
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
      //如果你想修改成自己的图标[浏览器网址旁边那个],添加 src/.vuepress/public/icon 放入自己的 favicon.ico
    //["link", { rel: "icon", href: "/icons/favicon.ico" }],
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
        /**
          * 如果你想添加关于导航打开第一个注释,在src下创建about文件夹并添加自我描述
          * 如果你想添加github导航打开第二个注释,修改成你自己的github地址
          */
      //{ text: 'About', link: '/about/', icon: 'reco-account'},
      //{ text: 'GitHub', link: 'https://github.com/ggggxiaolong', icon: 'reco-github' }
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
```

好了,到目前为止你已经可以在本地运行你自己的博客了

```
yarn dev
```

浏览器打开 `http://localhost:8080/`

### 额外的一些修改

1. 添加 src/.vuepress/public/icon 放入自己的 favicon.ico, 修改 `src/.vuepress.config.js`

2. 添加关于, 在src下创建about文件夹并添加自我描述, 修改 `src/.vuepress.config.js`

3. 添加Github导航, 修改 `src/.vuepress.config.js`

4. 删除首页 vuepress 图片, 修改 `src/index.md`

   ```markdown
   ---
   home: true
   ---
   ```

5. 创建发布脚本 `src/deploy.sh`

   ```sh
   #!/usr/bin/env sh
   
   # abort on errors
   set -e
   
   # build
   yarn build
   
   # navigate into the build output directory
   cd src/.vuepress/dist
   
   # 如果你想把github page改成自己的域名,打开下面的注释,修改成自己的域名
   #echo 'chuntian.press' > CNAME
   
   git init
   git add -A
   git commit -m 'deploy'
   
   # if you are deploying to https://<USERNAME>.github.io
   # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
   
   # 发布到 gh-pages 分支,修改成自己的地址
   git push -f git@github.com:ggggxiaolong/ggggxiaolong.github.io.git master:gh-pages
   
   cd -
   ```

6. 添加个人域名A记录

   1. 获取Github Page的 IP地址, `ping` 你的地址
      ```sh
      ❯ ping ggggxiaolong.github.io
      PING ggggxiaolong.github.io (185.199.109.153) 56(84) bytes of data.
      64 bytes from 185.199.109.153 (185.199.109.153): icmp_seq=2 ttl=46 time=59.0 ms
      64 bytes from 185.199.109.153 (185.199.109.153): icmp_seq=3 ttl=46 time=57.7 ms
      ```
      
   2.  添加A记录，第1步获取的ip地址

      ```
      www解析 ->
      记录类型: A
      主机记录: www
      记录值:185.199.109.153
      
      @解析 ->
      记录类型: @
      主机记录: www
      记录值:185.199.109.153
      ```

      
