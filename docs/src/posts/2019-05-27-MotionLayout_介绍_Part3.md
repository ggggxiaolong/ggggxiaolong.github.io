---
title: MotionLayout 介绍 Part3
date: 2019-05-27 12:00:00
categories:
 - Android
tags:
 - MotionLayout
---

# MotionLayout 介绍 (Part 3)

在前量部分我们引入了几个示例：

* 基础使用
* 滑动处理
* 自定义属性插值
* 关键帧

在一，二部分已经大量的介绍了 MotionLayout 的功能，在这部分我们将介绍如何在已有的项目中使用 MotionLayout ，整合到已有的布局中（CoordinatorLayout, DrawerLayout, ViewPager）.

### 在 Coordinatorlayout 中使用 MotionLayout:

( MotionLayout 可以实现类似 CoodinatorLayout 的功能，我们将在以后的文章中提供示例)

可以通过 MotionLayout 指定一部分 View 的动画，将更多有趣的动画加到已经存在的布局中。

例如，下图中的效果：

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558939324/img/1_AtZV8hltllXDgWCn0IHy8Q_u9vpup.gif)

可以使用 MotionLayout 替换 AppBarLayout 中的 Toolbar , 通过 CoordinatorLayout 控制动画的进度。

尽管你可以通过 `setProgress()` 方法控制 MotionLayout 转换的进度，也可以创建一个子类通过监听 AppBarlayout 的偏移自动修改：

```kotlin
package com.google.androidstudio.motionlayoutexample.utils

import android.content.Context
import android.support.constraint.motion.MotionLayout
import android.support.design.widget.AppBarLayout
import android.util.AttributeSet

class CollapsibleToolbar @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : MotionLayout(context, attrs, defStyleAttr), AppBarLayout.OnOffsetChangedListener {

    override fun onOffsetChanged(appBarLayout: AppBarLayout?, verticalOffset: Int) {
        progress = -verticalOffset / appBarLayout?.totalScrollRange?.toFloat()!!
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        (parent as? AppBarLayout)?.addOnOffsetChangedListener(this)
    }
}
```

然后在布局文件中使用:

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/content"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="false"
    android:background="@color/contentBackground">

    <android.support.design.widget.AppBarLayout
        android:id="@+id/app_bar"
        android:layout_width="match_parent"
        android:layout_height="@dimen/app_bar_height"
        android:theme="@style/AppTheme.AppBarOverlay">

        <include layout="@layout/motion_09_coordinatorlayout_header"/>

    </android.support.design.widget.AppBarLayout>

    <include layout="@layout/content_scrolling" />

</android.support.design.widget.CoordinatorLayout>
```

最后我们需要实现`motion_09_coordinatorlayout_header` 的内容，一个 ImagerView 作为背景和一个 TextView:

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.androidstudio.motionlayoutexample.utils.CollapsibleToolbar
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    app:layoutDescription="@xml/scene_09"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:minHeight="50dp"
    android:fitsSystemWindows="false"
    app:layout_scrollFlags="scroll|enterAlways|snap|exitUntilCollapsed">

    <ImageView
        android:id="@+id/background"
        android:layout_width="match_parent"
        android:layout_height="200dp"
        android:background="@color/colorAccent"
        android:scaleType="centerCrop"
        android:src="@drawable/monterey"/>

    <TextView
        android:id="@+id/label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:transformPivotX="0dp"
        android:transformPivotY="0dp"
        android:text="Monterey"
        android:textColor="#FFF"
        android:textSize="32dp" />

</com.google.androidstudio.motionlayoutexample.utils.CollapsibleToolbar>
```

创建自包含的 `MotionScene` 文件:

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@+id/start"
        motion:constraintSetEnd="@+id/end" />

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/background"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:alpha="1.0"
            motion:layout_constraintBottom_toBottomOf="parent"/>
        <Constraint
            android:id="@+id/label"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:rotation="-90.0"
            motion:layout_constraintBottom_toBottomOf="@+id/background"
            motion:layout_constraintStart_toStartOf="parent"/>
    </ConstraintSet>
    
    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/background"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:alpha="0.2"
            motion:layout_constraintBottom_toBottomOf="parent"/>
        <Constraint
            android:id="@+id/label"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="8dp"
            android:layout_marginBottom="8dp"
            android:rotation="0.0"
            motion:layout_constraintBottom_toBottomOf="@+id/background"
            motion:layout_constraintStart_toStartOf="parent" />
    </ConstraintSet>
