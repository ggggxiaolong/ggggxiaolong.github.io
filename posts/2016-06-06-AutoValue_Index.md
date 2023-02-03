---
title: AutoValue Index
date: 2016-06-06 12:00:00
categories:
 - Android
tags:
 - AutoValue
---

[AutoValue](https://github.com/google/auto/tree/master/value)谷歌 auto 库
_为 Java1.6+生成不可变 value class_

> "AutoValue is a great tool for eliminating the drudgery of writing mundane value classes in Java. It encapsulates much of the advice in Effective Java Chapter 2, and frees you to concentrate on the more interesting aspects of your program. The resulting program is likely to be shorter, clearer, and freer of bugs. Two thumbs up."
> - *Joshua Bloch, author, Effective Java*

## 背景

**Value classes**在 Java 项目中是极其常见的。有些类你想使用通用的方式处理任意两个实例，通过合理的比较 field 的值。我们正在讨论这些类（你在结尾用一种臃肿的重复的刻板且容易出错的方式实现<code>equals</code>, <code>hashCode</code> and <code>toString</code>的类）。

在开始时使用 IDE 模板生成这些没什么大作用的辅助方法也许是不错的。但是一旦写了这些方法，它就会成为你审查代码，修改和以后阅读的负担。这些样板代码降低了你代码的信噪比... 且容易隐藏难以找到的 bug。

AutoValue 提供了一中创建不可变 value class 的简单方式。代码更少，出错的几率更小。不限制你的自由，以你想要的方式写几乎任何方面的代码。 ####为什么使用 AutoValue

---

AutoValue 是解决 value class 问题的唯一的方案，对于 Java 语言拥有以下的所有特性：

- API-invisible （callers cannot become dependent on your choice to use it）
- 没有运行时依赖
- 微不足道的性能花销
- 几乎不会限制你的类能做什么
- 超语言“魔法”（只使用标准 Java 平台技术，以他们支持的方式）

## 怎么使用 AutoValue

AutoValue 的使用很简单：**你只需要写一个抽象类，然后 AutoValue 实现**，这就是所有要做的事，字面无配置。

**注意：**接下来我们将演示一个 AutoValue 不生成 builder 的类，如果你对构造器更感兴趣可以阅读[AutoValue with Builders](https://github.com/google/auto/blob/master/value/userguide/builders.md) #####对于 value class
用抽象类创建你的 value class，为你想要的属性设置一个抽象访问器，并在类上添加@AutoValue 注解。

    import com.google.auto.value.AutoValue;

    @AutoValue
    abstract class Animal {
        static Animal create(String name, int numberOfLegs) {
            // See "How do I ..?" below for nest classes.
            return new AutoValue_Animal(name, numberOfLegs);
        }

        abstract String name();
        abstarct int numberOfLegs();
    }

在实际使用中应该注意，一些类和方法应该是 public 和带有 Javadoc，我们除了这些是为了例子简短。 #####对于<code>pom.xml</code>
Maven 用户应该添加在项目的<code>pom.xml</code>中添加如下内容：

    <dependency>
        <groupId>com.google.auto.value</groupId>
        <artifactId>auto-value</artifactId>
        <version>1.2</version>
        <scope>provided</scope>
    </dependency>

Gradle 用户应该应该安装注解处理插件  [as described in these instructions](https://plugins.gradle.org/plugin/net.ltgt.apt)  之后在<code>build.gradle</code>脚本添加如下内容：

    dependencies {
        compileOnly "com.google.auto.value:auto-value:1.2"
        apt "com.google.auto.value:auto-value:1.2"
    }

##### 使用

> Your choice to use AutoValue is essentially *API-invisible*. That means that to the consumer of your class, your class looks and functions like any other. The simple test below illustrates that behavior. Note that in real life, you would write tests that actually *do something interesting* with the object, instead of only checking field values going in and out.

选择使用 AutoValue 基本上是 api 的无形.这意味者对于你类的使用着，你的类外观和功能像其他的类。下面简单的测试说明了这个特征，在实际应用中你应该写测试，实际的用这个对象做一些有趣的事，而不是只检查 field 值的改变。

    public void testAnimal() {
        Animal dog = Animal.create("dog", 4);
        assertEquals("dog", dog.name());
        assertEquals(4, dog.numberOfLegs());

        // You probably don't need to write assertions like these; just illustrating.
        assertTrue(Animal.create("dog", 4).equals(dog));
        assertFalse(Animal.create("cat", 4).equals(dog));
        assertFalse(Animal.create("dog", 2).equals(dog));

        assertEquals("Animal{name=dog, numberOfLegs=4}", dog.toString());
    }

##### 发生了什么
AutoValue 作为一个标准的注释处理器运行在<code>javac</code>阶段。它会读取你的抽象类并推断实现类应该是怎样。它在你的包下面生成源代码，一个继承你抽象类的实现类：

- 包访问权限
- 为每个抽象访问方法生成一个 filed
- 一个包含生成 filed 的构造方法
- 为每个访问方法生成具体的实现并返回关联的 field 值
- 一个<code>equals</code>方法
- 一个<code>hashCode</code>方法
- 一个<code>toString</code>方法返回值是一个描述这个实例的字符串

你手写的代码就像上面展示的那样，委托他的工厂方法生成构造器就好了。
对于上面展示的<code>Animal</code>例子，[这里是 AutoValue 可能生成的典型代码](https://github.com/google/auto/blob/master/value/userguide/generated-example.md)

注意：你的 value 类的使用者完全不需要知道这些。他只需要调用你提供的工厂方法就能获取一个实例。 ####警告

---

> Be careful that you don't accidentally pass parameters to the generated constructor in the wrong order. You must ensure that**your tests are sufficient** to catch any field ordering problem. In most cases this should be the natural outcome from testing whatever actual purpose this value class was created for! In other cases a very simple test like the one shown above is enough. Consider switching to use the [builder option](https://github.com/google/auto/blob/master/value/userguide/builders.md) to avoid this problem.

> We reserve the right to **change the hashCode implementation** at any time. Never persist the result of hashCode or use it for any other unintended purpose, and be careful never to depend on the order your values appear in unordered collections like HashSet.

注意：生成的构造函数参数顺序和你传入的参数顺序是对应的。  你必须保证你的测试覆盖 field 顺序问题。无论这个 value 类用来做什么大多数情况下这些应该是测试的自然结果。在其他情况下，像上面那样的一个非常简单的测试就足够了。可以考虑使用[builder option](https://github.com/google/auto/blob/master/value/userguide/builders.md)来避免这个问题。

无论何时我们保留修改<code>hashCode</code>的权利。不要坚持<code>hashCode</code>的结果或将其用于任何其他目的  ，不要依赖那些无序的集合生成有序的结果，比如<code>hashSet</code>。
