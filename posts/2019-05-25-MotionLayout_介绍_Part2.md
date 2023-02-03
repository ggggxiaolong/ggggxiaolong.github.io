---
title: MotionLayout_介绍_Part2
date: 2019-05-25 12:00:00
categories:
 - Android
tags:
 - MotionLayout
---

# MotionLayout 介绍（Part 2）

这是介绍 MotionLayout 的一系列文章，如果你还没有看过第一部分，请看[这里](https://medium.com/p/29208674b10d)!

在这篇文章中我们将通过几个实例介绍 MotionLayout 包括自定义属性插值，图片操作和关键帧。

* **示例3**： 自定义属性
* **示例4**： 使用 ImageFlterView(1/2)：淡入淡出
* **示例5**： 使用 ImageFilterView(2/2)： 饱和
* 关键帧
* **示例6**： 关键帧(1/2)：位置
* **示例7**： 关键帧(2/2)：属性
* 总结

### **示例3**： 自定义属性

在第一部分我们最后通过自包含 `MotionScene` 创建了，我们还可以在转换的过程中设置一些其他的属性。

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558502269/img/1_13hEIVvjhOoiSDRvMkeZ7g_eiivjv.png)

`SonstraintSet` 只封装了布局属性，但是对于复杂的动画我们通常需要控制更多的属性（比如 背景颜色）。

在 ConstraintLayout 2.0 版本中， `ConstraintSet` 可以设置自定义属性状态。加入我们想像下面这样在View移动的时候修改背景颜色：

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558589729/img/1_fouJJzG4fuNo9Ek9F1LloA_kkwkrw.gif)

之前我们只能通过代码来修改。但是现在我们可以直接在XML文件中加入下面的代码：

```xml
<Constraint
    android:id="@+id/button" ...>
    <CustomAttribute
        motion:attributeName="backgroundColor"
        motion:customColorValue="#D81B60"/>
</Constraint>
```

上图效果的完整代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetEnd="@+id/end"
        motion:constraintSetStart="@+id/start"
        motion:duration="1000"
        motion:interpolator="linear">
        <OnSwipe
            motion:dragDirection="dragRight"
            motion:touchAnchorId="@+id/button"
            motion:touchAnchorSide="right" />
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginStart="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="backgroundColor"
                motion:customColorValue="#D81B60" />
        </Constraint>
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginEnd="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="backgroundColor"
                motion:customColorValue="#9999FF" />
        </Constraint>
    </ConstraintSet>

</MotionScene>
```

自定义属性通过 attributeName 指定，对象的属性需要有相应的 getter/setter 方法：

* **getter**: `getName` (e.g. getBackgroundColor)
* **setter**: `setName` (e.g. setBackgroundColor)

值的类型也需要指定：

* `customColorValue`
* `customIntegerValue`
* `customFloatValue`
* `customStringValue`
* `customDimension`
* `customBoolean`

最后当设置属性的时候，需要在开始和结束的时候都要指定。

### **示例4**： 使用 ImageFlterView(1/2)：淡入淡出

处理复杂的转换时经常会伴随一些图片的操作，和动画。 ConstriantLayout 2.0 引入了一个新的工具类 ImageFilterView（继承 AppCompatImageView）可以轻松的实现这些功能。

让我们实现一个2个图片淡入淡出的效果：

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558589745/img/1_13RY4qzBIl6PNYWYSKUXMw_xhjgy2.gif)

首先创建一个 MotionLayout  布局文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.motion.MotionLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    app:layoutDescription="@xml/scene_04"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.constraint.utils.ImageFilterView
        android:id="@+id/image"
        android:background="@color/colorAccent"
        android:src="@drawable/roard"
        app:altSrc="@drawable/hoford"
        android:layout_width="64dp"
        android:layout_height="64dp"/>

</android.support.constraint.motion.MotionLayout>
```

不同于 ImageView 添加了 `altSrc` 属性：

