import{_ as e,o as t,c as a,U as r}from"./chunks/framework.70292381.js";const g=JSON.parse('{"title":"合理的使用Http Cache","description":"","frontmatter":{"title":"合理的使用Http Cache","date":"2016-08-11T12:00:00.000Z","categories":["Android"],"tags":["Http"]},"headers":[],"relativePath":"posts/2016-08-11-合理的使用Http_Cache.md","filePath":"posts/2016-08-11-合理的使用Http_Cache.md"}'),o={name:"posts/2016-08-11-合理的使用Http_Cache.md"},n=r(`<h5 id="啰嗦一下" tabindex="-1">啰嗦一下 <a class="header-anchor" href="#啰嗦一下" aria-label="Permalink to &quot;啰嗦一下&quot;">​</a></h5><p>正在做一个关于天气的小项目，使用的是百度的公共<a href="http://apistore.baidu.com/apiworks/servicedetail/478.html" target="_blank" rel="noreferrer">API 接口</a>（接口调用限制 6000/次），其实就是<a href="http://www.heweather.com/documents/api" target="_blank" rel="noreferrer">和风天气</a>（接口调用限制 3000/次）。为了节约访问次数（我知道并不用这么做）考虑到使用缓存，于是就有了两种选择：</p><ul><li>将网络请求转换成本地实体，然后进行持久化。需要解决的问题：需要判断数据的有效性</li><li>使用 http cache 进行缓存，问题：需要服务器返回相应的 cache 字段</li></ul><p>当然我选了第二种，因为使用了<a href="https://github.com/square/okhttp" target="_blank" rel="noreferrer">Okhttp</a>支持设置缓存，又可以通过 Interceptor 修改返回的 response（是的这两个 api 的返回都没有添加 cache）。</p><h3 id="复习一下-http-的缓存" tabindex="-1">复习一下 HTTP 的缓存 <a class="header-anchor" href="#复习一下-http-的缓存" aria-label="Permalink to &quot;复习一下 HTTP 的缓存&quot;">​</a></h3><p>科学上网的同学直接阅读<a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn" target="_blank" rel="noreferrer">HTTP 缓存</a></p><h5 id="两个字段" tabindex="-1">两个字段 <a class="header-anchor" href="#两个字段" aria-label="Permalink to &quot;两个字段&quot;">​</a></h5><ul><li>Cache-Control 用于缓存控制</li><li>ETag 用于校验资源是否过期</li></ul><h5 id="cache-control-字段的值" tabindex="-1">Cache-Control 字段的值 <a class="header-anchor" href="#cache-control-字段的值" aria-label="Permalink to &quot;Cache-Control 字段的值&quot;">​</a></h5><ul><li>no-cache  和  no-store no-cache 表示必须先与服务器确认返回的响应是否被更改，然后才能使用该响应来满足后续对同一个网址的请求。因此，如果存在合适的验证令牌 (ETag)，no-cache 会发起往返通信来验证缓存的响应，如果资源未被更改，可以避免下载。 相比之下，no-store 更加简单，直接禁止浏览器和所有中继缓存存储返回的任何版本的响应 - 例如：一个包含个人隐私数据或银行数据的响应。每次用户请求该资源时，都会向服务器发送一个请求，每次都会下载完整的响应。</li></ul><p><img src="http://upload-images.jianshu.io/upload_images/1419533-f535efd5c89a98ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="no-cache.png"></p><ul><li><p>public 和  private 如果响应被标记为 public，即使有关联的 HTTP 认证，甚至响应状态码无法正常缓存，响应也可以被缓存。大多数情况下，public 不是必须的，因为明确的缓存信息（例如 max-age）已表示 响应可以被缓存。 相比之下，浏览器可以缓存 private 响应，但是通常只为单个用户缓存，因此，不允许任何中继缓存对其进行缓存 - 例如，用户浏览器可以缓存包含用户私人信息的 HTML 网页，但是 CDN 不能缓存。</p></li><li><p>max-age 该指令指定从当前请求开始，允许获取的响应被重用的最长时间（单位为秒） - 例如：max-age=60 表示响应可以再缓存和重用 60 秒。</p></li></ul><p>拿图片来解释一下： <img src="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/images/http-request.png" alt="第一次请求服务器"> 这是客户端的第一次请求，可以看到服务器的返回头里面 Cache-Control 字段为 mac-age=120，ETag 为 x234dff。如果客户端在 120 秒内再次请求这个资源，会直接读取缓存的数据而不是请求服务器（这一步是浏览器自动处理的）。 <img src="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/images/http-cache-control.png" alt="第二次请求服务器"> 如果客户端在 120 后请求这个资源并携带上一次返回的 ETag 的话，服务器会通过这个 ETag 检查资源是否更新如果更新返回新的资源，如果没有更新返回 304，表示资源没有过期，就像上面图片那样。表示可以继续使用 cache 的资源并且在 120 秒内这个资源是有效的。 ####编码 首先写一个修改 response 的 Interceptor</p><pre><code>import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class CacheInterceptor implements Interceptor{
    @Override
    public Response intercept(Chain chain) throws IOException {
            Request originRequest = chain.request();
            Request.Builder request = originRequest.newBuilder();
            Response response = chain.proceed(request.build());
            return response.newBuilder()
                          .removeHeader(&quot;Cache-Control&quot;)
                          .header(&quot;Cache-Control&quot;, &quot;public, max-age=5400&quot;)//1.5*60*60 一个半小时
                          .build();
    }
}
</code></pre><p>然后设置 okhttpClient 的 cache 和 Interceptor</p><pre><code>public OkHttpClient provideClient(File cacheDir, CacheInterceptor interceptor){
        final OkHttpClient.Builder okHttpBuilder = new OkHttpClient.Builder();
        Cache cache = new Cache(cacheDir, 20*1024*1024);
        okHttpBuilder.cache(cache);
        okHttpBuilder.interceptors().add(interceptor);
        return okHttpBuilder.build();
}
</code></pre>`,16),c=[n];function i(p,l,h,s,u,d){return t(),a("div",null,c)}const _=e(o,[["render",i]]);export{g as __pageData,_ as default};
