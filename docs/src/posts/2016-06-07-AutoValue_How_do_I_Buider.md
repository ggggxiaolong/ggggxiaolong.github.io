---
title: AutoValue How do I ... (Builder)
date: 2016-06-07 12:00:00
categories:
 - Android
tags:
 - AutoValue
---

## How do I ... (Builder edition)

这一页是一些通用问题的答案，这些问题可能在使用**带有构建者选项**AutoValue 中遇到，在此之前你应该首先阅读[AutoValue with builders](https://github.com/google/auto/blob/master/value/userguide/builders.md)

如果你没有使用构建者模式，请查看[AutoValue 介绍](https://github.com/google/auto/blob/master/value/userguide/index.md)和[How do I...](https://github.com/google/auto/blob/master/value/userguide/howto.md)

### 内容

---

我怎么...@

- ...使用（或不使用）`set`前缀？
- ...使用不同**命名**除了`builder()`/` Builder``build() `?
- ...为一个属性制定默认值？
- ...使用一个现有的 value 实例的值初始化一个构建者？
- ...在 value class 内部包含`with-`方法，来生成一个略微修改的实例？
- ...验证属性的值？
- ...在构建时正常化（修改）属性的值？
- ...同时暴露构造器和工厂方法？
- ...处理`Optional`属性？
- ...使用一个集合属性？
- ...让构建者累积一个集合属性的值（而不是一次全部给出）？
- ...在不打破链式调用的前提下累积集合的值？
- ...对于同一个集合属性提供设置值的两种方式（一次性提供和累积提供）？

### ...使用（或不使用）set 前缀？

---

就像在 value class 中你可以使用 JavaBean 获取属性名那样的样式（getFoo() 而不是 foo()）那样,你可以将 setter 设置成同样的样式 构造者中也是一样（setFoo(value) 而不是 foo(value)）。对于 getter 方法，你必须保证所有前缀的一致（全用或者全不用）。

使用`get/is`做为 getter 前缀，或者使用`set`做为 setter 前缀可以单独控制。例如：在所有的构建者 setter 方法中使用`set`前缀，但是在所有 getter 不使用`get/is`前缀。

这里有一个使用`get`和`set`前缀的`Animal`例子：

```java
    @AutoValue
    abstract class Animal {
        abstract String getName();
        abstract int getNumberOfLegs();

        static Builder builder() {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        abstract static class Builder {
            abstract Builder setName (String value);
            abstract Builder setNumberOfLegs (int value);
            abstract Animal build (int value);
        }
    }
```

### ...使用除 builder()/Builder/build()之外的不同名字?

---

你使用什么名字，AutoValue 其实并不关心。（我们还是建议你使用常规的名字）

### ...为一个属性制定默认值？

---

当一个调用者在调用`build`之前没有为属性提供值将会发生什么？如果这个属性是[nullable](https://github.com/google/auto/blob/master/value/userguide/howto.md#nullable),它就会想你希望的那样被设置一个默认的 null 值。如果它是  [Optional](https://github.com/google/auto/blob/master/value/userguide/builders-howto.md#optional)那么它将默认设置成空`Optional`。但是如果不是这些情况（如果它是一个不可以为空的原始属性），那么`build()`方法将抛出 unchecked 异常。

但是这是一个问题，构造者的主要优势之一就是调用者只需要指定他们关心的属性。

解决方案就是对那些属性提供一个默认的值，幸运的是这很简单：只需要`builder()`方法返回新的构造器实例之前指定他们。

这里有一个`Animal`例子，设置腿的个数默认为 4：

```java
    @AutoValue
    abstract class Animal {
        abstract String name();
        abstract int numberOfLegs();

        static Builder builder() {
            return new AutoValue_Animal.Builder()
                .numberOfLegs(4);
        }

        @AutoValue.Builder
        abstract static class Builder {
            abstract Builder name(String value);
            abstract Builder numberOfLegs(int value);
            abstract Animal build();
        }
    }
```

有时你也许需要提供一个默认值，但是那仅仅在属性不是明确的情况下。属性被正常化时会被覆盖。

### ...使用一个现有的 value 实例的值初始化一个构建者？

---

假设你的调用着拥有了一个已经存在的实例（由你的 value class 类生成），并且想要修改其中的一两个值。当然，它是不可变的。但是如果能提供一个基于实例的构造者是很方便的（构造器已经初始化了和实例相同的属性），调用者通过提供的构造器修改值并且生成一个新的实例。

为了提供这种实现，只需要在你的 value class 内部添加一个`toBuilder`的抽象方法并返回你的抽象构造者。AutoValue 就会实现它。

    public abstract Builder toBuilder();

### ...在 value class 内部包含`with-`方法，来生成一个略微修改的实例？

---

这是不可变类中比较常见的模式，你不能包含 setter，但是你可以拥有一个类似 setter 的方法返回一个改变一个属性的新不可变实例。

如果你已经使用了构建者选项，你可以手动添加这些代码：

```java
    @AutoValue
    public abstract class Animal {
        public abstratc String name ();
        public abstract int numberOfLegs();

        public static Builder builder() {
            return new AutoValue_Animal.Builder();
        }

        abstarct Builder toBuilder();

        public Animal withName (String name) {
            return toBuilder().name(name).build();
        }

        @AutoValue.Builder
        public abstract static class Builder {
            public abstract Builder name (String value);
            public abstract Builder numberOfLegs(int value);
            public Animal build();
        }
    }
```

将那个方法设置为 public 是你的自由（`toBuilder`,`withName`,全不设置，全部设置）。

### ...验证属性的值？

---

在构造器中验证属性与[无构造者情况](https://github.com/google/auto/blob/master/value/userguide/howto.md#validate)相比没有那么直接。

你需要做的是把“build”方法拆分成两个方法：

- AutoValue 实现的抽象不可访问方法
- 可访问的具体方法，调用自动生成的方法并执行验证

推荐将这些方法的名称命名为`autoBuild`和`build`（其他的命名也没有问题），修改之后的代码就像这样：

```java
    @AutoValue
    public abstract class Animal {
        public abstratc String name();
        public abstratc int numberOfLegs();

        public static Builder builder () {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        public abstract static class Builder {
            public abstract Builder name(String value);
            public abstract Builder numberOfLegs(int value);

            abstract Animal autoBuild();    // not public

            public Animal build() {
                Animal animal = autoBuild();
                Preconditions.checkState(animal.numberOfLegs() >= 0, "Negative Legs");
                return animal;
            }
        }
    }
```

### ...在构建时正常化（修改）属性的值？

---

假如你想将 animal 的名字转化成小写。
你需要在你的构造者里面添加一个*getter*，就像下面这样(内部类 Builder 的 name 方法)：

```java
    @AutoValue
    public abstract class Animal {
        public abstratc String name();
        public abstratc int numberOfLegs();

        public static Builder builder () {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        public abstract static class Builder {
            public abstract Builder setName(String value);
            public abstract Builder setNumberOfLegs(int value);

            abstract String name();  // 和Animal类里面的方法匹配

            abstract Animal autoBuild();    // not public

            public Animal build() {
                setName(name().toLowerCase());
                return autoBuild();
            }
        }
    }
```

在构造者里面的 getter 必须和抽象类里面的方法签名一致，它将返回你在`Builder`里面设置的值，如果获取的值不能为空并且未被设置将抛出`IllegalStateException`。

getter 一般只用在`Builder`内部所以它不应该是设置为 public。

同样作为可以返回属性值的方法，这个构造者内部的 getter 可以返回一个被`Optional`包装的类型。这样就可以在属性未被设置的情况下用来提供一个默认的值。例如，你想在 Animal 未设置名字的情况下提供一个类似“4-legge creature”的名字，“4”来自于`numberOfLegs()`。你可以这样写：

```java
    @AutoValue
    public abstract class Animal {
        public abstract String name();
        public abstract int numberOfLegs();

        public static Builder builder() {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        public static abstract class Builder {
            public abstract Builder setName(String value);
            public abstract Builder setNumberOfLegs(int value);

            abstarct Option<String> name();
            abstract int numberOfLegs();

            abstract Animal autoBuild(); // not public

            public Anima build() {
                if(!name().isPresent()) {
                    setName(numberOfLegs() + "-legged creature");
                }
                return autoBuild();
            }
        }
    }
```

注意在`numberOfLegs`属性未被设置的情况下将抛出`IllegalStateException`

这个包装的 Optional 属性可以是抽象类里面的任何属性，如果是`int`将自动包装为`Optional<Integer>`或者`OptionalInt`,对于`long`和`double`也是一样。

### ...同时暴露构造器和工厂方法？

---

如果你使用构建者（builder），AutoValue 将不会为具体的 value class 生成一个可访问的构造器（constructor）。如果必须要为调用者同事提供工厂方法和构造者，那么你的工厂方法就需要自己调用构造者来实现。

### ...处理`Optional`属性？

---

`Optional`类型的属性得益于它自身的特殊处理。如果你有一个属性是`Optional<String>`,那么它默认就会被设置成空`Optional`而不需要特殊处理。并且如果你的方法是`setFoo(Optional<String>)`那你同样也拥有了`setFoo(String)`方法，并且`setFoo(s)`等同于`setFoo(Option.of(s))`。

这个`Optional`可以是[java.util.Optional
](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)（Java 8+）也可以是[com.google.common.base.Optional
](http://google.github.io/guava/releases/snapshot/api/docs/com/google/common/base/Optional.html) （Guava）。Java 8 还同样推出了关联的`java.util`类[OptionalInt
](https://docs.oracle.com/javase/8/docs/api/java/util/OptionalInt.html), [OptionalLong
](https://docs.oracle.com/javase/8/docs/api/java/util/OptionalLong.html), 和[OptionalDouble
](https://docs.oracle.com/javase/8/docs/api/java/util/OptionalDouble.html)。你也可以使用他们。例如：`OptionInt`的默认值为`OptionalInt.empty()`,你可以通过`setFoo(OptionalInt)`或者`setFoo(int)`来设置。

### ...使用一个集合属性？

---

值对象应该是不可变的，所以如果对象含有一个集合属性，那么这个集合属性也应该是不可变的。我们推荐使用 Guava 的[immutable collections](https://github.com/google/guava/wiki/ImmutableCollectionsExplained)。AutoValue 的构造者通过一些特殊的安排来使这些变得方便。

在例子中我们使用了`ImmutableSet`，但是这些规则同样适用于 Guava 的不可变集合类型，比如：`ImmutableList`，`ImmutableMultimap`...

我们推荐使用不可变类型（像`ImmutableSet<String>`）来作为你的属性类型。然而，对于类的调用者而言这将是一个痛点：总是要构建一个`ImmutableSet<String>`实例来传给构造者。所以 AutoValue 允许你的构造者方法接受一个`ImmutableSet.copyOf`可以处理的参数。

如果`Animal`本身需要一个`ImmutableSet<String>`，那么`Set<String>`，`Collection<String>`，`Iterable<String>`，`String[]`或者任何符合的类型都可以用于设置这个值，你甚至可以提供多种选择，就像下面这样：

```java
    @AutoValue
    public abstract class Animal {
        public abstract String name();
        public anstract int numberOfLegs();
        public abstract ImmutableSet<String> countries();

        public static Builder builder() {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        public abstract static class Builder {
            public abstract Builder name(String value);
            public abstract Builder numberOfLegs(int value);
            public abstract Builder countries(Set<String> value); //这里
            public abstract Builder countries(String... value); //这里
            public abstract Animal build();
        }
    }
```

### ...让构建者累积一个集合属性的值（而不是一次全部给出）？

除了为不可变集合`foos`定义一个 setter，你也可以定义一个`foosBuilder()`方法为这个集合返回关联的构建构建类型。这个例子中我们使用了`ImmutableSet<String>`可以通过`IcountriesBuilder()`方法构建：

```java
    @AutoValue
    public abstract class Animal {
        public abstract String name();
        public abstract int numberOfLegs();
        public abstract ImmutableSet<String> countries();

        public static Builder builder() {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        public static abstract class Builder {
            public abstract Builder name(String value);
            public abstract Builder numberOfLegs(int value);
            public abstract Immutable.Builder<String> countrisBuilder();
            public abstract Animal build();
        }
    }
```

你可能注意到这个例子中的一个小问题:调用者不能链式调用生成实例了：

```java
    // This DOES NOT work!
    Animal dog = Animal.builder()
        .name("dog")
        .numberOfLegs(4)
        .countriesBuilder()
            .add("Guam")
            .add("Laos")
        .build();
```

我们不得不通过持有 builder 来创建对象：

```java
    // This DOES work... but we have to "break the chain!"
    Animal.Builder builder = Animal.builde()
        .name("dog")
        .numberOfLegs(4);
    builder.countriesBuilder()
        .add("Guam")
        .add("Laos");-
    Animal dog = builder.build();
```

解决这个问题的方法就在下面。

### ...在不打破链式调用的前提下累积集合的值？

另一个选择就是保证这个`countriesBuilder()`自身非 public，只用他来实现一个 public 的`addCountry`方法：

```java
    @AutoValue
    public abstract class Animal {
        public abstract String name();
        public abstract int numberOfLegs();
        public abstract ImmutableSet<String> countries();

        public static Builder builder() {
            return new AutoValue_Animal.Builder();
        }

        @AutoValue.Builder
        public abstract static class Builder {
            public abstract Builder name(String value);
            public abstract Builder numberOfLegs(int vaue);

            abstarct Immutable.Builder<String> coutriesBuilder();
            public Builder addCountry(String value) {
                countriesBuilder().add(value);-
                return this;
            }

            public Animal build();
        }
    }
```

现在你就可以这样做了：

```java
    // this DOES work!
    Animal dog = Animal.builder()
        .name("dog")
        .numberOfLegs(4)
        .addCountry("Guam")
        .addCountry("Laos")
        .build();
```

### ...对于同一个集合属性提供设置值的两种方式（一次性提供和累积提供）？

你可以这样做。如果调用者在`foosBuilder`之后调用`setFoos`将会引发 unchecked 异常。