```xml
<android.support.constraint.image.ImageFilterView
    android:id="@+id/image"
...
    android:src="@drawable/roard"
    app:altSrc="@drawable/hoford"/>
```

MotionScene 文件只需要添加 crossfade 属性的设置：

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetEnd="@+id/end"
        motion:constraintSetStart="@+id/start"
        motion:duration="1000"
        motion:interpolator="linear">
        <OnSwipe
            motion:dragDirection="dragRight"
            motion:touchAnchorId="@+id/image"
            motion:touchAnchorSide="right" />
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/image"
            android:layout_width="100dp"
            android:layout_height="100dp"
            android:layout_marginStart="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="crossfade"
                motion:customFloatValue="0" />
        </Constraint>
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/image"
            android:layout_width="100dp"
            android:layout_height="100dp"
            android:layout_marginEnd="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="crossfade"
                motion:customFloatValue="1" />
        </Constraint>
    </ConstraintSet>

</MotionScene>
```



### **示例5**： 使用 ImageFilterView(2/2)： 饱和

ImageFilterView 还提供了其他的属性：

> **saturation** : 0 = grayscale, 1 = original, 2 = hyper saturated
> **contrast** : 1 = unchanged, 0 = gray, 2 = high contrast
> **warmth** : 1 = neutral, 2 = warm (red tint), 0.5 = cold (blue tint)
> **crossfade** (with `app:altSrc`)

下面的例子展示了如何修改图片饱和度：

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558602006/img/1_aWlv-iMrfhBTyRwS_hA3RA_bifyyd.gif)

只需要在属性中指定 saturation

```xml
<CustomAttribute
    motion:attributeName="saturation"
    motion:customFloatValue="1" />
```

MotionLayou 文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.motion.MotionLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    app:layoutDescription="@xml/scene_05"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.constraint.utils.ImageFilterView
        android:id="@+id/image"
        android:src="@drawable/sunset2"
        android:scaleType="centerCrop"
        android:layout_width="match_parent"
        android:layout_height="300dp" />

</android.support.constraint.motion.MotionLayout>
```

相应的 scene 文件:

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@+id/start"
        motion:constraintSetEnd="@+id/end"
        motion:duration="1000">
        <OnSwipe
            motion:touchAnchorId="@+id/image"
            motion:touchAnchorSide="top"
            motion:dragDirection="dragUp" />
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/image"
            android:layout_width="match_parent"
            android:layout_height="300dp"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="saturation"
                motion:customFloatValue="1" />
        </Constraint>
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/image"
            android:layout_width="match_parent"
            android:layout_height="300dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent">
            <CustomAttribute
                motion:attributeName="saturation"
                motion:customFloatValue="0" />
        </Constraint>
    </ConstraintSet>

</MotionScene>
```

### 关键帧

有时我们在动画的过程中想要添加一个中间的状态，通过这个状态调整动画的效果，这时候就需要使用关键帧。关键帧可以用于位置或者属性中，你可以通过关键帧来指定变化。

例如，你想在变换的1/4让组件变成红色，在变换的1/2让组件上移。

### **示例6**： 关键帧(1/2)：位置

你可以通过  `pathRelative`, `deltaRelative`, `parentRelative` 设置位置关键帧（ `KeyPosition`）我们将在第4章详细讲解

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558603472/img/1_CT5m53LvQNC_viFZwNRx-w_s1icgf.png)

指定位置的关键帧，下面的代码指定了在进度50%和25%屏幕位置的时候设置关键帧：

```xml
<Transition ...>
    <KeyFrameSet>
        <KeyPosition
            motion:keyPositionType="parentRelative"
            motion:percentY="0.25"
            motion:framePosition="50"
            motion:target="@+id/button"/>
    </KeyFrameSet>
