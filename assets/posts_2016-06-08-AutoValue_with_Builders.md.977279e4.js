import{_ as e,o as a,c as t,U as o}from"./chunks/framework.70292381.js";const g=JSON.parse('{"title":"AutoValue With Builder","description":"","frontmatter":{"title":"AutoValue With Builder","date":"2016-06-08T12:00:00.000Z","categories":["Android"],"tags":["AutoValue"]},"headers":[],"relativePath":"posts/2016-06-08-AutoValue_with_Builders.md","filePath":"posts/2016-06-08-AutoValue_with_Builders.md"}'),l={name:"posts/2016-06-08-AutoValue_with_Builders.md"},r=o(`<p><a href="https://github.com/google/auto/blob/master/value/userguide/builders.md" target="_blank" rel="noreferrer">原文</a></p><h3 id="autovalue-的-构建者" tabindex="-1">AutoValue 的 构建者 <a class="header-anchor" href="#autovalue-的-构建者" aria-label="Permalink to &quot;AutoValue 的 构建者&quot;">​</a></h3><hr><p><a href="https://github.com/google/auto/blob/master/value/userguide/index.md" target="_blank" rel="noreferrer">AutoValue 的介绍</a>   (<a href="http://www.jianshu.com/p/d52d98cd6f6c" target="_blank" rel="noreferrer">简单翻译</a>)中已经包含了基本的使用，使用静态工厂作为你的公共 API。但是在大部分情况（such as those laid out in <em>Effective Java, 2nd Edition</em> Item 2），你可能更倾向于让你的调用者使用一个构建者生成实例对象。</p><p>幸运的是，AutoValue 可以也可以生成带有构建者的类。这一页介绍了怎么做。但是我们还是建议你先阅读并理解 AutoValue 的基本使用，<a href="https://github.com/google/auto/blob/master/value/userguide/index.md" target="_blank" rel="noreferrer">AutoValue 的介绍</a> 。</p><h3 id="怎么使用带有构建者的-autovalue" tabindex="-1">怎么使用带有构建者的 AutoValue <a class="header-anchor" href="#怎么使用带有构建者的-autovalue" aria-label="Permalink to &quot;怎么使用带有构建者的 AutoValue&quot;">​</a></h3><hr><p>就像在介绍里面说的那样，AutoValue 的概念就是<strong>写一个抽象的 value class，AutoValue 实现它</strong>。构建者的生成也是一样的方法：制造一个抽象的构造者类，并把它包含在抽象类里面，然后 AutoValue 就会生成他们的实现。</p><h4 id="在animal-java中" tabindex="-1">在<code>Animal.java</code>中 <a class="header-anchor" href="#在animal-java中" aria-label="Permalink to &quot;在&lt;code&gt;Animal.java&lt;/code&gt;中&quot;">​</a></h4><pre><code>import com.google.auto.value.AutoValue;

@AutoValue
abstract class Animal {
    abstract String name();
    abstract int numberOfLegs();
</code></pre><p>@ static Builder builder() { return new AutoValue_Animal.Builder(); }</p><pre><code>    @AutoValue.Builder
    abstract static class Builder {
        abstract Builder name(String value);
        abstract Builder numberOfLegs(int value);
        abstract Animal build();
    }
}
</code></pre><p>在实际应用中，一些类和方法可能是 public 的并且带有<strong>Javadoc</strong>，为了保证例子的简洁我们去掉了这些。</p><h4 id="使用" tabindex="-1">使用 <a class="header-anchor" href="#使用" aria-label="Permalink to &quot;使用&quot;">​</a></h4><pre><code>public void testAnimal() {
    Animal dog = Animal.builder().name(&quot;dog&quot;).numberOfLegs(4).build();
    assertEquals(&quot;dog&quot;, dog.name());
    assertEquals(4, dog.numberOfLegs());

    //You probably don&#39;t need to write assertions like; just illustrating.
    assertTrue(Animal.builder().name(&quot;dog&quot;).numberogLegs(4).build().equals(dog));
    assertFalse(Animal.builder().name(&quot;cat&quot;).numberogLegs(4).build().equals(dog));
    assertFalse(Animal.builder().name(&quot;dog&quot;).numberogLegs(2).build().equals(dog));

    assertEquals(&quot;Animal{name=dog, numberOfLegs=4}&quot;, dog.toString());
}
</code></pre><p><a href="https://github.com/google/auto/blob/master/value/userguide/generated-builder-example.md" target="_blank" rel="noreferrer">AutoValue 生成的代码</a></p><h4 id="警告" tabindex="-1">警告 <a class="header-anchor" href="#警告" aria-label="Permalink to &quot;警告&quot;">​</a></h4><hr><p>确保把这个静态<code>builder()</code>方法直接放在你的 value class 内部（e.g.,<code>Animal</code>），而不是内部抽象<code>Builder</code>类。确保这个<code>Animal</code>类在<code>Builder</code>之前初始化。否则你可能遇到初始化顺序问题。</p><h4 id="我怎么-简单翻译-原文" tabindex="-1">我怎么...   <a href="http://www.jianshu.com/p/0bb889781ac2" target="_blank" rel="noreferrer">简单翻译</a>/   <a href="https://github.com/google/auto/blob/master/value/userguide/builders-howto.md" target="_blank" rel="noreferrer">原文</a> <a class="header-anchor" href="#我怎么-简单翻译-原文" aria-label="Permalink to &quot;我怎么... &amp;nbsp; [简单翻译](http://www.jianshu.com/p/0bb889781ac2)/ &amp;nbsp; [原文](https://github.com/google/auto/blob/master/value/userguide/builders-howto.md)&quot;">​</a></h4><hr><ul><li>...使用（或不使用）<code>set</code>前缀？</li><li>...使用不同<strong>命名</strong>除了<code>builder()</code>/<code>Builder</code><code>build()</code>?</li><li>...为一个属性制定默认值？</li><li>...使用一个现有的 value 实例的值初始化一个构建者？</li><li>...在 value class 内部包含<code>with-</code>方法，来生成一个略微修改的实例？</li><li>...验证属性的值？</li><li>...在构建时正常化（修改）属性的值？</li><li>...同时暴露构造器和工厂方法？</li><li>...处理<code>Optional</code>属性？</li><li>...使用一个集合属性？</li><li>...让构建者累积一个集合属性的值（而不是一次全部给出）？</li><li>...在不打破链式调用的前提下累积集合的值？</li><li>...对于同一个集合属性提供设置值的两种方式（一次性提供和累积提供）？</li></ul>`,22),u=[r];function i(n,d,s,c,b,h){return a(),t("div",null,u)}const p=e(l,[["render",i]]);export{g as __pageData,p as default};