</MotionScene>
```

在 DrawerLayout 布局中使用 MotionLayout:

[DrawerLayout](https://developer.android.com/reference/android/support/v4/widget/DrawerLayout) 是安卓项目中一个提供侧抽屉功能的布局文件。不同于普通的 menu ,我们可以构建一个更有趣的动画:

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558939335/img/1_gT_lL-MVY41xI2sMWs7dEQ_tn4n9j.gif)

和 CoordinatorLayout 类型我们也创建一个子类在自动的设置 MotionaLayout 的进度:

```kotlin
package com.google.androidstudio.motionlayoutexample.utils

import android.content.Context
import android.support.constraint.motion.MotionLayout
import android.support.v4.widget.DrawerLayout
import android.util.AttributeSet
import android.view.View

class DrawerContent @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : MotionLayout(context, attrs, defStyleAttr), DrawerLayout.DrawerListener {
    override fun onDrawerStateChanged(newState: Int) {
    }

    override fun onDrawerSlide(drawerView: View, slideOffset: Float) {
        progress = slideOffset
    }

    override fun onDrawerClosed(drawerView: View) {
    }

    override fun onDrawerOpened(drawerView: View) {
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        (parent as? DrawerLayout)?.addDrawerListener(this)
    }
}
```

`DrawerContent` 将通过 `onDrawerSlide` 的回调`slideOffset` 自动设置进度，将 这个类整合进 DrawerLayout 布局中 ：

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.v4.widget.DrawerLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    android:background="@color/colorPrimaryDark">

    <include layout="@layout/motion_12_drawerlayout_content"/>

    <include layout="@layout/motion_13_drawerlayout_menu"/>

</android.support.v4.widget.DrawerLayout>
```

`motion_12_drawerlayout_content.xml` 文件：

```xml

<?xml version="1.0" encoding="utf-8"?>
<com.google.androidstudio.motionlayoutexample.utils.DrawerContent
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/menu"
    android:layout_width="180dp"
    android:layout_height="match_parent"
    android:layout_gravity="start"
    app:layoutDescription="@xml/scene_13_menu"
    android:background="@color/colorPrimaryDark">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="32dp"
        android:text="Monterey"
        android:textSize="20sp"
        android:textStyle="italic"
        android:typeface="serif"
        android:textColor="#FFF"
        app:layout_constraintBottom_toTopOf="@+id/textView3"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.0"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/textView2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="Information"
        app:fontFamily="sans-serif-smallcaps"
        android:textColor="#FFF"
        app:layout_constraintBottom_toTopOf="@+id/textView4"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/view" />

    <TextView
        android:id="@+id/textView4"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="Directions"
        app:fontFamily="sans-serif-smallcaps"
        android:textColor="#FFF"
        app:layout_constraintBottom_toTopOf="@+id/textView5"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/textView2" />

    <TextView
        android:id="@+id/textView5"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="Sight-Seeing"
        app:fontFamily="sans-serif-smallcaps"
        android:textColor="#FFF"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/textView4" />

    <View
        android:id="@+id/view"
        android:background="#c2c1c1"
        android:layout_width="100dp"
        android:layout_height="1dp"
        android:layout_marginTop="16dp"
        app:layout_constraintBottom_toTopOf="@+id/textView2"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/textView3" />

    <TextView
        android:id="@+id/textView3"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="California"
        android:textColor="#FFF"
        app:fontFamily="cursive"
        app:layout_constraintBottom_toTopOf="@+id/view"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/textView" />
</com.google.androidstudio.motionlayoutexample.utils.DrawerContent>
```

