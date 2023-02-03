---
title: AutoValue How do I ...
date: 2016-06-12 12:00:00
categories:
 - Android
tags:
 - AutoValue
---

### 我怎么...

---

这页回答公共的 how-to 问题，这些问题可能来自于 AutoValue 的使用过程中。你应该首先阅读并理[AutoValue 介绍](https://github.com/google/auto/blob/master/value/userguide/index.md)  /[(简单翻译)](http://www.jianshu.com/p/d52d98cd6f6c)

具体**builder option**的使用单独一篇，在阅读这篇之前先阅读  [AutoValue with builders](https://github.com/google/auto/blob/master/value/userguide/builders.md)   /[简单翻译](http://www.jianshu.com/p/856bf9ac1eee)。

### 内容

---

我怎么...

- 为我的 value class 生成**构建者**？
- 在**内部类**中使用 AutoValue？
- 使用（不使用）JavaBean 样式的**前缀**？
- 使用**nullable**属性？
- 属性**验证**？
- 使用**复杂**类型的属性？
- 使用**自定义**的`equals`等等？
- 在`equals`里面忽略明确的属性等等？
- 含有多个**Create**方法，或给它命不同名？
- AutoValue 会实现那些**超类**的方法么？
- 在**普通类**上使用 AutoValue？
- 使我的类实现 Java 或者 GWT**序列化**？
- 在生成的字段上面添加注解？
- 让 AutoValue 实现**注解类型**？
- 包含**setter**（突变）方法？
- 生成**compareTo**？
- 使用**原始数组**做为属性的值？
- 使用**Object 数组**做为属性的值？
- 使一个@AutoValue 类**继承**另外一个？
- 使访问器方法**private**？
- 暴露一个**构造器**而不是工厂方法作为创建的 API？
- 在接口上使用 AutoValue 而不是抽象类？

### 为我的 value class 生成**构建者**？

---

请查看[AutoValue with builders](https://github.com/google/auto/blob/master/value/userguide/builders.md)。 /[简单翻译](http://www.jianshu.com/p/856bf9ac1eee)

### 在**内部类**中使用 AutoValue？

---

AutoValue 的命名组成：`AutoValue\__Outer_Middle_Inner_`，在内部类中使用需要按照这种命名方式，`toString`方法只会输出简单类名。

    class Outer {
        static class Middle {
            abstract static class Inner {
                static Inner create(String foo) {
                    return new AutoValue_Outer_Middle_Inner(foo);
                }
            }
        }
    }

### 使用（不使用）JavaBean 样式的**前缀**？

---

一些开发者更倾向于在访问器前面加`get-`或者`is`前缀，但是在构造器和`toString`中只使用属性名。

> AutoValue will do exactly this, but only if you are using these prefixes *consistently*. In that case, it infers your intended property name by first stripping the get-
>  or is-
> prefix, then adjusting the case of what remains as specified by[Introspector.decapitalize](http://docs.oracle.com/javase/8/docs/api/java/beans/Introspector.html#decapitalize).

AutoValue 会自动识别这些，但是你必选始终如一的使用这些前缀。在这种情况下 AutoValue 会剥离你的`get-`，`is`前缀，然后适应在[Introspector.decapitalize](http://docs.oracle.com/javase/8/docs/api/java/beans/Introspector.html#decapitalize)规定的情况。

注意：为了保持与 JavaBean 的规范一致，`is`前缀只能使用在`boolean`返回值的方法，`get`前缀可以使用在返回值是任何类型的方法。

### 使用 **nullable** 属性？

---

一般情况下生成的构造器将拒绝所有的空值。如果你想接受空值，只需为访问方法的参数中添加一个`@Nullable`注解。这样 AutoValue 就会移除空检测并为`equals`，`hashCode`，`toString`方法处理空问题。例子：

    @AutoValue
    public abstract class Foo {
        public static Foo create (@Nullable Bar bar) {
            return new AutoValue_Foo(bar);
        }

        @Nullable abstract Bar bar();
    }

这个例子也展示了在`create`方法中的中对应的参数添加`@Nullable`。AutoValue 实际上不需要这个注解，它只用在访问器上，但是我们还是建议让它作为调用者有用的文档。

### 属性**验证**？

---

空检查会被自动的添加，就像下面这样。对于其他类型的运行前检查只需要添加在你的工厂方法里面：

    static MyType create(String first, String second) {
        checkArgument(!first.isEmpty());
        return new AutoValue_MyType(first, second.trim());
    }

### 使用**复杂**类型的属性？

---

首先，检查是否这个复杂类型是否有对应的不可变复杂类型。例如，`List<String>`和`String[]`对应[Guava](http://github.com/google/guava)不可变类型是`ImmutableList<String>`。如果这样使用不可变类型作为你的属性，并且只在构造时接收复杂类型：

    @AutoValue
    public abstract class ListExample {
        public static ListExample create (String [] mutableNames) {
            return new AutoValue_ListExample(ImmutableList.copyOf(mutableNames));
        }

        public abstract ImmutableList<String> names ();
    }

注意：这是一个非常明智的做法，不是一个丑陋的实现方式！

如果没有合适的不可变类型使用，你需要处理警告。你的静态工厂需要给构造器传入一个参数的副本，你的访问器应该添加一个明显的注释绝对不要修改这个返回值。

    @AutoValue
    public abstract class Mutable Example {
        public static MutableExample create(MutablePropertyType ouch) {
            // Replace '.clone' below with the right copying code for this type
            return new AutoValue_MutableExammple(ouch.clone);
        }

        /**
         * Returns the ouch associated with this object;  <b>do not mutate </b> the
         * returned object.
         * /
        public abstract MutablePropertyType outh();
    }

注意：这是一个一个丑陋的实现方式，不是明智的做法！

### 使用**自定义**的`equals`等等？

可以，AutoValue 会识别这些并且跳过生成这些方法的代码。你写的代码逻辑会遗传到实现类，我们称它为*underriding* the method。

注意一旦你自定义这些方法你就失去了 AutoValue 的保护。记住下面这些关于 hash code 的基本规则：相同的对象的必须 hash code 一致，并且一致的 hash code 也暗示相同的对象。你现在需要使用  [guava-testlib](http://github.com/google/guava)的[EqualsTester
](http://static.javadoc.io/com.google.guava/guava-testlib/19.0/com/google/common/testing/EqualsTester.html)更透彻理想化的测试你的类。

最佳实践：标记你的俯冲方法（underriding methods）为 `final`类型来让以后阅读代码的人知道这些方法没有被 AutoValue 重写。

注意：如果俯冲方法（underriding methods）定义在抽象类的父类中也是起作用的，如果你想 AutoValue 重新覆盖这个方法，只需要在你的类中重新把这个方法设置为抽象就可以。

    @AutoValue
    class PleaseOverrideExample extends SuperclassThatDefinesToString {
        ...

        // cause AutoValue to generate this even though the superclass has it
        @Override public abstract String toString();
    }

### 含有多个**Create**方法，或给它命不同名？

放心大胆的做！AutoValue 不关心这些。[best practice item](https://github.com/google/auto/blob/master/value/userguide/practices.md#one_reference)可能相关。

### 在`equals`里面忽略明确的属性等等？

假设你的 value class 有一个额外的字段不应该包含在`equals``hashCode`方法中。一个通常的原因是因为这个字段是一个其他属性的“缓存”或者派生值。这种情况下，你直接在你的抽象类里面定义就可以，AutoValue 会直接忽略：

    @AutoValue
    abstract class DerivedExample {
        static DerivedExample create(String realProperty) {
            return new AutoValue_DerivedExample(realproperty);
        }

        abstract String realProperty;

        private String derviedProperty;

        final String dervedProperty() {
            // non-thread- safe Example
            if(derivedProperty == null) {
                derviedProperty = realProperty().toLowerCase();
            }
        }
    }

另一方面，如果这个值是用户指定，不是派生的，这种情况稍微更复杂（但仍旧合理）：

    @AutoValue
    abstract class IgnoreExample {
        static IgnoreExample create(String normalProperty, String ignoredProperty) {
            IgnoreExample ie = new AutoValue_IgnoreExample(normalProperty);
            ie.ignoredProperty = ignoreProperty;
            return ie;
        }

        abstract String normalProperty();

        private String ignoredProperty; // sadly, it can't be 'final'

        private String ignoredProperty() {
            return ignoredProperty;
        }
    }

这两种情况的字段都会在`equals``hashCode``toString`方法中忽略，对 AutoValue 来说这个字段根本不存在。

### AutoValue 会实现那些**超类**的方法么？

AutoValue 会注意到每个抽象访问器，无论他被定义在你的类还是超类中。

### 在**普通类**上使用 AutoValue？

> There's nothing to it: just add type parameters to your class and to your call to the generated constructor.

没有什么不可以：只需要在你的类和生成的构造器中上添加类型参数 ###使我的类实现 Java 或者 GWT**序列化**？
只需要让你的类添加`implements Serializable`或者`@GwtCompatible(serializable = true)`注解（分别）；这些信息（包括`serialVersionUID`）都会复制到生成类中。

### 在生成的字段上面添加注解？

目前还不支持；然而你抽象访问器上面的注解同样会出现在 AutoValue 生成的实现类上。

### 让 AutoValue 实现**注解类型**？

大部分的用户都应该不需要通过编程生成假的注解实例，但是如果你有，使用`@AutoValue`将导致失败，因为`Annocation.hashCode`的规范和 AutoValue 的行为不兼容。
然而，我们无论如何也会满足你！假如注解是这样定义的：

    public @interface Named {
        String value();
    }

你需要做的只是这些：

    public class Names {
        @AutoAnnatation public static Named named(String value) {
            return new AutoAnnotaion_Name_named(value);
        }
    }

查看[AutoAnnotation javadoc](http://github.com/google/auto/blob/master/value/src/main/java/com/google/auto/value/AutoAnnotation.java#L24)获取更多细节

### 包含**setter**（突变）方法？

不可以；AutoValue 只生成不可变 value class；

> Note that giving value semantics to a mutable type is widely considered a questionable practice in the first place. Equal instances of a value class are treated as *interchangeable*, but they can't truly be interchangeable if one might be mutated and the other not.

### 生成**compareTo**？

AutoValue 有意不支持这个特性。使用 Java8 添加的[Comparator
](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html)方法或者[Guava](http://github.com/google/guava)的[ComparisonChain
](http://google.github.io/guava/releases/snapshot/api/docs/com/google/common/collect/ComparisonChain.html)方法根据实际的比较逻辑来实现会更好。

因为这些机制更易用，代码量小，更灵活，所以 AutoValue 没有必要提供。

### 使用**原始数组**做为属性的值？

请便！AutoValue 会生成代码作用于存储在数组中的值，而不是数组对象本身，这正式你所需要的。注意  [mutable properties](https://github.com/google/auto/blob/master/value/userguide/howto.md#mutable_property).给出的警告信息。

### 使用**Object 数组**做为属性的值？

这是不允许的，Object 数表现很差不像原始数组，它不能被一个恰当的`List`实现用较少的代码替换。

在构造期访问访问 Object 数表是很重要的，参考[这里](https://github.com/google/auto/blob/master/value/userguide/howto.md#mutable_property)的第一个例子。

### 使一个@AutoValue 类**继承**另外一个？

这个特性是有意不支持的，因为没有正确的实现方法。参看  *Effective Java, 2nd Edition* Item 8。

### 使访问器方法**private**？

sorry！这是 AutoValue 几个不常见的限制你的 API 的方式之一。你的访问器方法可以不是 public 的但至少要是包访问权限的。

### 暴露一个**构造器**而不是工厂方法作为创建的 API？

sorry！这是 AutoValue 几个不常见的限制你的 API 的方式之一。然而*Effective Java*, Item 1 相对于公共构造器更推荐静态工厂方法。

### 在接口上使用 AutoValue 而不是抽象类？

接口是不允许的，我们意识到接口的唯一好处就是你可以不用写`public abstract`。仅此而已，另一方面你将不能保证不可变性，而且会导致坏的行为（描述在[最佳实践](https://github.com/google/auto/blob/master/value/userguide/practices.md#simple)）。总的来说，我们认为这是不值得的。
