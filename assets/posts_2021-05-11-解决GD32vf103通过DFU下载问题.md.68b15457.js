import{_ as e,o as s,c as t,U as a}from"./chunks/framework.70292381.js";const D=JSON.parse('{"title":"解决GD32vf103通过DFU下载问题","description":"","frontmatter":{"title":"解决GD32vf103通过DFU下载问题","date":"2021-05-11T00:00:00.000Z","categories":["riscv"],"tags":["riscv","GD32vf103cbt6","Sipeed Longan Nano"]},"headers":[],"relativePath":"posts/2021-05-11-解决GD32vf103通过DFU下载问题.md","filePath":"posts/2021-05-11-解决GD32vf103通过DFU下载问题.md"}'),o={name:"posts/2021-05-11-解决GD32vf103通过DFU下载问题.md"},l=a(`<h3 id="解决gd32vf103通过dfu下载问题" tabindex="-1">解决GD32vf103通过DFU下载问题 <a class="header-anchor" href="#解决gd32vf103通过dfu下载问题" aria-label="Permalink to &quot;解决GD32vf103通过DFU下载问题&quot;">​</a></h3><p><strong>开发环境</strong></p><ul><li>gd32vf103开发板</li><li>VSCode + Platformio + gd32v(platform)</li></ul><p>需要注意一下gd32v的开发平台有两个: 一个是Sipeed的gd32v平台，另外一个是Nuclei的平台，Nuclei的平台不支持构建bin文件[也许是我不知道怎么配置],需要使用gd32v平台。</p><p>使用gd32v平台提供的电灯demo就可以。主要讲一下dfu的下载模式遇到的问题：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">Cannot open DFU device 28e9:0189</span></span>
<span class="line"><span style="color:#A6ACCD;">No DFU capable USB device available</span></span></code></pre></div><p>如果你直接下载会遇到这个问题, 隐约感觉到是权限问题，之前在使用bl602的时候遇到下载的问题，换成串口下载也是。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">Failed to open port: /dev/ttyUSB0</span></span></code></pre></div><p>最终通过udev配置解决问题</p><ol><li>创建文件 /etc/udev/rules.d/70-ttyusb.rules</li><li>添加下面的配置信息</li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">KERNEL==&quot;ttyUSB[0-9]*&quot;, MODE=&quot;0666&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">SUBSYSTEM==&quot;usb&quot;, ATTRS{idVendor}==&quot;28e9&quot;, ATTRS{idProduct}==&quot;0189&quot;, MODE=&quot;0666&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">SUBSYSTEM==&quot;usb_device&quot;, ATTRS{idVendor}==&quot;28e9&quot;, ATTRS{idProduct}==&quot;0189&quot;, MODE=&quot;0666&quot;</span></span></code></pre></div><p>​ 3. 重新插拔usb，就可以顺利的下载了</p>`,12),n=[l];function p(i,c,d,r,u,_){return s(),t("div",null,n)}const f=e(o,[["render",p]]);export{D as __pageData,f as default};