</Transition>
```

最终效果

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558603483/img/1_jOmDbVPaNMiqZqCb9W6I3w_zcf1a7.gif)

MotionLayout 文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.motion.MotionLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/motionLayout"
    app:layoutDescription="@xml/scene_06"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <View
        android:id="@+id/button"
        android:background="@color/colorAccent"
        android:layout_width="64dp"
        android:layout_height="64dp" />

</android.support.constraint.motion.MotionLayout>
```

MotionScene 文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@+id/start"
        motion:constraintSetEnd="@+id/end"
        motion:duration="1000"
        motion:interpolator="linear">
        <OnSwipe
            motion:touchAnchorId="@+id/button"
            motion:touchAnchorSide="right"
            motion:dragDirection="dragRight" />

        <KeyFrameSet>
            <KeyPosition
                motion:keyPositionType="parentRelative"
                motion:percentY="0.25"
                motion:framePosition="50"
                motion:target="@+id/button"/>
        </KeyFrameSet>
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginStart="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="backgroundColor"
                motion:customColorValue="#D81B60"/>
        </Constraint>
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginEnd="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="backgroundColor"
                motion:customColorValue="#9999FF"/>
        </Constraint>
    </ConstraintSet>

</MotionScene>
```

### **示例7**： 关键帧(2/2)：属性

和位置关键帧类似，你可以指定一个属性关键帧（ `KeyAttribute`）

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558603491/img/1_MHp3ZvHe7ZzHTntS5SurlQ_oryzya.png)

例如你可以指定缩放和旋转在动画 50% 的位置

![img](https://res.cloudinary.com/xiaolong/image/upload/v1558603503/img/1_tBmw-3uA2IcXZCtRBmMarA_fuddxw.gif)

你可以在   `KeyFrameSet` 中指定 `KeyAttribute` 

```xml
<KeyFrameSet>
    <KeyAttribute
        android:scaleX="2"
        android:scaleY="2"
        android:rotation="-45"
        motion:framePosition="50"
        motion:target="@id/button" />
</KeyFrameSet>
```

MotionLayout 和上面的布局文件相同， 只需要在 `MotionScene`  添加 `KeyAttribute`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<MotionScene
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:motion="http://schemas.android.com/apk/res-auto">

    <Transition
        motion:constraintSetStart="@+id/start"
        motion:constraintSetEnd="@+id/end"
        motion:duration="1000"
        motion:interpolator="linear">
        <OnSwipe
            motion:touchAnchorId="@+id/button"
            motion:touchAnchorSide="right"
            motion:dragDirection="dragRight" />

        <KeyFrameSet>
            <KeyAttribute
                android:scaleX="2"
                android:scaleY="2"
                android:rotation="-45"
                motion:framePosition="50"
                motion:target="@id/button" />
            <KeyPosition
                motion:keyPositionType="screenRelative"
                motion:percentY="0.2"
                motion:framePosition="50"
                motion:target="@id/button"/>
        </KeyFrameSet>
    </Transition>

    <ConstraintSet android:id="@+id/start">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginStart="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintStart_toStartOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="backgroundColor"
                motion:customColorValue="#D81B60"/>
        </Constraint>
    </ConstraintSet>

    <ConstraintSet android:id="@+id/end">
        <Constraint
            android:id="@+id/button"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:layout_marginEnd="8dp"
            motion:layout_constraintBottom_toBottomOf="parent"
            motion:layout_constraintEnd_toEndOf="parent"
            motion:layout_constraintTop_toTopOf="parent">
            <CustomAttribute
                motion:attributeName="backgroundColor"
                motion:customColorValue="#9999FF"/>
        </Constraint>
    </ConstraintSet>

</MotionScene>
```



### 总结

这篇文章介绍了 MotionLayout 的一些进阶的功能， 提供了一些自定义熟悉和关键帧的示例来实现复杂的动画。

你可以在这里查看源码 [ConstraintLayout examples github repository](https://github.com/googlesamples/android-ConstraintLayoutExamples)