import{_ as s,o as n,c as a,U as l}from"./chunks/framework.70292381.js";const F=JSON.parse('{"title":"基于VuePress部署自己的个人博客","description":"","frontmatter":{"title":"基于VuePress部署自己的个人博客","date":"2021-02-04T00:00:00.000Z","categories":["其他"],"tags":["其他"]},"headers":[],"relativePath":"posts/2021-02-04-基于VuePress搭建个人博客.md","filePath":"posts/2021-02-04-基于VuePress搭建个人博客.md"}'),p={name:"posts/2021-02-04-基于VuePress搭建个人博客.md"},o=l(`<h2 id="基于vuepress部署自己的个人博客" tabindex="-1">基于VuePress部署自己的个人博客 <a class="header-anchor" href="#基于vuepress部署自己的个人博客" aria-label="Permalink to &quot;基于VuePress部署自己的个人博客&quot;">​</a></h2><p>@Date 2021-02-04</p><p>使用到的工具</p><ul><li><a href="https://vuepress.vuejs.org/guide/getting-started.html" target="_blank" rel="noreferrer">VuePress</a></li><li><a href="https://vuepress-theme-reco.recoluan.com/views/1.x/installUse.html" target="_blank" rel="noreferrer">vuepress-theme-reco</a></li></ul><h3 id="创建项目" tabindex="-1">创建项目 <a class="header-anchor" href="#创建项目" aria-label="Permalink to &quot;创建项目&quot;">​</a></h3><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">create</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">vuepress-site</span><span style="color:#A6ACCD;"> [optionalDirectoryName]</span></span></code></pre></div><blockquote><p>[optionalDirectoryName] 提换成你的项目名</p></blockquote><p>此时你的项目路径应该是这样的</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">|--doc</span></span>
<span class="line"><span style="color:#A6ACCD;">|  --.gitignore</span></span>
<span class="line"><span style="color:#A6ACCD;">|  --package.json</span></span>
<span class="line"><span style="color:#A6ACCD;">|  --src</span></span>
<span class="line"><span style="color:#A6ACCD;">|    --index.md</span></span>
<span class="line"><span style="color:#A6ACCD;">|    --.vuepress</span></span>
<span class="line"><span style="color:#A6ACCD;">|      --componnet</span></span>
<span class="line"><span style="color:#A6ACCD;">|      --styles</span></span>
<span class="line"><span style="color:#A6ACCD;">|      --config.js</span></span>
<span class="line"><span style="color:#A6ACCD;">|      --enhanceApp.js</span></span>
<span class="line"><span style="color:#A6ACCD;">|    ...其他</span></span></code></pre></div><p>进入到项目路径下的 <code>doc</code> 下面,安装 <code>vuepress-theme-reco</code></p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">vuepress-theme-reco</span></span></code></pre></div><p>修改 <code>gitignore</code> 文件, 添加 <code>/src/.vuepress/dist</code></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;"># .gitignore</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">pids</span></span>
<span class="line"><span style="color:#A6ACCD;">logs</span></span>
<span class="line"><span style="color:#A6ACCD;">node_modules</span></span>
<span class="line"><span style="color:#A6ACCD;">npm-debug.log</span></span>
<span class="line"><span style="color:#A6ACCD;">coverage/</span></span>
<span class="line"><span style="color:#A6ACCD;">run</span></span>
<span class="line"><span style="color:#A6ACCD;">dist</span></span>
<span class="line"><span style="color:#A6ACCD;">.DS_Store</span></span>
<span class="line"><span style="color:#A6ACCD;">.nyc_output</span></span>
<span class="line"><span style="color:#A6ACCD;">.basement</span></span>
<span class="line"><span style="color:#A6ACCD;">config.local.js</span></span>
<span class="line"><span style="color:#A6ACCD;">basement_dist</span></span>
<span class="line"><span style="color:#A6ACCD;">/src/.vuepress/dist</span></span></code></pre></div><p>修改 <code>/src/.vuepress/config.js</code> 修改成你自己的描述</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">module.exports</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   * Ref：https://v1.vuepress.vuejs.org/config/#title</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">MrTan</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   * Ref：https://v1.vuepress.vuejs.org/config/#description</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">description</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">谈小龙的部落阁</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">head</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">//如果你想修改成自己的图标[浏览器网址旁边那个],添加 src/.vuepress/public/icon 放入自己的 favicon.ico</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//[&quot;link&quot;, { rel: &quot;icon&quot;, href: &quot;/icons/favicon.ico&quot; }],</span></span>
<span class="line"><span style="color:#A6ACCD;">    [</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">meta</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">viewport</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">width=device-width,initial-scale=1,user-scalable=no</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   * Theme configuration, here is the default theme configuration for VuePress.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   *</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">theme</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">reco</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">themeConfig</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">sidebar</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">auto</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">blog</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">lastUpdated</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">nav</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          * 如果你想添加关于导航打开第一个注释,在src下创建about文件夹并添加自我描述</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          * 如果你想添加github导航打开第二个注释,修改成你自己的github地址</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          */</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">//{ text: &#39;About&#39;, link: &#39;/about/&#39;, icon: &#39;reco-account&#39;},</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">//{ text: &#39;GitHub&#39;, link: &#39;https://github.com/ggggxiaolong&#39;, icon: &#39;reco-github&#39; }</span></span>
<span class="line"><span style="color:#A6ACCD;">    ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">blogConfig</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">category</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">location</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 在导航栏菜单中所占的位置，默认2</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">text</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Category</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 默认文案 “分类”</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">tag</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">location</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 在导航栏菜单中所占的位置，默认3</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">text</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Tag</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 默认文案 “标签”</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">   */</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">plugins</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// &quot;@vuepress/plugin-back-to-top&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@vuepress/plugin-medium-zoom</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// &quot;@vuepress/blog&quot;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span></code></pre></div><p>好了,到目前为止你已经可以在本地运行你自己的博客了</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">yarn dev</span></span></code></pre></div><p>浏览器打开 <code>http://localhost:8080/</code></p><h3 id="额外的一些修改" tabindex="-1">额外的一些修改 <a class="header-anchor" href="#额外的一些修改" aria-label="Permalink to &quot;额外的一些修改&quot;">​</a></h3><ol><li><p>添加 src/.vuepress/public/icon 放入自己的 favicon.ico, 修改 <code>src/.vuepress.config.js</code></p></li><li><p>添加关于, 在src下创建about文件夹并添加自我描述, 修改 <code>src/.vuepress.config.js</code></p></li><li><p>添加Github导航, 修改 <code>src/.vuepress.config.js</code></p></li><li><p>删除首页 vuepress 图片, 修改 <code>src/index.md</code></p><div class="language-markdown"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">---</span></span>
<span class="line"><span style="color:#F07178;">home</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">---</span></span></code></pre></div></li><li><p>创建发布脚本 <code>src/deploy.sh</code></p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">#!/usr/bin/env sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># abort on errors</span></span>
<span class="line"><span style="color:#82AAFF;">set</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># build</span></span>
<span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># navigate into the build output directory</span></span>
<span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">src/.vuepress/dist</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 如果你想把github page改成自己的域名,打开下面的注释,修改成自己的域名</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#echo &#39;chuntian.press&#39; &gt; CNAME</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">git</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">init</span></span>
<span class="line"><span style="color:#FFCB6B;">git</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-A</span></span>
<span class="line"><span style="color:#FFCB6B;">git</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">commit</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-m</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">deploy</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># if you are deploying to https://&lt;USERNAME&gt;.github.io</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># git push -f git@github.com:&lt;USERNAME&gt;/&lt;USERNAME&gt;.github.io.git master</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 发布到 gh-pages 分支,修改成自己的地址</span></span>
<span class="line"><span style="color:#FFCB6B;">git</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">push</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-f</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">git@github.com:ggggxiaolong/ggggxiaolong.github.io.git</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">master:gh-pages</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-</span></span></code></pre></div></li><li><p>添加个人域名A记录</p><ol><li><p>获取Github Page的 IP地址, <code>ping</code> 你的地址</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">❯</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ping</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ggggxiaolong.github.io</span></span>
<span class="line"><span style="color:#FFCB6B;">PING</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ggggxiaolong.github.io</span><span style="color:#A6ACCD;"> (185.199.109.153) 56</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">84</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> bytes of data.</span></span>
<span class="line"><span style="color:#FFCB6B;">64</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">bytes</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">185.199</span><span style="color:#C3E88D;">.109.153</span><span style="color:#A6ACCD;"> (185.199.109.153): icmp_seq=2 ttl=46 time=59.0 ms</span></span>
<span class="line"><span style="color:#FFCB6B;">64</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">bytes</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">185.199</span><span style="color:#C3E88D;">.109.153</span><span style="color:#A6ACCD;"> (185.199.109.153): icmp_seq=3 ttl=46 time=57.7 ms</span></span></code></pre></div></li><li><p>添加A记录，第1步获取的ip地址</p></li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">www解析 -&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">记录类型: A</span></span>
<span class="line"><span style="color:#A6ACCD;">主机记录: www</span></span>
<span class="line"><span style="color:#A6ACCD;">记录值:185.199.109.153</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">@解析 -&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">记录类型: @</span></span>
<span class="line"><span style="color:#A6ACCD;">主机记录: www</span></span>
<span class="line"><span style="color:#A6ACCD;">记录值:185.199.109.153</span></span></code></pre></div></li></ol>`,20),e=[o];function t(c,r,i,y,C,D){return n(),a("div",null,e)}const u=s(p,[["render",t]]);export{F as __pageData,u as default};
