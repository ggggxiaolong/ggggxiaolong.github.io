---
title: MotionLayout介绍 part1
date: 2019-05-23 12:00:00
categories:
 - Android
tags:
 - MotionLayout
---

# MotionLayout 介绍 (第一章)

[原文链接](<https://medium.com/google-developers/introduction-to-motionlayout-part-i-29208674b10d>)

MotionLayout  是 ConstrainLayout 2.0 库中被引入的一个新类，帮助安卓开发者关联手势和组件动画。接下来的文章将介绍会如何在应用中添加和使用 MotionLayout 。

**第一章**将介绍MotionLayout的基础：

* MotionLayout 是什么？
* 将 ConstrainLayout 2.0 和 MotionLayout 添加到项目中
* 如何使用 MotionLayout
* ConstraintSets
* MotionScene
* **示例1**: 关联已有的布局文件
* 处理 OnSwipe
* **示例2**: 自包含的 MotionScene
* MotionLayout 属性
* 总结

你可以在这里查看示例的源码 [ConstraintLayout examples github repositor](https://github.com/googlesamples/android-ConstraintLayoutExamples)

### MotionLayout 是什么？

安卓系统框架中已经提供下面几种方法在应用中使用动画：

* [Animated Vector Drawable](https://developer.android.com/guide/topics/graphics/drawable-animation)
* [Property Animation framework](https://developer.android.com/guide/topics/graphics/prop-animation)
* [LayoutTransition animations](https://developer.android.com/reference/android/animation/LayoutTransition)
* [Layout transitions with TransitionManager](https://developer.android.com/training/transitions/)
* [CoordinatorLayout](https://developer.android.com/reference/android/support/design/widget/CoordinatorLayout)

这一部分将介绍 MotionLayout 与这些动画的不同。

MotionLayout 就像它的名字一样，首先它是一个布局，可以放置组件。其次它还是 ConstrainLayout 的子类，内置丰富的功能。

创建 MotionLayout 的目的是用于降低布局过渡动画和复杂的手势处理之间的难度，你可以认为它拥有综合属性动画，TransitionManager, 和 CoordinatorLayout 的功能。

>  它拥有综合属性动画，TransitionManager, 和 CoordinatorLayout 的功能

使用 MotionLayout 你可以像 *TransitionManager* 一样通过两个布局文件描述布局的过渡动画，但是可以使用任何属性(不仅仅局限于 layout attribute). 还有它支持可循迹的过渡，就像 CoordinatorLayout ( 可以通过滑动即刻响应过渡动画 ) 。它支持通过滑动和关键帧自定义过渡动画。

> MotionLayout 是完全声明式的

MotionLayout 的另外一个关键区别是，它是完全声明式的。只需要 XML 文件就可以描述一个复杂的过渡动画(如果你想通过代码来描述动画，系统提供的属性完全可以满足需求)。

> MotionLayout 工具

我们相信这种声明式的规范将简化过渡动画，同时也有助于为 Android Studio 提供更好的图形化工具。(我们现在正在积极的开发这样的工具，它现在还不可用。)

![img](https://res.cloudinary.com/xiaolong/image/upload/img/1_--BinUe-6XZPrZhPys6mzA_hli45d.gif)

最后，作为 ConstrainLayout 2.0 的一部分，它最低支持安卓 API 14，99.8%的设备都可以使用。

##### 限制

不同于 TransitionManager ，MotionLayout 只能用于他的直接子组件。

##### 何时使用MotionLayout

我们设想到的使用 MotionLayout 的使用场景： 当你需要移动，缩放或者动画 实际的 UI 组件 (button，title bar 等) 来提供与用户的互动时。

### 将 ConstrainLayout 2.0 和 MotionLayout 添加到项目中

只需要将下面的代码添加到 Gradle 文件中即可

```groovy
dependencies {
    implementation 'com.android.support.constraint:constraint-layout:2.0.0-beta1'
}
```

### 如何使用 MotionLayout

MotionLayout 是 ConstrainLayout 的子类，因此你可以把它当作一个普通的布局。 将已经存在的 ConstrainLayout 布局转换成 MotionLayout 布局 只需要将类名从：

```xml
<android.support.constraint.ConstraintLayout .../>
```

替换成

```xml
<android.support.constraint.motion.MotionLayout .../>
```

![image](https://res.cloudinary.com/xiaolong/image/upload/img/1_ht1WQDkxsoeINtC2pwSfig_hsi9kb.png)

ConstrainLayout 和 MotionLayout 的主要不同是 MotionLayout 不是必须将实际描述信息包含在 XML 布局文件中。MotionLayout 通常将这些信息保存在一个单独的 XML 文件 ( MotionScene) 中并关联到布局文件， 通过这种方式布局文件只需要包含 View 和它们的属性，无需包含位置信息和动画。

### ConstraintSets

通常 ConstrainSet 将包含布局文件中的所有的位置信息规则; 你可以使用多个 ConstrainSet， 你可以决定将那些规则应用到布局中，在应用时这些 View 不会被重建，只会修改他们的位置和大小。结合 TransitionManager 使用可以很容易的创建 ConstrainLayout 的动画。

MotionLayout 实际上也是源于这种思想，并添加了更丰富的功能。

### MotionScene

MotionLayout 的规范保存在一个单独的 MotionScene XML文件中，该文件存储在 res / xml 目录中。

![img](https://res.cloudinary.com/xiaolong/image/upload/img/1_CwwhnKdE7CpV_txpQ7pP6Q_zxhgmd.png)

一个 MotionScene 文件可以包含动画所需的所用内容：

* 包含的 ConstraintSets
* 这些 ConstraintSet 之间的转换(transition)
* 关键帧， 事件处理

例如，你可以将一个 View 从屏幕的一侧拖拽到另一侧：

![img](https://res.cloudinary.com/xiaolong/image/upload/img/1_6iOoPkHl13ap6cluzoYKmg_l5wfom.gif)

### 示例1： 关联布局文件

你需要使用 ConstrainLayout 创建两个 ConstrainSet 一个是初始位置（组件在屏幕的左面）一个是结束位置（组件在屏幕的右边）

初始位置：

![img](https://res.cloudinary.com/xiaolong/image/upload/img/1_T1iIAXMJcC3O0iY-RkriEg_kzbzbs.png)

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <View
        android:id="@+id/button"
        android:background="@color/colorAccent"
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:layout_marginStart="8dp"
        android:text="Button"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</android.support.constraint.ConstraintLayout>
```



结束位置：

![img](https://res.cloudinary.com/xiaolong/image/upload/img/1_sYsemssQUnFCzXHlwQuNGA_fw86mb.png)

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <View
        android:id="@+id/button"
        android:background="@color/colorAccent"
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:layout_marginEnd="8dp"
        android:text="Button"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</android.support.constraint.ConstraintLayout>
```



使用这两个布局文件可以初始化两个 ConstrainSet ，并使用他们（如果使用 TransitionManager 会有动画的平滑过渡）。这种方式有一个问题是转化一旦开始就不会结束，你也不能告诉系统将转换挺在某个位置 (你不能通过输入事件控制转换) 。

MotionLayout 解决了这些问题。你可以使用 MotionLayout 做同样的事，并且复用已存在的布局文件来初始化状态。首先需要为组件创建一个 MotionLayout 文件([motion_01_basic.xml](https://gist.github.com/camaelon/cc6192a76baf3569b95ba11b05f7e863#file-motion_01_basic-xml) )：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.motion.widget.MotionLayout      
	xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/motionLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:layoutDescription="@xml/scene_01"
    tools:showPaths="true">

    <View
        android:id="@+id/button"
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:background="@color/colorAccent"
        android:text="Button"
        tools:layout_editor_absoluteX="147dp"
        tools:layout_editor_absoluteY="230dp" />

</androidx.constraintlayout.motion.widget.MotionLayout>
```

布局文件中引用了一个 MotionScene 文件`scene_01`

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@layout/motion_01_cl_start"
        motion:constraintSetEnd="@layout/motion_01_cl_end"
        motion:duration="1000">
        <OnSwipe
            motion:touchAnchorId="@+id/button"
            motion:touchAnchorSide="right"
            motion:dragDirection="dragRight" />
    </Transition>

</MotionScene>
```

`scene_01` 设置了默认的转换，设置了开始和结束 ConstrainSet  (`motion_01_cl_start` 和 `motion_01_cl_end` )，并为转换设置了`OnSwipe` 处理。

### OnSwipe handler

在`scene_01.xml`文件中我们在 `Transition` 中设置了 `OnSwipe` 处理器。处理器通过匹配用户的输入事件控制转换。

![img](https://res.cloudinary.com/xiaolong/image/upload/img/1_13hEIVvjhOoiSDRvMkeZ7g_eiivjv.png)

有一些属性你需要了解：

`touchAnchorId`： 需要跟踪的对象

`touchAnchorSide`： 跟踪手指的一侧（right / left / top / bottom）

`dragDirection`： 跟踪手指运动的方向 ( dragRight / dragLeft / dragUp / dragDown 将决定进度值的变化0-1)

### 示例2： 自包含的 MotionScene

示例1展示了如何快速的创建一个 MotionLayout，最终使用了已存在的布局文件。MotionLayout 还支持直接在 MotionScene 文件中定义 ConstraintSet 。这样做有有以下好处：

* 一个文件可以包含多个 ConstraintSet
* 除了已有的功能外，还可以处理其他的属性和自定义属性
* 面向未来：即将到来的 Android Studio MotionEditor 可能只支持自包含 MotionScene 文件

##### 插值属性

MotionScene 文件中 ConstraintSet 元素可以使用的属性不仅包含常用的布局属性，除了位置和边距下面的属性也可以在 MotionLayout 中使用：

> `alpha`
> `visibility`
> `elevation`
> `rotation`, `rotation[X`/`Y]`
> `translation[X`/`Y`/`Z]`
> `scaleX`/`Y`

让我们为示例1重新创建一个新的自包含的 MotionScene 文件。 MotionLayout 文件除了引用了新的 `scene_02.xml` 和实例1中没有区别:

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.motion.MotionLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    app:layoutDescription="@xml/scene_02"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <View
        android:id="@+id/button"
        android:background="@color/colorAccent"
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:text="Button" />

</android.support.constraint.motion.MotionLayout>
```

MotionScene 文件中有明显的区别， `Transition` 的设置相同，但是我们把 `Start` 和`End`直接定义在了 XML 文件中。 和普通布局文件相比主要的区别是我们没有指定具体的组件，而是把限定属性写在了`Constraint`元素中。

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@+id/start"
        motion:constraintSetEnd="@+id/end"
        motion:duration="1000">
        <OnSwipe
            motion:touchAnchorId="@+id/button"
            motion:touchAnchorSide="right"
            motion:dragDirection="dragRight" />
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginStart="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent" />
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginEnd="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintTop_toTopOf="parent" />
    </ConstraintSet>

</MotionScene>
```

#### ConstraintSet

只需要将了解 ConstrainSet 是如何工作的，新的属性将替换到关联的组件上。 只需将需要替换的属性全部包含到`Constraint` 中。通常这会清除组件上的所用属性并将新的属性赋值到组件上。

### MotionLayout 的属性

在开发中你可能会用到 MotionLayout 的下列属性：

> **app:layoutDescription=”reference”** 指定 MotionScene XML 文件
>
> **app:applyMotionScene=”boolean”** 是否应用 MotionScene *[default=true]*
>
> **app:showPaths=”boolean”** 是否显示路径 *[default=false].* 记得在发布版本中关闭
>
> **app:progress=”float”** 指定转换的进度 [0-1]
>
> **app:currentState=”reference”** 指定一个 ConstraintSet

### 总结

第一篇文章包含了 MotionLayout 的基础功能， 你可以在这里查看源码[ConstraintLayout examples github repository](https://github.com/googlesamples/android-ConstraintLayoutExamples)

接下来的文章中我们将包含更多的讲解：

* 自定义属性, 图片变换, 关键帧 ([**part II**](https://medium.com/p/a31acc084f59))
* 在现有的布局中使用 MotionLayout  (CoordinatorLayout, DrawerLayout, ViewPager) ([**part III**](https://medium.com/p/47cd64d51a5))
* 关于关键帧的所有! ([**part IV**](https://medium.com/@camaelon/defining-motion-paths-in-motionlayout-6095b874d37))
* MotionLayout 作为根布局
* 嵌套  MotionLayout & 其他的组件
* MotionLayout 和 fragments