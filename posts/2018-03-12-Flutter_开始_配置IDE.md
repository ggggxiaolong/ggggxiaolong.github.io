---
title: Flutter 开始 配置IDE
date: 2018-03-12 12:00:00
categories:
 - Flutter
tags:
 - Flutter
---

# 开始 : 配置 IDE

>[原链接](https://flutter.io/get-started/editor)
>2018.3.12



你可以通过任意文本编辑器和命令行来构建Flutter。但是我们更推荐你使用 FLutter 的 IDE 插件来提高变成体验。Flutter 插件 可以提供 代码补全，语法高亮，Widget 编辑提示， 运行和 debug 支持等。

如果你的编辑器是 AndroidStudio，IntelliJ，或者 VS Code 你可以按照下面的步骤安装插件。如果你使用其他的编辑器可以跳过这个步骤开始接下来的东西。

## AndroidStudio

* 安装 [AndroidStudio](https://developer.android.com/studio/index.html) 的3.0或更高版本，或者 InteliJ 的 2017.1 或更高版本
* 安装 Flutter 和 Dart 插件
  * Flutter 插件提供 Flutter 的开发工作流 (运行，调试， 热更新等)
  * Dart 插件提供代码分析（代码校验， code completions等 ）
  * 打开设置>插件>浏览仓库>搜索 Flutter>安装>重启

## VS Code

* 安装 [VS Code](https://code.visualstudio.com/) 1.20或更高版本
* 安装 Dart Code 插件
  * 打开 VS Code
  * 点击 View > Command Palette..
  * 输入 install ，选择 **Extensions: Install Extension**
  * 输入 ``dart code`` ，选择 ‘Dart Code’ 点击安装
  * 选择 'OK' 重启 VC Code
* 使用 Flutter Doctor 校验
  * 点击 View > Command Palette..
  * 输入 ‘doctor‘ 选择 **‘Flutter: Run Flutter Doctor’**
  * 检查 ‘OUTPUT’  窗口的输出是否存在问题