MotionScene 文件:

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetEnd="@+id/end"
        motion:constraintSetStart="@+id/start"
        motion:duration="250" />

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/textView"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="32dp"
            android:rotation="90"
            android:translationX="100dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView3"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent"
            motion:layout_constraintVertical_chainStyle="spread" />

        <Constraint
            android:id="@+id/textView2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:rotation="90"
            android:translationX="100dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView4"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/view" />

        <Constraint
            android:id="@+id/textView4"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:rotation="90"
            android:translationX="100dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView5"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView2" />

        <Constraint
            android:id="@+id/textView5"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:rotation="90"
            android:translationX="100dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView4" />

        <Constraint
            android:id="@+id/view"
            android:layout_width="100dp"
            android:layout_height="1dp"
            android:layout_marginTop="16dp"
            android:rotation="90"
            android:translationX="100dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView2"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView3" />

        <Constraint
            android:id="@+id/textView3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:rotation="90"
            android:translationX="100dp"
            motion:layout_constraintBottom_toTopOf="@+id/view"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView" />
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/textView"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="32dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView3"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintHorizontal_bias="0.5"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent"
            motion:layout_constraintVertical_bias="0.0"
            motion:layout_constraintVertical_chainStyle="packed" />

        <Constraint
            android:id="@+id/textView2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView4"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintHorizontal_bias="0.5"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/view" />

        <Constraint
            android:id="@+id/textView4"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView5"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintHorizontal_bias="0.5"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView2" />

        <Constraint
            android:id="@+id/textView5"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintHorizontal_bias="0.5"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView4" />

        <Constraint
            android:id="@+id/view"
            android:layout_width="100dp"
            android:layout_height="1dp"
            android:layout_marginTop="16dp"
            motion:layout_constraintBottom_toTopOf="@+id/textView2"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintHorizontal_bias="0.5"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView3" />

        <Constraint
            android:id="@+id/textView3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            motion:layout_constraintBottom_toTopOf="@+id/view"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintHorizontal_bias="0.5"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toBottomOf="@+id/textView" />
    </ConstraintSet>

</MotionScene>
```

### 在 ViewPager 中使用 MotionLayout

同样我们想在 ViewPager 的头部添加更有趣的动画:

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558939350/img/1_o4_dFDvRd3AHO4ShcV1A9Q_qd5ddi.gif)

我们可以用一个小技巧来整合 ViewPager 的基础功能，创建一个子类并传入当前的位置：

```kotlin
package com.google.androidstudio.motionlayoutexample.utils

import android.content.Context
import android.support.constraint.motion.MotionLayout
import android.support.v4.view.ViewPager
import android.util.AttributeSet

class ViewpagerHeader @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : MotionLayout(context, attrs, defStyleAttr), ViewPager.OnPageChangeListener {

    override fun onPageScrollStateChanged(state: Int) {
    }

    override fun onPageScrolled(position: Int, positionOffset: Float, positionOffsetPixels: Int) {
        var numPages = 3
        progress = (position + positionOffset) / (numPages - 1)
    }

    override fun onPageSelected(position: Int) {
    }
}
```

计算很直观  — 在 onPageScrolled() 方法传入了位置，位置的变化从0到2,一共有三个界面。所以进度的计算应该是: `progress = (position + positionOffset) / (numPages-1)`

### 结合 MotionLayout 和 Lottie

前面的示例使用多个 ImageView 实现动画。也可以通过使用 Lottie 文件整合进 MotionLayout 中直接设置进度。让我们使用 LottieAnimationView 替换之前的示例:

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558939355/img/1_qOoMTYbQOoHLruJ4RltuOA_eqs1sg.gif)

布局文件:

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.androidstudio.motionlayoutexample.utils.ViewpagerHeader xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    app:layoutDescription="@xml/scene_23"
    android:layout_width="match_parent"
    app:progress="0"
    android:layout_height="230dp">

    <com.airbnb.lottie.LottieAnimationView
        android:id="@+id/animation_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:lottie_rawRes="@raw/walkthrough"/>

</com.google.androidstudio.motionlayoutexample.utils.ViewpagerHeader>
```

MotionScene 中关键参数是 `motion:progress` :

```xml
<Constraint
    android:id="@+id/animation_view"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    motion:progress="0"/>
```

因为 LottieAnimationView 存在 setProgress() 方法，所以我们可以在 MotionLayout 中调用它来控制 Lottie 的进度。 完整的 MotionScene 文件:

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@+id/start"
        motion:constraintSetEnd="@+id/end">
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/animation_view"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            motion:progress="0"/>
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/animation_view"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            motion:progress="1"/>
    </ConstraintSet>
    
</MotionScene>
```