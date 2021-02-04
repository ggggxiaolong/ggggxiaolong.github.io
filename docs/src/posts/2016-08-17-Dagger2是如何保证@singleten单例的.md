---
title: Dagger2 是如何保证单例的
date: 2016-08-17 12:00:00
categories:
 - Android
tags:
 - Dagger2
---

### 提出问题
* dagger2是如何保证@singleten单例的？

### 准备知识
如果你还没有了解过dagger2，不知道component，scope，model，provider，inject。建议你先对dagger2有一个大概的了解。有一些文章我觉得很棒（都提供了具体的项目在github），你可以阅读，并实践一下：
* [Android：dagger2让你爱不释手-基础依赖注入框架篇](http://www.jianshu.com/p/cd2c1c9f68d4)
* [Android：dagger2让你爱不释手-重点概念讲解、融合篇](http://www.jianshu.com/p/1d42d2e6f4a5)
* [Android：dagger2让你爱不释手-终结篇](http://www.jianshu.com/p/65737ac39c44)
* [Dagger2图文完全教程](https://github.com/luxiaoming/dagger2Demo)

### 解决问题
基于[这个项目讲解](https://github.com/luxiaoming/dagger2Demo)
##### 有那些地方使用了@Singleten注解（#代表类的方法）
* ApplicationComponent
* AndroidModule#ApplicationContext()
* AndroidModule#provideLocationManager()

##### 他们之间的关系

![Dagger2Demo_@Singleton.png](https://res.cloudinary.com/xiaolong/image/upload/v1612398731/blog/1419533-717e696a4ded2cc3.png_usqqu1.png)
* 我们知道Application相当于单例。application中的全局变量的生命周期和application是一致的，例如ApplicationComponent，它的实现类为DaggerApplicationModule（由Dagger2生成，实现了ApplicationComponent接口）。
* 那些有@Singleton注解（AndroidModule和Inject）的在DaggerApplicationComponent中由DoubleCheck管理，没有任何注解的由Factory管理
* **DoubleCheck和Factory的区别是DoubleCheck会将第一次生成的目标对象缓存下来，以后的调用将直接返回缓存的对象。而Factory每次获取目标对象都是重新生成（调用module中的方法）。**
* Application中保存了DaggerApplicationComponent对象，DaggerApplicationComponent保存了DoubleCheck对象，DoubleCheck对象保存了目标对象（Context或LocationManager）。从而保证了Context和LocationManager在整个App中的单例。

### 结论
由此可以得出：促使目标对象成为单例的并不是@Singleton注解，而是Application。（它的目的只是为了方便记忆）