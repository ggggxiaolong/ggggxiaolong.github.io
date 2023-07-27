import{_ as e,o as t,c as n,U as o}from"./chunks/framework.70292381.js";const g=JSON.parse('{"title":"Okhttp Interceptions","description":"","frontmatter":{"title":"Okhttp Interceptions","date":"2016-06-02T12:00:00.000Z","categories":["Android"],"tags":["Okhttp"]},"headers":[],"relativePath":"posts/2016-06-02-Okhttp_Interceptors.md","filePath":"posts/2016-06-02-Okhttp_Interceptors.md"}'),r={name:"posts/2016-06-02-Okhttp_Interceptors.md"},c=o(`<p>拦截器是很有用的机制，它可以监控，改写，和重试call。下面的例子展示了通过拦截器打印request，response的日志。</p><pre><code>class LoggingInterceptor implements Interceptor {
    @Override public Response interceptor (Interceptor.Chain chain) throws IOException {
        Request request = chain.request();

        long t1 = System.nanoTime();
        Logger.info(String.format(&quot;Sending request %s on %s%n%s&quot;,
            request.url(), chain.connection(), request.headers()));

        Response response = chain.proceed(request);

        long t2 = System.nanoTime();
        Logger.info(String.format(&quot;Received response for %s in %.1fms%n%s&quot;,
            response.request().url(), (t2 - t1) / 1e6d, response.Headers()));
        return response;
    }
}
</code></pre><p>对每个拦截器的实现来说<code>chain.proceed(request)</code>都是重要的部分，这个看起来简单的方法保证了HTTP的工作。产生一个request的response。</p><p>拦截器可以被链接。假设你有一个压缩拦截器和一个校验拦截器：你可以决定先压缩后校验，还是先校验在压缩。OkHttp通过list跟踪拦截器，并按照顺序调用。 <img src="https://raw.githubusercontent.com/wiki/square/okhttp/interceptors@2x.png" alt="拦截器工作图"> ###Application Interceptors 拦截器既可以作为应用拦截器也可以作为网络拦截器。我们将使用上面定义的<code>LoggingInterceptor</code>展示他们的不同。</p><p>通过调用<code>addInterceptor()</code>在<code>OkHttpClient.Builder</code>上添加一个应用拦截器：</p><pre><code>OkHttpClient client = new OkHttpClient.Builder()
    .addInterceptor(new LoggingInterceptor())
    .build();

Request request = new Request.Builder()
    .url(&quot;http://www.publicobject.com/helloworld.txt&quot;)
    .header(&quot;User-Agent&quot;, &quot;okHttp Example&quot;)
    .build();

Response response = client.newCall(request).execute();
response.body().close();
</code></pre><p>URL <code><a href="http://www.publicobject.com/helloworld.txt" target="_blank" rel="noreferrer">http://www.publicobject.com/helloworld.txt</a></code> 将被重定向到 <code><a href="https://www.publicobject.com/helloworld.txt" target="_blank" rel="noreferrer">https://www.publicobject.com/helloworld.txt</a></code>, OkHttp 将自动重定向。我们的应用拦截器只调用了<strong>一次</strong>而且<code>chain.proceed()</code>返回的是最终的response。</p><pre><code>INFO: Sending request http://www.publicobject.com/helloworld.txt on null
User-Agent: OkHttp Example

INFO: Received response for https://publicobject.com/helloworld.txt in 1179.7ms
Server: nginx/1.4.6 (Ubuntu)
Content-Type: text/plain
Content-Length: 1759
Connection: keep-alive
</code></pre><p>可以看到重定向发生了 因为请求的地址和响应的地址不同，这两个日志展示了两个不同的URL ###Network Interceptors 注册一个网络过滤器也大致相同，通过<code>addNetWorkInterceptor()</code>方法而不是<code>addInterceptor()</code>:</p><pre><code>OkHttpClient client = new OkHttpClient.Builder()
    .addNetWorkInterceptor(new LoggingInterceptor())
    .build();

Request request = new Request.Builder()
    .url(&quot;http://www.publicobject.com/helloworld.txt&quot;)
    .header(&quot;User-Agent&quot;, &quot;okHttp Example&quot;)
    .build();

Response response = client.newCall(request).execute();
response.body().close();
</code></pre><p>当我们运行这段代码的时候这个拦截器将运行两次。一次是初始request <code><a href="http://www.publicobject.com/helloworld.txt" target="_blank" rel="noreferrer">http://www.publicobject.com/helloworld.txt</a></code>， 另一次是重定向 <code><a href="https://www.publicobject.com/helloworld.txt" target="_blank" rel="noreferrer">https://www.publicobject.com/helloworld.txt</a></code></p><pre><code>INFO: Sending request http://www.publicobject.com/helloworld.txt on Connection{www.publicobject.com:80, proxy=DIRECT hostAddress=54.187.32.157 cipherSuite=none protocol=http/1.1}
User-Agent: OkHttp Example
Host: www.publicobject.com
Connection: Keep-Alive
Accept-Encoding: gzip

INFO: Received response for http://www.publicobject.com/helloworld.txt in 115.6ms
Server: nginx/1.4.6 (Ubuntu)
Content-Type: text/html
Content-Length: 193
Connection: keep-alive
Location: https://publicobject.com/helloworld.txt

INFO: Sending request https://publicobject.com/helloworld.txt on Connection{publicobject.com:443, proxy=DIRECT hostAddress=54.187.32.157 cipherSuite=TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA protocol=http/1.1}
User-Agent: OkHttp Example
Host: publicobject.com
Connection: Keep-Alive
Accept-Encoding: gzip

INFO: Received response for https://publicobject.com/helloworld.txt in 80.9ms
Server: nginx/1.4.6 (Ubuntu)
Content-Type: text/plain
Content-Length: 1759
Connection: keep-alive
</code></pre><p>网络请求包含更多的数据。例如OkHttp添加<code>Accept-Encoding: gzip</code>头告知服务器支持response压缩。网络拦截器的<code>Chain</code>包含一个非空<code>Connection</code>可以用于询问用于连接服务器的IP地址和TLS配置。 ###Choosing between application and network interceptors 每个拦截器都有自己的长处： #####应用拦截器</p><ul><li>不必担心中间的response像重定向和重试</li><li>只会被调用一次，包括从缓存取出的response</li><li>观察应用的最初意图，不关心OkHttp注入的类似<code>If-None-Match</code>头。</li><li>允许短路并且不调用<code>Chain.proceed()</code></li><li>允许重试并且重复调用<code>Chain.proceed()</code></li></ul><p>#####网络拦截器</p><ul><li>能够操作中间的response像重定向和重试</li><li>缓存的response将短路网络，此时不掉用拦截器</li><li>观察整个网络传输的数据</li><li>访问带有request的<code>Connection</code></li></ul><p>###Rewriting Requests 拦截器可以添加，删除或替换请求头，也可以转换那些包含体的请求。例如你可以在服务器支持的情况下使用应用拦截器压缩请求体。</p><pre><code>/** This interceptor compresses the HTTP request body. Many Webservers can&#39;t handle this! */
final class GzipRequestInterceptor implements Interceptor {
    @Override public Response interceptor(Interceptor.Chain chain) thorws IOException {
        Request originalRequest = chain.request();
        if (originalRequest.body() == null || originalRequest.header(&quot;Content-Encoding&quot;)) {
          return chain.proceed(originalRequest);
        }

        Request comressedRequest = originalRequest.newBuilder()
            .header(&quot;Content-Encoding&quot;, &quot;gzip&quot;)
            .method(originalRequest.method(), gzip(originalRequest.body()))
            .build();
        return chain.proceed(compressedRequest);
    }

    private RequestBody gzip(final RequestBody body) {
        return new RequestBody() {
            @Override public MediaType contentType() {
                return body.contentType();
            }
            @Override public long contentLength() {
                return -1; // We don&#39;t know the compressed length in adcance!
            }
            @Override public void wirteTo(BufferedSink sink) throws IOException {
                BufferedSink gzipSink = Okio.buffer(new GzipSink(sink));
                body.writeTo(gzipSink);
                gzipSink.close();
            }
        };
    }
}
</code></pre><p>###Rewriting Responses 对应的，拦截器可以重写响应头，转换响应体。一般来说这比重写请求头危险的因为这可能改变了服务器的意愿。</p><p>如果你有一个棘手的情况必须处理结果，重写响应头是解决问题的有力方法。例如你可以通过修复服务器丢失的<code>Cache-Control</code>响应头来保证更好的response缓存。</p><pre><code>/** Dangerous interceptor that rewrites the server&#39;s cache-control header. */
private static final Interceptor REWRITE_CACHE_CONTROL_INTERCEPTOR =
    new Interceptor() {
        @Override public Response intercept(Interceptor.Chain chain) throws IOException {
            Response originalResponse = chain.proceed(chain.request());
            return originalResponse.newBuilder()
                .header(&quot;Cache-Control&quot;, &quot;max-age=60&quot;)
                .build();
    }
};
</code></pre><p>一般来讲对服务器完成对应的补充这中方式最有效。 ###Availability OkHttp的拦截器需要版本在2.2以上，不幸的是拦截器对<code>OkUrlFactory</code>无效。有些库构建在OkHttp之上包括<a href="http://square.github.io/retrofit/" target="_blank" rel="noreferrer">Retrofit</a> ≤ 1.8 和 <a href="http://square.github.io/picasso/" target="_blank" rel="noreferrer">Picasso</a> ≤ 2.4。</p>`,22),i=[c];function p(s,l,d,u,a,h){return t(),n("div",null,i)}const b=e(r,[["render",p]]);export{g as __pageData,b as default};
