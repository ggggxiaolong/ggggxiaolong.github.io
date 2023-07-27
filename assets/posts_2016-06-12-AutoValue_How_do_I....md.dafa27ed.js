import{_ as e,o as a,c as t,U as o}from"./chunks/framework.70292381.js";const b=JSON.parse('{"title":"AutoValue How do I ...","description":"","frontmatter":{"title":"AutoValue How do I ...","date":"2016-06-12T12:00:00.000Z","categories":["Android"],"tags":["AutoValue"]},"headers":[],"relativePath":"posts/2016-06-12-AutoValue_How_do_I....md","filePath":"posts/2016-06-12-AutoValue_How_do_I....md"}'),r={name:"posts/2016-06-12-AutoValue_How_do_I....md"},l=o(`<h3 id="我怎么" tabindex="-1">我怎么... <a class="header-anchor" href="#我怎么" aria-label="Permalink to &quot;我怎么...&quot;">​</a></h3><hr><p>这页回答公共的 how-to 问题，这些问题可能来自于 AutoValue 的使用过程中。你应该首先阅读并理<a href="https://github.com/google/auto/blob/master/value/userguide/index.md" target="_blank" rel="noreferrer">AutoValue 介绍</a>  /<a href="http://www.jianshu.com/p/d52d98cd6f6c" target="_blank" rel="noreferrer">(简单翻译)</a></p><p>具体<strong>builder option</strong>的使用单独一篇，在阅读这篇之前先阅读  <a href="https://github.com/google/auto/blob/master/value/userguide/builders.md" target="_blank" rel="noreferrer">AutoValue with builders</a>   /<a href="http://www.jianshu.com/p/856bf9ac1eee" target="_blank" rel="noreferrer">简单翻译</a>。</p><h3 id="内容" tabindex="-1">内容 <a class="header-anchor" href="#内容" aria-label="Permalink to &quot;内容&quot;">​</a></h3><hr><p>我怎么...</p><ul><li>为我的 value class 生成<strong>构建者</strong>？</li><li>在<strong>内部类</strong>中使用 AutoValue？</li><li>使用（不使用）JavaBean 样式的<strong>前缀</strong>？</li><li>使用<strong>nullable</strong>属性？</li><li>属性<strong>验证</strong>？</li><li>使用<strong>复杂</strong>类型的属性？</li><li>使用<strong>自定义</strong>的<code>equals</code>等等？</li><li>在<code>equals</code>里面忽略明确的属性等等？</li><li>含有多个<strong>Create</strong>方法，或给它命不同名？</li><li>AutoValue 会实现那些<strong>超类</strong>的方法么？</li><li>在<strong>普通类</strong>上使用 AutoValue？</li><li>使我的类实现 Java 或者 GWT<strong>序列化</strong>？</li><li>在生成的字段上面添加注解？</li><li>让 AutoValue 实现<strong>注解类型</strong>？</li><li>包含<strong>setter</strong>（突变）方法？</li><li>生成<strong>compareTo</strong>？</li><li>使用<strong>原始数组</strong>做为属性的值？</li><li>使用<strong>Object 数组</strong>做为属性的值？</li><li>使一个@AutoValue 类<strong>继承</strong>另外一个？</li><li>使访问器方法<strong>private</strong>？</li><li>暴露一个<strong>构造器</strong>而不是工厂方法作为创建的 API？</li><li>在接口上使用 AutoValue 而不是抽象类？</li></ul><h3 id="为我的-value-class-生成构建者" tabindex="-1">为我的 value class 生成<strong>构建者</strong>？ <a class="header-anchor" href="#为我的-value-class-生成构建者" aria-label="Permalink to &quot;为我的 value class 生成**构建者**？&quot;">​</a></h3><hr><p>请查看<a href="https://github.com/google/auto/blob/master/value/userguide/builders.md" target="_blank" rel="noreferrer">AutoValue with builders</a>。 /<a href="http://www.jianshu.com/p/856bf9ac1eee" target="_blank" rel="noreferrer">简单翻译</a></p><h3 id="在内部类中使用-autovalue" tabindex="-1">在<strong>内部类</strong>中使用 AutoValue？ <a class="header-anchor" href="#在内部类中使用-autovalue" aria-label="Permalink to &quot;在**内部类**中使用 AutoValue？&quot;">​</a></h3><hr><p>AutoValue 的命名组成：<code>AutoValue\\__Outer_Middle_Inner_</code>，在内部类中使用需要按照这种命名方式，<code>toString</code>方法只会输出简单类名。</p><pre><code>class Outer {
    static class Middle {
        abstract static class Inner {
            static Inner create(String foo) {
                return new AutoValue_Outer_Middle_Inner(foo);
            }
        }
    }
}
</code></pre><h3 id="使用-不使用-javabean-样式的前缀" tabindex="-1">使用（不使用）JavaBean 样式的<strong>前缀</strong>？ <a class="header-anchor" href="#使用-不使用-javabean-样式的前缀" aria-label="Permalink to &quot;使用（不使用）JavaBean 样式的**前缀**？&quot;">​</a></h3><hr><p>一些开发者更倾向于在访问器前面加<code>get-</code>或者<code>is</code>前缀，但是在构造器和<code>toString</code>中只使用属性名。</p><blockquote><p>AutoValue will do exactly this, but only if you are using these prefixes <em>consistently</em>. In that case, it infers your intended property name by first stripping the get-  or is- prefix, then adjusting the case of what remains as specified by<a href="http://docs.oracle.com/javase/8/docs/api/java/beans/Introspector.html#decapitalize" target="_blank" rel="noreferrer">Introspector.decapitalize</a>.</p></blockquote><p>AutoValue 会自动识别这些，但是你必选始终如一的使用这些前缀。在这种情况下 AutoValue 会剥离你的<code>get-</code>，<code>is</code>前缀，然后适应在<a href="http://docs.oracle.com/javase/8/docs/api/java/beans/Introspector.html#decapitalize" target="_blank" rel="noreferrer">Introspector.decapitalize</a>规定的情况。</p><p>注意：为了保持与 JavaBean 的规范一致，<code>is</code>前缀只能使用在<code>boolean</code>返回值的方法，<code>get</code>前缀可以使用在返回值是任何类型的方法。</p><h3 id="使用-nullable-属性" tabindex="-1">使用 <strong>nullable</strong> 属性？ <a class="header-anchor" href="#使用-nullable-属性" aria-label="Permalink to &quot;使用 **nullable** 属性？&quot;">​</a></h3><hr><p>一般情况下生成的构造器将拒绝所有的空值。如果你想接受空值，只需为访问方法的参数中添加一个<code>@Nullable</code>注解。这样 AutoValue 就会移除空检测并为<code>equals</code>，<code>hashCode</code>，<code>toString</code>方法处理空问题。例子：</p><pre><code>@AutoValue
public abstract class Foo {
    public static Foo create (@Nullable Bar bar) {
        return new AutoValue_Foo(bar);
    }

    @Nullable abstract Bar bar();
}
</code></pre><p>这个例子也展示了在<code>create</code>方法中的中对应的参数添加<code>@Nullable</code>。AutoValue 实际上不需要这个注解，它只用在访问器上，但是我们还是建议让它作为调用者有用的文档。</p><h3 id="属性验证" tabindex="-1">属性<strong>验证</strong>？ <a class="header-anchor" href="#属性验证" aria-label="Permalink to &quot;属性**验证**？&quot;">​</a></h3><hr><p>空检查会被自动的添加，就像下面这样。对于其他类型的运行前检查只需要添加在你的工厂方法里面：</p><pre><code>static MyType create(String first, String second) {
    checkArgument(!first.isEmpty());
    return new AutoValue_MyType(first, second.trim());
}
</code></pre><h3 id="使用复杂类型的属性" tabindex="-1">使用<strong>复杂</strong>类型的属性？ <a class="header-anchor" href="#使用复杂类型的属性" aria-label="Permalink to &quot;使用**复杂**类型的属性？&quot;">​</a></h3><hr><p>首先，检查是否这个复杂类型是否有对应的不可变复杂类型。例如，<code>List&lt;String&gt;</code>和<code>String[]</code>对应<a href="http://github.com/google/guava" target="_blank" rel="noreferrer">Guava</a>不可变类型是<code>ImmutableList&lt;String&gt;</code>。如果这样使用不可变类型作为你的属性，并且只在构造时接收复杂类型：</p><pre><code>@AutoValue
public abstract class ListExample {
    public static ListExample create (String [] mutableNames) {
        return new AutoValue_ListExample(ImmutableList.copyOf(mutableNames));
    }

    public abstract ImmutableList&lt;String&gt; names ();
}
</code></pre><p>注意：这是一个非常明智的做法，不是一个丑陋的实现方式！</p><p>如果没有合适的不可变类型使用，你需要处理警告。你的静态工厂需要给构造器传入一个参数的副本，你的访问器应该添加一个明显的注释绝对不要修改这个返回值。</p><pre><code>@AutoValue
public abstract class Mutable Example {
    public static MutableExample create(MutablePropertyType ouch) {
        // Replace &#39;.clone&#39; below with the right copying code for this type
        return new AutoValue_MutableExammple(ouch.clone);
    }

    /**
     * Returns the ouch associated with this object;  &lt;b&gt;do not mutate &lt;/b&gt; the
     * returned object.
     * /
    public abstract MutablePropertyType outh();
}
</code></pre><p>注意：这是一个一个丑陋的实现方式，不是明智的做法！</p><h3 id="使用自定义的equals等等" tabindex="-1">使用<strong>自定义</strong>的<code>equals</code>等等？ <a class="header-anchor" href="#使用自定义的equals等等" aria-label="Permalink to &quot;使用**自定义**的\`equals\`等等？&quot;">​</a></h3><p>可以，AutoValue 会识别这些并且跳过生成这些方法的代码。你写的代码逻辑会遗传到实现类，我们称它为<em>underriding</em> the method。</p><p>注意一旦你自定义这些方法你就失去了 AutoValue 的保护。记住下面这些关于 hash code 的基本规则：相同的对象的必须 hash code 一致，并且一致的 hash code 也暗示相同的对象。你现在需要使用  <a href="http://github.com/google/guava" target="_blank" rel="noreferrer">guava-testlib</a>的<a href="http://static.javadoc.io/com.google.guava/guava-testlib/19.0/com/google/common/testing/EqualsTester.html" target="_blank" rel="noreferrer">EqualsTester </a>更透彻理想化的测试你的类。</p><p>最佳实践：标记你的俯冲方法（underriding methods）为 <code>final</code>类型来让以后阅读代码的人知道这些方法没有被 AutoValue 重写。</p><p>注意：如果俯冲方法（underriding methods）定义在抽象类的父类中也是起作用的，如果你想 AutoValue 重新覆盖这个方法，只需要在你的类中重新把这个方法设置为抽象就可以。</p><pre><code>@AutoValue
class PleaseOverrideExample extends SuperclassThatDefinesToString {
    ...

    // cause AutoValue to generate this even though the superclass has it
    @Override public abstract String toString();
}
</code></pre><h3 id="含有多个create方法-或给它命不同名" tabindex="-1">含有多个<strong>Create</strong>方法，或给它命不同名？ <a class="header-anchor" href="#含有多个create方法-或给它命不同名" aria-label="Permalink to &quot;含有多个**Create**方法，或给它命不同名？&quot;">​</a></h3><p>放心大胆的做！AutoValue 不关心这些。<a href="https://github.com/google/auto/blob/master/value/userguide/practices.md#one_reference" target="_blank" rel="noreferrer">best practice item</a>可能相关。</p><h3 id="在equals里面忽略明确的属性等等" tabindex="-1">在<code>equals</code>里面忽略明确的属性等等？ <a class="header-anchor" href="#在equals里面忽略明确的属性等等" aria-label="Permalink to &quot;在\`equals\`里面忽略明确的属性等等？&quot;">​</a></h3><p>假设你的 value class 有一个额外的字段不应该包含在<code>equals\`\`hashCode</code>方法中。一个通常的原因是因为这个字段是一个其他属性的“缓存”或者派生值。这种情况下，你直接在你的抽象类里面定义就可以，AutoValue 会直接忽略：</p><pre><code>@AutoValue
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
</code></pre><p>另一方面，如果这个值是用户指定，不是派生的，这种情况稍微更复杂（但仍旧合理）：</p><pre><code>@AutoValue
abstract class IgnoreExample {
    static IgnoreExample create(String normalProperty, String ignoredProperty) {
        IgnoreExample ie = new AutoValue_IgnoreExample(normalProperty);
        ie.ignoredProperty = ignoreProperty;
        return ie;
    }

    abstract String normalProperty();

    private String ignoredProperty; // sadly, it can&#39;t be &#39;final&#39;

    private String ignoredProperty() {
        return ignoredProperty;
    }
}
</code></pre><p>这两种情况的字段都会在<code>equals\`\`hashCode\`\`toString</code>方法中忽略，对 AutoValue 来说这个字段根本不存在。</p><h3 id="autovalue-会实现那些超类的方法么" tabindex="-1">AutoValue 会实现那些<strong>超类</strong>的方法么？ <a class="header-anchor" href="#autovalue-会实现那些超类的方法么" aria-label="Permalink to &quot;AutoValue 会实现那些**超类**的方法么？&quot;">​</a></h3><p>AutoValue 会注意到每个抽象访问器，无论他被定义在你的类还是超类中。</p><h3 id="在普通类上使用-autovalue" tabindex="-1">在<strong>普通类</strong>上使用 AutoValue？ <a class="header-anchor" href="#在普通类上使用-autovalue" aria-label="Permalink to &quot;在**普通类**上使用 AutoValue？&quot;">​</a></h3><blockquote><p>There&#39;s nothing to it: just add type parameters to your class and to your call to the generated constructor.</p></blockquote><p>没有什么不可以：只需要在你的类和生成的构造器中上添加类型参数 ###使我的类实现 Java 或者 GWT<strong>序列化</strong>？ 只需要让你的类添加<code>implements Serializable</code>或者<code>@GwtCompatible(serializable = true)</code>注解（分别）；这些信息（包括<code>serialVersionUID</code>）都会复制到生成类中。</p><h3 id="在生成的字段上面添加注解" tabindex="-1">在生成的字段上面添加注解？ <a class="header-anchor" href="#在生成的字段上面添加注解" aria-label="Permalink to &quot;在生成的字段上面添加注解？&quot;">​</a></h3><p>目前还不支持；然而你抽象访问器上面的注解同样会出现在 AutoValue 生成的实现类上。</p><h3 id="让-autovalue-实现注解类型" tabindex="-1">让 AutoValue 实现<strong>注解类型</strong>？ <a class="header-anchor" href="#让-autovalue-实现注解类型" aria-label="Permalink to &quot;让 AutoValue 实现**注解类型**？&quot;">​</a></h3><p>大部分的用户都应该不需要通过编程生成假的注解实例，但是如果你有，使用<code>@AutoValue</code>将导致失败，因为<code>Annocation.hashCode</code>的规范和 AutoValue 的行为不兼容。 然而，我们无论如何也会满足你！假如注解是这样定义的：</p><pre><code>public @interface Named {
    String value();
}
</code></pre><p>你需要做的只是这些：</p><pre><code>public class Names {
    @AutoAnnatation public static Named named(String value) {
        return new AutoAnnotaion_Name_named(value);
    }
}
</code></pre><p>查看<a href="http://github.com/google/auto/blob/master/value/src/main/java/com/google/auto/value/AutoAnnotation.java#L24" target="_blank" rel="noreferrer">AutoAnnotation javadoc</a>获取更多细节</p><h3 id="包含setter-突变-方法" tabindex="-1">包含<strong>setter</strong>（突变）方法？ <a class="header-anchor" href="#包含setter-突变-方法" aria-label="Permalink to &quot;包含**setter**（突变）方法？&quot;">​</a></h3><p>不可以；AutoValue 只生成不可变 value class；</p><blockquote><p>Note that giving value semantics to a mutable type is widely considered a questionable practice in the first place. Equal instances of a value class are treated as <em>interchangeable</em>, but they can&#39;t truly be interchangeable if one might be mutated and the other not.</p></blockquote><h3 id="生成compareto" tabindex="-1">生成<strong>compareTo</strong>？ <a class="header-anchor" href="#生成compareto" aria-label="Permalink to &quot;生成**compareTo**？&quot;">​</a></h3><p>AutoValue 有意不支持这个特性。使用 Java8 添加的<a href="https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html" target="_blank" rel="noreferrer">Comparator </a>方法或者<a href="http://github.com/google/guava" target="_blank" rel="noreferrer">Guava</a>的<a href="http://google.github.io/guava/releases/snapshot/api/docs/com/google/common/collect/ComparisonChain.html" target="_blank" rel="noreferrer">ComparisonChain </a>方法根据实际的比较逻辑来实现会更好。</p><p>因为这些机制更易用，代码量小，更灵活，所以 AutoValue 没有必要提供。</p><h3 id="使用原始数组做为属性的值" tabindex="-1">使用<strong>原始数组</strong>做为属性的值？ <a class="header-anchor" href="#使用原始数组做为属性的值" aria-label="Permalink to &quot;使用**原始数组**做为属性的值？&quot;">​</a></h3><p>请便！AutoValue 会生成代码作用于存储在数组中的值，而不是数组对象本身，这正式你所需要的。注意  <a href="https://github.com/google/auto/blob/master/value/userguide/howto.md#mutable_property" target="_blank" rel="noreferrer">mutable properties</a>.给出的警告信息。</p><h3 id="使用object-数组做为属性的值" tabindex="-1">使用<strong>Object 数组</strong>做为属性的值？ <a class="header-anchor" href="#使用object-数组做为属性的值" aria-label="Permalink to &quot;使用**Object 数组**做为属性的值？&quot;">​</a></h3><p>这是不允许的，Object 数表现很差不像原始数组，它不能被一个恰当的<code>List</code>实现用较少的代码替换。</p><p>在构造期访问访问 Object 数表是很重要的，参考<a href="https://github.com/google/auto/blob/master/value/userguide/howto.md#mutable_property" target="_blank" rel="noreferrer">这里</a>的第一个例子。</p><h3 id="使一个-autovalue-类继承另外一个" tabindex="-1">使一个@AutoValue 类<strong>继承</strong>另外一个？ <a class="header-anchor" href="#使一个-autovalue-类继承另外一个" aria-label="Permalink to &quot;使一个@AutoValue 类**继承**另外一个？&quot;">​</a></h3><p>这个特性是有意不支持的，因为没有正确的实现方法。参看  <em>Effective Java, 2nd Edition</em> Item 8。</p><h3 id="使访问器方法private" tabindex="-1">使访问器方法<strong>private</strong>？ <a class="header-anchor" href="#使访问器方法private" aria-label="Permalink to &quot;使访问器方法**private**？&quot;">​</a></h3><p>sorry！这是 AutoValue 几个不常见的限制你的 API 的方式之一。你的访问器方法可以不是 public 的但至少要是包访问权限的。</p><h3 id="暴露一个构造器而不是工厂方法作为创建的-api" tabindex="-1">暴露一个<strong>构造器</strong>而不是工厂方法作为创建的 API？ <a class="header-anchor" href="#暴露一个构造器而不是工厂方法作为创建的-api" aria-label="Permalink to &quot;暴露一个**构造器**而不是工厂方法作为创建的 API？&quot;">​</a></h3><p>sorry！这是 AutoValue 几个不常见的限制你的 API 的方式之一。然而<em>Effective Java</em>, Item 1 相对于公共构造器更推荐静态工厂方法。</p><h3 id="在接口上使用-autovalue-而不是抽象类" tabindex="-1">在接口上使用 AutoValue 而不是抽象类？ <a class="header-anchor" href="#在接口上使用-autovalue-而不是抽象类" aria-label="Permalink to &quot;在接口上使用 AutoValue 而不是抽象类？&quot;">​</a></h3><p>接口是不允许的，我们意识到接口的唯一好处就是你可以不用写<code>public abstract</code>。仅此而已，另一方面你将不能保证不可变性，而且会导致坏的行为（描述在<a href="https://github.com/google/auto/blob/master/value/userguide/practices.md#simple" target="_blank" rel="noreferrer">最佳实践</a>）。总的来说，我们认为这是不值得的。</p>`,84),n=[l];function u(i,s,c,d,p,h){return a(),t("div",null,n)}const m=e(r,[["render",u]]);export{b as __pageData,m as default};
