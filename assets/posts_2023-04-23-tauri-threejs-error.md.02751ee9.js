import{_ as e,o as r,c as t,U as a}from"./chunks/framework.70292381.js";const g=JSON.parse('{"title":"Tauri运行three.js报错","description":"","frontmatter":{"title":"Tauri运行three.js报错","date":"2023-04-23T00:00:00.000Z","categories":["Tauri"],"tags":["Tauri"]},"headers":[],"relativePath":"posts/2023-04-23-tauri-threejs-error.md","filePath":"posts/2023-04-23-tauri-threejs-error.md"}'),s={name:"posts/2023-04-23-tauri-threejs-error.md"},o=a('<p>运行 <a href="https://chuntian.press/posts/2022-01-09-Tauri%E7%9A%84PC%E5%BA%94%E7%94%A8.html" target="_blank" rel="noreferrer">Tauri PC 应用</a> 时发现 Three.js的部分运行不起来, 导致整个程序无响应，终端报错 <code>src/nv_gbm.c:99: GBM-DRV error (nv_gbm_bo_create): DRM_IOCTL_NVIDIA_GEM_ALLOC_NVKMS_MEMORY failed (ret=-1)</code>。搜索 Tauri的 <a href="https://github.com/tauri-apps/tauri/issues/6559" target="_blank" rel="noreferrer">issus</a> 发现是 <code>webkit2gtk</code> 版本不兼容，需要版本降级。</p><ol><li>在 Archlinux 归档版本中下载兼容的包 <a href="https://archive.archlinux.org/packages/" target="_blank" rel="noreferrer">https://archive.archlinux.org/packages/</a></li><li>安装 <code>sudo pacman -U webkit2gtk-2.38.5-1-x86_64.pkg.tar.zst</code></li><li>将 webkit2gtk 加入到忽略文件中 <code>/etc/pacman.conf</code> 加入 <code>IgnorePkg = pacage-name</code></li></ol>',2),c=[o];function i(_,n,p,l,h,d){return r(),t("div",null,c)}const T=e(s,[["render",i]]);export{g as __pageData,T as default};
