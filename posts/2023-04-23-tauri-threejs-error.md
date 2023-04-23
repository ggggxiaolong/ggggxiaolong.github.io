---
title: Tauri运行three.js报错
date: 2023-04-23
categories:
 - Tauri
tags:
 - Tauri
---

运行 [Tauri PC 应用](https://chuntian.press/posts/2022-01-09-Tauri%E7%9A%84PC%E5%BA%94%E7%94%A8.html) 时发现 Three.js的部分运行不起来, 导致整个程序无响应，终端报错 `src/nv_gbm.c:99: GBM-DRV error (nv_gbm_bo_create): DRM_IOCTL_NVIDIA_GEM_ALLOC_NVKMS_MEMORY failed (ret=-1)`。搜索 Tauri的 [issus](https://github.com/tauri-apps/tauri/issues/6559) 发现是 `webkit2gtk` 版本不兼容，需要版本降级。

1. 在 Archlinux 归档版本中下载兼容的包 https://archive.archlinux.org/packages/
2. 安装 `sudo pacman -U webkit2gtk-2.38.5-1-x86_64.pkg.tar.zst`
3. 将 webkit2gtk 加入到忽略文件中  `/etc/pacman.conf` 加入 `IgnorePkg = pacage-name` 