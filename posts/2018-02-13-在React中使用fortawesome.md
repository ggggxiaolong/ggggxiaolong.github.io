---
title: 在React中使用Fortawesome
date: 2018-02-13 12:00:00
categories:
 - React
tags:
 - 库
---

#  在React中使用fortawesome

> [官方文档链接 英文](https://www.npmjs.com/package/@fortawesome/react-fontawesome)

## 安装


```shell
$ npm i --save @fortawesome/fontawesome

$ npm i --save @fortawesome/react-fontawesome
```

或者

```shell
$ yarn add @fortawesome/fontawesome

$ yarn add @fortawesome/react-fontawesome
```

## 使用

你可以在 React 组件中这样使用Font Awesome:

```javascript
<FontAwesomeIcon icon="coffee" />
```

使用这种方式之前需要你已经把 ``coffee`` 添加到了库中,或者当外部的 loading icon bundles 已经包含了这个icon.



下面三种方式中的两种你可以在 React 中使用 Font Awesome 5. 我们将会总结这三种方式的利弊并给出他们的详细说明.

1. 声明导入

   允许 icons 成为子集,优化你的最终 bundle . 只有你导入的
    icons 会包含在 bundle 中.然而,这种方式需要你在每一个使用到的组件中声明 . 当多个组件需要导入的时候这可能有点无趣 , 你可以使用下面这种方式 .

2. 创建一个库

   只在初始的模块中声明导入 icons 一次 , 然后将他们加入到库中 . 然后就可以在任意的组件中通过引用使用他们 . 再也不用在每一个组件中声明这些已经在库中声明的 icons 了 .

3. 外部导入

   如果你已经在 React 组件之外通过 ``<script>`` 标签导入了这些 icons ,并且你的 React 组件可以在不需要单独导入的情况下通过引用 icons . 你可以在 React 组件中通过字符串索引使用他们 , 就像他们已经加入到库中一样.

#### 声明导入

下面的例子中我们使用了``@fortawesome/fontawesome-free-solid``模块 , 所以需要将他们添加到工程中:

```shell
$ npm i --save @fortawesome/fontawesome-free-solid
```

或者

```shell
$ yarn add @fortawesome/fontawesome-free-solid
```

组件就可以像这样:

```js
import ReactDOM from 'react-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/fontawesome-free-solid'

const element = {
  <FontAwesomeIcon icon={faCoffee} />
}

ReactDOM.render(element, document.body)
```

注意:  ``faCoffee``  icon 已通过 ``@fortawesome/fontawesome-free-solid`` 导入为一个对象,并且将这个对象传给了 ``icon`` 属性.



声明导入 icons 就像在 Font Awesome 中众多 icon 中挑选你使用的 icon 然后把她们引入最终的 bundled 文件中.



#### 通过建立一个库更便捷的在整个 App 中通过索引使用 icons

你可能需要在 app 中的多个组件中使用 icons , 但是使用声明导入的方式需要在每个组件中声明每个使用的 icon .


你可以将他们添加到库中 . 并且只在 app 模块初始化的时候导入一次 , 就可以在所有 app 组件中使用加入库中的 icon .

假定 ``App.js`` 是 app 的初始文件 , 导入这个库 . 在这个例子中, 我将使用两个单独的 icon ``faCheckSquare``  ``faCoffee``  我还会使用 ``@fortawesome/fontawsome-free-brands`` 中的所有的商标 icon . 这个例子将展示怎样通过建立库来在你导入很多 icon 的时候将代码保持整洁, 但是我们保持了实例简明你可以想象一下如果这些 icon 扩大到很多的时候会怎样.

别忘了添加 ``@fortawesome/fontawesome-free-brands`` :

```shell
$ npm i --save @fortawesome/fontawesome-free-brands
```

或

```shell
$ yarn add @fortawesome/fontawesome-free-brands
```

在 app 被初始化的  ``App.js`` 中:

```javascript
import ReactDome from 'react-dom';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import { faCheckSquare, faCoffee } from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(brands, faCheckSquare, faCoffee)
```

让我们看看发生了什么

当我们调用 ``fontawesome.library.add()`` 我们传入了:

*  ``brands`` 包含了 ``@fortawesome/fontawesome-free-brands`` 所有的商标 icon , 所以这个包中的所有 icon 都可以在 app 中通过 icon 的名称索引使用. 例如:  ``apple`` , ``microsoft`` , ``google`` .
*  ``faCheckSquare``  和 ``faCoffee`` : 添加的每个 icon 都可以在 app 中通过名称字符串 ``check-square`` ``coffee`` 使用

假定在 app 中有两个 React 组件 ``Beverage`` ``Gadget`` . 你不需要重新在导入这些 icon , 只需要导入 ``FontAwesome``  组件 , 并在使用的时候 icon 属性上赋上icon 的名称即可 .

```js
import  React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const Beverage = () => (
	<div>
  		<FontAwesomeIcon icon="check-square">
  		Favorite beverage: <FontAwesomeIcon icon="coffe"/>
  	</div>
)

export default Beverage
```

在以这种方式引用 icon 的时候 ,  ``fas`` 会作为默认前缀(Font Awesome Solid 的前缀是fas, 所以在使用 Font Awesome Solid 的时候可以使用默认前缀). 接下来我们将会解释它的意思 , 和改变默认前缀 .

假定 ``Gadget.js`` 这样定义:

```js
import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const Gadget = () => (
  <div>
    <FontAwesomeIcon icon="check-square"/>
    Popular gadgets come from vendors like:
      <FontAwesomeIcon icon={["fab","apple"]}/>
      <FontAwesomeIcon icon={["fab","microsoft"]}/>
      <FontAwesomeIcon icon={["fab","google"]}/>
  </div>
)

export default Gadget
```

注意:

* 在这个组件中我们同样使用 ``check-square`` 的 icon , 尽管我们没有明确的导入到这个组件中 . 只需要在 ``App.js`` 中导入并将它加入到库中就可以在所有的组件中使用 . 
* 我们也使用了 ``apple`` , ``microsoft`` 和 ``google`` 这些品牌 icon , 它们同样没用被逐一导入, 但是它们都被包含在 ``brand`` 中,并在 ``App.js`` 中加入到库中.
* 我们给这些品牌 icon 添加了``fab`` 前缀 .


来看一下添加前缀的时候发生了什么?

首先 , 前面我们已经介绍过了 , 在使用的过程中如果不添加前缀,  ``fas`` 会作为默认的前缀.

``check-square`` 同样被添加 ``fas`` 前缀 , 这是我们想要的结果: 因为 ``@fortawesome/fontawesome-free-solid`` 的前缀就是 ``fas`` . 

然而 , ``apple`` , `` microsoft`` ``google`` 这些商标 icon 在 ``@fortawesome/fontawesome-free-brands`` 中 , 所以我们需要指定不同的前缀 ``fab`` , 而非默认的 ``fas`` .

 当使用提供前缀的语法时: 前缀 和 icon 名称都通过字符串提供 . 

``icon`` 属性可以是下面的形式:

* icon 对象 , 例如 ``{faCoffee}``
* 字符串对象 , 例如``"coffee"`` (字符串两边的花括号是可选项,我们省略了花括号)
* 字符串数组 , 第一个元素是前缀, 第二个前缀是 icon 名称

#### 外部导入

有一些场景下,你可能在 React 组件中使用 ``<script>`` 全局导入的 icon 索引,  例如一个非单页面应用的网站 . 一个使用了包含 Font Awesome icon 的 主题或者模版 ,  现在你想添加一些 Ract 组件 , 你可直接通过引用使用这些 icon 而不需要单独导入它们.

假定加载 React 组件 的 DOM 已经在 ``<head>`` 导入了:

```html
<script src="https://example.com/fontawesome-free-solid.js"></script>
```

现在你可以在任意 React 组件中使用这些导入的 icon: 

```js
<FontAwesomeIcon icon="coffee" />
```

## 特性

在下面的代码片段中, 我们将通过 icon 的名称使用它们. 请确保在使用前已经通过上面的方式导入了他们.



#### 基础

Spin and pulse 动画:

```js
<FontAwesomeIcon icon="spinner" spin />
<FontAwesomeIcon icon="spinner" pulse />
```

Fixed width:

```js
<FontAwesomeIcon icon="spinner" fixedWidth />
```

Border:

```js
<FontAwesomeIcon icon="spinner" border />
```

List items:

```js
<FontAwesomeIcon icon="spinner" listItem />
```

Flip horizontally, vertically, or both:

```js
<FontAwesomeIcon icon="spinner" flip="horizontal" />
<FontAwesomeIcon icon="spinner" flip="vertical" />
<FontAwesomeIcon icon="spinner" flip="both" />
```

Size:

```
<FontAwesomeIcon icon="spinner" size="xs" />
<FontAwesomeIcon icon="spinner" size="lg" />
<FontAwesomeIcon icon="spinner" size="6x" />
```

Rotate:

```js
<FontAwesomeIcon icon="spinner" rotate={90} />
<FontAwesomeIcon icon="spinner" rotate={180} />
<FontAwesomeIcon icon="spinner" rotate={270} />
```

Pull left or right:

```
<FontAwesomeIcon icon="spinner" pull="left" />
<FontAwesomeIcon icon="spinner" pull="right" />
```

指定的 class names:

```
<FontAwesomeIcon icon="spinner" className="highlight" />
```

#### 高级

Power Transforms:

```js
<FontAwesomeIcon icon="spinner" transform="shrink-6 left-4" />
<FontAwesomeIcon icon="spinner" transform={{ rotate: 42 }} />
```

Composition:

```js
<FontAwesomeIcon icon="coffee" mask={['far', 'circle']} />
```

Symbols:

```js
<FontAwesomeIcon icon="edit" symbol />
<FontAwesomeIcon icon="edit" symbol="edit-icon" />
```