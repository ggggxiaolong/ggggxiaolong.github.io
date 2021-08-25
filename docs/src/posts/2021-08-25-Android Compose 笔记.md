---
title: Android Compose 笔记
date: 2021-08-25
categories:
 - Android
tags:
 - Android Compose
---

# Android Compose 笔记

1. Compose 是一个方法，没有返回值，需要使用  `@composable` 注解标记.  在 Compose 进行界面的描述。Compose 可能会频繁重复执行，需要保证其轻量，不能进行耗时的操作如读取文件. 界面重绘制时系统会尽量保证只绘制有影响的的组件.

2. Compose 组件不会自动更新状态，对比：传统组件 `EditText` 会自己更新用户输入的内容；可以使用 `remember` 方法在 Compose 中缓存一个值，并且重绘时返回该值 (不同于变量，因为 Compose 是方法，当 Compose 再次被调用的时候变量会被重新初始化)，`remember` 不会在配置改变的时候保留 (屏幕旋转，界面被回收重建)，如果需要保留使用 `rememberSaveable` 

3.  在需要多个相同 Compose 组件时使用 `key` 来避免数据变化引起的不必要的重组，

   ```kotlin
   @Composable
   fun MoviesScreen(movies: List<Movie>) {
       Column {
           for (movie in movies) {
               key(movie.id) { // Unique ID for this movie
                   MovieOverview(movie)
               }
           }
       }
   }
   ```

   ![key](https://developer.android.google.cn/images/jetpack/compose/lifecycle-newelement-top-keys.png?hl=zh-cn)

4. 通过 `@Stable` 注解标注稳定的 Compose 组件，可以略过重组检测

5. 在 Compose 中启动协程 `LaunchedEffect(key)` ， 在组和之外(点击事件)使用协程通过 `rememberCoroutineScope` 获取 Scope 感知 Compose 声明周期，`LaunchedEffect` 的 `key` 发生改变或方法体内的引用发生改变时会导致协程重启， 可以通过 `rememberUpdatedState`  来创建一个引用，在 “效应” 中使用时 “引用值改变” 不会导致协程重启。

6. **效应** 包含 `remember*`, `*Effect`

7. 在 Compose 结束的时候清理注册 `DisposableEffect`

   ```kotlin
   @Composable
   fun BackHandler(backDispatcher: OnBackPressedDispatcher, onBack: () -> Unit) {
   
       // 阻止因 onBack 改变而导致的 remember 改变
       val currentOnBack by rememberUpdatedState(onBack)
   
       // Remember in Composition a back callback that calls the `onBack` lambda
       val backCallback = remember {
           // Always intercept back events. See the SideEffect for
           // a more complete version
           object : OnBackPressedCallback(true) {
               override fun handleOnBackPressed() {
                   currentOnBack()
               }
           }
       }
   
       // If `backDispatcher` changes, dispose and reset the effect
       DisposableEffect(backDispatcher) {
           // Add callback to the backDispatcher
           backDispatcher.addCallback(backCallback)
   
           // When the effect leaves the Composition, remove the callback
           onDispose {
               backCallback.remove()
           }
       }
   }
   ```

8. `@Composable` 不仅可以用来标记 `lambda` 或者无返回值的函数，还可以标记返回值为 `State` 的函数; 可以用来表示通用的值避免重复代码，如根据主题返回背景色，前景色

9. `produceState` 启动一个协程返回 `@Composable State` 对象 

10. `derivedStateOf` 在一个方法体中转换一个或多个 `State`

11. 架构分层， 层级越低控制粒度越高，需要自己的实现越多

    ![level](https://developer.android.google.cn/images/jetpack/compose/layering-major-layers.svg)

    ​	

12. 可以通过 `CompositionLocal` 在 Compose 作用域内提供隐式的值， `MaterialTheme` 提供了3个可以隐式实例： `LocalColors`、`LocalShapes` 和 `LocalTypography` 可以通过  colors、typography 和 shapes 访问；另外还有 `LocalContentAlpha` `LocalIndication` `LocalRippleTheme` `LocalTextSelectionColors` 另外可以在 Compose 中使用 `CompositionLocalProvider` 修改默认的值。 

    ```kotlin
    @Composable
    fun MaterialTheme(
        colors: Colors = MaterialTheme.colors,
        typography: Typography = MaterialTheme.typography,
        shapes: Shapes = MaterialTheme.shapes,
        content: @Composable () -> Unit
    ) {
        val rememberedColors = remember {colors.copy()}.apply { updateColorsFrom(colors) }
        val rippleIndication = rememberRipple()
        val selectionColors = rememberTextSelectionColors(rememberedColors)
        CompositionLocalProvider(
            LocalColors provides rememberedColors,
            LocalContentAlpha provides ContentAlpha.high,
            LocalIndication provides rippleIndication,
            LocalRippleTheme provides MaterialRippleTheme,
            LocalShapes provides shapes,
            LocalTextSelectionColors provides selectionColors,
            LocalTypography provides typography
        ) {
            ProvideTextStyle(value = typography.body1, content = content)
        }
    }
    ```

    ```kotlin
    @Composable
    fun CompositionLocalExample() {
        MaterialTheme { // MaterialTheme sets ContentAlpha.high as default
            Column {
                Text("Uses MaterialTheme's provided alpha")
                CompositionLocalProvider(LocalContentAlpha provides ContentAlpha.medium) {
                    Text("Medium value provided for LocalContentAlpha")
                    Text("This Text also uses the medium value")
                    CompositionLocalProvider(LocalContentAlpha provides ContentAlpha.disabled) {
                        DescendantExample()
                    }
                }
            }
        }
    }
    ```

13. 布局

    ![layout](https://developer.android.google.cn/images/jetpack/compose/layout-column-row-box.png)

14. 修饰符： 

    * 更改可组合项的大小、布局、行为和外观
    * 添加信息，如无障碍标签
    * 处理用户输入
    * 添加高级互动，如使元素可点击、可滚动、可拖动或可缩放

    默认父组件会包裹子组件，也可通过 `size` 设置尺寸另外子组件可以通过 `requiredSize` 更改自身的限定尺寸(requiredSize 的优先级比 size高)，`fillMaxHeight` `fillMaxSize` 和 `fillMaxWidth` 用于填充父组件

    `paddingFromBaseline` 用于设置文本基线上方的内边距

    `offset` 修饰符用于修改组件基于0点的偏移量，可以x, y 轴，数值可负；并且不会影响组件的测量

    在 `Box` 组件中使用 `matchParentSize` 将不会占居多余的空间来填充父组件， `fillMaxSize` 会通过填满父组件来

    在 Row 和 Column 中可以使用 `weight` 设置权重

15. 自定义布局：每个组件都有一个位置 (x,y) 和大小 (width,height) ，单遍测量

16. 主题： 支持三个属性 `colors` `typography` `shapes`

    * color可以指定:` primary,  primaryVariant,  onPrimary,  secondary,  onSecondary,  background,  onBackground,  surface,  onSurface,  error,  onError`
    * typography可以指定: ` h1,  h2,  h3,  h4,  h5,  h6,  subtitle1,  subtitle2,  body1,  body2,  button,  caption,  overline`

    * shape: 可以指定三种： `small，medium，large`

17. 列表： `Row`, `Column`, `LazyColumn`, `LazyRow`,  `LazyVerticalGrid`  

    * 在lazy* 的作用域中 使用`item`添加一个，`items(Int)`添加多个(有点像构造函数), 使用`stickHeader` 添加粘性头部

    ```kotlin
    // TODO: This ideally would be done in the ViewModel
    val grouped = contacts.groupBy { it.firstName[0] }
    
    @OptIn(ExperimentalFoundationApi::class)
    @Composable
    fun ContactsList(grouped: Map<Char, List<Contact>>) {
        LazyColumn {
            grouped.forEach { (initial, contactsForInitial) ->
                stickyHeader {
                    CharacterHeader(initial)
                }
    
                items(contactsForInitial) { contact ->
                    ContactListItem(contact)
                }
            }
        }
    }
    ```

    * 同过 `LazyListState` 可以查询列表的状态，并且控制列表滚动位置

    ```kotlin
    @Composable
    fun MessageList(messages: List<Message>) {
        val listState = rememberLazyListState()
        // Remember a CoroutineScope to be able to launch
        val coroutineScope = rememberCoroutineScope()
    
        LazyColumn(state = listState) {
            // ...
        }
    
        ScrollToTopButton(
            onClick = {
                coroutineScope.launch {
                    // Animate scroll to the first item
                    listState.animateScrollToItem(index = 0)
                }
            }
        )
    }
    ```

    * 通过设置 `itemKey` 避免重复渲染，不设置默认使用位置顺序作为 `key`

18. 文字 `Text()`： 可以设置对其，颜色，字体，样式，可见行数，溢出样式；通过`buildAnnotatedString`可以设置多种样式的文本

    ```kotlin
    @Composable
    fun MultipleStylesInText() {
        Text(
            buildAnnotatedString {
                withStyle(style = SpanStyle(color = Color.Blue)) {
                    append("H")
                }
                append("ello ")
    
                withStyle(style = SpanStyle(fontWeight = FontWeight.Bold, color = Color.Red)) {
                    append("W")
                }
                append("orld")
            }
        )
    }
    ```

    * 互动： 使文字可选使用`SelectionContainer` 包裹，`DisableSelection` 使包裹内的文字不可选
    * 点击注解： 在文本中添加注解，并获取注解内容

    ```kotlin
    @Composable
    fun AnnotatedClickableText() {
        val annotatedText = buildAnnotatedString {
            append("Click ")
    
            // We attach this *URL* annotation to the following content
            // until `pop()` is called
            pushStringAnnotation(tag = "URL",
                                 annotation = "https://developer.android.com")
            withStyle(style = SpanStyle(color = Color.Blue,
                                        fontWeight = FontWeight.Bold)) {
                append("here")
            }
    
            pop()
        }
    
        ClickableText(
            text = annotatedText,
            onClick = { offset ->
                // We check if there is an *URL* annotation attached to the text
                // at the clicked position
                annotatedText.getStringAnnotations(tag = "URL", start = offset,
                                                        end = offset)
                    .firstOrNull()?.let { annotation ->
                        // If yes, we log its value
                        Log.d("Clicked URL", annotation.item)
                    }
            }
        )
    }
    ```

    * 输入框： `TextField`,  `OutlinedTextField` 可以设置样式：`singleLine`, `maxLines`, `textStyle` 等，键盘选项： `capitalization`, `autoCorrect`, `keyboardType`, `imeAction`以及格式设置如将密码替换成`*`

    ```kotlin
    @Composable
    fun PasswordTextField() {
        var password by rememberSaveable { mutableStateOf("") }
    
        TextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Enter password") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
        )
    }
    ```

19. 自定义图形： 使用 `Canvas` 构建其作用域提供一个size对象，可查询 `Canvas` 的宽高； `drawLine`, `drawCircle`, `drawRect`, `drawArc`, `drawImage`, `drawOval`, `drawPoints` , `drawRoundRect`, 控制:  边界`inset`， 旋转 `rotate` `rotateRad`,  缩放 `scale`,  移动 `translate`, 综合 `withTransform` ，裁剪 `clipPath`, `clipRect`

20. 动画: `AnimatedVisibility`,  `AnimatedContent`, `animatedContentSize`, `Crossfade`； AnimationSpec： `spring`, `tween`, `keyframes`, `repeatable`, `infiniteRepeatable`, `snap`

21. 手势: 点按`clickable`, `pointerInput`, 滚动 `verticalScroll`,  `horizontalScroll`, `scrollable`, `dragable`, `swipeable`, `transformable`

    ```kotlin
    Modifier.pointerInput(Unit) {
        detectTapGestures(
            onPress = { /* Called when the gesture starts */ },
            onDoubleTap = { /* Called on Double Tap */ },
            onLongPress = { /* Called on Long Press */ },
            onTap = { /* Called on Tap */ }
        )
    }
    ```

    

    ```kotlin
    @Composable
    fun ScrollableSample() {
        // actual composable state
        var offset by remember { mutableStateOf(0f) }
        Box(
            Modifier
                .size(150.dp)
                .scrollable(
                    orientation = Orientation.Vertical,
                    // Scrollable state: describes how to consume
                    // scrolling delta and update offset
                    state = rememberScrollableState { delta ->
                        offset += delta
                        delta
                    }
                )
                .background(Color.LightGray),
            contentAlignment = Alignment.Center
        ) {
            Text(offset.toString())
        }
    }
    ```

    

    ![一种用于检测手指按下手势并显示手指位置数值的界面元素](https://developer.android.google.cn/images/jetpack/compose/gestures-numeric-offset.gif)

    ```kotlin
    @Composable
    fun SwipeableSample() {
        val width = 96.dp
        val squareSize = 48.dp
    
        val swipeableState = rememberSwipeableState(0)
        val sizePx = with(LocalDensity.current) { squareSize.toPx() }
        val anchors = mapOf(0f to 0, sizePx to 1) // Maps anchor points (in px) to states
    
        Box(
            modifier = Modifier
                .width(width)
                .swipeable(
                    state = swipeableState,
                    anchors = anchors,
                    thresholds = { _, _ -> FractionalThreshold(0.3f) },
                    orientation = Orientation.Horizontal
                )
                .background(Color.LightGray)
        ) {
            Box(
                Modifier
                    .offset { IntOffset(swipeableState.offset.value.roundToInt(), 0) }
                    .size(squareSize)
                    .background(Color.DarkGray)
            )
        }
    }
    ```

    ![响应滑动手势的界面元素](https://developer.android.google.cn/images/jetpack/compose/gestures-swipe.gif)

    ```kotlin
    @Composable
    fun TransformableSample() {
        // set up all transformation states
        var scale by remember { mutableStateOf(1f) }
        var rotation by remember { mutableStateOf(0f) }
        var offset by remember { mutableStateOf(Offset.Zero) }
        val state = rememberTransformableState { zoomChange, offsetChange, rotationChange ->
            scale *= zoomChange
            rotation += rotationChange
            offset += offsetChange
        }
        Box(
            Modifier
                // apply other transformations like rotation and zoom
                // on the pizza slice emoji
                .graphicsLayer(
                    scaleX = scale,
                    scaleY = scale,
                    rotationZ = rotation,
                    translationX = offset.x,
                    translationY = offset.y
                )
                // add transformable to listen to multitouch transformation events
                // after offset
                .transformable(state = state)
                .background(Color.Blue)
                .fillMaxSize()
        )
    }
    ```

    ![响应多点触控手势（平移、缩放和旋转）的界面元素](https://developer.android.google.cn/images/jetpack/compose/gestures-multitouch.gif)

22. 已知的库

    1. 图片加载[Cil 库](https://coil-kt.github.io/coil/compose/)
    2. 导航 Navigation

23.  获取资源文件中的内容： `stringResource`， `dimensionResource`， `colorResource`， `painterResource`， `animatedVectorResource`

